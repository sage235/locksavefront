import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getNotifications, markAllRead, markRead } from '../api/notifications.api'

export function useUnreadCount() {
  const { data } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: () => getNotifications(0, 1),
    select: (res) => res.data.unreadCount,
    refetchInterval: 60_000,
  })
  return data ?? 0
}

export function useNotificationList(page = 0, size = 15) {
  return useQuery({
    queryKey: ['notifications', 'list', page],
    queryFn: () => getNotifications(page, size),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
  })
}

function useNotificationMutation(fn) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }), // also refreshes the sidebar badge
  })
}

export const useMarkRead = () => useNotificationMutation(markRead)
export const useMarkAllRead = () => useNotificationMutation(markAllRead)