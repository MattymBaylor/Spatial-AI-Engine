import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import type { Mesh } from 'three'

export const APARTMENT_MODEL_PATH = '/assets/apartment/seinfeld_apartment.glb'

export function ApartmentModel() {
  const { scene } = useGLTF(APARTMENT_MODEL_PATH)

  useEffect(() => {
    scene.traverse((object) => {
      if ('isMesh' in object && object.isMesh) {
        const mesh = object as Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
  }, [scene])

  return <primitive object={scene} />
}
