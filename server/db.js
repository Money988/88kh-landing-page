import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { seedWebsites, seedSupportGroups, seedTranslations } from './seed.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = process.env.DATA_DIR || join(__dirname, 'data')
mkdirSync(dataDir, { recursive: true })

export const db = new DatabaseSync(join(dataDir, 'app.db'))

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '',
    name_keys TEXT NOT NULL DEFAULT '[]',
    thumbnail TEXT NOT NULL DEFAULT '[]',
    thumbnail_mobile TEXT NOT NULL DEFAULT '[]',
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS support_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_key TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS support_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL REFERENCES support_groups(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    handle TEXT NOT NULL DEFAULT '',
    handle_key TEXT,
    url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS translations (
    locale TEXT NOT NULL,
    path TEXT NOT NULL,
    value TEXT NOT NULL,
    PRIMARY KEY (locale, path)
  );
`)

const isEmpty = (table) =>
  db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get().n === 0

export const seedIfEmpty = () => {
  if (isEmpty('websites')) {
    const insert = db.prepare(
      `INSERT INTO websites (key, url, icon, name_keys, thumbnail, thumbnail_mobile, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    seedWebsites.forEach((w, i) =>
      insert.run(w.key, w.url, w.icon, JSON.stringify(w.nameKeys), JSON.stringify(w.thumbnail), JSON.stringify(w.thumbnailMobile), i),
    )
  }

  if (isEmpty('support_groups')) {
    const insertGroup = db.prepare(
      `INSERT INTO support_groups (title_key, icon, sort_order) VALUES (?, ?, ?)`,
    )
    const insertLink = db.prepare(
      `INSERT INTO support_links (group_id, key, handle, handle_key, url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    seedSupportGroups.forEach((g, i) => {
      const { lastInsertRowid } = insertGroup.run(g.titleKey, g.icon, i)
      g.links.forEach((l, j) => insertLink.run(lastInsertRowid, l.key, l.handle, l.handleKey, l.url, j))
    })
  }

  if (isEmpty('translations')) {
    const insert = db.prepare(
      `INSERT INTO translations (locale, path, value) VALUES (?, ?, ?)`,
    )
    for (const row of seedTranslations()) insert.run(row.locale, row.path, row.value)
  }
}

// --- Read helpers ---

const parseWebsite = (row) => ({
  id: row.id,
  key: row.key,
  url: row.url,
  icon: row.icon,
  nameKeys: JSON.parse(row.name_keys),
  thumbnail: JSON.parse(row.thumbnail),
  thumbnailMobile: JSON.parse(row.thumbnail_mobile),
  sortOrder: row.sort_order,
})

export const getWebsites = () =>
  db.prepare('SELECT * FROM websites ORDER BY sort_order, id').all().map(parseWebsite)

export const getSupportGroups = () => {
  const groups = db.prepare('SELECT * FROM support_groups ORDER BY sort_order, id').all()
  const links = db.prepare('SELECT * FROM support_links ORDER BY sort_order, id').all()
  return groups.map((g) => ({
    id: g.id,
    titleKey: g.title_key,
    icon: g.icon,
    sortOrder: g.sort_order,
    links: links
      .filter((l) => l.group_id === g.id)
      .map((l) => ({
        id: l.id,
        groupId: l.group_id,
        key: l.key,
        handle: l.handle,
        handleKey: l.handle_key,
        url: l.url,
        sortOrder: l.sort_order,
      })),
  }))
}

export const getTranslations = () => {
  const out = {}
  for (const row of db.prepare('SELECT * FROM translations ORDER BY locale, path').all()) {
    const target = (out[row.locale] ??= {})
    const parts = row.path.split('.')
    let node = target
    for (const part of parts.slice(0, -1)) {
      if (typeof node[part] !== 'object' || node[part] === null) node[part] = {}
      node = node[part]
    }
    node[parts.at(-1)] = row.value
  }
  return out
}

export const getTranslationsFlat = () =>
  db.prepare('SELECT * FROM translations ORDER BY locale, path').all()
