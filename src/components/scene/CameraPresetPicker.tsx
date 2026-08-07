import { cameraPresetList } from '../../config/cameraPresets'
import type { CameraPresetName } from '../../types/scene'

interface CameraPresetPickerProps {
  readonly activePreset: CameraPresetName
  readonly onSelect: (preset: CameraPresetName) => void
}

/**
 * Shot selector. Every entry, including its thumbnail, is generated from
 * Blender — this component holds no camera data of its own.
 */
export function CameraPresetPicker({ activePreset, onSelect }: CameraPresetPickerProps) {
  return (
    <nav className="camera-picker" aria-label="Camera shots">
      <ul className="camera-picker__list">
        {cameraPresetList.map((preset) => {
          const isActive = preset.name === activePreset
          return (
            <li key={preset.name}>
              <button
                type="button"
                className="camera-picker__item"
                aria-pressed={isActive}
                onClick={() => onSelect(preset.name)}
              >
                <img
                  className="camera-picker__thumb"
                  src={preset.preview}
                  alt=""
                  loading="lazy"
                  width={160}
                  height={90}
                />
                <span className="camera-picker__label">{preset.name}</span>
                <span className="camera-picker__lens">{preset.lensMM}mm</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
