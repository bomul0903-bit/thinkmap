import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const allPrograms = [
  {
    num: '01', name: '상상 렌즈', icon: '🔍',
    subtitle: '생각을 뒤집는 습관',
    category: '관점전환 · 질문하는 습관',
    color: 'purple',
    curriculum: [
      '1–4주: 고정관념 깨기 (빌런의 시선으로 동화 다시 쓰기)',
      '5–8주: \'만약에\' 시나리오 토론 (돈/전기가 사라진 세상)',
      '9–12주: 불합리한 관습을 고치는 \'새로운 규칙\' 매뉴얼북 제작',
    ],
    quote: '당연한 것을 의심할 때 창의성이 시작됩니다.',
  },
  {
    num: '02', name: '가치 공작소', icon: '🏪',
    subtitle: '우리 동네의 문제 해결',
    category: '문제해결 · 창업가 정신',
    color: 'yellow',
    curriculum: [
      '1–4주: 동네 지도를 펼쳐 \'불편함\' 탐색 및 아이템 피칭',
      '5–8주: 비즈니스 모델링 및 브랜드 로고/광고 기획',
      '9–12주: 학원 내 \'미래 마켓\' 개최 및 실제 가치 창출',
    ],
    quote: '지도는 아이들에게 문제 해결의 무대가 됩니다.',
  },
  {
    num: '03', name: 'AI 파트너', icon: '🤖',
    subtitle: 'AI와 협업하는 창의성',
    category: '기술공생 · 디지털 문해력',
    color: 'blue',
    curriculum: [
      '1–4주: AI와 대화하는 법 (프롬프트 엔지니어링 기초)',
      '5–8주: 생성형 AI를 활용한 융합 창작 (전자책/웹툰 제작)',
      '9–12주: AI 윤리 및 저작권 토론, \'나만의 AI 가이드\' 수립',
    ],
    quote: 'AI를 경쟁 상대가 아닌 지능형 비서로 활용합니다.',
  },
  {
    num: '04', name: '내일의 한 걸음', icon: '🌱',
    subtitle: '체인지 메이커',
    category: '공감능력 · 사회적 기여',
    color: 'green',
    curriculum: [
      '1–4주: 공동체 문제 현장 조사 및 관련 인터뷰',
      '5–8주: 캠페인 기획 및 공공기관 제안서 발송',
      '9–12주: 캠페인 영상 제작 및 최종 데모데이 발표',
    ],
    quote: '작은 변화를 직접 만들어낸 효능감을 체득합니다.',
  },
  {
    num: '05', name: '이야기 설계사', icon: '📖',
    subtitle: '나만의 세계를 만드는 힘',
    category: '스토리텔링 · 표현력',
    color: 'pink',
    curriculum: [
      '1–4주: 이야기 구조 탐색 (기승전결, 영웅 서사 분석)',
      '5–8주: 나만의 캐릭터와 세계관 설계, 그림책 제작',
      '9–12주: 스토리 피칭 대회 및 또래 피드백 워크숍',
    ],
    quote: '이야기를 만드는 아이는 세상을 설계하는 어른이 됩니다.',
  },
  {
    num: '06', name: '숫자 탐험대', icon: '📊',
    subtitle: '데이터로 세상 읽기',
    category: '데이터 리터러시 · 논리 사고',
    color: 'orange',
    curriculum: [
      '1–4주: 우리 반/학교 데이터 수집 (설문, 관찰, 측정)',
      '5–8주: 그래프와 인포그래픽으로 데이터 시각화',
      '9–12주: \'데이터 뉴스\' 제작 및 발표',
    ],
    quote: '숫자 뒤에 숨은 이야기를 찾는 탐정이 됩니다.',
  },
  {
    num: '07', name: '지구 수호대', icon: '🌍',
    subtitle: '지속 가능한 내일 만들기',
    category: '환경 감수성 · 지속가능성',
    color: 'teal',
    curriculum: [
      '1–4주: 기후변화·환경오염 현장 탐사 및 문제 발견',
      '5–8주: 업사이클링 프로젝트 및 친환경 솔루션 설계',
      '9–12주: 환경 캠페인 포스터/영상 제작, 실천 서약 발표',
    ],
    quote: '지구를 지키는 작은 실천이 큰 변화를 만듭니다.',
  },
  {
    num: '08', name: '감정 나침반', icon: '🧭',
    subtitle: '나를 이해하는 첫 걸음',
    category: '감성 지능 · 자기 이해',
    color: 'rose',
    curriculum: [
      '1–4주: 감정 일기 쓰기 및 감정 어휘 확장 프로젝트',
      '5–8주: 공감 롤플레이 및 갈등 해결 시뮬레이션',
      '9–12주: \'감정 사전\' 제작 및 나만의 마음 관리 루틴 설계',
    ],
    quote: '자기 감정을 아는 아이가 타인도 이해합니다.',
  },
  {
    num: '09', name: '문화 여행자', icon: '✈️',
    subtitle: '다양성 속 나를 발견하다',
    category: '다문화 이해 · 글로벌 시민',
    color: 'indigo',
    curriculum: [
      '1–4주: 세계 문화 탐험 (음식, 놀이, 축제 비교 체험)',
      '5–8주: 다문화 친구 인터뷰 및 문화 교류 프로젝트',
      '9–12주: \'세계 시민 선언문\' 작성 및 글로벌 문화 축제 개최',
    ],
    quote: '다름을 존중할 줄 아는 아이가 세계를 이끕니다.',
  },
  {
    num: '10', name: '놀이 발명가', icon: '⚙️',
    subtitle: '상상을 현실로 만드는 손',
    category: '메이커 교육 · 창의적 제작',
    color: 'amber',
    curriculum: [
      '1–4주: 일상 속 불편함 발견 및 아이디어 스케치',
      '5–8주: 프로토타입 제작 (종이, 클레이, 간단한 코딩)',
      '9–12주: 발명품 전시회 및 특허 출원 체험 (모의)',
    ],
    quote: '놀이에서 시작된 호기심이 발명의 씨앗이 됩니다.',
  },
]

