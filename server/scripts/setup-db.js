import { readFile } from 'node:fs/promises'
import { pool } from '../src/config/db.js'

const sql = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8')
try {
  await pool.query(sql)
  console.log('Schema applied.')
} catch (e) {
  console.error('Schema failed:', e.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
