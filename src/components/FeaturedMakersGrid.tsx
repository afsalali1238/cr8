'use client'
import { useState } from 'react'
import Link from 'next/link'
import SafeImage from '@/components/SafeImage'
import ImageFallback from '@/components/ImageFallback'

interface MakerCardData {
  id: string
  name: string
  city: string | null
  state: string | null
  category: string | null
  photo_url: string | null
}

function MakerCard({ artist }: { artist: MakerCardData }) {
  const [wishlisted, setWishlisted] = useState(false)

  const whatsappUrl = `https://wa.me/?text=Hi! I found you on CraftersUnited — cr8un8.com`

  return (
    <Link
      href={`/artists/${artist.id}`}
      className="group relative bg-cream rounded-2xl overflow-hidden border border-sand-dark
                 hover:border-clay hover:shadow-xl hover:shadow-clay/10
                 transition-all duration-300 hover:-translate-y-1 block"
    >
      {/* Image */}
      <div className="relative h-60 bg-sand overflow-hidden">
        <SafeImage
          src={artist.photo_url || ''}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fallback={<ImageFallback className="w-full h-full" variant="artist" />}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent
                        group-hover:from-ink/75 transition-all duration-300" />

        {/* Category tag */}
        {artist.category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full
                           bg-clay text-cream text-[10px] font-bold uppercase tracking-wider">
            {artist.category}
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={e => { e.preventDefault(); setWishlisted(w => !w) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-cream/90 backdrop-blur-sm
                     flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label="Save to wishlist"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? '#B5603A' : 'none'}
            stroke={wishlisted ? '#B5603A' : '#9A7060'} strokeWidth="2" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Verified badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5
                        bg-cream/90 backdrop-blur-sm rounded-full px-2.5 py-1
                        group-hover:bottom-14 transition-all duration-300">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#B5603A" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span className="text-[10px] font-bold text-clay">Verified Maker</span>
        </div>

        {/* WhatsApp CTA — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3
                        translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                       bg-[#25D366] text-white text-sm font-bold shadow-lg"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Message on WhatsApp
          </a>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <h3 className="font-display text-lg font-bold text-ink">{artist.name}</h3>
        <p className="text-sm text-muted mt-0.5">
          {[artist.city, artist.state].filter(Boolean).join(', ')}
        </p>
        <p className="text-xs text-clay font-semibold mt-3 group-hover:underline">
          View profile →
        </p>
      </div>
    </Link>
  )
}

interface Props {
  artists: MakerCardData[]
}

export default function FeaturedMakersGrid({ artists }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {artists.map(artist => (
        <MakerCard key={artist.id} artist={artist} />
      ))}
    </div>
  )
}
