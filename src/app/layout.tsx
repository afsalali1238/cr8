import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'CraftersUnited — Discover Handcrafted Art from Local Makers',
  description: 'Find unique handcrafted art, jewellery, home décor and personalised items from independent artists across India.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream font-sans text-charcoal">
        <Navbar />
        <div style={{ paddingTop: 'var(--nav-h)' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
