// 피드백 — 부족한 점 · 조언 · 들을 EBS 강의 · 다음 할 일 · 아이에게 보낼 카톡 문구
// 1) 문제지를 낼 때마다 텔레그램 결과 알림 끝에 붙인다 (attemptCoach)
// 2) 매일 밤 아이별 하루 정리 (dailyCoach, lt-api 'daily' 액션 ← pg_cron)

// 아이별 진도 (hub.html STUDENTS 와 같은 순서)
// wait: 학교에서 아직 안 배운 단원 — 다음 문제지로 권하지 않는다
export const PLAN: Record<string, { emoji: string; sets: string[]; wait?: string[]; tests: string[] }> = {
  '이다연': { emoji: '🐰', sets: ['u-mix', 'u-div', 'g-area', 'g-circle', 'g-solid', 'm-eq-word', 'm2-basic', 'm2-cons', 'm2-poly', 'm2-circ', 'm2-solid', 'u-fdiv', 'u-ddiv', 'sci-n50', 'sci-n54', 'sci-gas-unit', 'sci-n37', 'sci-n38', 'sci-n39', 'sci-n40', 'sci-n41', 'kor-m1-grammar', 'kor-m1-lit', 'kor-m1-read', 'kor-m1-v5-1', 'kor-m1-v5-2', 'kor-m1-v5-3', 'kor-m1-v5-4', 'u-ratio', 'u-prop'], wait: ['u-ratio', 'u-prop'], tests: ['geo-e', 'math-m1', 'eng-m1-diag', 'kor-m1-diag', 'sci-gas-diag'] },
  '이다혜': { emoji: '🐻', sets: ['u-mix', 'u-div', 'u-red', 'u-red-cmp', 'u-addf', 'g-area', 'g-circle', 'g-solid', 'm-eq-word', 'm2-basic', 'm2-cons', 'm2-poly', 'm2-circ', 'm2-solid', 'u-fdiv', 'u-ddiv', 'sci-n50', 'sci-n54', 'sci-gas-unit', 'sci-n37', 'sci-n38', 'sci-n39', 'sci-n40', 'sci-n41', 'eng-m1-past', 'eng-m1-modal', 'eng-m1-inf', 'eng-m1-comp', 'kor-m1-grammar', 'kor-m1-lit', 'kor-m1-read', 'u-ratio', 'u-prop'], wait: ['u-ratio', 'u-prop'], tests: ['geo-e', 'math-m1', 'eng-m1-diag', 'kor-m1-diag', 'sci-gas-diag'] },
  '이다희': { emoji: '🐥', sets: ['h-frac', 'h-word', 'h-dec', 'h-tri', 'kor-e4-read', 'eng-e4-v1'], tests: ['math-e4', 'eng-e4-diag', 'kor-e4-diag'] },
};
// 이 레벨테스트의 부족한 영역은 이미 문제지로 만들어져 있다
const COVERED = ['math-m1', 'math-e4'];
// 하루 정리의 '내일 할 일' 최대 개수 (다시 풀기 2 + 과목별 새 문제지 + 진단)
const MAX_TODO = 5;
// 문제지를 풀기 전에 볼 EBS 강의 (hub.html LECTURES 와 같게)
export const LECTURES: Record<string, string> = {
  'u-mix': 'EBS 초등 「만점왕 수학 5-1」 → 「자연수의 혼합 계산」 01~03강',
  'u-div': 'EBS 초등 「만점왕 수학 5-1」 → 「약수와 배수」 개념 강의',
  'u-red': 'EBS 초등 「만점왕 수학 5-1」 → 「약분과 통분」 개념 강의',
  'u-addf': 'EBS 초등 「만점왕 수학 5-1」 → 「분수의 덧셈과 뺄셈」 개념 강의',
  'u-fdiv': 'EBS 초등 「만점왕 수학 6-1」·「6-2」 → 「분수의 나눗셈」 개념 강의',
  'u-ddiv': 'EBS 초등 「만점왕 수학 6-1」·「6-2」 → 「소수의 나눗셈」 개념 강의',
  'u-ratio': 'EBS 초등 「만점왕 수학 6-1」 → 「비와 비율」 개념 강의',
  'u-prop': 'EBS 초등 「만점왕 수학 6-2」 → 「비례식과 비례배분」 개념 강의',
  'h-frac': 'EBS 초등 「만점왕 수학 3-2」 → 「분수」 개념 강의',
  'h-dec': 'EBS 초등 「만점왕 수학 4-2」 → 「소수의 덧셈과 뺄셈」 개념 강의',
  'sci-n50': 'EBS 중학 「뉴런 과학1」 50강 (기체의 압력과 부피)',
  'sci-n54': 'EBS 중학 「뉴런 과학1」 54강 (기체의 온도와 부피)',
  'sci-gas-unit': 'EBS 중학 「뉴런 과학1」 58·59강 (기체의 성질 단원 정리)',
  'sci-n37': 'EBS 중학 「뉴런 과학1」 37강 (힘의 표현과 평형)',
  'sci-n38': 'EBS 중학 「뉴런 과학1」 38강 (중력)',
  'sci-n39': 'EBS 중학 「뉴런 과학1」 39강 (탄성력)',
  'sci-n40': 'EBS 중학 「뉴런 과학1」 40강 (마찰력)',
  'sci-n41': 'EBS 중학 「뉴런 과학1」 41강 (부력)',
  'eng-m1-modal': 'EBS 중학 프리미엄 중1 영어 문법 「조동사」·「미래 시제」 강의',
  'm2-solid': 'EBS 중학 「뉴런 수학1(하)」 → 「입체도형」(다면체, 회전체, 겉넓이와 부피) 강의',
  'm2-circ': 'EBS 중학 「뉴런 수학1(하)」 → 「원과 부채꼴」 강의',
  'm2-poly': 'EBS 중학 「뉴런 수학1(하)」 → 「다각형」(대각선, 내각과 외각) 강의',
  'm2-cons': 'EBS 중학 「뉴런 수학1(하)」 → 「작도와 합동」 강의',
  'm2-basic': 'EBS 중학 「뉴런 수학1(하)」 → 「기본 도형」(점·선·면·각, 위치 관계, 평행선) 강의',
  'm-eq-word': 'EBS 중학 「뉴런 수학1(상)」 → 「문자와 식」, 「일차방정식의 활용」 강의',
  'eng-e4-v1': 'EBS 초등 「초등 영어 4학년」 단어 복습 — 학교·가족',
  'g-solid': 'EBS 초등 「만점왕 수학 6-1」 「각기둥과 각뿔」·「직육면체의 부피와 겉넓이」, 6-2 「원기둥, 원뿔, 구」 개념 강의',
  'eng-m1-inf': 'EBS 중학 프리미엄 중1 영어 문법 「to부정사」·「동명사」 강의',
  'eng-m1-comp': 'EBS 중학 프리미엄 중1 영어 문법 「비교급·최상급」 강의',
  'eng-m1-past': 'EBS 중학 프리미엄 중1 영어 문법 「과거시제」 강의',
  'g-area': 'EBS 초등 「만점왕 수학 5-1」 → 「다각형의 둘레와 넓이」 개념 강의',
  'g-circle': 'EBS 초등 「만점왕 수학 6-2」 → 「원의 넓이」 개념 강의',
  'u-red-cmp': 'EBS 초등 「만점왕 수학 5-1」 → 「약분과 통분」 분수의 크기 비교 강의',
  'kor-m1-grammar': '강의 없이 — 품사는 「뜻·기능·형태」 세 기준으로 나눠 보기',
  'kor-m1-lit': '강의 없이 — 비유·상징·시점·갈등 개념을 예와 함께 정리하고 풀기',
  'kor-m1-read': '강의 없이 — 글을 읽고 문단마다 중심 문장에 밑줄 긋고 풀기',
  'kor-m1-v5-1': '강의 없이 — 10분 어휘·문법 세트',
  'kor-m1-v5-2': '강의 없이 — 10분 어휘·문법 세트',
  'kor-m1-v5-3': '강의 없이 — 10분 어휘·문법 세트',
  'kor-m1-v5-4': '강의 없이 — 10분 어휘·문법 세트',
  'kor-e4-read': '강의 없이 — 질문의 「아닌 것」「남은」「두 번째」에 동그라미 치고 풀기',
  'h-tri': 'EBS 초등 「만점왕 수학 4-2」 → 「삼각형」 개념 강의',
  'h-word': '강의 없이 — 구하는 것에 밑줄 긋고, 답을 고른 뒤 문제를 한 번 더 읽기',
};
// 오답 습관 → 다음에 할 행동
const ADVICE: [RegExp, string][] = [
  [/괄호/, '괄호 안을 제일 먼저 — 없는 괄호를 마음대로 씌우지 않기'],
  [/앞에서부터|먼저 계산|순서/, '식 위에 ①②③ 계산 순서 번호부터 매기고 풀기 (괄호 → ×÷ → +−)'],
  [/1과 자기 자신|1이나 자기 자신|짝으로/, '약수는 짝으로 쓰기: 12 = 1×12, 2×6, 3×4 (1과 자기 자신부터)'],
  [/최소공배수|최대공약수|공약수|공배수/, '"동시에 다시 만나는" = 최소공배수, "최대한 똑같이 나누는" = 최대공약수 — 문제에 표시하고 풀기'],
  [/약분/, '답을 쓰기 전에 끝까지 약분했는지 확인'],
  [/분모가 (클|작을)수록/, '피자를 그려서 비교: 똑같이 많이 나눌수록 한 조각은 작아요'],
  [/만큼만|× ?\d+ ?빠뜨/, '"24의 3/4" = 24를 4묶음으로 나눈 것 중 3묶음 — 마지막 곱하기까지'],
  [/남은|먹은|준 것|나머지/, '구하는 것(먹은? 남은? 준 것?)에 밑줄 긋고, 답을 고른 뒤 문제를 다시 읽기'],
  [/소수점|자리/, '소수 계산은 세로셈, 소수점끼리 줄 맞추기 (빈자리는 0)'],
  [/지름|반지름|원주율/, '지름·반지름부터 표시: 둘레 = 지름 × 3.14, 넓이 = 반지름 × 반지름 × 3.14'],
  [/꼭지각|밑각|각의|각도|°/, '모르는 각은 그림에 직접 표시하고, 삼각형 180° · 사각형 360° 식으로 쓰기'],
  [/2로 나누지|둘레의 반|÷ ?2/, '삼각형·사다리꼴·마름모 넓이와 대각선 개수는 마지막에 ÷ 2'],
  [/이항/, '이항하면 부호가 바뀜 — 옮긴 항에 동그라미 치고 부호부터 바꾸기'],
  [/대입/, '음수는 괄호에 넣어 대입: a × (−2)'],
  [/역수|뒤집/, '÷ 분수는 나누는 수만 뒤집어서 곱하기'],
  [/배|규칙/, '수 사이에 "+몇", "×몇"을 직접 적어 보고 규칙 확인'],
];
// 문제지 전에 할 것: 강의(📺) 또는 강의 없는 문제지의 약속(✏️)
const prep = (id: string) => (LECTURES[id] || '').startsWith('강의 없이') ? '✏️ ' + LECTURES[id].replace(/^강의 없이 — /, '') : '📺 ' + (LECTURES[id] || '강의');
const adviceOf = (note: string) => (ADVICE.find(([re]) => re.test(note)) || [, ''])[1] as string;

