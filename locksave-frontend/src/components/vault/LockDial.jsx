const RAD = Math.PI / 180

export default function LockDial({ ticks = 120, done = 73, value = '47', caption = 'days until it opens', size = 300, className = '' }) {
  const c = 150, R = 118
  const deg = (i) => -90 + (i * 360) / ticks
  const pt = (d, r) => [c + r * Math.cos(d * RAD), c + r * Math.sin(d * RAD)]
  const [mx, my] = pt(deg(done), R + 17)
  const [ix, iy] = pt(deg(done), R - 30)
  const [ox, oy] = pt(deg(done), R + 8)

  return (
    <svg viewBox="0 0 300 300" width={size} height={size} role="img" aria-label={`${value} ${caption}`} className={className}>
      {Array.from({ length: ticks }, (_, i) => {
        const L = 16 + (i % 10 === 0 ? 7 : 0)
        const [x1, y1] = pt(deg(i), R - L)
        const [x2, y2] = pt(deg(i), R)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2.4" strokeLinecap="round"
                className={i < done ? 'stroke-cream-100' : 'stroke-cream-100/25'} />
        )
      })}
      <circle cx={c} cy={c} r={R - 40} fill="none" className="stroke-cream-100/30" />
      <line x1={ix} y1={iy} x2={ox} y2={oy} strokeWidth="4.2" strokeLinecap="round" className="stroke-tomato-400" />
      <circle cx={mx} cy={my} r="9" className="fill-tomato-500/25" />
      <circle cx={mx} cy={my} r="4.5" className="fill-tomato-400" />
      <text x={c} y={c + 16} textAnchor="middle" className="fill-cream-100 font-display text-[62px] font-semibold">{value}</text>
      <text x={c} y={c + 42} textAnchor="middle" className="fill-cream-100/75 text-[13px]">{caption}</text>
    </svg>
  )
}