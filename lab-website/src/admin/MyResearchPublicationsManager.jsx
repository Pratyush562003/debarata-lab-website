import { useState } from 'react'
import { useLabData } from '../context/LabDataContext'
import { useConfirm } from '../context/ConfirmModalContext'

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  border: '1px solid var(--gray-200)',
  borderRadius: '6px',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  boxSizing: 'border-box'
}

const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--gray-700)',
  display: 'block',
  marginBottom: '0.35rem'
}

const cardStyle = {
  background: '#fff',
  border: '1px solid var(--gray-200)',
  borderRadius: '10px',
  padding: '1.5rem',
  marginBottom: '1.75rem',
  boxShadow: '0 4px 16px rgba(13,27,42,0.05)',
  overflow: 'hidden'
}

const CATEGORIES = [
  'All',
  'Immunology',
  'PDT Cancer Therapy',
  'Radiation Therapy',
  'Imaging',
  'Material Chemistry',
  'Review Article'
]

export default function MyResearchPublicationsManager() {
  const { piResearchPubs, updatePiResearchPublications } = useLabData()
  const confirm = useConfirm()

  // Local working copy of state
  const [activeTab, setActiveTab] = useState('research') // 'research' | 'publications'
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(piResearchPubs || {})))
  const [savedStatus, setSavedStatus] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Publications search and filter
  const [selectedCat, setSelectedCat] = useState('All')
  const [pubSearch, setPubSearch] = useState('')

  // Publication Modal / Add State
  const [isAddingPub, setIsAddingPub] = useState(false)
  const [editingPubId, setEditingPubId] = useState(null)
  const [pubForm, setPubForm] = useState({
    title: '',
    authors: 'Debabrata Maiti',
    journal: '',
    year: new Date().getFullYear().toString(),
    volume: '',
    category: 'Immunology',
    highlight: '',
    doi: ''
  })

  // Skill input
  const [newSkillText, setNewSkillText] = useState('')

  // Save handler
  const handleSave = async () => {
    setIsSaving(true)
    setSavedStatus(null)
    try {
      await updatePiResearchPublications(data)
      setSavedStatus({ type: 'success', message: '✅ All changes successfully saved and synced to database!' })
      setTimeout(() => setSavedStatus(null), 4000)
    } catch (err) {
      setSavedStatus({ type: 'error', message: `❌ Failed to save: ${err.message}` })
    } finally {
      setIsSaving(false)
    }
  }

  // ── Research Experience Handlers ──
  const updateExp = (index, field, value) => {
    setData(prev => {
      const list = [...(prev.researchExperience || [])]
      list[index] = { ...list[index], [field]: value }
      return { ...prev, researchExperience: list }
    })
  }

  const updateExpDetail = (expIdx, detailIdx, value) => {
    setData(prev => {
      const list = [...(prev.researchExperience || [])]
      const details = [...(list[expIdx].details || [])]
      details[detailIdx] = value
      list[expIdx] = { ...list[expIdx], details }
      return { ...prev, researchExperience: list }
    })
  }

  const addExpDetail = (expIdx) => {
    setData(prev => {
      const list = [...(prev.researchExperience || [])]
      const details = [...(list[expIdx].details || []), '']
      list[expIdx] = { ...list[expIdx], details }
      return { ...prev, researchExperience: list }
    })
  }

  const removeExpDetail = (expIdx, detailIdx) => {
    setData(prev => {
      const list = [...(prev.researchExperience || [])]
      const details = (list[expIdx].details || []).filter((_, idx) => idx !== detailIdx)
      list[expIdx] = { ...list[expIdx], details }
      return { ...prev, researchExperience: list }
    })
  }

  const addExp = () => {
    setData(prev => ({
      ...prev,
      researchExperience: [
        {
          id: `exp-${Date.now()}`,
          role: 'Research Appointment',
          institution: 'Institution / University Name',
          location: 'City, Country',
          period: 'Year – Year',
          field: 'Research Domain',
          details: ['Key achievement or project summary.']
        },
        ...(prev.researchExperience || [])
      ]
    }))
  }

  const deleteExp = async (index) => {
    const ok = await confirm({
      title: 'Delete Research Experience?',
      message: 'Do you want to delete this research experience entry? This action cannot be undone.',
      confirmText: 'Yes',
      cancelText: 'No'
    })
    if (!ok) return
    setData(prev => ({
      ...prev,
      researchExperience: (prev.researchExperience || []).filter((_, idx) => idx !== index)
    }))
  }

  // ── Research Statement Handlers ──
  const updateStatement = (field, value) => {
    setData(prev => ({
      ...prev,
      researchStatement: {
        ...(prev.researchStatement || {}),
        [field]: value
      }
    }))
  }

  const updateFutureInterest = (index, value) => {
    setData(prev => {
      const list = [...(prev.researchStatement?.futureInterests || [])]
      list[index] = value
      return {
        ...prev,
        researchStatement: {
          ...(prev.researchStatement || {}),
          futureInterests: list
        }
      }
    })
  }

  const addFutureInterest = () => {
    setData(prev => ({
      ...prev,
      researchStatement: {
        ...(prev.researchStatement || {}),
        futureInterests: [...(prev.researchStatement?.futureInterests || []), 'New research direction']
      }
    }))
  }

  const removeFutureInterest = (index) => {
    setData(prev => ({
      ...prev,
      researchStatement: {
        ...(prev.researchStatement || {}),
        futureInterests: (prev.researchStatement?.futureInterests || []).filter((_, idx) => idx !== index)
      }
    }))
  }

  // ── Skills Handlers ──
  const addSkill = () => {
    if (!newSkillText.trim()) return
    setData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), newSkillText.trim()]
    }))
    setNewSkillText('')
  }

  const removeSkill = (index) => {
    setData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, idx) => idx !== index)
    }))
  }

  // ── Publications Handlers ──
  const handleSavePubModal = (e) => {
    e.preventDefault()
    if (!pubForm.title.trim()) return alert('Please enter paper title.')

    if (editingPubId) {
      // Edit existing
      setData(prev => ({
        ...prev,
        publications: (prev.publications || []).map(p => p.id === editingPubId ? { ...pubForm, id: editingPubId } : p)
      }))
    } else {
      // Add new
      setData(prev => ({
        ...prev,
        publications: [{ ...pubForm, id: `pub-${Date.now()}` }, ...(prev.publications || [])]
      }))
    }
    setIsAddingPub(false)
    setEditingPubId(null)
  }

  const handleEditPub = (pub) => {
    setPubForm({ ...pub })
    setEditingPubId(pub.id)
    setIsAddingPub(true)
  }

  const handleDeletePub = async (id) => {
    const ok = await confirm({
      title: 'Delete Publication?',
      message: 'Do you want to delete this publication? This action cannot be undone.',
      confirmText: 'Yes',
      cancelText: 'No'
    })
    if (!ok) return
    setData(prev => ({
      ...prev,
      publications: (prev.publications || []).filter(p => p.id !== id)
    }))
  }

  const movePub = (index, direction) => {
    setData(prev => {
      const list = [...(prev.publications || [])]
      const target = index + direction
      if (target < 0 || target >= list.length) return prev
      const [item] = list.splice(index, 1)
      list.splice(target, 0, item)
      return { ...prev, publications: list }
    })
  }

  // Filtered publications
  const filteredPubs = (data.publications || []).filter(p => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat
    const matchesSearch = !pubSearch.trim() ||
      (p.title || '').toLowerCase().includes(pubSearch.toLowerCase()) ||
      (p.authors || '').toLowerCase().includes(pubSearch.toLowerCase()) ||
      (p.journal || '').toLowerCase().includes(pubSearch.toLowerCase()) ||
      (p.year || '').toString().includes(pubSearch)
    return matchesCat && matchesSearch
  })

  return (
    <div>
      {/* Top Header / Save Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.92rem', margin: 0 }}>
            Manage Dr. Debabrata Maiti's personal research appointments, statements, and publications.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.4rem', fontWeight: 600, boxShadow: '0 2px 8px rgba(13,27,42,0.18)' }}
        >
          {isSaving ? 'Saving & Syncing...' : '💾 Save & Sync to Database'}
        </button>
      </div>

      {savedStatus && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          background: savedStatus.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${savedStatus.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          color: savedStatus.type === 'success' ? '#166534' : '#991b1b',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          {savedStatus.message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '2px solid var(--gray-200)', marginBottom: '1.75rem' }}>
        <button
          onClick={() => setActiveTab('research')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'research' ? '3px solid var(--navy)' : '3px solid transparent',
            marginBottom: '-2px',
            fontFamily: 'var(--font-body)',
            fontWeight: activeTab === 'research' ? 700 : 500,
            color: activeTab === 'research' ? 'var(--navy)' : 'var(--gray-500)',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>🔬</span> My Research & Experience
        </button>

        <button
          onClick={() => setActiveTab('publications')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'publications' ? '3px solid var(--navy)' : '3px solid transparent',
            marginBottom: '-2px',
            fontFamily: 'var(--font-body)',
            fontWeight: activeTab === 'publications' ? 700 : 500,
            color: activeTab === 'publications' ? 'var(--navy)' : 'var(--gray-500)',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>📚</span> My Publications ({data.publications?.length || 0})
        </button>
      </div>

      {/* ──────────────── TAB 1: MY RESEARCH ──────────────── */}
      {activeTab === 'research' && (
        <div>
          {/* Research Experience Section */}
          <div style={cardStyle}>
            <div style={{
              margin: '-1.5rem -1.5rem 1.5rem -1.5rem',
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 100%)',
              borderBottom: '3px solid var(--gold)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 4px 14px rgba(13, 27, 42, 0.12)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(201, 168, 76, 0.2)',
                  border: '1px solid rgba(201, 168, 76, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  flexShrink: 0
                }}>
                  🏛️
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#ffffff', margin: 0, fontWeight: 700, letterSpacing: '0.01em' }}>
                    Research Appointments & Fellowships
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.82)', margin: '0.2rem 0 0 0' }}>
                    Chronological record of postdoctoral fellowships, assistant professor appointments, and lab tenures.
                  </p>
                </div>
              </div>
              <button
                onClick={addExp}
                className="btn btn-gold"
                style={{
                  fontSize: '0.85rem',
                  padding: '0.55rem 1.25rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                  whiteSpace: 'nowrap'
                }}
              >
                + Add Appointment
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {(data.researchExperience || []).map((exp, idx) => (
                <div key={exp.id || idx} style={{ border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '1.25rem', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.05em' }}>
                      POSITION #{idx + 1}
                    </span>
                    <button
                      onClick={() => deleteExp(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.9rem', marginBottom: '0.9rem' }}>
                    <div>
                      <label style={labelStyle}>Role / Title *</label>
                      <input
                        value={exp.role || ''}
                        onChange={e => updateExp(idx, 'role', e.target.value)}
                        placeholder="e.g. JSPS Postdoctoral Fellow"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Institution *</label>
                      <input
                        value={exp.institution || ''}
                        onChange={e => updateExp(idx, 'institution', e.target.value)}
                        placeholder="e.g. The University of Tokyo"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Location</label>
                      <input
                        value={exp.location || ''}
                        onChange={e => updateExp(idx, 'location', e.target.value)}
                        placeholder="e.g. Tokyo, Japan"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Period / Dates</label>
                      <input
                        value={exp.period || ''}
                        onChange={e => updateExp(idx, 'period', e.target.value)}
                        placeholder="e.g. July 2019 – July 2021"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.9rem' }}>
                    <label style={labelStyle}>Primary Focus / Field Badge</label>
                    <input
                      value={exp.field || ''}
                      onChange={e => updateExp(idx, 'field', e.target.value)}
                      placeholder="e.g. Immunology & Biomaterials"
                      style={inputStyle}
                    />
                  </div>

                  {/* Bullet points */}
                  <div>
                    <label style={labelStyle}>Research Highlights / Project Points</label>
                    {(exp.details || []).map((detail, dIdx) => (
                      <div key={dIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.45rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--blue)', fontSize: '0.9rem' }}>•</span>
                        <input
                          value={detail}
                          onChange={e => updateExpDetail(idx, dIdx, e.target.value)}
                          placeholder="e.g. Investigating interaction between anti-PEG antibodies and PEG"
                          style={{ ...inputStyle, padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExpDetail(idx, dIdx)}
                          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1rem' }}
                          title="Remove point"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addExpDetail(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--blue)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '0.2rem 0',
                        marginTop: '0.2rem'
                      }}
                    >
                      + Add highlight point
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Statement, Focus & Future Interests */}
          <div style={cardStyle}>
            <div style={{
              margin: '-1.5rem -1.5rem 1.5rem -1.5rem',
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 100%)',
              borderBottom: '3px solid var(--gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 4px 14px rgba(13, 27, 42, 0.12)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(201, 168, 76, 0.2)',
                border: '1px solid rgba(201, 168, 76, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.35rem',
                flexShrink: 0
              }}>
                🔬
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#ffffff', margin: 0, fontWeight: 700, letterSpacing: '0.01em' }}>
                  Research Overview, Focus & Future Interests
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.82)', margin: '0.2rem 0 0 0' }}>
                  Configures the "Research Overview & Background", "Current Scientific Focus", and "Future Research Interests" cards on the About page.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Research Overview & Background</label>
              <textarea
                rows={4}
                value={data.researchStatement?.overview || ''}
                onChange={e => updateStatement('overview', e.target.value)}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                placeholder="Overview of research background..."
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Current Scientific Focus</label>
              <textarea
                rows={3}
                value={data.researchStatement?.currentFocus || ''}
                onChange={e => updateStatement('currentFocus', e.target.value)}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                placeholder="Current research themes..."
              />
            </div>

            <div>
              <label style={labelStyle}>Future Research Interests</label>
              {(data.researchStatement?.futureInterests || []).map((interest, iIdx) => (
                <div key={iIdx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>{iIdx + 1}.</span>
                  <input
                    value={interest}
                    onChange={e => updateFutureInterest(iIdx, e.target.value)}
                    style={{ ...inputStyle, padding: '0.45rem 0.75rem', fontSize: '0.88rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeFutureInterest(iIdx)}
                    style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFutureInterest}
                style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.3rem' }}
              >
                + Add future research goal
              </button>
            </div>
          </div>

          {/* Technical Skills & Expertise */}
          <div style={cardStyle}>
            <div style={{
              margin: '-1.5rem -1.5rem 1.5rem -1.5rem',
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 100%)',
              borderBottom: '3px solid var(--gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 4px 14px rgba(13, 27, 42, 0.12)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(201, 168, 76, 0.2)',
                border: '1px solid rgba(201, 168, 76, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.35rem',
                flexShrink: 0
              }}>
                🧪
              </div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#ffffff', margin: 0, fontWeight: 700, letterSpacing: '0.01em' }}>
                  Technical Expertise & Laboratory Skills
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.82)', margin: '0.2rem 0 0 0' }}>
                  Techniques, instrumentation, and biological/chemical assays.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {(data.skills || []).map((skill, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'var(--gray-100)',
                    border: '1px solid var(--gray-200)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    color: 'var(--gray-700)'
                  }}
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(sIdx)}
                    style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px' }}>
              <input
                value={newSkillText}
                onChange={e => setNewSkillText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Add a new skill (e.g. Bio-Layer Interferometry)..."
                style={{ ...inputStyle, padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn btn-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 2: MY PUBLICATIONS ──────────────── */}
      {activeTab === 'publications' && (
        <div>
          {/* Controls bar */}
          <div style={cardStyle}>
            <div style={{
              margin: '-1.5rem -1.5rem 1.25rem -1.5rem',
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1b3a5c 100%)',
              borderBottom: '3px solid var(--gold)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 4px 14px rgba(13, 27, 42, 0.12)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(201, 168, 76, 0.2)',
                  border: '1px solid rgba(201, 168, 76, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
                  flexShrink: 0
                }}>
                  📚
                </div>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#ffffff', margin: 0, fontWeight: 700, letterSpacing: '0.01em' }}>
                    My Publications Catalog
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.82)', margin: '0.2rem 0 0 0' }}>
                    Personal bibliography, journal papers, and conference proceedings. ({data.publications?.length || 0} papers recorded)
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPubForm({
                    title: '',
                    authors: 'Debabrata Maiti',
                    journal: '',
                    year: new Date().getFullYear().toString(),
                    volume: '',
                    category: selectedCat !== 'All' ? selectedCat : 'Immunology',
                    highlight: '',
                    doi: ''
                  })
                  setEditingPubId(null)
                  setIsAddingPub(true)
                }}
                className="btn btn-gold"
                style={{
                  fontSize: '0.85rem',
                  padding: '0.55rem 1.25rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                  whiteSpace: 'nowrap'
                }}
              >
                + Add Publication
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: selectedCat === cat ? 'var(--navy)' : 'var(--gray-200)',
                      background: selectedCat === cat ? 'var(--navy)' : '#fff',
                      color: selectedCat === cat ? '#fff' : 'var(--gray-700)',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search publications..."
                  value={pubSearch}
                  onChange={e => setPubSearch(e.target.value)}
                  style={{ ...inputStyle, width: '220px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>

          {/* Publication Form Modal / Card */}
          {isAddingPub && (
            <div style={{ ...cardStyle, border: '2px solid var(--blue)', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--navy)', margin: 0 }}>
                  {editingPubId ? 'Edit Publication' : 'Add New Publication'}
                </h3>
                <button
                  onClick={() => setIsAddingPub(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--gray-500)', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePubModal}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Article Title *</label>
                  <input
                    value={pubForm.title}
                    onChange={e => setPubForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Full article title..."
                    style={inputStyle}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Authors</label>
                    <input
                      value={pubForm.authors}
                      onChange={e => setPubForm(f => ({ ...f, authors: e.target.value }))}
                      placeholder="e.g. Debabrata Maiti, M. Yokoyama..."
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Journal Name</label>
                    <input
                      value={pubForm.journal}
                      onChange={e => setPubForm(f => ({ ...f, journal: e.target.value }))}
                      placeholder="e.g. ACS Omega or JACS"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Year</label>
                    <input
                      value={pubForm.year}
                      onChange={e => setPubForm(f => ({ ...f, year: e.target.value }))}
                      placeholder="e.g. 2024"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={labelStyle}>Volume / Page Reference</label>
                    <input
                      value={pubForm.volume}
                      onChange={e => setPubForm(f => ({ ...f, volume: e.target.value }))}
                      placeholder="e.g. 9, 32, 34577 or In Press"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      value={pubForm.category}
                      onChange={e => setPubForm(f => ({ ...f, category: e.target.value }))}
                      style={inputStyle}
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Special Badge / Highlight</label>
                    <input
                      value={pubForm.highlight}
                      onChange={e => setPubForm(f => ({ ...f, highlight: e.target.value }))}
                      placeholder="e.g. Journal Front Cover 🌟"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>DOI / External URL</label>
                    <input
                      value={pubForm.doi}
                      onChange={e => setPubForm(f => ({ ...f, doi: e.target.value }))}
                      placeholder="e.g. 10.1021/acsomega.4c03889"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddingPub(false)}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    {editingPubId ? 'Update Publication' : 'Add to List'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Publications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredPubs.map((pub, index) => (
              <div
                key={pub.id || index}
                style={{
                  ...cardStyle,
                  marginBottom: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.25rem'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'var(--navy)',
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '4px'
                    }}>
                      #{index + 1}
                    </span>
                    <span style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '4px'
                    }}>
                      {pub.category || 'General'}
                    </span>
                    {pub.highlight && (
                      <span style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.55rem',
                        borderRadius: '4px'
                      }}>
                        {pub.highlight}
                      </span>
                    )}
                    <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{pub.year}</span>
                  </div>

                  <h4 style={{ fontSize: '0.98rem', color: 'var(--navy)', fontWeight: 600, lineHeight: 1.4, marginBottom: '0.35rem' }}>
                    {pub.title}
                  </h4>

                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)', marginBottom: '0.25rem' }}>
                    {pub.authors}
                  </p>

                  <div style={{ fontSize: '0.82rem', color: 'var(--blue)', fontStyle: 'italic' }}>
                    {pub.journal} {pub.volume ? `(${pub.volume})` : ''}
                  </div>

                  {pub.doi && (
                    <div style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: 'var(--gray-500)' }}>
                      DOI: <a href={pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>{pub.doi}</a>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flexShrink: 0 }}>
                  <button
                    onClick={() => handleEditPub(pub)}
                    style={{ background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, textAlign: 'right' }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeletePub(pub.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, textAlign: 'right' }}
                  >
                    🗑️ Delete
                  </button>
                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                    <button
                      onClick={() => movePub(index, -1)}
                      disabled={index === 0}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', padding: '0.2rem 0.4rem', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.4 : 1 }}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => movePub(index, 1)}
                      disabled={index === filteredPubs.length - 1}
                      style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', padding: '0.2rem 0.4rem', cursor: index === filteredPubs.length - 1 ? 'not-allowed' : 'pointer', opacity: index === filteredPubs.length - 1 ? 0.4 : 1 }}
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPubs.length === 0 && (
              <div style={{ ...cardStyle, textAlign: 'center', padding: '3rem 2rem', color: 'var(--gray-500)' }}>
                No publications found matching your filter criteria.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
