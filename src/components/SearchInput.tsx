// src/components/SearchInput.tsx
'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchInput({ 
  placeholder = "Search artists, cities, or crafts...",
  baseUrl = "/artists"
}: { 
  placeholder?: string,
  baseUrl?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    router.push(`${baseUrl}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl group">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted group-focus-within:text-clay transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 rounded-full bg-white border border-sand-dark 
                   focus:border-clay focus:ring-4 focus:ring-clay/10 outline-none transition-all
                   text-ink placeholder:text-muted/60 shadow-sm"
      />
      <button 
        type="submit"
        className="absolute inset-y-2 right-2 px-6 rounded-full bg-clay text-white text-sm font-medium
                   hover:bg-clay-light transition-all shadow-lg shadow-clay/20 active:scale-95"
      >
        Search
      </button>
    </form>
  )
}
