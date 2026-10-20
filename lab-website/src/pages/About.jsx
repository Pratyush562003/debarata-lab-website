import { useState } from 'react'
import { useLabData } from '../context/LabDataContext'

export default function About() {
  const { labInfo, piInfo, piResearchPubs } = useLabData()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [pubSearch, setPubSearch] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  const handleCopyCitation = (pub) => {
    const citation = `${pub.authors} "${pub.title}." ${pub.journal} (${pub.year})${pub.volume ? `, ${pub.volume}` : ''}.${pub.doi ? ` DOI: ${pub.doi}` : ''}`
    navigator.clipboard?.writeText(citation)
    setCopiedId(pub.id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const filteredPubs = (piResearchPubs?.publications || []).filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory
    const q = pubSearch.trim().toLowerCase()
    const matchesSearch = !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.authors || '').toLowerCase().includes(q) ||
      (p.journal || '').toLowerCase().includes(q) ||
      (p.year || '').toString().includes(q)
    return matchesCat && matchesSearch
  })

  const missionText = labInfo.mission || `The ${labInfo.fullName || ''} is dedicated to advancing the frontiers of ${(labInfo.tagline || '').toLowerCase()}. We believe in rigorous science, collaborative discovery, and training the next generation of researchers. Our lab is committed to creating an inclusive and stimulating environment where creativity and scientific excellence thrive together.`
  const values = labInfo.values || [
    { icon: '🔭', title: 'Curiosity', text: 'We ask bold questions at the edge of known science.' },
    { icon: '🤝', title: 'Collaboration', text: 'Chemistry thrives at disciplinary intersections.' },
    { icon: '🌱', title: 'Mentorship', text: 'Nurturing scientists at every stage of their career.' },
    { icon: '🌍', title: 'Impact', text: 'Our work addresses real challenges in health and environment.' },
  ]

  return (
    <main style={{ paddingTop: '70px' }}>
      {/* Hero */}
      <section style={{ background: 'var(--navy)', padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff' }}>About the Lab</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
            {labInfo.department} · {labInfo.university}
          </p>
        </div>
      </section>

      {/* PI Section */}
      <section className="section">
        <div className="container">
          <div className="pi-profile-grid">
            {/* PI Photo */}
            <div style={{ 
              width: '210px', 
              height: '210px', 
              borderRadius: '50%', 
              flexShrink: 0, 
              overflow: 'hidden', 
              border: '3px solid var(--gold)', 
              boxShadow: '0 10px 25px rgba(13, 27, 42, 0.12)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'var(--gray-100)' 
            }}>
              {(piInfo.photo || '/pi-photo.png')
                ? <img 
                    src={piInfo.photo || '/pi-photo.png'} 
                    alt={piInfo.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      display: 'block' 
                    }} 
                  />
                : <span style={{ fontSize: '4rem' }}>👨‍🔬</span>
              }
            </div>
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>Principal Investigator</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>{piInfo.name}</h2>
              <p style={{ color: 'var(--gray-500)', marginBottom: '1.25rem', fontStyle: 'italic' }}>{piInfo.title}</p>
              <p style={{ lineHeight: 1.8, color: 'var(--gray-700)' }}>{piInfo.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Awards */}
      <section className="section" style={{ background: 'var(--off-white)', paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1.25rem' }}>Education</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {piInfo.education.map((edu, i) => (
                  <div key={i} style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--blue)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.95rem' }}>{edu.degree}</div>
                    <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{edu.institution} · {edu.year}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--navy)', marginBottom: '1.25rem' }}>Awards & Honours</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {piInfo.awards.map((award, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '1.1rem', marginTop: '2px' }}>★</span>
                    <span style={{ color: 'var(--gray-700)', fontSize: '0.9rem' }}>{award}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: MY RESEARCH ── */}
      <section className="section" style={{ padding: '4.5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.04em' }}>
              ACADEMIC JOURNEY & VISION
            </span>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>My Research</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Postdoctoral appointments, international research tenures, and investigative focus across immunology, biomaterials, and nanomedicine.
            </p>
          </div>

          {/* Research Appointments / Experience */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: 'var(--navy)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🏛️</span> Research Appointments & Fellowships
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {(piResearchPubs?.researchExperience || []).map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  style={{
                    background: 'var(--off-white)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius)',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(13,27,42,0.04)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: '#dbeafe',
                        color: '#1e40af',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.65rem',
                        borderRadius: '20px'
                      }}>
                        {exp.field || 'Research'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600 }}>
                        {exp.period}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', color: 'var(--navy)', fontWeight: 700, marginBottom: '0.35rem', lineHeight: 1.3 }}>
                      {exp.role}
                    </h4>

                    <div style={{ fontSize: '0.9rem', color: 'var(--blue)', fontWeight: 500, marginBottom: '0.2rem' }}>
                      {exp.institution}
                    </div>
                    {exp.location && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
                        📍 {exp.location}
                      </div>
                    )}

                    <ul style={{ paddingLeft: '1.1rem', margin: 0, color: 'var(--gray-700)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                      {(exp.details || []).map((detail, dIdx) => (
                        <li key={dIdx} style={{ marginBottom: '0.35rem' }}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Statement & Future Roadmap */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
            {/* Overview & Current Focus */}
            <div style={{
              background: 'linear-gradient(145deg, #f8fafc, #edf2f7)',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius)',
              padding: '2rem'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔬</span> Research Overview & Background
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--gray-700)', lineHeight: 1.7, marginBottom: '1rem' }}>
                {piResearchPubs?.researchStatement?.overview}
              </p>
              {piResearchPubs?.researchStatement?.currentFocus && (
                <div style={{ padding: '1rem', background: '#fff', borderRadius: '8px', borderLeft: '4px solid var(--blue)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                    Current Scientific Focus
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--gray-700)', lineHeight: 1.6 }}>
                    {piResearchPubs.researchStatement.currentFocus}
                  </div>
                </div>
              )}
            </div>

            {/* Future Research Interests */}
            <div style={{
              background: '#fefce8',
              border: '1px solid #fef08a',
              borderRadius: 'var(--radius)',
              padding: '2rem'
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#854d0e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🎯</span> Future Research Interests
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {(piResearchPubs?.researchStatement?.futureInterests || []).map((interest, iIdx) => (
                  <div key={iIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: '#fff', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #fef9c3' }}>
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '50%', background: 'var(--gold)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, marginTop: '2px'
                    }}>
                      {iIdx + 1}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: '#713f12', fontWeight: 500, lineHeight: 1.5 }}>
                      {interest}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Skills & Expertise */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🧪</span> Technical Core Competencies & Assays
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {(piResearchPubs?.skills || []).map((skill, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--off-white)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: '24px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: 'var(--gray-700)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>✦</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: MY PUBLICATIONS ── */}
      <section className="section" style={{ padding: '4.5rem 0', background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                SCHOLARLY CONTRIBUTIONS
              </span>
              <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>My Publications</h2>
              <p className="section-subtitle" style={{ marginBottom: 0, maxWidth: '650px' }}>
                Complete list of peer-reviewed articles, journal front covers, and high-impact papers across nanotechnology, polymer chemistry, and cancer therapeutics.
              </p>
            </div>

            {/* Search Input */}
            <div style={{ width: '100%', maxWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search my papers..."
                value={pubSearch}
                onChange={e => setPubSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '24px',
                  border: '1px solid var(--gray-200)',
                  background: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {[
              'All',
              'Immunology',
              'PDT Cancer Therapy',
              'Radiation Therapy',
              'Imaging',
              'Material Chemistry',
              'Review Article'
            ].map(cat => {
              const count = cat === 'All'
                ? (piResearchPubs?.publications || []).length
                : (piResearchPubs?.publications || []).filter(p => p.category === cat).length

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? 'var(--navy)' : 'var(--gray-200)',
                    background: selectedCategory === cat ? 'var(--navy)' : '#fff',
                    color: selectedCategory === cat ? '#fff' : 'var(--gray-700)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: selectedCategory === cat ? '0 2px 8px rgba(13,27,42,0.15)' : 'none'
                  }}
                >
                  {cat} ({count})
                </button>
              )
            })}
          </div>

          {/* Publication Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredPubs.map((pub, idx) => (
              <div
                key={pub.id || idx}
                style={{
                  background: '#fff',
                  borderRadius: 'var(--radius)',
                  border: pub.highlight?.includes('Cover') ? '1.5px solid var(--gold)' : '1px solid var(--gray-200)',
                  padding: '1.5rem',
                  boxShadow: pub.highlight?.includes('Cover') ? '0 4px 16px rgba(201,168,76,0.15)' : '0 2px 10px rgba(0,0,0,0.03)',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'var(--navy)',
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '4px'
                    }}>
                      #{idx + 1}
                    </span>
                    <span style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px'
                    }}>
                      {pub.category || 'Paper'}
                    </span>
                    {pub.highlight && (
                      <span style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        border: '1px solid #fde68a'
                      }}>
                        {pub.highlight}
                      </span>
                    )}
                  </div>

                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)' }}>
                    {pub.year}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  color: 'var(--navy)',
                  fontWeight: 700,
                  lineHeight: 1.45,
                  marginBottom: '0.5rem'
                }}>
                  {pub.title}
                </h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                  {pub.authors.split(',').map((author, aIdx) => {
                    const trimmed = author.trim()
                    const isMaiti = trimmed.toLowerCase().includes('debabrata maiti')
                    return (
                      <span key={aIdx}>
                        {isMaiti ? <strong style={{ color: 'var(--navy)', textDecoration: 'underline' }}>{trimmed}</strong> : trimmed}
                        {aIdx < pub.authors.split(',').length - 1 ? ', ' : ''}
                      </span>
                    )
                  })}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--blue)', fontStyle: 'italic', fontWeight: 500 }}>
                    {pub.journal} {pub.volume ? `— ${pub.volume}` : ''}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {pub.doi && (
                      <a
                        href={pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem', borderRadius: '4px' }}
                      >
                        View Article ↗
                      </a>
                    )}
                    <button
                      onClick={() => handleCopyCitation(pub)}
                      style={{
                        background: copiedId === pub.id ? '#166534' : 'var(--gray-100)',
                        color: copiedId === pub.id ? '#fff' : 'var(--gray-700)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.35rem 0.8rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {copiedId === pub.id ? '✓ Copied' : 'Cite'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPubs.length === 0 && (
              <div style={{ background: '#fff', padding: '3rem 2rem', borderRadius: 'var(--radius)', textAlign: 'center', color: 'var(--gray-500)' }}>
                No publications found matching your search.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lab Mission */}
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="section-title">Our Mission</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.9, color: 'var(--gray-700)' }}>
            {missionText}
          </p>
          <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {values.map(v => (
              <div key={v.title} style={{ textAlign: 'center', padding: '1.5rem', borderRadius: 'var(--radius)', background: 'var(--off-white)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{v.icon}</div>
                <div style={{ fontWeight: 600, color: 'var(--navy)', marginBottom: '0.4rem' }}>{v.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>{v.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
