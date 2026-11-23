import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { z } from 'zod'
import PageHeader from '../components/layout/PageHeader'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Notice from '../components/ui/Notice'
import { useCreateVault } from '../hooks/useVaults'
import { addMonthsISO, todayISO } from '../utils/format'

const schema = z.object({
  title: z.string().trim().min(2, 'Give your vault a name').max(100, 'Keep the name under 100 characters'),
  description: z.string().max(255, 'Keep it under 255 characters'),
  goalAmount: z.string().refine(
    (v) => /^\d{1,13}(\.\d{1,2})?$/.test(v) && Number(v) >= 1,
    'Enter an amount of at least 1, with up to 2 decimals',
  ),
  unlockDate: z.string().min(1, 'Choose an unlock date').refine((d) => d > todayISO(), 'Pick a date in the future'),
})

const CHIPS = [{ m: 3, label: '3 months' }, { m: 6, label: '6 months' }, { m: 12, label: '1 year' }]

export default function CreateVaultPage() {
  const navigate = useNavigate()
  const create = useCreateVault()
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', goalAmount: '', unlockDate: '' },
  })
  const unlockDate = watch('unlockDate')

  async function onSubmit(v) {
    setServerError('')
    try {
      const res = await create.mutateAsync({
        title: v.title,
        description: v.description || null,
        goalAmount: Number(v.goalAmount),
        unlockDate: v.unlockDate,
      })
      toast.success('Vault created')
      navigate(`/vaults/${res.data.id}`, { replace: true })
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <>
      <Link to="/vaults" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-fir-900">
        <ArrowLeft className="size-4" aria-hidden />My vaults
      </Link>
      <PageHeader title="New vault" subtitle="What are you saving for, and when should it open?" />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-xl space-y-5">
        {serverError && <Notice>{serverError}</Notice>}
        <Input label="Name" placeholder="Laptop fund" error={errors.title?.message} {...register('title')} />
        <Input label="Purpose (optional)" placeholder="New laptop for semester 2" error={errors.description?.message} {...register('description')} />
        <Input label="Goal amount (RWF)" inputMode="decimal" placeholder="500000" error={errors.goalAmount?.message} {...register('goalAmount')} />

        <div>
          <Input label="Unlock date" type="date" min={addMonthsISO(0)} error={errors.unlockDate?.message} {...register('unlockDate')} />
          <div className="mt-2 flex flex-wrap gap-2">
            {CHIPS.map(({ m, label }) => {
              const value = addMonthsISO(m)
              return (
                <button key={m} type="button" aria-pressed={unlockDate === value}
                        onClick={() => setValue('unlockDate', value, { shouldValidate: true })}
                        className={`rounded-full border px-3.5 py-1.5 text-sm transition ${unlockDate === value ? 'border-fir-700 bg-fir-700 text-cream-100' : 'border-cream-300 hover:bg-cream-200'}`}>
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-fir-50 p-4 text-sm text-fir-700">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>Until the unlock date you can add money but not withdraw it. You can move the date later, never earlier. Choose a date you are sure about.</p>
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={isSubmitting}>Create vault</Button>
          <Link to="/vaults" className="inline-flex h-11 items-center px-3 text-muted hover:text-fir-900">Cancel</Link>
        </div>
      </form>
    </>
  )
}