import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import type { CameraPreset } from '../../types/scene'
import { ApartmentScene } from './ApartmentScene'
import { SceneErrorBoundary } from './SceneErrorBoundary'

interface ApartmentExperienceProps {
  readonly preset: CameraPreset
}

export function ApartmentExperience({ preset }: ApartmentExperienceProps) {
  return (
    <SceneErrorBoundary>
      <Canvas
        shadows="soft"
        dpr={[1, 2]}
        gl={{
          antialias: true,
          outputColorSpace: SRGBColorSpace,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
      >
        <color attach="background" args={['#151719']} />
        <ApartmentScene preset={preset} />
      </Canvas>
    </SceneErrorBoundary>
  )
}
