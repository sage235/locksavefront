import { useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import PageHeader from '../../components/layouts/PageHeader'
import NotificationItem from '../../components/notifications/NotificationItem'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import Skeleton from '../../components/ui/Skeleton'
import { useMarkAllRead, useMarkRead, useNotificationList } from '../../hooks/useNotifications'

export default function NotificationsPage() {
  const [page, setPage] = useState(0)
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useNotificationList(page)
  const markOne = useMarkRead()
  const markAll = useMarkAllRead()

  const items = data?.notifications.filter((n) => n.channel === 'IN_APP') ?? []
  const unread = data?.unreadCount ?? 0

  const onError = (err) => toast.error(err.message)

  return (
    <>
      <PageHeader title="Notifications" subtitle={data ? (unread ? `${unread} unread` : "You're all caught up") : ' '}>
        <Button variant="ghost" disabled={unread === 0} loading={markAll.isPending}
                onClick={() => markAll.mutate(undefined, { onError })}>
          <CheckCheck className="size-4" aria-hidden />Mark all as read
        </Button>
      </PageHeader>

      <div className="max-w-3xl">
        {isPending && <div className="space-y-2"><Skeleton className="h-20" /><Skeleton className="h-20" /><Skeleton className="h-20" /></div>}
        {isError && <ErrorState message={error.message} onRetry={refetch} />}
        {data && items.length === 0 && (
          <EmptyState icon={Bell} title="Nothing here yet" text="Deposit confirmations, unlock reminders and goal updates will appear here." />
        )}

        {items.length > 0 && (
          <div className={isPlaceholderData ? 'opacity-60 transition' : 'transition'}>
            <ul className="divide-y divide-cream-200 overflow-hidden rounded-3xl border border-cream-200 bg-cream-50">
              {items.map((n) => (
                <NotificationItem key={n.id} n={n} onRead={(id) => markOne.mutate(id, { onError })} />
              ))}
            </ul>

            {data.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between text-sm text-muted">
                <Button variant="ghost" className="h-9 px-3.5" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Newer</Button>
                <span>Page {data.page + 1} of {data.totalPages}</span>
                <Button variant="ghost" className="h-9 px-3.5" disabled={data.last} onClick={() => setPage((p) => p + 1)}>Older</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}