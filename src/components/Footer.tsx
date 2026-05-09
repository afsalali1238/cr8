// src/components/Footer.tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { subscribeToNewsletter } from '@/app/actions/newsletter'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      await subscribeToNewsletter(email)
      setStatus('success')
      setMessage('Thank you for joining our community!')
      setEmail('')
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong.')
    }
  }

  return (
    <footer className="bg-ink text-cream/70 mt-32 relative overflow-hidden">
      {/* subtle gradient background */}
      <div 
        className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-clay/10 to-transparent pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-white/20 group-hover:scale-110 transition-transform">
                <Image src="/icon.png" alt="Logo" width={32} height={32} className="object-cover" />
              </div>
              <span className="font-display text-2xl text-cream tracking-tight">
                crafters<span className="text-clay">united</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              A heartfelt marketplace connecting independent artists with buyers 
              who appreciate the human touch in every creation.
            </p>
            <div className="flex gap-4 mt-8">
              {['📸', '🐦', '📘'].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-clay/20 cursor-pointer transition-colors border border-white/10">
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream text-xs font-bold uppercase tracking-widest mb-6">Discovery</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/artists" className="hover:text-clay transition-colors">Find Artists</Link></li>
              <li><Link href="/listings" className="hover:text-clay transition-colors">Handmade Items</Link></li>
              <li><Link href="/map" className="hover:text-clay transition-colors">Makers Map</Link></li>
            </ul>
          </div>

          {/* For Artists */}
          <div>
            <h4 className="text-cream text-xs font-bold uppercase tracking-widest mb-6">Community</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/join" className="hover:text-clay transition-colors">Join as Artist</Link></li>
              <li><Link href="/admin" className="hover:text-clay transition-colors">Admin Dashboard</Link></li>
              <li><a href="#" className="hover:text-clay transition-colors">Artisan Guide</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-cream text-xs font-bold uppercase tracking-widest mb-6">Stay Inspired</h4>
            <p className="text-xs mb-4">Join our newsletter for stories from the workshop.</p>
            
            {status === 'success' ? (
              <div className="bg-clay/10 border border-clay/20 text-clay text-xs px-4 py-3 rounded-2xl">
                {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs outline-none focus:border-clay flex-1 disabled:opacity-50"
                  disabled={status === 'loading'}
                />
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-10 h-10 rounded-full bg-clay text-white flex items-center justify-center hover:bg-clay-light transition-colors shadow-lg shadow-clay/20 disabled:opacity-50"
                >
                  {status === 'loading' ? '...' : '→'}
                </button>
              </form>
            )}
            
            {status === 'error' && (
              <p className="text-[10px] text-clay mt-2">{message}</p>
            )}
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-clay transition-colors">Privacy</a>
            <a href="#" className="hover:text-clay transition-colors">Terms</a>
            <a href="#" className="hover:text-clay transition-colors">Contact</a>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[10px] uppercase tracking-widest mb-1">Made with heart in India</p>
            <p className="text-xs text-cream/30">© {new Date().getFullYear()} CraftersUnited. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
