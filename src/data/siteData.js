import {
  Bath,
  Check,
  Clock3,
  Droplets,
  FileText,
  Flame,
  Gauge,
  MapPin,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  ShowerHead,
  ThumbsUp,
  Toilet,
  Wrench,
} from 'lucide-react'

export const companyInfo = {
  name: '다온설비',
  phone: '010-9879-2508',
  telLink: 'tel:010-9879-2508',
}

export const badges = [
  { label: '28~33분 출동', icon: Clock3 },
  { label: '투명 사전 견적', icon: FileText },
  { label: '미해결 0원', icon: Check },
  { label: '24시간 예약', icon: PhoneCall },
]

export const services = [
  {
    title: '변기막힘',
    icon: Toilet,
    desc: '막힘 원인을 먼저 확인하고 배관과 변기를 손상시키지 않는 방법으로 시원하게 뚫어드립니다.',
  },
  {
    title: '하수구막힘',
    icon: ShowerHead,
    desc: '악취와 역류를 일으키는 이물질과 배관 속 찌꺼기를 확인해 배수 흐름을 회복합니다.',
  },
  {
    title: '싱크대막힘',
    icon: Bath,
    desc: '기름때와 음식물 찌꺼기로 막힌 주방 배관을 점검하고 재발 원인까지 안내해드립니다.',
  },
  {
    title: '누수탐지',
    icon: Search,
    desc: '눈에 보이지 않는 누수 위치를 정밀하게 찾아 불필요한 철거를 줄이고 원인을 설명합니다.',
  },
  {
    title: '부품교체',
    icon: Wrench,
    desc: '수전, 트랩, 밸브 등 고장 난 부품을 점검하고 필요한 부품만 안내 후 교체합니다.',
  },
  {
    title: '상하수도/방수',
    icon: Droplets,
    desc: '상하수도 배관 문제와 욕실·베란다 방수 상태를 살펴 알맞은 보수 방법을 제안합니다.',
  },
]

export const promises = [
  {
    title: '원인 설명',
    desc: '작업 전에 문제 원인과 필요한 조치를 이해하기 쉽게 설명합니다.',
    icon: MessageCircle,
  },
  {
    title: '사전 정찰 견적',
    desc: '현장 상태를 확인한 뒤 작업 범위와 비용을 먼저 안내합니다.',
    icon: FileText,
  },
  {
    title: '과잉 시공 지양',
    desc: '필요한 작업만 진행하고 불필요한 교체나 추가 시공을 권하지 않습니다.',
    icon: ShieldCheck,
  },
]

export const process = [
  {
    step: 1,
    title: '접수',
    desc: ['증상과 주소, 방문 가능한 시간을', '확인합니다.'],
    icon: PhoneCall,
  },
  {
    step: 2,
    title: '정밀검사',
    desc: '현장 상태와 막힘·누수 원인을 꼼꼼히 살펴봅니다.',
    icon: Search,
  },
  {
    step: 3,
    title: '견적안내',
    desc: '작업 내용과 비용을 설명하고 동의를 확인합니다.',
    icon: FileText,
  },
  {
    step: 4,
    title: '책임시공',
    desc: ['합의한 범위대로 시공하고', '작동 상태를 확인합니다.'],
    icon: Wrench,
  },
]

export const strengths = [
  {
    title: '빠른 현장 출동',
    desc: '상담 후 가까운 일정과 이동 가능 시간을 확인해 신속히 방문합니다.',
    icon: MapPin,
  },
  {
    title: '원인부터 꼼꼼하게',
    desc: '겉으로 드러난 증상만 처리하지 않고 발생 원인과 배관 상태를 함께 살핍니다.',
    icon: Search,
  },
  {
    title: '투명한 비용 안내',
    desc: '작업 전 견적과 범위를 안내해 예상하지 못한 비용 부담을 줄입니다.',
    icon: FileText,
  },
  {
    title: '필요한 작업만',
    desc: '상태에 맞는 방법을 제안하고 과도한 교체나 시공은 지양합니다.',
    icon: ThumbsUp,
  },
  {
    title: '작업 후 확인',
    desc: '시공이 끝난 뒤 배수와 설비 작동 상태를 함께 확인합니다.',
    icon: Gauge,
  },
  {
    title: '24시간 상담 예약',
    desc: '급한 일정은 물론 야간과 주말 방문 예약도 전화로 상담해드립니다.',
    icon: Clock3,
  },
]

export const reviews = [
  {
    name: '김○○',
    location: '서울 마포구',
    service: '싱크대막힘',
    rating: 5,
    text: '싱크대 물이 거의 내려가지 않아 연락드렸어요. 오셔서 원인부터 설명해주시고 견적도 먼저 알려주셔서 안심하고 맡겼습니다. 작업 후 배수도 잘돼요.',
  },
  {
    name: '박○○',
    location: '경기 고양시',
    service: '변기막힘',
    rating: 5,
    text: '늦은 시간에 변기가 막혀 난감했는데 방문 가능 시간을 안내해주시고 깔끔하게 처리해주셨습니다. 주변도 정리해주셔서 만족했습니다.',
  },
  {
    name: '이○○',
    location: '서울 은평구',
    service: '누수탐지',
    rating: 5,
    text: '아랫집 천장에 물자국이 생겨 걱정했는데 누수 위치를 꼼꼼히 찾아주셨어요. 어떤 부분을 수리해야 하는지 차근차근 설명해주셔서 좋았습니다.',
  },
  {
    name: '최○○',
    location: '경기 부천시',
    service: '하수구막힘',
    rating: 5,
    text: '욕실 배수구에서 냄새가 나고 물도 고여서 문의했습니다. 상태를 확인한 뒤 필요한 작업과 비용을 먼저 안내해주셨고, 작업 후 물이 잘 빠집니다.',
  },
  {
    name: '정○○',
    location: '서울 강서구',
    service: '부품교체',
    rating: 5,
    text: '수전에서 계속 물이 떨어져 점검을 받았어요. 무조건 전체 교체를 권하지 않고 고장 난 부품을 설명해주신 뒤 교체해주셔서 믿음이 갔습니다.',
  },
]
