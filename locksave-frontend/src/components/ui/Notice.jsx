import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Notice({ type = 'error', children }) {
  const error = type === 'error'
  const Icon = error ? AlertCircle : CheckCircle2
  return (
    <div role={error ? 'alert' : 'status'}
         className={`flex items-start gap-2.5 rounded-xl p-3.5 text-sm ${error ? 'bg-tomato-50 text-tomato-700' : 'bg-fir-50 text-fir-700'}`}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </div>
  )
}