// 채점 — 숫자 답 해석과 영역별 진단 (lt-api 전용, 외부 의존 없음)
// ── 숫자 답 해석: 정수, 소수, 분수(a/b), 대분수(a b/c) ──
export function gcd(a: number, b: number) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
export type Num = { n: number; d: number; reduced: boolean };
export function parseNum(raw: unknown): Num | null {
  const s = String(raw ?? '').replace(/[−–—]/g, '-').replace(/,/g, '').replace(/\s+/g, ' ').trim();
  if (!s || s.length > 24) return null;
  let m;
  if ((m = s.match(/^(-?)\s*(\d+)$/))) return { n: (m[1] ? -1 : 1) * Number(m[2]), d: 1, reduced: true };
  if ((m = s.match(/^(-?)\s*(\d*)\.(\d+)$/))) { const k = 10 ** m[3].length; return { n: (m[1] ? -1 : 1) * (Number(m[2] || '0') * k + Number(m[3])), d: k, reduced: false }; }
  if ((m = s.match(/^(-?)\s*(\d+)\s*\/\s*(\d+)$/))) { const n = Number(m[2]), d = Number(m[3]); if (!d) return null; return { n: (m[1] ? -1 : 1) * n, d, reduced: d !== 1 && gcd(n, d) === 1 }; }
  if ((m = s.match(/^(-?)\s*(\d+) (\d+)\s*\/\s*(\d+)$/))) { const w = Number(m[2]), a = Number(m[3]), d = Number(m[4]); if (!d) return null; return { n: (m[1] ? -1 : 1) * (w * d + a), d, reduced: a < d && gcd(a, d) === 1 }; }
  return null;
}
export const sameVal = (a: Num | null, b: Num | null) => !!a && !!b && a.n * b.d === b.n * a.d;

// ── 채점 ──
export function gradeOne(q: any, given: any) {
  const dk = !!(given && given.dk);
  const v = given ? given.v : undefined;
  const blank = !dk && (v === undefined || v === null || v === '' || (Array.isArray(v) && v.every((x) => String(x ?? '').trim() === '')));
  let correct = false, trap: string | null = null;
  if (!dk && !blank) {
    if (q.type === 'choice') {
      correct = Number(v) === q.answer;
      if (!correct) { const t = (q.traps || []).find((t: any) => t.a === Number(v)); if (t) trap = t.note; }
    } else if (q.type === 'num') {
      const g = parseNum(v), a = parseNum(q.answer);
      correct = sameVal(g, a) && (!q.reduced || !!g!.reduced || (g!.d === 1 && a!.d === 1));
      if (!correct) {
        if (q.reduced && sameVal(g, a)) trap = '끝까지 약분하지 않음 (기약분수가 아님)';
        else { const t = (q.traps || []).find((t: any) => sameVal(g, parseNum(t.a))); if (t) trap = t.note; }
      }
    } else if (q.type === 'nums') {
      const arr = Array.isArray(v) ? v : [];
      correct = q.answer.every((a: string, i: number) => sameVal(parseNum(arr[i]), parseNum(a)));
      if (!correct) { const t = (q.traps || []).find((t: any) => t.a.every((a: string, i: number) => sameVal(parseNum(arr[i]), parseNum(a)))); if (t) trap = t.note; }
    }
  }
  return { correct, dk, blank, trap };
}

export function grade(test: any, answers: any, qtimes: any) {
  const perQ = test.questions.map((q: any, i: number) => {
    const r = gradeOne(q, answers?.[q.id]);
    return { no: i + 1, id: q.id, area: q.area, ...r, given: answers?.[q.id]?.v ?? null, answer: q.answer, sec: Math.round(Number(qtimes?.[q.id]) || 0) };
  });
  const areas = test.areas.map((a: any) => {
    const qs = perQ.filter((p: any) => p.area === a.id);
    const correct = qs.filter((p: any) => p.correct).length;
    const rate = qs.length ? correct / qs.length : 0;
    const sec = qs.reduce((s: number, p: any) => s + p.sec, 0);
    const level = rate >= 0.8 ? 'pass' : rate >= 0.5 ? 'weak' : 'focus';
    const slow = qs.length > 0 && sec / qs.length > (test.pace?.[a.group] || 999) && correct > 0;
    return { id: a.id, group: a.group, name: a.name, correct, total: qs.length, dk: qs.filter((p: any) => p.dk).length, rate, level, sec, slow };
  });
  const score = perQ.filter((p: any) => p.correct).length;
  const total = perQ.length;
  const pct = Math.round((score / total) * 100);
  const overall = pct >= 85 ? '탄탄해요' : pct >= 70 ? '양호 — 일부 보완' : pct >= 50 ? '보완이 필요해요' : '기초부터 차근차근';
  // 학습 순서: 집중(🔴) 먼저, 그다음 보완(🟡), 각각 교육과정 앞 영역부터
  const priority = [...areas.filter((a: any) => a.level === 'focus'), ...areas.filter((a: any) => a.level === 'weak')].map((a: any) => a.id);
  const habits: Record<string, number> = {};
  for (const p of perQ) if (p.trap) habits[p.trap] = (habits[p.trap] || 0) + 1;
  return { score, total, pct, overall, areas, priority, habits: Object.entries(habits).map(([note, n]) => ({ note, n })).sort((a, b) => b.n - a.n), perQ };
}

