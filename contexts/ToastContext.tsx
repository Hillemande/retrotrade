'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface Toast {
  id: number
  msg: string
  out: boolean
}

interface ToastContextType {
  showToast: (msg: string) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

let _toastId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((msg: string) => {
    const id = ++_toastId
    setToasts(prev => [...prev, { id, msg, out: false }])
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, out: true } : t))
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 300)
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} className={`toast${t.out ? ' out' : ''}`} role="status">
            <div className="toast-dot" aria-hidden="true" />
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
