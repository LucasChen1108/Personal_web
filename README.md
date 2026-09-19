# The Lab — portfolio MVP

A scroll-driven 3D portfolio (Proposal C, "The Lab", from the design plan). Scrolling moves the camera through six stations — About, ArcLab, PixelProof, Service Report Agent, bStock Trading Agent, Contact — built with Next.js, react-three-fiber and Tailwind. All 3D content is primitives + shaders (no modeling tool needed), so it ships fast and is easy to keep at 60fps; swap in custom Blender models later station-by-station if you want to raise the ceiling.

## Run it

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve the production build
```

## Deploy

Push to a GitHub repo and import it in Vercel (same pipeline as ArcLab). No environment variables are required.

## Structure

- `src/data/profile.ts` — your name, bio, skills, contact links. Edit this for any copy change.
- `src/data/projects.ts` — one entry per project (ArcLab, PixelProof, the two in-progress agents). Each has `description`, `highlight`, `stack`, and an optional `link`. **This is the main thing to keep updated** — fill in the two `in-progress` entries once those projects have a demo-able state.
- `src/lib/stations.ts` — the camera path: station order, spacing and camera offsets. Add/reorder stations here.
- `src/components/three/Stations/*` — the 3D vignette for each station (ArcLab's ghost-trajectory curve, PixelProof's detection grid, the two agent placeholders, the chalkboard and desk). Swap any of these for a custom Blender model later without touching anything else.
- `src/components/Overlay.tsx` — the HTML text card that cross-fades in per station. Real, accessible DOM text (not canvas text), so it's readable and crawlable.
- `src/components/StaticFallback.tsx` — the plain, non-animated version of the whole site. Shown automatically when the visitor's OS has "reduce motion" on, or when they click **Skip animation** (top right) — their choice is remembered.

## What's a placeholder right now

- **Service Report Agent** and **bStock Trading Agent** stations use a generic abstract vignette and a one-line description, since those projects are still in progress. Update `src/data/projects.ts` with the real description/stack/link once you have something to show, and consider giving each its own bespoke 3D vignette in `src/components/three/Stations/` at that point (a custom one per project, like ArcLab's, will read stronger than the shared placeholder).
- The favicon is still the default Next.js icon — swap `src/app/favicon.ico`.
- No color palette pass yet beyond the dark teal/amber theme used here — tweak the colors in the Stations components and `globals.css` if you want a different feel.

## Performance / accessibility notes already built in

- `prefers-reduced-motion` is respected automatically on first visit.
- The **Skip animation** toggle gives everyone an escape hatch, and the choice persists (`localStorage`).
- The 3D scene is primitives only — no external model/texture downloads, so first paint is fast.
- Not yet done: a dedicated mobile layout. The scene will render on phones but hasn't been tuned for touch scroll feel or small viewports — test on a real phone before sharing widely, and consider swapping to `StaticFallback`-style content below a breakpoint if the 3D scene feels heavy.
