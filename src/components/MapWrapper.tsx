// src/components/MapWrapper.tsx
// Always use this instead of importing ArtistMapFull directly.
// Leaflet requires browser APIs — this prevents Next.js SSR from crashing.

'use client'
import dynamic from 'next/dynamic'
import type { MapArtist } from './ArtistMapFull'

const ArtistMapFull = dynamic(() => import('./ArtistMapFull'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-sand">
      <div className="text-center">
        <div className="text-3xl mb-2 animate-pulse">🗺</div>
        <p className="text-muted text-sm">Loading map...</p>
      </div>
    </div>
  ),
})

interface Props {
  artists: MapArtist[]
  activeId?: string | null
  onPinClick?: (id: string) => void
}

export default function MapWrapper(props: Props) {
  return <ArtistMapFull {...props} />
}
