'use client'

import React, { createContext, useContext, useState } from 'react'

interface AuthOverlayContextType {
  openAuth: (tab?: 'login' | 'signup') => void
  closeAuth: () => void
  isOpen: boolean
  activeTab: 'login' | 'signup'
  setActiveTab: (tab: 'login' | 'signup') => void
}

const AuthOverlayContext = createContext<AuthOverlayContextType>({
  openAuth: () => {},
  closeAuth: () => {},
  isOpen: false,
  activeTab: 'login',
  setActiveTab: () => {},
})

export function useAuthOverlay() {
  return useContext(AuthOverlayContext)
}

export function AuthOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')

  const openAuth = (tab: 'login' | 'signup' = 'login') => {
    setActiveTab(tab)
    setIsOpen(true)
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden'
  }

  const closeAuth = () => {
    setIsOpen(false)
    if (typeof document !== 'undefined') document.body.style.overflow = ''
  }

  return (
    <AuthOverlayContext.Provider value={{ openAuth, closeAuth, isOpen, activeTab, setActiveTab }}>
      {children}
    </AuthOverlayContext.Provider>
  )
}
