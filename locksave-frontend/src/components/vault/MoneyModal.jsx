import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check } from 'lucide-react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Notice from '../ui/Notice'
import PaymentMethodPicker from '../transactions/PaymentMethodPicker'
import { useAuth } from '../../auth/useAuth'
import { useDeposit, useRefreshMoney, useTransactionPoll, useWithdraw } from '../../hooks/useTransactions'
import { DEPOSIT_METHODS, PAYMENT_LABELS, POLL_TIMEOUT_MS, WITHDRAW_METHODS } from '../../utils/constants'
import { formatRWF } from '../../utils/format'
import { phoneField } from '../../utils/validators'

const QUICK_AMOUNTS = ['10000', '50000', '100000']

function MoneyForm({ kind, vault, onSubmitted }) {
  const isDeposit = kind === 'deposit'
  const { user } = useAuth()
  const dep = useDeposit()
  const wit = useWithdraw()
  const mutation = isDeposit ? dep : wit
  const balance = Number(vault.currentBalance)
  const methods = isDeposit ? DEPOSIT_METHODS : WITHDRAW_METHODS
  const idempotencyKey = useRef(crypto.randomUUID()) // one key per form instance, so a retried request cannot double-charge
  const [serverError, setServerError] = useState('')

  const schema = useMemo(() => z.object({
    amount: z.string()
      .refine((v) => /^\d{1,13}(\.\d{1,2})?$/.test(v) && Number(v) >= 1, 'Enter an amount of at least 1, with up to 2 decimals')
      .refine((v) => isDeposit || Number(v) <= balance, `You can withdraw up to ${formatRWF(balance)}`),
    paymentMethod: z.string().min(1, 'Choose a method'),
    phone: phoneField,
  }), [isDeposit, balance])

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
      paymentMethod: methods.find((m) => m.enabled)?.value ?? '',
      phone: user?.phoneNumber ?? '+250',
    },
  })
  const amount = watch('amount')

  async function onSubmit(v) {
    setServerError('')
    const body = isDeposit
      ? { vaultId: vault.id, amount: Number(v.amount), paymentMethod: v.paymentMethod, payerPhone: v.phone, idempotencyKey: idempotencyKey.current }
      : { vaultId: vault.id, amount: Number(v.amount), paymentMethod: v.paymentMethod, destinationPhone: v.phone }
    try {
      const res = await mutation.mutateAsync(body)
      onSubmitted(res.data, v.phone)
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && <Notice>{serverError}</Notice>}

      <div>
        <Input label="Amount (RWF)" inputMode="decimal" placeholder="50000" error={errors.amount?.message} {...register('amount')} />
        {isDeposit ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((a) => (
              <button key={a} type="button" aria-pressed={amount === a}
                      onClick={() => setValue('amount', a, { shouldValidate: true })}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${amount === a ? 'border-fir-700 bg-fir-700 text-cream-100' : 'border-cream-300 hover:bg-cream-200'}`}>
                {formatRWF(a)}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">
            Available: {formatRWF(balance)}{' '}
            <button type="button" onClick={() => setValue('amount', String(balance), { shouldValidate: true })}
                    className="font-medium text-fir-700 underline-offset-4 hover:underline">Withdraw all</button>
          </p>
        )}
      </div>

      <PaymentMethodPicker legend={isDeposit ? 'Pay with' : 'Send with'} methods={methods} register={register} error={errors.paymentMethod?.message} />
      <Input label={isDeposit ? 'Mobile Money number' : 'Send to this Mobile Money number'} type="tel" autoComplete="tel"
             hint={isDeposit ? "We'll send the payment request to this number." : undefined}
             error={errors.phone?.message} {...register('phone')} />

      {!isDeposit && (
        <p className="rounded-xl bg-fir-50 p-3.5 text-sm text-fir-700">
          The amount leaves your vault right away. If the transfer fails, it is returned.
        </p>
      )}
      <Button type="submit" loading={isSubmitting} className="w-full">{isDeposit ? 'Request payment' : 'Withdraw'}</Button>
    </form>
  )
}

function Waiting({ kind, tx, phone, startedAt, onClose, onRetry }) {
  const isDeposit = kind === 'deposit'
  const refresh = useRefreshMoney()
  const { data } = useTransactionPoll(tx.id, startedAt)
  const status = data?.status ?? tx.status
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), POLL_TIMEOUT_MS)
    return () => clearTimeout(t)
  }, [])
  useEffect(() => { if (status !== 'PENDING') refresh() }, [status, refresh])

  let view
  if (status === 'COMPLETED') {
    view = (
      <div className="py-2 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-fir-50 text-fir-700"><Check className="size-7" aria-hidden /></span>
        <h3 className="mt-4 text-xl">{isDeposit ? 'Money added' : 'Withdrawal sent'}</h3>
        <p className="mt-2 text-muted">
          {isDeposit ? `${formatRWF(tx.amount)} is now in your vault.` : `${formatRWF(tx.amount)} is on its way to ${phone}.`}
        </p>
        <Button className="mt-6 w-full" onClick={onClose}>Done</Button>
      </div>
    )
  } else if (status === 'FAILED' || status === 'REVERSED') {
    view = (
      <div className="space-y-4">
        <Notice>
          {isDeposit ? 'The payment did not go through. You have not been charged by LockSave.' : 'The withdrawal did not go through. Your money is back in the vault.'}
        </Notice>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Close</Button>
          <Button className="flex-1" onClick={onRetry}>Try again</Button>
        </div>
      </div>
    )
  } else {
    view = (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl bg-tomato-50 p-4 text-tomato-700">
          <span className="relative mt-1.5 grid size-3 shrink-0 place-items-center" aria-hidden>
            <span className="absolute size-3 rounded-full bg-tomato-500/40 motion-safe:animate-ping" />
            <span className="relative size-2 rounded-full bg-tomato-500" />
          </span>
          <div>
            <p className="font-semibold">{isDeposit ? 'Approve the payment on your phone' : 'Sending to your phone'}</p>
            <p className="mt-1 text-sm text-muted">
              {isDeposit
                ? `We sent a request for ${formatRWF(tx.amount)} to ${phone} via ${PAYMENT_LABELS[tx.paymentMethod]}. Enter your PIN to confirm.`
                : `${formatRWF(tx.amount)} is being sent to ${phone}. If it fails, the money returns to your vault.`}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted">
          {timedOut ? 'Still waiting. You can close this window. The vault updates as soon as it is confirmed.' : 'This usually takes under a minute.'}
        </p>
        <Button variant="ghost" className="w-full" onClick={onClose}>Close</Button>
      </div>
    )
  }
  return <div aria-live="polite">{view}</div>
}

function MoneyFlow({ kind, vault, onClose }) {
  const [step, setStep] = useState({ name: 'form' })
  const [formKey, setFormKey] = useState(0) // new key = fresh form and a fresh idempotency key

  if (step.name === 'waiting') {
    return (
      <Waiting kind={kind} {...step} onClose={onClose}
               onRetry={() => { setFormKey((k) => k + 1); setStep({ name: 'form' }) }} />
    )
  }
  return (
    <MoneyForm key={formKey} kind={kind} vault={vault}
               onSubmitted={(tx, phone) => setStep({ name: 'waiting', tx, phone, startedAt: Date.now() })} />
  )
}

export default function MoneyModal({ kind, vault, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={kind === 'deposit' ? 'Add money' : 'Withdraw'}>
      <MoneyFlow kind={kind} vault={vault} onClose={onClose} />
    </Modal>
  )
}