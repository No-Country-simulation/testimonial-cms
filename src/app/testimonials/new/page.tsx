import Link from 'next/link'
import TestimonialForm from '@/components/TestimonialForm'

export default function NewPublicTestimonialPage() {
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
      <TestimonialForm canModerate={false} afterSubmitRedirectTo="/" />
    </div>
  )
}
