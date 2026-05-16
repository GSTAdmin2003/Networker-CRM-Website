import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import '@/app/globals.css'
import '@/styles/landing.css'

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-head',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Networker — All-in-one. AI-powered. CRM for Georgian sales teams.',
  description: 'Georgian SIP number, AI on every call, shared WhatsApp inbox, and Meta lead capture. $60/user/month, everything included.',
  openGraph: {
    title: 'Networker CRM',
    description: 'The CRM Georgian sales teams actually use.',
    url: 'https://networker.ge',
    siteName: 'Networker',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Networker CRM',
    description: 'The CRM Georgian sales teams actually use.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
