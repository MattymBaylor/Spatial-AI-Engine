/**
 * Camera presets are art-directed in Blender, not here.
 *
 * Source of truth : seinfeld-apartment/source/apartment_cinematic.blend
 * Generator       : tools/blender/export_camera_presets.py
 * Generated data  : ./camera-presets.json  (DO NOT EDIT BY HAND)
 *
 * To change a shot: move the camera in Blender, re-run the exporter, commit
 * the regenerated JSON and preview renders. Never edit coordinates in React.
 */
import presetFile from './camera-presets.json'
import {
  CAMERA_PRESET_NAMES,
  type CameraPreset,
  type CameraPresetName,
  type CameraPresetSource,
  type Vector3Tuple,
} from '../types/scene'

interface RawPreset {
  name: string
  blenderObject: string
  position: number[]
  target: number[]
  fovHorizontalDeg: number
  fovVerticalDeg16x9: number
  near: number
  far: number
  lensMM: number
  preview: string
}

const KNOWN_NAMES = new Set<string>(CAMERA_PRESET_NAMES)

function toVector3(values: number[], context: string): Vector3Tuple {
  if (values.length !== 3 || values.some((value) => !Number.isFinite(value))) {
    throw new Error(`camera-presets.json: ${context} must be three finite numbers`)
  }
  return [values[0], values[1], values[2]] as const
}

function buildPresets(): Record<CameraPresetName, CameraPreset> {
  const raw = presetFile.presets as RawPreset[]
  const built = {} as Record<CameraPresetName, CameraPreset>

  for (const entry of raw) {
    if (!KNOWN_NAMES.has(entry.name)) {
      // A camera was added in Blender without a matching CameraPresetName.
      console.warn(`camera-presets.json: ignoring unknown preset "${entry.name}"`)
      continue
    }
    const name = entry.name as CameraPresetName
    built[name] = {
      name,
      blenderObject: entry.blenderObject,
      position: toVector3(entry.position, `${name}.position`),
      target: toVector3(entry.target, `${name}.target`),
      fovHorizontalDeg: entry.fovHorizontalDeg,
      fovVerticalDeg16x9: entry.fovVerticalDeg16x9,
      near: entry.near,
      far: entry.far,
      lensMM: entry.lensMM,
      preview: entry.preview,
    }
  }

  const missing = CAMERA_PRESET_NAMES.filter((name) => built[name] === undefined)
  if (missing.length > 0) {
    throw new Error(
      `camera-presets.json is missing ${missing.join(', ')}. ` +
        'Re-run tools/blender/export_camera_presets.py against apartment_cinematic.blend.',
    )
  }

  return built
}

export const cameraPresets: Record<CameraPresetName, CameraPreset> = buildPresets()

export const cameraPresetList: readonly CameraPreset[] = CAMERA_PRESET_NAMES.map(
  (name) => cameraPresets[name],
)

export const cameraPresetSource: CameraPresetSource = {
  generatedAt: presetFile.generatedAt,
  sourceBlend: presetFile.sourceBlend,
  glbRootScale: presetFile.glbRootScale,
}

export const DEFAULT_CAMERA_PRESET = cameraPresets.Hero

/**
 * Blender exports a horizontal FOV; three.js PerspectiveCamera wants vertical.
 * Converting per canvas aspect keeps the horizontal framing identical to the
 * reference renders at any landscape window size.
 */
export function verticalFovForAspect(fovHorizontalDeg: number, aspect: number): number {
  const safeAspect = Number.isFinite(aspect) && aspect > 0 ? aspect : 16 / 9
  const horizontal = (fovHorizontalDeg * Math.PI) / 180
  const vertical = 2 * Math.atan(Math.tan(horizontal / 2) / safeAspect)
  return (vertical * 180) / Math.PI
}
