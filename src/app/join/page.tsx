// src/app/join/page.tsx
import ArtistOnboardingForm from '@/components/ArtistOnboardingForm'

export default function JoinPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <header className="text-center mb-12">
        <span className="text-clay font-semibold text-sm uppercase tracking-widest mb-3 block">
          Become a Partner
        </span>
        <h1 className="font-display text-6xl text-ink mb-6">Join CraftersUnited</h1>
        <p className="text-charcoal text-lg max-w-2xl mx-auto leading-relaxed">
          List your handcrafted work and connect with buyers who appreciate the human touch. 
          Your profile will go live after a quick review. No commissions, just community.
        </p>
      </header>
      
      <div className="bg-sand rounded-3xl p-8 md:p-12 border border-sand-dark shadow-xl">
        <ArtistOnboardingForm />
      </div>

      <footer className="mt-12 text-center text-sm text-muted">
        <p>Questions? Contact us at hello@cr8un8.com</p>
      </footer>
    </main>
  )
}
