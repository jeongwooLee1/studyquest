// lt-api — 레벨테스트(study.blissme.ai/leveltest) 응시·채점·기록·텔레그램 알림
//
// 정답은 이 함수(tests/*.ts)에만 있다. 페이지에는 정답을 뺀 문제만 응시 시작 후에 내려간다.
// 기록: public.lt_attempts (RLS 켜고 정책 없음 — service_role 만 접근)
// 알림: StudyQuest 봇(app_secrets.TELEGRAM_BOT_TOKEN) → app_secrets.LT_TG_CHAT_ID, 없으면 TELEGRAM_OWNER_CHAT_ID
// 학부모 전체 목록: app_secrets.LT_PARENT_KEY
//
// POST { action, ... }
//   catalog                         시험 목록(문제 없음)
//   version                         시험별 내용 해시(배포 확인용)
//   progress {student}              문제지 목록 화면용: 시험별 푼 횟수·최근/최고 점수(정답·리포트 링크 없음)
//   avatars                         문제지 목록 이름 버튼 사진 {이름: data URI} (public.lt_avatars, 저장소에는 사진 없음)
//   start   {testId, student}       응시 시작 → attemptId, kidToken, 문제, 마감 시각
//   resume  {attemptId, kidToken}   새로고침·재접속 시 이어서 풀기
//   save    {attemptId, kidToken, answers, qtimes, tabLeaves}
//   submit  {attemptId, kidToken, answers, qtimes, tabLeaves, auto}
//   report  {r}                     학부모 상세 리포트(텔레그램 링크의 report_token)
//   list    {key}                   학부모 전체 기록
//   delete  {key, id}               기록 삭제
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { MATH_M1 } from './tests/math_m1.ts';
import { REC_1, REC_2, REC_3, REC_4 } from './tests/rec_e56.ts';
import { MATH_E4 } from './tests/math_e4.ts';
import { grade } from './grade.ts';

const TESTS: Record<string, any> = Object.fromEntries([MATH_M1, MATH_E4, REC_1, REC_2, REC_3, REC_4].map((t) => [t.id, t]));
const SITE = 'https://study.blissme.ai/leveltest/';
const GRACE_MS = 2 * 60 * 1000; // 마감 후 네트워크 지연 허용

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type, authorization, apikey', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, 'content-type': 'application/json' } });
const admin = () => createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
const getSecret = async (sb: any, key: string) => { const { data } = await sb.from('app_secrets').select('value').eq('key', key).maybeSingle(); return data ? data.value : null; };
function safeEq(a: unknown, b: unknown) { const x = String(a || ''), y = String(b || ''); if (!x || !y || x.length !== y.length) return false; let d = 0; for (let i = 0; i < x.length; i++) d |= x.charCodeAt(i) ^ y.charCodeAt(i); return d === 0; }
const randTok = () => [...crypto.getRandomValues(new Uint8Array(18))].map((b) => b.toString(16).padStart(2, '0')).join('');
const escH = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const publicQuestions = (test: any) => test.questions.map((q: any) => {
  const { answer: _a, traps: _t, explain: _e, ...rest } = q; // 정답·함정·풀이는 제출 전엔 내려보내지 않음
  return rest;
});
const testMeta = (test: any) => ({ id: test.id, title: test.title, subtitle: test.subtitle, minutes: test.minutes, count: test.questions.length, practice: !!test.practice, passMsg: test.passMsg || '',
  areas: test.areas.map((a: any) => ({ id: a.id, group: a.group, name: a.name, unit: a.unit, why: a.why, study: a.study })) });
// 아이에게 보여주는 결과. 레벨테스트는 정답·풀이 없음(재시험 대비), 복습 문제지(practice)는 문항별 정답·풀이까지
const kidResult = (res: any, test: any) => ({ score: res.score, total: res.total, pct: res.pct, overall: res.overall,
  areas: res.areas.map((a: any) => ({ id: a.id, group: a.group, name: a.name, correct: a.correct, total: a.total, level: a.level })),
  review: test.practice ? res.perQ.map((p: any) => {
    const q = test.questions.find((x: any) => x.id === p.id);
    return { no: p.no, text: q.text, fig: q.fig, options: q.options, given: p.given, answer: q.answer, correct: p.correct, dk: p.dk, trap: p.trap, explain: q.explain };
  }) : undefined });
const sha256 = async (s: string) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');

