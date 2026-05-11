// src/app/admin/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { approveArtist, toggleArtistActive } from './actions'
import type { Artist } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminDashboard() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function fetchArtists() {
    setLoading(true)
    let query = supabase.from('artists').select('*').order('created_at', { ascending: false })
    
    if (filter === 'pending') query = query.eq('is_approved', false)
    if (filter === 'approved') query = query.eq('is_approved', true)

    const { data } = await query
    setArtists(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchArtists()
  }, [filter])

  async function handleApprove(id: string) {
    if (!confirm('Are you sure you want to approve this artist?')) return
    try {
      await approveArtist(id)
      fetchArtists()
    } catch (err) {
      alert('Error approving artist')
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-6">
        <div>
          <h1 className="font-display text-5xl text-ink mb-2">Admin Dashboard</h1>
          <p className="text-muted italic">Vetting the human touch in every creation</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-sand rounded-full p-1 border border-sand-dark shadow-inner">
            {(['pending', 'approved', 'all'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all
                  ${filter === f ? 'bg-clay text-white shadow-lg' : 'text-charcoal hover:bg-sand-dark'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={handleSignOut}
            className="px-4 py-2.5 rounded-full border border-sand-dark text-xs font-bold uppercase tracking-widest text-muted hover:text-red-600 hover:border-red-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-sand-dark overflow-hidden shadow-xl shadow-sand-dark/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-sand/30 text-muted uppercase text-[10px] tracking-[0.2em] font-black border-b border-sand-dark">
              <tr>
                <th className="px-8 py-5">Artist Application</th>
                <th className="px-8 py-5">Specialty</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-dark/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-clay border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-medium text-muted">Refreshing registry...</p>
                    </div>
                  </td>
                </tr>
              ) : artists.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-muted italic">No artist applications found in this category.</p>
                  </td>
                </tr>
              ) : (
                artists.map((artist) => (
                  <div key={artist.id} className="contents">
                    <tr 
                      className={`group transition-colors cursor-pointer ${expandedId === artist.id ? 'bg-clay-pale' : 'hover:bg-cream/50'}`}
                      onClick={() => setExpandedId(expandedId === artist.id ? null : artist.id)}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-sand-dark overflow-hidden flex-shrink-0 relative border-2 border-white shadow-sm">
                            {artist.photo_url ? (
                              <img src={artist.photo_url} alt={artist.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-ink text-base">{artist.name}</p>
                            <p className="text-xs text-muted">{artist.city}, {artist.state}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white rounded-full border border-sand-dark text-charcoal">
                          {artist.category}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        {artist.is_approved ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                            Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-orange-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className={`text-xs font-bold uppercase tracking-widest transition-colors ${expandedId === artist.id ? 'text-clay' : 'text-muted group-hover:text-clay'}`}>
                          {expandedId === artist.id ? 'Close Detail' : 'View Detail'}
                        </button>
                      </td>
                    </tr>
                    
                    <AnimatePresence>
                      {expandedId === artist.id && (
                        <tr key={`${artist.id}-detail`}>
                          <td colSpan={4} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-clay-pale/50 border-b border-sand-dark/50"
                            >
                              <div className="px-8 py-8 grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                  <div>
                                    <h4 className="text-[10px] uppercase tracking-widest font-black text-clay mb-2">Artist Biography</h4>
                                    <p className="text-sm text-charcoal leading-relaxed whitespace-pre-wrap">
                                      {artist.bio || 'No biography provided.'}
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-[10px] uppercase tracking-widest font-black text-clay mb-2">WhatsApp</h4>
                                      <p className="text-sm font-medium">{artist.whatsapp || 'N/A'}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-[10px] uppercase tracking-widest font-black text-clay mb-2">Instagram</h4>
                                      <p className="text-sm font-medium">@{artist.instagram || 'N/A'}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-6">
                                  <div className="bg-white p-4 rounded-2xl border border-sand-dark shadow-sm">
                                    <h4 className="text-[10px] uppercase tracking-widest font-black text-ink mb-4">Actions</h4>
                                    {!artist.is_approved ? (
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleApprove(artist.id); }}
                                        className="w-full py-3 bg-clay text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-clay-light transition-all shadow-lg shadow-clay/20 active:scale-95"
                                      >
                                        Approve Maker
                                      </button>
                                    ) : (
                                      <div className="space-y-2">
                                        <a 
                                          href={`/artists/${artist.id}`}
                                          target="_blank"
                                          className="flex items-center justify-center w-full py-3 bg-ink text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all"
                                        >
                                          View Public Profile
                                        </a>
                                        <button className="w-full py-3 border-2 border-clay/20 text-clay text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-clay-pale transition-all">
                                          Deactivate Artist
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-muted leading-relaxed">
                                    Application submitted on {new Date(artist.created_at || '').toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
