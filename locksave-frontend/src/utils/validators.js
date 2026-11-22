import { z } from 'zod'

export const PASSWORD_RULES = [
  { id: 'len', label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'lower', label: 'A lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'upper', label: 'An uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'digit', label: 'A number', test: (p) => /\d/.test(p) },
  { id: 'special', label: 'One of @ $ ! % * ? &', test: (p) => /[@$!%*?&]/.test(p) },
]

export const emailField = z.string().trim().toLowerCase()
  .min(1, 'Email is required').email('Enter a valid email address')

export const passwordField = z.string()
  .refine((p) => PASSWORD_RULES.every((r) => r.test(p)), 'Password does not meet all the requirements')

// Accepts "+250 788 000 000" and sends "+250788000000"
export const phoneField = z.string().min(1, 'Phone number is required')
  .transform((s) => s.replace(/[\s-]/g, ''))
  .pipe(z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Include the country code, e.g. +250788000000'))

export const otpField = z.string().regex(/^\d{6}$/, 'Enter the 6-digit code')

export const withPasswordMatch = (schema) =>
  schema.refine((d) => d.password === d.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' })