// ── 텔레그램 ──
async function tgSend(sb: any, text: string, button?: { text: string; url: string }) {
  try {
    const token = await getSecret(sb, 'TELEGRAM_BOT_TOKEN');
    const chat = (await getSecret(sb, 'LT_TG_CHAT_ID')) || (await getSecret(sb, 'TELEGRAM_OWNER_CHAT_ID'));
    if (!token || !chat) return false;
    const body: any = { chat_id: chat, text, parse_mode: 'HTML', disable_web_page_preview: true };
    if (button) body.reply_markup = { inline_keyboard: [[button]] };
    const r = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    if (!j.ok) console.error('telegram', j);
    return !!j.ok;
  } catch (e) { console.error('telegram', e); return false; }
}
const kst = (iso: string) => { const d = new Date(new Date(iso).getTime() + 9 * 3600e3); const p = (n: number) => String(n).padStart(2, '0'); return `${d.getUTCMonth() + 1}/${d.getUTCDate()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`; };
const mmss = (sec: number) => `${Math.floor(sec / 60)}분 ${sec % 60}초`;
const LV = { pass: '🟢', weak: '🟡', focus: '🔴' } as Record<string, string>;

function resultMessage(test: any, row: any, res: any) {
  const elapsed = Math.min(Math.round((new Date(row.submitted_at).getTime() - new Date(row.started_at).getTime()) / 1000), test.minutes * 60);
  const how = row.status === 'expired' ? '⏰ 시간 종료 — 자동 제출' : row.result_auto ? '⏰ 시간 종료 — 자동 제출' : '✅ 제출 완료';
  const L: string[] = [];
  L.push(`📝 <b>${escH(row.student)}</b> · ${escH(test.title)}`);
  L.push(`${how} (${kst(row.submitted_at)})`);
  L.push(`점수 <b>${res.score} / ${res.total}</b> (${res.pct}%) · ${res.overall}`);
  L.push(`소요 ${mmss(elapsed)} / 제한 ${test.minutes}분${row.tab_leaves ? ` · 화면 이탈 ${row.tab_leaves}회` : ''}`);
  const dk = res.perQ.filter((p: any) => p.dk).length, blank = res.perQ.filter((p: any) => p.blank).length;
  if (dk || blank) L.push(`모르겠어요 ${dk}문항 · 빈칸 ${blank}문항`);
  for (const g of [...new Set(res.areas.map((a: any) => a.group))] as string[]) {
    const as = res.areas.filter((a: any) => a.group === g);
    if (!as.length) continue;
    L.push('');
    L.push(`<b>[${g}]</b>`);
    for (const a of as) L.push(`${LV[a.level]} ${escH(a.name)} ${a.correct}/${a.total}${a.slow ? ' 🐢' : ''}`);
  }
  if (res.priority.length) {
    L.push('');
    L.push('<b>👉 학습 순서</b>');
    res.priority.slice(0, 5).forEach((id: string, i: number) => {
      const a = test.areas.find((x: any) => x.id === id);
      L.push(`${i + 1}. ${escH(a.name)} — ${escH(a.study[0])}`);
    });
  } else {
    L.push('');
    L.push('👏 모든 영역 통과!' + (test.passMsg ? ' ' + test.passMsg : ''));
  }
  if (res.habits.length) {
    L.push('');
    L.push('<b>🔍 오답 습관</b>');
    for (const h of res.habits.slice(0, 4)) L.push(`· ${escH(h.note)}${h.n > 1 ? ` (${h.n}번)` : ''}`);
  }
  return L.join('\n');
}

// 마감 지났는데 제출 안 된 응시 → 마지막 저장 답안으로 채점(아이가 창을 닫아도 결과가 남도록)
async function finalizeExpired(sb: any) {
  const cutoff = new Date(Date.now() - GRACE_MS).toISOString();
  const { data: rows } = await sb.from('lt_attempts').select('*').eq('status', 'in_progress').lt('deadline_at', cutoff).limit(20);
  for (const row of rows || []) await finalize(sb, row, row.answers, row.qtimes, row.tab_leaves, 'expired');
}

async function finalize(sb: any, row: any, answers: any, qtimes: any, tabLeaves: number, status: 'submitted' | 'expired', auto = false) {
  const test = TESTS[row.test_id];
  const res = grade(test, answers, qtimes);
  const submittedAt = status === 'expired' ? row.deadline_at : new Date().toISOString();
  const patch = { status, submitted_at: submittedAt, answers, qtimes, tab_leaves: tabLeaves, score: res.score, total: res.total, result: { ...res, auto } };
  // in_progress 일 때만 — 두 번 제출돼도 알림은 한 번
  const { data: upd } = await sb.from('lt_attempts').update(patch).eq('id', row.id).eq('status', 'in_progress').select('*');
  if (!upd || !upd.length) {
    const { data: cur } = await sb.from('lt_attempts').select('*').eq('id', row.id).maybeSingle();
    return cur;
  }
  const done = upd[0];
  if (!done.no_notify) {
    await tgSend(sb, resultMessage(test, { ...done, result_auto: auto }, res), { text: '📊 상세 리포트 보기', url: SITE + 'report.html?r=' + done.report_token });
  }
  return done;
}

