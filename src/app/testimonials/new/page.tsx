import Link from 'next/link'
import TestimonialForm from '@/components/TestimonialForm'
import { cookies } from 'next/headers'
import { ADMIN_AUTH_COOKIE, parseSessionToken } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function NewPublicTestimonialPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value
  const authSecret = process.env.AUTH_SECRET
  const session = authSecret ? await parseSessionToken(token, authSecret) : false

  if (!session) {
    redirect('/login')
  }

  const lockName = session.role === 'USER' && Boolean(session.username)
  const forcedName = lockName ? session.username : undefined

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">
          ← Volver al inicio
        </Link>
      </div>
      <div className="mb-6 rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-900">
        Para publicar una reseña debes iniciar sesión. Si aún no tienes cuenta, puedes crearla en{' '}
        <Link href="/login" className="font-medium underline">
          acceso y registro
        </Link>
        .
      </div>
      <TestimonialForm
        canModerate={false}
        afterSubmitRedirectTo="/"
        forcedName={forcedName}
        lockName={lockName}
      />
    </div>
  )
}
