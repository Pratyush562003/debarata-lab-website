import { Link } from 'react-router-dom'
import { useLabData } from '../context/LabDataContext'

export default function Footer() {
  const { labInfo } = useLabData()
  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.75)', padding: '3rem 0 1.5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#fff', marginBottom: '0.5rem' }}>
              {labInfo.name}
            </div>
            <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>{labInfo.university}</div>
            <div style={{ fontSize: '0.85rem' }}>{labInfo.department}</div>
          </div>

          <div>
            <div style={{ fontWeight: 600, color: 'var(--gold-light)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Quick Links</div>
            {[['/', 'Home'], ['/about', 'About'], ['/research', 'Research'], ['/publications', 'Lab Publications'], ['/members', 'Members'], ['/contact', 'Contact']].map(([to, label]) => (
              <div key={to} style={{ marginBottom: '0.35rem' }}>
                <Link to={to} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.87rem', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
                >{label}</Link>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontWeight: 600, color: 'var(--gold-light)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Contact</div>
            <div style={{ fontSize: '0.85rem', lineHeight: 1.8 }}>
              <div>
                📧 {labInfo.email}
                {labInfo.alternateEmail && labInfo.alternateEmail.trim() ? ` / ${labInfo.alternateEmail}` : ''}
              </div>
              <div>
                📞 {labInfo.phone}
                {labInfo.alternatePhone && labInfo.alternatePhone.trim() ? ` / ${labInfo.alternatePhone}` : ''}
              </div>
              <div style={{ marginTop: '0.5rem' }}>{labInfo.address}</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>
          <span>© {new Date().getFullYear()} {labInfo.fullName}. All rights reserved.</span>
          <Link to="/admin" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', textDecoration: 'none' }}>Admin</Link>
        </div>
      </div>
    </footer>
  )
}
