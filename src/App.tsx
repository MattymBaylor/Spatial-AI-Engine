import { useState } from 'react'
import { ApartmentExperience } from './components/scene/ApartmentExperience'
import { CameraPresetPicker } from './components/scene/CameraPresetPicker'
import { cameraPresetSource, cameraPresets } from './config/cameraPresets'
import type { CameraPresetName } from './types/scene'

export function App() {
  const [activePreset, setActivePreset] = useState<CameraPresetName>('Hero')
  const preset = cameraPresets[activePreset]

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Spatial AI Engine</p>
        <h1>Jerry's Apartment</h1>
        <p className="subtitle">Milestone 1 · Scene foundation</p>
      </header>
      <section className="scene-shell" aria-label="Interactive 3D view of Jerry's apartment">
        <ApartmentExperience preset={preset} />
      </section>
      <CameraPresetPicker activePreset={activePreset} onSelect={setActivePreset} />
      <p className="development-note">
        Shot: <strong>{preset.name}</strong> · {preset.lensMM}mm · from{' '}
        <code>{preset.blenderObject}</code> in Blender. Drag to orbit, scroll to zoom, pick a shot to
        return to the art-directed framing.
      </p>
      {import.meta.env.DEV && (
        <p className="development-note development-note--muted">
          Camera data generated {new Date(cameraPresetSource.generatedAt).toLocaleString()} · GLB
          root scale {cameraPresetSource.glbRootScale}
        </p>
      )}
    </main>
  )
}
