import express from 'express'
import jwt from 'jsonwebtoken'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  db,
  seedIfEmpty,
  getWebsites,
  getSupportGroups,
  getTranslations,
  getTranslationsFlat,
} from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 8080)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

seedIfEmpty()

const app = express()
app.use(express.json())

// --- Auth ---

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body || {}
  if (typeof password !== 'string' || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' })
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' })
  res.json({ token })
})

const requireAdmin = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  try {
    jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

// --- Public content ---

app.get('/api/content', (_req, res) => {
  res.json({
    websites: getWebsites(),
    supportGroups: getSupportGroups(),
    translations: getTranslations(),
  })
})

// --- Admin: websites ---

const admin = express.Router()
admin.use(requireAdmin)

admin.get('/websites', (_req, res) => res.json(getWebsites()))

admin.post('/websites', (req, res) => {
  const { key, url, icon = '', nameKeys = [], thumbnail = [], thumbnailMobile = [], sortOrder = 0 } = req.body || {}
  if (!key || !url) return res.status(400).json({ error: 'key and url are required' })
  try {
    const { lastInsertRowid } = db
      .prepare(
        `INSERT INTO websites (key, url, icon, name_keys, thumbnail, thumbnail_mobile, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(key, url, icon, JSON.stringify(nameKeys), JSON.stringify(thumbnail), JSON.stringify(thumbnailMobile), sortOrder)
    res.status(201).json({ id: Number(lastInsertRowid) })
  } catch {
    res.status(409).json({ error: 'key already exists' })
  }
})

admin.put('/websites/:id', (req, res) => {
  const { key, url, icon = '', nameKeys = [], thumbnail = [], thumbnailMobile = [], sortOrder = 0 } = req.body || {}
  if (!key || !url) return res.status(400).json({ error: 'key and url are required' })
  const { changes } = db
    .prepare(
      `UPDATE websites SET key = ?, url = ?, icon = ?, name_keys = ?, thumbnail = ?, thumbnail_mobile = ?, sort_order = ?
       WHERE id = ?`,
    )
    .run(key, url, icon, JSON.stringify(nameKeys), JSON.stringify(thumbnail), JSON.stringify(thumbnailMobile), sortOrder, Number(req.params.id))
  if (!changes) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

admin.delete('/websites/:id', (req, res) => {
  db.prepare('DELETE FROM websites WHERE id = ?').run(Number(req.params.id))
  res.json({ ok: true })
})

// --- Admin: support groups & links ---

admin.get('/support-groups', (_req, res) => res.json(getSupportGroups()))

admin.post('/support-groups', (req, res) => {
  const { titleKey, icon = '', sortOrder = 0 } = req.body || {}
  if (!titleKey) return res.status(400).json({ error: 'titleKey is required' })
  const { lastInsertRowid } = db
    .prepare('INSERT INTO support_groups (title_key, icon, sort_order) VALUES (?, ?, ?)')
    .run(titleKey, icon, sortOrder)
  res.status(201).json({ id: Number(lastInsertRowid) })
})

admin.put('/support-groups/:id', (req, res) => {
  const { titleKey, icon = '', sortOrder = 0 } = req.body || {}
  if (!titleKey) return res.status(400).json({ error: 'titleKey is required' })
  const { changes } = db
    .prepare('UPDATE support_groups SET title_key = ?, icon = ?, sort_order = ? WHERE id = ?')
    .run(titleKey, icon, sortOrder, Number(req.params.id))
  if (!changes) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

admin.delete('/support-groups/:id', (req, res) => {
  const id = Number(req.params.id)
  db.prepare('DELETE FROM support_links WHERE group_id = ?').run(id)
  db.prepare('DELETE FROM support_groups WHERE id = ?').run(id)
  res.json({ ok: true })
})

admin.post('/support-groups/:id/links', (req, res) => {
  const groupId = Number(req.params.id)
  const group = db.prepare('SELECT id FROM support_groups WHERE id = ?').get(groupId)
  if (!group) return res.status(404).json({ error: 'Group not found' })
  const { key, handle = '', handleKey = null, url, sortOrder = 0 } = req.body || {}
  if (!key || !url) return res.status(400).json({ error: 'key and url are required' })
  const { lastInsertRowid } = db
    .prepare('INSERT INTO support_links (group_id, key, handle, handle_key, url, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
    .run(groupId, key, handle, handleKey, url, sortOrder)
  res.status(201).json({ id: Number(lastInsertRowid) })
})

admin.put('/support-links/:id', (req, res) => {
  const { key, handle = '', handleKey = null, url, sortOrder = 0 } = req.body || {}
  if (!key || !url) return res.status(400).json({ error: 'key and url are required' })
  const { changes } = db
    .prepare('UPDATE support_links SET key = ?, handle = ?, handle_key = ?, url = ?, sort_order = ? WHERE id = ?')
    .run(key, handle, handleKey, url, sortOrder, Number(req.params.id))
  if (!changes) return res.status(404).json({ error: 'Not found' })
  res.json({ ok: true })
})

admin.delete('/support-links/:id', (req, res) => {
  db.prepare('DELETE FROM support_links WHERE id = ?').run(Number(req.params.id))
  res.json({ ok: true })
})

// --- Admin: translations ---

admin.get('/translations', (_req, res) => res.json(getTranslationsFlat()))

admin.put('/translations', (req, res) => {
  const entries = Array.isArray(req.body) ? req.body : [req.body]
  const upsert = db.prepare(
    `INSERT INTO translations (locale, path, value) VALUES (?, ?, ?)
     ON CONFLICT(locale, path) DO UPDATE SET value = excluded.value`,
  )
  for (const { locale, path, value } of entries) {
    if (!locale || !path || typeof value !== 'string') {
      return res.status(400).json({ error: 'locale, path and value are required for each entry' })
    }
    upsert.run(locale, path, value)
  }
  res.json({ ok: true })
})

admin.delete('/translations', (req, res) => {
  const { locale, path } = req.body || {}
  if (!locale || !path) return res.status(400).json({ error: 'locale and path are required' })
  db.prepare('DELETE FROM translations WHERE locale = ? AND path = ?').run(locale, path)
  res.json({ ok: true })
})

app.use('/api/admin', admin)

// --- Static SPA (production) ---

const distDir = join(__dirname, '..', 'dist')
if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(join(distDir, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`88KH server listening on http://localhost:${PORT}`)
})
