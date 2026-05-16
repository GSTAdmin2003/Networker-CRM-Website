# Mobile Overflow & Zoom Fix

**Date:** 2026-05-16  
**Status:** Approved

## Problem

On mobile (especially iOS Safari):
- The page overflows horizontally, allowing unintended horizontal scroll
- iOS Safari zooms in when a form input is focused (inputs are `font-size: 14px`, below the 16px threshold)
- No viewport meta tag exists to constrain scale

## Goals

1. Lock horizontal overflow at the HTML level
2. Prevent pinch-to-zoom and tap-to-zoom via viewport meta
3. Prevent iOS auto-zoom on input focus by fixing the root cause (input font-size < 16px)

## Out of Scope

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
  maximumScale: 1,
  userScalable: false,
}
```

Renders as:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

### 2. `styles/landing.css` — HTML overflow lock

Change:
```css
html { scroll-behavior: smooth; }
```
To:
```css
html { scroll-behavior: smooth; overflow-x: hidden; }
```

### 3. `styles/landing.css` — Input font-size fix

iOS Safari zooms in on focus for any input with `font-size < 16px`. The waitlist inputs are the only interactive fields.

**Base styles** — change `font-size: 14px` to `font-size: 16px` on `.wl-input` and `.wl-submit`.

**`@media (max-width: 640px)` override** — change `font-size: 13.5px` to `font-size: 16px` on `.wl-input, .wl-submit`.

---

## Files Touched

| File | Change |
|------|--------|
| `app/layout.tsx` | Add `viewport` export |
| `styles/landing.css` | `html` overflow-x, `.wl-input`/`.wl-submit` font-size |

## Testing

- [ ] iOS Safari: no zoom on waitlist input focus
- [ ] iOS Safari: no horizontal scroll on any section
- [ ] Desktop: layout unchanged, no regression
- [ ] Android Chrome: no horizontal scroll
