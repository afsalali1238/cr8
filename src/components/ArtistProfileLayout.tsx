// src/components/ArtistProfileLayout.tsx
import Image from 'next/image'
import ContactButtons from './ContactButtons'
import ListingGrid from './ListingGrid'
import ArtistMapPin from './ArtistMapPin'
import type { ArtistWithListings } from '@/types'

export default function ArtistProfileLayout({ artist }: { artist: ArtistWithListings }) {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Header / Hero */}
      <div className="bg-sand rounded-3xl overflow-hidden border border-sand-dark mb-12">
        <div className="flex flex-col md:flex-row gap-8 p-8 md:p-12 items-center md:items-start">
          <div className="relative w-48 h-48 flex-shrink-0">
            {artist.photo_url ? (
              <Image
                src={artist.photo_url}
                alt={artist.name}
                fill
                className="rounded-2xl object-cover shadow-xl"
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-sand-dark flex items-center justify-center text-6xl">
                🎨
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <span className="text-clay font-semibold text-sm uppercase tracking-widest mb-2 block">
              {artist.category}
            </span>
            <h1 className="font-display text-5xl text-ink mb-4">{artist.name}</h1>
            <p className="text-muted font-medium mb-6 flex items-center justify-center md:justify-start gap-1">
              📍 {artist.city}, {artist.state}
            </p>
            <p className="text-charcoal text-lg leading-relaxed max-w-2xl mb-8">
              {artist.bio}
            </p>
            
            <ContactButtons artist={artist} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Listings Section */}
        <div className="lg:col-span-2">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-4xl text-ink">Artist's Work</h2>
            <span className="text-sm text-muted">{artist.listings?.length || 0} items</span>
          </div>
          
          {artist.listings && artist.listings.length > 0 ? (
            <ListingGrid listings={artist.listings} />
          ) : (
            <div className="py-20 text-center bg-cream rounded-2xl border border-sand-dark">
              <p className="text-muted">No listings available yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar / Map */}
        <div className="space-y-8">
          {artist.lat && artist.lng && (
            <section className="bg-cream p-6 rounded-2xl border border-sand-dark">
              <h3 className="font-semibold text-ink mb-4">Location</h3>
              <ArtistMapPin lat={artist.lat} lng={artist.lng} name={artist.name} />
              <p className="text-xs text-muted mt-3 italic text-center">
                Approximate location of the artist's workshop
              </p>
            </section>
          )}
          
          <section className="bg-ink text-cream p-8 rounded-2xl relative overflow-hidden">
            <div 
              className="absolute top-0 right-0 w-24 h-24 bg-clay opacity-20 rounded-full -mr-12 -mt-12"
              style={{ filter: 'blur(40px)' }}
            />
            <h3 className="font-display text-2xl mb-2 relative z-10">Supporting Makers</h3>
            <p className="text-sm text-cream/70 leading-relaxed relative z-10">
              When you buy from {artist.name}, you're supporting an independent 
              Indian artist directly. No middlemen, no commissions.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
