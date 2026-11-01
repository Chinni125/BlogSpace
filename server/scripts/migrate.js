import { readdir, readFile } from 'node:fs/promises'
import { pool } from '../src/config/db.js'

const dir = new URL('../db/migrations/', import.meta.url)

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       TEXT        PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)
  const done = new Set((await pool.query('SELECT name FROM schema_migrations')).rows.map((r) => r.name))
  const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort()

  for (const file of files) {
    if (done.has(file)) continue
    const sql = await readFile(new URL(file, dir), 'utf8')
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query(sql)
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file])
      await client.query('COMMIT')
      console.log(`Applied ${file}`)
    } catch (e) {
      await client.query('ROLLBACK')
      throw new Error(`${file}: ${e.message}`)
    } finally {
      client.release()
    }
  }
  console.log('Migrations up to date.')
} catch (e) {
  console.error('Migration failed:', e.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
