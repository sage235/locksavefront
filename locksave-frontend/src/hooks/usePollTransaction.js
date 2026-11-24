import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTransaction } from '../api/transactions.api'
import { useRefreshMoney } from './useTransactions'
import { POLL_INTERVAL_MS, POLL_TIMEOUT_MS } from '../utils/constants'

export function usePollTransaction(initialTx) {
  const refresh = useRefreshMoney()
  const [startedAt] = useState(() => Date.now())
  const [timedOut, setTimedOut] = useState(false)

  const { data } = useQuery({
    queryKey: ['transactions', 'one', initialTx.id],
    queryFn: () => getTransaction(initialTx.id),
    select: (res) => res.data,
    initialData: { data: initialTx }, // show the submit response instantly, then poll
    refetchInterval: (q) => {
      const s = q.state.data?.data?.status
      if (s && s !== 'PENDING') return false
      return Date.now() - startedAt > POLL_TIMEOUT_MS ? false : POLL_INTERVAL_MS
    },
  })

  const status = data?.status ?? initialTx.status

  useEffect(() => {
    if (status !== 'PENDING') return
    const t = setTimeout(() => setTimedOut(true), POLL_TIMEOUT_MS)
    return () => clearTimeout(t)
  }, [status])

  // Payment settled: refresh vault balances, history and the notification badge.
  useEffect(() => {
    if (status !== 'PENDING') refresh()
  }, [status, refresh])

  return { transaction: data, status, timedOut, isPolling: status === 'PENDING' && !timedOut }
}