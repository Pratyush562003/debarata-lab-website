import { useState, useEffect, useCallback } from 'react'
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLabData } from '../context/LabDataContext'
import { useConfirm } from '../context/ConfirmModalContext'

import { api } from '../api'

const NAV = [
  { label: 'Dashboard', path: '' },
  { label: 'Messages', path: 'messages' },
  { label: 'About', path: 'about' },
  { label: 'My Research & Publications', path: 'my-research-publications' },
  { label: 'Research', path: 'research' },
  { label: 'Lab Publications', path: 'publications' },
  { label: 'Members', path: 'members' },
  { label: 'News', path: 'news' },
  { label: 'Profile & Settings', path: 'settings' }
]

function Sidebar({ unreadMessagesCount = 0 }) {
  const { labInfo } = useLabData()
  return (
    <div style={{
      width: '220px', minHeight: '100vh', background: 'var(--navy)', flexShrink: 0,
      display: 'flex', flexDirection: 'column', padding: '1.5rem 0',
    }}>
      <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#fff' }}>{labInfo.name}</div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Admin Panel</div>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
        {NAV.map(item => (
          <NavLink key={item.path} to={item.path} end={item.path === ''}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
              padding: '0.55rem 0.75rem', borderRadius: '8px', border: 'none',
              background: isActive ? 'rgba(201,168,76,0.15)' : 'transparent',
              color: isActive ? 'var(--gold-light)' : 'rgba(255,255,255,0.65)',
              fontFamily: 'var(--font-body)', fontSize: '0.88rem', cursor: 'pointer',
              marginBottom: '2px', transition: 'all 0.15s',
              textDecoration: 'none',
              boxSizing: 'border-box'
            })}>
            <span>{item.label}</span>
            {item.path === 'messages' && unreadMessagesCount > 0 && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px',
                height: '20px',
                padding: unreadMessagesCount > 9 ? '0 5px' : '0',
                borderRadius: unreadMessagesCount > 9 ? '10px' : '50%',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                lineHeight: 1,
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.45)',
              }}>
                {unreadMessagesCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '1.25rem', borderTop: `4px solid ${color}` }}>
      <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)' }}>{value}</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

export function DashboardOverview() {
  const { research, publications, members, news, facilities, piResearchPubs, dbConnected, isSyncing, syncDefaultDataToFirebase, refreshData } = useLabData()
  const confirm = useConfirm()
  const [syncMessage, setSyncMessage] = useState('')
  const [messagesStats, setMessagesStats] = useState({ total: 0, unread: 0 })

  useEffect(() => {
    api.getMessages().then(data => {
      if (Array.isArray(data)) {
        setMessagesStats({
          total: data.length,
          unread: data.filter(m => !m.read).length
        })
      }
    }).catch(() => {})
  }, [])

  const handleSync = async () => {
    const ok = await confirm({
      title: 'Upload to Firebase Firestore?',
      message: 'Upload all default publications, members, news, and facilities into Firebase Firestore?',
      confirmText: 'Yes, Upload',
      cancelText: 'No',
      danger: false
    })
    if (!ok) return
    setSyncMessage('Uploading to Firebase Firestore...')
    const success = await syncDefaultDataToFirebase()
    if (success) {
      setSyncMessage('✅ Successfully uploaded data to Firebase Firestore!')
    } else {
      setSyncMessage('❌ Upload failed. Ensure lab-server is running on port 5000.')
    }
    setTimeout(() => setSyncMessage(''), 5000)
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Lab Publications" value={publications.length} color="var(--blue)" />
        <StatCard label="PI's Publications" value={piResearchPubs?.publications?.length || 24} color="#f59e0b" />
        <StatCard label="Lab Members" value={members.length} color="var(--gold)" />
        <StatCard label="Research Areas" value={research.length} color="#10b981" />
        <StatCard label="News Updates" value={news ? news.length : 0} color="#8b5cf6" />
        <StatCard label="Lab Facilities" value={facilities ? facilities.length : 0} color="#0284c7" />
        <StatCard 
          label={messagesStats.unread > 0 ? `Inquiries (${messagesStats.unread} New)` : "Inquiries Received"} 
          value={messagesStats.total} 
          color="#ec4899" 
        />
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ 
                display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', 
                backgroundColor: dbConnected ? '#22c55e' : '#ef4444' 
              }}></span>
              <strong style={{ fontSize: '1rem', color: 'var(--navy)' }}>
                {dbConnected ? '🔥 Firebase Firestore Connected' : '⚠️ Backend Server Not Detected (Port 5000)'}
              </strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.35rem', marginBottom: 0 }}>
              {dbConnected 
                ? 'Your website is live-synced with Firebase Firestore. Any changes made in Publications or Members are saved directly to Firebase.' 
                : 'Start the server with "npm run dev" in the lab-server directory to enable saving to Firebase.'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={refreshData}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              🔄 Refresh
            </button>
            <button 
              onClick={handleSync}
              disabled={isSyncing || !dbConnected}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              {isSyncing ? '⏳ Syncing...' : '🚀 Upload Initial Data to Firebase'}
            </button>
          </div>
        </div>

        {syncMessage && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem 1rem', 
            borderRadius: '6px', 
            fontSize: '0.85rem',
            background: syncMessage.startsWith('✅') ? '#dcfce7' : '#fee2e2',
            color: syncMessage.startsWith('✅') ? '#166534' : '#b91c1c'
          }}>
            {syncMessage}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await api.getMessages()
      if (Array.isArray(data)) {
        setUnreadCount(data.filter(m => !m.read).length)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 10000)
    return () => clearInterval(interval)
  }, [fetchUnreadCount])

  const handleLogout = () => {
    logout()
  }

  const getActiveTitle = () => {
    const parts = location.pathname.split('/').filter(Boolean)
    const last = parts[parts.length - 1]
    if (!last || last === 'dashboard') return 'Dashboard'
    if (last === 'settings') return 'Profile & Settings'
    if (last === 'messages') return 'Messages & Inquiries'
    if (last === 'my-research-publications') return 'My Research & Publications'
    if (last === 'publications') return 'Lab Publications'
    return last.charAt(0).toUpperCase() + last.slice(1)
  }

  const activeTitle = getActiveTitle()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--off-white)', fontFamily: 'var(--font-body)' }}>
      <Sidebar unreadMessagesCount={unreadCount} />

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--navy)' }}>{activeTitle}</h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>Logged in as <strong>{user?.username || 'admin'}</strong></span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid var(--gray-200)',
                borderRadius: '6px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.78rem',
                color: '#ef4444',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <Outlet context={{ unreadCount, refreshUnreadCount: fetchUnreadCount }} />
      </main>
    </div>
  )
}
