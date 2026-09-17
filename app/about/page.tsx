import type { Metadata } from 'next'
import { LegalPageShell } from '@/components/legal/LegalPageShell'
import { ABOUT_CONTENT } from '@/lib/legal-content'

export const metadata: Metadata = {
  title: 'About Networker',
  description: 'Who builds Networker CRM, and why.',
}

export default function AboutPage() {
  return <LegalPageShell content={ABOUT_CONTENT} />
}
