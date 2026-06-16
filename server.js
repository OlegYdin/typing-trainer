const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'OlegYdin';

app.use(express.json({ limit: '2mb' }));
app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/api/stats', async (req, res) => {
  const s = await getStorage();
  const d = s._raw ? s._raw() : s.data;
  res.json({ visits: d.visits || 0, users: (d.users || []).length });
});

function hashPhrase(p) { return crypto.createHash('sha256').update(p).digest('hex'); }
function generateToken() { return crypto.randomBytes(32).toString('hex'); }

// --- Storage layer ---
let storage;

async function getStorage() {
  if (storage) return storage;

  if (process.env.S3_BUCKET && process.env.S3_ENDPOINT &&
      process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY) {
    try {
      storage = createS3Storage();
      await storage.init();
      console.log('Using S3 storage:', process.env.S3_BUCKET);
      return storage;
    } catch (e) {
      console.log('S3 unavailable, falling back to JSON:', e.message);
    }
  }

  storage = createJsonStorage();
  await storage.init();
  return storage;
}

// ---- S3 storage ----
function createS3Storage() {
  const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
  const BUCKET = process.env.S3_BUCKET;
  const KEY = 'typing-data.json';

  const client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || 'ru-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
  });

  async function s3Load() {
    try {
      const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: KEY });
      const resp = await client.send(cmd);
      const body = await resp.Body.transformToString('utf8');
      return JSON.parse(body);
    } catch (e) {
      if (e.name === 'NoSuchKey') return null;
      throw e;
    }
  }

  async function s3Save(d) {
    const cmd = new PutObjectCommand({
      Bucket: BUCKET, Key: KEY,
      Body: JSON.stringify(d),
      ContentType: 'application/json',
    });
    await client.send(cmd);
  }

  let data;

  return {
    async init() {
      data = await s3Load() || { users: [], sessions: [], progress: [], leaderboard: [], suggestions: [], comments: [], visits: 0 };
    },
    async _save() {
      await s3Save(data);
    },
    async register(username, phrase, display_name) {
      if (data.users.find(u => u.username === username)) return { error: 'Username already taken' };
      const id = data.users.length + 1;
      data.users.push({ id, username, phrase_hash: hashPhrase(phrase), display_name: display_name || username, created_at: new Date().toISOString() });
      const token = generateToken();
      data.sessions.push({ token, user_id: id, created_at: new Date().toISOString() });
      await s3Save(data);
      return { token, user_id: id, display_name: display_name || username };
    },
    async login(username, phrase) {
      const u = data.users.find(u => u.username === username && u.phrase_hash === hashPhrase(phrase));
      if (!u) return { error: 'Invalid username or phrase' };
      const token = generateToken();
      data.sessions.push({ token, user_id: u.id, created_at: new Date().toISOString() });
      await s3Save(data);
      return { token, user_id: u.id, display_name: u.display_name };
    },
    async getUserFromToken(token) {
      if (!token) return null;
      const s = data.sessions.find(s => s.token === token);
      if (!s) return null;
      const u = data.users.find(u => u.id === s.user_id);
      return u ? { user_id: u.id, username: u.username, display_name: u.display_name } : null;
    },
    async saveProgress(user_id, language, d) {
      const idx = data.progress.findIndex(p => p.user_id === user_id && p.language === language);
      const entry = { user_id, language, data: JSON.stringify(d), updated_at: new Date().toISOString() };
      if (idx >= 0) data.progress[idx] = entry; else data.progress.push(entry);
      await s3Save(data);
      return { ok: true };
    },
    async loadProgress(user_id) {
      const rows = data.progress.filter(p => p.user_id === user_id);
      const progress = {};
      for (const row of rows) { try { progress[row.language] = JSON.parse(row.data); } catch (e) { progress[row.language] = null; } }
      return progress;
    },
    async submitLeaderboard(user_id, display_name, language, speed, accuracy, total_chars, difficulty) {
      const d = difficulty || 0;
      const idx = data.leaderboard.findIndex(e => e.user_id === user_id && e.language === language && e.difficulty === d);
      if (idx >= 0) {
        if (speed <= data.leaderboard[idx].speed) return { ok: true };
        data.leaderboard[idx] = { user_id, display_name, language, speed, accuracy: accuracy || 0, total_chars: total_chars || 0, difficulty: d, created_at: new Date().toISOString() };
      } else {
        data.leaderboard.push({ user_id, display_name, language, speed, accuracy: accuracy || 0, total_chars: total_chars || 0, difficulty: d, created_at: new Date().toISOString() });
      }
      await s3Save(data);
      return { ok: true };
    },
    async getLeaderboard(lang, difficulty) {
      let rows = data.leaderboard;
      if (lang) rows = rows.filter(r => r.language === lang);
      if (difficulty !== undefined && difficulty !== null) rows = rows.filter(r => (r.difficulty || 0) === Number(difficulty));
      rows.sort((a, b) => b.speed - a.speed || b.accuracy - a.accuracy);
      return rows.slice(0, 100);
    },
    async getSuggestions(user_id) {
      const result = (data.suggestions || []).map(s => ({
        ...s, votes: s.votes?.length || 0, user_voted: user_id ? (s.votes || []).includes(Number(user_id)) : false
      }));
      result.sort((a, b) => b.votes - a.votes || new Date(b.created_at) - new Date(a.created_at));
      return result;
    },
    async createSuggestion(user_id, display_name, title, description) {
      if (!data.suggestions) data.suggestions = [];
      data.suggestions.push({
        id: data.suggestions.length + 1, user_id, display_name, title, description: description || '', votes: [], comments: 0, created_at: new Date().toISOString()
      });
      await s3Save(data);
      return { id: data.suggestions.length, ok: true };
    },
    async editSuggestion(id, user_id, title, description) {
      const s = (data.suggestions || []).find(s => s.id === id);
      if (!s) return { error: 'Not found' };
      if (s.user_id !== user_id) return { error: 'Forbidden' };
      if (title !== undefined) s.title = title;
      if (description !== undefined) s.description = description;
      await s3Save(data);
      return { ok: true };
    },
    async deleteSuggestion(id, username) {
      if (username !== ADMIN_USERNAME) return { error: 'Forbidden' };
      const s = (data.suggestions || []).find(s => s.id === id);
      if (!s) return { error: 'Not found' };
      data.suggestions = (data.suggestions || []).filter(x => x.id !== id);
      data.comments = (data.comments || []).filter(c => c.suggestion_id !== id);
      await s3Save(data);
      return { ok: true };
    },
    async voteSuggestion(id, user_id) {
      const s = (data.suggestions || []).find(s => s.id === id);
      if (!s) return { error: 'Not found' };
      if (!s.votes) s.votes = [];
      const idx = s.votes.indexOf(user_id);
      if (idx >= 0) s.votes.splice(idx, 1); else s.votes.push(user_id);
      await s3Save(data);
      return { ok: true, voted: idx < 0, votes: s.votes.length };
    },
    async getComments(suggestion_id) {
      return (data.comments || []).filter(c => c.suggestion_id === suggestion_id);
    },
    async createComment(suggestion_id, user_id, display_name, text) {
      if (!data.comments) data.comments = [];
      data.comments.push({
        id: data.comments.length + 1, suggestion_id, user_id, display_name, text, created_at: new Date().toISOString()
      });
      const s = (data.suggestions || []).find(s => s.id === suggestion_id);
      if (s) s.comments = (data.comments || []).filter(c => c.suggestion_id === s.id).length;
      await s3Save(data);
      return { id: data.comments.length, ok: true };
    },
    async editComment(suggestion_id, comment_id, user_id, text) {
      const c = (data.comments || []).find(c => c.id === comment_id && c.suggestion_id === suggestion_id);
      if (!c) return { error: 'Not found' };
      if (c.user_id !== user_id) return { error: 'Forbidden' };
      c.text = text;
      await s3Save(data);
      return { ok: true };
    },
    async deleteComment(suggestion_id, comment_id, username) {
      if (username !== ADMIN_USERNAME) return { error: 'Forbidden' };
      const c = (data.comments || []).find(c => c.id === comment_id && c.suggestion_id === suggestion_id);
      if (!c) return { error: 'Not found' };
      data.comments = (data.comments || []).filter(x => x.id !== comment_id);
      const s = (data.suggestions || []).find(s => s.id === suggestion_id);
      if (s) s.comments = (data.comments || []).filter(c => c.suggestion_id === s.id).length;
      await s3Save(data);
      return { ok: true };
    },
    _raw() { return data; }
  };
}

