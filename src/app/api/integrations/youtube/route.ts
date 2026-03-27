import { NextResponse } from 'next/server'

function extractVideoId(urlOrId: string) {
  const value = urlOrId.trim()
  if (/^[\w-]{11}$/.test(value)) return value

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = value.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

export async function GET(request: Request) {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Falta YOUTUBE_API_KEY en entorno' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const video = searchParams.get('video')

  if (!video) {
    return NextResponse.json({ error: 'Parámetro video requerido' }, { status: 400 })
  }

  const videoId = extractVideoId(video)
  if (!videoId) {
    return NextResponse.json({ error: 'Video de YouTube inválido' }, { status: 400 })
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
    const response = await fetch(url, { next: { revalidate: 60 } })

    if (!response.ok) {
      return NextResponse.json({ error: 'No se pudo consultar YouTube API' }, { status: 502 })
    }

    const payload = await response.json()
    const item = payload.items?.[0]

    if (!item) {
      return NextResponse.json({ error: 'Video no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      videoId,
      title: item.snippet?.title || null,
      channelTitle: item.snippet?.channelTitle || null,
      publishedAt: item.snippet?.publishedAt || null,
      thumbnailUrl: item.snippet?.thumbnails?.high?.url || null,
      viewCount: item.statistics?.viewCount || null,
      likeCount: item.statistics?.likeCount || null,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    })
  } catch {
    return NextResponse.json({ error: 'Error en integración con YouTube' }, { status: 500 })
  }
}
