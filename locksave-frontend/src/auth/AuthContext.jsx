import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { tokenStore } from './tokenStore'
import { setSessionExpiredHandler } from '../api/client'
import * as authApi from '../api/auth.api'
import { getMe } from '../api/users.api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(true)

  const clearSession = useCallback(() => {
    tokenStore.clear()
    setUser(null)
    queryClient.clear()
  }, [queryClient])

  // On page load the access token is gone (memory only). If a refresh token exists,
  // this first call gets a 401 and the interceptor refreshes, then retries it.
  useEffect(() => {
    setSessionExpiredHandler(clearSession)
    let cancelled = false
    ;(async () => {
      if (tokenStore.getRefresh()) {
        try {
          const res = await getMe()
          if (!cancelled) setUser(res.data)
        } catch {
          if (!cancelled) clearSession()
        }
      }
      if (!cancelled) setBooting(false)
    })()
    return () => { cancelled = true }
  }, [clearSession])

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials)
    tokenStore.set(res.data)
    const me = await getMe()
    setUser(me.data)
  }, [])

  const logout = useCallback(async () => {
    try { await authApi.logout(tokenStore.getRefresh()) } catch { /* already expired */ }
    clearSession()
  }, [clearSession])

  const value = useMemo(
    () => ({ user, booting, isAuthenticated: !!user, login, logout, setUser }),
    [user, booting, login, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}