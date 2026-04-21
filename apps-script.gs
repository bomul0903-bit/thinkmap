/**
 * ═══════════════════════════════════════════════════════════════
 * 퍼플에그 홈페이지 백엔드 (Google Apps Script)
 * ═══════════════════════════════════════════════════════════════
 *
 * 사용법 요약 (자세한 단계는 SETUP.md 참고):
 *
 * 1) 상담용 Google Sheets를 새로 만들고 이 스프레드시트에서
 *    Extensions → Apps Script 열기
 * 2) 기본 코드 모두 지우고 이 파일 전체를 붙여넣기
 * 3) 파일 상단 CONFIG의 ADMIN_USER / ADMIN_PASS / SHEET_ID 수정
 *    (또는 스크립트 속성에서 설정 - SETUP.md 참고)
 * 4) "initSheets" 함수를 한 번 실행해 시트를 초기화
 * 5) "배포 → 새 배포 → 웹 앱" 으로 게시하고 URL 복사
 *    - 실행: 나 / 액세스: 모든 사용자
 * 6) 복사한 URL을 index.html의 CONFIG.APPS_SCRIPT_URL 에 붙여넣기
 *
 * ═══════════════════════════════════════════════════════════════
 */

// ───────────── 기본 설정 ─────────────
// 스크립트 속성(Script Properties)에 설정하는 것을 권장합니다.
// 프로젝트 설정 → 스크립트 속성에서 다음 키로 저장:
//   ADMIN_USER, ADMIN_PASS, SHEET_ID
// 스크립트 속성이 비어 있으면 아래 기본값이 사용됩니다.
const DEFAULTS = {
  ADMIN_USER: 'admin',                // 관리자 아이디
  ADMIN_PASS: 'CHANGE_ME_PLEASE_!',   // 반드시 변경하세요!
  SHEET_ID:   '',                     // 비워두면 스크립트가 연결된 스프레드시트 사용
};

const CONSULT_SHEET = 'consultations';
const SCHEDULE_SHEET = 'schedules';

const CONSULT_HEADERS = ['id', 'created_at', 'status', 'parent_name', 'child_name', 'child_grade', 'phone', 'email', 'program_interest', 'message', 'admin_memo'];
const SCHEDULE_HEADERS = ['id', 'num', 'name', 'day', 'time', 'cap', 'start', 'end', 'active', 'enrolled'];

// ───────────── 유틸 ─────────────
function getProp_(key) {
  const v = PropertiesService.getScriptProperties().getProperty(key);
  return v || DEFAULTS[key] || '';
}

function getSheet_(name) {
  const id = getProp_('SHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('스프레드시트를 찾을 수 없습니다. SHEET_ID를 확인하세요.');
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    const headers = name === CONSULT_SHEET ? CONSULT_HEADERS : SCHEDULE_HEADERS;
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readAll_(name) {
  const sheet = getSheet_(name);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return rows.map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });
}

function findRowIndex_(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function genId_() {
  return Utilities.getUuid();
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function authCheck_(auth) {
  if (!auth || !auth.username || !auth.password) {
    throw new Error('인증 정보가 없습니다.');
  }
  const u = getProp_('ADMIN_USER');
  const p = getProp_('ADMIN_PASS');
  if (auth.username !== u || auth.password !== p) {
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
  }
  if (p === DEFAULTS.ADMIN_PASS) {
    throw new Error('기본 비밀번호가 변경되지 않았습니다. 스크립트 속성에서 ADMIN_PASS를 설정하세요.');
  }
}

function sanitizeString_(s, max) {
  if (s == null) return '';
  const str = String(s);
  return max ? str.slice(0, max) : str;
}

// ───────────── 엔드포인트 (doPost) ─────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const action = body.action;
    const result = handleAction_(action, body);
    return jsonResponse_({ok: true, ...result});
  } catch (err) {
    return jsonResponse_({ok: false, error: err.message || String(err)});
  }
}

// GET 요청도 지원 (단순 health check용)
function doGet() {
  return jsonResponse_({ok: true, message: '퍼플에그 API 작동 중'});
}

function handleAction_(action, body) {
  switch (action) {
    case 'submitConsult':
      return submitConsult_(body.data);
    case 'adminLogin':
      authCheck_(body.auth);
      return {message: '로그인 성공'};
    case 'getAdminData':
      authCheck_(body.auth);
      return getAdminData_();
    case 'updateConsult':
      authCheck_(body.auth);
      return updateConsult_(body.id, body.patch);
    case 'deleteConsult':
      authCheck_(body.auth);
      return deleteConsult_(body.id);
    case 'addSchedule':
      authCheck_(body.auth);
      return addSchedule_(body.data);
    case 'updateSchedule':
      authCheck_(body.auth);
      return updateSchedule_(body.id, body.patch);
    case 'deleteSchedule':
      authCheck_(body.auth);
      return deleteSchedule_(body.id);
    default:
      throw new Error('알 수 없는 action: ' + action);
  }
}

