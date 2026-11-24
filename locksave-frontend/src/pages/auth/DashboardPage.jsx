import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Plus } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import VaultHero from '../components/vault/VaultHero'
import VaultRow from '../components/vault/VaultRow'
import SavingsChart from '../components/charts/SavingsChart'
import ActivityList from '../components/transactions/ActivityList'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import Skeleton from '../components/ui/Skeleton'
import { buttonClass } from '../components/ui/Button'
import { useAuth } from '../auth/useAuth'
import { useVaults } from '../hooks/useVaults'
import { useRecentActivity } from '../hooks/useRecentActivity'
import { formatDate, formatRWF } from '../utils/format'
import { lazy, Suspense, useMemo } from 'react'
const SavingsChart = lazy(() => import('../components/charts/SavingsChart'))

const Stat = ({ label, children }) => (
  <div className="px-5 py-4">
    <dt className="text-sm text-muted">{label}</dt>
    <dd className="mt-1 font-display text-lg font-semibold">{children}</dd>
  </div>
)

const Section = ({ title, action, children }) => (
  <section>
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-xl">{title}</h2>
      {action}
    </div>
    {children}
  </section>
)

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: vaults, isPending, isError, error, refetch } = useVaults()

  const live = useMemo(() => vaults?.filter((v) => v.status !== 'CLOSED') ?? [], [vaults])
  const locked = useMemo(() => live.filter((v) => v.locked).sort((a, b) => a.unlockDate.localeCompare(b.unlockDate)), [live])
  const open = useMemo(() => live.filter((v) => !v.locked), [live])
  const next = locked[0] ?? open.find((v) => Number(v.currentBalance) > 0) ?? live[0]
  const total = live.reduce((s, v) => s + Number(v.currentBalance), 0)
  const ledger = [...locked, ...open].slice(0, 5)
  const activity = useRecentActivity(live)

  const firstName = user?.fullName?.split(' ')[0] ?? ''
  const header = (
    <PageHeader
      title={`Muraho, ${firstName}`}
      subtitle={live.length ? `${locked.length} locked, ${open.length} open` : 'Start by creating your first vault.'}
    >
      <span className="rounded-full bg-cream-200 px-3.5 py-1.5 text-sm">{formatDate(new Date())}</span>
    </PageHeader>
  )

  if (isPending) {
    return <>{header}<div className="grid gap-8 lg:grid-cols-[380px_1fr]"><Skeleton className="h-[34rem]" /><Skeleton className="h-96" /></div></>
  }
  if (isError) return <>{header}<ErrorState message={error.message} onRetry={refetch} /></>

  if (live.length === 0) {
    return (
      <>
        {header}
        <EmptyState icon={Lock} title="Create your first vault" text="Pick a goal and a date. The money stays put until that day.">
          <Link to="/vaults/new" className={buttonClass('primary')}><Plus className="size-4" aria-hidden />New vault</Link>
        </EmptyState>
      </>
    )
  }

  return (
    <>
      {header}
      <div className="grid items-start gap-8 lg:grid-cols-[380px_1fr]">
        <VaultHero vault={next}>
          <div className="space-y-3">
            <Link to={`/vaults/${next.id}`} className={buttonClass('accent', 'w-full')}>Add money</Link>
            <p className="text-center text-sm text-cream-100/70">
              {next.locked ? `Opens on ${formatDate(next.unlockDate)}` : 'Ready to withdraw'}
            </p>
          </div>
        </VaultHero>

        <div className="space-y-10">
          <dl className="grid divide-y divide-cream-200 rounded-2xl border border-cream-200 bg-cream-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Stat label="Total saved">{formatRWF(total)}</Stat>
            <Stat label="Locked vaults">{locked.length}</Stat>
            <Stat label="Opens next">{next.locked ? formatDate(next.unlockDate) : 'Now'}</Stat>
          </dl>

          <Section
            title="Your vaults"
            action={
              <div className="flex items-center gap-4 text-sm">
                {live.length > ledger.length && (
                  <Link to="/vaults" className="font-medium text-fir-700 underline-offset-4 hover:underline">See all {live.length}</Link>
                )}
                <Link to="/vaults/new" className="inline-flex items-center gap-1 font-medium text-fir-700 underline-offset-4 hover:underline">
                  <Plus className="size-4" aria-hidden />New
                </Link>
              </div>
            }
          >
            <div className="divide-y divide-cream-200 overflow-hidden rounded-3xl border border-cream-200 bg-cream-50">
              {ledger.map((v) => <VaultRow key={v.id} vault={v} />)}
            </div>
          </Section>

          <Section title="Where your savings are">
            <div className="rounded-3xl border border-cream-200 bg-cream-50 p-6">
              <SavingsChart vaults={live} />
            </div>
          </Section>

          <Section title="Recent activity">
            <ActivityList {...activity} />
          </Section>
        </div>
      </div>
    </>
  )
}