const colorMap = {
  purple: { bg: 'bg-purple-50', border: 'border-purple-300', badge: 'bg-purple-100 text-purple-700', icon: 'bg-purple-100', num: 'text-purple-400', quote: 'border-l-purple-400' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-300', badge: 'bg-yellow-100 text-yellow-700', icon: 'bg-yellow-100', num: 'text-yellow-500', quote: 'border-l-yellow-400' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-300',   badge: 'bg-blue-100 text-blue-700',   icon: 'bg-blue-100',   num: 'text-blue-400',   quote: 'border-l-blue-400' },
  green:  { bg: 'bg-green-50',  border: 'border-green-300',  badge: 'bg-green-100 text-green-700',  icon: 'bg-green-100',  num: 'text-green-500',  quote: 'border-l-green-400' },
  pink:   { bg: 'bg-pink-50',   border: 'border-pink-300',   badge: 'bg-pink-100 text-pink-700',   icon: 'bg-pink-100',   num: 'text-pink-400',   quote: 'border-l-pink-400' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-300', badge: 'bg-orange-100 text-orange-700', icon: 'bg-orange-100', num: 'text-orange-400', quote: 'border-l-orange-400' },
  teal:   { bg: 'bg-teal-50',   border: 'border-teal-300',   badge: 'bg-teal-100 text-teal-700',   icon: 'bg-teal-100',   num: 'text-teal-400',   quote: 'border-l-teal-400' },
  rose:   { bg: 'bg-rose-50',   border: 'border-rose-300',   badge: 'bg-rose-100 text-rose-700',   icon: 'bg-rose-100',   num: 'text-rose-400',   quote: 'border-l-rose-400' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-300', badge: 'bg-indigo-100 text-indigo-700', icon: 'bg-indigo-100', num: 'text-indigo-400', quote: 'border-l-indigo-400' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-300',  badge: 'bg-amber-100 text-amber-700',  icon: 'bg-amber-100',  num: 'text-amber-500',  quote: 'border-l-amber-400' },
}

export const metadata = {
  title: '10대 프로그램 | 퍼플에그',
}

export default function ProgramsPage() {
  return (
    <>
      {/* 헤더 */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span className="badge bg-purple-100 text-purple-700 mb-4">연간 프로그램</span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            10대 핵심 프로그램
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            각 프로그램은 12주 완결형으로 구성됩니다.<br />
            초등 3·4학년 대상 · 프로젝트 기반 학습
          </p>
        </div>
      </section>

      {/* 프로그램 목록 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allPrograms.map((prog) => {
              const c = colorMap[prog.color]
              return (
                <div key={prog.num} className={`rounded-2xl border-2 ${c.border} ${c.bg} p-6 hover:shadow-lg transition-shadow`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                      {prog.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-mono font-bold ${c.num}`}>{prog.num}</span>
                        <h2 className="text-lg font-black text-gray-900">{prog.name}</h2>
                      </div>
                      <p className="text-gray-600 text-sm">{prog.subtitle}</p>
                      <span className={`badge text-xs mt-1 ${c.badge}`}>{prog.category}</span>
                    </div>
                  </div>

                  {/* 커리큘럼 */}
                  <div className="space-y-2 mb-4">
                    {prog.curriculum.map((week, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="text-gray-400 flex-shrink-0">•</span>
                        <span>{week}</span>
                      </div>
                    ))}
                  </div>

                  {/* 인용구 */}
                  <blockquote className={`border-l-4 ${c.quote} pl-3 text-sm text-gray-600 italic`}>
                    "{prog.quote}"
                  </blockquote>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-purple-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-4">관심 있는 프로그램이 있으신가요?</h2>
          <p className="text-purple-200 mb-8">지금 무료 상담을 신청하시면 자세한 안내를 드립니다.</p>
          <Link href="/consultation" className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-8 py-4 rounded-full hover:bg-purple-50 transition-colors">
            무료 상담 신청 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
