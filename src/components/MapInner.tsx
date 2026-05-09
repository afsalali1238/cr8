// src/components/MapInner.tsx
'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Link from 'next/link'
import { useEffect } from 'react'
import type { ArtistMapPoint } from '@/types'

// India center coordinates
const INDIA_CENTER: [number, number] = [20.5937, 78.9629]

export default function MapInner({ artists }: { artists: ArtistMapPoint[] }) {
  // Custom icon for brand alignment
  const customIcon = new L.Icon({
    iconUrl: '/marker-icon-custom.png',
    iconRetinaUrl: '/marker-icon-custom.png',
    iconSize: [35, 45],
    iconAnchor: [17, 45],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  return (
    <MapContainer
      center={INDIA_CENTER}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
      />
      <MarkerClusterGroup chunkedLoading>
        {artists.map((artist) => (
          <Marker
            key={artist.id}
            position={[artist.lat, artist.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <p className="font-display text-xl text-clay leading-none mb-1">{artist.name}</p>
                <p className="text-xs text-muted mb-2">📍 {artist.city}, {artist.state}</p>
                <p className="text-[10px] uppercase tracking-widest text-charcoal font-semibold mb-3">
                  {artist.category}
                </p>
                <Link
                  href={`/artists/${artist.id}`}
                  className="inline-block w-full py-1.5 bg-clay text-white text-center text-xs rounded-full hover:bg-clay-light transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}
