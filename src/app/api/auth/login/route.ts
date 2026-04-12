import { NextResponse } from 'next/server'
import { ADMIN_AUTH_COOKIE, createSessionToken, SessionRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'

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
    let userId: string | undefined
    let sessionUsername: string | undefined

    if (username === 'admin' && password === adminPassword) role = 'ADMIN'
    if (username === 'editor' && password === editorPassword) role = 'EDITOR'

    if (!role) {
      const user = await prisma.user.findUnique({
        where: { username },
        select: { id: true, username: true, passwordHash: true },
      })

      if (user && verifyPassword(password, user.passwordHash)) {
        role = 'USER'
        userId = user.id
        sessionUsername = user.username
      }
    }

    if (!role) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = await createSessionToken(authSecret, SESSION_TTL_SECONDS, role, {
      userId,
      username: sessionUsername,
    })

    const response = NextResponse.json({ ok: true, role, username: sessionUsername })
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
