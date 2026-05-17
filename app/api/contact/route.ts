import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rate-limit'

const ALLOWED_INDUSTRIES = [
  'construction', 'real_estate', 'accounting_finance', 'retail',
  'marketing_advertising', 'wholesale_distribution', 'logistics',
  'it_technology', 'manufacturing', 'healthcare', 'legal', 'other',
]

const ALLOWED_POSITIONS = [
  'founder_owner', 'director', 'sales_manager', 'sales_rep', 'accountant', 'operations', 'other',
]

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json().catch(() => null) as Record<string, unknown> | null
  const phone = String(body?.phone ?? '').trim()
  const lang = String(body?.lang ?? 'en')

  if (!phone || phone.length > 30) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
  }

  const safeLang = lang === 'ka' ? 'ka' : 'en'

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({ phone, lang: safeLang })
    .select('id')
    .single()

  if (error || !data) {
    console.error('contact insert:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: data.id })
}

export async function PATCH(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip, 20, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json().catch(() => null) as Record<string, unknown> | null
  const id = String(body?.id ?? '').trim()

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const company_name    = String(body?.company_name ?? '').trim().slice(0, 255) || null
  const company_id      = String(body?.company_id ?? '').trim().slice(0, 255) || null
  const rep_name        = String(body?.rep_name ?? '').trim().slice(0, 255) || null
  const rawPosition     = String(body?.rep_position ?? '').trim()
  const rep_position    = ALLOWED_POSITIONS.includes(rawPosition) ? rawPosition : null
  const rep_email_raw = String(body?.rep_email ?? '').trim().toLowerCase().slice(0, 255)
  const rep_email = rep_email_raw || null
  if (rep_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rep_email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  const rawIndustry     = String(body?.industry ?? '').trim()
  const industry        = ALLOWED_INDUSTRIES.includes(rawIndustry) ? rawIndustry : null
  const industry_other  = String(body?.industry_other ?? '').trim().slice(0, 255) || null

  if (industry === 'other' && !industry_other) {
    return NextResponse.json({ error: 'Please specify your industry' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .update({
      company_name,
      company_id,
      rep_name,
      rep_position,
      rep_email,
      industry,
      industry_other: industry === 'other' ? industry_other : null,
    })
    .eq('id', id)
    .select('id')
    .single()

  if (error) {
    console.error('contact update:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
