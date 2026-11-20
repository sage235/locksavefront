import axios from 'axios'
import { tokenStore } from '../auth/tokenStore'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
export const api = axios.create({ baseURL, timeout: 15000 })
const bare = axios.create({ baseURL, timeout: 15000 }) // no interceptors: used only for refresh

const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/verify-otp', '/auth/resend-otp',
  '/auth/refresh-token', '/auth/forgot-password', '/auth/reset-password']

let refreshPromise = null
let onSessionExpired = () => {}
export const setSessionExpiredHandler = (fn) => { onSessionExpired = fn }

async function refreshTokens() {
  const refreshToken = tokenStore.getRefresh()
  if (!refreshToken) throw new Error('No refresh token')
  const { data } = await bare.post('/auth/refresh-token', { refreshToken })
  tokenStore.set(data.data)
  return data.data.accessToken
}

function toApiError(error) {
  const status = error.response?.status
  const message =
    error.response?.data?.message ||
    (status === 429 ? 'Too many attempts. Please wait a moment and try again.' : null) ||
    (error.request ? 'Cannot reach the server. Check your connection.' : 'Something went wrong.')
  return Object.assign(new Error(message), { status, data: error.response?.data })
}

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const original = error.config
    const isAuthCall = AUTH_PATHS.some((p) => original?.url?.startsWith(p))

    if (error.response?.status === 401 && original && !original._retry
        && !isAuthCall && tokenStore.getRefresh()) {
      original._retry = true
      try {
        refreshPromise ??= refreshTokens().finally(() => { refreshPromise = null })
        const newToken = await refreshPromise
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        tokenStore.clear()
        onSessionExpired()
      }
    }
    return Promise.reject(toApiError(error))
  },
)