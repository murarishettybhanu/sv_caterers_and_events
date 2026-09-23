# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A marketing website for SV Caterers and Events, a catering business in Amberpet, Hyderabad. Content
originates from the business's Justdial listing. It is a static-content SSR site — there is no
database, no API, and no auth.

## Commands

Bun is the package manager (`bunfig.toml` sets a 24h `minimumReleaseAge` supply-chain guard, so a
just-published version will be skipped on install).

```sh
bun install
bun run dev      # vite dev on http://localhost:8080 (host "::")
bun run build    # vite build → .output/ (nitro, cloudflare-module preset)
bun run build:pages  # GITHUB_PAGES=true → prerendered static site in dist/client/
bun run preview  # serve the production build
bun run lint     # eslint, includes prettier as a rule
bun run format   # prettier --write .
bunx tsc --noEmit  # typecheck; there is no "typecheck" script
```

There is no test framework or test script in this repo. To verify a change, build it and hit the
dev server (e.g. `curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/menu`).

`bun run lint` passes (7 `react-refresh/only-export-components` warnings remain, from files that
export a constant next to components). Prettier runs *as an eslint rule*, so formatting drift is a
lint error — run `bun run format` or `bunx eslint --fix <file>` after editing.

## Architecture

TanStack Start v1 (React 19, SSR, file-based routing) on Vite 8, with nitro producing a Cloudflare
worker bundle at build time.

### Routing

`src/routes/` is file-based; see `src/routes/README.md` for the filename→URL conventions. Do not
introduce Next.js/Remix conventions (`src/pages/`, `app/layout.tsx`). `src/routeTree.gen.ts` is
generated — never hand-edit it. `src/routes/__root.tsx` is the only root layout; it owns the
`<html>` shell, default head meta, favicon/og image links, and renders `Header`/`Outlet`/`Footer`.

### Error-handling stack (the non-obvious part)

Four files cooperate to stop a thrown error from becoming an opaque 500 JSON blob:

- `vite.config.ts` passes `tanstackStart({ server: { entry: "server" } })`, which redirects Start's
  bundled server entry to `src/server.ts`. Changing that option detaches the whole chain below.
- `src/server.ts` wraps Start's `server-entry` fetch handler. h3 swallows in-handler throws into a
  plain 500 `{"unhandled":true,"message":"HTTPError"}` response that try/catch never sees, so it
  *inspects* 5xx JSON responses for that shape and substitutes the HTML error page.
- `src/lib/error-capture.ts` (imported for side effects, first line of `server.ts`) monkey-patches
  `console.error` to record the last real `Error` (5s TTL) and expand it into a string that keeps
  stack + cause chain. `server.ts` recovers it via `consumeLastCapturedError()`.
- `src/start.ts` defines `createStart` request middleware. Note: defining this file opts out of
  Start's automatic CSRF middleware, which is why `createCsrfMiddleware` is re-added explicitly.

`src/lib/error-page.ts` is the dependency-free HTML fallback (used server-side); the in-app error UI
is `ErrorComponent` in `__root.tsx`.

### Quote builder (`/quote`)

The largest feature. `src/data/menu.ts` holds the whole catalogue (~470 dishes) as 21
`MenuCategory` entries, each made of `MenuSection`s tagged `veg` or `nonveg` — so "Starters" holds
chicken, mutton, fish and veg sections in one category. `categoriesFor(diet)` drops the non-veg
sections for a veg menu and, for non-veg, orders non-veg sections first inside each category. Both
flows therefore have the same 21 steps; only non-veg shows section headings.

`src/routes/quote.tsx` is a single client-side wizard: step `0` picks veg/non-veg, steps `1..n` are
one category each (every one skippable), step `n+1` is review. `CategoryNav` (sticky sidebar on
large screens, a `<details>` menu below `lg`) lists every category by name with its selected count
so any step is one click away. State lives in `useState`, is
mirrored to `localStorage` under `sv-quote-draft-v1` so a reload resumes, and any change to the
selection revokes the generated PDF's blob URL so a stale document can't be downloaded.

The review (confirmation) step has a single action — **Confirm & download PDF** — which builds the
document and downloads it in one click, then shows a confirmation panel with WhatsApp/email
hand-off. There is no inline PDF preview. It stays disabled until name, phone (Indian mobile),
event date and guest count are all valid; "Edit" on a category sets
`editingFromReview`, which relabels that step's buttons and returns straight to the review instead
of walking forward through the remaining categories.

`src/lib/quote-pdf.ts` builds the PDF with jsPDF, imported dynamically inside `buildQuotePdf` — it
must never be imported at module scope or it lands in the SSR bundle. It draws the printed SV
Caterers menu card by hand (cream page, double gold frame with corner flourishes, gold category
banners, diamond bullets, two balanced columns, contact footer, created-at stamp) using jsPDF's
built-in Times font —
no external fonts or images, so nothing has to be embedded. The PDF carries names and categories
only; there are no prices anywhere in this app.

