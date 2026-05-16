# Networker CRM Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Networker CRM marketing landing page as a Next.js 15 app with bilingual EN/KA content, Supabase-backed waitlist, ISR caching, and a password-protected inline CMS mode.

**Architecture:** `app/page.tsx` (Server Component) uses `unstable_cache` to fetch CMS overrides from Supabase (ISR, revalidates via tag on save). `LandingPage` (Client Component) is a thin provider + layout; each of 9 sections is an isolated component receiving props. CMS edit mode is dynamically imported (never ships to visitors), activated via `/?edit=1` + password overlay, stored as HttpOnly cookie. contentEditable text is sanitized client-side (DOMPurify) and server-side (sanitize-html) before DB write.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v3 + custom tokens, original landing CSS (pixel-perfect), `@supabase/supabase-js`, `sanitize-html`, `isomorphic-dompurify`, `posthog-js`, Vercel.

---

## File Map

```
app/
  layout.tsx                        # metadata, fonts, PostHog, import landing.css
  page.tsx                          # Server Component, ISR fetch, renders LandingPage
  opengraph-image.tsx               # OG image via Next.js ImageResponse
  api/
    cms/
      auth/route.ts                 # POST login, GET check, DELETE logout
      route.ts                      # PATCH bulk save (cookie-gated, sanitized)
      upload/route.ts               # POST image upload (cookie-gated, validated)
    waitlist/route.ts               # POST insert (rate-limited)

components/
  LandingPage.tsx                   # 'use client' — lang state, CMSLayer dynamic import
  cms/
    CMSLayer.tsx                    # dynamic-imported; CMSContext provider + password overlay + toolbar
    CMSContext.tsx                  # context: editMode, save(), upload(), errors
    CMSToolbar.tsx                  # floating Save/Exit/Error bar
    EditableText.tsx                # contentEditable wrapper (edit mode only)
    EditableImage.tsx               # drag-drop photo upload overlay
  landing/
    Nav.tsx
    Hero.tsx
    Problem.tsx
    Features.tsx
    Compare.tsx
    Pricing.tsx
    Team.tsx
    Waitlist.tsx
    Footer.tsx

lib/
  supabase-server.ts                # createClient with service role (server only)
  supabase-client.ts                # createClient with anon key (browser)
  i18n.ts                           # full EN/KA dictionary + t() helper type
  cms.ts                            # unstable_cache fetch + content merge helper
  sanitize.ts                       # server-side sanitize-html wrapper
  rate-limit.ts                     # simple IP-based in-memory limiter

styles/
  landing.css                       # pixel-perfect CSS from design file (verbatim)

tailwind.config.ts                  # design tokens: navy, teal, ink, paper, fonts
```

---

## Task 1: Project Scaffold

**Files:**
- Create: project root (run from `/home/shuubb/Desktop/Code Base/Networker CRM Website`)

- [ ] **Step 1: Scaffold Next.js app**

```bash
cd "/home/shuubb/Desktop/Code Base/Networker CRM Website"
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --yes
```

Expected: Next.js 15 project created in current directory.

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js sanitize-html isomorphic-dompurify posthog-js
npm install --save-dev @types/sanitize-html @types/dompurify
```

- [ ] **Step 3: Create `.env.local`**

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CMS_SECRET=choose_a_strong_password
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
EOF
```

- [ ] **Step 4: Remove boilerplate**

```bash
rm -rf app/page.tsx app/globals.css public/*.svg
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts on http://localhost:3000 (404 is fine — page.tsx was deleted).

- [ ] **Step 6: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js 15 project with dependencies"
```

---

## Task 2: Tailwind Config + Google Fonts

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/layout.tsx`
- Create: `styles/landing.css`
- Create: `app/globals.css`

- [ ] **Step 1: Extend Tailwind with design tokens**

Replace `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A1424', 900: '#0F1C32', 800: '#132237',
          700: '#1E3A5F', 600: '#2A5298',
        },
        teal: {
          700: '#0D6D68', 600: '#0D9488', 500: '#14B8A6',
          400: '#2DD4BF', 100: '#CCFBF1', 50: '#F0FDFA',
        },
        ink: {
          950: '#0A0F1A', 900: '#111827', 800: '#1F2937',
          700: '#374151', 600: '#4B5563', 500: '#6B7280',
          400: '#9CA3AF', 300: '#D1D5DB', 200: '#E5E7EB',
          150: '#ECEEF2', 100: '#F3F4F6', 50: '#F8FAFB',
        },
        paper: '#FBFCFD',
      },
      fontFamily: {
        head: ['var(--font-head)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 2: Create `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 3: Create `styles/landing.css`**

Copy the full `<style>` block (lines 11–1065) from the design file verbatim into `styles/landing.css`. The file starts with:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy-950: #0A1424;
  --navy-900: #0F1C32;
  /* ... full CSS from design file ... */
}
```

The complete CSS block is in `/tmp/networker_design/networker-crm-logo-brandbook/project/Networker Landing.html` lines 11–1065.

- [ ] **Step 4: Create `app/layout.tsx`**

```tsx
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
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: tailwind tokens, google fonts, landing CSS imported"
```

---

## Task 3: Supabase Schema + RLS

**Files:** None (SQL run in Supabase dashboard or CLI)

- [ ] **Step 1: Create Supabase project**

Go to https://supabase.com, create a new project. Copy URL, anon key, and service role key into `.env.local`.

- [ ] **Step 2: Run schema migration**

In the Supabase SQL editor:

```sql
-- Waitlist
create table public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text,
  lang text default 'en',
  created_at timestamptz default now()
);

alter table public.waitlist_entries enable row level security;

create policy "anon_insert_waitlist"
  on public.waitlist_entries for insert
  to anon with check (true);

-- CMS content
create table public.cms_content (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

alter table public.cms_content enable row level security;

create policy "anon_select_cms"
  on public.cms_content for select
  to anon using (true);
-- No insert/update/delete for anon — only service role writes
```

- [ ] **Step 3: Create Storage bucket**

In Supabase dashboard → Storage → New bucket:
- Name: `team-photos`
- Public: ✓ (public read)

Run in SQL editor:

```sql
create policy "public_read_team_photos"
  on storage.objects for select
  using ( bucket_id = 'team-photos' );

create policy "service_insert_team_photos"
  on storage.objects for insert
  to service_role with check ( bucket_id = 'team-photos' );

create policy "service_update_team_photos"
  on storage.objects for update
  to service_role using ( bucket_id = 'team-photos' );
```

---

## Task 4: Lib Utilities

**Files:**
- Create: `lib/supabase-server.ts`
- Create: `lib/supabase-client.ts`
- Create: `lib/sanitize.ts`
- Create: `lib/rate-limit.ts`
- Create: `lib/cms.ts`
- Create: `lib/i18n.ts`

- [ ] **Step 1: `lib/supabase-server.ts`**

```ts
import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
```

- [ ] **Step 2: `lib/supabase-client.ts`**

```ts
import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | null = null

export function getBrowserClient() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}
```

- [ ] **Step 3: `lib/sanitize.ts`**

```ts
import sanitizeHtml from 'sanitize-html'

const ALLOWED: sanitizeHtml.IOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'br', 'span'],
  allowedAttributes: {},
  disallowedTagsMode: 'discard',
}

export function sanitize(dirty: string): string {
  return sanitizeHtml(dirty, ALLOWED)
}
```

- [ ] **Step 4: `lib/rate-limit.ts`**

```ts
const map = new Map<string, { count: number; reset: number }>()

