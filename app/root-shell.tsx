import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import '@/app/globals.css'
import '@/styles/landing.css'
import type { Lang } from '@/lib/i18n'
import { jsonLd, siteGraph } from '@/lib/site'

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

/**
 * The document shell shared by every route. The site has TWO root layouts (one
 * per language, see `app/(ka)` and `app/(en)`) so the server-rendered
 * `<html lang>` is correct for each URL: crawlers, screen readers and browser
 * translation prompts all read it before any JavaScript runs.
 */
export function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={lang} className={`${jakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph()) }} />
        {children}
      </body>
    </html>
  )
}
