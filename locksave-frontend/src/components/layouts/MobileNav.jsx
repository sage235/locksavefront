import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'
import { useUnreadCount } from '../../hooks/useNotifications'

export default function MobileNav() {
  const unread = useUnreadCount()
  return (
    <nav aria-label="Main"
         className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-cream-200 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex h-16 flex-col items-center justify-center gap-1 text-xs ${isActive ? 'font-semibold text-fir-700' : 'text-muted'}`
          }
        >
          <span className="relative">
            <Icon className="size-5" aria-hidden />
            {badge && unread > 0 && (
              <span aria-label={`${unread} unread`}
                    className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-tomato-600 px-1 text-[10px] font-semibold text-white">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}