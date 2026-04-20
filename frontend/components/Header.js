'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: '홈' },
  { href: '/programs', label: '프로그램' },
  { href: '/philosophy', label: '교육 철학' },
  { href: '/consultation', label: '상담 신청' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white text-lg">🥚</span>
            </div>
            <span className="font-black text-xl text-purple-700 tracking-tight">퍼플에그</span>
          </Link>

          {/* 데스크톱 네비 */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/consultation"
              className="ml-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              무료 상담 신청
            </Link>
          </nav>

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all ${
                pathname === link.href
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/consultation"
            onClick={() => setMobileOpen(false)}
            className="block mt-2 text-center bg-purple-700 text-white font-semibold py-3 rounded-full"
          >
            무료 상담 신청
          </Link>
        </div>
      )}
    </header>
  )
}
