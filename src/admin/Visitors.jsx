import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, RefreshCw, Users, Globe2, MonitorSmartphone, Repeat2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { koreanDayRange } from '../lib/date-range'
const deviceNames = { mobile: '모바일', tablet: '태블릿', desktop: 'PC', unknown: '미확인' }
const sourceNames = { google: '구글', naver: '네이버', direct: '직접·미상', other: '기타' }
const buttonNames = { home: '메인 배너', header: '상단 상담', promise: '시공 약속', contact: '하단 상담', footer: '푸터', 'floating-call': '고정 전화걸기' }
const regions = new Intl.DisplayNames(['ko'], { type: 'region' })
const countryName = code => code === 'ZZ' ? '미확인·기존 기록' : regions.of(code) || code
const time = value => new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', dateStyle: 'short', timeStyle: 'medium', hour12: false }).format(new Date(value))
const count = value => new Intl.NumberFormat('ko-KR').format(value || 0)
function since(days) { const d = new Date(Date.now() + 9 * 3600000); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - days + 1) - 9 * 3600000).toISOString() }
function makeQuery({ days, country, device, type, visitor, selectedDay }) {
  let q = supabase.from('daon_events').select('*', { count: 'exact' }).gte('created_at', since(days)).order('created_at', { ascending: false }).order('id', { ascending: false })
  const range = koreanDayRange(selectedDay)
  if (range) q = q.gte('created_at', range.start).lt('created_at', range.end)
  if (country !== 'all') q = q.eq('country', country)
  if (device !== 'all') q = q.eq('device', device)
  if (type !== 'all') q = q.eq('event_type', type)
  if (visitor) q = q.eq('visitor_id', visitor)
  return q
}
export default function Visitors() {
  const [days, setDays] = useState(7), [country, setCountry] = useState('all'), [device, setDevice] = useState('all'), [type, setType] = useState('all'), [visitor, setVisitor] = useState(''), [page, setPage] = useState(0)
  const [stats, setStats] = useState(null), [rows, setRows] = useState([]), [total, setTotal] = useState(0), [busy, setBusy] = useState(false), [error, setError] = useState(''), [exporting, setExporting] = useState(false)
  const [selectedDay, setSelectedDay] = useState(''), [daily, setDaily] = useState([])
  const serial = useRef(0)
  const filters = { days, country, device, type, visitor, selectedDay }
  const load = useCallback(async () => {
    const request = ++serial.current; setBusy(true); setError('')
    try {
      const [summary, data, dates] = await Promise.all([supabase.rpc('daon_audience', { since_at: since(days) }), makeQuery({ days, country, device, type, visitor, selectedDay }).range(page * 25, page * 25 + 24), supabase.rpc('daon_audience_daily', { since_at: since(days), until_at: new Date().toISOString() })])
      if (summary.error || data.error || dates.error) throw new Error('방문자 기록을 불러오지 못했습니다. 다시 시도해주세요.')
      if (request !== serial.current) return
      setStats(summary.data); setDaily(dates.data || []); setRows(data.data || []); setTotal(data.count || 0)
    } catch (e) { if (request === serial.current) setError(e.message) } finally { if (request === serial.current) setBusy(false) }
  }, [days, country, device, type, visitor, page, selectedDay])
  useEffect(() => { load(); return () => { serial.current++ } }, [load])
  async function download() {
    setExporting(true); setError('')
    try {
      const all = []
      for (let offset = 0; offset < Math.min(total, 10000); offset += 1000) { const r = await makeQuery(filters).range(offset, offset + 999); if (r.error) throw r.error; all.push(...r.data) }
      const cell = v => '"' + String(v ?? '').replace(/^[=+@\-\t\r]/, m => "'" + m).replaceAll('"', '""') + '"'
      const csv = [['시각(한국)', '방문자 ID', '국가(IP 추정)', '기기', '운영체제', '브라우저', '활동', '유입', '캠페인', '버튼'], ...all.map(r => [time(r.created_at), r.visitor_id || '', countryName(r.country), deviceNames[r.device], r.os, r.browser, r.event_type === 'phone_click' ? '전화 클릭' : '방문', sourceNames[r.source], r.campaign, buttonNames[r.button] || r.button])].map(r => r.map(cell).join(',')).join('\r\n')
      const href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = href; link.download = '다온설비_방문자분석.csv'; link.click(); URL.revokeObjectURL(href)
    } catch { setError('CSV 내보내기에 실패했습니다.') } finally { setExporting(false) }
  }
  const displayStats = selectedDay ? daily.find(d => d.day === selectedDay) : stats
  const visits = displayStats?.devices?.reduce((n, d) => n + d.visits, 0) || 0
  const mobile = displayStats?.devices?.find(d => d.device === 'mobile')?.visits || 0
  const change = setter => e => { setter(e.target.value); setPage(0) }
  return <div className="ad-visitors"><div className="ad-audience-heading"><p className="ad-info">익명 방문자 ID는 동일 브라우저를 최대 90일간 구분합니다. 기기 변경·시크릿 모드·저장소 삭제 시 새 ID가 만들어집니다.</p><div className="ad-actions"><select aria-label="방문자 조회 기간" value={days} onChange={e => { setDays(Number(e.target.value)); setSelectedDay(''); setPage(0) }}><option value={1}>오늘</option><option value={7}>최근 7일</option><option value={30}>최근 30일</option><option value={90}>최근 90일</option></select><button className="ad-icon-button" aria-label="방문자 기록 새로고침" disabled={busy} onClick={load}><RefreshCw size={17} /></button></div></div>
    {error && <p className="ad-error" role="alert">{error}</p>}
    <div className="ad-date-select"><label>특정 날짜 보기<input type="date" value={selectedDay} min={daily.at(-1)?.day} max={daily[0]?.day} onChange={e=>{setSelectedDay(e.target.value);setPage(0)}} /></label>{selectedDay && <button className="ad-secondary" onClick={()=>{setSelectedDay('');setPage(0)}}>기간 전체 보기</button>}<span>{selectedDay ? selectedDay + ' 하루 통계 · 한국 시간' : '선택한 기간 전체 통계 · 한국 시간'}</span></div>
    <div className="ad-metrics">{[[Users,'방문자 ID 수', displayStats?.visitors, '추가 수집 시작 이후 기준'], [Globe2,'접속 국가',displayStats?.countries?.filter(c => c.country !== 'ZZ' && c.visits > 0).length,'IP 기준의 추정 국가'], [MonitorSmartphone,'모바일 방문 비중',displayStats ? (visits ? (mobile / visits * 100).toFixed(1) : '0.0') + '%' : null,'전체 방문 기록 대비 모바일'], [Repeat2,'재방문 ID 수',displayStats?.returning,'기간 내 2개 이상 세션 방문']].map(([Icon,label,value,note]) => <div className="ad-metric" key={label}><div><p>{label}</p><span><Icon size={18}/></span></div><strong>{value == null ? '—' : typeof value === 'number' ? count(value) : value}</strong><small>{note}</small></div>)}</div>
    <section className="ad-panel ad-records ad-daily"><div className="ad-panel-title"><div><h2>날짜별 접속 통계</h2><p>날짜를 누르면 해당 날짜의 요약과 상세 활동 기록이 아래에 표시됩니다. 한국 시간 00:00~24:00 기준입니다.</p></div><button className="ad-secondary" disabled={!daily.length} onClick={()=>{const headers=['날짜(한국)','방문자 ID 수','방문 세션','접속 수','전화 클릭','국가 수','모바일','PC','태블릿'];const csv=[headers,...daily.map(d=>[d.day,d.visitors,d.sessions,d.visits,d.clicks,d.country_count,d.mobile,d.desktop,d.tablet])].map(r=>r.join(',')).join('\r\n');const href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=href;a.download='다온설비_날짜별통계.csv';a.click();URL.revokeObjectURL(href)}}><Download size={15}/>날짜별 CSV</button></div><div className="ad-table-wrap"><table><thead><tr><th>날짜</th><th>방문자 ID 수</th><th>방문 세션</th><th>접속 수</th><th>전화 클릭</th><th>국가 수</th><th>모바일 비중</th><th>모바일 / PC / 태블릿</th></tr></thead><tbody>{daily.map(d=><tr key={d.day} className={selectedDay===d.day?'ad-day-selected':''}><td><button className="ad-day-button" onClick={()=>{setSelectedDay(d.day);setPage(0)}}>{d.day}</button></td><td>{count(d.visitors)}</td><td>{count(d.sessions)}</td><td>{count(d.visits)}</td><td>{count(d.clicks)}</td><td>{count(d.country_count)}</td><td>{d.visits?(d.mobile/d.visits*100).toFixed(1):'0.0'}%</td><td>{count(d.mobile)} / {count(d.desktop)} / {count(d.tablet)}</td></tr>)}{!daily.length&&<tr><td colSpan={8}><div className="ad-empty">{busy?'날짜별 기록을 불러오는 중입니다':'날짜별 기록이 없습니다'}</div></td></tr>}</tbody></table></div><p className="ad-info">방문자 ID는 신규 수집분에만 있습니다. 국가 수는 미확인 국가를 제외합니다. 날짜별 방문자 수를 더한 값은 기간 전체의 고유 방문자 수와 다를 수 있습니다.</p></section>
    <div className="ad-chart-grid"><section className="ad-panel"><div className="ad-panel-title"><div><h2>국가별 방문과 전화 클릭</h2><p>{selectedDay ? selectedDay + ' 하루 기준입니다.' : '요약은 선택한 기간 전체 기준입니다.'}</p></div></div><div className="ad-audience-list">{displayStats?.countries?.length ? displayStats.countries.map(c => <button key={c.country} onClick={() => { setCountry(c.country); setPage(0) }}><span>{countryName(c.country)}</span><strong>방문 {count(c.visits)} <small>· 전화 {count(c.clicks)}</small></strong></button>) : <p className="ad-info">아직 국가별 기록이 없습니다.</p>}</div></section>
    <section className="ad-panel"><div className="ad-panel-title"><div><h2>접속 기기</h2><p>기기를 누르면 해당 기록만 표시합니다.</p></div></div><div className="ad-audience-list">{Object.entries(deviceNames).map(([key,label]) => { const d=displayStats?.devices?.find(d=>d.device===key);return <button key={key} onClick={()=>{setDevice(key);setPage(0)}}><span>{label}</span><strong>방문 {count(d?.visits)} <small>· 전화 {count(d?.clicks)}</small></strong></button>})}</div></section></div>
    <section className="ad-panel ad-records"><div className="ad-panel-title"><div><h2>{selectedDay ? selectedDay + ' 활동 기록' : '방문자 활동 기록'} <span className="ad-count">{count(total)}</span></h2><p>방문자 ID를 누르면 해당 ID의 방문·전화 클릭 이력만 볼 수 있습니다.</p></div><button className="ad-secondary" onClick={download} disabled={exporting || !total}><Download size={15}/>{exporting?'내보내는 중…':'CSV 다운로드'}</button></div>
    <div className="ad-audience-filters"><select aria-label="국가 필터" value={country} onChange={change(setCountry)}><option value="all">모든 국가</option>{stats?.countries?.map(c=><option key={c.country} value={c.country}>{countryName(c.country)}</option>)}</select><select aria-label="기기 필터" value={device} onChange={change(setDevice)}><option value="all">모든 기기</option>{Object.entries(deviceNames).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><select aria-label="활동 종류" value={type} onChange={change(setType)}><option value="all">방문 + 전화 클릭</option><option value="page_view">방문만</option><option value="phone_click">전화 클릭만</option></select><button className="ad-text-button" onClick={()=>{setCountry('all');setDevice('all');setType('all');setVisitor('');setSelectedDay('');setPage(0)}}>필터 초기화</button></div>
    {visitor && <div className="ad-visitor-selection"><span>선택한 방문자: {visitor}</span><button aria-label="방문자 선택 해제" onClick={()=>{setVisitor('');setPage(0)}}><X size={14}/></button></div>}
    <div className="ad-table-wrap"><table><thead><tr><th>접속·클릭 시각</th><th>방문자 ID</th><th>국가</th><th>기기 / 운영체제</th><th>브라우저</th><th>활동</th><th>유입 / 캠페인</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{time(r.created_at)}</td><td>{r.visitor_id?<button className="ad-visitor-id" title={r.visitor_id} onClick={()=>{setVisitor(r.visitor_id);setPage(0)}}>{r.visitor_id.slice(0,8)}…</button>:<span className="ad-muted">기존 기록</span>}</td><td>{countryName(r.country)}</td><td>{deviceNames[r.device]}<small className="ad-table-detail">{r.os==='unknown'?'미확인':r.os}</small></td><td>{r.browser==='unknown'?'미확인':r.browser}</td><td><span className={r.event_type==='phone_click'?'ad-event-click':'ad-event-visit'}>{r.event_type==='phone_click'?'전화 클릭':'사이트 방문'}</span>{r.button&&<small className="ad-table-detail">{buttonNames[r.button]||r.button}</small>}</td><td>{sourceNames[r.source]}<small className="ad-table-detail">{r.campaign||'—'}</small></td></tr>)}{!rows.length&&<tr><td colSpan={7}><div className="ad-empty"><Users size={25}/><strong>{busy?'기록을 불러오는 중입니다':'조건에 맞는 방문 기록이 없습니다'}</strong><p>새 방문부터 국가·기기 정보가 기록됩니다. 기존 기록의 정보는 복원되지 않습니다.</p></div></td></tr>}</tbody></table></div>
    <div className="ad-pagination"><span>{total>10000?'CSV는 최신 10,000건까지 제공합니다.':'시각은 한국 시간 기준입니다.'}</span><div><button disabled={page===0||busy} onClick={()=>setPage(p=>p-1)} aria-label="이전 활동 페이지">‹</button><span>{page+1} / {Math.max(1,Math.ceil(total/25))}</span><button disabled={(page+1)*25>=total||busy} onClick={()=>setPage(p=>p+1)} aria-label="다음 활동 페이지">›</button></div></div></section>
    <p className="ad-footnote">국가는 IP 기반 추정치이며 VPN·통신망에 따라 실제 위치와 다를 수 있습니다. 기기·브라우저 정보도 전달된 정보에 따른 추정입니다. 원본 IP, 이름, 손님 전화번호, 기기 고유번호는 저장하지 않습니다.</p>
  </div>
}
