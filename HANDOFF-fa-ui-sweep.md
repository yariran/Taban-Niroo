# FA UI string sweep — what landed, what is left

Scope of this pass: **hardcoded English in code**. No colour, spacing, shadow or
motion token was touched, and no English copy changed meaning — the English
strings moved verbatim into the dictionary.

`FA_LOCALE_ENABLED` is still `false`. `/fa` is parked exactly as before.

## New modules

| File | Purpose |
|---|---|
| `lib/i18n/family-labels.ts` | `familyLabel()` / `familyShortLabel()` — `ProductFamilyId` was its own English label and rendered raw in the mega-menu, catalogue navigator, filter chips and detail breadcrumb. |
| `lib/i18n/tech-table-labels.ts` | `techHeaders()` — the 28 technical-table column headers shared by the product detail page and the modal. **One Latin set for both locales**; see "Stays English" below. |

`lib/i18n/dictionaries/en.ts` gained `ui`, `productsUi`, `aboutUi`, `ceo`,
`map`, `sections` and `offices`. Because `fa.ts` is typed `Dictionary`, a key
added to EN without a FA value is a **compile error** — that is what keeps the
two in step, so keep adding keys there rather than inline.

## Conventions applied

- **Product names, DPL codes, IEC references and coupling designations stay
  Latin.** `lib/products.ts` already said so for `name`; family headings,
  captions and table headers now follow the same line.
- **Digits:** see the "Digit convention" section below — it is now settled,
  enforced by a test, and shown to CMS editors.
- **`dir="ltr"` islands** in the hero, proof band and cinematic hero were a
  documented stopgap for untranslated Latin copy. They are now
  `locale === "fa" ? undefined : "ltr"` — Persian renders natively, English
  keeps its LTR island.

## Fixed in passing

Internal links that dropped the locale prefix (they went to `/products`, which
308s to `/en/products`, so a Persian reader fell back into English):
footer nav and policy links, blog list + post, product listing and detail,
legal page shell, product-modal enquiry links, 404 (`href="/en"` hardcoded).

The product listing said `28 product references` while the catalogue holds 11.
It now reads the live count.

## Stays English — on purpose

| What | Why |
|---|---|
| **Every technical-table column header** (`Rated System Voltage (kV)`, `Specified mechanical load (kN)`, `Arcing distance (mm)`, `Type`, `Weight`, `Positive` / `Negative` / `Dry` / `Wet`, …) | The table is a 1:1 transcription of the printed datasheet, read beside the IEC clause and the paper catalogue. Translating the headers makes that cross-check harder. A part-Persian header row is also the worst option: the units and designations cannot move, so the row would break script mid-cell and wrap unpredictably in RTL. |
| **DPL suffix expansions** (`PI = Post Insulator`, `HPI = Hybrid Post`, …) | The letters are initials of the English names. `PI = مقرهٔ اتکایی` breaks the mnemonic the whole section exists to teach. The sentence around them is Persian. |
| **Coupling designations** (`Ball & Socket`, `Clevis & Tongue`, `Y-Clevis / Eye`, `Flange`) and `Manufacturer-specific` | Drawing and tender wording. `Manufacturer-specific` also sits in the same slot as `IEC 60120` / `IEC 60471`, so it matches its neighbours. |
| **`Live spec`** | Dashboard-flourish label beside rotating Latin spec values; «مشخصات زنده» read as a forced translation. |
| **Product names, DPL codes, IEC references, units** | Already the rule in `lib/products.ts` for `name`. |
| `app/global-error.tsx` (2 strings) | Last-resort boundary: it replaces the root layout and must render when everything else has failed. Adding dictionary imports adds failure modes to the one screen that cannot have them. |
| `app/opengraph-image.tsx` | Social card image, one English variant. Needs a FA card, not a string. |
| Legal page English bodies | They are the `cmsBody ? … : fallback` branch. FA CMS bodies exist, so `/fa` never reaches them. |
| `Long Rod Insulators`, `Post Insulators`, `LinkedIn` | Latin family names and a brand name. |

**Family headings stay Persian**, against the "names stay Latin" rule, because
the client's own FA copy in `site-content.fa.json` already names them that way
(«بوشینگ ترانسفورماتور», «سرکابل و مفصل»). Latin headings would put the nav at
odds with the page copy underneath it.

## What is left for the Persian version

