import { Doughnut } from 'react-chartjs-2'
import '../../lib/chart'
import { formatRWF } from '../../utils/format'

const COLORS = ['#1F4D3A', '#2F6B52', '#6FA58C', '#C9B98F', '#E4472D', '#12301F']

export default function SavingsChart({ vaults }) {
  const slices = vaults
    .filter((v) => Number(v.currentBalance) > 0)
    .sort((a, b) => Number(b.currentBalance) - Number(a.currentBalance))
  const total = slices.reduce((s, v) => s + Number(v.currentBalance), 0)

  if (total === 0) {
    return <p className="text-sm text-muted">Your savings split appears here after your first deposit.</p>
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const data = {
    labels: slices.map((v) => v.title),
    datasets: [{
      data: slices.map((v) => Number(v.currentBalance)),
      backgroundColor: slices.map((_, i) => COLORS[i % COLORS.length]),
      borderColor: '#FBF7EC',
      borderWidth: 3,
      hoverOffset: 4,
    }],
  }
  const options = {
    cutout: '68%',
    animation: reduceMotion ? false : undefined,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (c) => ` ${formatRWF(c.parsed)}` } },
    },
  }

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row">
      <div className="relative size-48 shrink-0">
        <Doughnut data={data} options={options} role="img" aria-label="Share of total savings by vault" />
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <span className="text-xs text-muted">Total</span>
          <span className="font-display text-lg font-semibold">{formatRWF(total)}</span>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {slices.map((v, i) => (
          <li key={v.id} className="flex items-center gap-3 text-sm">
            <span aria-hidden className="size-3 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="min-w-0 flex-1 truncate">{v.title}</span>
            <span className="text-muted">{Math.round((Number(v.currentBalance) / total) * 100)}%</span>
            <span className="w-28 text-right font-medium">{formatRWF(v.currentBalance)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
