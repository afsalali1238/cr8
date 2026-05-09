// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'CraftersUnited — Heartfelt, Human, Handmade',
    template: '%s | CraftersUnited'
  },
  description:
    'Discover unique handcrafted art, jewellery, home décor and personalised items from independent makers across India. Connect directly with the human touch behind every creation.',
  metadataBase: new URL('https://cr8un8.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CraftersUnited',
    description: 'Discover handcrafted art from local makers near you.',
    url: 'https://cr8un8.com',
    siteName: 'CraftersUnited',
    images: [
      {
        url: '/icon.png', // Fallback social image
        width: 800,
        height: 800,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CraftersUnited',
    description: 'Discover handcrafted art from local makers near you.',
    images: ['/icon.png'],
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div style={{ paddingTop: 'var(--nav-h)' }}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
