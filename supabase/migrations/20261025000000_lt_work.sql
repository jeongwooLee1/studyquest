-- 연습장 풀이 사진 (lt-api action 'work'): 아이가 올린 사진 기록 + AI 확인 피드백
-- RLS 켜고 정책 없음(의도) — lt-api(service_role)만 접근. 사진은 비공개 버킷 lt-work.
create table if not exists public.lt_work (
  id          uuid primary key default gen_random_uuid(),
  attempt_id  uuid references public.lt_attempts(id) on delete cascade,
  student     text,
  test_id     text,
  path        text,                       -- 버킷 lt-work 안의 경로 '<attempt_id>/<시각>.jpg'
  feedback    jsonb,                      -- {wrote, readable, items:[{no,note}], kid, dad}, AI 실패 시 null
  created_at  timestamptz default now()
);
create index if not exists lt_work_attempt_idx on public.lt_work (attempt_id);
alter table public.lt_work enable row level security;
comment on table public.lt_work is '연습장 풀이 사진 기록(lt-api work). RLS 켜고 정책 없음 — service_role 만 접근. anon 정책 추가 금지.';

insert into storage.buckets (id, name, public) values ('lt-work', 'lt-work', false) on conflict do nothing;
