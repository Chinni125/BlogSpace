import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { signup, login, logout, me } from '../controllers/auth.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: true, legacyHeaders: false })

router.post('/signup', limiter, signup)
router.post('/login', limiter, login)
router.post('/logout', logout)
router.get('/me', requireAuth, me)

export default router