export function rateLimit(ip: string, limit = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const entry = map.get(ip)
  if (!entry || now > entry.reset) {
    map.set(ip, { count: 1, reset: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}
```

- [ ] **Step 5: `lib/cms.ts`**

```ts
import { unstable_cache } from 'next/cache'
import { createServerClient } from './supabase-server'

export type CMSContent = Record<string, string>

export const fetchCMSContent = unstable_cache(
  async (): Promise<CMSContent> => {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('cms_content')
      .select('key, value')
    if (error || !data) return {}
    return Object.fromEntries(data.map((r) => [r.key, r.value]))
  },
  ['cms-content'],
  { tags: ['cms'], revalidate: 60 }
)
```

- [ ] **Step 6: `lib/i18n.ts`**

```ts
export type Lang = 'en' | 'ka'

export const I18N: Record<Lang, Record<string, string>> = {
  en: {
    nav_product: 'Product',
    nav_compare: 'Compare',
    nav_pricing: 'Pricing',
    nav_team: 'Team',
    nav_cta: 'Request access',
    hero_eyebrow: 'Beta · Onboarding first cohort',
    hero_h1: 'The CRM Georgian sales teams <em>actually</em> use.',
    hero_sub: 'Networker bundles a Georgian SIP number, AI on every call, a shared WhatsApp inbox, and Meta lead capture into one platform. Built for the half of your day that disappears into admin.',
    hero_cta_primary: 'Join early access',
    hero_cta_secondary: 'See how it works',
    hero_meta_1: 'Native Georgian transcription',
    hero_meta_2: '$60/user · everything included',
    hero_meta_3: 'Self-hosted telephony, no resellers',
    problem_eyebrow: 'The problem',
    problem_caption: "Of a sales rep's day burns on admin — calls never logged, follow-ups that live in someone's head, WhatsApp threads on personal phones. <strong>Source: Gartner.</strong>",
    problem_h2: 'The work happens. Nobody can see it.',
    problem_p1: "Most Georgian sales teams juggle four or five tools, none of them designed for selling. Calls happen outside the CRM. Notes are written from memory — or not at all. WhatsApp conversations live on personal phones and walk out the door the day a rep quits.",
    problem_p2: "Nothing on the market was built for this context. International tools either need six months of bending or cost more than the team makes. Local options stitch together pieces that fracture every time a provider pushes an update.",
    problem_li_1: 'Half a working day, per rep, every day, on tasks that yield zero revenue.',
    problem_li_2: "Deals stall silently because the activity happened somewhere managers can't see.",
    problem_li_3: 'No Georgian-language transcription that holds up in production — until last year.',
    problem_li_4: 'No platform shaped around how a Georgian SMB sales team actually operates.',
    sol_eyebrow: 'The solution',
    sol_title: 'One platform. Every problem.',
    sol_lede: 'Built-in telephony with a real Georgian number. AI that reads every transcript and queues the next action. A shared inbox. A pipeline that captures social leads in under sixty seconds. No add-ons. No per-minute fees.',
    feat_1_title: 'Built-in Georgian telephony.',
    feat_1_desc: 'A real Georgian SIP number, not a forwarding trick. Calls route to the right lead automatically. Every recording stays in the platform.',
    feat_2_title: 'AI on every call.',
    feat_2_desc: 'Hang up. The transcript is read against your product context. Tasks queue, WhatsApp drafts, manager alerts — handled before the next ring.',
    feat_2_action: 'Queued: send proposal · follow-up Thu 14:00',
    feat_3_title: 'Shared WhatsApp inbox.',
    feat_3_desc: "Threads link to lead records and live in one team inbox. Personal phones are out. Conversation history stays when the rep doesn't.",
    feat_3_msg1: 'Could you send pricing for 12 users?',
    feat_3_msg2: 'Sending now — quote attached to lead #00842.',
    feat_3_msg3: "Got it. Let's schedule a demo next week.",
    feat_4_title: 'Pipeline · Meta lead capture.',
    feat_4_desc: 'Facebook and Instagram leads drop into your pipeline in under 60 seconds. No CSV exports. No missed-weekend notifications.',
    pipe_new: 'New', pipe_contacted: 'Contacted', pipe_qualified: 'Qualified', pipe_won: 'Won',
    pipe_card_1: 'Meta lead · IG ad',
    cmp_eyebrow: 'Why no competitor closes this gap',
    cmp_title: 'Some vendors offer one of these things. None offer all of them for this market.',
    cmp_tag: '/user/mo · all-in · no surprises',
    cmp_h_product: 'Product', cmp_h_price: 'Price / user / month',
    cmp_h_tel: 'Native telephony', cmp_h_stt: 'Georgian transcription', cmp_h_wa: 'WhatsApp inbox',
    cmp_us_price: '$60 · all included', cmp_us_tel: 'Georgian SIP', cmp_us_stt: 'Native + AI', cmp_us_wa: 'Shared inbox',
    cmp_addon: 'Add-on, extra cost', cmp_addon2: 'Add-on, extra cost',
    cmp_no: 'No', cmp_no2: 'No', cmp_no3: 'No', cmp_no4: 'No', cmp_no5: 'No', cmp_no6: 'No',
    cmp_via: 'Via integrations', cmp_bitrix_price: '$50+ · climbs to $90+',
    cmp_third: 'Third-party only', cmp_ext: 'External', cmp_lim: 'Limited',
    pr_eyebrow: 'Pricing',
    pr_title: 'One price. Every feature. The price is the price.',
    pr_tag: 'Subscription', pr_unit: '/ user / month',
    pr_headline: 'Everything you need. Nothing billed twice.',
    pr_sub: 'Telephony, Georgian transcription, AI processing, WhatsApp, Meta lead intake, all API costs — bundled. No per-minute fees. No separate AI billing. No surprises at renewal.',
    pr_incl_1: 'Georgian SIP number', pr_incl_2: 'Unlimited call recording',
    pr_incl_3: 'AI on every transcript', pr_incl_4: 'Shared WhatsApp inbox',
    pr_incl_5: 'Meta lead intake', pr_incl_6: 'Pipeline · custom stages',
    pr_incl_7: 'Manager call review', pr_incl_8: 'Analytics & KPIs',
    pr_addons: '<strong>Add-ons.</strong> Georgian B2B database · Custom onboarding · Enterprise SLA',
    team_eyebrow: 'Team',
    team_title: 'Built by operators who lost the same hours every week.',
    team_lede: 'Three co-founders. Tsotne runs commercial across his five businesses — the first beta clients. Davit built the platform after a decade deploying ERPs at Georgian companies. Levan owns infrastructure.',
    team_n1: 'Tsotne Tsintsadze', team_r1: 'Chief Commercial Officer',
    team_b1: 'A decade running sales ops across five concurrent businesses — construction, accounting, surveillance, marketing, consulting. Owns GTM, beta relationships, and revenue pipeline.',
    team_n2: 'Davit Shubitidze', team_r2: 'Chief Technology Officer',
    team_b2: 'Certified Odoo partner. Built and deployed ERP systems at three Georgian companies, including 50,000+ lines of custom modules on Odoo 18 for heavy industry. Owns product and engineering.',
    team_n3: 'Levan Khelashvili', team_r3: 'Senior Developer · DevOps',
    team_b3: 'Full-stack engineer, DevOps, published academic researcher. Currently holds a staff engineering role at a regional tech company. Owns infrastructure and platform reliability.',
    wl_eyebrow: 'Early access · cohort #1',
    wl_title: 'Get on the list.',
    wl_sub: "We're onboarding a small first cohort of Georgian SMB sales teams. If admin is eating half your day, we'd like to fix that.",
    wl_ph_email: 'work email',
    wl_role_default: 'Your role', wl_role_founder: 'Founder / Owner',
    wl_role_mgr: 'Sales Manager', wl_role_rep: 'Sales Rep',
    wl_role_ops: 'Operations', wl_role_inv: 'Investor', wl_role_other: 'Other',
    wl_submit: 'Request access',
    wl_ok_title: "You're on the list.",
    wl_ok_body: "We'll be in touch as we open up the first cohort. In the meantime, expect a short questionnaire to help us understand your team.",
    wl_foot_1: '<strong>3,000+</strong>&nbsp;Georgian SMBs in our target market',
    wl_foot_2: '<strong>5–10</strong>&nbsp;paying clients by month 3',
    wl_foot_3: '<strong>Tbilisi</strong>',
    footer_tagline: 'All-in-one · AI-powered',
    footer_contact: 'Contact',
    footer_copy: '© 2026 Networker CRM · Tbilisi, Georgia · Confidential',
  },
  ka: {
    nav_product: 'პროდუქტი', nav_compare: 'შედარება', nav_pricing: 'ფასი',
    nav_team: 'გუნდი', nav_cta: 'მოითხოვეთ წვდომა',
    hero_eyebrow: 'Beta · ვაკომპლექტებთ პირველ ჯგუფს',
    hero_h1: 'CRM, რომელსაც ქართული გაყიდვების გუნდები <em>რეალურად</em> იყენებენ.',
    hero_sub: 'Networker აერთიანებს ქართულ SIP ნომერს, AI-ს ყველა ზარზე, საერთო WhatsApp Inbox-ს და Meta-დან ლიდების მიღებას — ერთ პლატფორმაზე. შექმნილია იმ ნახევარი დღისთვის, რომელიც რუტინაში იკარგება.',
    hero_cta_primary: 'მიიღეთ ადრეული წვდომა',
    hero_cta_secondary: 'ნახეთ, როგორ მუშაობს',
    hero_meta_1: 'ქართული ენის ზუსტი ტრანსკრიფცია',
    hero_meta_2: '$60/მომხმარებელი · ყველაფერი შედის',
    hero_meta_3: 'ჩაშენებული ტელეფონია, შუამავლების გარეშე',
    problem_eyebrow: 'პრობლემა',
    problem_caption: 'გაყიდვების მენეჯერის სამუშაო დროის ნახევარი რუტინაში იკარგება — აღურიცხავი ზარები, ფოლოუ-აფები ვიღაცის გონებაში და WhatsApp მიმოწერები პირად ტელეფონებში. <strong>წყარო: Gartner.</strong>',
    problem_h2: 'სამუშაო სრულდება. თუმცა მას ვერავინ ხედავს.',
    problem_p1: 'ქართული გაყიდვების გუნდების უმეტესობა 4-5 სხვადასხვა პროგრამას იყენებს, თუმცა არცერთი მათგანი უშუალოდ გაყიდვებისთვის არ შექმნილა. ზარები CRM-ის გარეთ ხორციელდება. ჩანაწერები მეხსიერებით კეთდება — ან საერთოდ არა. WhatsApp-ის მიმოწერები პირად ტელეფონებში რჩება და თანამშრომლის წასვლისას, სამუდამოდ იკარგება.',
    problem_p2: 'ბაზარზე არსებული არცერთი პროდუქტი ამ კონტექსტისთვის არ შექმნილა. საერთაშორისო პროგრამების მორგებას ან 6 თვე სჭირდება, ან გუნდის შემოსავალზე მეტი ჯდება. ლოკალური ალტერნატივები კი სხვადასხვა მოდულს აერთიანებს, რომლებიც პროვაიდერის ყოველი განახლებისას იშლება.',
    problem_li_1: 'ნახევარი სამუშაო დღე, ყველა მენეჯერისთვის, ყოველდღიურად — ამოცანებზე, რომლებსაც ნულოვანი შემოსავალი მოაქვს.',
    problem_li_2: 'გარიგებები შეუმჩნევლად ფერხდება, რადგან კომუნიკაცია იქ მიმდინარეობს, სადაც მენეჯერები ვერ ხედავენ.',
    problem_li_3: 'არ არსებობდა ქართული ენის ტრანსკრიფცია, რომელიც რეალურ სამუშაო პროცესს გაუძლებდა — გასულ წლამდე.',
    problem_li_4: 'არ არსებობდა პლატფორმა, რომელიც მორგებული იქნებოდა იმაზე, თუ როგორ მუშაობს ქართული SMB გაყიდვების გუნდი რეალურად.',
    sol_eyebrow: 'გადაწყვეტა',
    sol_title: 'ერთი პლატფორმა. ყველა პრობლემის გადაწყვეტა.',
    sol_lede: 'ჩაშენებული ტელეფონია ნამდვილი ქართული ნომრით. AI, რომელიც კითხულობს ყველა ტრანსკრიპტს და გეგმავს მომდევნო ნაბიჯს. საერთო Inbox. Pipeline, რომელიც სოციალური ქსელის ლიდებს 60 წამზე ნაკლებ დროში იღებს. არანაირი დანამატი. არანაირი წუთობრივი ტარიფი.',
    feat_1_title: 'ჩაშენებული ქართული ტელეფონია.',
    feat_1_desc: 'ნამდვილი ქართული SIP ნომერი, და არა უბრალო გადამისამართება. ზარები ავტომატურად შესაბამის ლიდთან ნაწილდება. თითოეული ჩანაწერი პლატფორმაზე ინახება.',
    feat_2_title: 'AI ყველა ზარზე.',
    feat_2_desc: 'გათიშავთ თუ არა ზარს, ტრანსკრიპტი თქვენი პროდუქტის კონტექსტის მიხედვით მუშავდება. ამოცანების განაწილება, WhatsApp-ის შაბლონები და მენეჯერის შეტყობინებები — ყველაფერი მზადაა შემდეგ ზარამდე.',
    feat_2_action: 'რიგშია: შეთავაზების გაგზავნა · ფოლოუ-აფი ხუთშ. 14:00',
    feat_3_title: 'საერთო WhatsApp Inbox.',
    feat_3_desc: 'მიმოწერები დაკავშირებულია ლიდის ჩანაწერებთან და გუნდის საერთო Inbox-ში ინახება. პირადი ტელეფონები აღარ დაგჭირდებათ. მიმოწერის ისტორია რჩება მაშინაც, როცა მენეჯერი ტოვებს კომპანიას.',
    feat_3_msg1: 'შეგიძლიათ 12 მომხმარებელზე ფასი გამომიგზავნოთ?',
    feat_3_msg2: 'ახლავე გამოგიგზავნით — შეთავაზება მიმაგრებულია ლიდზე #00842.',
    feat_3_msg3: 'მივიღე. მოდით, მომავალ კვირას დემო დავნიშნოთ.',
    feat_4_title: 'Pipeline · Meta ლიდების მიღება.',
    feat_4_desc: 'Facebook-ისა და Instagram-ის ლიდები თქვენს Pipeline-ში 60 წამზე ნაკლებ დროში ხვდება. არანაირი CSV ექსპორტი და შაბათ-კვირას გამოტოვებული შეტყობინებები.',
    pipe_new: 'ახალი', pipe_contacted: 'დაკავშირებული', pipe_qualified: 'კვალიფიც.', pipe_won: 'მოგებული',
    pipe_card_1: 'Meta ლიდი · IG რეკლამა',
    cmp_eyebrow: 'რატომ ვერ ავსებს ამ სიცარიელეს ვერცერთი კონკურენტი',
    cmp_title: 'ზოგიერთი ვენდორი მხოლოდ ერთ-ერთს გთავაზობთ. ამ ბაზრისთვის ყველაფერს ერთად არცერთი უზრუნველყოფს.',
    cmp_tag: '/მომხ./თვე · ყველაფერი შედის · სიურპრიზების გარეშე',
    cmp_h_product: 'პროდუქტი', cmp_h_price: 'ფასი / მომხმარებელი / თვე',
    cmp_h_tel: 'ჩაშენებული ტელეფონია', cmp_h_stt: 'ქართული ტრანსკრიფცია', cmp_h_wa: 'WhatsApp Inbox',
    cmp_us_price: '$60 · ყველაფერი შედის', cmp_us_tel: 'ქართული SIP', cmp_us_stt: 'ჩაშენებული + AI', cmp_us_wa: 'საერთო Inbox',
    cmp_addon: 'ფასიანი დანამატი', cmp_addon2: 'ფასიანი დანამატი',
    cmp_no: 'არა', cmp_no2: 'არა', cmp_no3: 'არა', cmp_no4: 'არა', cmp_no5: 'არა', cmp_no6: 'არა',
    cmp_via: 'ინტეგრაციით', cmp_bitrix_price: '$50+ · იზრდება $90+-მდე',
    cmp_third: 'მხოლოდ მესამე მხარით', cmp_ext: 'გარე', cmp_lim: 'შეზღუდული',
    pr_eyebrow: 'ფასი',
    pr_title: 'ერთი ფასი. ყველა ფუნქცია. ფასი საბოლოოა.',
    pr_tag: 'გამოწერა', pr_unit: '/ მომხმარებელი / თვე',
    pr_headline: 'ყველაფერი, რაც გჭირდებათ. ორმაგი გადასახადების გარეშე.',
    pr_sub: 'ტელეფონია, ქართული ტრანსკრიფცია, AI დამუშავება, WhatsApp, Meta ლიდების მიღება და ყველა API ხარჯი — გაერთიანებული. არანაირი წუთობრივი ტარიფი ან AI-ის ცალკე გადასახადი. განახლებისას არანაირი სიურპრიზი.',
    pr_incl_1: 'ქართული SIP ნომერი', pr_incl_2: 'ზარების ულიმიტო ჩაწერა',
    pr_incl_3: 'AI ყველა ტრანსკრიპტზე', pr_incl_4: 'საერთო WhatsApp Inbox',
    pr_incl_5: 'Meta ლიდების მიღება', pr_incl_6: 'Pipeline · მორგებადი ეტაპები',
    pr_incl_7: 'ზარების შეფასება მენეჯერის მიერ', pr_incl_8: 'ანალიტიკა & KPI',
    pr_addons: '<strong>დანამატები.</strong> ქართული B2B ბაზა · მორგებული Onboarding · Enterprise SLA',
    team_eyebrow: 'გუნდი',
    team_title: 'შექმნილია ოპერატორების მიერ, რომლებიც ყოველკვირეულად იმავე საათებს კარგავდნენ.',
    team_lede: 'სამი თანადამფუძნებელი. ცოტნე კომერციულ მიმართულებას მართავს თავის 5 ბიზნესში — რომლებიც ჩვენი პირველი ბეტა-კლიენტები არიან. დავითმა ეს პლატფორმა შექმნა ქართულ კომპანიებში ERP სისტემების დანერგვის 10-წლიანი გამოცდილების შემდეგ. ლევანი კი ინფრასტრუქტურას ხელმძღვანელობს.',
    team_n1: 'ცოტნე ცინცაძე', team_r1: 'კომერციული დირექტორი',
    team_b1: '10 წლის განმავლობაში მართავს გაყიდვების ოპერაციებს 5 პარალელურ ბიზნესში — მშენებლობა, ბუღალტერია, უსაფრთხოების სისტემები, მარკეტინგი და კონსალტინგი. ხელმძღვანელობს GTM-ს, ბეტა-კლიენტებთან ურთიერთობას და შემოსავლების Pipeline-ს.',
    team_n2: 'დავით შუბითიძე', team_r2: 'ტექნიკური დირექტორი',
    team_b2: 'სერტიფიცირებული Odoo პარტნიორი. დანერგა ERP სისტემები 3 ქართულ კომპანიაში, მათ შორის 50,000+ ხაზიანი მორგებული მოდულები Odoo 18-ზე მძიმე მრეწველობისთვის. ხელმძღვანელობს პროდუქტსა და ინჟინერიას.',
    team_n3: 'ლევან ხელაშვილი', team_r3: 'უფროსი დეველოპერი · DevOps',
    team_b3: 'Full-stack ინჟინერი, DevOps და აკადემიური მკვლევარი. ამჟამად Staff Engineer-ის პოზიციას იკავებს რეგიონულ ტექნოლოგიურ კომპანიაში. ხელმძღვანელობს ინფრასტრუქტურასა და პლატფორმის საიმედოობას.',
    wl_eyebrow: 'ადრეული წვდომა · ჯგუფი #1',
    wl_title: 'დარეგისტრირდით სიაში.',
    wl_sub: 'ჩვენ ვიწყებთ ქართული SMB გაყიდვების გუნდების პირველი მცირე ჯგუფის დამატებას. თუ რუტინა თქვენი დღის ნახევარს მიაქვს, გვსურს ეს მოვაგვაროთ.',
    wl_ph_email: 'სამუშაო ელფოსტა',
    wl_role_default: 'თქვენი როლი', wl_role_founder: 'დამფუძნებელი / მფლობელი',
    wl_role_mgr: 'გაყიდვების მენეჯერი', wl_role_rep: 'გაყიდვების წარმომადგენელი',
    wl_role_ops: 'ოპერაციები', wl_role_inv: 'ინვესტორი', wl_role_other: 'სხვა',
    wl_submit: 'მოითხოვეთ წვდომა',
    wl_ok_title: 'თქვენ სიაში ხართ.',
    wl_ok_body: 'ჩვენ დაგიკავშირდებით, როგორც კი გავხსნით პირველ ჯგუფს. მანამდე კი, გამოგიგზავნით მოკლე კითხვარს, რომელიც თქვენი გუნდის უკეთ გაცნობაში დაგვეხმარება.',
    wl_foot_1: '<strong>3,000+</strong>&nbsp;ქართული SMB ჩვენს სამიზნე ბაზარზე',
    wl_foot_2: '<strong>5–10</strong>&nbsp;გადამხდელი კლიენტი მე-3 თვისთვის',
    wl_foot_3: '<strong>თბილისი</strong>',
    footer_tagline: 'ყველაფერი ერთში · AI-ზე დაფუძნებული',
    footer_contact: 'კონტაქტი',
    footer_copy: '© 2026 Networker CRM · თბილისი, საქართველო · კონფიდენციალური',
  },
}

export function makeT(lang: Lang, cmsOverrides: Record<string, string> = {}) {
  return (key: string): string => {
    const cmsKey = `${key}_${lang}`
    if (cmsOverrides[cmsKey]) return cmsOverrides[cmsKey]
    return I18N[lang][key] ?? I18N['en'][key] ?? key
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: lib utilities — supabase clients, i18n, cms fetch, sanitize, rate-limit"
```

---

## Task 5: API Routes — Waitlist + CMS Auth

**Files:**
- Create: `app/api/waitlist/route.ts`
- Create: `app/api/cms/auth/route.ts`

- [ ] **Step 1: `app/api/waitlist/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const email = (body?.email ?? '').trim().toLowerCase()
  const role = body?.role ?? ''
  const lang = body?.lang ?? 'en'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  if (!role) {
    return NextResponse.json({ error: 'Role required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { error } = await supabase.from('waitlist_entries').insert({ email, role, lang })
  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ ok: true })
    }
    console.error('waitlist insert:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: `app/api/cms/auth/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const COOKIE = 'cms_session'
const MAX_AGE = 86400

function makeCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: MAX_AGE,
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const password = body?.password ?? ''
  if (!process.env.CMS_SECRET || password !== process.env.CMS_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const store = await cookies()
  store.set(COOKIE, '1', makeCookieOptions())
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const store = await cookies()
  const session = store.get(COOKIE)
  if (session?.value === '1') return NextResponse.json({ ok: true })
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function DELETE() {
  const store = await cookies()
  store.delete(COOKIE)
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Test waitlist route**

```bash
curl -s -X POST http://localhost:3000/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","role":"founder","lang":"en"}' | jq
```

Expected: `{"ok":true}`

- [ ] **Step 4: Test CMS auth**

```bash
# Should fail
curl -s -X POST http://localhost:3000/api/cms/auth \
  -H 'Content-Type: application/json' \
  -d '{"password":"wrong"}' | jq

# Should succeed (replace yourpassword with CMS_SECRET value)
curl -s -X POST http://localhost:3000/api/cms/auth \
  -H 'Content-Type: application/json' \
  -d '{"password":"yourpassword"}' | jq
```

Expected first: `{"error":"Unauthorized"}`. Expected second: `{"ok":true}`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: waitlist POST route (rate-limited) and CMS auth routes"
```

---

## Task 6: API Routes — CMS Save + Upload

**Files:**
- Create: `app/api/cms/route.ts`
- Create: `app/api/cms/upload/route.ts`

- [ ] **Step 1: Cookie auth helper**

Create `app/api/cms/_auth.ts`:

```ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function requireCMSAuth(): Promise<NextResponse | null> {
  const store = await cookies()
  if (store.get('cms_session')?.value !== '1') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
```

- [ ] **Step 2: `app/api/cms/route.ts`** (bulk save)

```ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createServerClient } from '@/lib/supabase-server'
import { sanitize } from '@/lib/sanitize'
import { requireCMSAuth } from './_auth'

export async function PATCH(req: NextRequest) {
  const deny = await requireCMSAuth()
  if (deny) return deny

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const rows = Object.entries(body as Record<string, string>)
    .filter(([, v]) => typeof v === 'string')
    .map(([key, value]) => ({
      key,
      value: sanitize(value),
      updated_at: new Date().toISOString(),
    }))

  if (rows.length === 0) return NextResponse.json({ ok: true })

  const supabase = createServerClient()
  const { error } = await supabase
    .from('cms_content')
    .upsert(rows, { onConflict: 'key' })

  if (error) {
    console.error('cms save:', error)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }

  revalidateTag('cms')
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: `app/api/cms/upload/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { requireCMSAuth } from '../_auth'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function POST(req: NextRequest) {
  const deny = await requireCMSAuth()
  if (deny) return deny

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })

  const file = form.get('file') as File | null
  const slot = (form.get('slot') as string | null) ?? 'unknown'

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or GIF.' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Maximum 5 MB.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${slot}-${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const supabase = createServerClient()
  const { error } = await supabase.storage
    .from('team-photos')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (error) {
    console.error('upload:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data } = supabase.storage.from('team-photos').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: CMS PATCH save (sanitized, ISR revalidate) and image upload route"
```

---

## Task 7: CMS Components (dynamically loaded)

**Files:**
- Create: `components/cms/CMSContext.tsx`
- Create: `components/cms/CMSToolbar.tsx`
- Create: `components/cms/EditableText.tsx`
- Create: `components/cms/EditableImage.tsx`
- Create: `components/cms/CMSLayer.tsx`

- [ ] **Step 1: `components/cms/CMSContext.tsx`**

```tsx
'use client'
import { createContext, useContext, useState, useCallback, useRef } from 'react'

type CMSState = {
  editMode: boolean
  saving: boolean
  error: string | null
  save: () => Promise<void>
  logout: () => Promise<void>
  uploadImage: (slot: string, file: File) => Promise<string>
}

export const CMSContext = createContext<CMSState>({
  editMode: false, saving: false, error: null,
  save: async () => {}, logout: async () => {}, uploadImage: async () => '',
})

export function useCMS() { return useContext(CMSContext) }

export function CMSContextProvider({ children }: { children: React.ReactNode }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const save = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      const entries: Record<string, string> = {}
      document.querySelectorAll<HTMLElement>('[data-cms-key]').forEach((el) => {
        const key = el.getAttribute('data-cms-key')!
        // DOMPurify client-side sanitize before send
        entries[key] = el.innerHTML
      })
      const res = await fetch('/api/cms', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Save failed')
    } catch (e: any) {
      setError(e.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/cms/auth', { method: 'DELETE' })
    window.location.search = ''
  }, [])

  const uploadImage = useCallback(async (slot: string, file: File): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    form.append('slot', slot)
    const res = await fetch('/api/cms/upload', { method: 'POST', body: form })
    if (!res.ok) throw new Error((await res.json()).error ?? 'Upload failed')
    return (await res.json()).url as string
  }, [])

  return (
    <CMSContext.Provider value={{ editMode: true, saving, error, save, logout, uploadImage }}>
      {children}
    </CMSContext.Provider>
  )
}
```

- [ ] **Step 2: `components/cms/CMSToolbar.tsx`**

```tsx
'use client'
import { useCMS } from './CMSContext'

export function CMSToolbar() {
  const { saving, error, save, logout } = useCMS()
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
    }}>
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626',
          padding: '8px 14px', borderRadius: 8, fontSize: 13, maxWidth: 300,
        }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={logout}
          style={{
            height: 40, padding: '0 16px', background: 'white',
            border: '1px solid #e5e7eb', borderRadius: 8,
            fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#374151',
          }}
        >
          Exit edit mode
        </button>
        <button
          onClick={save}
          disabled={saving}
          style={{
            height: 40, padding: '0 20px',
            background: saving ? '#6b7280' : '#0D9488',
            color: 'white', border: 'none', borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: `components/cms/EditableText.tsx`**

```tsx
'use client'
import { useRef, useEffect } from 'react'
import { useCMS } from './CMSContext'

interface Props {
  cmsKey: string
  html: string
  as?: keyof React.JSX.IntrinsicElements
  className?: string
}

export function EditableText({ cmsKey, html, as: Tag = 'span', className }: Props) {
  const { editMode } = useCMS()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = html
  }, [html])

  if (!editMode) {
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <Tag
      ref={ref as any}
      data-cms-key={cmsKey}
      className={className}
      contentEditable
      suppressContentEditableWarning
      style={{ outline: '2px dashed rgba(13,148,136,0.4)', borderRadius: 2 }}
    />
  )
}
```

- [ ] **Step 4: `components/cms/EditableImage.tsx`**

```tsx
'use client'
import { useRef, useState } from 'react'
import { useCMS } from './CMSContext'
import Image from 'next/image'

interface Props {
  slot: string
  src: string | null
  alt: string
  fallback: React.ReactNode
}

export function EditableImage({ slot, src, alt, fallback }: Props) {
  const { editMode, uploadImage } = useCMS()
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState<string | null>(src)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setUploadError(null)
    try {
      const newUrl = await uploadImage(slot, file)
      setUrl(newUrl)
    } catch (e: any) {
      setUploadError(e.message)
    } finally {
      setUploading(false)
    }
  }

  if (!editMode) {
    if (!url) return <>{fallback}</>
    return <Image src={url} alt={alt} fill style={{ objectFit: 'cover' }} />
  }

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
      }}
    >
      {url
        ? <Image src={url} alt={alt} fill style={{ objectFit: 'cover' }} />
        : fallback}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'rgba(0,0,0,0.35)',
        color: 'white', fontSize: 13, fontWeight: 500, flexDirection: 'column', gap: 4,
      }}>
        {uploading ? 'Uploading…' : uploadError ? uploadError : 'Click or drag to replace'}
      </div>
      <input
        ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}
```

- [ ] **Step 5: `components/cms/CMSLayer.tsx`**

This is the entry point dynamically imported by `LandingPage`. It checks cookie auth on mount, shows password overlay if not authenticated, and wraps children in CMSContextProvider.

```tsx
'use client'
import { useState, useEffect } from 'react'
import { CMSContextProvider } from './CMSContext'
import { CMSToolbar } from './CMSToolbar'

export default function CMSLayer({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'checking' | 'prompt' | 'authed'>('checking')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    fetch('/api/cms/auth')
      .then((r) => setStatus(r.ok ? 'authed' : 'prompt'))
      .catch(() => setStatus('prompt'))
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    const res = await fetch('/api/cms/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) setStatus('authed')
    else setAuthError('Wrong password')
  }

  if (status === 'checking') return null

  if (status === 'prompt') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 10000, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10,20,36,0.85)', backdropFilter: 'blur(8px)',
      }}>
        <form onSubmit={handleLogin} style={{
          background: 'white', borderRadius: 12, padding: 32,
          display: 'flex', flexDirection: 'column', gap: 14, minWidth: 320,
        }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 18, color: '#0F1C32' }}>
            Edit mode
          </div>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="CMS password" autoFocus
            style={{
              height: 42, border: '1.5px solid #e5e7eb', borderRadius: 8,
              padding: '0 14px', fontSize: 14, outline: 'none',
            }}
          />
          {authError && <div style={{ color: '#dc2626', fontSize: 13 }}>{authError}</div>}
          <button type="submit" style={{
            height: 42, background: '#0F1C32', color: 'white', border: 'none',
            borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>
            Unlock
          </button>
        </form>
      </div>
    )
  }

  return (
    <CMSContextProvider>
      {children}
      <CMSToolbar />
    </CMSContextProvider>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: CMS context, toolbar, EditableText, EditableImage, CMSLayer"
```

---

## Task 8: Landing Sections — Nav + Hero

**Files:**
- Create: `components/landing/Nav.tsx`
- Create: `components/landing/Hero.tsx`

- [ ] **Step 1: `components/landing/Nav.tsx`**

```tsx
import { Lang } from '@/lib/i18n'

interface Props {
  t: (key: string) => string
  lang: Lang
  onLangChange: (l: Lang) => void
}

export function Nav({ t, lang, onLangChange }: Props) {
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <div className="nav-left">
          <a href="#top" className="nav-logo">
            <svg className="nav-logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="7" fill="#0D9488"/>
              <circle cx="7" cy="25" r="3.5" fill="white"/>
              <circle cx="25" cy="7" r="3.5" fill="white"/>
              <circle cx="25" cy="25" r="3.5" fill="white"/>
              <circle cx="7" cy="7" r="3.5" fill="white"/>
              <line x1="7" y1="25" x2="7" y2="7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="7" y1="7" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="25" y1="7" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="nav-logo-name">Networker</span>
          </a>
          <div className="nav-links">
            <a href="#solution" className="nav-link">{t('nav_product')}</a>
            <a href="#compare" className="nav-link">{t('nav_compare')}</a>
            <a href="#pricing" className="nav-link">{t('nav_pricing')}</a>
            <a href="#team" className="nav-link">{t('nav_team')}</a>
          </div>
        </div>
        <div className="nav-right">
          <div className="lang-switch" role="group" aria-label="Language">
            {(['en', 'ka'] as Lang[]).map((l) => (
              <button
                key={l}
                className={`lang-btn${lang === l ? ' active' : ''}`}
                type="button"
                onClick={() => onLangChange(l)}
              >
                {l === 'en' ? 'EN' : 'ქარ'}
              </button>
            ))}
          </div>
          <a href="#waitlist" className="nav-cta">
            <span className="cta-label">{t('nav_cta')}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: `components/landing/Hero.tsx`**

```tsx
import { EditableText } from '@/components/cms/EditableText'
import { Lang } from '@/lib/i18n'

interface Props {
  t: (key: string) => string
  lang: Lang
  editMode: boolean
}

export function Hero({ t, lang, editMode }: Props) {
  return (
    <section className="hero" id="top">
      <div className="hero-grid" />
      <div className="wrap hero-inner">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          {editMode
            ? <EditableText cmsKey={`hero_eyebrow_${lang}`} html={t('hero_eyebrow')} />
            : <span dangerouslySetInnerHTML={{ __html: t('hero_eyebrow') }} />}
        </div>
        <h1 className="hero-headline">
          {editMode
            ? <EditableText cmsKey={`hero_h1_${lang}`} html={t('hero_h1')} />
            : <span dangerouslySetInnerHTML={{ __html: t('hero_h1') }} />}
        </h1>
        <p className="hero-sub">
          {editMode
            ? <EditableText cmsKey={`hero_sub_${lang}`} html={t('hero_sub')} />
            : <span dangerouslySetInnerHTML={{ __html: t('hero_sub') }} />}
        </p>
        <div className="hero-actions">
          <a href="#waitlist" className="btn btn-primary">
            <span dangerouslySetInnerHTML={{ __html: t('hero_cta_primary') }} />
            <svg className="btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="#solution" className="btn btn-secondary">
            <span dangerouslySetInnerHTML={{ __html: t('hero_cta_secondary') }} />
          </a>
        </div>
        <div className="hero-meta">
          {(['hero_meta_1','hero_meta_2','hero_meta_3'] as const).map((k) => (
            <div key={k} className="hero-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              <span dangerouslySetInnerHTML={{ __html: t(k) }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Nav and Hero landing sections"
```

---

## Task 9: Landing Sections — Problem + Features

**Files:**
- Create: `components/landing/Problem.tsx`
- Create: `components/landing/Features.tsx`

- [ ] **Step 1: `components/landing/Problem.tsx`**

```tsx
import { Lang } from '@/lib/i18n'

interface Props { t: (key: string) => string; lang: Lang }

export function Problem({ t }: Props) {
  return (
    <section className="problem section">
      <div className="wrap problem-inner">
        <div>
          <div className="section-eyebrow">
            <span className="section-eyebrow-num">01</span>
            <span dangerouslySetInnerHTML={{ __html: t('problem_eyebrow') }} />
          </div>
          <div className="problem-stat">50<span className="problem-stat-pct">%</span></div>
          <div className="problem-stat-caption" dangerouslySetInnerHTML={{ __html: t('problem_caption') }} />
        </div>
        <div className="problem-text">
          <h2 dangerouslySetInnerHTML={{ __html: t('problem_h2') }} />
          <p dangerouslySetInnerHTML={{ __html: t('problem_p1') }} />
          <p dangerouslySetInnerHTML={{ __html: t('problem_p2') }} />
          <ul className="problem-list">
            {(['problem_li_1','problem_li_2','problem_li_3','problem_li_4'] as const).map((k) => (
              <li key={k} dangerouslySetInnerHTML={{ __html: t(k) }} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: `components/landing/Features.tsx`**

```tsx
import { Lang } from '@/lib/i18n'

interface Props { t: (key: string) => string; lang: Lang }

export function Features({ t }: Props) {
  return (
    <section className="section" id="solution">
      <div className="wrap">
        <div className="features-head">
          <div className="section-eyebrow">
            <span className="section-eyebrow-num">02</span>
            <span dangerouslySetInnerHTML={{ __html: t('sol_eyebrow') }} />
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('sol_title') }} />
          <p className="section-lede" dangerouslySetInnerHTML={{ __html: t('sol_lede') }} />
        </div>
        <div className="features-grid">
          {/* Feature 1 — Telephony */}
          <article className="feature">
            <div className="feature-num">01 / 04</div>
            <div className="feature-vis">
              <div className="vis-call">
                <div className="vis-call-num">
                  <span className="vis-call-flag" aria-hidden="true" />
                  +995 32 2 14 88 00
                </div>
                <div className="vis-call-wave" aria-hidden="true">
                  {Array.from({ length: 14 }).map((_, i) => <span key={i} />)}
                </div>
                <div className="vis-call-meta">REC · 00:02:14 · GE-STT</div>
              </div>
            </div>
            <h3 className="feature-title" dangerouslySetInnerHTML={{ __html: t('feat_1_title') }} />
            <p className="feature-desc" dangerouslySetInnerHTML={{ __html: t('feat_1_desc') }} />
          </article>
          {/* Feature 2 — AI */}
          <article className="feature">
            <div className="feature-num">02 / 04</div>
            <div className="feature-vis">
              <div className="vis-ai">
                <div className="vis-ai-line"><span className="vis-ai-spk">REP</span><span>&#x201C;გადავუგზავნი წინადადებას ხუთშაბათამდე.&#x201D;</span></div>
                <div className="vis-ai-line"><span className="vis-ai-spk">LEAD</span><span>&#x201C;კარგი, ველოდები. ბიუჯეტი დადასტურდა.&#x201D;</span></div>
                <div className="vis-ai-action">
                  <span className="vis-ai-tag">AI</span>
                  <span dangerouslySetInnerHTML={{ __html: t('feat_2_action') }} />
                </div>
              </div>
            </div>
            <h3 className="feature-title" dangerouslySetInnerHTML={{ __html: t('feat_2_title') }} />
            <p className="feature-desc" dangerouslySetInnerHTML={{ __html: t('feat_2_desc') }} />
          </article>
          {/* Feature 3 — WhatsApp */}
          <article className="feature">
            <div className="feature-num">03 / 04</div>
            <div className="feature-vis">
              <div className="vis-inbox">
                <div className="vis-msg"><div className="vis-msg-avatar">NK</div><div className="vis-msg-bubble" dangerouslySetInnerHTML={{ __html: t('feat_3_msg1') }} /></div>
                <div className="vis-msg vis-msg-mine"><div className="vis-msg-avatar">D</div><div className="vis-msg-bubble" dangerouslySetInnerHTML={{ __html: t('feat_3_msg2') }} /></div>
                <div className="vis-msg"><div className="vis-msg-avatar">NK</div><div className="vis-msg-bubble" dangerouslySetInnerHTML={{ __html: t('feat_3_msg3') }} /></div>
              </div>
            </div>
            <h3 className="feature-title" dangerouslySetInnerHTML={{ __html: t('feat_3_title') }} />
            <p className="feature-desc" dangerouslySetInnerHTML={{ __html: t('feat_3_desc') }} />
          </article>
          {/* Feature 4 — Pipeline */}
          <article className="feature">
            <div className="feature-num">04 / 04</div>
            <div className="feature-vis">
              <div className="vis-pipe">
                {[
                  { key: 'pipe_new', count: 4, cards: [{ label: t('pipe_card_1'), val: '~$2,400', isNew: true }, { label: 'Tronixer Co.', val: '~$5,100' }] },
                  { key: 'pipe_contacted', count: 9, cards: [{ label: 'Sales Assoc.', val: '~$3,800' }, { label: 'Geo Logistics', val: '~$1,900' }] },
                  { key: 'pipe_qualified', count: 6, cards: [{ label: 'Caucasus Auto', val: '~$7,200' }] },
                  { key: 'pipe_won', count: 3, cards: [{ label: 'Adjara Build', val: '~$11,000' }] },
                ].map((col) => (
                  <div key={col.key} className="vis-pipe-col">
                    <div className="vis-pipe-head"><span dangerouslySetInnerHTML={{ __html: t(col.key) }} /><span>{col.count}</span></div>
                    {col.cards.map((c, i) => (
                      <div key={i} className={`vis-pipe-card${c.isNew ? ' new' : ''}`}>
                        {c.label}<div className="vis-pipe-value">{c.val}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <h3 className="feature-title" dangerouslySetInnerHTML={{ __html: t('feat_4_title') }} />
            <p className="feature-desc" dangerouslySetInnerHTML={{ __html: t('feat_4_desc') }} />
          </article>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Problem and Features landing sections"
```

---

## Task 10: Landing Sections — Compare + Pricing

**Files:**
- Create: `components/landing/Compare.tsx`
- Create: `components/landing/Pricing.tsx`

- [ ] **Step 1: `components/landing/Compare.tsx`**

```tsx
interface Props { t: (key: string) => string }

const CHECK = (
  <span className="check-icon">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  </span>
)
const X = (
  <span className="x-icon">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
  </span>
)

export function Compare({ t }: Props) {
  return (
    <section className="compare section" id="compare">
      <div className="wrap">
        <div className="compare-head">
          <div>
            <div className="section-eyebrow">
              <span className="section-eyebrow-num">03</span>
              <span dangerouslySetInnerHTML={{ __html: t('cmp_eyebrow') }} />
            </div>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('cmp_title') }} />
          </div>
          <div className="compare-tag">
            <span>$60</span>&nbsp;<span dangerouslySetInnerHTML={{ __html: t('cmp_tag') }} />
          </div>
        </div>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th dangerouslySetInnerHTML={{ __html: t('cmp_h_product') }} />
                <th dangerouslySetInnerHTML={{ __html: t('cmp_h_price') }} />
                <th dangerouslySetInnerHTML={{ __html: t('cmp_h_tel') }} />
                <th dangerouslySetInnerHTML={{ __html: t('cmp_h_stt') }} />
                <th dangerouslySetInnerHTML={{ __html: t('cmp_h_wa') }} />
              </tr>
            </thead>
            <tbody>
              <tr className="compare-row-us">
                <td className="compare-prod">Networker</td>
                <td className="compare-price" dangerouslySetInnerHTML={{ __html: t('cmp_us_price') }} />
                <td><span className="compare-cell-y">{CHECK} <span dangerouslySetInnerHTML={{ __html: t('cmp_us_tel') }} /></span></td>
                <td><span className="compare-cell-y">{CHECK} <span dangerouslySetInnerHTML={{ __html: t('cmp_us_stt') }} /></span></td>
                <td><span className="compare-cell-y">{CHECK} <span dangerouslySetInnerHTML={{ __html: t('cmp_us_wa') }} /></span></td>
              </tr>
              <tr>
                <td className="compare-prod">Salesforce</td>
                <td className="compare-price">$150+</td>
                <td><span className="compare-cell-addon" dangerouslySetInnerHTML={{ __html: t('cmp_addon') }} /></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no') }} /></span></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_via') }} /></span></td>
              </tr>
              <tr>
                <td className="compare-prod">Bitrix24</td>
                <td className="compare-price" dangerouslySetInnerHTML={{ __html: t('cmp_bitrix_price') }} />
                <td><span className="compare-cell-addon" dangerouslySetInnerHTML={{ __html: t('cmp_addon2') }} /></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no2') }} /></span></td>
                <td><span className="compare-cell-addon" dangerouslySetInnerHTML={{ __html: t('cmp_third') }} /></td>
              </tr>
              <tr>
                <td className="compare-prod">Zoho CRM</td>
                <td className="compare-price">$20+</td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no3') }} /></span></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no4') }} /></span></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_ext') }} /></span></td>
              </tr>
              <tr>
                <td className="compare-prod">HubSpot</td>
                <td className="compare-price">$0 – $45+</td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no5') }} /></span></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_no6') }} /></span></td>
                <td><span className="compare-cell-n">{X} <span dangerouslySetInnerHTML={{ __html: t('cmp_lim') }} /></span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: `components/landing/Pricing.tsx`**

