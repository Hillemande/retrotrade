import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import AuthOverlay from '@/components/AuthOverlay'
import Footer from '@/components/Footer'
import { ToastProvider } from '@/contexts/ToastContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthOverlayProvider } from '@/contexts/AuthOverlayContext'

export const metadata: Metadata = {
  title: 'Retromarked — Køb & Sælg Retrotrøjer',
  description: 'Danmarks største markedsplads for autentiske retro fodboldtrøjer. Køb og sælg klassiske trøjer fra hele verden.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body>
        <AuthProvider>
          <AuthOverlayProvider>
            <ToastProvider>
              <Navbar />
              {children}
              <AuthOverlay />
            </ToastProvider>
          </AuthOverlayProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
