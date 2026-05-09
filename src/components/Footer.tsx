import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="font-display text-3xl text-clay">cr8un8</span>
          <p className="mt-3 text-sm leading-relaxed">
            Connecting independent artists with buyers who appreciate the beauty of handmade. India's local craft marketplace.
          </p>
        </div>
        <div>
          <h4 className="text-cream text-sm font-semibold uppercase tracking-widest mb-4">Discover</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/artists" className="hover:text-clay transition-colors">Browse Artists</Link></li>
            <li><Link href="/listings" className="hover:text-clay transition-colors">Shop Listings</Link></li>
            <li><Link href="/map" className="hover:text-clay transition-colors">Map View</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-cream text-sm font-semibold uppercase tracking-widest mb-4">For Artists</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/join" className="hover:text-clay transition-colors">Join as Artist</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 max-w-7xl mx-auto flex justify-between items-center">
        <p className="text-xs">© {new Date().getFullYear()} CraftersUnited</p>
        <span className="font-display text-clay text-base">Create · Collect · Connect</span>
      </div>
    </footer>
  )
}
