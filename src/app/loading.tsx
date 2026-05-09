// src/app/loading.tsx
import { SkeletonGrid } from '@/components/CardSkeletons'

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="h-12 w-48 bg-sand-dark/30 rounded-lg mb-8 animate-pulse" />
      <div className="h-6 w-96 bg-sand-dark/20 rounded-lg mb-12 animate-pulse" />
      <SkeletonGrid count={6} />
    </div>
  )
}
