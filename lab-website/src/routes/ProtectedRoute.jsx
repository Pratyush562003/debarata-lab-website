import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, isTokenValid, logout } = useAuth()
  const location = useLocation()
  const token = typeof window !== 'undefined' ? localStorage.getItem('lab_token') : null

  // Guard against browser Back-Forward cache (bfcache) restoration
  useEffect(() => {
    const handlePageShow = (e) => {
      const currentToken = localStorage.getItem('lab_token')
      if (e.persisted || !currentToken || (isTokenValid && !isTokenValid(currentToken))) {
        if (logout) {
          logout()
        } else {
          window.location.replace('/admin/login')
        }
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [isTokenValid, logout])

  // Check both user state and valid storage token
  const hasValidAuth = Boolean(user && token && (!isTokenValid || isTokenValid(token)))

  if (!hasValidAuth) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
