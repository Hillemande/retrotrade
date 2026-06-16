'use client'

import { useToast } from '@/contexts/ToastContext'

export default function ProduktKodeClient() {
  const { showToast } = useToast()
  return (
    <button
      className="btn btn-amber"
      style={{ width: '100%', justifyContent: 'center' }}
      onClick={() => showToast('Ekspertchat åbner snart!')}
    >
      Kontakt ekspert
    </button>
  )
}
