// src/app/listings/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import ListingCard from '@/components/ListingCard'
import CategoryFilter from '@/components/CategoryFilter'
import SearchInput from '@/components/SearchInput'
import EmptyState from '@/components/EmptyState'
import type { Metadata } from 'next'
import type { Listing, Category } from '@/types'

export async function generateMetadata({ searchParams }: { searchParams: { category?: string } }): Promise<Metadata> {
  const category = searchParams.category
  if (!category) return { title: 'Shop Handmade | CraftersUnited' }
  
  const categoryName = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return {
    title: `Handmade ${categoryName} | CraftersUnited`,
    description: `Browse unique, handcrafted ${categoryName} pieces made by independent artists.`,
  }
}

export const revalidate = 60

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: { category?: string, q?: string }
}) {
  const supabase = createServerClient()
  const { category, q } = searchParams

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('id')

  // Fetch listings
  let query = supabase
    .from('listings')
    .select('*')
    .is('is_available', true)
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }

  const { data: listings } = await query

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="font-display text-5xl text-ink mb-4">Shop Handmade</h1>
          <p className="text-charcoal text-lg max-w-2xl">
            Browse unique pieces crafted with care by independent artists. 
            Search for specific items or styles.
          </p>
        </div>
        <SearchInput baseUrl="/listings" placeholder="Search handmade items..." />
      </header>

      <CategoryFilter categories={categories || []} baseUrl="/listings" />

      {(!listings || listings.length === 0) ? (
        <EmptyState resetUrl="/listings" message="We couldn't find any products matching your search." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  )
}
