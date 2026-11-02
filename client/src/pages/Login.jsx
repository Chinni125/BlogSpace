import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import Alert from '../components/Alert'
import { btnPrimary } from '../components/ui'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const from = useLocation().state?.from || '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function onSubmit(e) {
    e.preventDefault()
    setFormError('')
    const v = {}
    if (!form.email.trim()) v.email = 'Email is required'
    if (!form.password) v.password = 'Password is required'
    setErrors(v)
    if (Object.keys(v).length) return
    setSubmitting(true)
    try {
      const d = await login(form)
      setSuccess(`${d.message}. Redirecting...`)
      setTimeout(() => navigate(from, { replace: true }), 700)
    } catch (err) {
      setErrors(err.fieldErrors || {})
      if (!err.fieldErrors || !Object.keys(err.fieldErrors).length) setFormError(err.message)
      setSubmitting(false)
    }
  }

  if (user && !success) return <Navigate to="/" replace />

  return (
    <AuthLayout subtitle="Sign in to continue to Blogspace." title="Welcome back" footer={<>New here? <Link className="font-medium text-ink underline" to="/signup">Create an account</Link></>}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Alert type="success">{success}</Alert>
        <Alert>{formError}</Alert>
        <FormField label="Email" id="email" type="email" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
        <FormField label="Password" id="password" type="password" value={form.password} onChange={onChange} error={errors.password} autoComplete="current-password" />
        <button disabled={submitting || !!success} className={`${btnPrimary} w-full py-2.5`}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}
