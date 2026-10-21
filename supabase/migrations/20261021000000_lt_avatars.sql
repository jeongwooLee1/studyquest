-- 문제지 목록(hub.html) 이름 버튼에 쓰는 아이 사진. 사진은 공개 저장소에 올리지 않고 이 테이블에만 둔다.
create table if not exists public.lt_avatars (
  student    text primary key,
  image      text not null,              -- data:image/jpeg;base64,... (256px 정사각형)
  updated_at timestamptz not null default now()
);
alter table public.lt_avatars enable row level security;
comment on table public.lt_avatars is '문제지 목록 사진(lt-api avatars). RLS 켜고 정책 없음 — service_role 만 접근. 지우면 이모지로 돌아감.';
