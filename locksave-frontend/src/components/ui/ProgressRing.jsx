export default function ProgressRing({ percent = 0, size = 44, stroke = 4.5, open = false }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const p = Math.min(100, Math.max(0, percent))
  const mid = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${p}% of goal saved`} className="shrink-0">
      <circle cx={mid} cy={mid} r={r} fill="none" strokeWidth={stroke} className={open ? 'stroke-fir-500/25' : 'stroke-cream-200'} />
      <circle cx={mid} cy={mid} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
              strokeDasharray={`${(c * p) / 100} ${c}`} transform={`rotate(-90 ${mid} ${mid})`}
              className={open ? 'stroke-fir-700' : 'stroke-fir-500'} />
      <text x="50%" y="50%" dy=".35em" textAnchor="middle" className="fill-fir-900 text-[11px] font-semibold">{Math.round(p)}</text>
    </svg>
  )
}