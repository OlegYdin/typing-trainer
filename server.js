const express = require('express');
const crypto = require('crypto');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const db = new Database(path.join(__dirname, 'data.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    phrase_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER NOT NULL,
    language TEXT NOT NULL,
    data TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, language),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    display_name TEXT NOT NULL,
    language TEXT NOT NULL,
    speed REAL NOT NULL,
    accuracy REAL NOT NULL,
    total_chars INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

function hashPhrase(phrase) {
  return crypto.createHash('sha256').update(phrase).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function getUserFromToken(token) {
  if (!token) return null;
  const row = db.prepare(`
    SELECT sessions.user_id, users.username, users.display_name
    FROM sessions JOIN users ON sessions.user_id = users.id
    WHERE sessions.token = ?
  `).get(token);
  return row || null;
}

app.post('/api/register', (req, res) => {
  const { username, phrase, display_name } = req.body;
  if (!username || !phrase) {
    return res.json({ error: 'Username and phrase required' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.json({ error: 'Username already taken' });
  }
  const phraseHash = hashPhrase(phrase);
  const name = display_name || username;
  const result = db.prepare('INSERT INTO users (username, phrase_hash, display_name) VALUES (?, ?, ?)').run(username, phraseHash, name);
  const token = generateToken();
  db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, result.lastInsertRowid);
  res.json({ token, user_id: result.lastInsertRowid, display_name: name });
});

app.post('/api/login', (req, res) => {
  const { username, phrase } = req.body;
  if (!username || !phrase) {
    return res.json({ error: 'Username and phrase required' });
  }
  const phraseHash = hashPhrase(phrase);
  const user = db.prepare('SELECT id, display_name FROM users WHERE username = ? AND phrase_hash = ?').get(username, phraseHash);
  if (!user) {
    return res.json({ error: 'Invalid username or phrase' });
  }
  const token = generateToken();
  db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, user.id);
  res.json({ token, user_id: user.id, display_name: user.display_name });
});

app.post('/api/save', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { language, data } = req.body;
  if (!language || !data) return res.json({ error: 'Language and data required' });
  db.prepare(`
    INSERT INTO progress (user_id, language, data, updated_at)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(user_id, language) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
  `).run(user.user_id, language, JSON.stringify(data));
  res.json({ ok: true });
});

app.post('/api/load', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const rows = db.prepare('SELECT language, data FROM progress WHERE user_id = ?').all(user.user_id);
  const progress = {};
  for (const row of rows) {
    try { progress[row.language] = JSON.parse(row.data); } catch (e) { progress[row.language] = null; }
  }
  res.json({ progress, display_name: user.display_name });
});

app.post('/api/leaderboard/submit', (req, res) => {
  const user = getUserFromToken(req.body.token);
  if (!user) return res.json({ error: 'Not authenticated' });
  const { language, speed, accuracy, total_chars } = req.body;
  if (!language || speed == null) return res.json({ error: 'Missing fields' });
  db.prepare('INSERT INTO leaderboard (user_id, display_name, language, speed, accuracy, total_chars) VALUES (?, ?, ?, ?, ?, ?)')
    .run(user.user_id, user.display_name, language, speed, accuracy || 0, total_chars || 0);
  res.json({ ok: true });
});

app.get('/api/leaderboard', (req, res) => {
  const lang = req.query.lang || null;
  let sql = 'SELECT display_name, language, speed, accuracy, total_chars, created_at FROM leaderboard';
  const params = [];
  if (lang) {
    sql += ' WHERE language = ?';
    params.push(lang);
  }
  sql += ' ORDER BY speed DESC, accuracy DESC LIMIT 100';
  const rows = db.prepare(sql).all(...params);
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
