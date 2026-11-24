export const PAYMENT_LABELS = {
  MTN_MOMO: 'MTN Mobile Money',
  AIRTEL_MONEY: 'Airtel Money',
  ORANGE_MONEY: 'Orange Money',
  VISA: 'Visa',
  MASTERCARD: 'Mastercard',
}

// Flip `enabled` as the backend finishes each provider.
export const DEPOSIT_METHODS = [
  { value: 'MTN_MOMO', enabled: true },
  { value: 'AIRTEL_MONEY', enabled: true },
  { value: 'ORANGE_MONEY', enabled: false },
]
export const WITHDRAW_METHODS = [
  { value: 'MTN_MOMO', enabled: true },
  { value: 'AIRTEL_MONEY', enabled: false },
  { value: 'ORANGE_MONEY', enabled: false },
]

export const POLL_INTERVAL_MS = 3000
export const POLL_TIMEOUT_MS = 3 * 60 * 1000
export const TX_PAGE_SIZE = 10