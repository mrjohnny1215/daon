const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export function clientDetails(agent = '') {
  const ua = agent.slice(0, 1024)
  const device = /iPad|Tablet|Android(?!.*Mobile)/i.test(ua) ? 'tablet' : /Mobi|iPhone|Android/i.test(ua) ? 'mobile' : ua ? 'desktop' : 'unknown'
  const os = /iPhone|iPad|iPod/i.test(ua) ? 'iOS' : /Android/i.test(ua) ? 'Android' : /Windows/i.test(ua) ? 'Windows' : /Macintosh|Mac OS X/i.test(ua) ? 'macOS' : /CrOS/i.test(ua) ? 'ChromeOS' : /Linux/i.test(ua) ? 'Linux' : 'unknown'
  const browser = /NAVER/i.test(ua) ? '네이버 앱' : /KAKAOTALK/i.test(ua) ? '카카오톡 앱' : /SamsungBrowser/i.test(ua) ? 'Samsung Internet' : /Edg(?:e|A|iOS)?\//i.test(ua) ? 'Edge' : /OPR|Opera/i.test(ua) ? 'Opera' : /Firefox|FxiOS/i.test(ua) ? 'Firefox' : /Chrome|CriOS/i.test(ua) ? 'Chrome' : /Safari/i.test(ua) ? 'Safari' : 'unknown'
  return { device, os, browser }
}
export function validateEvent(data) {
  if (!data || !uuid.test(data.id) || !uuid.test(data.session_id) || !uuid.test(data.visitor_id)) return null
  if (!['page_view', 'phone_click'].includes(data.event_type) || !['google', 'naver', 'direct', 'other'].includes(data.source)) return null
  if (typeof data.page !== 'string' || !data.page.startsWith('/') || data.page.startsWith('/admin') || data.page.includes('?')) return null
  const cut = (v, n) => typeof v === 'string' ? v.slice(0, n) : ''
  return { id: data.id, session_id: data.session_id, visitor_id: data.visitor_id, event_type: data.event_type, source: data.source, medium: cut(data.medium, 64), campaign: cut(data.campaign, 120), button: cut(data.button, 80), page: cut(data.page, 180) }
}
