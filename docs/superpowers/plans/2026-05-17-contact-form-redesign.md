# Contact Form Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-phase contact form with a two-phase phone-first capture flow that saves the phone number immediately on Phase 1 submit, then optionally collects company details in Phase 2.

**Architecture:** Phase 1 POSTs `{ phone, lang }` to `/api/contact`, which inserts a row and returns its UUID. Phase 2 PATCHes `/api/contact` with that UUID + optional company fields to update the same row. The UUID is held only in React state — never in URL or storage.

**Tech Stack:** Next.js App Router, React (hooks), TypeScript, Supabase (service role client), existing `rateLimit` utility, existing i18n system (`lib/i18n.ts`).

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| Supabase DB | Migrate | Drop old columns, add new columns |
| `app/api/contact/route.ts` | Modify | POST saves phone + returns id; PATCH updates details |
| `lib/i18n.ts` | Modify | Add/update/remove contact form i18n keys (en + ka) |
| `components/landing/ContactModal.tsx` | Rewrite | Two-phase form UI |

---

## Task 1: Database Migration

**Files:**
- Supabase project: `ebywztoqzfefmxsmbsri`

- [ ] **Step 1: Apply migration via Supabase MCP**

Use `mcp__plugin_supabase_supabase__apply_migration` with project_id `ebywztoqzfefmxsmbsri` and this SQL:

```sql
ALTER TABLE contact_messages
  DROP COLUMN IF EXISTS name,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS message,
  ADD COLUMN phone        text NOT NULL,
  ADD COLUMN company_name text,
  ADD COLUMN company_id   text,
  ADD COLUMN rep_name     text,
  ADD COLUMN rep_email    text,
  ADD COLUMN industry     text,
  ADD COLUMN industry_other text;
```

- [ ] **Step 2: Verify migration**

Use `mcp__plugin_supabase_supabase__list_tables` (verbose: true) and confirm:
- Columns `name`, `email`, `message` are gone
- Columns `phone`, `company_name`, `company_id`, `rep_name`, `rep_email`, `industry`, `industry_other` are present

- [ ] **Step 3: Commit**

```bash
git commit --allow-empty -m "feat: migrate contact_messages table to phone-first schema"
```

---

## Task 2: Update API Route

**Files:**
- Modify: `app/api/contact/route.ts`

- [ ] **Step 1: Replace the file entirely**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rate-limit'

