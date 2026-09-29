import type { MetadataRoute } from 'next'
import { LANG_PATH, LAST_MODIFIED, SITE_URL } from '@/lib/site'

/** Absolute URL for a path; the home page is the bare origin, matching its canonical and hreflang. */
const abs = (path: string) => (path === '/' ? SITE_URL : `${SITE_URL}${path}`)

export default function sitemap(): MetadataRoute.Sitemap {
  // The home page exists in two languages at two URLs; each lists the other as
  // its alternate so search engines serve the right one.
  const homeAlternates = {
    languages: { ka: abs(LANG_PATH.ka), en: abs(LANG_PATH.en), 'x-default': abs(LANG_PATH.ka) },
  }
  return [
    {
      url: abs(LANG_PATH.ka),
      lastModified: LAST_MODIFIED.home,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: homeAlternates,
    },
    {
      url: abs(LANG_PATH.en),
      lastModified: LAST_MODIFIED.home,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: homeAlternates,
    },
    { url: abs('/about'), lastModified: LAST_MODIFIED.legal, changeFrequency: 'monthly', priority: 0.6 },
    { url: abs('/privacy'), lastModified: LAST_MODIFIED.legal, changeFrequency: 'yearly', priority: 0.3 },
    { url: abs('/terms'), lastModified: LAST_MODIFIED.legal, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
