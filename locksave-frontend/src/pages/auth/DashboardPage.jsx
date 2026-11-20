import toast from 'react-hot-toast'
import { api } from '../api/client'
import { useAuth } from '../auth/useAuth'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  async function testCall() {
    try {
      const res = await api.get('/vaults')
      toast.success(`${res.data.length} vaults`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <main className="space-y-4 p-8">
      <h1 className="text-3xl">Muraho, {user?.fullName ?? user?.email}</h1>
      <div className="flex gap-3">
        <button onClick={testCall} className="rounded-lg bg-fir-700 px-4 py-2 text-cream-100">Test protected call</button>
        <button onClick={logout} className="rounded-lg border border-cream-300 px-4 py-2">Log out</button>
      </div>
    </main>
  )
}