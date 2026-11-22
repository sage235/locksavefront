import { Loader2 } from 'lucide-react'

const styles = {
  primary: 'bg-fir-700 text-cream-100 hover:bg-fir-900',
  accent: 'bg-tomato-600 text-white hover:bg-tomato-700',
  ghost: 'border border-cream-300 text-fir-900 hover:bg-cream-200',
}

export default function Button({ variant = 'primary', loading = false, className = '', disabled, children, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fir-500 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}