import { useEffect, useState } from 'react'

const MIN = 60_000
const HOUR = 3_600_000
const DAY = 86_400_000

export function useCountdown(unlockDate) {
  // The backend treats a vault as open from 00:00 on its unlock date.
  const target = unlockDate ? new Date(`${unlockDate}T00:00:00`).getTime() : 0
  const [now, setNow] = useState(() => Date.now())

  const remaining = Math.max(0, target - now)
  const done = remaining === 0
  const underHour = remaining < HOUR

  useEffect(() => {
    if (done) return
    // Tick every minute, or every second during the final hour.
    const id = setInterval(() => setNow(Date.now()), underHour ? 1000 : MIN)
    // Background tabs throttle timers, so resync when the tab comes back.
    const onVisible = () => { if (!document.hidden) setNow(Date.now()) }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [done, underHour])

  const daysLeft = Math.ceil(remaining / DAY) // matches the backend's calendar-day count
  const hours = Math.floor((remaining % DAY) / HOUR)
  const minutes = Math.floor((remaining % HOUR) / MIN)
  const seconds = Math.floor((remaining % MIN) / 1000)
  const isLastDay = !done && remaining < DAY

  const short = done
    ? 'Open'
    : isLastDay
      ? hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${String(seconds).padStart(2, '0')}s`
      : `${daysLeft}d`

  return { remaining, done, daysLeft, hours, minutes, seconds, isLastDay, short }
}