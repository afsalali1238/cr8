---
name: build-artist-profile-page
description: "Builds the artist profile page at /artists/[id] with bio, portfolio grid, WhatsApp and Instagram contact buttons, and location map pin. Use when asked to create or update the artist detail page."
---

# Skill: Build Artist Profile Page

## What This Skill Does
Generates the complete `/artists/[id]` page for CraftersUnited including all data fetching, layout, contact buttons, and the mini-map showing the artist's location.

## Success Criterion
Page renders with: artist name, photo, bio, location, category badge, listing grid (up to 6 items), WhatsApp contact button, Instagram link, and a Leaflet map pin at the artist's coordinates.

## Pre-Conditions
- `artists` table in Supabase has at least one row with `is_approved = true`
- `listings` table has rows referencing the artist
- Supabase env vars in `.env.local`
- `leaflet` and `react-leaflet` installed

## Step-by-Step Plan

### Step 1: Fetch artist data (server component)
```
→ verify: console.log shows artist object with all fields populated
```

```tsx
// src/app/artists/[id]/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ArtistProfileLayout from '@/components/ArtistProfileLayout'

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data: artist } = await supabase
    .from('artists')
    .select('*, listings(*)')
    .eq('id', params.id)
    .eq('is_approved', true)
    .single()

  if (!artist) notFound()

  return <ArtistProfileLayout artist={artist} />
}
```

### Step 2: Build ArtistProfileLayout component
```
→ verify: renders without TypeScript errors, all props display correctly
```

```tsx
// src/components/ArtistProfileLayout.tsx
import Image from 'next/image'
import ContactButtons from './ContactButtons'
import ListingGrid from './ListingGrid'
import ArtistMapPin from './ArtistMapPin'
import { Badge } from '@/components/ui/badge'
import type { ArtistWithListings } from '@/types'

export default function ArtistProfileLayout({ artist }: { artist: ArtistWithListings }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <Image
          src={artist.photo_url || '/placeholder-artist.jpg'}
          alt={artist.name}
          width={160}
          height={160}
          className="rounded-full object-cover w-40 h-40"
        />
        <div>
          <h1 className="text-2xl font-bold">{artist.name}</h1>
          <p className="text-muted-foreground">{artist.city}, {artist.state}</p>
          <Badge className="mt-2">{artist.category}</Badge>
          <p className="mt-4 text-sm leading-relaxed">{artist.bio}</p>
        </div>
      </div>

      {/* Contact */}
      <ContactButtons artist={artist} />

      {/* Map */}
      {artist.lat && artist.lng && (
        <div className="my-8">
          <h2 className="text-lg font-semibold mb-3">Location</h2>
          <ArtistMapPin lat={artist.lat} lng={artist.lng} name={artist.name} />
        </div>
      )}

      {/* Listings */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">
          Listings ({artist.listings?.length || 0})
        </h2>
        <ListingGrid listings={artist.listings || []} />
      </div>
    </div>
  )
}
```

### Step 3: Build ContactButtons component
```
→ verify: WhatsApp link opens correct number in new tab. Instagram opens profile.
```

```tsx
// src/components/ContactButtons.tsx
'use client'
import { Button } from '@/components/ui/button'
import type { Artist } from '@/types'

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi, I found you on CraftersUnited! I'm interested in your work."
)

export default function ContactButtons({ artist }: { artist: Artist }) {
  return (
    <div className="flex flex-wrap gap-3">
      {artist.whatsapp && (
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <a
            href={`https://wa.me/${artist.whatsapp}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 WhatsApp
          </a>
        </Button>
      )}
      {artist.email && (
        <Button asChild variant="outline">
          <a href={`mailto:${artist.email}`}>
            ✉️ Email
          </a>
        </Button>
      )}
    </div>
  )
}
```

### Step 4: Build ArtistMapPin (Leaflet, client component)
```
→ verify: map renders at correct lat/lng, no SSR errors, pin shows artist name on click
```

```tsx
// src/components/ArtistMapPin.tsx
'use client'
import dynamic from 'next/dynamic'

// Leaflet must be dynamic-imported to avoid SSR errors
const MapWithPin = dynamic(() => import('./MapWithPinInner'), { ssr: false })

export default function ArtistMapPin({ lat, lng, name }: {
  lat: number; lng: number; name: string
}) {
  return (
    <div className="h-64 rounded-xl overflow-hidden border">
      <MapWithPin lat={lat} lng={lng} name={name} />
    </div>
  )
}
```

```tsx
// src/components/MapWithPinInner.tsx
'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default icon path issue with Next.js
const icon = L.icon({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function MapWithPinInner({ lat, lng, name }: {
  lat: number; lng: number; name: string
}) {
  return (
    <MapContainer center={[lat, lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://openstreetmap.org">OpenStreetMap</a>'
      />
      <Marker position={[lat, lng]} icon={icon}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  )
}
```

## Post-Build Checklist
- [ ] Page renders at `/artists/[test-uuid]`
- [ ] Artist photo displays (or placeholder if null)
- [ ] WhatsApp button opens correct number
- [ ] Instagram link opens correct profile
- [ ] Map pin appears at correct location
- [ ] Listing cards render below profile
- [ ] Page is mobile-responsive
- [ ] 404 returned for unapproved artists
