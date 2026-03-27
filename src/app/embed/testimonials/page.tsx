import { prisma } from '@/lib/prisma'
import TestimonialCard from '@/components/TestimonialCard'
import type { Testimonial } from '@/lib/types'

export default async function TestimonialsEmbedPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; limit?: string }>
}) {
  const { category = '', tag = '', limit = '6' } = await searchParams
  const take = Math.min(12, Math.max(1, Number(limit) || 6))

  const testimonials = (await prisma.testimonial.findMany({
    where: {
      approved: true,
      ...(category ? { category: category as 'PRODUCTO' | 'EVENTO' | 'CLIENTE' | 'INDUSTRIA' } : {}),
      ...(tag ? { tags: { contains: tag.toLowerCase() } } : {}),
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take,
  })) as Testimonial[]

  return (
    <div className="p-4 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((item) => (
          <TestimonialCard key={item.id} testimonial={item} />
        ))}
      </div>
    </div>
  )
}
