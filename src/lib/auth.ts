const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const ADMIN_AUTH_COOKIE = 'admin_auth'
export type SessionRole = 'ADMIN' | 'EDITOR' | 'USER'

type SessionPayload = {
  exp: number
  role: SessionRole
  userId?: string
  username?: string
}

type SessionIdentity = {
  userId?: string
  username?: string
}

function base64UrlEncode(input: string) {
  const bytes = encoder.encode(input)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function base64UrlDecode(input: string) {
  const padLength = (4 - (input.length % 4)) % 4
  const base64 = (input + '='.repeat(padLength)).replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return decoder.decode(bytes)
}

async function hmacSha256(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const bytes = new Uint8Array(signature)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

export async function createSessionToken(
  secret: string,
  ttlSeconds: number,
  role: SessionRole,
  identity: SessionIdentity = {}
) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds
  const payload = JSON.stringify({ exp, role, ...identity } satisfies SessionPayload)
  const payloadEncoded = base64UrlEncode(payload)
  const signature = await hmacSha256(secret, payloadEncoded)
  return `${payloadEncoded}.${signature}`
}

export async function parseSessionToken(token: string | undefined, secret: string) {
  if (!token) return false

  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [payloadEncoded, signature] = parts
  const expectedSignature = await hmacSha256(secret, payloadEncoded)
  if (signature !== expectedSignature) return false

  try {
    const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as SessionPayload
    if (!payload.exp || !payload.role) return false
    if (payload.exp <= Math.floor(Date.now() / 1000)) return false
    if (payload.role !== 'ADMIN' && payload.role !== 'EDITOR' && payload.role !== 'USER') {
      return false
    }
    if (payload.role === 'USER' && (!payload.userId || !payload.username)) return false
    return payload
  } catch {
    return false
  }
}

export async function verifySessionToken(token: string | undefined, secret: string) {
  const payload = await parseSessionToken(token, secret)
  return Boolean(payload)
}

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return undefined

  const cookies = cookieHeader.split(';')
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split('=')
    if (key === name) return rest.join('=')
  }

  return undefined
}

export async function getSessionFromRequest(request: Request) {
  const roleHeader = request.headers.get('x-user-role')
  const userIdHeader = request.headers.get('x-user-id')
  const usernameHeader = request.headers.get('x-user-username')

  if (roleHeader === 'ADMIN' || roleHeader === 'EDITOR') {
    return {
      role: roleHeader,
      exp: Number.MAX_SAFE_INTEGER,
      userId: userIdHeader || undefined,
      username: usernameHeader || undefined,
    }
  }

  if (roleHeader === 'USER' && userIdHeader && usernameHeader) {
    return {
      role: 'USER' as const,
      exp: Number.MAX_SAFE_INTEGER,
      userId: userIdHeader,
      username: usernameHeader,
    }
  }

  const authSecret = process.env.AUTH_SECRET
  if (!authSecret) return false

  const token = getCookieValue(request.headers.get('cookie'), ADMIN_AUTH_COOKIE)
  return parseSessionToken(token, authSecret)
}