// ---- JSON file storage (fallback) ----
function createJsonStorage() {
  const tryDirs = [
    path.join(__dirname, 'data'),
    path.join(os.homedir(), 'typing-trainer-data'),
    path.join('/tmp', 'typing-trainer-data'),
  ];
  let dataPath;
  for (const dir of tryDirs) {
    try {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const p = path.join(dir, 'typing-data.json');
      fs.writeFileSync(p, JSON.stringify({ _test: true }), 'utf8');
      fs.unlinkSync(p);
      dataPath = p;
      console.log('JSON data path:', dir);
      break;
    } catch (e) { /* try next */ }
  }
  if (!dataPath) {
    dataPath = path.join(os.tmpdir(), 'typing-data.json');
    console.log('JSON data path (tmp):', os.tmpdir());
  }
  let data;
  return {
    init() {
      try { data = JSON.parse(fs.readFileSync(dataPath, 'utf8')); } catch (e) { data = { users: [], sessions: [], progress: [], leaderboard: [], suggestions: [], comments: [], visits: 0 }; }
    },
    register(username, phrase, display_name) {
      if (data.users.find(u => u.username === username)) return { error: 'Username already taken' };
      const id = data.users.length + 1;
      data.users.push({ id, username, phrase_hash: hashPhrase(phrase), display_name: display_name || username, created_at: new Date().toISOString() });
      const token = generateToken();
      data.sessions.push({ token, user_id: id, created_at: new Date().toISOString() });
      fs.writeFileSync(dataPath, JSON.stringify(data));
      return { token, user_id: id, display_name: display_name || username };
    },
    login(username, phrase) {
      const u = data.users.find(u => u.username === username && u.phrase_hash === hashPhrase(phrase));
      if (!u) return { error: 'Invalid username or phrase' };
      const token = generateToken();
      data.sessions.push({ token, user_id: u.id, created_at: new Date().toISOString() });
      fs.writeFileSync(dataPath, JSON.stringify(data));
      return { token, user_id: u.id, display_name: u.display_name };
    },
    getUserFromToken(token) {
      if (!token) return null;
      const s = data.sessions.find(s => s.token === token);
      if (!s) return null;
      const u = data.users.find(u => u.id === s.user_id);
      return u ? { user_id: u.id, username: u.username, display_name: u.display_name } : null;
    },
    saveProgress(user_id, language, d) {
      const idx = data.progress.findIndex(p => p.user_id === user_id && p.language === language);
      const entry = { user_id, language, data: JSON.stringify(d), updated_at: new Date().toISOString() };
      if (idx >= 0) data.progress[idx] = entry; else data.progress.push(entry);
      fs.writeFileSync(dataPath, JSON.stringify(data));
      return { ok: true };
    },
    loadProgress(user_id) {
      const rows = data.progress.filter(p => p.user_id === user_id);
      const progress = {};
      for (const row of rows) { try { progress[row.language] = JSON.parse(row.data); } catch (e) { progress[row.language] = null; } }
      return progress;
    },
    submitLeaderboard(user_id, display_name, language, speed, accuracy, total_chars, difficulty) {
      const d = difficulty || 0;
      const idx = data.leaderboard.findIndex(e => e.user_id === user_id && e.language === language && e.difficulty === d);
      if (idx >= 0) {
        if (speed <= data.leaderboard[idx].speed) return { ok: true };
        data.leaderboard[idx] = { user_id, display_name, language, speed, accuracy: accuracy || 0, total_chars: total_chars || 0, difficulty: d, created_at: new Date().toISOString() };
      } else {
        data.leaderboard.push({ user_id, display_name, language, speed, accuracy: accuracy || 0, total_chars: total_chars || 0, difficulty: d, created_at: new Date().toISOString() });
      }
      fs.writeFileSync(dataPath, JSON.stringify(data));
      return { ok: true };
    },
    getLeaderboard(lang, difficulty) {
      let rows = data.leaderboard;
      if (lang) rows = rows.filter(r => r.language === lang);
      if (difficulty !== undefined && difficulty !== null) rows = rows.filter(r => (r.difficulty || 0) === Number(difficulty));
      rows.sort((a, b) => b.speed - a.speed || b.accuracy - a.accuracy);
      return rows.slice(0, 100);
    },
    getSuggestions(user_id) {
      const result = (data.suggestions || []).map(s => ({
        ...s, votes: s.votes?.length || 0, user_voted: user_id ? (s.votes || []).includes(Number(user_id)) : false
      }));
      result.sort((a, b) => b.votes - a.votes || new Date(b.created_at) - new Date(a.created_at));
      return result;
    },
    createSuggestion(user_id, display_name, title, description) {
      if (!data.suggestions) data.suggestions = [];
      data.suggestions.push({
        id: data.suggestions.length + 1, user_id, display_name, title, description: description || '', votes: [], comments: 0, created_at: new Date().toISOString()
      });
      fs.writeFileSync(dataPath, JSON.stringify(data));
      return { id: data.suggestions.length, ok: true };
    },
    editSuggestion(id, user_id, title, description) {
      const s = (data.suggestions || []).find(s => s.id === id);
      if (!s) return { error: 'Not found' };
      if (s.user_id !== user_id) return { error: 'Forbidden' };
      if (title !== undefined) s.title = title;
      if (description !== undefined) s.description = description;
      fs.writeFileSync(dataPath, JSON.stringify(data));
      return { ok: true };
    },
    deleteSuggestion(id, username) {
      if (username !== ADMIN_USERNAME) return { error: 'Forbidden' };
      const s = (data.suggestions || []).find(s => s.id === id);
      if (!s) return { error: 'Not found' };
      data.suggestions = (data.suggestions || []).filter(x => x.id !== id);
      data.comments = (data.comments || []).filter(c => c.suggestion_id !== id);
      fs.writeFileSync(dataPath, JSON.stringify(data));
      return { ok: true };
    },
    voteSuggestion(id, user_id) {
      const s = (data.suggestions || []).find(s => s.id === id);
      if (!s) return { error: 'Not found' };
      if (!s.votes) s.votes = [];
      const idx = s.votes.indexOf(user_id);
      if (idx >= 0) s.votes.splice(idx, 1); else s.votes.push(user_id);
      fs.writeFileSync(dataPath, JSON.stringify(data));
      return { ok: true, voted: idx < 0, votes: s.votes.length };
    },
    getComments(suggestion_id) {
      return (data.comments || []).filter(c => c.suggestion_id === suggestion_id);
    },
    createComment(suggestion_id, user_id, display_name, text) {
      if (!data.comments) data.comments = [];
      data.comments.push({
        id: data.comments.length + 1, suggestion_id, user_id, display_name, text, created_at: new Date().toISOString()
      });
      const s = (data.suggestions || []).find(s => s.id === suggestion_id);
      if (s) s.comments = (data.comments || []).filter(c => c.suggestion_id === s.id).length;
      fs.writeFileSync(dataPath, JSON.stringify(data));
      return { id: data.comments.length, ok: true };
    },
    editComment(suggestion_id, comment_id, user_id, text) {
      const c = (data.comments || []).find(c => c.id === comment_id && c.suggestion_id === suggestion_id);
      if (!c) return { error: 'Not found' };
      if (c.user_id !== user_id) return { error: 'Forbidden' };
      c.text = text;
      fs.writeFileSync(dataPath, JSON.stringify(data));
      return { ok: true };
    },
    deleteComment(suggestion_id, comment_id, username) {
      if (username !== ADMIN_USERNAME) return { error: 'Forbidden' };
      const c = (data.comments || []).find(c => c.id === comment_id && c.suggestion_id === suggestion_id);
      if (!c) return { error: 'Not found' };
      data.comments = (data.comments || []).filter(x => x.id !== comment_id);
      const s = (data.suggestions || []).find(s => s.id === suggestion_id);
      if (s) s.comments = (data.comments || []).filter(c => c.suggestion_id === s.id).length;
      fs.writeFileSync(dataPath, JSON.stringify(data));
      return { ok: true };
    },
    _raw() { return data; }
  };
}

