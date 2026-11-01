// 다시 풀기용 변형 문항 등록부 — 문제지(test id)별로 따로 보관한다.
// 문항 id 는 문제지끼리 겹칠 수 있어서(sb-1 이 과학·국어에 모두 있음) id 하나로 합치면 뒤에 오는 쪽이 앞을 덮어쓴다.
// 그래서 [문제지 목록, 그 문제지들의 변형 맵] 짝으로 등록하고, 그 문제지에 실제로 있는 문항 id 의 변형만 담는다.
import { SCI_GAS_SETS, SCI_TWINS } from './tests/sci_gas.ts';
import { SCI_FORCE_SETS, SCI_FORCE_TWINS } from './tests/sci_force.ts';
import { SCI_GAS_UNIT, SCI_GAS_UNIT_TWINS } from './tests/sci_gas_unit.ts';
import { ENG_GRAM_SETS, ENG_VARIANTS } from './tests/eng_gram.ts';
import { ENG_VOC_SETS, ENG_VOC_VARIANTS } from './tests/eng_voc.ts';
import { ENG_M1_MW, ENG_M1_MW_VARIANTS } from './tests/eng_m1_mw.ts';
import { ENG_M1_PH, ENG_M1_PH_VARIANTS } from './tests/eng_m1_ph.ts';
import { ENG_SQ_SETS, ENG_SQ_VARIANTS } from './tests/eng_sq_check.ts';
import { KOR_M1_GRAMMAR, KOR_GRAMMAR_TWINS } from './tests/kor_m1_grammar.ts';
import { KOR_E4_READ, KOR_READ_TWINS } from './tests/kor_e4_read.ts';
import { KOR_M1_LIT, KOR_LIT_TWINS } from './tests/kor_m1_lit.ts';
import { KOR_M1_READ, KOR_READ_M1_TWINS } from './tests/kor_m1_read.ts';
import { KOR_V5_SETS, KOR_V5_TWINS } from './tests/kor_m1_vocab5.ts';

export const VARIANT_SOURCES: [any[], Record<string, any[]>][] = [
  [SCI_GAS_SETS, SCI_TWINS], [SCI_FORCE_SETS, SCI_FORCE_TWINS], [[SCI_GAS_UNIT], SCI_GAS_UNIT_TWINS],
  [ENG_GRAM_SETS, ENG_VARIANTS], [ENG_VOC_SETS, ENG_VOC_VARIANTS], [[ENG_M1_MW], ENG_M1_MW_VARIANTS], [[ENG_M1_PH], ENG_M1_PH_VARIANTS], [ENG_SQ_SETS, ENG_SQ_VARIANTS],
  [[KOR_M1_GRAMMAR], KOR_GRAMMAR_TWINS], [[KOR_E4_READ], KOR_READ_TWINS], [[KOR_M1_LIT], KOR_LIT_TWINS], [[KOR_M1_READ], KOR_READ_M1_TWINS], [KOR_V5_SETS, KOR_V5_TWINS],
];

// { 문제지 id: { 문항 id: 변형[] } }
export const VARIANTS_BY_TEST: Record<string, Record<string, any[]>> = {};
for (const [tests, map] of VARIANT_SOURCES) {
  for (const t of tests) {
    const m = VARIANTS_BY_TEST[t.id] ||= {};
    for (const q of t.questions) if (map[q.id]?.length) m[q.id] = map[q.id];
  }
}
// 이 문제지의 다시 풀기는 변형 문항만 쓴다(twins.ts 수학 생성기는 같은 id 를 쓰는 수학 문항 전용이라 여기엔 적용하지 않음)
export const usesVariants = (testId: string) => testId in VARIANTS_BY_TEST;
export const variantsOf = (testId: string, qid: string): any[] => VARIANTS_BY_TEST[testId]?.[qid] || [];
