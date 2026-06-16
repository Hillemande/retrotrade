'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { CLUBS, COUNTRIES } from '@/lib/jerseys'
import UploadZone from '@/components/UploadZone'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthOverlay } from '@/contexts/AuthOverlayContext'
import { useToast } from '@/contexts/ToastContext'

const BADGES = [
  { id: 'liga', label: 'Liga Badge' },
  { id: 'ucl', label: 'Champions League Badge' },
  { id: 'uel', label: 'Europa League Badge' },
]

function generateSeasons() {
  const seasons: string[] = []
  for (let y = 2025; y >= 1955; y--) {
    seasons.push(`${y}–${String(y + 1).slice(-2)}`)
  }
  return seasons
}

export default function SellPage() {
  const { currentUser } = useAuth()
  const { openAuth } = useAuthOverlay()
  const { showToast } = useToast()
  const router = useRouter()

  const [teamType, setTeamType] = useState<'klub' | 'landshold'>('klub')
  const [comboQuery, setComboQuery] = useState('')
  const [comboOpen, setComboOpen] = useState(false)
  const [comboSelected, setComboSelected] = useState('')
  const [comboConfirmed, setComboConfirmed] = useState(false)
  const [comboFocused, setComboFocused] = useState(-1)
  const [isWorldMode, setIsWorldMode] = useState(false)
  const [freeClub, setFreeClub] = useState('')
  const [jerseyFiles, setJerseyFiles] = useState<File[]>([])
  const [codeFiles, setCodeFiles] = useState<File[]>([])
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [andetChecked, setAndetChecked] = useState(false)
  const [andetText, setAndetText] = useState('')
  const [jerseyError, setJerseyError] = useState(false)
  const [codeError, setCodeError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const comboRef = useRef<HTMLDivElement>(null)

  const items = teamType === 'landshold' ? COUNTRIES : CLUBS
  const comboMatches = comboQuery.trim()
    ? items.filter(i => i.toLowerCase().includes(comboQuery.toLowerCase())).slice(0, 30)
    : []

  function selectCombo(value: string) {
    setComboQuery(value)
    setComboSelected(value)
    setComboConfirmed(true)
    setComboOpen(false)
    setComboFocused(-1)
  }

  function handleComboKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setComboFocused(v => Math.min(v + 1, comboMatches.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setComboFocused(v => Math.max(v - 1, 0))
    } else if (e.key === 'Enter' && comboFocused >= 0) {
      e.preventDefault()
      selectCombo(comboMatches[comboFocused])
    } else if (e.key === 'Escape') {
      setComboOpen(false)
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setComboOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Redirect if not logged in
  useEffect(() => {
    if (currentUser === null) {
      // Wait a tick for auth to initialize
      const timer = setTimeout(() => {
        if (!currentUser) openAuth('signup')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentUser, openAuth])

  function highlightMatch(text: string, query: string) {
    if (!query) return text
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(re)
    return parts.map((part, i) =>
      re.test(part) ? <mark key={i}>{part}</mark> : part
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!currentUser) { openAuth('login'); return }

    const form = e.currentTarget
    const errors: string[] = []

    if (!isWorldMode && !comboConfirmed) errors.push('klub')
    if (codeFiles.length === 0) { errors.push('code'); setCodeError(true) } else setCodeError(false)
    if (jerseyFiles.length === 0) { errors.push('jersey'); setJerseyError(true) } else setJerseyError(false)

    const season = (form.elements.namedItem('season') as HTMLSelectElement).value
    const size = (form.elements.namedItem('size') as HTMLSelectElement).value
    const condition = (form.elements.namedItem('condition') as HTMLSelectElement).value
    const price = (form.elements.namedItem('price') as HTMLInputElement).value
    const desc = (form.elements.namedItem('desc') as HTMLTextAreaElement).value
    const terms = (form.elements.namedItem('terms') as HTMLInputElement).checked

    if (!season) errors.push('season')
    if (!size) errors.push('size')
    if (!condition) errors.push('condition')
    if (!price) errors.push('price')
    if (!desc.trim()) errors.push('desc')
    if (!terms) errors.push('terms')

    if (errors.length > 0) {
      if (errors.includes('klub')) showToast('Vælg venligst en klub/landshold fra listen')
      else if (errors.includes('code')) showToast('Upload venligst et foto af produktkoden')
      else showToast('Udfyld venligst alle påkrævede felter')
      return
    }

    setSubmitting(true)
    try {
      const folder = `${currentUser.id}/${Date.now()}`

      // Upload jersey photos
      const jerseyPaths: string[] = []
      for (let i = 0; i < jerseyFiles.length; i++) {
        const file = jerseyFiles[i]
        const ext = file.name.split('.').pop()
        const path = `${folder}/jersey_${i}.${ext}`
        const { error } = await supabase.storage.from('listings').upload(path, file)
        if (error) throw new Error('Billedupload fejlede: ' + error.message)
        jerseyPaths.push(path)
      }

      // Upload product code photo
      const codeFile = codeFiles[0]
      const codeExt = codeFile.name.split('.').pop()
      const codePath = `${folder}/code.${codeExt}`
      const { error: codeErr } = await supabase.storage.from('listings').upload(codePath, codeFile)
      if (codeErr) throw new Error('Produktkode-upload fejlede: ' + codeErr.message)

      const clubVal = isWorldMode
        ? (form.elements.namedItem('freeclub') as HTMLInputElement)?.value || 'Landshold/Verden'
        : comboSelected

      const badges = [...selectedBadges]
      if (andetChecked && andetText) badges.push('andet:' + andetText)

      const player = (form.elements.namedItem('player') as HTMLInputElement).value

      const { error: dbErr } = await supabase.from('listings').insert({
        user_id: currentUser.id,
        club: clubVal,
        season,
        size,
        condition,
        price: parseInt(price),
        description: desc,
        player: player || null,
        badges: badges.length ? badges : null,
        jersey_photos: jerseyPaths.length ? jerseyPaths : null,
        code_photo: codePath,
        status: 'aktiv',
      })
      if (dbErr) throw new Error('Kunne ikke gemme annonce: ' + dbErr.message)

      showToast('Din trøje er nu på markedet!')
      setTimeout(() => router.push('/shop'), 1200)
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Noget gik galt')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="sell-page">
      <div className="sell-hero">
        <div className="container">
          <div className="section-label" style={{ color: 'rgba(255,255,255,.7)' }}>Tjen penge på din samling</div>
          <h1>Sælg din trøje</h1>
          <p>Opret en annonce gratis og nå over 40.000 aktive samlere</p>
        </div>
      </div>

      <div className="container">
        <div className="sell-steps">
          {[
            { num: '1', title: 'Beskriv trøjen', desc: 'Udfyld oplysninger om klub, sæson, størrelse og stand' },
            { num: '2', title: 'Upload billeder', desc: 'Tilføj klare fotos fra alle vinkler inklusive mærker og detaljer' },
            { num: '3', title: 'Verificering', desc: 'Vores eksperter gennemgår trøjens ægthed inden 24 timer' },
            { num: '4', title: 'Sælg & tjen', desc: 'Annoncen er live — modtag betalingen direkte på din konto' },
          ].map(s => (
            <div key={s.num} className="sell-step">
              <div className="sell-step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="sell-form-wrap">
          <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Opret annonce</h2>
          <form className="sell-form" onSubmit={handleSubmit} noValidate aria-label="Sælg trøje formular">

            {/* Holdtype */}
            <div className="form-group">
              <label className="form-label">Holdtype <span className="req" aria-hidden="true">*</span></label>
              <div className="type-toggle" role="group" aria-label="Vælg holdtype">
                <button
                  type="button"
                  className={`type-btn${teamType === 'klub' ? ' active' : ''}`}
                  onClick={() => { setTeamType('klub'); setComboQuery(''); setComboSelected(''); setComboConfirmed(false) }}
                >Klubhold</button>
                <button
                  type="button"
                  className={`type-btn${teamType === 'landshold' ? ' active' : ''}`}
                  onClick={() => { setTeamType('landshold'); setComboQuery(''); setComboSelected(''); setComboConfirmed(false) }}
                >Landshold</button>
              </div>
            </div>

            {/* Klub/Land combobox */}
            <div className="form-group">
              <label className="form-label">
                {teamType === 'landshold' ? 'Landshold' : 'Klub'} <span className="req" aria-hidden="true">*</span>
              </label>
              <label className="filter-checkbox" style={{ marginBottom: '.75rem', fontSize: '.875rem' }}>
                <input
                  type="checkbox"
                  checked={isWorldMode}
                  onChange={e => {
                    setIsWorldMode(e.target.checked)
                    setComboConfirmed(e.target.checked)
                  }}
                />
                Fra et andet sted i verden (sjælden / ukendt klub)
              </label>

              {!isWorldMode ? (
                <div className="combobox-wrap" ref={comboRef}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={teamType === 'landshold' ? 'Søg og vælg land fra listen...' : 'Søg og vælg klub fra listen...'}
                    value={comboQuery}
                    autoComplete="off"
                    aria-autocomplete="list"
                    onChange={e => {
                      setComboQuery(e.target.value)
                      setComboConfirmed(false)
                      setComboSelected('')
                      setComboOpen(true)
                    }}
                    onFocus={() => { if (comboQuery) setComboOpen(true) }}
                    onKeyDown={handleComboKeyDown}
                  />
                  {comboOpen && comboQuery && (
                    <div className="combobox-dropdown open" role="listbox">
                      {comboMatches.length === 0 ? (
                        <div className="combobox-empty">Ingen resultater — prøv et andet søgeord</div>
                      ) : comboMatches.map((item, idx) => (
                        <div
                          key={item}
                          className={`combobox-option${comboFocused === idx ? ' focused' : ''}`}
                          role="option"
                          onMouseDown={e => { e.preventDefault(); selectCombo(item) }}
                        >
                          {highlightMatch(item, comboQuery)}
                        </div>
                      ))}
                    </div>
                  )}
                  {comboConfirmed && (
                    <div className="combobox-selected">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                      <span>{comboSelected}</span>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  name="freeclub"
                  className="form-control"
                  placeholder="Skriv klubnavn manuelt (f.eks. Santos, Flamengo...)"
                  value={freeClub}
                  onChange={e => setFreeClub(e.target.value)}
                />
              )}
            </div>

            {/* Sæson + Størrelse */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="sell-season">Sæson <span className="req" aria-hidden="true">*</span></label>
                <select id="sell-season" name="season" className="form-control" required>
                  <option value="">Vælg sæson</option>
                  {generateSeasons().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sell-size">Størrelse <span className="req" aria-hidden="true">*</span></label>
                <select id="sell-size" name="size" className="form-control" required>
                  <option value="">Vælg størrelse</option>
                  {['XS','S','M','L','XL','XXL','XXXL'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Stand + Pris */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="sell-condition">Stand <span className="req" aria-hidden="true">*</span></label>
                <select id="sell-condition" name="condition" className="form-control" required>
                  <option value="">Vælg stand</option>
                  <option>Ny med tag (BNWT)</option>
                  <option>Meget god stand</option>
                  <option>God stand</option>
                  <option>Acceptabel stand</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sell-price">Pris (kr.) <span className="req" aria-hidden="true">*</span></label>
                <input type="number" id="sell-price" name="price" className="form-control" placeholder="f.eks. 1200" min="0" required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sell-player">Spiller / Navn på trøje</label>
              <input type="text" id="sell-player" name="player" className="form-control" placeholder="f.eks. Laudrup, Zidane, Ronaldinho" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sell-desc">Beskrivelse <span className="req" aria-hidden="true">*</span></label>
              <textarea id="sell-desc" name="desc" className="form-control" placeholder="Beskriv trøjens stand, eventuelle fejl, autentificering, proviens osv." required />
            </div>

            {/* Upload zones */}
            <div className="form-group">
              <label className="form-label">Billeder af trøjen <span className="req" aria-hidden="true">*</span></label>
              <div className="upload-pair">
                <div>
                  <div className="upload-zone-label">Trøjefotos (forside, bagside, detaljer)</div>
                  <UploadZone
                    id="upload-jersey"
                    multi
                    onFilesChange={files => { setJerseyFiles(files); setJerseyError(false) }}
                    hasError={jerseyError}
                  />
                </div>
                <div>
                  <div className="upload-zone-label">Foto af produktkode / ægthedsmærke</div>
                  <Link href="/produktkode" className="upload-help-link" target="_blank" rel="noopener">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    Hvor finder jeg produktkoden?
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true" style={{ opacity: .7 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                  </Link>
                  <UploadZone
                    id="upload-code"
                    multi={false}
                    onFilesChange={files => { setCodeFiles(files); setCodeError(false) }}
                    hasError={codeError}
                  />
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="form-group">
              <label className="form-label">Badges på trøjen <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(valgfrit)</span></label>
              <p style={{ fontSize: '.8rem', color: 'var(--muted)', marginBottom: '.875rem' }}>Angiv hvilke officielle badges/emblemer der sidder på trøjen</p>
              <div className="badge-grid">
                {BADGES.map(b => (
                  <label
                    key={b.id}
                    className={`badge-option${selectedBadges.includes(b.id) ? ' checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBadges.includes(b.id)}
                      onChange={e => {
                        setSelectedBadges(prev =>
                          e.target.checked ? [...prev, b.id] : prev.filter(x => x !== b.id)
                        )
                      }}
                    />
                    {b.label}
                  </label>
                ))}
                <div>
                  <label className={`badge-option${andetChecked ? ' checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={andetChecked}
                      onChange={e => setAndetChecked(e.target.checked)}
                    />
                    Andet badge
                  </label>
                  {andetChecked && (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Beskriv badge (f.eks. Coppa Italia, FA Cup...)"
                      value={andetText}
                      onChange={e => setAndetText(e.target.value)}
                      style={{ marginTop: '.5rem', fontSize: '.875rem' }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1.5rem', fontSize: '.875rem', color: 'var(--muted)' }}>
              <input type="checkbox" name="terms" id="sell-terms" style={{ accentColor: 'var(--dark)', width: '16px', height: '16px' }} required />
              <label htmlFor="sell-terms">
                Jeg accepterer <a href="#" style={{ color: 'var(--dark)', textDecoration: 'underline' }}>handelsbetingelserne</a> og bekræfter at trøjen er autentisk
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-amber"
              style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
              disabled={submitting}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              {submitting ? 'Uploader…' : 'Send annonce til verificering'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
