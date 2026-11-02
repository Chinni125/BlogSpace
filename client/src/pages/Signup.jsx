import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import Alert from '../components/Alert'
import { btnPrimary } from '../components/ui'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ username, email, password }) {
  const e = {}
  if (!/^[A-Za-z0-9_]{3,30}$/.test(username.trim())) e.username = 'Username must be 3-30 characters: letters, numbers, underscores'
  if (!EMAIL_RE.test(email.trim())) e.email = 'Enter a valid email address'
  if (password.length < 8) e.password = 'Password must be at least 8 characters'
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) e.password = 'Password must contain a letter and a number'
  return e
}

export default function Signup() {
  const { signup, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function onSubmit(e) {
    e.preventDefault()
    setFormError('')
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length) return
    setSubmitting(true)
    try {
      const d = await signup(form)
      setSuccess(`${d.message}. Redirecting...`)
      setTimeout(() => navigate('/', { replace: true }), 900)
    } catch (err) {
      setErrors(err.fieldErrors || {})
      if (!err.fieldErrors || !Object.keys(err.fieldErrors).length) setFormError(err.message)
      setSubmitting(false)
    }
  }

  if (user && !success) return <Navigate to="/" replace />

  return (
    <AuthLayout subtitle="Join Blogspace and start writing." title="Join Blogspace" footer={<>Already have an account? <Link className="font-medium text-ink underline" to="/login">Sign in</Link></>}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Alert type="success">{success}</Alert>
        <Alert>{formError}</Alert>
        <FormField label="Username" id="username" value={form.username} onChange={onChange} error={errors.username} autoComplete="username" />
        <FormField label="Email" id="email" type="email" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
        <FormField label="Password" id="password" type="password" value={form.password} onChange={onChange} error={errors.password} autoComplete="new-password" />
        <button disabled={submitting || !!success} className={`${btnPrimary} w-full py-2.5`}>
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
    </AuthLayout>
  )
}
