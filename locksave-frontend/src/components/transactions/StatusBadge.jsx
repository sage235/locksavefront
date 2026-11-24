import { X } from 'lucide-react'

const MAP = {
  PENDING: { label: 'Pending', cls: 'bg-tomato-50 text-tomato-700' },
  COMPLETED: { label: 'Completed', cls: 'bg-fir-50 text-fir-700' },
  FAILED: { label: 'Failed', cls: 'bg-tomato-50 text-tomato-700' },
  REVERSED: { label: 'Reversed', cls: 'bg-cream-200 text-muted' },
}

export default function StatusBadge({ status }) {
  const { label, cls } = MAP[status] ?? MAP.PENDING
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {status === 'PENDING' && <span aria-hidden className="size-1.5 rounded-full bg-tomato-500 motion-safe:animate-pulse" />}
      {status === 'FAILED' && <X aria-hidden className="size-3" />}
      {label}
    </span>
  )
}