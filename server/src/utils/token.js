import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRES_IN, IS_PROD } from '../config/env.js'

export const COOKIE_NAME = 'token'

export const signToken = (user) =>
  jwt.sign({ sub: String(user.id) }, JWT_SECRET, { algorithm: 'HS256', expiresIn: JWT_EXPIRES_IN })

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })

// httpOnly keeps the JWT out of reach of page JavaScript (XSS).
export const cookieOptions = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 1000,
}
