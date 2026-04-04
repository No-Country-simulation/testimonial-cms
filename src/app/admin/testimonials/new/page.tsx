import TestimonialForm from '@/components/TestimonialForm'
import Link from 'next/link'

export default function NewTestimonialPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">
          ← Volver al panel
        </Link>
      </div>
      <TestimonialForm canModerate={true} afterSubmitRedirectTo="/admin" />
    </div>
  )
}
