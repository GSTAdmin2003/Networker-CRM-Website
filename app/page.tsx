import { fetchCMSContent } from '@/lib/cms'
import { createServerClient } from '@/lib/supabase-server'
import LandingPage from '@/components/LandingPage'

async function getTeamPhotos(): Promise<{ tsotne: string | null; davit: string | null; levan: string | null }> {
  try {
    const supabase = createServerClient()
    const slots = ['tsotne', 'davit', 'levan'] as const
    const results = await Promise.all(
      slots.map(async (name) => {
        const { data } = await supabase.storage
          .from('team-photos')
          .list('', { search: `team-${name}` })
        if (!data?.length) return [name, null] as const
        const latest = [...data].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))[0]
        const { data: u } = supabase.storage.from('team-photos').getPublicUrl(latest.name)
        return [name, u.publicUrl] as const
      })
    )
    return Object.fromEntries(results) as { tsotne: string | null; davit: string | null; levan: string | null }
  } catch {
    return { tsotne: null, davit: null, levan: null }
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const params = await searchParams
  const cmsMode = params.edit === '1'
  const [cmsContent, photos] = await Promise.all([fetchCMSContent(), getTeamPhotos()])
  return <LandingPage cmsContent={cmsContent} cmsMode={cmsMode} photos={photos} />
}
