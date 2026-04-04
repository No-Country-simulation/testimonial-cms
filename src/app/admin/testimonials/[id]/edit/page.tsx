import { prisma } from '@/lib/prisma'
import TestimonialForm from '@/components/TestimonialForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Testimonial } from '@/lib/types'

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const testimonial = (await prisma.testimonial.findUnique({
    where: { id },
  })) as Testimonial | null

  if (!testimonial) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-gray-400 hover:text-indigo-600 transition-colors">
          ← Volver al panel
        </Link>
      </div>
      <TestimonialForm
        testimonial={testimonial}
        canModerate={true}
        afterSubmitRedirectTo="/admin"
      />
    </div>
  )
}
