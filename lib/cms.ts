import { unstable_cache } from 'next/cache'
import { createServerClient } from './supabase-server'

export type CMSContent = Record<string, string>

export const fetchCMSContent = unstable_cache(
  async (): Promise<CMSContent> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('cms_content')
      .select('key, value')
    if (error || !data) return {}
    return Object.fromEntries(data.map((r) => [r.key, r.value]))
  },
  ['cms-content'],
  { tags: ['cms'], revalidate: 60 }
)
