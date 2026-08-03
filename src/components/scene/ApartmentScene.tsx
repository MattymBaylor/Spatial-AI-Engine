import { ContactShadows, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense } from 'react'
import { DEFAULT_CAMERA_PRESET } from '../../config/cameraPresets'
import { ApartmentModel } from './ApartmentModel'
import { SceneLighting } from './SceneLighting'
import { SceneLoading } from './SceneLoading'

export function ApartmentScene() {
  const preset = DEFAULT_CAMERA_PRESET

  return (
    <>
      <PerspectiveCamera makeDefault position={preset.position} fov={preset.fov} near={0.1} far={250} />
      <SceneLighting />
      <Suspense fallback={<SceneLoading />}>
        <ApartmentModel />
      </Suspense>
      <ContactShadows position={[0, -0.02, 0]} opacity={0.42} scale={20} blur={2.5} far={12} />
      {import.meta.env.DEV && (
        <OrbitControls
          makeDefault
          target={preset.target}
          enableDamping
          dampingFactor={0.08}
          minDistance={1.5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.02}
        />
      )}
    </>
  )
}
