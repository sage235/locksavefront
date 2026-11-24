import { ArrowDownLeft, ArrowUpRight, Bell, LockOpen, Target } from 'lucide-react'
import { cleanMessage, timeAgo } from '../../utils/format'

const ICONS = {
  DEPOSIT_CONFIRMED: ArrowDownLeft,
  WITHDRAWAL_COMPLETED: ArrowUpRight,
  VAULT_UNLOCKED: LockOpen,
  GOAL_REACHED: Target,
}

export default function NotificationItem({ n, onRead }) {
  const Icon = ICONS[n.type] ?? Bell
  return (
    <li>
      <button
        type="button"
        onClick={() => !n.read && onRead(n.id)}
        className={`flex w-full items-start gap-4 p-4 text-left transition ${n.read ? 'hover:bg-cream-200/50' : 'bg-fir-50/70 hover:bg-fir-50'}`}
      >
        <span className={`grid size-10 shrink-0 place-items-center rounded-full ${n.read ? 'bg-cream-200 text-muted' : 'bg-fir-700 text-cream-100'}`}>
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-3">
            <span className={n.read ? 'font-medium' : 'font-semibold'}>{n.title}</span>
            <time dateTime={n.createdAt} className="shrink-0 text-xs text-muted">{timeAgo(n.createdAt)}</time>
          </span>
          <span className="mt-1 block whitespace-pre-line text-sm text-muted">{cleanMessage(n.message)}</span>
        </span>
        {!n.read && (
          <>
            <span aria-hidden className="mt-2 size-2.5 shrink-0 rounded-full bg-tomato-600" />
            <span className="sr-only">Unread</span>
          </>
        )}
      </button>
    </li>
  )
}