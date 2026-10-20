import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const ADMIN_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'lab2026'

function getAdminPassword() {
  return localStorage.getItem('lab_admin_pass') || DEFAULT_PASSWORD
}

// Helper to validate JWT structure and expiration
export function isTokenValid(token) {
  if (!token || typeof token !== 'string') return false
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const payload = JSON.parse(atob(parts[1]))
    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return false
    }
    return true
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('lab_token')
    if (!token || !isTokenValid(token)) {
      localStorage.removeItem('lab_token')
      localStorage.removeItem('lab_admin_user')
      return null
    }
    const stored = localStorage.getItem('lab_admin_user')
    return stored ? JSON.parse(stored) : { username: 'admin' }
  })

  const logout = useCallback(() => {
    localStorage.removeItem('lab_admin_user')
    localStorage.removeItem('lab_token')
    localStorage.removeItem('lab_admin_pass')
    sessionStorage.clear()
    setUser(null)

    // Force hard replace to /admin/login to purge memory, React state & bfcache
    if (typeof window !== 'undefined') {
      window.location.replace('/admin/login')
    }
  }, [])

  // Verify token with backend upon initialization
  useEffect(() => {
    const token = localStorage.getItem('lab_token')
    if (token) {
      if (!isTokenValid(token)) {
        logout()
      } else {
        fetch('http://localhost:5000/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            if (!res.ok) logout()
          })
          .catch(() => {
            // Server may be offline; keep local validation
          })
      }
    }
  }, [logout])

  // Cross-tab logout synchronization & storage protection
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'lab_token' && !e.newValue) {
        setUser(null)
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.replace('/admin/login')
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = async (username, password) => {
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) return false

      const { token } = await res.json()
      if (!token || !isTokenValid(token)) return false

      localStorage.setItem('lab_token', token)
      localStorage.setItem('lab_admin_user', JSON.stringify({ username }))
      setUser({ username })
      return true
    } catch {
      return false
    }
  }

  const changePassword = (currentPassword, newPassword) => {
    if (currentPassword === getAdminPassword()) {
      localStorage.setItem('lab_admin_pass', newPassword)
      return true
    }
    return false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, isTokenValid }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
