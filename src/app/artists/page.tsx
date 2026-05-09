// src/app/artists/page.tsx
// Artists directory — filterable grid on left, live map on right
// Hover an artist card → their pin lights up on the map
// Click a map pin → popup shows artist mini-card
// Filter by category or state → grid updates, map pins update too

import { createServerClient } from '@/lib/supabase/server'
import ArtistsClientPage from '@/components/ArtistsClientPage'

export const revalidate = 60

export default async function ArtistsPage() {
  const supabase = createServerClient()

  const [{ data: artists }, { data: categories }] = await Promise.all([
    supabase
      .from('artists')
      .select('id, name, bio, city, state, lat, lng, category, photo_url')
      .eq('is_approved', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('id'),
  ])

  // Get unique states for filter
  const states = Array.from(new Set((artists || []).map(a => a.state).filter(Boolean))).sort()

  return (
    <ArtistsClientPage
      artists={artists || []}
      categories={categories || []}
      states={states as string[]}
    />
  )
}
