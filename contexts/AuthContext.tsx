'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface CurrentUser {
  id: string
  email: string
  name: string
  address: string
}

interface AuthContextType {
  currentUser: CurrentUser | null
  loadProfile: (authUser: { id: string; email?: string } | null) => Promise<void>
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loadProfile: async () => {},
  refreshUser: async () => {},
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)

  const loadProfile = useCallback(async (authUser: { id: string; email?: string } | null) => {
    if (!authUser) { setCurrentUser(null); return }
    const { data } = await supabase
      .from('profiles')
      .select('full_name, address')
      .eq('id', authUser.id)
      .single()
    setCurrentUser({
      id: authUser.id,
      email: authUser.email || '',
      name: data?.full_name || authUser.email || '',
      address: data?.address || '',
    })
  }, [])

  const refreshUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    await loadProfile(user)
  }, [loadProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await loadProfile(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await loadProfile(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [loadProfile])

  return (
    <AuthContext.Provider value={{ currentUser, loadProfile, refreshUser, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
