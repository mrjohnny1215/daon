import { clientDetails, validateEvent } from '../src/lib/collect-utils.js'
export async function POST(request) {
  const headers = { 'Cache-Control': 'no-store' }
  const host = new URL(request.url).host
  if (request.headers.get('origin') !== `https://${host}` && !(host.startsWith('localhost:') && request.headers.get('origin') === `http://${host}`)) return new Response(null, { status: 403, headers })
  if (Number(request.headers.get('content-length') || 0) > 4096) return new Response(null, { status: 413, headers })
  let event
  try { const text = await request.text(); if (text.length > 4096) return new Response(null, { status: 413, headers }); event = validateEvent(JSON.parse(text)) } catch { return new Response(null, { status: 400, headers }) }
  if (!event) return new Response(null, { status: 400, headers })
  const url = process.env.VITE_SUPABASE_URL, key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return new Response(null, { status: 503, headers })
  const code = request.headers.get('x-vercel-ip-country') || ''
  const country = /^[A-Z]{2}$/.test(code) ? code : 'ZZ'
  try {
    const result = await fetch(`${url}/rest/v1/daon_events`, { method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ ...event, country, ...clientDetails(request.headers.get('user-agent') || '') }), signal: AbortSignal.timeout(7000) })
    if (!result.ok && result.status !== 409) { console.error('analytics_write_failed', result.status); return new Response(null, { status: 502, headers }) }
    return new Response(null, { status: 204, headers })
  } catch { console.error('analytics_unavailable'); return new Response(null, { status: 503, headers }) }
}
