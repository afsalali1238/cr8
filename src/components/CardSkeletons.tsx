// src/components/CardSkeletons.tsx
import Skeleton from './Skeleton'

export function ArtistCardSkeleton() {
  return (
    <div className="bg-cream rounded-2xl overflow-hidden border border-sand-dark">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-2">
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-cream rounded-2xl overflow-hidden border border-sand-dark">
      <Skeleton className="h-60 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
        <div className="pt-2">
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6, type = 'artist' }: { count?: number, type?: 'artist' | 'listing' }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        type === 'artist' ? <ArtistCardSkeleton key={i} /> : <ListingCardSkeleton key={i} />
      ))}
    </div>
  )
}
