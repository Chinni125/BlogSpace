import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { btnPrimary } from './ui'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  async function onLogout() {
    close()
    try { await logout() } finally { navigate('/') }
  }

  const link = 'text-sm text-muted transition hover:text-ink'
  const items = user ? (
    <>
      <NavLink to="/posts/new" onClick={close} className={link}>✎ Write</NavLink>
      <span className="text-sm text-muted">{user.username}</span>
      <button onClick={onLogout} className={`${link} text-left`}>Log out</button>
    </>
  ) : (
    <>
      <Link to="/login" onClick={close} className={link}>Sign in</Link>
      <Link to="/signup" onClick={close} className={btnPrimary}>Get started</Link>
    </>
  )

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link to="/" onClick={close} className="font-serif text-2xl font-bold tracking-tight">BlogSpace</Link>

        <div className="hidden items-center gap-6 sm:flex">{items}</div>

        <button
          className="rounded-md p-2 sm:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>
      {open && <div className="flex flex-col items-start gap-4 border-t border-line px-4 py-4 sm:hidden">{items}</div>}
    </header>
  )
}
