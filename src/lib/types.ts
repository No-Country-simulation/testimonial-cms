export type Testimonial = {
  id: string
  name: string
  role: string | null
  company: string | null
  industry: string | null
  content: string
  rating: number
  avatarUrl: string | null
  imageUrl: string | null
  videoUrl: string | null
  youtubeVideoId: string | null
  cloudinaryPublicId: string | null
  category: 'PRODUCTO' | 'EVENTO' | 'CLIENTE' | 'INDUSTRIA'
  tags: string | null
  featured: boolean
  approved: boolean
  createdByRole: 'ADMIN' | 'EDITOR' | 'VISITOR'
  reviewedByRole: 'ADMIN' | 'EDITOR' | 'VISITOR' | null
  createdAt: Date | string
  updatedAt: Date | string
}

export type TestimonialFormData = {
  name: string
  role?: string
  company?: string
  industry?: string
  content: string
  rating: number
  avatarUrl?: string
  imageUrl?: string
  videoUrl?: string
  category: 'PRODUCTO' | 'EVENTO' | 'CLIENTE' | 'INDUSTRIA'
  tags?: string
  featured?: boolean
  approved?: boolean
}
