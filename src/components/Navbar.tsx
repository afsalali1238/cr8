'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/artists', label: 'Artists' },
  { href: '/listings', label: 'Shop' },
  { href: '/map', label: 'Map' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-cream border-b border-sand-dark">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-3xl text-clay leading-none">cr8un8</span>
          <span className="hidden sm:block text-xs text-muted font-medium tracking-widest uppercase mt-1">
            crafters united
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-clay ${
                pathname === href ? 'text-clay' : 'text-charcoal'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/join"
            className="ml-2 px-4 py-2 rounded-full bg-clay text-white text-sm font-medium hover:bg-clay-light transition-colors"
          >
            Join as Artist
          </Link>
        </nav>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-charcoal transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-charcoal transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-charcoal transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-cream border-b border-sand-dark px-4 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="text-base font-medium text-charcoal hover:text-clay">
              {label}
            </Link>
          ))}
          <Link href="/join" onClick={() => setOpen(false)}
            className="px-4 py-2.5 rounded-full bg-clay text-white text-sm font-medium text-center">
            Join as Artist
          </Link>
        </div>
      )}
    </header>
  )
}
