import Link from 'next/link'
import { cookies } from 'next/headers'
import LogoutButton from '@/components/LogoutButton'
import { ADMIN_AUTH_COOKIE } from '@/lib/auth'

export default async function Navbar() {
  const cookieStore = await cookies()
  const hasSession = Boolean(cookieStore.get(ADMIN_AUTH_COOKIE)?.value)

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <Link href="/" className="text-xl font-bold text-indigo-600 tracking-tight">
          💬 Testimonial CMS
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Vista pública
          </Link>
          {hasSession && (
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
              <Link
                href="/admin"
                className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Panel Admin
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
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
