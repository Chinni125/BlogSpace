import { Router } from 'express'
import { removeComment } from '../controllers/engagement.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.delete('/:id', requireAuth, removeComment)

export default router
