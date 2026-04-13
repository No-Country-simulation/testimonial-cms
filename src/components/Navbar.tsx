import Link from 'next/link'
import { cookies } from 'next/headers'
import LogoutButton from '@/components/LogoutButton'
import { ADMIN_AUTH_COOKIE, parseSessionToken } from '@/lib/auth'

export default async function Navbar() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value
  const authSecret = process.env.AUTH_SECRET
  const session = authSecret ? await parseSessionToken(token, authSecret) : false

  const hasSession = Boolean(session)
  const isAdminAreaUser = Boolean(
    session && (session.role === 'ADMIN' || session.role === 'EDITOR')
  )

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <Link href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
          💬 Testimonial CMS
        </Link>
        <div className="flex items-center gap-4">
          {isAdminAreaUser && (
            <>
              <Link
                href="/docs/api"
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                API Docs
              </Link>
              <Link
                href="/demo/integration"
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Demo Embed
              </Link>
            </>
          )}

          {hasSession ? (
            <>
              {isAdminAreaUser ? (
                <Link
                  href="/admin"
                  className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Panel Admin
                </Link>
              ) : (
                <Link
                  href="/testimonials/new"
                  className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Nueva reseña
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login?mode=login"
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
