// src/app/artists/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import ArtistCard from '@/components/ArtistCard'
import CategoryFilter from '@/components/CategoryFilter'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import type { Metadata } from 'next'
import type { Artist, Category } from '@/types'

export async function generateMetadata({ searchParams }: { searchParams: { category?: string } }): Promise<Metadata> {
  const category = searchParams.category
  if (!category) return { title: 'Discover Artists | CraftersUnited' }
  
  // Format slug to readable name
  const categoryName = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return {
    title: `${categoryName} Artists | CraftersUnited`,
    description: `Discover talented independent makers specializing in ${categoryName} across India.`,
  }
}

export const revalidate = 60

export default async function ArtistsPage({
  searchParams,
}: {
  searchParams: { category?: string, q?: string }
}) {
  const supabase = createServerClient()
  const { category, q } = searchParams

  // Fetch categories for the filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('id')

  // Fetch artists with optional filtering
  let query = supabase
    .from('artists')
    .select('id, name, city, state, category, photo_url')
    .eq('is_approved', true)
    .eq('is_active', true)
    .order('name')

  if (category) {
    query = query.eq('category', category)
  }

  if (q) {
    // Simple or filter for name, city, or bio
    // Using or because we want to match any of these
    query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,bio.ilike.%${q}%`)
  }

  const { data: artists } = await query

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="font-display text-4xl text-ink mb-4">Our Artists</h1>
          <p className="text-charcoal text-base max-w-2xl leading-relaxed">
            Discover talented makers from across India. Filter by category or search 
            directly for names and locations.
          </p>
        </div>
        <SearchInput />
      </header>

      <CategoryFilter categories={categories || []} />

      {(!artists || artists.length === 0) ? (
        <EmptyState resetUrl="/artists" message="We couldn't find any artists matching your criteria." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </main>
  )
}
