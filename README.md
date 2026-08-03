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

See [`.env.example`](./.env.example).

| Variable | Required for | Description |
| -------- | ------------ | ----------- |
| `NEXT_PUBLIC_SITE_URL` | Production SEO | Canonical origin (no trailing slash). |
| `RESEND_API_KEY` | Contact form | Resend API key. **Required in production** or contact returns 503. |
| `RESEND_FROM_EMAIL` | Contact form | Verified `from` address on Resend. |
| `CONTACT_TO_EMAIL` | Optional | Destination inbox (default `info@taban-niroo.com`). |
| `RESEND_AUDIENCE_ID` | Newsletter | Resend Audience id for real subscriber storage. |
| `NEXT_PUBLIC_NEWSLETTER_ENABLED` | Newsletter UI | Set `true` only after Audience is configured (footer form stays hidden otherwise). |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate limits | **Required in production.** Without these, a strict in-memory fallback is used (not durable across Vercel instances). |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Search Console HTML-tag token. |
| `CMS_ADMIN_USERNAME` | Admin CMS | Login username (default `admin`). |
| `CMS_ADMIN_PASSWORD` | Admin CMS | Password for `/admin` (Persian dashboard). **Never commit.** |
| `CMS_SESSION_SECRET` | Admin CMS | HMAC secret for signed session cookies (≥16 chars). **Required for production.** |
| `CMS_SESSION_VERSION` | Admin CMS | Bump to revoke all CMS sessions. |
| `CMS_INTERNAL_KEY` | Admin CMS | Optional key for server-to-server calls (`x-cms-internal` header). |
| `BLOB_READ_WRITE_TOKEN` | Admin CMS on Vercel | Vercel Blob store token. **Required in production** so uploads and manifests persist. |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | Optional | Error reporting to Sentry (API + client boundaries). |

Validate before deploy:

```bash
npm run check-env          # lists missing vars
npm run check-env:strict   # exits 1 if anything required is missing
```

`GET /api/health` returns `503` in production when any required env is missing.

CI runs `lint` + `test` + `build` on every push/PR (see `.github/workflows/ci.yml`).

### Persian admin CMS (for the client)

Full-site content management at `/admin` (Persian RTL panel; public site stays English):

1. On Vercel: **Storage → Create Blob Store** → copy `BLOB_READ_WRITE_TOKEN` into env.
2. Set a strong `CMS_ADMIN_PASSWORD` + `CMS_SESSION_SECRET` (≥16 random chars).
3. Set Resend + Upstash (see checklist below).
4. Redeploy.
5. Open `https://www.taban-niroo.com/admin/login`, sign in.
6. **Products** → «بارگذاری از کاتالوگ فعلی» to seed the catalogue, then edit / add / delete products (including variants and technical tables).
7. **Gallery** — homepage product gallery photos.
8. **Content** — home sections, About / Projects / Contact / Footer copy and images.
9. **Blog** — draft / publish articles (`/blog` and `/blog/[slug]`).

If CMS data is empty or Blob is offline, the live site falls back to the code defaults (`lib/products.ts`, `lib/site-images.ts`, hardcoded section copy).

Locally (without Blob): manifests save under `data/` and uploads under `public/uploads/cms`.

### Production deploy checklist (critical)

1. Set `NEXT_PUBLIC_SITE_URL=https://www.taban-niroo.com`
2. Set `RESEND_API_KEY` + `RESEND_FROM_EMAIL` (verify domain in Resend)
3. Set Upstash Redis REST credentials for rate limiting
4. Set `CMS_ADMIN_PASSWORD` + `CMS_SESSION_SECRET` + `BLOB_READ_WRITE_TOKEN`
5. Run `npm run check-env:strict` (or confirm `/api/health` returns `"status":"ok"`)
6. Optionally enable newsletter: create Resend Audience → `RESEND_AUDIENCE_ID` + `NEXT_PUBLIC_NEWSLETTER_ENABLED=true`
7. Redeploy after env changes
8. Sign in once at `/admin/login` (old cookies are invalid after session-secret changes)

---

## Project structure

```
app/                      # Next.js App Router routes
  admin/                  # Persian RTL CMS (products, gallery, content, blog)
  api/contact/            # Hardened contact endpoint
  api/cms/                # CMS auth, products, content, blog, gallery, upload
  products/[slug]/        # Per-product detail pages
  blog/[slug]/            # Published blog articles
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
