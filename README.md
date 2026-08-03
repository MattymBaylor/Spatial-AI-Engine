# Spatial AI Engine

An interactive, browser-based spatial experience built around a reusable React Three Fiber scene architecture. Milestone 1 establishes the rendering foundation and loads Jerry's Apartment as the first explorable environment.

## Milestone 1

- Vite, React, and TypeScript application foundation
- Three.js rendering through React Three Fiber
- Reusable scene, model, lighting, loading, and error-boundary components
- Physically based neutral lighting, ACES tone mapping, soft real-time shadows, and contact shadows
- Typed camera presets for Hero, Sofa, CoffeeTable, Kitchen, Window, Door, and Overview
- Development-only orbit navigation (excluded from production builds)
- Bundled Jerry's Apartment GLB at `/assets/apartment/seinfeld_apartment.glb`

Milestone 1 intentionally contains no hotspots, characters, additional locations, AI, voice features, or holographic interface.

## Requirements

- Node.js 20.19+ or 22.12+
- npm 10+

## Getting started

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. During development, drag to orbit and scroll to zoom.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Project structure

```text
src/
├── components/scene/       # Canvas, scene graph, model, lighting, and scene states
├── config/                 # Typed runtime configuration such as camera presets
├── types/                  # Shared scene types
├── App.tsx                 # Application shell
├── main.tsx                # React entry point
└── styles.css              # Global presentation
public/assets/apartment/    # Apartment GLB and future related source assets
```

## Camera presets

Presets are defined in `src/config/cameraPresets.ts`. Each preset has a typed name, position, look target, and field of view. The values are placeholders intended for art-direction passes after the model's final framing is approved.

## Asset errors

If the apartment asset is absent or cannot be decoded, the scene error boundary displays a recovery message with the expected public URL. Confirm that this file exists before starting the application:

```text
public/assets/apartment/seinfeld_apartment.glb
```

## Asset attribution

See [THIRD_PARTY_ASSETS.md](THIRD_PARTY_ASSETS.md) before redistributing or publishing the apartment model.
