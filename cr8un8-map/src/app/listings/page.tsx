// src/app/listings/page.tsx
// Shop page — map showing artist locations + browseable listing grid
// Map pins show which artists have active listings in this category

import { createServerClient } from '@/lib/supabase/server'
import ListingsClientPage from '@/components/ListingsClientPage'

export const revalidate = 60

export default async function ListingsPage() {
  const supabase = createServerClient()

  const [{ data: listings }, { data: categories }] = await Promise.all([
    supabase
      .from('listings')
      .select(`
        id, title, description, price, image_url, category, is_available,
        artist:artists!inner(
          id, name, city, state, lat, lng, photo_url, category,
          is_approved, is_active
        )
      `)
      .eq('is_available', true)
      .eq('artists.is_approved', true)
      .eq('artists.is_active', true)
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('id'),
  ])

  return (
    <ListingsClientPage
      listings={listings || []}
      categories={categories || []}
    />
  )
}
