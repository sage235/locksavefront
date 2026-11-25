import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { z } from 'zod'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Notice from '../../components/ui/Notice'
import { forgotPassword } from '../../api/auth.api'
import { emailField } from '../../utils/validators'

const schema = z.object({ email: emailField })

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } })

  async function onSubmit({ email }) {
    setServerError('')
    try {
      await forgotPassword(email)
      toast.success('If that email is registered, a reset code is on its way.')
      navigate('/reset-password', { state: { email } })
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a code."
      footer={<Link to="/login" className="font-medium text-fir-700 underline-offset-4 hover:underline">Back to log in</Link>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {serverError && <Notice>{serverError}</Notice>}
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Button type="submit" loading={isSubmitting} className="w-full">Send code</Button>
      </form>
    </AuthLayout>
  )
}