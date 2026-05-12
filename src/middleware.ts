// src/middleware.ts
// Protects /admin routes — only the owner email can access
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Simple in-memory rate limit (works decently for single region / basic bot protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  // 1. Rate Limiting for /join submissions
  if (request.method === 'POST' && request.nextUrl.pathname.startsWith('/join')) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown-ip'
    const now = Date.now()
    const windowMs = 60 * 60 * 1000 // 1 hour

    let record = rateLimitMap.get(ip)
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs }
    }

    record.count += 1
    rateLimitMap.set(ip, record)

    if (record.count > 3) {
      return NextResponse.json({ error: 'Too many submissions. Try again later.' }, { status: 429 })
    }
  }

  // 2. Auth for /admin
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Protect /admin — only the site owner is allowed in
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'craftersunitedin@gmail.com'
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session || session.user.email !== ADMIN_EMAIL) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/join'],
}
