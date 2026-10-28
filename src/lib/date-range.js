export function koreanDayRange(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day || '')) return null
  const start = new Date(`${day}T00:00:00+09:00`)
  if (!Number.isFinite(start.getTime()) || new Date(start.getTime() + 9 * 3600000).toISOString().slice(0, 10) !== day) return null
  return { start: start.toISOString(), end: new Date(start.getTime() + 86400000).toISOString() }
}
