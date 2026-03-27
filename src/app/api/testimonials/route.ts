import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractYouTubeVideoId } from '@/lib/media'

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const category = searchParams.get('category') || undefined
    const approvedParam = searchParams.get('approved')

    const where: Record<string, unknown> = {}
    if (approvedParam === 'true') where.approved = true
    if (approvedParam === 'false') where.approved = false
    if (category) where.category = category

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { role: { contains: q } },
        { company: { contains: q } },
        { industry: { contains: q } },
        { content: { contains: q } },
        { tags: { contains: q.toLowerCase() } },
      ]
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(testimonials)
  } catch {
    return NextResponse.json({ error: 'Error al obtener testimonios' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
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

    const youtubeVideoId = extractYouTubeVideoId(body.videoUrl)
    const canModerate = role === 'ADMIN'

    const testimonial = await prisma.testimonial.create({
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
        youtubeVideoId,
        cloudinaryPublicId: body.cloudinaryPublicId || null,
        category,
        tags: normalizeTags(body.tags),
        featured: canModerate ? Boolean(body.featured) : false,
        approved: canModerate ? Boolean(body.approved) : false,
        createdByRole: role,
        reviewedByRole: canModerate ? role : null,
      },
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear el testimonio' }, { status: 500 })
  }
}
