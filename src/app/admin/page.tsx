import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'
import StarRating from '@/components/StarRating'
import type { Testimonial } from '@/lib/types'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q = '', category = '' } = await searchParams

  const testimonials = (await prisma.testimonial.findMany({
    where: {
      ...(category ? { category: category as 'PRODUCTO' | 'EVENTO' | 'CLIENTE' | 'INDUSTRIA' } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { role: { contains: q } },
              { company: { contains: q } },
              { industry: { contains: q } },
              { content: { contains: q } },
              { tags: { contains: q.toLowerCase() } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
  })) as Testimonial[]

  const total = testimonials.length
  const featured = testimonials.filter((t) => t.featured).length
  const approved = testimonials.filter((t) => t.approved).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona todos los testimonios</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
        >
          + Nuevo Testimonio
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-indigo-600">{total}</p>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">Total</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-yellow-500">{featured}</p>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">Destacados</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-green-500">{approved}</p>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-wide">Aprobados</p>
        </div>
      </div>

      <form className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por texto, tag, empresa..."
          className="md:col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
          Buscar
        </button>
      </form>

      {/* Table */}
      {testimonials.length === 0 ? (
        <div className="text-center py-24 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-lg font-medium mb-4">No hay testimonios todavía</p>
          <Link
            href="/admin/testimonials/new"
            className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Crear el primero →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">
                  Persona
                </th>
                <th className="text-left px-6 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">
                  Empresa
                </th>
                <th className="text-left px-6 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">
                  Categoría
                </th>
                <th className="text-left px-6 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">
                  Rating
                </th>
                <th className="text-left px-6 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">
                  Estado
                </th>
                <th className="text-right px-6 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{t.name}</p>
                    {t.role && <p className="text-gray-400 text-xs mt-0.5">{t.role}</p>}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{t.company || '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{t.category}</td>
                  <td className="px-6 py-4">
                    <StarRating rating={t.rating} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {t.featured && (
                        <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5 rounded-full border border-yellow-200">
                          ⭐ Destacado
                        </span>
                      )}
                      {t.approved ? (
                        <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200">
                          ✓ Aprobado
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full border border-red-200">
                          ✗ Pendiente
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/testimonials/${t.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                      >
                        Editar
                      </Link>
                      <DeleteButton id={t.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
