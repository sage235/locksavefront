import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '../api/notifications.api'

export function useUnreadCount() {
  const { data } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => getNotifications(0, 1),
    select: (res) => res.data.unreadCount,
    refetchInterval: 60_000,
  })
  return data ?? 0
}