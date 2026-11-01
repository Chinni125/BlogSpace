import './config/env.js'
import app from './app.js'
import { checkConnection } from './config/db.js'

const port = process.env.PORT || 5001

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`)
  try {
    await checkConnection()
    console.log('PostgreSQL connected')
  } catch (e) {
    console.warn(`PostgreSQL not reachable: ${e.message}`)
  }
})
