import { api } from './client'

export const getVaults = () => api.get('/vaults')
export const getVault = (id) => api.get(`/vaults/${id}`)
export const createVault = (body) => api.post('/vaults', body)
export const updateVault = (id, body) => api.patch(`/vaults/${id}`, body)
export const closeVault = (id) => api.delete(`/vaults/${id}`)