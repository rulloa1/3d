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
- Canonical URL + absolute `og:image` URL in `index.html` once the site has a domain
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

This repo currently has **no deployment configured** (no GitHub Pages, Vercel or Netlify setup), so merging to `main` does not publish anything by itself.

It builds to a plain static `dist/` folder, so any static host works:

- **Vercel / Netlify / Cloudflare Pages:** import the repo, build command `npm run build`, output directory `dist`. These will then auto-deploy on every push to `main`.
- **GitHub Pages:** add a Pages workflow that runs `npm ci && npm run build` and uploads `dist/`. If served from `https://<user>.github.io/3d/`, set `base: '/3d/'` in `vite.config.ts`.
