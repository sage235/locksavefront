import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { z } from 'zod'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Notice from '../ui/Notice'
import { useAuth } from '../../auth/useAuth'
import { updateMe } from '../../api/users.api'
import { phoneField } from '../../utils/validators'

const schema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(100),
  phoneNumber: phoneField,
})

export default function ProfileForm() {
  const { user, setUser } = useAuth()
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: user.fullName ?? '', phoneNumber: user.phoneNumber ?? '' },
  })

  async function onSubmit(values) {
    setServerError('')
    try {
      const res = await updateMe(values)
      const saved = { ...values, ...res.data }
      setUser((u) => ({ ...u, ...saved })) // sidebar and greeting update immediately
      reset({ fullName: saved.fullName, phoneNumber: saved.phoneNumber })
      toast.success('Profile updated')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && <Notice>{serverError}</Notice>}
      <Input label="Email" value={user.email ?? ''} disabled readOnly hint="Your email can't be changed." />
      <Input label="Full name" autoComplete="name" error={errors.fullName?.message} {...register('fullName')} />
      <Input label="Phone number" type="tel" autoComplete="tel" error={errors.phoneNumber?.message} {...register('phoneNumber')} />
      <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save changes</Button>
    </form>
  )
}