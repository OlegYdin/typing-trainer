const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));
app.get('/health', (req, res) => res.json({ ok: true }));

const DATA_DIR = path.join(__dirname, 'data');
const DATA_PATH = path.join(DATA_DIR, 'typing-data.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

let data = { users: [], sessions: [], progress: [], leaderboard: [], suggestions: [], comments: [] };

function load() {
  try { data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')); } catch (e) {}
}
function save() { fs.writeFileSync(DATA_PATH, JSON.stringify(data)); }

load();

function hashPhrase(p) { return crypto.createHash('sha256').update(p).digest('hex'); }
function generateToken() { return crypto.randomBytes(32).toString('hex'); }

function getUserFromToken(token) {
  if (!token) return null;
  const s = data.sessions.find(s => s.token === token);
  if (!s) return null;
  const u = data.users.find(u => u.id === s.user_id);
  return u ? { user_id: u.id, username: u.username, display_name: u.display_name } : null;
}

app.post('/api/register', (req, res) => {
  const { username, phrase, display_name } = req.body;
  if (!username || !phrase) return res.json({ error: 'Username and phrase required' });
  if (data.users.find(u => u.username === username)) return res.json({ error: 'Username already taken' });
  const user = { id: data.users.length + 1, username, phrase_hash: hashPhrase(phrase), display_name: display_name || username, created_at: new Date().toISOString() };
  data.users.push(user);
  const token = generateToken();
  data.sessions.push({ token, user_id: user.id, created_at: new Date().toISOString() });
  save();
  res.json({ token, user_id: user.id, display_name: user.display_name });
});

app.post('/api/login', (req, res) => {
  const { username, phrase } = req.body;
  if (!username || !phrase) return res.json({ error: 'Username and phrase required' });
  const user = data.users.find(u => u.username === username && u.phrase_hash === hashPhrase(phrase));
  if (!user) return res.json({ error: 'Invalid username or phrase' });
  const token = generateToken();
  data.sessions.push({ token, user_id: user.id, created_at: new Date().toISOString() });
  save();
  res.json({ token, user_id: user.id, display_name: user.display_name });
});

app.post('/api/save', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { language, data: d } = req.body;
  if (!language || !d) return res.json({ error: 'Language and data required' });
  const idx = data.progress.findIndex(p => p.user_id === user.user_id && p.language === language);
  const entry = { user_id: user.user_id, language, data: JSON.stringify(d), updated_at: new Date().toISOString() };
  if (idx >= 0) data.progress[idx] = entry; else data.progress.push(entry);
  save();
  res.json({ ok: true });
});

app.post('/api/load', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const rows = data.progress.filter(p => p.user_id === user.user_id);
  const progress = {};
  for (const row of rows) { try { progress[row.language] = JSON.parse(row.data); } catch (e) { progress[row.language] = null; } }
  res.json({ progress, display_name: user.display_name });
});

app.post('/api/leaderboard/submit', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { language, speed, accuracy, total_chars } = req.body;
  if (!language || speed == null) return res.json({ error: 'Missing fields' });
  data.leaderboard.push({ display_name: user.display_name, language, speed, accuracy: accuracy || 0, total_chars: total_chars || 0, created_at: new Date().toISOString() });
  save();
  res.json({ ok: true });
});

app.get('/api/leaderboard', (req, res) => {
  const lang = req.query.lang || null;
  let rows = data.leaderboard;
  if (lang) rows = rows.filter(r => r.language === lang);
  rows.sort((a, b) => b.speed - a.speed || b.accuracy - a.accuracy);
  res.json(rows.slice(0, 100));
});

app.get('/api/suggestions', (req, res) => {
  const result = (data.suggestions || []).map(s => ({
    ...s, votes: s.votes?.length || 0, user_voted: req.query.user_id ? (s.votes || []).includes(Number(req.query.user_id)) : false
  }));
  result.sort((a, b) => b.votes - a.votes || new Date(b.created_at) - new Date(a.created_at));
  res.json(result);
});

