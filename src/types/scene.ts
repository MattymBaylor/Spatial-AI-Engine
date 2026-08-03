export type Vector3Tuple = readonly [x: number, y: number, z: number]

export const CAMERA_PRESET_NAMES = [
  'Hero',
  'Sofa',
  'CoffeeTable',
  'Kitchen',
  'Window',
  'Door',
  'Overview',
] as const

export type CameraPresetName = (typeof CAMERA_PRESET_NAMES)[number]

export interface CameraPreset {
  readonly name: CameraPresetName
  readonly position: Vector3Tuple
  readonly target: Vector3Tuple
  readonly fov: number
}
