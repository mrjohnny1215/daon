import { attribution } from './attribution'
const databaseUrl = import.meta.env.VITE_SUPABASE_URL
const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

let lastClick = 0
function context() {
  try { return attribution({ search: location.search, referrer: document.referrer, hostname: location.hostname, storage: sessionStorage }) } catch { return null }
}
function record(event_type, button = '') {
  if (!databaseUrl || !publicKey || location.pathname.startsWith('/admin')) return
  const data = context()
  if (!data) return
  const { updated, signature, ...visitContext } = data
  const payload = { id: crypto.randomUUID(), ...visitContext, event_type, button,
    page: location.pathname.slice(0, 180), device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop' }
  // Keep the telephone action immediate even if analytics is unavailable.
  fetch(`${databaseUrl}/rest/v1/daon_events`, { method: 'POST', headers: { apikey: publicKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {})
}
export function trackVisit() {
  const data = context()
  if (!data) return
  try {
    const key = `daon.view.${data.session_id}.${location.pathname}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    record('page_view')
  } catch { /* Storage restrictions must not affect the site. */ }
}
export function trackPhone(event) {
  if (Date.now() - lastClick < 1500) return
  lastClick = Date.now()
  trackVisit()
  const link = event.currentTarget
  const section = link.closest('section')
  record('phone_click', section?.id || (link.closest('footer') ? 'footer' : link.closest('header') ? 'header' : 'floating-call'))
}