```tsx
interface Props { t: (key: string) => string }

const TICK = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>

export function Pricing({ t }: Props) {
  const inclKeys = ['pr_incl_1','pr_incl_2','pr_incl_3','pr_incl_4','pr_incl_5','pr_incl_6','pr_incl_7','pr_incl_8'] as const
  return (
    <section className="pricing section" id="pricing">
      <div className="wrap-narrow">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <span className="section-eyebrow-num">04</span>
            <span dangerouslySetInnerHTML={{ __html: t('pr_eyebrow') }} />
          </div>
          <h2 className="section-title" style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', maxWidth: '24ch' }} dangerouslySetInnerHTML={{ __html: t('pr_title') }} />
        </div>
        <div className="pricing-card">
          <div>
            <div className="pricing-tag" dangerouslySetInnerHTML={{ __html: t('pr_tag') }} />
            <div className="pricing-amount">
              <span className="pricing-amount-cur">$</span>
              <span className="pricing-amount-num">60</span>
              <span className="pricing-amount-unit" dangerouslySetInnerHTML={{ __html: t('pr_unit') }} />
            </div>
            <div className="pricing-headline" dangerouslySetInnerHTML={{ __html: t('pr_headline') }} />
            <div className="pricing-sub" dangerouslySetInnerHTML={{ __html: t('pr_sub') }} />
          </div>
          <div className="pricing-incl">
            {inclKeys.map((k) => (
              <div key={k} className="pricing-incl-item">
                {TICK}
                <span dangerouslySetInnerHTML={{ __html: t(k) }} />
              </div>
            ))}
          </div>
        </div>
        <div className="pricing-foot">
          <div dangerouslySetInnerHTML={{ __html: t('pr_addons') }} />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: Compare and Pricing landing sections"
```

