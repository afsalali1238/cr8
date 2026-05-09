// src/app/listings/[id]/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import ListingCard from '@/components/ListingCard'
import type { ListingWithArtist } from '@/types'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createServerClient()
  const { data: listing } = await supabase
    .from('listings')
    .select('title, description, image_url, artist:artists(name)')
    .eq('id', params.id)
    .single() as { data: any }

  if (!listing) return { title: 'Listing Not Found' }

  const artistName = listing.artist?.name || 'Artist'
  return {
    title: `${listing.title} by ${artistName} | CraftersUnited`,
    description: listing.description || `Check out this handmade item on CraftersUnited.`,
    openGraph: {
      title: `${listing.title} by ${artistName}`,
      description: listing.description || `Check out this handmade item on CraftersUnited.`,
      images: listing.image_url ? [{ url: listing.image_url }] : [],
    },
  }
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Fetch listing with artist details
  const { data: listing } = await supabase
    .from('listings')
    .select('*, artist:artists(*)')
    .eq('id', params.id)
    .single() as { data: ListingWithArtist | null }

  if (!listing) notFound()

  // Fetch other items from the same artist
  const { data: moreFromArtist } = await supabase
    .from('listings')
    .select('*')
    .eq('artist_id', listing.artist_id)
    .neq('id', listing.id)
    .limit(4)

  const whatsappUrl = `https://wa.me/${listing.artist.whatsapp}?text=${encodeURIComponent(
    `Hi ${listing.artist.name}, I found your item "${listing.title}" on CraftersUnited and I'm interested!`
  )}`

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Image Section */}
        <div className="bg-sand rounded-3xl overflow-hidden border border-sand-dark aspect-square relative">
          {listing.image_url ? (
            <Image
              src={listing.image_url}
              alt={listing.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🎁</div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center">
          <Link 
            href={`/listings?category=${listing.category}`}
            className="text-clay font-semibold text-sm uppercase tracking-widest mb-2 hover:underline"
          >
            {listing.category}
          </Link>
          <h1 className="font-display text-5xl text-ink mb-6">{listing.title}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-bold text-ink">₹{listing.price}</span>
            <span className="px-3 py-1 rounded-full bg-clay-pale text-clay text-xs font-bold uppercase tracking-wider">
              Handmade
            </span>
          </div>

          <p className="text-charcoal text-lg leading-relaxed mb-10 border-l-4 border-sand-dark pl-6">
            {listing.description}
          </p>

          <div className="space-y-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 rounded-full bg-clay text-white text-center font-semibold text-lg
                         hover:bg-clay-light transition-all shadow-xl shadow-clay/30"
            >
              Contact Seller on WhatsApp
            </a>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-sand border border-sand-dark">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-sand-dark relative">
                {listing.artist.photo_url ? (
                  <Image src={listing.artist.photo_url} alt={listing.artist.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🎨</div>
                )}
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-widest font-semibold">Artist</p>
                <Link href={`/artists/${listing.artist.id}`} className="font-display text-xl text-ink hover:text-clay">
                  {listing.artist.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More from Artist */}
      {moreFromArtist && moreFromArtist.length > 0 && (
        <section>
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-4xl text-ink">More from {listing.artist.name}</h2>
            <Link href={`/artists/${listing.artist.id}`} className="text-sm text-clay font-medium hover:underline">
              View artist profile →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moreFromArtist.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