// ---- Route handlers ----
app.post('/api/register', async (req, res) => {
  const { username, phrase, display_name } = req.body;
  if (!username || !phrase) return res.json({ error: 'Username and phrase required' });
  const s = await getStorage();
  const r = await s.register(username, phrase, display_name);
  res.json(r);
});

app.post('/api/login', async (req, res) => {
  const { username, phrase } = req.body;
  if (!username || !phrase) return res.json({ error: 'Username and phrase required' });
  const s = await getStorage();
  const r = await s.login(username, phrase);
  res.json(r);
});

app.post('/api/save', async (req, res) => {
  const s = await getStorage();
  const user = await s.getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { language, data: d } = req.body;
  if (!language || !d) return res.json({ error: 'Language and data required' });
  const r = await s.saveProgress(user.user_id, language, d);
  res.json(r);
});

app.post('/api/load', async (req, res) => {
  const s = await getStorage();
  const user = await s.getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const progress = await s.loadProgress(user.user_id);
  res.json({ progress, display_name: user.display_name });
});

app.post('/api/leaderboard/submit', async (req, res) => {
  const st = await getStorage();
  const user = await st.getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { language, speed, accuracy, total_chars, difficulty } = req.body;
  if (!language || speed == null) return res.json({ error: 'Missing fields' });
  const r = await st.submitLeaderboard(user.user_id, user.display_name, language, speed, accuracy, total_chars, difficulty);
  res.json(r);
});

