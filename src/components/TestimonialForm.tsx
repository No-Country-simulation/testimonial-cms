'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Testimonial } from '@/lib/types'

type Props = {
  testimonial?: Testimonial
  canModerate?: boolean
  afterSubmitRedirectTo?: string
}

export default function TestimonialForm({
  testimonial,
  canModerate = true,
  afterSubmitRedirectTo = '/admin',
}: Props) {
  const router = useRouter()
  const isEditing = !!testimonial

  const [form, setForm] = useState({
    name: testimonial?.name ?? '',
    role: testimonial?.role ?? '',
    company: testimonial?.company ?? '',
    industry: testimonial?.industry ?? '',
    content: testimonial?.content ?? '',
    rating: testimonial?.rating ?? 5,
    avatarUrl: testimonial?.avatarUrl ?? '',
    imageUrl: testimonial?.imageUrl ?? '',
    videoUrl: testimonial?.videoUrl ?? '',
    category: testimonial?.category ?? 'CLIENTE',
    tags: testimonial?.tags ?? '',
    featured: testimonial?.featured ?? false,
    approved: testimonial?.approved ?? false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const url = isEditing
      ? `/api/testimonials/${testimonial.id}`
      : '/api/testimonials'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      })

      if (res.ok) {
        router.push(afterSubmitRedirectTo)
        router.refresh()
        return
      }

      const payload = (await res.json().catch(() => null)) as { error?: string } | null
      if (res.status === 401) {
        setError('Tu sesión expiró. Inicia sesión nuevamente para guardar cambios.')
        router.push('/login')
        return
      }

      setError(payload?.error || 'Ocurrió un error al guardar el testimonio. Inténtalo de nuevo.')
    } catch {
      setError('No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? '✏️ Editar Testimonio' : '✨ Nuevo Testimonio'}
      </h2>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Nombre + Cargo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Ana García"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="CEO, Diseñadora..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
      </div>

      {/* Empresa + Avatar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Mi Empresa S.A."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL del Avatar</label>
          <input
            name="avatarUrl"
            value={form.avatarUrl}
            onChange={handleChange}
            placeholder="https://ejemplo.com/foto.jpg"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
      </div>

      {/* Industria + Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industria</label>
          <input
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="Edtech, SaaS, Salud..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            name="category"
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                category: event.target.value as 'PRODUCTO' | 'EVENTO' | 'CLIENTE' | 'INDUSTRIA',
              }))
            }
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          >
            <option value="PRODUCTO">Producto</option>
            <option value="EVENTO">Evento</option>
            <option value="CLIENTE">Cliente</option>
            <option value="INDUSTRIA">Industria</option>
          </select>
        </div>
      </div>

      {/* Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (Cloudinary/URL)</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://res.cloudinary.com/..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Video (YouTube URL)</label>
          <input
            name="videoUrl"
            value={form.videoUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="bootcamp, ux, empleabilidad"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
        />
        <p className="text-xs text-gray-400 mt-1">Separados por comas para búsqueda inteligente.</p>
      </div>

      {/* Testimonio */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Testimonio <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Escribe el testimonio aquí..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition resize-none"
        />
      </div>

      {/* Rating */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
              className={`text-2xl transition-transform hover:scale-110 ${
                star <= form.rating ? 'text-yellow-400' : 'text-gray-200'
              }`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-400 self-center">{form.rating}/5</span>
        </div>
      </div>

      {canModerate ? (
        <>
          <div className="flex gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-indigo-600"
              />
              <span className="text-sm text-gray-700">⭐ Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="approved"
                checked={form.approved}
                onChange={handleChange}
                className="w-4 h-4 accent-green-600"
              />
              <span className="text-sm text-gray-700">✓ Aprobado</span>
            </label>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            Moderación: las publicaciones de editores quedan pendientes hasta revisión de admin.
          </p>
        </>
      ) : (
        <p className="text-xs text-gray-500 mb-6 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Tu testimonio quedará pendiente hasta que un admin lo apruebe.
        </p>
      )}

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium text-sm"
        >
          {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Testimonio'}
        </button>
        <button
          type="button"
          onClick={() => router.push(afterSubmitRedirectTo)}
          className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
