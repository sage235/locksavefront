import { Lock } from 'lucide-react'
import LockDial from '../vault/LockDial'
import { useEffect } from 'react'

function Logo({ dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`grid size-9 place-items-center rounded-full ${dark ? 'bg-cream-100 text-fir-700' : 'bg-fir-700 text-cream-100'}`}>
        <Lock className="size-4" aria-hidden />
      </span>
      <span className="font-display text-xl font-semibold">LockSave</span>
    </div>
  )
}

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-b from-fir-700 to-fir-900 p-12 text-cream-100 lg:flex">
        <svg aria-hidden viewBox="0 0 400 400" fill="none"
             className="pointer-events-none absolute -bottom-40 -right-40 size-[34rem] opacity-[0.07]">
          {[60, 100, 140, 180].map((r) => <circle key={r} cx="200" cy="200" r={r} className="stroke-cream-100" />)}
        </svg>
        <Logo dark />
        <div className="relative">
          <h2 className="max-w-sm text-4xl leading-tight">Lock it in. Open it on your day.</h2>
          <p className="mt-4 max-w-sm text-cream-100/75">
            Save toward school fees, a laptop or a business with money that stays put until the date you choose.
          </p>
          <LockDial className="mt-10" size={280} />
        </div>
        <p className="relative text-sm text-cream-100/60">Deposit with Mobile Money.</p>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden"><Logo /></div>
          <h1 className="text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-muted">{footer}</div>}
        </div>
      </main>
    </div>
  )
}