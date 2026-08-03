import { Html, useProgress } from '@react-three/drei'

export function SceneLoading() {
  const { progress } = useProgress()
  const roundedProgress = Math.round(progress)

  return (
    <Html center>
      <div className="scene-status scene-loading" role="status" aria-live="polite">
        <span className="loader" aria-hidden="true" />
        <strong>Preparing the apartment</strong>
        <span>{roundedProgress}% loaded</span>
      </div>
    </Html>
  )
}
