import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import PasswordRules from '../../components/auth/PasswordRules'
import { resetPassword } from '../../api/auth.api'
import { emailField, otpField, passwordField, withPasswordMatch } from '../../utils/validators'

const schema = withPasswordMatch(z.object({
  email: emailField,
  token: otpField,
  password: passwordField,
  confirmPassword: z.string(),
}))

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const knownEmail = useLocation().state?.email ?? ''
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: knownEmail, token: '', password: '', confirmPassword: '' },
  })

  async function onSubmit({ email, token, password }) {
    setServerError('')
    try {
      await resetPassword({ email, token, newPassword: password })
      navigate('/login', { state: { email, reset: true }, replace: true })
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Enter the code from your email and your new password."
      footer={<Link to="/forgot-password" className="font-medium text-fir-700 underline-offset-4 hover:underline">Send a new code</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {serverError && <Notice>{serverError}</Notice>}
        {!knownEmail && <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />}
        <Input
          label="Reset code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          error={errors.token?.message}
          {...register('token', { onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, '') } })}
        />
        <Input label="New password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
        <PasswordRules value={watch('password')} />
        <Input label="Confirm new password" type="password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <Button type="submit" loading={isSubmitting} className="w-full">Update password</Button>
      </form>
    </AuthLayout>
  )
}