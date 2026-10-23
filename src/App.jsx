import {
  ArrowRight,
  Check,
  ChevronRight,
  Droplets,
  FileCheck2,
  Menu,
  MessageCircle,
  Phone,
  PhoneCall,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { companyInfo, process as workProcess, reviews, services, strengths } from './data/siteData'

const PHONE_LINK = 'tel:010-9879-2508'

const serviceImages = [
  '/img/process_completion.png',
  '/img/work-example-drain-before.png',
  '/img/work-example-sink-before.png',
  '/img/process_inspection.png',
  '/img/process_estimate.png',
  '/img/work-example-bathroom-before.png',
]

const serviceImageAlts = [
  '변기 배수 상태를 확인하는 현장 작업 사진',
  '하수구 배관 막힘 현장 사진',
  '싱크대 배수구 오염 상태 사진',
  '배관 내시경 장비로 점검하는 모습',
  '점검 결과를 확인하며 상담하는 모습',
  '바닥 배수구 배관 상태 사진',
]

const serviceSummaries = [
  '변기와 배관의 막힘 원인을 확인합니다.',
  '악취와 역류 원인을 살펴 배관을 청소합니다.',
  '주방 배수 정체와 역류 상태를 점검합니다.',
  '누수 의심 부위를 확인해 수리 범위를 안내합니다.',
  '수전과 밸브 등 필요한 부품을 교체합니다.',
  '상하수도 배관과 방수 상태를 점검합니다.',
]

const workCases = [
  { before: '/img/work-example-drain-before.png', after: '/img/work-example-drain-after.png', title: '하수구 배관 세척', beforeLabel: '하수구 배관 막힘', afterLabel: '하수구 배관 세척' },
  { before: '/img/work-example-sink-before.png', after: '/img/work-example-sink-after.png', title: '싱크대 배수관 청소', beforeLabel: '싱크대 배수 막힘', afterLabel: '싱크대 배수관 청소' },
  { before: '/img/work-example-bathroom-before.png', after: '/img/work-example-bathroom-after.png', title: '욕실 배수구 정리', beforeLabel: '욕실 배수구 막힘', afterLabel: '욕실 배수구 청소' },
]

const processImages = [
  '/img/process_intake.png',
  '/img/process_inspection.png',
  '/img/process_estimate.png',
  '/img/process_completion.png',
]

const processImageAlts = [
  '고객과 배관 문제를 전화로 상담하는 모습',
  '배관 내시경 장비로 막힘 원인을 점검하는 모습',
  '점검 화면을 보며 작업 범위와 비용을 안내하는 모습',
  '작업 후 변기 배수 상태를 확인하는 모습',
]

const processTitles = ['상담 접수', '현장 점검', '견적 안내 및 동의', '작업 후 상태 확인']

const promises = [
  {
    title: '원인 사전 설명',
    description: '작업 전 문제 원인과 필요한 조치를 이해하기 쉽게 설명합니다.',
    icon: MessageCircle,
  },
  {
    title: '사전 합의 정찰 견적',
    description: '현장을 확인한 뒤 작업 범위와 비용을 먼저 안내하고 동의를 구합니다.',
    icon: FileCheck2,
  },
  {
    title: '무리한 과잉 시공 지양',
    description: '꼭 필요한 작업을 제안하고 불필요한 교체나 시공은 권하지 않습니다.',
    icon: ShieldCheck,
  },
]

const navItems = [
  ['서비스', '#services'],
  ['작업 사례', '#work'],
  ['작업 과정', '#process'],
  ['고객 후기', '#reviews'],
]

function PhoneLink({ children, className = '', ...props }) {
  return <a href={PHONE_LINK} className={className} {...props}>{children}</a>
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-9">
      <p className="mb-2 inline-flex min-h-9 items-center rounded-full bg-blue-50 px-3 text-sm font-black text-blue-800 sm:min-h-10 sm:px-4 sm:text-base">{eyebrow}</p>
      <h2 className="break-keep text-[clamp(1.55rem,6vw,2.5rem)] font-black leading-[1.25] tracking-[-.04em] text-slate-900">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-xl break-keep text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">{description}</p>}
    </div>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:h-[72px] sm:px-7">
        <a href="#home" className="inline-flex min-h-12 items-center gap-2.5" aria-label="다온설비 홈">
          <span className="grid size-9 place-items-center rounded-xl bg-blue-700 text-white sm:size-10"><Droplets size={21} /></span>
          <span className="text-lg font-black tracking-tight text-slate-900">{companyInfo.name}</span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="주요 메뉴">
          {navItems.map(([label, href]) => <a key={href} href={href} className="inline-flex min-h-12 items-center text-sm font-bold text-slate-600 transition hover:text-blue-700">{label}</a>)}
        </nav>
        <PhoneLink className="hidden min-h-12 items-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-800 md:inline-flex">
          <Phone size={17} /> 전화 상담 <span className="hidden lg:inline">{companyInfo.phone}</span>
        </PhoneLink>
        <button
          type="button"
          className="grid size-12 place-items-center rounded-xl text-slate-800 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <Menu size={23} />
        </button>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" className="border-t border-slate-100 bg-white px-4 py-2 md:hidden" aria-label="모바일 메뉴">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center border-b border-slate-100 px-1 text-sm font-bold text-slate-700 last:border-0">{label}</a>
          ))}
        </nav>
      )}
    </header>
  )
}

