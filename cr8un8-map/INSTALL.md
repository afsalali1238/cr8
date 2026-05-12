# Map Setup — Run These Commands

## Step 1: Install the cluster plugin
```bash
npm install leaflet.markercluster
npm install -D @types/leaflet
```

## Step 2: Add these 5 files to your repo

| File | Where it goes |
|---|---|
| `ArtistMapFull.tsx` | `src/components/ArtistMapFull.tsx` |
| `MapWrapper.tsx` | `src/components/MapWrapper.tsx` |
| `ArtistsClientPage.tsx` | `src/components/ArtistsClientPage.tsx` |
| `ListingsClientPage.tsx` | `src/components/ListingsClientPage.tsx` |
| `src/app/artists/page.tsx` | Replace your existing artists page |
| `src/app/listings/page.tsx` | Replace your existing listings page |

## Step 3: Clear cache and restart
```bash
rm -rf .next
npm run dev
```

## Step 4: Add lat/lng to your test artist in Supabase
Go to Supabase → Table Editor → artists → edit the test artist row:
- lat: 9.9312
- lng: 76.2673

Without lat/lng the map will show empty. Every artist needs coordinates.

## How to get lat/lng for an artist's city
Google Maps → right-click the city → the numbers shown are lat, lng
Example: Kochi → 9.9312, 76.2673
Example: Kozhikode → 11.2588, 75.7804
Example: Thrissur → 10.5276, 76.2144
Example: Bangalore → 12.9716, 77.5946

## What you'll see after setup

### /artists page
- Map on the LEFT (desktop) / TOP (mobile)
- Artist grid on the right
- Hover an artist card → their pin lights up orange
- Click a map pin → popup shows artist photo, name, location, "View Profile" button
- Filter buttons at top → updates both map AND grid simultaneously

### /listings page (Shop)
- Same layout — map left, listings right
- Listings are GROUPED by artist with the artist's photo/name as a header row
- Hover an artist's listings → their pin highlights on map
- Click a map pin → scrolls to that artist's listings section
- Each pin shows how many listings that artist has
- Filter by category → map updates to show only artists with listings in that category
