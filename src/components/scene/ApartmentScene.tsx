import { ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import type { CameraPreset } from '../../types/scene'
import { ApartmentModel } from './ApartmentModel'
import { CameraRig } from './CameraRig'
import { SceneLighting } from './SceneLighting'
import { SceneLoading } from './SceneLoading'

interface ApartmentSceneProps {
  readonly preset: CameraPreset
}

export function ApartmentScene({ preset }: ApartmentSceneProps) {
  return (
    <>
      {/* Camera transform, FOV and clipping all come from Blender. */}
      <CameraRig preset={preset} />
      <SceneLighting />
      <Suspense fallback={<SceneLoading />}>
        <ApartmentModel />
      </Suspense>
      <ContactShadows position={[0, -0.02, 0]} opacity={0.42} scale={20} blur={2.5} far={12} />
    </>
  )
}
