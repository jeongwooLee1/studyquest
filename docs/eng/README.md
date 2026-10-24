# 영어

## 진단 테스트 (`supabase/functions/lt-api/tests/eng_diag.ts`)

| id | 대상 | 문항 | 시간 | 영역 |
|---|---|---|---|---|
| eng-m1-diag | 다연·다혜 (중1) | 20 | 25분 | 어휘 6(단어 뜻·문장 속 쓰임) · 문법 8(be/일반동사, 시제, 조동사·There, to부정사·비교) · 독해 6(세부 내용, 주제·흐름) |
| eng-e4-diag | 다희 (초4) | 15 | 15분 | 어휘 5 · 문장 5 · 끝까지 읽기 5 |

- 전부 5지선다, practice:false(제출 후 정답·풀이 비공개). 듣기는 1차 제외.
- 지문은 교과서 본문이 아니라 같은 수준의 어휘로 새로 씀.
- 정답 번호가 한쪽에 몰리지 않게 섞음(중1 1~5번 각 3~5개, 초4 2~4개).
- 문항 id는 `en-`/`ee-` 접두어 → 수학 twins.ts 유사 문제와 겹치지 않음. 영어는 아직 유사 문제 생성기가 없어서 다시 풀기는 원래 문항만 보여 줌.
- 초4 「끝까지 읽기」: 앞부분만 읽거나 질문의 이름·「다른 것」을 확인하지 않으면 고르게 되는 함정 보기(traps)를 넣음.

## 진단 신뢰도 `engReliability(res, fast_guesses)`

| 결과 | 조건 |
|---|---|
| low 「다시 보기 권장」 | 5초 안에 고른 답이 25% 이상, 또는 빨리 고른 오답 3개 이상 |
| mid 「참고용」 | 빨리 고른 답 2개 이상, 또는 「모르겠어요」 40% 이상 |
| high 「믿을 만함」 | 그 밖 |

빠른 답 수는 perQ.sec < 5 와 lt_attempts.fast_guesses 중 큰 값.

## 문법 문제지 (`tests/eng_gram.ts`, practice:true)

| id | 문항·시간 | 영역 |
|---|---|---|
| eng-m1-past | 10·12분 | 규칙 과거형 철자 2 · 불규칙 과거형 3 · was/were 2 · did 부정·의문 3 |
| eng-m1-modal | 10·12분 | can·may 2 · will·be going to 2 · must·have to·should 3 · 조동사 문장 형태 3 |
| eng-m1-inf | 10·12분 | to부정사 동사 2 · 동명사 동사·전치사 3 · 둘 다/주어 자리 2 · ~하기 위해·~할 3 |

- 출판사와 상관없는 중1 성취기준 문법(과거시제는 모든 중1 교과서에 있음).
- 다시 풀기 변형: `ENG_VARIANTS[원래 문항 id]` 3개씩(30개), 함정 문구는 원래 문항과 같은 상수 사용.
- 통합: index.ts `VARIANTS`에 `...ENG_VARIANTS`, TESTS에 `...ENG_GRAM_SETS`, coach.ts PLAN·LECTURES에 세트 id 추가.
