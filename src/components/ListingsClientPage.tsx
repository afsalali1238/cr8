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

  const filtered = useMemo(() =>
    listings.filter(l => !activeCategory || l.category === activeCategory),
    [listings, activeCategory]
  )

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

  return (
    <main className="min-h-screen">
      {/* Page header */}
      <div className="bg-clay-pale border-b border-sand-dark px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-5xl text-ink mb-1">Shop</h1>
          <p className="text-muted">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} from independent makers across India
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

      {/* Split layout: map left, products right */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row">

          {/* MAP */}
          <div className="lg:sticky lg:top-[108px] lg:self-start w-full lg:w-[380px] flex-shrink-0">
            <div className="h-[260px] lg:h-[calc(100vh-108px)] relative">
              {mapArtists.length > 0 ? (
                <MapWrapper
                  artists={mapArtists}
                  activeId={hoveredArtistId}
                  onPinClick={() => {}}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-sand">
                  <p className="text-muted text-sm">No mapped artists yet</p>
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-sand-dark">
                <p className="text-xs text-charcoal text-center">
                  📍 Hover a product to highlight its maker on the map
                </p>
              </div>
            </div>
          </div>

          {/* PRODUCT GRID — flat, product-first */}
          <div className="flex-1 p-4 lg:p-6">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-3">🛍</div>
                <p className="text-charcoal font-medium">No items in this category yet</p>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="mt-4 text-clay text-sm underline"
                >
                  Show everything
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(listing => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    onMouseEnter={() => setHoveredArtistId(listing.artist.id)}
                    onMouseLeave={() => setHoveredArtistId(null)}
                    className="group block rounded-2xl overflow-hidden border border-sand-dark bg-cream
                               hover:border-clay hover:shadow-lg hover:shadow-clay/10 transition-all duration-200"
                  >
                    {/* Product image */}
                    <div className="relative h-44 bg-sand overflow-hidden">
                      {listing.image_url ? (
                        <SafeImage
                          src={listing.image_url}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          fallback={
                            <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                      )}
                      {listing.category && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-cream/90 text-[10px] font-medium text-clay">
                          {listing.category}
                        </span>
                      )}
                    </div>

                    {/* Product info — title + price prominent, artist as subtle byline */}
                    <div className="p-3">
                      <p className="font-semibold text-ink text-sm line-clamp-2 leading-snug">
                        {listing.title}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        {listing.price ? (
                          <p className="text-clay font-bold text-sm">
                            ₹{listing.price.toLocaleString('en-IN')}
                          </p>
                        ) : (
                          <p className="text-muted text-xs italic">Price on request</p>
                        )}
                      </div>
                      <p className="text-[11px] text-muted mt-1.5 truncate">
                        by {listing.artist.name} · {listing.artist.city}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   