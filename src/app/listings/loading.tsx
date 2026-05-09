// src/app/listings/loading.tsx
import { SkeletonGrid } from '@/components/CardSkeletons'

export default function ListingsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 space-y-4">
        <div className="h-14 w-64 bg-sand-dark/40 rounded-xl animate-pulse" />
        <div className="h-6 w-full max-w-2xl bg-sand-dark/20 rounded-lg animate-pulse" />
      </header>
      
      <div className="flex gap-2 mb-8 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-24 bg-sand-dark/30 rounded-full animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-cream rounded-2xl overflow-hidden border border-sand-dark">
            <div className="h-60 w-full bg-sand-dark/50 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-full bg-sand-dark/30 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-sand-dark/20 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
