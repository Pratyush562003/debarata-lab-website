import { useState, useEffect, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { api } from '../api'
import { useConfirm } from '../context/ConfirmModalContext'

export default function MessagesManager() {
  const outletContext = useOutletContext()
  const confirm = useConfirm()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'unread' | 'read'
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const fetchMessages = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getMessages()
      setMessages(Array.isArray(data) ? data : [])
      outletContext?.refreshUnreadCount?.()
    } catch (err) {
      console.error('Error loading messages:', err)
      setError('Could not load messages from server. Make sure the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleToggleRead = async (msg) => {
    const nextRead = !msg.read
    setActionLoadingId(msg.id)
    try {
      await api.markMessageRead(msg.id, nextRead)
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: nextRead } : m))
      outletContext?.refreshUnreadCount?.()
    } catch (err) {
      alert('Could not update status: ' + err.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Message?',
      message: 'Are you sure you want to delete this message? This action cannot be undone.',
      confirmText: 'Yes',
      cancelText: 'No'
    })
    if (!ok) return
    setActionLoadingId(id)
    try {
      await api.deleteMessage(id)
      setMessages(prev => prev.filter(m => m.id !== id))
      outletContext?.refreshUnreadCount?.()
    } catch (err) {
      alert('Could not delete message: ' + err.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  const unreadCount = useMemo(() => {
    return messages.filter(m => !m.read).length
  }, [messages])

  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      // Filter by read / unread
      if (filter === 'unread' && m.read) return false
      if (filter === 'read' && !m.read) return false

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase()
        const name = (m.name || '').toLowerCase()
        const email = (m.email || '').toLowerCase()
        const subject = (m.subject || '').toLowerCase()
        const message = (m.message || '').toLowerCase()
        return name.includes(q) || email.includes(q) || subject.includes(q) || message.includes(q)
      }
      return true
    })
  }, [messages, filter, search])

  const formatDate = (isoStr) => {
    if (!isoStr) return 'Just now'
    try {
      const d = new Date(isoStr)
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return isoStr
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Banner & Stats */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--gray-200)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>
            Inquiries & Contact Messages
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', margin: 0 }}>
            Messages received through the Contact page from prospective students, researchers, and visitors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{
            background: unreadCount > 0 ? 'rgba(37, 99, 235, 0.1)' : 'var(--gray-100)',
            color: unreadCount > 0 ? 'var(--blue)' : 'var(--gray-500)',
            padding: '0.4rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 600
          }}>
            {unreadCount} Unread {unreadCount === 1 ? 'Message' : 'Messages'}
          </div>
          <button
            onClick={fetchMessages}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.95rem' }}
            disabled={loading}
          >
            {loading ? '⏳' : '🔄'} Refresh
          </button>
        </div>
      </div>

      {/* Controls: Search and Filters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'all', label: `All (${messages.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'read', label: `Read (${messages.length - unreadCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: filter === tab.id ? 'var(--navy)' : 'var(--gray-200)',
                background: filter === tab.id ? 'var(--navy)' : '#fff',
                color: filter === tab.id ? '#fff' : 'var(--gray-700)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ minWidth: '260px', flex: '1', maxWidth: '360px' }}>
          <input
            type="text"
            placeholder="🔍 Search by name, email, or message..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              border: '1px solid var(--gray-200)',
              fontSize: '0.85rem',
              outline: 'none',
              background: '#fff'
            }}
          />
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>Loading messages from database...</p>
        </div>
      ) : error ? (
        <div style={{
          padding: '2rem',
          background: '#fee2e2',
          borderRadius: '12px',
          border: '1px solid #fecaca',
          color: '#991b1b',
          textAlign: 'center'
        }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>⚠️ Connection Error</p>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchMessages} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            Try Again
          </button>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: '#fff',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📬</div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: '1.3rem', marginBottom: '0.35rem' }}>
            {search ? 'No Matching Messages' : filter === 'unread' ? 'All Caught Up!' : 'No Messages Yet'}
          </h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
            {search 
              ? `No messages matched "${search}". Try clearing your search.` 
              : filter === 'unread' 
                ? 'You have read all received inquiries.' 
                : 'When prospective students or collaborators submit the contact form, their inquiries will appear here.'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="btn btn-outline"
              style={{ marginTop: '1rem', fontSize: '0.85rem' }}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredMessages.map(msg => {
            const isUnread = !msg.read
            const replySubject = msg.subject ? `Re: ${msg.subject}` : 'Re: Inquiry'
            const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.email)}&su=${encodeURIComponent(replySubject)}`

            return (
              <div
                key={msg.id}
                style={{
                  background: '#fff',
                  border: isUnread ? '1.5px solid var(--blue)' : '1px solid var(--gray-200)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: isUnread ? '0 4px 16px rgba(37, 99, 235, 0.08)' : '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {/* Header row: Sender info & status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {isUnread && (
                      <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--blue)',
                        flexShrink: 0
                      }} />
                    )}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
                      {msg.name || 'Anonymous Student'}
                    </h3>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px',
                      background: isUnread ? 'rgba(37, 99, 235, 0.12)' : 'var(--gray-100)',
                      color: isUnread ? 'var(--blue)' : 'var(--gray-500)',
                    }}>
                      {isUnread ? '● NEW' : 'READ'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    🕒 {formatDate(msg.createdAt)}
                  </div>
                </div>

                {/* Sender Email & Subject */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '0.85rem', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-700)' }}>
                    <strong>Email:</strong>
                    <a
                      href={gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--blue)', textDecoration: 'underline' }}
                      title="Click to draft a reply in Gmail"
                    >
                      {msg.email}
                    </a>
                  </div>

                  {msg.subject && (
                    <div style={{ color: 'var(--gray-700)' }}>
                      <strong>Subject:</strong> <span style={{ color: 'var(--navy)', fontWeight: 600 }}>{msg.subject}</span>
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid var(--gray-200)',
                  borderRadius: '8px',
                  padding: '1rem 1.25rem',
                  marginBottom: '1rem',
                  fontSize: '0.93rem',
                  lineHeight: 1.65,
                  color: 'var(--gray-700)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {msg.message || '(No message content)'}
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--gray-100)' }}>
                  {/* Recipient note */}
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
                    Delivered to: {Array.isArray(msg.recipients) ? msg.recipients.join(', ') : 'Lab Admin'}
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <a
                      href={gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
                    >
                      ✉ Reply in Gmail
                    </a>

                    <button
                      onClick={() => handleToggleRead(msg)}
                      disabled={actionLoadingId === msg.id}
                      className="btn btn-outline"
                      style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
                    >
                      {msg.read ? 'Mark as Unread' : '✓ Mark as Read'}
                    </button>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={actionLoadingId === msg.id}
                      style={{
                        padding: '0.4rem 0.75rem',
                        border: '1px solid #fee2e2',
                        borderRadius: '6px',
                        background: '#fff',
                        color: '#dc2626',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      title="Delete message"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
