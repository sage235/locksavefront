import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import { useAuth } from '../../auth/useAuth'
import { useVaults } from '../../hooks/useVaults'
import { deactivateMe } from '../../api/users.api'
import { formatRWF } from '../../utils/format'

export default function DeactivateSection() {
  const { user, endSession } = useAuth()
  const { data: vaults, isPending } = useVaults()
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)

  const holding = vaults?.filter((v) => v.status !== 'CLOSED' && Number(v.currentBalance) > 0) ?? []
  const held = holding.reduce((s, v) => s + Number(v.currentBalance), 0)
  const blocked = isPending || holding.length > 0
  const matches = typed.trim().toLowerCase() === (user.email ?? '').toLowerCase()

  async function confirm() {
    setBusy(true)
    try {
      await deactivateMe()
      toast.success('Your account has been deactivated')
      endSession()
    } catch (err) {
      toast.error(err.message)
      setBusy(false)
    }
  }

  return (
    <section className="rounded-2xl border border-tomato-700/30 p-5">
      <h2 className="text-xl text-tomato-700">Deactivate account</h2>
      <p className="mt-2 text-sm text-muted">You will be logged out and will not be able to log in again.</p>
      {holding.length > 0 && (
        <p className="mt-3 rounded-xl bg-tomato-50 p-3.5 text-sm text-tomato-700">
          You still have {formatRWF(held)} in {holding.length} vault{holding.length > 1 ? 's' : ''}. Withdraw it and close those vaults first.{' '}
          <Link to="/vaults" className="font-medium underline underline-offset-4">Go to my vaults</Link>
        </p>
      )}
      <Button variant="dangerGhost" className="mt-4" disabled={blocked} onClick={() => { setTyped(''); setOpen(true) }}>
        Deactivate my account
      </Button>

      <Modal open={open} onClose={() => !busy && setOpen(false)} title="Deactivate your account?">
        <p className="text-muted">This logs you out everywhere. To confirm, type your email address.</p>
        <Input label="Your email" className="mt-4" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
          <Button variant="danger" disabled={!matches} loading={busy} onClick={confirm}>Deactivate</Button>
        </div>
      </Modal>
    </section>
  )
}