function DispatchBoard() {
  return (
    <aside className="dispatch-float" aria-label="평균 현장 도착 시간 안내">
      <span className="dispatch-float-dot" aria-hidden="true" />
      <span className="dispatch-float-label">평균 도착</span>
      <span className="dispatch-float-time"><span>28</span><small>~</small><span>33</span><small>분</small></span>
      <span className="dispatch-float-live">LIVE</span>
    </aside>
  )
}

function Hero() {
  return (
    <section id="home" className="overflow-hidden bg-white p-0">
      <div className="mx-auto w-full max-w-5xl overflow-hidden">
        <div className="overflow-hidden">
          <div className="hero-banner relative">
            <h1 className="sr-only">다온설비 | 서울·수도권 24시간 배관케어</h1>
            <PhoneLink className="block" aria-label="다온설비 전화 상담 010-9879-2508">
              <img src="/img/daon-hero-portrait.png" alt="다온설비, 막힘부터 누수까지 전문가가 해결합니다. 정확한 진단, 빠른 출동, 합리적인 비용, 확실한 A/S. 변기, 싱크대, 하수구, 누수탐지, 간단수리. 24시 출장대기 010-9879-2508" width="572" height="1024" fetchPriority="high" className="block h-auto w-full" />
            </PhoneLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceGrid() {
  return (
    <section id="services" className="scroll-mt-24 bg-sky-50 px-4 py-10 sm:px-7 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="다온설비 주요 서비스" title="막힘부터 누수까지" description="현장을 확인하고 필요한 작업과 비용을 먼저 안내합니다." />
        <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-4">
          {services.map((service, index) => (
            <article key={service.title} className="flex min-h-[94px] min-w-0 items-center gap-3 rounded-2xl border border-sky-200 bg-white p-2.5 shadow-sm sm:min-h-[112px] sm:gap-4 sm:p-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-500 sm:size-8"><Check size={18} strokeWidth={3} /></span>
              <span className="min-w-0 flex-1">
                <span className="block break-keep text-[15px] font-black leading-5 text-slate-900 sm:text-base">{service.title}</span>
                <span className="mt-1 block break-keep text-[11px] leading-[1.45] text-slate-600 sm:text-xs">{serviceSummaries[index]}</span>
              </span>
              <img src={serviceImages[index]} alt={serviceImageAlts[index]} width="764" height="508" loading="lazy" decoding="async" className="h-[72px] w-[100px] shrink-0 rounded-xl border border-slate-100 object-cover sm:h-[86px] sm:w-[120px]" />
            </article>
          ))}
        </div>
        <p className="mx-auto mt-4 max-w-max rounded-full bg-slate-900 px-4 py-2 text-center text-[10px] font-semibold leading-4 text-white sm:mt-5 sm:text-xs">※ 작업 범위와 비용은 현장 상태를 확인한 뒤 안내해드립니다.</p>
      </div>
    </section>
  )
}

function BeforeAfter() {
  return (
    <section id="work" className="scroll-mt-20 bg-white px-4 py-10 sm:px-7 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="다온설비 작업 사례" title="작업 전·후 비교" description="막힘 원인을 점검하고 작업 후 배수 상태까지 확인합니다." />
        <div className="mx-auto mt-5 grid max-w-lg gap-4 sm:mt-6 sm:gap-5">
          {workCases.map(({ before, after, title, beforeLabel, afterLabel }) => (
            <figure key={title} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm sm:rounded-3xl sm:p-2">
              <div className="grid grid-cols-2 overflow-hidden rounded-xl bg-slate-200">
                <div className="relative aspect-square border-r-2 border-slate-300">
                  <img src={before} alt={`${beforeLabel} 작업 전 예시`} width="760" height="760" loading="lazy" decoding="async" className="block h-full w-full object-cover" />
                  <span className="absolute left-2 top-2 rounded-md bg-red-600 px-2 py-1 text-xs font-black text-white shadow sm:text-sm">BEFORE</span>
                </div>
                <div className="relative aspect-square">
                  <img src={after} alt={`${afterLabel} 작업 후 예시`} width="760" height="760" loading="lazy" decoding="async" className="block h-full w-full object-cover" />
                  <span className="absolute right-2 top-2 rounded-md bg-sky-600 px-2 py-1 text-xs font-black text-white shadow sm:text-sm">AFTER</span>
                </div>
              </div>
              <figcaption className="grid grid-cols-2 gap-2 px-1.5 pb-1 pt-2 sm:gap-3 sm:px-2 sm:pb-2 sm:pt-3">
                <span className="flex min-h-11 items-center justify-center break-keep rounded-xl bg-rose-50 px-1.5 py-2 text-center text-[10px] font-black leading-tight text-rose-700 sm:min-h-12 sm:text-sm">BEFORE · {beforeLabel}</span>
                <span className="flex min-h-11 items-center justify-center break-keep rounded-xl bg-blue-50 px-1.5 py-2 text-center text-[10px] font-black leading-tight text-blue-700 sm:min-h-12 sm:text-sm">AFTER · {afterLabel}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function PromiseSection() {
  return (
    <section id="promise" className="scroll-mt-20 overflow-hidden bg-sky-50 px-4 py-10 text-slate-900 sm:px-7 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-16">
        <div>
          <p className="mb-2 text-sm font-black text-blue-700 sm:text-base">정직한 시공 약속</p>
          <h2 className="break-keep text-3xl font-black leading-tight tracking-tight sm:text-5xl">상담부터 마무리까지,<br />투명하게</h2>
          <p className="mt-4 max-w-lg break-keep text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base">작업 전 충분히 설명하고, 동의하신 범위 안에서만 작업합니다. 해결되지 않은 문제에는 비용을 청구하지 않습니다.</p>
          <PhoneLink className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-blue-700">
            <Phone size={17} /> 전화로 먼저 상담하기 <ArrowRight size={16} />
          </PhoneLink>
        </div>
        <div className="divide-y divide-sky-200 border-y border-sky-200">
          {promises.map(({ title, description, icon: Icon }, index) => (
            <article key={title} className="grid grid-cols-[30px_44px_1fr_18px] items-center gap-3 py-4 sm:grid-cols-[40px_50px_1fr_20px] sm:gap-4 sm:py-5">
              <span className="text-xs font-black tracking-widest text-blue-700">0{index + 1}</span>
              <span className="grid size-11 place-items-center rounded-xl bg-white text-blue-600 ring-1 ring-sky-100 sm:size-12"><Icon size={21} /></span>
              <div><h3 className="break-keep text-sm font-black sm:text-base">{title}</h3><p className="mt-1 break-keep text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">{description}</p></div>
              <Check size={18} className="text-blue-700" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section id="process" className="scroll-mt-20 bg-[#fffdf8] px-4 py-10 sm:px-7 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-10">
          <p className="mb-2 text-sm font-black text-orange-500 sm:text-base">문제 원인부터 해결까지</p>
          <h2 className="break-keep text-[clamp(1.65rem,6vw,2.7rem)] font-black leading-[1.2] tracking-[-.045em] text-slate-900">체계적인 <span className="text-blue-600">작업 과정</span></h2>
          <p className="mx-auto mt-2 max-w-xl break-keep text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">작업 범위와 비용을 먼저 안내한 뒤,<br />합의된 내용대로 진행합니다.</p>
        </div>
        <div className="process-visual-grid grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8">
          {workProcess.map(({ step, title, desc }, index) => (
            <article key={step} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm sm:rounded-3xl sm:p-4">
              <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
                <span className="inline-flex min-h-6 items-center rounded-full bg-blue-600 px-2.5 text-[9px] font-black tracking-wide text-white sm:min-h-7 sm:px-3 sm:text-[10px]">STEP 0{step}</span>
                <span className="h-px flex-1 bg-slate-100" />
              </div>
              <h3 className="min-h-10 break-keep text-[15px] font-black leading-5 text-slate-900 sm:min-h-12 sm:text-lg sm:leading-6">{processTitles[index] || title}</h3>
              <p className="mt-1 min-h-10 break-keep text-[11px] leading-[1.55] text-slate-600 sm:min-h-12 sm:text-sm sm:leading-6">{Array.isArray(desc) ? desc.join(' ') : desc}</p>
              <div className="mt-2.5 aspect-[1.55] overflow-hidden rounded-xl bg-slate-100 sm:mt-3 sm:rounded-2xl">
                <img src={processImages[index]} alt={processImageAlts[index]} width="764" height="508" loading="lazy" decoding="async" className="block h-full w-full object-cover" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function StrengthSection() {
  const gridRef = useRef(null)
  const [stepsVisible, setStepsVisible] = useState(false)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid || !('IntersectionObserver' in window)) {
      setStepsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStepsVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.2 })

    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-white px-4 py-10 sm:px-7 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="다온설비가 다른 이유" title="다온설비를 선택하는 이유" description="꼼꼼한 점검과 정직한 설명으로 믿을 수 있는 서비스를 제공합니다." />
        <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {strengths.map(({ title, desc, icon: Icon }, index) => (
            <article key={title} style={{ animationDelay: `${index * 1.5}s` }} className={`strength-step min-h-32 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:min-h-0 sm:rounded-3xl sm:p-6 ${stepsVisible ? 'strength-step-visible' : ''}`}>
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold tracking-widest text-slate-400">0{index + 1}</span><span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-700 sm:size-11"><Icon size={19} /></span></div>
              <h3 className="mt-3 break-keep text-sm font-black text-slate-900 sm:mt-5 sm:text-base">{title}</h3>
              <p className="mt-2 hidden text-sm leading-6 text-slate-600 sm:block">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-20 bg-slate-50 px-4 py-10 sm:px-7 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="고객님들의 이용 후기" title="고객님이 남겨주신 후기" description="상담과 작업 과정에서 느끼신 점을 확인해보세요." />
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {reviews.slice(0, 5).map((review) => (
            <article key={`${review.name}-${review.service}`} className="flex min-h-48 flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:min-h-56 sm:rounded-3xl sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-0.5 text-amber-500" role="img" aria-label={`${review.rating}점 만점에 ${review.rating}점`}>
                  {Array.from({ length: review.rating }, (_, index) => <Star key={index} size={15} fill="currentColor" strokeWidth={1.5} />)}
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-800 sm:text-xs">{review.service}</span>
              </div>
              <p className="mt-4 flex-1 break-keep text-sm leading-6 text-slate-700 sm:mt-5 sm:text-[15px] sm:leading-7">“{review.text}”</p>
              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 sm:mt-5 sm:pt-4">
                <span className="grid size-9 place-items-center rounded-full bg-slate-100 text-sm font-black text-slate-600">{review.name.slice(0, 1)}</span>
                <div><p className="text-xs font-extrabold text-slate-800">{review.name}</p><p className="mt-0.5 text-[10px] text-slate-500">{review.location}</p></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactFooter() {
  return (
    <>
      <section id="contact" className="bg-sky-50 px-4 py-10 text-slate-900 sm:px-7 sm:py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div><p className="text-sm font-black text-blue-700 sm:text-base">다온설비 배관·설비 상담</p><h2 className="mt-2 break-keep text-2xl font-black tracking-tight sm:text-3xl">불편한 순간, 다온설비에 전화하세요.</h2><p className="mt-2 text-sm leading-6 text-blue-700">증상을 듣고 가능한 방문 일정을 안내해드립니다.</p></div>
          <PhoneLink className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 font-black text-white shadow-md transition hover:bg-blue-700 sm:w-auto"><PhoneCall size={20} /> {companyInfo.phone} <ArrowRight size={18} /></PhoneLink>
        </div>
      </section>
      <footer className="border-t border-sky-100 bg-white px-4 py-7 text-slate-600 sm:px-7 sm:py-9">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a href="#home" className="inline-flex min-h-12 items-center gap-2 font-black text-blue-700"><Droplets size={19} className="text-blue-600" />{companyInfo.name}</a>
          <p className="text-xs">배관·설비 상담 <PhoneLink className="font-bold text-blue-700">{companyInfo.phone}</PhoneLink></p>
          <p className="text-[11px] text-slate-500">© {new Date().getFullYear()} 다온설비</p>
        </div>
      </footer>
    </>
  )
}

function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <PhoneLink className="call-pulse flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-blue-700 px-3 text-sm font-black text-white" aria-label={`전화걸기 ${companyInfo.phone}`}>
        <PhoneCall size={19} /> 전화걸기
      </PhoneLink>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-24 font-sans text-slate-900 md:pb-0">
      <style>{`@keyframes callGlow{0%,100%{box-shadow:0 0 0 0 rgba(37,99,235,.2),0 8px 22px rgba(30,64,175,.16)}50%{box-shadow:0 0 0 7px rgba(37,99,235,0),0 10px 27px rgba(30,64,175,.22)}}@keyframes callSweep{0%,58%{transform:translateX(-180%) skewX(-22deg);opacity:0}66%{opacity:.55}82%,100%{transform:translateX(420%) skewX(-22deg);opacity:0}}@keyframes timerFlash{0%,100%{filter:brightness(1);transform:scale(1)}50%{filter:brightness(1.12);transform:scale(1.025)}}@keyframes strengthStepFocus{0%,100%{transform:translateY(0) scale(1);border-color:#e2e8f0;box-shadow:0 1px 3px rgba(15,23,42,.04)}12%,28%{transform:translateY(-2px) scale(1.025);border-color:#3b82f6;box-shadow:0 0 0 5px rgba(59,130,246,.12),0 12px 26px rgba(37,99,235,.12)}40%{transform:translateY(0) scale(1);border-color:#e2e8f0;box-shadow:0 1px 3px rgba(15,23,42,.04)}}.call-pulse{position:relative;isolation:isolate;overflow:hidden;animation:callGlow 2.4s ease-out infinite}.call-pulse:before{position:absolute;z-index:0;top:-35%;bottom:-35%;left:0;width:32%;transform:translateX(-180%) skewX(-22deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.34),transparent);content:"";pointer-events:none;animation:callSweep 3.8s ease-in-out infinite}.call-pulse>*{position:relative;z-index:1}.timer-flash{animation:timerFlash 1.8s ease-in-out infinite}.dispatch-board{backdrop-filter:blur(12px)}.strength-step-visible{animation:strengthStepFocus 9s ease-in-out infinite}@media(prefers-reduced-motion:reduce){.call-pulse,.call-pulse:before,.timer-flash,.strength-step-visible}`}</style>
      <Header />
      <main>
        <Hero />
        <ServiceGrid />
        <BeforeAfter />
        <section aria-label="다온설비 배관 업체 비교 안내" className="w-full overflow-hidden bg-sky-50">
<div className="mx-auto max-w-5xl px-4 py-10 text-center sm:px-7 sm:py-16"><p className="font-bold text-blue-700">우리 동네 배관 해결사, 다온설비</p><h2 className="mt-3 text-2xl font-black sm:text-4xl">꼼꼼하게 비교하고 선택하세요</h2><p className="mt-4 leading-7 text-slate-600">작업 전 원인 설명 · 사전 견적 안내 · 작업 후 배수 확인<br />처음 상담부터 마무리 점검까지 다온설비가 함께합니다.</p></div>
        </section>
        <PromiseSection />
        <ProcessSection />
        <StrengthSection />
        <Reviews />
        <ContactFooter />
      </main>
      <DispatchBoard />
      <MobileActionBar />
    </div>
  )
}
