// src/components/Navbar.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '/artists', label: 'Artists' },
  { href: '/listings', label: 'Shop' },
  { href: '/map',     label: 'Map' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll for glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
  }, [open])

  return (
    <>
      <header
        style={{ height: 'var(--nav-h)' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-cream/80 backdrop-blur-md border-sand-dark shadow-sm' 
            : 'bg-cream/0 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group relative z-50">
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-sand-dark group-hover:scale-110 transition-transform">
              <Image src="/icon.png" alt="Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className={`font-display text-2xl tracking-tight transition-colors ${
              open ? 'text-ink' : 'text-ink'
            }`}>
              crafters<span className="text-clay">united</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-clay relative py-1 group ${
                  pathname === href ? 'text-clay' : 'text-charcoal'
                }`}
              >
                {label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-clay transition-all duration-300 ${
                  pathname === href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
            <Link
              href="/join"
              className="px-5 py-2 rounded-full bg-clay text-white text-sm font-medium 
                         hover:bg-clay-light transition-all shadow-lg shadow-clay/20 active:scale-95"
            >
              Join as Artist
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="relative z-50 p-2 md:hidden"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                animate={open ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-full bg-ink origin-center"
              />
              <motion.span
                animate={open ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                className="block h-0.5 w-full bg-ink"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-full bg-ink origin-center"
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-cream flex flex-col pt-32 px-6"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden">
               <div className="text-[10rem] font-display text-clay leading-none absolute -bottom-10 -right-10 rotate-12">8</div>
            </div>

            <nav className="flex flex-col gap-8 relative z-10">
              {links.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="text-5xl font-display text-ink hover:text-clay transition-colors"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-8 mt-8 border-t border-sand-dark"
              >
                <Link
                  href="/join"
                  onClick={() => setOpen(false)}
                  className="inline-block px-8 py-4 rounded-full bg-clay text-white text-lg font-medium 
                             shadow-xl shadow-clay/20 active:scale-95"
                >
                  Join as Artist
                </Link>
              </motion.div>
            </nav>

            {/* Footer in menu */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.6 }}
              className="mt-auto mb-12 text-sm text-muted"
            >
              <p>CraftersUnited © {new Date().getFullYear()}</p>
              <p className="mt-1">Heartfelt, Human, Handmade.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
