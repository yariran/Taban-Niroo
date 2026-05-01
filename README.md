# Taban Niroo — High-Voltage Composite Insulators

Next.js 16 marketing site for **Taban Niroo · Dena Power Line Insulators (DPL)** — high-voltage composite insulators, hybrid insulators, transformer bushings, cable accessories and overhead-feeder hardware tested to IEC 61109 / 62217 / 60137 / 60099-4.

The site uses scroll-driven entrance choreography on the home feed, a typographic editorial voice on inner routes, and a quiet dark/light theme with no decorative animation in the chrome.

---

## Stack

- **Framework**: Next.js 16 (App Router · React 19 · Turbopack build)
- **Styling**: Tailwind CSS v4 · `@theme inline` tokens · CSS variables for theming
- **Type system**: TypeScript strict
- **Smooth scroll**: Lenis (disabled when `prefers-reduced-motion: reduce`)
- **Theming**: `next-themes` (system / light / dark)
- **Email**: Resend (contact form delivery)
- **Analytics**: Vercel Web Analytics (first-party, no cookies)
- **Hosting target**: Vercel (edge runtime for the OG image)

---

## Getting started

```bash
# Install dependencies
npm install

# Copy the environment template and fill in the secrets you have
cp .env.example .env.local

# Run the development server
npm run dev

# Open http://localhost:3000
```

---

## Available scripts

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Local dev server (Turbopack, hot reload)      |
| `npm run build` | Production build (Turbopack)                  |
| `npm start`     | Serves the production build                   |
| `npm run lint`  | ESLint, using the Next.js + TypeScript preset |

---

## Environment variables

See [`.env.example`](./.env.example). All variables are optional **for local development**; production behaviour depends on what is set.

| Variable               | Required for          | Description                                                                                       |
| ---------------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Production            | Canonical origin (no trailing slash). Drives sitemap, robots, OG URLs, JSON-LD canonical entries. |
| `RESEND_API_KEY`       | Contact form delivery | Resend transactional API key.                                                                     |
| `RESEND_FROM_EMAIL`    | Contact form delivery | Verified `from` address on Resend.                                                                |
| `CONTACT_TO_EMAIL`     | Optional              | Override destination inbox for contact form. Defaults to `info@taban-niroo.com`.                  |

When `RESEND_API_KEY` and `RESEND_FROM_EMAIL` are missing, the contact API still returns `{ ok: true, delivered: false }` and prints the enquiry to the server log — useful for previews and staging.

---

## Project structure

```
app/                      # Next.js App Router routes
  api/contact/            # Hardened contact endpoint
  products/[slug]/        # Per-product detail pages (SSG)
  privacy/ terms/ imprint/  # Legal pages
  error.tsx               # Route-level error boundary
  global-error.tsx        # Shell-level error boundary
  loading.tsx             # Global Suspense fallback
  manifest.ts             # PWA manifest
  opengraph-image.tsx     # Edge-runtime OG image (1200x630)
  sitemap.ts              # Dynamic XML sitemap (incl. product slugs)
  robots.ts
components/
  cookie-consent.tsx      # GDPR-friendly first-paint banner
  header.tsx              # Sticky header with mega-menu
  lenis-provider.tsx      # Smooth-scroll wiring
  legal-page-shell.tsx    # Shared shell for /privacy, /terms, /imprint
  products-mega-menu.tsx  # Hover/keyboard product mega-menu
  sections/               # Hero, footer, editorial sections
  ui/                     # Reveal animations, magnetic CTA, etc.
lib/
  products.ts             # Single source of truth for the catalogue
  site-images.ts          # Centralised asset paths
  site-url.ts             # Canonical origin helper
  utils.ts
public/
  images/                 # Catalogue photography
  videos/                 # Hero / industrial footage
```

---

## Catalogue data

The full product catalogue lives in [`lib/products.ts`](./lib/products.ts) as a typed list (`PRODUCTS`). Adding a new reference there:

1. Adds it to the `/products` catalogue grid.
2. Generates a per-product detail page at `/products/<slug>` (SSG).
3. Adds it to the dynamic sitemap.
4. Becomes available to the `ProductsMegaMenu` count.

No other file needs to change.

---

## Security & privacy

- **Strict CSP** in production (`next.config.mjs`), `X-Frame-Options: DENY`, HSTS, COOP, Permissions-Policy.
- **Honeypot + submit-time guard + IP rate limit** on the contact API.
- **Reply-To header is sanitised** before being passed into Resend.
- **No third-party tracking cookies.** Vercel Web Analytics is first-party and cookie-less; we still show a consent banner for transparency.
- **Privacy notice / Terms of use / Imprint** are linked from the footer and the cookie banner.

---

## Accessibility

- Skip-link to `#main-content` rendered on focus.
- `prefers-reduced-motion: reduce` honoured by:
  - Lenis smooth scroll (disabled),
  - Hero word entrance,
  - Cookie banner slide.
- Header mobile menu: focus trap, `aria-modal`, escape-to-close, restored focus.
- Mega-menu: keyboard openable (`Enter` / `Space` / `ArrowDown`), `Escape` closes, focus restored.
- Contact form: inline live region for status, `aria-invalid` on errors.

---

## Deployment

The site is built for Vercel. After a fresh deploy:

1. Set `NEXT_PUBLIC_SITE_URL` to the production origin.
2. (Optional) Configure `RESEND_API_KEY` + `RESEND_FROM_EMAIL` to enable email delivery from the contact form.
3. Re-deploy.

The OG image route uses the **Edge runtime** so it does not affect cold-start latency on serverless regions.

---

## License

Proprietary — © Taban Niroo. All rights reserved.
