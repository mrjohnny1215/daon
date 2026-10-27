export function attribution({ search, referrer, hostname, storage, now = Date.now(), uuid = () => crypto.randomUUID() }) {
  try {
    const params = new URLSearchParams(search)
    const tag = (params.get('utm_source') || '').trim().toLowerCase()
    const signature = ['utm_source', 'utm_medium', 'utm_campaign'].map(key => params.get(key) || '').join('|')
    const saved = JSON.parse(storage.getItem('daon.attribution') || 'null')
    if (saved && now - saved.updated < 1800000 && (!tag || saved.signature === signature)) {
      saved.updated = now; storage.setItem('daon.attribution', JSON.stringify(saved)); return saved
    }
    let host = ''
    try { host = new URL(referrer).hostname } catch { /* No referrer. */ }
    const source = tag ? (/^google(?:[_-]?ads)?$/.test(tag) ? 'google' : /^naver(?:[_-]?ads)?$/.test(tag) ? 'naver' : 'other') :
      /(^|\.)google\.[a-z.]+$/.test(host) ? 'google' : /(^|\.)naver\.com$/.test(host) ? 'naver' :
      !host || host === hostname || /^(daon-tau|daon-sewer)\.vercel\.app$/.test(host) ? 'direct' : 'other'
    const result = { session_id: uuid(), source,
      medium: (params.get('utm_medium') || (source === 'google' || source === 'naver' ? 'organic' : '')).slice(0, 64),
      campaign: (params.get('utm_campaign') || '').slice(0, 120), updated: now, signature }
    storage.setItem('daon.attribution', JSON.stringify(result)); return result
  } catch { return null }
}
