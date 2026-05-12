// src/components/ListingsClientPage.tsx
'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import MapWrapper from './MapWrapper'
import SafeImage from './SafeImage'
import type { MapArtist } from './ArtistMapFull'

interface Artist {
  id: string
  name: string
  city: string | null
  state: string | null
  lat: number | null
  lng: number | null
  photo_url: string | null
  category: string | null
}

interface Listing {
  id: string
  title: string
  description: string | null
  price: number | null
  image_url: string | null
  category: string | null
  artist: Artist
}

interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
}

interface Props {
  listings: Listing[]
  categories: Category[]
}

export default function ListingsClientPage({ listings, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [hoveredArtistId, setHoveredArtistId] = useState<string | null>(null)
  const [mapPinnedId, setMapPinnedId] = useState<string | null>(null)

  // Filter listings by category
  const filtered = useMemo(() =>
    listings.filter(l => !activeCategory || l.category === activeCategory),
    [listings, activeCategory]
  )

  // Build unique artist map points from filtered listings
  // Each artist pin shows how many listings they have
  const mapArtists: MapArtist[] = useMemo(() => {
    const artistMap = new Map<string, MapArtist>()
    filtered.forEach(listing => {
      const a = listing.artist
      if (!a.lat || !a.lng) return
      if (artistMap.has(a.id)) {
        artistMap.get(a.id)!.listing_count! += 1
      } else {
        artistMap.set(a.id, {
          id: a.id,
          name: a.name,
          city: a.city || '',
          state: a.state || '',
          lat: a.lat,
          lng: a.lng,
          photo_url: a.photo_url,
          category: a.category,
          listing_count: 1,
        })
      }
    })
    return Array.from(artistMap.values())
  }, [filtered])

  const activePin = hoveredArtistId || mapPinnedId

  return (
    <main className="min-h-screen">
      {/* Page header */}
      <div className="bg-clay-pale border-b border-sand-dark px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-5xl text-ink mb-1">Shop</h1>
          <p className="text-muted">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} from {mapArtists.length} maker{mapArtists.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-cream/95 backdrop-blur-sm border-b border-sand-dark px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted font-medium uppercase tracking-wider mr-1">Category:</span>
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
        </div>
      </div>

      {/* Split layout */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">

          {/* MAP */}
          <div className="lg:sticky lg:top-[108px] lg:self-start w-full lg:w-[440px] flex-shrink-0">
            <div className="h-[320px] lg:h-[calc(100vh-108px)] relative">
              {mapArtists.length > 0 ? (
                <MapWrapper
                  artists={mapArtists}
                  activeId={activePin}
                  onPinClick={(id) => {
                    setMapPinnedId(id === mapPinnedId ? null : id)
                    // Scroll to first listing by this artist
                    const el = document.getElementById(`listing-artist-${id}`)
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sand">
                  <p className="text-muted text-sm">Add artists with location to see map</p>
                </div>
              )}

              {/* Map instruction */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-sand-dark">
                <p className="text-xs text-charcoal text-center">
                  📍 Tap a pin to see the artist · Zoom in to explore nearby makers
                </p>
              </div>
            </div>
          </div>

          {/* LISTINGS GRID */}
          <div className="flex-1 p-4 lg:p-6">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-3">🛍</div>
                <p className="text-charcoal font-medium">No listings in this category yet</p>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="mt-4 text-clay text-sm underline"
                >
                  Show all listings
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Group listings by artist for better UX */}
                {mapArtists.map(artist => {
                  const artistListings = filtered.filter(l => l.artist.id === artist.id)
                  if (artistListings.length === 0) return null

                  return (
                    <div
                      key={artist.id}
                      id={`listing-artist-${artist.id}`}
                      className={`rounded-2xl transition-all duration-200 ${
                        activePin === artist.id
                          ? 'ring-2 ring-clay ring-offset-2'
                          : ''
                      }`}
                    >
                      {/* Artist header row */}
                      <div
                        className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-sand cursor-pointer hover:bg-clay-pale transition-colors"
                        onMouseEnter={() => setHoveredArtistId(artist.id)}
                        onMouseLeave={() => setHoveredArtistId(null)}
                      >
                        {artist.photo_url ? (
                          <SafeImage
                            src={artist.photo_url}
                            alt={artist.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            fallback={<div className="w-10 h-10 rounded-full bg-sand-dark flex items-center justify-center text-lg flex-shrink-0">🎨</div>}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-sand-dark flex items-center justify-center text-lg flex-shrink-0">🎨</div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-ink text-sm">{artist.name}</p>
                          <p className="text-xs text-muted truncate">{artist.city}, {artist.state}</p>
                        </div>
                        <Link
                          href={`/artists/${artist.id}`}
                          className="ml-auto flex-shrink-0 text-xs text-clay font-medium hover:underline"
                          onClick={e => e.stopPropagation()}
                        >
                          Profile →
                        </Link>
                      </div>

                      {/* Listings row */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {artistListings.map(listing => (
                          <Link
                            key={listing.id}
                            href={`/listings/${listing.id}`}
                            onMouseEnter={() => setHoveredArtistId(listing.artist.id)}
                            onMouseLeave={() => setHoveredArtistId(null)}
                            className="group block rounded-xl overflow-hidden border border-sand-dark bg-cream
                                       hover:border-clay hover:shadow-md transition-all duration-200"
                          >
                            <div className="relative h-36 bg-sand overflow-hidden">
                              {listing.image_url ? (
                                <SafeImage
                                  src={listing.image_url}
                                  alt={listing.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  fallback={<div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                              )}
                            </div>
                            <div className="p-3">
                              <p className="text-xs font-semibold text-ink line-clamp-1">{listing.title}</p>
                              {listing.price && (
                                <p className="text-sm font-bold text-clay mt-0.5">₹{listing.price.toLocaleString('en-IN')}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {/* Artists without location data — show at bottom */}
                {(() => {
                  const noLocationListings = filtered.filter(l => !l.artist.lat || !l.artist.lng)
                  const uniqueArtistIds = Array.from(new Set(noLocationListings.map(l => l.artist.id)))
                  if (uniqueArtistIds.length === 0) return null

                  return (
                    <div>
                      <p className="text-xs text-muted mb-3 uppercase tracking-wider font-medium">Other listings</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {noLocationListings.map(listing => (
                          <Link
                            key={listing.id}
                            href={`/listings/${listing.id}`}
                            className="group block rounded-xl overflow-hidden border border-sand-dark bg-cream
                                       hover:border-clay hover:shadow-md transition-all duration-200"
                          >
                            <div className="relative h-36 bg-sand overflow-hidden">
                              {listing.image_url ? (
                                <SafeImage
                                  src={listing.image_url}
                                  alt={listing.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  fallback={<div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                              )}
                            </div>
                            <div className="p-3">
                              <p className="text-xs font-semibold text-ink line-clamp-1">{listing.title}</p>
                              <p className="text-xs text-muted mt-0.5">{listing.artist.name}</p>
                              {listing.price && (
                                <p className="text-sm font-bold text-clay mt-0.5">₹{listing.price.toLocaleString('en-IN')}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
