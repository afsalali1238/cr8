// src/components/Skeleton.tsx
export default function Skeleton({ className }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-sand-dark/50 rounded-md ${className}`} 
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite linear'
      }}
    />
  )
}
