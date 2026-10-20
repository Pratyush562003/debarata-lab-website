import { useState } from 'react'
import { useLabData } from '../context/LabDataContext'

export default function Publications() {
  const { publications } = useLabData()
  const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a)
  const types = ['All', ...new Set(publications.map(p => p.type))]
  const [selectedYear, setSelectedYear] = useState('All')
  const [selectedType, setSelectedType] = useState('All')

  const filtered = publications.filter(p => {
    const yearMatch = selectedYear === 'All' || p.year === parseInt(selectedYear)
    const typeMatch = selectedType === 'All' || p.type === selectedType
    return yearMatch && typeMatch
  })

  return (
    <main style={{ paddingTop: '70px' }}>
      <section style={{ background: 'var(--navy)', padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff' }}>Lab Publications</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem' }}>{publications.length} lab publications from our group</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--gray-500)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>YEAR</label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                style={{ border: '1px solid var(--gray-200)', borderRadius: '6px', padding: '0.5rem 1rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text)', background: '#fff', cursor: 'pointer' }}
              >
                <option value="All">All Years</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--gray-500)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>TYPE</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      border: '1px solid var(--gray-200)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      background: selectedType === t ? 'var(--navy)' : '#fff',
                      color: selectedType === t ? '#fff' : 'var(--gray-700)',
                      transition: 'all 0.2s',
                    }}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Publication list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((pub, idx) => (
              <div key={pub.id} className="card" style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ minWidth: '50px', textAlign: 'center', paddingTop: '2px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.1 }}>{pub.year}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '2px' }}>#{filtered.length - idx}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${pub.type === 'Review' ? 'badge-gold' : 'badge-blue'}`}>{pub.type}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--navy)', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                    {pub.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>{pub.authors}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--blue)', fontStyle: 'italic' }}>
                    <em>{pub.journal}</em>, {pub.volume}, pp. {pub.pages}
                  </p>
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.35rem', display: 'inline-block' }}
                    >
                      DOI: {pub.doi} ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-500)' }}>
              No publications found for the selected filters.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
