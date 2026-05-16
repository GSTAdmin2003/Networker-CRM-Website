import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json().catch(() => null) as Record<string, unknown> | null
  const name = String(body?.name ?? '').trim()
  const email = String(body?.email ?? '').trim().toLowerCase()
  const message = String(body?.message ?? '').trim()
  const lang = String(body?.lang ?? 'en')

  if (!name || name.length > 120) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (!message || message.length < 5 || message.length > 2000) {
    return NextResponse.json({ error: 'Message required (5–2000 characters)' }, { status: 400 })
  }

  const safeLang = lang === 'ka' ? 'ka' : 'en'

  const supabase = createServerClient()
  const { error } = await supabase.from('contact_messages').insert({ name, email, message, lang: safeLang })
  if (error) {
    console.error('contact insert:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
