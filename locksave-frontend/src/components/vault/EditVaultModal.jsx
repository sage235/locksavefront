import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { z } from 'zod'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Notice from '../ui/Notice'
import { useUpdateVault } from '../../hooks/useVaults'
import { addMonthsISO } from '../../utils/format'

function EditForm({ vault, onDone }) {
  const update = useUpdateVault(vault.id)
  const [serverError, setServerError] = useState('')
  const schema = useMemo(() => z.object({
    title: z.string().trim().min(2, 'Give your vault a name').max(100),
    description: z.string().max(255, 'Keep it under 255 characters'),
    unlockDate: z.string().refine((d) => d >= vault.unlockDate, 'Choose the current unlock date or a later one'),
  }), [vault.unlockDate])

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: vault.title, description: vault.description ?? '', unlockDate: vault.unlockDate },
  })

  async function onSubmit(values) {
    setServerError('')
    try {
      await update.mutateAsync(values)
      toast.success('Vault updated')
      onDone()
    } catch (err) {
      setServerError(err.message)
    }
  }

  const from = new Date(`${vault.unlockDate}T00:00:00`)
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && <Notice>{serverError}</Notice>}
      <Input label="Name" error={errors.title?.message} {...register('title')} />
      <Input label="Purpose (optional)" error={errors.description?.message} {...register('description')} />
      <div>
        <Input label="Unlock date" type="date" min={vault.unlockDate}
               hint="You can only move this later, never earlier."
               error={errors.unlockDate?.message} {...register('unlockDate')} />
        <div className="mt-2 flex gap-2">
          {[1, 3].map((m) => (
            <button key={m} type="button" onClick={() => setValue('unlockDate', addMonthsISO(m, from), { shouldValidate: true })}
                    className="rounded-full border border-cream-300 px-3 py-1 text-sm hover:bg-cream-200">
              +{m} month{m > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>Save changes</Button>
      </div>
    </form>
  )
}

export default function EditVaultModal({ vault, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Edit vault">
      <EditForm vault={vault} onDone={onClose} />
    </Modal>
  )
}