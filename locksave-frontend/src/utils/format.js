const pad = (n) => String(n).padStart(2, '0')
export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayISO = () => toISODate(new Date())
export const addMonthsISO = (n, from = new Date()) => {
  const d = new Date(from)
  d.setMonth(d.getMonth() + n)
  return toISODate(d)
}

// 0..1: how far through the lock period we are (drives the dial ticks)
export function lockElapsedRatio(createdAt, unlockDate) {
  const start = new Date(createdAt).getTime()
  const end = new Date(`${unlockDate}T00:00:00`).getTime()
  if (!(end > start)) return 1
  return Math.min(1, Math.max(0, (Date.now() - start) / (end - start)))
}