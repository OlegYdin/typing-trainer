const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

const DB_PATH = path.join(os.tmpdir(), 'typing.db');

app.get('/health', (req, res) => res.json({ ok: true }));

function hashPhrase(phrase) {
  return crypto.createHash('sha256').update(phrase).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function init() {
  let db;

  try {
    const { DatabaseSync } = require('node:sqlite');
    const raw = new DatabaseSync(DB_PATH);
    db = {
      exec(sql) { raw.exec(sql); },
      prepare(sql) {
        const stmt = raw.prepare(sql);
        return {
          get(...p) { return stmt.get(...p) || null; },
          all(...p) { return stmt.all(...p); },
          run(...p) { return stmt.run(...p); }
        };
      }
    };
  } catch (e1) {
    try {
      const initSqlJs = require('sql.js');
      const SQL = await initSqlJs();
      let buf;
      try { buf = fs.readFileSync(DB_PATH); } catch (e) {}
      const raw = new SQL.Database(buf);
      const save = () => { const d = raw.export(); fs.writeFileSync(DB_PATH, Buffer.from(d)); };
      db = {
        exec(sql) { raw.run(sql); save(); },
        prepare(sql) {
          return {
            get(...params) {
              const stmt = raw.prepare(sql);
              if (params.length) stmt.bind(params);
              if (stmt.step()) { const r = stmt.getAsObject(); stmt.free(); return r; }
              stmt.free(); return null;
            },
            all(...params) {
              const stmt = raw.prepare(sql);
              if (params.length) stmt.bind(params);
              const rows = []; while (stmt.step()) rows.push(stmt.getAsObject());
              stmt.free(); return rows;
            },
            run(...params) {
              if (params.length) raw.run(sql, params); else raw.run(sql);
              save();
              const r = raw.exec('SELECT last_insert_rowid()')[0];
              return { lastInsertRowid: r ? r.values[0][0] : null };
            }
          };
        }
      };
    } catch (e2) {
      console.error('Both node:sqlite and sql.js failed:', e1, e2);
      process.exit(1);
    }
  }

  db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    phrase_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER NOT NULL,
    language TEXT NOT NULL,
    data TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, language),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.exec(`CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    display_name TEXT NOT NULL,
    language TEXT NOT NULL,
    speed REAL NOT NULL,
    accuracy REAL NOT NULL,
    total_chars INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  function getUserFromToken(token) {
    if (!token) return null;
    return db.prepare(
      `SELECT sessions.user_id, users.username, users.display_name
       FROM sessions JOIN users ON sessions.user_id = users.id
       WHERE sessions.token = ?`
    ).get(token);
  }

  app.post('/api/register', (req, res) => {
    const { username, phrase, display_name } = req.body;
    if (!username || !phrase) return res.json({ error: 'Username and phrase required' });
    if (db.prepare('SELECT id FROM users WHERE username = ?').get(username))
      return res.json({ error: 'Username already taken' });
    const phraseHash = hashPhrase(phrase);
    const name = display_name || username;
    const result = db.prepare('INSERT INTO users (username, phrase_hash, display_name) VALUES (?, ?, ?)').run(username, phraseHash, name);
    const token = generateToken();
    db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, result.lastInsertRowid);
    res.json({ token, user_id: result.lastInsertRowid, display_name: name });
  });

  app.post('/api/login', (req, res) => {
    const { username, phrase } = req.body;
    if (!username || !phrase) return res.json({ error: 'Username and phrase required' });
    const phraseHash = hashPhrase(phrase);
    const user = db.prepare('SELECT id, display_name FROM users WHERE username = ? AND phrase_hash = ?').get(username, phraseHash);
    if (!user) return res.json({ error: 'Invalid username or phrase' });
    const token = generateToken();
    db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(token, user.id);
    res.json({ token, user_id: user.id, display_name: user.display_name });
  });

  app.post('/api/save', (req, res) => {
    const user = getUserFromToken(req.body.token);
    if (!user) return res.json({ error: 'Not authenticated' });
    const { language, data } = req.body;
    if (!language || !data) return res.json({ error: 'Language and data required' });
    db.prepare(
      `INSERT INTO progress (user_id, language, data, updated_at)
       VALUES (?, ?, ?, datetime('now'))
       ON CONFLICT(user_id, language) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`
    ).run(user.user_id, language, JSON.stringify(data));
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
    if (lang) { sql += ' WHERE language = ?'; params.push(lang); }
    sql += ' ORDER BY speed DESC, accuracy DESC LIMIT 100';
    res.json(db.prepare(sql).all(...params.length ? params : undefined));
  });

  app.use(express.static(__dirname));

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  init().catch(err => {
    console.error('Init failed:', err);
    process.exit(1);
  });
});
