'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      router.replace('/')
      router.refresh()
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm text-gray-600 hover:text-red-600 transition-colors"
    >
      Cerrar sesión
    </button>
  )
}
