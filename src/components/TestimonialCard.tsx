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
      className={`bg-white rounded-2xl p-6 shadow-sm border flex flex-col gap-4 ${
        testimonial.featured
          ? 'border-indigo-200 ring-2 ring-indigo-50'
          : 'border-gray-100'
      }`}
    >
      {/* Avatar + Info */}
      <div className="flex items-center gap-3">
        {testimonial.avatarUrl ? (
          <img
            src={testimonial.avatarUrl}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {initials}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900 leading-tight">{testimonial.name}</p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-xs text-gray-400 mt-0.5">
              {testimonial.role}
              {testimonial.role && testimonial.company && ' · '}
              {testimonial.company}
            </p>
          )}
        </div>
      </div>

      {/* Rating */}
      <StarRating rating={testimonial.rating} />

      {/* Content */}
      <p className="text-gray-700 leading-relaxed text-sm flex-1">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {testimonial.imageUrl && (
        <img
          src={testimonial.imageUrl}
          alt={`Imagen de ${testimonial.name}`}
          className="w-full h-40 object-cover rounded-xl border border-gray-100"
        />
      )}

      {testimonial.youtubeVideoId && (
        <iframe
          src={`https://www.youtube.com/embed/${testimonial.youtubeVideoId}`}
          title={`Video de ${testimonial.name}`}
          className="w-full h-40 rounded-xl border border-gray-100"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}

      <div className="flex flex-wrap gap-2">
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

      {/* Badge */}
      {testimonial.featured && (
        <span className="self-start text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">
          ⭐ Destacado
        </span>
      )}
    </div>
  )
}
