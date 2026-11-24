import { useEffect, useRef } from 'react'
import { useQueries } from '@tanstack/react-query'
import { getVaultTransactions } from '../api/transactions.api'
import { useRefreshMoney } from './useTransactions'
import { TX_PAGE_SIZE } from '../utils/constants'

// One request per vault, merged and sorted. If you add GET /transactions/recent
// on the backend, replace this whole body with a single useQuery.
export function useRecentActivity(vaults, limit = 5) {
  const refresh = useRefreshMoney()
  const results = useQueries({
    queries: vaults.map((v) => ({
      queryKey: ['transactions', 'vault', v.id, 0],
      queryFn: () => getVaultTransactions(v.id, 0, TX_PAGE_SIZE),
      refetchInterval: (q) =>
        q.state.data?.data?.transactions?.some((t) => t.status === 'PENDING') ? 5000 : false,
    })),
  })

  const all = results.flatMap((r) => r.data?.data?.transactions ?? [])
  const pending = all.filter((t) => t.status === 'PENDING').length
  const prev = useRef(pending)
  useEffect(() => {
    if (prev.current > 0 && pending < prev.current) refresh() // a payment settled: update balances
    prev.current = pending
  }, [pending, refresh])

  const items = [...all].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit)
  return {
    items,
    isPending: vaults.length > 0 && results.some((r) => r.isPending),
    isError: results.some((r) => r.isError),
  }
}