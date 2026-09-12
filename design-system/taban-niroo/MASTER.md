# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Taban Niroo
**Generated:** 2026-08-12 02:27:19 by `ui-ux-pro-max --design-system --persist`
**Category:** B2B Service
**Design Dials:** Variance 8/10 (Bold / Asymmetric) | Density 4/10 (Standard)

> ### ⚠️ Reconciled against the codebase — read this before trusting any value
>
> The generator builds from a text query, not from this repository. Its raw
> output proposed a **navy + blue** palette (`#0F172A` / `#0369A1`) and
> **Plus Jakarta Sans**, none of which this project uses. Adopting that as-is
> would have repainted a shipped site and replaced both typefaces.
>
> The Colour and Typography sections below have therefore been replaced with
> the values actually defined in `app/globals.css`. Everything else — spacing,
> shadows, component specs, page pattern, anti-patterns, checklist — is the
> generator's output, unedited.
>
> **`app/globals.css` is the source of truth for colour and type. This file
> defers to it.** If the two ever disagree, the stylesheet wins.

---

## Global Rules

### Color Palette

*Values below are read from `app/globals.css` `:root`, not from the generator.*

| Role | Hex | CSS Variable | Note |
|------|-----|--------------|------|
| Ground (light) | `#F4F5F6` | `--background` | Generator proposed `#F8FAFC` — near-identical, project value kept |
| Surface / card | `#FFFFFF` | `--card` | Matches generator |
| Primary type | `#15171A` | `--brand-navy` | Graphite, **not** blue-tinted navy |
| Scene ground | `#0A0B0D` | `--brand-navy-deep` | Dark in BOTH themes |
| Accent on dark | `#E3B34E` | `--brand-orange` | The single gold |
| Accent on light | `#7D5C17` | `--brand-burgundy` | Darkened gold — `#E3B34E` is ~1.9:1 on white |
| Muted type | `#5A6068` | `--muted-foreground` | |
| Border | `#DDE0E3` | `--border` | |
| Destructive | `#7A1F2B` | `--destructive` | |

**Color Notes:** Graphite ground with exactly **one** accent hue (gold). This
satisfies the "single vibrant accent only" rule shared by Swiss Modernism 2.0
and Exaggerated Minimalism. Do not introduce a second accent.

Token *names* are historical (`--brand-navy`, `--brand-orange`); read them by
role, not by name — see the comment block at the top of `app/globals.css`.

### Typography

*Self-hosted via `next/font/google` in `app/layout.tsx`, not a CDN import.*

- **Heading Font:** Oswald — `.font-hero-slogan`, `.font-headline`, `.font-hero`
- **Body / UI Font:** Inter — `.font-sans`
- **Cinematic voice:** `.type-cinema` — Inter Light 300, sentence case, never uppercase
- **Monospace:** currently a *system stack*, not a self-hosted face. Specs, IEC
  codes and catalogue refs therefore render differently per OS. Candidate fix:
  IBM Plex Mono (OFL) from the `ui-styling` skill's `canvas-fonts/`.

Swiss Modernism 2.0 asks for "Inter/Helvetica" — already satisfied by Inter.
Do **not** add Plus Jakarta Sans; it was a generator artefact.

### Spacing Variables

*Density: 4/10 — Standard*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #0369A1;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #0F172A;
  border: 2px solid #0F172A;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #0F172A;
  outline: none;
  box-shadow: 0 0 0 3px #0F172A20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Kinetic Brutalism (Mobile)

**Keywords:** kinetic, brutalism, motion, marquee, acid yellow, uppercase, oversized, aggressive typography, street, zine, high contrast, scroll-driven, haptic, reanimated

**Best For:** Immersive storytelling apps, brand flagship mobile, music/culture platforms, sports apps, underground zines, limited-edition product drops, performance dashboards

**Key Effects:** Infinite marquee (Reanimated, Linear easing, 5s loop, hard clip), hero parallax (scale 1.0→1.3 + fade), sticky section header push, card flood inversion on press (bg→#DFE104, text→#000000), haptic Medium on every press, scroll-triggered interpolate transforms, 0px radius, 2px borders, 100ms color transitions

### Page Pattern

**Pattern Name:** Trust & Authority + Conversion

- **Conversion Strategy:** Security badges. Case studies. Transparent pricing. Low-friction form.
- **CTA Placement:** Contact Sales / Get Quote (primary) + Nav
- **Section Order:** 1. Hero (mission/credibility), 2. Proof (logos, certs, stats), 3. Solution overview, 4. Clear CTA path

---

## Anti-Patterns (Do NOT Use)

- ❌ Playful design
- ❌ Hidden credentials
- ❌ AI purple/pink gradients

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
