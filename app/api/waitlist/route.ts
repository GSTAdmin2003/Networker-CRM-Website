import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const email = (body?.email ?? '').trim().toLowerCase()
  const role = body?.role ?? ''
  const lang = body?.lang ?? 'en'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (!role) {
    return NextResponse.json({ error: 'Role required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { error } = await supabase.from('waitlist_entries').insert({ email, role, lang })
  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ ok: true })
    }
    console.error('waitlist insert:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
