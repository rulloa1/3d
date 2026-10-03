# Rory Ulloa: Web Developer & 3D Artist

Personal portfolio for **Rory Ulloa**, a Houston-based freelance web developer and 3D artist. It's a single-page, static React site built with **Vite**, **TypeScript**, **Tailwind CSS v4**, **Motion** (Framer Motion) and **Lenis** smooth scrolling.

Sections: hero with hire-me CTA → tech strip → about → skills → selected work → services → contact.

## Local development

No API keys or environment variables are required.

```bash
npm ci
npm run dev       # http://localhost:3000
```

Production build and local preview:

```bash
npm run lint      # type-check (tsc --noEmit)
npm run build     # outputs static files to dist/
npm run preview   # http://localhost:4173
```

## Editing content

All copy, links, skills, projects and services live in **`src/data/content.ts`**. Update that file rather than the components. Items still needing real info are marked `TODO(rory)`:

- Social / freelance profile links (LinkedIn, Upwork, etc.) and an optional resume
- Optional pricing / turnaround for services
- If you move to a custom domain, update the canonical / `og:url` / `og:image` URLs in `index.html` and `base` in `vite.config.ts`
- A personal touch on the bio paragraph

Project thumbnails are real screenshots of each project, stored as WebP in `src/assets/projects/`.

## Project structure

| Path | Purpose |
|---|---|
| `index.html` | SEO/meta tags, Open Graph, JSON-LD, fonts, favicon |
| `public/` | Favicon, Apple touch icon, social preview image |
| `src/App.tsx` | Page composition |
| `src/data/content.ts` | All site content (single source of truth) |
| `src/components/` | Header, sections, and small UI helpers |
| `src/assets/` | Optimized images (hero portrait, project thumbnails) |
| `src/index.css` | Tailwind theme tokens (colors, fonts) and shared component classes |
| `vite.config.ts` | Vite, React, Tailwind, aliases |

## Deployment

Live at **https://rulloa1.github.io/3d/** (GitHub Pages, served from the `gh-pages` branch).

- `vite.config.ts` sets `base: '/3d/'` so assets resolve under the `/3d/` subpath.
- `.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/` to the `gh-pages` branch.
- Manual deploy (e.g. if Actions is unavailable): `npm run build`, then push the contents of `dist/` (plus an empty `.nojekyll`) to the `gh-pages` branch.
