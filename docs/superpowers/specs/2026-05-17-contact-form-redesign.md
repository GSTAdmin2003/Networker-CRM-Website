# Contact Form Redesign — Two-Phase Capture

**Date:** 2026-05-17

## Goal

Replace the current single-phase contact form (name + email + message) with a two-phase phone-first capture flow. Phase 1 saves the phone number immediately so we always have it even if the user abandons. Phase 2 lets the user enrich the record with company details.

## User Flow

### Phase 1
The contact modal opens showing a single phone number input and a "Send →" button. On submit, the record is created in the database immediately and the modal transitions to Phase 2 in place.

### Phase 2
The same modal now shows:
- A green success banner: "Got it. We'll be in touch. / Tell us a bit more about your company."
- Five input fields: Company name, Company ID / registration code, Your name, Work email, Industry (dropdown)
- If "Other" is selected in the Industry dropdown, a required freeform field "Specify your industry" appears below it
- A "Save details →" button submits the additional data
- The X button in the corner closes the modal at any point without submitting Phase 2

No "optional" labelling. No dismiss button. The fields are presented plainly.

After Phase 2 submits successfully, the modal closes immediately.

## API Design

### POST /api/contact
Phase 1 submission.

**Request body:**
```json
{ "phone": "+995599123456", "lang": "en" }
```

**Validation:**
- `phone`: required, non-empty string, max 30 chars
- `lang`: "en" | "ka", defaults to "en"
- Rate limit: 5 requests per IP per 15 minutes (existing mechanism)

**Response (200):**
```json
{ "ok": true, "id": "<uuid>" }
```

The `id` is held in React component state only — never put in the URL or localStorage.

### PATCH /api/contact
Phase 2 submission. Updates the row created in Phase 1.

**Request body:**
```json
{
  "id": "<uuid>",
  "company_name": "Acme Ltd",
  "company_id": "123456789",
  "rep_name": "Giorgi Beridze",
  "rep_email": "giorgi@acme.ge",
  "industry": "other",
  "industry_other": "Wine export"
}
```

**Validation:**
- `id`: required, must match an existing row
- All other fields: optional strings, max 255 chars each
- `industry_other`: required if `industry === "other"`, otherwise ignored
- `industry` must be one of the allowed values or "other"

**Response (200):**
```json
{ "ok": true }
```

## Database Migration

Table: `public.contact_messages`

**Remove columns:** `name`, `email`, `message`

**Add columns:**

| Column | Type | Nullable | Notes |
|---|---|---|---|
| `phone` | text | NOT NULL | Phase 1 |
| `company_name` | text | NULL | Phase 2 |
| `company_id` | text | NULL | Phase 2 |
| `rep_name` | text | NULL | Phase 2 |
| `rep_email` | text | NULL | Phase 2 |
| `industry` | text | NULL | Phase 2 |
| `industry_other` | text | NULL | Phase 2, required in app if industry = 'other' |

Existing columns kept: `id`, `lang`, `created_at`.

Since the table has 0 rows, dropping and re-adding columns is safe with no data migration needed.

## Industry Dropdown Options

Values stored in the DB (lowercase, snake_case for the `industry` column):

| Label | Stored value |
|---|---|
| Construction | `construction` |
| Real Estate | `real_estate` |
| Accounting & Finance | `accounting_finance` |
| Retail | `retail` |
| Marketing & Advertising | `marketing_advertising` |
| Wholesale & Distribution | `wholesale_distribution` |
| Logistics | `logistics` |
| IT & Technology | `it_technology` |
| Manufacturing | `manufacturing` |
| Healthcare | `healthcare` |
| Legal | `legal` |
| Other | `other` |

## Component Changes

### ContactModal.tsx
- Replace name/email/message fields with phone-only Phase 1 form
- Add `phase` state: `'1' | '2' | 'done'`
- Add `contactId` state to hold the UUID returned from Phase 1
- Phase 2 form: company_name, company_id, rep_name, rep_email, industry select, conditional industry_other input
- industry_other field appears (and becomes required) when industry === 'other'
- On Phase 2 submit: PATCH /api/contact; on success set phase to 'done' and close or show brief confirmation

### i18n.ts
Update/add keys for Phase 1 and Phase 2 labels in both `en` and `ka`.

Keys to add (en):
- `contact_sub` → "Drop your number and we'll call you back."
- `contact_ph_phone` → "+995 5XX XXX XXX"
- `contact_ok_title` → "Got it. We'll be in touch."
- `contact_ok_body` → "Tell us a bit more about your company."
- `contact_ph_company_name` → "Company name"
- `contact_ph_company_id` → "Company ID / registration code"
- `contact_ph_rep_name` → "Your name"
- `contact_ph_rep_email` → "Work email"
- `contact_ph_industry` → "Industry"
- `contact_ph_industry_other` → "Specify your industry"
- `contact_submit_details` → "Save details →"

Keys to remove: `contact_ph_name`, `contact_ph_email`, `contact_ph_message`

### app/api/contact/route.ts
- Change POST handler: accept `phone` only, return `{ ok, id }`
- Add PATCH handler: accept `id` + optional detail fields, update the row

## RLS Policy

No changes needed. Both API routes use `createServerClient()` which connects with the Supabase service role key, bypassing RLS entirely on the server side.

## Out of Scope
- Email notifications on submission
- Admin UI for viewing submissions
- Any changes to the waitlist form
