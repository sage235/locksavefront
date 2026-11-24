import logo from '../../assets/logo.svg'
import logoLight from '../../assets/logo-light.svg'

export default function Brand({ dark = false, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src={dark ? logoLight : logo} alt="" width="36" height="36" className="size-9" />
      <span className="font-display text-xl font-semibold">LockSave</span>
    </div>
  )
}