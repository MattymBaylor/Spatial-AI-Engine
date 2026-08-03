import { Environment, Lightformer } from '@react-three/drei'
import { Color } from 'three'

export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.2} color="#dbe4ef" />
      <directionalLight
        castShadow
        color="#fff1dc"
        intensity={3.2}
        position={[6, 10, 7]}
        shadow-bias={-0.0001}
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight color="#ffd6ad" intensity={12} position={[-2, 4, 2]} decay={2} />
      <Environment background={false} resolution={256}>
        <color attach="background" args={[new Color('#151719')]} />
        <Lightformer intensity={1.5} color="#f5f2eb" position={[0, 8, -4]} scale={[10, 4, 1]} />
        <Lightformer intensity={0.7} color="#b8c7d9" position={[-6, 3, 1]} scale={[3, 6, 1]} />
      </Environment>
    </>
  )
}
