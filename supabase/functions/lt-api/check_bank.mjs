// 문제 뱅크 검사 (node 22+, deno 없이): node --no-warnings supabase/functions/lt-api/check_bank.mjs
// 1) 다시 풀기 변형·생성기는 (문제지 id, 문항 id) 로 찾는다 — 다른 문제지와 문항 id 가 겹쳐도 엉키지 않는지(과학 sb-1 ↔ 국어 sb-1 사고 방지)
// 2) 모든 문항: 보기 2개 이상, 정답이 보기 범위 안
// 3) 변형 문항: 정답이 보기 범위 안, 변형 맵의 id 가 짝지은 문제지에 실제로 있다
// 4) 복습 문제지(practice)의 모든 문항이 다시 풀기 문제를 만들 수 있다(변형 또는 수학 생성기)
// 참고로 문제지끼리 id 가 겹친 수도 센다(내용이 다른 겹침은 위 1)로 안전한지만 본다)
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { readdirSync } from 'node:fs';
const d = dirname(fileURLToPath(import.meta.url)) + '/';
const names = ['math_m1','rec_e56','math_e4','rec_units','e4_sets','geo_e','eng_diag','eng_gram','eng_voc','eng_m1_mw','eng_m1_ph','eng_sq_check','math_eqw','math_m2','kor_diag','sci_gas','sci_force','sci_gas_unit','kor_m1_grammar','kor_e4_read','kor_m1_lit','kor_m1_read','geo_sets','kor_m1_vocab5'];
const skip = ['sci_common'];
const missing = readdirSync(d + 'tests').map((f) => f.replace(/\.ts$/, '')).filter((f) => !names.includes(f) && !skip.includes(f));
if (missing.length) { console.log('실패: names 목록에 없는 tests 파일 ' + missing.join(',') + ' — 위 names 에 추가하세요'); process.exit(1); }
const tests = {};
for (const n of names) { const m = await import(d + 'tests/' + n + '.ts'); for (const v of Object.values(m)) for (const t of (Array.isArray(v) ? v : [v])) if (t && t.id && Array.isArray(t.questions)) tests[t.id] = t; }
const { VARIANT_SOURCES, VARIANTS_BY_TEST, usesVariants, variantsOf } = await import(d + 'variants.ts');
const { TWIN_IDS } = await import(d + 'twins.ts');
const errs = [];
const sig = (q) => JSON.stringify([q.text, q.options, q.answer, q.fig ?? null]);
const seen = {}; let overlap = 0;
for (const t of Object.values(tests)) for (const q of t.questions) {
  if (!Array.isArray(q.options) || q.options.length < 2 || !(q.answer >= 1 && q.answer <= q.options.length)) errs.push(`문항 ${t.id}/${q.id}: 보기·정답 이상`);
  const p = seen[q.id]; if (p && sig(p.q) !== sig(q)) overlap++; if (!p) seen[q.id] = { t: t.id, q };
}
for (const [ts, map] of VARIANT_SOURCES) {
  const ids = new Set(ts.flatMap((t) => t.questions.map((q) => q.id)));
  for (const k of Object.keys(map)) if (!ids.has(k)) errs.push(`변형 ${k}: 짝지은 문제지(${ts.map((t) => t.id)})에 없는 문항 id`);
  for (const [k, vs] of Object.entries(map)) for (const v of vs) if (!(v.answer >= 1 && v.answer <= v.options.length)) errs.push(`변형 ${k}: 정답이 보기 범위 밖`);
}
const G = new Set(TWIN_IDS);
for (const [ts, map] of VARIANT_SOURCES) for (const t of ts) for (const q of t.questions)
  if (map[q.id]?.length && variantsOf(t.id, q.id) !== map[q.id]) errs.push(`${t.id}/${q.id}: 변형이 다른 문제지 것으로 잘못 연결됨`);
for (const t of Object.values(tests)) if (t.practice) {
  const bad = t.questions.filter((q) => (usesVariants(t.id) ? !variantsOf(t.id, q.id).length : !G.has(q.id))).map((q) => q.id);
  if (bad.length) errs.push(`${t.id}: 다시 풀기 문제를 못 만드는 문항 ${bad.join(',')}`);
}
console.log(`문제지 ${Object.keys(tests).length}개, 변형 쓰는 문제지 ${Object.keys(VARIANTS_BY_TEST).length}개, 수학 생성기 id ${G.size}개, 내용이 다른 id 겹침 ${overlap}건(문제지별로 찾으므로 안전)`);
if (errs.length) { console.log('실패 ' + errs.length + '건\n' + errs.join('\n')); process.exit(1); }
console.log('통과');
