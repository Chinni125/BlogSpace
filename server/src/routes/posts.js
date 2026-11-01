import { Router } from 'express'
import { getPosts, getPost, create, remove } from '../controllers/posts.js'
import { like, unlike, getComments, createComment } from '../controllers/engagement.js'
import { requireAuth, optionalAuth } from '../middleware/auth.js'

const router = Router()
router.get('/', getPosts)
router.get('/:id', optionalAuth, getPost)
router.post('/', requireAuth, create)
router.delete('/:id', requireAuth, remove)

router.post('/:id/like', requireAuth, like)
router.delete('/:id/like', requireAuth, unlike)
router.get('/:id/comments', getComments)
router.post('/:id/comments', requireAuth, createComment)

export default router
