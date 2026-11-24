import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import { useAuth } from '../../auth/useAuth'
import { emailField } from '../../utils/validators'

const schema = z.object({ email: emailField, password: z.string().min(1, 'Enter your password') })
const link = 'font-medium text-fir-700 underline-offset-4 hover:underline'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: location.state?.email ?? '', password: '' },
  })

  const notice = location.state?.verified ? 'Email verified. Log in to continue.'
    : location.state?.reset ? 'Password updated. Log in with your new password.' : ''

  async function onSubmit(values) {
    setServerError('')
    try {
      await login(values)
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })
    } catch (err) {
     if (/not verified/i.test(err.message)) {
  navigate('/verify-otp', { state: { email: values.email } })
} else {
  setServerError(err.message)
}
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see your vaults."
      footer={<>New to LockSave? <Link to="/register" className={link}>Create an account</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {notice && <Notice type="success">{notice}</Notice>}
        {serverError && <Notice>{serverError}</Notice>}
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <div className="text-right text-sm">
          <Link to="/forgot-password" className={link}>Forgot password?</Link>
        </div>
        <Button type="submit" loading={isSubmitting} className="w-full">Log in</Button>
        <p className="text-center text-sm text-muted">
          Signed up but never verified?{' '}
          <Link to="/verify-otp" state={{ email: getValues('email') }} className={link}>Enter your code</Link>
        </p>
      </form>
    </AuthLayout>
  )
}