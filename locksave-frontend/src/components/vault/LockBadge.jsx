import { Lock, LockOpen } from 'lucide-react'
import { formatDate } from '../../utils/format'

export default function LockBadge({ vault }) {
  if (vault.status === 'CLOSED') return <span className="text-xs text-muted">Closed</span>
  const open = !vault.locked
  const Icon = open ? LockOpen : Lock
  return (
    <span className={`mt-0.5 inline-flex items-center gap-1.5 text-xs ${open ? 'font-medium text-fir-700' : 'text-muted'}`}>
      <Icon className="size-3.5" aria-hidden />
      {open ? 'Open to withdraw' : `Locked until ${formatDate(vault.unlockDate)}`}
    </span>
  )
}