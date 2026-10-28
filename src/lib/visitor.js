export function visitorId(storage, now = Date.now(), uuid = () => crypto.randomUUID()) {
  try {
    const saved = JSON.parse(storage.getItem('daon.visitor') || 'null')
    if (saved?.id && saved.expires > now) return saved.id
    const value = { id: uuid(), expires: now + 90 * 86400000 }
    storage.setItem('daon.visitor', JSON.stringify(value)); return value.id
  } catch { return null }
}
