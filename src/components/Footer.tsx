'use client'
import Link from 'next/link'
import { useState } from 'react'
import { subscribeToNewsletter } from '@/app/actions/newsletter'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await subscribeToNewsletter(email)
      setStatus('success')
      setMessage('You\'re in! We\'ll share new makers and craft stories with you.')
      setEmail('')
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong.')
    }
  }

  return (
    <footer className="bg-ink text-cream/70 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2">
          <span className="font-display text-3xl text-clay">cr8un8</span>
          <p className="mt-3 text-sm leading-relaxed max-w-xs">
            Connecting independent artists with buyers who appreciate the beauty of handmade. India's local craft marketplace.
          </p>
          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-cream text-xs font-semibold uppercase tracking-widest mb-3">
              New makers, every week
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
                  className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-cream text-sm placeholder:text-cream/40 focus:outline-none focus:border-clay"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-5 py-2 rounded-full bg-clay text-white text-sm font-medium hover:bg-clay-light transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {status === 'loading' ? '...' : 'Subscribe'}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-xs mt-2">{message}</p>
            )}
          </div>
        </div>

        {/* Discover */}
        <div>
          <h4 className="text-cream text-xs font-semibold uppercase tracking-widest mb-4">Discover</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/artists" className="hover:text-clay transition-colors">Browse Artists</Link></li>
            <li><Link href="/listings" className="hover:text-clay transition-colors">Shop Listings</Link></li>
            <li><Link href="/map" className="hover:text-clay transition-colors">Map View</Link></li>
          </ul>
        </div>

        {/* For Artists */}
        <div>
          <h4 className="text-cream text-xs font-semibold uppercase tracking-widest mb-4">For Artists</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/join" className="hover:text-clay transition-colors">Join as Artist</Link></li>
            <li><Link href="/artists" className="hover:text-clay transition-colors">Meet the makers</Link></li>
            <li>
              <a href="mailto:hello@cr8un8.com" className="hover:text-clay transition-colors">
                Contact us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 max-w-7xl mx-auto flex justify-between items-center">
        <p className="text-xs">© {new Date().getFullYear()} CraftersUnited</p>
      </div>
    </footer>
  )
}
