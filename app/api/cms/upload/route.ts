import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { requireCMSAuth } from '../_auth'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function POST(req: NextRequest) {
  const deny = await requireCMSAuth()
  if (deny) return deny

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })

  const file = form.get('file') as File | null
  const slot = (form.get('slot') as string | null) ?? 'unknown'

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or GIF.' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum 5 MB.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${slot}-${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const supabase = createServerClient()
  const { error } = await supabase.storage
    .from('team-photos')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (error) {
    console.error('upload:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data } = supabase.storage.from('team-photos').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
