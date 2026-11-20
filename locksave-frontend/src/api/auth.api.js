import { api } from './client'

export const register = (body) => api.post('/auth/register', body)
export const login = (body) => api.post('/auth/login', body)
export const verifyOtp = (body) => api.post('/auth/verify-otp', body)
export const resendOtp = (email) => api.post('/auth/resend-otp', { email })
export const logout = (refreshToken) => api.post('/auth/logout', refreshToken ? { refreshToken } : {})
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email })
export const resetPassword = (body) => api.post('/auth/reset-password', body)