1. ~~**Product catalogue.**~~ **Done.** All 39 products now carry `fa` for
   `subFamily`, `summary` and `applications` — 117 fields, written as
   `{ en, fa }` so the English is untouched and one record stays bilingual.
   Inside the Persian text, product names, DPL codes, IEC references, units
   and designations (`Long Rod`, `Station Post`, `Line Post`, `Plug-In`,
   `Hollow Core`, `Ball-and-Socket`, `Tongue-Clevis`, `Type A` / `Type B`,
   `AGS`, `FRP`, `ECR`, `HTV`) stay Latin, per the conventions above.

   **Caveat for production:** `cms-store` reads `cms/products.json` from
   Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, and only falls back to
   `data/products.json` on disk. If the live site uses Blob, this file is not
   what it serves — the FA text has to be entered through the admin product
   editor (or the blob re-seeded from this file).
2. ~~**Legal bodies.**~~ **Done.** FA `legal.privacy/terms/imprint` bodies now
   mirror the English section for section — 295 / 273 / 116 words, seven `##`
   headings each (was 58 / 55 / 32 with none). The revision date moved to
   `lib/legal-dates.ts` so all three pages share one constant per locale;
   the Persian form keeps the Gregorian date («۳۱ مارس ۲۰۲۶») rather than
   converting the calendar, which is a decision the client can change in that
   one file.

   **Needs a legal read before go-live.** This is a faithful translation of
   the existing English notices, not advice: retention periods, the 30-day
   response window, the governing-law and jurisdiction clauses and the
   liability wording all carry over as written. Someone on the client side
   should confirm they are what the company wants to commit to in Persian.

   **Known limitation:** `CmsProseBody` renders only `## ` headings and
   paragraphs — no links and no `<br>`. So in the Persian bodies the contact
   address is plain text where the English fallback has a `mailto:` link, and
   the imprint addresses run as comma-separated lines instead of stacked
   ones. Teaching `CmsProseBody` to linkify emails would fix the first.
3. ~~**Blog.**~~ **Dropped from the Persian site.** All 15 posts are
   `locale: "en"` and posts are per-locale documents, not translations, so
   `/fa/blog` only ever rendered an empty state.

   `FA_BLOG_ENABLED` in `lib/i18n/config.ts` is the switch; flip it to `true`
   when Persian posts exist and everything below follows from it:
   `isBlogEnabledForLocale(locale)` drives the header and footer nav, and
   `localesForPath(barePath)` drives `hreflangAlternates` and the sitemap.

   The route itself stays reachable — `/fa/blog` returns 200 with the Persian
   empty state for anyone holding a link — but it is `noindex, follow`, absent
   from the sitemap, and no longer advertised as the Persian alternate of
   `/en/blog`. An English post under `/fa/blog/<slug>` renders the Persian 404
   page, as it did before.

   Two tests cover it: `localesForPath` in `lib/i18n.test.ts` and the missing
   `fa-IR` key in `lib/seo.test.ts`.
4. **CEO message.** `home.ceo.body` is stand-in prose, not Mr Zamani's words.
   The dateline `October 2024` is also still Gregorian/English.
5. **Founding year.** Three values disagree: `about` page `CountUp to={1997}`,
   footer blurb `1997`, FA CMS `۱۳۷۷ (۱۹۹۸)`. I left the Gregorian year in the
   FA footer rather than pick a Shamsi year. Needs the client.
6. ~~**`LAST_UPDATED`**~~ **Done** — moved to `lib/legal-dates.ts`, one
   constant per locale shared by all three legal pages.
7. **CMS fallbacks.** 65 `cmsText(block, key, "English default")` call sites
   remain. Each only leaks when the FA CMS lacks that key, so this is content
   work, not code — and per the original handoff, deleting a FA key renders
   English rather than empty.
8. **Pre-existing, unrelated:** the mega-menu lists all of `FAMILY_ORDER`,
   including `Cable Accessories`, which `HIDDEN_FAMILIES` withholds elsewhere —
   it shows as a `0 ref.` card in both languages.

## Verified

`npx tsc --noEmit`, `npm run lint`, `npm run test` (64 passing) and a clean
`npm run build` all pass. `/fa` home, products, product detail, about, privacy
and 404 were read in the browser with the flag temporarily on, then the flag was
restored to `false` and `/fa/products` confirmed to 308 back to `/en/products`.
`/en` was re-checked for regressions.

