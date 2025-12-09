import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/', '/auth', '/auth/']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow static and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next()
  }

  // Allow explicitly public paths
  if (PUBLIC_PATHS.includes(pathname) ) {
    return NextResponse.next()
  }

  // Check for token cookie
  const token = req.cookies.get('token')?.value
  if (!token) {
    const loginUrl = new URL('/auth', req.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token using `jose` (Edge-safe). Expect HS256 with shared secret.
  if (!process.env.JWT_SECRET) {
    console.error('middleware: JWT_SECRET not set')
    const loginUrl = new URL('/auth', req.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const encoder = new TextEncoder()
    await jwtVerify(token, encoder.encode(process.env.JWT_SECRET))
    // token valid
    return NextResponse.next()
  } catch (err) {
    // invalid or expired token
    const loginUrl = new URL('/auth', req.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  // Match all paths except Next internals, API routes and the favicon.
  // Keep the pattern simple to avoid Next's route-source parsing issues.
  matcher: ['/((?!_next|_next/static|_next/image|api|favicon.ico).*)'],
}
