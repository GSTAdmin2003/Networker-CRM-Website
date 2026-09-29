import type { Metadata } from 'next'
import { pageMetadata, truncate } from '@/lib/site'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { ABOUT_CONTENT } from '@/lib/legal-content'

// Server HTML is Georgian (the default language), so the metadata is too.
export const metadata: Metadata = pageMetadata({
  path: '/about',
  lang: 'ka',
  title: `${ABOUT_CONTENT.ka.title} — Networker CRM`,
  description: truncate(ABOUT_CONTENT.ka.intro),
})

export default function AboutPage() {
  return <LegalPageShell content={ABOUT_CONTENT} />
}
