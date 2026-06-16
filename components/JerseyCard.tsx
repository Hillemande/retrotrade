'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Jersey } from '@/lib/jerseys'
import { useToast } from '@/contexts/ToastContext'

interface Props {
  jersey: Jersey
  onClick: (j: Jersey) => void
}

export default function JerseyCard({ jersey, onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [liked, setLiked] = useState(false)
  const { showToast } = useToast()

  const team = jersey.club || jersey.team || '—'
  const price = jersey.price || 0
  const cond = jersey.condition || ''
  const thumbPath = jersey.jersey_photos?.[0]
  const thumbUrl = thumbPath
    ? supabase.storage.from('listings').getPublicUrl(thumbPath).data.publicUrl
    : null

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.unobserve(el) }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function toggleWish(e: React.MouseEvent) {
    e.stopPropagation()
    setLiked(v => {
      const next = !v
      showToast(next ? 'Tilføjet til favoritter' : 'Fjernet fra favoritter')
      return next
    })
  }

  return (
    <div
      ref={ref}
      className={`jersey-card reveal${visible ? ' visible' : ''}`}
      role="listitem"
      tabIndex={0}
      aria-label={`${team}, ${price.toLocaleString('da-DK')} kr.`}
      data-era={jersey.era || ''}
      onClick={() => onClick(jersey)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(jersey) }}
    >
      <div className="jersey-card-img">
        {thumbUrl ? (
          <img src={thumbUrl} alt={team} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M30 10 L10 30 L20 35 L20 110 L80 110 L80 35 L90 30 L70 10 L60 20 Q50 25 40 20 Z" stroke="#2D5A3D" strokeWidth="3" fill="#EDE7DA"/>
            <path d="M40 20 Q50 15 60 20" stroke="#2D5A3D" strokeWidth="2" fill="none"/>
            <text x="50" y="75" textAnchor="middle" fontSize="28" fontFamily="serif" fill="#2D5A3D" opacity="0.6">—</text>
          </svg>
        )}
        <div className="jersey-card-img-overlay" />
        {jersey.verified && (
          <span className="tag green" style={{ position: 'absolute', bottom: '.75rem', left: '.75rem', fontSize: '.65rem' }}>Verificeret</span>
        )}
        <button
          className={`jersey-card-wish${liked ? ' liked' : ''}`}
          aria-label={liked ? 'Fjern fra favoritter' : 'Tilføj til favoritter'}
          onClick={toggleWish}
        >
          <svg width="16" height="16" fill={liked ? 'var(--red)' : 'none'} stroke="var(--red)" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>
      <div className="jersey-card-body">
        <div className="jersey-card-team">{team}</div>
        <div className="jersey-card-name">{jersey.season || ''}</div>
        <div className="jersey-card-meta">
          <span className="jersey-card-price">{price.toLocaleString('da-DK')} kr.</span>
          <span className="jersey-card-cond">{cond}</span>
        </div>
      </div>
    </div>
  )
}
