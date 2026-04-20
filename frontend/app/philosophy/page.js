import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const philosophies = [
  {
    step: '1',
    keyword: 'Egg',
    title: '알을 품다',
    subtitle: '모든 아이는 무한한 가능성을 품은 알입니다',
    description: '아직 깨어나지 않은 잠재력을 발견하고, 그 가능성이 스스로 자랄 수 있도록 최적의 환경을 만들어줍니다.',
    icon: '🥚',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    step: '2',
    keyword: 'Crack',
    title: '스스로 깨어나다',
    subtitle: '알은 안에서 깰 때 비로소 생명이 됩니다',
    description: '정답을 주입하는 대신, 올바른 질문으로 아이 스스로 껍질을 깨고 나오는 힘을 기릅니다.',
    icon: '✨',
    color: 'from-purple-400 to-purple-600',
  },
  {
    step: '3',
    keyword: 'Purple',
    title: '나만의 색으로 날다',
    subtitle: '세상에 하나뿐인 퍼플빛 나를 만들어갑니다',
    description: '창의성과 개성을 상징하는 보라색처럼, 아이만의 고유한 빛깔로 세상에 가치를 더하는 인재로 성장합니다.',
    icon: '🦋',
    color: 'from-purple-600 to-indigo-600',
  },
]

const competencies = [
  { code: 'CO', name: '소통과 협업', desc: '동료와 함께 문제를 풀며 리더십과 공감 능력 배양', icon: '🤝' },
  { code: 'RE', name: '회복 탄력성', desc: '실패를 당연한 과정으로 받아들이는 단단한 마음', icon: '💪' },
  { code: 'SL', name: '자기 주도력', desc: '자신이 배울 것을 직접 정하고 실행하는 독립적 태도', icon: '🎯' },
  { code: 'CT', name: '비판적 사고', desc: '정보를 분석하고 판단하는 논리적 사고 능력 향상', icon: '🧠' },
  { code: 'SE', name: '사회적 감수성', desc: '공동체의 문제에 공감하고 실천으로 옮기는 시민의식', icon: '🌍' },
  { code: 'CR', name: '창의적 표현력', desc: '다양한 도구와 매체를 활용해 자신만의 방식으로 표현', icon: '🎨' },
]

export const metadata = {
  title: '교육 철학 | 퍼플에그',
}

export default function PhilosophyPage() {
  return (
    <>
      {/* 헤더 */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-700 via-purple-600 to-purple-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-6xl mb-6">🥚</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">퍼플에그의 교육 철학</h1>
          <p className="text-xl text-purple-200 leading-relaxed">
            "알은 밖에서 깨면 음식이 되고,<br />
            안에서 깨면 생명이 됩니다.<br />
            퍼플에그는 아이 스스로 깨어나는 교육입니다."
          </p>
        </div>
      </section>

      {/* 3가지 핵심 철학 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="space-y-8">
            {philosophies.map((p, i) => (
              <div
                key={i}
                className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
              >
                {/* 아이콘 */}
                <div className="flex-shrink-0">
                  <div className={`w-36 h-36 bg-gradient-to-br ${p.color} rounded-[50%_40%_60%_40%/50%] flex flex-col items-center justify-center shadow-xl`}>
                    <span className="text-4xl">{p.icon}</span>
                    <span className="text-white font-black text-sm mt-1">{p.keyword}</span>
                  </div>
                </div>

                {/* 내용 */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-black text-sm">{p.step}</span>
                    <h2 className="text-2xl font-black text-gray-900">{p.title}</h2>
                  </div>
                  <p className="text-purple-700 font-semibold mb-3">{p.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6가지 역량 */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">우리 아이들이 얻게 될 변화</h2>
            <p className="section-subtitle">퍼플에그가 키워가는 6가지 핵심 역량</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {competencies.map((c) => (
              <div key={c.code} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-purple-400">{c.code}</span>
                      <h3 className="font-black text-gray-900">{c.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 강사 소개 */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="section-title mb-12">강사 소개</h2>
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-md">
            <div className="w-24 h-24 bg-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
              👩‍🏫
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">정혜숙</h3>
            <p className="text-purple-600 font-medium mb-6">퍼플에그 대표 강사</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-left mb-6">
              {[
                '現) 에듀빌 이사',
                '現) 창의적열정교육 교육원장',
                '現) 아소비 신규원장 연수 지도',
                '前) YTN 수다학 고정 패널',
                '前) 밤비니지니어스 원장',
                '前) 가베/프로젝트접근법 컨텐츠 개발',
              ].map((item, i) => (
                <div key={i} className="flex gap-2 text-gray-700">
                  <span className="text-purple-400">•</span>
                  {item}
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-6">
              <h4 className="font-bold text-gray-900 mb-3">저서 및 연구</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {['몰입의 열쇠', '논증으로 합격하라', '갈릴레이 실험수학 교재개발', 'P.T.A.T. 전형별 합격예측 검사', 'S.L.T. 자기주도학습', 'M.I.T 진로적성검사'].map((item) => (
                  <span key={item} className="badge bg-purple-100 text-purple-700 text-xs">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-purple-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-4">퍼플에그와 함께 시작해보세요</h2>
          <Link href="/consultation" className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-8 py-4 rounded-full hover:bg-purple-50 transition-colors mt-4">
            무료 상담 신청 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
