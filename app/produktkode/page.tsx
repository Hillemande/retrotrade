import Link from 'next/link'
import Footer from '@/components/Footer'
import ProduktKodeClient from './ProduktKodeClient'

export const metadata = {
  title: 'Produktkodeguide — Retromarked',
}

export default function ProduktKodePage() {
  return (
    <div className="produktkode-page">
      <div className="productcode-hero">
        <div className="container">
          <div className="section-label" style={{ color: 'rgba(255,255,255,.7)' }}>Autentificering</div>
          <h1>Sådan finder du produktkoden</h1>
          <p>En trin-for-trin guide til at identificere og dokumentere din retrotrøjes ægthed</p>
        </div>
      </div>
      <div className="productcode-content container">
        <div className="productcode-grid">
          <div>
            {/* Step 1 */}
            <div className="pc-step">
              <div className="pc-step-num">1</div>
              <div>
                <h3>Find vaskeanvisnings­mærket (vaskemærket)</h3>
                <p>Vend trøjen på vrangen. Vaskemærket sidder typisk i nakken, ned langs siden eller i bunden af trøjen. Det er det vigtigste sted for produktkoden.</p>
                <div className="pc-mockup">
                  <div style={{ position: 'relative' }}>
                    <div className="pc-label-diagram">
                      <div className="pc-label-field">100% Polyester</div>
                      <div className="pc-label-field">Made in Thailand</div>
                      <div className="pc-label-field highlight">Prod. Code: <strong>FB1234-567</strong></div>
                      <div className="pc-label-field">XL / Taglia XL</div>
                      <div className="pc-label-field">30°C / No tumble dry</div>
                    </div>
                    <div className="pc-arrow">←</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="pc-step">
              <div className="pc-step-num">2</div>
              <div>
                <h3>Hvad ser produktkoden ud?</h3>
                <p>Produktkoden (også kaldet &quot;item number&quot;, &quot;style code&quot; eller &quot;article number&quot;) er en unik kombination af bogstaver og tal, der identificerer den præcise model og sæson.</p>
                <p>Eksempler på formater fra de store producenter:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '.5rem' }}>
                  {['Nike: FB1234-567','Adidas: HG1234','Umbro: 97086U-QGG','Puma: 76543-01','Kappa: 304IB90','Hummel: 210988-9368'].map(t => (
                    <span key={t} className="pc-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="pc-step">
              <div className="pc-step-num">3</div>
              <div>
                <h3>Holografisk ægthedsmærke</h3>
                <p>Mange trøjer fra 1990erne og frem har et holografisk klistermærke eller et vævet ægthedsbadge. Dette sidder typisk på:</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem', padding: 0 }}>
                  {[
                    'Indersiden af trøjen ved siden af vaskemærket',
                    'På den lille ekstra hæng-etiket (swing tag)',
                    'Broderet ind i fodstykket eller siden af trøjen',
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem', fontSize: '.9rem', color: 'var(--muted)' }}>
                      <span style={{ color: 'var(--green)', fontSize: '1rem' }}>▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step 4 */}
            <div className="pc-step">
              <div className="pc-step-num">4</div>
              <div>
                <h3>Tag et klart foto til upload</h3>
                <p>Når du lægger trøjen til salg på Retromarked, skal du uploade et foto af produktkoden. Sørg for:</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.5rem', padding: 0 }}>
                  {[
                    'God belysning — brug naturligt lys eller en lommelygte',
                    'Fokus på hele mærket, ikke kun koden',
                    'Undgå refleksioner og slørede billeder',
                    'Fotografer mærket fladt udstrakt — ikke krøllet',
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '.75rem', fontSize: '.9rem', color: 'var(--muted)' }}>
                      <span style={{ color: 'var(--green)', fontSize: '1rem' }}>▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '1.5rem' }}>
                  <Link href="/sell" className="btn btn-green">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                    Sæt din trøje til salg nu
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="pc-sidebar-box">
              <h3>Produktkode pr. producent</h3>
              <ul className="pc-brand-list">
                {[
                  { brand: 'Nike', location: 'Baglommer / vaskemærke' },
                  { brand: 'Adidas', location: 'Vaskemærke (nakke)' },
                  { brand: 'Umbro', location: 'Side-etiket' },
                  { brand: 'Puma', location: 'Vaskemærke (bund)' },
                  { brand: 'Kappa', location: 'Indvendig nakke' },
                  { brand: 'Hummel', location: 'Nakke / vaskemærke' },
                  { brand: 'Lotto', location: 'Indvendig side' },
                  { brand: 'Le Coq Sportif', location: 'Nakke-etiket' },
                ].map(b => (
                  <li key={b.brand}>
                    <span className="brand">{b.brand}</span>
                    <span className="location">{b.location}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pc-sidebar-box" style={{ background: 'var(--dark)', borderColor: 'var(--dark)', color: 'var(--cream)' }}>
              <h3 style={{ color: 'var(--cream)' }}>Kan vi hjælpe?</h3>
              <p style={{ fontSize: '.875rem', opacity: .7, marginBottom: '1.25rem' }}>Vores autenticitetseksperter vurderer din trøje gratis inden 24 timer.</p>
              <ProduktKodeClient />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}
