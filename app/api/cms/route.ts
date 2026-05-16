import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase-server'
import { sanitize } from '@/lib/sanitize'
import { requireCMSAuth } from './_auth'

export async function PATCH(req: NextRequest) {
  const deny = await requireCMSAuth()
  if (deny) return deny

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const rows = Object.entries(body as Record<string, string>)
    .filter(([, v]) => typeof v === 'string')
    .map(([key, value]) => ({
      key,
      value: sanitize(value),
      updated_at: new Date().toISOString(),
    }))

  if (rows.length === 0) return NextResponse.json({ ok: true })

  const supabase = createServerClient()
  const { error } = await supabase
    .from('cms_content')
    .upsert(rows, { onConflict: 'key' })

  if (error) {
    console.error('cms save:', error)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }

  revalidateTag('cms', { expire: 0 })
  return NextResponse.json({ ok: true })
}
