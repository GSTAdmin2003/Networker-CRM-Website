# Mobile Overflow & Zoom Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix horizontal overflow on mobile and prevent iOS Safari auto-zoom on input focus across the Networker CRM landing page.

**Architecture:** Three surgical edits across two files — a viewport meta export in the Next.js root layout, an overflow lock on `html` and `body` in the global CSS, and a font-size bump on the waitlist inputs to cross the iOS 16px zoom threshold.

**Tech Stack:** Next.js 15 App Router (TypeScript), plain CSS (`styles/landing.css`)

---

## File Map

| File | Change |
|------|--------|
| `app/layout.tsx` | Add named `viewport` export alongside existing `metadata` export |
| `styles/landing.css` | Add `overflow-x: hidden` + `max-width: 100%` to `html`/`body`; bump `.wl-input`/`.wl-submit` font-size to `16px` in base and `@media (max-width: 640px)` |

---

### Task 1: Add viewport meta export to `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

Context: Next.js App Router separates viewport configuration from `metadata`. The `viewport` export is a typed object — do not add a `<meta>` tag manually to the JSX. The existing file has no viewport export at all.

- [ ] **Step 1: Add the `Viewport` import and export**

Open `app/layout.tsx`. The current import line is:

```ts
import type { Metadata } from 'next'
```

Change it to:

```ts
import type { Metadata, Viewport } from 'next'
```

Then add this export directly after the `metadata` export (around line 25, before the font declarations):

```ts
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}
```

The full top of the file should now look like:

```ts
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import '@/app/globals.css'
import '@/styles/landing.css'

// ... font declarations ...

export const metadata: Metadata = {
  // ... existing metadata ...
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}
```

- [ ] **Step 2: Verify the build compiles**

```bash
cd "/home/shuubb/Desktop/Code Base/Networker CRM Website" && npx next build 2>&1 | tail -20
```

Expected: build completes without TypeScript errors. If you see `Type 'Viewport' is not exported from 'next'`, the installed Next.js version doesn't support the typed export — fall back to adding `<meta name="viewport" content="width=device-width, initial-scale=1" />` inside the `<head>` in `RootLayout`.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add viewport meta export to root layout"
```

---

### Task 2: Lock horizontal overflow in `styles/landing.css`

**Files:**
- Modify: `styles/landing.css`

Context: The current `html` rule (line 32) is `html { scroll-behavior: smooth; }`. There is no `body` overflow rule. Both need to be updated — some mobile browsers handle `html`-level overflow inconsistently, so covering both is the safe approach.

- [ ] **Step 1: Update the `html` rule and add `body` overflow**

Find this rule in `styles/landing.css` (line 32):

```css
html { scroll-behavior: smooth; }
```

Replace it with:

```css
html,
body {
  scroll-behavior: smooth;
  max-width: 100%;
  overflow-x: hidden;
}
```

- [ ] **Step 2: Verify the dev server starts and the page loads without horizontal scroll**

```bash
cd "/home/shuubb/Desktop/Code Base/Networker CRM Website" && npx next dev --port 3000
```

Open `http://localhost:3000` in a browser. Resize to a narrow viewport (< 400px). Confirm no horizontal scrollbar appears and no content is cut off.

- [ ] **Step 3: Commit**

```bash
git add styles/landing.css
git commit -m "fix: lock horizontal overflow on html and body for mobile"
```

---

### Task 3: Fix input font-size to prevent iOS Safari zoom on focus

**Files:**
- Modify: `styles/landing.css`

Context: iOS Safari automatically zooms in when a focused input has `font-size < 16px`. The waitlist inputs (`.wl-input`, `.wl-submit`) are currently `14px` in the base styles and overridden to `13.5px` in the `@media (max-width: 640px)` block. Both need to be `16px`.

- [ ] **Step 1: Fix base font-size for `.wl-input` and `.wl-submit`**

Find this rule in `styles/landing.css` (around line 953–981):

```css
.wl-input {
  height: 48px;
  padding: 0 16px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  color: white;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 14px;
  ...
}
```

Change `font-size: 14px` → `font-size: 16px`.

Then find the `.wl-submit` rule (around line 973):

```css
.wl-submit {
  height: 48px;
  padding: 0 24px;
  ...
  font-size: 14px; font-weight: 600;
  ...
}
```

Change `font-size: 14px` → `font-size: 16px`.

- [ ] **Step 2: Fix the `@media (max-width: 640px)` override**

Find this line inside the `@media (max-width: 640px)` block (around line 221):

```css
  .wl-input, .wl-submit { height: 44px; font-size: 13.5px; }
```

Change `font-size: 13.5px` → `font-size: 16px`:

```css
  .wl-input, .wl-submit { height: 44px; font-size: 16px; }
```

- [ ] **Step 3: Verify visually on mobile viewport**

With the dev server running (`npx next dev --port 3000`), open Chrome DevTools, toggle device toolbar, select iPhone 12 Pro (or similar). Scroll to the waitlist section. Confirm the input and submit button text looks appropriately sized — `16px` is slightly larger than before but should still look clean.

- [ ] **Step 4: Commit**

```bash
git add styles/landing.css
git commit -m "fix: bump waitlist input font-size to 16px to prevent iOS Safari zoom on focus"
```

---

## Manual Testing Checklist

After all tasks are complete, verify on a real or emulated device:

- [ ] iOS Safari: tap the email input in the waitlist section — page does **not** zoom in
- [ ] iOS Safari: tap the company/team-size select — page does **not** zoom in
- [ ] iOS Safari: scroll the page — no horizontal scroll at any breakpoint
- [ ] iOS Safari: collapse and expand the browser toolbar during scroll — no layout shift reveals hidden overflow
- [ ] Desktop Chrome: page looks identical to before
- [ ] Android Chrome: no horizontal scroll
