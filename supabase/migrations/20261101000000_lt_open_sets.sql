-- 허브에 보이는 문제지: 아빠(HQ)가 연 것만 (lt-api progress 가 open 으로 내려줌). 선행 방지.
-- student 는 학생 코드(k1~k3). 열기: insert, 닫기: delete.
--   insert into public.lt_open_sets (student, test_id) values ('k3', 'h-poly') on conflict do nothing;
--   delete from public.lt_open_sets where student = 'k3' and test_id = 'h-poly';
-- 이미 푼 문제지·다시 풀기가 남은 문제지는 열려 있지 않아도 계속 보인다. 링크로 직접 푸는 것은 막지 않는다.
-- RLS 켜고 정책 없음(의도) — lt-api(service_role)만 접근. anon 정책 추가 금지.
create table if not exists public.lt_open_sets (
  student    text not null,
  test_id    text not null,
  opened_at  timestamptz default now(),
  primary key (student, test_id)
);
alter table public.lt_open_sets enable row level security;
comment on table public.lt_open_sets is '허브에 열어 둔 문제지(학생 코드, 문제지 id). RLS 켜고 정책 없음 — service_role 만 접근.';
