'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const GRADES = ['초등 3학년', '초등 4학년', '초등 3학년 예정', '초등 4학년 예정', '기타']
const PROGRAMS = [
  '01. 상상 렌즈', '02. 가치 공작소', '03. AI 파트너',
  '04. 내일의 한 걸음', '05. 이야기 설계사', '06. 숫자 탐험대',
  '07. 지구 수호대', '08. 감정 나침반', '09. 문화 여행자', '10. 놀이 발명가',
  '아직 결정 못 했어요',
]

export default function ConsultationPage() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setStatus('loading')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || '신청 중 오류가 발생했습니다.')
      }
      setStatus('success')
      reset()
    } catch (e) {
      setStatus('error')
      setErrorMsg(e.message)
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-purple-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">상담 신청이 완료되었습니다!</h2>
          <p className="text-gray-600 mb-8">
            빠른 시일 내에 연락드리겠습니다.<br />
            퍼플에그와 함께해 주셔서 감사합니다. 🥚
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="btn-primary"
          >
            추가 신청하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 헤더 */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">무료 상담 신청</h1>
          <p className="text-gray-600 text-lg">
            아이의 이름과 연락처를 남겨주시면<br />
            빠른 시일 내에 연락드리겠습니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              { icon: '📞', text: '연락 후 개별 상담 진행' },
              { icon: '🆓', text: '상담 비용 없음' },
              { icon: '⏰', text: '24시간 내 연락' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm text-gray-700">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 폼 */}
      <section className="py-12 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {status === 'error' && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 학부모 이름 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                학부모 이름 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('parent_name', { required: '학부모 이름을 입력해주세요.' })}
                placeholder="홍길동"
                className="input-field"
              />
              {errors.parent_name && (
                <p className="mt-1 text-xs text-red-500">{errors.parent_name.message}</p>
              )}
            </div>

            {/* 자녀 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  자녀 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('child_name', { required: '자녀 이름을 입력해주세요.' })}
                  placeholder="홍소율"
                  className="input-field"
                />
                {errors.child_name && (
                  <p className="mt-1 text-xs text-red-500">{errors.child_name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  자녀 학년 <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('child_grade', { required: '학년을 선택해주세요.' })}
                  className="input-field"
                >
                  <option value="">학년 선택</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {errors.child_grade && (
                  <p className="mt-1 text-xs text-red-500">{errors.child_grade.message}</p>
                )}
              </div>
            </div>

            {/* 연락처 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                {...register('phone', {
                  required: '연락처를 입력해주세요.',
                  pattern: {
                    value: /^[0-9-\s]+$/,
                    message: '올바른 전화번호 형식으로 입력해주세요.',
                  },
                })}
                placeholder="010-1234-5678"
                className="input-field"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이메일 <span className="text-gray-400 text-xs">(선택)</span>
              </label>
              <input
                {...register('email', {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: '올바른 이메일 형식으로 입력해주세요.',
                  },
                })}
                placeholder="example@email.com"
                type="email"
                className="input-field"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* 관심 프로그램 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                관심 프로그램 <span className="text-gray-400 text-xs">(선택)</span>
              </label>
              <select {...register('program_interest')} className="input-field">
                <option value="">프로그램 선택</option>
                {PROGRAMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* 문의 내용 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                문의 내용 <span className="text-gray-400 text-xs">(선택)</span>
              </label>
              <textarea
                {...register('message')}
                rows={4}
                placeholder="궁금하신 점이나 전달하고 싶은 내용을 자유롭게 작성해주세요."
                className="input-field resize-none"
              />
            </div>

            {/* 개인정보 동의 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agree', { required: '개인정보 수집 및 이용에 동의해주세요.' })}
                  className="mt-1 accent-purple-600"
                />
                <span className="text-sm text-gray-600">
                  <strong className="text-gray-900">개인정보 수집 및 이용에 동의합니다.</strong><br />
                  수집 항목: 이름, 연락처, 이메일 / 목적: 상담 안내 / 보유기간: 상담 완료 후 1년
                </span>
              </label>
              {errors.agree && (
                <p className="mt-2 text-xs text-red-500">{errors.agree.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full btn-primary flex items-center justify-center gap-2 text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  신청 중...
                </>
              ) : (
                '상담 신청하기 🥚'
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
