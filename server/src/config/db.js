import pg from 'pg'
import 'dotenv/config'

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

pool.on('error', (err) => console.error('Unexpected idle PG client error:', err))

// Always pass user input via `params` ($1, $2, ...) — never string-concatenate SQL.
export const query = (text, params = []) => pool.query(text, params)

export async function checkConnection() {
  await pool.query('SELECT 1')
  return true
}
