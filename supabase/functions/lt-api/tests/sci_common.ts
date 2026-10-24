// 과학 문제지 공통: 보기 순서 섞기. 손으로 쓴 문항은 정답이 2·3번에 몰리기 쉬워서, 문항 id 로 정해지는 순서로 보기를 섞는다(같은 코드면 항상 같은 순서).
// 숫자 보기(값 순서)와 순서가 뜻을 가진 보기(A > B > C 등)는 그대로 둔다. answer·traps 번호는 새 순서에 맞춰 바꾼다.

type Choice = { options: string[]; answer: number; traps?: { a: number; note: string }[] };

const hash = (s: string) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
function rng(seed: number) { let a = seed; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const keepOrder = (opts: string[]) => opts.every((o) => /^[\d.]/.test(o)) || opts.some((o) => /[>=]/.test(o));

export function mixOptions<T extends Choice>(key: string, q: T): T {
  if (keepOrder(q.options)) return q;
  const r = rng(hash(key)), idx = q.options.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  const pos = (old: number) => idx.indexOf(old - 1) + 1; // 옛 번호(1부터) → 새 번호
  return { ...q, options: idx.map((i) => q.options[i]), answer: pos(q.answer), ...(q.traps ? { traps: q.traps.map((t) => ({ ...t, a: pos(t.a) })) } : {}) };
}

// 변형 문항: 순서를 지키는 보기에는 keepOrder 를 붙여 index.ts twinOf 가 (변형을 다 쓴 뒤) 다시 섞지 않게 한다.
export const mixTwins = <V extends Choice>(tw: Record<string, V[]>) =>
  Object.fromEntries(Object.entries(tw).map(([id, vs]) => [id, vs.map((v, i) => keepOrder(v.options) ? { ...v, keepOrder: true } : mixOptions(`${id}~${i}`, v))])) as Record<string, V[]>;
