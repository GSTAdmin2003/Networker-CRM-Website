import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function requireCMSAuth(): Promise<NextResponse | null> {
  const store = await cookies()
  if (store.get('cms_session')?.value !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
