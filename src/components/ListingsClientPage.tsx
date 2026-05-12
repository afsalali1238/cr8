'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import MapWrapper from './MapWrapper'
import SafeImage from './SafeImage'
import ImageFallback from './ImageFallback'
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
  is_available: boolean
  artist: Artist
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function ListingsClientPage({
  listings,
  categories,
}: {
  listings: Listing[]
  categories: Category[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredArtistId, setHoveredArtistId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!selectedCategory) return listings
    return listings.filter(l => {
      const cat = categories.find(c => c.slug === selectedCategory)
      return cat && (l.category === cat.name || l.artist?.category === cat.name)
    })
  }, [listings, categories, selectedCategory])

  const mapArtists: MapArtist[] = useMemo(() => {
    const artistMap = new Map<string, MapArtist>()
    filtered.forEach(l => {
      const a = l.artist
      if (a && a.lat && a.lng && !artistMap.has(a.id)) {
        artistMap.set(a.id, {
          id: a.id,
          name: a.name,
          city: a.city || '',
          state: a.state || '',
          lat: a.lat,
          lng: a.lng,
          photo_url: a.photo_url,
          category: a.category,
        })
      }
    })
    return Array.from(artistMap.values())
  }, [filtered])

  return (
    <main className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-clay-pale border-b border-sand-dark px-4 py-5 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl text-ink">Shop</h1>
          <p className="text-muted text-sm mt-0.5">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} from {mapArtists.length} maker{mapArtists.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-cream border-b border-sand-dark px-4 py-3 flex-shrink-0 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          <span className="text-xs font-semibold text-muted uppercase tracking-widest mr-1">CATEGORY:</span>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory ? 'bg-clay text-white' : 'bg-sand text-charcoal hover:bg-sand-dark'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug === selectedCategory ? null : cat.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.slug ? 'bg-clay text-white' : 'bg-sand text-charcoal hover:bg-sand-dark'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main content: map + grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map — left side, hidden on mobile */}
        <div className="hidden lg:block w-[420px] flex-shrink-0 border-r border-sand-dark">
          <MapWrapper artists={mapArtists} activeId={hoveredArtistId} />
        </div>

        {/* Product grid — right side */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎨</div>
              <p className="text-charcoal font-medium">No listings in this category yet</p>
              <p className="text-muted text-sm mt-1">Check back soon — new makers join every week</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl">
              {filtered.map(listing => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group block rounded-xl overflow-hidden border border-sand-dark bg-cream hover:border-clay hover:shadow-md transition-all duration-200"
                  onMouseEnter={() => setHoveredArtistId(listing.artist?.id ?? null)}
                  onMouseLeave={() => setHoveredArtistId(null)}
                >
                  <div className="h-44 bg-sand overflow-hidden relative">
                    <SafeImage
                      src={listing.image_url || ''}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallback={<ImageFallback className="w-full h-full" variant="listing" />}
                    />
                    {listing.category && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-cream/90 text-xs font-medium text-clay">
                        {listing.category}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-ink text-sm line-clamp-2 leading-snug">{listing.title}</p>
                    {listing.price && (
                      <p className="text-clay font-bold text-sm mt-1">₹{listing.price.toLocaleString('en-IN')}</p>
                    )}
                    {listing.artist && (
                      <p className="text-xs text-muted mt-1.5 truncate">
                        by {listing.artist.name} · {listing.artist.city}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
