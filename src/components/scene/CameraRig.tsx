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
  const offsetX = preset.position[0] - preset.target[0]
  const offsetY = preset.position[1] - preset.target[1]
  const offsetZ = preset.position[2] - preset.target[2]
  const presetDistance = Math.hypot(offsetX, offsetY, offsetZ)
  const startingAzimuth = Math.atan2(offsetX, offsetZ)

  // Keep the exploratory, fly-around feeling without allowing a full trip
  // behind the television set. Each art-directed shot gets a 180-degree
  // horizontal orbit centered on its exported starting position.
  const horizontalHalfArc = Math.PI / 2

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
      minDistance={Math.max(1.25, presetDistance * 0.28)}
      maxDistance={Math.min(22, presetDistance * 1.65)}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI * 0.58}
      minAzimuthAngle={startingAzimuth - horizontalHalfArc}
      maxAzimuthAngle={startingAzimuth + horizontalHalfArc}
      truckSpeed={0}
      dollySpeed={0.65}
      enabled={allowManualOrbit}
    />
  )
}
