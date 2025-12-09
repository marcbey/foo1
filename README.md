# Workspace Dashboard (Next.js)

Interactive dashboard scaffold built with Next.js 16, Gridstack.js, and Chart.js. Drag-and-drop widgets, resize them, and embed demo charts via a dropdown-driven widget creator.

## Features
- Gridstack-based layout with drag, drop, resize (resize handle bottom-right only) and min widget size of 4x4 grid units.
- Add/remove widgets on the fly; “Add widget” dropdown spawns any of 5 demo charts (latency, usage, region mix, health status, reliability radar).
- Chart.js + react-chartjs-2 integration with shared presets (`app/components/chartRegistry.tsx`) and gallery section on the home page.
- Tailwind v4 (via `@import "tailwindcss";`) and Geist fonts for styling.

## Getting Started
Prerequisites: Node 18+ and npm.

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Key Paths
- `app/page.tsx` – page layout, header/sidebar, embeds Gridstack demo and chart gallery.
- `app/components/GridStackDemo.tsx` – widget grid: add/remove, dropdown chart selection, Gridstack init/config.
- `app/components/chartRegistry.tsx` – Chart.js registration + chart presets used by widgets and gallery.
- `app/components/ChartsDemo.tsx` – standalone gallery showcasing the five demo charts.
- `next.config.ts` – disables Next.js dev indicator.

## Usage Notes
- Use the “+ Add widget” dropdown to pick a chart; each widget can be dragged/resized (min 4x4).
- Only the bottom-right resize handle is active.
- To add new chart types, create a preset in `chartRegistry.tsx` and it will appear in the dropdown automatically.

## Scripts
- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm start` – run the production build
- `npm run lint` – lint with Next.js defaults