// 문제 표기($…$, [[1|5]] 분수)를 알림용 글자로
const plain = (s: unknown) => String(s ?? '').replace(/\[\[(\d+)\|(\d+)\]\]/g, '$1/$2').replace(/\$/g, '');
const esc = (s: unknown) => plain(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const srcId = (qid: string) => String(qid).split('~')[0];
const hasJong = (s: string) => { const c = s.charCodeAt(s.length - 1); return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 > 0; };
const firstName = (s: string) => (s.length === 3 ? s.slice(1) : s);
const callName = (s: string) => { const n = firstName(s); return n + (hasJong(n) ? '아' : '야'); };
const titleOf = (t: any) => t.title.replace(/ · 틀린 문제 다시 풀기$/, '');
const uniq = <T>(a: T[]) => [...new Set(a)];
// 같은 말로 시작하는 조언은 하나만
const addAdv = (out: string[], a: string) => { if (a && !out.some((x) => x.slice(0, 12) === a.slice(0, 12))) out.push(a); };

// 한 번의 응시(원래 문제지 또는 다시 풀기)에서 부족한 영역·습관·강의
function diagnose(base: any, row: any) {
  const r = row.result || {}, isRe = String(row.test_id).endsWith(':re');
  const perQ: any[] = r.perQ || [];
  const unresolved: string[] = r.mastery ? Object.entries(r.mastery).filter(([, o]: any) => !o.mastered).map(([id]) => id)
    : uniq(perQ.filter((p) => !p.correct).map((p) => srcId(p.id)));
  const areaIds = uniq(unresolved.map((id) => (base.questions.find((q: any) => q.id === id) || {}).area).filter(Boolean)) as string[];
  const weakAreas = isRe ? areaIds.map((id) => base.areas.find((a: any) => a.id === id)).filter(Boolean)
    : (r.priority || []).map((id: string) => base.areas.find((a: any) => a.id === id)).filter(Boolean);
  const areaStat = (a: any) => { const x = (r.areas || []).find((y: any) => y.id === a.id); return x && !isRe ? ` ${x.correct}/${x.total}` : ''; };
  const habits: Record<string, number> = {};
  for (const p of perQ) if (p.trap) habits[p.trap] = (habits[p.trap] || 0) + 1;
  const dk = perQ.filter((p) => p.dk).length;
  return { isRe, unresolved, weakAreas, areaStat, habits, dk, perQ };
}
// 강의: 복습 문제지는 그 문제지 강의, 진단 테스트는 부족한 영역 강의
function lecturesFor(base: any, weakAreas: any[]) {
  if (base.practice) return LECTURES[base.id] ? [LECTURES[base.id]] : weakAreas.slice(0, 2).map((a: any) => a.study[0]);
  return weakAreas.slice(0, 3).map((a: any) => `${a.name} — ${a.study[0]}`);
}
function advices(base: any, habits: Record<string, number>, weakAreas: any[], dk: number) {
  const out: string[] = [];
  for (const [note] of Object.entries(habits).sort((a, b) => b[1] - a[1])) addAdv(out, adviceOf(note));
  for (const a of weakAreas) addAdv(out, a.study[1]);
  if (dk >= 3) out.unshift(`「모르겠어요」 ${dk}문제 — 배우지 않았거나 잊은 단원이에요. 강의부터 보고 풀기`);
  return out.slice(0, 3);
}
const nextSet = (student: string, baseId: string) => { const p = PLAN[student]; if (!p) return null; const i = p.sets.indexOf(baseId); return i >= 0 ? p.sets.slice(i + 1).find((id) => !(p.wait || []).includes(id)) || null : null; };

// ── 1) 문제지 결과 알림에 붙는 피드백 ──
export function attemptCoach(TESTS: Record<string, any>, base: any, row: any): string {
  const d = diagnose(base, row), r = row.result || {};
  const L: string[] = ['', '<b>🩺 피드백</b>'];
  const weakTxt = d.isRe
    ? (d.unresolved.length ? d.unresolved.map((id) => `${base.questions.findIndex((q: any) => q.id === id) + 1}번 유형`).join(', ') + ' 아직 해결 못 함' : '')
    : d.weakAreas.map((a: any) => a.name + d.areaStat(a)).join(', ');
  const topHabit = Object.entries(d.habits).sort((a, b) => b[1] - a[1])[0];
  if (weakTxt) L.push(`❗ 부족한 점: ${esc(weakTxt)}${topHabit ? ` · 습관 "${esc(topHabit[0])}"${topHabit[1] > 1 ? ` ${topHabit[1]}번` : ''}` : ''}`);
  const adv = advices(base, d.habits, d.weakAreas, d.dk);
  if (adv.length) { L.push('💡 조언'); for (const a of adv) L.push(`· ${esc(a)}`); }
  const lec = d.unresolved.length ? lecturesFor(base, d.weakAreas) : [];
  if (lec.length) { L.push('📺 들을 강의'); for (const x of lec) L.push(`· ${esc(x)}`); }
  // 다음 할 일
  let next = '', kidNext = '';
  const nx = nextSet(row.student, base.id), nxT = nx && TESTS[nx];
  if (base.practice && d.unresolved.length) {
    next = d.isRe ? `⚠️ 남은 유형은 아빠와 같이 풀이를 보고 → 내일 「다시 풀기」 한 번 더` : `오늘 안에 「틀린 문제 다시 풀기」 (설명 읽기 → 같은 유형 2번 연속 맞히면 통과)`;
    kidNext = d.isRe ? '남은 유형은 아빠랑 같이 보고 내일 다시 도전하자' : (lec.length ? '📺 강의 다시 한 번 보고 → ' : '') + '「다시 풀기」로 설명 읽고 다 맞힐 때까지 풀자';
  } else if (base.practice) {
    next = nxT ? `다음 문제지 「${titleOf(nxT)}」 — 먼저 ${prep(nx!)}` : '이 단계 문제지 끝! 3일 뒤 틀렸던 문제지를 다시 풀어 확인';
    kidNext = nxT ? `다음은 「${titleOf(nxT)}」! ${prep(nx!).startsWith('📺') ? '📺 강의 먼저 보고 풀자' : prep(nx!)}` : '3일 뒤에 한 번 더 풀어서 확인하자';
  } else {
    next = d.weakAreas.length ? '부족한 영역 강의부터 → 보충 문제지는 아빠가 만들어 줄게요' : '진단 통과 👏';
    kidNext = d.weakAreas.length ? '강의부터 차근차근 보자' : '진단 통과 👏';
  }
  L.push(`👉 다음 할 일: ${esc(next)}`);
  // 카톡 문구
  const score = d.isRe ? (d.unresolved.length ? `${Object.values(r.mastery || {}).filter((o: any) => o.mastered).length}/${Object.keys(r.mastery || {}).length} 유형 통과` : '틀린 유형 모두 통과')
    : `${r.score}/${r.total}`;
  const kid = [`${callName(row.student)}, 「${titleOf(base)}」${d.isRe ? ' 다시 풀기' : ''} ${score} 수고했어! 👏`];
  if (topHabit && adviceOf(topHabit[0])) kid.push(`💡 ${adviceOf(topHabit[0])}`);
  else if (adv[0]) kid.push(`💡 ${adv[0]}`);
  kid.push(`👉 ${kidNext}`);
  L.push('💬 카톡 문구', `<code>${esc(kid.join('\n'))}</code>`);
  return L.join('\n');
}

// ── 2) 하루 정리 ──
const kstDay = (iso: string) => new Date(new Date(iso).getTime() + 9 * 3600e3).toISOString().slice(0, 10);
export function dailyCoach(TESTS: Record<string, any>, rows: any[], nowIso: string): string[] {
  const today = kstDay(nowIso), md = today.slice(5).replace('-', '/');
  const out: string[] = [];
  for (const [student, plan] of Object.entries(PLAN)) {
    const mine = rows.filter((x) => x.student === student && x.status !== 'in_progress' && x.result).sort((a, b) => a.started_at.localeCompare(b.started_at));
    const todays = mine.filter((x) => kstDay(x.started_at) === today);
    const L: string[] = [`🌙 <b>${md} ${plan.emoji} ${esc(student)} 하루 정리</b>`];
    // 오늘 한 것
    if (!todays.length) L.push('', '📝 오늘 푼 문제지 없음');
    else {
      L.push('', '<b>📝 오늘 한 것</b>');
      const bases = uniq(todays.map((x) => String(x.test_id).replace(/:re$/, '')));
      for (const b of bases) {
        const T = TESTS[b]; if (!T) continue;
        const orig = todays.filter((x) => x.test_id === b), re = todays.filter((x) => x.test_id === b + ':re');
        const parts = orig.map((x) => `${x.score}/${x.total}`);
        const dk = orig.reduce((s, x) => s + (x.result.perQ || []).filter((p: any) => p.dk).length, 0);
        if (re.length) {
          const last = re[re.length - 1], m = last.result.mastery;
          parts.push(`다시 풀기 ${re.length}번 → ` + (m ? `${Object.values(m).filter((o: any) => o.mastered).length}/${Object.keys(m).length} 유형 통과` : `${last.score}/${last.total}`));
        }
        L.push(`· ${esc(titleOf(T))} ${parts.join(' → ')}${dk ? ` (모르겠어요 ${dk})` : ''}`);
      }
    }
    const fast = todays.reduce((n, x) => n + (x.fast_guesses || 0), 0);
    if (fast) L.push(`⚡ 너무 빨리 찍어서 경고 ${fast}번 — 문제를 끝까지 읽고 연습장에 풀게 해 주세요`);
    // 아직 해결 못 한 문제지 (마지막 응시 기준)
    const open: { id: string; n: number }[] = [];
    for (const id of plan.sets) {
      const last = mine.filter((x) => x.test_id === id || x.test_id === id + ':re').pop(); if (!last) continue;
      const d = diagnose(TESTS[id], last); if (d.unresolved.length) open.push({ id, n: d.unresolved.length });
    }
    // 부족한 점·습관: 오늘 응시 + 아직 해결 못 한 문제지 + 가장 최근 진단 테스트
    const weak: string[] = [], habits: Record<string, number> = {}, lec: string[] = [], adv: string[] = [];
    let dkSum = 0;
    for (const x of todays) {
      const T = TESTS[String(x.test_id).replace(/:re$/, '')]; if (!T) continue;
      const d = diagnose(T, x);
      for (const [k, v] of Object.entries(d.habits)) habits[k] = (habits[k] || 0) + v;
      if (!d.isRe) dkSum += d.dk;
    }
    for (const o of open) { const T = TESTS[o.id], last = mine.filter((x) => x.test_id === o.id || x.test_id === o.id + ':re').pop(); const d = diagnose(T, last);
      for (const a of d.weakAreas) weak.push(`${a.name}`); lec.push(...lecturesFor(T, d.weakAreas)); }
    for (const tid of plan.tests) {
      const last = mine.filter((x) => x.test_id === tid).pop(); if (!last) continue;
      // 레벨테스트에서 나온 부족한 영역은 이미 문제지(sets)가 됐으니 푼 날만 보여 준다
      if (COVERED.includes(tid) && kstDay(last.started_at) !== today) continue;
      const T = TESTS[tid], d = diagnose(T, last);
      const focus = d.weakAreas.filter((a: any) => ((last.result.areas || []).find((y: any) => y.id === a.id) || {}).level === 'focus');
      if (kstDay(last.started_at) === today || focus.length) {
        for (const a of focus.slice(0, 3)) weak.push(`${a.name}${d.areaStat(a)}`);
        lec.push(...lecturesFor(T, focus).slice(0, kstDay(last.started_at) === today ? 3 : 1));
      }
    }
    const hs = Object.entries(habits).sort((a, b) => b[1] - a[1]);
    if (weak.length || hs.length) L.push('', `<b>❗ 부족한 점</b>`);
    if (weak.length) L.push('· ' + esc(uniq(weak).join(', ')));
    if (hs.length) L.push(...hs.slice(0, 3).map(([k, v]) => `· 습관: ${esc(k)}${v > 1 ? ` (${v}번)` : ''}`));
    for (const [k] of hs) addAdv(adv, adviceOf(k));
    if (dkSum >= 3) adv.unshift(`「모르겠어요」가 ${dkSum}문제 — 잊었거나 안 배운 단원이에요. 강의를 먼저 보고 풀기`);
    if (adv.length) L.push('', '<b>💡 조언</b>', ...adv.slice(0, 3).map((a) => '· ' + esc(a)));
    // 내일 할 일 (최대 3개)
    const todo: string[] = [], kidTodo: string[] = [];
    for (const o of open) {
      if (todo.length >= 2) break;
      todo.push(`「${titleOf(TESTS[o.id])}」 틀린 문제 다시 풀기 (남은 유형 ${o.n}개)`); kidTodo.push(`「${titleOf(TESTS[o.id])}」 다시 풀기`);
    }
    // 과목마다 아직 안 푼 다음 문제지 하나씩 (wait 은 빼고)
    const subj = (id: string) => (/^kor-/.test(id) ? '국어' : /^eng-/.test(id) ? '영어' : /^sci-/.test(id) ? '과학' : '수학');
    const seen = new Set<string>();
    for (const fresh of plan.sets.filter((id) => !(plan.wait || []).includes(id) && TESTS[id] && !mine.some((x) => x.test_id === id))) {
      if (todo.length >= MAX_TODO || seen.has(subj(fresh))) continue; seen.add(subj(fresh));
      const pre = prep(fresh), isLec = pre.startsWith('📺');
      todo.push(`${pre} → 「${titleOf(TESTS[fresh])}」 문제지`); kidTodo.push(isLec ? `📺 강의 보고 「${titleOf(TESTS[fresh])}」 풀기` : `「${titleOf(TESTS[fresh])}」 풀기 (${pre})`);
      if (isLec) lec.unshift(LECTURES[fresh]);
    }
    for (const untaken of plan.tests.filter((id) => id !== 'math-m1' && TESTS[id] && !mine.some((x) => x.test_id === id)).slice(0, 2)) {
      if (todo.length >= MAX_TODO) break;
      todo.push(`「${titleOf(TESTS[untaken])}」 (${TESTS[untaken].minutes}분)`); kidTodo.push(`「${titleOf(TESTS[untaken])}」`);
    }
    const lecs = uniq(lec).slice(0, 4);
    if (lecs.length) L.push('', '<b>📺 들을 강의</b>', ...lecs.map((x) => '· ' + esc(x)));
    if (todo.length) L.push('', '<b>✅ 내일 할 일</b>', ...todo.map((x, i) => `${i + 1}. ${esc(x)}`));
    // 카톡 문구
    const kid = [todays.length ? `${callName(student)}, 오늘도 수고했어! 👏` : `${callName(student)}, 오늘은 문제지를 안 풀었네!`];
    if (adv[0]) kid.push(`💡 ${adv[0]}`);
    if (kidTodo.length) kid.push('내일 할 일', ...kidTodo.map((x, i) => `${i + 1}. ${x}`));
    L.push('', '💬 카톡 문구', `<code>${esc(kid.join('\n'))}</code>`);
    out.push(L.join('\n'));
  }
  return out;
}
