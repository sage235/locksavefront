import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Receipt } from 'lucide-react'
import StatusBadge from './StatusBadge'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'
import Skeleton from '../ui/Skeleton'
import Button from '../ui/Button'
import { useVaultTransactions } from '../../hooks/useTransactions'
import { PAYMENT_LABELS } from '../../utils/constants'
import { formatDateTime, formatRWF } from '../../utils/format'

export default function TransactionList({ vaultId }) {
  const [page, setPage] = useState(0)
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useVaultTransactions(vaultId, page)

  if (isPending) return <div className="space-y-2"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />
  if (data.transactions.length === 0) {
    return <EmptyState icon={Receipt} title="No transactions yet" text="Deposits and withdrawals will show up here." />
  }

  return (
    <div className={isPlaceholderData ? 'opacity-60 transition' : 'transition'}>
      <ul className="divide-y divide-cream-200 overflow-hidden rounded-2xl border border-cream-200 bg-cream-50">
        {data.transactions.map((t) => {
          const deposit = t.transactionType === 'DEPOSIT'
          const Icon = deposit ? ArrowDownLeft : ArrowUpRight
          return (
            <li key={t.id} className="flex items-center gap-4 p-4">
              <span className={`grid size-10 shrink-0 place-items-center rounded-full ${deposit ? 'bg-fir-50 text-fir-700' : 'bg-cream-200 text-fir-900'}`}>
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{deposit ? 'Deposit' : 'Withdrawal'}</p>
                <p className="text-sm text-muted">{PAYMENT_LABELS[t.paymentMethod] ?? t.paymentMethod}</p>
                <p className="text-xs text-muted">{formatDateTime(t.createdAt)}</p>
                {import.meta.env.DEV && (
                  <p className="mt-0.5 truncate font-mono text-[11px] text-muted/80" title="Shown in development only">
                    {t.transactionReference}{t.failureReason ? `: ${t.failureReason}` : ''}
                  </p>
                )}
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

      {data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <Button variant="ghost" className="h-9 px-3.5" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Newer</Button>
          <span>Page {data.page + 1} of {data.totalPages}</span>
          <Button variant="ghost" className="h-9 px-3.5" disabled={data.last} onClick={() => setPage((p) => p + 1)}>Older</Button>
        </div>
      )}
    </div>
  )
}