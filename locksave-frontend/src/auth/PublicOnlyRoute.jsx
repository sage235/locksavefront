import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function PublicOnlyRoute() {
  const { isAuthenticated, booting } = useAuth()
  if (booting) return null
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}