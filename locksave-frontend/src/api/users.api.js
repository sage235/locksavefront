import { api } from './client'

// ASSUMPTION: field names. Verify against your DTOs in the Network tab.
export const getMe = () => api.get('/users/me')
export const updateMe = (body) => api.patch('/users/me', body)               // { fullName, phoneNumber }
export const changePassword = (body) => api.patch('/users/me/password', body) // { currentPassword, newPassword }
export const deactivateMe = () => api.delete('/users/me')