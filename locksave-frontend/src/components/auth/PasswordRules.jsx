import { Check, Circle } from 'lucide-react'
import { PASSWORD_RULES } from '../../utils/validators'

export default function PasswordRules({ value = '' }) {
  return (
    <ul className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2" aria-label="Password requirements">
      {PASSWORD_RULES.map((r) => {
        const ok = r.test(value)
        return (
          <li key={r.id} className={`flex items-center gap-2 ${ok ? 'text-fir-700' : 'text-muted'}`}>
            {ok ? <Check className="size-4" aria-hidden /> : <Circle className="size-3 ml-0.5" aria-hidden />}
            {r.label}
          </li>
        )
      })}
    </ul>
  )
}