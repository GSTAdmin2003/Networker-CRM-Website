# Networker CRM Landing Page — Design Spec

_2026-05-16_

## Product

B2B SaaS CRM landing page + waitlist for Networker — an AI-powered CRM built for Georgian sales teams (5–100 people). Target: SMB sales managers and investors. Story arc: problem → solution → compare → price → team → waitlist.

---

## Tech Stack

- **Next.js 15** — App Router, TypeScript, Tailwind CSS v3
- **Supabase** — Postgres (waitlist + CMS content), Storage (team photos)
- **Vercel** — deployment, env vars

---

## Page Sections (pixel-perfect from design file)

1. **Nav** — sticky frosted glass, logo + left-aligned links, language switcher (EN/ქარ), "Request access" CTA
2. **Hero** — animated pulse eyebrow, headline with teal `<em>`, sub-copy, two CTAs, 3 meta items
3. **Problem** — full-bleed navy, giant "50%" stat, bullet list
4. **Solution** — 4 feature cards in 2×2 grid with inline SVG/CSS visuals (call waveform, AI transcript, WhatsApp inbox, Kanban pipeline)
5. **Compare** — competitor table (Networker vs Salesforce/Bitrix24/Zoho/HubSpot), scrollable on mobile
6. **Pricing** — single $60 card, 2-col include list, foot notes
7. **Team** — 3 cards with photo slots (drag-to-replace), name/role/bio
8. **Waitlist** — dark CTA section, email + role form, success state
9. **Footer** — brand + nav links + copyright

---

## i18n

Full EN/ქარ dictionary already finalized in the design file. `LandingPage` holds a `lang` state, `t(key)` helper resolves from the dictionary. `html[lang]` attribute updated on switch for Georgian font tuning.

---

## Architecture

### Data flow

```
Supabase cms_content
       ↓ (server fetch at request time)
app/page.tsx (Server Component)
       ↓ initialContent prop
LandingPage (Client Component)
  ├─ language state
  ├─ cms edit state
  └─ all 8 sections
```

### CMS mode

- Activation: visit `/?edit=1` → password overlay rendered client-side
- Auth: `POST /api/cms/auth` — server reads `CMS_SECRET` env var, sets **HttpOnly, Secure, SameSite=Strict** cookie (`cms_session`)
- Session check: `GET /api/cms/auth` — server reads cookie, returns `200` or `401`
- Edit mode: floating toolbar (Save / Exit), all `[data-cms-key]` elements get `contentEditable="true"`, team photo cards get drag-drop overlay
- Save: collect all `[data-cms-key]` inner HTML + image URLs → `PATCH /api/cms` (cookie verified) → bulk upsert `cms_content`
- Exit: cookie cleared, page reloads

### Supabase tables

```sql
-- waitlist signups
create table waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text,
  lang text,
  created_at timestamptz default now()
);

-- editable content (key = "hero_h1_en", value = "<html>")
create table cms_content (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);
```

Supabase Storage bucket: `team-photos` (public read, server-only write via service role key).

### API routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/cms/auth` | POST | — | Check password, set cookie |
| `/api/cms/auth` | GET | cookie | Check if session valid |
| `/api/cms/auth` | DELETE | cookie | Clear session (logout) |
| `/api/cms` | PATCH | cookie | Bulk upsert `cms_content` |
| `/api/cms/upload` | POST | cookie | Upload image → Supabase Storage |
| `/api/waitlist` | POST | — | Insert waitlist entry |

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY   # server only — never NEXT_PUBLIC_
CMS_SECRET                  # server only — never NEXT_PUBLIC_
```

---

## File Structure

```
app/
  layout.tsx
  page.tsx                  # Server Component — fetches CMS, renders LandingPage
  api/
    cms/
      auth/route.ts
      route.ts              # PATCH save
      upload/route.ts
    waitlist/route.ts
components/
  LandingPage.tsx           # single Client Component
  cms/
    CMSProvider.tsx         # context: editMode, save, upload
    CMSToolbar.tsx          # floating Save/Exit bar
    EditableText.tsx        # wrapper that adds contentEditable in edit mode
    EditableImage.tsx       # team photo with drag-drop upload overlay
  landing/                  # section sub-components (all receive props from LandingPage)
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
  supabase-server.ts        # createClient with service role (server only)
  supabase-client.ts        # createClient with anon key (client)
  i18n.ts                   # translations dictionary + t() helper
  cms.ts                    # fetchCMSContent helper
```

---

## Design tokens (Tailwind config)

Extend Tailwind with the exact CSS custom properties from the design:
- `navy-950/900/800/700/600`, `teal-700/600/500/400/100/50`
- `ink-950/900/800/700/600/500/400/300/200/150/100/50`, `paper`
- Font families: `font-head` (Plus Jakarta Sans), `font-body` (Inter), `font-mono` (JetBrains Mono)

---

## Security

- `CMS_SECRET` never reaches the browser
- Cookie: `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
- All CMS write routes verify cookie before touching Supabase
- Supabase writes use service role key (server only); browser only has anon key
- Waitlist insert uses RLS: anon role INSERT only, no SELECT/UPDATE/DELETE