// ───────────── 상담 처리 ─────────────
function submitConsult_(data) {
  if (!data || !data.parent_name || !data.child_name || !data.phone) {
    throw new Error('필수 항목이 누락되었습니다.');
  }
  // 간단한 중복/스팸 방지: 같은 연락처로 10분 내 재신청 불가
  const existing = readAll_(CONSULT_SHEET);
  const now = new Date();
  const recent = existing.find(c => {
    if (c.phone !== data.phone) return false;
    const t = new Date(c.created_at);
    return !isNaN(t.getTime()) && (now - t) < 10 * 60 * 1000;
  });
  if (recent) throw new Error('방금 전 동일한 연락처로 신청이 접수되었습니다.');

  const sheet = getSheet_(CONSULT_SHEET);
  const row = {
    id: genId_(),
    created_at: Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
    status: 'pending',
    parent_name: sanitizeString_(data.parent_name, 50),
    child_name: sanitizeString_(data.child_name, 50),
    child_grade: sanitizeString_(data.child_grade, 30),
    phone: sanitizeString_(data.phone, 30),
    email: sanitizeString_(data.email, 100),
    program_interest: sanitizeString_(data.program_interest, 100),
    message: sanitizeString_(data.message, 1000),
    admin_memo: '',
  };
  sheet.appendRow(CONSULT_HEADERS.map(h => row[h]));

  // 신청이 들어오면 관리자에게 이메일 알림 (선택사항)
  try {
    const notifyEmail = getProp_('NOTIFY_EMAIL');
    if (notifyEmail) {
      MailApp.sendEmail({
        to: notifyEmail,
        subject: `[퍼플에그] 새 상담 신청: ${row.parent_name} 학부모님`,
        body: `새로운 상담 신청이 접수되었습니다.\n\n` +
              `- 학부모: ${row.parent_name}\n` +
              `- 자녀: ${row.child_name} (${row.child_grade})\n` +
              `- 연락처: ${row.phone}\n` +
              `- 이메일: ${row.email}\n` +
              `- 관심 프로그램: ${row.program_interest}\n` +
              `- 문의: ${row.message}\n\n` +
              `관리자 페이지에서 확인하세요.`,
        });
    }
  } catch (e) {
    // 이메일 실패는 무시
    Logger.log('이메일 전송 실패: ' + e.message);
  }

  return {id: row.id};
}

function getAdminData_() {
  const consults = readAll_(CONSULT_SHEET);
  const schedules = readAll_(SCHEDULE_SHEET);
  // 최신순 정렬
  consults.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  // 스케줄: active 불리언 변환
  schedules.forEach(s => {
    s.active = String(s.active).toLowerCase() === 'true' || s.active === true;
    s.cap = Number(s.cap) || 0;
    s.enrolled = Number(s.enrolled) || 0;
    s.num = Number(s.num) || 0;
  });
  return {consults, schedules};
}

function updateConsult_(id, patch) {
  const sheet = getSheet_(CONSULT_SHEET);
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx < 0) throw new Error('상담 내역을 찾을 수 없습니다.');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  Object.keys(patch || {}).forEach(k => {
    const col = headers.indexOf(k);
    if (col >= 0) sheet.getRange(rowIdx, col + 1).setValue(sanitizeString_(patch[k], 1000));
  });
  return {};
}

function deleteConsult_(id) {
  const sheet = getSheet_(CONSULT_SHEET);
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx < 0) throw new Error('상담 내역을 찾을 수 없습니다.');
  sheet.deleteRow(rowIdx);
  return {};
}

// ───────────── 스케줄 처리 ─────────────
function addSchedule_(data) {
  if (!data || !data.num || !data.name) throw new Error('프로그램 정보가 누락되었습니다.');
  const sheet = getSheet_(SCHEDULE_SHEET);
  const row = {
    id: genId_(),
    num: Number(data.num) || 1,
    name: sanitizeString_(data.name, 100),
    day: sanitizeString_(data.day, 50),
    time: sanitizeString_(data.time, 50),
    cap: Number(data.cap) || 8,
    start: sanitizeString_(data.start, 30),
    end: sanitizeString_(data.end, 30),
    active: data.active ? true : false,
    enrolled: Number(data.enrolled) || 0,
  };
  sheet.appendRow(SCHEDULE_HEADERS.map(h => row[h]));
  return {id: row.id};
}

function updateSchedule_(id, patch) {
  const sheet = getSheet_(SCHEDULE_SHEET);
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx < 0) throw new Error('일정을 찾을 수 없습니다.');
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  Object.keys(patch || {}).forEach(k => {
    const col = headers.indexOf(k);
    if (col >= 0) {
      let v = patch[k];
      if (k === 'active') v = v ? 'true' : 'false';
      else if (typeof v === 'string') v = sanitizeString_(v, 200);
      sheet.getRange(rowIdx, col + 1).setValue(v);
    }
  });
  return {};
}

function deleteSchedule_(id) {
  const sheet = getSheet_(SCHEDULE_SHEET);
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx < 0) throw new Error('일정을 찾을 수 없습니다.');
  sheet.deleteRow(rowIdx);
  return {};
}

// ───────────── 초기 셋업 함수 (한 번만 실행) ─────────────
/**
 * 이 함수를 한 번 실행하면 두 시트(consultations, schedules)가 생성됩니다.
 * 실행 방법: 상단 드롭다운에서 "initSheets" 선택 → ▶ 실행
 */
function initSheets() {
  getSheet_(CONSULT_SHEET);
  getSheet_(SCHEDULE_SHEET);
  Logger.log('시트 초기화 완료!');
  Logger.log('스크립트 속성에 ADMIN_USER, ADMIN_PASS를 설정하는 것을 잊지 마세요.');
}

/**
 * 테스트용: 샘플 상담 신청을 하나 추가합니다.
 */
function testAddSample() {
  const id = submitConsult_({
    parent_name: '테스트학부모',
    child_name: '테스트아이',
    child_grade: '초등 4학년',
    phone: '010-0000-0000',
    email: 'test@example.com',
    program_interest: '03. AI 파트너',
    message: '테스트 메시지입니다.',
  });
  Logger.log('샘플 추가 완료: ' + JSON.stringify(id));
}
