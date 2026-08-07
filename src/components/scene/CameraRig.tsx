import { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef, type ComponentRef } from 'react'
import { PerspectiveCamera as ThreePerspectiveCamera } from 'three'
import { verticalFovForAspect } from '../../config/cameraPresets'
import type { CameraPreset } from '../../types/scene'

type CameraControlsRef = ComponentRef<typeof CameraControls>

interface CameraRigProps {
  readonly preset: CameraPreset
  /** Allow the viewer to orbit away from the art-directed shot. */
  readonly allowManualOrbit?: boolean
}

/**
 * Drives the default camera entirely from Blender-exported presets.
 * No coordinates are authored here — see src/config/cameraPresets.ts.
 */
export function CameraRig({ preset, allowManualOrbit = true }: CameraRigProps) {
  const controlsRef = useRef<CameraControlsRef>(null)
  const camera = useThree((state) => state.camera)
  const width = useThree((state) => state.size.width)
  const height = useThree((state) => state.size.height)
  const hasPlacedCamera = useRef(false)

  // Blender exports horizontal FOV; three.js wants vertical, aspect-dependent.
  useEffect(() => {
    if (!(camera instanceof ThreePerspectiveCamera)) return
    camera.fov = verticalFovForAspect(preset.fovHorizontalDeg, width / Math.max(height, 1))
    camera.near = preset.near
    camera.far = preset.far
    camera.updateProjectionMatrix()
  }, [camera, preset, width, height])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const [px, py, pz] = preset.position
    const [tx, ty, tz] = preset.target
    // Snap on first paint, glide on every subsequent preset change.
    void controls.setLookAt(px, py, pz, tx, ty, tz, hasPlacedCamera.current)
    hasPlacedCamera.current = true
  }, [preset])

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.55}
      draggingSmoothTime={0.12}
      minDistance={0.4}
      maxDistance={22}
      maxPolarAngle={Math.PI / 2.03}
      enabled={allowManualOrbit}
    />
  )
}
