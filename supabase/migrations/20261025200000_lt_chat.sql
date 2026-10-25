-- AI 코치 대화 (lt-api action chat / chatGreet / chatResult / chatHistory)
-- RLS 켜고 정책 없음(의도) — lt-api(service_role)만 접근. anon 정책 추가 금지.
create table if not exists public.lt_chat (
  id          bigserial primary key,
  student     text not null,
  role        text not null check (role in ('user','assistant')),
  content     text not null,
  ctx         jsonb,                      -- {kind:'chat'|'greet'|'result', attemptId?, day?}
  created_at  timestamptz default now()
);
create index if not exists lt_chat_student_created_idx on public.lt_chat (student, created_at);
alter table public.lt_chat enable row level security;
comment on table public.lt_chat is '아이와 AI 코치 대화 기록(lt-api chat). RLS 켜고 정책 없음 — service_role 만 접근. anon 정책 추가 금지.';
