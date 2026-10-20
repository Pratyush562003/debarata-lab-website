import { useLabData } from '../context/LabDataContext'

const roleOrder = ['Research Scholar', 'Masters Student', 'Bachelor Student']

function formatRoleHeading(role) {
  if (role.endsWith('s')) return role
  return `${role}s`
}

function normalizeRole(role) {
  if (role === 'Postdoctoral Researcher' || role === 'PhD Student' || role === 'Project Fellow') {
    return 'Research Scholar'
  }
  return role || 'Research Scholar'
}

function MemberCard({ member, isPI = false }) {
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{
        width: '90px', height: '90px', borderRadius: '50%',
        background: isPI ? 'var(--navy)' : 'var(--gray-200)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1rem', overflow: 'hidden',
        border: isPI ? '3px solid var(--gold)' : 'none',
      }}>
        {member.photo
          ? <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: '1.3rem', fontWeight: 700, color: isPI ? 'var(--gold)' : 'var(--gray-500)', fontFamily: 'var(--font-display)' }}>{initials}</span>
        }
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>{member.name}</h3>
      <span className={`badge ${isPI ? 'badge-gold' : 'badge-blue'}`} style={{ marginBottom: '0.75rem' }}>{member.role}</span>
      {member.project && (
        <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>{member.project}</p>
      )}
      {member.email && (
        <a href={`mailto:${member.email}`} style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--blue)' }}>
          ✉ {member.email}
        </a>
      )}
    </div>
  )
}

export default function Members() {
  const { piInfo, members } = useLabData()

  const normalizedMembers = members.map(m => ({
    ...m,
    role: normalizeRole(m.role)
  }))

  const allRoles = [...new Set([...roleOrder, ...normalizedMembers.map(m => m.role).filter(Boolean)])]

  const grouped = allRoles.reduce((acc, role) => {
    acc[role] = normalizedMembers.filter(m => m.role === role)
    return acc
  }, {})

  return (
    <main style={{ paddingTop: '70px' }}>
      <section style={{ background: 'var(--navy)', padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff' }}>Lab Members</h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem' }}>The people behind the science</p>
        </div>
      </section>

      {/* PI */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Principal Investigator</h2>
          <div style={{ maxWidth: '260px' }}>
            <MemberCard member={{ ...piInfo, role: piInfo.title, project: piInfo.bio.slice(0, 100) + '...' }} isPI />
          </div>
        </div>
      </section>

      {/* Members by role */}
      {allRoles.map(role => grouped[role]?.length > 0 && (
        <section key={role} className="section" style={{ paddingTop: '1rem' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--navy)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--gray-100)' }}>
              {formatRoleHeading(role)}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {grouped[role].map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>
      ))}

      {/* Join section */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h2 className="section-title">Want to Join?</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>
            We are always looking for motivated students and researchers to join our team. 
            Research scholar and student positions may be available based on funding.
          </p>
          <a href="/contact" className="btn btn-primary">Contact Us</a>
        </div>
      </section>
    </main>
  )
}
