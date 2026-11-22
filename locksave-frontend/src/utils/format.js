export const formatRWF = (n) =>
  `Rwf ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(Number(n) || 0)}`

// "2027-01-06" -> "6 Jan 2027". Date-only strings are parsed as local dates to avoid off-by-one days.
export const formatDate = (d) => {
  const date = typeof d === 'string' && d.length === 10 ? new Date(`${d}T00:00:00`) : new Date(d)
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

export const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?'