import { prisma } from '@/lib/prisma'
import TestimonialCard from '@/components/TestimonialCard'
import Link from 'next/link'
import type { Testimonial } from '@/lib/types'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>
}) {
  const { q = '', category = '', tag = '' } = await searchParams

  const testimonials = (await prisma.testimonial.findMany({
    where: {
      approved: true,
      ...(category ? { category: category as 'PRODUCTO' | 'EVENTO' | 'CLIENTE' | 'INDUSTRIA' } : {}),
      ...((q || tag)
        ? {
            OR: [
              { name: { contains: q } },
              { role: { contains: q } },
              { company: { contains: q } },
              { industry: { contains: q } },
              { content: { contains: q } },
              { tags: { contains: (tag || q).toLowerCase() } },
            ],
          }
        : {}),
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })) as Testimonial[]

  const featured = testimonials.filter((t) => t.featured)
  const regular = testimonials.filter((t) => !t.featured)

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-14 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Lo que dicen nuestros{' '}
          <span className="text-indigo-600">clientes</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Testimonios reales de personas que confían en nosotros cada día.
        </p>
      </div>

      <div className="mb-6">
        <Link
          href="/testimonials/new"
          className="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          + Nuevo Testimonio
        </Link>
      </div>

      <form className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Búsqueda inteligente por contenido, empresa o tags"
          className="md:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <input
          name="tag"
          defaultValue={tag}
          placeholder="Tag (ej: bootcamp)"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          name="category"
          defaultValue={category}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">Todas las categorías</option>
          <option value="PRODUCTO">Producto</option>
          <option value="EVENTO">Evento</option>
          <option value="CLIENTE">Cliente</option>
          <option value="INDUSTRIA">Industria</option>
        </select>
        <button
          type="submit"
          className="md:col-span-4 justify-self-start bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          Aplicar filtros
        </button>
      </form>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <span>⭐</span> Testimonios Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      )}

      {/* All */}
      {regular.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Todos los Testimonios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {regular.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {testimonials.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">💬</p>
          <p className="text-xl font-medium mb-2">Aún no hay testimonios</p>
          <p className="text-sm mb-6">Comparte el primer testimonio para que el equipo lo revise y publique.</p>
          <Link
            href="/testimonials/new"
            className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Enviar Testimonio →
          </Link>
        </div>
      )}
    </div>
  )
}