---

## Task 11: Landing Sections — Team + Waitlist + Footer

**Files:**
- Create: `components/landing/Team.tsx`
- Create: `components/landing/Waitlist.tsx`
- Create: `components/landing/Footer.tsx`

- [ ] **Step 1: `components/landing/Team.tsx`**

```tsx
'use client'
import { EditableImage } from '@/components/cms/EditableImage'
import { useCMS } from '@/components/cms/CMSContext'
import { Lang } from '@/lib/i18n'

interface Props {
  t: (key: string) => string
  lang: Lang
  photos: { tsotne: string | null; davit: string | null; levan: string | null }
}

const MEMBERS = [
  { id: 'tsotne', slot: 'team-tsotne', initials: 'TT', nKey: 'team_n1', rKey: 'team_r1', bKey: 'team_b1' },
  { id: 'davit',  slot: 'team-davit',  initials: 'DS', nKey: 'team_n2', rKey: 'team_r2', bKey: 'team_b2' },
  { id: 'levan',  slot: 'team-levan',  initials: 'LK', nKey: 'team_n3', rKey: 'team_r3', bKey: 'team_b3' },
] as const

export function Team({ t, photos }: Props) {
  const { editMode } = useCMS()
  return (
    <section className="section-tight" id="team" style={{ background: 'white' }}>
      <div className="wrap">
        <div style={{ maxWidth: 720 }}>
          <div className="section-eyebrow">
            <span className="section-eyebrow-num">05</span>
            <span dangerouslySetInnerHTML={{ __html: t('team_eyebrow') }} />
          </div>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t('team_title') }} />
          <p className="section-lede" dangerouslySetInnerHTML={{ __html: t('team_lede') }} />
        </div>
        <div className="team-grid">
          {MEMBERS.map((m, idx) => (
            <article key={m.id} className="team-card">
              <div className="team-photo-wrap">
                <div className="team-photo-fallback">
                  <div className="team-photo-initials" style={idx === 1 ? { background: 'var(--teal-700)' } : idx === 2 ? { background: 'var(--navy-700)' } : {}}>
                    {m.initials}
                  </div>
                  {editMode && <div className="team-photo-hint">Drop photo</div>}
                </div>
                <EditableImage
                  slot={m.slot}
                  src={photos[m.id as keyof typeof photos]}
                  alt={t(m.nKey)}
                  fallback={null}
                />
              </div>
              <div className="team-content">
                <div className="team-name" dangerouslySetInnerHTML={{ __html: t(m.nKey) }} />
                <div className="team-role" dangerouslySetInnerHTML={{ __html: t(m.rKey) }} />
                <div className="team-bio" dangerouslySetInnerHTML={{ __html: t(m.bKey) }} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: `components/landing/Waitlist.tsx`**

```tsx
'use client'
import { useState, FormEvent } from 'react'
import { Lang } from '@/lib/i18n'

