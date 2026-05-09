// src/app/artists/loading.tsx
import { SkeletonGrid } from '@/components/CardSkeletons'

export default function ArtistsLoading() {
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

      <SkeletonGrid count={9} type="artist" />
    </div>
  )
}
