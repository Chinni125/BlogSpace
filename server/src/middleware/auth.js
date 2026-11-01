import { COOKIE_NAME, verifyToken } from '../utils/token.js'
import { findUserById } from '../models/users.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization
    const token = req.cookies?.[COOKIE_NAME] || (header?.startsWith('Bearer ') ? header.slice(7) : null)
    if (!token) return res.status(401).json({ error: 'Authentication required' })

    const payload = verifyToken(token)
    const user = await findUserById(payload.sub)
    if (!user) return res.status(401).json({ error: 'Invalid token' })

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Invalid or expired token' })
    next(err)
  }
}

// Attaches req.user when a valid token is present; never rejects.
export async function optionalAuth(req, _res, next) {
  try {
    const header = req.headers.authorization
    const token = req.cookies?.[COOKIE_NAME] || (header?.startsWith('Bearer ') ? header.slice(7) : null)
    if (token) req.user = await findUserById(verifyToken(token).sub)
  } catch { /* invalid/expired token: treat as anonymous */ }
  next()
}
