import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ListingPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: listing } = await supabase
    .from('listings')
    .select('*, artist:artists!inner(*)')
    .eq('id', params.id)
    .eq('is_available', true)
    .single()

  if (!listing) notFound()

  const rawArtist = (listing as any).artist
  const artist = Array.isArray(rawArtist) ? rawArtist[0] : rawArtist
  if (!artist) notFound()
  const whatsappMsg = encodeURIComponent(
    `Hi ${artist.name}, I found your listing "${listing.title}" on CraftersUnited! I'm interested.`
  )

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/listings" className="text-sm text-clay hover:underline mb-6 inline-block">← Back to Shop</Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden bg-sand aspect-square">
          {listing.image_url ? (
            <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🎨</div>
          )}
        </div>

        {/* Details */}
        <div>
          {listing.category && (
            <span className="px-3 py-1 rounded-full bg-clay-pale text-xs font-medium text-clay border border-clay/20">
              {listing.category}
            </span>
          )}
          <h1 className="font-display text-4xl text-ink mt-3 mb-2">{listing.title}</h1>
          {listing.price && (
            <p className="text-3xl font-bold text-clay mb-4">₹{listing.price.toLocaleString('en-IN')}</p>
          )}
          {listing.description && (
            <p className="text-charcoal leading-relaxed mb-6">{listing.description}</p>
          )}

          {/* Seller info */}
          <div className="p-4 bg-sand rounded-xl border border-sand-dark mb-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-2">Sold by</p>
            <div className="flex items-center gap-3">
              {artist.photo_url ? (
                <img src={artist.photo_url} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-sand-dark flex items-center justify-center">🎨</div>
              )}
              <div>
                <p className="font-semibold text-ink text-sm">{artist.name}</p>
                <p className="text-xs text-muted">{artist.city}, {artist.state}</p>
              </div>
              <Link href={`/artists/${artist.id}`}
                className="ml-auto text-xs text-clay font-medium hover:underline">
                View profile →
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <div className="p-3 bg-clay-pale/50 rounded-xl border border-clay/10">
              <p className="text-xs text-charcoal text-center">
                💡 Prices shown for reference — contact the artist directly to order, negotiate, or request custom work.
              </p>
            </div>
            <p className="text-sm font-medium text-charcoal">Interested? Reach out directly:</p>
            <div className="flex flex-wrap gap-3">
              {artist.whatsapp && (
                <a href={`https://wa.me/${artist.whatsapp}?text=${whatsappMsg}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-full bg-green-600 text-white text-sm font-semibold text-center hover:bg-green-700 transition-colors">
                  💬 WhatsApp Seller
                </a>
              )}
              {artist.email && (
                <a href={`mailto:${artist.email}?subject=Inquiry: ${listing.title}`}
                  className="flex-1 py-3 rounded-full border-2 border-clay text-clay text-sm font-semibold text-center hover:bg-clay hover:text-white transition-colors">
                  ✉️ Email Seller
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
