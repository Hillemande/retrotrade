'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FALLBACK_JERSEYS, type Jersey } from '@/lib/jerseys'
import JerseyCard from '@/components/JerseyCard'
import Modal from '@/components/Modal'
import Footer from '@/components/Footer'
import { useToast } from '@/contexts/ToastContext'

const eraLabelMap: Record<string, string> = {
  '1960erne': '60s', '1970erne': '70s', '1980erne': '80s',
  '1990erne': '90s', '2000erne': '00s', '2010erne': '10s'
}

interface Filters {
  liga: string[]
  era: string[]
  size: string[]
  condition: string[]
  maxPrice: number
  verified: boolean
}

export default function ShopPage() {
  const [allListings, setAllListings] = useState<Jersey[]>([])
  const [displayed, setDisplayed] = useState<Jersey[]>([])
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null)
  const [sort, setSort] = useState('Nyeste først')
  const [priceMax, setPriceMax] = useState(10000)
  const [filters, setFilters] = useState<Filters>({
    liga: [], era: [], size: [], condition: [], maxPrice: 10000, verified: false
  })
  const { showToast } = useToast()

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'aktiv')
        .order('created_at', { ascending: false })
      if (!error && data && data.length > 0) {
        setAllListings(data)
      } else {
        setAllListings(FALLBACK_JERSEYS)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    let result = allListings.filter(j => {
      if (filters.liga.length && !filters.liga.includes(j.liga || '')) return false
      if (filters.era.length && !filters.era.includes(j.era || '')) return false
      if (filters.size.length && !filters.size.includes(j.size || '')) return false
      if (filters.condition.length && !filters.condition.includes(j.condition || '')) return false
      if ((j.price || 0) > filters.maxPrice) return false
      if (filters.verified && !j.verified) return false
      return true
    })

    if (sort === 'Pris: lav til høj') result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0))
    else if (sort === 'Pris: høj til lav') result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0))
    else if (sort === 'Bedst bedømt') result = [...result].sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0))
    else result = [...result].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())

    setDisplayed(result)
  }, [allListings, filters, sort])

  function toggleFilter(category: keyof Filters, value: string) {
    setFilters(prev => {
      const arr = prev[category] as string[]
      const exists = arr.includes(value)
      return { ...prev, [category]: exists ? arr.filter(x => x !== value) : [...arr, value] }
    })
  }

  return (
    <div className="shop-page">
      {selectedJersey && <Modal jersey={selectedJersey} onClose={() => setSelectedJersey(null)} />}

      <div className="shop-hero">
        <div className="container">
          <div className="section-label">Markedsplads</div>
          <h1>Køb retrotrøjer</h1>
          <p>Over 3.800 verificerede annoncer fra sælgere i hele Norden</p>
        </div>
      </div>

      <div className="container">
        <div className="shop-inner">
          <aside className="shop-filters" aria-label="Filtre">
            <div className="filter-section">
              <div className="filter-title">Liga</div>
              <div className="filter-options">
                {['Premier League','La Liga','Serie A','Bundesliga','Ligue 1','Superliga (DK)','Champions League','VM / EM'].map(liga => (
                  <label key={liga} className="filter-checkbox">
                    <input type="checkbox" onChange={() => toggleFilter('liga', liga)} />
                    {liga}
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-section">
              <div className="filter-title">Årti</div>
              <div className="filter-options">
                {['1960erne','1970erne','1980erne','1990erne','2000erne','2010erne'].map(label => (
                  <label key={label} className="filter-checkbox">
                    <input type="checkbox" onChange={() => toggleFilter('era', eraLabelMap[label] || label)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-section">
              <div className="filter-title">Størrelse</div>
              <div className="filter-options">
                {['XS','S','M','L','XL','XXL'].map(s => (
                  <label key={s} className="filter-checkbox">
                    <input type="checkbox" onChange={() => toggleFilter('size', s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-section">
              <div className="filter-title">Stand</div>
              <div className="filter-options">
                {['Ny med tag','Meget god','God','Acceptabel'].map(c => (
                  <label key={c} className="filter-checkbox">
                    <input type="checkbox" onChange={() => toggleFilter('condition', c)} />
                    {c}
                  </label>
                ))}
              </div>
            </div>
            <div className="filter-section">
              <div className="filter-title">Pris (kr.)</div>
              <input
                type="range" min="0" max="10000" value={priceMax}
                className="filter-slider"
                aria-label="Maksimumpris"
                onChange={e => {
                  const v = Number(e.target.value)
                  setPriceMax(v)
                  setFilters(prev => ({ ...prev, maxPrice: v }))
                }}
              />
              <div className="price-display">
                <span>0 kr.</span>
                <span>{priceMax.toLocaleString('da-DK')} kr.</span>
              </div>
            </div>
            <div className="filter-section">
              <div className="filter-title">Verificeret</div>
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input type="checkbox" onChange={e => setFilters(prev => ({ ...prev, verified: e.target.checked }))} />
                  Kun verificerede
                </label>
              </div>
            </div>
          </aside>

          <main>
            <div className="shop-toolbar">
              <div className="shop-count" aria-live="polite">
                Viser <strong>{displayed.length}</strong> af <strong>{allListings.length.toLocaleString('da-DK')}</strong> trøjer
              </div>
              <select
                className="shop-sort"
                aria-label="Sortér resultater"
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option>Nyeste først</option>
                <option>Pris: lav til høj</option>
                <option>Pris: høj til lav</option>
                <option>Mest populære</option>
                <option>Bedst bedømt</option>
              </select>
            </div>
            <div className="jersey-grid" role="list" aria-label="Trøjer til salg">
              {displayed.map((j, i) => (
                <JerseyCard key={j.id || i} jersey={j} onClick={setSelectedJersey} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button className="btn btn-outline" onClick={() => showToast('Indlæser flere trøjer...')}>
                Indlæs flere
              </button>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
