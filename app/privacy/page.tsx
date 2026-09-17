import type { Metadata } from 'next'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { PRIVACY_CONTENT } from '@/lib/legal-content'

export const metadata: Metadata = {
  title: 'Privacy Policy — Networker',
  description: 'What Networker CRM collects, why, and what control you have over it.',
}

export default function PrivacyPage() {
  return <LegalPageShell content={PRIVACY_CONTENT} />
}
