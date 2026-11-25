import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { z } from 'zod'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Notice from '../ui/Notice'
import PasswordRules from '../auth/PasswordRules'
import { changePassword } from '../../api/users.api'
import { passwordField, withPasswordMatch } from '../../utils/validators'

const schema = withPasswordMatch(z.object({
  currentPassword: z.string().min(1, 'Enter your current password'),
  password: passwordField,
  confirmPassword: z.string(),
}))

export default function PasswordForm() {
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', password: '', confirmPassword: '' },
  })

  async function onSubmit({ currentPassword, password }) {
    setServerError('')
    try {
      await changePassword({ currentPassword, newPassword: password })
      reset()
      toast.success('Password updated')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && <Notice>{serverError}</Notice>}
      <Input label="Current password" type="password" autoComplete="current-password" error={errors.currentPassword?.message} {...register('currentPassword')} />
      <Input label="New password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
      <PasswordRules value={watch('password')} />
      <Input label="Confirm new password" type="password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
      <Button type="submit" loading={isSubmitting}>Update password</Button>
    </form>
  )
}
