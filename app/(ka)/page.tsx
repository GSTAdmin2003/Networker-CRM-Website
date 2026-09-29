import type { Metadata } from 'next'
import LandingPage from '@/components/LandingPage'
import { HOME_META, LANG_PATH, SITE_URL, jsonLd, pageMetadata, softwareApplication } from '@/lib/site'

const TEAM_PHOTOS = {
  tsotne: '/team/tsotne.jpg',
  davit: '/team/davit.jpg',
  levan: '/team/levan.jpg',
}

// Georgian is the default language and owns `/`; the English version is `/en`.
export const metadata: Metadata = pageMetadata({
  path: LANG_PATH.ka,
  lang: 'ka',
  ...HOME_META.ka,
  languages: {
    ka: `${SITE_URL}${LANG_PATH.ka}`,
    en: `${SITE_URL}${LANG_PATH.en}`,
    'x-default': `${SITE_URL}${LANG_PATH.ka}`,
  },
})

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(softwareApplication('ka')) }} />
      <LandingPage photos={TEAM_PHOTOS} initialLang="ka" />
    </>
  )
}
