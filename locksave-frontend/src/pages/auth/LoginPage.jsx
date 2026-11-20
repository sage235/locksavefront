import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../auth/useAuth'

const field = 'w-full rounded-lg border border-cream-300 bg-cream-100 p-2'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await login(form)
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center">
      <form onSubmit={onSubmit} className="w-80 space-y-3 rounded-2xl bg-cream-50 p-6 shadow">
        <h1 className="text-2xl">LockSave</h1>
        <input className={field} type="email" placeholder="Email" value={form.email}
               onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className={field} type="password" placeholder="Password" value={form.password}
               onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={busy} className="w-full rounded-lg bg-fir-700 p-2 text-cream-100 disabled:opacity-60">
          {busy ? 'Signing in…' : 'Log in'}
        </button>
      </form>
    </main>
  )
}