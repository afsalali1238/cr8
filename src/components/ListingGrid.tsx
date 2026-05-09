// src/components/ListingGrid.tsx
import ListingCard from './ListingCard'
import type { Listing } from '@/types'

export default function ListingGrid({ listings }: { listings: Listing[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