app.get('/api/leaderboard', async (req, res) => {
  const s = await getStorage();
  const rows = await s.getLeaderboard(req.query.lang || null, req.query.difficulty || null);
  res.json(rows);
});

app.get('/api/suggestions', async (req, res) => {
  const s = await getStorage();
  const rows = await s.getSuggestions(req.query.user_id ? Number(req.query.user_id) : null);
  res.json(rows);
});

app.post('/api/suggestions', async (req, res) => {
  const st = await getStorage();
  const user = await st.getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { title, description } = req.body;
  if (!title) return res.json({ error: 'Title required' });
  const r = await st.createSuggestion(user.user_id, user.display_name, title, description);
  res.json(r);
});

app.post('/api/suggestions/:id/vote', async (req, res) => {
  const st = await getStorage();
  const user = await st.getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const r = await st.voteSuggestion(Number(req.params.id), user.user_id);
  res.json(r);
});

app.get('/api/suggestions/:id/comments', async (req, res) => {
  const s = await getStorage();
  const comments = await s.getComments(Number(req.params.id));
  res.json(comments);
});

app.post('/api/suggestions/:id/comments', async (req, res) => {
  const st = await getStorage();
  const user = await st.getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { text } = req.body;
  if (!text) return res.json({ error: 'Text required' });
  const r = await st.createComment(Number(req.params.id), user.user_id, user.display_name, text);
  res.json(r);
});

