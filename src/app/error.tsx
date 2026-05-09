// src/app/error.tsx
'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-clay/10 rounded-full flex items-center justify-center text-4xl mb-8">
        🛠️
      </div>
      
      <h1 className="font-display text-4xl text-ink mb-4">A temporary glitch in the workshop</h1>
      <p className="text-muted max-w-md mb-10 leading-relaxed">
        Something unexpected happened while we were fetching this creation. 
        Don't worry, our tools are being sharpened as we speak.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-8 py-3 rounded-full bg-clay text-white font-medium hover:bg-clay-light transition-all shadow-lg shadow-clay/20"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="px-8 py-3 rounded-full border-2 border-clay text-clay font-medium hover:bg-clay hover:text-white transition-all"
        >
          Back to Safety
        </Link>
      </div>
      
      <p className="mt-12 text-[10px] text-muted/50 uppercase tracking-widest">
        Error ID: {error.digest || 'unknown'}
      </p>
    </div>
  )
}
