# Spatial AI Engine Roadmap

This roadmap records direction, not delivery commitments. Scope is validated milestone by milestone.

## Milestone 1 — Scene foundation

- [x] Vite + React + TypeScript foundation
- [x] Three.js, React Three Fiber, and Drei scene stack
- [x] Jerry's Apartment GLB loading
- [x] Reusable scene component architecture
- [x] Perspective camera and typed placeholder viewpoints
- [x] Development-only orbit controls
- [x] Neutral physically based lighting and soft shadows
- [x] Loading and model-failure states
- [x] Baseline project and asset documentation

## Later milestones — Not implemented

Potential future work will be separately scoped and approved. It may include guided spatial interactions, additional characters or locations, conversational capabilities, voice, or diegetic interface concepts. None of those systems are part of Milestone 1.

## Engineering principles

1. Keep content, camera direction, rendering, and interaction systems independent.
2. Prefer typed, reusable scene primitives over page-specific implementation.
3. Maintain graceful loading and failure experiences for all external assets.
4. Record provenance and usage rights for every third-party asset.
5. Preserve accessible non-canvas application structure around 3D content.
