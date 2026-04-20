import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 브랜드 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🥚</span>
              </div>
              <span className="font-black text-xl text-white">퍼플에그</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              스스로 내일을 만드는 아이들.<br />
              초등 3·4학년 미래 역량 강화 프로그램
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h4 className="font-bold text-white mb-4">바로가기</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: '홈' },
                { href: '/programs', label: '10대 프로그램' },
                { href: '/philosophy', label: '교육 철학' },
                { href: '/consultation', label: '상담 신청' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-purple-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 문의 */}
          <div>
            <h4 className="font-bold text-white mb-4">문의</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>수업 대상: 초등 3·4학년</p>
              <p>수업 시간: 주 1회 2시간</p>
              <p>정원: 6~8명 소규모 운영</p>
              <Link
                href="/consultation"
                className="inline-block mt-3 bg-purple-700 hover:bg-purple-600 text-white text-sm px-4 py-2 rounded-full transition-colors"
              >
                상담 신청하기
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          <p>© 2024 퍼플에그. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
