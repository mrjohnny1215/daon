import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, BarChart3, Check, ChevronLeft, ChevronRight, Copy, Download, Droplets, ExternalLink, Link2, LockKeyhole, LogOut, PhoneCall, RefreshCw, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './admin.css'
import Visitors from './Visitors'

const names = { google: '구글', naver: '네이버', direct: '직접·출처 미상', other: '기타' }
const buttons = { home: '메인 배너', header: '상단 전화 상담', promise: '시공 약속', contact: '하단 상담', footer: '푸터', 'floating-call': '고정 전화걸기' }
const number = (value) => new Intl.NumberFormat('ko-KR').format(value || 0)
const dateTime = (value) => new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', dateStyle: 'short', timeStyle: 'medium', hour12: false }).format(new Date(value))
function startDate(days) {
  const korea = new Date(Date.now() + 9 * 3600000)
  return new Date(Date.UTC(korea.getUTCFullYear(), korea.getUTCMonth(), korea.getUTCDate() - days + 1) - 9 * 3600000).toISOString()
}
function Auth({ onSession }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function submit(event) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      if (!supabase) throw new Error('관리자 서비스 연결을 준비 중입니다.')
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${location.origin}/admin` } })
        if (error) throw new Error('계정 등록에 실패했습니다. 이메일과 비밀번호를 확인하거나 잠시 후 다시 시도해주세요.')
        setMessage('인증 메일을 확인해주세요. 이메일 인증을 마치면 이 화면에서 로그인할 수 있습니다. 사전 승인된 이메일만 통계에 접근할 수 있습니다.')
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw new Error('이메일·비밀번호 또는 이메일 인증 상태를 확인해주세요.')
        onSession(data.session)
      }
    } catch (error) { setMessage(error.message) }
    finally { setBusy(false) }
  }
  return <div className="ad-auth"><div className="ad-auth-card">
    <a href="/" className="ad-brand"><span><Droplets size={23} /></span>다온설비<span className="ad-brand-tag">ADMIN</span></a>
    <div className="ad-auth-icon"><LockKeyhole size={27} /></div><p className="ad-eyebrow">PRIVATE WORKSPACE</p>
    <h1>{mode === 'login' ? '관리자 로그인' : '관리자 계정 등록'}</h1><p className="ad-subtitle">전화 문의로 이어지는 흐름을 한눈에 확인하세요.</p>
    <form onSubmit={submit}><label>이메일<input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="관리자 이메일" required maxLength={254} /></label>
    <label>비밀번호<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={e => setPassword(e.target.value)} minLength={mode === 'register' ? 12 : 1} placeholder={mode === 'register' ? '12자 이상 입력' : '비밀번호 입력'} required /></label>
    {message && <p className="ad-message" role="status">{message}</p>}<button className="ad-primary" disabled={busy || !supabase}>{busy ? '처리 중…' : mode === 'login' ? '대시보드 로그인' : '인증 메일 받기'}<ArrowLeft size={17} style={{ transform: 'rotate(180deg)' }} /></button></form>
    <button className="ad-text-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage('') }}>{mode === 'login' ? '처음 이용하시나요? 관리자 계정 등록' : '이미 계정이 있나요? 로그인'}</button>
    <a href="/" className="ad-back"><ArrowLeft size={14} /> 사이트로 돌아가기</a><p className="ad-auth-note">허용된 관리자 계정만 기록을 조회할 수 있습니다.</p>
  </div><p className="ad-copyright">© {new Date().getFullYear()} 다온설비 · 관리자 전용</p></div>
}
function CampaignLinks() {
  const [source, setSource] = useState('naver'), [campaign, setCampaign] = useState(''), [copied, setCopied] = useState(false)
  const url = new URL('https://daon-sewer.vercel.app/')
  url.searchParams.set('utm_source', source); url.searchParams.set('utm_medium', 'cpc')
  if (campaign.trim()) url.searchParams.set('utm_campaign', campaign.trim())
  async function copy() { try { await navigator.clipboard.writeText(url.href); setCopied(true) } catch { setCopied(false) } }
  return <section className="ad-panel ad-links"><div className="ad-panel-title"><div><h2>광고용 추적 링크</h2><p>완성된 링크를 해당 플랫폼 광고의 도착 URL에 등록하세요.</p></div><Link2 size={22} /></div>
    <div className="ad-link-fields"><label>광고 플랫폼<select value={source} onChange={e => { setSource(e.target.value); setCopied(false) }}><option value="naver">네이버 광고</option><option value="google">구글 광고</option></select></label>
    <label>캠페인 이름 (선택)<input value={campaign} onChange={e => { setCampaign(e.target.value); setCopied(false) }} maxLength={120} placeholder="예: 겨울철_배관상담" /></label></div>
    <div className="ad-link-output"><code>{url.href}</code><button className="ad-secondary" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? '복사 완료' : '링크 복사'}</button></div>
    <p className="ad-info">일반 검색은 전달된 방문 경로로 구분합니다. 앱·브라우저가 경로를 전달하지 않으면 직접·출처 미상으로 표시됩니다.</p></section>
}
export default function Admin() {
  const [session, setSession] = useState(null), [ready, setReady] = useState(false), [authorized, setAuthorized] = useState(false)
  const [tab, setTab] = useState('overview'), [days, setDays] = useState(7), [source, setSource] = useState('all'), [page, setPage] = useState(0)
  const [stats, setStats] = useState(null), [rows, setRows] = useState([]), [count, setCount] = useState(0), [busy, setBusy] = useState(false), [error, setError] = useState(''), [updated, setUpdated] = useState(null), [exporting, setExporting] = useState(false)
  useEffect(() => {
    document.title = '다온설비 관리자 | 전화 클릭 분석'
    const meta = document.createElement('meta'); meta.name = 'robots'; meta.content = 'noindex,nofollow'; document.head.append(meta)
    if (!supabase) { setReady(true); return () => meta.remove() }
    let active = true
    supabase.auth.getSession().then(({ data }) => { if (active) { setSession(data.session); setReady(true) } }).catch(() => { if (active) setReady(true) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, value) => { if (active) { setSession(value); setAuthorized(false) } })
    return () => { active = false; listener.subscription.unsubscribe(); meta.remove() }
  }, [])
  useEffect(() => {
    if (!session || !supabase) return
    let active = true
    setError(''); setBusy(true)
    supabase.from('daon_admins').select('user_id').eq('user_id', session.user.id).maybeSingle().then(({ data, error }) => {
      if (!active) return
      if (error) setError('관리자 권한을 확인하지 못했습니다. 잠시 후 새로고침해주세요.')
      setAuthorized(!!data && !error); setBusy(false)
    })
    return () => { active = false }
  }, [session])
  const load = useCallback(async () => {
    if (!authorized) return
    setBusy(true); setError('')
    try {
      const since = startDate(days)
      let query = supabase.from('daon_events').select('*', { count: 'exact' }).eq('event_type', 'phone_click').gte('created_at', since).order('created_at', { ascending: false }).order('id', { ascending: false }).range(page * 25, page * 25 + 24)
      if (source !== 'all') query = query.eq('source', source)
      const [summary, events] = await Promise.all([supabase.rpc('daon_summary', { since_at: since }), query])
      if (summary.error || events.error) throw new Error('기록을 불러오지 못했습니다. 연결을 확인하고 다시 시도해주세요.')
      setStats(summary.data); setRows(events.data || []); setCount(events.count || 0); setUpdated(new Date())
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }, [authorized, days, source, page])
  useEffect(() => { load() }, [load])
  async function logout() { const { error } = await supabase.auth.signOut(); if (error) { setError('로그아웃하지 못했습니다. 다시 시도해주세요.'); return } setSession(null); setAuthorized(false); setStats(null); setRows([]) }
  async function download() {
    setExporting(true); setError('')
    try {
      let all = []
      for (let offset = 0; offset < Math.min(count, 10000); offset += 1000) {
        let query = supabase.from('daon_events').select('*').eq('event_type', 'phone_click').gte('created_at', startDate(days)).order('created_at', { ascending: false }).order('id', { ascending: false }).range(offset, offset + 999)
        if (source !== 'all') query = query.eq('source', source)
        const { data, error } = await query; if (error) throw error; all.push(...data)
      }
      const cell = value => '"' + String(value ?? '').replace(/^[=+@\-\t\r]/, "'" + String(value ?? '').charAt(0)).replaceAll('"', '""') + '"'
      const csv = [['클릭 시각(한국)', '유입 경로', '유입 유형', '캠페인', '버튼 위치', '기기'], ...all.map(r => [dateTime(r.created_at), names[r.source], r.medium, r.campaign, buttons[r.button] || r.button, ({mobile:'모바일',tablet:'태블릿',desktop:'PC',unknown:'미확인'}[r.device] || '미확인')])].map(r => r.map(cell).join(',')).join('\r\n')
      const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = '다온설비_전화클릭.csv'; a.click(); URL.revokeObjectURL(url)
    } catch { setError('파일을 내보내지 못했습니다. 다시 시도해주세요.') } finally { setExporting(false) }
  }
  if (!ready) return <div className="ad-loading">관리자 페이지 연결 중…</div>
  if (!session) return <Auth onSession={setSession} />
  if (!authorized) return <div className="ad-auth"><div className="ad-auth-card"><LockKeyhole size={30} /><h1>{busy ? '관리자 권한 확인 중' : '관리자 승인이 필요합니다'}</h1><p className="ad-subtitle">{error || '이 계정에는 통계 조회 권한이 없습니다. 승인된 이메일로 로그인해주세요.'}</p><button className="ad-primary" onClick={logout}>로그아웃</button><a className="ad-back" href="/">사이트로 돌아가기</a></div></div>
  const daily = Array.from({ length: days }, (_, index) => { const day = new Date(new Date(startDate(days)).getTime() + (index * 24 + 9) * 3600000).toISOString().slice(0, 10); return { day, clicks: stats?.daily?.find(d => d.day === day)?.clicks || 0 } })
  const maximum = Math.max(...daily.map(d => d.clicks), 1)
  const rate = stats?.sessions ? Math.min(100, (stats.callers / stats.sessions) * 100).toFixed(1) : '0.0'
  return <div className="ad-shell">
    <aside className="ad-sidebar"><a className="ad-brand" href="/admin"><span><Droplets size={23} /></span>다온설비</a><p className="ad-sidebar-caption">문의 분석 관리자</p>
      <nav aria-label="관리자 메뉴">{[['overview', BarChart3, '대시보드'], ['history', PhoneCall, '전화 클릭 내역'], ['visitors', Users, '방문자 분석'], ['links', Link2, '광고 추적 링크']].map(([id, Icon, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon size={18} />{label}</button>)}</nav>
      <div className="ad-sidebar-bottom"><a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} />사이트 보기</a><button onClick={logout}><LogOut size={16} />로그아웃</button><p>{session.user.email}</p></div>
    </aside>
    <main className="ad-content"><header className="ad-topbar"><span>다온설비 <span>/ 관리자</span></span><span className="ad-secure"><LockKeyhole size={12} />관리자 전용</span></header>
      <div className="ad-main"><div className="ad-page-title"><div><p className="ad-eyebrow">DAON ANALYTICS</p><h1>{tab === 'overview' ? '문의 흐름을 한눈에' : tab === 'history' ? '전화 클릭 내역' : tab === 'visitors' ? '방문자 분석' : '광고 추적 링크'}</h1><p className="ad-subtitle">{tab === 'links' ? '어떤 광고에서 문의가 들어왔는지 구분하세요.' : '방문부터 전화걸기까지, 사이트의 실제 클릭 기록입니다.'}</p></div>
      {tab !== 'links' && tab !== 'visitors' && <div className="ad-actions"><select aria-label="조회 기간" value={days} onChange={e => { setDays(Number(e.target.value)); setPage(0) }}><option value={1}>오늘</option><option value={7}>최근 7일</option><option value={30}>최근 30일</option><option value={90}>최근 90일</option></select><button className="ad-icon-button" aria-label="새로고침" onClick={load} disabled={busy}><RefreshCw size={18} className={busy ? 'ad-spin' : ''} /></button></div>}</div>
      {error && <div className="ad-error" role="alert">{error}</div>}
      {tab === 'visitors' ? <Visitors /> : tab === 'links' ? <CampaignLinks /> : <>
      <div className="ad-metrics" aria-busy={busy}>{[[Users, '방문 세션', stats?.sessions, '동일 탭의 중복 방문 제외'], [PhoneCall, '전화걸기 클릭', stats?.clicks, '실제 통화 연결 건수와 다릅니다'], [Users, '전화 클릭 세션', stats?.callers, '중복 클릭을 제외한 세션 수'], [BarChart3, '전화 클릭률', stats ? rate + '%' : null, '방문 세션 대비 클릭 세션']].map(([Icon, label, value, note]) => <div className="ad-metric" key={label}><div><p>{label}</p><span><Icon size={18} /></span></div><strong>{value == null ? '—' : typeof value === 'number' ? number(value) : value}</strong><small>{note}</small></div>)}</div>
      {tab === 'overview' && <div className="ad-chart-grid"><section className="ad-panel"><div className="ad-panel-title"><div><h2>일별 전화 클릭</h2><p>한국 시간 기준 · 최근 {days}일</p></div><span className="ad-legend">전화 클릭</span></div>
      <div className="ad-chart" role="img" aria-label={stats?.clicks ? `기간 내 전화 클릭 ${number(stats.clicks)}회` : '아직 전화 클릭 기록이 없습니다'}>{daily.map((d, i) => <div className="ad-bar-column" key={d.day}><div className="ad-bar-track"><div className="ad-bar" style={{ height: `${d.clicks ? Math.max(4, d.clicks / maximum * 100) : 0}%` }} title={`${d.day}: ${d.clicks}회`} /></div><span>{days <= 7 || i % Math.ceil(days / 6) === 0 ? d.day.slice(5).replace('-', '.') : ''}</span></div>)}</div>{!stats?.clicks && <p className="ad-empty-caption">전화걸기를 누르면 이곳에 기록이 쌓입니다.</p>}</section>
      <section className="ad-panel"><div className="ad-panel-title"><div><h2>유입 경로별 클릭</h2><p>어디에서 문의가 시작됐을까요?</p></div></div><div className="ad-source-list">{Object.entries(names).map(([key, label]) => { const total = stats?.sources?.find(s => s.source === key)?.clicks || 0; return <div key={key}><div><span className={`ad-source-icon ${key}`}>{label[0]}</span><span>{label}</span><strong>{number(total)}<small>회</small></strong></div><div className="ad-source-track"><span style={{ width: `${stats?.clicks ? total / stats.clicks * 100 : 0}%` }} /></div></div> })}</div></section></div>}
      <section className="ad-panel ad-records"><div className="ad-panel-title"><div><h2>{tab === 'overview' ? '최근 전화 클릭' : '전체 전화 클릭 기록'} <span className="ad-count">{number(count)}</span></h2><p>사이트 전화 버튼 클릭 기준 · 시각은 한국 시간입니다.</p></div><div className="ad-actions"><select aria-label="유입 경로 필터" value={source} onChange={e => { setSource(e.target.value); setPage(0) }}><option value="all">모든 유입 경로</option>{Object.entries(names).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><button className="ad-secondary" onClick={download} disabled={exporting || !count}><Download size={15} />{exporting ? '내보내는 중…' : 'CSV 다운로드'}</button></div></div>
      <div className="ad-table-wrap"><table><thead><tr><th>클릭 시각</th><th>유입 경로</th><th>캠페인</th><th>버튼 위치</th><th>기기</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td>{dateTime(row.created_at)}</td><td><span className={`ad-source-badge ${row.source}`}>{names[row.source]}</span><small className="ad-medium">{row.medium === 'cpc' ? '광고' : row.medium === 'organic' ? '일반 검색' : row.medium}</small></td><td>{row.campaign || '—'}</td><td>{buttons[row.button] || row.button || '—'}</td><td>{({mobile:'모바일',tablet:'태블릿',desktop:'PC',unknown:'미확인'}[row.device] || '미확인')}</td></tr>)}{!rows.length && <tr><td colSpan={5}><div className="ad-empty"><PhoneCall size={24} /><strong>{busy ? '기록을 불러오는 중입니다' : '아직 클릭 기록이 없습니다'}</strong><p>선택한 기간·유입 경로의 전화 클릭이 여기에 표시됩니다.</p></div></td></tr>}</tbody></table></div>
      <div className="ad-pagination"><span>{count > 10000 ? 'CSV는 최신 10,000건까지 제공됩니다. ' : ''}{updated ? `${new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', timeStyle: 'short' }).format(updated)} 업데이트` : '연결 중'}</span><div><button aria-label="이전 페이지" disabled={page === 0 || busy} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /></button><span>{page + 1} / {Math.max(1, Math.ceil(count / 25))}</span><button aria-label="다음 페이지" disabled={(page + 1) * 25 >= count || busy} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></button></div></div></section>
      <p className="ad-footnote">전화 클릭은 실제 통화 연결을 의미하지 않습니다. 수집 시작 이전 기록은 제공되지 않으며, 광고 차단·네트워크 환경에 따라 일부 기록이 누락될 수 있습니다.</p></>}
      </div></main></div>
}
