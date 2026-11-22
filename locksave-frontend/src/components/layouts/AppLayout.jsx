import { Link, Outlet } from 'react-router-dom'
import Brand from './Brand'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'
import { useAuth } from '../../auth/useAuth'
import { initials } from '../../utils/format'

export default function AppLayout() {
  const { user } = useAuth()
  return (
    <div className="flex min-h-screen">
      <a href="#main"
         className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-fir-700 focus:px-4 focus:py-2 focus:text-cream-100">
        Skip to content
      </a>
      <Sidebar />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-cream-200 bg-cream-50/95 px-4 backdrop-blur lg:hidden">
          <Link to="/dashboard" aria-label="LockSave home"><Brand /></Link>
          <Link to="/profile" aria-label="Profile"
                className="grid size-9 place-items-center rounded-full bg-fir-700 text-sm font-semibold text-cream-100">
            {initials(user?.fullName ?? user?.email)}
          </Link>
        </header>
        <main id="main" className="mx-auto w-full max-w-6xl px-5 pb-24 pt-6 sm:px-8 lg:pb-12 lg:pt-10">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}