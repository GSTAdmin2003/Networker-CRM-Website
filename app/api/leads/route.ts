import { NextRequest, NextResponse } from 'next/server'
import { requireCMSAuth } from '@/app/api/cms/_auth'
import { createServerClient } from '@/lib/supabase-server'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function PATCH(req: NextRequest) {
  const authError = await requireCMSAuth()
  if (authError) return authError

  const body = await req.json().catch(() => null) as Record<string, unknown> | null
  const ids = body?.ids

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 })
  }
  if (ids.length > 500) {
    return NextResponse.json({ error: 'ids exceeds max 500' }, { status: 400 })
  }
  if (!ids.every((id) => typeof id === 'string' && UUID_RE.test(id))) {
    return NextResponse.json({ error: 'Invalid id in array' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { error } = await supabase
    .from('contact_messages')
    .update({ downloaded_at: new Date().toISOString() })
    .in('id', ids)
    .is('downloaded_at', null)

  if (error) {
    console.error('leads patch:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
