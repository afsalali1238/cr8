// src/components/ImageFallback.tsx
// Accessible SVG fallback for broken images — replaces emoji placeholders.

interface ImageFallbackProps {
  className?: string
  variant?: 'artist' | 'listing'
}

export default function ImageFallback({ className = '', variant = 'artist' }: ImageFallbackProps) {
  return (
    <div className={`flex items-center justify-center bg-sand-dark/30 ${className}`} aria-hidden="true">
      {variant === 'artist' ? (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="18" r="8" fill="#c2440f" opacity="0.25" />
          <path d="M12 42c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#c2440f" strokeWidth="2.5" opacity="0.35" fill="none" />
        </svg>
      ) : (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="10" y="14" width="28" height="22" rx="4" stroke="#c2440f" strokeWidth="2.5" opacity="0.3" fill="none" />
          <path d="M10 28l8-6 6 4 8-6 6 4" stroke="#c2440f" strokeWidth="2" opacity="0.25" fill="none" />
          <circle cx="20" cy="22" r="3" fill="#c2440f" opacity="0.2" />
        </svg>
      )}
    </div>
  )
}
