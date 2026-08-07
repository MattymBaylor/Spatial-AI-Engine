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

/**
 * A camera preset art-directed in apartment_cinematic.blend and exported by
 * tools/blender/export_camera_presets.py. Values are already in three.js world
 * space (Y-up) and pre-scaled to match the loaded GLB - use them verbatim.
 */
export interface CameraPreset {
  readonly name: CameraPresetName
  /** Blender object this shot came from, e.g. "Cam_Hero". */
  readonly blenderObject: string
  readonly position: Vector3Tuple
  readonly target: Vector3Tuple
  /** Authoritative. Derive vertical FOV per canvas aspect at runtime. */
  readonly fovHorizontalDeg: number
  /** Precomputed convenience value matching the 16:9 preview renders. */
  readonly fovVerticalDeg16x9: number
  readonly near: number
  readonly far: number
  readonly lensMM: number
  /** Public path to the Blender reference render for this shot. */
  readonly preview: string
}

/** Provenance for the generated preset file. */
export interface CameraPresetSource {
  readonly generatedAt: string
  readonly sourceBlend: string
  readonly glbRootScale: number
}
