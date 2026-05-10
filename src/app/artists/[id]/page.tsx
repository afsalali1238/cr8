import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: artist } = await supabase
    .from('artists')
    .select('*, listings(*)')
    .eq('id', params.id)
    .eq('is_approved', true)
    .single()

  if (!artist) notFound()

  const whatsappMsg = encodeURIComponent("Hi, I found you on CraftersUnited! I'm interested in your work.")

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Back */}
      <Link href="/artists" className="text-sm text-clay hover:underline mb-6 inline-block">← Back to Artists</Link>

      {/* Profile header */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8 p-6 bg-sand rounded-2xl border border-sand-dark">
        <div className="flex-shrink-0">
          {artist.photo_url ? (
            <img src={artist.photo_url} alt={artist.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-cream shadow-md" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-sand-dark flex items-center justify-center text-5xl">🎨</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-1">
            <h1 className="text-2xl font-bold text-ink">{artist.name}</h1>
            {artist.category && (
              <span className="px-3 py-1 rounded-full bg-clay-pale border border-clay/20 text-xs font-medium text-clay">
                {artist.category}
              </span>
            )}
          </div>
          <p className="text-muted text-sm mb-3">📍 {artist.city}, {artist.state}</p>
          {artist.bio && <p className="text-charcoal text-sm leading-relaxed">{artist.bio}</p>}

          {/* Contact buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            {artist.whatsapp && (
              <a href={`https://wa.me/${artist.whatsapp}?text=${whatsappMsg}`}
                target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">
                💬 WhatsApp
              </a>
            )}
            {artist.email && (
              <a href={`mailto:${artist.email}`}
                className="px-5 py-2.5 rounded-full border-2 border-clay text-clay text-sm font-medium hover:bg-clay hover:text-white transition-colors">
                ✉️ Email
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Listings */}
      <div>
        <h2 className="font-display text-3xl text-ink mb-4">
          Listings ({artist.listings?.length || 0})
        </h2>
        {(!artist.listings || (Array.isArray(artist.listings) && artist.listings.length === 0)) ? (
          <div className="text-center py-12 bg-sand rounded-2xl text-muted">
            No listings yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(Array.isArray(artist.listings) ? artist.listings : [artist.listings]).map((listing: any) => (
              <Link key={listing.id} href={`/listings/${listing.id}`}
                className="group block rounded-xl overflow-hidden border border-sand-dark bg-cream hover:border-clay hover:shadow-md transition-all duration-200">
                <div className="h-40 bg-sand overflow-hidden">
                  {listing.image_url ? (
                    <img src={listing.image_url} alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-ink text-sm line-clamp-1">{listing.title}</p>
                  {listing.price && (
                    <p className="text-clay font-bold text-sm mt-0.5">₹{listing.price.toLocaleString('en-IN')}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
