// src/components/MapViewClient.tsx
'use client'
import dynamic from 'next/dynamic'
import type { ArtistMapPoint } from '@/types'

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-sand animate-pulse">
      <div className="text-charcoal font-display text-2xl">Finding artists on the map...</div>
    </div>
  ),
})

export default function MapViewClient({ artists }: { artists: ArtistMapPoint[] }) {
  return <MapInner artists={artists} />
}
