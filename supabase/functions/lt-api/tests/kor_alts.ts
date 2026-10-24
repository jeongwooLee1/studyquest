// 국어 문제지의 「틀린 문제 다시 풀기」용 유사 문제 — 숫자를 바꿔 만드는 수학(twins.ts)과 달리,
// 국어는 문항마다 사람이 직접 쓴 같은 유형 문제(alts)를 두고 그중 하나를 골라 보기 순서까지 섞는다.
// 문항 형식: { id, area, type:'choice', text, options, answer, traps, explain, alts: [{ text, options, answer, traps?, explain }] }
// 원래 문항도 후보에 들어간다(보기 순서가 바뀌므로 그대로 외워서 맞히기 어렵다).
// keepOrder:true 인 문항(1개·2개·3개…처럼 순서가 있는 보기)은 보기 순서를 섞지 않는다.

const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};

export const hasAlts = (src: any) => !!(src && Array.isArray(src.alts) && src.alts.length);

// 원래 문항 하나로 유사 문제 하나 만들기. 반환 형식은 twins.ts makeTwin 과 같다(id 는 '<원래 id>~<seed>').
export function altTwin(src: any, seed: number) {
  if (!hasAlts(src)) return null;
  const r = rng(seed);
  const pool = [src, ...src.alts];
  const base = pool[Math.floor(r() * pool.length)];
  const order = base.options.map((_: any, i: number) => i);
  if (!(src.keepOrder || base.keepOrder)) for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const pos = (a: number) => order.indexOf(a - 1) + 1; // 옛 번호 → 새 번호
  return {
    id: `${src.id}~${(seed >>> 0).toString(36)}`, src: src.id, area: src.area, type: 'choice',
    text: base.text, options: order.map((i: number) => base.options[i]), answer: pos(base.answer),
    traps: (base.traps || []).map((t: any) => ({ a: pos(t.a), note: t.note })), explain: base.explain || '',
  };
}
