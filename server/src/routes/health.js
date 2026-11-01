import { Router } from 'express'
import { checkConnection } from '../config/db.js'

const router = Router()

router.get('/', async (_req, res) => {
  let database = 'connected'
  try {
    await checkConnection()
  } catch {
    database = 'unavailable'
  }
  res.json({ status: 'ok', database })
})

export default router
