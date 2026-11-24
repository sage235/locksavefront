import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import LockDial from './LockDial'
import { useCountdown } from '../../hooks/useCountdown'
import { formatRWF, lockElapsedRatio } from '../../utils/format'

export default function VaultHero({ vault, children }) {
  const qc = useQueryClient()
  const cd = useCountdown(vault.unlockDate)
  const closed = vault.status === 'CLOSED'
  const open = !vault.locked

  // Countdown reached zero while the page was open: fetch the new state.
  useEffect(() => {
    if (cd.done && vault.locked && !closed) qc.invalidateQueries({ queryKey: ['vaults'] })
  }, [cd.done, vault.locked, closed, qc])

  const done = Math.round(lockElapsedRatio(vault.createdAt, vault.unlockDate) * 120)
  const days = Math.max(1, cd.daysLeft)

  const dial = closed
    ? { value: 'Closed', caption: 'this vault is closed', valueSize: 40, done: 120 }
    : open
      ? { value: 'Open', caption: 'ready to withdraw', valueSize: 44, done: 120 }
      : cd.isLastDay
        ? { value: cd.short, caption: 'until it opens', valueSize: 34, done }
        : { value: String(days), caption: days === 1 ? 'day until it opens' : 'days until it opens', valueSize: 62, done }

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-fir-500 to-fir-900 p-6 text-cream-100 sm:p-8">
      <svg aria-hidden viewBox="0 0 400 400" fill="none" className="pointer-events-none absolute left-1/2 top-24 size-[34rem] -translate-x-1/2 opacity-[0.07]">
        {[70, 110, 150, 190].map((r) => <circle key={r} cx="200" cy="200" r={r} className="stroke-cream-100" />)}
      </svg>
      <div className="relative">
        <p className="text-xs font-semibold tracking-[0.14em] text-cream-100/75">
          {closed ? 'CLOSED' : open ? 'OPEN' : 'LOCKED'}
        </p>
        <h2 className="mt-1 text-2xl">{vault.title}</h2>
        <LockDial className="mx-auto my-6 h-auto max-w-full" size={280} ticks={120} {...dial} />
        <dl className="grid grid-cols-2 gap-4 border-t border-cream-100/20 pt-5">
          <div>
            <dt className="text-[11px] font-semibold tracking-[0.12em] text-cream-100/75">SAVED</dt>
            <dd className="mt-1 font-display text-lg font-semibold">{formatRWF(vault.currentBalance)}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold tracking-[0.12em] text-cream-100/75">GOAL</dt>
            <dd className="mt-1 font-display text-lg font-semibold">{formatRWF(vault.goalAmount)}</dd>
          </div>
        </dl>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  )
}