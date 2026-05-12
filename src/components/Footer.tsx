'use client'
import Link from 'next/link'
import { useState } from 'react'
import { subscribeToNewsletter } from '@/app/actions/newsletter'

export default function Footer() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await subscribeToNewsletter(email)
      setStatus('success')
      setMessage("You're in! We'll share new makers and craft stories with you.")
      setEmail('')
    } catch (err: unknown) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <footer style={{ background: '#1C0D04' }} className="mt-0">
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-6">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          {/* Brand — spans 2 cols on desktop */}
          <div className="col-span-2">
            <div className="border-2 border-clay rounded-lg px-3 py-1.5 font-brand text-sm text-clay leading-tight text-center inline-block mb-4">
              Crafters<br />United
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#C8A898' }}>
              Connecting handmade stories with people who value them.
              Made with craft in India 🇮🇳
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-cream text-xs font-bold uppercase tracking-widest mb-4">Explore</p>
            <ul className="space-y-2.5">
              {[
                { href: '/listings', label: 'Shop' },
                { href: '/artists',  label: 'Artists' },
                { href: '/map',      label: 'Map' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: '#C8A898' }}
                    className="text-sm hover:text-clay transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Makers */}
          <div>
            <p className="text-cream text-xs font-bold uppercase tracking-widest mb-4">For Makers</p>
            <ul className="space-y-2.5">
              {[
                { href: '/join',    label: 'Join Free' },
                { href: '/artists', label: 'Meet the Makers' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: '#C8A898' }}
                    className="text-sm hover:text-clay transition-colors">{l.label}</Link>
                </li>
              ))}
              <li>
                <a href="mailto:hello@cr8un8.com" style={{ color: '#C8A898' }}
                  className="text-sm hover:text-clay transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-cream text-xs font-bold uppercase tracking-widest mb-2">Newsletter</p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: '#C8A898' }}>
              Weekly stories of craft &amp; community
            </p>
            {status === 'success' ? (
              <p className="text-green-400 text-sm">{message}</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 min-w-0 px-3 py-2.5 rounded-lg text-cream text-sm placeholder:text-[#6B4226] focus:outline-none focus:ring-1 focus:ring-clay"
                  style={{ background: '#3A1C0C', border: '1px solid #8F4628' }}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-3 py-2.5 rounded-lg bg-clay text-cream text-sm font-bold hover:bg-clay-dark transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {status === 'loading' ? '…' : '→'}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-xs mt-2">{message}</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-5 flex justify-between items-center flex-wrap gap-3" style={{ borderColor: '#3A1C0C' }}>
          <p className="text-xs" style={{ color: '#6B4226' }}>
            © {new Date().getFullYear()} CraftersUnited · All rights reserved
          </p>
          <p className="text-xs" style={{ color: '#6B4226' }}>
            No fees · No algorithms · Just craft
          </p>
        </div>
      </div>
    </footer>
  )
}
