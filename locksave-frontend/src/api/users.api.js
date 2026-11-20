import { api } from './client'

export const getMe = () => api.get('/users/me')