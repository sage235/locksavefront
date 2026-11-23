export default function Skeleton({ className = '' }) {
  return <div aria-hidden className={`animate-pulse rounded-xl bg-cream-200 ${className}`} />
}