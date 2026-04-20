import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: '퍼플에그 | 초등 3·4학년 미래 역량 강화 프로그램',
  description: '스스로 내일을 만드는 아이들. 퍼플에그는 초등 3·4학년을 위한 역량 중심 미래 교육 프로그램입니다.',
  keywords: '퍼플에그, 초등교육, 미래역량, 창의교육, AI교육, 프로젝트학습',
  openGraph: {
    title: '퍼플에그 | 초등 3·4학년 미래 역량 강화 프로그램',
    description: '스스로 내일을 만드는 아이들',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
