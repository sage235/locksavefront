import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function ProtectedRoute() {
  const { isAuthenticated, booting } = useAuth()
  const location = useLocation()
  if (booting) return <div className="grid min-h-screen place-items-center text-muted">Loading…</div>
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}