-- 레벨테스트 응시 기록 (study.blissme.ai/leveltest, Edge Function lt-api)
-- RLS 켜고 정책 없음(의도) — anon/publishable 키로 읽기·쓰기 불가, lt-api(service_role)만 접근.
create table if not exists public.lt_attempts (
  id            uuid primary key default gen_random_uuid(),
  test_id       text not null,
  student       text not null,
  kid_token     text not null,            -- 아이 기기: 이어 풀기·저장·제출 권한
  report_token  text not null unique,     -- 학부모 리포트 링크(텔레그램)
  status        text not null default 'in_progress' check (status in ('in_progress','submitted','expired')),
  started_at    timestamptz not null default now(),
  deadline_at   timestamptz not null,
  saved_at      timestamptz,
  submitted_at  timestamptz,
  answers       jsonb not null default '{}'::jsonb,
  qtimes        jsonb not null default '{}'::jsonb,  -- 문항별 머문 시간(초)
  tab_leaves    integer not null default 0,          -- 시험 중 다른 앱/탭으로 나간 횟수
  score         integer,
  total         integer,
  result        jsonb,
  no_notify     boolean not null default false,
  user_agent    text,
  created_at    timestamptz not null default now()
);
create index if not exists lt_attempts_started_idx on public.lt_attempts (started_at desc);
create index if not exists lt_attempts_student_idx on public.lt_attempts (test_id, student, started_at desc);
create index if not exists lt_attempts_open_idx on public.lt_attempts (deadline_at) where status = 'in_progress';
alter table public.lt_attempts enable row level security;
comment on table public.lt_attempts is '레벨테스트 응시 기록(lt-api). RLS 켜고 정책 없음 — service_role 만 접근. anon 정책 추가 금지.';
