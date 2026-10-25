// 틀린 문제 다시 풀기용 유사 문제 생성기 — 원래 문항(id)마다 같은 유형·같은 함정으로 숫자만 바꾼 문제를 만든다.
// 정답과 오답 보기는 모두 여기서 계산한다(사람이 계산한 값을 적어 두지 않음). 단원별 문제지(tests/rec_units.ts)의 80문항을 덮는다.
// 만든 문제는 응시 행(lt_attempts.questions)에 저장되므로 채점·리포트는 저장된 문제로 한다.

type Q = [number, number]; // 유리수 [분자, 분모], 분모 > 0
type Opt = { v?: Q; s?: string; note?: string };
type Rng = () => number;

// ── 수 ──
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;
const q = (n: number, d = 1): Q => { const g = gcd(n, d) || 1; return d < 0 ? [-n / g, -d / g] : [n / g, d / g]; };
const add = (a: Q, b: Q) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const sub = (a: Q, b: Q) => q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const mul = (a: Q, b: Q) => q(a[0] * b[0], a[1] * b[1]);
const div = (a: Q, b: Q) => q(a[0] * b[1], a[1] * b[0]);
const eq = (a: Q, b: Q) => a[0] * b[1] === b[0] * a[1];
const lt = (a: Q, b: Q) => a[0] * b[1] < b[0] * a[1];
const isInt = (a: Q) => q(a[0], a[1])[1] === 1;
const num = (a: Q) => a[0] / a[1];
const divisors = (n: number) => { const r: number[] = []; for (let i = 1; i <= n; i++) if (n % i === 0) r.push(i); return r; };

// ── 표기 ──
const fr = (n: number, d: number) => `[[${n}|${d}]]`; // 약분하지 않고 그대로
function mixed(a: Q) { const [n, d] = q(a[0], a[1]); if (d === 1) return String(n); if (n > d) return `${Math.floor(n / d)}${fr(n % d, d)}`; return fr(n, d); }
const M = (s: string) => `$${s}$`;
const mx = (a: Q) => M(mixed(a));
function dec(a: Q) { // 유한소수만 (분모가 2·5로만 된 수)
  let [n, d] = q(a[0], a[1]); let k = 0;
  while (d !== 1 && k < 8) { n *= 10; k++; const g = gcd(n, d); n /= g; d /= g; }
  if (d !== 1) return String(Math.round(num(a) * 1e6) / 1e6);
  const neg = n < 0, s = String(Math.abs(n)).padStart(k + 1, '0');
  return (neg ? '-' : '') + (k ? s.slice(0, s.length - k) + '.' + s.slice(s.length - k) : s);
}
// 조사: 숫자는 마지막으로 읽히는 소리(일 이 삼 … / 십 백 천), 한글은 받침
function josa(w: number | string, withB: string, without: string) {
  const s = String(w), ch = s.charCodeAt(s.length - 1), ro = withB === '으로';
  if (ch >= 0xac00 && ch <= 0xd7a3) { const f = (ch - 0xac00) % 28; return f && !(ro && f === 8) ? withB : without; } // ㄹ 받침 + 로
  const x = Number(s.replace(/[^0-9]/g, ''));
  if (!Number.isFinite(x) || x % 10 === 0) return withB; // 영·십·백·천 → 받침(ㅇ·ㅂ·ㄴ)
  const d = String(x % 10);
  if (ro) return '36'.includes(d) ? withB : without; // 삼 육 → 으로, 일 칠 팔(ㄹ)·이 사 오 구 → 로
  return '013678'.includes(d) ? withB : without; // 일 삼 육 칠 팔 → 받침, 이 사 오 구 → 없음
}
const J = (w: number | string, withB: string, without: string) => `${w}${josa(w, withB, without)}`;

// ── 무작위 ──
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const ri = (r: Rng, a: number, b: number) => a + Math.floor(r() * (b - a + 1));
const pick = <T>(r: Rng, arr: T[]): T => arr[Math.floor(r() * arr.length)];
function shuffle<T>(r: Rng, arr: T[]) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function coprimePair(r: Rng, lo: number, hi: number): [number, number] { for (;;) { const a = ri(r, lo, hi), b = ri(r, lo, hi); if (a !== b && gcd(a, b) === 1) return [a, b]; } }

// ── 보기 만들기 ──
type Spec = {
  text: string; correct: Opt; wrongs: Opt[]; explain: string;
  fmt?: (v: Q) => string; fill?: () => Q | Opt; count?: number;
  order?: 'asc' | 'shuffle' | 'fixed'; // asc: 값 순서(원래 문제지처럼), fixed: wrongs 순서 그대로 정답을 맨 앞에
  equivOk?: boolean; // 값이 같은 보기 허용(기약분수·가장 간단한 비 고르기)
  signed?: boolean; // 0·음수 보기 허용(중1 정수 답)
};
function build(r: Rng, sp: Spec) {
  const n = sp.count || 5;
  const fmt = sp.fmt || ((v: Q) => mx(v));
  const norm = (o: Opt): Opt => ({ ...o, s: o.s ?? fmt(o.v!) });
  const correct = norm(sp.correct);
  const ok = (o: Opt, have: Opt[]) => !(o.v && !sp.signed && (o.v[0] <= 0 || o.v[1] <= 0)) && o.s !== correct.s && !have.some((x) => x.s === o.s) &&
    (sp.equivOk || !o.v || !((correct.v && eq(o.v, correct.v)) || have.some((x) => x.v && eq(x.v, o.v!))));
  // 후보: 함정(오답 습관) 보기 먼저, 그다음 채우기
  const main: Opt[] = [], extra: Opt[] = [];
  for (const w of sp.wrongs) { const o = norm(w); if (ok(o, main)) main.push(o); }
  for (let t = 0; sp.fill && extra.length < 40 && t < 400; t++) { const f = sp.fill(); const o = norm(Array.isArray(f) ? { v: f } : f); if (ok(o, [...main, ...extra])) extra.push(o); }
  let opts: Opt[];
  if (sp.order === 'asc' && correct.v && [...main, ...extra].every((o) => o.v)) {
    // 값 순서로 놓되 정답 자리는 고르게: 정답 위치를 먼저 정하고 위·아래 보기를 고름
    const below = (o: Opt) => lt(o.v!, correct.v!);
    const pool = [...main, ...shuffle(r, extra)], lo = pool.filter(below), hi = pool.filter((o) => !below(o));
    // 함정 보기(main)를 가장 많이 넣을 수 있는 자리 중에서 무작위
    const mLo = lo.filter((o) => main.includes(o)).length, mHi = hi.filter((o) => main.includes(o)).length;
    const feas = Array.from({ length: n }, (_, i) => i).filter((k) => lo.length >= k && hi.length >= n - 1 - k);
    if (!feas.length) throw new Error('보기 부족: ' + sp.text);
    const kept = (k: number) => Math.min(mLo, k) + Math.min(mHi, n - 1 - k), best = Math.max(...feas.map(kept));
    const pos = pick(r, feas.filter((k) => kept(k) >= Math.max(1, best - 1))) ?? pick(r, feas); // 함정 하나쯤은 빠져도 정답 자리를 고르게
    const take = (arr: Opt[], k: number) => { const pri = arr.filter((o) => main.includes(o)), rest = arr.filter((o) => !main.includes(o)); return [...shuffle(r, pri), ...rest].slice(0, k); };
    opts = [...take(lo, pos), correct, ...take(hi, n - 1 - pos)].sort((a, b) => num(a.v!) - num(b.v!));
  } else {
    const out = [...main, ...shuffle(r, extra)].slice(0, n - 1);
    if (out.length < n - 1) throw new Error('보기 부족: ' + sp.text);
    opts = sp.order === 'fixed' ? [correct, ...out] : shuffle(r, [correct, ...out]);
  }
  const answer = opts.indexOf(correct) + 1;
  const traps = opts.map((o, i) => (o.note ? { a: i + 1, note: o.note } : null)).filter(Boolean);
  return { text: sp.text, options: opts.map((o) => o.s!), answer, traps, explain: sp.explain, _vals: opts.map((o) => o.v || null) };
}
// 정수 근처 값 채우기
const nearInt = (r: Rng, c: number, span = 6) => () => q(Math.max(1, c + (r() < 0.5 ? -1 : 1) * ri(r, 1, span)));
const nearFrac = (r: Rng, c: Q) => () => { const [n, d] = c; return r() < 0.6 ? q(Math.max(1, n + (r() < 0.5 ? -1 : 1) * ri(r, 1, 3)), d) : [n, d + ri(r, 1, 3)] as Q; };
const nearDec = (r: Rng, c: Q, scale: number) => () => add(c, q((r() < 0.5 ? -1 : 1) * ri(r, 1, 9), scale));
const unit = (u: string) => (v: Q) => mixed(v).includes('[[') ? M(mixed(v)) + ' ' + u : mixed(v) + u;
const decU = (u: string) => (v: Q) => dec(v) + u;
const intF = (v: Q) => mixed(v);

// ── 생성기 ──
type Gen = (r: Rng) => ReturnType<typeof build> & { fig?: any };
const G: Record<string, Gen> = {};
const L2R = '앞에서부터 차례로 계산함 (×÷ 먼저 계산하는 순서 무시)';

// 자연수의 혼합 계산
G['r1-1'] = (r) => { // a + b ÷ c × d
  const a = ri(r, 10, 40), c = ri(r, 2, 6), qq = ri(r, 2, 9), b = c * qq, d = ri(r, 2, 5);
  const ans = a + qq * d; const w: Opt[] = [];
  if ((a + b) % c === 0) w.push({ v: q(((a + b) / c) * d), note: L2R });
  if (b % (c * d) === 0) w.push({ v: q(a + b / (c * d)), note: '×를 ÷보다 먼저 계산함 (×÷는 앞에서부터)' });
  w.push({ v: q(a + qq + d) });
  return build(r, { text: `다음을 계산한 값은?\n$${a} + ${b} ÷ ${c} × ${d}$`, correct: { v: q(ans) }, wrongs: w, fill: nearInt(r, ans, 8), fmt: intF, order: 'asc',
    explain: `×÷를 먼저, 앞에서부터: ${b} ÷ ${c} = ${qq}, ${qq} × ${d} = ${qq * d} → ${a} + ${qq * d} = ${ans}` });
};
G['r1-2'] = (r) => { // A − (b + c) × d
  const b = ri(r, 2, 9), c = ri(r, 2, 9), d = ri(r, 2, 4), s = b + c, A = s * d + ri(r, 2, 20), ans = A - s * d;
  return build(r, { text: `다음을 계산한 값은?\n$${A} − (${b} + ${c}) × ${d}$`, correct: { v: q(ans) },
    wrongs: [{ v: q((A - s) * d), note: '× 보다 − 를 먼저 계산함' }, { v: q(A - b + c * d), note: '괄호를 먼저 계산하지 않음' }, { v: q(A - s), note: `× ${J(d, '을', '를')} 빠뜨림` }],
    fill: nearInt(r, ans, 8), fmt: intF, order: 'asc', explain: `괄호 먼저: ${b} + ${c} = ${s} → × 먼저: ${s} × ${d} = ${s * d} → ${A} − ${s * d} = ${ans}` });
};
G['r1-3'] = (r) => { // a × b − C ÷ (d + e)
  const d = ri(r, 1, 5), e = ri(r, 1, 5), s = d + e, qq = ri(r, 2, 9), C = s * qq; let a = ri(r, 3, 9), b = ri(r, 3, 9);
  while (a * b <= qq + 1) { a = ri(r, 3, 9); b = ri(r, 3, 9); }
  const ans = a * b - qq; const w: Opt[] = [];
  if ((a * b - C) > 0 && (a * b - C) % d === 0) w.push({ v: q((a * b - C) / d + e), note: L2R });
  if (C % d === 0 && a * b - C / d + e > 0) w.push({ v: q(a * b - C / d + e), note: '괄호를 먼저 계산하지 않음' });
  w.push({ v: q(a * b) });
  return build(r, { text: `다음을 계산한 값은?\n$${a} × ${b} − ${C} ÷ (${d} + ${e})$`, correct: { v: q(ans) }, wrongs: w, fill: nearInt(r, ans, 8), fmt: intF, order: 'asc',
    explain: `괄호: ${d} + ${e} = ${s} → ×÷: ${a} × ${b} = ${a * b}, ${C} ÷ ${s} = ${qq} → ${a * b} − ${qq} = ${ans}` });
};
G['r1-4'] = (r) => { // P ÷ c + d × (e − f)
  const c = ri(r, 2, 9), qq = ri(r, 2, 9), P = c * qq, d = ri(r, 2, 5), f = ri(r, 1, 6), e = f + ri(r, 2, 7), m = e - f, ans = qq + d * m;
  return build(r, { text: `다음을 계산한 값은?\n$${P} ÷ ${c} + ${d} × (${e} − ${f})$`, correct: { v: q(ans) },
    wrongs: [{ v: q((qq + d) * e - f), note: L2R }, { v: q(qq + d * e - f), note: '괄호를 먼저 계산하지 않음' }, { v: q((qq + d) * m), note: '+ 를 × 보다 먼저 계산함' }],
    fill: nearInt(r, ans, 8), fmt: intF, order: 'asc', explain: `괄호: ${e} − ${f} = ${m} → ×÷: ${P} ÷ ${c} = ${qq}, ${d} × ${m} = ${d * m} → ${qq} + ${d * m} = ${ans}` });
};
G['um-8'] = (r) => { // (A − B) ÷ c + d × e
  const c = ri(r, 2, 6), qq = ri(r, 2, 9), B = ri(r, 5, 30), A = B + c * qq, d = ri(r, 2, 6), e = ri(r, 2, 5), ans = qq + d * e;
  return build(r, { text: `다음을 계산한 값은?\n$(${A} − ${B}) ÷ ${c} + ${d} × ${e}$`, correct: { v: q(ans) },
    wrongs: [{ v: q((qq + d) * e), note: L2R }, { v: q(A - B / c + d * e) }, { v: q(qq + d + e) }], fill: nearInt(r, ans, 8), fmt: intF, order: 'asc',
    explain: `괄호: ${A} − ${B} = ${A - B} → ×÷: ${A - B} ÷ ${c} = ${qq}, ${d} × ${e} = ${d * e} → ${qq} + ${d * e} = ${ans}` });
};
G['um-9'] = (r) => { // A − d × (e − f) ÷ g
  let d = 0, m = 0, g = 0;
  for (;;) { d = ri(r, 2, 9); m = ri(r, 2, 12); const ds = divisors(d * m).filter((x) => x > 1 && x <= 9 && x !== d * m); if (ds.length) { g = pick(r, ds); break; } }
  const f = ri(r, 1, 9), e = f + m, k = (d * m) / g, A = k + ri(r, 20, 90), ans = A - k;
  const w: Opt[] = [{ v: q(k), note: `마지막에 ${A}에서 빼는 것을 빠뜨림` }];
  if (((A - d) * m) % g === 0) w.push({ v: q(((A - d) * m) / g), note: '× 보다 − 를 먼저 계산함' });
  return build(r, { text: `다음을 계산한 값은?\n$${A} − ${d} × (${e} − ${f}) ÷ ${g}$`, correct: { v: q(ans) }, wrongs: w, fill: nearInt(r, ans, 8), fmt: intF, order: 'asc',
    explain: `괄호: ${e} − ${f} = ${m} → ×÷ 앞에서부터: ${d} × ${m} = ${d * m}, ${d * m} ÷ ${g} = ${k} → ${A} − ${k} = ${ans}` });
};
G['r1-5'] = (r) => { // 거스름돈
  const [i1, u1, i2, u2] = pick(r, [['공책', '권', '연필', '자루'], ['과자', '봉지', '음료수', '병'], ['지우개', '개', '볼펜', '자루'], ['빵', '개', '우유', '개']]);
  const p1 = ri(r, 3, 9) * 100, n1 = ri(r, 2, 4), p2 = ri(r, 2, 8) * 100, n2 = ri(r, 2, 5), tot = p1 * n1 + p2 * n2;
  const paid = (Math.floor(tot / 1000) + ri(r, 1, 2)) * 1000, ans = paid - tot;
  return build(r, { text: `한 ${u1}에 ${p1}원인 ${i1} ${n1}${J(u1, '과', '와')} 한 ${u2}에 ${p2}원인 ${i2} ${n2}${J(u2, '을', '를')} 사고 ${paid}원을 냈습니다. 거스름돈은 얼마인가요?`,
    correct: { v: q(ans) }, wrongs: [{ v: q(tot), note: '구하는 것(거스름돈) 대신 쓴 돈을 답함' }, { v: q(paid - p1 * n1), note: `${i2}값을 빠뜨림` }, { v: q(paid - p1 - p2) }],
    fill: () => q(Math.max(100, ans + (r() < 0.5 ? -1 : 1) * ri(r, 1, 6) * 100)), fmt: unit('원'), order: 'asc',
    explain: `하나의 식: ${paid} − (${p1} × ${n1} + ${p2} × ${n2}) = ${paid} − ${tot} = ${ans}원` });
};
G['r1-6'] = (r) => { // 어떤 수 × a − b = c
  const x = ri(r, 3, 15), a = ri(r, 2, 6), b = ri(r, 2, 12), c = x * a - b; const w: Opt[] = [{ v: q(c + b), note: `거꾸로 계산할 때 ${J(a, '으로', '로')} 나누지 않음` }];
  if ((c - b) > 0 && (c - b) % a === 0) w.push({ v: q((c - b) / a), note: `거꾸로 계산할 때 −${J(b, '을', '를')} +${J(b, '으로', '로')} 바꾸지 않음` });
  w.push({ v: q(c * a + b) });
  return build(r, { text: `어떤 수에 ${a}${josa(a, '을', '를')} 곱하고 ${b}${josa(b, '을', '를')} 뺐더니 ${c}${josa(c, '이', '가')} 되었습니다. 어떤 수는?`, correct: { v: q(x) }, wrongs: w,
    fill: nearInt(r, x, 6), fmt: intF, order: 'asc', explain: `거꾸로: ${c}에 ${J(b, '을', '를')} 더하고(${c + b}) ${J(a, '으로', '로')} 나누기 → ${c + b} ÷ ${a} = ${x}. 확인: ${x} × ${a} − ${b} = ${c}` });
};
G['r1-7'] = (r) => { // 하나의 식 고르기
  const it = pick(r, ['사과', '사탕', '연필', '구슬']), k = ri(r, 3, 8), qq = ri(r, 4, 9), N = k * qq, e = ri(r, 2, 5);
  return build(r, { text: `${it} ${N}개를 ${k}명에게 똑같이 나누어 주고, 한 명에게 ${e}개씩 더 주었습니다. 한 명이 받은 ${it} 수를 하나의 식으로 바르게 나타낸 것은?`,
    correct: { s: M(`${N} ÷ ${k} + ${e}`) },
    wrongs: [{ s: M(`${N} ÷ (${k} + ${e})`), note: '괄호를 잘못 씌움 — 괄호가 계산 순서를 바꿈' }, { s: M(`${N} − ${k} + ${e}`) },
      { s: M(`(${N} + ${e}) ÷ ${k}`), note: '괄호를 잘못 씌움 — 괄호가 계산 순서를 바꿈' }, { s: M(`${N} × ${k} + ${e}`) }],
    explain: `먼저 나누고(${N} ÷ ${k} = ${qq}) 그다음 ${J(e, '을', '를')} 더함 → ${N} ÷ ${k} + ${e} = ${qq + e}개. ÷가 + 보다 먼저라 괄호가 필요 없어요` });
};
G['um-10'] = (r) => { // a개씩 b상자를 c명이
  let a = 0, b = 0, c = 0; for (;;) { a = ri(r, 6, 15); b = ri(r, 3, 8); c = pick(r, [2, 3, 4, 5, 6]); if ((a * b) % c === 0 && a * b / c !== a) break; }
  const it = pick(r, ['귤', '사과', '초콜릿', '쿠키']), ans = (a * b) / c; const w: Opt[] = [{ v: q(a * b), note: '구하는 것(한 명 몫) 대신 전체 수를 답함' }];
  if (a % c === 0) w.push({ v: q(a / c), note: '상자 수(× ' + b + ')를 빠뜨림' });
  w.push({ v: q(a + b - c) });
  return build(r, { text: `한 상자에 ${a}개씩 든 ${it} ${b}상자를 ${c}명이 똑같이 나누어 가졌습니다. 한 명이 가진 ${J(it, '은', '는')} 몇 개인가요?`,
    correct: { v: q(ans) }, wrongs: w, fill: nearInt(r, ans, 5), fmt: unit('개'), order: 'asc', explain: `하나의 식: ${a} × ${b} ÷ ${c} = ${a * b} ÷ ${c} = ${ans}개` });
};

// 약수와 배수
const DIVN = [12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 44, 45, 48, 50, 54, 60, 63, 64, 72, 80, 81, 90, 100];
G['r1-8'] = (r) => {
  const N = pick(r, DIVN), ds = divisors(N), c = ds.length, sq = Number.isInteger(Math.sqrt(N));
  return build(r, { text: `${N}의 약수는 모두 몇 개인가요?`, correct: { v: q(c) },
    wrongs: [{ v: q(c - 1), note: sq ? `짝으로 찾을 때 ${Math.sqrt(N)} × ${Math.sqrt(N)}의 ${J(Math.sqrt(N), '을', '를')} 빠뜨림` : '1이나 자기 자신을 빠뜨림' }, { v: q(c - 2), note: '1과 자기 자신을 빠뜨림' }, { v: q(c + 1) }],
    fill: nearInt(r, c, 3), fmt: unit('개'), order: 'asc', explain: `곱해서 ${J(N, '이', '가')} 되는 짝을 찾으면: ${ds.join(', ')} → ${c}개` });
};
G['r1-9'] = (r) => {
  const [a, b] = pick(r, [[4, 6], [6, 8], [4, 10], [6, 9], [3, 4], [6, 10], [4, 6], [8, 12]]), L = lcm(a, b), ans = L * ri(r, 1, Math.max(1, Math.floor(100 / L)));
  const onlyA = () => { for (;;) { const x = a * ri(r, 2, Math.floor(100 / a)); if (x % b) return x; } }, onlyB = () => { for (;;) { const x = b * ri(r, 2, Math.floor(100 / b)); if (x % a) return x; } };
  return build(r, { text: `다음 중 ${a}의 배수이면서 ${b}의 배수인 수는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(onlyA()), note: `한쪽 수(${a})의 배수인지만 확인함` }, { v: q(onlyB()), note: `한쪽 수(${b})의 배수인지만 확인함` }, { v: q(onlyB()), note: `한쪽 수(${b})의 배수인지만 확인함` }, { v: q(onlyA()), note: `한쪽 수(${a})의 배수인지만 확인함` }],
    fill: () => { for (;;) { const x = ri(r, 10, 100); if (x % L) return q(x); } }, fmt: intF, order: 'asc', explain: `${J(a, '과', '와')} ${b}의 공배수 = 최소공배수 ${L}의 배수(${L}, ${2 * L}, ${3 * L}, …) → ${ans}` });
};
function gcdPair(r: Rng) { const g = pick(r, [4, 6, 8, 9, 12, 14, 15, 16, 18]); const [m, n] = coprimePair(r, 2, 5); return { g, A: g * Math.min(m, n), B: g * Math.max(m, n) }; }
G['r1-10'] = (r) => {
  const { g, A, B } = gcdPair(r), L = lcm(A, B), small = divisors(g).filter((x) => x > 1 && x < g);
  return build(r, { text: `${A}${josa(A, '과', '와')} ${B}의 최대공약수는?`, correct: { v: q(g) },
    wrongs: [{ v: q(L), note: '최대공약수와 최소공배수를 혼동함' }, ...shuffle(r, small).slice(0, 3).map((x) => ({ v: q(x), note: '공약수를 끝까지 찾지 않음' }))],
    fill: nearInt(r, g, 6), fmt: intF, order: 'asc', explain: `${A} = ${g} × ${A / g}, ${B} = ${g} × ${B / g} → 공통으로 들어 있는 가장 큰 수 ${g}` });
};
G['r1-11'] = (r) => {
  const [a, b] = pick(r, [[4, 6], [6, 8], [8, 12], [6, 9], [10, 15], [12, 18], [6, 10], [9, 12], [4, 10], [12, 16]]), L = lcm(a, b), g = gcd(a, b);
  return build(r, { text: `${a}${josa(a, '과', '와')} ${b}의 최소공배수는?`, correct: { v: q(L) },
    wrongs: [{ v: q(g), note: '최소공배수와 최대공약수를 혼동함' }, { v: q(a * b), note: '두 수를 그냥 곱함' }, { v: q(2 * L), note: '공배수이지만 가장 작은 공배수가 아님' }],
    fill: nearInt(r, L, 10), fmt: intF, order: 'asc', explain: `${a}의 배수와 ${b}의 배수를 차례로 쓰면 처음 같은 수 ${L}` });
};
const shareGcd = (r: Rng) => {
  const { g, A, B } = gcdPair(r), [x, y] = pick(r, [['사탕', '초콜릿'], ['공책', '연필'], ['귤', '사과'], ['쿠키', '사탕']]);
  const ux = x === '공책' ? '권' : '개', uy = y === '연필' ? '자루' : '개', small = divisors(g).filter((v) => v > 1 && v < g);
  return build(r, { text: `${x} ${A}${J(ux, '과', '와')} ${y} ${B}${J(uy, '을', '를')} 최대한 많은 친구에게 남김없이 똑같이 나누어 주려고 합니다. 몇 명에게 나누어 줄 수 있나요?`,
    correct: { v: q(g) }, wrongs: [{ v: q(lcm(A, B)), note: '최대공약수 문제에 최소공배수를 구함' }, { v: q(A + B), note: '두 수를 더함' }, ...small.slice(0, 2).map((v) => ({ v: q(v), note: '공약수이지만 가장 큰 공약수가 아님' }))],
    fill: nearInt(r, g, 6), fmt: unit('명'), order: 'asc', explain: `"최대한 많이 똑같이 나누기" = 최대공약수. ${J(A, '과', '와')} ${B}의 최대공약수 ${g} → ${g}명` });
};
G['r1-12'] = shareGcd; G['ud-10'] = shareGcd;
G['r1-13'] = (r) => {
  const [a, b] = pick(r, [[6, 8], [4, 6], [6, 9], [8, 12], [10, 15], [6, 10], [9, 12], [4, 10]]), L = lcm(a, b);
  return build(r, { text: `가로 ${a} cm, 세로 ${b} cm인 직사각형 종이를 같은 방향으로 빈틈없이 늘어놓아 가장 작은 정사각형을 만들려고 합니다. 정사각형의 한 변은 몇 cm인가요?`,
    correct: { v: q(L) }, wrongs: [{ v: q(gcd(a, b)), note: '최소공배수 문제에 최대공약수를 구함' }, { v: q(a * b), note: '두 수를 그냥 곱함' }, { v: q(a + b), note: '두 수를 더함' }],
    fill: nearInt(r, L, 10), fmt: unit(' cm'), order: 'asc', explain: `한 변은 ${a}의 배수이면서 ${b}의 배수 → 가장 작은 것 = 최소공배수 ${L} cm` });
};
G['r1-14'] = (r) => {
  const G0 = pick(r, [6, 8, 10, 12, 15, 16, 18, 20]), ds = divisors(G0), not = ri(r, 2, G0 - 1);
  const extra = (() => { for (;;) { const x = ri(r, 2, G0 - 1); if (G0 % x) return x; } })(); void not;
  const list = (a: number[]) => a.sort((x, y) => x - y).join(', ');
  return build(r, { text: `어떤 두 수의 최대공약수가 ${G0}일 때, 두 수의 공약수를 모두 나타낸 것은?`, correct: { s: list(ds.slice()) },
    wrongs: [{ s: list(ds.filter((x) => x !== 1)), note: '1도 공약수라는 것을 빠뜨림' }, { s: list([G0, 2 * G0, 3 * G0]), note: '공약수와 공배수를 혼동함' }, { s: list([1, G0]) }, { s: list([...ds, extra]) }],
    explain: `공약수는 최대공약수의 약수 → ${G0}의 약수 ${list(ds.slice())}` });
};
G['r1-15'] = (r) => {
  const [a, b] = pick(r, [[4, 6], [6, 8], [6, 9], [8, 12], [10, 15], [4, 10], [6, 10], [9, 12]]), L = lcm(a, b), [p1, p2] = shuffle(r, ['지수', '민호', '서연', '도윤', '하은']).slice(0, 2);
  return build(r, { text: `${J(p1, '은', '는')} ${a}일마다, ${J(p2, '은', '는')} ${b}일마다 도서관에 갑니다. 오늘 두 사람이 함께 갔다면, 다음에 처음으로 함께 가는 날은 며칠 후인가요?`,
    correct: { v: q(L) }, wrongs: [{ v: q(gcd(a, b)), note: '최소공배수 문제에 최대공약수를 구함' }, { v: q(a + b), note: '두 수를 더함' }, { v: q(a * b), note: '두 수를 그냥 곱함' }],
    fill: nearInt(r, L, 10), fmt: unit('일 후'), order: 'asc', explain: `"다시 함께 만나는 날" = 최소공배수. ${J(a, '과', '와')} ${b}의 최소공배수 ${L} → ${L}일 후` });
};
G['ud-9'] = (r) => {
  const N = pick(r, [12, 18, 20, 24, 28, 30, 36, 40, 42, 48]), ds = divisors(N).filter((x) => x > 1 && x < N), non = (() => { for (;;) { const x = ri(r, 2, Math.min(N - 1, 16)); if (N % x) return x; } })();
  return build(r, { text: `다음 중 ${N}의 약수가 <b>아닌</b> 것은?`, correct: { v: q(non) }, wrongs: shuffle(r, ds).slice(0, 4).map((x) => ({ v: q(x) })), fmt: intF, order: 'asc',
    explain: `${N}의 약수: ${divisors(N).join(', ')}. ${J(non, '은', '는')} ${J(N, '을', '를')} 나누어떨어지게 하지 못해요` });
};

// 약분과 통분 (분수 기초 포함)
G['r2-1'] = (r) => {
  const d = ri(r, 3, 9), w = ri(r, 1, 4), rr = ri(r, 1, d - 1), n = d * w + rr, c: Q = [n, d];
  const m = (W: number, R: number) => ({ s: M(`${W}${fr(R, d)}`), v: q(W * d + R, d) });
  return build(r, { text: `${M(fr(n, d))} ${josa(n, '을', '를')} 대분수로 나타낸 것은?`, correct: { s: M(`${w}${fr(rr, d)}`), v: c },
    wrongs: [m(w - 1 || w + 2, rr), m(w + 1, rr), m(w, d - rr === rr ? (rr % (d - 1)) + 1 : d - rr), m(rr === w ? w + 1 : rr, w < d && w !== rr ? w : rr)].filter((o) => o.v[0] > 0),
    fill: () => { const W = ri(r, 1, 5), R = ri(r, 1, d - 1); return m(W, R); }, order: 'asc', explain: `${n} ÷ ${d} = ${w} … ${rr} → ${M(`${w}${fr(rr, d)}`)}` });
};
G['r2-2'] = (r) => {
  const d = ri(r, 3, 9), w = ri(r, 2, 5), rr = ri(r, 1, d - 1), n = w * d + rr;
  const o = (N: number) => ({ s: M(fr(N, d)), v: q(N, d) });
  return build(r, { text: `${M(`${w}${fr(rr, d)}`)} ${josa(rr, '을', '를')} 가분수로 나타낸 것은?`, correct: o(n),
    wrongs: [{ ...o(w + rr), note: '자연수와 분자를 그냥 더함' }, { ...o(w * d), note: '분자를 더하지 않음' }, o(w * rr), o(n + d)],
    fill: () => o(Math.max(1, n + ri(r, -6, 6))), order: 'asc', explain: `${w} × ${d} + ${rr} = ${n} → ${M(fr(n, d))}` });
};
G['r2-3'] = (r) => {
  const d = ri(r, 5, 12), a = ri(r, 1, d - 2), b = ri(r, 1, d - 1 - a), s = a + b;
  return build(r, { text: `다음을 계산한 값은?\n${M(`${fr(a, d)} + ${fr(b, d)}`)}`, correct: { s: M(fr(s, d)), v: q(s, d) },
    wrongs: [{ s: M(fr(s, 2 * d)), v: q(s, 2 * d), note: '분모끼리도 더함' }, { s: M(fr(Math.abs(a - b) || 1, d)), v: q(Math.abs(a - b) || 1, d) }, { s: M(fr(s + 2, d)), v: q(s + 2, d) }, { s: M(`1${fr(s, d)}`), v: q(d + s, d) }],
    fill: nearFrac(r, [s, d]), fmt: (v) => M(fr(v[0], v[1])), order: 'asc', explain: `분모가 같으면 분자끼리 더해요: ${a} + ${b} = ${s} → ${M(fr(s, d))}` });
};
G['r2-4'] = (r) => {
  const fs: Q[] = [];
  while (fs.length < 5) { const d = ri(r, 2, 12), n = ri(r, 1, d - 1); if (gcd(n, d) !== 1) continue; const f: Q = [n, d]; if (fs.some((x) => eq(x, f))) continue; fs.push(f); }
  const mx0 = fs.reduce((a, b) => (lt(a, b) ? b : a));
  return build(r, { text: '다음 중 가장 큰 분수는?', correct: { s: M(fr(mx0[0], mx0[1])), v: mx0 }, wrongs: fs.filter((f) => f !== mx0).map((f) => ({ s: M(fr(f[0], f[1])), v: f })),
    order: 'shuffle', explain: `통분하거나 소수로 바꿔 비교: ${fs.map((f) => M(fr(f[0], f[1])) + ' ≈ ' + (Math.round(num(f) * 100) / 100)).join(', ')}` });
};
G['r2-5'] = (r) => {
  let a: Q, b: Q; for (;;) { const d1 = ri(r, 3, 9), d2 = ri(r, 3, 9); a = [ri(r, 1, d1 - 1), d1]; b = [ri(r, 1, d2 - 1), d2]; if (d1 !== d2 && gcd(a[0], d1) === 1 && gcd(b[0], d2) === 1 && !eq(a, b)) break; }
  const A = M(fr(a[0], a[1])), B = M(fr(b[0], b[1])), L = lcm(a[1], b[1]), big = lt(b, a);
  const opts = [{ s: `${A} > ${B}` }, { s: `${A} < ${B}` }, { s: `${A} = ${B}` }];
  const correct = big ? opts[0] : opts[1];
  return build(r, { text: `${A} ${josa(a[0], '과', '와')} ${B} 의 크기를 바르게 비교한 것은?`, correct, wrongs: opts.filter((o) => o !== correct), count: 3, order: 'shuffle',
    explain: `통분: ${M(fr(a[0] * L / a[1], L))}, ${M(fr(b[0] * L / b[1], L))} → ${big ? A + ' > ' + B : A + ' < ' + B}` });
};
const lowest = (r: Rng) => {
  const [p, d] = coprimePair(r, 1, 9); const P = Math.min(p, d), D = Math.max(p, d); const k = pick(r, [4, 6, 8]);
  const parts = divisors(k).filter((x) => x > 1 && x < k);
  const f = (n: number, dd: number) => ({ s: M(fr(n, dd)), v: q(n, dd) });
  return build(r, { text: `${M(fr(P * k, D * k))} ${josa(P * k, '을', '를')} 기약분수로 나타낸 것은?`, correct: f(P, D),
    wrongs: [...parts.map((x) => ({ ...f(P * x, D * x), note: '끝까지 약분하지 않음' })), { ...f(P * k, D * k), note: '끝까지 약분하지 않음' }, f(D - P > 0 && D - P !== P ? D - P : P + 1, D), f(P, D + 1)],
    equivOk: true, order: 'shuffle', explain: `${J(P * k, '과', '와')} ${D * k}의 최대공약수 ${J(k, '으로', '로')} 분모·분자를 나눔 → ${M(fr(P, D))}` });
};
G['r2-6'] = lowest; G['ur-10'] = lowest;
G['r2-7'] = (r) => {
  const [p, d] = (() => { for (;;) { const d = ri(r, 3, 7), p = ri(r, 1, d - 1); if (gcd(p, d) === 1) return [p, d]; } })();
  const ks = shuffle(r, [2, 3, 4, 5, 6, 7]).slice(0, 5).sort((a, b) => a - b), bad = ks[ri(r, 0, 4)], add0 = ri(r, 1, 3);
  const o = (n: number, dd: number) => ({ s: M(fr(n, dd)), v: q(n, dd) });
  return build(r, { text: `다음 중 ${M(fr(p, d))} ${josa(p, '과', '와')} 크기가 같은 분수가 <b>아닌</b> 것은?`, correct: o(p * bad + add0, d * bad + add0),
    wrongs: ks.filter((k) => k !== bad).map((k) => o(p * k, d * k)), equivOk: true, order: 'shuffle',
    explain: `분모·분자에 같은 수를 곱하면 크기가 같아요. ${M(fr(p * bad + add0, d * bad + add0))} 은 같은 수를 곱한 게 아니라 더한 것이라 크기가 달라요` });
};
G['r2-8'] = (r) => {
  const [b, d] = pick(r, [[6, 8], [4, 6], [6, 9], [10, 15], [4, 10], [8, 12], [6, 10], [9, 12]]), L = lcm(b, d);
  const a = (() => { for (;;) { const x = ri(r, 1, b - 1); if (gcd(x, b) === 1) return x; } })(), c = (() => { for (;;) { const x = ri(r, 1, d - 1); if (gcd(x, d) === 1) return x; } })();
  const pair = (n1: number, n2: number, D: number) => ({ s: M(`${fr(n1, D)}, ${fr(n2, D)}`) });
  return build(r, { text: `${M(fr(a, b))} ${josa(a, '과', '와')} ${M(fr(c, d))} ${josa(c, '을', '를')} 분모의 최소공배수로 통분한 것은?`, correct: pair(a * L / b, c * L / d, L),
    wrongs: [{ ...pair(a, c, L), note: '분모만 바꾸고 분자는 그대로 둠' }, { ...pair(a * d, c * b, b * d), note: '분모의 곱으로 통분함 (최소공배수가 아님)' },
      { ...pair(a * L / d, c * L / b, L), note: '분자에 곱할 수를 서로 바꿈' }, { ...pair(a, c, b + d), note: '분모끼리 더함' }],
    explain: `${J(b, '과', '와')} ${d}의 최소공배수 ${L} → ${M(fr(a, b))} = ${M(fr(a * L / b, L))}, ${M(fr(c, d))} = ${M(fr(c * L / d, L))}` });
};
G['r2-9'] = (r) => {
  const g = pick(r, [6, 8, 10, 12]), [m, n] = coprimePair(r, 2, 5), N = g * Math.min(m, n), D = g * Math.max(m, n);
  const cds = divisors(g).filter((x) => x > 1), non = (() => { for (;;) { const x = ri(r, 2, 9); if (N % x || D % x) return x; } })();
  return build(r, { text: `${M(fr(N, D))} ${josa(N, '을', '를')} 약분할 때, 분모와 분자를 나눌 수 <b>없는</b> 수는?`, correct: { v: q(non) }, wrongs: shuffle(r, cds).slice(0, 3).map((x) => ({ v: q(x) })),
    count: 4, fmt: intF, order: 'asc', explain: `${J(N, '과', '와')} ${D}의 공약수(1 제외)로만 약분할 수 있어요: ${cds.join(', ')}. ${J(non, '은', '는')} 둘 다 나누어떨어지게 하지 못해요` });
};

// 분수의 덧셈과 뺄셈
function properCoprime(r: Rng, d: number) { for (;;) { const n = ri(r, 1, d - 1); if (gcd(n, d) === 1) return n; } }
function addsub(r: Rng, op: '+' | '−', want: 'lt1' | 'gt1' | 'any', unitFr = false) {
  for (;;) {
    const b = ri(r, 2, 9), d = ri(r, 2, 9); if (b === d || gcd(b, d) === Math.min(b, d) && unitFr) continue;
    const a = unitFr ? 1 : properCoprime(r, b), c = unitFr ? 1 : properCoprime(r, d);
    const x: Q = [a, b], y: Q = [c, d], L = lcm(b, d), res = op === '+' ? add(x, y) : sub(x, y);
    if (res[0] <= 0) continue; if (want === 'lt1' && num(res) >= 1) continue; if (want === 'gt1' && num(res) <= 1) continue;
    const A = a * L / b, C = c * L / d;
    const wr: Opt[] = op === '+'
      ? [{ s: M(fr(a + c, b + d)), v: q(a + c, b + d), note: '분모끼리, 분자끼리 더함' }, { s: M(fr(a + c, L)), v: q(a + c, L), note: '통분할 때 분자를 바꾸지 않음' }, { v: sub(x, y)[0] > 0 ? sub(x, y) : q(A + C + 1, L) }]
      : [{ s: M(fr(Math.abs(a - c) || 1, Math.abs(b - d))), v: q(Math.abs(a - c) || 1, Math.abs(b - d)), note: '분모끼리, 분자끼리 뺌' }, { s: M(fr(Math.abs(a - c) || 1, L)), v: q(Math.abs(a - c) || 1, L), note: '통분할 때 분자를 바꾸지 않음' }, { v: add(x, y), note: '빼야 하는데 더함' }];
    return build(r, { text: `다음을 계산한 값은?\n${M(`${fr(a, b)} ${op} ${fr(c, d)}`)}`, correct: { v: res }, wrongs: wr, fill: nearFrac(r, res), order: 'asc',
      explain: `통분(분모 ${L}): ${M(fr(A, L))} ${op} ${M(fr(C, L))} = ${M(fr(op === '+' ? A + C : A - C, L))}${isInt(res) || q(op === '+' ? A + C : A - C, L)[1] !== L || num(res) > 1 ? ' = ' + mx(res) : ''}` });
  }
}
G['r2-10'] = (r) => addsub(r, '+', 'lt1', true);
G['r2-11'] = (r) => addsub(r, '+', 'gt1');
G['r2-12'] = (r) => addsub(r, '−', 'any');
G['ua-7'] = (r) => addsub(r, '+', 'lt1');
G['ua-8'] = (r) => addsub(r, '−', 'any');
function mixedPair(r: Rng, carry: boolean) { // 분수 부분의 합이 1보다 큼(carry) / 앞 분수 < 뒤 분수(빌려오기)
  for (;;) {
    const b = ri(r, 2, 8), d = ri(r, 2, 8); if (b === d) continue;
    const a = properCoprime(r, b), c = properCoprime(r, d), fa: Q = [a, b], fc: Q = [c, d];
    if (carry ? num(add(fa, fc)) <= 1 : !lt(fa, fc)) continue;
    return { a, b, c, d, fa, fc, L: lcm(b, d) };
  }
}
const mixS = (w: number, f: Q) => M(w ? `${w}${fr(f[0], f[1])}` : fr(f[0], f[1]));
G['r2-13'] = (r) => {
  const { fa, fc, a, b, c, d, L } = mixedPair(r, true), w1 = ri(r, 1, 4), w2 = ri(r, 1, 3), X = add(q(w1), fa), Y = add(q(w2), fc), res = add(X, Y);
  return build(r, { text: `다음을 계산한 값은?\n${M(`${w1}${fr(a, b)} + ${w2}${fr(c, d)}`)}`, correct: { v: res },
    wrongs: [{ v: sub(res, q(1)), note: '받아올림한 1을 자연수에 더하지 않음' }, { s: M(`${w1 + w2}${fr(a + c, b + d)}`), v: add(q(w1 + w2), q(a + c, b + d)), note: '분모끼리, 분자끼리 더함' }, { v: add(res, q(1)) }],
    fill: nearFrac(r, res), order: 'asc', explain: `자연수끼리 ${w1 + w2}, 분수끼리 통분(분모 ${L}): ${M(fr(a * L / b, L))} + ${M(fr(c * L / d, L))} = ${M(fr(a * L / b + c * L / d, L))} → ${mx(res)}` });
};
function borrow(r: Rng, w2min: number, text: (A: string, B: string) => string, unitS = '') {
  const { fa, fc, a, b, c, d, L } = mixedPair(r, false), w1 = ri(r, Math.max(2, w2min + 1), 5), w2 = ri(r, w2min, w1 - 1), X = add(q(w1), fa), Y = add(q(w2), fc), res = sub(X, Y);
  const back = add(q(w1 - w2), sub(fc, fa)); const f = unitS ? (v: Q) => mx(v) + unitS : undefined;
  return build(r, { text: text(mixS(w1, fa), mixS(w2, fc)), correct: { v: res },
    wrongs: [{ v: back, note: '분수끼리 뺄 수 없을 때 거꾸로 뺌 (받아내림 안 함)' }, { v: add(res, q(1)), note: '받아내림한 뒤 자연수에서 1을 빼지 않음' }, { v: add(X, Y), note: '빼야 하는데 더함' }],
    fill: nearFrac(r, res), fmt: f, order: 'asc',
    explain: `통분(분모 ${L}): ${M(`${w1}${fr(a * L / b, L)} − ${w2 ? w2 : ''}${fr(c * L / d, L)}`)} → 분수끼리 뺄 수 없으니 받아내림: ${M(`${w1 - 1}${fr(a * L / b + L, L)}`)} → ${mx(res)}` });
}
G['r2-14'] = (r) => borrow(r, 1, (A, B) => `다음을 계산한 값은?\n${A.slice(0, -1)} − ${B.slice(1)}`);
G['ua-9'] = (r) => borrow(r, 1, (A, B) => `다음을 계산한 값은?\n${A.slice(0, -1)} − ${B.slice(1)}`);
G['r2-15'] = (r) => {
  const { fa, fc, a, b, c, d, L } = mixedPair(r, false), w1 = ri(r, 1, 3), X = add(q(w1), fa), res = sub(X, fc), it = pick(r, [['물', 'L', '마셨습니다'], ['우유', 'L', '마셨습니다'], ['밀가루', 'kg', '썼습니다']]);
  return build(r, { text: `${it[0]} ${mixS(w1, fa)} ${it[1]} 중에서 ${M(fr(c, d))} ${it[1]}${it[1] === 'L' ? '를' : '을'} ${it[2]}. 남은 ${J(it[0], '은', '는')} 몇 ${it[1]}인가요?`,
    correct: { v: res }, wrongs: [{ v: add(q(w1), sub(fc, fa)), note: '분수끼리 뺄 수 없을 때 거꾸로 뺌 (받아내림 안 함)' }, { v: add(res, q(1)), note: '받아내림한 뒤 자연수에서 1을 빼지 않음' }, { v: add(X, fc), note: '빼야 하는데 더함' }],
    fill: nearFrac(r, res), fmt: (v) => mx(v) + ' ' + it[1], order: 'asc',
    explain: `통분(분모 ${L}): ${M(`${w1}${fr(a * L / b, L)} − ${fr(c * L / d, L)}`)} → 받아내림 ${M(`${w1 - 1}${fr(a * L / b + L, L)}`)} → ${mx(res)} ${it[1]}` });
};
G['ua-10'] = (r) => {
  for (;;) {
    const b = ri(r, 2, 6), d = ri(r, 2, 8), e = ri(r, 2, 6); if (new Set([b, d, e]).size < 3) continue;
    const X = add(q(ri(r, 1, 3)), q(properCoprime(r, b), b)), Y: Q = q(properCoprime(r, d), d), Z = add(q(ri(r, 1, 2)), q(properCoprime(r, e), e));
    if (!lt(Y, X)) continue; const res = add(sub(X, Y), Z), Lc = lcm(lcm(b, d), e); if (Lc > 36) continue;
    return build(r, { text: `끈 ${mx(X)} m 중에서 ${mx(Y)} m를 쓰고, ${mx(Z)} m를 더 사 왔습니다. 지금 끈은 몇 m인가요?`, correct: { v: res },
      wrongs: [{ v: sub(X, Y), note: '사 온 끈을 더하지 않음 (구하는 것을 끝까지 안 봄)' }, { v: add(add(X, Y), Z), note: '쓴 끈을 빼지 않고 더함' }, ...(lt(add(Y, Z), X) ? [{ v: sub(sub(X, Y), Z) }] : [])],
      fill: nearFrac(r, res), order: 'asc', explain: `${mx(X)} − ${mx(Y)} + ${mx(Z)} ${josa(Z[0], '을', '를')} 분모 ${J(Lc, '으로', '로')} 통분해 앞에서부터 계산 → ${mx(res)} m` });
  }
};

// 분수의 나눗셈
G['r3-1'] = (r) => {
  const n = ri(r, 2, 4), b = ri(r, 3, 9); let k = 0; for (;;) { k = ri(r, 1, 4); if (n * k < b * 2 && gcd(k, b) === 1) break; } const a = n * k;
  return build(r, { text: `다음을 계산한 값은?\n${M(`${fr(a, b)} ÷ ${n}`)}`, correct: { s: M(fr(k, b)), v: q(k, b) },
    wrongs: [{ s: M(fr(a * n, b)), v: q(a * n, b), note: '÷를 ×로 계산함' }, { s: M(fr(k, b * n)), v: q(k, b * n), note: `분자와 분모를 모두 ${J(n, '으로', '로')} 나눔` }, { s: M(fr(b, a * n)), v: q(b, a * n) }, { s: M(fr(a, b + n)), v: q(a, b + n) }],
    fill: nearFrac(r, [k, b]), order: 'asc', explain: `분자를 ${J(n, '으로', '로')} 나누기: ${a} ÷ ${n} = ${k} → ${M(fr(k, b))} (또는 ${M(`${fr(a, b)} × ${fr(1, n)}`)})` });
};
function fdiv(r: Rng, intAns: boolean) {
  for (;;) {
    const b = ri(r, 2, 9), a = properCoprime(r, b); let c: number, d: number;
    if (intAns) { const m = ri(r, 2, 4); d = b * m; c = a; if (gcd(c, d) !== 1) continue; } else { d = ri(r, 2, 9); c = properCoprime(r, d); if (d === b) continue; }
    const x: Q = [a, b], y: Q = [c, d], res = div(x, y); if (eq(x, y) || eq(res, q(1))) continue;
    return build(r, { text: `다음을 계산한 값은?\n${M(`${fr(a, b)} ÷ ${fr(c, d)}`)}`, correct: { v: res },
      wrongs: [{ s: M(fr(a * c, b * d)), v: q(a * c, b * d), note: '÷를 ×로 바꾸지 않고 그냥 곱함' }, { v: div(y, x), note: '나누는 수 대신 나뉘는 수를 뒤집음' }, { v: y }],
      fill: nearFrac(r, res), order: 'asc', explain: `÷ 뒤의 분수를 뒤집어 곱하기: ${M(`${fr(a, b)} × ${fr(d, c)} = ${fr(a * d, b * c)}`)}${q(a * d, b * c)[1] !== b * c || num(res) > 1 ? ' = ' + mx(res) : ''}` });
  }
}
G['r3-2'] = (r) => fdiv(r, true);
G['r3-3'] = (r) => fdiv(r, false);
G['uf-8'] = (r) => fdiv(r, false);
G['r3-4'] = (r) => {
  for (;;) {
    const b = ri(r, 3, 8), c = ri(r, 1, b - 1), k = ri(r, 2, 6), N = c * k; if (N <= b || N % b === 0 || k === c) continue;
    const w = Math.floor(N / b), rr = N % b;
    return build(r, { text: `다음을 계산한 값은?\n${M(`${w}${fr(rr, b)} ÷ ${fr(c, b)}`)}`, correct: { v: q(k) },
      wrongs: [{ v: add(q(w), q(rr, c)), note: '대분수를 가분수로 바꾸지 않음 (분수 부분만 나눔)' }, { v: q(N * c, b * b), note: '÷를 ×로 계산함' }, { v: q(1, k), note: '나누는 수 대신 나뉘는 수를 뒤집음' }, { v: q(N, b) }],
      fill: nearInt(r, k, 3), order: 'asc', explain: `가분수로: ${M(`${w}${fr(rr, b)} = ${fr(N, b)}`)} → 분모가 같으니 분자끼리 나누기 ${N} ÷ ${c} = ${k}` });
  }
};
G['r3-5'] = (r) => {
  for (;;) {
    const b = ri(r, 3, 9), a = properCoprime(r, b), n = ri(r, 2, 9); if ((n * b) % a) continue; const ans = (n * b) / a;
    return build(r, { text: `다음을 계산한 값은?\n${M(`${n} ÷ ${fr(a, b)}`)}`, correct: { v: q(ans) },
      wrongs: [{ s: M(fr(n * a, b)), v: q(n * a, b), note: '÷를 ×로 계산함' }, { v: q(a, n * b), note: '나누는 수 대신 나뉘는 수를 뒤집음' }, { v: q(n * b) }, ...(n % a === 0 ? [{ v: q(n / a) }] : [])],
      fill: nearInt(r, ans, 6), order: 'asc', explain: `${M(`${n} ÷ ${fr(a, b)} = ${n} × ${fr(b, a)} = ${fr(n * b, a)}`)} = ${ans}` });
  }
};
function countDiv(r: Rng, text: (T: string, e: string) => string, unitS: string) {
  for (;;) {
    const d = pick(r, [8, 10, 12, 16, 18, 20, 24]), c = ri(r, 1, 3), k = ri(r, 3, 12); if (gcd(c, d) !== 1) continue;
    const T = q(k * c, d); if (num(T) >= 3 || T[1] === 1) continue; const e: Q = [c, d];
    return build(r, { text: text(mx(T), M(fr(c, d))), correct: { v: q(k) },
      wrongs: [{ v: mul(T, e), note: '÷를 ×로 계산함' }, { v: q(d), note: '분모만 보고 답함' }, { v: q(k + 1) }],
      fill: nearInt(r, k, 4), fmt: (v) => (isInt(v) ? mixed(v) + unitS : mx(v) + ' ' + unitS), order: 'asc',
      explain: `${mx(T)} ÷ ${M(fr(c, d))} = ${M(`${fr(T[0], T[1])} × ${fr(d, c)}`)} = ${k} → ${k}${unitS}` });
  }
}
G['r3-6'] = (r) => countDiv(r, (T, e) => `밀가루 ${T} kg을 빵 한 개에 ${e} kg씩 쓰면, 빵을 몇 개 만들 수 있나요?`, '개');
G['uf-10'] = (r) => countDiv(r, (T, e) => `주스 ${T} L를 컵 한 개에 ${e} L씩 나누어 담으려고 합니다. 컵은 몇 개 필요한가요?`, '개');
G['r3-7'] = (r) => {
  for (;;) {
    const Ad = pick(r, [4, 5, 6, 8, 9]), A: Q = q(properCoprime(r, Ad), Ad), W: Q = (() => { const d = ri(r, 3, 9); return q(properCoprime(r, d), d); })(); if (A[1] === 0 || eq(A, W)) continue;
    const H = div(A, W); if (num(H) > 4 || H[1] > 12) continue;
    return build(r, { text: `넓이가 ${mx(A)} m²이고 가로가 ${mx(W)} m인 직사각형의 세로는 몇 m인가요?`, correct: { v: H },
      wrongs: [{ v: mul(A, W), note: '나눗셈 대신 곱셈을 함' }, { v: div(W, A), note: '거꾸로 나눔 (가로 ÷ 넓이)' }, { v: add(A, W) }],
      fill: nearFrac(r, H), fmt: (v) => mx(v) + ' m', order: 'asc', explain: `세로 = 넓이 ÷ 가로 = ${mx(A)} ÷ ${mx(W)} = ${mx(H)} m` });
  }
};
G['uf-9'] = (r) => {
  for (;;) {
    const b = ri(r, 2, 6), rr = properCoprime(r, b), w = ri(r, 1, 4), n = ri(r, 2, 6), N = w * b + rr; if (N % n) continue;
    const res = q(N / n, b);
    return build(r, { text: `다음을 계산한 값은?\n${M(`${w}${fr(rr, b)} ÷ ${n}`)}`, correct: { v: res },
      wrongs: [{ s: M(`${w}${fr(rr, b * n)}`), v: add(q(w), q(rr, b * n)), note: '대분수의 분수 부분만 나눔 (가분수로 바꾸지 않음)' }, { v: q(N * n, b), note: '÷를 ×로 계산함' }, { v: q(N, b * n * 2) }],
      fill: nearFrac(r, res), order: 'asc', explain: `가분수로: ${M(`${w}${fr(rr, b)} = ${fr(N, b)}`)} → ${M(`${fr(N, b)} × ${fr(1, n)} = ${fr(N, b * n)}`)} = ${mx(res)}` });
  }
};

// 소수의 나눗셈
function ddiv(r: Rng, qq: Q, v: Q, note1 = '소수점을 옮긴 자리 수가 맞지 않음') {
  const D = mul(qq, v), k = (x: Q) => { let s = 0; let [n, d] = x; while (d !== 1 && s < 6) { n *= 10; s++; const g = gcd(n, d); n /= g; d /= g; } return s; };
  const sc = Math.max(k(D), k(v)), m = 10 ** sc;
  return build(r, { text: `다음을 계산한 값은?\n${M(`${dec(D)} ÷ ${dec(v)}`)}`, correct: { v: qq },
    wrongs: [{ v: mul(qq, q(10)), note: note1 }, { v: mul(qq, q(1, 10)), note: note1 }, { v: mul(qq, q(100)) }, ...(sub(D, v)[0] > 0 ? [{ v: sub(D, v), note: '나눗셈 대신 뺄셈을 함' }] : []), { v: mul(qq, q(1, 100)) }],
    fmt: (x) => dec(x), order: 'asc', explain: `두 수에 ${J(m, '을', '를')} 곱해 자연수로: ${dec(mul(D, q(m)))} ÷ ${dec(mul(v, q(m)))} = ${dec(qq)}` });
}
G['r3-8'] = (r) => ddiv(r, q(ri(r, 2, 9)), q(ri(r, 2, 9), 10));
G['r3-9'] = (r) => ddiv(r, q(ri(r, 11, 19)), q(ri(r, 11, 25), 100));
G['r3-10'] = (r) => { const v = pick(r, [q(1, 4), q(1, 2), q(1, 5), q(2, 5), q(3, 4)]); let n = 0; for (;;) { n = ri(r, 2, 12); if (isInt(div(q(n), v))) break; } return ddiv(r, div(q(n), v), v); };
G['r3-11'] = (r) => { let t = 0; for (;;) { t = ri(r, 21, 59); if (t % 10) break; } return ddiv(r, q(t, 10), q(ri(r, 11, 19), 10), '몫의 소수점 위치가 틀림'); };
G['ue-9'] = (r) => { for (;;) { const m = ri(r, 5, 25), qq = ri(r, 10, 60); if ((qq * m) % 10 === 0 && m % 10) return ddiv(r, q(qq), q(m, 100)); } };
G['ue-10'] = (r) => { let t = 0; for (;;) { t = ri(r, 11, 49); if (t % 10) break; } return ddiv(r, q(t, 10), q(ri(r, 2, 9), 10), '몫의 소수점 위치가 틀림'); };
G['r3-12'] = (r) => {
  for (;;) {
    const m = pick(r, [3, 6, 7, 9, 11]), n = ri(r, m + 1, m * 6); if (n % m === 0 || (n * 1000) % m === 0) continue;
    const h = Math.floor((n * 100) / m), r1 = Math.round(h / 10) / 10, tr = Math.floor(h / 10) / 10, r2 = Math.round((n * 1000) / m / 10) / 100;
    if (r1 === tr) continue;
    return build(r, { text: `${M(`${n} ÷ ${m}`)} 의 몫을 반올림하여 소수 첫째 자리까지 나타내면?`, correct: { s: r1.toFixed(1), v: q(Math.round(r1 * 10), 10) },
      wrongs: [{ s: tr.toFixed(1), v: q(Math.round(tr * 10), 10), note: '반올림하지 않고 버림' }, { s: r2.toFixed(2), v: q(Math.round(r2 * 100), 100), note: '소수 둘째 자리까지 나타냄' }, { s: String(Math.round(r1 * 10) / 100), v: q(Math.round(r1 * 10), 100) }],
      fill: () => { const x = Math.max(1, Math.round(r1 * 10) + (r() < 0.5 ? -1 : 1) * ri(r, 2, 6)); return { s: (x / 10).toFixed(1), v: q(x, 10) }; },
      order: 'asc', explain: `${n} ÷ ${m} = ${(n / m).toFixed(3)}… → 소수 둘째 자리 숫자를 반올림 → ${r1}` });
  }
};
G['r3-13'] = (r) => {
  const p = q(ri(r, 2, 9), 10), k = ri(r, 11, 30), L = mul(p, q(k)), it = pick(r, ['리본', '끈', '철사']);
  return build(r, { text: `${it} ${dec(L)} m를 ${dec(p)} m씩 자르면 모두 몇 도막이 되나요?`, correct: { v: q(k) },
    wrongs: [{ v: q(k, 10), note: '소수점을 옮긴 자리 수가 맞지 않음' }, { v: q(k * 10), note: '소수점을 옮긴 자리 수가 맞지 않음' }, { v: sub(L, p), note: '나눗셈 대신 뺄셈을 함' }, { v: mul(L, p) }],
    fmt: (v) => dec(v) + '도막', order: 'asc', explain: `${dec(L)} ÷ ${dec(p)} → 두 수에 10을 곱해 ${dec(mul(L, q(10)))} ÷ ${dec(mul(p, q(10)))} = ${k}도막` });
};
G['r3-14'] = (r) => {
  const b = ri(r, 2, 5), k = ri(r, 3, 9); let x = 0; for (;;) { x = ri(r, 1, 10 * b - 1); if (x % 10) break; }
  const rem = q(x, 10), T = add(q(b * k), rem), it = pick(r, [['쌀', 'kg', '봉지'], ['물', 'L', '병'], ['설탕', 'kg', '봉지']]);
  const o = (n: number, rv: Q) => ({ s: `${n}${it[2]}, ${dec(rv)} ${it[1]}` });
  const wr = [o(k, mul(rem, q(1, 10))), o(k, mul(rem, q(10))), o(k + 1, rem), o(Math.round(num(T) * 10 / b), q(1, 10))];
  return build(r, { text: `${it[0]} ${dec(T)} ${it[1]}${it[1] === 'L' ? '를' : '을'} 한 ${it[2]}에 ${b} ${it[1]}씩 담으려고 합니다. 몇 ${it[2]}에 담고, 남는 ${J(it[0], '은', '는')} 몇 ${it[1]}인가요?`,
    correct: o(k, rem), wrongs: [{ ...wr[0], note: '남는 양의 소수점 위치가 틀림' }, { ...wr[1], note: '남는 양의 소수점 위치가 틀림' }, wr[2], wr[3]], order: 'shuffle',
    explain: `${dec(T)} ÷ ${b} → 몫은 자연수까지만: ${b} × ${k} = ${b * k}, 남는 양 ${dec(T)} − ${b * k} = ${dec(rem)} → ${k}${it[2]}, ${dec(rem)} ${it[1]}` });
};
G['r3-15'] = (r) => {
  for (;;) {
    const d = ri(r, 12, 25), R = ri(r, 8, 20); if ((R * d) % 10 || d % 10 === 0) continue; const F = q(d, 10), D = (R * d) / 10;
    return build(r, { text: `휘발유 ${dec(F)} L로 ${D} km를 가는 자동차는 휘발유 1 L로 몇 km를 가나요?`, correct: { v: q(R) },
      wrongs: [{ v: q(R, 10), note: '소수점을 옮긴 자리 수가 맞지 않음' }, { v: q(R * 10), note: '소수점을 옮긴 자리 수가 맞지 않음' }, { v: sub(q(D), F), note: '나눗셈 대신 뺄셈을 함' }, { v: mul(q(D), F), note: '나눗셈 대신 곱셈을 함' }],
      fmt: decU(' km'), order: 'asc', explain: `1 L로 가는 거리 = ${D} ÷ ${dec(F)} → 두 수에 10을 곱해 ${D * 10} ÷ ${d} = ${R} km` });
  }
};

// 비와 비율
G['r4-1'] = (r) => {
  const [a, b] = coprimePair(r, 2, 9);
  return build(r, { text: `비 ${M(`${a} : ${b}`)} 에서 기준량은?`, correct: { s: String(b) },
    wrongs: [{ s: String(a), note: '비교하는 양과 기준량을 바꿈' }, { s: String(a + b), note: '두 수의 합을 기준량으로 봄' }, { s: M(fr(a, b)) }, { s: M(fr(b, a)) }], order: 'shuffle',
    explain: `${M(`${a} : ${b}`)} ${josa(b, '은', '는')} "${a} 대 ${b}" — 뒤의 수 ${J(b, '이', '가')} 기준량, 앞의 수 ${J(a, '이', '가')} 비교하는 양` });
};
G['r4-2'] = (r) => {
  for (;;) {
    const T = pick(r, [20, 24, 25, 28, 30, 32]), P = ri(r, Math.ceil(T / 3), T - 3); if (P * 2 === T) continue;
    const res = q(P, T); const f = (v: Q) => M(fr(v[0], v[1]));
    return build(r, { text: `반 학생 ${T}명 중 여학생이 ${P}명입니다. 반 전체 학생 수에 대한 여학생 수의 비율을 기약분수로 나타낸 것은?`, correct: { v: res },
      wrongs: [{ v: q(T, P), note: '기준량과 비교하는 양을 바꿈' }, { v: q(P, T - P), note: '전체 대신 남학생 수를 기준량으로 봄' }, { v: q(T - P, T), note: '남학생의 비율을 구함' }, { v: q(T - P, P) }],
      fmt: f, order: 'shuffle', explain: `비율 = 비교하는 양 ÷ 기준량 = ${P} ÷ ${T} = ${M(fr(P, T))} = ${f(res)}` });
  }
};
G['r4-3'] = (r) => {
  let k = 0; for (;;) { k = ri(r, 5, 95); if (k % 10) break; }
  return build(r, { text: `비율 ${J(dec(q(k, 100)), '을', '를')} 백분율로 나타낸 것은?`, correct: { v: q(k) },
    wrongs: [{ v: q(k, 100), note: '100을 곱하지 않음 (비율을 그대로 씀)' }, { v: q(k, 10), note: '곱하는 수를 잘못 씀' }, { v: q(100 - k), note: '나머지 비율을 구함' }, { v: q(k * 10), note: '곱하는 수를 잘못 씀' }],
    fmt: decU('%'), order: 'asc', explain: `${dec(q(k, 100))} × 100 = ${k} → ${k}%` });
};
G['r4-4'] = (r) => {
  for (;;) {
    const T = pick(r, [20, 25, 40, 50, 200, 300, 400, 500]), P = ri(r, 2, T / 2); if ((P * 100) % T) continue; const pc = (P * 100) / T; if (pc === P) continue;
    return build(r, { text: `학생 ${T}명 중 ${P}명이 안경을 썼습니다. 안경을 쓴 학생은 전체의 몇 %인가요?`, correct: { v: q(pc) },
      wrongs: [{ v: q(P), note: '사람 수를 그대로 %로 씀' }, { v: q(100 - pc), note: '안경을 안 쓴 학생의 비율을 구함' }, ...((T * 100) % P === 0 ? [{ v: q((T * 100) / P), note: '기준량과 비교하는 양을 바꿈' }] : [])],
      fill: nearInt(r, pc, 10), fmt: decU('%'), order: 'asc', explain: `${P} ÷ ${T} × 100 = ${pc}%` });
  }
};
G['r4-5'] = (r) => {
  const price = ri(r, 3, 20) * 1000, p = pick(r, [10, 20, 25, 30, 40]), off = (price * p) / 100, ans = price - off;
  return build(r, { text: `정가가 ${price}원인 물건을 ${p}% 할인하여 판다면, 판매 가격은 얼마인가요?`, correct: { v: q(ans) },
    wrongs: [{ v: q(off), note: '할인 금액만 구함 (판매 가격 대신)' }, { v: q(price + off), note: '할인인데 더함' }, { v: q(price - p), note: '퍼센트 숫자를 그냥 뺌' }],
    fill: () => q(ans + (r() < 0.5 ? -1 : 1) * ri(r, 1, 5) * 100), fmt: unit('원'), order: 'asc', explain: `할인 금액: ${price} × ${p}/100 = ${off}원 → ${price} − ${off} = ${ans}원` });
};
G['r4-6'] = (r) => {
  for (;;) {
    const T = pick(r, [100, 200, 250, 400, 500]), p = pick(r, [5, 8, 10, 12, 15, 20, 25]); const s = (T * p) / 100; if (!Number.isInteger(s)) continue; const w = T - s;
    const sw = Math.round((s / w) * 1000) / 10;
    return build(r, { text: `소금 ${s} g을 물 ${w} g에 녹여 소금물을 만들었습니다. 소금물의 진하기는 몇 %인가요?`, correct: { v: q(p) },
      wrongs: [{ v: q(Math.round(sw * 10), 10), note: '물의 양을 기준량으로 봄 (소금물 전체가 기준)' }, { v: q(s), note: '소금 양을 그대로 %로 씀' }, { v: q(100 - p), note: '물의 비율을 구함' }],
      fill: nearInt(r, p, 6), fmt: decU('%'), order: 'asc', explain: `소금물 = ${s} + ${w} = ${T} g → ${s} ÷ ${T} × 100 = ${p}%` });
  }
};
G['r4-7'] = (r) => {
  const h = ri(r, 2, 5), v = ri(r, 4, 9) * 10, D = h * v;
  return build(r, { text: `${h}시간 동안 ${D} km를 달린 자동차는 1시간에 몇 km를 달린 셈인가요?`, correct: { v: q(v) },
    wrongs: [{ v: q(D * h), note: '나눗셈 대신 곱셈을 함' }, { v: q(D), note: '전체 거리를 그대로 답함' }, { v: q(h) }], fill: nearInt(r, v, 20), fmt: unit(' km'), order: 'asc',
    explain: `1시간에 달린 거리 = ${D} ÷ ${h} = ${v} km` });
};
G['uo-8'] = (r) => {
  const [a, b] = coprimePair(r, 2, 9); const f = (n: number, d: number) => ({ s: M(fr(n, d)), v: q(n, d) });
  return build(r, { text: `비 ${M(`${a} : ${b}`)} 의 비율을 분수로 나타낸 것은?`, correct: f(a, b),
    wrongs: [{ ...f(b, a), note: '기준량과 비교하는 양을 바꿈' }, { ...f(a, a + b), note: '두 수의 합을 기준량으로 봄' }, f(b, a + b), f(Math.abs(a - b) || 1, b + 1)], order: 'shuffle',
    explain: `비율 = 비교하는 양 ÷ 기준량. ${M(`${a} : ${b}`)} 에서 기준량은 뒤의 ${b} → ${M(fr(a, b))}` });
};
G['uo-9'] = (r) => {
  const d = pick(r, [4, 5, 20, 25, 50]), n = properCoprime(r, d), pc = (n * 100) / d;
  return build(r, { text: `비율 ${M(fr(n, d))} ${josa(n, '을', '를')} 백분율로 나타낸 것은?`, correct: { v: q(pc) },
    wrongs: [{ v: q(pc, 100), note: '100을 곱하지 않음 (비율을 그대로 씀)' }, { v: q(n), note: '분자를 그대로 %로 씀' }, { v: q(n + d) }, { v: q(pc * 10), note: '곱하는 수를 잘못 씀' }],
    fmt: decU('%'), order: 'asc', explain: `${M(fr(n, d))} = ${dec(q(n, d))} → × 100 → ${pc}%` });
};
G['uo-10'] = (r) => {
  for (;;) {
    const A = pick(r, [20, 25, 40, 50]), h = ri(r, 5, Math.floor(A / 2)); const res = q(h, A); if (h * 2 === A) continue;
    return build(r, { text: `어떤 야구 선수가 ${A}타수 중 안타를 ${h}개 쳤습니다. 이 선수의 타율(전체 타수에 대한 안타 수의 비율)을 소수로 나타낸 것은?`, correct: { v: res },
      wrongs: [{ s: String(Math.round((A / h) * 100) / 100), v: q(Math.round((A / h) * 100), 100), note: '기준량과 비교하는 양을 바꿈' }, { v: q(h, 100), note: '안타 수를 그대로 소수로 씀' }, { v: q(A - h, A), note: '안타가 아닌 타수의 비율을 구함' }],
      fill: nearDec(r, res, 100), fmt: (v) => dec(v), order: 'asc', explain: `기준량 = 전체 타수 ${A}, 비교하는 양 = 안타 ${h} → ${h} ÷ ${A} = ${dec(res)}` });
  }
};

// 비례식과 비례배분
G['r4-8'] = (r) => {
  const [p, qq] = coprimePair(r, 2, 6), k0 = ri(r, 2, 3), a = p * k0, b = qq * k0, k = (() => { for (;;) { const x = ri(r, 2, 5); if (x !== k0) return x; } })();
  const o = (x: number, y: number, note?: string) => ({ s: M(`${x} : ${y}`), v: q(x, y), note });
  return build(r, { text: `다음 중 ${M(`${a} : ${b}`)} ${josa(b, '과', '와')} 비율이 같은 비는?`, correct: o(p * k, qq * k),
    wrongs: [o(a + 2, b + 2, '앞과 뒤에 같은 수를 더하면 비율이 같다고 착각함'), o(b, a, '앞과 뒤를 바꿈'), o(a * 2, b + 2), o(a + 4, b * 2)], order: 'shuffle',
    fill: () => o(ri(r, 2, 16), ri(r, 2, 20)),
    explain: `앞과 뒤에 같은 수를 곱하거나 나누면 비율이 같아요: ${M(`${a} : ${b} = ${p} : ${qq} = ${p * k} : ${qq * k}`)}` });
};
G['r4-9'] = (r) => {
  const [a, b] = coprimePair(r, 2, 9), k = ri(r, 2, 5), c = a * k, ans = b * k;
  return build(r, { text: `비례식 ${M(`${a} : ${b} = ${c} : □`)} 에서 □ 안에 알맞은 수는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(b + c - a), note: '곱하지 않고 차이를 더함' }, { v: q(a * c), note: '외항·내항의 곱을 잘못 세움' }, { v: q(b * c), note: '내항의 곱만 구하고 나누지 않음' }],
    fill: nearInt(r, ans, 6), fmt: intF, order: 'asc', explain: `앞의 수가 ${a} → ${c} (× ${k}) 이므로 뒤의 수도 ${b} × ${k} = ${ans}` });
};
G['r4-10'] = (r) => {
  const [c, d] = coprimePair(r, 2, 9), k = ri(r, 2, 6), b = d * k, ans = c * k;
  return build(r, { text: `비례식 ${M(`□ : ${b} = ${c} : ${d}`)} 에서 □ 안에 알맞은 수는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(b * c), note: '외항의 곱 = 내항의 곱에서 나누지 않음' }, { v: q(Math.abs(b - d + c)), note: '곱하지 않고 차이를 더함' }, ...((b * d) % c === 0 ? [{ v: q((b * d) / c), note: '비의 순서를 바꿈' }] : [])],
    fill: nearInt(r, ans, 6), fmt: intF, order: 'asc', explain: `외항의 곱 = 내항의 곱: □ × ${d} = ${b} × ${c} = ${b * c} → □ = ${ans}` });
};
G['r4-11'] = (r) => {
  const [p, qq] = coprimePair(r, 1, 9), k = ri(r, 2, 4); if (p * k >= 10 || qq * k >= 10) return G['r4-11'](r);
  const x = q(p * k, 10), y = q(qq * k, 10); const o = (a: number | string, b: number | string, note?: string) => ({ s: M(`${a} : ${b}`), note });
  return build(r, { text: `${M(`${dec(x)} : ${dec(y)}`)} ${josa(dec(y), '을', '를')} 가장 간단한 자연수의 비로 나타낸 것은?`, correct: o(p, qq),
    wrongs: [o(p * k, qq * k, '자연수로만 바꾸고 약분하지 않음'), o(qq, p, '앞과 뒤를 바꿈'), o(p, qq + 1), o(1, dec(q(qq, p)))], order: 'shuffle',
    fill: () => o(ri(r, 1, 9), ri(r, 1, 9)),
    explain: `× 10 → ${M(`${p * k} : ${qq * k}`)} → 최대공약수 ${J(k, '으로', '로')} 나누기 → ${M(`${p} : ${qq}`)}` });
};
G['r4-12'] = (r) => {
  const [a, b] = coprimePair(r, 2, 9); const o = (x: number, y: number, note?: string) => ({ s: M(`${x} : ${y}`), note });
  return build(r, { text: `${M(`${fr(1, a)} : ${fr(1, b)}`)} 을 가장 간단한 자연수의 비로 나타낸 것은?`, correct: o(b, a),
    wrongs: [o(a, b, '분모끼리의 비로 씀 (순서가 거꾸로)'), o(1, 1, '분자끼리의 비로 씀'), o(1, a * b), o(a * b, 1)], order: 'shuffle',
    explain: `두 분모의 최소공배수 ${J(a * b, '을', '를')} 곱함: ${M(`${fr(1, a)} × ${a * b} : ${fr(1, b)} × ${a * b} = ${b} : ${a}`)}` });
};
function share(r: Rng, ask: 'first' | 'second') {
  for (;;) {
    const [m, n] = coprimePair(r, 2, 9), money = r() < 0.5, k = ri(r, 2, 9), uv = money ? pick(r, [500, 1000]) : 1;
    const T = (m + n) * k * uv, A = m * k * uv, B = n * k * uv; if (T > (money ? 30000 : 120)) continue;
    const [p0, p1] = pick(r, [['형', '동생'], ['언니', '동생'], ['누나', '동생'], ['오빠', '동생']]), it = money ? '' : pick(r, ['사탕', '구슬', '쿠키']);
    const want = ask === 'first' ? A : B, other = ask === 'first' ? B : A, who = ask === 'first' ? p0 : p1, u = money ? '원' : '개';
    return build(r, { text: `${money ? T + '원을' : it + ' ' + T + '개를'} ${J(p0, '과', '와')} ${J(p1, '이', '가')} ${M(`${m} : ${n}`)} ${josa(n, '으로', '로')} 나누어 가지면, ${J(who, '은', '는')} ${money ? '얼마를' : '몇 개를'} 가지나요?`,
      correct: { v: q(want) }, wrongs: [{ v: q(other), note: '다른 사람의 몫을 구함' }, { v: q(T / (m + n)), note: '한 칸(전체 ÷ 비의 합)만 구함' }, { v: q(T), note: '전체를 그대로 답함' }],
      fill: () => q(want + (r() < 0.5 ? -1 : 1) * ri(r, 1, 4) * uv), fmt: unit(u), order: 'asc',
      explain: `전체를 ${m} + ${n} = ${m + n}칸으로: 한 칸 ${T} ÷ ${m + n} = ${T / (m + n)} → ${ask === 'first' ? m : n}칸 = ${want}${u}` });
  }
}
G['r4-13'] = (r) => share(r, 'second');
G['r4-14'] = (r) => share(r, 'first');
G['r4-15'] = (r) => {
  for (;;) {
    const a = ri(r, 2, 5), b = ri(r, 3, 9), c = ri(r, a + 1, 12); if (gcd(a, b) !== 1 || (b * c * 10) % a) continue; const ans = q(b * c, a);
    return build(r, { text: `지도에서 ${a} cm는 실제 거리 ${b} km입니다. 지도에서 ${c} cm인 거리는 실제로 몇 km인가요?`, correct: { v: ans },
      wrongs: [{ v: q(a * c, b), note: '비례식을 거꾸로 세움' }, { v: q(c + b - a), note: '곱하지 않고 차이를 더함' }, { v: q(b * c), note: '나누지 않음' }],
      fill: nearDec(r, ans, 10), fmt: (v) => (isInt(mul(v, q(10))) ? dec(v) : String(Math.round(num(v) * 10) / 10)) + ' km', order: 'asc',
      explain: `${M(`${a} : ${b} = ${c} : □`)} → □ = ${b} × ${c} ÷ ${a} = ${dec(ans)} km` });
  }
};
G['up-9'] = (r) => {
  const [a, b] = coprimePair(r, 2, 9), k = ri(r, 2, 6), d = b * k, ans = a * k;
  return build(r, { text: `비례식 ${M(`${a} : ${b} = □ : ${d}`)} 에서 □ 안에 알맞은 수는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(a * d), note: '외항의 곱만 구하고 나누지 않음' }, { v: q(a + d - b), note: '곱하지 않고 차이를 더함' }], fill: nearInt(r, ans, 6), fmt: intF, order: 'asc',
    explain: `외항의 곱 = 내항의 곱: ${a} × ${d} = ${b} × □ → ${a * d} = ${b} × □ → □ = ${ans}` });
};
G['up-10'] = (r) => {
  const [m, n] = coprimePair(r, 2, 7), small = Math.min(m, n), big = Math.max(m, n), k = ri(r, 2, 9), L = big * k, T = (m + n) * k;
  return build(r, { text: `어떤 수를 ${M(`${small} : ${big}`)} ${josa(big, '으로', '로')} 비례배분했더니 큰 쪽이 ${J(L, '이었', '였')}습니다. 어떤 수는?`, correct: { v: q(T) },
    wrongs: [{ v: q(small * k), note: '전체 대신 작은 쪽을 구함' }, { v: q(L * big), note: `${L}에 ${J(big, '을', '를')} 곱함 (비례배분의 뜻을 놓침)` }, { v: q(L + small) }],
    fill: nearInt(r, T, 8), fmt: intF, order: 'asc', explain: `큰 쪽은 전체의 ${M(fr(big, small + big))} → 한 칸 ${L} ÷ ${big} = ${k}, 전체 ${small + big}칸 = ${T}` });
};

// ── 다희(초4) 문제지: 분수 기초(초3-2) · 소수의 덧셈과 뺄셈(초4-2) · 끝까지 읽기(문장제·규칙·도형) ──
// 소수 둘째 자리까지를 정수(× 100)로 다룸
const c2 = (x: Q) => Math.round(num(x) * 100);
const D2 = (n: number) => q(n, 100);
// 자리마다 큰 수에서 작은 수를 빼는 실수(받아내림 안 함)
function digitAbsSub(a: number, b: number) { let r = 0, p = 1; while (a > 0 || b > 0) { r += Math.abs((a % 10) - (b % 10)) * p; a = Math.floor(a / 10); b = Math.floor(b / 10); p *= 10; } return r; }
// 받아올림을 하지 않는 실수
function digitNoCarry(a: number, b: number) { let r = 0, p = 1; while (a > 0 || b > 0) { r += (((a % 10) + (b % 10)) % 10) * p; a = Math.floor(a / 10); b = Math.floor(b / 10); p *= 10; } return r; }
const ff = (n: number, d: number) => ({ s: M(fr(n, d)), v: q(n, d) });

// 분수 기초
G['hf-1'] = (r) => { // 먹은/남은 부분
  const n = ri(r, 5, 12), k = (() => { for (;;) { const x = ri(r, 2, n - 2); if (x * 2 !== n) return x; } })(), ate = r() < 0.5, it = pick(r, [['피자', '조각'], ['케이크', '조각'], ['초콜릿', '칸']]);
  const want = ate ? k : n - k, other = ate ? n - k : k;
  return build(r, { text: `${J(it[0], '을', '를')} 똑같이 ${n}${J(it[1], '으로', '로')} 나누어 그중 ${k}${J(it[1], '을', '를')} 먹었습니다. <b>${ate ? '먹은' : '남은'}</b> ${J(it[0], '은', '는')} 전체의 얼마인가요?`,
    correct: ff(want, n), wrongs: [{ ...ff(other, n), note: ate ? '먹은 부분이 아니라 남은 부분을 구함' : '남은 부분이 아니라 먹은 부분을 구함' }, { ...ff(n, want), note: '분자와 분모를 바꿈' }, { ...ff(want, other), note: '전체 대신 나머지 조각 수를 분모로 씀' }, ff(1, want)],
    fill: () => ff(ri(r, 1, n), ri(r, 2, n + 2)), order: 'shuffle', explain: `전체 ${n}${it[1]} 중 ${ate ? '먹은' : '남은'} 것은 ${want}${it[1]} → ${M(fr(want, n))}` });
};
G['hf-2'] = (r) => { // 단위분수 가장 큰/작은
  const ds = shuffle(r, [2, 3, 4, 5, 6, 7, 8, 9, 10, 12]).slice(0, 5), big = r() < 0.6, mn = Math.min(...ds), mxd = Math.max(...ds);
  const want = big ? mn : mxd, opp = big ? mxd : mn;
  return build(r, { text: `다음 중 가장 <b>${big ? '큰' : '작은'}</b> 분수는?`, correct: { s: M(fr(1, want)) },
    wrongs: ds.filter((d) => d !== want).map((d) => ({ s: M(fr(1, d)), note: d === opp ? (big ? '분모가 클수록 큰 분수라고 생각함 (분자가 1이면 분모가 작을수록 큼)' : '분모가 작을수록 작은 분수라고 생각함 (분자가 1이면 분모가 클수록 작음)') : undefined })),
    order: 'shuffle', explain: `분자가 1이면 분모가 작을수록 커요 (똑같이 나눈 조각이 적을수록 한 조각이 큼) → 가장 ${big ? '큰' : '작은'} 것은 ${M(fr(1, want))}` });
};
G['hf-3'] = (r) => { // 단위분수 두 개 비교
  const [a, b] = shuffle(r, [2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 2), A = M(fr(1, a)), B = M(fr(1, b));
  const gt = a < b, opts = [{ s: `${A} > ${B}` }, { s: `${A} < ${B}` }, { s: `${A} = ${B}` }], correct = gt ? opts[0] : opts[1];
  return build(r, { text: `${A} ${josa(1, '과', '와')} ${B} 의 크기를 바르게 비교한 것은?`, correct,
    wrongs: opts.filter((o) => o !== correct).map((o, i) => (i === 0 ? { ...o, note: '분모가 클수록 큰 분수라고 생각함 (분자가 1이면 분모가 작을수록 큼)' } : o)), count: 3, order: 'shuffle',
    explain: `${a}조각으로 나눈 한 조각과 ${b}조각으로 나눈 한 조각 → 적게 나눌수록 한 조각이 커요 → ${gt ? A + ' > ' + B : A + ' < ' + B}` });
};
G['hf-4'] = (r) => { // 분모가 같은 분수 중 가장 큰
  const d = ri(r, 6, 12), ns = shuffle(r, Array.from({ length: d - 1 }, (_, i) => i + 1)).slice(0, 5), mxn = Math.max(...ns), mnn = Math.min(...ns);
  return build(r, { text: '다음 중 가장 큰 분수는?', correct: ff(mxn, d), wrongs: ns.filter((n) => n !== mxn).map((n) => ({ ...ff(n, d), note: n === mnn ? '분자가 작을수록 큰 분수라고 생각함' : undefined })), order: 'shuffle',
    explain: `분모가 같으면 분자가 클수록 커요 → ${M(fr(mxn, d))}` });
};
function partOf(r: Rng): any { const b = ri(r, 3, 8), a = ri(r, 2, b - 1), m = ri(r, 2, 9); if (gcd(a, b) !== 1) return partOf(r); return { a, b, m, N: b * m, ans: a * m }; }
G['hf-5'] = (r) => { // N의 a/b
  const { a, b, m, N, ans } = partOf(r);
  return build(r, { text: `${N}의 ${M(fr(a, b))}${josa(a, '은', '는')} 얼마인가요?`, correct: { v: q(ans) },
    wrongs: [{ v: q(m), note: `${M(fr(1, b))}만큼만 구함 (× ${a} 빠뜨림)` }, ...(N % a === 0 && N / a !== ans ? [{ v: q(N / a), note: `분자(${a})로 나눔` }] : []), { v: q(N - ans), note: '나머지 부분을 구함' }, { v: q(N * a) }],
    fill: nearInt(r, ans, 5), fmt: intF, order: 'asc', explain: `${N}을 ${b}묶음으로 똑같이 나누면 한 묶음 ${m} → ${a}묶음은 ${m} × ${a} = ${ans}` });
};
G['hf-6'] = (r) => { // 문장제 분수만큼
  const { a, b, m, N, ans } = partOf(r), give = r() < 0.5, it = pick(r, [['사탕', '개'], ['색종이', '장'], ['구슬', '개']]), want = give ? ans : N - ans;
  return build(r, { text: `${it[0]} ${N}${it[1]} 중에서 ${M(fr(a, b))}${josa(a, '을', '를')} 동생에게 주었습니다. ${give ? '동생에게 <b>준</b>' : '<b>남은</b>'} ${J(it[0], '은', '는')} 몇 ${it[1]}인가요?`,
    correct: { v: q(want) }, wrongs: [{ v: q(give ? N - ans : ans), note: give ? '준 것이 아니라 남은 것을 구함' : '남은 것이 아니라 준 것을 구함' }, { v: q(m), note: `${M(fr(1, b))}만큼만 구함` }, { v: q(N) }],
    fill: nearInt(r, want, 5), fmt: unit(it[1]), order: 'asc',
    explain: `${N}의 ${M(fr(a, b))}: ${N} ÷ ${b} = ${m}, ${m} × ${a} = ${ans}${give ? '' : ` → 남은 것 ${N} − ${ans} = ${N - ans}`}${it[1]}` });
};
G['hf-7'] = (r) => { // 1시간·1 m의 a/b
  const hour = r() < 0.5, b = hour ? pick(r, [3, 4, 5, 6, 10, 12]) : pick(r, [4, 5, 10]), a = ri(r, 2, b - 1), W = hour ? 60 : 100, ans = (W / b) * a, u = hour ? '분' : ' cm';
  return build(r, { text: `${hour ? '1시간' : '1 m'}의 ${M(fr(a, b))}${josa(a, '은', '는')} 몇 ${hour ? '분' : 'cm'}인가요?`, correct: { v: q(ans) },
    wrongs: [...(a > 1 ? [{ v: q(W / b), note: `${M(fr(1, b))}만큼만 구함 (× ${a} 빠뜨림)` }] : []), { v: q(W - ans), note: '나머지 부분을 구함' }, { v: q(a * 10) }, ...(hour ? [{ v: q((100 / b) * a), note: '1시간을 100분으로 계산함' }] : [{ v: q((60 / b) * a) }])].filter((o) => Number.isInteger(num(o.v!))),
    fill: nearInt(r, ans, 8), fmt: unit(u), order: 'asc', explain: `${hour ? '1시간 = 60분' : '1 m = 100 cm'} → ${W} ÷ ${b} = ${W / b}, × ${a} = ${ans}${u}` });
};
G['hf-8'] = (r) => G['r2-1'](r);
G['hf-9'] = (r) => G['r2-2'](r);
G['hf-10'] = (r) => { // 0.1이 n개
  const n = ri(r, 12, 89), ask = r() < 0.5;
  if (ask) return build(r, { text: `0.1이 ${n}개인 수는?`, correct: { v: q(n, 10) }, wrongs: [{ v: q(n), note: '0.1이 몇 개인지를 그대로 씀' }, { v: q(n, 100), note: '소수점 자리를 잘못 셈' }, { v: q(n * 10) }, { v: q(n, 1000) }],
    fmt: (v) => dec(v), order: 'asc', explain: `0.1이 10개면 1 → 0.1이 ${n}개면 ${dec(q(n, 10))}` });
  return build(r, { text: `${dec(q(n, 10))}${josa(n, '은', '는')} 0.1이 몇 개인 수인가요?`, correct: { v: q(n) }, wrongs: [{ v: q(Math.floor(n / 10)), note: '자연수 부분만 셈' }, { v: q(n % 10 || 1), note: '소수 부분만 셈' }, { v: q(n * 10), note: '0.01로 셈' }],
    fill: nearInt(r, n, 6), fmt: unit('개'), order: 'asc', explain: `1은 0.1이 10개 → ${dec(q(n, 10))} = 0.1이 ${n}개` });
};

// 소수의 덧셈과 뺄셈
G['hd-1'] = (r) => { const n = ri(r, 102, 899); return build(r, { text: `0.01이 ${n}개인 수는?`, correct: { v: D2(n) },
  wrongs: [{ v: q(n, 10), note: '0.1로 셈 (소수점 자리를 잘못 셈)' }, { v: q(n, 1000), note: '소수점 자리를 잘못 셈' }, { v: q(n) }], fill: nearDec(r, D2(n), 100), fmt: (v) => dec(v), order: 'asc',
  explain: `0.01이 100개면 1 → 0.01이 ${n}개면 ${dec(D2(n))}` }); };
G['hd-2'] = (r) => { // 자릿값
  for (;;) { const a = ri(r, 1, 9), b = ri(r, 1, 9), c = ri(r, 1, 9); if (new Set([a, b, c]).size < 3) continue; const which = pick(r, [1, 2]), dgt = which === 1 ? b : c, val = which === 1 ? q(b, 10) : q(c, 100);
    return build(r, { text: `${a}.${b}${c}에서 숫자 ${dgt}${josa(dgt, '이', '가')} 나타내는 수는?`, correct: { v: val },
      wrongs: [{ v: q(dgt), note: '숫자를 그대로 씀 (자리를 생각하지 않음)' }, { v: which === 1 ? q(b, 100) : q(c, 10), note: '자리를 하나 잘못 셈' }, { v: q(dgt * 10) }, { v: q(dgt, 1000) }], fmt: (v) => dec(v), order: 'asc',
      explain: `${a}.${b}${c} → 소수 첫째 자리 ${b}는 ${dec(q(b, 10))}, 둘째 자리 ${c}는 ${dec(q(c, 100))}` }); }
};
G['hd-3'] = (r) => { // 크기 비교 (자릿수가 다른 소수)
  for (;;) { const xs = [q(ri(r, 2, 9), 10), D2(ri(r, 11, 99)), D2(ri(r, 11, 99)), q(ri(r, 1, 9), 10), D2(ri(r, 101, 199) - 100 + ri(r, 0, 0))];
    const uniq = xs.filter((x, i) => xs.findIndex((y) => eq(x, y)) === i); if (uniq.length < 5) continue;
    const mx0 = uniq.reduce((a, b) => (lt(a, b) ? b : a)); if (c2(mx0) % 10 !== 0) continue; // 가장 큰 수가 한 자리 소수일 때 → 함정이 살아남
    const longest = uniq.filter((x) => c2(x) % 10).reduce((a, b) => (c2(a) % 100 > c2(b) % 100 ? a : b));
    return build(r, { text: '다음 중 가장 큰 수는?', correct: { v: mx0 }, wrongs: uniq.filter((x) => x !== mx0).map((x) => ({ v: x, note: x === longest ? '소수점 아래 숫자가 많으면(길면) 크다고 생각함' : undefined })), fmt: (v) => dec(v), order: 'shuffle',
      explain: `소수 첫째 자리부터 비교: ${uniq.map((x) => dec(x)).join(', ')} → ${dec(mx0)}${josa(c2(mx0) / 10, '이', '가')} 가장 커요 (${dec(mx0)} = ${(num(mx0)).toFixed(2)})` }); }
};
G['hd-4'] = (r) => { // 한 자리 소수 + 두 자리 소수
  const a = ri(r, 2, 9), b = ri(r, 11, 99); if (b % 10 === 0) return G['hd-4'](r); const A = q(a, 10), B = D2(b), res = add(A, B);
  return build(r, { text: `다음을 계산한 값은?\n${M(`${dec(A)} + ${dec(B)}`)}`, correct: { v: res },
    wrongs: [{ v: D2(a + b), note: '소수점 자리를 맞추지 않고 더함' }, { v: q(a + b, 1000) }, { v: add(res, q(1, 10)) }, { v: q(a + Math.floor(b / 10), 10) }], fill: nearDec(r, res, 100), fmt: (v) => dec(v), order: 'asc',
    explain: `소수점끼리 줄 맞춰 세로로: ${J(dec(A), '을', '를')} ${J((a / 10).toFixed(2), '으로', '로')} 보고 ${(a / 10).toFixed(2)} + ${dec(B)} = ${dec(res)}` });
};
G['hd-5'] = (r) => { // 두 자리 소수 덧셈 받아올림
  for (;;) { const a = ri(r, 105, 599), b = ri(r, 105, 499); if (a % 10 + b % 10 < 10 || a % 10 === 0 || b % 10 === 0) continue; const s = a + b, nc = digitNoCarry(a, b); if (nc === s) continue;
    return build(r, { text: `다음을 계산한 값은?\n${M(`${dec(D2(a))} + ${dec(D2(b))}`)}`, correct: { v: D2(s) },
      wrongs: [{ v: D2(nc), note: '받아올림을 하지 않음' }, { v: D2(s - 10), note: '받아올림한 1을 더하지 않음' }, { v: D2(s + 100) }], fill: nearDec(r, D2(s), 100), fmt: (v) => dec(v), order: 'asc',
      explain: `소수점 맞춰 세로로, 둘째 자리부터: ${dec(D2(a))} + ${dec(D2(b))} = ${dec(D2(s))} (받아올림 주의)` }); }
};
function decSub(r: Rng, aIn: number, bIn: number, text?: (A: string, B: string) => string, u = '') {
  const A = D2(aIn), B = D2(bIn), res = D2(aIn - bIn), dab = digitAbsSub(aIn, bIn);
  const f = u ? (v: Q) => dec(v) + u : (v: Q) => dec(v);
  return build(r, { text: text ? text(dec(A), dec(B)) : `다음을 계산한 값은?\n${M(`${dec(A)} − ${dec(B)}`)}`, correct: { v: res },
    wrongs: [...(dab !== aIn - bIn ? [{ v: D2(dab), note: '자리마다 큰 수에서 작은 수를 뺌 (받아내림 안 함)' }] : []), { v: D2(aIn - bIn + 100), note: '받아내림한 뒤 1을 빼지 않음' }, { v: add(A, B), note: '빼야 하는데 더함' }],
    fill: nearDec(r, res, 100), fmt: f, order: 'asc', explain: `소수점 맞춰 세로로, 둘째 자리부터 빼요(모자라면 받아내림): ${dec(A)} − ${dec(B)} = ${dec(res)}${u}` });
}
G['hd-6'] = (r) => { for (;;) { const a = ri(r, 21, 69) * 10, b = ri(r, 101, a - 30); if (a % 100 && b % 10 && (a % 100) / 10 < Math.floor((b % 100) / 10) + 1) return decSub(r, a, b); } }; // 3.2 − 1.75 꼴
G['hd-7'] = (r) => { for (;;) { const a = ri(r, 301, 899), b = ri(r, 101, a - 50); if (a % 10 < b % 10 && Math.floor(a / 10) % 10 <= Math.floor(b / 10) % 10) return decSub(r, a, b); } }; // 받아내림 두 번
G['hd-8'] = (r) => { const b = ri(r, 11, 89); return b % 10 ? decSub(r, 100, b) : G['hd-8'](r); }; // 1 − 0.xx
G['hd-9'] = (r) => { // 문장제 덧셈 (자리 다름)
  const a = ri(r, 11, 39), b = ri(r, 11, 99); if (b % 10 === 0 || a % 10 === 0) return G['hd-9'](r); const A = q(a, 10), B = D2(b), res = add(A, B), [x, y] = pick(r, [['물', '주스'], ['우유', '물'], ['물', '식초']]);
  return build(r, { text: `${x} ${dec(A)} L와 ${y} ${dec(B)} L를 섞으면 모두 몇 L인가요?`, correct: { v: res },
    wrongs: [{ v: D2(a + b), note: '소수점 자리를 맞추지 않고 더함' }, { v: sub(B, A)[0] > 0 ? sub(B, A) : sub(A, B), note: '더해야 하는데 뺌' }, { v: add(res, q(1)) }], fill: nearDec(r, res, 100), fmt: (v) => dec(v) + ' L', order: 'asc',
    explain: `${dec(A)} + ${dec(B)} → 소수점 맞춰 ${(a / 10).toFixed(2)} + ${dec(B)} = ${dec(res)} L` });
};
G['hd-10'] = (r) => { for (;;) { const a = ri(r, 15, 49) * 10, b = ri(r, 11, a - 20); if (b % 10 && b < a) return decSub(r, a, b, (A, B) => `끈 ${A} m 중에서 ${B} m를 사용했습니다. 남은 끈은 몇 m인가요?`, ' m'); } };

// 끝까지 읽기: 계산·규칙·도형·문장제
G['hw-1'] = (r) => { // 0이 있는 받아내림 세 자리 뺄셈
  for (;;) { const a = ri(r, 3, 9) * 100 + ri(r, 1, 9), b = ri(r, 111, a - 100); if (Math.floor(b / 10) % 10 === 0 || b % 10 <= a % 10) continue; const d = a - b, dab = digitAbsSub(a, b);
    return build(r, { text: `다음을 계산한 값은?\n$${a} − ${b}$`, correct: { v: q(d) }, wrongs: [{ v: q(dab), note: '자리마다 큰 수에서 작은 수를 뺌 (받아내림 안 함)' }, { v: q(d + 10), note: '0에서 받아내림할 때 실수함' }, { v: q(d + 100), note: '받아내림한 뒤 백의 자리에서 1을 빼지 않음' }, { v: q(a + b), note: '빼야 하는데 더함' }],
      fill: nearInt(r, d, 20), fmt: intF, order: 'asc', explain: `일의 자리부터: ${a % 10}에서 ${b % 10}를 뺄 수 없으니 받아내림 — 십의 자리가 0이라 백의 자리에서 먼저 빌려 와요 → ${a} − ${b} = ${d}` }); }
};
G['hw-2'] = (r) => { // 세 자리 덧셈 받아올림 두 번
  for (;;) { const a = ri(r, 135, 689), b = ri(r, 135, 299); if (a % 10 + b % 10 < 10 || Math.floor(a / 10) % 10 + Math.floor(b / 10) % 10 < 9) continue; const s = a + b, nc = digitNoCarry(a, b); if (s >= 1000) continue;
    return build(r, { text: `다음을 계산한 값은?\n$${a} + ${b}$`, correct: { v: q(s) }, wrongs: [{ v: q(nc), note: '받아올림을 하지 않음' }, { v: q(s - 10), note: '받아올림한 1을 더하지 않음' }, { v: q(s - 100), note: '받아올림한 1을 더하지 않음' }],
      fill: nearInt(r, s, 20), fmt: intF, order: 'asc', explain: `일의 자리부터 더하고 10이 넘으면 받아올림: ${a} + ${b} = ${s}` }); }
};
G['hw-3'] = (r) => { // 곱하는 규칙
  const k = pick(r, [2, 3, 3, 4]), a = ri(r, 1, 4), s = [a, a * k, a * k * k, a * k ** 3], ans = a * k ** 4, last = s[3];
  return build(r, { text: `규칙에 따라 수를 늘어놓았습니다. □ 안에 알맞은 수는?\n${s.join(', ')}, □`, correct: { v: q(ans) },
    wrongs: [...(k !== 2 ? [{ v: q(last * 2), note: '몇 배씩 커지는 규칙을 2배로 착각함' }] : [{ v: q(last * 3), note: '몇 배씩 커지는 규칙을 잘못 봄' }]), { v: q(last + (last - s[2])), note: '같은 수만큼 커지는 규칙으로 착각함' }, { v: q(last + k) }],
    fill: nearInt(r, ans, 20), fmt: intF, order: 'asc', explain: `${s.join(' → ')}: 앞의 수에 ${J(k, '을', '를')} 곱하는 규칙 → ${last} × ${k} = ${ans}` });
};
G['hw-4'] = (r) => { // 커지는 수가 1씩 늘어나는 규칙
  const st = ri(r, 1, 10), d0 = ri(r, 1, 4), s = [st]; for (let i = 0; i < 4; i++) s.push(s[i] + d0 + i); const ans = s[4] + d0 + 4;
  return build(r, { text: `규칙에 따라 수를 늘어놓았습니다. □ 안에 알맞은 수는?\n${s.join(', ')}, □`, correct: { v: q(ans) },
    wrongs: [{ v: q(s[4] + d0 + 3), note: '커지는 수가 늘어나는 규칙을 놓침 (같은 수만큼 더함)' }, { v: q(s[4] + d0), note: '처음 커진 만큼만 더함' }, { v: q(s[4] * 2) }],
    fill: nearInt(r, ans, 6), fmt: intF, order: 'asc', explain: `커지는 수: ${s.slice(1).map((x, i) => '+' + (x - s[i])).join(', ')} → 다음은 +${d0 + 4} → ${s[4]} + ${d0 + 4} = ${ans}` });
};
G['hw-5'] = (r) => { // 나머지 올림
  for (;;) { const c = pick(r, [25, 30, 35, 40, 45]), N = ri(r, 4, 15) * c + ri(r, 1, c - 1); if (N > 600) continue; const fl = Math.floor(N / c), ans = fl + 1;
    const [who, veh, u] = pick(r, [['학생', '버스', '대'], ['사람', '배', '척'], ['학생', '케이블카', '대']]);
    return build(r, { text: `한 ${u}에 ${c}명이 탈 수 있는 ${veh}에 ${who} ${N}명이 모두 타려면 ${J(veh, '은', '는')} 적어도 몇 ${u} 필요한가요?`,
      correct: { v: q(ans) }, wrongs: [{ v: q(fl), note: `남은 ${who}(나머지)을 태울 ${J(veh, '을', '를')} 빠뜨림` }, { v: q(c), note: '한 번에 타는 사람 수를 답함' }, { v: q(N - c) }],
      fill: nearInt(r, ans, 3), fmt: unit(u), order: 'asc', explain: `${N} ÷ ${c} = ${fl} … ${N - fl * c} → 남은 ${N - fl * c}명도 타야 하니 ${fl} + 1 = ${ans}${u}` }); }
};
G['hw-6'] = (r) => { // 나머지 버림
  const c = ri(r, 6, 15), n = ri(r, 4, 12), rem = ri(r, 1, c - 1), N = c * n + rem;
  return build(r, { text: `끈 ${N} cm로 ${c} cm짜리 리본을 만들려고 합니다. 리본은 몇 개까지 만들 수 있나요?`, correct: { v: q(n) },
    wrongs: [{ v: q(n + 1), note: '남는 끈으로도 하나 더 만들 수 있다고 생각함' }, { v: q(rem), note: '몫 대신 나머지를 답함' }, { v: q(N - c) }],
    fill: nearInt(r, n, 3), fmt: unit('개'), order: 'asc', explain: `${N} ÷ ${c} = ${n} … ${rem} → 남는 ${rem} cm로는 리본을 못 만들어요 → ${n}개` });
};
G['hw-7'] = (r) => { // 사각형 나머지 각
  for (;;) { const a = ri(r, 12, 30) * 5, b = ri(r, 12, 30) * 5, c = ri(r, 12, 30) * 5, x = 360 - a - b - c; if (x < 40 || x > 160 || new Set([a, b, c, x]).size < 4) continue;
    return build(r, { text: `사각형의 세 각의 크기가 ${a}°, ${b}°, ${c}°일 때, 나머지 한 각의 크기는?`, correct: { v: q(x) },
      wrongs: [{ v: q(a + b + c), note: '세 각을 더하기만 하고 360°에서 빼지 않음' }, { v: q(pick(r, [a, b, c])), note: '주어진 각 중 하나를 그대로 고름' }, { v: q(x + 10) }],
      fill: () => q(Math.max(5, x + (r() < 0.5 ? -1 : 1) * ri(r, 1, 6) * 5)), fmt: unit('°'), order: 'asc', explain: `사각형의 네 각의 합은 360° → 360° − (${a}° + ${b}° + ${c}°) = ${x}°` }); }
};
G['hw-8'] = (r) => { // 삼각형 나머지 각
  for (;;) { const a = ri(r, 6, 20) * 5, b = ri(r, 6, 20) * 5, x = 180 - a - b; if (x < 20 || a === b) continue;
    return build(r, { text: `삼각형의 두 각의 크기가 ${a}°, ${b}°일 때, 나머지 한 각의 크기는?`, correct: { v: q(x) },
      wrongs: [{ v: q(360 - a - b), note: '삼각형인데 360°에서 뺌 (삼각형 세 각의 합은 180°)' }, { v: q(a + b), note: '두 각을 더하기만 함' }, { v: q(x + 10) }],
      fill: () => q(Math.max(5, x + (r() < 0.5 ? -1 : 1) * ri(r, 1, 6) * 5)), fmt: unit('°'), order: 'asc', explain: `삼각형의 세 각의 합은 180° → 180° − (${a}° + ${b}°) = ${x}°` }); }
};
G['hw-9'] = (r) => { // 먹고 더 사 온
  const N = ri(r, 20, 60), a = ri(r, 5, N - 5), b = ri(r, 5, 30), ans = N - a + b, it = pick(r, ['귤', '사탕', '쿠키']);
  return build(r, { text: `${it} ${N}개 중에서 ${a}개를 먹고, ${b}개를 더 사 왔습니다. 지금 ${J(it, '은', '는')} 몇 개인가요?`, correct: { v: q(ans) },
    wrongs: [{ v: q(N - a), note: '더 사 온 것을 더하지 않음 (끝까지 안 읽음)' }, { v: q(N + a + b), note: '먹은 것을 빼지 않고 더함' }, ...(N - a - b > 0 ? [{ v: q(N - a - b), note: '사 온 것을 빼버림' }] : [])],
    fill: nearInt(r, ans, 6), fmt: unit('개'), order: 'asc', explain: `${N} − ${a} + ${b} = ${ans}개` });
};
G['hw-10'] = (r) => { // 잘못 계산한 수
  const a = ri(r, 8, 30), x = ri(r, a + 5, 80), R = x + a, ans = x - a;
  return build(r, { text: `어떤 수에서 ${J(a, '을', '를')} 빼야 할 것을 잘못하여 더했더니 ${J(R, '이', '가')} 되었습니다. 바르게 계산하면 얼마인가요?`, correct: { v: q(ans) },
    wrongs: [{ v: q(x), note: '어떤 수만 구하고 끝냄 (바르게 계산하기를 빠뜨림)' }, { v: q(R), note: '잘못 계산한 값을 그대로 씀' }, { v: q(R + a) }],
    fill: nearInt(r, ans, 6), fmt: intF, order: 'asc', explain: `어떤 수: ${R} − ${a} = ${x} → 바르게 계산: ${x} − ${a} = ${ans}` });
};

// ── 다연·다혜 도형 보충: 평면도형의 넓이(초5-1) · 원의 둘레와 넓이(초6-2) ──
// 그림(fig)은 docs/math/figure-spec.md 의 type:'shape'. 그림이 안 나와도 글만으로 풀 수 있게 쓴다.
const cm = unit(' cm'), cm2 = unit(' cm²');
const P = (x: number, y: number) => [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
const shape = (pts: Record<string, number[]>, items: any[]) => ({ type: 'shape', pts, items });
const even = (r: Rng, a: number, b: number) => 2 * ri(r, Math.ceil(a / 2), Math.floor(b / 2));
const HALF = '삼각형처럼 ÷ 2를 함';
const NO_HALF = '÷ 2를 빠뜨림';

// 평면도형의 넓이
G['ga-1'] = (r) => { // 평행사변형: 밑변 × 높이 (비스듬한 변 함정)
  let a: number, h: number, s: number; do { a = ri(r, 6, 15); h = ri(r, 3, 10); s = h + ri(r, 1, 4); } while (s === a);
  const off = Math.sqrt(s * s - h * h);
  return { ...build(r, { text: `밑변이 ${a} cm, 높이가 ${h} cm, 다른 한 변이 ${s} cm인 평행사변형의 넓이는?`, correct: { v: q(a * h) },
    wrongs: [{ v: q(a * s), note: '높이 대신 비스듬한 변의 길이를 곱함' }, ...((a * h) % 2 === 0 ? [{ v: q(a * h / 2), note: HALF }] : []), { v: q(2 * (a + s)), note: '넓이 대신 둘레를 구함' }],
    fill: nearInt(r, a * h, 12), fmt: cm2, order: 'asc', explain: `평행사변형의 넓이 = 밑변 × 높이 = ${a} × ${h} = ${a * h} cm² (비스듬한 변 ${s} cm는 쓰지 않아요)` }),
    fig: shape({ A: P(0, 0), B: P(a, 0), C: P(a + off, h), D: P(off, h), _h: P(off, 0) }, [
      { k: 'poly', p: ['A', 'B', 'C', 'D'] }, { k: 'seg', p: ['D', '_h'], dash: true, label: `${h} cm` }, { k: 'right', p: ['D', '_h', 'B'] },
      { k: 'side', p: ['A', 'B'], label: `${a} cm` }, { k: 'side', p: ['A', 'D'], label: `${s} cm` }]) };
};
G['ga-2'] = (r) => { // 삼각형: 밑변 × 높이 ÷ 2
  let a: number, h: number; do { a = ri(r, 6, 16); h = ri(r, 3, 12); } while ((a * h) % 2);
  const ans = a * h / 2, top = ri(r, 1, a - 1);
  return { ...build(r, { text: `밑변이 ${a} cm, 높이가 ${h} cm인 삼각형의 넓이는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(a * h), note: NO_HALF }, { v: q(a + h), note: '밑변과 높이를 더함' }, ...(ans % 2 === 0 ? [{ v: q(ans / 2), note: '÷ 2를 두 번 함' }] : [])],
    fill: nearInt(r, ans, 10), fmt: cm2, order: 'asc', explain: `삼각형의 넓이 = 밑변 × 높이 ÷ 2 = ${a} × ${h} ÷ 2 = ${ans} cm²` }),
    fig: shape({ A: P(0, 0), B: P(a, 0), C: P(top, h), _h: P(top, 0) }, [
      { k: 'poly', p: ['A', 'B', 'C'] }, { k: 'seg', p: ['C', '_h'], dash: true, label: `${h} cm` }, { k: 'right', p: ['C', '_h', 'B'] }, { k: 'side', p: ['A', 'B'], label: `${a} cm` }]) };
};
G['ga-3'] = (r) => { // 둘레로 정사각형 넓이
  const s = ri(r, 3, 12), L = 4 * s, ans = s * s;
  return build(r, { text: `둘레가 ${L} cm인 정사각형의 넓이는?`, correct: { v: q(ans) },
    wrongs: [{ v: q((L / 2) * (L / 2)), note: '둘레를 2로 나눈 값을 한 변으로 씀 (정사각형은 4로 나눠야 함)' }, { v: q(L), note: '둘레를 넓이로 씀' }, { v: q(s * 4 * 2) }],
    fill: nearInt(r, ans, 10), fmt: cm2, order: 'asc', explain: `정사각형은 네 변이 같아요 → 한 변 ${L} ÷ 4 = ${s} cm → 넓이 ${s} × ${s} = ${ans} cm²` });
};
G['ga-4'] = (r) => { // 사다리꼴
  let t: number, b: number, h: number; do { t = ri(r, 3, 9); b = t + ri(r, 2, 8); h = ri(r, 3, 10); } while (((t + b) * h) % 2);
  const ans = (t + b) * h / 2, off = ri(r, 0, b - t);
  return { ...build(r, { text: `윗변이 ${t} cm, 아랫변이 ${b} cm, 높이가 ${h} cm인 사다리꼴의 넓이는?`, correct: { v: q(ans) },
    wrongs: [{ v: q((t + b) * h), note: NO_HALF }, { v: q(b * h), note: '아랫변 × 높이만 함 (윗변을 더하지 않음)' }, { v: q(t * b), note: '윗변과 아랫변을 곱함' }],
    fill: nearInt(r, ans, 10), fmt: cm2, order: 'asc', explain: `사다리꼴의 넓이 = (윗변 + 아랫변) × 높이 ÷ 2 = (${t} + ${b}) × ${h} ÷ 2 = ${ans} cm²` }),
    fig: shape({ A: P(0, 0), B: P(b, 0), C: P(off + t, h), D: P(off, h), _h: P(off, 0) }, [
      { k: 'poly', p: ['A', 'B', 'C', 'D'] }, { k: 'seg', p: ['D', '_h'], dash: true, label: `${h} cm` }, { k: 'right', p: ['D', '_h', 'B'] },
      { k: 'side', p: ['A', 'B'], label: `${b} cm` }, { k: 'side', p: ['D', 'C'], label: `${t} cm` }]) };
};
G['ga-5'] = (r) => { // 마름모
  const d1 = even(r, 4, 16); let d2: number; do { d2 = even(r, 4, 16); } while (d2 === d1);
  const ans = d1 * d2 / 2;
  return { ...build(r, { text: `두 대각선의 길이가 ${d1} cm, ${d2} cm인 마름모의 넓이는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(d1 * d2), note: NO_HALF }, { v: q(d1 * d2 / 4), note: '÷ 4를 함 (마름모는 ÷ 2)' }, { v: q(d1 + d2), note: '두 대각선을 더함' }],
    fill: nearInt(r, ans, 10), fmt: cm2, order: 'asc', explain: `마름모의 넓이 = 한 대각선 × 다른 대각선 ÷ 2 = ${d1} × ${d2} ÷ 2 = ${ans} cm²` }),
    fig: shape({ A: P(0, d2 / 2), B: P(d1 / 2, 0), C: P(d1, d2 / 2), D: P(d1 / 2, d2), _o: P(d1 / 2, d2 / 2) }, [
      { k: 'poly', p: ['A', 'B', 'C', 'D'] }, { k: 'seg', p: ['A', 'C'], dash: true, label: `${d1} cm` }, { k: 'seg', p: ['B', 'D'], dash: true, label: `${d2} cm` }, { k: 'right', p: ['C', '_o', 'D'] }]) };
};
G['ga-6'] = (r) => { // 삼각형 넓이 → 높이
  const a = ri(r, 4, 14), h = even(r, 4, 16), S = a * h / 2, top = ri(r, 1, a - 1);
  return { ...build(r, { text: `넓이가 ${S} cm²이고 밑변이 ${a} cm인 삼각형의 높이는?`, correct: { v: q(h) },
    wrongs: [{ v: q(h / 2), note: '넓이를 밑변으로 나누기만 함 (삼각형은 넓이 × 2 ÷ 밑변)' }, { v: q(S * 2), note: '× 2만 하고 밑변으로 나누지 않음' }, ...(S > a ? [{ v: q(S - a) }] : [])],
    fill: nearInt(r, h, 6), fmt: cm, order: 'asc', explain: `밑변 × 높이 ÷ 2 = 넓이 → ${a} × □ ÷ 2 = ${S} → ${a} × □ = ${S * 2} → □ = ${S * 2} ÷ ${a} = ${h} cm` }),
    fig: shape({ A: P(0, 0), B: P(a, 0), C: P(top, h), _h: P(top, 0) }, [
      { k: 'poly', p: ['A', 'B', 'C'] }, { k: 'seg', p: ['C', '_h'], dash: true, label: '? cm' }, { k: 'right', p: ['C', '_h', 'B'] }, { k: 'side', p: ['A', 'B'], label: `${a} cm` }]) };
};
G['ga-7'] = (r) => { // 사다리꼴 넓이 → 높이
  const t = ri(r, 2, 8), b = t + ri(r, 2, 8), h = even(r, 4, 14), S = (t + b) * h / 2, off = ri(r, 0, b - t);
  return { ...build(r, { text: `넓이가 ${S} cm²이고 윗변이 ${t} cm, 아랫변이 ${b} cm인 사다리꼴의 높이는?`, correct: { v: q(h) },
    wrongs: [{ v: q(h / 2), note: '넓이를 (윗변 + 아랫변)으로 나누기만 함 (× 2를 빠뜨림)' }, ...((S * 2) % b === 0 && S * 2 / b !== h ? [{ v: q(S * 2 / b), note: '윗변을 더하지 않고 아랫변으로만 나눔' }] : []), { v: q(S * 2), note: '× 2만 하고 나누지 않음' }],
    fill: nearInt(r, h, 6), fmt: cm, order: 'asc', explain: `(윗변 + 아랫변) × 높이 ÷ 2 = 넓이 → (${t} + ${b}) × □ ÷ 2 = ${S} → ${t + b} × □ = ${S * 2} → □ = ${h} cm` }),
    fig: shape({ A: P(0, 0), B: P(b, 0), C: P(off + t, h), D: P(off, h), _h: P(off, 0) }, [
      { k: 'poly', p: ['A', 'B', 'C', 'D'] }, { k: 'seg', p: ['D', '_h'], dash: true, label: '? cm' }, { k: 'right', p: ['D', '_h', 'B'] },
      { k: 'side', p: ['A', 'B'], label: `${b} cm` }, { k: 'side', p: ['D', 'C'], label: `${t} cm` }]) };
};
G['ga-8'] = (r) => { // m와 cm 섞인 넓이
  const x = ri(r, 2, 6), y = ri(r, 2, 9) * 10, ans = x * 100 * y;
  return build(r, { text: `가로가 ${x} m, 세로가 ${y} cm인 직사각형의 넓이는 몇 cm²인가요?`, correct: { v: q(ans) },
    wrongs: [{ v: q(x * y), note: '단위를 cm로 맞추지 않고 곱함 (1 m = 100 cm)' }, { v: q(x * 10 * y), note: '1 m를 10 cm로 계산함' }, { v: q(x * 1000 * y), note: '1 m를 1000 cm로 계산함' }, { v: q(2 * (x * 100 + y)), note: '넓이 대신 둘레를 구함' }],
    fill: () => q(ans + (r() < 0.5 ? -1 : 1) * ri(r, 1, 9) * 100), fmt: cm2, order: 'asc', explain: `단위부터 맞추기: ${x} m = ${x * 100} cm → ${x * 100} × ${y} = ${ans} cm²` });
};
G['ga-9'] = (r) => { // 모퉁이를 잘라 낸 도형
  const W = ri(r, 8, 14), H = ri(r, 6, 12), w = ri(r, 2, W - 4), h = ri(r, 2, H - 3), ans = W * H - w * h;
  return { ...build(r, { text: `가로 ${W} cm, 세로 ${H} cm인 직사각형의 한 모퉁이에서 가로 ${w} cm, 세로 ${h} cm인 직사각형을 잘라 냈습니다. 남은 도형의 넓이는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(W * H), note: '잘라 낸 부분을 빼지 않음' }, { v: q(W * H + w * h), note: '잘라 낸 부분을 더함' }, { v: q(2 * (W + H)), note: '넓이 대신 둘레를 구함' }, { v: q((W - w) * (H - h)), note: '남은 부분 중 일부만 구함' }],
    fill: nearInt(r, ans, 10), fmt: cm2, order: 'asc', explain: `큰 직사각형 − 잘라 낸 직사각형 = ${W} × ${H} − ${w} × ${h} = ${W * H} − ${w * h} = ${ans} cm²` }),
    fig: shape({ A: P(0, 0), B: P(W, 0), C: P(W, H - h), D: P(W - w, H - h), E: P(W - w, H), F: P(0, H), _x: P(W, H) }, [
      { k: 'seg', p: ['E', '_x'], dash: true }, { k: 'seg', p: ['_x', 'C'], dash: true },
      { k: 'poly', p: ['A', 'B', 'C', 'D', 'E', 'F'], fill: true }, { k: 'side', p: ['A', 'B'], label: `${W} cm` }, { k: 'side', p: ['F', 'A'], label: `${H} cm` },
      { k: 'side', p: ['E', '_x'], label: `${w} cm` }, { k: 'side', p: ['_x', 'C'], label: `${h} cm` }]) };
};
G['ga-10'] = (r) => { // 평행사변형과 넓이가 같은 삼각형
  const a = ri(r, 4, 12), h = even(r, 4, 12);
  return build(r, { text: `밑변이 ${a} cm, 높이가 ${h} cm인 평행사변형과 넓이가 같은 삼각형을 그리려고 합니다. 삼각형의 밑변을 ${a} cm로 하면 높이는 몇 cm로 해야 하나요?`, correct: { v: q(2 * h) },
    wrongs: [{ v: q(h), note: '삼각형 넓이의 ÷ 2를 생각하지 않음 (높이가 같으면 넓이는 반)' }, { v: q(h / 2), note: '높이를 반으로 줄임 (거꾸로 생각함)' }, { v: q(a * h) }],
    fill: nearInt(r, 2 * h, 6), fmt: cm, order: 'asc', explain: `평행사변형 넓이 ${a} × ${h} = ${a * h} cm² → 삼각형: ${a} × □ ÷ 2 = ${a * h} → □ = ${a * h * 2} ÷ ${a} = ${2 * h} cm (밑변이 같으면 높이를 2배로)` });
};

// 원의 둘레와 넓이 (원주율 3.14) — 값은 분수(Q)로 정확히 계산하고 소수로 씀
const PI = q(314, 100);
const qm = (...xs: (number | Q)[]) => xs.reduce<Q>((acc, x) => mul(acc, typeof x === 'number' ? q(x) : x), q(1));
const dcm = decU(' cm'), dcm2 = decU(' cm²');
const nearPi = (r: Rng, c: Q) => () => add(c, qm(PI, (r() < 0.5 ? -1 : 1) * ri(r, 1, 6)));
const circ = (rad: number, items: any[] = []) => shape({ O: P(0, 0), _a: P(rad, 0), _b: P(-rad, 0) }, [{ k: 'circle', c: 'O', r: rad }, { k: 'dot', p: 'O' }, ...items]);
const PI_T = '(원주율 3.14)';

G['gc-1'] = (r) => { // 반지름 → 원주
  const rad = ri(r, 2, 15), ans = qm(2, rad, PI);
  return { ...build(r, { text: `반지름이 ${rad} cm인 원의 둘레(원주)는? ${PI_T}`, correct: { v: ans },
    wrongs: [{ v: qm(rad, PI), note: '지름 대신 반지름에 원주율을 곱함 (원주 = 지름 × 원주율)' }, { v: qm(rad, rad, PI), note: '둘레 대신 넓이를 구함' }, { v: qm(4, rad, PI), note: '반지름을 지름으로 보고 또 2배 함' }],
    fill: nearPi(r, ans), fmt: dcm, order: 'asc', explain: `지름 = ${rad} × 2 = ${rad * 2} cm → 원주 = 지름 × 원주율 = ${rad * 2} × 3.14 = ${dec(ans)} cm` }),
    fig: circ(rad, [{ k: 'seg', p: ['O', '_a'], label: `${rad} cm` }]) };
};
G['gc-2'] = (r) => { // 지름 → 넓이
  const d = even(r, 4, 20), rad = d / 2, ans = qm(rad, rad, PI);
  return { ...build(r, { text: `지름이 ${d} cm인 원의 넓이는? ${PI_T}`, correct: { v: ans },
    wrongs: [{ v: qm(d, d, PI), note: '반지름 대신 지름을 두 번 곱함 (넓이 = 반지름 × 반지름 × 원주율)' }, { v: qm(d, PI), note: '넓이 대신 원주를 구함' }, { v: qm(rad, PI), note: '반지름 × 원주율만 함 (반지름을 한 번 더 곱해야 함)' }],
    fill: nearPi(r, ans), fmt: dcm2, order: 'asc', explain: `반지름 = ${d} ÷ 2 = ${rad} cm → 넓이 = ${rad} × ${rad} × 3.14 = ${dec(ans)} cm²` }),
    fig: circ(rad, [{ k: 'seg', p: ['_b', '_a'], label: `${d} cm` }]) };
};
G['gc-3'] = (r) => { // 원주 → 지름
  const d = ri(r, 3, 20), C = qm(d, PI);
  return build(r, { text: `둘레(원주)가 ${dec(C)} cm인 원의 지름은? ${PI_T}`, correct: { v: q(d) },
    wrongs: [{ v: q(d, 2), note: '지름 대신 반지름을 구함' }, { v: q(d * 2), note: '지름을 구한 뒤 또 2배 함' }],
    fill: nearInt(r, d, 5), fmt: dcm, order: 'asc', explain: `원주 = 지름 × 3.14 → 지름 = ${dec(C)} ÷ 3.14 = ${d} cm` });
};
G['gc-4'] = (r) => { // 원주 → 넓이 (2단계)
  const rad = ri(r, 2, 10), C = qm(2, rad, PI), ans = qm(rad, rad, PI);
  return build(r, { text: `둘레(원주)가 ${dec(C)} cm인 원의 넓이는? ${PI_T}`, correct: { v: ans },
    wrongs: [{ v: qm(2 * rad, 2 * rad, PI), note: '지름을 반지름처럼 곱함 (지름 ÷ 2 = 반지름)' }, { v: qm(rad, PI), note: '반지름 × 원주율만 함' }, { v: C, note: '넓이 대신 원주를 그대로 씀' }],
    fill: nearPi(r, ans), fmt: dcm2, order: 'asc', explain: `지름 = ${dec(C)} ÷ 3.14 = ${2 * rad} cm, 반지름 = ${rad} cm → 넓이 = ${rad} × ${rad} × 3.14 = ${dec(ans)} cm²` });
};
G['gc-5'] = (r) => { // 반원의 넓이
  const d = even(r, 4, 20), rad = d / 2, ans = qm(rad, rad, PI, q(1, 2));
  return { ...build(r, { text: `지름이 ${d} cm인 원을 반으로 자른 반원의 넓이는? ${PI_T}`, correct: { v: ans },
    wrongs: [{ v: qm(rad, rad, PI), note: '반원인데 2로 나누지 않음' }, { v: qm(d, d, PI, q(1, 2)), note: '반지름 대신 지름을 곱함' }, { v: qm(d, PI, q(1, 2)), note: '넓이 대신 반원의 곡선 길이를 구함' }],
    fill: nearPi(r, ans), fmt: dcm2, order: 'asc', explain: `반지름 ${rad} cm → 원의 넓이 ${rad} × ${rad} × 3.14 = ${dec(qm(rad, rad, PI))} → 반원은 ÷ 2 = ${dec(ans)} cm²` }),
    fig: shape({ O: P(0, 0), _a: P(rad, 0), _b: P(-rad, 0) }, [{ k: 'arc', c: 'O', r: rad, from: 0, to: 180, fill: true }, { k: 'seg', p: ['_b', '_a'], label: `${d} cm` }]) };
};
G['gc-6'] = (r) => { // 반원의 둘레 (곡선 + 지름)
  const d = even(r, 4, 20), arc = qm(d, PI, q(1, 2)), ans = add(arc, q(d));
  return { ...build(r, { text: `지름이 ${d} cm인 반원의 둘레(곡선 부분과 지름을 합한 길이)는? ${PI_T}`, correct: { v: ans },
    wrongs: [{ v: arc, note: '곡선 부분만 구함 (지름을 더하지 않음)' }, { v: add(qm(d, PI), q(d)), note: '반원인데 원 전체의 둘레를 씀' }, { v: add(arc, q(d / 2)), note: '지름 대신 반지름을 더함' }],
    fill: nearPi(r, ans), fmt: dcm, order: 'asc', explain: `곡선 = ${d} × 3.14 ÷ 2 = ${dec(arc)} cm, 여기에 지름 ${d} cm를 더해 ${dec(ans)} cm` }),
    fig: shape({ O: P(0, 0), _a: P(d / 2, 0), _b: P(-d / 2, 0) }, [{ k: 'arc', c: 'O', r: d / 2, from: 0, to: 180 }, { k: 'seg', p: ['_b', '_a'], label: `${d} cm` }]) };
};
G['gc-7'] = (r) => { // 반지름 k배 → 원주·넓이 몇 배
  const k = ri(r, 2, 5), area = r() < 0.6, ans = area ? k * k : k;
  return build(r, { text: `원의 반지름을 ${k}배로 늘이면 ${area ? '넓이' : '둘레(원주)'}는 처음의 몇 배가 되나요?`, correct: { v: q(ans) },
    wrongs: area ? [{ v: q(k), note: '넓이도 반지름처럼 같은 배수라고 생각함 (반지름을 두 번 곱하므로 배수도 두 번)' }, { v: q(2 * k) }, { v: q(k * k * k) }]
      : [{ v: q(k * k), note: '원주를 넓이와 헷갈림 (원주는 반지름에 3.14 × 2를 한 번 곱함)' }, { v: q(2 * k) }, { v: q(k + 1) }],
    fill: nearInt(r, ans, 4), fmt: unit('배'), order: 'asc', explain: area ? `반지름 1인 원과 ${k}인 원: 넓이 1 × 1 × 3.14 와 ${k} × ${k} × 3.14 → ${k * k}배` : `원주 = 반지름 × 2 × 3.14 → 반지름이 ${k}배면 원주도 ${k}배` });
};
G['gc-8'] = (r) => { // 바퀴가 굴러간 거리
  const d = ri(r, 2, 6) * 10, n = ri(r, 3, 10), ans = qm(d, PI, n);
  return build(r, { text: `지름이 ${d} cm인 바퀴가 ${n}바퀴 굴러갔습니다. 바퀴가 굴러간 거리는 몇 cm인가요? ${PI_T}`, correct: { v: ans },
    wrongs: [{ v: qm(d / 2, PI, n), note: '지름 대신 반지름으로 원주를 구함' }, { v: qm(d, PI), note: '한 바퀴만 구함 (바퀴 수를 곱하지 않음)' }, { v: qm(d / 2, d / 2, PI, n), note: '원주 대신 넓이를 구함' }],
    fill: nearPi(r, ans), fmt: dcm, order: 'asc', explain: `한 바퀴 = 원주 = ${d} × 3.14 = ${dec(qm(d, PI))} cm → ${n}바퀴 = ${dec(qm(d, PI))} × ${n} = ${dec(ans)} cm` });
};
G['gc-9'] = (r) => { // 정사각형 − 꼭 맞는 원
  const a = even(r, 4, 20), rad = a / 2, circle = qm(rad, rad, PI), ans = sub(q(a * a), circle);
  return { ...build(r, { text: `한 변이 ${a} cm인 정사각형 안에 꼭 맞게 원을 그렸습니다. 정사각형에서 원을 뺀 부분(색칠한 부분)의 넓이는? ${PI_T}`, correct: { v: ans },
    wrongs: [{ v: circle, note: '원의 넓이만 구함 (구하는 것을 끝까지 안 봄)' }, { v: sub(q(a * a), qm(a, PI)), note: '원의 넓이 대신 원주를 뺌' }, { v: q(a * a), note: '원을 빼지 않음' }],
    fill: nearPi(r, ans), fmt: dcm2, order: 'asc',
    explain: `정사각형 ${a} × ${a} = ${a * a} cm², 원(반지름 ${rad} cm) ${rad} × ${rad} × 3.14 = ${dec(circle)} cm² → ${a * a} − ${dec(circle)} = ${dec(ans)} cm²` }),
    fig: shape({ A: P(-rad, -rad), B: P(rad, -rad), C: P(rad, rad), D: P(-rad, rad), O: P(0, 0) }, [
      { k: 'poly', p: ['A', 'B', 'C', 'D'], fill: true }, { k: 'circle', c: 'O', r: rad, fill: 'bg' }, { k: 'circle', c: 'O', r: rad }, { k: 'side', p: ['A', 'B'], label: `${a} cm` }]) };
};
G['gc-10'] = (r) => { // 피자 1판과 작은 피자 여러 판 (넓이 비교)
  for (;;) {
    const d1 = even(r, 24, 40), n = ri(r, 2, 3), d2 = even(r, 14, d1 - 6), big = d1 * d1, small = n * d2 * d2;
    if (big === small || n * d2 <= d1) continue; // 지름의 합은 작은 쪽이 항상 길게 → 함정
    const r1 = d1 / 2, r2 = d2 / 2, A = qm(r1, r1, PI), B = qm(r2, r2, PI, n);
    const oA = { s: `지름 ${d1} cm 피자 1판이 더 넓다` }, oB = { s: `지름 ${d2} cm 피자 ${n}판이 더 넓다` }, oE = { s: '넓이가 같다' };
    const correct = big > small ? oA : oB;
    return build(r, { text: `지름 ${d1} cm인 피자 1판과 지름 ${d2} cm인 피자 ${n}판 중 어느 쪽의 넓이가 더 넓은가요? (피자는 원 모양, 두께는 같음, 원주율 3.14)`, correct,
      wrongs: [...(correct === oA ? [{ ...oB, note: '지름의 합으로 비교함 (넓이는 반지름 × 반지름 × 원주율)' }] : [oA]), oE], count: 3, order: 'shuffle',
      explain: `1판: ${r1} × ${r1} × 3.14 = ${dec(A)} cm², ${n}판: ${r2} × ${r2} × 3.14 × ${n} = ${dec(B)} cm² → ${big > small ? `${d1} cm 1판` : `${d2} cm ${n}판`}이 더 넓어요` });
  }
};

// ── 다혜: 분수 크기 비교 다시 확인 (u-red 의 크기 비교를 빨리 찍어서 통과) ──
const cmpOpts = (A: string, B: string) => [{ s: `${A} > ${B}` }, { s: `${A} < ${B}` }, { s: `${A} = ${B}` }];
const fs = (f: Q) => M(fr(f[0], f[1]));
function properF(r: Rng, dLo: number, dHi: number): Q { for (;;) { const d = ri(r, dLo, dHi), n = ri(r, 1, d - 1); if (gcd(n, d) === 1) return [n, d]; } }
function cmpBuild(r: Rng, a: Q, b: Q, As: string, Bs: string, note: string, explain: string, lastNum = a[0]) { // lastNum: A를 읽을 때 마지막 소리(분자)
  const opts = cmpOpts(As, Bs), correct = lt(b, a) ? opts[0] : opts[1], opp = correct === opts[0] ? opts[1] : opts[0];
  return build(r, { text: `${As} ${josa(lastNum, '과', '와')} ${Bs} 의 크기를 바르게 비교한 것은?`, correct, wrongs: [{ ...opp, note }, opts[2]], count: 3, order: 'shuffle', explain });
}
G['rc-1'] = (r) => { // 분모가 다른 두 분수 (분모·분자 큰 쪽이 작게)
  for (;;) { const a = properF(r, 3, 9), b = properF(r, 3, 9); if (a[1] === b[1] || eq(a, b)) continue;
    const big = lt(b, a) ? a : b, small = big === a ? b : a; if (!(small[1] > big[1] && small[0] > big[0])) continue;
    const L = lcm(a[1], b[1]);
    return cmpBuild(r, a, b, fs(a), fs(b), '분모·분자가 큰 분수가 더 크다고 생각함 (통분해서 비교해야 함)',
      `통분(분모 ${L}): ${fs(a)} = ${M(fr(a[0] * L / a[1], L))}, ${fs(b)} = ${M(fr(b[0] * L / b[1], L))} → 분자가 큰 ${fs(big)}${josa(big[0], '이', '가')} 더 커요`); }
};
G['rc-2'] = (r) => { // 분자가 같은 두 분수
  for (;;) { const n = ri(r, 1, 5), d1 = ri(r, n + 1, 12), d2 = ri(r, n + 1, 12); if (d1 === d2 || gcd(n, d1) !== 1 || gcd(n, d2) !== 1) continue;
    const a: Q = [n, d1], b: Q = [n, d2];
    return cmpBuild(r, a, b, fs(a), fs(b), '분모가 클수록 큰 분수라고 생각함 (분자가 같으면 분모가 작을수록 큼)',
      `분자가 ${J(n, '으로', '로')} 같으면 똑같이 적게 나눈 쪽(분모가 작은 쪽)의 한 조각이 커요 → ${fs([n, Math.min(d1, d2)])}${josa(n, '이', '가')} 더 커요`); }
};
G['rc-3'] = (r) => { // 가장 큰 분수 (5개)
  for (;;) {
    const fsx: Q[] = []; while (fsx.length < 5) { const f = properF(r, 3, 12); if (!fsx.some((x) => eq(x, f))) fsx.push(f); }
    const mx0 = fsx.reduce((a, b) => (lt(a, b) ? b : a)), lure = fsx.filter((f) => f !== mx0).reduce((a, b) => (b[0] > a[0] || (b[0] === a[0] && b[1] > a[1]) ? b : a));
    if (!(lure[0] > mx0[0] && lure[1] > mx0[1])) continue; // 분모·분자가 다 큰데 더 작은 분수가 있어야 함정
    return build(r, { text: '다음 중 가장 큰 분수는?', correct: { s: fs(mx0) },
      wrongs: fsx.filter((f) => f !== mx0).map((f) => ({ s: fs(f), note: f === lure ? '분모·분자가 큰 분수가 더 크다고 생각함 (통분하거나 소수로 바꿔 비교)' : undefined })), order: 'shuffle',
      explain: `소수로 바꿔 비교(분자 ÷ 분모): ${fsx.map((f) => fs(f) + ' ≈ ' + (Math.round(num(f) * 1000) / 1000)).join(', ')} → ${fs(mx0)}` });
  }
};
G['rc-4'] = (r) => { // 1/2 보다 큰 분수 고르기
  for (;;) {
    const c = properF(r, 3, 7); if (c[0] * 2 <= c[1]) continue;
    const ws: Q[] = []; for (let t = 0; ws.length < 4 && t < 200; t++) { const f = properF(r, 5, 15); if (f[0] * 2 < f[1] && f[0] >= 2 && !ws.some((x) => eq(x, f))) ws.push(f); }
    if (ws.length < 4 || !ws.some((f) => f[0] > c[0])) continue;
    const lure = ws.reduce((a, b) => (b[0] > a[0] ? b : a));
    return build(r, { text: `다음 중 ${M(fr(1, 2))} 보다 <b>큰</b> 분수는?`, correct: { s: fs(c) },
      wrongs: ws.map((f) => ({ s: fs(f), note: f === lure ? '분자가 크면 큰 분수라고 생각함 (분자 × 2와 분모를 비교)' : undefined })), order: 'shuffle',
      explain: `${M(fr(1, 2))} 보다 크려면 분자 × 2 가 분모보다 커야 해요: ${[c, ...ws].map((f) => `${fs(f)} → ${f[0]} × 2 = ${f[0] * 2} ${f[0] * 2 > f[1] ? '>' : '<'} ${f[1]}`).join(', ')}` });
  }
};
G['rc-5'] = (r) => { // 대분수와 가분수
  for (;;) {
    const w = ri(r, 1, 4), f = properF(r, 2, 9), a = add(q(w), f), d2 = ri(r, 2, 9); if (d2 === f[1]) continue;
    const n2 = Math.round(num(a) * d2) + (r() < 0.5 ? -1 : 1) * ri(r, 0, 2), b: Q = [n2, d2];
    if (n2 <= d2 || gcd(n2, d2) !== 1 || eq(a, b) || Math.floor(num(b)) < 1) continue;
    const As = M(`${w}${fr(f[0], f[1])}`), Bs = fs(b), bw = Math.floor(n2 / d2), bf: Q = [n2 % d2, d2];
    const how = bw !== w ? `자연수 부분 ${J(w, '과', '와')} ${bw} 비교` : `자연수가 같으니 분수 부분 ${fs(f)}${josa(f[0], '과', '와')} ${M(fr(bf[0], bf[1]))}${josa(bf[0], '을', '를')} 통분해 비교`;
    const win = lt(b, a) ? As : Bs, winN = lt(b, a) ? f[0] : n2;
    return cmpBuild(r, a, b, As, Bs, '가분수를 대분수로 바꾸지 않고 숫자 크기만 보고 비교함', `${Bs} = ${M(`${bw}${fr(bf[0], bf[1])}`)} 로 바꾸기 → ${how} → ${win}${josa(winN, '이', '가')} 더 커요`, f[0]);
  }
};

// ── 입체도형 보충(초6): 각기둥·각뿔, 직육면체 부피·겉넓이, 원기둥·원뿔·구 ──
// 그림은 type:'solid'(HQ 구현 예정)·'shape'. 글만으로 풀 수 있게 쓴다.
const KO = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
const koN = (n: number) => (n >= 10 ? (n >= 20 ? KO[Math.floor(n / 10)] : '') + '십' : '') + KO[n % 10]; // 1~99
const cm3 = unit(' cm³'), ea = unit('개');
const PRISM_E = '각기둥과 각뿔을 헷갈림';
G['gs-1'] = (r) => { // n각기둥의 모서리 수
  const n = ri(r, 3, 9), name = `${koN(n)}각기둥`;
  return { ...build(r, { text: `${name}의 모서리는 모두 몇 개인가요?`, correct: { v: q(3 * n) },
    wrongs: [{ v: q(2 * n), note: '꼭짓점의 수를 셈 (모서리 = 밑면의 변 × 3)' }, { v: q(n + 2), note: '면의 수를 셈' }, { v: q(n), note: '한 밑면의 변만 셈 (위·아래 밑면과 옆 모서리를 모두 세야 함)' }],
    fill: nearInt(r, 3 * n, 4), fmt: ea, order: 'asc', explain: `${name}: 위 밑면 ${n}개 + 아래 밑면 ${n}개 + 옆 모서리 ${n}개 = ${n} × 3 = ${3 * n}개` }),
    fig: { type: 'solid', kind: 'prism', n, r: 3, h: 5 } };
};
G['gs-2'] = (r) => { // n각뿔의 면·꼭짓점·모서리
  const n = ri(r, 3, 9), name = `${koN(n)}각뿔`, ask = pick(r, ['면', '꼭짓점', '모서리'] as const);
  const ans = ask === '모서리' ? 2 * n : n + 1, prism = ask === '면' ? n + 2 : ask === '꼭짓점' ? 2 * n : 3 * n;
  const why = ask === '면' ? `밑면 1개 + 옆면 ${n}개 = ${n + 1}개` : ask === '꼭짓점' ? `밑면의 꼭짓점 ${n}개 + 각뿔의 꼭짓점 1개 = ${n + 1}개` : `밑면의 모서리 ${n}개 + 옆 모서리 ${n}개 = ${2 * n}개`;
  return { ...build(r, { text: `${name}의 <b>${ask}</b>${josa(ask, '은', '는')} 모두 몇 개인가요?`, correct: { v: q(ans) },
    wrongs: [{ v: q(prism), note: `${PRISM_E} (${koN(n)}각기둥의 ${ask} 수)` }, { v: q(n), note: '밑면만 생각함' }, ...(ask !== '모서리' ? [{ v: q(2 * n), note: '모서리 수와 헷갈림' }] : [{ v: q(n + 1), note: '면(꼭짓점)의 수와 헷갈림' }])],
    fill: nearInt(r, ans, 4), fmt: ea, order: 'asc', explain: `${name}: ${why}` }),
    fig: { type: 'solid', kind: 'pyramid', n, r: 3, h: 5 } };
};
G['gs-3'] = (r) => { // 모서리 수 → 각기둥 이름
  const n = ri(r, 3, 10), E = 3 * n, nm = (k: number, s = '각기둥') => ({ s: `${koN(k)}${s}` });
  return build(r, { text: `모서리가 ${E}개인 각기둥의 이름은?`, correct: nm(n),
    wrongs: [...(E % 2 === 0 ? [{ ...nm(E / 2), note: '각뿔처럼 모서리 ÷ 2를 함 (각기둥은 모서리 = 밑면의 변 × 3)' }] : []), ...(E < 100 ? [{ ...nm(E), note: '모서리 수를 그대로 이름에 씀' }] : []), { ...nm(n, '각뿔'), note: PRISM_E }, nm(n + 1), nm(n - 1 >= 3 ? n - 1 : n + 2)],
    order: 'shuffle', explain: `각기둥의 모서리 = 밑면의 변 × 3 → 밑면의 변 = ${E} ÷ 3 = ${n} → ${koN(n)}각기둥` });
};
const cuboidFig = (a: number, b: number, c: number) => ({ type: 'solid', kind: 'cuboid', a, b, c, labels: { a: `${a} cm`, b: `${b} cm`, c: `${c} cm` } });
function abc(r: Rng) { for (;;) { const a = ri(r, 3, 12), b = ri(r, 2, 10), c = ri(r, 2, 9); if (a !== b && b !== c && a !== c) return [a, b, c]; } }
G['gs-4'] = (r) => { // 직육면체 부피
  const [a, b, c] = abc(r), V = a * b * c, S = 2 * (a * b + b * c + c * a);
  return { ...build(r, { text: `가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체의 부피는?`, correct: { v: q(V) },
    wrongs: [{ v: q(a * b), note: '높이를 곱하지 않음 (밑면의 넓이만 구함)' }, { v: q(S), note: '부피 대신 겉넓이를 구함' }, { v: q(a + b + c), note: '세 모서리를 더함' }],
    fill: nearInt(r, V, 20), fmt: cm3, order: 'asc', explain: `직육면체의 부피 = 가로 × 세로 × 높이 = ${a} × ${b} × ${c} = ${V} cm³` }), fig: cuboidFig(a, b, c) };
};
G['gs-5'] = (r) => { // 정육면체 겉넓이
  let a: number; do { a = ri(r, 2, 10); } while (a === 6 || a === 4);
  return { ...build(r, { text: `한 모서리의 길이가 ${a} cm인 정육면체의 겉넓이는?`, correct: { v: q(6 * a * a) },
    wrongs: [{ v: q(a * a * a), note: '겉넓이 대신 부피를 구함' }, { v: q(4 * a * a), note: '옆면 4개만 구함 (정육면체의 면은 6개)' }, { v: q(12 * a), note: '모서리 길이의 합을 구함' }, { v: q(a * a), note: '한 면의 넓이만 구함' }],
    fill: nearInt(r, 6 * a * a, 20), fmt: cm2, order: 'asc', explain: `정육면체는 넓이가 같은 정사각형 6개 → ${a} × ${a} × 6 = ${6 * a * a} cm²` }), fig: { type: 'solid', kind: 'cuboid', a, b: a, c: a, labels: { a: `${a} cm` } } };
};
G['gs-6'] = (r) => { // 직육면체 겉넓이
  const [a, b, c] = abc(r), half = a * b + b * c + c * a;
  return { ...build(r, { text: `가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체의 겉넓이는?`, correct: { v: q(2 * half) },
    wrongs: [{ v: q(half), note: '× 2를 빠뜨림 (마주 보는 면이 2개씩)' }, { v: q(a * b * c), note: '겉넓이 대신 부피를 구함' }, { v: q(4 * (a + b + c)), note: '모서리 길이의 합을 구함' }],
    fill: nearInt(r, 2 * half, 20), fmt: cm2, order: 'asc', explain: `서로 다른 세 면: ${a} × ${b} = ${a * b}, ${b} × ${c} = ${b * c}, ${c} × ${a} = ${c * a} → 합 ${half} × 2 = ${2 * half} cm²` }), fig: cuboidFig(a, b, c) };
};
G['gs-7'] = (r) => { // 부피 → 높이
  const [a, b, c] = abc(r), V = a * b * c;
  return { ...build(r, { text: `부피가 ${V} cm³이고 가로가 ${a} cm, 세로가 ${b} cm인 직육면체의 높이는?`, correct: { v: q(c) },
    wrongs: [{ v: q(b * c), note: '가로로만 나눔 (가로 × 세로로 나눠야 함)' }, { v: q(V - a * b), note: '나누지 않고 뺌' }, ...(V % (a + b) === 0 ? [{ v: q(V / (a + b)), note: '가로와 세로를 더해서 나눔' }] : [])],
    fill: nearInt(r, c, 4), fmt: cm, order: 'asc', explain: `가로 × 세로 × 높이 = 부피 → ${a} × ${b} × □ = ${V} → □ = ${V} ÷ ${a * b} = ${c} cm` }), fig: { type: 'solid', kind: 'cuboid', a, b, c, labels: { a: `${a} cm`, b: `${b} cm`, c: '? cm' } } };
};
G['gs-8'] = (r) => { // 원기둥 전개도 옆면의 가로
  const rad = ri(r, 2, 10), h = ri(r, 3, 15), w = qm(2, rad, PI), W = num(w);
  return { ...build(r, { text: `밑면의 반지름이 ${rad} cm, 높이가 ${h} cm인 원기둥의 전개도에서 옆면(직사각형)의 가로 길이는? ${PI_T}`, correct: { v: w },
    wrongs: [{ v: qm(rad, PI), note: '지름 대신 반지름에 원주율을 곱함 (옆면의 가로 = 밑면의 둘레)' }, { v: q(h), note: '높이를 씀 (높이는 옆면의 세로)' }, { v: qm(rad, rad, PI), note: '밑면의 둘레 대신 넓이를 구함' }],
    fill: nearPi(r, w), fmt: dcm, order: 'asc', explain: `옆면의 가로 = 밑면의 둘레 = ${rad * 2} × 3.14 = ${dec(w)} cm (세로는 높이 ${h} cm)` }),
    fig: shape({ _A: P(0, 0), _B: P(W, 0), _C: P(W, h), _D: P(0, h), _O1: P(W / 2, h + rad), _O2: P(W / 2, -rad), _r: P(W / 2 + rad, h + rad) }, [
      { k: 'poly', p: ['_A', '_B', '_C', '_D'] }, { k: 'circle', c: '_O1', r: rad }, { k: 'circle', c: '_O2', r: rad }, { k: 'seg', p: ['_O1', '_r'], label: `${rad} cm` },
      { k: 'side', p: ['_A', '_B'], label: '? cm' }, { k: 'side', p: ['_D', '_A'], label: `${h} cm` }]) };
};
G['gs-9'] = (r) => { // 직사각형을 돌린 원기둥
  let a: number, b: number; do { a = ri(r, 2, 9); b = ri(r, 3, 12); } while (a === b || 2 * a === b || 2 * b === a);
  const ask = pick(r, ['지름', '높이'] as const), ans = ask === '지름' ? 2 * a : b;
  return { ...build(r, { text: `가로 ${a} cm, 세로 ${b} cm인 직사각형을 세로를 축으로 하여 한 바퀴 돌려 원기둥을 만들었습니다. 원기둥의 ${ask === '지름' ? '<b>밑면의 지름</b>은' : '<b>높이</b>는'} 몇 cm인가요?`, correct: { v: q(ans) },
    wrongs: ask === '지름' ? [{ v: q(a), note: '반지름을 지름으로 씀 (축에서 떨어진 가로가 반지름)' }, { v: q(b), note: '축이 된 세로를 씀 (세로는 높이)' }, { v: q(2 * b), note: '축이 된 변을 반지름으로 봄' }]
      : [{ v: q(a), note: '가로를 높이로 봄 (축이 된 세로가 높이)' }, { v: q(2 * a), note: '밑면의 지름과 헷갈림' }, { v: q(2 * b) }],
    fill: nearInt(r, ans, 4), fmt: cm, order: 'asc', explain: `축(세로 ${b} cm)이 원기둥의 높이, 축에서 떨어진 가로 ${a} cm가 밑면의 반지름 → ${ask === '지름' ? `지름 ${a} × 2 = ${2 * a} cm` : `높이 ${b} cm`}` }),
    fig: shape({ _A: P(0, 0), _B: P(a, 0), _C: P(a, b), _D: P(0, b), _t: P(0, b + 1.5), _u: P(0, -1.5) }, [
      { k: 'seg', p: ['_u', '_t'], dash: true }, { k: 'poly', p: ['_A', '_B', '_C', '_D'], fill: true }, { k: 'side', p: ['_A', '_B'], label: `${a} cm` }, { k: 'side', p: ['_D', '_A'], label: `${b} cm` }]) };
};
G['gs-10'] = (r) => { // 직각삼각형을 돌린 원뿔: 모선·반지름
  const [x, y, z] = pick(r, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = z > 13 ? 1 : pick(r, [1, 2, 3]);
  const [rad, h] = r() < 0.5 ? [x * k, y * k] : [y * k, x * k], l = z * k, ask = pick(r, ['모선의 길이', '밑면의 반지름'] as const);
  const ans = ask === '모선의 길이' ? l : rad;
  return { ...build(r, { text: `직각을 낀 두 변이 ${rad} cm, ${h} cm이고 빗변이 ${l} cm인 직각삼각형을 ${h} cm인 변을 축으로 하여 한 바퀴 돌려 원뿔을 만들었습니다. 원뿔의 <b>${ask}</b>${josa(ask, '은', '는')} 몇 cm인가요?`, correct: { v: q(ans) },
    wrongs: ask === '모선의 길이' ? [{ v: q(h), note: '높이를 모선으로 봄 (모선은 꼭짓점과 밑면 둘레를 잇는 선분 = 빗변)' }, { v: q(rad), note: '밑면의 반지름을 씀' }, { v: q(2 * rad), note: '밑면의 지름을 씀' }]
      : [{ v: q(h), note: '축이 된 변을 반지름으로 봄 (축은 원뿔의 높이)' }, { v: q(l), note: '빗변을 반지름으로 봄 (빗변은 모선)' }, { v: q(2 * rad), note: '반지름 대신 지름을 구함' }],
    fill: nearInt(r, ans, 4), fmt: cm, order: 'asc', explain: `축 ${h} cm = 높이, 다른 변 ${rad} cm = 밑면의 반지름, 빗변 ${l} cm = 모선 → ${ask} ${ans} cm` }),
    fig: shape({ _O: P(0, 0), _A: P(rad, 0), _T: P(0, h), _u: P(0, -h * 0.15), _t: P(0, h * 1.15) }, [
      { k: 'seg', p: ['_u', '_t'], dash: true }, { k: 'poly', p: ['_O', '_A', '_T'], fill: true }, { k: 'right', p: ['_A', '_O', '_T'] },
      { k: 'side', p: ['_O', '_A'], label: `${rad} cm` }, { k: 'side', p: ['_T', '_O'], label: `${h} cm` }, { k: 'side', p: ['_A', '_T'], label: `${l} cm` }]) };
};

// ── 중1 문장을 식으로 · 일차방정식 활용 (다연·다혜, 작년 도농중 2학기 기말 1~6번 유형) ──
// 답이 0·음수일 수 있어 signed 보기를 쓴다. 식 보기는 문자열(s)로 만든다.
const mi = (n: number) => (n < 0 ? '−' + -n : String(n));
const iF = (v: Q) => M(mi(v[0] / v[1]));
const frs = (n: string | number, d: string | number) => `[[${n}|${d}]]`;
// 일차식 쓰기: [[계수, 문자]…] → "3x − 2"
function poly(terms: [number, string][]) {
  let s = '';
  for (const [c, v] of terms) {
    if (c === 0) continue;
    const a = Math.abs(c), body = v ? (a === 1 ? '' : a) + v : String(a);
    s += s ? (c < 0 ? ' − ' : ' + ') + body : (c < 0 ? '−' : '') + body;
  }
  return s || '0';
}
const nz = (r: Rng, a: number, b: number) => { for (;;) { const x = ri(r, a, b); if (x) return x; } };
const intQ = (n: number, d: number) => d !== 0 && n % d === 0;
const nearZ = (r: Rng, c: number, span = 5) => () => q(c + (r() < 0.5 ? -1 : 1) * ri(r, 1, span)); // 0·음수도 채움

// 문자와 식
G['mw-1'] = (r) => { // 곱셈·나눗셈 기호 생략
  const [x, y] = pick(r, [['x', 'y'], ['a', 'b']]);
  if (r() < 0.5) {
    const k = ri(r, 2, 9);
    return build(r, { text: `${M(`${x} ÷ ${y} × ${k}`)} ${josa(k, '을', '를')} 곱셈 기호와 나눗셈 기호를 생략하여 나타낸 것은?`, correct: { s: M(frs(k + x, y)) },
      wrongs: [{ s: M(frs(x, k + y)), note: '÷ 뒤에 오는 것을 모두 분모로 보냄 (앞에서부터 차례로 계산)' }, { s: M(`${k}${x}${y}`), note: '÷ 를 × 로 바꿔 씀' }, { s: M(frs(k + y, x)), note: '나누어지는 수와 나누는 수를 바꿈' }, { s: M(frs(x + y, k)) }],
      order: 'shuffle', explain: `${M(`${x} ÷ ${y} × ${k} = ${x} × ${frs(1, y)} × ${k} = ${frs(k + x, y)}`)} (÷ 는 역수를 곱하기, 숫자는 문자 앞에)` });
  }
  const k = ri(r, 2, 9), m = ri(r, 2, 9);
  return build(r, { text: `${M(`${x} × ${x} × ${k} − ${y} ÷ ${m}`)} ${josa(m, '을', '를')} 곱셈 기호와 나눗셈 기호를 생략하여 나타낸 것은?`, correct: { s: M(`${k}${x}^2 − ${frs(y, m)}`) },
    wrongs: [{ s: M(`${2 * k}${x} − ${frs(y, m)}`), note: `같은 문자의 곱을 2배로 씀 (${x} × ${x} = ${x}^2)` }, { s: M(`${k}${x}^2 − ${m}${y}`), note: '÷ 를 × 로 바꿔 씀' }, { s: M(`${k}${x}^2 − ${frs(m, y)}`), note: '나누는 수를 분자로 씀' }, { s: M(`${x}^${k} − ${frs(y, m)}`), note: '곱하는 수를 지수로 씀' }],
    order: 'shuffle', explain: `${M(`${x} × ${x} = ${x}^2`)}, 숫자는 앞으로 → ${M(`${k}${x}^2`)} / ${M(`${y} ÷ ${m} = ${frs(y, m)}`)} → ${M(`${k}${x}^2 − ${frs(y, m)}`)}` });
};
G['mw-2'] = (r) => { // 문장을 식으로
  const t = pick(r, ['time', 'sale', 'digit', 'salt'] as const);
  if (t === 'time') {
    const v = ri(r, 3, 9) * pick(r, [1, 10]);
    return build(r, { text: `${M('x')} km의 거리를 시속 ${v} km로 갈 때 걸리는 시간을 식으로 나타낸 것은?`, correct: { s: `${M(frs('x', v))}시간` },
      wrongs: [{ s: `${M(`${v}x`)}시간`, note: '거리 × 속력을 함 (시간 = 거리 ÷ 속력)' }, { s: `${M(frs(v, 'x'))}시간`, note: '속력 ÷ 거리를 함' }, { s: `${M(`x + ${v}`)}시간` }, { s: `${M(`x − ${v}`)}시간` }],
      order: 'shuffle', explain: `시간 = 거리 ÷ 속력 = ${M(`x ÷ ${v} = ${frs('x', v)}`)}(시간)` });
  }
  if (t === 'sale') {
    const p = pick(r, [10, 20, 25, 30, 40, 60]), f = (n: number) => { const g = gcd(n, 100); return n === 100 ? 'a' : frs(n / g, 100 / g) + 'a'; };
    return build(r, { text: `정가가 ${M('a')}원인 물건을 ${p}% 할인한 가격을 식으로 나타낸 것은?`, correct: { s: `${M(f(100 - p))}원` },
      wrongs: [{ s: `${M(f(p))}원`, note: '할인한 금액만 구함 (가격 = 정가 − 할인 금액)' }, { s: `${M(`a − ${p}`)}원`, note: '%를 그대로 뺌 (a의 ' + p + '% = ' + frs(p, 100) + 'a)' }, { s: `${M(f(100 + p))}원`, note: '할인 금액을 더함' }, { s: `${M(`${100 - p}a`)}원` }],
      order: 'shuffle', explain: `할인 금액 = ${M(`a × ${frs(p, 100)} = ${f(p)}`)} → 가격 = ${M(`a − ${f(p)} = ${f(100 - p)}`)}(원)` });
  }
  if (t === 'digit') {
    return build(r, { text: `십의 자리의 숫자가 ${M('a')}, 일의 자리의 숫자가 ${M('b')}인 두 자리 자연수를 식으로 나타낸 것은?`, correct: { s: M('10a + b') },
      wrongs: [{ s: M('ab'), note: '숫자를 나란히 씀 (ab 는 a × b)' }, { s: M('a + b'), note: '자릿값을 생각하지 않음' }, { s: M('10b + a'), note: '십의 자리와 일의 자리를 바꿈' }, { s: M('10(a + b)') }],
      order: 'shuffle', explain: '예: 십의 자리 3, 일의 자리 7 → 37 = 10 × 3 + 7 → $10a + b$' });
  }
  const x = pick(r, [3, 4, 5, 6, 8, 10, 12, 15]);
  return build(r, { text: `농도가 ${x}%인 소금물 ${M('y')} g에 들어 있는 소금의 양을 식으로 나타낸 것은?`, correct: { s: `${M(frs(x + 'y', 100))} g` },
    wrongs: [{ s: `${M(`${x}y`)} g`, note: '100으로 나누지 않음 (x% = x/100)' }, { s: `${M(frs(x, 100))} g`, note: '소금물의 양을 곱하지 않음' }, { s: `${M(frs('100y', x))} g`, note: '분모와 분자를 바꿈' }, { s: `${M(frs('y', 100 * x))} g` }],
    order: 'shuffle', explain: `소금의 양 = 소금물의 양 × ${M(frs('농도', 100))} = ${M(`y × ${frs(x, 100)} = ${frs(x + 'y', 100)}`)}(g)` });
};
G['mw-3'] = (r) => { // 항등식: 계수 비교
  for (;;) {
    const k = ri(r, 2, 5), b = nz(r, -5, 5), d = ri(r, -6, 6), c = k * b + d; if (c === 0) continue;
    const a = k, ans = a + b, lhs = `ax ${c < 0 ? '−' : '+'} ${Math.abs(c)}`, rhs = `${k}(x + b)${d ? ` ${d < 0 ? '−' : '+'} ${Math.abs(d)}` : ''}`;
    const w: Opt[] = [{ v: q(a), note: 'b의 값을 구하지 않음 (구하는 것은 a + b)' }, { v: q(a - b), note: 'a − b 를 구함' }];
    if (intQ(c + d, k)) w.push({ v: q(a + (c + d) / k), note: '상수항을 이항할 때 부호를 바꾸지 않음' });
    if (intQ(c - d, 1) && c - d !== b) w.push({ v: q(a + c - d), note: `b에 ${J(k, '을', '를')} 곱하는 것을 빠뜨림 (${k}(x + b) = ${k}x + ${k}b)` });
    w.push({ v: q(a * b) });
    return build(r, { text: `다음 등식이 ${M('x')}에 대한 항등식일 때, 상수 ${M('a')}, ${M('b')}에 대하여 ${M('a + b')}의 값은?\n${M(`${lhs} = ${rhs}`)}`, correct: { v: q(ans) }, wrongs: w,
      fill: nearZ(r, ans, 5), fmt: iF, order: 'asc', signed: true,
      explain: `우변을 정리: ${M(`${k}x + ${k}b${d ? (d < 0 ? ' − ' : ' + ') + Math.abs(d) : ''}`)} → x의 계수: ${M(`a = ${k}`)}, 상수항: ${M(`${mi(c)} = ${k}b${d ? (d < 0 ? ' − ' : ' + ') + Math.abs(d) : ''}`)} → ${M(`b = ${mi(b)}`)} → ${M(`a + b = ${mi(ans)}`)}` });
  }
};

// 일차방정식의 해
G['mw-4'] = (r) => { // 해가 주어질 때 상수
  for (;;) {
    const s = pick(r, [-3, -2, 2, 3, 4, 5]), b = ri(r, 1, 5), a = nz(r, -3, 7), d = nz(r, -9, 9); if (a === b) continue;
    const c = a * s - b * s - d; if (c <= 0 || c > 30) continue;
    const eqs = `ax − ${c} = ${poly([[b, 'x'], [d, '']])}`, w: Opt[] = [{ v: q(s), note: `해(${M('x')}의 값)를 답으로 씀` }];
    if (intQ(b * s + d - c, s)) w.push({ v: q((b * s + d - c) / s), note: '상수항을 이항할 때 부호를 바꾸지 않음' });
    if (s < 0 && intQ(-b * s + c + d, s)) w.push({ v: q((-b * s + c + d) / s), note: '음수를 대입할 때 부호 실수' });
    w.push({ v: q(-a) });
    return build(r, { text: `${M('x')}에 대한 일차방정식 ${M(eqs)} 의 해가 ${M(`x = ${mi(s)}`)} 일 때, 상수 ${M('a')}의 값은?`, correct: { v: q(a) }, wrongs: w,
      fill: nearZ(r, a, 5), fmt: iF, order: 'asc', signed: true,
      explain: `${M(`x = ${mi(s)}`)}${josa(Math.abs(s), '을', '를')} 대입: ${M(`${s < 0 ? `(${mi(s)})` : s}a − ${c} = ${b === 1 ? '' : b + ' × '}${s < 0 ? `(${mi(s)})` : s}${d ? (d < 0 ? ' − ' : ' + ') + Math.abs(d) : ''}`)} → ${M(`${mi(s)}a = ${mi(b * s + d + c)}`)} → ${M(`a = ${mi(a)}`)}` });
  }
};
G['mw-5'] = (r) => { // 두 방정식의 해가 같을 때
  for (;;) {
    const p = ri(r, 2, 5), s = nz(r, -4, 6), qq = nz(r, -9, 9), rr = p * s + qq, a = nz(r, -4, 6), n = ri(r, 1, 6); if (a === n) continue;
    const m = n * s - a * s; if (m === 0) continue;
    const w: Opt[] = [{ v: q(s), note: `첫 번째 방정식의 해만 구하고 끝냄 (구하는 것은 ${M('a')})` }, { v: q(-a) }];
    if (intQ(rr + qq, p)) { const s2 = (rr + qq) / p; if (s2 && intQ(n * s2 - m, s2)) w.push({ v: q((n * s2 - m) / s2), note: '첫 번째 방정식에서 이항할 때 부호를 바꾸지 않음' }); }
    if (intQ(n * s + m, s)) w.push({ v: q((n * s + m) / s), note: `두 번째 방정식에서 ${J(Math.abs(m), '을', '를')} 이항할 때 부호 실수` });
    return build(r, { text: `두 일차방정식 ${M(`${poly([[p, 'x'], [qq, '']])} = ${mi(rr)}`)}, ${M(`ax ${m < 0 ? '−' : '+'} ${Math.abs(m)} = ${poly([[n, 'x']])}`)} 의 해가 서로 같을 때, 상수 ${M('a')}의 값은?`, correct: { v: q(a) }, wrongs: w,
      fill: nearZ(r, a, 5), fmt: iF, order: 'asc', signed: true,
      explain: `첫 번째 식: ${M(`${p}x = ${mi(rr)} ${qq < 0 ? '+' : '−'} ${Math.abs(qq)} = ${mi(p * s)}`)} → ${M(`x = ${mi(s)}`)} → 두 번째 식에 대입: ${M(`${s === 1 ? '' : s === -1 ? '−' : mi(s)}a ${m < 0 ? '−' : '+'} ${Math.abs(m)} = ${mi(n * s)}`)} → ${M(`a = ${mi(a)}`)}` });
  }
};
G['mw-6'] = (r) => { // 괄호가 있는 일차방정식
  for (;;) {
    const k = ri(r, 2, 5), a = ri(r, 1, 6), m = ri(r, 1, 6), x0 = nz(r, -5, 8); if (m === k) continue;
    const b = k * (x0 - a) - m * x0; if (b === 0) continue;
    const xs = (v: Q) => M(`x = ${mi(v[0] / v[1])}`), w: Opt[] = [];
    if (intQ(b + a, k - m)) w.push({ v: q((b + a) / (k - m)), note: '괄호를 풀 때 뒤 항에 곱하지 않음' });
    if (intQ(b - k * a, k - m)) w.push({ v: q((b - k * a) / (k - m)), note: '상수항을 이항할 때 부호를 바꾸지 않음' });
    if (intQ(b + k * a, k + m)) w.push({ v: q((b + k * a) / (k + m)), note: 'x항을 이항할 때 부호를 바꾸지 않음' });
    w.push({ v: q(-x0) });
    return build(r, { text: `일차방정식 ${M(`${k}(x − ${a}) = ${poly([[m, 'x'], [b, '']])}`)} 의 해는?`, correct: { v: q(x0) }, wrongs: w,
      fill: nearZ(r, x0, 5), fmt: xs, order: 'asc', signed: true,
      explain: `괄호 풀기: ${M(`${k}x − ${k * a} = ${poly([[m, 'x'], [b, '']])}`)} → 이항: ${M(`${k}x − ${m === 1 ? '' : m}x = ${mi(b)} + ${k * a}`)} → ${k - m === 1 ? '' : `${M(`${poly([[k - m, 'x']])} = ${mi(b + k * a)}`)} → `}${M(`x = ${mi(x0)}`)}` });
  }
};

// 일차방정식의 활용
G['mw-7'] = (r) => { // 나이
  for (;;) {
    const P = ri(r, 33, 48), C = ri(r, 5, 14), k = pick(r, [2, 3, 4]); if ((P - k * C) <= 0 || !intQ(P - k * C, k - 1)) continue;
    const x = (P - k * C) / (k - 1); if (x < 2 || x > 20) continue;
    const pa = pick(r, ['어머니', '아버지']), ch = pick(r, ['아들', '딸']), w: Opt[] = [];
    if (k > 2) w.push({ v: q(P - k * C), note: `마지막에 ${k - 1}로 나누지 않음` });
    if (intQ(P - k * C, k)) w.push({ v: q((P - k * C) / k), note: `${pa} 나이에도 ${M('x')}년을 더해야 하는 것을 빠뜨림` });
    w.push({ v: q(C + x), note: `구하는 것(몇 년 후) 대신 그때의 ${ch} 나이를 답함` });
    return build(r, { text: `현재 ${pa}의 나이는 ${P}살, ${ch}의 나이는 ${C}살입니다. 몇 년 후에 ${pa}의 나이가 ${ch}의 나이의 ${k}배가 되나요?`, correct: { v: q(x) }, wrongs: w,
      fill: nearInt(r, x, 4), fmt: unit('년 후'), order: 'asc',
      explain: `${M('x')}년 후: ${M(`${P} + x = ${k}(${C} + x)`)} → ${M(`${P} + x = ${k * C} + ${k}x`)} → ${M(`${P - k * C} = ${k - 1 === 1 ? '' : k - 1}x`)} → ${M(`x = ${x}`)} (${x}년 후)` });
  }
};
G['mw-8'] = (r) => { // 연속하는 세 수
  const kind = pick(r, ['자연수', '짝수', '홀수'] as const), st = kind === '자연수' ? 1 : 2;
  let m: number; do { m = ri(r, 8, 40); } while ((kind === '짝수' && m % 2) || (kind === '홀수' && m % 2 === 0));
  const big = r() < 0.5, ans = big ? m + st : m - st, S = 3 * m;
  return build(r, { text: `연속하는 세 ${kind}의 합이 ${S}일 때, 세 수 중 가장 <b>${big ? '큰' : '작은'}</b> 수는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(m), note: '가운데 수를 답함 (구하는 것을 확인하지 않음)' }, { v: q(big ? m - st : m + st), note: `가장 ${big ? '작은' : '큰'} 수를 답함` }, ...(st === 2 ? [{ v: q(big ? m + 1 : m - 1), note: `연속하는 ${kind}를 1씩 차이 나게 놓음` }] : [])],
    fill: nearInt(r, ans, 4), fmt: intF, order: 'asc',
    explain: `가운데 수를 ${M('x')}로 놓으면 ${M(`(x − ${st}) + x + (x + ${st}) = ${S}`)} → ${M(`3x = ${S}`)}, ${M(`x = ${m}`)} → 가장 ${big ? '큰' : '작은'} 수 ${ans}` });
};
G['mw-9'] = (r) => { // 과부족
  for (;;) {
    const n = ri(r, 5, 15), a = ri(r, 3, 6), b = a + ri(r, 1, 2), p = ri(r, 1, 9), T = a * n + p, qq = b * n - T; if (qq <= 0) continue;
    const it = pick(r, [['사탕', '개'], ['연필', '자루'], ['공책', '권']]), askN = r() < 0.6, ans = askN ? n : T, w: Opt[] = [];
    if (intQ(Math.abs(p - qq), b - a) && p !== qq) { const n2 = Math.abs(p - qq) / (b - a); w.push({ v: q(askN ? n2 : a * n2 + p), note: '남는 수와 모자라는 수를 같은 쪽으로 계산함' }); }
    w.push({ v: q(askN ? T : n), note: askN ? `구하는 것(학생 수) 대신 ${it[0]} 수를 답함` : `구하는 것(${it[0]} 수) 대신 학생 수를 답함` });
    if (askN) w.push({ v: q(p + qq) }); else w.push({ v: q(b * n), note: '모자라는 수를 빼지 않음' });
    return build(r, { text: `학생들에게 ${it[0]}${josa(it[0], '을', '를')} 한 명에게 ${a}${it[1]}씩 나누어 주면 ${p}${it[1]}${josa(it[1], '이', '가')} 남고, ${b}${it[1]}씩 나누어 주면 ${qq}${it[1]}${josa(it[1], '이', '가')} 모자랍니다. ${askN ? '학생은 몇 명인가요?' : `${it[0]}${josa(it[0], '은', '는')} 모두 몇 ${it[1]}인가요?`}`,
      correct: { v: q(ans) }, wrongs: w, fill: nearInt(r, ans, 4), fmt: unit(askN ? '명' : it[1]), order: 'asc',
      explain: `학생 수를 ${M('x')}명이라 하면 ${it[0]} 수는 같으므로 ${M(`${a}x + ${p} = ${b}x − ${qq}`)} → ${b - a === 1 ? M(`x = ${n}`) : `${M(`${p + qq} = ${b - a}x`)} → ${M(`x = ${n}`)}`}${askN ? '' : ` → ${it[0]} ${a} × ${n} + ${p} = ${T}${it[1]}`}` });
  }
};
G['mw-10'] = (r) => { // 갈 때·올 때 속력이 다른 왕복
  for (;;) {
    const [v1, v2] = shuffle(r, [2, 3, 4, 5, 6]).slice(0, 2).sort((x, y) => x - y), d = ri(r, 1, 12), Tm = (60 * d * (v1 + v2)) / (v1 * v2);
    if (!Number.isInteger(Tm) || Tm % 5 || Tm < 40 || Tm > 300) continue;
    const h = Math.floor(Tm / 60), mn = Tm % 60, Ts = `${h ? h + '시간' : ''}${h && mn ? ' ' : ''}${mn ? mn + '분' : ''}`, w: Opt[] = [{ v: q(2 * d), note: '편도 거리 대신 왕복 거리를 답함' }];
    if (mn >= 10 && h) { const wrongT = q(h * 100 + mn, 100), dd = div(mul(wrongT, q(v1 * v2)), q(v1 + v2)); if (q(dd[0] * 100, dd[1])[1] === 1) w.push({ v: dd, note: `${h}시간 ${mn}분을 ${h}.${mn}시간으로 바꿈 (${mn}분 = ${M(frs(mn, 60))}시간)` }); }
    const Tq = q(Tm, 60), TT = Tq[1] === 1 ? String(Tq[0]) : frs(Tq[0], Tq[1]), L = lcm(lcm(v1, v2), Tq[1]), lo = Math.max(1, d - 3), fillD = () => q(lo + ri(r, 0, 6));
    return build(r, { text: `집에서 도서관까지 갈 때는 시속 ${v1} km로, 올 때는 같은 길을 시속 ${v2} km로 걸었더니 왕복하는 데 모두 ${Ts}이 걸렸습니다. 집에서 도서관까지의 거리는?`, correct: { v: q(d) }, wrongs: w,
      fill: fillD, fmt: decU(' km'), order: 'asc',
      explain: `거리를 ${M('x')} km라 하면 시간 = 거리 ÷ 속력: ${M(`${frs('x', v1)} + ${frs('x', v2)} = ${TT}`)}${mn ? `(${Ts} = ${M(TT)}시간)` : ''} → 양변에 ${L} 곱하기: ${M(`${L / v1}x + ${L / v2}x = ${Tm * L / 60}`)} → ${M(`${L / v1 + L / v2}x = ${Tm * L / 60}`)} → ${M(`x = ${d}`)} km` });
  }
};

// ── 중1 2학기 「기본 도형」: 점·선·면·각, 위치 관계, 평행선의 성질 (작년 도농중 기말 7~9·12번 유형) ──
const degF = unit('°');
// 영문 이름 뒤 조사(마지막 글자 소리: L(엘)만 받침)
const jL = (s: string, withB: string, without: string) => (s.endsWith('L') ? withB : without);
// 기둥·뿔의 교점(꼭짓점)·교선(모서리)
G['mb-1'] = (r) => {
  const n = ri(r, 3, 8), prism = r() < 0.6, name = `${koN(n)}각${prism ? '기둥' : '뿔'}`;
  const V = prism ? 2 * n : n + 1, E = prism ? 3 * n : 2 * n, F = prism ? n + 2 : n + 1, ans = V + E;
  return { ...build(r, { text: `${name}에서 교점의 개수를 ${M('a')}, 교선의 개수를 ${M('b')}라 할 때, ${M('a + b')}의 값은?`, correct: { v: q(ans) },
    wrongs: [{ v: q(F + E), note: '교점 대신 면의 개수를 셈 (교점 = 꼭짓점)' }, { v: q(V + F), note: '교선 대신 면의 개수를 셈 (교선 = 모서리)' }, { v: q(E), note: '교선만 셈' }, { v: q(V + E + F) }],
    fill: nearInt(r, ans, 5), fmt: intF, order: 'asc', explain: `입체도형에서 교점 = 꼭짓점 ${V}개, 교선 = 모서리 ${E}개 → ${M(`a + b = ${V} + ${E} = ${ans}`)}` }),
    fig: { type: 'solid', kind: prism ? 'prism' : 'pyramid', n, r: 3, h: 5 } };
};
// 중점과 선분의 길이
G['mb-2'] = (r) => {
  const a = ri(r, 2, 10) * 4, ask = pick(r, ['MN', 'AN', 'AB'] as const), k = a / 4;
  const pts = { _a: P(0, 0), _b: P(8, 0), _m: P(4, 0), _n: P(6, 0) };
  const fig = shape(pts, [{ k: 'seg', p: ['_a', '_b'] }, { k: 'dot', p: '_a' }, { k: 'dot', p: '_m' }, { k: 'dot', p: '_n' }, { k: 'dot', p: '_b' },
    { k: 'text', at: [0, -0.7], s: 'A' }, { k: 'text', at: [4, -0.7], s: 'M' }, { k: 'text', at: [6, -0.7], s: 'N' }, { k: 'text', at: [8, -0.7], s: 'B' }]);
  if (ask === 'AB') return { ...build(r, { text: `점 M은 선분 AB의 중점이고, 점 N은 선분 MB의 중점입니다. ${M(`NB = ${k}`)} cm일 때, 선분 AB의 길이는?`, correct: { v: q(a) },
    wrongs: [{ v: q(2 * k), note: '중점을 한 번만 생각함 (NB는 AB의 1/4)' }, { v: q(3 * k), note: 'AN의 길이를 구함' }, { v: q(8 * k), note: '2배를 한 번 더 함' }],
    fill: nearInt(r, a, 6), fmt: cm, order: 'asc', explain: `${M(`MB = 2NB = ${2 * k}`)}, ${M(`AB = 2MB = ${a}`)} (cm)` }), fig };
  const ans = ask === 'MN' ? k : 3 * k;
  return { ...build(r, { text: `점 M은 선분 AB의 중점이고, 점 N은 선분 MB의 중점입니다. ${M(`AB = ${a}`)} cm일 때, 선분 ${ask}의 길이는?`, correct: { v: q(ans) },
    wrongs: ask === 'MN' ? [{ v: q(2 * k), note: 'AM(또는 MB)의 길이를 구함 (MN은 MB의 절반)' }, { v: q(3 * k), note: 'AN의 길이를 구함' }, { v: q(a) }]
      : [{ v: q(2 * k), note: 'AM의 길이만 구함 (AN = AM + MN)' }, { v: q(k), note: 'MN의 길이를 구함' }, { v: q(a) }],
    fill: nearInt(r, ans, 5), fmt: cm, order: 'asc', explain: `${M(`AM = MB = ${a} ÷ 2 = ${2 * k}`)}, ${M(`MN = NB = ${2 * k} ÷ 2 = ${k}`)}${ask === 'AN' ? ` → ${M(`AN = AM + MN = ${2 * k} + ${k} = ${3 * k}`)}` : ''} (cm)` }), fig };
};
// 맞꼭지각
const lin1 = (p: number, c: number) => `${p === 1 ? '' : p}x ${c < 0 ? '−' : '+'} ${Math.abs(c)}`;
G['mb-3'] = (r) => {
  for (;;) {
    const p = ri(r, 2, 6), s = ri(r, 2, 6), x = ri(r, 8, 40), A = ri(r, 30, 150); if (p === s) continue;
    const c1 = A - p * x, c2 = A - s * x; if (!c1 || !c2 || Math.abs(c1) > 90 || Math.abs(c2) > 90) continue;
    const w: Opt[] = [];
    if (intQ(180 - c1 - c2, p + s) && (180 - c1 - c2) / (p + s) > 0) w.push({ v: q((180 - c1 - c2) / (p + s)), note: '맞꼭지각을 합이 180°인 각으로 봄 (맞꼭지각은 크기가 같음)' });
    w.push({ v: q(A), note: 'x 대신 각의 크기를 답함' });
    if (intQ(c1 + c2, p - s) && (c1 + c2) / (p - s) > 0) w.push({ v: q((c1 + c2) / (p - s)), note: '이항할 때 부호 실수' });
    return build(r, { text: `두 직선이 한 점에서 만날 때 생기는 맞꼭지각의 크기가 각각 ${M(`(${lin1(p, c1)})°`)}, ${M(`(${lin1(s, c2)})°`)}입니다. ${M('x')}의 값은?`, correct: { v: q(x) }, wrongs: w,
      fill: nearInt(r, x, 6), fmt: intF, order: 'asc', explain: `맞꼭지각은 크기가 같으므로 ${M(`${lin1(p, c1)} = ${lin1(s, c2)}`)} → ${M(`${p - s > 0 ? (p - s === 1 ? '' : p - s) : '−' + (s - p === 1 ? '' : s - p)}x = ${mi(c2 - c1)}`)} → ${M(`x = ${x}`)}` });
  }
};
// 평각을 나눈 세 각
G['mb-4'] = (r) => {
  for (;;) {
    const a = ri(r, 5, 30), b = ri(r, 5, 30), x = (180 - a + b) / 6; if (!Number.isInteger(x) || 3 * x - b < 10) continue;
    const w: Opt[] = [];
    if (intQ(360 - a + b, 6)) w.push({ v: q((360 - a + b) / 6), note: '평각을 360°로 봄 (평각 = 180°)' });
    if (intQ(90 - a + b, 6) && (90 - a + b) / 6 > 0) w.push({ v: q((90 - a + b) / 6), note: '평각을 90°로 봄' });
    if (intQ(180 - a - b, 6) && (180 - a - b) / 6 > 0) w.push({ v: q((180 - a - b) / 6), note: `−${J(b, '을', '를')} + 로 계산함 (이항 부호 실수)` });
    const pts: Record<string, number[]> = { O: P(0, 0), _l: P(-4, 0), _r: P(4, 0) };
    const A2 = 2 * x, A3 = 3 * x - b, d1 = A3, d2 = A3 + A2; // 오른쪽부터 (3x − b), 2x, (x + a)
    pts._p = P(4 * Math.cos(d1 * Math.PI / 180), 4 * Math.sin(d1 * Math.PI / 180)); pts._q = P(4 * Math.cos(d2 * Math.PI / 180), 4 * Math.sin(d2 * Math.PI / 180));
    return { ...build(r, { text: `한 직선 위의 점 O에서 그은 두 반직선이 평각을 세 각 ${M(`(x + ${a})°`)}, ${M('2x°')}, ${M(`(3x − ${b})°`)}로 나누었습니다. ${M('x')}의 값은?`, correct: { v: q(x) }, wrongs: w,
      fill: nearInt(r, x, 6), fmt: intF, order: 'asc', explain: `평각은 180° → ${M(`(x + ${a}) + 2x + (3x − ${b}) = 180`)} → ${M(`6x = ${180 - a + b}`)} → ${M(`x = ${x}`)}` }),
      fig: shape(pts, [{ k: 'seg', p: ['_l', '_r'] }, { k: 'seg', p: ['O', '_p'] }, { k: 'seg', p: ['O', '_q'] },
        { k: 'angle', p: ['_r', 'O', '_p'] }, { k: 'angle', p: ['_p', 'O', '_q'], n: 2 }, { k: 'angle', p: ['_q', 'O', '_l'] },
        ...([[d1 / 2, `(3x−${b})°`], [(d1 + d2) / 2, '2x°'], [(d2 + 180) / 2, `(x+${a})°`]] as [number, string][]).map(([t, s]) => ({ k: 'text', at: P(3 * Math.cos(t * Math.PI / 180), 3 * Math.sin(t * Math.PI / 180) + 0.3), s }))]) };
  }
};

// 공간에서의 위치 관계 — 기둥의 꼭짓점 좌표로 직접 센다
type V3 = [number, number, number];
const ALPHA = 'ABCDEFGHIJKL';
function prismSolid(n: number) {
  const pts: V3[] = [];
  for (let k = 0; k < 2; k++) for (let i = 0; i < n; i++) { const t = n === 4 ? [[0, 0], [2, 0], [2, 1], [0, 1]][i] : [Math.cos(2 * Math.PI * i / n), Math.sin(2 * Math.PI * i / n)]; pts.push([t[0], t[1], k * 1.5]); }
  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++) { edges.push([i, (i + 1) % n]); edges.push([n + i, n + (i + 1) % n]); edges.push([i, n + i]); }
  const faces: number[][] = [Array.from({ length: n }, (_, i) => i), Array.from({ length: n }, (_, i) => n + i)];
  for (let i = 0; i < n; i++) faces.push([i, (i + 1) % n, n + (i + 1) % n, n + i]);
  return { pts, edges, faces, name: n === 4 ? '직육면체' : `${koN(n)}각기둥`, label: `${ALPHA.slice(0, n)}−${ALPHA.slice(n, 2 * n)}` };
}
const vsub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const zero3 = (a: V3) => Math.hypot(...a) < 1e-9;
G['mb-5'] = (r) => { // 모서리와 모서리의 위치 관계
  const n = pick(r, [3, 4, 5, 6]), S = prismSolid(n), e0 = pick(r, [S.edges[0], S.edges[2]]), d0 = vsub(S.pts[e0[1]], S.pts[e0[0]]);
  const cnt = { 평행: 0, 만남: 0, 꼬인: 0 };
  for (const e of S.edges) { if (e === e0) continue; const d = vsub(S.pts[e[1]], S.pts[e[0]]);
    if (e.some((v) => e0.includes(v))) cnt.만남++; else if (zero3(cross(d, d0))) cnt.평행++; else cnt.꼬인++; }
  const ask = pick(r, ['꼬인', '평행', '만남'] as const), ans = cnt[ask], nm = ALPHA[e0[0]] + ALPHA[e0[1]];
  const askT = ask === '꼬인' ? '꼬인 위치에 있는' : ask === '평행' ? '평행한' : '한 점에서 만나는';
  const others = (['꼬인', '평행', '만남'] as const).filter((k) => k !== ask);
  return { ...build(r, { text: `${S.name} ${S.label}에서 모서리 ${nm}${jL(nm, '과', '와')} <b>${askT}</b> 모서리의 개수는?`, correct: { v: q(ans) },
    wrongs: [...others.map((k) => ({ v: q(cnt[k]), note: `${k === '꼬인' ? '꼬인 위치에 있는' : k === '평행' ? '평행한' : '만나는'} 모서리를 셈` })), { v: q(S.edges.length - 1), note: '자기 자신만 빼고 모두 셈' }, { v: q(cnt.평행 + cnt.꼬인), note: '만나지 않는 모서리(평행 + 꼬인)를 모두 셈' }],
    fill: nearInt(r, ans, 3), fmt: ea, order: 'asc', signed: true,
    explain: `모서리 ${nm} 말고 ${S.edges.length - 1}개 중 — 한 점에서 만나는 것 ${cnt.만남}개, 평행한 것 ${cnt.평행}개, 꼬인 위치(만나지도 평행하지도 않음) ${cnt.꼬인}개 → ${ans}개` }),
    fig: { type: 'solid', kind: n === 4 ? 'cuboid' : 'prism', n, r: 3, h: 4, a: 6, b: 3, c: 4, vlabels: ALPHA.slice(0, 2 * n) } };
};
G['mb-10'] = (r) => { // 모서리·면과 면의 위치 관계
  for (;;) {
    const n = pick(r, [3, 4, 5, 6]), S = prismSolid(n), fi = r() < 0.25 ? 0 : 2 + ri(r, 0, n - 1), F = S.faces[fi], nrm = cross(vsub(S.pts[F[1]], S.pts[F[0]]), vsub(S.pts[F[2]], S.pts[F[0]]));
    const inPlane = (v: number) => Math.abs(dot3(vsub(S.pts[v], S.pts[F[0]]), nrm)) < 1e-9;
    const c = { 평행모서리: 0, 수직모서리: 0, 수직면: 0, 포함: 0 };
    for (const e of S.edges) { const d = vsub(S.pts[e[1]], S.pts[e[0]]);
      if (inPlane(e[0]) && inPlane(e[1])) c.포함++; else if (Math.abs(dot3(d, nrm)) < 1e-9) c.평행모서리++; else if (zero3(cross(d, nrm))) c.수직모서리++; }
    for (const g of S.faces) { if (g === F) continue; const m = cross(vsub(S.pts[g[1]], S.pts[g[0]]), vsub(S.pts[g[2]], S.pts[g[0]])); if (Math.abs(dot3(m, nrm)) < 1e-9) c.수직면++; }
    const ask = pick(r, ['평행모서리', '수직모서리', '수직면'] as const), ans = c[ask]; if (!ans) continue;
    const fn = F.map((v) => ALPHA[v]).join(''), askT = ask === '평행모서리' ? '평행한 모서리' : ask === '수직모서리' ? '수직인 모서리' : '수직인 면';
    return { ...build(r, { text: `${S.name} ${S.label}에서 면 ${fn}${jL(fn, '과', '와')} <b>${askT}</b>의 개수는?`, correct: { v: q(ans) },
      wrongs: [{ v: q(c.포함), note: '면에 포함되는 모서리를 셈' }, ...(['평행모서리', '수직모서리', '수직면'] as const).filter((k) => k !== ask).map((k) => ({ v: q(c[k]), note: `${k === '평행모서리' ? '평행한 모서리' : k === '수직모서리' ? '수직인 모서리' : '수직인 면'}를 셈` })), { v: q(c.포함 + c[ask]) }],
      fill: nearInt(r, ans, 3), fmt: ea, order: 'asc', signed: true,
      explain: `면 ${fn}에 대해 — 포함된 모서리 ${c.포함}개, 평행한 모서리(면과 만나지 않음) ${c.평행모서리}개, 수직인 모서리 ${c.수직모서리}개, 수직인 면 ${c.수직면}개 → ${ans}개` }),
      fig: { type: 'solid', kind: n === 4 ? 'cuboid' : 'prism', n, r: 3, h: 4, a: 6, b: 3, c: 4, vlabels: ALPHA.slice(0, 2 * n) } };
  }
};
// 공간에서 직선·평면의 위치 관계 (옳은 것 / 옳지 않은 것)
const SP_T = ['한 직선에 평행한 서로 다른 두 직선은 평행하다.', '꼬인 위치에 있는 두 직선은 한 평면 위에 있지 않다.', '한 평면에 수직인 서로 다른 두 직선은 평행하다.', '한 평면 위에 있지 않은 두 직선은 꼬인 위치에 있다.', '서로 만나는 두 직선은 한 평면 위에 있다.'];
const SP_F: [string, string][] = [['한 직선에 수직인 서로 다른 두 직선은 평행하다.', '공간에서는 한 직선에 수직인 두 직선이 만나거나 꼬인 위치일 수도 있음'], ['만나지 않는 두 직선은 항상 평행하다.', '공간에서는 꼬인 위치일 수도 있음'],
  ['한 평면에 평행한 서로 다른 두 직선은 평행하다.', '한 평면에 평행한 두 직선은 만나거나 꼬인 위치일 수도 있음'], ['한 평면에 수직인 서로 다른 두 평면은 평행하다.', '한 평면에 수직인 두 평면은 만날 수도 있음 (직육면체의 옆면 두 개)'], ['한 직선에 평행한 서로 다른 두 평면은 평행하다.', '한 직선에 평행한 두 평면은 만날 수도 있음']];
G['mb-6'] = (r) => {
  const right = r() < 0.5;
  if (right) { const t = pick(r, SP_T), fs4 = shuffle(r, SP_F).slice(0, 4);
    return build(r, { text: '공간에서 서로 다른 직선과 평면의 위치 관계에 대한 설명으로 <b>옳은</b> 것은?', correct: { s: t }, wrongs: fs4.map(([s, why]) => ({ s, note: `옳지 않은 설명을 고름 — ${why}` })), order: 'shuffle',
      explain: `옳은 것: ${t} / 나머지는 직육면체 모서리·면으로 반례를 찾을 수 있어요. (${fs4.map(([s, why]) => `「${s.replace(/\.$/, '')}」 → ${why}`).join('; ')})` }); }
  const [f, why] = pick(r, SP_F), ts = shuffle(r, SP_T).slice(0, 4);
  return build(r, { text: '공간에서 서로 다른 직선과 평면의 위치 관계에 대한 설명으로 <b>옳지 않은</b> 것은?', correct: { s: f }, wrongs: ts.map((s) => ({ s, note: '옳은 설명을 고름 (옳지 않은 것을 찾는 문제)' })), order: 'shuffle',
    explain: `「${f.replace(/\.$/, '')}」 → ${why}. 직육면체의 모서리와 면으로 확인해 보세요.` });
};

// 평행선의 성질 — 그림: 두 평행선 l(위)·m(아래)과 이를 가로지르는 직선
// 교점마다 각 자리 0:오른쪽 위, 1:왼쪽 위, 2:왼쪽 아래, 3:오른쪽 아래 (0·2는 a°, 1·3은 180°−a°)
function parFig(a: number, labs: [number, number, string][]) {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180), H = 4, dx = (H * c) / s; // 위아래 간격 4
  const Pp = [dx / 2, H], Qq = [-dx / 2, 0], u = [c, s];
  const pts: Record<string, number[]> = { _P: P(Pp[0], Pp[1]), _Q: P(Qq[0], Qq[1]), _l1: P(-4, H), _l2: P(4, H), _m1: P(-4, 0), _m2: P(4, 0),
    _Pu: P(Pp[0] + u[0] * 1.6, Pp[1] + u[1] * 1.6), _Qd: P(Qq[0] - u[0] * 1.6, Qq[1] - u[1] * 1.6), _Pr: P(Pp[0] + 1.6, H), _Pl: P(Pp[0] - 1.6, H), _Qr: P(Qq[0] + 1.6, 0), _Ql: P(Qq[0] - 1.6, 0) };
  const items: any[] = [{ k: 'line', p: ['_l1', '_l2'] }, { k: 'line', p: ['_m1', '_m2'] }, { k: 'line', p: ['_Qd', '_Pu'] }, { k: 'par', p: ['_l1', '_l2'] }, { k: 'par', p: ['_m1', '_m2'] },
    { k: 'text', at: [-4.5, H], s: 'l' }, { k: 'text', at: [-4.5, 0], s: 'm' }];
  for (const [at, pos, lab] of labs) { // at 0: 위 교점 P, 1: 아래 교점 Q
    const O = at ? '_Q' : '_P', R = at ? '_Qr' : '_Pr', Lf = at ? '_Ql' : '_Pl', U = at ? '_P' : '_Pu', D = at ? '_Qd' : '_Q';
    const ray = [R, U, Lf, D], half = pos % 2 ? (180 - a) / 2 : a / 2, bis = [half, a + half, 180 + half, 180 + a + half][pos] * Math.PI / 180;
    const rr = Math.min(3, 1.3 / Math.sin(half * Math.PI / 180)), c0 = at ? Qq : Pp; // 이름표는 두 반직선에서 떨어진 이등분선 위에
    items.push({ k: 'angle', p: [ray[pos], O, ray[(pos + 1) % 4]] }, { k: 'text', at: P(c0[0] + rr * Math.cos(bis), c0[1] + rr * Math.sin(bis)), s: lab });
  }
  return shape(pts, items);
}
const angOf = (a: number, pos: number) => (pos % 2 === 0 ? a : 180 - a);
function relName(p1: number, p2: number) { // P의 p1 자리와 Q의 p2 자리
  if (p1 === p2) return '동위각';
  if ((p1 === 2 && p2 === 0) || (p1 === 3 && p2 === 1)) return '엇각';
  if ((p1 === 2 && p2 === 1) || (p1 === 3 && p2 === 0)) return '같은 쪽 안쪽 각(합이 180°)';
  return '';
}
G['mb-7'] = (r) => { // 동위각·엇각으로 각 구하기
  const a = ri(r, 7, 16) * 5, p1 = ri(r, 0, 3), p2 = ri(r, 0, 3), g = angOf(a, p1), ans = angOf(a, p2), rel = relName(p1, p2);
  return { ...build(r, { text: `그림에서 ${M('l')} ∥ ${M('m')}일 때, ${M('∠x')}의 크기는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(180 - ans), note: ans === g ? '크기가 같은 각인데 180°에서 뺌 (동위각·엇각은 크기가 같음)' : '합이 180°가 되는 각인데 크기가 같다고 봄' }],
    fill: () => q(5 * ri(r, 4, 32)), fmt: degF, order: 'asc',
    explain: `${rel ? `주어진 각과 ∠x는 ${rel}` : '맞꼭지각과 동위각을 차례로 이용'} → ${ans === g ? `${M(`∠x = ${g}°`)} (크기가 같음)` : `${M(`∠x = 180° − ${g}° = ${ans}°`)}`}` }),
    fig: parFig(a, [[0, p1, `${g}°`], [1, p2, 'x']]) };
};
G['mb-9'] = (r) => { // 평행선에서 식으로 된 두 각
  for (;;) {
    const p1 = pick(r, [2, 3]), same = r() < 0.5, p2 = same ? (p1 === 2 ? 0 : 1) : (p1 === 2 ? 1 : 0), a = ri(r, 7, 16) * 5, A1 = angOf(a, p1), A2 = angOf(a, p2);
    const s1 = ri(r, 2, 5), s2 = ri(r, 2, 5), x = ri(r, 6, 30), c1 = A1 - s1 * x, c2 = A2 - s2 * x; if (s1 === s2 || !c1 || !c2 || Math.abs(c1) > 60 || Math.abs(c2) > 60) continue;
    const e1 = `(${lin1(s1, c1)})°`, e2 = `(${lin1(s2, c2)})°`, w: Opt[] = [];
    if (same) { if (intQ(180 - c1 - c2, s1 + s2) && (180 - c1 - c2) / (s1 + s2) > 0) w.push({ v: q((180 - c1 - c2) / (s1 + s2)), note: '엇각인데 합이 180°라고 봄 (엇각은 크기가 같음)' }); }
    else if (intQ(c2 - c1, s1 - s2) && (c2 - c1) / (s1 - s2) > 0) w.push({ v: q((c2 - c1) / (s1 - s2)), note: '같은 쪽 안쪽 각인데 크기가 같다고 봄 (합이 180°)' });
    w.push({ v: q(A1), note: 'x 대신 각의 크기를 답함' });
    return { ...build(r, { text: `그림에서 ${M('l')} ∥ ${M('m')}일 때, ${M('x')}의 값은?`, correct: { v: q(x) }, wrongs: w,
      fill: nearInt(r, x, 6), fmt: intF, order: 'asc',
      explain: same ? `두 각은 엇각 → 크기가 같음: ${M(`${lin1(s1, c1)} = ${lin1(s2, c2)}`)} → ${M(`x = ${x}`)}` : `두 각은 같은 쪽 안쪽 각 → 합이 180°: ${M(`(${lin1(s1, c1)}) + (${lin1(s2, c2)}) = 180`)} → ${M(`x = ${x}`)}` }),
      fig: parFig(a, [[0, p1, e1.replace(/ /g, '')], [1, p2, e2.replace(/ /g, '')]]) };
  }
};
G['mb-8'] = (r) => { // 평행선 사이에서 꺾인 선
  const a = ri(r, 5, 13) * 5; let b: number; do { b = ri(r, 5, 13) * 5; } while (b === a);
  const x = a + b;
  const ca = 1 / Math.tan(a * Math.PI / 180), cb = 1 / Math.tan(b * Math.PI / 180), Pp = [ca, 1], Bb = [ca - cb, 0];
  const lo = Math.min(0, Bb[0]) - 2, hi = Math.max(Pp[0], 0) + 2;
  return { ...build(r, { text: `그림에서 ${M('l')} ∥ ${M('m')}일 때, ${M('∠x')}의 크기는?`, correct: { v: q(x) },
    wrongs: [{ v: q(180 - x), note: '꺾인 각의 반대쪽(180°에서 뺀 각)을 구함' }, { v: q(Math.abs(a - b)), note: '두 각의 차를 구함 (꺾인 점을 지나는 평행선을 그으면 합)' }, { v: q(360 - x) }],
    fill: () => q(5 * ri(r, 6, 34)), fmt: degF, order: 'asc', explain: `꺾인 점을 지나고 ${M('l')}, ${M('m')}에 평행한 직선을 그으면 엇각이 생겨요 → ${M(`∠x = ${a}° + ${b}° = ${x}°`)}` }),
    fig: shape({ _A: P(0, 2), _P: P(Pp[0], Pp[1]), _B: P(Bb[0], 0), _l1: P(lo, 2), _l2: P(hi, 2), _m1: P(lo, 0), _m2: P(hi, 0), _Ar: P(1.5, 2), _Br: P(Bb[0] + 1.5, 0) }, [
      { k: 'line', p: ['_l1', '_l2'] }, { k: 'line', p: ['_m1', '_m2'] }, { k: 'par', p: ['_l1', '_l2'] }, { k: 'par', p: ['_m1', '_m2'] },
      { k: 'seg', p: ['_A', '_P'] }, { k: 'seg', p: ['_P', '_B'] }, { k: 'text', at: [lo - 0.4, 2], s: 'l' }, { k: 'text', at: [lo - 0.4, 0], s: 'm' },
      { k: 'angle', p: ['_P', '_A', '_Ar'], label: `${a}°` }, { k: 'angle', p: ['_Br', '_B', '_P'], label: `${b}°` }, { k: 'angle', p: ['_A', '_P', '_B'], label: 'x' }]) };
};

// ── 중1 2학기 「작도와 합동」: 작도, 삼각형의 결정 조건, 합동 조건 (작년 도농중 기말 11·13번 유형) ──
const CIRC_K = ['㉠', '㉡', '㉢', '㉣', '㉤'];
// 옳은 것/옳지 않은 것 고르기 (참 4개 이상, 거짓 4개 이상인 목록에서)
function tfPick(r: Rng, T: string[], F: [string, string][], topic: string) {
  if (r() < 0.5) { const t = pick(r, T), fs4 = shuffle(r, F).slice(0, 4);
    return build(r, { text: `${topic}에 대한 설명으로 <b>옳은</b> 것은?`, correct: { s: t }, wrongs: fs4.map(([s, why]) => ({ s, note: `옳지 않은 설명을 고름 — ${why}` })), order: 'shuffle',
      explain: `옳은 것: ${t} / 옳지 않은 것: ${fs4.map(([s, why]) => `「${s.replace(/\.$/, '')}」(${why})`).join(', ')}` }); }
  const [f, why] = pick(r, F), ts = shuffle(r, T).slice(0, 4);
  return build(r, { text: `${topic}에 대한 설명으로 <b>옳지 않은</b> 것은?`, correct: { s: f }, wrongs: ts.map((s) => ({ s, note: '옳은 설명을 고름 (옳지 않은 것을 찾는 문제)' })), order: 'shuffle',
    explain: `「${f.replace(/\.$/, '')}」 → ${why}` });
}
G['mc-1'] = (r) => tfPick(r, ['작도할 때는 눈금 없는 자와 컴퍼스만 사용한다.', '눈금 없는 자는 두 점을 이어 선분을 그리거나 선분을 연장할 때 쓴다.', '컴퍼스는 원을 그리거나 선분의 길이를 재어 옮길 때 쓴다.', '두 선분의 길이를 비교할 때는 컴퍼스를 쓴다.'],
  [['선분의 길이를 잴 때는 눈금 없는 자를 쓴다.', '길이를 재어 옮기는 것은 컴퍼스'], ['각도기로 각의 크기를 재어 같은 크기의 각을 그린다.', '작도에서는 각도기를 쓰지 않음'], ['눈금 있는 자로 선분의 길이를 재어 옮긴다.', '작도에서는 눈금 없는 자만 씀'], ['컴퍼스로 두 점을 지나는 직선을 긋는다.', '직선은 눈금 없는 자로 그음']], '작도');
// 작도 순서
const CONS = {
  angle: { title: '∠XOY와 크기가 같은 각을 반직선 PQ를 한 변으로 하여 작도하려고 합니다.', steps: ['점 O를 중심으로 하는 원을 그려 반직선 OX, OY와의 교점을 각각 A, B라 한다.', '점 P를 중심으로 반지름이 OA인 원을 그려 반직선 PQ와의 교점을 C라 한다.', '컴퍼스로 AB의 길이를 잰다.', '점 C를 중심으로 반지름이 AB인 원을 그려 앞에서 그린 원과의 교점을 D라 한다.', '반직선 PD를 긋는다.'], valid: [[0, 1, 2, 3, 4], [0, 2, 1, 3, 4]] },
  seg: { title: '선분 AB와 길이가 같은 선분 PQ를 작도하려고 합니다.', steps: ['직선 l을 긋고, 그 위에 점 P를 잡는다.', '컴퍼스로 AB의 길이를 잰다.', '점 P를 중심으로 반지름이 AB인 원을 그려 직선 l과의 교점을 Q라 한다.'], valid: [[0, 1, 2], [1, 0, 2]] },
};
function permutations(n: number): number[][] { if (n === 1) return [[0]]; const out: number[][] = []; for (const p of permutations(n - 1)) for (let i = 0; i <= p.length; i++) out.push([...p.slice(0, i), n - 1, ...p.slice(i)]); return out; }
G['mc-2'] = (r) => {
  const kind = r() < 0.65 ? 'angle' : 'seg', C = CONS[kind], n = C.steps.length, lab = shuffle(r, Array.from({ length: n }, (_, i) => i)); // lab[step] = 표시 번호
  const seq = (o: number[]) => o.map((s) => CIRC_K[lab[s]]).join(' → '), key = (o: number[]) => o.join(), valid = C.valid.map(key);
  const why = (o: number[]) => { const at = (s: number) => o.indexOf(s);
    if (kind === 'angle') {
      if (at(4) !== 4) return '반직선 PD를 먼저 그음 (점 D가 아직 없음)';
      if (at(1) < at(0) || at(2) < at(0)) return '점 A, B를 정하기 전에 OA, AB를 씀';
      if (at(3) < at(1)) return '점 C를 정하기 전에 C를 중심으로 원을 그림';
      return '반지름 AB를 재기 전에 원을 그림'; }
    if (at(2) < at(1)) return '길이를 재기 전에 원을 그림';
    return '직선과 점 P를 잡기 전에 원을 그림'; };
  const wrong = shuffle(r, permutations(n).filter((o) => !valid.includes(key(o))));
  const pickW = [...wrong.filter((o) => o[n - 1] === n - 1).slice(0, 3), ...wrong.filter((o) => o[n - 1] !== n - 1)].slice(0, 4);
  const listed = Array.from({ length: n }, (_, k) => C.steps[lab.indexOf(k)]).map((s, k) => `${CIRC_K[k]} ${s}`).join('\n');
  return build(r, { text: `${C.title} 작도 순서로 옳은 것은?\n${listed}`, correct: { s: seq(C.valid[0]) }, wrongs: pickW.map((o) => ({ s: seq(o), note: why(o) })), order: 'shuffle',
    explain: `${C.valid[0].map((s) => `${CIRC_K[lab[s]]} ${C.steps[s].replace(/\.$/, '')}`).join(' → ')}` });
};
// 삼각형의 세 변
G['mc-3'] = (r) => {
  let a: number, b: number; do { a = ri(r, 3, 12); b = ri(r, 3, 12); } while (a === b);
  const lo = Math.abs(a - b), hi = a + b, ans = hi - lo - 1;
  return build(r, { text: `세 변의 길이가 ${a} cm, ${b} cm, ${M('x')} cm인 삼각형이 있습니다. 자연수 ${M('x')}의 개수는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(ans + 2), note: `등호를 넣음 (${lo} < x < ${hi} 에서 ${lo}, ${hi}${josa(hi, '은', '는')} 안 됨)` }, { v: q(hi - 1), note: `x < ${hi} 만 생각함 (x > ${lo} 도 필요)` }, { v: q(ans + 1), note: '한쪽 끝을 넣음' }],
    fill: nearInt(r, ans, 4), fmt: ea, order: 'asc', explain: `삼각형이 되려면 ${M(`|${a} − ${b}| < x < ${a} + ${b}`)} → ${M(`${lo} < x < ${hi}`)} → 자연수 ${lo + 1}부터 ${hi - 1}까지 ${ans}개` });
};
G['mc-4'] = (r) => { // 세 변이 될 수 있는/없는 것
  const ok = () => { for (;;) { const t = [ri(r, 2, 12), ri(r, 2, 12), ri(r, 2, 12)].sort((x, y) => x - y); if (t[2] < t[0] + t[1]) return t; } };
  const bad = (eqCase: boolean) => { for (;;) { const a = ri(r, 2, 8), b = ri(r, 2, 8), c = eqCase ? a + b : a + b + ri(r, 1, 4); return [a, b, c].sort((x, y) => x - y); } };
  const s = (t: number[]) => `${t[0]} cm, ${t[1]} cm, ${t[2]} cm`;
  const can = r() < 0.5, uniq = (gen: () => number[], k: number, have: string[]) => { const out: number[][] = []; for (let i = 0; out.length < k && i < 200; i++) { const t = gen(); if (!have.includes(s(t)) && !out.some((x) => s(x) === s(t))) out.push(t); } return out; };
  const noteBad = (t: number[]) => (t[2] === t[0] + t[1] ? `가장 긴 변이 나머지 두 변의 합과 같으면 삼각형이 안 됨 (${t[0]} + ${t[1]} = ${t[2]})` : `가장 긴 변이 나머지 두 변의 합보다 김 (${t[0]} + ${t[1]} < ${t[2]})`);
  if (can) { const c = ok(), b0 = bad(true), ws = [b0, ...uniq(() => bad(r() < 0.4), 3, [s(c), s(b0)])];
    return build(r, { text: '다음 중 삼각형의 세 변의 길이가 될 수 <b>있는</b> 것은?', correct: { s: s(c) }, wrongs: ws.map((t) => ({ s: s(t), note: noteBad(t) })), order: 'shuffle',
      explain: `(가장 긴 변) < (나머지 두 변의 합) 이어야 해요 → ${c[0]} + ${c[1]} = ${c[0] + c[1]} > ${c[2]} 이므로 ${s(c)}` }); }
  const c = bad(r() < 0.6), ws = uniq(ok, 4, [s(c)]);
  return build(r, { text: '다음 중 삼각형의 세 변의 길이가 될 수 <b>없는</b> 것은?', correct: { s: s(c) }, wrongs: ws.map((t) => ({ s: s(t), note: '삼각형이 되는 세 변을 고름' })), order: 'shuffle',
    explain: `${s(c)} → ${noteBad(c)}` });
};
// 삼각형이 하나로 정해지는 조건
// 두 변과 끼인각이 아닌 각(SSA): 각을 낀 변 c, 마주 보는 변 a, 예각 A — c·sinA < a < c 이면 삼각형이 정확히 두 개 → 하나로 정해지지 않음
function ssa(r: Rng): [number, number, number] { for (;;) { const c = ri(r, 5, 12), A = ri(r, 6, 15) * 5, h = c * Math.sin(A * Math.PI / 180); const lo = Math.floor(h + 1e-9) + 1; if (lo < c) return [c, ri(r, lo, c - 1), A]; } } // a = c·sinA 이면 직각삼각형 하나라서 제외
G['mc-5'] = (r) => {
  const tri = () => { for (;;) { const t = [ri(r, 3, 10), ri(r, 3, 10), ri(r, 3, 10)]; const m = Math.max(...t); if (2 * m < t[0] + t[1] + t[2]) return t; } };
  const ang2 = () => { for (;;) { const s = ri(r, 3, 14) * 5, t = ri(r, 3, 14) * 5; if (s + t < 170) return [s, t]; } };
  const OK = [
    () => { const [a, b, c] = tri(); return `AB = ${a} cm, BC = ${b} cm, CA = ${c} cm`; },
    () => `AB = ${ri(r, 3, 10)} cm, BC = ${ri(r, 3, 10)} cm, ∠B = ${ri(r, 3, 24) * 5}°`,
    () => { const [s, t] = ang2(); return `AB = ${ri(r, 3, 10)} cm, ∠A = ${s}°, ∠B = ${t}°`; },
    () => { const [s, t] = ang2(); return `BC = ${ri(r, 3, 10)} cm, ∠A = ${s}°, ∠C = ${t}°`; },
  ];
  const NO: (() => [string, string])[] = [
    () => { const [c, a, A] = ssa(r); return [`AB = ${c} cm, BC = ${a} cm, ∠A = ${A}°`, '∠A는 AB와 BC의 끼인각이 아님 (삼각형이 두 개 그려짐)']; },
    () => { const [s, t] = ang2(); return [`∠A = ${s}°, ∠B = ${t}°, ∠C = ${180 - s - t}°`, '세 각만으로는 크기가 정해지지 않음']; },
    () => { const a = ri(r, 2, 5), b = ri(r, 2, 5); return [`AB = ${a} cm, BC = ${b} cm, CA = ${a + b + ri(r, 0, 3)} cm`, '가장 긴 변이 나머지 두 변의 합보다 작지 않음']; },
    () => { const s = ri(r, 18, 24) * 5; return [`AB = ${ri(r, 3, 10)} cm, ∠A = ${s}°, ∠B = ${ri(r, Math.ceil((180 - s) / 5), 20) * 5}°`, '두 각의 합이 180° 이상']; },
  ];
  if (r() < 0.5) { const c = pick(r, OK)(), ws = NO.map((f) => f());
    return build(r, { text: '다음 중 △ABC가 하나로 정해지는 것은?', correct: { s: c }, wrongs: ws.map(([s, why]) => ({ s, note: why })), order: 'shuffle',
      explain: `세 변(SSS), 두 변과 그 끼인각(SAS), 한 변과 그 양 끝 각(ASA, 두 각을 알면 나머지 각도 앎)이 주어지면 하나로 정해져요 → ${c}` }); }
  const [c, why] = pick(r, NO)();
  return build(r, { text: '다음 중 △ABC가 하나로 정해지지 <b>않는</b> 것은?', correct: { s: c }, wrongs: OK.map((f) => ({ s: f(), note: '하나로 정해지는 조건을 고름' })), order: 'shuffle',
    explain: `${c} → ${why}` });
};
G['mc-6'] = (r) => { // 한 변과 한 각이 주어질 때 더 필요한 조건
  const [X, Y, Z] = shuffle(r, ['A', 'B', 'C']), side = (p: string, q2: string) => [p, q2].sort().join(''), [a, opp, t] = ssa(r);
  const opts = { sas: `${side(Y, Z)} = ${ri(r, 3, 10)} cm`, asa1: `∠${X} = ${ri(r, 6, Math.min(20, (175 - t) / 5)) * 5}°`, asa2: `∠${Z} = ${ri(r, 6, Math.min(20, (175 - t) / 5)) * 5}°`, ssa: `${side(X, Z)} = ${opp} cm` };
  return build(r, { text: `△ABC에서 ${side(X, Y)} = ${a} cm, ∠${Y} = ${t}°일 때, △ABC가 하나로 정해지기 위해 더 필요한 조건이 될 수 <b>없는</b> 것은?`, correct: { s: opts.ssa },
    wrongs: [{ s: opts.sas, note: `두 변과 그 끼인각 ∠${Y} (SAS)` }, { s: opts.asa1, note: `한 변 ${side(X, Y)}와 양 끝 각 (ASA)` }, { s: opts.asa2, note: `두 각을 알면 ∠${X}도 알 수 있어 ASA` }], count: 4, order: 'shuffle',
    explain: `${opts.ssa}를 더하면 두 변 ${side(X, Y)}, ${side(X, Z)}와 끼인각이 아닌 ∠${Y} → 하나로 정해지지 않아요. ${side(Y, Z)}(SAS), ∠${X} 또는 ∠${Z}(ASA)는 가능` });
};
// 합동 조건
G['mc-7'] = (r) => {
  const cases: [string, string][] = [
    ['AB = DE, BC = EF, CA = FD', 'SSS'], ['AB = DE, BC = EF, ∠B = ∠E', 'SAS'], ['AC = DF, BC = EF, ∠C = ∠F', 'SAS'], ['BC = EF, ∠B = ∠E, ∠C = ∠F', 'ASA'],
    ['AB = DE, ∠A = ∠D, ∠C = ∠F', 'ASA'], ['AB = DE, BC = EF, ∠A = ∠D', 'NO'], ['∠A = ∠D, ∠B = ∠E, ∠C = ∠F', 'NO']];
  const [cond, ans] = pick(r, cases), name = (k: string) => (k === 'NO' ? '합동이라고 할 수 없다' : `${k} 합동`);
  const why: Record<string, string> = { SSS: '세 변이 각각 같음', SAS: '두 변과 그 끼인각이 같음', ASA: '한 변과 그 양 끝 각이 같음 (두 각이 같으면 나머지 각도 같음)', NO: cond.startsWith('∠') ? '세 각이 같아도 크기는 다를 수 있음' : '같은 각이 두 변의 끼인각이 아님' };
  const order = ['SSS', 'SAS', 'ASA', 'NO'].map(name);
  const t = build(r, { text: `△ABC와 △DEF에서 ${cond} 일 때, 두 삼각형이 합동이 되는 조건은? (꼭짓점은 A와 D, B와 E, C와 F가 대응)`, correct: { s: name(ans) },
    wrongs: ['SSS', 'SAS', 'ASA', 'NO'].filter((k) => k !== ans).map((k) => ({ s: name(k), note: ans === 'NO' ? `${why.NO} — 합동이라고 할 수 없음` : k === 'NO' ? '합동 조건을 찾지 못함' : `${k}가 아니라 ${ans}: ${why[ans]}` })), count: 4, order: 'fixed',
    explain: `${cond} → ${why[ans]} → ${name(ans)}` });
  // 보기는 늘 SSS, SAS, ASA, 할 수 없다 순서로
  const idx = order.map((o) => t.options.indexOf(o) + 1);
  return { ...t, options: order, answer: idx.indexOf(t.answer) + 1, traps: t.traps.map((x: any) => ({ ...x, a: idx.indexOf(x.a) + 1 })), _vals: order.map(() => null) };
};
G['mc-8'] = (r) => { // 합동인 두 삼각형의 대응
  const al = ri(r, 7, 16) * 5, be = ri(r, 7, 16) * 5, ga = 180 - al - be, p = ri(r, 4, 12), qq = ri(r, 4, 12), askF = r() < 0.6;
  if (askF) return build(r, { text: `△ABC ≡ △DEF이고 ∠D = ${al}°, ∠B = ${be}°일 때, ∠F의 크기는?`, correct: { v: q(ga) },
    wrongs: [{ v: q(180 - al), note: `∠B와 대응하는 ∠E(${be}°)를 빼지 않음` }, { v: q(180 - be), note: `∠D(=∠A)를 빼지 않음` }, { v: q(al + be), note: '나머지 각을 구하지 않고 두 각을 더함' }, { v: q(be) }],
    fill: () => q(5 * ri(r, 4, 30)), fmt: degF, order: 'asc', explain: `대응각은 크기가 같음: ∠A = ∠D = ${al}°, ∠E = ∠B = ${be}° → ∠F = 180° − ${al}° − ${be}° = ${ga}°` });
  return build(r, { text: `△ABC ≡ △DEF이고 AB = ${p} cm, EF = ${qq} cm일 때, BC의 길이는?`, correct: { v: q(qq) },
    wrongs: [{ v: q(p), note: '대응변을 잘못 짝지음 (BC의 대응변은 EF)' }, { v: q(p + qq) }, { v: q(Math.abs(p - qq) || 1) }],
    fill: nearInt(r, qq, 4), fmt: cm, order: 'asc', explain: `A↔D, B↔E, C↔F 이므로 BC의 대응변은 EF → BC = ${qq} cm` });
};
G['mc-9'] = (r) => { // 정삼각형 두 개와 SAS (빈칸 채우기)
  const opt = (a: string, b: string, c: string) => ({ s: `(가) ${a}, (나) ${b}, (다) ${c}` });
  return { ...build(r, { text: '선분 AB 위의 점 C에 대하여 AC, CB를 각각 한 변으로 하는 정삼각형 ACD, CBE를 그렸습니다. 다음은 △ACE ≡ △DCB임을 보이는 과정입니다. (가)~(다)에 알맞은 것은?\n△ACE와 △DCB에서 AC = (가), CE = CB (정삼각형의 변)\n∠ACE = 60° + ∠DCE = ∠DCB = (나)\n따라서 △ACE ≡ △DCB ( (다) 합동 )',
    correct: opt('DC', '120°', 'SAS'),
    wrongs: [{ ...opt('DC', '60°', 'SAS'), note: '∠ACE = 60° + 60° = 120° 를 60°로 봄' }, { ...opt('DC', '120°', 'ASA'), note: '두 변과 그 끼인각이 같으므로 SAS' }, { ...opt('CE', '120°', 'SAS'), note: 'AC와 같은 변은 같은 정삼각형 ACD의 변 DC' }, { ...opt('DC', '120°', 'SSS'), note: '세 변이 아니라 두 변과 끼인각' }],
    order: 'shuffle', explain: 'AC = DC(정삼각형 ACD), CE = CB(정삼각형 CBE), ∠DCE = 180° − 60° − 60° = 60° 이므로 ∠ACE = ∠DCB = 120° → 두 변과 그 끼인각이 같으므로 SAS 합동' }),
    fig: shape({ A: P(0, 0), C: P(4, 0), B: P(7, 0), D: P(2, 3.46), E: P(5.5, 2.6) }, [
      { k: 'seg', p: ['A', 'B'] }, { k: 'poly', p: ['A', 'C', 'D'] }, { k: 'poly', p: ['C', 'B', 'E'] }, { k: 'seg', p: ['A', 'E'] }, { k: 'seg', p: ['D', 'B'] }]) };
};
G['mc-10'] = (r) => tfPick(r, ['합동인 두 도형의 넓이는 같다.', '둘레의 길이가 같은 두 정삼각형은 합동이다.', '한 변의 길이가 같은 두 정사각형은 합동이다.', '넓이가 같은 두 원은 합동이다.', '반지름의 길이가 같은 두 원은 합동이다.'],
  [['넓이가 같은 두 삼각형은 합동이다.', '넓이가 같아도 모양이 다를 수 있음'], ['세 각의 크기가 각각 같은 두 삼각형은 합동이다.', '세 각이 같아도 크기가 다를 수 있음'], ['둘레의 길이가 같은 두 직사각형은 합동이다.', '가로·세로가 다를 수 있음 (예: 1×5와 2×4)'], ['넓이가 같은 두 직사각형은 합동이다.', '예: 2×6과 3×4'], ['한 변의 길이가 같은 두 마름모는 합동이다.', '각의 크기가 다를 수 있음']], '합동인 도형');

// ── 중1 2학기 「다각형」: 대각선의 개수, 삼각형의 내각·외각, 다각형의 내각·외각의 합 (작년 도농중 기말 10·14번 유형) ──
const gon = (n: number) => `${koN(n)}각형`;
G['mp-1'] = (r) => { // 한 꼭짓점에서 그은 대각선 수 + 나뉘는 삼각형 수
  const n = ri(r, 5, 15), a = n - 3, b = n - 2;
  return build(r, { text: `${gon(n)}의 한 꼭짓점에서 그을 수 있는 대각선의 개수를 ${M('a')}, 이때 생기는 삼각형의 개수를 ${M('b')}라 할 때, ${M('a + b')}의 값은?`, correct: { v: q(a + b) },
    wrongs: [{ v: q(2 * (n - 1)), note: '대각선을 n − 1개로 셈 (자기 자신과 이웃한 두 꼭짓점은 빼야 함: n − 3)' }, { v: q(a + n - 1), note: '삼각형을 n − 1개로 셈 (n − 2개)' }, { v: q(n * (n - 3) / 2), note: '전체 대각선의 개수를 구함' }, { v: q(2 * n - 3) }],
    fill: nearInt(r, a + b, 4), fmt: intF, order: 'asc', explain: `한 꼭짓점에서 대각선은 ${n} − 3 = ${a}개, 삼각형은 ${n} − 2 = ${b}개 → ${M(`a + b = ${a + b}`)}` });
};
G['mp-2'] = (r) => { // 대각선의 총수
  const n = ri(r, 5, 16), D = n * (n - 3) / 2;
  return build(r, { text: `${gon(n)}의 대각선의 개수는?`, correct: { v: q(D) },
    wrongs: [{ v: q(n * (n - 3)), note: '÷ 2를 빠뜨림 (대각선 하나를 두 번 셈)' }, { v: q(n - 3), note: '한 꼭짓점에서 그은 대각선만 셈' }, ...(n % 2 === 0 ? [{ v: q(n * (n - 2) / 2), note: '한 꼭짓점에서 n − 2개로 셈' }] : [{ v: q(n * (n - 1) / 2), note: '두 꼭짓점을 잇는 선분을 모두 셈 (변도 포함)' }])],
    fill: nearInt(r, D, 6), fmt: ea, order: 'asc', explain: `${M(`[[n(n − 3)|2]] = [[${n} × ${n - 3}|2]] = ${D}`)} (개)` });
};
G['mp-3'] = (r) => { // 대각선 수 → 몇 각형
  const n = ri(r, 5, 15), D = n * (n - 3) / 2, w: Opt[] = [];
  const m2 = (() => { for (let k = 4; k < 60; k++) if (k * (k - 3) === D) return k; return 0; })(); if (m2 && m2 !== n) w.push({ s: gon(m2), note: '÷ 2를 빠뜨림 (n(n − 3) = 대각선 수로 계산)' });
  if (D + 3 < 100 && D + 3 !== n) w.push({ s: gon(D + 3), note: '한 꼭짓점에서 그은 대각선 수로 계산함 (n − 3 = 대각선 수)' });
  w.push({ s: gon(n + 1) }, { s: gon(n - 1) }, { s: gon(n + 2) });
  return build(r, { text: `대각선의 개수가 ${D}개인 다각형은?`, correct: { s: gon(n) }, wrongs: w, order: 'shuffle',
    explain: `${M(`[[n(n − 3)|2]] = ${D}`)} → ${M(`n(n − 3) = ${2 * D} = ${n} × ${n - 3}`)} → ${M(`n = ${n}`)}, ${gon(n)}` });
};
// 삼각형의 내각과 외각
G['mp-4'] = (r) => { // 외각 = 이웃하지 않는 두 내각의 합
  const a = ri(r, 6, 16) * 5, b = ri(r, 6, 16) * 5, x = a + b; if (x >= 175) return G['mp-4'](r);
  const cc = 1 / Math.tan((180 - a - b) * Math.PI / 180), cb = 1 / Math.tan(b * Math.PI / 180), W = cc + cb; // 꼭대기 높이 1, ∠B = b, ∠C = 180 − a − b
  return { ...build(r, { text: `그림과 같이 △ABC에서 ∠A = ${a}°, ∠B = ${b}°이고 변 BC의 연장선 위에 점 D가 있습니다. ∠ACD의 크기는?`, correct: { v: q(x) },
    wrongs: [{ v: q(180 - x), note: '외각 대신 내각 ∠ACB를 구함' }, { v: q(Math.abs(a - b) || 5), note: '두 내각의 차를 구함' }, { v: q(180 - a), note: '이웃하지 않는 두 내각 중 하나만 씀' }],
    fill: () => q(5 * ri(r, 4, 34)), fmt: degF, order: 'asc', explain: `삼각형의 한 외각의 크기는 이웃하지 않는 두 내각의 크기의 합 → ∠ACD = ${a}° + ${b}° = ${x}°` }),
    fig: shape({ B: P(0, 0), C: P(W, 0), A: P(cb, 1), D: P(W + 0.9, 0) }, [{ k: 'poly', p: ['A', 'B', 'C'] }, { k: 'seg', p: ['C', 'D'] },
      { k: 'angle', p: ['C', 'B', 'A'], label: `${b}°` }, { k: 'angle', p: ['B', 'A', 'C'], label: `${a}°` }, { k: 'angle', p: ['D', 'C', 'A'], label: '?' }]) };
};
G['mp-5'] = (r) => { // 세 내각의 비
  for (;;) { const p = ri(r, 1, 5), qq = ri(r, 1, 6), s = ri(r, 2, 9), sum = p + qq + s; if (180 % sum || new Set([p, qq, s]).size < 3) continue;
    const u = 180 / sum, big = Math.max(p, qq, s) * u, ask = pick(r, ['큰', '작은'] as const), ans = ask === '큰' ? big : Math.min(p, qq, s) * u;
    return build(r, { text: `삼각형의 세 내각의 크기의 비가 ${p} : ${qq} : ${s}일 때, 가장 <b>${ask}</b> 각의 크기는?`, correct: { v: q(ans) },
      wrongs: [{ v: q(ask === '큰' ? Math.min(p, qq, s) * u : big), note: `가장 ${ask === '큰' ? '작은' : '큰'} 각을 구함` }, { v: q(2 * ans), note: '내각의 합을 360°로 봄' }, { v: q(u), note: '한 칸(1)의 크기만 구함' }],
      fill: () => q(5 * ri(r, 2, 30)), fmt: degF, order: 'asc', explain: `내각의 합 180° → 한 칸 = 180° ÷ ${sum} = ${u}° → 가장 ${ask} 각 = ${ask === '큰' ? Math.max(p, qq, s) : Math.min(p, qq, s)} × ${u}° = ${ans}°` }); }
};
G['mp-10'] = (r) => { // 별 모양 다섯 각의 합 = 180°
  for (;;) { const xs = [0, 1, 2, 3].map(() => ri(r, 4, 9) * 5), s = xs.reduce((a, b) => a + b, 0), x = 180 - s; if (x < 15 || x > 60) continue;
    const pts: Record<string, number[]> = {}; ['A', 'B', 'C', 'D', 'E'].forEach((k, i) => { const t = (90 + 72 * i) * Math.PI / 180; pts['_' + k] = P(3 * Math.cos(t), 3 * Math.sin(t)); });
    const order = ['_A', '_C', '_E', '_B', '_D'], labs = [...xs.map((v) => `${v}°`), 'x'];
    const items: any[] = [{ k: 'poly', p: order }];
    order.forEach((k, i) => { const prev = order[(i + 4) % 5], next = order[(i + 1) % 5]; items.push({ k: 'angle', p: [next, k, prev], label: labs[i] }); });
    return { ...build(r, { text: `그림과 같은 별 모양에서 다섯 꼭짓점의 각 중 네 각의 크기가 ${xs.map((v) => v + '°').join(', ')}일 때, 나머지 한 각 ${M('∠x')}의 크기는?`, correct: { v: q(x) },
      wrongs: [{ v: q(360 - s), note: '다섯 각의 합을 360°로 봄 (별 모양 다섯 각의 합은 180°)' }, { v: q(540 - s), note: '오각형 내각의 합(540°)을 씀' }, { v: q(x + 10) }],
      fill: () => q(5 * ri(r, 2, 20)), fmt: degF, order: 'asc', explain: `별 모양의 다섯 각의 합은 180° (삼각형의 외각 성질로 다섯 각을 한 삼각형에 모을 수 있음) → ${M(`∠x = 180° − ${s}° = ${x}°`)}` }),
      fig: shape(pts, items) }; }
};
// 다각형의 내각·외각
G['mp-6'] = (r) => { // 내각의 합
  const n = ri(r, 5, 14), S = 180 * (n - 2);
  return build(r, { text: `${gon(n)}의 내각의 크기의 합은?`, correct: { v: q(S) },
    wrongs: [{ v: q(180 * n), note: '180° × n 으로 계산 (삼각형은 n − 2개)' }, { v: q(180 * (n - 3)), note: '대각선 수(n − 3)를 곱함' }, { v: q(360 * (n - 2)) }, { v: q(360), note: '외각의 합과 헷갈림' }],
    fill: () => q(S + 180 * (r() < 0.5 ? -1 : 1) * ri(r, 2, 3)), fmt: degF, order: 'asc', explain: `한 꼭짓점에서 대각선을 그으면 삼각형 ${n} − 2 = ${n - 2}개 → 180° × ${n - 2} = ${S}°` });
};
const REG = [5, 6, 8, 9, 10, 12, 15, 18, 20];
G['mp-7'] = (r) => { // 정다각형 한 내각/한 외각
  const n = pick(r, REG), inner = 180 * (n - 2) / n, outer = 360 / n, askIn = r() < 0.6, ans = askIn ? inner : outer;
  return build(r, { text: `정${gon(n)}의 한 ${askIn ? '내각' : '외각'}의 크기는?`, correct: { v: q(ans) },
    wrongs: askIn ? [{ v: q(outer), note: '한 외각을 구함 (한 내각 = 180° − 한 외각)' }, { v: q(180 * (n - 2)), note: '내각의 합을 구하고 n으로 나누지 않음' }, ...(180 * n % n === 0 && 180 * (n - 3) % n === 0 ? [{ v: q(180 * (n - 3) / n), note: '내각의 합을 180° × (n − 3)으로 계산함' }] : [])]
      : [{ v: q(inner), note: '한 내각을 구함' }, ...(180 % n === 0 ? [{ v: q(180 / n), note: '외각의 합을 180°로 봄 (360°)' }] : []), { v: q(360), note: '외각의 합을 그대로 씀' }],
    fill: () => q(5 * ri(r, 2, 34)), fmt: degF, order: 'asc',
    explain: askIn ? `내각의 합 180° × ${n - 2} = ${180 * (n - 2)}° → ÷ ${n} = ${inner}° (또는 180° − 360° ÷ ${n})` : `외각의 합은 항상 360° → 360° ÷ ${n} = ${outer}°` });
};
G['mp-8'] = (r) => { // 한 내각 : 한 외각 = p : q → 몇 각형
  for (;;) { const n = pick(r, REG), inner = 180 * (n - 2) / n, outer = 360 / n, g = gcd(inner, outer), p = inner / g, qq = outer / g; if (p > 9) continue;
    const w: Opt[] = [...(360 % inner === 0 && 360 / inner >= 3 ? [{ s: `정${gon(360 / inner)}`, note: '내각과 외각을 바꿔 계산함' }] : []), { s: `정${gon(n + 1)}` }, { s: `정${gon(n - 1)}` }, { s: `정${gon(n + 2)}` }, { s: `정${gon(n * 2)}`, note: '한 외각 대신 한 칸(1)의 크기로 나눔' }];
    return build(r, { text: `한 내각의 크기와 한 외각의 크기의 비가 ${p} : ${qq}인 정다각형은?`, correct: { s: `정${gon(n)}` }, wrongs: w, order: 'shuffle',
      explain: `한 내각 + 한 외각 = 180° → 한 외각 = 180° × ${M(frs(qq, p + qq))} = ${outer}° → 360° ÷ ${outer}° = ${n} → 정${gon(n)}` }); }
};
G['mp-9'] = (r) => { // 외각의 합 360°로 x 구하기
  for (;;) { const n = pick(r, [4, 5, 6]), x = ri(r, 10, 40), cs = Array.from({ length: n - 1 }, () => ri(r, 4, 16) * 5), base = cs.reduce((a, b) => a + b, 0), k = ri(r, 1, 3);
    const c0 = 360 - base - k * x; if (c0 === 0 || Math.abs(c0) > 40 || k * x + c0 < 20) continue;
    const xe = `${k === 1 ? '' : k}x ${c0 < 0 ? '−' : '+'} ${Math.abs(c0)}`, w: Opt[] = [];
    const s2 = 180 * (n - 2) - base - c0; if (s2 % k === 0 && s2 / k > 0 && s2 / k !== x) w.push({ v: q(s2 / k), note: '외각의 합을 내각의 합처럼 계산함 (외각의 합은 항상 360°)' });
    const s3 = 180 - base - c0; if (s3 % k === 0 && s3 / k > 0) w.push({ v: q(s3 / k), note: '외각의 합을 180°로 봄' });
    return build(r, { text: `${gon(n)}의 외각의 크기가 각각 ${[...cs.map((c) => `${c}°`), M(`(${xe})°`)].join(', ')}일 때, ${M('x')}의 값은?`, correct: { v: q(x) }, wrongs: w,
      fill: nearInt(r, x, 6), fmt: intF, order: 'asc', explain: `다각형의 외각의 합은 항상 360° → ${M(`${base} + ${xe} = 360`)} → ${M(`${k === 1 ? '' : k}x = ${k * x}`)} → ${M(`x = ${x}`)}` }); }
};

// ── 중1 2학기 「원과 부채꼴」: 중심각과 호·현, 부채꼴의 호의 길이·넓이(π) (작년 도농중 기말 15번·서술형 유형) ──
// π가 들어간 값은 [π의 계수, 상수항] 두 유리수로 다룬다. 보기는 값 순서로 놓는다.
type PV = [Q, Q];
const piNum = (v: PV) => num(v[0]) * Math.PI + num(v[1]);
function piStr(v: PV) {
  const [a, b] = v, ca = a[0] === 0 ? '' : (a[1] === 1 ? (a[0] === 1 ? '' : String(a[0])) : frs(a[0], a[1])) + 'π';
  const cb = b[0] === 0 ? '' : b[1] === 1 ? String(b[0]) : frs(b[0], b[1]);
  return ca && cb ? `(${ca} + ${cb})` : ca || cb || '0';
}
function buildPi(r: Rng, sp: { text: string; correct: PV; wrongs: { v: PV; note?: string }[]; unitS: string; explain: string; fill: () => PV }) {
  const S = (v: PV) => `${M(piStr(v))}${sp.unitS}`, cs = S(sp.correct), have: { s: string; v: PV; note?: string }[] = [];
  const add = (o: { v: PV; note?: string }) => { const s = S(o.v); if (o.v[0][0] >= 0 && o.v[1][0] >= 0 && piNum(o.v) > 0 && s !== cs && !have.some((h) => h.s === s) && Math.abs(piNum(o.v) - piNum(sp.correct)) > 1e-9) have.push({ s, v: o.v, note: o.note }); };
  sp.wrongs.forEach(add); const nMain = have.length; for (let t = 0; have.length < nMain + 30 && t < 600; t++) add({ v: sp.fill() });
  // 정답 자리를 먼저 고르고(함정 보기를 가장 많이 담는 자리 중 무작위) 위·아래 보기를 채운다 — build 의 asc 와 같은 방식
  const c0 = piNum(sp.correct), main = have.slice(0, nMain), extra = shuffle(r, have.slice(nMain)), pool = [...main, ...extra];
  const lo = pool.filter((o) => piNum(o.v) < c0), hi = pool.filter((o) => piNum(o.v) > c0), isMain = (o: any) => main.includes(o);
  const feas = [0, 1, 2, 3, 4].filter((k) => lo.length >= k && hi.length >= 4 - k); if (!feas.length) throw new Error('보기 부족: ' + sp.text);
  const kept = (k: number) => Math.min(lo.filter(isMain).length, k) + Math.min(hi.filter(isMain).length, 4 - k), best = Math.max(...feas.map(kept));
  const k = pick(r, feas.filter((x) => kept(x) >= Math.max(1, best - 1))) ?? pick(r, feas);
  const take = (arr: typeof have, n: number) => [...arr.filter(isMain), ...arr.filter((o) => !isMain(o))].slice(0, n);
  const opts = [...take(lo, k), ...take(hi, 4 - k), { s: cs, v: sp.correct, note: undefined as string | undefined }].sort((x, y) => piNum(x.v) - piNum(y.v));
  const answer = opts.findIndex((o) => o.s === cs) + 1;
  return { text: sp.text, options: opts.map((o) => o.s), answer, traps: opts.map((o, i) => (o.note ? { a: i + 1, note: o.note } : null)).filter(Boolean), explain: sp.explain, _vals: opts.map(() => null) };
}
const pv = (a: Q, b: Q = q(0)): PV => [a, b];
const nearPv = (r: Rng, v: PV) => () => pv(add(v[0], q((r() < 0.5 ? -1 : 1) * ri(r, 1, 6), v[0][1])), v[1]); // 정답과 같은 분모로
const sector = (th: number, lab: { r?: string; t?: string; arc?: string }) => { // 그림의 중심각은 실제 크기, 반지름은 3으로 고정
  const s0 = 90 - th / 2, s1 = s0 * Math.PI / 180, e1 = (s0 + th) * Math.PI / 180;
  const pts = { O: P(0, 0), _A: P(3 * Math.cos(s1), 3 * Math.sin(s1)), _B: P(3 * Math.cos(e1), 3 * Math.sin(e1)), _m: P(3.6 * Math.cos((s1 + e1) / 2), 3.6 * Math.sin((s1 + e1) / 2)) };
  const items: any[] = [{ k: 'arc', c: 'O', r: 3, from: s0, to: s0 + th, sector: true, fill: true }];
  if (lab.r) items.push({ k: 'side', p: ['O', '_A'], label: lab.r });
  if (lab.t) items.push({ k: 'angle', p: ['_A', 'O', '_B'], label: lab.t });
  if (lab.arc) items.push({ k: 'text', at: '_m', s: lab.arc });
  return shape(pts, items);
};
const TH = [30, 40, 45, 60, 72, 90, 120, 135, 144, 150, 210, 240, 270];
// 중심각과 호·넓이의 비례
G['mr-1'] = (r) => {
  for (;;) { const a = ri(r, 2, 12) * 10, b = ri(r, 2, 12) * 10, L = ri(r, 2, 15); if (a === b || (L * b) % a) continue; const ans = L * b / a, isArc = r() < 0.5, u = isArc ? ' cm' : ' cm²', what = isArc ? '호의 길이' : '넓이';
    return build(r, { text: `한 원에서 중심각의 크기가 ${a}°인 부채꼴의 ${what}가 ${L}${u}일 때, 중심각의 크기가 ${b}°인 부채꼴의 ${what}는?`, correct: { v: q(ans) },
      wrongs: [...((L * a) % b === 0 ? [{ v: q(L * a / b), note: '비를 거꾸로 세움 (중심각이 크면 호·넓이도 큼)' }] : []), { v: q(L + b - a > 0 ? L + b - a : L + 1), note: '중심각의 차를 더함 (정비례는 곱하기)' }, ...(isArc ? [] : [{ v: q(ans * b / a === Math.round(ans * b / a) ? ans * b / a : ans + 2), note: '넓이를 중심각의 제곱에 비례한다고 봄' }])],
      fill: nearInt(r, ans, 5), fmt: unit(u), order: 'asc', explain: `한 원에서 ${what}는 중심각의 크기에 정비례 → ${a}° : ${b}° = ${L} : □ → □ = ${L} × ${b} ÷ ${a} = ${ans}${u.trim() ? u : ''}` }); }
};
G['mr-2'] = (r) => { // 넓이로 중심각 구하기
  for (;;) { const a = ri(r, 3, 12) * 10, S1 = ri(r, 3, 20), k = pick(r, [2, 3, 4, [1, 2], [3, 2], [5, 2]] as any[]), kr: Q = Array.isArray(k) ? q(k[0], k[1]) : q(k), S2 = mul(q(S1), kr), b = mul(q(a), kr); if (!isInt(S2) || !isInt(b) || num(b) >= 360 || num(b) === a) continue;
    const ans = num(b), w: Opt[] = [];
    if (isInt(div(q(a), kr))) w.push({ v: div(q(a), kr), note: '비를 거꾸로 세움' });
    w.push({ v: q(a + num(S2) - S1 > 0 ? a + num(S2) - S1 : a + 5), note: '넓이의 차를 더함 (정비례는 곱하기)' });
    return build(r, { text: `한 원에서 중심각의 크기가 ${a}°인 부채꼴의 넓이가 ${S1} cm²일 때, 넓이가 ${num(S2)} cm²인 부채꼴의 중심각의 크기는?`, correct: { v: q(ans) }, wrongs: w,
      fill: () => q(5 * ri(r, 2, 60)), fmt: degF, order: 'asc', explain: `넓이는 중심각에 정비례 → ${S1} : ${num(S2)} = ${a}° : □ → □ = ${a} × ${num(S2)} ÷ ${S1} = ${ans}°` }); }
};
G['mr-3'] = (r) => tfPick(r, ['한 원에서 같은 크기의 중심각에 대한 호의 길이는 같다.', '한 원에서 호의 길이는 중심각의 크기에 정비례한다.', '한 원에서 부채꼴의 넓이는 중심각의 크기에 정비례한다.', '한 원에서 같은 크기의 중심각에 대한 현의 길이는 같다.', '반원은 중심각의 크기가 180°인 부채꼴이다.'],
  [['한 원에서 현의 길이는 중심각의 크기에 정비례한다.', '중심각이 2배가 되어도 현의 길이는 2배보다 짧음'], ['한 원에서 중심각의 크기가 2배이면 부채꼴의 넓이는 4배이다.', '넓이도 중심각에 정비례 → 2배'],
   ['한 원에서 길이가 가장 긴 현은 반지름이다.', '가장 긴 현은 지름'], ['호와 현으로 이루어진 도형을 부채꼴이라 한다.', '그것은 활꼴 (부채꼴은 두 반지름과 호로 이루어짐)'], ['중심각의 크기가 같으면 반지름이 달라도 호의 길이는 같다.', '한 원(반지름이 같은 원)에서만 같음']], '원과 부채꼴');
// π로 나타내는 길이·넓이
G['mr-4'] = (r) => { // 원의 둘레·넓이
  const rad = ri(r, 2, 12), area = r() < 0.5, ans = area ? pv(q(rad * rad)) : pv(q(2 * rad));
  return { ...buildPi(r, { text: `반지름의 길이가 ${rad} cm인 원의 ${area ? '넓이' : '둘레의 길이'}는?`, correct: ans,
    wrongs: area ? [{ v: pv(q(2 * rad)), note: '넓이 대신 둘레를 구함 (넓이 = πr²)' }, { v: pv(q(4 * rad * rad)), note: '반지름 대신 지름을 제곱함' }, { v: pv(q(rad)), note: 'πr로 계산함' }]
      : [{ v: pv(q(rad * rad)), note: '둘레 대신 넓이를 구함 (둘레 = 2πr)' }, { v: pv(q(rad)), note: '2를 곱하지 않음 (둘레 = 2πr)' }, { v: pv(q(4 * rad)), note: '반지름을 지름으로 보고 또 2배 함' }],
    unitS: area ? ' cm²' : ' cm', fill: nearPv(r, ans), explain: area ? `원의 넓이 = πr² = π × ${rad}² = ${piStr(ans)} (cm²)` : `원의 둘레 = 2πr = 2 × π × ${rad} = ${piStr(ans)} (cm)` }),
    fig: shape({ O: P(0, 0), _a: P(3, 0) }, [{ k: 'circle', c: 'O', r: 3 }, { k: 'dot', p: 'O' }, { k: 'seg', p: ['O', '_a'], label: `${rad} cm` }]) };
};
function secPair(r: Rng) { for (;;) { const rad = ri(r, 2, 12), th = pick(r, TH); const L = q(2 * rad * th, 360), A = q(rad * rad * th, 360); if (L[1] <= 4 && A[1] <= 4) return { rad, th, L, A }; } }
G['mr-5'] = (r) => { // 부채꼴의 호의 길이
  const { rad, th, L, A } = secPair(r);
  return { ...buildPi(r, { text: `반지름의 길이가 ${rad} cm이고 중심각의 크기가 ${th}°인 부채꼴의 호의 길이는?`, correct: pv(L),
    wrongs: [{ v: pv(A), note: '호의 길이 대신 넓이를 구함' }, { v: pv(q(rad * th, 360)), note: '2를 곱하지 않음 (호 = 2πr × 중심각/360)' }, { v: pv(q(2 * rad)), note: '원 전체의 둘레를 구함' }],
    unitS: ' cm', fill: nearPv(r, pv(L)), explain: `호의 길이 = 2πr × ${M(frs(th, 360))} = 2 × π × ${rad} × ${M(frs(th, 360))} = ${M(piStr(pv(L)))} (cm)` }),
    fig: sector(th, { r: `${rad} cm`, t: `${th}°` }) };
};
G['mr-6'] = (r) => { // 부채꼴의 넓이
  const { rad, th, L, A } = secPair(r);
  return { ...buildPi(r, { text: `반지름의 길이가 ${rad} cm이고 중심각의 크기가 ${th}°인 부채꼴의 넓이는?`, correct: pv(A),
    wrongs: [{ v: pv(L), note: '넓이 대신 호의 길이를 구함' }, { v: pv(q(rad * rad)), note: '원 전체의 넓이를 구함' }, { v: pv(mul(A, q(2))), note: '2πr²으로 계산함' }, { v: pv(q(rad * rad * (360 - th), 360)), note: '나머지 부분의 넓이를 구함' }],
    unitS: ' cm²', fill: nearPv(r, pv(A)), explain: `부채꼴의 넓이 = πr² × ${M(frs(th, 360))} = π × ${rad}² × ${M(frs(th, 360))} = ${M(piStr(pv(A)))} (cm²)` }),
    fig: sector(th, { r: `${rad} cm`, t: `${th}°` }) };
};
G['mr-7'] = (r) => { // 부채꼴의 둘레
  const { rad, th, L } = secPair(r), ans = pv(L, q(2 * rad));
  return { ...buildPi(r, { text: `반지름의 길이가 ${rad} cm이고 중심각의 크기가 ${th}°인 부채꼴의 둘레의 길이는?`, correct: ans,
    wrongs: [{ v: pv(L), note: '호의 길이만 구함 (둘레 = 호 + 반지름 2개)' }, { v: pv(L, q(rad)), note: '반지름을 하나만 더함' }, { v: pv(q(2 * rad), q(2 * rad)), note: '원 전체의 둘레에 반지름을 더함' }],
    unitS: ' cm', fill: () => pv(add(L, q((r() < 0.5 ? -1 : 1) * ri(r, 1, 3))), q(2 * rad + (r() < 0.5 ? 0 : ri(r, -2, 2)))), explain: `둘레 = 호 + 반지름 × 2 = ${M(piStr(pv(L)))} + ${2 * rad} = ${M(piStr(ans))} (cm)` }),
    fig: sector(th, { r: `${rad} cm`, t: `${th}°` }) };
};
G['mr-8'] = (r) => { // 반지름과 호로 넓이 (½rl)
  const { rad, L } = secPair(r), A = mul(mul(q(rad), L), q(1, 2));
  return { ...buildPi(r, { text: `반지름의 길이가 ${rad} cm이고 호의 길이가 ${M(piStr(pv(L)))} cm인 부채꼴의 넓이는?`, correct: pv(A),
    wrongs: [{ v: pv(mul(q(rad), L)), note: '½을 곱하지 않음 (넓이 = ½ × 반지름 × 호)' }, { v: pv(add(L, q(0)), q(0)), note: '호의 길이를 그대로 씀' }, { v: pv(q(rad * rad)), note: '원 전체의 넓이를 구함' }],
    unitS: ' cm²', fill: nearPv(r, pv(A)), explain: `부채꼴의 넓이 = ${M('[[1|2]]rl')} = ${M(`[[1|2]] × ${rad} × ${piStr(pv(L))}`)} = ${M(piStr(pv(A)))} (cm²)` }),
    fig: sector(100, { r: `${rad} cm`, arc: `${piStr(pv(L)).replace(/\[\[(\d+)\|(\d+)\]\]/, '$1/$2')} cm` }) };
};
G['mr-9'] = (r) => { // 호의 길이로 중심각
  const { rad, th, L } = secPair(r);
  return { ...build(r, { text: `반지름의 길이가 ${rad} cm이고 호의 길이가 ${M(piStr(pv(L)))} cm인 부채꼴의 중심각의 크기는?`, correct: { v: q(th) },
    wrongs: [...(isInt(q(360 * L[0], L[1] * rad)) ? [{ v: q(360 * L[0], L[1] * rad), note: '2를 빼먹고 πr로 나눔 (원 둘레는 2πr)' }] : []), ...(th * 2 < 360 ? [] : []), { v: q(Math.round(th / 2 / 5) * 5 || 5), note: '중심각을 절반으로 계산함' }],
    fill: () => q(5 * ri(r, 4, 60)), fmt: degF, order: 'asc', explain: `2π × ${rad} × ${M(frs('x', 360))} = ${M(piStr(pv(L)))} → ${M(`x = ${th}`)}°` }),
    fig: sector(th, { r: `${rad} cm`, t: 'x', arc: `${piStr(pv(L)).replace(/\[\[(\d+)\|(\d+)\]\]/, '$1/$2')} cm` }) };
};
G['mr-10'] = (r) => { // 트랙: 바깥쪽과 안쪽 레인 둘레 차 (기출 서술형)
  const R = ri(r, 10, 30), w = ri(r, 1, 3), Ls = ri(r, 4, 10) * 10, ans = pv(q(2 * w));
  return { ...buildPi(r, { text: `직사각형의 양쪽에 반원을 붙인 모양의 트랙이 있습니다. 직선 구간은 ${Ls} m이고, 안쪽 레인의 반원의 반지름은 ${R} m, 바깥쪽 레인의 반원의 반지름은 ${R + w} m입니다. 바깥쪽 레인을 한 바퀴 돈 거리는 안쪽 레인보다 몇 m 더 긴가요?`, correct: ans,
    wrongs: [{ v: pv(q(w)), note: '반원 두 개가 원 하나가 됨을 놓침 (2πr)' }, { v: pv(q(2 * (R + w))), note: '바깥쪽 원의 둘레를 구함 (차이를 구해야 함)' }, { v: pv(q(2 * w), q(2 * Ls)), note: '직선 구간도 더함 (직선은 두 레인이 같음)' }, { v: pv(q(4 * w)), note: '반원을 원 하나씩으로 셈' }],
    unitS: ' m', fill: nearPv(r, ans), explain: `직선 구간은 같으므로 반원 두 개(= 원 하나)만 비교: 2π × ${R + w} − 2π × ${R} = ${M(piStr(ans))} (m) — 반지름이 ${w} m 커지면 둘레는 2π × ${w}만큼 길어져요` }),
    fig: shape({ _a: P(-3, -2), _b: P(3, -2), _c: P(3, 2), _d: P(-3, 2), _e: P(-3, -2.6), _f: P(3, -2.6), _g: P(3, 2.6), _h: P(-3, 2.6), _L: P(-3, 0), _R: P(3, 0) }, [
      { k: 'seg', p: ['_a', '_b'] }, { k: 'seg', p: ['_d', '_c'] }, { k: 'seg', p: ['_e', '_f'] }, { k: 'seg', p: ['_h', '_g'] },
      { k: 'arc', c: '_R', r: 2, from: -90, to: 90 }, { k: 'arc', c: '_L', r: 2, from: 90, to: 270 }, { k: 'arc', c: '_R', r: 2.6, from: -90, to: 90 }, { k: 'arc', c: '_L', r: 2.6, from: 90, to: 270 },
      { k: 'text', at: [0, 0], s: `직선 ${Ls} m` }]) };
};

// ── 중1 2학기 「입체도형」: 다면체·정다면체, 회전체, 기둥·뿔·구의 겉넓이와 부피 (작년 도농중 기말 16~19번 유형) ──
const solidName = (kind: 'prism' | 'pyramid' | 'frustum', n: number) => `${koN(n)}각${kind === 'prism' ? '기둥' : kind === 'pyramid' ? '뿔' : '뿔대'}`;
const facesOf = (kind: string, n: number) => (kind === 'pyramid' ? n + 1 : n + 2);
G['ms-1'] = (r) => { // ○면체가 아닌 것
  for (;;) { const F = ri(r, 5, 8), all: [string, number][] = []; // 구면체(9)는 구와 헷갈려서 뺌
    for (const kind of ['prism', 'pyramid', 'frustum'] as const) for (let n = 3; n <= 10; n++) all.push([solidName(kind, n), facesOf(kind, n)]);
    const yes = shuffle(r, all.filter(([, f]) => f === F)), no = shuffle(r, all.filter(([, f]) => f === F + 1 || f === F - 1)); if (!yes.length || no.length < 4) continue;
    const c = yes[0], ws = no.slice(0, 4);
    return build(r, { text: `다음 중 ${koN(F)}면체인 것은?`, correct: { s: c[0] }, wrongs: ws.map(([s, f]) => ({ s, note: `${s}의 면은 ${f}개 (${s.endsWith('뿔') ? 'n각뿔은 n + 1개' : 'n각기둥·n각뿔대는 n + 2개'})` })), order: 'shuffle',
      explain: `면의 수: n각기둥·n각뿔대 n + 2개, n각뿔 n + 1개 → ${c[0]}의 면은 ${c[1]}개 (${koN(F)}면체)` }); }
};
G['ms-2'] = (r) => tfPick(r, ['정다면체는 정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체의 5가지뿐이다.', '정십이면체의 면의 모양은 정오각형이다.', '정팔면체의 한 꼭짓점에 모인 면은 4개이다.', '정이십면체의 면의 모양은 정삼각형이다.', '정육면체의 한 꼭짓점에 모인 면은 3개이다.'],
  [['정다면체의 면이 될 수 있는 정다각형은 정삼각형, 정사각형, 정오각형, 정육각형이다.', '정육각형으로는 정다면체를 만들 수 없음 (한 꼭짓점에 모인 각의 합이 360°가 됨)'], ['정사면체의 모서리는 4개이다.', '정사면체의 모서리는 6개'], ['정팔면체의 꼭짓점은 8개이다.', '정팔면체의 꼭짓점은 6개'],
   ['면의 모양이 정삼각형인 정다면체는 정사면체뿐이다.', '정팔면체·정이십면체도 면이 정삼각형'], ['정십이면체의 한 꼭짓점에 모인 면은 4개이다.', '정십이면체의 한 꼭짓점에 모인 면은 3개']], '정다면체');
G['ms-3'] = (r) => { // 모서리 수로 각뿔대의 면 수
  const n = ri(r, 3, 12), E = 3 * n;
  return { ...build(r, { text: `모서리가 ${E}개인 각뿔대의 면의 개수는?`, correct: { v: q(n + 2) },
    wrongs: [{ v: q(E / 3), note: '밑면의 변의 수만 구함 (면 = 옆면 n + 밑면 2)' }, ...(E % 2 === 0 ? [{ v: q(E / 2 + 1), note: '각뿔로 생각함 (각뿔은 모서리 2n)' }] : []), { v: q(2 * n), note: '꼭짓점의 수를 구함' }, { v: q(n + 1), note: '밑면을 1개로 셈' }],
    fill: nearInt(r, n + 2, 3), fmt: ea, order: 'asc', explain: `n각뿔대의 모서리 3n개 → n = ${E} ÷ 3 = ${n} → 면은 ${n} + 2 = ${n + 2}개` }),
    fig: { type: 'solid', kind: 'frustum', n: Math.min(n, 8), r: 3, r2: 1.6, h: 3 } };
};
G['ms-4'] = (r) => tfPick(r, ['원뿔을 회전축에 수직인 평면으로 자르면 단면은 원이다.', '구는 어떤 평면으로 잘라도 단면이 원이다.', '원기둥을 회전축을 포함하는 평면으로 자르면 단면은 직사각형이다.', '원뿔을 회전축을 포함하는 평면으로 자르면 단면은 이등변삼각형이다.', '원뿔대를 회전축을 포함하는 평면으로 자르면 단면은 사다리꼴이다.'],
  [['원뿔을 회전축을 포함하는 평면으로 자르면 단면은 직각삼각형이다.', '이등변삼각형'], ['원기둥을 회전축에 수직인 평면으로 자르면 단면은 직사각형이다.', '원'], ['구를 회전축을 포함하는 평면으로 자르면 단면은 반원이다.', '원'],
   ['원뿔대를 회전축에 수직인 평면으로 자르면 단면은 사다리꼴이다.', '원'], ['회전체를 회전축에 수직인 평면으로 자른 단면은 항상 서로 합동이다.', '원뿔·원뿔대는 자르는 위치에 따라 크기가 다른 원']], '회전체');
G['ms-5'] = (r) => { // 회전축을 포함하는 단면의 넓이
  if (r() < 0.5) { const a = ri(r, 2, 9), b = ri(r, 3, 12); if (a === b) return G['ms-5'](r); const ans = 2 * a * b;
    return { ...build(r, { text: `가로 ${a} cm, 세로 ${b} cm인 직사각형을 세로를 회전축으로 하여 한 바퀴 돌려 만든 입체도형을 회전축을 포함하는 평면으로 자른 단면의 넓이는?`, correct: { v: q(ans) },
      wrongs: [{ v: q(a * b), note: '돌리기 전 직사각형의 넓이를 구함 (단면은 축 양쪽으로 2배)' }, { v: q(4 * a * b), note: '가로·세로를 모두 2배 함 (세로는 축이라 그대로)' }, { v: q(2 * (2 * a + b)), note: '넓이 대신 둘레를 구함' }],
      fill: nearInt(r, ans, 8), fmt: cm2, order: 'asc', explain: `원기둥의 단면은 가로 ${a} × 2 = ${2 * a} cm, 세로 ${b} cm인 직사각형 → ${2 * a} × ${b} = ${ans} cm²` }),
      fig: shape({ _A: P(0, 0), _B: P(a, 0), _C: P(a, b), _D: P(0, b), _t: P(0, b + 1.5), _u: P(0, -1.5) }, [{ k: 'seg', p: ['_u', '_t'], dash: true }, { k: 'poly', p: ['_A', '_B', '_C', '_D'], fill: true }, { k: 'side', p: ['_A', '_B'], label: `${a} cm` }, { k: 'side', p: ['_D', '_A'], label: `${b} cm` }]) }; }
  let rad: number, h: number; do { rad = ri(r, 2, 9); h = ri(r, 3, 12); } while (rad === h); const ans = rad * h;
  return { ...build(r, { text: `직각을 낀 두 변이 ${rad} cm, ${h} cm인 직각삼각형을 ${h} cm인 변을 회전축으로 하여 한 바퀴 돌려 만든 입체도형을 회전축을 포함하는 평면으로 자른 단면의 넓이는?`, correct: { v: q(ans) },
    wrongs: [...((rad * h) % 2 === 0 ? [{ v: q(rad * h / 2), note: '돌리기 전 직각삼각형의 넓이를 구함 (단면은 그 2배인 이등변삼각형)' }] : []), { v: q(2 * rad * h), note: '÷ 2를 빠뜨림 (삼각형 넓이)' }, { v: q(4 * rad * h) }],
    fill: nearInt(r, ans, 6), fmt: cm2, order: 'asc', explain: `원뿔의 단면은 밑변 ${rad} × 2 = ${2 * rad} cm, 높이 ${h} cm인 이등변삼각형 → ${2 * rad} × ${h} ÷ 2 = ${ans} cm²` }),
    fig: shape({ _O: P(0, 0), _A: P(rad, 0), _T: P(0, h), _u: P(0, -h * 0.15), _t: P(0, h * 1.15) }, [{ k: 'seg', p: ['_u', '_t'], dash: true }, { k: 'poly', p: ['_O', '_A', '_T'], fill: true }, { k: 'right', p: ['_A', '_O', '_T'] }, { k: 'side', p: ['_O', '_A'], label: `${rad} cm` }, { k: 'side', p: ['_T', '_O'], label: `${h} cm` }]) };
};
// 겉넓이와 부피 (π)
G['ms-6'] = (r) => { // 원기둥의 겉넓이
  const rad = ri(r, 2, 8), h = ri(r, 3, 12), ans = pv(q(2 * rad * rad + 2 * rad * h));
  return { ...buildPi(r, { text: `밑면의 반지름의 길이가 ${rad} cm, 높이가 ${h} cm인 원기둥의 겉넓이는?`, correct: ans,
    wrongs: [{ v: pv(q(rad * rad + 2 * rad * h)), note: '밑면을 하나만 더함 (밑면은 2개)' }, { v: pv(q(2 * rad * h)), note: '옆넓이만 구함' }, { v: pv(q(rad * rad * h)), note: '겉넓이 대신 부피를 구함' }, { v: pv(q(2 * rad * rad + rad * h)), note: '옆면의 가로를 πr로 계산함 (2πr)' }],
    unitS: ' cm²', fill: nearPv(r, ans), explain: `밑넓이 π × ${rad}² = ${rad * rad}π, 두 개 → ${2 * rad * rad}π / 옆넓이 = 2π × ${rad} × ${h} = ${2 * rad * h}π → 겉넓이 ${M(piStr(ans))} cm²` }),
    fig: { type: 'solid', kind: 'cylinder', r: rad, h, labels: { r: `${rad} cm`, h: `${h} cm` }, show: ['r'] } };
};
G['ms-7'] = (r) => { // 기둥의 부피
  if (r() < 0.5) { const rad = ri(r, 2, 8), h = ri(r, 3, 12), ans = pv(q(rad * rad * h));
    return { ...buildPi(r, { text: `밑면의 반지름의 길이가 ${rad} cm, 높이가 ${h} cm인 원기둥의 부피는?`, correct: ans,
      wrongs: [{ v: pv(q(2 * rad * h)), note: '부피 대신 옆넓이를 구함' }, { v: pv(q(rad * rad * h, 3)), note: '뿔처럼 ⅓을 곱함' }, { v: pv(q(2 * rad * rad * h)), note: '밑넓이를 2πr²으로 계산함' }, { v: pv(q(rad * h)) }],
      unitS: ' cm³', fill: nearPv(r, ans), explain: `기둥의 부피 = 밑넓이 × 높이 = π × ${rad}² × ${h} = ${M(piStr(ans))} cm³` }),
      fig: { type: 'solid', kind: 'cylinder', r: rad, h, labels: { r: `${rad} cm`, h: `${h} cm` }, show: ['r'] } }; }
  const a = ri(r, 3, 10), b = ri(r, 2, 8), h = ri(r, 3, 12), V = a * b * h / 2; if (!Number.isInteger(V)) return G['ms-7'](r);
  return { ...build(r, { text: `밑면이 밑변 ${a} cm, 높이 ${b} cm인 삼각형이고, 기둥의 높이가 ${h} cm인 삼각기둥의 부피는?`, correct: { v: q(V) },
    wrongs: [{ v: q(a * b * h), note: '밑면 삼각형의 넓이에서 ÷ 2를 빠뜨림' }, { v: q(V / 3 === Math.round(V / 3) ? V / 3 : V + 3), note: '뿔처럼 ⅓을 곱함' }],
    fill: nearInt(r, V, 10), fmt: cm3, order: 'asc', explain: `밑넓이 ${a} × ${b} ÷ 2 = ${a * b / 2} cm² → 부피 = ${a * b / 2} × ${h} = ${V} cm³` }),
    fig: { type: 'solid', kind: 'prism', n: 3, r: 3, h: 4 } };
};
G['ms-8'] = (r) => { // 뿔의 부피
  if (r() < 0.5) { for (;;) { const a = ri(r, 2, 9), h = ri(r, 3, 12); if ((a * a * h) % 3) continue; const V = a * a * h / 3;
    return { ...build(r, { text: `밑면이 한 변의 길이가 ${a} cm인 정사각형이고 높이가 ${h} cm인 사각뿔의 부피는?`, correct: { v: q(V) },
      wrongs: [{ v: q(a * a * h), note: '⅓을 곱하지 않음 (뿔의 부피 = ⅓ × 밑넓이 × 높이)' }, ...((a * a * h) % 2 === 0 ? [{ v: q(a * a * h / 2), note: '½을 곱함' }] : []), { v: q(a * a + h) }],
      fill: nearInt(r, V, 10), fmt: cm3, order: 'asc', explain: `뿔의 부피 = ${M('[[1|3]]')} × 밑넓이 × 높이 = ${M('[[1|3]]')} × ${a * a} × ${h} = ${V} cm³` }),
      fig: { type: 'solid', kind: 'pyramid', n: 4, r: 3, h: 4, labels: { h: `${h} cm` }, show: ['h'] } }; } }
  const rad = ri(r, 2, 9), h = ri(r, 3, 12), ans = pv(q(rad * rad * h, 3));
  return { ...buildPi(r, { text: `밑면의 반지름의 길이가 ${rad} cm, 높이가 ${h} cm인 원뿔의 부피는?`, correct: ans,
    wrongs: [{ v: pv(q(rad * rad * h)), note: '⅓을 곱하지 않음 (원기둥의 부피를 구함)' }, { v: pv(q(2 * rad * h, 3)), note: '밑넓이를 2πr로 계산함' }, { v: pv(q(rad * h * h, 3)), note: '반지름과 높이를 바꿈' }],
    unitS: ' cm³', fill: nearPv(r, ans), explain: `원뿔의 부피 = ${M('[[1|3]]')} × π × ${rad}² × ${h} = ${M(piStr(ans))} cm³` }),
    fig: { type: 'solid', kind: 'cone', r: rad, h, labels: { r: `${rad} cm`, h: `${h} cm` }, show: ['h', 'r'] } };
};
G['ms-9'] = (r) => { // 구·반구
  const rad = ri(r, 2, 9), ask = pick(r, ['구의 겉넓이', '구의 부피', '반구의 겉넓이'] as const);
  if (ask === '구의 부피') { const ans = pv(q(4 * rad ** 3, 3));
    return { ...buildPi(r, { text: `반지름의 길이가 ${rad} cm인 구의 부피는?`, correct: ans,
      wrongs: [{ v: pv(q(4 * rad * rad)), note: '부피 대신 겉넓이를 구함' }, { v: pv(q(rad ** 3 * 4)), note: '⅓을 곱하지 않음 (구의 부피 = ⁴⁄₃πr³)' }, { v: pv(q(2 * rad ** 3, 3)), note: '반구의 부피를 구함' }],
      unitS: ' cm³', fill: nearPv(r, ans), explain: `구의 부피 = ${M('[[4|3]]πr^3')} = ${M(`[[4|3]] × π × ${rad}^3`)} = ${M(piStr(ans))} cm³` }), fig: { type: 'solid', kind: 'sphere', r: rad, labels: { r: `${rad} cm` }, show: ['r'] } }; }
  if (ask === '구의 겉넓이') { const ans = pv(q(4 * rad * rad));
    return { ...buildPi(r, { text: `반지름의 길이가 ${rad} cm인 구의 겉넓이는?`, correct: ans,
      wrongs: [{ v: pv(q(rad * rad)), note: '원의 넓이(πr²)를 구함 (구의 겉넓이 = 4πr²)' }, { v: pv(q(2 * rad * rad)), note: '반구의 곡면만 구함' }, { v: pv(q(4 * rad ** 3, 3)), note: '겉넓이 대신 부피를 구함' }],
      unitS: ' cm²', fill: nearPv(r, ans), explain: `구의 겉넓이 = 4πr² = 4 × π × ${rad}² = ${M(piStr(ans))} cm²` }), fig: { type: 'solid', kind: 'sphere', r: rad, labels: { r: `${rad} cm` }, show: ['r'] } }; }
  const ans = pv(q(3 * rad * rad));
  return { ...buildPi(r, { text: `반지름의 길이가 ${rad} cm인 반구의 겉넓이는?`, correct: ans,
    wrongs: [{ v: pv(q(2 * rad * rad)), note: '곡면만 구함 (평평한 밑면 πr²도 더해야 함)' }, { v: pv(q(4 * rad * rad)), note: '구 전체의 겉넓이를 구함' }, { v: pv(q(5 * rad * rad)), note: '구 겉넓이에 밑면을 더함' }],
    unitS: ' cm²', fill: nearPv(r, ans), explain: `반구 = 곡면(구 겉넓이의 반) 2π × ${rad}² + 밑면 π × ${rad}² = ${2 * rad * rad}π + ${rad * rad}π = ${M(piStr(ans))} cm²` }),
    fig: { type: 'solid', kind: 'hemisphere', r: rad, labels: { r: `${rad} cm` }, show: ['r'] } };
};
G['ms-10'] = (r) => { // 직각삼각형을 돌린 원뿔의 겉넓이·부피 (기출 19번)
  const [x, y, z] = pick(r, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [9, 12, 15]]), [rad, h] = r() < 0.5 ? [x, y] : [y, x], l = z, vol = r() < 0.5;
  const fig = shape({ _O: P(0, 0), _A: P(rad, 0), _T: P(0, h), _u: P(0, -h * 0.15), _t: P(0, h * 1.15) }, [{ k: 'seg', p: ['_u', '_t'], dash: true }, { k: 'poly', p: ['_O', '_A', '_T'], fill: true }, { k: 'right', p: ['_A', '_O', '_T'] },
    { k: 'side', p: ['_O', '_A'], label: `${rad} cm` }, { k: 'side', p: ['_T', '_O'], label: `${h} cm` }, { k: 'side', p: ['_A', '_T'], label: `${l} cm` }]);
  const head = `직각을 낀 두 변이 ${rad} cm, ${h} cm이고 빗변이 ${l} cm인 직각삼각형을 ${h} cm인 변을 회전축으로 하여 한 바퀴 돌려 만든 입체도형의`;
  if (vol) { const ans = pv(q(rad * rad * h, 3));
    return { ...buildPi(r, { text: `${head} 부피는?`, correct: ans,
      wrongs: [{ v: pv(q(rad * rad * h)), note: '⅓을 곱하지 않음' }, { v: pv(q(h * h * rad, 3)), note: '반지름과 높이를 바꿈 (축이 높이, 다른 변이 반지름)' }, { v: pv(q(rad * rad * l, 3)), note: '높이 대신 빗변(모선)을 씀' }],
      unitS: ' cm³', fill: nearPv(r, ans), explain: `밑면의 반지름 ${rad} cm, 높이 ${h} cm인 원뿔 → ${M('[[1|3]]')} × π × ${rad}² × ${h} = ${M(piStr(ans))} cm³` }), fig }; }
  const ans = pv(q(rad * rad + rad * l));
  return { ...buildPi(r, { text: `${head} 겉넓이는?`, correct: ans,
    wrongs: [{ v: pv(q(rad * l)), note: '옆넓이만 구함 (밑넓이 πr²도 더함)' }, { v: pv(q(rad * rad + rad * h)), note: '옆넓이에 모선 대신 높이를 씀 (옆넓이 = πrl)' }, { v: pv(q(h * h + h * l)), note: '반지름과 높이를 바꿈' }, { v: pv(q(rad * rad + 2 * rad * l)), note: '옆넓이를 2πrl로 계산함' }],
    unitS: ' cm²', fill: nearPv(r, ans), explain: `밑면의 반지름 ${rad} cm, 모선 ${l} cm인 원뿔 → 밑넓이 π × ${rad}² = ${rad * rad}π, 옆넓이 π × ${rad} × ${l} = ${rad * l}π → ${M(piStr(ans))} cm²` }), fig };
};

// ── 다희(초4) 4-2 「삼각형」: 이등변삼각형·정삼각형, 예각·직각·둔각삼각형 ──
G['ht-1'] = (r) => { // 이등변삼각형 둘레 → 나머지 한 변
  for (;;) { const a = ri(r, 4, 15), b = ri(r, 3, 15), Lp = 2 * a + b; if (b === a || b >= 2 * a) continue;
    return { ...build(r, { text: `이등변삼각형에서 길이가 같은 두 변이 각각 ${a} cm이고, 세 변의 길이의 합이 ${Lp} cm입니다. 나머지 한 변은 몇 cm인가요?`, correct: { v: q(b) },
      wrongs: [{ v: q(Lp - a), note: '같은 변을 하나만 뺌 (같은 변이 2개)' }, ...(Lp % 3 === 0 ? [{ v: q(Lp / 3), note: '정삼각형처럼 3으로 나눔' }] : []), { v: q(Lp + a) }, { v: q(a), note: '같은 변의 길이를 그대로 씀' }],
      fill: nearInt(r, b, 4), fmt: cm, order: 'asc', explain: `${Lp} − ${a} − ${a} = ${b} cm (길이가 같은 변이 2개)` }),
      fig: shape({ _B: P(0, 0), _C: P(b, 0), _A: P(b / 2, Math.sqrt(a * a - b * b / 4)) }, [{ k: 'poly', p: ['_A', '_B', '_C'] }, { k: 'side', p: ['_B', '_A'], label: `${a} cm` }, { k: 'side', p: ['_A', '_C'], label: `${a} cm` }, { k: 'side', p: ['_B', '_C'], label: '? cm' }, { k: 'tick', p: ['_A', '_B'] }, { k: 'tick', p: ['_A', '_C'] }]) }; }
};
G['ht-2'] = (r) => { // 꼭지각 → 밑각
  const t = ri(r, 4, 28) * 5, ans = (180 - t) / 2; if (!Number.isInteger(ans)) return G['ht-2'](r);
  return build(r, { text: `이등변삼각형에서 길이가 같은 두 변 사이의 각이 ${t}°일 때, 나머지 한 각(밑각)의 크기는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(180 - t), note: '÷ 2를 빠뜨림 (크기가 같은 밑각이 2개)' }, { v: q(t), note: '주어진 각을 그대로 고름' }, ...(t < 90 ? [{ v: q(90 - t), note: '삼각형 세 각의 합을 90°로 봄' }] : [])],
    fill: () => q(Math.max(5, ans + (r() < 0.5 ? -1 : 1) * ri(r, 1, 6) * 5)), fmt: degF, order: 'asc', explain: `세 각의 합 180° → 180° − ${t}° = ${180 - t}°, 밑각 두 개가 같으므로 ÷ 2 → ${ans}°` });
};
G['ht-3'] = (r) => { // 밑각 → 꼭지각
  const b = ri(r, 7, 17) * 5, ans = 180 - 2 * b;
  return build(r, { text: `이등변삼각형에서 크기가 같은 두 각이 각각 ${b}°일 때, 나머지 한 각의 크기는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(180 - b), note: '같은 각을 하나만 뺌 (같은 각이 2개)' }, { v: q(b), note: '주어진 각을 그대로 고름' }, { v: q(360 - 2 * b), note: '삼각형 세 각의 합을 360°로 봄' }],
    fill: () => q(Math.max(5, ans + (r() < 0.5 ? -1 : 1) * ri(r, 1, 6) * 5)), fmt: degF, order: 'asc', explain: `180° − ${b}° − ${b}° = ${ans}°` });
};
G['ht-4'] = (r) => { // 정삼각형 둘레 → 한 변
  const a = ri(r, 3, 25), Lp = 3 * a;
  return build(r, { text: `세 변의 길이의 합이 ${Lp} cm인 정삼각형의 한 변은 몇 cm인가요?`, correct: { v: q(a) },
    wrongs: [...(Lp % 2 === 0 ? [{ v: q(Lp / 2), note: '2로 나눔 (정삼각형은 세 변이 같으므로 3으로 나눔)' }] : []), ...(Lp % 4 === 0 ? [{ v: q(Lp / 4), note: '정사각형처럼 4로 나눔' }] : []), { v: q(Lp - 3), note: '3으로 나누지 않고 뺌' }, { v: q(Lp) }],
    fill: nearInt(r, a, 4), fmt: cm, order: 'asc', explain: `정삼각형은 세 변의 길이가 모두 같아요 → ${Lp} ÷ 3 = ${a} cm` });
};
G['ht-5'] = (r) => tfPick(r, ['정삼각형의 세 각은 모두 60°이다.', '이등변삼각형은 두 각의 크기가 같다.', '정삼각형은 이등변삼각형이라고 할 수 있다.', '정삼각형은 세 변의 길이가 모두 같다.', '직각삼각형에는 직각이 한 개 있다.'],
  [['이등변삼각형은 세 변의 길이가 모두 같다.', '이등변삼각형은 두 변의 길이가 같음'], ['정삼각형의 한 각은 90°이다.', '정삼각형의 한 각은 60°'], ['이등변삼각형은 모두 정삼각형이다.', '두 변만 같은 이등변삼각형도 있음'],
   ['둔각삼각형에는 둔각이 두 개 있다.', '둔각은 한 개만 있을 수 있음 (두 개면 합이 180°보다 커짐)'], ['예각삼각형에는 예각이 두 개 있다.', '예각삼각형은 세 각이 모두 예각']], '삼각형');
const TRI3 = ['예각삼각형', '직각삼각형', '둔각삼각형'];
const triKind = (m: number) => (m < 90 ? 0 : m === 90 ? 1 : 2);
G['ht-6'] = (r) => { // 두 각으로 분류 (나머지 각 구하기)
  for (;;) { const a = ri(r, 3, 16) * 5, b = ri(r, 3, 16) * 5, c = 180 - a - b; if (c <= 0) continue; const k = triKind(Math.max(a, b, c)), naive = triKind(Math.max(a, b)); if (k === naive && r() < 0.7) continue;
    const correct = { s: TRI3[k] };
    const t = build(r, { text: `삼각형의 두 각의 크기가 ${a}°, ${b}°입니다. 이 삼각형은 어떤 삼각형인가요?`, correct,
      wrongs: TRI3.filter((_, i) => i !== k).map((s, i) => ({ s, note: TRI3.indexOf(s) === naive ? '나머지 한 각을 구하지 않고 주어진 두 각만 보고 판단함' : undefined })), count: 3, order: 'fixed',
      explain: `나머지 한 각 = 180° − ${a}° − ${b}° = ${c}° → 가장 큰 각 ${Math.max(a, b, c)}°${k === 0 ? '도 예각 → 세 각이 모두 예각: 예각삼각형' : k === 1 ? '가 직각 → 직각삼각형' : '가 둔각 → 둔각삼각형'}` });
    // 보기는 늘 예각·직각·둔각 순서로
    const idx = TRI3.map((o) => t.options.indexOf(o) + 1);
    return { ...t, options: TRI3, answer: idx.indexOf(t.answer) + 1, traps: t.traps.map((x: any) => ({ ...x, a: idx.indexOf(x.a) + 1 })), _vals: TRI3.map(() => null) }; }
};
G['ht-7'] = (r) => { // 세 각이 주어진 보기에서 고르기
  const want = pick(r, [0, 2]), tri = (kind: number) => { for (;;) { const a = ri(r, 2, 30) * 5, b = ri(r, 2, 30) * 5, c = 180 - a - b; if (c < 10) continue; if (triKind(Math.max(a, b, c)) === kind) return [a, b, c]; } };
  const s = (t: number[]) => t.map((x) => `${x}°`).join(', '), c = tri(want), others: number[][] = [];
  for (const k of [1, 2 - want, 2 - want, 1, 2 - want, 1, 2 - want]) { if (others.length >= 4) break; for (let t2 = 0; t2 < 50; t2++) { const o = tri(k); if (s(o) !== s(c) && !others.some((x) => s(x) === s(o))) { others.push(o); break; } } }
  return build(r, { text: `세 각의 크기가 다음과 같은 삼각형 중 <b>${TRI3[want]}</b>은?`, correct: { s: s(c) },
    wrongs: others.map((t) => ({ s: s(t), note: `${TRI3[triKind(Math.max(...t))]}을 고름 (가장 큰 각 ${Math.max(...t)}°)` })), order: 'shuffle',
    explain: `가장 큰 각을 보면 돼요: ${s(c)} → 가장 큰 각 ${Math.max(...c)}°${want === 0 ? '도 90°보다 작음 → 예각삼각형' : '가 90°보다 큼 → 둔각삼각형'}` });
};
G['ht-8'] = (r) => { // 변과 각으로 이름 붙이기
  const sideK = pick(r, ['이등변', '세 변 다름'] as const), angK = ri(r, 0, 2);
  const angle = angK === 0 ? ri(r, 10, 16) * 5 : angK === 1 ? 90 : ri(r, 20, 28) * 5;
  const sides = sideK === '이등변' ? `두 변의 길이가 같고` : '세 변의 길이가 모두 다르고';
  const name = (sk: string, ak: number) => `${sk === '이등변' ? '이등변삼각형' : '세 변의 길이가 다른 삼각형'}이면서 ${TRI3[ak]}`;
  const correct = name(sideK, angK), ws = [name(sideK, (angK + 1) % 3), name(sideK, (angK + 2) % 3), name(sideK === '이등변' ? '다름' : '이등변', angK), '정삼각형'];
  return build(r, { text: `${sides}, 가장 큰 각이 ${angle}°인 삼각형의 이름으로 알맞은 것은?`, correct: { s: correct },
    wrongs: ws.map((s, i) => ({ s, note: i < 2 ? '각으로 나누는 것을 잘못함 (가장 큰 각으로 판단)' : i === 2 ? '변으로 나누는 것을 잘못함' : '정삼각형은 세 변이 모두 같고 세 각이 60°' })), order: 'shuffle',
    explain: `변: ${sideK === '이등변' ? '두 변이 같음 → 이등변삼각형' : '세 변이 다름'} / 각: 가장 큰 각 ${angle}° → ${TRI3[angK]}` });
};
G['ht-9'] = (r) => { // 둘레와 나머지 변 → 같은 변
  for (;;) { const a = ri(r, 4, 15), b = ri(r, 3, 15), Lp = 2 * a + b; if (b === a || b >= 2 * a) continue;
    return build(r, { text: `세 변의 길이의 합이 ${Lp} cm인 이등변삼각형에서 나머지 한 변이 ${b} cm입니다. 길이가 같은 한 변은 몇 cm인가요?`, correct: { v: q(a) },
      wrongs: [{ v: q(Lp - b), note: '2로 나누지 않음 (같은 변이 2개)' }, ...(Lp % 2 === 0 ? [{ v: q(Lp / 2), note: '둘레를 2로만 나눔 (나머지 변을 먼저 빼야 함)' }] : []), ...(Lp % 3 === 0 ? [{ v: q(Lp / 3), note: '정삼각형처럼 3으로 나눔' }] : []), { v: q(b), note: '나머지 변의 길이를 그대로 씀' }],
      fill: nearInt(r, a, 4), fmt: cm, order: 'asc', explain: `${Lp} − ${b} = ${Lp - b} → 같은 변 2개이므로 ${Lp - b} ÷ 2 = ${a} cm` }); }
};
G['ht-10'] = (r) => { // 정삼각형을 한 줄로 이어 붙인 띠의 둘레
  const n = ri(r, 3, 8), a = ri(r, 2, 9), ans = (n + 2) * a, pts: Record<string, number[]> = {}, items: any[] = [];
  // 위아래로 번갈아 놓은 정삼각형 n개: 아래 꼭짓점 0, a, 2a…, 위 꼭짓점 a/2, 3a/2…
  const h = a * Math.sqrt(3) / 2, low: string[] = [], up: string[] = [];
  // 꼭짓점 n + 2개를 아래·위 번갈아 지그재그로: 이웃한 세 점마다 정삼각형 하나
  for (let i = 0; i < Math.ceil((n + 2) / 2); i++) { pts['_l' + i] = P(i * a, 0); low.push('_l' + i); }
  for (let i = 0; i < Math.floor((n + 2) / 2); i++) { pts['_u' + i] = P(i * a + a / 2, h); up.push('_u' + i); }
  const zig: string[] = []; for (let i = 0; i < n + 2; i++) zig.push(i % 2 === 0 ? low[i / 2] : up[(i - 1) / 2]);
  for (let i = 0; i + 1 < n + 2; i++) items.push({ k: 'seg', p: [zig[i], zig[i + 1]] });
  for (let i = 0; i + 2 < n + 2; i++) items.push({ k: 'seg', p: [zig[i], zig[i + 2]] });
  items.push({ k: 'side', p: [low[0], low[1]], label: `${a} cm` });
  return { ...build(r, { text: `한 변이 ${a} cm인 정삼각형 ${n}개를 그림과 같이 겹치지 않게 한 줄로 이어 붙였습니다. 만든 도형의 둘레는 몇 cm인가요?`, correct: { v: q(ans) },
    wrongs: [{ v: q(3 * n * a), note: '붙은 변도 모두 셈 (붙은 변은 둘레가 아님)' }, { v: q(n * a), note: '한 줄의 변만 셈' }, { v: q((n + 1) * a) }],
    fill: nearInt(r, ans, 6), fmt: cm, order: 'asc', explain: `정삼각형 ${n}개의 변은 3 × ${n} = ${3 * n}개, 그중 붙은 곳 ${n - 1}군데는 변 2개씩 둘레에서 빠짐 → ${3 * n} − ${2 * (n - 1)} = ${n + 2}개 → ${n + 2} × ${a} = ${ans} cm` }),
    fig: shape(pts, items) };
};

// ── 다희(초4) 4-2 「사각형」: 수직과 평행, 사다리꼴·평행사변형·마름모·직사각형·정사각형 ──
G['hq-1'] = (r) => tfPick(r, ['두 직선이 만나서 이루는 각이 직각이면 두 직선은 서로 수직이다.', '한 직선에 수직인 두 직선은 서로 평행하다.', '평행한 두 직선은 아무리 길게 늘여도 서로 만나지 않는다.', '평행선 사이의 거리는 어디에서 재어도 같다.', '한 점을 지나고 한 직선에 수직인 직선은 한 개만 그을 수 있다.'],
  [['평행선 사이의 거리는 재는 곳마다 다르다.', '평행선 사이의 수선의 길이는 어디서나 같음'], ['한 점을 지나고 한 직선에 평행한 직선은 여러 개 그을 수 있다.', '한 개만 그을 수 있음'],
   ['두 직선이 만나기만 하면 서로 수직이다.', '만나서 이루는 각이 직각일 때만 수직'], ['평행선 사이의 거리는 두 직선을 비스듬히 이은 선분의 길이이다.', '수직인 선분(수선)의 길이'], ['서로 만나지 않는 두 직선은 수직이다.', '만나지 않는 두 직선은 평행']], '수직과 평행');
G['hq-2'] = (r) => { // 세 평행선 사이의 거리
  const a = ri(r, 2, 12); let b: number; do { b = ri(r, 2, 12); } while (b === a); const whole = r() < 0.5;
  const fig = shape({ _a1: P(0, 0), _a2: P(8, 0), _b1: P(0, -1.6), _b2: P(8, -1.6), _c1: P(0, -3.2), _c2: P(8, -3.2), _p: P(6, 0), _q: P(6, -1.6), _s: P(6, -3.2) }, [
    { k: 'seg', p: ['_a1', '_a2'] }, { k: 'seg', p: ['_b1', '_b2'] }, { k: 'seg', p: ['_c1', '_c2'] }, { k: 'text', at: [-0.5, 0], s: '가' }, { k: 'text', at: [-0.5, -1.6], s: '나' }, { k: 'text', at: [-0.5, -3.2], s: '다' },
    { k: 'seg', p: ['_p', '_q'], dash: true, label: whole ? `${a} cm` : `${a} cm` }, { k: 'seg', p: ['_q', '_s'], dash: true, label: whole ? `${b} cm` : '? cm' }]);
  if (whole) return { ...build(r, { text: `직선 가, 나, 다는 서로 평행합니다. 가와 나 사이의 거리가 ${a} cm, 나와 다 사이의 거리가 ${b} cm일 때, 가와 다 사이의 거리는?`, correct: { v: q(a + b) },
    wrongs: [{ v: q(Math.abs(a - b)), note: '두 거리의 차를 구함 (가와 다 사이는 두 거리의 합)' }, { v: q(a * b), note: '두 거리를 곱함' }, { v: q(Math.max(a, b)), note: '한 거리만 씀' }],
    fill: nearInt(r, a + b, 4), fmt: cm, order: 'asc', explain: `가와 다 사이 = 가와 나 사이 + 나와 다 사이 = ${a} + ${b} = ${a + b} cm` }), fig };
  return { ...build(r, { text: `직선 가, 나, 다는 서로 평행합니다. 가와 다 사이의 거리가 ${a + b} cm, 가와 나 사이의 거리가 ${a} cm일 때, 나와 다 사이의 거리는?`, correct: { v: q(b) },
    wrongs: [{ v: q(2 * a + b), note: '빼야 하는데 더함' }, { v: q(a), note: '가와 나 사이 거리를 그대로 씀' }, { v: q(a + b), note: '가와 다 사이 거리를 그대로 씀' }],
    fill: nearInt(r, b, 4), fmt: cm, order: 'asc', explain: `나와 다 사이 = ${a + b} − ${a} = ${b} cm` }), fig };
};
const pgFig = (a: number, b: number, t: number, labs: any[] = []) => { const c = Math.cos(t * Math.PI / 180) * b * 0.6, s = Math.sin(t * Math.PI / 180) * b * 0.6, A = a * 0.6;
  return shape({ _A: P(0, 0), _B: P(A, 0), _C: P(A + c, s), _D: P(c, s) }, [{ k: 'poly', p: ['_A', '_B', '_C', '_D'] }, ...labs]); };
G['hq-3'] = (r) => { // 평행사변형 둘레
  let a: number, b: number; do { a = ri(r, 3, 15); b = ri(r, 3, 15); } while (a === b);
  if (r() < 0.5) return { ...build(r, { text: `이웃한 두 변의 길이가 ${a} cm, ${b} cm인 평행사변형의 네 변의 길이의 합은?`, correct: { v: q(2 * (a + b)) },
    wrongs: [{ v: q(a + b), note: '두 변만 더함 (마주 보는 변도 같으므로 2배)' }, { v: q(4 * a), note: '네 변이 모두 같다고 봄 (마름모처럼)' }, { v: q(a * b), note: '두 변을 곱함 (넓이처럼)' }],
    fill: nearInt(r, 2 * (a + b), 6), fmt: cm, order: 'asc', explain: `평행사변형은 마주 보는 두 변의 길이가 같아요 → (${a} + ${b}) × 2 = ${2 * (a + b)} cm` }),
    fig: pgFig(a, b, 60, [{ k: 'side', p: ['_A', '_B'], label: `${a} cm` }, { k: 'side', p: ['_D', '_A'], label: `${b} cm` }]) };
  const L = 2 * (a + b);
  return { ...build(r, { text: `네 변의 길이의 합이 ${L} cm인 평행사변형에서 한 변의 길이가 ${a} cm입니다. 이 변과 이웃한 변의 길이는?`, correct: { v: q(b) },
    wrongs: [{ v: q(L - a), note: '한 변만 뺌 (마주 보는 변도 같은 길이)' }, { v: q(L - 2 * a), note: '2로 나누지 않음' }, ...(L % 4 === 0 ? [{ v: q(L / 4), note: '네 변이 모두 같다고 봄' }] : [])],
    fill: nearInt(r, b, 4), fmt: cm, order: 'asc', explain: `${L} − ${a} × 2 = ${L - 2 * a} → 이웃한 변 2개이므로 ÷ 2 = ${b} cm` }),
    fig: pgFig(a, b, 60, [{ k: 'side', p: ['_A', '_B'], label: `${a} cm` }, { k: 'side', p: ['_D', '_A'], label: '? cm' }]) };
};
G['hq-4'] = (r) => { // 평행사변형의 각
  const x = ri(r, 7, 16) * 5, ask = pick(r, ['이웃한', '마주 보는'] as const), ans = ask === '이웃한' ? 180 - x : x;
  return { ...build(r, { text: `평행사변형에서 한 각의 크기가 ${x}°입니다. 이 각과 <b>${ask}</b> 각의 크기는?`, correct: { v: q(ans) },
    wrongs: ask === '이웃한' ? [{ v: q(x), note: '이웃한 각을 마주 보는 각처럼 같다고 봄 (이웃한 두 각의 합은 180°)' }, { v: q(360 - x), note: '360°에서 뺌' }, { v: q(90 - x > 0 ? 90 - x : x - 90 || 5) }]
      : [{ v: q(180 - x), note: '마주 보는 각을 이웃한 각처럼 계산함 (마주 보는 각은 크기가 같음)' }, { v: q(360 - x) }, { v: q(2 * x), note: '2배 함' }],
    fill: () => q(5 * ri(r, 4, 32)), fmt: degF, order: 'asc', explain: ask === '이웃한' ? `평행사변형에서 이웃한 두 각의 합은 180° → 180° − ${x}° = ${ans}°` : `평행사변형에서 마주 보는 두 각의 크기는 같아요 → ${x}°` }),
    fig: pgFig(10, 7, x, [{ k: 'angle', p: ['_B', '_A', '_D'], label: `${x}°` }, { k: 'angle', p: ask === '이웃한' ? ['_C', '_B', '_A'] : ['_D', '_C', '_B'], label: '?' }]) };
};
G['hq-5'] = (r) => { // 마름모 둘레 ↔ 한 변
  const a = ri(r, 3, 20);
  if (r() < 0.5) return build(r, { text: `네 변의 길이의 합이 ${4 * a} cm인 마름모의 한 변의 길이는?`, correct: { v: q(a) },
    wrongs: [{ v: q(2 * a), note: '2로 나눔 (마름모는 네 변이 모두 같으므로 4로 나눔)' }, ...((4 * a) % 3 === 0 ? [{ v: q(4 * a / 3), note: '3으로 나눔' }] : []), { v: q(4 * a - 4), note: '4로 나누지 않고 뺌' }],
    fill: nearInt(r, a, 4), fmt: cm, order: 'asc', explain: `마름모는 네 변의 길이가 모두 같아요 → ${4 * a} ÷ 4 = ${a} cm` });
  return build(r, { text: `한 변의 길이가 ${a} cm인 마름모의 네 변의 길이의 합은?`, correct: { v: q(4 * a) },
    wrongs: [{ v: q(2 * a), note: '두 변만 더함' }, { v: q(a * a), note: '변을 곱함 (넓이처럼)' }, { v: q(3 * a), note: '세 변만 더함' }],
    fill: nearInt(r, 4 * a, 6), fmt: cm, order: 'asc', explain: `네 변이 모두 ${a} cm → ${a} × 4 = ${4 * a} cm` });
};
G['hq-6'] = (r) => tfPick(r, ['정사각형은 직사각형이라고 할 수 있다.', '정사각형은 마름모라고 할 수 있다.', '직사각형은 평행사변형이라고 할 수 있다.', '마름모는 평행사변형이라고 할 수 있다.', '평행사변형은 사다리꼴이라고 할 수 있다.'],
  [['직사각형은 정사각형이라고 할 수 있다.', '직사각형은 네 변의 길이가 같지 않을 수 있음'], ['마름모는 정사각형이라고 할 수 있다.', '마름모는 네 각이 직각이 아닐 수 있음'], ['사다리꼴은 평행사변형이라고 할 수 있다.', '사다리꼴은 평행한 변이 한 쌍뿐일 수 있음'],
   ['평행사변형은 마름모라고 할 수 있다.', '평행사변형은 네 변이 모두 같지 않을 수 있음'], ['직사각형은 마름모라고 할 수 있다.', '직사각형은 네 변이 모두 같지 않을 수 있음']], '여러 가지 사각형');
const QUADS: [string, string][] = [['사다리꼴', '평행한 변이 한 쌍이라도 있는'], ['평행사변형', '마주 보는 두 쌍의 변이 서로 평행한'], ['마름모', '네 변의 길이가 모두 같은'], ['직사각형', '네 각이 모두 직각인'], ['정사각형', '네 변의 길이가 모두 같고 네 각이 모두 직각인']];
G['hq-7'] = (r) => { // 조건으로 가장 알맞은 이름 (조건만으로 알 수 있는 가장 좁은 이름)
  const i = ri(r, 0, 4), [name, cond] = QUADS[i], names = QUADS.map((x) => x[0]);
  const wider: Record<number, number[]> = { 0: [], 1: [0], 2: [1, 0], 3: [1, 0], 4: [3, 2, 1, 0] }; // i 가 될 수 있는 더 넓은 이름
  const t = build(r, { text: `${cond} 사각형의 이름으로 <b>가장 알맞은</b> 것은?`, correct: { s: name },
    wrongs: names.filter((_, j) => j !== i).map((s) => { const j = names.indexOf(s); return { s, note: wider[i].includes(j) ? `${s}${josa(s, '이라고', '라고')}도 할 수 있지만 더 알맞은 이름이 있음` : wider[j].includes(i) ? `조건만으로는 ${s}${josa(s, '이라고', '라고')} 할 수 없음` : '조건에 맞지 않음' }; }), order: 'fixed',
    explain: `${cond} 사각형 → ${name}${i === 4 ? '' : ' (이 조건만으로는 더 좁은 이름을 붙일 수 없어요)'}` });
  // 보기는 늘 사다리꼴 → 정사각형 순서로
  const idx = names.map((o) => t.options.indexOf(o) + 1);
  return { ...t, options: names, answer: idx.indexOf(t.answer) + 1, traps: t.traps.map((x: any) => ({ ...x, a: idx.indexOf(x.a) + 1 })), _vals: names.map(() => null) };
};
G['hq-8'] = (r) => { // 마름모 나머지 세 각
  const x = ri(r, 7, 16) * 5, ask = r() < 0.5 ? 'sum' : 'adj';
  if (ask === 'sum') return build(r, { text: `마름모에서 한 각의 크기가 ${x}°일 때, 나머지 세 각의 크기의 합은?`, correct: { v: q(360 - x) },
    wrongs: [{ v: q(180 - x), note: '사각형 네 각의 합을 180°로 봄 (360°)' }, { v: q(3 * x), note: '네 각이 모두 같다고 봄' }, { v: q(360), note: '네 각의 합을 그대로 씀' }],
    fill: () => q(5 * ri(r, 20, 66)), fmt: degF, order: 'asc', explain: `사각형의 네 각의 합은 360° → 360° − ${x}° = ${360 - x}°` });
  return build(r, { text: `마름모에서 한 각의 크기가 ${x}°일 때, 이 각과 이웃한 각의 크기는?`, correct: { v: q(180 - x) },
    wrongs: [{ v: q(x), note: '이웃한 각을 마주 보는 각처럼 같다고 봄' }, { v: q(360 - x), note: '360°에서 뺌 (이웃한 두 각의 합은 180°)' }, { v: q(90) , note: '마름모의 각을 직각으로 봄' }],
    fill: () => q(5 * ri(r, 4, 32)), fmt: degF, order: 'asc', explain: `마름모도 평행사변형이에요 → 이웃한 두 각의 합 180° → 180° − ${x}° = ${180 - x}°` });
};
G['hq-9'] = (r) => { // 둘레와 두 변의 차 → 긴 변
  for (;;) { const s = ri(r, 3, 12), d = ri(r, 1, 8), l = s + d, L = 2 * (s + l), askLong = r() < 0.5;
    return build(r, { text: `네 변의 길이의 합이 ${L} cm인 평행사변형에서 긴 변이 짧은 변보다 ${d} cm 깁니다. ${askLong ? '긴' : '짧은'} 변의 길이는?`, correct: { v: q(askLong ? l : s) },
      wrongs: [{ v: q(askLong ? s : l), note: `${askLong ? '짧은' : '긴'} 변을 구함` }, { v: q(L / 2), note: '두 변의 합을 답함 (둘레 ÷ 2 = 긴 변 + 짧은 변)' }, ...((L / 2 - d) % 2 === 0 ? [] : []), { v: q(askLong ? l + d : Math.max(1, s - d)) }],
      fill: nearInt(r, askLong ? l : s, 4), fmt: cm, order: 'asc', explain: `둘레 ÷ 2 = 긴 변 + 짧은 변 = ${L / 2} cm → 짧은 변 = (${L / 2} − ${d}) ÷ 2 = ${s} cm, 긴 변 = ${s} + ${d} = ${l} cm` }); }
};
G['hq-10'] = (r) => { // 마주 보는 두 각의 합 → 다른 각
  const x = ri(r, 7, 17) * 5, S = 2 * x, ans = 180 - x;
  return build(r, { text: `평행사변형에서 마주 보는 두 각의 크기의 합이 ${S}°일 때, 다른 한 각의 크기는?`, correct: { v: q(ans) },
    wrongs: [{ v: q(x), note: '마주 보는 한 각을 구하고 끝냄' }, { v: q(360 - S), note: '나머지 두 각의 합을 구함 (÷ 2를 빠뜨림)' }, { v: q(180 - S > 0 ? 180 - S : S - 180 || 5), note: '이웃한 각의 합 180°에서 두 각의 합을 뺌' }],
    fill: () => q(5 * ri(r, 4, 32)), fmt: degF, order: 'asc', explain: `마주 보는 두 각은 같으므로 한 각 = ${S}° ÷ 2 = ${x}° → 이웃한 각 = 180° − ${x}° = ${ans}°` });
};

// ── 다희(초4) 4-2 「꺾은선그래프」: 읽기, 변화 해석, 물결선, 알맞은 그래프 ──
// 그래프는 shape 로 그린다: 가로 칸 2, 세로 눈금 한 칸 0.9, 가로 글자는 오전·오후를 빼고 짧게. 점은 눈금선 위(읽기 문제는 값이 정확히 읽히게).
type GData = { title: string; unitS: string; xs: string[]; vs: number[]; step: number; base: number };
const GTOPIC = [
  { title: '강낭콩의 키', unitS: 'cm', xs: ['1일', '3일', '5일', '7일', '9일', '11일'], up: true },
  { title: '교실의 온도', unitS: '°C', xs: ['오전 9시', '10시', '11시', '12시', '오후 1시', '2시'], up: false },
  { title: '운동장에 나온 학생 수', unitS: '명', xs: ['월', '화', '수', '목', '금', '토'], up: false },
  { title: '모은 칭찬 붙임딱지', unitS: '장', xs: ['3월', '4월', '5월', '6월', '7월', '8월'], up: true },
];
function gData(r: Rng, n = 5): GData {
  const T = pick(r, GTOPIC), step = pick(r, [1, 2, 5]), vs: number[] = [];
  let v = ri(r, 2, 6) * step + (T.up ? 0 : ri(r, 4, 8) * step);
  for (let i = 0; i < n; i++) { vs.push(v); v += (T.up ? ri(r, 0, 4) : ri(r, -3, 3)) * step; if (v < step) v = step; }
  if (new Set(vs).size < 4) return gData(r, n);
  const base = Math.max(0, (Math.floor(Math.min(...vs) / step) - 1) * step);
  return { title: T.title, unitS: T.unitS, xs: T.xs.slice(0, n), vs, step, base };
}
function gFig(d: GData, wavy = d.base > 0) {
  const top = Math.max(...d.vs) + d.step, Y = (v: number) => ((v - d.base) / d.step) * 0.9, n = d.vs.length;
  const pts: Record<string, number[]> = { _o: P(0, 0), _xe: P(2 * n, 0), _ye: P(0, Y(top) + 0.3) }, items: any[] = [{ k: 'seg', p: ['_o', '_xe'] }, { k: 'seg', p: ['_o', '_ye'] }];
  for (let v = d.base, k = 0; v <= top; v += d.step, k++) {
    pts['_g' + k] = P(0, Y(v)); pts['_h' + k] = P(2 * n, Y(v));
    if (k) items.push({ k: 'seg', p: ['_g' + k, '_h' + k], dash: true });
    const every = (top - d.base) / d.step > 10 ? 2 : 1; if (k % every === 0) items.push({ k: 'text', at: [-0.7, Y(v)], s: String(v) });
  }
  d.vs.forEach((v, i) => { pts['_p' + i] = P(2 * i + 1, Y(v)); items.push({ k: 'dot', p: '_p' + i }, { k: 'text', at: [2 * i + 1, -0.5], s: d.xs[i].replace(/^오[전후] /, '') }); if (i) items.push({ k: 'seg', p: ['_p' + (i - 1), '_p' + i] }); });
  if (wavy) items.push({ k: 'text', at: [0, 0.15], s: '≈' });
  items.push({ k: 'text', at: [n, Y(top) + 0.8], s: `${d.title}(${d.unitS})` });
  return shape(pts, items);
}
const tight = (d: GData) => ['°C', '명', '장'].includes(d.unitS), uS = (d: GData) => (tight(d) ? d.unitS : ' ' + d.unitS), uJ = (d: GData, b: string, nb: string) => (d.unitS === '명' || d.unitS === '장' ? b : nb); // 단위를 읽은 소리의 받침
const tJ = (d: GData, b: string, nb: string) => josa(d.title.slice(-1), b, nb);
const gu = (d: GData) => unit(tight(d) ? d.unitS : ` ${d.unitS}`);
G['hg-1'] = (r) => { // 값 읽기
  const d = gData(r), i = ri(r, 0, d.vs.length - 1), v = d.vs[i], cells = (v - d.base) / d.step;
  return { ...build(r, { text: `꺾은선그래프에서 ${d.xs[i]}의 ${d.title}${tJ(d, '은', '는')} 얼마인가요? (세로 눈금 한 칸은 ${d.step}${uS(d)})`, correct: { v: q(v) },
    wrongs: [...(cells !== v ? [{ v: q(cells), note: '눈금 칸 수를 값으로 읽음 (한 칸의 크기를 곱해야 함)' }] : []), ...(i > 0 && d.vs[i - 1] !== v ? [{ v: q(d.vs[i - 1]), note: '옆 점의 값을 읽음' }] : []), ...(i < d.vs.length - 1 && d.vs[i + 1] !== v ? [{ v: q(d.vs[i + 1]), note: '옆 점의 값을 읽음' }] : [])],
    fill: () => q(Math.max(d.step, v + (r() < 0.5 ? -1 : 1) * ri(r, 1, 5) * d.step)), fmt: gu(d), order: 'asc', explain: `${d.xs[i]}의 점은 ${d.base}에서 ${cells}칸 위 → ${d.base} + ${cells} × ${d.step} = ${v}` }), fig: gFig(d) };
};
// 보기를 시간 순서로 다시 놓기 (build 의 fixed 는 정답을 맨 앞에 둠)
function timeOrder(t: any, opts: { s: string }[]) { const order = opts.map((o) => o.s).filter((s) => t.options.includes(s)), idx = order.map((o) => t.options.indexOf(o) + 1);
  return { ...t, options: order, answer: idx.indexOf(t.answer) + 1, traps: t.traps.map((x: any) => ({ ...x, a: idx.indexOf(x.a) + 1 })), _vals: order.map(() => null) }; }
const between = (d: GData, i: number) => `${d.xs[i]}과 ${d.xs[i + 1]} 사이`.replace(/(\S+)과 /, (m, a) => `${a}${josa(a.replace(/[^0-9가-힣]/g, '').slice(-1) || '0', '과', '와')} `);
G['hg-2'] = (r) => { // 가장 많이 변한 때
  for (;;) { const d = gData(r), diffs = d.vs.slice(1).map((v, i) => Math.abs(v - d.vs[i])), mx = Math.max(...diffs); if (diffs.filter((x) => x === mx).length > 1 || mx === 0) continue;
    const i = diffs.indexOf(mx), maxPt = d.vs.indexOf(Math.max(...d.vs));
    const opts = d.vs.slice(1).map((_, k) => ({ s: between(d, k), k }));
    const lure = Math.min(Math.max(maxPt - 1, 0), d.vs.length - 2);
    return { ...timeOrder(build(r, { text: `꺾은선그래프에서 ${d.title}의 변화가 가장 큰 때는 언제인가요?`, correct: { s: opts[i].s },
      wrongs: opts.filter((o) => o.k !== i).map((o) => ({ s: o.s, note: o.k === lure ? '값이 가장 큰 때를 고름 (선이 가장 많이 기울어진 곳을 찾아야 함)' : undefined })), count: Math.min(5, d.vs.length - 1), order: 'fixed',
      explain: `선분이 가장 많이 기울어진 곳: ${opts[i].s} (${d.vs[i]} → ${d.vs[i + 1]}, ${mx}만큼 변함)` }), opts), fig: gFig(d) }; }
};
G['hg-3'] = (r) => { // 두 때의 차
  for (;;) { const d = gData(r), i = ri(r, 0, d.vs.length - 2), j = ri(r, i + 1, d.vs.length - 1), a = d.vs[i], b = d.vs[j]; if (a === b) continue; const ans = Math.abs(b - a);
    return { ...build(r, { text: `꺾은선그래프에서 ${d.xs[i]}${josa(d.xs[i].replace(/[^0-9가-힣]/g, '').slice(-1) || '0', '과', '와')} ${d.xs[j]}의 ${d.title}의 차는 얼마인가요?`, correct: { v: q(ans) },
      wrongs: [{ v: q(a + b), note: '차 대신 합을 구함' }, { v: q(Math.abs(b - a) / d.step === ans ? ans + d.step : Math.abs(b - a) / d.step), note: '눈금 칸 수의 차를 답함 (한 칸의 크기를 곱해야 함)' }, { v: q(Math.max(a, b)), note: '큰 쪽 값만 읽음' }],
      fill: () => q(Math.max(d.step, ans + (r() < 0.5 ? -1 : 1) * ri(r, 1, 5) * d.step)), fmt: gu(d), order: 'asc', explain: `${d.xs[i]}: ${a}, ${d.xs[j]}: ${b} → ${Math.max(a, b)} − ${Math.min(a, b)} = ${ans}` }), fig: gFig(d) }; }
};
G['hg-4'] = (r) => { // 눈금 한 칸의 크기
  const d = gData(r), k = ri(r, 3, 6), span = d.step * k;
  return build(r, { text: `꺾은선그래프의 세로 눈금 ${k}칸이 ${span}${uS(d)}${uJ(d, '을', '를')} 나타냅니다. 세로 눈금 한 칸은 얼마를 나타내나요?`, correct: { v: q(d.step) },
    wrongs: [{ v: q(span), note: '여러 칸의 값을 그대로 씀' }, { v: q(span * k), note: '나누지 않고 곱함' }, ...(span % 2 === 0 && span / 2 !== d.step ? [{ v: q(span / 2), note: '2로 나눔 (칸 수로 나눠야 함)' }] : [])],
    fill: nearInt(r, d.step, 3), fmt: gu(d), order: 'asc', explain: `${span} ÷ ${k} = ${d.step}` });
};
G['hg-5'] = (r) => { // 중간 시각 값 예상
  for (;;) { const d = gData(r), i = ri(r, 0, d.vs.length - 2), a = d.vs[i], b = d.vs[i + 1]; if (a === b || (a + b) % 2 || !['강낭콩의 키', '교실의 온도'].includes(d.title)) continue; const m = (a + b) / 2;
    return { ...build(r, { text: `꺾은선그래프에서 ${d.xs[i]}${josa(d.xs[i].replace(/[^0-9가-힣]/g, '').slice(-1) || '0', '과', '와')} ${d.xs[i + 1]}의 한가운데 때의 ${d.title}${tJ(d, '은', '는')} 약 얼마였을까요?`, correct: { v: q(m) },
      wrongs: [{ v: q(a), note: '앞의 값을 그대로 씀 (두 점을 이은 선분의 가운데를 읽음)' }, { v: q(b), note: '뒤의 값을 그대로 씀' }, { v: q(a + b), note: '두 값을 더하기만 함 (÷ 2)' }],
      fill: () => q(Math.max(1, m + (r() < 0.5 ? -1 : 1) * ri(r, 1, 5) * d.step)), fmt: gu(d), order: 'asc', explain: `두 점을 이은 선분의 가운데 → (${a} + ${b}) ÷ 2 = ${m}` }), fig: gFig(d) }; }
};
G['hg-6'] = (r) => { // 줄어든 때 / 늘어난 때
  for (;;) { const d = gData(r), dec = r() < 0.5, ok = d.vs.slice(1).map((v, i) => (dec ? v < d.vs[i] : v > d.vs[i])); if (ok.filter(Boolean).length !== 1) continue;
    const i = ok.indexOf(true), opts = d.vs.slice(1).map((_, k) => ({ s: between(d, k), k }));
    return { ...timeOrder(build(r, { text: `꺾은선그래프에서 ${d.title}${josa(d.title.slice(-1), '이', '가')} <b>${dec ? '줄어든' : '늘어난'}</b> 때는 언제인가요?`, correct: { s: opts[i].s },
      wrongs: opts.filter((o) => o.k !== i).map((o) => ({ s: o.s, note: d.vs[o.k + 1] === d.vs[o.k] ? '변화가 없는 때를 고름 (선이 수평)' : `${dec ? '늘어난' : '줄어든'} 때를 고름` })), count: Math.min(5, d.vs.length - 1), order: 'fixed',
      explain: `선이 ${dec ? '오른쪽 아래로 내려간' : '오른쪽 위로 올라간'} 곳: ${opts[i].s} (${d.vs[i]} → ${d.vs[i + 1]})` }), opts), fig: gFig(d) }; }
};
G['hg-7'] = (r) => { // 처음과 마지막의 차 (전체 변화)
  for (;;) { const d = gData(r, 5); if (d.title !== '강낭콩의 키' && d.title !== '모은 칭찬 붙임딱지') continue; const a = d.vs[0], b = d.vs[d.vs.length - 1]; if (b <= a) continue; const ans = b - a, sum = d.vs.reduce((x, y) => x + y, 0);
    return { ...build(r, { text: `꺾은선그래프에서 ${d.xs[0]}부터 ${d.xs[d.xs.length - 1]}까지 ${d.title}${josa(d.title.slice(-1), '이', '가')} 모두 얼마만큼 늘었나요?`, correct: { v: q(ans) },
      wrongs: [{ v: q(b), note: '마지막 값을 그대로 씀 (처음 값을 빼야 함)' }, { v: q(sum), note: '모든 값을 더함' }, { v: q(d.vs[d.vs.length - 1] - d.vs[d.vs.length - 2] || ans + d.step), note: '마지막 두 때의 차만 구함' }],
      fill: () => q(Math.max(d.step, ans + (r() < 0.5 ? -1 : 1) * ri(r, 1, 5) * d.step)), fmt: gu(d), order: 'asc', explain: `마지막 ${b} − 처음 ${a} = ${ans}` }), fig: gFig(d) }; }
};
G['hg-8'] = (r) => tfPick(r, ['시간에 따라 변하는 모양을 나타낼 때는 꺾은선그래프가 알맞다.', '꺾은선그래프에서 선이 많이 기울어질수록 변화가 크다.', '꺾은선그래프에서 선이 수평이면 변화가 없다.', '필요 없는 부분은 물결선으로 줄여서 나타낼 수 있다.', '여러 반의 학생 수를 비교할 때는 막대그래프가 알맞다.'],
  [['반별 좋아하는 과일 수를 비교할 때는 꺾은선그래프가 더 알맞다.', '서로 다른 항목끼리 비교하는 것은 막대그래프가 알맞음'], ['꺾은선그래프에서 선이 짧을수록 변화가 크다.', '선이 많이 기울어질수록 변화가 큼'],
   ['꺾은선그래프의 세로 눈금은 항상 1씩 커져야 한다.', '눈금 한 칸의 크기는 2, 5, 10 등으로 정할 수 있음'], ['물결선은 그래프의 가장 큰 값 위에 그린다.', '물결선은 0과 가장 작은 값 사이의 필요 없는 부분에 그림'], ['꺾은선그래프로는 중간 시각의 값을 예상할 수 없다.', '두 점을 이은 선으로 중간 값을 예상할 수 있음']], '꺾은선그래프');
G['hg-9'] = (r) => { // 물결선으로 줄일 수 있는 부분
  const lo = ri(r, 3, 9) * 10 + ri(r, 1, 6), hi = lo + ri(r, 4, 9), cut = Math.floor(lo / 10) * 10;
  return build(r, { text: `가장 작은 값이 ${lo}, 가장 큰 값이 ${hi}인 꺾은선그래프를 그리려고 합니다. 물결선을 넣어 세로 눈금 0부터 몇까지를 줄이는 것이 가장 알맞을까요?`, correct: { v: q(cut) },
    wrongs: [{ v: q(lo), note: '가장 작은 값까지 줄임 (그 값을 나타낼 칸이 없어짐)' }, { v: q(hi), note: '가장 큰 값까지 줄임' }, { v: q(cut - 10), note: '너무 적게 줄임 (필요 없는 칸이 남음)' }],
    fill: () => q(cut + ri(r, -3, 3) * 5), fmt: intF, order: 'asc', explain: `가장 작은 값 ${lo}보다 작은 가장 큰 몇십인 ${cut}까지 줄이면 ${cut}부터 ${hi}까지 자세히 나타낼 수 있어요` });
};
G['hg-10'] = (r) => { // 다음 때 값 예상 (일정하게 늘어날 때)
  for (;;) { const step = pick(r, [1, 2, 5]), inc = ri(r, 1, 3) * step, v0 = ri(r, 2, 6) * step, n = 5, vs = Array.from({ length: n }, (_, i) => v0 + i * inc);
    const d: GData = { title: '강낭콩의 키', unitS: 'cm', xs: ['1일', '3일', '5일', '7일', '9일'], vs, step, base: Math.max(0, v0 - step) }, ans = vs[n - 1] + inc;
    return { ...build(r, { text: `강낭콩의 키가 그래프처럼 일정하게 자란다면 11일에는 키가 몇 cm가 될까요?`, correct: { v: q(ans) },
      wrongs: [{ v: q(vs[n - 1]), note: '9일의 키를 그대로 씀' }, ...(inc !== step ? [{ v: q(vs[n - 1] + step), note: '눈금 한 칸만 더함 (2일마다 늘어나는 만큼을 더해야 함)' }] : []), { v: q(ans + inc), note: '두 번 더함 (11일은 9일 다음 한 번)' }],
      fill: () => q(Math.max(step, ans + (r() < 0.5 ? -1 : 1) * ri(r, 1, 5) * step)), fmt: unit(' cm'), order: 'asc', explain: `2일마다 ${inc} cm씩 자람 → 9일 ${vs[n - 1]} cm + ${inc} cm = ${ans} cm` }), fig: gFig(d) }; }
};

// ── 다희(초4) 4-2 「다각형」: 다각형·정다각형, 대각선, 정다각형의 각, 모양 채우기 ──
const pName = (n: number) => koN(n) + '각형';
function polyFig(r: Rng, n: number, regular = false, items: any[] = []) { // 볼록 다각형(꼭짓점 이름 없음)
  const pts: Record<string, number[]> = {}, names: string[] = [], a0 = 90 + 180 / n;
  for (let i = 0; i < n; i++) { const a = (a0 + (360 / n) * i + (regular ? 0 : (r() - 0.5) * (120 / n))) * Math.PI / 180, R = regular ? 4 : 4 * (0.85 + 0.3 * r());
    names.push('_v' + i); pts['_v' + i] = P(R * Math.cos(a), R * Math.sin(a)); }
  return shape(pts, [{ k: 'poly', p: names }, ...items.map((f) => f(names))]);
}
// 이름 보기를 변의 수 차례로 다시 놓기
const win = (r: Rng, n: number) => { const lo = Math.max(3, n - ri(r, 0, 4)); return [0, 1, 2, 3, 4].map((k) => lo + k).filter((k) => k !== n); }; // n 을 품은 연속한 다섯 개
const pN = (s: string) => Array.from({ length: 20 }, (_, k) => k).find((k) => k >= 3 && s.replace(/^정/, '') === pName(k)) ?? 0;
const nameOrder = (t: any) => timeOrder(t, [...t.options].sort((a: string, b: string) => pN(a) - pN(b)).map((s: string) => ({ s })));
G['hp-1'] = (r) => { // 그림 보고 이름
  const n = ri(r, 5, 9), others = win(r, n);
  return { ...nameOrder(build(r, { text: '그림의 다각형의 이름은 무엇인가요?', correct: { s: pName(n) },
    wrongs: others.map((k) => ({ s: pName(k), note: k === n + 1 ? '변을 하나 더 셈 (한 꼭짓점에 표시하고 세기)' : k === n - 1 ? '변을 하나 덜 셈' : undefined })), count: 5, order: 'fixed',
    explain: `변이 ${n}개, 꼭짓점이 ${n}개 → ${pName(n)}` })), fig: polyFig(r, n) };
};
G['hp-2'] = (r) => { // 정다각형의 둘레
  const n = ri(r, 3, 8), a = ri(r, 3, 15);
  return build(r, { text: `한 변의 길이가 ${a} cm인 정${pName(n)}의 모든 변의 길이의 합은?`, correct: { v: q(n * a) },
    wrongs: [{ v: q((n - 1) * a), note: '변의 수를 하나 덜 셈' }, { v: q(4 * a === n * a ? (n + 1) * a : 4 * a), note: '변이 4개라고 봄 (정사각형처럼)' }, { v: q(n + a), note: '변의 수와 길이를 더함 (곱해야 함)' }],
    fill: nearInt(r, n * a, 8), fmt: cm, order: 'asc', explain: `정${pName(n)}은 변 ${n}개의 길이가 모두 같아요 → ${a} × ${n} = ${n * a} cm` });
};
G['hp-3'] = (r) => { // 둘레 → 한 변
  const n = ri(r, 5, 9), a = ri(r, 3, 12), L = n * a;
  return build(r, { text: `모든 변의 길이의 합이 ${L} cm인 정${pName(n)}의 한 변의 길이는?`, correct: { v: q(a) },
    wrongs: [...(L % (n - 1) === 0 ? [{ v: q(L / (n - 1)), note: '변의 수를 하나 덜 셈' }] : []), ...(L % 4 === 0 && L / 4 !== a ? [{ v: q(L / 4), note: '4로 나눔 (변의 수로 나눠야 함)' }] : []), { v: q(L - n), note: '변의 수를 뺌 (나눠야 함)' }],
    fill: nearInt(r, a, 4), fmt: cm, order: 'asc', explain: `${L} ÷ ${n} = ${a} cm` });
};
G['hp-4'] = (r) => { // 대각선 개수
  const n = ri(r, 4, 8), ans = n * (n - 3) / 2;
  return { ...build(r, { text: `${pName(n)}에 그을 수 있는 대각선은 모두 몇 개인가요?`, correct: { v: q(ans) },
    wrongs: [{ v: q(n * (n - 3)), note: '같은 대각선을 두 번 셈 (양쪽 꼭짓점에서 한 번씩)' }, { v: q(n - 3 === ans ? n : n - 3), note: n - 3 === ans ? '변의 수를 셈' : '한 꼭짓점에서 그은 것만 셈' }, { v: q(n * (n - 1) / 2), note: '변까지 셈 (대각선은 이웃하지 않은 꼭짓점끼리)' }],
    fill: nearInt(r, ans, 4), fmt: ea, order: 'asc', explain: `한 꼭짓점에서 ${n - 3}개씩, 꼭짓점 ${n}개 → ${n} × ${n - 3} = ${n * (n - 3)}, 같은 대각선을 두 번 셌으므로 ÷ 2 = ${ans}개` }), fig: polyFig(r, n) };
};
G['hp-5'] = (r) => tfPick(r, ['정다각형은 변의 길이가 모두 같고 각의 크기가 모두 같다.', '삼각형에는 대각선을 그을 수 없다.', '직사각형의 두 대각선은 길이가 같다.', '정사각형의 두 대각선은 서로 수직으로 만난다.', '마름모의 두 대각선은 서로 수직으로 만난다.', '평행사변형의 두 대각선은 서로를 똑같이 둘로 나눈다.'],
  [['네 변의 길이가 모두 같은 사각형은 모두 정사각형이다.', '마름모는 네 변이 같아도 네 각이 같지 않을 수 있음'], ['원도 다각형이다.', '다각형은 선분으로만 둘러싸인 도형'], ['대각선은 이웃한 두 꼭짓점을 이은 선분이다.', '대각선은 이웃하지 않은 두 꼭짓점을 이은 선분'],
   ['평행사변형의 두 대각선은 길이가 항상 같다.', '두 대각선의 길이가 같은 것은 직사각형·정사각형'], ['변의 길이가 모두 같으면 정다각형이다.', '각의 크기도 모두 같아야 정다각형']], '다각형');
G['hp-6'] = (r) => { // 정다각형의 한 각
  const n = pick(r, [5, 6, 8, 9, 10, 12]), sum = (n - 2) * 180, ans = sum / n;
  return { ...build(r, { text: `정${pName(n)}의 한 각의 크기는 몇 도인가요? (정${pName(n)}은 대각선으로 삼각형 ${n - 2}개로 나눌 수 있어요)`, correct: { v: q(ans) },
    wrongs: [{ v: q(sum), note: '모든 각의 합에서 멈춤 (각의 수로 나눠야 함)' }, { v: q(360 / n), note: '360°를 나눔 (각의 합은 삼각형 수 × 180°)' }, ...((n - 1) * 180 % n === 0 ? [{ v: q((n - 1) * 180 / n), note: '삼각형을 하나 더 셈' }] : []), { v: q(180), note: '삼각형 한 개의 각의 합을 씀' }],
    fill: () => q(5 * ri(r, 18, 34)), fmt: degF, order: 'asc', explain: `각의 합 = 180° × ${n - 2} = ${sum}° → 한 각 = ${sum}° ÷ ${n} = ${ans}°` }),
    fig: polyFig(r, n, true, [(v: string[]) => ({ k: 'seg', p: [v[0], v[2]], dash: true }), ...Array.from({ length: n - 4 }, (_, k) => (v: string[]) => ({ k: 'seg', p: [v[0], v[k + 3]], dash: true }))]) };
};
G['hp-7'] = (r) => { // 직사각형의 대각선
  for (;;) { const d = 2 * ri(r, 5, 13), a = ri(r, 3, d - 2), b2 = d * d - a * a, b = Math.sqrt(b2); if (b < 2) continue; const ans = d + a;
    const W = 8, H = Math.max(2.5, Math.min(6, (W * a) / b)), pts = { 'ㄱ': P(0, H), 'ㄴ': P(0, 0), 'ㄷ': P(W, 0), 'ㄹ': P(W, H), _o: P(W / 2, H / 2) };
    return { ...build(r, { text: `직사각형 ㄱㄴㄷㄹ에서 두 대각선이 만나는 점이 ㅇ입니다. 대각선 ㄱㄷ이 ${d} cm, 변 ㄱㄴ이 ${a} cm일 때, 삼각형 ㄱㅇㄴ의 세 변의 길이의 합은?`, correct: { v: q(ans) },
      wrongs: [{ v: q(2 * d + a), note: '선분 ㅇㄱ·ㅇㄴ을 대각선 전체로 봄 (대각선의 반)' }, { v: q(d / 2 + a), note: '대각선의 반을 하나만 더함' }, { v: q(d + 2 * a), note: '변 ㄱㄴ을 두 번 더함' }],
      fill: nearInt(r, ans, 6), fmt: cm, order: 'asc', explain: `직사각형의 두 대각선은 길이가 같고 서로를 반으로 나눠요 → ㅇㄱ = ㅇㄴ = ${d} ÷ 2 = ${d / 2} cm → ${d / 2} + ${d / 2} + ${a} = ${ans} cm` }),
      fig: shape(pts, [{ k: 'poly', p: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'] }, { k: 'seg', p: ['ㄱ', 'ㄷ'] }, { k: 'seg', p: ['ㄴ', 'ㄹ'] }, { k: 'dot', p: '_o' }, { k: 'text', at: [W / 2, H / 2 + 0.55], s: 'ㅇ' }, { k: 'side', p: ['ㄱ', 'ㄴ'], label: `${a} cm` }]) }; }
};
const TILES: [string, string, number, string][] = [ // 큰 모양, 조각, 개수, 풀이
  ['정육각형', '정삼각형', 6, '정육각형은 가운데에서 정삼각형 6개로 나뉘어요'],
  ['정육각형', '사다리꼴(정삼각형 3개 크기)', 2, '정삼각형 6개 ÷ 3개 = 2개'],
  ['정육각형', '마름모(정삼각형 2개 크기)', 3, '정삼각형 6개 ÷ 2개 = 3개'],
  ['사다리꼴(정삼각형 3개 크기)', '정삼각형', 3, '사다리꼴 = 정삼각형 3개'],
  ['한 변이 2배인 큰 정삼각형', '정삼각형', 4, '변을 반으로 나눠 이으면 정삼각형 4개'],
  ['정육각형 2개를 붙인 모양', '마름모(정삼각형 2개 크기)', 6, '정삼각형 12개 ÷ 2개 = 6개'],
];
G['hp-8'] = (r) => { // 모양 채우기
  const [big, piece, ans, why] = pick(r, TILES);
  return build(r, { text: `모양 조각(한 변의 길이가 모두 같음)으로 ${big}${josa(big.replace(/\)$/, '').slice(-1), '을', '를')} 겹치지 않게 빈틈없이 채우려고 합니다. ${piece} 조각은 몇 개 필요한가요?`, correct: { v: q(ans) },
    wrongs: [{ v: q(ans + 1), note: '하나 더 셈' }, { v: q(ans * 2), note: '조각 크기를 반으로 봄' }, ...(ans > 2 ? [{ v: q(ans - 1), note: '하나 덜 셈' }] : [{ v: q(6), note: '정삼각형 개수를 그대로 씀' }])],
    fill: nearInt(r, ans, 4), fmt: ea, order: 'asc', explain: `${why} → ${ans}개` });
};
G['hp-9'] = (r) => { // 둘레·한 변 → 정다각형 이름
  const n = ri(r, 5, 9), a = ri(r, 2, 9), L = n * a, others = win(r, n);
  return nameOrder(build(r, { text: `한 변의 길이가 ${a} cm이고 모든 변의 길이의 합이 ${L} cm인 정다각형의 이름은?`, correct: { s: '정' + pName(n) },
    wrongs: others.map((k) => ({ s: '정' + pName(k), note: k === n - 1 ? '변의 수를 하나 덜 셈' : k === n + 1 ? '변의 수를 하나 더 셈' : undefined })), count: 5, order: 'fixed',
    explain: `변의 수 = ${L} ÷ ${a} = ${n} → 정${pName(n)}` }));
};
G['hp-10'] = (r) => { // 한 꼭짓점에서 그은 대각선
  const n = ri(r, 5, 10), ans = n - 3;
  return build(r, { text: `${pName(n)}의 한 꼭짓점에서 그을 수 있는 대각선은 몇 개인가요?`, correct: { v: q(ans) },
    wrongs: [{ v: q(n - 1), note: '이웃한 꼭짓점까지 셈 (이웃한 두 꼭짓점과 자기 자신은 빼야 함)' }, { v: q(n - 2), note: '이웃한 꼭짓점 하나만 뺌' }, { v: q(n * (n - 3) / 2), note: '모든 대각선의 수를 셈' }],
    fill: nearInt(r, ans, 4), fmt: ea, order: 'asc', explain: `자기 자신과 이웃한 두 꼭짓점을 빼면 ${n} − 3 = ${ans}개` });
};

// 고정 문항: 생성기를 정해진 seed 로 돌려 문제지의 원래 문항을 만든다(같은 코드면 항상 같은 문제)
// 규칙 하나로 바로 풀리는 유형: 찍기 경고 기준을 낮춘다(index.ts fastLimit). 원래 문항·다시 풀기 모두
// rc-2·hf-3 분자가 같은 두 분수, hf-2 단위분수 중 가장 큰/작은, hf-4 분모가 같은 분수 중 가장 큰,
// hf-10·hd-1 0.1/0.01이 n개, hd-2 소수의 자릿값, r4-1 비의 기준량(뒤의 수)
const FAST: Record<string, number> = { 'rc-2': 2, 'hf-2': 2, 'hf-3': 2, 'hf-4': 2, 'hf-10': 2, 'hd-1': 2, 'hd-2': 2, 'r4-1': 2 };
const fastOf = (id: string) => (FAST[id] ? { fastSec: FAST[id] } : {});

export function makeFixed(id: string, area: string, seed: number) {
  const { _vals, ...rest } = G[id](makeRng(seed)) as any; void _vals;
  return { id, area, type: 'choice', ...rest, ...fastOf(id) };
}

export const TWIN_IDS = Object.keys(G);
export const hasTwin = (srcId: string) => !!G[srcId];

// 원래 문항 하나로 유사 문제 하나 만들기. area 는 원래 문항의 것을 그대로 쓴다.
export function makeTwin(src: any, seed: number) {
  const gen = G[src.id]; if (!gen) return null;
  const r = makeRng(seed);
  const t = gen(r);
  const { _vals, ...rest } = t as any; void _vals;
  return { id: `${src.id}~${(seed >>> 0).toString(36)}`, src: src.id, area: src.area, type: 'choice', ...rest, ...fastOf(src.id) };
}
export function makeTwinWithVals(src: any, seed: number) { const gen = G[src.id]; return gen ? gen(makeRng(seed)) : null; } // 검증용
