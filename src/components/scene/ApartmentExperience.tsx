import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { ApartmentScene } from './ApartmentScene'
import { SceneErrorBoundary } from './SceneErrorBoundary'

export function ApartmentExperience() {
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
        <ApartmentScene />
      </Canvas>
    </SceneErrorBoundary>
  )
}
