import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { z } from 'zod'
import AuthLayout from '../../components/layout/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import { resendOtp, verifyOtp } from '../../api/auth.api'
import { emailField, otpField } from '../../utils/validators'

const schema = z.object({ email: emailField, otp: otpField })

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const knownEmail = useLocation().state?.email ?? ''
  const [serverError, setServerError] = useState('')
  const [wait, setWait] = useState(0)
  const { register, handleSubmit, getValues, trigger, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: knownEmail, otp: '' },
  })

  useEffect(() => {
    if (wait <= 0) return
    const id = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(id)
  }, [wait])

  async function onSubmit(values) {
    setServerError('')
    try {
      await verifyOtp(values)
      navigate('/login', { state: { email: values.email, verified: true }, replace: true })
    } catch (err) {
      setServerError(err.message)
    }
  }

  async function onResend() {
    setServerError('')
    if (!(await trigger('email'))) return
    try {
      await resendOtp(getValues('email'))
      toast.success('A new code is on its way.')
      setWait(60)
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <AuthLayout
      title="Check your email"
      subtitle={knownEmail ? `We sent a 6-digit code to ${knownEmail}.` : 'Enter your email and the 6-digit code we sent you.'}
      footer={<Link to="/login" className="font-medium text-fir-700 underline-offset-4 hover:underline">Back to log in</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {serverError && <Notice>{serverError}</Notice>}
        {!knownEmail && <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />}
        <Input
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          error={errors.otp?.message}
          className="[&_input]:text-center [&_input]:font-display [&_input]:text-2xl [&_input]:tracking-[0.5em]"
          {...register('otp', { onChange: (e) => { e.target.value = e.target.value.replace(/\D/g, '') } })}
        />
        <Button type="submit" loading={isSubmitting} className="w-full">Verify email</Button>
        <Button type="button" variant="ghost" onClick={onResend} disabled={wait > 0} className="w-full">
          {wait > 0 ? `Resend code in ${wait}s` : 'Resend code'}
        </Button>
      </form>
    </AuthLayout>
  )
}