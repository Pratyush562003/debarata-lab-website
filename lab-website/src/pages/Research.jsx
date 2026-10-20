import { useLabData } from '../context/LabDataContext'

export default function Research() {
  const { research, facilities } = useLabData()
  return (
    <main style={{ paddingTop: '70px' }}>
      <section style={{ background: 'var(--navy)', padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff' }}>Research</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem' }}>Our interdisciplinary research spans four core themes</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {research.map((area, i) => (
              <div key={area.id} style={{
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '1fr 2fr' : '2fr 1fr',
                gap: '3rem', alignItems: 'center',
              }}>
                {i % 2 !== 0 && (
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--navy)', marginBottom: '1rem' }}>{area.title}</h2>
                    <p style={{ color: 'var(--gray-700)', lineHeight: 1.85, marginBottom: '1.25rem' }}>{area.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {area.keywords.map(k => <span key={k} className="badge badge-blue">{k}</span>)}
                    </div>
                  </div>
                )}
                <div style={{
                  background: area.color,
                  borderRadius: '16px',
                  height: '220px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '5rem',
                  order: i % 2 !== 0 ? 1 : 0,
                }}>
                  {area.icon}
                </div>
                {i % 2 === 0 && (
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--navy)', marginBottom: '1rem' }}>{area.title}</h2>
                    <p style={{ color: 'var(--gray-700)', lineHeight: 1.85, marginBottom: '1.25rem' }}>{area.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {area.keywords.map(k => <span key={k} className="badge badge-blue">{k}</span>)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <h2 className="section-title">Lab Facilities</h2>
          <p className="section-subtitle">State-of-the-art instrumentation for cutting-edge research.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {(facilities || []).map(item => {
              const name = typeof item === 'string' ? item : item.name
              const icon = typeof item === 'string' ? '⚙️' : (item.icon || '⚙️')
              const id = typeof item === 'string' ? item : (item.id || item.name)
              return (
                <div key={id} style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '1rem', fontSize: '0.88rem', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{icon}</span> 
                  <span style={{ fontWeight: 500 }}>{name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
