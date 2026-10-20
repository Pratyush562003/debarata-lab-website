import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLabData } from '../context/LabDataContext'
import { useConfirm } from '../context/ConfirmModalContext'
import FacilitiesManager from './FacilitiesManager'

const inputStyle = { width: '100%', padding: '0.6rem 0.9rem', border: '1px solid var(--gray-200)', borderRadius: '6px', fontFamily: 'var(--font-body)', fontSize: '0.9rem', boxSizing: 'border-box' }
const labelStyle = { fontSize: '0.78rem', fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: '0.3rem' }
const sectionBox = { background: '#fff', border: '1px solid var(--gray-200)', borderRadius: '10px', padding: '1.5rem', marginBottom: '1.5rem' }

function Field({ label, value, onChange, multiline, placeholder }) {
  return (
    <div style={{ marginBottom: '0.9rem' }}>
      <label style={labelStyle}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={onChange} placeholder={placeholder}
            rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
        : <input value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} />
      }
    </div>
  )
}

export default function ResearchManager() {
  const { research, setResearch, facilities, addResearch, updateResearch, deleteResearch } = useLabData()
  const confirm = useConfirm()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') === 'facilities' ? 'facilities' : 'areas')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'facilities') {
      setActiveTab('facilities')
    } else if (tab === 'areas') {
      setActiveTab('areas')
    }
  }, [searchParams])

  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [canDrag, setCanDrag] = useState(false)

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

    setResearch(prev => {
      const list = [...prev]
      const [moved] = list.splice(draggedIndex, 1)
      list.splice(targetIndex, 0, moved)
      return list
    })

    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleSave = async () => { 
    try {
      if (updateResearch) {
        for (const item of research) {
          if (item.id) {
            await updateResearch(item.id, item)
          }
        }
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Failed to sync research:', err)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  const updateArea = (id, key, val) => {
    setResearch(prev => prev.map(a => a.id === id ? { ...a, [key]: val } : a))
  }

  const addArea = async () => {
    const newArea = {
      title: 'New Research Area',
      description: '',
      icon: '🔬',
      color: '#e0e7ff',
      keywords: []
    }
    if (addResearch) {
      await addResearch(newArea)
    } else {
      setResearch(prev => [...prev, { ...newArea, id: Date.now().toString() }])
    }
  }

  const delArea = async (id) => {
    const ok = await confirm({
      title: 'Remove Research Area?',
      message: 'Do you want to delete this research area? This action cannot be undone.',
      confirmText: 'Yes',
      cancelText: 'No'
    })
    if (!ok) return

    if (deleteResearch) {
      await deleteResearch(id)
    } else {
      setResearch(prev => prev.filter(a => a.id !== id))
    }
  }

  const setKeywords = (id, keywordsStr) => {
    const keywords = keywordsStr.split(',').map(k => k.trim()).filter(k => k)
    updateArea(id, 'keywords', keywords)
  }

  return (
    <div>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
        <button 
          type="button"
          onClick={() => { setActiveTab('areas'); setSearchParams({ tab: 'areas' }) }}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'areas' ? 'var(--navy)' : 'transparent',
            color: activeTab === 'areas' ? '#fff' : 'var(--gray-600)',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.88rem'
          }}
        >
          🔬 Research Areas ({research.length})
        </button>
        <button 
          type="button"
          onClick={() => { setActiveTab('facilities'); setSearchParams({ tab: 'facilities' }) }}
          style={{
            padding: '0.45rem 1rem',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'facilities' ? 'var(--navy)' : 'transparent',
            color: activeTab === 'facilities' ? '#fff' : 'var(--gray-600)',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.88rem'
          }}
        >
          ⚙️ Lab Facilities ({facilities?.length || 0})
        </button>
      </div>

      {activeTab === 'facilities' ? (
        <FacilitiesManager />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)' }}>Research Areas</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {saved && <span style={{ fontSize: '0.83rem', color: '#059669', fontWeight: 600 }}>✓ Changes applied</span>}
              <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
              <a href="/research" target="_blank" rel="noreferrer"
                style={{ fontSize: '0.83rem', color: 'var(--blue)', textDecoration: 'none' }}>↗ View Research Page</a>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
            <button onClick={addArea} className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}>+ Add Area</button>
          </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {research.map((area, idx) => (
          <div key={area.id} 
            draggable={canDrag}
            onDragStart={() => { startDrag(idx); setCanDrag(false); }}
            onDragEnd={() => { setDraggedIndex(null); setCanDrag(false); setDragOverIndex(null); }}
            onDragOver={dragOver}
            onDrop={() => drop(idx)}
            onDragEnter={() => setDragOverIndex(idx)}
            onDragLeave={() => setDragOverIndex(null)}
            style={{ 
              ...sectionBox,
              background: dragOverIndex === idx ? 'rgba(201,168,76,0.1)' : '#fff',
              opacity: draggedIndex === idx ? 0.4 : 1,
              transition: 'background-color 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
              <div 
                style={{
                  cursor: 'grab',
                  padding: '0.5rem 0.25rem',
                  fontSize: '1.25rem',
                  color: 'var(--gray-400)',
                  userSelect: 'none',
                  marginRight: '0.5rem'
                }}
                onMouseDown={() => setCanDrag(true)}
                onMouseUp={() => setCanDrag(false)}
              >
                ⋮⋮
              </div>
              <input value={area.title} onChange={e => updateArea(area.id, 'title', e.target.value)}
                style={{ ...inputStyle, fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)', width: 'auto', flex: 1, marginRight: '1rem' }} />
              <button onClick={() => delArea(area.id)}
                style={{ padding: '0.45rem 0.6rem', border: '1px solid #fee2e2', borderRadius: '6px', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: '0.9rem' }}>✕ Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Icon (Emoji)</label>
                <input value={area.icon} onChange={e => updateArea(area.id, 'icon', e.target.value)} style={{ ...inputStyle, fontSize: '1.5rem', textAlign: 'center' }} />
              </div>
              <div>
                <label style={labelStyle}>Accent Color</label>
                <input type="color" value={area.color || '#e0e7ff'} onChange={e => updateArea(area.id, 'color', e.target.value)} style={{ ...inputStyle, padding: '0 0.5rem', height: '42px', cursor: 'pointer' }} />
              </div>
            </div>
            <Field label="Description" value={area.description} onChange={e => updateArea(area.id, 'description', e.target.value)} multiline />
            <Field label="Keywords (comma-separated)" value={area.keywords?.join(', ')} onChange={e => setKeywords(area.id, e.target.value)} placeholder="Organic synthesis, Catalysis, ..." />
          </div>
        ))}
        {research.length === 0 && <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', textAlign: 'center' }}>No research areas found. Click + Add Area.</p>}
      </div>
      </>
      )}
    </div>
  )
}
