// src/components/ArtistMapFull.tsx
// Shared interactive map — used on /artists and /listings pages
// Leaflet + OpenStreetMap — zero API key, zero cost
// Dynamic import this component to avoid SSR errors

'use client'
import { useEffect, useRef } from 'react'

export interface MapArtist {
  id: string
  name: string
  city: string
  state: string
  lat: number
  lng: number
  photo_url: string | null
  category: string | null
  listing_count?: number  // optional — used on Shop page
}

interface Props {
  artists: MapArtist[]
  activeId?: string | null       // highlights a pin when hovering an artist card
  onPinClick?: (id: string) => void
}

export default function ArtistMapFull({ artists, activeId, onPinClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<Record<string, any>>({})
  const leafletRef = useRef<any>(null)

  useEffect(() => {
    // Dynamically import leaflet only client-side
    let L: any
    let markerCluster: any

    async function initMap() {
      // @ts-ignore
      L = (await import('leaflet')).default
      leafletRef.current = L
      // @ts-ignore
      await import('leaflet/dist/leaflet.css')
      // @ts-ignore
      await import('leaflet.markercluster/dist/MarkerCluster.css')
      // @ts-ignore
      await import('leaflet.markercluster/dist/MarkerCluster.Default.css')
      // @ts-ignore
      const { MarkerClusterGroup } = await import('leaflet.markercluster')

      if (!mapRef.current || mapInstanceRef.current) return

      // Fix Leaflet default icon path broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      // Custom clay-colored pin for CraftersUnited
      function makeIcon(active = false) {
        return L.divIcon({
          className: '',
          html: `
            <div style="
              width: 32px; height: 32px;
              background: ${active ? '#e8601e' : '#c2440f'};
              border: 3px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 2px 8px rgba(194,68,15,0.4);
              transition: all 0.2s;
            "></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -36],
        })
      }

      // Center on India — zooms to Kerala if all artists are there
      const indiaCenter: [number, number] = [10.5, 76.5]
      const defaultZoom = artists.length > 0 && artists.every(a => a.state === 'Kerala') ? 8 : 5

      const map = L.map(mapRef.current, {
        center: indiaCenter,
        zoom: defaultZoom,
        zoomControl: true,
      })

      mapInstanceRef.current = map

      // OpenStreetMap tiles — free, no key
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Cluster group
      const cluster = new MarkerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        iconCreateFunction: (c: any) => L.divIcon({
          html: `<div style="
            background: #c2440f; color: white; font-family: 'DM Sans', sans-serif;
            width: 36px; height: 36px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 13px; font-weight: 600;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(194,68,15,0.4);
          ">${c.getChildCount()}</div>`,
          className: '',
          iconSize: [36, 36],
        }),
      })

      // Add a marker for each artist
      artists.forEach((artist) => {
        if (!artist.lat || !artist.lng) return

        const isActive = artist.id === activeId
        const marker = L.marker([artist.lat, artist.lng], {
          icon: makeIcon(isActive),
        })

        // Popup content — mini profile card
        const photoHtml = artist.photo_url
          ? `<img src="${artist.photo_url}" onerror="this.outerHTML='<div style=\\'width:100%;height:72px;background:#f5ead8;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;font-size:28px;\\'>🎨</div>'" style="width:100%;height:72px;object-fit:cover;border-radius:8px 8px 0 0;" />`
          : `<div style="width:100%;height:72px;background:#f5ead8;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;font-size:28px;">🎨</div>`

        const listingBadge = artist.listing_count !== undefined
          ? `<span style="font-size:11px;color:#8a7560;">${artist.listing_count} listing${artist.listing_count !== 1 ? 's' : ''}</span>`
          : ''

        marker.bindPopup(`
          <div style="width:160px;font-family:'DM Sans',sans-serif;border-radius:8px;overflow:hidden;padding:0;">
            ${photoHtml}
            <div style="padding:10px 10px 8px;">
              <div style="font-weight:600;font-size:13px;color:#1a1208;line-height:1.2;">${artist.name}</div>
              <div style="font-size:11px;color:#8a7560;margin-top:2px;">${artist.city}, ${artist.state}</div>
              ${artist.category ? `<div style="font-size:10px;color:#c2440f;margin-top:4px;font-weight:500;">${artist.category}</div>` : ''}
              ${listingBadge}
              <a href="/artists/${artist.id}" style="
                display:block;margin-top:8px;padding:5px 0;text-align:center;
                background:#c2440f;color:white;border-radius:20px;
                font-size:11px;font-weight:600;text-decoration:none;
              ">View Profile →</a>
            </div>
          </div>
        `, {
          maxWidth: 160,
          className: 'cr8-popup',
        })

        marker.on('click', () => {
          if (onPinClick) onPinClick(artist.id)
        })

        markersRef.current[artist.id] = marker
        cluster.addLayer(marker)
      })

      map.addLayer(cluster)

      // Fit map to artist bounds if there are artists
      if (artists.length > 0) {
        const validArtists = artists.filter(a => a.lat && a.lng)
        if (validArtists.length > 0) {
          const bounds = L.latLngBounds(validArtists.map(a => [a.lat, a.lng]))
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 })
        }
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // init once

  // When activeId changes, update pin color and open popup
  useEffect(() => {
    const L = leafletRef.current
    if (!mapInstanceRef.current || !L) return
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const isActive = id === activeId
      marker.setIcon(L.divIcon({
        className: '',
        html: `<div style="
          width: 32px; height: 32px;
          background: ${isActive ? '#e8601e' : '#c2440f'};
          border: 3px solid white;
          border-radius: 50% 50% 50% 0;
          box-shadow: 0 2px 8px rgba(194,68,15,${isActive ? '0.6' : '0.4'});
          transform: rotate(-45deg) scale(${isActive ? '1.3' : '1'});
          transition: all 0.2s;
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      }))
      if (isActive) {
        marker.openPopup()
        mapInstanceRef.current?.panTo(marker.getLatLng(), { animate: true })
      }
    })
  }, [activeId])

  return (
    <>
      <style>{`
        .cr8-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .cr8-popup .leaflet-popup-content {
          margin: 0;
          line-height: 1;
        }
        .cr8-popup .leaflet-popup-tip-container {
          display: none;
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </>
  )
}
