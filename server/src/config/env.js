import 'dotenv/config'

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set in .env (at least 32 characters)')
}

export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
export const IS_PROD = process.env.NODE_ENV === 'production'
