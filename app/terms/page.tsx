import type { Metadata } from 'next'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { TERMS_CONTENT } from '@/lib/legal-content'

export const metadata: Metadata = {
  title: 'Terms and Conditions — Networker',
  description: 'The terms that govern use of the Networker CRM platform.',
}

export default function TermsPage() {
  return <LegalPageShell content={TERMS_CONTENT} />
}