app.post('/api/suggestions', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { title, description } = req.body;
  if (!title) return res.json({ error: 'Title required' });
  if (!data.suggestions) data.suggestions = [];
  data.suggestions.push({
    id: data.suggestions.length + 1, user_id: user.user_id, display_name: user.display_name,
    title, description: description || '', votes: [], comments: 0, created_at: new Date().toISOString()
  });
  save();
  res.json({ ok: true });
});

app.post('/api/suggestions/:id/vote', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const s = (data.suggestions || []).find(s => s.id === Number(req.params.id));
  if (!s) return res.json({ error: 'Not found' });
  const idx = (s.votes || []).indexOf(user.user_id);
  if (idx >= 0) s.votes.splice(idx, 1); else (s.votes || (s.votes = [])).push(user.user_id);
  save();
  res.json({ ok: true, voted: idx < 0, votes: s.votes.length });
});

app.get('/api/suggestions/:id/comments', (req, res) => {
  const comments = (data.comments || []).filter(c => c.suggestion_id === Number(req.params.id));
  res.json(comments);
});

app.post('/api/suggestions/:id/comments', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { text } = req.body;
  if (!text) return res.json({ error: 'Text required' });
  if (!data.comments) data.comments = [];
  data.comments.push({
    id: data.comments.length + 1, suggestion_id: Number(req.params.id),
    user_id: user.user_id, display_name: user.display_name, text, created_at: new Date().toISOString()
  });
  const s = (data.suggestions || []).find(s => s.id === Number(req.params.id));
  if (s) s.comments = (data.comments || []).filter(c => c.suggestion_id === s.id).length;
  save();
  res.json({ ok: true });
});

app.post('/api/suggestions/:id/edit', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const s = (data.suggestions || []).find(s => s.id === Number(req.params.id));
  if (!s) return res.json({ error: 'Not found' });
  if (s.user_id !== user.user_id) return res.json({ error: 'Forbidden' });
  const { title, description } = req.body;
  if (title !== undefined) s.title = title;
  if (description !== undefined) s.description = description;
  save();
  res.json({ ok: true });
});

app.post('/api/suggestions/:id/delete', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const s = (data.suggestions || []).find(s => s.id === Number(req.params.id));
  if (!s) return res.json({ error: 'Not found' });
  if (s.user_id !== user.user_id && user.username !== ADMIN_USERNAME) return res.json({ error: 'Forbidden' });
  data.suggestions = (data.suggestions || []).filter(x => x.id !== s.id);
  data.comments = (data.comments || []).filter(c => c.suggestion_id !== s.id);
  save();
  res.json({ ok: true });
});

app.post('/api/suggestions/:id/comments/:commentId/edit', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const c = (data.comments || []).find(c => c.id === Number(req.params.commentId) && c.suggestion_id === Number(req.params.id));
  if (!c) return res.json({ error: 'Not found' });
  if (c.user_id !== user.user_id) return res.json({ error: 'Forbidden' });
  const { text } = req.body;
  if (text !== undefined) c.text = text;
  save();
  res.json({ ok: true });
});

app.post('/api/suggestions/:id/comments/:commentId/delete', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const c = (data.comments || []).find(c => c.id === Number(req.params.commentId) && c.suggestion_id === Number(req.params.id));
  if (!c) return res.json({ error: 'Not found' });
  if (c.user_id !== user.user_id && user.username !== ADMIN_USERNAME) return res.json({ error: 'Forbidden' });
  data.comments = (data.comments || []).filter(x => x.id !== c.id);
  const s = (data.suggestions || []).find(s => s.id === Number(req.params.id));
  if (s) s.comments = (data.comments || []).filter(c => c.suggestion_id === s.id).length;
  save();
  res.json({ ok: true });
});

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'OlegYdin';

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
