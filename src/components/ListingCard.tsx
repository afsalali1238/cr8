// src/components/ListingCard.tsx
'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Listing } from '@/types'
import SafeImage from './SafeImage'
import ImageFallback from './ImageFallback'

export default function ListingCard({ listing }: { listing: Listing }) {
  const isNew = listing.created_at
    ? Date.now() - new Date(listing.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
    : false

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/listings/${listing.id}`}
        className="block group bg-cream rounded-2xl overflow-hidden border border-sand-dark
                   hover:border-clay hover:shadow-xl hover:shadow-clay/10 transition-all duration-300 h-full"
      >
        <div className="relative h-60 bg-sand-dark overflow-hidden">
          <SafeImage
            src={listing.image_url || ''}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            fallback={<ImageFallback className="w-full h-full" variant="listing" />}
          />
          {isNew && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
          {listing.price && (
            <span className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-ink/80 backdrop-blur-md
                             text-sm font-semibold text-white">
              ₹{listing.price}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-ink text-base line-clamp-1">{listing.title}</h3>
          <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
          <p className="text-xs text-clay font-medium mt-3 group-hover:underline">
            Details →
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
