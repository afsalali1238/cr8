// CategoryIcon.tsx — minimal line-art SVG for each craft category
// Stroke: terracotta (#c2440f), fill: warm cream (#fdf0e8)
import type { ReactElement } from 'react'

interface Props {
  slug: string
  size?: number
}

export default function CategoryIcon({ slug, size = 48 }: Props) {
  const s = size
  const stroke = '#c2440f'
  const fill = '#fdf0e8'
  const sw = '1.5'

  const icons: Record<string, ReactElement> = {
    'art-crafts': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="18" cy="30" r="10" stroke={stroke} strokeWidth={sw} fill={fill}/>
        <circle cx="14" cy="32" r="2" fill={stroke} opacity=".3"/>
        <circle cx="20" cy="28" r="1.5" fill={stroke} opacity=".3"/>
        <circle cx="22" cy="33" r="1.5" fill={stroke} opacity=".2"/>
        <line x1="25" y1="23" x2="38" y2="10" stroke={stroke} strokeWidth="2" strokeLinecap="round"/>
        <path d="M25 23 l-3 3 3-1 1-3z" fill={stroke}/>
        <path d="M36 8 q2-2 4-1 t1 4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill={fill}/>
      </svg>
    ),
    'home-decor': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 22 L24 9 L40 22" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22 v16 h24 v-16" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill={fill}/>
        <rect x="20" y="30" width="8" height="8" rx="1" stroke={stroke} strokeWidth="1" fill={fill}/>
        <path d="M24 26 q0-4 4-5" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
        <path d="M24 26 q0-3-3-4" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
        <line x1="24" y1="26" x2="24" y2="30" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    'collectibles': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17 10 h14" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
        <path d="M17 10 c-4 4-6 8-6 13 0 8 6 14 13 14 s13-6 13-14 c0-5-2-9-6-13" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={fill}/>
        <path d="M15 21 q9-3 18 0" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity=".6"/>
        <path d="M14 27 q10-2 20 0" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity=".4"/>
        <line x1="17" y1="37" x2="31" y2="37" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    'personalized': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M20 10 h20 a2 2 0 0 1 2 2 v20 a2 2 0 0 1-2 2 h-20 l-10-12 z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={fill}/>
        <circle cx="36" cy="16" r="2" stroke={stroke} strokeWidth="1" fill={fill}/>
        <path d="M26 22 c0-2 3-4 4 0 c1-4 4-2 4 0 c0 3-4 5-4 5 s-4-2-4-5z" stroke={stroke} strokeWidth="1" fill={stroke} opacity=".3"/>
        <line x1="10" y1="22" x2="30" y2="10" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity=".3"/>
      </svg>
    ),
    'jewellery': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 14 q12-10 24 0" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none"/>
        <path d="M12 14 q-4 8 0 14 l12 10 l12-10 q4-6 0-14" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill={fill}/>
        <ellipse cx="24" cy="34" rx="4" ry="6" stroke={stroke} strokeWidth="1" fill={stroke} opacity=".2"/>
        <circle cx="24" cy="14" r="2" stroke={stroke} strokeWidth="1" fill={fill}/>
      </svg>
    ),
    'clothing': (
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M18 8 l-8 8 8 4 v20 h12 v-20 l8-4 -8-8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill={fill}/>
        <path d="M18 8 q3 4 6 0 q3 4 6 0" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill={fill}/>
        <path d="M18 20 q6 3 12 0" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity=".4"/>
        <path d="M18 26 q6 2 12 0" stroke={stroke} strokeWidth="1" strokeLinecap="round" opacity=".3"/>
      </svg>
    ),
  }

  return icons[slug] ?? (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="24" cy="24" r="14" stroke={stroke} strokeWidth={sw} fill={fill}/>
      <path d="M20 20 q4-6 8 0 q-4 6-8 0" stroke={stroke} strokeWidth="1" strokeLinecap="round"/>
    </svg>
  )
}
