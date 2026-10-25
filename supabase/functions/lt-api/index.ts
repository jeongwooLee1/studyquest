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
//   retryInfo {testId, student}     틀린 문제 다시 풀기 안내(testId 는 '<문제지 id>:re') — 해결 못 한 유형 수와 유형별 설명 카드
//   start {testId: '<id>:re', …}    해결 못 한 유형마다 비슷한 문제(twins.ts) 1개로 시작. 만든 문제는 lt_attempts.questions 에 저장
//   daily {key, send?}               아이별 하루 정리(부족한 점·조언·들을 강의·내일 할 일·카톡 문구)를 텔레그램으로
//   fast  {attemptId, kidToken, qid, sec}  너무 빨리 찍음 → 경고 횟수 기록, 텔레그램 알림
//   check {attemptId, kidToken, qid, v | dk, sec}  다시 풀기 한 문제 바로 채점 → 정답·풀이, 통과 전이면 같은 유형 문제를 하나 더 붙임
//                                   같은 유형 2번 연속 정답이면 통과. 다 끝나면 submit 으로 마감(답은 서버에 저장된 것으로 채점)
//   start   {testId, student}       응시 시작 → attemptId, kidToken, 문제, 마감 시각
//   resume  {attemptId, kidToken}   새로고침·재접속 시 이어서 풀기
//   save    {attemptId, kidToken, answers, qtimes, tabLeaves}
//   submit  {attemptId, kidToken, answers, qtimes, tabLeaves, auto}
//   work    {attemptId, kidToken, image}  제출 뒤 연습장 풀이 사진(data URI, 응시당 3장까지) → AI 확인 피드백 + 아빠 텔레그램(사진+요약). work.ts
//   report  {r}                     학부모 상세 리포트(텔레그램 링크의 report_token)
//   list    {key}                   학부모 전체 기록
//   delete  {key, id}               기록 삭제
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { MATH_M1 } from './tests/math_m1.ts';
import { REC_1, REC_2, REC_3, REC_4 } from './tests/rec_e56.ts';
import { MATH_E4 } from './tests/math_e4.ts';
import { UNIT_SETS } from './tests/rec_units.ts';
import { E4_SETS } from './tests/e4_sets.ts';
import { GEO_E } from './tests/geo_e.ts';
import { ENG_DIAG, engReliability } from './tests/eng_diag.ts';
import { ENG_GRAM_SETS, ENG_VARIANTS } from './tests/eng_gram.ts';
import { ENG_VOC_SETS, ENG_VOC_VARIANTS } from './tests/eng_voc.ts';
import { ENG_SQ_SETS, ENG_SQ_VARIANTS } from './tests/eng_sq_check.ts';
import { MATH_EQW_SETS } from './tests/math_eqw.ts';
import { MATH_M2_SETS } from './tests/math_m2.ts';
import { grade } from './grade.ts';
import { makeTwin, hasTwin, makeRng } from './twins.ts';
import { KOR_M1_DIAG, KOR_E4_DIAG } from './tests/kor_diag.ts';
import { SCI_GAS_SETS, SCI_TWINS } from './tests/sci_gas.ts';
import { SCI_FORCE_SETS, SCI_FORCE_TWINS } from './tests/sci_force.ts';
import { SCI_GAS_UNIT, SCI_GAS_UNIT_TWINS } from './tests/sci_gas_unit.ts';
import { KOR_M1_GRAMMAR, KOR_GRAMMAR_TWINS } from './tests/kor_m1_grammar.ts';
import { KOR_E4_READ, KOR_READ_TWINS } from './tests/kor_e4_read.ts';
import { KOR_M1_LIT, KOR_LIT_TWINS } from './tests/kor_m1_lit.ts';
import { KOR_M1_READ, KOR_READ_M1_TWINS } from './tests/kor_m1_read.ts';
import { GEO_SETS } from './tests/geo_sets.ts';
import { KOR_V5_SETS, KOR_V5_TWINS } from './tests/kor_m1_vocab5.ts';
import { attemptCoach, dailyCoach, PLAN, SQ_USER, sqSummary } from './coach.ts';
import { handleWork } from './work.ts';

