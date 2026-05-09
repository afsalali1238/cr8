import { createServerClient } from '@/lib/supabase/server'
import MapViewClient from '@/components/MapViewClient'

export const revalidate = 60

export default async function MapPage() {
  const supabase = createServerClient()
  const { data: artists } = await supabase
    .from('artists')
    .select('id, name, city, state, lat, lng, photo_url, category')
    .eq('is_approved', true)
    .eq('is_active', true)
    .not('lat', 'is', null)
    .not('lng', 'is', null)

  const mapArtists = (artists || []).map(a => ({
    id: a.id,
    name: a.name,
    city: a.city || '',
    state: a.state || '',
    lat: a.lat as number,
    lng: a.lng as number,
    photo_url: a.photo_url,
    category: a.category,
  }))

  return (
    <main>
      <div className="bg-clay-pale border-b border-sand-dark px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl text-ink">Artists on the Map</h1>
          <p className="text-muted mt-1">
            {mapArtists.length} maker{mapArtists.length !== 1 ? 's' : ''} across India
          </p>
        </div>
      </div>
      <div style={{ height: 'calc(100vh - 160px)' }}>
        <MapViewClient artists={mapArtists} />
      </div>
    </main>
  )
}
