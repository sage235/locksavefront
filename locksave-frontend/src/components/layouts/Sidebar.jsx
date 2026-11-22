import { Link, NavLink } from 'react-router-dom'
import { Lock } from 'lucide-react'
import Brand from './Brand'
import { NAV_ITEMS } from './navItems'
import { useAuth } from '../../auth/useAuth'
import { useUnreadCount } from '../../hooks/useNotifications'
import { initials } from '../../utils/format'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const unread = useUnreadCount()
  const name = user?.fullName ?? user?.email ?? ''

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-cream-200 bg-cream-50 p-4 lg:flex">
      <Link to="/dashboard" className="px-2 pb-8 pt-2" aria-label="LockSave home"><Brand /></Link>

      <nav aria-label="Main" className="space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex h-11 items-center gap-3 rounded-xl px-3.5 text-[15px] transition ${
                isActive ? 'bg-fir-700 font-medium text-cream-100' : 'hover:bg-cream-200'
              }`
            }
          >
            <Icon className="size-[18px]" aria-hidden />
            <span className="flex-1">{label}</span>
            {badge && unread > 0 && (
              <span aria-label={`${unread} unread`}
                    className="grid h-5 min-w-5 place-items-center rounded-full bg-tomato-600 px-1.5 text-xs font-semibold text-white">
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex items-start gap-3 rounded-2xl bg-fir-50 p-3.5 text-sm text-fir-700">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>Withdrawals open on the dates you choose.</p>
        </div>
        <div className="flex items-center gap-3 px-1">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-fir-700 text-sm font-semibold text-cream-100">
            {initials(name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{name}</p>
            <button onClick={logout} className="text-xs text-muted hover:text-fir-900">Log out</button>
          </div>
        </div>
      </div>
    </aside>
  )
}