const TESTS: Record<string, any> = Object.fromEntries([MATH_M1, MATH_E4, GEO_E, REC_1, REC_2, REC_3, REC_4, ...UNIT_SETS, ...E4_SETS, ...ENG_DIAG, ...ENG_GRAM_SETS, KOR_M1_DIAG, KOR_E4_DIAG, ...SCI_GAS_SETS, SCI_GAS_UNIT, ...SCI_FORCE_SETS, KOR_M1_GRAMMAR, KOR_E4_READ, KOR_M1_LIT, KOR_M1_READ, ...GEO_SETS, ...MATH_EQW_SETS, ...MATH_M2_SETS, ...ENG_VOC_SETS, ...ENG_SQ_SETS, ...KOR_V5_SETS].map((t) => [t.id, t]));
const SITE = 'https://study.blissme.ai/leveltest/';
const GRACE_MS = 2 * 60 * 1000; // 마감 후 네트워크 지연 허용

// ── 틀린 문제 다시 풀기 (완벽히 맞힐 때까지) ──
// 1) 틀린 문제마다 설명(정답·풀이·오답 습관)을 먼저 읽고
// 2) 유형마다 비슷한 문제(twins.ts)를 한 문제씩 바로 채점: 틀리면 그 자리에서 풀이를 보고 새 문제
// 3) 같은 유형을 STREAK번 연속 맞히면 통과, MAX_TRIES번 넘게 못 맞히면 멈추고 부모님께 알림
const RE = ':re';
const MAX_SRC = 6, STREAK = 2, MAX_TRIES = 6;
// 문제가 나오고 이 시간(초) 안에 고른 답은 '찍은 것'으로 보고 아이에게 경고 + 아빠에게 알림
const FAST_SEC = 5;
const FAST_WARN = false; // 찍기 경고 끔(아빠 결정 D11, 2026-10-25). 다시 켜려면 true
const baseOf = (id: string) => TESTS[String(id || '').replace(/:re$/, '')];
const retryTest = (base: any, questions: any[]) => ({ ...base, id: base.id + RE, title: base.title + ' · 틀린 문제 다시 풀기', minutes: 90, questions });
// 응시 행이 쓰는 시험: 다시 풀기는 행에 저장된 문제로
const testOf = (row: any) => { const base = baseOf(row.test_id); return row.questions ? retryTest(base, row.questions) : base; };
const srcId = (qid: string) => String(qid).split('~')[0];
const seed = () => crypto.getRandomValues(new Uint32Array(1))[0];
// 유형(원래 문항)별 상태: 문제 순서대로 맞힘/틀림을 보고 마지막 STREAK개가 연속 정답이면 통과
function masteryOf(questions: any[], answers: any) {
  const m: Record<string, any> = {};
  for (const q of questions) {
    const o = m[srcId(q.id)] ||= { tries: 0, streak: 0, mastered: false, stopped: false, pending: 0 };
    const a = answers?.[q.id];
    if (!a) { o.pending++; continue; }
    o.tries++;
    o.streak = !a.dk && Number(a.v) === q.answer ? o.streak + 1 : 0;
    if (o.streak >= STREAK) o.mastered = true;
  }
  for (const o of Object.values(m)) if (!o.mastered && o.tries >= MAX_TRIES) o.stopped = true;
  return m;
}
// 아이·부모님 화면용: 원래 문제지의 몇 번 유형인지
function masteryList(base: any, m: Record<string, any>) {
  return Object.entries(m).map(([id, o]) => {
    const i = base.questions.findIndex((q: any) => q.id === id), area = base.areas.find((a: any) => a.id === base.questions[i]?.area);
    return { src: id, no: i + 1, area: area ? area.name : '', tries: o.tries, streak: o.streak, need: STREAK, mastered: o.mastered, stopped: o.stopped };
  });
}
// 이 답안에서 아직 해결 못 한 유형: 원래 문제지는 틀린 문항, 다시 풀기는 통과 못 한 유형
function unresolvedOf(row: any): string[] {
  if (!row || !row.result) return [];
  if (row.result.mastery) return Object.entries(row.result.mastery).filter(([, o]: any) => !o.mastered).map(([id]) => id);
  return [...new Set((row.result.perQ || []).filter((p: any) => !p.correct).map((p: any) => srcId(p.id)))] as string[];
}
// 오늘(한국 시간) 끝낸 다시 풀기에서 MAX_TRIES 번 안에 통과 못 한 유형이 있으면 그날은 다시 풀기 잠금 (찍어서 넘기기 방지)
const kstDay = (iso: string) => new Date(new Date(iso).getTime() + 9 * 3600e3).toISOString().slice(0, 10);
async function retryLocked(sb: any, student: string, base: any) {
  const { data } = await sb.from('lt_attempts').select('started_at,result').eq('student', student).eq('test_id', base.id + RE)
    .neq('status', 'in_progress').order('started_at', { ascending: false }).limit(1);
  const last = data && data[0];
  if (!last || kstDay(last.started_at) !== kstDay(new Date().toISOString())) return false;
  return Object.values(last.result?.mastery || {}).some((o: any) => o.stopped);
}
const LOCK_MSG = '오늘은 여기까지! 아빠랑 같이 풀이를 본 다음, 내일 다시 도전해요.';
// 마지막으로 낸 답안(원래 문제지 또는 다시 풀기)에서 해결 못 한 유형과, 설명에 쓸 '마지막으로 틀린 문제'
async function wrongSources(sb: any, student: string, base: any) {
  const { data } = await sb.from('lt_attempts').select('result,status,questions').eq('student', student).in('test_id', [base.id, base.id + RE])
    .neq('status', 'in_progress').order('started_at', { ascending: false }).limit(1);
  const last = data && data[0]; if (!last) return [];
  const qs = last.questions || base.questions;
  return unresolvedOf(last).filter((id) => canTwin(id) && base.questions.some((q: any) => q.id === id)).slice(0, MAX_SRC).map((id) => {
    const src = base.questions.find((q: any) => q.id === id), area = base.areas.find((a: any) => a.id === src.area);
    const ps = (last.result.perQ || []).filter((p: any) => srcId(p.id) === id && !p.correct), p = ps[ps.length - 1];
    const q = (p && qs.find((x: any) => x.id === p.id)) || src;
    return { src, lesson: { src: id, no: base.questions.indexOf(src) + 1, area: area ? area.name : '', text: q.text, fig: q.fig, options: q.options, answer: q.answer,
      given: p ? p.given : null, dk: !!(p && p.dk), trap: p ? p.trap : null, explain: q.explain || '', tip: area && area.study ? area.study[1] || area.study[0] : '' } };
  });
}
// 다시 풀기 문제 만들기: 수학은 twins.ts 생성기, 국어·영어·과학은 과목 파일의 변형 문항(<과목>_VARIANTS[원래 문항 id])
const VARIANTS: Record<string, any[]> = { ...SCI_TWINS, ...SCI_FORCE_TWINS, ...SCI_GAS_UNIT_TWINS, ...ENG_VARIANTS, ...ENG_VOC_VARIANTS, ...ENG_SQ_VARIANTS, ...KOR_GRAMMAR_TWINS, ...KOR_READ_TWINS, ...KOR_LIT_TWINS, ...KOR_READ_M1_TWINS, ...KOR_V5_TWINS };
const canTwin = (id: string) => hasTwin(id) || !!VARIANTS[id]?.length;
function twinOf(src: any, sd: number, used: string[] = []) {
  if (hasTwin(src.id)) { const t = makeTwin(src, sd); if (t && t.fastSec == null && src.fastSec != null) t.fastSec = src.fastSec; return t; } // 찍기 경고 기준은 변형도 원래 문항을 따른다
  const vs = VARIANTS[src.id]; if (!vs?.length) return null;
  const n = used.filter((id) => srcId(id) === src.id).length, k = n % vs.length, v = vs[k];
  // 변형을 다 쓰고 다시 낼 때만 보기 순서를 섞는다(같은 문제를 같은 자리로 외워 고르지 않게). keepOrder 보기(1개~5개처럼 순서가 있는 것)는 그대로
  const idx = v.options.map((_: any, i: number) => i);
  if (n >= vs.length && !v.keepOrder) { const r = makeRng(sd); for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } }
  const pos = (a: number) => idx.indexOf(a - 1) + 1;
  return { id: `${src.id}~v${k}-${sd.toString(36)}`, src: src.id, area: src.area, type: 'choice', text: v.text, fig: v.fig, options: idx.map((i: number) => v.options[i]),
    answer: pos(v.answer), traps: (v.traps || []).map((t: any) => ({ ...t, a: pos(t.a) })), explain: v.explain || '', fastSec: v.fastSec ?? src.fastSec };
}
const publicQ = (q: any) => { const { answer: _a, traps: _t, explain: _e, ...rest } = q; return rest; };

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
// 찍기 경고: 횟수를 올리고 첫 번째, 그다음은 3번마다 텔레그램으로 알림
// q·v가 있으면 처음 고른 답이 맞았는지도 알림에 적는다(규칙으로 바로 풀 수 있는 문제를 빨리 맞힌 경우 구분용)
async function fastGuess(sb: any, row: any, test: any, sec: number, q?: any, v?: unknown) {
  const n = (row.fast_guesses || 0) + 1;
  await sb.from('lt_attempts').update({ fast_guesses: n }).eq('id', row.id).eq('status', 'in_progress');
  if (!row.no_notify && (n === 1 || n % 3 === 1)) {
    const pick = q && q.type === 'choice' && Number(v) > 0 ? `\n처음 고른 답 ${Number(v)}번 — ${Number(v) === q.answer ? '정답이었어요' : '틀린 답이었어요'}` : '';
    await tgSend(sb, `⚡ <b>${escH(row.student)}</b> · ${escH(test.title)}\n문제를 ${Math.max(0, Math.round(sec))}초 만에 찍어서 경고했어요 (이 문제지에서 ${n}번째)${pick}`);
  }
  return n;
}
const fastLimit = (q: any) => (!FAST_WARN ? 0 : q && Number(q.fastSec) > 0 ? Number(q.fastSec) : FAST_SEC);
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
  if (row.fast_guesses) L.push(`⚡ 너무 빨리 찍어서 경고 ${row.fast_guesses}번`);
  if (String(test.id).startsWith('eng-')) { const r = engReliability(res, row.fast_guesses || 0); L.push(`🔎 진단 신뢰도: ${escH(r.label)}${r.note ? ' — ' + escH(r.note) : ''}`); }
  for (const g of [...new Set(res.areas.map((a: any) => a.group))] as string[]) {
    const as = res.areas.filter((a: any) => a.group === g);
    if (!as.length) continue;
    L.push('');
    L.push(`<b>[${g}]</b>`);
    for (const a of as) L.push(`${LV[a.level]} ${escH(a.name)} ${a.correct}/${a.total}${a.slow ? ' 🐢' : ''}`);
  }
  if (res.mastery) {
    const ms = masteryList(baseOf(test.id), res.mastery);
    L.push('');
    L.push('<b>🔁 유형별 결과 (같은 유형 ' + STREAK + '번 연속 정답이면 통과)</b>');
    for (const x of ms) L.push(`${x.mastered ? '✅' : '⚠️'} 원래 ${x.no}번 유형 (${escH(x.area)}) — ${x.tries}문제 ${x.mastered ? '만에 통과' : '풀고도 미해결 → 같이 봐 주세요'}`);
  }
  if (!res.priority.length && !res.mastery) {
    L.push('');
    L.push('👏 모든 영역 통과!' + (test.passMsg ? ' ' + test.passMsg : ''));
  }
  if (res.habits.length) {
    L.push('');
    L.push('<b>🔍 오답 습관</b>');
    for (const h of res.habits.slice(0, 4)) L.push(`· ${escH(h.note)}${h.n > 1 ? ` (${h.n}번)` : ''}`);
  }
  // 부족한 점 · 조언 · 들을 강의 · 다음 할 일 · 카톡 문구
  L.push(attemptCoach(TESTS, baseOf(test.id), { ...row, result: res }));
  return L.join('\n');
}

