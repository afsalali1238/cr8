---
name: build-map-view
description: "Builds the /map page showing all approved artists as clustered pins on a Leaflet + OpenStreetMap interactive map. Use when asked to create or update the discovery map. No API key needed."
---

# Skill: Build Map View

## What This Skill Does
Generates the `/map` page with all geo-tagged approved artists as interactive pins. Pins cluster at low zoom. Clicking a pin shows the artist name, category, and a link to their profile.

## Success Criterion
Map loads with all approved artists as pins. Clusters appear at zoom < 12. Clicking a pin navigates to `/artists/[id]`. Works on mobile (touch-friendly). Zero paid API calls.

## Dependencies to Install
```bash
npm install react-leaflet leaflet leaflet.markercluster
npm install -D @types/leaflet
```

Copy Leaflet marker icons to `/public/leaflet/`:
```bash
cp node_modules/leaflet/dist/images/marker-icon.png public/leaflet/
cp node_modules/leaflet/dist/images/marker-icon-2x.png public/leaflet/
cp node_modules/leaflet/dist/images/marker-shadow.png public/leaflet/
```

## Step-by-Step Plan

### Step 1: Fetch all approved geo-tagged artists (server component)
```
→ verify: returns array of artists with lat/lng not null
```

```tsx
// src/app/map/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import MapViewClient from '@/components/MapViewClient'

export default async function MapPage() {
  const supabase = createServerClient()

  const { data: artists } = await supabase
    .from('artists')
    .select('id, name, category, lat, lng, photo_url, city, state')
    .eq('is_approved', true)
    .not('lat', 'is', null)
    .not('lng', 'is', null)

  return (
    <main className="h-[calc(100vh-64px)]">
      <MapViewClient artists={artists || []} />
    </main>
  )
}
```

### Step 2: Build MapViewClient (full-screen map, client component)
```
→ verify: map fills screen, all pins appear, clicking opens popup
```

```tsx
// src/components/MapViewClient.tsx
'use client'
import dynamic from 'next/dynamic'

const MapInner = dynamic(() => import('./MapInner'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-muted">
      Loading map...
    </div>
  ),
})

export default function MapViewClient({ artists }: { artists: ArtistMapPoint[] }) {
  return <MapInner artists={artists} />
}
```

### Step 3: Build MapInner with clustering
```
→ verify: clusters appear at zoom 10, expand at zoom 13, each pin links to artist
```

```tsx
// src/components/MapInner.tsx
'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Link from 'next/link'
import type { ArtistMapPoint } from '@/types'

const icon = L.icon({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

// India center coordinates
const INDIA_CENTER: [number, number] = [20.5937, 78.9629]

export default function MapInner({ artists }: { artists: ArtistMapPoint[] }) {
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
            icon={icon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{artist.name}</p>
                <p className="text-muted-foreground">{artist.city}, {artist.state}</p>
                <p className="text-xs mt-1">{artist.category}</p>
                <Link
                  href={`/artists/${artist.id}`}
                  className="text-blue-600 underline text-xs mt-2 block"
                >
                  View Profile →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  )
}
```

## Post-Build Checklist
- [ ] Map fills full screen minus navbar height
- [ ] India visible on initial load (zoom 5)
- [ ] All approved artists show as pins
- [ ] Pins cluster at low zoom levels
- [ ] Popup shows name, location, category
- [ ] "View Profile" link navigates correctly
- [ ] No console errors about missing Leaflet icon files
- [ ] Works on iPhone (touch zoom/pan)
