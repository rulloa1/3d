# Rory Ulloa — Architectural Visualizer & 3D Artist

A single-page portfolio for **Rory Ulloa**, presenting architectural visualization, 3D-art, and creative-direction work. The site is a static React application built with Vite, Tailwind CSS, Motion, Lenis, and Lucide.

## Local development

The current application does **not** require API keys or runtime environment variables.

```bash
npm ci
npm run dev
```

The development server listens on `http://localhost:3000` by default. To create and preview a production build, run:

```bash
npm run lint
npm run build
npm run preview
```

## Project structure

| Path | Purpose |
|---|---|
| `src/App.tsx` | Top-level portfolio composition |
| `src/components/` | Portfolio sections and reusable interactions |
| `src/index.css` | Global styling and Tailwind theme layers |
| `vite.config.ts` | Vite, React, Tailwind, aliases, and development-server settings |

## Deployment

Deploy the generated `dist/` directory to any static hosting provider. Before publishing, verify the ArtStation project links and contact actions in the rendered site.
