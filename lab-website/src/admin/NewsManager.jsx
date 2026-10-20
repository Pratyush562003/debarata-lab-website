import { useState } from 'react'
import { useLabData } from '../context/LabDataContext'
import { useConfirm } from '../context/ConfirmModalContext'

const inputStyle = { 
  width: '100%', 
  padding: '0.6rem 0.9rem', 
  border: '1px solid var(--gray-200)', 
  borderRadius: '6px', 
  fontFamily: 'var(--font-body)', 
  fontSize: '0.9rem', 
  boxSizing: 'border-box' 
}

const currentMonthYear = () => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const d = new Date()
  return `${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function NewsManager() {
  const { news, setNews, addNews, updateNews, deleteNews } = useLabData()
  const confirm = useConfirm()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({})
  
  const emptyForm = { 
    title: '', 
    date: currentMonthYear(), 
    type: 'Grant' 
  }

  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const startDrag = (index) => {
    setDraggedIndex(index)
  }

  const dragOver = (e) => {
    e.preventDefault()
  }

  const drop = (targetIndex) => {
    if (draggedIndex === null) return
    if (draggedIndex === targetIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    setNews(prev => {
      const list = [...prev]
      const [moved] = list.splice(draggedIndex, 1)
      list.splice(targetIndex, 0, moved)
      return list
    })

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const startAdd = () => { 
    setForm({ ...emptyForm, date: currentMonthYear() })
    setAdding(true)
    setEditing(null) 
  }
  
  const startEdit = (item) => { 
    setForm({ ...item })
    setEditing(item.id)
    setAdding(false) 
  }
  
  const cancel = () => { 
    setEditing(null)
    setAdding(false) 
  }

  const save = async () => {
    if (!form.title?.trim()) {
      alert('Please enter a title for the news update.')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        date: form.date?.trim() || currentMonthYear(),
        type: form.type || 'General'
      }

      if (adding) {
        if (addNews) {
          await addNews(payload)
        } else {
          setNews(prev => [{ ...payload, id: Date.now() }, ...prev])
        }
      } else {
        if (updateNews) {
          await updateNews(editing, payload)
        } else {
          setNews(prev => prev.map(n => n.id === editing ? { ...payload, id: editing } : n))
        }
      }
      cancel()
    } finally {
      setIsSaving(false)
    }
  }

  const del = async (id) => {
    const ok = await confirm({
      title: 'Delete News Update?',
      message: 'Do you want to delete this news update? This action cannot be undone.',
      confirmText: 'Yes',
      cancelText: 'No'
    })
    if (!ok) return

    if (deleteNews) {
      await deleteNews(id)
    } else {
      setNews(prev => prev.filter(n => n.id !== id))
    }
  }

  const getTypeBadgeStyle = (type) => {
    switch (type) {
      case 'Grant':
        return { background: '#fef3c7', color: '#92400e' }
      case 'Publication':
        return { background: '#dbeafe', color: '#1e40af' }
      case 'Opportunity':
        return { background: '#dcfce7', color: '#166534' }
      case 'Event':
        return { background: '#f3e8ff', color: '#6b21a8' }
      case 'Award':
        return { background: '#ffedd5', color: '#9a3412' }
      default:
        return { background: 'var(--gray-100)', color: 'var(--navy)' }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)' }}>News & Updates</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>
            Announcements, grant awards, accepted papers, and lab opportunities shown on the homepage.
          </p>
        </div>
        <button onClick={startAdd} className="btn btn-primary">+ Add News</button>
      </div>

      {(adding || editing) && (
        <div style={{ background: 'var(--off-white)', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'var(--navy)' }}>
            {adding ? 'Add New Announcement' : 'Edit News Announcement'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: '0.3rem' }}>Headline / Title *</label>
              <input 
                type="text" 
                placeholder="e.g. Lab receives SERB CRG grant for supramolecular drug delivery project"
                value={form.title || ''} 
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                style={inputStyle} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: '0.3rem' }}>Date (e.g. March 2026)</label>
                <input 
                  type="text" 
                  placeholder="Month Year"
                  value={form.date || ''} 
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  style={inputStyle} 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: '0.3rem' }}>Category / Type</label>
                <select 
                  value={form.type || 'Grant'} 
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="Grant">Grant</option>
                  <option value="Publication">Publication</option>
                  <option value="Opportunity">Opportunity</option>
                  <option value="Event">Event</option>
                  <option value="Award">Award</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={save} className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving to Firebase...' : 'Save News'}
            </button>
            <button onClick={cancel} className="btn btn-outline" disabled={isSaving}>Cancel</button>
          </div>
        </div>
      )}

      {news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', border: '1px solid var(--gray-200)', borderRadius: '10px', color: 'var(--gray-500)' }}>
          No news updates yet. Click "+ Add News" to create one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {news.map((item, idx) => (
            <div 
              key={item.id} 
              draggable
              onDragStart={() => startDrag(idx)}
              onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
              onDragOver={dragOver}
              onDrop={() => drop(idx)}
              onDragEnter={() => setDragOverIndex(idx)}
              onDragLeave={() => setDragOverIndex(null)}
              style={{ 
                background: dragOverIndex === idx ? 'rgba(201,168,76,0.1)' : '#fff', 
                border: '1px solid var(--gray-200)', 
                borderRadius: '8px', 
                padding: '1rem 1.25rem', 
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'center',
                opacity: draggedIndex === idx ? 0.4 : 1,
                transition: 'background-color 0.2s',
              }}
            >
              <div 
                style={{
                  cursor: 'grab',
                  padding: '0.5rem 0.25rem',
                  fontSize: '1.25rem',
                  color: 'var(--gray-400)',
                  userSelect: 'none'
                }}
              >
                ⋮⋮
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 600, 
                    padding: '0.2rem 0.55rem', 
                    borderRadius: '4px',
                    ...getTypeBadgeStyle(item.type)
                  }}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{item.date}</span>
                </div>
                <p style={{ fontWeight: 500, color: 'var(--navy)', fontSize: '0.95rem', margin: 0 }}>
                  {item.title}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button 
                  onClick={() => startEdit(item)} 
                  style={{ padding: '0.4rem 0.75rem', border: '1px solid var(--gray-200)', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => del(item.id)} 
                  style={{ padding: '0.4rem 0.75rem', border: '1px solid #fee2e2', borderRadius: '6px', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
