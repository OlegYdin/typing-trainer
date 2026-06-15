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

function hashPhrase(p) { return crypto.createHash('sha256').update(p).digest('hex'); }
function generateToken() { return crypto.randomBytes(32).toString('hex'); }

// --- Storage layer ---
let storage;

const pgPoolPromise = (async () => {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
    await pool.query('SELECT 1');
    console.log('PostgreSQL connected');
    return pool;
  } catch (e) {
    console.log('PostgreSQL unavailable, falling back to JSON file:', e.message);
    return null;
  }
})();

async function getStorage() {
  if (storage) return storage;
  const pool = await pgPoolPromise;
  if (pool) {
    storage = createPgStorage(pool);
    await storage.init();
  } else {
    storage = createJsonStorage();
  }
  return storage;
}

// ---- PostgreSQL storage ----
function createPgStorage(pool) {
  async function q(text, params) {
    const r = await pool.query(text, params);
    return r;
  }
  return {
    async init() {
      await q(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          phrase_hash VARCHAR(64) NOT NULL,
          display_name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`);
      await q(`
        CREATE TABLE IF NOT EXISTS sessions (
          token VARCHAR(64) PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`);
      await q(`
        CREATE TABLE IF NOT EXISTS progress (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          language VARCHAR(50) NOT NULL,
          data TEXT NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, language)
        )`);
      await q(`
        CREATE TABLE IF NOT EXISTS leaderboard (
          id SERIAL PRIMARY KEY,
          display_name VARCHAR(255) NOT NULL,
          language VARCHAR(50) NOT NULL,
          speed REAL NOT NULL,
          accuracy REAL DEFAULT 0,
          total_chars INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`);
      await q(`
        CREATE TABLE IF NOT EXISTS suggestions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          display_name VARCHAR(255) NOT NULL,
          title TEXT NOT NULL,
          description TEXT DEFAULT '',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`);
      await q(`
        CREATE TABLE IF NOT EXISTS suggestion_votes (
          suggestion_id INTEGER NOT NULL REFERENCES suggestions(id) ON DELETE CASCADE,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          PRIMARY KEY (suggestion_id, user_id)
        )`);
      await q(`
        CREATE TABLE IF NOT EXISTS comments (
          id SERIAL PRIMARY KEY,
          suggestion_id INTEGER NOT NULL REFERENCES suggestions(id) ON DELETE CASCADE,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          display_name VARCHAR(255) NOT NULL,
          text TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`);
      console.log('Database tables ready');
    },
    async register(username, phrase, display_name) {
      const exists = await q('SELECT id FROM users WHERE username = $1', [username]);
      if (exists.rows.length) return { error: 'Username already taken' };
      const r = await q(
        'INSERT INTO users (username, phrase_hash, display_name) VALUES ($1, $2, $3) RETURNING id',
        [username, hashPhrase(phrase), display_name || username]
      );
      const user_id = r.rows[0].id;
      const token = generateToken();
      await q('INSERT INTO sessions (token, user_id) VALUES ($1, $2)', [token, user_id]);
      return { token, user_id, display_name: display_name || username };
    },
    async login(username, phrase) {
      const r = await q('SELECT id, display_name FROM users WHERE username = $1 AND phrase_hash = $2',
        [username, hashPhrase(phrase)]);
      if (!r.rows.length) return { error: 'Invalid username or phrase' };
      const user_id = r.rows[0].id;
      const token = generateToken();
      await q('INSERT INTO sessions (token, user_id) VALUES ($1, $2)', [token, user_id]);
      return { token, user_id, display_name: r.rows[0].display_name };
    },
    async getUserFromToken(token) {
      if (!token) return null;
      const r = await q(
        'SELECT u.id, u.username, u.display_name FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = $1',
        [token]
      );
      if (!r.rows.length) return null;
      return { user_id: r.rows[0].id, username: r.rows[0].username, display_name: r.rows[0].display_name };
    },
    async saveProgress(user_id, language, data) {
      await q(
        `INSERT INTO progress (user_id, language, data, updated_at) VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, language) DO UPDATE SET data = $3, updated_at = NOW()`,
        [user_id, language, JSON.stringify(data)]
      );
      return { ok: true };
    },
    async loadProgress(user_id) {
      const r = await q('SELECT language, data FROM progress WHERE user_id = $1', [user_id]);
      const progress = {};
      for (const row of r.rows) {
        try { progress[row.language] = JSON.parse(row.data); } catch (e) { progress[row.language] = null; }
      }
      return progress;
    },
    async submitLeaderboard(display_name, language, speed, accuracy, total_chars) {
      await q(
        'INSERT INTO leaderboard (display_name, language, speed, accuracy, total_chars) VALUES ($1, $2, $3, $4, $5)',
        [display_name, language, speed, accuracy || 0, total_chars || 0]
      );
      return { ok: true };
    },
    async getLeaderboard(lang) {
      let sql = 'SELECT display_name, language, speed, accuracy, total_chars, created_at FROM leaderboard';
      const params = [];
      if (lang) { sql += ' WHERE language = $1'; params.push(lang); }
      sql += ' ORDER BY speed DESC, accuracy DESC LIMIT 100';
      const r = await q(sql, params);
      return r.rows;
    },
    async getSuggestions(user_id) {
      const r = await q(`
        SELECT s.id, s.user_id, s.display_name, s.title, s.description, s.created_at,
          COALESCE(v.vote_count, 0) AS votes,
          (SELECT COUNT(*) FROM comments c WHERE c.suggestion_id = s.id) AS comments
        FROM suggestions s
        LEFT JOIN (SELECT suggestion_id, COUNT(*) AS vote_count FROM suggestion_votes GROUP BY suggestion_id) v ON v.suggestion_id = s.id
        ORDER BY votes DESC, s.created_at DESC
      `);
      const rows = r.rows;
      if (!user_id) return rows;
      const voted = await q(
        'SELECT suggestion_id FROM suggestion_votes WHERE user_id = $1',
        [user_id]
      );
      const votedSet = new Set(voted.rows.map(r => r.suggestion_id));
      return rows.map(s => ({ ...s, user_voted: votedSet.has(s.id) }));
    },
    async createSuggestion(user_id, display_name, title, description) {
      const r = await q(
        'INSERT INTO suggestions (user_id, display_name, title, description) VALUES ($1, $2, $3, $4) RETURNING id',
        [user_id, display_name, title, description || '']
      );
      return { id: r.rows[0].id, ok: true };
    },
    async editSuggestion(id, user_id, title, description) {
      const r = await q('SELECT user_id FROM suggestions WHERE id = $1', [id]);
      if (!r.rows.length) return { error: 'Not found' };
      if (r.rows[0].user_id !== user_id) return { error: 'Forbidden' };
      const updates = []; const params = []; let i = 1;
      if (title !== undefined) { updates.push('title = $' + i++); params.push(title); }
      if (description !== undefined) { updates.push('description = $' + i++); params.push(description); }
      if (!updates.length) return { ok: true };
      params.push(id);
      await q(`UPDATE suggestions SET ${updates.join(', ')} WHERE id = $${i}`, params);
      return { ok: true };
    },
    async deleteSuggestion(id, username) {
      if (username !== ADMIN_USERNAME) return { error: 'Forbidden' };
      const r = await q('SELECT id FROM suggestions WHERE id = $1', [id]);
      if (!r.rows.length) return { error: 'Not found' };
      await q('DELETE FROM suggestions WHERE id = $1', [id]);
      return { ok: true };
    },
    async voteSuggestion(id, user_id) {
      const exists = await q('SELECT id FROM suggestions WHERE id = $1', [id]);
      if (!exists.rows.length) return { error: 'Not found' };
      const v = await q('SELECT suggestion_id FROM suggestion_votes WHERE suggestion_id = $1 AND user_id = $2', [id, user_id]);
      if (v.rows.length) {
        await q('DELETE FROM suggestion_votes WHERE suggestion_id = $1 AND user_id = $2', [id, user_id]);
        const cnt = await q('SELECT COUNT(*) AS c FROM suggestion_votes WHERE suggestion_id = $1', [id]);
        return { ok: true, voted: false, votes: parseInt(cnt.rows[0].c) };
      } else {
        await q('INSERT INTO suggestion_votes (suggestion_id, user_id) VALUES ($1, $2)', [id, user_id]);
        const cnt = await q('SELECT COUNT(*) AS c FROM suggestion_votes WHERE suggestion_id = $1', [id]);
        return { ok: true, voted: true, votes: parseInt(cnt.rows[0].c) };
      }
    },
    async getComments(suggestion_id) {
      const r = await q(
        'SELECT id, user_id, display_name, text, created_at FROM comments WHERE suggestion_id = $1 ORDER BY created_at ASC',
        [suggestion_id]
      );
      return r.rows;
    },
    async createComment(suggestion_id, user_id, display_name, text) {
      const r = await q(
        'INSERT INTO comments (suggestion_id, user_id, display_name, text) VALUES ($1, $2, $3, $4) RETURNING id',
        [suggestion_id, user_id, display_name, text]
      );
      return { id: r.rows[0].id, ok: true };
    },
    async editComment(suggestion_id, comment_id, user_id, text) {
      const r = await q('SELECT user_id FROM comments WHERE id = $1 AND suggestion_id = $2', [comment_id, suggestion_id]);
      if (!r.rows.length) return { error: 'Not found' };
      if (r.rows[0].user_id !== user_id) return { error: 'Forbidden' };
      await q('UPDATE comments SET text = $1 WHERE id = $2', [text, comment_id]);
      return { ok: true };
    },
    async deleteComment(suggestion_id, comment_id, username) {
      if (username !== ADMIN_USERNAME) return { error: 'Forbidden' };
      const r = await q('SELECT id FROM comments WHERE id = $1 AND suggestion_id = $2', [comment_id, suggestion_id]);
      if (!r.rows.length) return { error: 'Not found' };
      await q('DELETE FROM comments WHERE id = $1', [comment_id]);
      return { ok: true };
    }
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
  function load() {
    try { return JSON.parse(fs.readFileSync(dataPath, 'utf8')); } catch (e) { return { users: [], sessions: [], progress: [], leaderboard: [], suggestions: [], comments: [] }; }
  }
  function save(d) { fs.writeFileSync(dataPath, JSON.stringify(d)); }
  let data = load();
  return {
    init() {},
    register(username, phrase, display_name) {
      if (data.users.find(u => u.username === username)) return { error: 'Username already taken' };
      const id = data.users.length + 1;
      data.users.push({ id, username, phrase_hash: hashPhrase(phrase), display_name: display_name || username, created_at: new Date().toISOString() });
      const token = generateToken();
      data.sessions.push({ token, user_id: id, created_at: new Date().toISOString() });
      save(data);
      return { token, user_id: id, display_name: display_name || username };
    },
    login(username, phrase) {
      const u = data.users.find(u => u.username === username && u.phrase_hash === hashPhrase(phrase));
      if (!u) return { error: 'Invalid username or phrase' };
      const token = generateToken();
      data.sessions.push({ token, user_id: u.id, created_at: new Date().toISOString() });
      save(data);
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
      save(data);
      return { ok: true };
    },
    loadProgress(user_id) {
      const rows = data.progress.filter(p => p.user_id === user_id);
      const progress = {};
      for (const row of rows) { try { progress[row.language] = JSON.parse(row.data); } catch (e) { progress[row.language] = null; } }
      return progress;
    },
    submitLeaderboard(display_name, language, speed, accuracy, total_chars) {
      data.leaderboard.push({ display_name, language, speed, accuracy: accuracy || 0, total_chars: total_chars || 0, created_at: new Date().toISOString() });
      save(data);
      return { ok: true };
    },
    getLeaderboard(lang) {
      let rows = data.leaderboard;
      if (lang) rows = rows.filter(r => r.language === lang);
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
      save(data);
      return { id: data.suggestions.length, ok: true };
    },
    editSuggestion(id, user_id, title, description) {
      const s = (data.suggestions || []).find(s => s.id === id);
      if (!s) return { error: 'Not found' };
      if (s.user_id !== user_id) return { error: 'Forbidden' };
      if (title !== undefined) s.title = title;
      if (description !== undefined) s.description = description;
      save(data);
      return { ok: true };
    },
    deleteSuggestion(id, username) {
      if (username !== ADMIN_USERNAME) return { error: 'Forbidden' };
      const s = (data.suggestions || []).find(s => s.id === id);
      if (!s) return { error: 'Not found' };
      data.suggestions = (data.suggestions || []).filter(x => x.id !== id);
      data.comments = (data.comments || []).filter(c => c.suggestion_id !== id);
      save(data);
      return { ok: true };
    },
    voteSuggestion(id, user_id) {
      const s = (data.suggestions || []).find(s => s.id === id);
      if (!s) return { error: 'Not found' };
      if (!s.votes) s.votes = [];
      const idx = s.votes.indexOf(user_id);
      if (idx >= 0) s.votes.splice(idx, 1); else s.votes.push(user_id);
      save(data);
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
      save(data);
      return { id: data.comments.length, ok: true };
    },
    editComment(suggestion_id, comment_id, user_id, text) {
      const c = (data.comments || []).find(c => c.id === comment_id && c.suggestion_id === suggestion_id);
      if (!c) return { error: 'Not found' };
      if (c.user_id !== user_id) return { error: 'Forbidden' };
      c.text = text;
      save(data);
      return { ok: true };
    },
    deleteComment(suggestion_id, comment_id, username) {
      if (username !== ADMIN_USERNAME) return { error: 'Forbidden' };
      const c = (data.comments || []).find(c => c.id === comment_id && c.suggestion_id === suggestion_id);
      if (!c) return { error: 'Not found' };
      data.comments = (data.comments || []).filter(x => x.id !== comment_id);
      const s = (data.suggestions || []).find(s => s.id === suggestion_id);
      if (s) s.comments = (data.comments || []).filter(c => c.suggestion_id === s.id).length;
      save(data);
      return { ok: true };
    }
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
  const { language, speed, accuracy, total_chars } = req.body;
  if (!language || speed == null) return res.json({ error: 'Missing fields' });
  const r = await st.submitLeaderboard(user.display_name, language, speed, accuracy, total_chars);
  res.json(r);
});

app.get('/api/leaderboard', async (req, res) => {
  const s = await getStorage();
  const rows = await s.getLeaderboard(req.query.lang || null);
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

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ---- Start ----
(async () => {
  await getStorage();
  app.listen(PORT, () => console.log('Server running on port ' + PORT));
})();
