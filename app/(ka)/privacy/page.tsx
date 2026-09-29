import type { Metadata } from 'next'
import { pageMetadata, truncate } from '@/lib/site'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { PRIVACY_CONTENT } from '@/lib/legal-content'

// Server HTML is Georgian (the default language), so the metadata is too.
export const metadata: Metadata = pageMetadata({
  path: '/privacy',
  lang: 'ka',
  title: `${PRIVACY_CONTENT.ka.title} — Networker CRM`,
  description: truncate(PRIVACY_CONTENT.ka.intro),
})

export default function PrivacyPage() {
  return <LegalPageShell content={PRIVACY_CONTENT} />
}
