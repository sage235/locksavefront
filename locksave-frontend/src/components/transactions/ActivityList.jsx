import { Link } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, Receipt } from 'lucide-react'
import StatusBadge from './StatusBadge'
import EmptyState from '../ui/EmptyState'
import Notice from '../ui/Notice'
import Skeleton from '../ui/Skeleton'
import { formatDateTime, formatRWF } from '../../utils/format'

export default function ActivityList({ items, isPending, isError }) {
  if (isPending) return <div className="space-y-2"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
  if (isError && items.length === 0) return <Notice>Could not load recent activity.</Notice>
  if (items.length === 0) {
    return <EmptyState icon={Receipt} title="No activity yet" text="Deposits and withdrawals across your vaults appear here." />
  }

  return (
    <ul className="divide-y divide-cream-200 overflow-hidden rounded-2xl border border-cream-200 bg-cream-50">
      {items.map((t) => {
        const deposit = t.transactionType === 'DEPOSIT'
        const Icon = deposit ? ArrowDownLeft : ArrowUpRight
        return (
          <li key={t.id} className="flex items-center gap-4 p-4">
            <span className={`grid size-10 shrink-0 place-items-center rounded-full ${deposit ? 'bg-fir-50 text-fir-700' : 'bg-cream-200'}`}>
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {deposit ? 'Deposit to ' : 'Withdrawal from '}
                <Link to={`/vaults/${t.vaultId}`} className="underline-offset-4 hover:underline">{t.vaultTitle}</Link>
              </p>
              <p className="text-xs text-muted">{formatDateTime(t.createdAt)}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <p className={`font-display font-semibold ${deposit ? 'text-fir-700' : ''}`}>
                <span className="sr-only">{deposit ? 'Plus' : 'Minus'}</span>
                {deposit ? '+' : '-'} {formatRWF(t.amount)}
              </p>
              <StatusBadge status={t.status} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}