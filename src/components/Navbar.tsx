'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/artists',  label: 'Artists' },
  { href: '/listings', label: 'Shop'    },
  { href: '/map',      label: 'Map'     },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === '/'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-cream/95 backdrop-blur-md border-b border-sand-dark shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5">
          <div className="border-2 border-clay rounded-lg px-2.5 py-1 font-brand text-sm text-clay leading-tight text-center">
            Crafters<br />United
          </div>
          <span className="hidden sm:block text-xs text-muted font-medium tracking-widest uppercase">
            cr8un8.com
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-clay ${
                pathname.startsWith(href) ? 'text-clay' : 'text-charcoal'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/join"
            className="ml-1 px-5 py-2 rounded-full bg-clay text-cream text-sm font-semibold
                       hover:bg-clay-dark transition-colors shadow-md shadow-clay/20"
          >
            Join Free
          </Link>
        </nav>

        {/* Mobile hamburger */}
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

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-cream/98 backdrop-blur-md border-b border-sand-dark px-4 py-4 flex flex-col gap-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`text-base font-medium transition-colors hover:text-clay ${
                pathname.startsWith(href) ? 'text-clay' : 'text-charcoal'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/join"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 rounded-full bg-clay text-cream text-sm font-semibold text-center mt-1"
          >
            Join Free
          </Link>
        </div>
      )}
    </header>
  )
}
