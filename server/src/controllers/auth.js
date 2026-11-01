import bcrypt from 'bcrypt'
import { createUser, findUserByEmail } from '../models/users.js'
import { validateSignup, validateLogin } from '../utils/validate.js'
import { signToken, cookieOptions, COOKIE_NAME } from '../utils/token.js'

const SALT_ROUNDS = 12
// Used to keep login timing similar when the email doesn't exist.
const DUMMY_HASH = bcrypt.hashSync('dummy-password', SALT_ROUNDS)

const publicUser = (u) => ({ id: u.id, username: u.username, email: u.email })

export async function signup(req, res, next) {
  try {
    const errors = validateSignup(req.body || {})
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed', errors })

    const username = req.body.username.trim()
    const email = req.body.email.trim().toLowerCase()
    const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS)

    const user = await createUser({ username, email, passwordHash })
    res.cookie(COOKIE_NAME, signToken(user), cookieOptions)
    res.status(201).json({ message: 'Account created successfully', user: publicUser(user) })
  } catch (err) {
    if (err.code === '23505') {
      const field = err.constraint?.includes('username') ? 'username' : 'email'
      return res.status(409).json({
        error: 'Validation failed',
        errors: { [field]: `That ${field} is already taken` },
      })
    }
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const errors = validateLogin(req.body || {})
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Validation failed', errors })

    const user = await findUserByEmail(req.body.email.trim().toLowerCase())
    const ok = await bcrypt.compare(req.body.password, user ? user.password_hash : DUMMY_HASH)
    if (!user || !ok) return res.status(401).json({ error: 'Invalid email or password' })

    res.cookie(COOKIE_NAME, signToken(user), cookieOptions)
    res.json({ message: 'Logged in successfully', user: publicUser(user) })
  } catch (err) {
    next(err)
  }
}

export function logout(_req, res) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined })
  res.json({ message: 'Logged out' })
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) })
}
