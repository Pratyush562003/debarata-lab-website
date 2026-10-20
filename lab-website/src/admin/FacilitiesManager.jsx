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

const COMMON_ICONS = ['⚙️', '🔬', '⚡', '🧪', '📡', '🔍', '💻', '💡']

export default function FacilitiesManager() {
  const { facilities, setFacilities, addFacility, updateFacility, deleteFacility } = useLabData()
  const confirm = useConfirm()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({})

  const emptyForm = { 
    name: '', 
    icon: '⚙️', 
    description: '' 
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

    setFacilities(prev => {
      const list = [...prev]
      const [moved] = list.splice(draggedIndex, 1)
      list.splice(targetIndex, 0, moved)
      return list
    })

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const moveItem = (index, direction) => {
    setFacilities(prev => {
      const target = index + direction
      if (target < 0 || target >= prev.length) return prev
      const list = [...prev]
      const [item] = list.splice(index, 1)
      list.splice(target, 0, item)
      return list
    })
  }

  const startAdd = () => { 
    setForm(emptyForm)
    setAdding(true)
    setEditing(null) 
  }

  const startEdit = (item) => { 
    setForm({ 
      name: item.name || (typeof item === 'string' ? item : ''),
      icon: item.icon || '⚙️',
      description: item.description || ''
    })
    setEditing(item.id || item.name)
    setAdding(false) 
  }

  const cancel = () => { 
    setEditing(null)
    setAdding(false) 
  }

  const save = async () => {
    if (!form.name?.trim()) {
      alert('Please enter a facility / equipment name.')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        icon: form.icon?.trim() || '⚙️',
        description: form.description?.trim() || ''
      }

      if (adding) {
        if (addFacility) {
          await addFacility(payload)
        } else {
          setFacilities(prev => [...prev, { ...payload, id: Date.now().toString() }])
        }
      } else {
        if (updateFacility) {
          await updateFacility(editing, payload)
        } else {
          setFacilities(prev => prev.map(f => (f.id === editing || f.name === editing) ? { ...payload, id: editing } : f))
        }
      }
      cancel()
    } finally {
      setIsSaving(false)
    }
  }

  const del = async (id) => {
    const ok = await confirm({
      title: 'Delete Facility?',
      message: 'Do you want to delete this facility? This action cannot be undone.',
      confirmText: 'Yes',
      cancelText: 'No'
    })
    if (!ok) return

    if (deleteFacility) {
      await deleteFacility(id)
    } else {
      setFacilities(prev => prev.filter(f => f.id !== id && f.name !== id))
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)' }}>Lab Facilities & Instrumentation</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>
            Equipment and instrumentation displayed in the Lab Facilities section of the Research page.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a href="/research" target="_blank" rel="noreferrer"
            style={{ fontSize: '0.83rem', color: 'var(--blue)', textDecoration: 'none' }}>↗ View Research Page</a>
          <button onClick={startAdd} className="btn btn-primary">+ Add Facility</button>
        </div>
      </div>

      {(adding || editing) && (
        <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(13,27,42,0.06)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.25rem', color: 'var(--navy)', fontSize: '1.15rem' }}>
            {adding ? 'Add New Facility / Instrument' : 'Edit Facility'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: '0.3rem' }}>Icon</label>
              <input 
                type="text" 
                value={form.icon || '⚙️'} 
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                style={{ ...inputStyle, textAlign: 'center', fontSize: '1.3rem' }} 
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: '0.3rem' }}>Instrument / Facility Name *</label>
              <input 
                type="text" 
                placeholder="e.g. NMR Spectrometer (400 MHz)"
                value={form.name || ''} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={inputStyle} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: '0.3rem' }}>
              Specifications / Short Description (optional)
            </label>
            <input 
              type="text" 
              placeholder="e.g. 400 MHz multinuclear probe for 1H, 13C, 31P analysis"
              value={form.description || ''} 
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              style={inputStyle} 
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginRight: '0.5rem' }}>Quick Icons:</span>
            {COMMON_ICONS.map(ic => (
              <button 
                key={ic} 
                type="button" 
                onClick={() => setForm(f => ({ ...f, icon: ic }))}
                style={{ border: '1px solid var(--gray-200)', background: form.icon === ic ? 'rgba(201,168,76,0.2)' : '#fff', borderRadius: '4px', padding: '0.2rem 0.5rem', marginRight: '0.35rem', cursor: 'pointer', fontSize: '1rem' }}
              >
                {ic}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={save} className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Facility'}
            </button>
            <button onClick={cancel} className="btn btn-outline" disabled={isSaving}>Cancel</button>
          </div>
        </div>
      )}

      {facilities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', border: '1px solid var(--gray-200)', borderRadius: '10px', color: 'var(--gray-500)' }}>
          No facilities added yet. Click "+ Add Facility" to add one.
        </div>
      ) : (
        <div style={{
          background: '#fff',
          border: '1px solid var(--gray-200)',
          borderRadius: '10px',
          padding: '1.25rem',
          boxShadow: '0 2px 10px rgba(13, 27, 42, 0.04)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)', letterSpacing: '0.04em' }}>
                INSTRUMENTS & FACILITIES CATALOG
              </span>
              <span style={{
                background: 'rgba(13, 27, 42, 0.08)',
                color: 'var(--navy)',
                padding: '0.15rem 0.55rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {facilities.length} Total
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>
              Drag ⋮⋮ or use ▲▼ to reorder
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {facilities.map((fac, idx) => {
              const facId = fac.id || fac.name || String(idx)
              const facName = fac.name || (typeof fac === 'string' ? fac : 'Equipment')
              const facIcon = fac.icon || '⚙️'

              return (
                <div 
                  key={facId}
                  draggable
                  onDragStart={() => startDrag(idx)}
                  onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                  onDragOver={dragOver}
                  onDrop={() => drop(idx)}
                  onDragEnter={() => setDragOverIndex(idx)}
                  onDragLeave={() => setDragOverIndex(null)}
                  style={{
                    background: dragOverIndex === idx ? 'rgba(201,168,76,0.1)' : '#fafafa',
                    border: '1px solid var(--gray-200)',
                    borderRadius: '8px',
                    padding: '0.85rem 1.15rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    opacity: draggedIndex === idx ? 0.4 : 1,
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                    <div 
                      style={{
                        cursor: 'grab',
                        padding: '0.2rem',
                        fontSize: '1.15rem',
                        color: 'var(--gray-400)',
                        userSelect: 'none',
                        flexShrink: 0
                      }}
                      title="Drag to reorder"
                    >
                      ⋮⋮
                    </div>

                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--gold)',
                      background: 'rgba(201, 168, 76, 0.12)',
                      border: '1px solid rgba(201, 168, 76, 0.3)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      flexShrink: 0
                    }}>
                      #{idx + 1}
                    </span>

                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: '#fff',
                      border: '1px solid var(--gray-200)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem',
                      flexShrink: 0
                    }}>
                      {facIcon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600,
                        color: 'var(--navy)',
                        fontSize: '0.96rem',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        lineHeight: 1.4
                      }}>
                        {facName}
                      </div>
                      {fac.description && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginTop: '0.2rem', whiteSpace: 'normal' }}>
                          {fac.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => moveItem(idx, -1)}
                      disabled={idx === 0}
                      style={{
                        padding: '0.3rem 0.55rem',
                        border: '1px solid var(--gray-200)',
                        borderRadius: '5px',
                        background: '#fff',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '0.75rem',
                        opacity: idx === 0 ? 0.35 : 1
                      }}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(idx, 1)}
                      disabled={idx === facilities.length - 1}
                      style={{
                        padding: '0.3rem 0.55rem',
                        border: '1px solid var(--gray-200)',
                        borderRadius: '5px',
                        background: '#fff',
                        cursor: idx === facilities.length - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '0.75rem',
                        opacity: idx === facilities.length - 1 ? 0.35 : 1
                      }}
                      title="Move Down"
                    >
                      ▼
                    </button>
                    <button 
                      onClick={() => startEdit(fac)} 
                      style={{
                        padding: '0.35rem 0.75rem',
                        border: '1px solid var(--gray-200)',
                        borderRadius: '5px',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: 'var(--navy)'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => del(facId)} 
                      style={{
                        padding: '0.35rem 0.75rem',
                        border: '1px solid #fee2e2',
                        borderRadius: '5px',
                        background: '#fff',
                        color: '#b91c1c',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 500
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
