// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="text-[12rem] font-display text-sand-dark leading-none opacity-50">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🏺</span>
        </div>
      </div>
      
      <h1 className="font-display text-4xl text-ink mb-4">Still crafting this page...</h1>
      <p className="text-muted max-w-md mb-10 leading-relaxed">
        It seems we couldn't find the creation you were looking for. 
        Perhaps it's still being shaped in the workshop?
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/"
          className="px-8 py-3 rounded-full bg-clay text-white font-medium hover:bg-clay-light transition-all shadow-lg shadow-clay/20"
        >
          Return Home
        </Link>
        <Link 
          href="/artists"
          className="px-8 py-3 rounded-full border-2 border-clay text-clay font-medium hover:bg-clay hover:text-white transition-all"
        >
          Explore Artists
        </Link>
      </div>
      
      {/* subtle watermark */}
      <div className="mt-20 opacity-20 select-none pointer-events-none">
        <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-muted">
          CraftersUnited · Discover the Human Touch
        </p>
      </div>
    </div>
  )
}
