'use client'
import { useState } from 'react'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback: React.ReactNode
}

export default function SafeImage({ src, fallback, alt, className, ...props }: SafeImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return <>{fallback}</>
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  )
}
