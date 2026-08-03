import { ApartmentExperience } from './components/scene/ApartmentExperience'

export function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Spatial AI Engine</p>
        <h1>Jerry's Apartment</h1>
        <p className="subtitle">Milestone 1 · Scene foundation</p>
      </header>
      <section className="scene-shell" aria-label="Interactive 3D view of Jerry's apartment">
        <ApartmentExperience />
      </section>
      <p className="development-note">Development navigation: drag to orbit · scroll to zoom</p>
    </main>
  )
}
