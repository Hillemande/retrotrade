'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthOverlay } from '@/contexts/AuthOverlayContext'
import { useToast } from '@/contexts/ToastContext'

export default function AuthOverlay() {
  const { isOpen, closeAuth, activeTab, setActiveTab } = useAuthOverlay()
  const { loadProfile } = useAuth()
  const { showToast } = useToast()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAuth() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeAuth])

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const pass = (form.elements.namedItem('password') as HTMLInputElement).value
    if (!email || !pass) { showToast('Udfyld e-mail og adgangskode'); return }
    const btn = form.querySelector('button[type=submit]') as HTMLButtonElement
    btn.disabled = true; btn.textContent = 'Logger ind…'
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass })
    btn.disabled = false; btn.textContent = 'Log ind'
    if (error) {
      showToast(error.message.includes('Invalid') ? 'Forkert e-mail eller adgangskode' : error.message)
      return
    }
    await loadProfile(data.user)
    closeAuth()
    showToast('Velkommen tilbage!')
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const address = (form.elements.namedItem('address') as HTMLInputElement).value.trim()
    const pass = (form.elements.namedItem('password') as HTMLInputElement).value
    if (!name || !email || !pass) { showToast('Udfyld alle påkrævede felter'); return }
    if (pass.length < 8) { showToast('Adgangskoden skal være mindst 8 tegn'); return }
    const btn = form.querySelector('button[type=submit]') as HTMLButtonElement
    btn.disabled = true; btn.textContent = 'Opretter…'
    const { data, error } = await supabase.auth.signUp({
      email, password: pass,
      options: { data: { full_name: name } }
    })
    btn.disabled = false; btn.textContent = 'Opret profil gratis'
    if (error) { showToast(error.message); return }
    if (data.user) {
      await supabase.from('profiles').update({ address }).eq('id', data.user.id)
    }
    if (data.session) {
      await loadProfile(data.user)
      closeAuth()
      showToast('Profil oprettet! Velkommen, ' + name.split(' ')[0] + '!')
    } else {
      closeAuth()
      showToast('Tjek din e-mail for at bekræfte din konto')
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="auth-overlay open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) closeAuth() }}
    >
      <div className="auth-box">
        <button className="auth-close" onClick={closeAuth} aria-label="Luk">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div className="auth-tabs">
          <button
            className={`auth-tab${activeTab === 'login' ? ' active' : ''}`}
            onClick={() => setActiveTab('login')}
          >Log ind</button>
          <button
            className={`auth-tab${activeTab === 'signup' ? ' active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >Opret profil</button>
        </div>
        <div className="auth-body">
          {activeTab === 'login' ? (
            <div className="auth-panel active">
              <h2 id="auth-title">Velkommen tilbage</h2>
              <p className="auth-sub">Log ind for at købe og sælge retrotrøjer</p>
              <form onSubmit={handleLogin} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">E-mail</label>
                  <input type="email" id="login-email" name="email" className="form-control" placeholder="din@email.dk" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">Adgangskode</label>
                  <input type="password" id="login-password" name="password" className="form-control" placeholder="••••••••" required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '.5rem' }}>Log ind</button>
              </form>
              <div className="auth-divider">eller</div>
              <p style={{ textAlign: 'center', fontSize: '.875rem', color: 'var(--muted)' }}>
                Ingen profil?{' '}
                <button style={{ color: 'var(--dark)', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setActiveTab('signup')}>Opret her</button>
              </p>
            </div>
          ) : (
            <div className="auth-panel active">
              <h2>Opret profil</h2>
              <p className="auth-sub">Gratis adgang til køb, salg og din samling</p>
              <form onSubmit={handleSignup} noValidate>
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-name">Fulde navn <span className="req">*</span></label>
                  <input type="text" id="signup-name" name="name" className="form-control" placeholder="For- og efternavn" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-email">E-mail <span className="req">*</span></label>
                  <input type="email" id="signup-email" name="email" className="form-control" placeholder="din@email.dk" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-address">Adresse</label>
                  <input type="text" id="signup-address" name="address" className="form-control" placeholder="Vejnavn, postnummer, by" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="signup-password">Adgangskode <span className="req">*</span></label>
                  <input type="password" id="signup-password" name="password" className="form-control" placeholder="Mindst 8 tegn" required minLength={8} />
                </div>
                <button type="submit" className="btn btn-amber" style={{ width: '100%', justifyContent: 'center', marginTop: '.5rem' }}>Opret profil gratis</button>
              </form>
              <p style={{ textAlign: 'center', fontSize: '.8rem', color: 'var(--muted)', marginTop: '1rem' }}>
                Allerede profil?{' '}
                <button style={{ color: 'var(--dark)', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setActiveTab('login')}>Log ind her</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
