import { useCallback, useEffect, useRef } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as txApi from '../api/transactions.api'
import { POLL_INTERVAL_MS, POLL_TIMEOUT_MS, TX_PAGE_SIZE } from '../utils/constants'

export function useRefreshMoney() {
  const qc = useQueryClient()
  return useCallback(() => {
    qc.invalidateQueries({ queryKey: ['vaults'] })
    qc.invalidateQueries({ queryKey: ['transactions'] })
    qc.invalidateQueries({ queryKey: ['notifications'] })
  }, [qc])
}

// History list. Polls while any row is PENDING, and refreshes the vault balance when one settles.
export function useVaultTransactions(vaultId, page = 0) {
  const refresh = useRefreshMoney()
  const query = useQuery({
    queryKey: ['transactions', 'vault', vaultId, page],
    queryFn: () => txApi.getVaultTransactions(vaultId, page, TX_PAGE_SIZE),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    refetchInterval: (q) =>
      q.state.data?.data?.transactions?.some((t) => t.status === 'PENDING') ? 5000 : false,
  })

  const pending = query.data?.transactions.filter((t) => t.status === 'PENDING').length ?? 0
  const prev = useRef(pending)
  useEffect(() => {
    if (prev.current > 0 && pending < prev.current) refresh()
    prev.current = pending
  }, [pending, refresh])

  return query
}

// Polls one transaction until it leaves PENDING or the timeout passes.
export function useTransactionPoll(id, startedAt) {
  return useQuery({
    queryKey: ['transactions', 'one', id],
    queryFn: () => txApi.getTransaction(id),
    select: (res) => res.data,
    enabled: !!id,
    refetchInterval: (q) => {
      const status = q.state.data?.data?.status
      if (status && status !== 'PENDING') return false
      return Date.now() - startedAt > POLL_TIMEOUT_MS ? false : POLL_INTERVAL_MS
    },
  })
}

export function useDeposit() {
  const refresh = useRefreshMoney()
  return useMutation({ mutationFn: txApi.deposit, onSuccess: refresh })
}

export function useWithdraw() {
  const refresh = useRefreshMoney()
  return useMutation({ mutationFn: txApi.withdraw, onSuccess: refresh })
}