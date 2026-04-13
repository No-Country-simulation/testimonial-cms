import type { Testimonial } from '@/lib/types'
import StarRating from './StarRating'

const categoryLabel: Record<Testimonial['category'], string> = {
  PRODUCTO: 'Producto',
  EVENTO: 'Evento',
  CLIENTE: 'Cliente',
  INDUSTRIA: 'Industria',
}

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial
}) {
  const initials = testimonial.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={`relative rounded-2xl border bg-slate-50/50 px-6 pb-6 pt-14 shadow-[0_20px_44px_rgba(15,23,42,0.15)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_28px_52px_rgba(15,23,42,0.2)] ${
        testimonial.featured ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-400'
      }`}
    >
      <div className="absolute -top-6 left-6">
        {testimonial.avatarUrl ? (
          <img
            src={testimonial.avatarUrl}
            alt={testimonial.name}
            className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-sm"
          />
        ) : (
          <div className="h-16 w-16 rounded-full border-4 border-white bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base shadow-sm">
            {initials}
          </div>
        )}
      </div>

      <div className="mb-2">
        <p className="text-2xl font-semibold text-gray-900 leading-tight">{testimonial.name}</p>
        {(testimonial.role || testimonial.company) && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {testimonial.role}
            {testimonial.role && testimonial.company && ' · '}
            {testimonial.company}
          </p>
        )}
      </div>

      <p className="text-lg leading-relaxed text-gray-700">&ldquo;{testimonial.content}&rdquo;</p>

      <div className="mt-4 flex items-end justify-between">
        <StarRating rating={testimonial.rating} size="sm" />
        <span className="select-none text-6xl leading-none text-slate-100">&rdquo;</span>
      </div>

      {testimonial.imageUrl && (
        <img
          src={testimonial.imageUrl}
          alt={`Imagen de ${testimonial.name}`}
          className="mt-4 h-40 w-full rounded-xl border border-gray-100 object-cover"
        />
      )}

      {testimonial.youtubeVideoId && (
        <iframe
          src={`https://www.youtube.com/embed/${testimonial.youtubeVideoId}`}
          title={`Video de ${testimonial.name}`}
          className="mt-4 h-40 w-full rounded-xl border border-gray-100"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
          {categoryLabel[testimonial.category]}
        </span>
        {testimonial.tags?.split(',').map((tag) => (
          <span
            key={tag}
            className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium"
          >
            #{tag.trim()}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {testimonial.featured && (
          <span className="self-start text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">
            ⭐ Destacado
          </span>
        )}
        {testimonial.authorUsername && (
          <span className="self-start text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">
            ✓ Acreditado: @{testimonial.authorUsername}
          </span>
        )}
      </div>
    </div>
  )
}
