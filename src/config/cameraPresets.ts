import type { CameraPreset, CameraPresetName } from '../types/scene'

export const cameraPresets = {
  Hero: { name: 'Hero', position: [8, 5, 10], target: [0, 2, 0], fov: 42 },
  Sofa: { name: 'Sofa', position: [4, 2.6, 4], target: [0, 1.3, 0], fov: 45 },
  CoffeeTable: { name: 'CoffeeTable', position: [2.5, 2, 3], target: [0, 0.8, 0], fov: 48 },
  Kitchen: { name: 'Kitchen', position: [-5, 3.2, 4], target: [-1.5, 1.5, -1], fov: 45 },
  Window: { name: 'Window', position: [4, 3, -2], target: [1, 1.8, 0], fov: 45 },
  Door: { name: 'Door', position: [-3, 3, 5], target: [0, 1.6, 0], fov: 45 },
  Overview: { name: 'Overview', position: [11, 10, 13], target: [0, 1, 0], fov: 50 },
} as const satisfies Record<CameraPresetName, CameraPreset>

export const DEFAULT_CAMERA_PRESET = cameraPresets.Hero
