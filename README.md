# UB Testing

A premium, responsive coming-soon experience for [ubtesting.com](https://ubtesting.com), built
with React, TypeScript, and Vite. Production traffic is served by an unprivileged Nginx container.

## Local development

Requirements:

- Node.js 22.12 or newer
- npm 10 or newer

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`.

## Routes

Routing is handled by a small client-side router in `src/Router.tsx`; unknown paths fall back to
the coming-soon page.

| Path          | Page                                                            |
| ------------- | --------------------------------------------------------------- |
| `/`           | Coming-soon experience (`src/App.tsx`)                          |
| `/ubtesting1` | Weiterbildung ve İş Birliği Konsepti (`src/pages/WeiterbildungPage.tsx`) |

The `/ubtesting1` content lives in `src/pages/weiterbildungContent.ts` and mirrors
`doc/weiterbildung_isbirligi.html` verbatim.

## SEO and GEO

Search engines and AI answer engines are served from three layers:

- **Static head** — `index.html` carries the full home-page metadata (title, description,
  canonical, robots, Open Graph, Twitter card, `geo.region`/`ICBM` for Berlin, and a
  `schema.org` `@graph` with `Organization`, `WebSite`, and `WebPage`). Crawlers that never run
  scripts still get everything.
- **Per-route head** — `src/seo.ts` holds one `RouteSeo` record per route and rewrites the
  static tags on navigation; `src/Router.tsx` applies it. Add a route there and its title,
  description, canonical, robots, and social tags follow.
- **Server** — `nginx.conf` maps every request to an `X-Robots-Tag`, so non-indexable routes are
  excluded even for crawlers that ignore the DOM.

Crawler-facing files live in `public/`: `robots.txt` (explicitly opts the major AI crawlers in),
`sitemap.xml`, `llms.txt`, and `site.webmanifest`.

`public/og-image.png` (1200×630) and the PNG icons are generated brand placeholders — replace
them with designed artwork when it exists; the metadata already points at the right paths.

After changing the domain, update `SITE_URL` in `src/seo.ts` plus the absolute URLs in
`index.html`, `public/robots.txt`, and `public/sitemap.xml`.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run test:coverage
npm run build
```

The browser smoke test can be run after installing Chromium once:

```bash
npx playwright install chromium
npm run test:e2e
```

## Docker

Build and run the exact production setup locally:

```bash
docker compose up --build
```

The site is available at `http://localhost:8080`; the container health endpoint is
`http://localhost:8080/healthz`.

## Coolify deployment

1. Create a new **Application** and connect this GitHub repository.
2. Select **Dockerfile** as the build pack.
3. Keep the Dockerfile path as `/Dockerfile`.
4. Set the exposed/container port to `8080`.
5. Add `https://ubtesting.com` (and optionally `https://www.ubtesting.com`) as domains.
6. Set the health-check path to `/healthz`.
7. Enable automatic deployment for the production branch after the PR is merged.

No runtime environment variables or persistent volumes are required. TLS termination and
HTTP-to-HTTPS redirect should be managed by Coolify's proxy.

## Production notes

- Multi-stage image: Node is used only for the build; Nginx serves the final static output.
- Runtime is non-root and listens on port `8080`.
- SPA fallback, immutable asset caching, gzip, a health check, and security headers are enabled.
- The contact CTA currently opens `hello@ubtesting.com`. Change `contactHref` in
  `src/App.tsx` if a different mailbox is preferred.
