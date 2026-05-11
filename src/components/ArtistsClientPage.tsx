// src/components/ArtistsClientPage.tsx
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import MapWrapper from './MapWrapper'
import type { MapArtist } from './ArtistMapFull'

interface Artist {
  id: string
  name: string
  bio: string | null
  city: string | null
  state: string | null
  lat: number | null
  lng: number | null
  category: string | null
  photo_url: string | null
}

interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
}

interface Props {
  artists: Artist[]
  categories: Category[]
  states: string[]
}

export default function ArtistsClientPage({ artists, categories, states }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeState, setActiveState] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [mapPinnedId, setMapPinnedId] = useState<string | null>(null)

  // Filter artists based on selected filters
  const filtered = useMemo(() => artists.filter(a => {
    if (activeCategory && a.category !== activeCategory) return false
    if (activeState && a.state !== activeState) return false
    return true
  }), [artists, activeCategory, activeState])

  // Only artists with lat/lng go on the map
  const mapArtists: MapArtist[] = useMemo(() =>
    filtered
      .filter(a => a.lat && a.lng)
      .map(a => ({
        id: a.id,
        name: a.name,
        city: a.city || '',
        state: a.state || '',
        lat: a.lat!,
        lng: a.lng!,
        photo_url: a.photo_url,
        category: a.category,
      })),
    [filtered]
  )

  const activePin = hoveredId || mapPinnedId

  return (
    <main className="min-h-screen">
      {/* Page header */}
      <div className="bg-clay-pale border-b border-sand-dark px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-5xl text-ink mb-1">Our Artists</h1>
          <p className="text-muted">
            {filtered.length} maker{filtered.length !== 1 ? 's' : ''} across India
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-cream/95 backdrop-blur-sm border-b border-sand-dark px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted font-medium uppercase tracking-wider mr-1">Filter:</span>

          {/* Category filters */}
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !activeCategory
                ? 'bg-clay text-white'
                : 'bg-sand border border-sand-dark text-charcoal hover:border-clay'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === cat.name
                  ? 'bg-clay text-white'
                  : 'bg-sand border border-sand-dark text-charcoal hover:border-clay'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}

          {/* Divider */}
          {states.length > 0 && (
            <span className="w-px h-4 bg-sand-dark mx-1" />
          )}

          {/* State filters */}
          {states.map(state => (
            <button
              key={state}
              onClick={() => setActiveState(activeState === state ? null : state)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeState === state
                  ? 'bg-ink text-cream'
                  : 'bg-sand border border-sand-dark text-charcoal hover:border-clay'
              }`}
            >
              📍 {state}
            </button>
          ))}
        </div>
      </div>

      {/* Split layout: Map left, Grid right */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">

          {/* MAP — sticky on desktop, full-width on mobile */}
          <div className="lg:sticky lg:top-[108px] lg:self-start w-full lg:w-[440px] flex-shrink-0">
            <div className="h-[320px] lg:h-[calc(100vh-108px)] relative">
              {mapArtists.length > 0 ? (
                <MapWrapper
                  artists={mapArtists}
                  activeId={activePin}
                  onPinClick={(id) => {
                    setMapPinnedId(id === mapPinnedId ? null : id)
                    // Scroll to the card in the grid
                    const el = document.getElementById(`artist-card-${id}`)
                    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sand">
                  <p className="text-muted text-sm">No artists with location data</p>
                </div>
              )}

              {/* Map legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-sand-dark text-xs text-charcoal">
                <span className="font-medium">{mapArtists.length}</span> artist{mapArtists.length !== 1 ? 's' : ''} on map
                {filtered.length > mapArtists.length && (
                  <span className="text-muted ml-1">
                    ({filtered.length - mapArtists.length} no location)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ARTIST GRID */}
          <div className="flex-1 p-4 lg:p-6">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                {artists.length === 0 ? (
                  <>
                    <div className="text-5xl mb-4">🎨</div>
                    <h3 className="font-display text-2xl text-ink mb-2">No artists yet</h3>
                    <p className="text-muted mb-6 max-w-sm mx-auto">
                      Be the first to showcase your craft on CraftersUnited — it takes 2 minutes to apply.
                    </p>
                    <a
                      href="/join"
                      className="inline-block px-8 py-3 rounded-full bg-clay text-white font-medium hover:bg-clay-light transition-colors shadow-lg shadow-clay/20"
                    >
                      Join as Artist →
                    </a>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="text-charcoal font-medium">No artists match this filter</p>
                    <button
                      onClick={() => { setActiveCategory(null); setActiveState(null) }}
                      className="mt-4 text-clay text-sm underline"
                    >
                      Clear filters
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(artist => {
                  const isHighlighted = artist.id === activePin
                  return (
                    <Link
                      key={artist.id}
                      id={`artist-card-${artist.id}`}
                      href={`/artists/${artist.id}`}
                      onMouseEnter={() => setHoveredId(artist.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`group block rounded-2xl overflow-hidden border transition-all duration-200 ${
                        isHighlighted
                          ? 'border-clay shadow-lg shadow-clay/15 scale-[1.02]'
                          : 'border-sand-dark bg-cream hover:border-clay hover:shadow-md'
                      }`}
                    >
                      {/* Artist photo */}
                      <div className="relative h-44 bg-sand overflow-hidden">
                        {artist.photo_url ? (
                          <img
                            src={artist.photo_url}
                            alt={artist.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl">🎨</div>
                        )}
                        {/* Category badge */}
                        {artist.category && (
                          <span className="absolute top-2 left-2 px-2 py-1 rounded-full bg-white/90 text-xs font-medium text-clay">
                            {artist.category}
                          </span>
                        )}
                        {/* Map pin badge — shows if artist is on map */}
                        {artist.lat && artist.lng && (
                          <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-sm shadow-sm">
                            📍
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-ink text-sm leading-tight">{artist.name}</h3>
                        <p className="text-xs text-muted mt-0.5">{artist.city}, {artist.state}</p>
                        {artist.bio && (
                          <p className="text-xs text-charcoal mt-2 line-clamp-2 leading-relaxed">
                            {artist.bio}
                          </p>
                        )}
                        <p className="text-xs text-clay font-medium mt-3">
                          View profile →
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
