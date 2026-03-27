import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getYouTubeEmbedUrl, buildCloudinaryImageUrl } from '@/lib/media'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const tag = (searchParams.get('tag') || '').toLowerCase().trim()
    const q = (searchParams.get('q') || '').trim()
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || '20')))

    const where: Record<string, unknown> = { approved: true }
    if (category) where.category = category

    const orFilters: Record<string, unknown>[] = []
    if (tag) orFilters.push({ tags: { contains: tag } })
    if (q) {
      orFilters.push(
        { name: { contains: q } },
        { company: { contains: q } },
        { role: { contains: q } },
        { industry: { contains: q } },
        { content: { contains: q } },
        { tags: { contains: q.toLowerCase() } }
      )
    }

    if (orFilters.length > 0) {
      where.OR = orFilters
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    })

    const data = testimonials.map((testimonial) => ({
      ...testimonial,
      youtubeEmbedUrl: getYouTubeEmbedUrl(testimonial.youtubeVideoId),
      cloudinaryImageUrl:
        testimonial.cloudinaryPublicId && !testimonial.imageUrl
          ? buildCloudinaryImageUrl(testimonial.cloudinaryPublicId)
          : null,
    }))

    return NextResponse.json({
      data,
      meta: {
        total: data.length,
        category: category || null,
        tag: tag || null,
        query: q || null,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Error al consultar testimonios públicos' }, { status: 500 })
  }
}
