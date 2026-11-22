import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { z } from 'zod'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import PasswordRules from '../../components/auth/PasswordRules'
import { register as registerUser } from '../../api/auth.api'
import { emailField, passwordField, phoneField, withPasswordMatch } from '../../utils/validators'

const schema = withPasswordMatch(z.object({
  fullName: z.string().trim().min(2, 'Enter your full name').max(100),
  email: emailField,
  phoneNumber: phoneField,
  password: passwordField,
  confirmPassword: z.string(),
}))
const link = 'font-medium text-fir-700 underline-offset-4 hover:underline'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', phoneNumber: '+250', password: '', confirmPassword: '' },
  })

  async function onSubmit({ confirmPassword, ...body }) {
    setServerError('')
    try {
      await registerUser(body)
      toast.success('Account created. Check your email for the code.')
      navigate('/verify-otp', { state: { email: body.email } })
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes a minute. We'll email you a code to confirm."
      footer={<>Already have an account? <Link to="/login" className={link}>Log in</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {serverError && <Notice>{serverError}</Notice>}
        <Input label="Full name" autoComplete="name" error={errors.fullName?.message} {...register('fullName')} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input label="Phone number" type="tel" autoComplete="tel" error={errors.phoneNumber?.message} {...register('phoneNumber')} />
        <Input label="Password" type="password" autoComplete="new-password" error={errors.password?.message} {...register('password')} />
        <PasswordRules value={watch('password')} />
        <Input label="Confirm password" type="password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <Button type="submit" loading={isSubmitting} className="w-full">Create account</Button>
      </form>
    </AuthLayout>
  )
}