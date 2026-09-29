import type { Metadata, Viewport } from 'next'
import type { Lang } from '@/lib/i18n'

/**
 * Canonical origin of the public site. The marketing site is served at the
 * bare apex `networkercrm.ge` (www redirects to it; the CRM app lives on
 * `crm.networkercrm.ge`). Every canonical URL, sitemap entry, social preview
 * and structured-data URL is built from this ONE constant -- it used to be a
 * hard-coded `networker.ge` scattered through the layout, which is not this
 * site, so search engines were being told the canonical home is a domain that
 * does not serve it.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://networkercrm.ge').replace(/\/$/, '')

export const SITE_NAME = 'Networker CRM'
export const LEGAL_NAME = 'LLC Networker CRM'
export const LEGAL_NAME_KA = 'შპს ნეთვორქერ სი არ ემ'
export const LEGAL_ID = '404818293'
export const CONTACT_EMAIL = 'hello@networkercrm.ge'

/** Route for each language: Georgian is the default, so it owns `/`. */
export const LANG_PATH: Record<Lang, string> = { ka: '/', en: '/en' }

const OG_LOCALE: Record<Lang, string> = { ka: 'ka_GE', en: 'en_US' }

/**
 * `lastModified` for the sitemap. Deliberately fixed dates, not `new Date()`:
 * a lastmod that changes on every request teaches crawlers to ignore it. Bump a
 * page's date when its content really changes.
 */
export const LAST_MODIFIED = {
  home: '2026-09-29',
  legal: '2026-09-29',
} as const

/** Home page copy per language (title <= ~60 chars, description <= ~160). */
export const HOME_META: Record<Lang, { title: string; description: string }> = {
  ka: {
    title: 'Networker CRM — CRM ქართული გაყიდვების გუნდებისთვის',
    description:
      'ქართული SIP ნომერი, AI ყველა ზარზე, საერთო WhatsApp Inbox და Meta-დან ლიდების მიღება — ერთ პლატფორმაზე. $60 მომხმარებელზე თვეში, ყველაფერი შედის.',
  },
  en: {
    title: 'Networker CRM — AI-powered CRM for Georgian sales teams',
    description:
      'Georgian SIP number, AI on every call, shared WhatsApp inbox, and Meta lead capture. $60/user/month, everything included.',
  },
}

export function truncate(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

interface PageMetaInput {
  /** Path of this page, e.g. `/about`. */
  path: string
  title: string
  description: string
  lang?: Lang
  /** hreflang alternates (language -> path), for pages that exist in several languages. */
  languages?: Partial<Record<Lang | 'x-default', string>>
}

/**
 * Full metadata for one page. Next.js replaces (not merges) nested objects such
 * as `openGraph` and `alternates` when a page sets them, so each page must
 * state them completely -- this helper is the single place that does.
 */
export function pageMetadata({ path, title, description, lang = 'ka', languages }: PageMetaInput): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: path,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      locale: OG_LOCALE[lang],
      alternateLocale: [OG_LOCALE[lang === 'ka' ? 'en' : 'ka']],
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: HOME_META.en.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image'],
    },
  }
}

/** JSON-LD that is safe to inline: `<` is escaped so content can never close the script tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Site-wide entities (Organization + WebSite), emitted from the root layout. */
export function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        alternateName: [LEGAL_NAME_KA, 'Networker'],
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon.svg`,
        email: CONTACT_EMAIL,
        taxID: LEGAL_ID,
        address: { '@type': 'PostalAddress', addressLocality: 'Tbilisi', addressCountry: 'GE' },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: ['ka', 'en'],
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  }
}

/** The product, emitted on the home pages (per language). */
export function softwareApplication(lang: Lang) {
  const meta = HOME_META[lang]
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#product`,
    name: SITE_NAME,
    url: `${SITE_URL}${LANG_PATH[lang]}`,
    inLanguage: lang,
    description: meta.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '60',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '60',
        priceCurrency: 'USD',
        unitText: 'MONTH',
        referenceQuantity: { '@type': 'QuantitativeValue', value: '1', unitText: 'user' },
      },
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

/** Site-wide default metadata (both language layouts export this; pages override what they set). */
export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Pages set their own full title; this is the fallback and the template for
  // any page that only sets a short one.
  title: { default: HOME_META.ka.title, template: '%s — Networker CRM' },
  description: HOME_META.ka.description,
  applicationName: SITE_NAME,
  authors: [{ name: LEGAL_NAME }],
  creator: LEGAL_NAME,
  publisher: LEGAL_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  verification: {
    other: {
      'facebook-domain-verification': '3c8vlarmtr2p8inod94i1m52lgmon1',
    },
  },
}

export const siteViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D9488',
}
