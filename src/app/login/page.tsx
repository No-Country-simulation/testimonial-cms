'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const normalizedUsername = username.trim().toLowerCase()
    if (!normalizedUsername) {
      setError('Ingresa un nombre de usuario')
      return
    }

    if (mode === 'register') {
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres')
        return
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden')
        return
      }
    }

    setLoading(true)

    try {
      if (mode === 'register') {
        const registerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: normalizedUsername, password }),
        })

        if (!registerResponse.ok) {
          const registerPayload = (await registerResponse
            .json()
            .catch(() => null)) as { error?: string } | null
          setError(registerPayload?.error || 'No se pudo registrar el usuario')
          return
        }

        setSuccess('Usuario creado correctamente. Inicia sesión para publicar reseñas.')
        setMode('login')
        setPassword('')
        setConfirmPassword('')
        return
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalizedUsername, password }),
      })

      if (response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { role?: 'ADMIN' | 'EDITOR' | 'USER' }
          | null
        const role = payload?.role

        if (role === 'ADMIN' || role === 'EDITOR') {
          router.push('/admin')
        } else {
          router.push('/testimonials/new')
        }

        router.refresh()
        return
      }

      const payload = (await response.json().catch(() => null)) as { error?: string } | null
      setError(payload?.error || 'No se pudo iniciar sesión')
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso y registro</h1>
      <p className="text-sm text-gray-500 mb-4">
        Crea un usuario para dejar reseñas o ingresa como admin/editor.
      </p>

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setError('')
            setSuccess('')
          }}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === 'login' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600'
          }`}
        >
          Iniciar sesión
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register')
            setError('')
            setSuccess('')
          }}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === 'register' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-600'
          }`}
        >
          Registrarme
        </button>
      </div>

      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
        <p className="font-medium mb-1">Credenciales</p>
        <p>Admin/Editor: usan variables de entorno.</p>
        <p>Usuario de reseñas: créalo desde la pestaña Registrarme.</p>
        <p className="mt-1">
          Reglas del usuario: 3-24 caracteres, minúsculas, números y guion bajo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm text-gray-700 mb-1">
            Usuario
          </label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            autoComplete="username"
            placeholder="ej: maria_2026"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
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
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="••••••••"
          />
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="••••••••"
            />
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-2">{error}</p>
        )}
        {success && (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-2">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading
            ? mode === 'login'
              ? 'Ingresando...'
              : 'Creando usuario...'
            : mode === 'login'
              ? 'Ingresar'
              : 'Crear usuario'}
        </button>
      </form>
    </div>
  )
}
