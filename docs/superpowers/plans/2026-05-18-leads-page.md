# Leads Management Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/leads` page (CMS-only) that lists all contact form submissions with filter tabs, mass selection, and CSV download that auto-marks leads as downloaded.

**Architecture:** Server component fetches all leads via service-role Supabase client and passes them to a `LeadsTable` client component. All interactivity (filtering, selection, CSV download, optimistic status updates) lives in the client component. A new PATCH `/api/leads` endpoint marks selected rows as downloaded. The CMS toolbar gains a "Leads ↗" link.

**Tech Stack:** Next.js App Router (server + client components), Supabase (service role), `next/headers` cookies, existing `requireCMSAuth()` helper.

---

### Task 1: Database migration — add `downloaded_at` column

**Files:**
- No new files — run migration via Supabase MCP

- [ ] **Step 1: Apply migration**

Run via Supabase `apply_migration` MCP tool (project `ebywztoqzfefmxsmbsri`):

```sql
ALTER TABLE contact_messages ADD COLUMN downloaded_at timestamptz;
```

- [ ] **Step 2: Verify column exists**

Run via Supabase `execute_sql` MCP tool:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contact_messages' AND column_name = 'downloaded_at';
```

Expected: one row with `data_type = 'timestamp with time zone'`, `is_nullable = 'YES'`.

- [ ] **Step 3: Commit migration record**

```bash
git add -A
git commit -m "feat: add downloaded_at column to contact_messages"
```

---

### Task 2: PATCH `/api/leads` endpoint

**Files:**
- Create: `app/api/leads/route.ts`

- [ ] **Step 1: Create the route file**

```typescript
// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { requireCMSAuth } from '@/app/api/cms/_auth'
import { createServerClient } from '@/lib/supabase-server'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function PATCH(req: NextRequest) {
  const authError = await requireCMSAuth()
  if (authError) return authError

  const body = await req.json().catch(() => null) as Record<string, unknown> | null
  const ids = body?.ids

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids must be a non-empty array' }, { status: 400 })
  }
  if (ids.length > 500) {
    return NextResponse.json({ error: 'ids exceeds max 500' }, { status: 400 })
  }
  if (!ids.every((id) => typeof id === 'string' && UUID_RE.test(id))) {
    return NextResponse.json({ error: 'Invalid id in array' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { error } = await supabase
    .from('contact_messages')
    .update({ downloaded_at: new Date().toISOString() })
    .in('id', ids)
    .is('downloaded_at', null)

  if (error) {
    console.error('leads patch:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors related to `app/api/leads/route.ts`.

- [ ] **Step 3: Commit**

```bash
git add app/api/leads/route.ts
git commit -m "feat: add PATCH /api/leads endpoint to mark leads as downloaded"
```

---

### Task 3: `LeadsTable` client component

**Files:**
- Create: `components/leads/LeadsTable.tsx`

- [ ] **Step 1: Create the component**

```typescript
// components/leads/LeadsTable.tsx
'use client'
import { useState } from 'react'

export type Lead = {
  id: string
  phone: string
  company_name: string | null
  company_id: string | null
  rep_name: string | null
  rep_email: string | null
  industry: string | null
  industry_other: string | null
  lang: string
  created_at: string
  downloaded_at: string | null
}

type Filter = 'all' | 'new' | 'downloaded'

function buildCsv(leads: Lead[]): string {
  const header = 'phone,company_name,company_id,rep_name,rep_email,industry,industry_other,lang,submitted_at'
  const escape = (v: string | null) => {
    if (v === null || v === '') return ''
    if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`
    return v
  }
  const rows = leads.map((l) =>
    [
      escape(l.phone),
      escape(l.company_name),
      escape(l.company_id),
      escape(l.rep_name),
      escape(l.rep_email),
      escape(l.industry),
      escape(l.industry_other),
      escape(l.lang),
      escape(l.created_at.slice(0, 10)),
    ].join(',')
  )
  return [header, ...rows].join('\n')
}

function triggerDownload(csv: string) {
  const date = new Date().toISOString().slice(0, 10)
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leads-${date}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function formatIndustry(lead: Lead): string {
  if (!lead.industry) return ''
  if (lead.industry === 'other') return lead.industry_other ?? 'Other'
  return lead.industry.replace(/_/g, ' ')
}

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [downloading, setDownloading] = useState(false)

  const totalAll = leads.length
  const totalNew = leads.filter((l) => l.downloaded_at === null).length
  const totalDownloaded = leads.filter((l) => l.downloaded_at !== null).length

  const filtered =
    filter === 'new'
      ? leads.filter((l) => l.downloaded_at === null)
      : filter === 'downloaded'
      ? leads.filter((l) => l.downloaded_at !== null)
      : leads

  const allSelected = filtered.length > 0 && filtered.every((l) => selected.has(l.id))
  const downloadEnabled = selected.size > 0

  function handleFilterChange(f: Filter) {
    setFilter(f)
    setSelected(new Set())
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((l) => l.id)))
    }
  }

  async function handleDownload() {
    if (!downloadEnabled || downloading) return
    const selectedLeads = leads.filter((l) => selected.has(l.id))
    triggerDownload(buildCsv(selectedLeads))
    setDownloading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedLeads.map((l) => l.id) }),
      })
      if (res.ok) {
        const now = new Date().toISOString()
        setLeads((prev) =>
          prev.map((l) =>
            selected.has(l.id) && l.downloaded_at === null
              ? { ...l, downloaded_at: now }
              : l
          )
        )
        setSelected(new Set())
      }
    } finally {
      setDownloading(false)
    }
  }

  const cell = (v: string | null) =>
    v ? (
      <span>{v}</span>
    ) : (
      <span style={{ color: '#2a2a2a', fontStyle: 'italic', fontSize: 10 }}>—</span>
    )

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#e5e5e5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Leads</span>
          <a href="/?edit=1" style={{ fontSize: 11, color: '#555', textDecoration: 'none' }}>← Back to site</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              style={{ accentColor: '#6ee7b7' }}
            />
            Select all
          </label>
          <button
            onClick={handleDownload}
            disabled={!downloadEnabled || downloading}
            style={{
              background: downloadEnabled ? '#6ee7b7' : '#1a1a1a',
              color: downloadEnabled ? '#000' : '#444',
              border: 'none', borderRadius: 6, padding: '7px 14px',
              fontSize: 11, fontWeight: 700, cursor: downloadEnabled ? 'pointer' : 'default',
            }}
          >
            {downloading ? 'Saving…' : '↓ Download CSV'}
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #1a1a1a', display: 'flex', gap: 6 }}>
        {(['all', 'new', 'downloaded'] as Filter[]).map((f) => {
          const count = f === 'all' ? totalAll : f === 'new' ? totalNew : totalDownloaded
          const label = f === 'all' ? 'All' : f === 'new' ? 'New' : 'Downloaded'
          const active = filter === f
          return (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                background: active ? '#0d1a14' : '#111',
                border: `1px solid ${active ? '#1a3a26' : '#1e1e1e'}`,
                color: active ? '#6ee7b7' : '#555',
              }}
            >
              {label} <span style={{ color: active ? '#3a5a48' : '#3a3a3a', marginLeft: 3 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr>
              <th style={thStyle}></th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Rep name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Industry</th>
              <th style={{ ...thStyle, width: 96 }}>Submitted</th>
              <th style={{ ...thStyle, width: 72, textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: '48px 20px', textAlign: 'center', color: '#333', fontSize: 12 }}>
                  No leads
                </td>
              </tr>
            )}
            {filtered.map((lead) => {
              const isSelected = selected.has(lead.id)
              const isDone = lead.downloaded_at !== null
              return (
                <tr
                  key={lead.id}
                  onClick={() => toggleRow(lead.id)}
                  style={{
                    opacity: isDone ? 0.5 : 1,
                    background: isSelected ? '#0a1a10' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ ...tdStyle, width: 36 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(lead.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ accentColor: '#6ee7b7' }}
                    />
                  </td>
                  <td style={{ ...tdStyle, color: '#e5e5e5', fontWeight: 500 }}>{lead.phone}</td>
                  <td style={tdStyle}>{cell(lead.company_name)}</td>
                  <td style={tdStyle}>{cell(lead.company_id)}</td>
                  <td style={tdStyle}>{cell(lead.rep_name)}</td>
                  <td style={tdStyle}>{cell(lead.rep_email)}</td>
                  <td style={tdStyle}>{cell(formatIndustry(lead) || null)}</td>
                  <td style={{ ...tdStyle, color: '#444', fontSize: 10 }}>{lead.created_at.slice(0, 10)}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {isDone ? (
                      <span style={{ background: '#1a1a1a', color: '#444', fontSize: 9, padding: '2px 6px', borderRadius: 3 }}>↓ Done</span>
                    ) : (
                      <span style={{ background: '#0d1a14', color: '#6ee7b7', fontSize: 9, padding: '2px 6px', borderRadius: 3 }}>New</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#444' }}>
        <span>{selected.size > 0 ? `${selected.size} selected · ` : ''}{totalAll} total</span>
        <span>Sorted by newest first</span>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '8px 12px', color: '#444',
  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em',
  borderBottom: '1px solid #1a1a1a', background: '#0d0d0d',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px', borderBottom: '1px solid #111', color: '#aaa', verticalAlign: 'middle',
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/leads/LeadsTable.tsx
git commit -m "feat: add LeadsTable client component with filter, selection, and CSV download"
```

---

### Task 4: `/leads` server page

**Files:**
- Create: `app/leads/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
// app/leads/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { LeadsTable, type Lead } from '@/components/leads/LeadsTable'

export default async function LeadsPage() {
  const store = await cookies()
  if (store.get('cms_session')?.value !== '1') {
    redirect('/?edit=1')
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('contact_messages')
    .select('id, phone, company_name, company_id, rep_name, rep_email, industry, industry_other, lang, created_at, downloaded_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('leads fetch:', error)
  }

  return (
    <main>
      <LeadsTable initialLeads={(data ?? []) as Lead[]} />
    </main>
  )
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify the page renders**

Start dev server (`npm run dev`) and visit `http://localhost:3000/leads` without a `cms_session` cookie — should redirect to `/?edit=1`. Then log in via CMS and visit `http://localhost:3000/leads?edit=1` — should show the table.

- [ ] **Step 4: Commit**

```bash
git add app/leads/page.tsx
git commit -m "feat: add /leads server page with CMS auth guard and lead fetch"
```

---

### Task 5: Add "Leads ↗" button to CMSToolbar

**Files:**
- Modify: `components/cms/CMSToolbar.tsx`

- [ ] **Step 1: Add the Leads link before "Exit edit mode"**

Replace the button row in `CMSToolbar.tsx`. The current file at line 19 has:

```tsx
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
```

Replace with:

```tsx
      <div style={{ display: 'flex', gap: 8 }}>
        <a
          href="/leads?edit=1"
          target="_blank"
          rel="noreferrer"
          style={{
            height: 40, padding: '0 16px', background: '#111',
            border: '1px solid #1e1e1e', borderRadius: 8,
            fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#6ee7b7',
            display: 'flex', alignItems: 'center', textDecoration: 'none',
          }}
        >
          Leads ↗
        </a>
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
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Manual verification**

Visit the landing page in edit mode (`/?edit=1`). The CMS toolbar should show "Leads ↗" button (teal text, dark background) to the left of "Exit edit mode". Clicking it opens `/leads?edit=1` in a new tab.

- [ ] **Step 4: Commit**

```bash
git add components/cms/CMSToolbar.tsx
git commit -m "feat: add Leads link to CMS toolbar"
```
