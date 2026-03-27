import { NextResponse } from 'next/server'
import { ADMIN_AUTH_COOKIE, createSessionToken, SessionRole } from '@/lib/auth'

const SESSION_TTL_SECONDS = 60 * 60 * 12

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const username = String(body?.username || '').toLowerCase()
    const password = String(body?.password || '')

    const adminPassword = process.env.ADMIN_PASSWORD
    const editorPassword = process.env.EDITOR_PASSWORD
    const authSecret = process.env.AUTH_SECRET

    if (!adminPassword || !editorPassword || !authSecret) {
      return NextResponse.json(
        { error: 'Faltan variables de entorno de autenticación' },
        { status: 500 }
      )
    }

    let role: SessionRole | null = null
    if (username === 'admin' && password === adminPassword) role = 'ADMIN'
    if (username === 'editor' && password === editorPassword) role = 'EDITOR'

    if (!role) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = await createSessionToken(authSecret, SESSION_TTL_SECONDS, role)

    const response = NextResponse.json({ ok: true, role })
    response.cookies.set({
      name: ADMIN_AUTH_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 })
  }
}
