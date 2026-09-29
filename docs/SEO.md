# SEO and crawler policy

The public site is served at the bare apex **https://networkercrm.ge** (`www` redirects to it; the CRM app is on
`crm.networkercrm.ge`). Everything below is derived from `lib/site.ts` — change `SITE_URL` there (or set
`NEXT_PUBLIC_SITE_URL` at build time) and every canonical URL, sitemap entry, social preview and structured-data
URL follows.

## What exists

| Piece | Where |
|---|---|
| `robots.txt` | `app/robots.ts` |
| `sitemap.xml` (with hreflang alternates for the home page) | `app/sitemap.ts` |
| Per-page title / description / canonical / Open Graph / Twitter | `pageMetadata()` in `lib/site.ts` |
| Site-wide defaults (robots meta, verification, applicationName) | `siteMetadata` in `lib/site.ts` |
| JSON-LD: Organization + WebSite (every page), SoftwareApplication (home) | `siteGraph()` / `softwareApplication()` |
| Social image | `app/opengraph-image.tsx` (English text — the edge renderer has no Georgian font) |
| `X-Robots-Tag: noindex` on `/api/*` | `next.config.ts` |

## Languages

Georgian is the default and owns `/`; English lives at `/en`. The language is decided **by the URL**, so the
server-rendered HTML (what crawlers read) always matches what a visitor on that URL sees, and each language has its
own `<html lang>` (two root layouts: `app/(ka)` and `app/(en)`). Both home URLs declare each other with
`hreflang` (+ `x-default` → `/`).

The language switch navigates between `/` and `/en` and remembers an **explicit** choice in
`localStorage['nwk-lang']`. It deliberately never guesses from `navigator.language`: crawlers report `en-US`, so a
guess would redirect Googlebot away from the Georgian page.

The legal pages (`/about`, `/privacy`, `/terms`) are one URL with an in-page language toggle; their server HTML and
metadata are Georgian.

## Crawler policy (`app/robots.ts`)

- Everyone may crawl everything except `/api/`. `/_next/` is **not** blocked — Google needs the JS/CSS to render.
- Search engines and AI answer engines (OAI-SearchBot, ChatGPT-User, PerplexityBot, …) are welcome: being found and
  recommended is the goal. Model-training crawlers (GPTBot, ClaudeBot, Google-Extended) are also allowed; to opt out
  of training, add them to `BLOCKED_BOTS`.
- SEO-tool scrapers and bulk bots (AhrefsBot, SemrushBot, MJ12bot, DotBot, Bytespider, CCBot, …) are disallowed.
- `robots.txt` is voluntary. It stops well-behaved bots only; it is not access control.

## After deploying (manual steps)

1. Google Search Console: add the property `https://networkercrm.ge`, submit `https://networkercrm.ge/sitemap.xml`,
   and use URL Inspection on `/` and `/en`.
2. Bing Webmaster Tools: import the site from Search Console and submit the same sitemap.
3. Check: `curl -s https://networkercrm.ge/robots.txt`, and paste `/` and `/en` into the Rich Results Test.

## Known limits

- The social image is English for both languages.
- The default Next.js 404 page has no site layout (so no `og:image` host); it is `noindex`, which is what matters.
- Metadata copy in Georgian was written to match the existing site strings; have a native speaker review it.
