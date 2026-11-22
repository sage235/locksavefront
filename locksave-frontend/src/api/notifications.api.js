import { api } from './client'

export const getNotifications = (page = 0, size = 20) =>
  api.get('/notifications', { params: { page, size } })
export const markRead = (id) => api.patch(`/notifications/${id}/read`)
export const markAllRead = () => api.patch('/notifications/read-all')