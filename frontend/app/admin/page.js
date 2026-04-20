'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  LogIn, LogOut, Users, BookOpen, Clock, CheckCircle,
  ChevronDown, Pencil, Trash2, Plus, X, Save, RefreshCw
} from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const STATUS_LABELS = {
  pending:   { label: '대기중',   color: 'bg-yellow-100 text-yellow-700' },
  contacted: { label: '연락완료', color: 'bg-blue-100 text-blue-700' },
  enrolled:  { label: '등록완료', color: 'bg-green-100 text-green-700' },
  cancelled: { label: '취소',    color: 'bg-gray-100 text-gray-500' },
}

const PROGRAM_NAMES = [
  '상상 렌즈', '가치 공작소', 'AI 파트너', '내일의 한 걸음',
  '이야기 설계사', '숫자 탐험대', '지구 수호대', '감정 나침반',
  '문화 여행자', '놀이 발명가',
]

export default function AdminPage() {
  const [token, setToken] = useState(null)
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState('dashboard')

  // 대시보드
  const [stats, setStats] = useState(null)

  // 상담 신청
  const [consultations, setConsultations] = useState([])
  const [filterStatus, setFilterStatus] = useState('')
  const [editConsult, setEditConsult] = useState(null)

  // 프로그램
  const [programs, setPrograms] = useState([])
  const [showProgramForm, setShowProgramForm] = useState(false)
  const [editProgram, setEditProgram] = useState(null)
  const [programForm, setProgramForm] = useState({
    number: 1, name: '', subtitle: '', description: '',
    start_date: '', end_date: '', day_of_week: '', time_slot: '',
    capacity: 8, is_active: true,
  })

  // 초기 토큰 로드
  useEffect(() => {
    const saved = localStorage.getItem('pe_admin_token')
    if (saved) setToken(saved)
  }, [])

  const authHeaders = { Authorization: `Bearer ${token}` }

  // ── 로그인 ────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail)
      }
      const data = await res.json()
      setToken(data.access_token)
      localStorage.setItem('pe_admin_token', data.access_token)
    } catch (e) {
      setLoginError(e.message)
    }
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('pe_admin_token')
  }

  // ── 데이터 fetch ──────────────────────────────────────
  const fetchStats = useCallback(async () => {
    if (!token) return
    const res = await fetch(`${API}/api/admin/dashboard`, { headers: authHeaders })
    if (res.ok) setStats(await res.json())
  }, [token])

  const fetchConsultations = useCallback(async () => {
    if (!token) return
    const url = filterStatus
      ? `${API}/api/admin/consultations?status=${filterStatus}&limit=100`
      : `${API}/api/admin/consultations?limit=100`
    const res = await fetch(url, { headers: authHeaders })
    if (res.ok) setConsultations(await res.json())
  }, [token, filterStatus])

  const fetchPrograms = useCallback(async () => {
    if (!token) return
    const res = await fetch(`${API}/api/admin/programs`, { headers: { ...authHeaders } })
    // programs is public, admin token not needed but pass anyway
    const res2 = await fetch(`${API}/api/programs`, { headers: authHeaders })
    if (res2.ok) setPrograms(await res2.json())
  }, [token])

  useEffect(() => {
    if (token) {
      fetchStats()
      fetchConsultations()
      fetchPrograms()
    }
  }, [token, fetchStats, fetchConsultations, fetchPrograms])

  // ── 상담 처리 ─────────────────────────────────────────
  const updateConsultation = async (id, payload) => {
    await fetch(`${API}/api/admin/consultations/${id}`, {
      method: 'PUT',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    fetchConsultations()
    fetchStats()
    setEditConsult(null)
  }

  const deleteConsultation = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await fetch(`${API}/api/admin/consultations/${id}`, {
      method: 'DELETE', headers: authHeaders,
    })
    fetchConsultations()
    fetchStats()
  }

  // ── 프로그램 처리 ──────────────────────────────────────
  const submitProgram = async () => {
    const method = editProgram ? 'PUT' : 'POST'
    const url = editProgram
      ? `${API}/api/admin/programs/${editProgram.id}`
      : `${API}/api/admin/programs`
    await fetch(url, {
      method,
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(programForm),
    })
    fetchPrograms()
    setShowProgramForm(false)
    setEditProgram(null)
    setProgramForm({ number: 1, name: '', subtitle: '', description: '', start_date: '', end_date: '', day_of_week: '', time_slot: '', capacity: 8, is_active: true })
  }

  const deleteProgram = async (id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await fetch(`${API}/api/admin/programs/${id}`, {
      method: 'DELETE', headers: authHeaders,
    })
    fetchPrograms()
  }

  // ── 로그인 화면 ───────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-purple-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🥚</div>
            <h1 className="text-2xl font-black text-gray-900">관리자 로그인</h1>
            <p className="text-gray-500 text-sm mt-1">퍼플에그 관리자 전용 페이지</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="아이디"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              className="input-field"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="input-field"
            />
            {loginError && (
              <p className="text-red-500 text-sm text-center">{loginError}</p>
            )}
            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
              <LogIn size={18} /> 로그인
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── 관리자 대시보드 ───────────────────────────────────
  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* 상단 바 */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex gap-1">
              {[
                { key: 'dashboard', label: '대시보드', icon: '📊' },
                { key: 'consultations', label: `상담 신청 ${stats ? `(${stats.pending_consultations})` : ''}`, icon: '📋' },
                { key: 'programs', label: '프로그램 일정', icon: '📅' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    tab === t.key ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
              <LogOut size={16} /> 로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── 대시보드 탭 ────────────────────────────── */}
        {tab === 'dashboard' && stats && (
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">대시보드</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: '전체 상담', value: stats.total_consultations, color: 'bg-purple-500', icon: <Users size={20} /> },
                { label: '대기중', value: stats.pending_consultations, color: 'bg-yellow-500', icon: <Clock size={20} /> },
                { label: '연락완료', value: stats.contacted_consultations, color: 'bg-blue-500', icon: <CheckCircle size={20} /> },
                { label: '등록완료', value: stats.enrolled_consultations, color: 'bg-green-500', icon: <CheckCircle size={20} /> },
                { label: '전체 프로그램', value: stats.total_programs, color: 'bg-indigo-500', icon: <BookOpen size={20} /> },
                { label: '모집중', value: stats.active_programs, color: 'bg-teal-500', icon: <BookOpen size={20} /> },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className={`w-10 h-10 ${s.color} text-white rounded-xl flex items-center justify-center mb-3`}>
                    {s.icon}
                  </div>
                  <div className="text-2xl font-black text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { fetchStats(); fetchConsultations(); fetchPrograms() }}
              className="mt-6 flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
            >
              <RefreshCw size={14} /> 새로고침
            </button>
          </div>
        )}

        {/* ── 상담 신청 탭 ────────────────────────────── */}
        {tab === 'consultations' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black text-gray-900">상담 신청 목록</h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field w-auto text-sm"
              >
                <option value="">전체 보기</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {consultations.length === 0 && (
                <div className="text-center py-12 text-gray-400">신청 내역이 없습니다.</div>
              )}
              {consultations.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge text-xs ${STATUS_LABELS[c.status].color}`}>
                          {STATUS_LABELS[c.status].label}
                        </span>
                        <span className="font-bold text-gray-900">{c.parent_name} 학부모님</span>
                        <span className="text-gray-400 text-xs">자녀: {c.child_name} ({c.child_grade})</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        📞 {c.phone} {c.email && `| ✉️ ${c.email}`}
                      </div>
                      {c.program_interest && (
                        <div className="text-sm text-purple-600 mt-1">관심 프로그램: {c.program_interest}</div>
                      )}
                      {c.message && (
                        <div className="text-sm text-gray-500 mt-1 italic">"{c.message}"</div>
                      )}
                      {c.admin_memo && (
                        <div className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1 mt-2">
                          📝 메모: {c.admin_memo}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-2">
                        신청: {new Date(c.created_at).toLocaleString('ko-KR')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditConsult(c)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteConsultation(c.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 상담 편집 모달 */}
            {editConsult && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-lg">상담 처리</h3>
                    <button onClick={() => setEditConsult(null)}>
                      <X size={20} className="text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {editConsult.parent_name} 학부모님 / {editConsult.child_name} ({editConsult.child_grade})
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">상태 변경</label>
                      <select
                        defaultValue={editConsult.status}
                        id="edit-status"
                        className="input-field"
                      >
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">관리자 메모</label>
                      <textarea
                        id="edit-memo"
                        rows={3}
                        defaultValue={editConsult.admin_memo || ''}
                        className="input-field resize-none"
                        placeholder="내부 메모 (학부모에게 표시되지 않음)"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const status = document.getElementById('edit-status').value
                        const memo = document.getElementById('edit-memo').value
                        updateConsultation(editConsult.id, { status, admin_memo: memo })
                      }}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <Save size={16} /> 저장
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 프로그램 일정 탭 ─────────────────────────── */}
        {tab === 'programs' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">프로그램 일정 관리</h2>
              <button
                onClick={() => { setShowProgramForm(true); setEditProgram(null) }}
                className="btn-primary flex items-center gap-2 text-sm py-2"
              >
                <Plus size={16} /> 일정 추가
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programs.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400 font-mono">#{p.number.toString().padStart(2,'0')}</span>
                        <span className="font-black text-gray-900">{p.name}</span>
                        <span className={`badge text-xs ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.is_active ? '모집중' : '마감'}
                        </span>
                      </div>
                      {p.subtitle && <p className="text-sm text-gray-500">{p.subtitle}</p>}
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        {p.day_of_week && <span className="mr-3">📅 {p.day_of_week}</span>}
                        {p.time_slot && <span className="mr-3">⏰ {p.time_slot}</span>}
                        {p.start_date && <span className="mr-3">🗓 {p.start_date} ~ {p.end_date}</span>}
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${Math.min((p.enrolled / p.capacity) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-gray-500 text-xs">{p.enrolled}/{p.capacity}명</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditProgram(p)
                          setProgramForm({
                            number: p.number, name: p.name, subtitle: p.subtitle || '',
                            description: p.description || '', start_date: p.start_date || '',
                            end_date: p.end_date || '', day_of_week: p.day_of_week || '',
                            time_slot: p.time_slot || '', capacity: p.capacity, is_active: p.is_active,
                          })
                          setShowProgramForm(true)
                        }}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => deleteProgram(p.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {programs.length === 0 && (
                <div className="col-span-2 text-center py-12 text-gray-400">
                  등록된 프로그램 일정이 없습니다.
                </div>
              )}
            </div>

            {/* 프로그램 폼 모달 */}
            {showProgramForm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-lg">{editProgram ? '프로그램 수정' : '프로그램 추가'}</h3>
                    <button onClick={() => { setShowProgramForm(false); setEditProgram(null) }}>
                      <X size={20} className="text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">번호</label>
                        <select
                          value={programForm.number}
                          onChange={(e) => setProgramForm({ ...programForm, number: +e.target.value, name: PROGRAM_NAMES[+e.target.value - 1] || '' })}
                          className="input-field text-sm"
                        >
                          {PROGRAM_NAMES.map((n, i) => (
                            <option key={i} value={i + 1}>{String(i + 1).padStart(2, '0')}. {n}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">프로그램명</label>
                        <input value={programForm.name} onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })} className="input-field text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">부제</label>
                      <input value={programForm.subtitle} onChange={(e) => setProgramForm({ ...programForm, subtitle: e.target.value })} className="input-field text-sm" placeholder="예: 생각을 뒤집는 습관" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">요일</label>
                        <input value={programForm.day_of_week} onChange={(e) => setProgramForm({ ...programForm, day_of_week: e.target.value })} className="input-field text-sm" placeholder="예: 매주 화요일" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">시간</label>
                        <input value={programForm.time_slot} onChange={(e) => setProgramForm({ ...programForm, time_slot: e.target.value })} className="input-field text-sm" placeholder="예: 16:00 ~ 18:00" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">개강일</label>
                        <input type="date" value={programForm.start_date} onChange={(e) => setProgramForm({ ...programForm, start_date: e.target.value })} className="input-field text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">종강일</label>
                        <input type="date" value={programForm.end_date} onChange={(e) => setProgramForm({ ...programForm, end_date: e.target.value })} className="input-field text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">정원</label>
                        <input type="number" value={programForm.capacity} onChange={(e) => setProgramForm({ ...programForm, capacity: +e.target.value })} className="input-field text-sm" min={1} max={20} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">모집 상태</label>
                        <select value={programForm.is_active} onChange={(e) => setProgramForm({ ...programForm, is_active: e.target.value === 'true' })} className="input-field text-sm">
                          <option value="true">모집중</option>
                          <option value="false">마감</option>
                        </select>
                      </div>
                    </div>
                    <button onClick={submitProgram} className="w-full btn-primary flex items-center justify-center gap-2">
                      <Save size={16} /> {editProgram ? '수정 저장' : '추가'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
