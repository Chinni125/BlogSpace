const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateSignup({ username, email, password }) {
  const errors = {}
  if (typeof username !== 'string' || !/^[A-Za-z0-9_]{3,30}$/.test(username.trim()))
    errors.username = 'Username must be 3-30 characters: letters, numbers, underscores'
  if (typeof email !== 'string' || email.length > 255 || !EMAIL_RE.test(email.trim()))
    errors.email = 'Enter a valid email address'
  if (typeof password !== 'string' || password.length < 8 || password.length > 72)
    errors.password = 'Password must be 8-72 characters'
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
    errors.password = 'Password must contain at least one letter and one number'
  return errors
}

export function validateLogin({ email, password }) {
  const errors = {}
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address'
  if (typeof password !== 'string' || !password) errors.password = 'Password is required'
  return errors
}
