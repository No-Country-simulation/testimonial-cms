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
      <TestimonialForm canModerate={false} afterSubmitRedirectTo="/" />
    </div>
  )
}
