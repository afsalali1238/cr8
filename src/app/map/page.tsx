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
    <main className="h-[calc(100vh-var(--nav-h))]">
      <MapViewClient artists={artists || []} />
    </main>
  )
}
