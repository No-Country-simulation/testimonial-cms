import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractYouTubeVideoId } from '@/lib/media'
import { getSessionFromRequest } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

function normalizeTags(value: string | undefined) {
  if (!value) return null
  const tags = value
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
  return tags.length ? Array.from(new Set(tags)).join(', ') : null
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
    const session = await getSessionFromRequest(request)
    const role = session?.role

    if (!role) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const existing = await prisma.testimonial.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ error: 'Testimonio no encontrado' }, { status: 404 })
    }

    if (
      ('name' in body && !String(body.name || '').trim()) ||
      ('content' in body && !String(body.content || '').trim())
    ) {
      return NextResponse.json(
        { error: 'El nombre y el contenido son obligatorios' },
        { status: 400 }
      )
    }

    const category = ['PRODUCTO', 'EVENTO', 'CLIENTE', 'INDUSTRIA'].includes(body.category)
      ? body.category
      : existing.category

    const canModerate = role === 'ADMIN'
    const nextVideoUrl = 'videoUrl' in body ? body.videoUrl || null : existing.videoUrl

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: 'name' in body ? body.name : existing.name,
        role: 'role' in body ? body.role || null : existing.role,
        company: 'company' in body ? body.company || null : existing.company,
        industry: 'industry' in body ? body.industry || null : existing.industry,
        content: 'content' in body ? body.content : existing.content,
        rating:
          'rating' in body
            ? Math.min(5, Math.max(1, Number(body.rating) || 5))
            : existing.rating,
        avatarUrl: 'avatarUrl' in body ? body.avatarUrl || null : existing.avatarUrl,
        imageUrl: 'imageUrl' in body ? body.imageUrl || null : existing.imageUrl,
        videoUrl: nextVideoUrl,
        youtubeVideoId: extractYouTubeVideoId(nextVideoUrl),
        cloudinaryPublicId:
          'cloudinaryPublicId' in body
            ? body.cloudinaryPublicId || null
            : existing.cloudinaryPublicId,
        category,
        tags: 'tags' in body ? normalizeTags(body.tags) : existing.tags,
        featured:
          canModerate && 'featured' in body ? Boolean(body.featured) : existing.featured,
        approved:
          canModerate && 'approved' in body ? Boolean(body.approved) : existing.approved,
        reviewedByRole:
          canModerate && ('featured' in body || 'approved' in body)
            ? role
            : existing.reviewedByRole,
      },
    })

    return NextResponse.json(testimonial)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar el testimonio' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await getSessionFromRequest(_request)
    if (session?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo admin puede eliminar' }, { status: 403 })
    }

    const { id } = await params
    await prisma.testimonial.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar el testimonio' }, { status: 500 })
  }
}
