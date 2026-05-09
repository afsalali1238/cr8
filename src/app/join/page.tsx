import ArtistOnboardingForm from '@/components/ArtistOnboardingForm'
import Link from 'next/link'

export default function JoinPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-clay hover:underline mb-6 inline-block">← Home</Link>
      <h1 className="font-display text-5xl text-ink mb-2">Join CraftersUnited</h1>
      <p className="text-muted mb-8 leading-relaxed">
        List your handcrafted work and connect with buyers across India.
        Your profile goes live within 24 hours of review.
      </p>
      <ArtistOnboardingForm />
    </main>
  )
}
