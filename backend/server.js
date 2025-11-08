require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')
const path = require('path')

const { encryptKey, decryptKey } = require('./utils/crypto')

const DB_FILE = path.join(__dirname, 'db.sqlite3')
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

// ensure DB exists and has schema
const initSQL = fs.readFileSync(path.join(__dirname, 'db', 'init.sql'), 'utf8')

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) console.error('DB err', err)
  else {
    db.exec(initSQL, (e) => { if (e) console.error(e) })
  }
})

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Helper: create JWT
function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' })
}

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'username & password required' })

  // create user AES key (32 bytes)
  const userAesKey = cryptoRandomBytes(32)
  const userAesKeyB64 = userAesKey.toString('base64')

  const encryptedAesKey = encryptKey(userAesKey)

  const passwordHash = await bcrypt.hash(password, 10)

  const stmt = db.prepare('INSERT INTO users (username, password_hash, aes_key_encrypted) VALUES (?,?,?)')
  stmt.run(username, passwordHash, encryptedAesKey, function(err) {
    if (err) return res.status(400).json({ error: 'username already exists' })
    const token = signToken(this.lastID)
    return res.json({ token, userAesKey: userAesKeyB64 })
  })
})

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'username & password required' })

  db.get('SELECT id, password_hash, aes_key_encrypted FROM users WHERE username = ?', [username], async (err, row) => {
    if (err || !row) return res.status(401).json({ error: 'invalid credentials' })
    const ok = await bcrypt.compare(password, row.password_hash)
    if (!ok) return res.status(401).json({ error: 'invalid credentials' })
    const token = signToken(row.id)
    const userAesKey = decryptKey(row.aes_key_encrypted)
    return res.json({ token, userAesKey: userAesKey.toString('base64') })
  })
})

// Auth middleware
function auth(req, res, next) {
  const h = req.headers.authorization
  if (!h) return res.status(401).json({ error: 'no token' })
  const token = h.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.sub
    next()
  } catch (e) { return res.status(401).json({ error: 'invalid token' }) }
}

// Save result (encrypted by client)
app.post('/api/results', auth, (req, res) => {
  const { dataEncrypted } = req.body
  if (!dataEncrypted) return res.status(400).json({ error: 'missing data' })
  const ts = new Date().toISOString()
  const stmt = db.prepare('INSERT INTO results (user_id, timestamp, data_encrypted) VALUES (?,?,?)')
  stmt.run(req.userId, ts, dataEncrypted, function(err){
    if (err) return res.status(500).json({ error: 'db error' })
    res.json({ id: this.lastID, timestamp: ts })
  })
})

// Get user's results
app.get('/api/results', auth, (req, res) => {
  db.all('SELECT id, timestamp, data_encrypted FROM results WHERE user_id = ? ORDER BY timestamp DESC LIMIT 100', [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' })
    res.json({ results: rows })
  })
})

app.listen(PORT, () => console.log('Backend listening on', PORT))

// tiny helper
function cryptoRandomBytes(n) {
  return require('crypto').randomBytes(n)
}
