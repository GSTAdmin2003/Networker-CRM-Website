import type { Metadata } from 'next'
import { pageMetadata, truncate } from '@/lib/site'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { TERMS_CONTENT } from '@/lib/legal-content'

// Server HTML is Georgian (the default language), so the metadata is too.
export const metadata: Metadata = pageMetadata({
  path: '/terms',
  lang: 'ka',
  title: `${TERMS_CONTENT.ka.title} — Networker CRM`,
  description: truncate(TERMS_CONTENT.ka.intro),
})

export default function TermsPage() {
  return <LegalPageShell content={TERMS_CONTENT} />
}
