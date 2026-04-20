import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Clock, Star, CheckCircle } from 'lucide-react'

const programs = [
  { num: '01', name: '상상 렌즈', icon: '🔍', tag: '관점전환·질문습관', color: 'bg-purple-100 text-purple-700' },
  { num: '02', name: '가치 공작소', icon: '🏪', tag: '문제해결·창업가정신', color: 'bg-yellow-100 text-yellow-700' },
  { num: '03', name: 'AI 파트너', icon: '🤖', tag: '기술공생·디지털문해력', color: 'bg-blue-100 text-blue-700' },
  { num: '04', name: '내일의 한 걸음', icon: '🌱', tag: '공감·사회적기여', color: 'bg-green-100 text-green-700' },
  { num: '05', name: '이야기 설계사', icon: '📖', tag: '스토리텔링·표현력', color: 'bg-pink-100 text-pink-700' },
  { num: '06', name: '숫자 탐험대', icon: '📊', tag: '데이터리터러시', color: 'bg-orange-100 text-orange-700' },
]

const stats = [
  { icon: '🎓', value: '10가지', label: '핵심 역량 프로그램' },
  { icon: '👫', value: '6~8명', label: '소규모 밀착 수업' },
  { icon: '⏰', value: '주 1회 2시간', label: '부담 없는 일정' },
  { icon: '📋', value: '12주', label: '프로그램 완결형' },
]

const changes = [
  { before: '시키는 대로 하는 아이', after: '왜?라고 질문하는 아이' },
  { before: '정답만 찾는 아이', after: '다양한 관점을 탐색하는 아이' },
  { before: '혼자 공부하는 아이', after: '함께 토론하고 협업하는 아이' },
  { before: '결과에 집착하는 아이', after: '과정을 즐기는 아이' },
]