One build attempt failed on a `next/font/google` network fetch
(`NextFontGoogleFontFileReplacer`). It is unrelated to these changes and passed
on retry, but the build does need network for the Google-hosted faces.

## Two FA content mismatches spotted while verifying

Both are in `data/site-content.fa.json`, not in code:

1. `products.standards.items` holds the **DPL coding guide** (DPL / ولتاژ / طول
   / مثال) where the EN tree holds IEC standards. The column label above each
   item therefore reads «استاندارد» over a DPL segment, which is wrong for
   that content. Either move those items to a DPL block or restore IEC codes.
2. ~~That same block writes voltages in Persian digits.~~ **Fixed** — see
   "Digit convention" below.

## Found while translating the catalogue

- `hollow-core-insulator` has an **empty `name`** (hidden draft; its
  `catalogueRef` reads "Hollow core insulator"). `productSchema` rejects it,
  so that product cannot be saved from the admin editor until it is named.
  38 of 39 products validate.
- `cutout-fuse-24-36` has `standard: "IEC standards"` where its siblings carry
  real clause numbers (`IEC 61109 · IEC 61192`). Thin source data, both
  languages.
- The imprint gives the Shiraz phone as `+98 71 3717 5115`; the footer gives
  `+98 713 717 5115-7`. Pre-existing, and the same in both languages.
- The dev server needs network to Google Fonts: `app/layout.tsx` loads Inter
  and Oswald via `next/font/google`, and while fonts.googleapis.com was
  unreachable **every route 500ed** with `Module not found: Can't resolve
  '@vercel/turbopack-next/internal/font/google/font'`. Clearing `.next`
  removes the cached faces, so do not clear it while offline.

## Found while removing the blog from the Persian nav

- **Fixed:** `app/sitemap.ts` built each entry's hreflang map from a hardcoded
  en / fa-IR / x-default triple. Once `hreflangAlternates` started omitting
  `fa-IR` for the blog, that emitted
  `<xhtml:link hreflang="fa-IR" href="https://…undefined" />` on `/en/blog`.
  It now maps over whatever keys the helper returned.
- **Pre-existing, not fixed:** every dynamic route soft-404s. A missing slug
  renders the 404 page with HTTP **200**, not 404 — `/en/blog/bogus`,
  `/fa/blog/bogus` and `/en/products/bogus` all behave this way. Search
  engines treat a soft 404 as a thin indexable page; worth a look independent
  of the Persian work.

## Digit convention

**Persian digits for prose quantities** — years, counts, ordinals, street
numbers: «۲۵ سال», «+۵۰۰ پروژه», «۱۳۷۷ (۱۹۹۸)», «واحد ۹».

**Latin digits for anything a reader cross-checks** against a datasheet, a
standard or a keypad — voltages, loads, dimensions, DPL codes, IEC clause
numbers and phone numbers: `6–1000 kV`, `70 kN`, `1180 mm`, `IEC 61109`,
`DPL 33-1180 PI`, `+98 71 3717 5115`.

Six places broke it and were fixed:

- the hero tagline said «۶ تا ۱۰۰۰ کیلوولت» where the footer, proof band and
  philosophy section all say `6–1000 kV` — the same spec in two forms;
- the DPL guide in the FA CMS wrote the example voltages, and the `33` / `1180`
  segments, in Persian digits, while the coding-guide block rendered beside it
  on the same page used Latin;
- the FA dictionary had «۶۳–۴۰۰ کیلوولت» in a project case and in its tag.

And once, in the other direction: the proof band's KPI tiles read `+500` /
`+24` / `+15` while the headline directly above them said «+۲۴ سال مهندسی» —
one number, two scripts, one section. The tiles are Persian now; `6–1000 kV`
stays Latin.

`proof-band-section.tsx` also forced `dir="ltr"` on the figures grid. That was
correct while the figures were Latin; with Persian digits and Persian labels it
is not, so it follows `copyDir` like the header — an LTR island for English,
native RTL for Persian.

**Enforcement.** `lib/i18n/fa-digits.test.ts` locks the mechanical half: a
number carrying a unit (`kV`, `kN`, `mm`, `kA`, `N·m`, or the Persian unit
words) must not be written in Persian digits — checked across
`site-content.fa.json`, the FA product copy and the FA dictionary, and it names
the offending key when it fails. The prose half is an editorial judgement no
test can make, so the rule is also shown to whoever is typing: in the content
editor's toolbar while the Persian tab is active, and in the product editor's
field note.
