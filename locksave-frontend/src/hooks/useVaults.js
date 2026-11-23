import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as vaultsApi from '../api/vaults.api'

export const vaultKeys = { all: ['vaults'], detail: (id) => ['vaults', id] }

export const useVaults = () =>
  useQuery({ queryKey: vaultKeys.all, queryFn: vaultsApi.getVaults, select: (res) => res.data })

export const useVault = (id) =>
  useQuery({
    queryKey: vaultKeys.detail(id),
    queryFn: () => vaultsApi.getVault(id),
    select: (res) => res.data,
    retry: (count, err) => err.status !== 404 && count < 1,
  })

function useVaultMutation(fn) {
  const qc = useQueryClient()
  return useMutation({ mutationFn: fn, onSuccess: () => qc.invalidateQueries({ queryKey: vaultKeys.all }) })
}

export const useCreateVault = () => useVaultMutation(vaultsApi.createVault)
export const useUpdateVault = (id) => useVaultMutation((body) => vaultsApi.updateVault(id, body))
export const useCloseVault = (id) => useVaultMutation(() => vaultsApi.closeVault(id))