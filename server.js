const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));
app.get('/health', (req, res) => res.json({ ok: true }));

const DATA_PATH = path.join(os.tmpdir(), 'typing-data.json');

let data = { users: [], sessions: [], progress: [], leaderboard: [] };

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

app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
