import { Check } from 'lucide-react'
import { PAYMENT_LABELS } from '../../utils/constants'

export default function PaymentMethodPicker({ legend, methods, register, error }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {methods.map(({ value, enabled }) => (
          <label
            key={value}
            className={`group flex items-center justify-between gap-2 rounded-xl border border-cream-300 bg-cream-50 px-3.5 py-3 text-sm transition has-[:checked]:border-fir-700 has-[:checked]:bg-fir-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-fir-500/40 ${enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-55'}`}
          >
            <input type="radio" value={value} disabled={!enabled} className="sr-only" {...register('paymentMethod')} />
            <span className="font-medium">{PAYMENT_LABELS[value]}</span>
            {enabled
              ? <Check aria-hidden className="size-4 text-fir-700 opacity-0 group-has-[:checked]:opacity-100" />
              : <span className="text-xs text-muted">Soon</span>}
          </label>
        ))}
      </div>
      {error && <p role="alert" className="mt-1.5 text-sm text-tomato-700">{error}</p>}
    </fieldset>
  )
}