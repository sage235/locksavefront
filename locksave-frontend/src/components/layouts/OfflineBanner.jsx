import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export default function OfflineBanner() {
  if (useOnlineStatus()) return null
  return (
    <div role="status" className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-tomato-700 px-4 py-2 text-sm text-white">
      <WifiOff className="size-4" aria-hidden />
      You are offline. Changes cannot be saved until you reconnect.
    </div>
  )
}