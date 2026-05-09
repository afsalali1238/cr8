// src/components/CategoryFilter.tsx
'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Category } from '@/types'

export default function CategoryFilter({ 
  categories, 
  baseUrl = '/artists' 
}: { 
  categories: Category[], 
  baseUrl?: string 
}) {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        href={baseUrl}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
          ${!activeCategory 
            ? 'bg-clay text-white shadow-md' 
            : 'bg-sand text-charcoal hover:bg-sand-dark'}`}
      >
        All {baseUrl === '/artists' ? 'Artists' : 'Items'}
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`${baseUrl}?category=${cat.slug}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${activeCategory === cat.slug 
              ? 'bg-clay text-white shadow-md' 
              : 'bg-sand text-charcoal hover:bg-sand-dark'}`}
        >
          {cat.icon} {cat.name}
        </Link>
      ))}
    </div>
  )
}
