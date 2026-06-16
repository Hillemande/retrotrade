import Footer from '@/components/Footer'
import GuideClient from './GuideClient'

export const metadata = {
  title: 'Autenticitetsguide — Retromarked',
}

export default function GuidePage() {
  return (
    <div className="guide-page">
      <div className="guide-hero">
        <div className="container">
          <div className="section-label" style={{ color: 'rgba(255,255,255,.7)' }}>Ekspertviden</div>
          <h1>Autenticitetsguide</h1>
          <p>Lær at genkende ægte retrotrøjer og undgå falske — skrevet af vores eksperter</p>
        </div>
      </div>
      <div className="guide-content container">
        <div className="guide-grid">
          <div className="guide-articles">
            <article className="guide-article" aria-labelledby="art-1">
              <div className="guide-article-header">
                <div className="guide-article-num">01</div>
                <div className="section-label">Grundlæggende</div>
                <h2 id="art-1">Hvad gør en retrotrøje autentisk?</h2>
              </div>
              <p>En autentisk retrofodboldtrøje er fremstillet af den officielle producent til den specifikke sæson. Den adskiller sig fra replika og falske trøjer ved materialekvalitet, detaljer i stikning og officielle mærker.</p>
              <p>Der er grundlæggende to kategorier af ægte trøjer:</p>
              <ul>
                <li><strong>Spillertrøjer (Player Issue / Match Worn):</strong> Fremstillet til professionelle spillere — højeste kvalitet, ofte med spillernavn og nummer</li>
                <li><strong>Supportertrøjer (Fan Issue):</strong> Officielle trøjer solgt til fans — lidt lavere kvalitet end spillertrøjer men stadig ægte</li>
              </ul>
              <div className="guide-divider" />
            </article>

            <article className="guide-article" aria-labelledby="art-2">
              <div className="guide-article-header">
                <div className="guide-article-num">02</div>
                <div className="section-label">Visuel kontrol</div>
                <h2 id="art-2">Sådan tjekker du stitching og mærker</h2>
              </div>
              <p>Stikningen er en af de mest pålidelige indikatorer for ægthed. Falske trøjer har ofte ujævne sømme, fejlagtigt mønster eller bruges med billigt polyestertråd.</p>
              <ul>
                <li>Tjek at mærkater sidder fast og er korrekt placeret — løse kanter er et advarselstegn</li>
                <li>Undersøg klublogoets farvenøjagtighed og detaljegrad i detaljer</li>
                <li>Producentens mærke (Nike, Adidas, Umbro osv.) skal matche den pågældende sæson præcist</li>
                <li>Kig efter kampboller, ligaemblem og sæsonangivelse — disse ændres hvert år</li>
                <li>Kontroller at størrelsesmærket er tryk (ikke skrevet) og korrekt formateret for perioden</li>
              </ul>
              <div className="guide-divider" />
            </article>

            <article className="guide-article" aria-labelledby="art-3">
              <div className="guide-article-header">
                <div className="guide-article-num">03</div>
                <div className="section-label">Materiale</div>
                <h2 id="art-3">Materialekvalitet og følelse</h2>
              </div>
              <p>Materialet afslører ofte trøjens ægthed. 1990&apos;ernes trøjer var typisk lavet af tykt, luftigt polyester eller nylon, mens 1970–80&apos;ernes trøjer oftest er bomuld eller en bomuld/polyester-blanding.</p>
              <ul>
                <li>Ægte trøjer fra 70–80&apos;erne føles tungere og mere robuste end moderne replika</li>
                <li>Tjek indersiden for stof- og vaskeanvisningslabels — disse er periode-specifikke</li>
                <li>Farven skal matche periodens originale design — farveafvigelser tyder på kopi</li>
                <li>Tryckte logos (tidlig 90&apos;erne) vs. broderede logos (sen 90&apos;erne og frem) — vigtig detalje</li>
              </ul>
              <div className="guide-divider" />
            </article>

            <article className="guide-article" aria-labelledby="art-4">
              <div className="guide-article-header">
                <div className="guide-article-num">04</div>
                <div className="section-label">Prissætning</div>
                <h2 id="art-4">Hvad er en retrotrøje værd?</h2>
              </div>
              <p>Prisen på en retrotrøje afhænger af flere faktorer: klub, sæson, stand, sjældenhed og om den er spiller- eller supporterudgave. Her er en generel retningslinje:</p>
              <ul>
                <li><strong>Common supporter issue (god stand):</strong> 300–800 kr.</li>
                <li><strong>Populær klub, god sæson (f.eks. Manchester United 1999):</strong> 800–2.500 kr.</li>
                <li><strong>Sjælden eller ikonisk sæson:</strong> 2.500–6.000 kr.</li>
                <li><strong>Player issue eller match worn med dokumentation:</strong> 5.000–20.000+ kr.</li>
                <li><strong>Signerede trøjer med certifikat:</strong> Tillæg på 50–200%</li>
              </ul>
            </article>
          </div>

          <aside className="guide-sidebar" aria-label="Hurtigguide">
            <div className="guide-box">
              <h3>Køberens tjekliste</h3>
              <ul className="guide-checklist">
                {[
                  'Verificeret sælger med gode anmeldelser',
                  'Klare billeder af mærker, stikning og vaskemærke',
                  'Pris der stemmer overens med markedet',
                  'Retromarked verificeringsstempel',
                  'Returnerings- og betalingsbeskyttelse aktiveret',
                  'Kommuniker via platformen — ikke privat',
                ].map((item, i) => (
                  <li key={i}>
                    <div className="check-icon" aria-hidden="true">
                      <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="guide-box">
              <div className="guide-warning">
                <h4>Pas på disse tegn</h4>
                <p>Sælger ønsker betaling uden om platformen, billeder er stjålet fra nettet, prisen er usandsynlig lav, ingen beskrivelse af stand eller sæson.</p>
              </div>
            </div>

            <div className="guide-box" style={{ background: 'var(--dark)', borderColor: 'var(--dark)', color: 'var(--cream)' }}>
              <h3 style={{ color: 'var(--cream)' }}>Tvivler du på en trøje?</h3>
              <p style={{ fontSize: '.875rem', opacity: .7, marginBottom: '1.25rem' }}>Vores eksperter hjælper dig med at vurdere ægthed — gratis for alle Retromarked-brugere.</p>
              <GuideClient />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}
