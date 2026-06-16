'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthOverlay } from '@/contexts/AuthOverlayContext'
import { useToast } from '@/contexts/ToastContext'
import Footer from '@/components/Footer'

interface Listing {
  id: string
  club: string
  season?: string
  size?: string
  condition?: string
  price?: number
  description?: string
  status?: string
  created_at?: string
  jersey_photos?: string[]
}

export default function ProfilePage() {
  const { currentUser, refreshUser, signOut } = useAuth()
  const { openAuth } = useAuthOverlay()
  const { showToast } = useToast()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loadingListings, setLoadingListings] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      openAuth('login')
    }
  }, [currentUser, openAuth])

  useEffect(() => {
    if (!currentUser) return
    async function fetchListings() {
      setLoadingListings(true)
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', currentUser!.id)
        .order('created_at', { ascending: false })
      if (!error && data) setListings(data)
      else if (error) showToast('Kunne ikke hente annoncer')
      setLoadingListings(false)
    }
    fetchListings()
  }, [currentUser, showToast])

  async function handleEditProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!currentUser) return
    const form = e.currentTarget
    const newName = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const newEmail = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const newAddress = (form.elements.namedItem('address') as HTMLInputElement).value.trim()
    const newPass = (form.elements.namedItem('password') as HTMLInputElement).value
    const newPass2 = (form.elements.namedItem('password2') as HTMLInputElement).value
    if (newPass) {
      if (newPass.length < 8) { showToast('Ny adgangskode skal være mindst 8 tegn'); return }
      if (newPass !== newPass2) { showToast('Adgangskoderne matcher ikke'); return }
    }
    const btn = form.querySelector('button[type=submit]') as HTMLButtonElement
    btn.disabled = true; btn.textContent = 'Gemmer…'
    await supabase.from('profiles').update({ full_name: newName, address: newAddress }).eq('id', currentUser.id)
    const authUpdate: { email?: string; password?: string } = {}
    if (newEmail && newEmail !== currentUser.email) authUpdate.email = newEmail
    if (newPass) authUpdate.password = newPass
    if (Object.keys(authUpdate).length) await supabase.auth.updateUser(authUpdate)
    await refreshUser()
    btn.disabled = false; btn.textContent = 'Gem ændringer'
    showToast('Profil opdateret!')
  }

  async function handleLogout() {
    await signOut()
    showToast('Du er nu logget ud')
    router.push('/')
  }

  if (!currentUser) return null

  const initials = currentUser.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  const statusLabel: Record<string, string> = { afventer: 'Afventer godkendelse', aktiv: 'Aktiv', solgt: 'Solgt' }
  const statusColor: Record<string, string> = { afventer: 'var(--amber)', aktiv: 'var(--green)', solgt: 'var(--muted)' }

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="container">
          <div className="section-label" style={{ color: 'rgba(200,134,10,1)' }}>Din konto</div>
          <h1>Hej, {currentUser.name.split(' ')[0]}</h1>
          <p>{currentUser.email}</p>
        </div>
      </div>
      <div className="profile-content container">
        <div className="profile-grid">
          <aside className="profile-sidebar">
            <div className="profile-avatar-block">
              <div className="profile-avatar">{initials}</div>
              <div className="profile-avatar-name">{currentUser.name}</div>
              <div className="profile-avatar-email">{currentUser.email}</div>
            </div>
            <nav className="profile-nav">
              <button className="profile-nav-item active">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Profil
              </button>
              <button className="profile-nav-item" onClick={() => router.push('/sell')}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                Sælg trøje
              </button>
              <button className="profile-nav-item" onClick={() => router.push('/shop')}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                Mine køb
              </button>
              <button className="profile-nav-item" onClick={handleLogout}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Log ud
              </button>
            </nav>
          </aside>
          <main className="profile-main">
            <div className="profile-section">
              <h3>Personlige oplysninger</h3>
              <form onSubmit={handleEditProfile} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="pe-name">Fulde navn</label>
                    <input type="text" id="pe-name" name="name" className="form-control" defaultValue={currentUser.name} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pe-email">E-mail</label>
                    <input type="email" id="pe-email" name="email" className="form-control" defaultValue={currentUser.email} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pe-address">Adresse</label>
                  <input type="text" id="pe-address" name="address" className="form-control" defaultValue={currentUser.address} placeholder="Vejnavn, postnummer, by" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="pe-password">Ny adgangskode</label>
                    <input type="password" id="pe-password" name="password" className="form-control" placeholder="Lad stå tom for at beholde" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pe-password2">Bekræft adgangskode</label>
                    <input type="password" id="pe-password2" name="password2" className="form-control" placeholder="Gentag ny adgangskode" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Gem ændringer</button>
              </form>
            </div>

            <div className="profile-section">
              <h3>Mine annoncer</h3>
              {loadingListings ? (
                <p style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Henter annoncer…</p>
              ) : listings.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: '.9rem', margin: 0 }}>Du har ingen aktive annoncer endnu.</p>
              ) : (
                <div className="profile-listings-grid">
                  {listings.map(l => {
                    const thumbPath = l.jersey_photos?.[0]
                    const thumbUrl = thumbPath
                      ? supabase.storage.from('listings').getPublicUrl(thumbPath).data.publicUrl
                      : null
                    const sLabel = statusLabel[l.status || ''] || l.status || ''
                    const sColor = statusColor[l.status || ''] || 'var(--muted)'
                    return (
                      <div key={l.id} className="profile-listing-card">
                        {thumbUrl && (
                          <img src={thumbUrl} alt={l.club} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '.75rem' }} />
                        )}
                        <div className="plc-header">
                          <span className="plc-club">{l.club || '—'}</span>
                          <span className="plc-status" style={{ color: sColor }}>{sLabel}</span>
                        </div>
                        <div className="plc-meta">
                          {l.season && <span>Sæson: {l.season}</span>}
                          {l.size && <span>Str. {l.size}</span>}
                          {l.condition && <span>{l.condition}</span>}
                          {l.price && <span className="plc-price">{Number(l.price).toLocaleString('da-DK')} kr.</span>}
                        </div>
                        {l.description && (
                          <p className="plc-desc">{l.description.slice(0, 120)}{l.description.length > 120 ? '…' : ''}</p>
                        )}
                        <div className="plc-footer">
                          <time className="plc-date">
                            {l.created_at && new Date(l.created_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </time>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
