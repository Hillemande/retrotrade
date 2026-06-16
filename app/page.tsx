'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { FALLBACK_JERSEYS, type Jersey } from '@/lib/jerseys'
import JerseyCard from '@/components/JerseyCard'
import Modal from '@/components/Modal'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthOverlay } from '@/contexts/AuthOverlayContext'
import { useToast } from '@/contexts/ToastContext'

export default function HomePage() {
  const [jerseys, setJerseys] = useState<Jersey[]>(FALLBACK_JERSEYS)
  const [era, setEra] = useState('all')
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null)
  const [searchVal, setSearchVal] = useState('')
  const [counters, setCounters] = useState({ listings: 0, sellers: 0, feedback: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { currentUser } = useAuth()
  const { openAuth } = useAuthOverlay()
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchJerseys() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'aktiv')
        .order('created_at', { ascending: false })
        .limit(8)
      if (!error && data && data.length > 0) {
        setJerseys(data)
      }
    }
    fetchJerseys()
  }, [])

  // Counter animation
  useEffect(() => {
    const targets = { listings: 0, sellers: 0, feedback: 0 }
    const duration = 1600
    const start = performance.now()

    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setCounters({
        listings: Math.round(ease * targets.listings),
        sellers: Math.round(ease * targets.sellers),
        feedback: Math.round(ease * targets.feedback),
      })
      if (p < 1) requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { requestAnimationFrame(step); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (heroRef.current) observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  const filteredJerseys = era === 'all' ? jerseys : jerseys.filter(j => j.era === era)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchVal.trim()) router.push('/shop')
  }

  function handleSell() {
    if (currentUser) router.push('/sell')
    else openAuth('signup')
  }

  return (
    <div className="hero-page">
      {selectedJersey && <Modal jersey={selectedJersey} onClose={() => setSelectedJersey(null)} />}

      {/* Hero */}
      <section className="hero container" aria-label="Velkomstbanner" ref={heroRef}>
        <div className="hero-left reveal visible">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot" aria-hidden="true" />
            <span className="hero-eyebrow-text">Danmarks retro fodboldmarkedsplads</span>
          </div>
          <h1>Find din<br /><span className="accent">klassiske</span><br />fodboldtrøje</h1>
          <p className="hero-desc">Køb og sælg autentiske retrotrøjer fra de største klubber og landshold. Verificerede sælgere. Garanteret ægthed.</p>
          <form className="hero-search" onSubmit={handleSearch} role="search" aria-label="Søg efter trøjer">
            <input
              type="search"
              placeholder="Søg f.eks. Barcelona 1999, Laudrup, Ajax 1995..."
              aria-label="Søgefelt"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
            <button type="submit" aria-label="Søg">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Søg
            </button>
          </form>
          <div className="hero-stats" role="list" aria-label="Platforminfo">
            <div role="listitem">
              <div className="hero-stat-num">100%</div>
              <div className="hero-stat-label">Fokus på autenticitet</div>
            </div>
            <div role="listitem">
              <div className="hero-stat-num">Gratis</div>
              <div className="hero-stat-label">At oprette annonce</div>
            </div>
            <div role="listitem">
              <div className="hero-stat-num">Ny</div>
              <div className="hero-stat-label">Platform – vær med fra starten</div>
            </div>
          </div>
        </div>
        <div className="hero-right" aria-hidden="true">
          <div className="hero-decoration" />
          <div className="hero-jersey-stack">
            {/* Left jersey */}
            <div className="jersey-card-hero jersey-card-hero-left">
              <div className="jersey-img-placeholder">
                <svg className="jersey-svg" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 10 L10 30 L20 35 L20 110 L80 110 L80 35 L90 30 L70 10 L60 20 Q50 25 40 20 Z" stroke="#2D5A3D" strokeWidth="3" fill="#EDE7DA"/>
                  <path d="M40 20 Q50 15 60 20" stroke="#2D5A3D" strokeWidth="2" fill="none"/>
                  <text x="50" y="75" textAnchor="middle" fontSize="28" fontFamily="serif" fill="#2D5A3D" opacity="0.6">7</text>
                </svg>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>Ajax</div>
                  <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--dark)' }}>1994–95</div>
                </div>
              </div>
              <span className="jersey-badge">kr. 1.800</span>
            </div>
            {/* Main jersey */}
            <div className="jersey-card-hero jersey-card-hero-main">
              <div className="jersey-img-placeholder" style={{ background: 'linear-gradient(135deg,#1a1a18 0%,#2c2c28 100%)' }}>
                <svg className="jersey-svg" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 10 L10 30 L20 35 L20 110 L80 110 L80 35 L90 30 L70 10 L60 20 Q50 25 40 20 Z" stroke="#C8860A" strokeWidth="3" fill="#2C2C28"/>
                  <path d="M40 20 Q50 15 60 20" stroke="#C8860A" strokeWidth="2" fill="none"/>
                  <text x="50" y="75" textAnchor="middle" fontSize="28" fontFamily="serif" fill="#C8860A" opacity="0.9">10</text>
                </svg>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(247,243,236,.5)' }}>Juventus</div>
                  <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--cream)' }}>1996–97</div>
                </div>
              </div>
              <span className="jersey-badge" style={{ background: 'var(--green)' }}>Verificeret</span>
              <div className="jersey-info">
                <div className="jersey-info-name">Del Piero — Spillertrøje</div>
                <div className="jersey-info-price">kr. 4.500</div>
              </div>
            </div>
            {/* Right jersey */}
            <div className="jersey-card-hero jersey-card-hero-right">
              <div className="jersey-img-placeholder" style={{ background: 'linear-gradient(135deg,#1B3A6B 0%,#2952a3 100%)' }}>
                <svg className="jersey-svg" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 10 L10 30 L20 35 L20 110 L80 110 L80 35 L90 30 L70 10 L60 20 Q50 25 40 20 Z" stroke="#FFD700" strokeWidth="3" fill="#2952a3"/>
                  <text x="50" y="75" textAnchor="middle" fontSize="28" fontFamily="serif" fill="#FFD700" opacity="0.9">11</text>
                </svg>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(247,243,236,.5)' }}>Barcelona</div>
                  <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--cream)' }}>1998–99</div>
                </div>
              </div>
              <span className="jersey-badge" style={{ background: 'var(--red)' }}>Selges</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="era-strip" aria-hidden="true">
        <div className="era-track">
          {['1970erne','Premier League Klassikere','1980erne','Champions League Legender','1990erne','VM Trøjer','2000erne','Serie A Guld',
            '1970erne','Premier League Klassikere','1980erne','Champions League Legender','1990erne','VM Trøjer','2000erne','Serie A Guld'].map((item, i) => (
            <span key={i} className="era-item">
              <span className="era-item-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Listings */}
      <section className="featured-section container" aria-labelledby="featured-heading">
        <div className="section-header">
          <div>
            <div className="section-label">Udvalgte annoncer</div>
            <h2 id="featured-heading">Populære trøjer<br />lige nu</h2>
          </div>
          <div>
            <div className="era-tabs" role="tablist" aria-label="Filtrer efter årti">
              {['all','70s','80s','90s','00s'].map(e => (
                <button
                  key={e}
                  className={`era-tab${era === e ? ' active' : ''}`}
                  role="tab"
                  aria-selected={era === e}
                  onClick={() => setEra(e)}
                >
                  {e === 'all' ? 'Alle' : e === '70s' ? '70erne' : e === '80s' ? '80erne' : e === '90s' ? '90erne' : '00erne'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="jersey-grid" role="list" aria-label="Udvalgte trøjer">
          {filteredJerseys.map((j, i) => (
            <JerseyCard key={j.id || i} jersey={j} onClick={setSelectedJersey} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn btn-outline" onClick={() => router.push('/shop')}>
            Se alle trøjer
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      {/* Trust */}
      <section className="trust-section" aria-labelledby="trust-heading">
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <div className="section-label" style={{ color: 'rgba(200,134,10,1)' }}>Hvorfor Retromarked</div>
            <h2 id="trust-heading" style={{ color: 'var(--cream)', fontSize: 'clamp(2rem,3.5vw,2.8rem)' }}>Handel med<br />tryghed og tillid</h2>
          </div>
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon" aria-hidden="true">
                <svg width="24" height="24" fill="none" stroke="var(--amber)" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h3>Autenticitetsgaranti</h3>
              <p>Alle trøjer gennemgår vores verificeringsproces. Vi kontrollerer stikning, mærker og materialekvalitet.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon" aria-hidden="true">
                <svg width="24" height="24" fill="none" stroke="var(--amber)" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
              </div>
              <h3>Sikker betaling</h3>
              <p>Pengene frigives kun til sælger, når du har bekræftet modtagelsen og er tilfreds med trøjen.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon" aria-hidden="true">
                <svg width="24" height="24" fill="none" stroke="var(--amber)" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              </div>
              <h3>Direkte kommunikation</h3>
              <p>Chat direkte med sælger, stil spørgsmål og forhandl prisen — alt samlet på ét sted.</p>
            </div>
            <div className="trust-item">
              <div className="trust-icon" aria-hidden="true">
                <svg width="24" height="24" fill="none" stroke="var(--amber)" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              </div>
              <h3>Nem retur</h3>
              <p>Ikke tilfreds? Du har 14 dages returret fra du modtager din trøje, ingen spørgsmål stillet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner" aria-labelledby="cta-heading">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div>
            <div className="section-label" style={{ color: 'rgba(255,255,255,.6)', justifyContent: 'center' }}>Sælg din samling</div>
            <h2 id="cta-heading">Har du retrotrøjer<br />der samler støv?</h2>
            <p>Opret din annonce gratis på under 5 minutter og nå tusindvis af passionerede samlere.</p>
            <button className="btn btn-amber" onClick={handleSell}>
              Sæt din trøje til salg
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
