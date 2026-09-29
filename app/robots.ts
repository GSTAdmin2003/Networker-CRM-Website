import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * Crawler policy for the public marketing site.
 *
 * - Everyone may crawl the pages; only the API routes are off limits (they are
 *   form endpoints, not content, and never useful in a search index).
 *   `/_next/` is intentionally NOT blocked: Google needs the JS and CSS to
 *   render the page.
 * - Search engines and AI answer engines (OAI-SearchBot, ChatGPT-User,
 *   PerplexityBot, ...) are welcome: for a B2B product, being found and
 *   recommended is the point. Model-training crawlers (GPTBot, ClaudeBot,
 *   Google-Extended) are allowed too; to opt out of training, add them to
 *   BLOCKED_BOTS below.
 * - Bandwidth-only crawlers -- SEO-tool scrapers and aggressive bulk bots --
 *   are blocked. robots.txt is voluntary, so this only stops well-behaved
 *   bots; it is a courtesy signal, not security.
 */
const BLOCKED_BOTS = [
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'BLEXBot',
  'DataForSeoBot',
  'serpstatbot',
  'MegaIndex',
  'Barkrowler',
  'PetalBot',
  'Bytespider',
  'CCBot',
  'ImagesiftBot',
  'Amazonbot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: BLOCKED_BOTS, disallow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