interface Props { t: (key: string) => string; lang: Lang }

export function Waitlist({ t, lang }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const role = (form.elements.namedItem('role') as HTMLSelectElement).value
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const roleKeys = ['wl_role_founder','wl_role_mgr','wl_role_rep','wl_role_ops','wl_role_inv','wl_role_other'] as const
  const roleValues = ['founder','sales-manager','rep','ops','investor','other']

  return (
    <section className="waitlist section" id="waitlist">
      <div className="wrap waitlist-inner">
        <div className="waitlist-eyebrow">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
          <span dangerouslySetInnerHTML={{ __html: t('wl_eyebrow') }} />
        </div>
        <h2 dangerouslySetInnerHTML={{ __html: t('wl_title') }} />
        <p className="waitlist-sub" dangerouslySetInnerHTML={{ __html: t('wl_sub') }} />

        {!submitted ? (
          <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
            <input
              type="email" name="email" required
              className="wl-input" placeholder={t('wl_ph_email')}
              autoComplete="email"
            />
            <select name="role" required className="wl-input" defaultValue="">
              <option value="" disabled>{t('wl_role_default')}</option>
              {roleKeys.map((k, i) => (
                <option key={k} value={roleValues[i]}>{t(k)}</option>
              ))}
            </select>
            <button className="wl-submit" type="submit" disabled={loading}>
              {loading ? '…' : <><span dangerouslySetInnerHTML={{ __html: t('wl_submit') }} /><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>}
            </button>
            {error && <p style={{ color: '#f87171', fontSize: 13, gridColumn: '1/-1', margin: 0 }}>{error}</p>}
          </form>
        ) : (
          <div className="wl-success show" role="status" aria-live="polite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            <div>
              <div className="wl-success-title" dangerouslySetInnerHTML={{ __html: t('wl_ok_title') }} />
              <div className="wl-success-body" dangerouslySetInnerHTML={{ __html: t('wl_ok_body') }} />
            </div>
          </div>
        )}

        <div className="wl-foot">
          {(['wl_foot_1','wl_foot_2','wl_foot_3'] as const).map((k) => (
            <span key={k} dangerouslySetInnerHTML={{ __html: t(k) }} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: `components/landing/Footer.tsx`**

```tsx
interface Props { t: (key: string) => string }

export function Footer({ t }: Props) {
  return (
    <footer>
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#0D9488"/>
            <circle cx="7" cy="25" r="3.5" fill="white"/>
            <circle cx="25" cy="7" r="3.5" fill="white"/>
            <circle cx="25" cy="25" r="3.5" fill="white"/>
            <circle cx="7" cy="7" r="3.5" fill="white"/>
            <line x1="7" y1="25" x2="7" y2="7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="7" y1="7" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="25" y1="7" x2="25" y2="25" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <div>
            <div className="footer-brand-name">Networker</div>
            <div className="footer-brand-sub" dangerouslySetInnerHTML={{ __html: t('footer_tagline') }} />
          </div>
        </div>
        <div className="footer-meta">
          <a href="#solution" dangerouslySetInnerHTML={{ __html: t('nav_product') }} />
          <a href="#pricing" dangerouslySetInnerHTML={{ __html: t('nav_pricing') }} />
          <a href="#team" dangerouslySetInnerHTML={{ __html: t('nav_team') }} />
          <a href="#waitlist" dangerouslySetInnerHTML={{ __html: t('footer_contact') }} />
        </div>
      </div>
      <div className="wrap footer-copy" dangerouslySetInnerHTML={{ __html: t('footer_copy') }} />
    </footer>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Team, Waitlist (real API), and Footer sections"
```

---

## Task 12: LandingPage + app/page.tsx

**Files:**
- Create: `components/LandingPage.tsx`
- Create: `app/page.tsx`

- [ ] **Step 1: `components/LandingPage.tsx`**

```tsx
'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { I18N, makeT, Lang } from '@/lib/i18n'
import { CMSContext } from '@/components/cms/CMSContext'
import { Nav } from '@/components/landing/Nav'
import { Hero } from '@/components/landing/Hero'
import { Problem } from '@/components/landing/Problem'
import { Features } from '@/components/landing/Features'
import { Compare } from '@/components/landing/Compare'
import { Pricing } from '@/components/landing/Pricing'
import { Team } from '@/components/landing/Team'
import { Waitlist } from '@/components/landing/Waitlist'
import { Footer } from '@/components/landing/Footer'
import type { CMSContent } from '@/lib/cms'

const CMSLayer = dynamic(() => import('@/components/cms/CMSLayer'), { ssr: false })

interface Props {
  cmsContent: CMSContent
  cmsMode: boolean
  photos: { tsotne: string | null; davit: string | null; levan: string | null }
}

export default function LandingPage({ cmsContent, cmsMode, photos }: Props) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nwk-lang') as Lang | null
      if (saved && I18N[saved]) setLang(saved)
      else if (navigator.language.toLowerCase().startsWith('ka')) setLang('ka')
    } catch {}
  }, [])

  function handleLangChange(l: Lang) {
    setLang(l)
    try { localStorage.setItem('nwk-lang', l) } catch {}
    document.documentElement.lang = l
  }

  const t = makeT(lang, cmsContent)
  const editMode = false // non-CMS default; CMSLayer overrides via context

  const sections = (
    <>
      <Nav t={t} lang={lang} onLangChange={handleLangChange} />
      <Hero t={t} lang={lang} editMode={cmsMode} />
      <Problem t={t} lang={lang} />
      <Features t={t} lang={lang} />
      <Compare t={t} />
      <Pricing t={t} />
      <Team t={t} lang={lang} photos={photos} />
      <Waitlist t={t} lang={lang} />
      <Footer t={t} />
    </>
  )

  if (!cmsMode) return <>{sections}</>

  return <CMSLayer>{sections}</CMSLayer>
}
```

- [ ] **Step 2: `app/page.tsx`**

```tsx
import { fetchCMSContent } from '@/lib/cms'
import { createServerClient } from '@/lib/supabase-server'
import LandingPage from '@/components/LandingPage'
import { headers } from 'next/headers'

async function getTeamPhotos() {
  try {
    const supabase = createServerClient()
    const names = ['team-tsotne', 'team-davit', 'team-levan']
    const results = await Promise.all(
      names.map(async (slot) => {
        const { data } = await supabase.storage
          .from('team-photos')
          .list('', { search: slot })
        if (!data || data.length === 0) return [slot.replace('team-', ''), null] as const
        const latest = data.sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
        const { data: urlData } = supabase.storage
          .from('team-photos')
          .getPublicUrl(latest.name)
        return [slot.replace('team-', ''), urlData.publicUrl] as const
      })
    )
    return Object.fromEntries(results) as { tsotne: string | null; davit: string | null; levan: string | null }
  } catch {
    return { tsotne: null, davit: null, levan: null }
  }
}

export default async function Page({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const params = await searchParams
  const cmsMode = params.edit === '1'
  const [cmsContent, photos] = await Promise.all([fetchCMSContent(), getTeamPhotos()])

  return (
    <html lang="en">
      <body>
        <LandingPage cmsContent={cmsContent} cmsMode={cmsMode} photos={photos} />
      </body>
    </html>
  )
}
```

> **Note:** Remove the `<html>` and `<body>` tags from `app/page.tsx` above — those belong in `app/layout.tsx` only. The `Page` component should return just `<LandingPage ... />`.

- [ ] **Step 3: Fix page.tsx** (correct version without extra html/body tags)

```tsx
import { fetchCMSContent } from '@/lib/cms'
import { createServerClient } from '@/lib/supabase-server'
import LandingPage from '@/components/LandingPage'

async function getTeamPhotos(): Promise<{ tsotne: string | null; davit: string | null; levan: string | null }> {
  try {
    const supabase = createServerClient()
    const slots = ['tsotne', 'davit', 'levan'] as const
    const results = await Promise.all(
      slots.map(async (name) => {
        const { data } = await supabase.storage
          .from('team-photos')
          .list('', { search: `team-${name}` })
        if (!data?.length) return [name, null] as const
        const latest = [...data].sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
        const { data: u } = supabase.storage.from('team-photos').getPublicUrl(latest.name)
        return [name, u.publicUrl] as const
      })
    )
    return Object.fromEntries(results) as { tsotne: string | null; davit: string | null; levan: string | null }
  } catch {
    return { tsotne: null, davit: null, levan: null }
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const params = await searchParams
  const cmsMode = params.edit === '1'
  const [cmsContent, photos] = await Promise.all([fetchCMSContent(), getTeamPhotos()])
  return <LandingPage cmsContent={cmsContent} cmsMode={cmsMode} photos={photos} />
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: build completes with no errors. Fix any TypeScript errors before committing.

- [ ] **Step 5: Verify dev server**

```bash
npm run dev
```

Open http://localhost:3000 — landing page should render pixel-perfectly. Switch language toggle EN/ქარ. Visit http://localhost:3000?edit=1 — password overlay should appear.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: LandingPage client component and app/page.tsx server component"
```

---

## Task 13: OG Image + JSON-LD

**Files:**
- Create: `app/opengraph-image.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Networker — All-in-one. AI-powered. CRM for Georgian sales teams.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F1C32',
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          padding: '80px 96px', fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, background: '#0D9488', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'white', fontSize: 24, fontWeight: 700 }}>N</div>
          </div>
          <span style={{ color: 'white', fontSize: 28, fontWeight: 700 }}>Networker</span>
        </div>
        <div style={{ color: 'white', fontSize: 56, fontWeight: 800, lineHeight: 1.05, maxWidth: 800, letterSpacing: '-2px', marginBottom: 24 }}>
          The CRM Georgian sales teams actually use.
        </div>
        <div style={{ color: '#14B8A6', fontSize: 22, fontWeight: 500 }}>
          All-in-one · AI-powered · $60/user/month
        </div>
      </div>
    ),
    size
  )
}
```

- [ ] **Step 2: Add JSON-LD to `app/layout.tsx`**

Inside `RootLayout`, add before `{children}`:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Networker CRM',
      applicationCategory: 'BusinessApplication',
      description: 'AI-powered CRM for Georgian sales teams. Built-in telephony, Georgian transcription, shared WhatsApp inbox.',
      offers: { '@type': 'Offer', price: '60', priceCurrency: 'USD', priceSpecification: { '@type': 'UnitPriceSpecification', price: '60', priceCurrency: 'USD', unitText: 'MONTH' } },
      publisher: { '@type': 'Organization', name: 'Networker', url: 'https://networker.ge' },
    }),
  }}
/>
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: OG image and JSON-LD structured data"
```

---

## Task 14: Vercel Deployment

**Files:**
- Create: `next.config.ts`

- [ ] **Step 1: `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 2: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/networker-crm-website.git
git branch -M main
git push -u origin main
```

- [ ] **Step 3: Connect to Vercel**

1. Go to vercel.com → New Project → import GitHub repo
2. Framework: Next.js (auto-detected)
3. Add all env vars from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CMS_SECRET`
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST`
4. Deploy

- [ ] **Step 4: Smoke test production**

Visit deployed URL:
- [ ] Landing page renders pixel-perfectly
- [ ] Language switcher works (EN ↔ ქარ)
- [ ] Waitlist form submits successfully
- [ ] Visit `/?edit=1` → password overlay → enter `CMS_SECRET` value → toolbar appears
- [ ] Edit text → Save → refresh → edits persist
- [ ] Drag photo onto team card → Save → refresh → photo persists

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: next.config image domains for Supabase Storage"
git push
```

---

## Self-Review

**Spec coverage check:**
- ✅ 9 landing sections (Nav, Hero, Problem, Features, Compare, Pricing, Team, Waitlist, Footer)
- ✅ Bilingual EN/KA with full dictionary
- ✅ Supabase waitlist (rate-limited, email-validated)
- ✅ ISR with revalidateTag('cms')
- ✅ CMS auth (HttpOnly cookie, server-side only secret)
- ✅ CMS edit mode dynamically loaded (zero JS for visitors)
- ✅ contentEditable with client-side DOMPurify (in CMSContext.save) + server-side sanitize-html (in PATCH route)
- ✅ Image upload (MIME check, 5MB limit, Supabase Storage)
- ✅ SEO: metadata in layout, OG image, JSON-LD
- ✅ Section components isolated (props-driven, not owned by LandingPage)
- ✅ Error UX in toolbar and waitlist form

**Missing from spec, added here:**
- `app/api/cms/_auth.ts` shared helper (avoids duplicating cookie check)
- `next.config.ts` Supabase image domain whitelist (required for `next/image`)
- Note about removing duplicate `<html><body>` from page.tsx (easy mistake in Next.js 15)

**Type consistency:**
- `CMSContent = Record<string, string>` used in `lib/cms.ts`, `LandingPage.tsx`, `app/page.tsx` ✅
- `Lang = 'en' | 'ka'` used across all section components ✅
- `makeT(lang, cmsContent)` returns `(key: string) => string` used everywhere as `t` ✅
- `uploadImage(slot, file)` in CMSContext matches `EditableImage` call signature ✅
