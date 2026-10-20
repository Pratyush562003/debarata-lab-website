import { useState } from 'react'
import { useLabData } from '../context/LabDataContext'

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

export default function AboutManager() {
  const { labInfo, setLabInfo, piInfo, setPiInfo, updateAbout } = useLabData()
  const [saved, setSaved] = useState(false)

  const setLab = (key, val) => setLabInfo(prev => ({ ...prev, [key]: val }))
  const setPi  = (key, val) => setPiInfo(prev => ({ ...prev, [key]: val }))

  // Education
  const setEdu = (i, key, val) => setPiInfo(prev => {
    const edu = prev.education.map((e, idx) => idx === i ? { ...e, [key]: val } : e)
    return { ...prev, education: edu }
  })
  const addEdu = () => setPiInfo(prev => ({ ...prev, education: [...prev.education, { degree: '', institution: '', year: '' }] }))
  const delEdu = (i) => setPiInfo(prev => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }))

  // Awards
  const setAward = (i, val) => setPiInfo(prev => {
    const awards = prev.awards.map((a, idx) => idx === i ? val : a)
    return { ...prev, awards }
  })
  const addAward = () => setPiInfo(prev => ({ ...prev, awards: [...prev.awards, ''] }))
  const delAward = (i) => setPiInfo(prev => ({ ...prev, awards: prev.awards.filter((_, idx) => idx !== i) }))

  const DEFAULT_VALUES = [
    { icon: '🔭', title: 'Curiosity', text: 'We ask bold questions at the edge of known science.' },
    { icon: '🤝', title: 'Collaboration', text: 'Chemistry thrives at disciplinary intersections.' },
    { icon: '🌱', title: 'Mentorship', text: 'Nurturing scientists at every stage of their career.' },
    { icon: '🌍', title: 'Impact', text: 'Our work addresses real challenges in health and environment.' },
  ]

  const setVal = (i, key, val) => setLabInfo(prev => {
    const values = (prev.values || DEFAULT_VALUES).map((v, idx) => idx === i ? { ...v, [key]: val } : v)
    return { ...prev, values }
  })
  const addVal = () => setLabInfo(prev => {
    const values = prev.values || DEFAULT_VALUES
    return { ...prev, values: [...values, { icon: '✨', title: 'New Value', text: '' }] }
  })
  const delVal = (i) => setLabInfo(prev => {
    const values = prev.values || DEFAULT_VALUES
    return { ...prev, values: values.filter((_, idx) => idx !== i) }
  })

  // Drag and Drop reordering states and handlers
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)
  const [canDrag, setCanDrag] = useState(false)

  const startDrag = (type, index) => {
    setDraggedItem({ type, index })
  }

  const dragOver = (e) => {
    e.preventDefault()
  }

  const drop = (type, targetIndex) => {
    if (!draggedItem || draggedItem.type !== type) return
    const sourceIndex = draggedItem.index
    if (sourceIndex === targetIndex) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    if (type === 'edu') {
      setPiInfo(prev => {
        const list = [...prev.education]
        const [moved] = list.splice(sourceIndex, 1)
        list.splice(targetIndex, 0, moved)
        return { ...prev, education: list }
      })
    } else if (type === 'award') {
      setPiInfo(prev => {
        const list = [...prev.awards]
        const [moved] = list.splice(sourceIndex, 1)
        list.splice(targetIndex, 0, moved)
        return { ...prev, awards: list }
      })
    } else if (type === 'value') {
      setLabInfo(prev => {
        const list = [...(prev.values || DEFAULT_VALUES)]
        const [moved] = list.splice(sourceIndex, 1)
        list.splice(targetIndex, 0, moved)
        return { ...prev, values: list }
      })
    }

    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleSave = async () => {
    try {
      if (updateAbout) {
        const { email, alternateEmail, phone, alternatePhone, address, ...cleanLabInfo } = labInfo
        await updateAbout({
          ...cleanLabInfo,
          education: piInfo.education,
          awards: piInfo.awards
        })
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to sync about info to database:', err)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)' }}>About Page</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {saved && <span style={{ fontSize: '0.83rem', color: '#059669', fontWeight: 600 }}>✓ Changes applied to About page</span>}
          <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
          <a href="/about" target="_blank" rel="noreferrer"
            style={{ fontSize: '0.83rem', color: 'var(--blue)', textDecoration: 'none' }}>↗ View About Page</a>
        </div>
      </div>

      {/* Lab Info */}
      <div style={sectionBox}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: '1.25rem', fontSize: '1.05rem' }}>Lab Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
          <Field label="Lab Name (short)" value={labInfo.name} onChange={e => setLab('name', e.target.value)} />
          <Field label="Lab Full Name" value={labInfo.fullName} onChange={e => setLab('fullName', e.target.value)} />
          <Field label="University" value={labInfo.university} onChange={e => setLab('university', e.target.value)} />
          <Field label="Department" value={labInfo.department} onChange={e => setLab('department', e.target.value)} />
          <div style={{ gridColumn: '1/-1' }}>
            <Field label="Tagline / Research Focus" value={labInfo.tagline} onChange={e => setLab('tagline', e.target.value)} />
          </div>
        </div>
        <Field label="Lab Description" value={labInfo.description} onChange={e => setLab('description', e.target.value)} multiline />
        <div style={{ marginTop: '0.85rem', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--gray-200)', fontSize: '0.82rem', color: 'var(--gray-600)' }}>
          ℹ️ Lab Contact details (Primary &amp; Alternate Email, Phone, Address) are centrally configured in <a href="/admin/settings" style={{ color: 'var(--blue)', fontWeight: 600 }}>Settings &gt; Contact Details</a> to keep the Contact page and website footer in sync.
        </div>
      </div>

      {/* PI Info */}
      <div style={sectionBox}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: '1.25rem', fontSize: '1.05rem' }}>Principal Investigator</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
          <Field label="Full Name" value={piInfo.name} onChange={e => setPi('name', e.target.value)} />
          <Field label="Title / Position" value={piInfo.title} onChange={e => setPi('title', e.target.value)} />
          <div style={{ gridColumn: '1/-1' }}>
            <label style={labelStyle}>PI Photo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.9rem' }}>
              {/* Preview */}
              <div style={{
                width: '84px', height: '84px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--gray-100)', border: '2px solid var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              }}>
                {(piInfo.photo || '/pi-photo.png')
                   ? <img src={piInfo.photo || '/pi-photo.png'} alt="PI" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <span style={{ fontSize: '2.2rem' }}>👨‍🔬</span>
                }
              </div>
              {/* Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', borderRadius: '7px', cursor: 'pointer',
                  background: 'var(--navy)', color: '#fff', fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                }}>
                  📁 Choose Photo
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = ev => setPi('photo', ev.target.result)
                      reader.readAsDataURL(file)
                    }}
                  />
                </label>
                {piInfo.photo && (
                  <button onClick={() => setPi('photo', null)}
                    style={{ padding: '0.4rem 0.75rem', border: '1px solid #fee2e2', borderRadius: '7px', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: '0.82rem' }}>
                    ✕ Remove Photo
                  </button>
                )}
                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>JPG, PNG or WebP recommended</span>
              </div>
            </div>
          </div>
        </div>
        <Field label="Biography" value={piInfo.bio} onChange={e => setPi('bio', e.target.value)} multiline />
      </div>

      {/* Education */}
      <div style={sectionBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: '1.05rem' }}>Education</h3>
          <button onClick={addEdu} className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}>+ Add Entry</button>
        </div>
        {piInfo.education.map((edu, i) => (
          <div key={i} 
            draggable={canDrag}
            onDragStart={() => { startDrag('edu', i); setCanDrag(false); }}
            onDragEnd={() => { setDraggedItem(null); setCanDrag(false); setDragOverItem(null); }}
            onDragOver={dragOver}
            onDrop={() => drop('edu', i)}
            onDragEnter={() => setDragOverItem({ type: 'edu', index: i })}
            onDragLeave={() => setDragOverItem(null)}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'auto 1fr 1fr auto auto', 
              gap: '0.6rem', 
              alignItems: 'end', 
              marginBottom: '0.75rem',
              opacity: draggedItem?.type === 'edu' && draggedItem?.index === i ? 0.4 : 1,
              background: dragOverItem?.type === 'edu' && dragOverItem?.index === i ? 'rgba(201,168,76,0.1)' : 'transparent',
              transition: 'background-color 0.2s',
              borderRadius: '6px',
              padding: '0.25rem 0.5rem'
            }}
          >
            <div 
              style={{
                cursor: 'grab',
                padding: '0.5rem 0.25rem',
                fontSize: '1.25rem',
                color: 'var(--gray-400)',
                userSelect: 'none',
                alignSelf: 'end',
                marginBottom: '10px'
              }}
              onMouseDown={() => setCanDrag(true)}
              onMouseUp={() => setCanDrag(false)}
            >
              ⋮⋮
            </div>
            <div>
              <label style={labelStyle}>Degree</label>
              <input value={edu.degree} onChange={e => setEdu(i, 'degree', e.target.value)} style={inputStyle} placeholder="PhD in Chemistry" />
            </div>
            <div>
              <label style={labelStyle}>Institution</label>
              <input value={edu.institution} onChange={e => setEdu(i, 'institution', e.target.value)} style={inputStyle} placeholder="IIT Bombay" />
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <input value={edu.year} onChange={e => setEdu(i, 'year', e.target.value)} style={{ ...inputStyle, width: '90px' }} placeholder="2005" />
            </div>
            <button onClick={() => delEdu(i)}
              style={{ padding: '0.5rem 0.6rem', border: '1px solid #fee2e2', borderRadius: '6px', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: '0.9rem', alignSelf: 'flex-end' }}>✕</button>
          </div>
        ))}
        {piInfo.education.length === 0 && <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)' }}>No education entries. Click + Add Entry.</p>}
      </div>

      {/* Awards */}
      <div style={sectionBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: '1.05rem' }}>Awards & Honours</h3>
          <button onClick={addAward} className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}>+ Add Award</button>
        </div>
        {piInfo.awards.map((award, i) => (
          <div key={i} 
            draggable={canDrag}
            onDragStart={() => { startDrag('award', i); setCanDrag(false); }}
            onDragEnd={() => { setDraggedItem(null); setCanDrag(false); setDragOverItem(null); }}
            onDragOver={dragOver}
            onDrop={() => drop('award', i)}
            onDragEnter={() => setDragOverItem({ type: 'award', index: i })}
            onDragLeave={() => setDragOverItem(null)}
            style={{ 
              display: 'flex', 
              gap: '0.6rem', 
              marginBottom: '0.6rem', 
              alignItems: 'center',
              opacity: draggedItem?.type === 'award' && draggedItem?.index === i ? 0.4 : 1,
              background: dragOverItem?.type === 'award' && dragOverItem?.index === i ? 'rgba(201,168,76,0.1)' : 'transparent',
              transition: 'background-color 0.2s',
              borderRadius: '6px',
              padding: '0.25rem 0.5rem'
            }}
          >
            <div 
              style={{
                cursor: 'grab',
                padding: '0.25rem',
                fontSize: '1.1rem',
                color: 'var(--gray-400)',
                userSelect: 'none'
              }}
              onMouseDown={() => setCanDrag(true)}
              onMouseUp={() => setCanDrag(false)}
            >
              ⋮⋮
            </div>
            <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>★</span>
            <input value={award} onChange={e => setAward(i, e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="Award name, year" />
            <button onClick={() => delAward(i)}
              style={{ padding: '0.45rem 0.6rem', border: '1px solid #fee2e2', borderRadius: '6px', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
          </div>
        ))}
        {piInfo.awards.length === 0 && <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)' }}>No awards. Click + Add Award.</p>}
      </div>

      {/* Our Mission */}
      <div style={sectionBox}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: '1.25rem', fontSize: '1.05rem' }}>Our Mission</h3>
        <Field 
          label="Mission Statement" 
          value={labInfo.mission !== undefined ? labInfo.mission : `The ${labInfo.fullName || ''} is dedicated to advancing the frontiers of ${(labInfo.tagline || '').toLowerCase()}. We believe in rigorous science, collaborative discovery, and training the next generation of researchers. Our lab is committed to creating an inclusive and stimulating environment where creativity and scientific excellence thrive together.`} 
          onChange={e => setLab('mission', e.target.value)} 
          multiline 
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: '0.95rem', margin: 0 }}>Core Values / Key Points</h4>
          <button onClick={addVal} className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}>+ Add Value</button>
        </div>
        
        {(labInfo.values || DEFAULT_VALUES).map((v, i) => (
          <div key={i} 
            draggable={canDrag}
            onDragStart={() => { startDrag('value', i); setCanDrag(false); }}
            onDragEnd={() => { setDraggedItem(null); setCanDrag(false); setDragOverItem(null); }}
            onDragOver={dragOver}
            onDrop={() => drop('value', i)}
            onDragEnter={() => setDragOverItem({ type: 'value', index: i })}
            onDragLeave={() => setDragOverItem(null)}
            style={{ 
              border: '1px solid var(--gray-200)', 
              borderRadius: '8px', 
              padding: '1rem', 
              marginBottom: '1rem', 
              background: dragOverItem?.type === 'value' && dragOverItem?.index === i ? 'rgba(201,168,76,0.1)' : 'var(--off-white)',
              opacity: draggedItem?.type === 'value' && draggedItem?.index === i ? 0.4 : 1,
              transition: 'background-color 0.2s',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 80px 1fr auto', gap: '0.75rem', alignItems: 'start', marginBottom: '0.5rem' }}>
              <div 
                style={{
                  cursor: 'grab',
                  padding: '0.5rem 0.25rem',
                  fontSize: '1.25rem',
                  color: 'var(--gray-400)',
                  userSelect: 'none',
                  alignSelf: 'end',
                  marginBottom: '10px'
                }}
                onMouseDown={() => setCanDrag(true)}
                onMouseUp={() => setCanDrag(false)}
              >
                ⋮⋮
              </div>
              <div>
                <label style={labelStyle}>Icon</label>
                <input value={v.icon} onChange={e => setVal(i, 'icon', e.target.value)} style={{ ...inputStyle, textAlign: 'center' }} placeholder="🔭" />
              </div>
              <div>
                <label style={labelStyle}>Title</label>
                <input value={v.title} onChange={e => setVal(i, 'title', e.target.value)} style={inputStyle} placeholder="Value Title" />
              </div>
              <div style={{ alignSelf: 'end' }}>
                <button onClick={() => delVal(i)}
                  style={{ padding: '0.5rem 0.6rem', border: '1px solid #fee2e2', borderRadius: '6px', background: '#fff', color: '#b91c1c', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={v.text} onChange={e => setVal(i, 'text', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} rows={2} placeholder="Value description..." />
            </div>
          </div>
        ))}
        {(labInfo.values || DEFAULT_VALUES).length === 0 && (
          <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)' }}>No core values defined. Click + Add Value.</p>
        )}
      </div>
    </div>
  )
}
