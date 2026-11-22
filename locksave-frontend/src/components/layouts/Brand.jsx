import { Lock } from 'lucide-react'

export default function Brand({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="grid size-9 place-items-center rounded-full bg-fir-700 text-cream-100">
        <Lock className="size-4" aria-hidden />
      </span>
      <span className="font-display text-xl font-semibold">LockSave</span>
    </div>
  )
}