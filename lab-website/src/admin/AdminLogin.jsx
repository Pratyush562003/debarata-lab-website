import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLabData } from '../context/LabDataContext'

export default function AdminLogin() {
  const { labInfo } = useLabData()
  const [creds, setCreds] = useState({ username: 'admin', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login, isTokenValid } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If already authenticated with a valid token, go directly to dashboard
    const token = localStorage.getItem('lab_token')
    if (token && isTokenValid && isTokenValid(token)) {
      navigate('/admin/dashboard', { replace: true })
      return
    }

    // Trap browser history: push a state so that clicking Back ("undo") or Forward ("redo")
    // keeps the user securely on the login screen instead of traversing back to cached admin pages
    window.history.pushState(null, '', window.location.href)
    const onPopState = () => {
      window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [navigate, isTokenValid])

  const handleLogin = async () => {
    setError('')
    const success = await login(creds.username, creds.password)
    if (success) {
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError('Invalid username or password.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--navy)', fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '380px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '0.25rem' }}>
            {labInfo?.name || 'Debarata Lab'}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>Admin Dashboard</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>Username</label>
            <input
              type="text"
              placeholder="admin"
              value={creds.username}
              onChange={e => setCreds(c => ({ ...c, username: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width: '100%', padding: '0.7rem 1rem', borderRadius: '8px',
                border: '1px solid var(--gray-200)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-700)', display: 'block', marginBottom: '0.35rem' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={creds.password}
                onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{
                  width: '100%', padding: '0.7rem 2.5rem 0.7rem 1rem', borderRadius: '8px',
                  border: '1px solid var(--gray-200)', fontFamily: 'var(--font-body)', fontSize: '0.95rem',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.75rem', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: 0, color: '#6b7280', outline: 'none', zIndex: 10
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.6rem 1rem', borderRadius: '6px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button onClick={handleLogin} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            Sign In →
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>← Back to Website</a>
        </div>
      </div>
    </div>
  )
}
