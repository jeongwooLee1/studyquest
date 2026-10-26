# studyquest 공통 규칙

초·중학생 아이들이 푸는 문제지 사이트. study.blissme.ai/leveltest

- 이 레포는 **공개**다. 아이 이름·학교·학원·점수·응시 기록은 코드·문서·PR·커밋 메시지 어디에도 쓰지 않는다. 학생은 코드(k1~k3)로만 부른다. 실제 값은 서버 secret `STUDENT_PROFILES` 에만 있다.
- 운영 문서(작업 카드·결정·상태·점수 기록)는 비공개 레포에서 관리한다. 여기에 두지 않는다.
- 변경 전후로 `deno check supabase/functions/lt-api/index.ts` 와 문제지 정답 검사를 돌린다.
- main 합치기·배포·DB 쓰기는 운영 담당(HQ)이 한다.
- 말은 한국어로, 짧게. 막히면 우회하지 말고 멈춰서 보고한다.
