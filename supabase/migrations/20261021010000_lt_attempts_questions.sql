-- 틀린 문제 다시 풀기('<문제지 id>:re'): 응시마다 새로 만든 유사 문제를 저장. 원래 문제지 응시는 null(문제는 tests/*.ts).
alter table public.lt_attempts add column if not exists questions jsonb;