function cleanAnswers(test: any, answers: any) {
  const out: Record<string, any> = {};
  if (!answers || typeof answers !== 'object') return out;
  for (const q of test.questions) {
    const a = answers[q.id];
    if (!a || typeof a !== 'object') continue;
    if (a.dk) { out[q.id] = { dk: true }; continue; }
    if (q.type === 'choice') { const n = Number(a.v); if (Number.isInteger(n) && n >= 1 && n <= q.options.length) out[q.id] = { v: n }; }
    else if (q.type === 'num') { if (a.v != null && String(a.v).trim()) out[q.id] = { v: String(a.v).slice(0, 24) }; }
    else if (q.type === 'nums') { if (Array.isArray(a.v)) out[q.id] = { v: q.answer.map((_: any, i: number) => String(a.v[i] ?? '').slice(0, 24)) }; }
  }
  return out;
}
function cleanTimes(test: any, qtimes: any) {
  const out: Record<string, number> = {};
  if (!qtimes || typeof qtimes !== 'object') return out;
  for (const q of test.questions) { const n = Number(qtimes[q.id]); if (n > 0) out[q.id] = Math.min(Math.round(n), test.minutes * 60); }
  return out;
}

async function loadKid(sb: any, attemptId: unknown, kidToken: unknown) {
  if (!attemptId || !kidToken || !/^[0-9a-f-]{36}$/.test(String(attemptId))) return null;
  const { data: row } = await sb.from('lt_attempts').select('*').eq('id', String(attemptId)).maybeSingle();
  if (!row || !safeEq(row.kid_token, kidToken)) return null;
  return row;
}

