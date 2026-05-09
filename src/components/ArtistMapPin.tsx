// src/components/ArtistMapPin.tsx
'use client'
import dynamic from 'next/dynamic'

// Leaflet must be dynamic-imported to avoid SSR errors
const MapWithPin = dynamic(() => import('./MapWithPinInner'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-sand-dark animate-pulse flex items-center justify-center text-muted">Loading map...</div>
})

export default function ArtistMapPin({ lat, lng, name }: {
  lat: number; lng: number; name: string
}) {
  return (
    <div className="h-64 rounded-xl overflow-hidden border border-sand-dark shadow-inner">
      <MapWithPin lat={lat} lng={lng} name={name} />
    </div>
  )
}
