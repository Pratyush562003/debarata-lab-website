import { Link } from 'react-router-dom'
import { useLabData } from '../context/LabDataContext'

export default function Home() {
  const { labInfo, research, publications, members, news, piInfo } = useLabData()
  const latestPubs = publications.slice(0, 3)
  const piPhoto = piInfo?.photo || '/pi-photo.png'

  const stats = [
    [publications.length, 'Lab Publications'],
    [members.length, 'Researchers'],
    [research.length, 'Research Areas'],
    ...(labInfo.activeGrants ? [[labInfo.activeGrants, 'Active Grants']] : [])
  ]

  return (
    <main>
      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 60%, #0f3460 100%)',
        display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
        paddingTop: '70px',
      }}>
        {/* subtle background ambient glow */}
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(37,99,235,0.08)', pointerEvents: 'none' }} />

        <div className="container" style={{ 
          maxWidth: '1200px',
          padding: '5rem 2rem', 
          position: 'relative', 
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '3rem',
          flexWrap: 'wrap'
        }}>
          {/* Left Column: Hero Text */}
          <div style={{ flex: '1 1 520px', maxWidth: '650px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '20px', padding: '0.35rem 1rem', marginBottom: '2rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)', display: 'block' }} />
              <span style={{ color: 'var(--gold-light)', fontSize: '0.85rem', fontWeight: 500 }}>
                {labInfo.university}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', lineHeight: 1.1, marginBottom: '1rem' }}>
              {labInfo.name}
            </h1>

            <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--gold-light)', marginBottom: '1.5rem', fontWeight: 500 }}>
              {labInfo.tagline}
            </p>

            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '580px' }}>
              {labInfo.description}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/research" className="btn btn-gold">Explore Our Research</Link>
              <Link to="/members" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>Meet the Team</Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3.5rem', flexWrap: 'wrap' }}>
              {stats.map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--gold-light)' }}>{num}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', letterSpacing: '0.05em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero PI Photo */}
          <div style={{ 
            flex: '1 1 340px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            position: 'relative',
            padding: '2rem 1rem'
          }}>
            {/* Concentric Decorative Rings */}
            <div style={{ 
              position: 'absolute', 
              width: '420px', 
              height: '420px', 
              borderRadius: '50%', 
              border: '1px solid rgba(201,168,76,0.18)', 
              pointerEvents: 'none' 
            }} />
            <div style={{ 
              position: 'absolute', 
              width: '360px', 
              height: '360px', 
              borderRadius: '50%', 
              border: '1px dashed rgba(201,168,76,0.22)', 
              pointerEvents: 'none' 
            }} />

            {/* Photo Circular Frame */}
            <div style={{
              position: 'relative',
              width: 'min(330px, 80vw)',
              height: 'min(330px, 80vw)',
              borderRadius: '50%',
              padding: '6px',
              background: 'linear-gradient(135deg, var(--gold) 0%, rgba(201,168,76,0.3) 50%, var(--gold) 100%)',
              boxShadow: '0 20px 45px rgba(0,0,0,0.5), 0 0 35px rgba(201,168,76,0.25)',
              transition: 'transform 0.3s ease',
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'var(--navy-mid)',
                position: 'relative'
              }}>
                <img 
                  src={piPhoto} 
                  alt={piInfo?.name || "Principal Investigator"} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    display: 'block' 
                  }} 
                />
              </div>

              {/* Floating PI Badge */}
              <div style={{
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(10, 25, 47, 0.92)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(201, 168, 76, 0.5)',
                padding: '0.45rem 1.25rem',
                borderRadius: '30px',
                color: '#fff',
                whiteSpace: 'nowrap',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}>
                <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>✦</span>
                <span>{piInfo?.name && !piInfo.name.includes('Your Name') ? piInfo.name : 'Debabrata Maity'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESEARCH AREAS ── */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <h2 className="section-title">Research Focus</h2>
          <p className="section-subtitle">We pursue fundamental and applied chemistry across four interconnected themes.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {research.map(area => (
              <div key={area.id} className="card" style={{ borderTop: `4px solid var(--blue)` }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{area.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--navy)' }}>{area.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: '1rem' }}>{area.description.slice(0, 120)}...</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {area.keywords.map(k => <span key={k} className="badge badge-blue">{k}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/research" className="btn btn-outline">View All Research →</Link>
          </div>
        </div>
      </section>

      {/* ── RECENT PUBLICATIONS ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Recent Lab Publications</h2>
          <p className="section-subtitle">Selected papers from our group.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {latestPubs.map(pub => (
              <div key={pub.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ minWidth: '60px', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>{pub.year}</div>
                  <span className={`badge ${pub.type === 'Review' ? 'badge-gold' : 'badge-blue'}`} style={{ fontSize: '0.7rem' }}>{pub.type}</span>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--navy)', marginBottom: '0.3rem' }}>{pub.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>{pub.authors}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--blue)', fontStyle: 'italic' }}>{pub.journal}, {pub.volume}, {pub.pages}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/publications" className="btn btn-outline">All Lab Publications →</Link>
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section className="section" style={{ background: 'var(--navy)', color: '#fff' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: '#fff' }}>News & Updates</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {(news || []).map(item => (
              <div key={item.id} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gold-light)' }}>{item.date}</span>
                  <span className="badge" style={{ background: 'rgba(201,168,76,0.2)', color: 'var(--gold-light)', fontSize: '0.7rem' }}>{item.type}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 0', background: 'var(--gold)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--navy)', marginBottom: '1rem' }}>
            Join Our Team
          </h2>
          <p style={{ color: 'var(--navy)', opacity: 0.8, marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Research scholar and student positions are available. We welcome passionate scientists to explore molecular frontiers with us.
          </p>
          <Link to="/contact" className="btn btn-primary">Get in Touch</Link>
        </div>
      </section>
    </main>
  )
}
