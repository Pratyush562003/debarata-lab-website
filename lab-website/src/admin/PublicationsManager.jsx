import { useState } from 'react'
import { useLabData } from '../context/LabDataContext'
import { useConfirm } from '../context/ConfirmModalContext'

const inputStyle = { width: '100%', padding: '0.6rem 0.9rem', border: '1px solid var(--gray-200)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', boxSizing: 'border-box' }

export default function PublicationsManager() {
  const { publications: pubs, setPublications: setPubs, addPublication, updatePublication, deletePublication } = useLabData()
  const confirm = useConfirm()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [adding, setAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const emptyForm = { title: '', authors: '', journal: '', year: new Date().getFullYear(), volume: '', pages: '', doi: '', type: 'Research Article' }

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

    setPubs(prev => {
      const list = [...prev]
      const [moved] = list.splice(draggedIndex, 1)
      list.splice(targetIndex, 0, moved)
      return list
    })

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const startAdd = () => { setForm(emptyForm); setAdding(true); setEditing(null) }
  const startEdit = (pub) => { setForm({ ...pub }); setEditing(pub.id); setAdding(false) }
  const cancel = () => { setEditing(null); setAdding(false) }

  const save = async () => {
    setIsSaving(true)
    try {
      const payload = { ...form, year: parseInt(form.year) || new Date().getFullYear() }
      if (adding) {
        if (addPublication) {
          await addPublication(payload)
        } else {
          setPubs(p => [...p, { ...payload, id: Date.now() }])
        }
      } else {
        if (updatePublication) {
          await updatePublication(editing, payload)
        } else {
          setPubs(p => p.map(pub => pub.id === editing ? { ...payload, id: editing } : pub))
        }
      }
      cancel()
    } finally {
      setIsSaving(false)
    }
  }

  const deletePub = async (id) => {
    const ok = await confirm({
      title: 'Delete Publication?',
      message: 'Do you want to delete this publication? This action cannot be undone.',
      confirmText: 'Yes',
      cancelText: 'No'
    })
    if (!ok) return

    if (deletePublication) {
      await deletePublication(id)
    } else {
      setPubs(p => p.filter(pub => pub.id !== id))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)' }}>Lab Publications</h2>
        <button onClick={startAdd} className="btn btn-primary">+ Add Publication</button>
      </div>

      {(adding || editing) && (
        <div style={{ background: 'var(--off-white)', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem', color: 'var(--navy)' }}>{adding ? 'Add New' : 'Edit'} Publication</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[['title', 'Title', 'text', '2/3'], ['authors', 'Authors', 'text', '2/3'], ['journal', 'Journal', 'text', null], ['year', 'Year', 'number', null], ['volume', 'Volume', 'text', null], ['pages', 'Pages', 'text', null], ['doi', 'DOI', 'text', null]].map(([key, label, type, span]) => (
              <div key={key} style={{ gridColumn: span || '1/2' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: '0.3rem' }}>{label}</label>
                <input type={type} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1px solid var(--gray-200)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: '0.3rem' }}>Type</label>
              <select value={form.type || ''} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                style={{ width: '100%', padding: '0.6rem 0.9rem', border: '1px solid var(--gray-200)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
                <option>Research Article</option>
                <option>Review</option>
                <option>Communication</option>
                <option>Book Chapter</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button onClick={save} className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving to Firebase...' : 'Save'}
            </button>
            <button onClick={cancel} className="btn btn-outline" disabled={isSaving}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {pubs.map((pub, idx) => (
          <div key={pub.id} 
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
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                <span className={`badge ${pub.type === 'Review' ? 'badge-gold' : 'badge-blue'}`}>{pub.type}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{pub.year}</span>
              </div>
              <p style={{ fontWeight: 500, color: 'var(--navy)', fontSize: '0.92rem', marginBottom: '0.25rem' }}>{pub.title}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{pub.authors} · <em>{pub.journal}</em></p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => startEdit(pub)} style={{ padding: '0.4rem 0.75rem', border: '1px solid var(--gray-200)', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.82rem' }}>Edit</button>
              <button onClick={() => deletePub(pub.id)} style={{ padding: '0.4rem 0.75rem', border: '1px solid #fee2e2', borderRadius: '6px', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: '0.82rem' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
