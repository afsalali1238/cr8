// src/components/SocialLinks.tsx
// Instagram + WhatsApp contact buttons for artist profiles
// Simple deep links — zero backend needed

interface Props {
  whatsapp?: string | null   // format: 91XXXXXXXXXX
  instagram?: string | null  // handle only, no @
  email?: string | null
  name?: string              // used in WhatsApp pre-fill message
  listingTitle?: string      // if coming from a listing page
}

const WHATSAPP_DEFAULT = (name: string) =>
  encodeURIComponent(`Hi ${name}, I found you on CraftersUnited! I'm interested in your work.`)

const WHATSAPP_LISTING = (name: string, title: string) =>
  encodeURIComponent(`Hi ${name}, I saw your listing "${title}" on CraftersUnited and I'm interested!`)

export default function SocialLinks({ whatsapp, instagram, email, name = 'there', listingTitle }: Props) {
  const whatsappMessage = listingTitle
    ? WHATSAPP_LISTING(name, listingTitle)
    : WHATSAPP_DEFAULT(name)

  const hasAny = whatsapp || instagram || email
  if (!hasAny) return null

  return (
    <div className="flex flex-wrap gap-3">
      {/* WhatsApp — primary CTA, always first */}
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                     bg-[#25D366] text-white text-sm font-semibold
                     hover:bg-[#1db954] transition-colors shadow-sm"
        >
          <WhatsAppIcon />
          WhatsApp
        </a>
      )}

      {/* Instagram */}
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                     bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045]
                     text-white text-sm font-semibold
                     hover:opacity-90 transition-opacity shadow-sm"
        >
          <InstagramIcon />
          @{instagram.replace('@', '')}
        </a>
      )}

      {/* Email — tertiary */}
      {email && (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                     border-2 border-clay text-clay text-sm font-semibold
                     hover:bg-clay hover:text-white transition-colors"
        >
          <EmailIcon />
          Email
        </a>
      )}
    </div>
  )
}

/* ── SVG Icons (inline — no icon library needed) ────────── */

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.857L.057 23.428a.5.5 0 00.609.61l5.71-1.496A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.806 9.806 0 01-5.032-1.385l-.36-.214-3.733.979.998-3.648-.235-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}
