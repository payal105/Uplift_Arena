import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('dev_admin')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (token, adminData) => {
    localStorage.setItem('dev_token', token)
    localStorage.setItem('dev_admin', JSON.stringify(adminData))
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem('dev_token')
    localStorage.removeItem('dev_admin')
    setAdmin(null)
  }

  const isAuthenticated = !!admin && !!localStorage.getItem('dev_token')

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
