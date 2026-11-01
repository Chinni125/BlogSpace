import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../services/api'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.fetchMe().then((d) => setUser(d.user)).catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])

  const signup = async (payload) => { const d = await api.signup(payload); setUser(d.user); return d }
  const login = async (payload) => { const d = await api.login(payload); setUser(d.user); return d }
  const logout = async () => { await api.logout(); setUser(null) }

  return <AuthContext.Provider value={{ user, loading, signup, login, logout }}>{children}</AuthContext.Provider>
}
