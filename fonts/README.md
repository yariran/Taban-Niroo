# Self-hosted typefaces

Every face this site uses is committed here. **Nothing is fetched from Google
at build time or at runtime.**

| Family | Role | Files | Licence |
|--------|------|-------|---------|
| **Inter** | Body / narrator (`--font-inter`, the default `font-sans`) | `inter/inter-latin-wght.woff2` (variable, `wght` 100–900, Latin) | SIL OFL 1.1 — `inter/OFL.txt` |
| **Oswald** | Display / catalogue (`--font-hero`, `--font-headline`, `--font-hero-slogan`) | `oswald/oswald-latin-wght.woff2` (variable, `wght` 200–700, Latin) | SIL OFL 1.1 — `oswald/OFL.txt` |
| **Estedad** | Display / catalogue (Oswald’s seat under `lang=fa`) | `estedad/Estedad-{Light,Regular,Medium,Bold,Black}.woff2` | SIL OFL 1.1 — `estedad/OFL.txt` |
| **Vazirmatn** | Body / narrator (Inter’s seat under `lang=fa`) | `vazirmatn/vazirmatn-*-wght.woff2` (variable, Arabic + Latin) | SIL OFL 1.1 — `vazirmatn/OFL.txt` |
| **Geist Mono** | Label face, `/style-preview` sandbox only | `geist-mono/geist-mono-latin-wght.woff2` (variable, `wght` 100–900, Latin) | SIL OFL 1.1 — `geist-mono/OFL.txt` |

Loaded via `next/font/local`: `lib/fonts-latin.ts` (Inter, Oswald),
`lib/fonts-fa.ts` (the Persian pair), and `app/style-preview/layout.tsx`
(Geist Mono, scoped to that route).

## Why none of these come from `next/font/google`

That loader downloads the file from Google **while the site builds**, so the
build only succeeds when the machine can reach `fonts.gstatic.com`. It failed
here twice in one sitting with nothing wrong in the repository: a clean build
died on `Failed to fetch 'Oswald' from Google Fonts`, and minutes later a dev
server returned 500 on every route because Inter could not be reached. That is
a CI failure no commit explains, so the bytes live in the repository instead.

Geist Mono is included even though its route is an internal noindex sandbox:
`next build` builds that route too, so one Google import there would have kept
the whole build network-dependent.

## If you add or replace a face

- One **variable** file per family, and no `weight` list in the loader.
  Asking Google for static instances of a variable family is what produced the
  dynamic-subset URLs (`/l/font?kit=…&skey=…`) that Turbopack's font replacer
  rejects, filling cold dev starts with resolve errors.
- `latin` subset only, matching what the Google loaders were configured for.
  Characters outside it fall back per glyph, as they always did. Add a
  `-latin-ext-` file beside the existing one if that has to change.
- Commit the `OFL.txt` next to the font. All five are SIL OFL 1.1, which
  requires the licence to travel with the file.
