import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import VaultHero from '../../components/vault/VaultHero'
import EditVaultModal from '../../components/vault/EditVaultModal'
import MoneyModal from '../../components/vault/MoneyModal'
import TransactionList from '../../components/transactions/TransactionList'
import Button, { buttonClass } from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import Skeleton from '../../components/ui/Skeleton'
import { useCloseVault, useVault } from '../../hooks/useVaults'
import { formatDate, formatRWF } from '../../utils/format'

const Row = ({ label, children }) => (
  <div className="flex items-center justify-between gap-4 py-3.5">
    <dt className="text-muted">{label}</dt>
    <dd className="text-right font-medium">{children}</dd>
  </div>
)

export default function VaultDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: vault, isPending, isError, error, refetch } = useVault(id)
  const close = useCloseVault(id)
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [money, setMoney] = useState(null) // null | 'deposit' | 'withdraw'

  const back = (
    <Link to="/vaults" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fir-900">
      <ArrowLeft className="size-4" aria-hidden />My vaults
    </Link>
  )

  if (isPending) {
    return (
      <>
        {back}
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Skeleton className="h-[34rem]" />
          <Skeleton className="h-96" />
        </div>
      </>
    )
  }

  if (isError) {
    return (
      <>
        {back}
        {error.status === 404 ? (
          <EmptyState icon={Lock} title="Vault not found" text="It may have been removed, or it belongs to another account.">
            <Link to="/vaults" className={buttonClass('primary')}>Back to my vaults</Link>
          </EmptyState>
        ) : (
          <ErrorState message={error.message} onRetry={refetch} />
        )}
      </>
    )
  }

  const closed = vault.status === 'CLOSED'
  const empty = Number(vault.currentBalance) === 0
  const canClose = !closed && !vault.locked && empty
  const canWithdraw = !vault.locked && !empty

  const withdrawNote = vault.locked
    ? `Withdrawals open on ${formatDate(vault.unlockDate)}`
    : empty
      ? 'Nothing to withdraw yet'
      : ''

  const closeHint = vault.locked
    ? 'A vault can be closed once it unlocks and its balance is zero.'
    : !empty
      ? 'Withdraw the full balance before closing.'
      : ''

  async function onClose() {
    try {
      await close.mutateAsync()
      toast.success('Vault closed')
      navigate('/vaults', { replace: true })
    } catch (err) {
      setConfirming(false)
      toast.error(err.message)
    }
  }

  return (
    <>
      {back}
      <div className="grid items-start gap-8 lg:grid-cols-[380px_1fr]">
        <VaultHero vault={vault}>
          {!closed && (
            <div className="space-y-3">
              <Button variant="accent" className="w-full" onClick={() => setMoney('deposit')}>
                Add money
              </Button>
              <Button variant="onDark" className="w-full" disabled={!canWithdraw} onClick={() => setMoney('withdraw')}>
                Withdraw
              </Button>
              {withdrawNote && <p className="text-center text-sm text-cream-100/70">{withdrawNote}</p>}
            </div>
          )}
        </VaultHero>

        <div className="space-y-10">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl">Details</h2>
              {!closed && (
                <Button variant="ghost" className="h-9 px-3.5 text-sm" onClick={() => setEditing(true)}>
                  <Pencil className="size-3.5" aria-hidden />Edit
                </Button>
              )}
            </div>
            <dl className="divide-y divide-cream-200 rounded-2xl border border-cream-200 bg-cream-50 px-5">
              <Row label="Purpose">{vault.description || <span className="text-muted">None</span>}</Row>
              <Row label="Goal">{formatRWF(vault.goalAmount)}</Row>
              <Row label="Saved">{formatRWF(vault.currentBalance)} ({vault.progressPercent}%)</Row>
              <Row label="Unlock date">{formatDate(vault.unlockDate)}</Row>
              <Row label="Created">{formatDate(vault.createdAt)}</Row>
            </dl>
          </section>

          <section>
            <h2 className="mb-2 text-xl">Transactions</h2>
            <TransactionList vaultId={vault.id} />
          </section>

          {!closed && (
            <section>
              <h2 className="mb-2 text-xl">Close vault</h2>
              <p className="mb-3 text-sm text-muted">
                {closeHint || 'Closing is permanent. The vault moves to your closed list.'}
              </p>
              <Button variant="dangerGhost" disabled={!canClose} onClick={() => setConfirming(true)}>
                Close this vault
              </Button>
            </section>
          )}
        </div>
      </div>

      <EditVaultModal vault={vault} open={editing} onClose={() => setEditing(false)} />

      <MoneyModal
        kind={money ?? 'deposit'}
        vault={vault}
        open={!!money}
        onClose={() => setMoney(null)}
      />

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={onClose}
        loading={close.isPending}
        danger
        title="Close this vault?"
        confirmLabel="Close vault"
        text={`"${vault.title}" will be closed for good. This cannot be undone.`}
      />
    </>
  )
}