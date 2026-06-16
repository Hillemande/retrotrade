'use client'

import { useEffect, useRef } from 'react'
import type { Jersey } from '@/lib/jerseys'
import { useToast } from '@/contexts/ToastContext'

interface Props {
  jersey: Jersey | null
  onClose: () => void
}

export default function Modal({ jersey, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

  useEffect(() => {
    if (!jersey) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [jersey, onClose])

  if (!jersey) return null

  const team = jersey.club || jersey.team || '—'
  const desc = jersey.description || jersey.desc || ''
  const price = jersey.price || 0

  return (
    <div
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Luk">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div className="modal-body">
          <div className="modal-gallery">
            <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: 120 }}>
              <path d="M30 10 L10 30 L20 35 L20 110 L80 110 L80 35 L90 30 L70 10 L60 20 Q50 25 40 20 Z" stroke="#2D5A3D" strokeWidth="3" fill="#EDE7DA"/>
              <text x="50" y="75" textAnchor="middle" fontSize="28" fontFamily="serif" fill="#2D5A3D" opacity="0.6">{jersey.num || ''}</text>
            </svg>
            <div className="modal-gallery-badge">
              {jersey.verified
                ? <span className="tag green">Verificeret</span>
                : <span className="tag" style={{ background: 'var(--cream)' }}>Ikke verificeret</span>
              }
            </div>
          </div>
          <div className="modal-details">
            <div className="modal-team">{team}</div>
            <h2 className="modal-title" id="modal-title">{jersey.season || team}</h2>
            <div className="modal-price">{price.toLocaleString('da-DK')} kr.</div>
            <div className="modal-seller">
              Sælges af <a href="#">@sælger</a> · <span>{jersey.location || 'Danmark'}</span>
            </div>
            <div className="modal-attributes">
              {jersey.season && (
                <div className="modal-attr">
                  <span className="modal-attr-label">Sæson</span>
                  <span className="modal-attr-value">{jersey.season}</span>
                </div>
              )}
              {jersey.size && (
                <div className="modal-attr">
                  <span className="modal-attr-label">Størrelse</span>
                  <span className="modal-attr-value">{jersey.size}</span>
                </div>
              )}
              {jersey.condition && (
                <div className="modal-attr">
                  <span className="modal-attr-label">Stand</span>
                  <span className="modal-attr-value">{jersey.condition}</span>
                </div>
              )}
              {jersey.liga && (
                <div className="modal-attr">
                  <span className="modal-attr-label">Liga</span>
                  <span className="modal-attr-value">{jersey.liga}</span>
                </div>
              )}
            </div>
            <p className="modal-desc">{desc}</p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={() => showToast('Chatfunktion lanceres snart!')}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                Kontakt sælger
              </button>
              <button className="btn btn-amber" onClick={() => showToast('Tilføjet til favoritter!')}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                Gem til favoritter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
