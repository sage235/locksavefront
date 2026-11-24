import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error(error, info.componentStack)
    // Production: send to your error tracker here (for example Sentry).
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className={`grid place-items-center p-10 text-center ${this.props.fullScreen ? 'min-h-screen' : ''}`}>
        <div className="max-w-sm">
          <h1 className="text-2xl">Something went wrong</h1>
          <p className="mt-2 text-muted">Your money and vaults are not affected. Reload the page to try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-fir-700 px-5 font-medium text-cream-100 hover:bg-fir-900"
          >
            Reload page
          </button>
        </div>
      </div>
    )
  }
}