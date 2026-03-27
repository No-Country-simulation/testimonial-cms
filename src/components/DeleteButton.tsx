'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('¿Seguro que quieres eliminar este testimonio? Esta acción no se puede deshacer.')) return

    setLoading(true)
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('Error al eliminar el testimonio.')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-40 transition-colors"
    >
      {loading ? '...' : 'Eliminar'}
    </button>
  )
}