const attemptSummary = (r: any) => ({ id: r.id, testId: r.test_id, student: r.student, status: r.status, startedAt: r.started_at, submittedAt: r.submitted_at,
  score: r.score, total: r.total, tabLeaves: r.tab_leaves, reportToken: r.report_token,
  areas: r.result ? r.result.areas.map((a: any) => ({ id: a.id, name: a.name, level: a.level, correct: a.correct, total: a.total })) : null });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  try {
    const body = await req.json();
    const action = String(body.action || '');
    const sb = admin();
    const now = Date.now();

    if (action === 'catalog') return json({ tests: Object.values(TESTS).map(testMeta) });
    // 배포본 확인용: 시험별 내용 해시(저장소의 tests/*.ts 와 같은지 비교)
    if (action === 'version') return json({ tests: Object.fromEntries(await Promise.all(Object.values(TESTS).map(async (t: any) => [t.id, await sha256(JSON.stringify(t))]))) });

    if (action === 'progress') {
      const student = String(body.student || '').replace(/\s+/g, ' ').trim().slice(0, 20);
      if (!student) return json({ error: '이름이 필요해요' }, 400);
      await finalizeExpired(sb);
      const { data } = await sb.from('lt_attempts').select('test_id,status,score,total,started_at,submitted_at').eq('student', student).order('started_at', { ascending: false }).limit(300);
      const progress: Record<string, any> = {};
      for (const r of data || []) {
        const o = progress[r.test_id] ||= { count: 0, done: 0, best: null, total: r.total, inProgress: false, last: null };
        o.count++;
        if (!o.last) o.last = { status: r.status, score: r.score, total: r.total, startedAt: r.started_at, submittedAt: r.submitted_at };
        if (r.status === 'in_progress') o.inProgress = true;
        else { o.done++; o.total = r.total; if (o.best == null || r.score > o.best) o.best = r.score; }
      }
      return json({ student, progress });
    }

    if (action === 'avatars') {
      const { data } = await sb.from('lt_avatars').select('student,image');
      return json({ avatars: Object.fromEntries((data || []).map((r: any) => [r.student, r.image])) });
    }

    if (action === 'start') {
      const test = TESTS[String(body.testId || '')];
      if (!test) return json({ error: '시험을 찾을 수 없어요' }, 404);
      const student = String(body.student || '').replace(/\s+/g, ' ').trim().slice(0, 20);
      if (!student) return json({ error: '이름을 입력해 주세요' }, 400);
      await finalizeExpired(sb);
      const startedAt = new Date(now).toISOString();
      const deadlineAt = new Date(now + test.minutes * 60 * 1000).toISOString();
      const row = { test_id: test.id, student, kid_token: randTok(), report_token: randTok(), started_at: startedAt, deadline_at: deadlineAt,
        user_agent: String(req.headers.get('user-agent') || '').slice(0, 300), no_notify: !!body.noNotify && student.startsWith('테스트') }; // 개발 확인용: 이름이 '테스트…'일 때만 알림 끄기 허용
      const { data, error } = await sb.from('lt_attempts').insert(row).select('id').single();
      if (error) throw error;
      if (!row.no_notify) await tgSend(sb, `▶️ <b>${escH(student)}</b> · ${escH(test.title)} 응시 시작 (${kst(startedAt)})\n${test.questions.length}문항 · 제한 ${test.minutes}분 → ${kst(deadlineAt)} 마감`);
      return json({ attemptId: data.id, kidToken: row.kid_token, startedAt, deadlineAt, serverNow: new Date().toISOString(), test: testMeta(test), questions: publicQuestions(test) });
    }

    if (action === 'resume' || action === 'save' || action === 'submit') {
      let row = await loadKid(sb, body.attemptId, body.kidToken);
      if (!row) return json({ error: '응시 기록을 찾을 수 없어요' }, 404);
      const test = TESTS[row.test_id];
      const late = now > new Date(row.deadline_at).getTime() + GRACE_MS;
      if (row.status === 'in_progress' && action !== 'resume' && !late) {
        const answers = cleanAnswers(test, body.answers), qtimes = cleanTimes(test, body.qtimes);
        const tabLeaves = Math.max(row.tab_leaves || 0, Math.min(Number(body.tabLeaves) || 0, 999));
        if (action === 'save') {
          await sb.from('lt_attempts').update({ answers, qtimes, tab_leaves: tabLeaves, saved_at: new Date().toISOString() }).eq('id', row.id).eq('status', 'in_progress');
          return json({ ok: true, status: 'in_progress', serverNow: new Date().toISOString() });
        }
        row = await finalize(sb, row, answers, qtimes, tabLeaves, 'submitted', !!body.auto);
      } else if (row.status === 'in_progress' && late) {
        row = await finalize(sb, row, row.answers, row.qtimes, row.tab_leaves, 'expired');
      }
      if (row.status === 'in_progress') {
        return json({ status: 'in_progress', startedAt: row.started_at, deadlineAt: row.deadline_at, serverNow: new Date().toISOString(), student: row.student,
          answers: row.answers, qtimes: row.qtimes, tabLeaves: row.tab_leaves, test: testMeta(test), questions: publicQuestions(test) });
      }
      return json({ status: row.status, student: row.student, test: testMeta(test), result: kidResult(row.result, test) });
    }

    if (action === 'report') {
      const r = String(body.r || '');
      if (!/^[0-9a-f]{36}$/.test(r)) return json({ error: '잘못된 링크예요' }, 400);
      await finalizeExpired(sb);
      const { data: row } = await sb.from('lt_attempts').select('*').eq('report_token', r).maybeSingle();
      if (!row) return json({ error: '기록을 찾을 수 없어요' }, 404);
      const test = TESTS[row.test_id];
      const { data: hist } = await sb.from('lt_attempts').select('*').eq('test_id', row.test_id).eq('student', row.student).order('started_at', { ascending: false }).limit(20);
      return json({ attempt: { ...attemptSummary(row), deadlineAt: row.deadline_at, answers: row.answers, qtimes: row.qtimes }, result: row.result,
        test: { ...testMeta(test), questions: test.questions }, history: (hist || []).map(attemptSummary) });
    }

    if (action === 'list' || action === 'delete') {
      const key = await getSecret(sb, 'LT_PARENT_KEY');
      if (!key || !safeEq(body.key, key)) return json({ error: '학부모 키가 맞지 않아요' }, 403);
      if (action === 'delete') {
        if (!/^[0-9a-f-]{36}$/.test(String(body.id || ''))) return json({ error: '잘못된 요청' }, 400);
        await sb.from('lt_attempts').delete().eq('id', String(body.id));
        return json({ ok: true });
      }
      await finalizeExpired(sb);
      const { data } = await sb.from('lt_attempts').select('*').order('started_at', { ascending: false }).limit(200);
      return json({ tests: Object.values(TESTS).map((t) => ({ id: t.id, title: t.title })), attempts: (data || []).map(attemptSummary) });
    }

    return json({ error: '알 수 없는 요청' }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: '서버 오류: ' + String((e as Error)?.message || e) }, 500);
  }
});
