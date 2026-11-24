import { Link } from 'react-router-dom'
import Brand from '../components/layout/Brand'
import { buttonClass } from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <Brand className="mb-10 justify-center" />
        <p className="font-display text-7xl font-semibold text-fir-700">404</p>
        <h1 className="mt-2 text-2xl">This page does not exist</h1>
        <p className="mt-2 text-muted">The link may be old, or the address was mistyped.</p>
        <Link to="/dashboard" className={buttonClass('primary', 'mt-8')}>Go to dashboard</Link>
      </div>
    </main>
  )
}