export default function Home() {
  return (
    <>
      {/* ── 히어로 섹션 ─────────────────────────────────────── */}
      <section className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-egg-cream flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles size={16} />
                초등 3·4학년 미래 역량 강화 프로그램
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                스스로 내일을<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-400">
                  만드는 아이들
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                역량 중심 교육으로의 패러다임 전환.<br />
                퍼플에그는 아이가 <strong className="text-purple-700">스스로 깨어나는</strong> 교육입니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/consultation" className="btn-primary flex items-center justify-center gap-2">
                  무료 상담 신청 <ArrowRight size={18} />
                </Link>
                <Link href="/programs" className="btn-outline flex items-center justify-center gap-2">
                  프로그램 보기
                </Link>
              </div>

              {/* 미니 통계 */}
              <div className="flex flex-wrap gap-6 mt-10">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-gray-600"><strong className="text-gray-900">10개</strong> 연간 프로그램</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-purple-600" />
                  <span className="text-sm text-gray-600"><strong className="text-gray-900">6~8명</strong> 소규모 수업</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-green-600" />
                  <span className="text-sm text-gray-600"><strong className="text-gray-900">주 1회</strong> 2시간</span>
                </div>
              </div>
            </div>

            {/* 히어로 일러스트 (에그 모양) */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 lg:w-96 lg:h-96">
                <div className="absolute inset-0 animate-float">
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-[60%_40%_70%_30%/50%_60%_40%_50%] shadow-2xl flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="text-7xl lg:text-8xl mb-4">🥚</div>
                      <p className="font-black text-xl lg:text-2xl">PURPLE EGG</p>
                      <p className="text-purple-200 text-sm mt-1">안에서 깨면 생명이 됩니다</p>
                    </div>
                  </div>
                </div>
                {/* 떠다니는 배지들 */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-2 rounded-full shadow-lg animate-bounce">
                  AI 교육 ✨
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-purple-700 text-xs font-bold px-3 py-2 rounded-full shadow-lg border-2 border-purple-200">
                  프로젝트 기반 학습
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI 시대 왜 퍼플에그인가 ─────────────────────────── */}
      <section className="section bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">AI 시대, 교육이 달라져야 합니다</h2>
            <p className="section-subtitle">미래를 살아갈 아이들에게 진짜 필요한 것은 무엇일까요?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card text-center border-l-4 border-purple-500">
              <div className="text-5xl font-black text-purple-700 mb-2">65%</div>
              <p className="text-gray-600 text-sm">현재 초등학생이 성인이 되면 <strong>지금 없는 직업</strong>에 종사하게 됩니다</p>
            </div>
            <div className="card text-center border-l-4 border-orange-400">
              <div className="text-5xl font-black text-orange-500 mb-2">47%</div>
              <p className="text-gray-600 text-sm">기존 일자리의 <strong>AI 자동화 가능성</strong> (옥스퍼드 연구)</p>
            </div>
            <div className="card text-center border-l-4 border-green-500">
              <div className="text-3xl font-black text-green-600 mb-2">🏆 1위</div>
              <p className="text-gray-600 text-sm">세계경제포럼 선정 <strong>미래 핵심 역량: 비판적 사고력</strong></p>
            </div>
          </div>

          {/* 비교표 */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-2 text-center">
              <div className="bg-gray-200 p-4 font-bold text-gray-700">기존 교육</div>
              <div className="bg-purple-700 p-4 font-bold text-white">퍼플에그 교육</div>
            </div>
            {[
              ['지식의 암기 및 정답 맞히기', '문제 정의 및 대안 생성 능력'],
              ['강사 중심의 일방향 강의', '학생 주도의 프로젝트 기반 학습'],
              ['전통적 교재 및 문제집', 'AI 및 다양한 디지털 창작 도구'],
              ['객관식 시험 및 점수/석차', '성장 포트폴리오 (사고의 궤적)'],
            ].map(([before, after], i) => (
              <div key={i} className="grid grid-cols-2">
                <div className="p-4 text-center text-sm text-gray-600 border-b border-gray-200">{before}</div>
                <div className="p-4 text-center text-sm text-purple-700 font-medium border-b border-purple-100 bg-purple-50">{after}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 통계 섹션 ────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-purple-700 to-purple-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center text-white">
                <div className="text-4xl mb-2">{s.icon}</div>
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-purple-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 프로그램 미리보기 ─────────────────────────────────── */}
      <section className="section bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">연간 10대 프로그램</h2>
            <p className="section-subtitle">각 12주 완결형 · 프로젝트 기반 학습</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {programs.map((p) => (
              <div key={p.num} className="card hover:scale-[1.02] transition-transform cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{p.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-400 font-mono">{p.num}</span>
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{p.name}</h3>
                    </div>
                    <span className={`badge text-xs ${p.color}`}>{p.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/programs" className="btn-outline inline-flex items-center gap-2">
              전체 프로그램 보기 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 12주 후 변화 ─────────────────────────────────────── */}
      <section className="section bg-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">12주 후, 이런 변화를 경험합니다</h2>
          </div>
          <div className="space-y-4">
            {changes.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
                <div className="flex-1 text-center sm:text-right">
                  <span className="text-gray-500 text-sm sm:text-base">{c.before}</span>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    →
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-purple-700 font-semibold text-sm sm:text-base">{c.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">자주 묻는 질문</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: '선행학습과 다른 점은 무엇인가요?', a: '지식 전달이 아닌 사고력 훈련에 집중합니다. 교과 성적도 자연스럽게 향상됩니다.' },
              { q: '소극적인 아이도 참여할 수 있나요?', a: '6~8명 소규모 운영으로 모든 아이가 발언 기회를 보장받습니다.' },
              { q: '숙제가 있나요?', a: '별도 숙제 없이 수업 시간 내 완결형으로 진행됩니다.' },
              { q: '다른 학원과 병행 가능한가요?', a: '주 1회 2시간 수업으로 부담 없이 병행 가능합니다.' },
            ].map((faq, i) => (
              <details key={i} className="group card cursor-pointer">
                <summary className="flex items-center justify-between font-semibold text-gray-800 list-none">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">Q</span>
                    {faq.q}
                  </span>
                  <span className="text-purple-600 group-open:rotate-180 transition-transform text-xl ml-4">+</span>
                </summary>
                <p className="mt-3 ml-8 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA 섹션 ─────────────────────────────────────────── */}
      <section className="section bg-gradient-to-br from-purple-700 via-purple-600 to-purple-500 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-6xl mb-6">🥚</div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            아이들의 내일을 향한 여정에<br />함께해 주세요
          </h2>
          <p className="text-purple-200 text-lg mb-8">
            "미래를 예측하는 가장 좋은 방법은 직접 만드는 것입니다." — 피터 드러커
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-8 py-4 rounded-full text-lg hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl"
          >
            지금 무료 상담 신청하기 <ArrowRight size={20} />
          </Link>
          <p className="text-purple-300 text-sm mt-4">별도 비용 없이 자세한 안내를 받아보세요</p>
        </div>
      </section>
    </>
  )
}
