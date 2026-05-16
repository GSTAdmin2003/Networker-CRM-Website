import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { timingSafeEqual, createHash } from 'crypto'
import { rateLimit } from '@/lib/rate-limit'

function safeCompare(a: string, b: string): boolean {
  const ba = createHash('sha256').update(a).digest()
  const bb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ba, bb)
}

const COOKIE = 'cms_session'
const MAX_AGE = 86400

function makeCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: MAX_AGE,
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts' }, { status: 429 })
  }

  const body = await req.json().catch(() => null) as Record<string, unknown> | null
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!process.env.CMS_SECRET || !safeCompare(password, process.env.CMS_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const store = await cookies()
  store.set(COOKIE, '1', makeCookieOptions())
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const store = await cookies()
  const session = store.get(COOKIE)
  if (session?.value === '1') return NextResponse.json({ ok: true })
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function DELETE() {
  const store = await cookies()
  store.delete(COOKIE)
  return NextResponse.json({ ok: true })
}
