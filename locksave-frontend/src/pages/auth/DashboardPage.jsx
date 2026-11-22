import toast from 'react-hot-toast'
import { api } from '../api/client'
import { useAuth } from '../auth/useAuth'
import PageHeader from '../components/layout/PageHeader'

export default function DashboardPage() {
  const { user } = useAuth()

  async function testCall() {
    try {
      const res = await api.get('/vaults')
      toast.success(`${res.data.length} vaults`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <>
      <PageHeader title={`Muraho, ${user?.fullName?.split(' ')[0] ?? ''}`} subtitle="Your dashboard arrives in step 8." />
      <button onClick={testCall} className="rounded-xl bg-fir-700 px-4 py-2.5 text-cream-100">Test protected call</button>
    </>
  )
}