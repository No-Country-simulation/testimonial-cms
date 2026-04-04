import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_AUTH_COOKIE, parseSessionToken } from '@/lib/auth'

async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get(ADMIN_AUTH_COOKIE)?.value
  const authSecret = process.env.AUTH_SECRET

  if (!authSecret) return false
  return parseSessionToken(token, authSecret)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await isAuthenticated(request)
  const authenticated = Boolean(session)

  if (pathname.startsWith('/admin') && !authenticated) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (
    pathname.startsWith('/api/testimonials') &&
    request.method !== 'GET' &&
    request.method !== 'POST' &&
    !authenticated
  ) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  if (pathname.startsWith('/api/integrations') && !authenticated) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  if (
    pathname.startsWith('/api/testimonials') &&
    request.method === 'DELETE' &&
    session &&
    session.role !== 'ADMIN'
  ) {
    return NextResponse.json({ error: 'Solo admin puede eliminar' }, { status: 403 })
  }

  if (session) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-role', session.role)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/testimonials/:path*', '/api/integrations/:path*'],
}
