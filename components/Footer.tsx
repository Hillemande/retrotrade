'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthOverlay } from '@/contexts/AuthOverlayContext'

export default function Footer() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const { openAuth } = useAuthOverlay()

  function handleSell() {
    if (currentUser) router.push('/sell')
    else openAuth('signup')
  }

  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="nav-logo" style={{ cursor: 'default', color: 'var(--cream)', display: 'block', marginBottom: '1rem' }}>
              Retro<span>marked</span>
            </div>
            <p>Danmarks førende markedsplads for autentiske retro fodboldtrøjer. Vi forbinder fans og samlere siden 2024.</p>
          </div>
          <div className="footer-col">
            <h4>Køb</h4>
            <ul>
              <li><Link href="/shop">Gennemse trøjer</Link></li>
              <li><Link href="/guide">Autenticitetsguide</Link></li>
              <li><Link href="/shop">Nye annoncer</Link></li>
              <li><Link href="/shop">Bedste tilbud</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Sælg</h4>
            <ul>
              <li><button onClick={handleSell}>Opret annonce</button></li>
              <li><Link href="/guide">Prissætningsvejledning</Link></li>
              <li><button onClick={handleSell}>Sælgertips</button></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><Link href="/produktkode">Produktkodeguide</Link></li>
              <li><a href="#">Hjælpecenter</a></li>
              <li><a href="#">Kontakt os</a></li>
              <li><a href="#">Handelsbetingelser</a></li>
              <li><a href="#">Privatlivspolitik</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Retromarked ApS. Alle rettigheder forbeholdes.</p>
          <div className="footer-legal">
            <a href="#">Privatlivspolitik</a>
            <a href="#">Cookies</a>
            <a href="#">Vilkår</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
