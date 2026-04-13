import Link from 'next/link'
import TestimonialForm from '@/components/TestimonialForm'
import { cookies } from 'next/headers'
import { ADMIN_AUTH_COOKIE, parseSessionToken } from '@/lib/auth'

export default async function NewPublicTestimonialPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value
  const authSecret = process.env.AUTH_SECRET
  const session = authSecret ? await parseSessionToken(token, authSecret) : false

  if (!session) {
    return (
      <div>
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">
            ← Volver al inicio
          </Link>
        </div>
        <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-900">
          Para publicar una reseña debes iniciar sesión. Si aún no tienes cuenta, puedes crearla en{' '}
          <Link href="/login?mode=register" className="font-medium underline">
            acceso y registro
          </Link>
          .
        </div>
        <div className="flex gap-3">
          <Link
            href="/login?mode=login"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/login?mode=register"
            className="bg-white text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    )
  }

  const lockName = session.role === 'USER' && Boolean(session.username)
  const forcedName = lockName ? session.username : undefined

  return (
    <div>
      <TestimonialForm
        canModerate={false}
        afterSubmitRedirectTo="/"
        forcedName={forcedName}
        lockName={lockName}
      />
    </div>
  )
}