const ALLOWED_INDUSTRIES = [
  'construction', 'real_estate', 'accounting_finance', 'retail',
  'marketing_advertising', 'wholesale_distribution', 'logistics',
  'it_technology', 'manufacturing', 'healthcare', 'legal', 'other',
]

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await req.json().catch(() => null) as Record<string, unknown> | null
  const phone = String(body?.phone ?? '').trim()
  const lang = String(body?.lang ?? 'en')

  if (!phone || phone.length > 30) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
  }

  const safeLang = lang === 'ka' ? 'ka' : 'en'

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({ phone, lang: safeLang })
    .select('id')
    .single()

  if (error || !data) {
    console.error('contact insert:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: data.id })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => null) as Record<string, unknown> | null
  const id = String(body?.id ?? '').trim()

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const company_name    = String(body?.company_name ?? '').trim().slice(0, 255) || null
  const company_id      = String(body?.company_id ?? '').trim().slice(0, 255) || null
  const rep_name        = String(body?.rep_name ?? '').trim().slice(0, 255) || null
  const rep_email       = String(body?.rep_email ?? '').trim().toLowerCase().slice(0, 255) || null
  const rawIndustry     = String(body?.industry ?? '').trim()
  const industry        = ALLOWED_INDUSTRIES.includes(rawIndustry) ? rawIndustry : null
  const industry_other  = String(body?.industry_other ?? '').trim().slice(0, 255) || null

  if (industry === 'other' && !industry_other) {
    return NextResponse.json({ error: 'Please specify your industry' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { error } = await supabase
    .from('contact_messages')
    .update({
      company_name,
      company_id,
      rep_name,
      rep_email,
      industry,
      industry_other: industry === 'other' ? industry_other : null,
    })
    .eq('id', id)

  if (error) {
    console.error('contact update:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors in `app/api/contact/route.ts`.

- [ ] **Step 3: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "feat: update contact API — POST returns id, add PATCH for details"
```

---

## Task 3: Update i18n Keys

**Files:**
- Modify: `lib/i18n.ts`

- [ ] **Step 1: Update English keys**

In the `en` block, make these changes:

**Replace** the old contact keys block:
```ts
contact_eyebrow: 'Get in touch',
contact_title: 'Contact us',
contact_sub: 'Have a question or want to learn more? Send us a message and we\'ll get back to you.',
contact_ph_name: 'Your name',
contact_ph_email: 'Work email',
contact_ph_message: 'Your message…',
contact_submit: 'Send message',
contact_ok_title: 'Message received.',
contact_ok_body: 'Thanks for reaching out. We\'ll get back to you within one business day.',
```

**With:**
```ts
contact_eyebrow: 'Get in touch',
contact_title: 'Contact us',
contact_sub: 'Drop your number and we\'ll call you back.',
contact_ph_phone: '+995 5XX XXX XXX',
contact_submit: 'Send →',
contact_ok_title: 'Got it. We\'ll be in touch.',
contact_ok_body: 'Tell us a bit more about your company.',
contact_ph_company_name: 'Company name',
contact_ph_company_id: 'Company ID / registration code',
contact_ph_rep_name: 'Your name',
contact_ph_rep_email: 'Work email',
contact_ph_industry: 'Industry',
contact_ph_industry_other: 'Specify your industry',
contact_submit_details: 'Save details →',
```

- [ ] **Step 2: Update Georgian keys**

In the `ka` block, make these changes:

**Replace** the old contact keys block:
```ts
contact_eyebrow: 'დაგვიკავშირდით',
contact_title: 'კონტაქტი',
contact_sub: 'გაქვთ კითხვა ან გსურთ მეტი იცოდეთ? გამოგვიგზავნეთ შეტყობინება.',
contact_ph_name: 'თქვენი სახელი',
contact_ph_email: 'სამუშაო ელფოსტა',
contact_ph_message: 'შეტყობინება…',
contact_submit: 'გაგზავნა',
contact_ok_title: 'შეტყობინება მიღებულია.',
contact_ok_body: 'გმადლობთ კავშირისთვის. ერთი სამუშაო დღის განმავლობაში დაგიკავშირდებით.',
```

**With:**
```ts
contact_eyebrow: 'დაგვიკავშირდით',
contact_title: 'კონტაქტი',
contact_sub: 'დაგვიტოვეთ ნომერი და ჩვენ დაგიკავშირდებით.',
contact_ph_phone: '+995 5XX XXX XXX',
contact_submit: 'გაგზავნა →',
contact_ok_title: 'მიღებულია. დაგიკავშირდებით.',
contact_ok_body: 'მოგვიყევით თქვენი კომპანიის შესახებ.',
contact_ph_company_name: 'კომპანიის სახელი',
contact_ph_company_id: 'საიდენტიფიკაციო კოდი',
contact_ph_rep_name: 'თქვენი სახელი',
contact_ph_rep_email: 'სამუშაო ელფოსტა',
contact_ph_industry: 'სფერო',
contact_ph_industry_other: 'მიუთითეთ სფერო',
contact_submit_details: 'შენახვა →',
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/i18n.ts
git commit -m "feat: update contact i18n keys for two-phase phone form"
```

---

## Task 4: Rewrite ContactModal

**Files:**
- Modify: `components/landing/ContactModal.tsx`

- [ ] **Step 1: Replace the file entirely**

```tsx
'use client'
import { useState, useEffect, useRef, FormEvent } from 'react'
import { Lang } from '@/lib/i18n'

const INDUSTRIES = [
  { value: 'construction',           label: 'Construction' },
  { value: 'real_estate',            label: 'Real Estate' },
  { value: 'accounting_finance',     label: 'Accounting & Finance' },
  { value: 'retail',                 label: 'Retail' },
  { value: 'marketing_advertising',  label: 'Marketing & Advertising' },
  { value: 'wholesale_distribution', label: 'Wholesale & Distribution' },
  { value: 'logistics',              label: 'Logistics' },
  { value: 'it_technology',          label: 'IT & Technology' },
  { value: 'manufacturing',          label: 'Manufacturing' },
  { value: 'healthcare',             label: 'Healthcare' },
  { value: 'legal',                  label: 'Legal' },
  { value: 'other',                  label: 'Other' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  t: (key: string) => string
  lang: Lang
}

export function ContactModal({ isOpen, onClose, t, lang }: Props) {
  const [phase, setPhase] = useState<'1' | '2'>('1')
  const [contactId, setContactId] = useState('')
  const [industry, setIndustry] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    setPhase('1')
    setContactId('')
    setIndustry('')
    setError('')
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  async function handlePhase1(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = e.currentTarget
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim()
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setContactId(data.id)
      setPhase('2')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handlePhase2(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | null)?.value.trim() ?? ''
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: contactId,
          company_name: getValue('company_name'),
          company_id:   getValue('company_id'),
          rep_name:     getValue('rep_name'),
          rep_email:    getValue('rep_email'),
          industry,
          industry_other: industry === 'other' ? getValue('industry_other') : '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="contact-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t('contact_title')}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="contact-panel" ref={panelRef} tabIndex={-1}>
        <button className="contact-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {phase === '1' && (
          <>
            <div className="contact-eyebrow">{t('contact_eyebrow')}</div>
            <h2 className="contact-title">{t('contact_title')}</h2>
            <p className="contact-sub">{t('contact_sub')}</p>
            <form className="contact-form" onSubmit={handlePhase1} noValidate>
              <input
                type="tel" name="phone" required
                className="contact-input"
                placeholder={t('contact_ph_phone')}
                autoComplete="tel"
                maxLength={30}
              />
              {error && <p className="contact-error">{error}</p>}
              <button className="contact-submit" type="submit" disabled={loading}>
                {loading ? '…' : (
                  <>
                    <span>{t('contact_submit')}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {phase === '2' && (
          <>
            <div className="contact-success" role="status" aria-live="polite">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <div>
                <div className="contact-success-title">{t('contact_ok_title')}</div>
                <div className="contact-success-body">{t('contact_ok_body')}</div>
              </div>
            </div>
            <form className="contact-form" onSubmit={handlePhase2} noValidate>
              <input
                type="text" name="company_name"
                className="contact-input"
                placeholder={t('contact_ph_company_name')}
                maxLength={255}
              />
              <input
                type="text" name="company_id"
                className="contact-input"
                placeholder={t('contact_ph_company_id')}
                maxLength={255}
              />
              <input
                type="text" name="rep_name"
                className="contact-input"
                placeholder={t('contact_ph_rep_name')}
                maxLength={255}
              />
              <input
                type="email" name="rep_email"
                className="contact-input"
                placeholder={t('contact_ph_rep_email')}
              />
              <select
                name="industry"
                className="contact-input"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">{t('contact_ph_industry')}</option>
                {INDUSTRIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {industry === 'other' && (
                <input
                  type="text" name="industry_other" required
                  className="contact-input"
                  placeholder={t('contact_ph_industry_other')}
                  maxLength={255}
                />
              )}
              {error && <p className="contact-error">{error}</p>}
              <button className="contact-submit" type="submit" disabled={loading}>
                {loading ? '…' : (
                  <>
                    <span>{t('contact_submit_details')}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Smoke test in browser**

Start dev server if not running:
```bash
npm run dev
```

Open the site, click "Contact" in the nav or footer. Verify:
1. Modal opens showing only the phone input and "Send →" button
2. Submit with a test number — modal transitions to Phase 2
3. Phase 2 shows success banner + all five fields (no phone field)
4. Select "Other" from Industry dropdown — "Specify your industry" field appears
5. Select any other industry — the extra field disappears
6. Submit Phase 2 — modal closes
7. Check Supabase `contact_messages` table — one row with phone filled, and details if you filled them in
8. Open modal again — it resets to Phase 1

- [ ] **Step 4: Commit**

```bash
git add components/landing/ContactModal.tsx
git commit -m "feat: two-phase contact modal — phone first, company details second"
```
