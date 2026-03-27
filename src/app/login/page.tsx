'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState<'admin' | 'editor'>('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      router.push('/admin')
      router.refresh()
      return
    }

    const payload = (await response.json().catch(() => null)) as { error?: string } | null
    setLoading(false)
    setError(payload?.error || 'No se pudo iniciar sesión')
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso al panel</h1>
      <p className="text-sm text-gray-500 mb-4">Ingresa con rol admin o editor.</p>

      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
        <p className="font-medium mb-1">Credenciales</p>
        <p>Usuario: <strong>admin</strong> o <strong>editor</strong></p>
        <p>Contraseña: revisa las variables <strong>ADMIN_PASSWORD</strong> y <strong>EDITOR_PASSWORD</strong> en tu archivo .env</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm text-gray-700 mb-1">
            Usuario
          </label>
          <select
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value as 'admin' | 'editor')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="admin">admin</option>
            <option value="editor">editor</option>
          </select>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
