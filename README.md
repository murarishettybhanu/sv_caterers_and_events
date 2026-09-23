# SV Caterers and Events

Marketing website for SV Caterers and Events, a catering service near Hanuman Temple,
Amberpet, Hyderabad. Content is based on the business's
[Justdial listing](https://www.justdial.com/Hyderabad/Sv-Caterers-and-Events-Near-Hanuman-Temple-Amberpet/040PXX40-XX40-221212134054-H8Y2_BZDET).

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, SSR)
- [Vite](https://vite.dev) with [nitro](https://nitro.build) for the server build
- [Tailwind CSS](https://tailwindcss.com) v4 and [shadcn/ui](https://ui.shadcn.com) components

## Development

Requires [Bun](https://bun.com) (or Node.js with npm — swap `bun` for `npm run`).

```sh
bun install
bun run dev      # dev server on http://localhost:8080
bun run build    # production build
bun run preview  # serve the production build
bun run lint     # eslint
bun run format   # prettier
```

## Deployment

Pushing to `main` runs two workflows:

- **CI** (`.github/workflows/ci.yml`) — lint, typecheck and the default build on every push and PR.
- **Deploy to GitHub Pages** (`.github/workflows/deploy-pages.yml`) — builds the static site and
  publishes it to <https://murarishettybhanu.github.io/sv_caterers_and_events/>.

Enable it once under **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Two build modes share one config:

```sh
bun run build        # nitro Cloudflare worker in .output/  (default)
bun run build:pages  # static prerendered site in dist/client/  (GitHub Pages)
```

The Pages build sets `GITHUB_PAGES=true`, which switches Vite's `base` and the router basepath to
`/<repo>/`, prerenders every route to HTML (no server needed) and emits a SPA shell as `404.html`
so unknown URLs still boot the app. The repo name comes from `PAGES_BASE_PATH`, which the workflow
fills in automatically — a custom domain only needs `PAGES_BASE_PATH=""`.

## Layout

- `src/routes/` — pages, one file per route (`index`, `about`, `menu`, `services`, `contact`)
- `src/components/` — `SiteChrome.tsx` (header/footer) and `ui/` shadcn components
- `src/server.ts`, `src/start.ts` — SSR entry and request middleware, including error handling
- `src/styles.css` — Tailwind theme and design tokens
