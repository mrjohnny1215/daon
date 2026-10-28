import { visitorId } from './visitor'
import { attribution } from './attribution'
const databaseUrl = import.meta.env.VITE_SUPABASE_URL
const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export function analyticsAllowed() {
  try { return localStorage.getItem('daon.analytics.disabled') !== '1' } catch { return true }
}
let lastClick = 0
function context() {
  try { return attribution({ search: location.search, referrer: document.referrer, hostname: location.hostname, storage: sessionStorage }) } catch { return null }
}
function record(event_type, button = '') {
  if (!analyticsAllowed() || !databaseUrl || !publicKey || location.pathname.startsWith('/admin')) return
  const data = context()
  if (!data) return
  const { updated, signature, ...visitContext } = data
  let visitor
  try { visitor = visitorId(localStorage) } catch {}
  if (!visitor) visitor = data.session_id
  const payload = { visitor_id: visitor, id: crypto.randomUUID(), ...visitContext, event_type, button,
    page: location.pathname.slice(0, 180), device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop' }
  // Keep the telephone action immediate even if analytics is unavailable.
  fetch('/api/collect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(() => {})
}
export function trackVisit() {
  if (!analyticsAllowed()) return
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
