import { Link } from 'react-router-dom'
import { Lock, Plus } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import VaultRow from '../components/vault/VaultRow'
import EmptyState from '../components/ui/EmptyState'
import ErrorState from '../components/ui/ErrorState'
import Skeleton from '../components/ui/Skeleton'
import { buttonClass } from '../components/ui/Button'
import { useVaults } from '../hooks/useVaults'

const NewVaultLink = () => (
  <Link to="/vaults/new" className={buttonClass('primary')}><Plus className="size-4" aria-hidden />New vault</Link>
)

export default function VaultsPage() {
  const { data: vaults, isPending, isError, error, refetch } = useVaults()
  const live = vaults?.filter((v) => v.status !== 'CLOSED') ?? []
  const closed = vaults?.filter((v) => v.status === 'CLOSED') ?? []
  const openCount = live.filter((v) => !v.locked).length

  return (
    <>
      <PageHeader
        title="My vaults"
        subtitle={vaults && live.length ? `${live.length - openCount} locked, ${openCount} open` : 'Money set aside for what matters.'}
      >
        {live.length > 0 && <NewVaultLink />}
      </PageHeader>

      {isPending && <div className="space-y-3"><Skeleton className="h-20" /><Skeleton className="h-20" /><Skeleton className="h-20" /></div>}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {vaults && live.length === 0 && (
        <EmptyState icon={Lock} title="Create your first vault"
                    text="Pick a goal and a date. The money stays put until that day.">
          <NewVaultLink />
        </EmptyState>
      )}

      {live.length > 0 && (
        <div className="divide-y divide-cream-200 overflow-hidden rounded-3xl border border-cream-200 bg-cream-50">
          {live.map((v) => <VaultRow key={v.id} vault={v} />)}
        </div>
      )}

      {closed.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg text-muted">Closed vaults</h2>
          <div className="divide-y divide-cream-200 overflow-hidden rounded-3xl border border-cream-200">
            {closed.map((v) => <VaultRow key={v.id} vault={v} />)}
          </div>
        </section>
      )}
    </>
  )
}