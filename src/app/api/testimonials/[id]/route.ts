import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractYouTubeVideoId } from '@/lib/media'

type Params = { params: Promise<{ id: string }> }

function normalizeTags(value: string | undefined) {
  if (!value) return null
  const tags = value
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
  return tags.length ? Array.from(new Set(tags)).join(', ') : null
}

function getRoleFromHeaders(request: Request) {
  const headerValue = request.headers.get('x-user-role')
  if (headerValue === 'ADMIN' || headerValue === 'EDITOR') return headerValue
  return null
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params
    const testimonial = await prisma.testimonial.findUnique({ where: { id } })

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonio no encontrado' }, { status: 404 })
    }

    return NextResponse.json(testimonial)
  } catch {
    return NextResponse.json({ error: 'Error al obtener el testimonio' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await request.json()
    const role = getRoleFromHeaders(request)

    if (!role) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    if (!body.name || !body.content) {
      return NextResponse.json(
        { error: 'El nombre y el contenido son obligatorios' },
        { status: 400 }
      )
    }

    const category = ['PRODUCTO', 'EVENTO', 'CLIENTE', 'INDUSTRIA'].includes(body.category)
      ? body.category
      : 'CLIENTE'

    const canModerate = role === 'ADMIN'

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: body.name,
        role: body.role || null,
        company: body.company || null,
        industry: body.industry || null,
        content: body.content,
        rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
        avatarUrl: body.avatarUrl || null,
        imageUrl: body.imageUrl || null,
        videoUrl: body.videoUrl || null,
        youtubeVideoId: extractYouTubeVideoId(body.videoUrl),
        cloudinaryPublicId: body.cloudinaryPublicId || null,
        category,
        tags: normalizeTags(body.tags),
        featured: canModerate ? Boolean(body.featured) : false,
        approved: canModerate ? Boolean(body.approved) : false,
        reviewedByRole: canModerate ? role : null,
      },
    })

    return NextResponse.json(testimonial)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar el testimonio' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params
    await prisma.testimonial.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar el testimonio' }, { status: 500 })
  }
}