// 마감 지났는데 제출 안 된 응시 → 마지막 저장 답안으로 채점(아이가 창을 닫아도 결과가 남도록)
async function finalizeExpired(sb: any) {
  const cutoff = new Date(Date.now() - GRACE_MS).toISOString();
  const { data: rows } = await sb.from('lt_attempts').select('*').eq('status', 'in_progress').lt('deadline_at', cutoff).limit(20);
  for (const row of rows || []) await finalize(sb, row, row.answers, row.qtimes, row.tab_leaves, 'expired');
}

async function finalize(sb: any, row: any, answers: any, qtimes: any, tabLeaves: number, status: 'submitted' | 'expired', auto = false) {
  const test = testOf(row);
  const res: any = grade(test, answers, qtimes);
  if (row.questions) res.mastery = masteryOf(row.questions, answers);
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
      const { data } = await sb.from('lt_attempts').select('test_id,status,score,total,started_at,submitted_at,result').eq('student', student).order('started_at', { ascending: false }).limit(300);
      const progress: Record<string, any> = {};
      for (const r of data || []) {
        const o = progress[r.test_id] ||= { count: 0, done: 0, best: null, total: r.total, inProgress: false, last: null };
        o.count++;
        if (!o.last) o.last = { status: r.status, score: r.score, total: r.total, startedAt: r.started_at, submittedAt: r.submitted_at };
        if (r.status === 'in_progress') o.inProgress = true;
        else { o.done++; o.total = r.total; if (o.best == null || r.score > o.best) o.best = r.score; }
      }
      // 복습 문제지마다 다시 풀기 상태: 마지막 답안(원래·다시 풀기 중 최근)의 틀린 문항 수, 다시 풀기 진행 중 여부, 다시 푼 횟수
      for (const id of Object.keys(progress)) {
        const base = baseOf(id); if (!base || !base.practice || id.endsWith(RE)) continue;
        const rows = (data || []).filter((r: any) => r.test_id === base.id || r.test_id === base.id + RE);
        const last = rows.find((r: any) => r.status !== 'in_progress');
        const wrong = last ? unresolvedOf(last).length : 0;
        const lastRe = rows.find((r: any) => r.test_id === base.id + RE && r.status !== 'in_progress');
        const locked = !!lastRe && kstDay(lastRe.started_at) === kstDay(new Date().toISOString()) && Object.values(lastRe.result?.mastery || {}).some((o: any) => o.stopped);
        progress[id].retry = { wrong, locked, inProgress: rows.some((r: any) => r.test_id === base.id + RE && r.status === 'in_progress'),
          rounds: rows.filter((r: any) => r.test_id === base.id + RE && r.status !== 'in_progress').length };
      }
      return json({ student, progress });
    }

    if (action === 'avatars') {
      const { data } = await sb.from('lt_avatars').select('student,image');
      return json({ avatars: Object.fromEntries((data || []).map((r: any) => [r.student, r.image])) });
    }

    if (action === 'retryInfo') {
      const base = baseOf(String(body.testId || ''));
      const student = String(body.student || '').replace(/\s+/g, ' ').trim().slice(0, 20);
      if (!base || !base.practice) return json({ error: '시험을 찾을 수 없어요' }, 404);
      if (!student) return json({ error: '이름이 필요해요' }, 400);
      await finalizeExpired(sb);
      const srcs = await wrongSources(sb, student, base);
      if (srcs.length && await retryLocked(sb, student, base)) return json({ count: srcs.length, locked: true, message: LOCK_MSG, lessons: [] });
      return json({ count: srcs.length, streak: STREAK, title: base.title, subtitle: base.subtitle, lessons: srcs.map((x: any) => x.lesson) });
    }

    // 다시 풀기: 한 문제 바로 채점 → 정답·풀이 공개, 그 유형이 아직 통과 전이면 비슷한 문제를 하나 더 만든다
    if (action === 'check') {
      const row = await loadKid(sb, body.attemptId, body.kidToken);
      if (!row || !row.questions) return json({ error: '응시 기록을 찾을 수 없어요' }, 404);
      if (row.status !== 'in_progress') return json({ error: '이미 끝난 다시 풀기예요' }, 409);
      const q = row.questions.find((x: any) => x.id === String(body.qid || ''));
      if (!q) return json({ error: '문제를 찾을 수 없어요' }, 404);
      if (!body.dk && !(row.answers || {})[q.id] && Number(body.sec) < fastLimit(q)) {
        const n = await fastGuess(sb, row, testOf(row), Number(body.sec) || 0, q, body.v);
        return json({ fast: true, fastCount: n });
      }
      const answers = { ...(row.answers || {}) }, qtimes = { ...(row.qtimes || {}) };
      if (!answers[q.id]) {
        const n = Number(body.v);
        if (body.dk) answers[q.id] = { dk: true };
        else if (Number.isInteger(n) && n >= 1 && n <= q.options.length) answers[q.id] = { v: n };
        else return json({ error: '답을 골라 주세요' }, 400);
        qtimes[q.id] = Math.min(Math.max(Math.round(Number(body.sec) || 0), 0), 3600);
      }
      let questions = row.questions;
      let m = masteryOf(questions, answers);
      const sid = srcId(q.id), o = m[sid];
      if (!o.mastered && !o.stopped && o.pending === 0) {
        const src = baseOf(row.test_id).questions.find((x: any) => x.id === sid);
        const t = src && twinOf(src, seed(), questions.map((x: any) => x.id));
        if (t) { questions = [...questions, t]; m = masteryOf(questions, answers); }
      }
      await sb.from('lt_attempts').update({ answers, qtimes, questions, saved_at: new Date().toISOString() }).eq('id', row.id).eq('status', 'in_progress');
      const a = answers[q.id], ok = !a.dk && Number(a.v) === q.answer;
      const trap = ok || a.dk ? null : ((q.traps || []).find((t: any) => t.a === Number(a.v)) || {}).note || null;
      const next = questions.find((x: any) => !answers[x.id]);
      return json({ correct: ok, given: a.dk ? null : a.v, dk: !!a.dk, answer: q.answer, explain: q.explain || '', trap, justMastered: m[sid].mastered && !o.mastered,
        mastery: masteryList(baseOf(row.test_id), m), next: next ? publicQ(next) : null, left: questions.filter((x: any) => !answers[x.id]).length });
    }

    // 문제지 응시 중 너무 빨리 찍음 → 횟수 기록, 아빠에게 알림
    if (action === 'fast') {
      const row = await loadKid(sb, body.attemptId, body.kidToken);
      if (!row) return json({ error: '응시 기록을 찾을 수 없어요' }, 404);
      if (row.status !== 'in_progress') return json({ ok: true });
      const test = testOf(row), q = test.questions.find((x: any) => x.id === String(body.qid || ''));
      if (q && Number(body.sec) >= fastLimit(q)) return json({ ok: true });
      const n = await fastGuess(sb, row, test, Number(body.sec) || 0, q, body.v);
      return json({ ok: true, fastCount: n });
    }

    if (action === 'start') {
      const tid = String(body.testId || ''), isRetry = tid.endsWith(RE);
      let test = isRetry ? baseOf(tid) : TESTS[tid];
      if (!test || (isRetry && !test.practice)) return json({ error: '시험을 찾을 수 없어요' }, 404);
      const student = String(body.student || '').replace(/\s+/g, ' ').trim().slice(0, 20);
      if (!student) return json({ error: '이름을 입력해 주세요' }, 400);
      await finalizeExpired(sb);
      let questions: any[] | null = null;
      if (isRetry) {
        const srcs = await wrongSources(sb, student, test);
        if (!srcs.length) return json({ error: '다시 풀 틀린 문제가 없어요 🎉' }, 400);
        if (await retryLocked(sb, student, test)) return json({ error: LOCK_MSG }, 400);
        questions = srcs.map((x: any) => twinOf(x.src, seed())).filter(Boolean);
        test = retryTest(test, questions);
      }
      const startedAt = new Date(now).toISOString();
      const deadlineAt = new Date(now + test.minutes * 60 * 1000).toISOString();
      const row = { test_id: test.id, questions, student, kid_token: randTok(), report_token: randTok(), started_at: startedAt, deadline_at: deadlineAt,
        user_agent: String(req.headers.get('user-agent') || '').slice(0, 300), no_notify: !!body.noNotify && student.startsWith('테스트') }; // 개발 확인용: 이름이 '테스트…'일 때만 알림 끄기 허용
      const { data, error } = await sb.from('lt_attempts').insert(row).select('id').single();
      if (error) throw error;
      if (!row.no_notify) await tgSend(sb, `▶️ <b>${escH(student)}</b> · ${escH(test.title)} 응시 시작 (${kst(startedAt)})\n${test.questions.length}문항 · 제한 ${test.minutes}분 → ${kst(deadlineAt)} 마감`);
      return json({ attemptId: data.id, kidToken: row.kid_token, startedAt, deadlineAt, serverNow: new Date().toISOString(), test: testMeta(test), questions: publicQuestions(test) });
    }

    if (action === 'resume' || action === 'save' || action === 'submit') {
      let row = await loadKid(sb, body.attemptId, body.kidToken);
      if (!row) return json({ error: '응시 기록을 찾을 수 없어요' }, 404);
      const test = testOf(row);
      const late = now > new Date(row.deadline_at).getTime() + GRACE_MS;
      if (row.status === 'in_progress' && action !== 'resume' && !late) {
        const answers = row.questions ? (row.answers || {}) : cleanAnswers(test, body.answers), qtimes = row.questions ? (row.qtimes || {}) : cleanTimes(test, body.qtimes);
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
          answers: row.answers, qtimes: row.qtimes, tabLeaves: row.tab_leaves, test: testMeta(test), questions: publicQuestions(test),
          mastery: row.questions ? masteryList(baseOf(row.test_id), masteryOf(row.questions, row.answers)) : undefined });
      }
      return json({ status: row.status, student: row.student, test: testMeta(test), result: kidResult(row.result, test),
        mastery: row.questions && row.result && row.result.mastery ? masteryList(baseOf(row.test_id), row.result.mastery) : undefined });
    }

    // 연습장 풀이 사진: 제출한 뒤에만. 저장·AI 확인·텔레그램은 work.ts
    if (action === 'work') {
      const row = await loadKid(sb, body.attemptId, body.kidToken);
      if (!row) return json({ error: '응시 기록을 찾을 수 없어요' }, 404);
      const r = await handleWork(sb, body, row, testOf(row), { getSecret, escH });
      return json(r.body, r.status);
    }

    if (action === 'report') {
      const r = String(body.r || '');
      if (!/^[0-9a-f]{36}$/.test(r)) return json({ error: '잘못된 링크예요' }, 400);
      await finalizeExpired(sb);
      const { data: row } = await sb.from('lt_attempts').select('*').eq('report_token', r).maybeSingle();
      if (!row) return json({ error: '기록을 찾을 수 없어요' }, 404);
      const test = testOf(row);
      const { data: hist } = await sb.from('lt_attempts').select('*').eq('test_id', row.test_id).eq('student', row.student).order('started_at', { ascending: false }).limit(20);
      return json({ attempt: { ...attemptSummary(row), deadlineAt: row.deadline_at, answers: row.answers, qtimes: row.qtimes }, result: row.result,
        test: { ...testMeta(test), questions: test.questions }, history: (hist || []).map(attemptSummary) });
    }

    // 매일 밤 아이별 하루 정리 (pg_cron 'lt-daily-coach' 가 부름). send:false 면 보내지 않고 글만 돌려준다
    if (action === 'daily') {
      const key = await getSecret(sb, 'LT_PARENT_KEY');
      if (!key || !safeEq(body.key, key)) return json({ error: '학부모 키가 맞지 않아요' }, 403);
      await finalizeExpired(sb);
      const { data } = await sb.from('lt_attempts').select('test_id,student,status,started_at,score,total,result,fast_guesses').in('student', Object.keys(PLAN))
        .neq('status', 'in_progress').order('started_at', { ascending: true }).limit(1000);
      // 영단어 앱 기록(같은 DB의 sq_*) — 실패해도 하루 정리는 보냄
      const sq: Record<string, any> = {};
      try {
        const nowIso = new Date().toISOString(), today = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
        const users = Object.values(SQ_USER);
        const [{ data: logs }, { data: pts }] = await Promise.all([
          sb.from('sq_progress_log').select('username,date,mastered,level,play_seconds').in('username', users).gte('date', new Date(Date.now() - 9 * 864e5).toISOString().slice(0, 10)),
          sb.from('sq_point_log').select('username,source,amount').in('username', users).gte('at', new Date(Date.parse(today + 'T00:00:00+09:00')).toISOString()).lte('at', nowIso),
        ]);
        for (const [student, u] of Object.entries(SQ_USER)) sq[student] = sqSummary((logs || []).filter((r: any) => r.username === u), (pts || []).filter((r: any) => r.username === u), today);
      } catch (e) { console.error('sq summary', e); }
      const messages = dailyCoach(TESTS, data || [], new Date().toISOString(), sq);
      if (body.send !== false) for (const m of messages) await tgSend(sb, m);
      return json({ ok: true, messages });
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
      return json({ tests: Object.values(TESTS).flatMap((t: any) => [{ id: t.id, title: t.title }, ...(t.practice ? [{ id: t.id + RE, title: t.title + ' · 틀린 문제 다시 풀기' }] : [])]), attempts: (data || []).map(attemptSummary) });
    }

    return json({ error: '알 수 없는 요청' }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: '서버 오류: ' + String((e as Error)?.message || e) }, 500);
  }
});
