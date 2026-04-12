import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

function isValidUsername(username: string) {
  return /^[a-z0-9_]{3,24}$/.test(username)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const username = String(body?.username || '').trim().toLowerCase()
    const password = String(body?.password || '')

    if (!isValidUsername(username)) {
      return NextResponse.json(
        {
          error:
            'El usuario debe tener 3-24 caracteres y usar solo letras minusculas, numeros o _',
        },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { username }, select: { id: true } })
    if (existing) {
      return NextResponse.json({ error: 'Ese nombre de usuario ya existe' }, { status: 409 })
    }

    await prisma.user.create({
      data: {
        username,
        passwordHash: hashPassword(password),
      },
      select: { id: true },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 })
  }
}
