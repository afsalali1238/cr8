// src/components/ArtistCard.tsx
'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Artist } from '@/types'
import SafeImage from './SafeImage'
import ImageFallback from './ImageFallback'

export default function ArtistCard({ artist }: { artist: Partial<Artist> }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/artists/${artist.id}`}
        className="block group bg-cream rounded-2xl overflow-hidden border border-sand-dark
                   hover:border-clay hover:shadow-xl hover:shadow-clay/10 transition-all duration-300 h-full"
      >
        <div className="relative h-52 bg-sand-dark overflow-hidden">
          <SafeImage
            src={artist.photo_url || ''}
            alt={artist.name || ''}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            fallback={<ImageFallback className="w-full h-full" variant="artist" />}
          />
          {/* category badge */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cream/90 backdrop-blur-sm
                           text-xs font-medium text-clay">
            {artist.category}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-ink text-base">{artist.name}</h3>
          <p className="text-sm text-muted mt-0.5">{artist.city}, {artist.state}</p>
          <p className="text-xs text-clay font-medium mt-3 group-hover:underline">
            View profile →
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
