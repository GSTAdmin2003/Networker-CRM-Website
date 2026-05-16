# Mobile Overflow & Zoom Fix

**Date:** 2026-05-16  
**Status:** Approved

## Problem

On mobile (especially iOS Safari):
- The page overflows horizontally, allowing unintended horizontal scroll
- iOS Safari zooms in when a form input is focused (inputs are `font-size: 14px`, below the 16px threshold)
- No viewport meta tag exists

## Goals

1. Lock horizontal overflow at the HTML/body level
2. Add a modern, accessibility-safe viewport meta tag
3. Prevent iOS auto-zoom on input focus by fixing the root cause (input font-size < 16px)

## Out of Scope

- `maximum-scale=1` / `user-scalable=no` — disables pinch-zoom, harms low-vision users, may fail accessibility audits, and is unnecessary once inputs are ≥ 16px
- Any layout changes, refactoring, or new responsive breakpoints
- JavaScript-based viewport manipulation

---

## Changes

### 1. `app/layout.tsx` — Add viewport export

Add a named `viewport` export (Next.js App Router pattern — separate from `metadata`):

```ts
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}
```

No `maximumScale` or `userScalable` — the font-size fix handles the iOS focus zoom; restricting user zoom is an accessibility anti-pattern.

### 2. `styles/landing.css` — Overflow lock on html and body

Apply to both elements. Some mobile browsers handle `html` overflow inconsistently; body-level coverage ensures it works across Safari, Chrome for iOS, and Firefox for Android.

Change:
```css
html { scroll-behavior: smooth; }
```
To:
```css
html,
body {
  scroll-behavior: smooth;
  max-width: 100%;
  overflow-x: hidden;
}
```

Note: `box-sizing: border-box` is already set globally on line 1 of `landing.css` — no change needed there. No `100vw` usage was found in the codebase (a common overflow source) — no change needed.

### 3. `styles/landing.css` — Input font-size fix

iOS Safari zooms in on focus for any input with `font-size < 16px`. The waitlist inputs are the only interactive fields.

**Base styles** — change `font-size: 14px` to `font-size: 16px` on `.wl-input` and `.wl-submit`.

**`@media (max-width: 640px)` override** — change `font-size: 13.5px` to `font-size: 16px` on `.wl-input, .wl-submit`.

---

## Files Touched

| File | Change |
|------|--------|
| `app/layout.tsx` | Add `viewport` export |
| `styles/landing.css` | `html`/`body` overflow-x + max-width, `.wl-input`/`.wl-submit` font-size |

## Testing

- [ ] iOS Safari: no zoom on waitlist input focus
- [ ] iOS Safari: no horizontal scroll on any section
- [ ] iOS Safari: dynamic toolbar collapse/expand does not reveal hidden overflow
- [ ] Desktop: layout unchanged, no regression
- [ ] Android Chrome: no horizontal scroll
