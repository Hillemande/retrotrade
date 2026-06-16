'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthOverlay } from '@/contexts/AuthOverlayContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser } = useAuth()
  const { openAuth } = useAuthOverlay()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const initials = currentUser
    ? currentUser.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : ''

  function handleProfileClick() {
    if (currentUser) router.push('/profile')
    else openAuth('login')
  }

  function handleSellClick() {
    if (currentUser) router.push('/sell')
    else openAuth('signup')
  }

  const navLinkClass = (href: string) =>
    pathname === href ? 'active' : ''

  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''} role="navigation" aria-label="Hovednavigation">
      <div className="container">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            Retro<span>marked</span>
          </Link>
          <ul className="nav-links" role="list">
            <li><Link href="/" className={`nav-btn ${navLinkClass('/')}`}>Forside</Link></li>
            <li><Link href="/shop" className={`nav-btn ${navLinkClass('/shop')}`}>Køb trøjer</Link></li>
            <li><Link href="/guide" className={`nav-btn ${navLinkClass('/guide')}`}>Autenticitetsguide</Link></li>
          </ul>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <button className="btn btn-amber nav-cta" onClick={handleSellClick}>Sælg din trøje</button>
            <button
              className={`nav-profile-btn${currentUser ? ' logged-in' : ''}`}
              onClick={handleProfileClick}
              aria-label="Profil / Log ind"
              title={currentUser ? currentUser.name : 'Log ind / Opret profil'}
            >
              {currentUser ? (
                <span>{initials}</span>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              )}
            </button>
          </div>
          <button
            className="nav-hamburger"
            aria-label="Åbn menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(v => !v)}
          >
            <span /><span /><span />
          </button>
        </div>
        <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} role="menu">
          <Link href="/" onClick={() => setMobileOpen(false)}>Forside</Link>
          <Link href="/shop" onClick={() => setMobileOpen(false)}>Køb trøjer</Link>
          <Link href="/guide" onClick={() => setMobileOpen(false)}>Autenticitetsguide</Link>
          <button
            onClick={() => { setMobileOpen(false); handleSellClick() }}
            style={{ background: 'var(--amber)', color: 'var(--white)', borderRadius: '4px', marginTop: '.5rem' }}
          >Sælg din trøje</button>
          <button
            onClick={() => { setMobileOpen(false); handleProfileClick() }}
            style={{ background: 'var(--cream-dk)', borderRadius: '4px', marginTop: '.25rem' }}
          >Min profil / Log ind</button>
        </div>
      </div>
    </nav>
  )
}
