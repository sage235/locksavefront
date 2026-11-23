import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import ProgressRing from '../ui/ProgressRing'
import LockBadge from './LockBadge'
import { formatRWF } from '../../utils/format'

export default function VaultRow({ vault }) {
  const open = !vault.locked && vault.status !== 'CLOSED'
  return (
    <Link to={`/vaults/${vault.id}`}
          className={`flex items-center gap-4 p-4 transition ${open ? 'bg-fir-50 hover:bg-fir-50/60' : 'hover:bg-cream-200/60'} ${vault.status === 'CLOSED' ? 'opacity-70' : ''}`}>
      <ProgressRing percent={vault.progressPercent} open={open} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{vault.title}</p>
        <LockBadge vault={vault} />
      </div>
      <div className="text-right">
        <p className="font-display font-semibold">{formatRWF(vault.currentBalance)}</p>
        <p className="text-xs text-muted">of {formatRWF(vault.goalAmount)}</p>
      </div>
      <ChevronRight className="hidden size-4 shrink-0 text-muted sm:block" aria-hidden />
    </Link>
  )
}