app.post('/api/suggestions/:id/edit', async (req, res) => {
  const st = await getStorage();
  const user = await st.getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { title, description } = req.body;
  const r = await st.editSuggestion(Number(req.params.id), user.user_id, title, description);
  res.json(r);
});

app.post('/api/suggestions/:id/delete', async (req, res) => {
  const st = await getStorage();
  const user = await st.getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const r = await st.deleteSuggestion(Number(req.params.id), user.username);
  res.json(r);
});

app.post('/api/suggestions/:id/comments/:commentId/edit', async (req, res) => {
  const st = await getStorage();
  const user = await st.getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { text } = req.body;
  if (!text) return res.json({ error: 'Text required' });
  const r = await st.editComment(Number(req.params.id), Number(req.params.commentId), user.user_id, text);
  res.json(r);
});

app.post('/api/suggestions/:id/comments/:commentId/delete', async (req, res) => {
  const st = await getStorage();
  const user = await st.getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const r = await st.deleteComment(Number(req.params.id), Number(req.params.commentId), user.username);
  res.json(r);
});

app.get('/', async function (req, res, next) {
  try {
    const s = await getStorage();
    if (s._raw) {
      const d = s._raw();
      d.visits = (d.visits || 0) + 1;
      if (s._save) s._save().catch(function(){});
    }
  } catch(e) {}
  next();
});
app.use(express.static(__dirname));

// ---- Start ----
(async () => {
  await getStorage();
  app.listen(PORT, () => console.log('Server running on port ' + PORT));
})();
