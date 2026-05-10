// src/components/EmptyState.tsx
'use client'
import Link from 'next/link'
export default function EmptyState({ 
  message = "No results found for your selection.",
  resetUrl = "/artists"
}: { 
  message?: string,
  resetUrl?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-up opacity-0">
      <div className="w-24 h-24 bg-sand rounded-full flex items-center justify-center text-5xl mb-6 border border-sand-dark">
        🔍
      </div>
      <h3 className="font-display text-3xl text-ink mb-2">We're still searching...</h3>
      <p className="text-muted max-w-sm mb-10 leading-relaxed">
        {message} Maybe try a different category or search term to discover other hidden gems?
      </p>
      
      <Link 
        href={resetUrl}
        className="px-8 py-3 rounded-full bg-clay text-white font-medium hover:bg-clay-light transition-all shadow-lg shadow-clay/20 active:scale-95"
      >
        Clear All Filters
      </Link>
      
      {/* decorative dots */}
      <div className="flex gap-2 mt-12">
        <div className="w-2 h-2 rounded-full bg-clay/20" />
        <div className="w-2 h-2 rounded-full bg-clay/40" />
        <div className="w-2 h-2 rounded-full bg-clay/20" />
      </div>
    </div>
  )
}
