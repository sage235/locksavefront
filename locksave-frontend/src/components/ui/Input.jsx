import { forwardRef, useId, useState } from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

const Input = forwardRef(function Input({ label, error, hint, type = 'text', className = '', ...props }, ref) {
  const id = useId()
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={isPassword && show ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          className={`h-12 w-full rounded-xl border bg-cream-50 px-3.5 outline-none transition placeholder:text-muted/60 focus:border-fir-500 focus:ring-2 focus:ring-fir-500/20 ${error ? 'border-tomato-700' : 'border-cream-300'} ${isPassword ? 'pr-11' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted hover:text-fir-900"
          >
            {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-tomato-700">
          <AlertCircle className="size-4 shrink-0" aria-hidden />{error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  )
})

export default Input