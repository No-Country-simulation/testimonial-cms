export function extractYouTubeVideoId(url: string | null | undefined) {
  if (!url) return null

  const cleanUrl = url.trim()
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

export function getYouTubeEmbedUrl(videoId: string | null | undefined) {
  if (!videoId) return null
  return `https://www.youtube.com/embed/${videoId}`
}

export function buildCloudinaryImageUrl(publicId: string | null | undefined) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  if (!cloudName || !publicId) return null
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_900/${publicId}`
}
