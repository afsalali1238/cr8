// src/components/ContactButtons.tsx
'use client'
import type { Artist } from '@/types'

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi, I found you on CraftersUnited! I'm interested in your work."
)

export default function ContactButtons({ artist }: { artist: Artist }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
      {artist.whatsapp && (
        <a
          href={`https://wa.me/${artist.whatsapp}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 rounded-full bg-clay text-white font-medium hover:bg-clay-light
                     transition-all shadow-lg shadow-clay/20 flex items-center gap-2"
        >
          <span>💬</span> Message on WhatsApp
        </a>
      )}
      {artist.instagram && (
        <a
          href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-3 rounded-full border-2 border-clay text-clay font-medium
                     hover:bg-clay hover:text-white transition-all flex items-center gap-2"
        >
          <span>📸</span> View Instagram
        </a>
      )}
      {artist.email && !artist.whatsapp && (
        <a
          href={`mailto:${artist.email}`}
          className="px-8 py-3 rounded-full border-2 border-charcoal text-charcoal font-medium
                     hover:bg-charcoal hover:text-white transition-all flex items-center gap-2"
        >
          <span>✉️</span> Send Email
        </a>
      )}
    </div>
  )
}