`scripts/fetch-menu-images.ts` downloads a per-dish photo from Wikimedia Commons into
`src/assets/menu/` and writes attribution to `src/data/menu-images.json`. It is **not wired into the
UI** — item cards are text-only for now. If you re-enable photos, keep its rate-limit backoff: the
Commons API silently throttles bursts, and a throttled search is indistinguishable from "no photo
exists" (an early run matched 3 of 474 items that way). CC-BY images need the recorded credits shown
somewhere on the site.

### Content and styling

- `BUSINESS` in `src/components/SiteChrome.tsx` is the single source of truth for name, address,
  hours, rating, etc. Update it there, not in individual routes.
- Each route sets its own `head: () => ({ meta: [...] })` for title/description/og tags; `__root.tsx`
  supplies the site-wide defaults and icons.
- Tailwind v4 is configured CSS-first in `src/styles.css`, which is the whole design system: colour
  and font tokens under `@theme inline`, a three-step shadow scale, a `--section-y` rhythm variable,
  a global `:focus-visible` ring and a `prefers-reduced-motion` block. Compose UI from its
  `@utility` classes rather than re-inventing utility stacks inline:
  - layout — `container-page`, `section-y`
  - type — `eyebrow` (12px floor), `lede`, `text-gold`, `card-title`, `list-marked` (real bullet
    markers; never type "• " into list text). Marcellus (display serif) has one weight and reads
    weak below ~1.25rem, so page and section titles use it while card/panel titles use
    `card-title` (Inter 600); body text is Inter.
  - surfaces — `surface-card`, `card-interactive`
  - buttons — `btn` (44px min target, hover/active/disabled states) plus one variant:
    `btn-primary`, `btn-gold`, `btn-outline`, `btn-ghost`, `btn-on-image`, with `btn-sm`/`btn-block`
  - forms — `field`, `field-label` (styles `aria-invalid` for error states)
  - a11y — `skip-link`, `tap-safe` (44px targets on coarse pointers only)

  There is no `tailwind.config.js`.
- Palette: alabaster page, espresso (near-black warm neutral) brand, champagne-gold accent. The
  gold is deliberately rare — eyebrows, the `text-gold` hero word, `btn-gold`, the `rule-gold`
  hairline in `PageHeader` — so it still reads as metal rather than decoration. The PDF keeps the
  gold/cream print identity from the business's own menu card; that is deliberate, not drift.
  Every non-hero text pair measures ≥4.5:1, and the hero text over photography was verified by
  sampling rendered pixels (eyebrow 4.98:1, h1 12.3:1).
- `src/components/Page.tsx` holds `PageHeader`, `SectionHeading` and `Section` so every route shares
  one header pattern and vertical rhythm. `SiteChrome.tsx` owns `Header` (desktop nav + phone CTA,
  mobile sheet; the sample-menu page is linked from the footer and in-page CTAs, not the top nav),
  `MobileActionBar` (sticky call/quote bar, hidden on `/quote`, which has its own
  sticky step bar) and `Footer`.
- The contact form has no backend: it validates, then hands the enquiry to the visitor's mail app
  via `mailto:` with everything pre-filled, and offers WhatsApp as the fallback.
- shadcn/ui ("new-york", slate base) lives in `src/components/ui/`; config in `components.json`.
  Most of it is unused scaffolding.
- Photos and the logo are imported from `src/assets/` so Vite hashes them. `public/` holds only what
  must be referenced by literal URL: `favicon.ico`, `apple-touch-icon.png`, `sv-logo.png` (used by
  the og:image/twitter:image meta tags), `robots.txt`.

### Vite config and the two build modes

`vite.config.ts` is a plain Vite config (no wrapper preset). The `@` alias maps to `src/`, React and
TanStack packages are deduped, and the dev server is pinned to port 8080.

`GITHUB_PAGES=true` switches it into the static mode used by the Pages workflow:

- `base` and `tanstackStart({ router: { basepath } })` become `/<PAGES_BASE_PATH>/`. The prerenderer
  prefixes its requests with that basepath and strips it again when writing files, so `pages` entries
  stay plain paths like `/services` — prefixing them manually double-prefixes and 500s.
- nitro is **skipped**; its output layout breaks Start's prerender preview server, which expects
  `dist/server/server.js`. Output is `dist/client/**/index.html` plus `dist/client/assets`.
- `spa: { prerender: { outputPath: "/404" } }` emits a real SPA shell at `404.html`. Copying
  `index.html` there instead fails to hydrate (its serialised router state is for `/`).
- Public-directory URLs (icons, og:image) must go through the `asset()` helper in `__root.tsx` so
  they carry the base; hard-coded `/foo.png` 404s on Pages.

Deploy workflows live in `.github/workflows/` (CI on every push/PR; Pages deploy on `main`).
