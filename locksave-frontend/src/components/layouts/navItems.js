import { Bell, LayoutDashboard, Lock, User } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vaults', label: 'My vaults', icon: Lock },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: true },
  { to: '/profile', label: 'Profile', icon: User },
]