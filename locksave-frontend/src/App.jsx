import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import PublicOnlyRoute from './auth/PublicOnlyRoute'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import VerifyOtpPage from './pages/auth/VerifyOtpPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import AppLayout from './components/layouts/AppLayout'
import DashboardPage from './pages/auth/DashboardPage'
import VaultsPage from './pages/auth/VaultsPage'
import CreateVaultPage from './pages/auth/CreateVaultPage'
import VaultDetailPage from './pages/auth/VaultDetailPage'
import NotificationsPage from './pages/auth/NotificationsPage'
import ProfilePage from './pages/auth/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vaults" element={<VaultsPage />} />
          <Route path="/vaults/new" element={<CreateVaultPage />} />
          <Route path="/vaults/:id" element={<VaultDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div className="p-8">Page not found</div>} />
    </Routes>
  )
}
