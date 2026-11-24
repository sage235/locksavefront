import { api } from './client'

export const deposit = (body) => api.post('/transactions/deposit', body)
export const withdraw = (body) => api.post('/transactions/withdraw', body)
export const getVaultTransactions = (vaultId, page = 0, size = 10) =>
  api.get(`/transactions/vault/${vaultId}`, { params: { page, size } })
export const getTransaction = (id) => api.get(`/transactions/${id}`)