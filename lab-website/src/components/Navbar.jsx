import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useLabData } from '../context/LabDataContext'

export default function Navbar() {
  const { labInfo } = useLabData()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/research', label: 'Research' },
    { to: '/publications', label: 'Lab Publications' },
    { to: '/members', label: 'Members' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(13,27,42,0.97)' : 'rgba(13,27,42,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.3)' : 'none',
      transition: 'all 0.3s',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '70px', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
              {labInfo.name}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--gold-light)', letterSpacing: '0.05em' }}>
              {labInfo.university}
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: '0.25rem' }} className="desktop-nav">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={({ isActive }) => ({
                padding: '0.4rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: isActive ? 'var(--gold-light)' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                transition: 'all 0.15s',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(m => !m)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: '1.5rem' }}
          className="hamburger"
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(13,27,42,0.98)',
          padding: '1rem 2rem 1.5rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
        }}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={({ isActive }) => ({
                padding: '0.6rem 0',
                color: isActive ? 'var(--gold-light)' : 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                fontSize: '1rem',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
