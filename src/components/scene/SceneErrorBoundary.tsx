import { Component, type ErrorInfo, type ReactNode } from 'react'
import { APARTMENT_MODEL_PATH } from './ApartmentModel'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unable to render the apartment scene.', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="scene-status scene-error" role="alert">
          <strong>Apartment unavailable</strong>
          <span>Could not load the 3D model.</span>
          <code>{APARTMENT_MODEL_PATH}</code>
          <button type="button" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
