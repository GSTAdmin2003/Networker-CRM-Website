# Leads Management Page — Design Spec

**Date:** 2026-05-18

## Goal

Add a `/leads` page accessible only in `edit=1` mode (requires `cms_session` cookie) that lists all contact form submissions with filters, mass selection, and CSV download. Downloading automatically marks selected leads as downloaded.

## User Flow

1. From the landing page in edit mode, user clicks **"Leads ↗"** in the CMS toolbar — opens `/leads?edit=1` in a new tab (or navigates to it).
2. The page shows all leads, newest first, in a table.
3. User can filter by **All / New / Downloaded** tab.
4. User checks individual rows or uses **Select all** to mass-select.
5. **Download CSV** button (disabled when nothing selected) becomes active.
6. Clicking Download CSV:
   - Generates a CSV file from the selected rows and triggers a browser download.
   - Calls `PATCH /api/leads` with the selected IDs.
   - Server sets `downloaded_at = now()` on those rows.
   - Client optimistically updates those rows' status badge to "↓ Done" and dims them.
7. User can click **← Back to site** to return to the landing page.

## Authentication

The page is a Next.js server component. It reads the `cms_session` cookie server-side using `next/headers`. If the cookie is absent or not `'1'`, it redirects to `/?edit=1` via `redirect()`. No client-side auth check is needed — the server never renders the page for unauthenticated users.

The PATCH API endpoint uses the existing `requireCMSAuth()` helper from `app/api/cms/_auth.ts`.

## Database Migration

Add one column to `contact_messages`:

```sql
ALTER TABLE contact_messages ADD COLUMN downloaded_at timestamptz;
```

Nullable. `NULL` means not yet downloaded. Non-null means downloaded at that timestamp.

## API

### PATCH /api/leads

Marks a set of leads as downloaded.

**Request body:**
```json
{ "ids": ["uuid1", "uuid2"] }
```

**Validation:**
- Requires `cms_session` cookie (uses `requireCMSAuth()`)
- `ids`: non-empty array of strings, max 500 items
- Each id validated as UUID format

**Behavior:**
- Sets `downloaded_at = now()` on all matching rows where `downloaded_at IS NULL` (idempotent — already-downloaded rows are unaffected)

**Response (200):**
```json
{ "ok": true }
```

## Page Structure

### `app/leads/page.tsx` (Server Component)

- Checks `cms_session` cookie; redirects to `/?edit=1` if missing
- Fetches all rows from `contact_messages` ordered by `created_at DESC` using service role client
- Passes leads array to `<LeadsTable>` client component
- Minimal markup: a wrapping `<main>` and the client component

### `components/leads/LeadsTable.tsx` (Client Component)

All interactivity lives here. Receives the full leads array as a prop (type defined in same file).

**State:**
- `filter`: `'all' | 'new' | 'downloaded'`
- `selected`: `Set<string>` of selected lead IDs
- `leads`: local copy of the leads array (used for optimistic downloaded_at updates)

**Derived values (computed from state, no extra state):**
- `filtered`: leads filtered by current tab
- `allSelected`: whether all filtered rows are selected
- `downloadEnabled`: `selected.size > 0`

**Filter tabs:** All (total count) / New (count where downloaded_at IS NULL) / Downloaded (count where downloaded_at IS NOT NULL). Counts always reflect the full unfiltered dataset — they update optimistically when rows are marked downloaded. Changing filter clears the selection.

**Select all checkbox:** selects/deselects all rows currently visible in the active filter.

**Download CSV:**
1. Build CSV string from selected leads (columns: phone, company_name, company_id, rep_name, rep_email, industry, industry_other, lang, created_at)
2. Trigger browser download via `URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))` + anchor click
3. Call `PATCH /api/leads` with selected IDs
4. On success: update local `leads` state — set `downloaded_at` to current timestamp on affected rows, clear selection

**Table columns:** checkbox · Phone · Company · ID · Rep name · Email · Industry · Submitted (date only) · Status (New / ↓ Done)

Empty optional fields shown as `—`.

Downloaded rows: dimmed with `opacity: 0.5`, status badge shows "↓ Done".

### `components/cms/CMSToolbar.tsx`

Add a **"Leads ↗"** button that opens `/leads?edit=1` in a new tab (`target="_blank"`), styled as a secondary action (dark background, teal text), placed to the left of "Exit edit mode".

## CSV Format

Filename: `leads-YYYY-MM-DD.csv` (using the download date).

Header row + one row per lead:
```
phone,company_name,company_id,rep_name,rep_email,industry,industry_other,lang,submitted_at
```

Values with commas or quotes are wrapped in double-quotes with internal quotes escaped as `""`.

## Columns Not Shown

`id` and `downloaded_at` are not included in the CSV (internal fields). They are present in the in-memory leads array for logic but not exported.

## Out of Scope

- Pagination (leads list is small for now)
- Sorting by column click
- Deleting leads
- Inline editing of lead fields
- Real-time refresh (page reflects state at load time; user refreshes manually if needed)
