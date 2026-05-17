import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { LeadsTable, type Lead } from '@/components/leads/LeadsTable'

export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }

export default async function LeadsPage() {
  const store = await cookies()
  if (store.get('cms_session')?.value !== '1') {
    redirect('/?edit=1')
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, phone, company_name, company_id, rep_name, rep_position, rep_email, industry, industry_other, lang, created_at, downloaded_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('leads fetch:', error)
  }

  return (
    <main>
      <LeadsTable initialLeads={(data ?? []) as Lead[]} />
    </main>
  )
}
