-- 영단어 앱(StudyQuest): 틀린 문제가 있는 판의 포인트는 보류 → 오답 풀이를 전부 맞히면 지급 (아빠 결정 2026-10-25)
create table if not exists public.sq_point_hold (
  id           bigserial primary key,
  username     text not null,
  source       text not null,          -- quiz | saja | cheon (원래 판 종류)
  amount       int  not null,
  wrong        int  not null,
  round_id     text,
  detail       jsonb,
  created_at   timestamptz not null default now(),
  released_at  timestamptz,
  release_round text
);
create index if not exists sq_point_hold_open on public.sq_point_hold (username, source) where released_at is null;
alter table public.sq_point_hold enable row level security;
comment on table public.sq_point_hold is '틀린 문제가 있는 판의 보류 포인트(sq-sync). RLS 켜고 정책 없음 — service_role 만.';

-- 보류: 판 기록은 sq_point_log 에 0점으로 남기고(같은 판 중복 차단 유지) 보류 줄을 만든다
create or replace function public.sq_hold_round(p_user text, p_amount int, p_round text, p_source text, p_asked int, p_detail jsonb, p_wrong int)
returns jsonb language plpgsql security definer as $$
declare v_log bigint; r record;
begin
  insert into sq_point_log(username, source, amount, asked, balance, detail, round_id)
    values (p_user, p_source, 0, p_asked, null, coalesce(p_detail,'{}'::jsonb) || jsonb_build_object('held', p_amount), p_round)
    on conflict (username, round_id) where round_id is not null do nothing
    returning id into v_log;
  select points, total_points, daily_points, daily_date into r from sq_accounts where username = p_user;
  if v_log is null and p_round is not null then
    return jsonb_build_object('ok', true, 'dup', true, 'held', 0, 'points', r.points, 'totalPoints', r.total_points);
  end if;
  update sq_point_log set balance = r.points where id = v_log;
  insert into sq_point_hold(username, source, amount, wrong, round_id, detail) values (p_user, p_source, greatest(p_amount,0), p_wrong, p_round, p_detail);
  return jsonb_build_object('ok', true, 'dup', false, 'held', greatest(p_amount,0), 'points', r.points, 'totalPoints', r.total_points,
    'dailyPoints', case when r.daily_date = current_date then coalesce(r.daily_points,0) else 0 end);
end $$;

-- 오답 풀이를 전부 맞힘 → 그 종류의 보류 포인트를 한꺼번에 지급(하루 상한은 sq_award_round 가 적용)
create or replace function public.sq_release_holds(p_user text, p_source text, p_cap int, p_round text)
returns jsonb language plpgsql security definer as $$
declare v_sum int; v_n int; v_res jsonb;
begin
  select coalesce(sum(amount),0), count(*) into v_sum, v_n from sq_point_hold
   where username = p_user and source = p_source and released_at is null;
  if v_n = 0 then return jsonb_build_object('ok', true, 'released', 0, 'n', 0); end if;
  v_res := sq_award_round(p_user, v_sum, p_cap, p_round, 'release', v_sum, jsonb_build_object('from', p_source, 'holds', v_n));
  update sq_point_hold set released_at = now(), release_round = p_round
   where username = p_user and source = p_source and released_at is null;
  return v_res || jsonb_build_object('released', coalesce((v_res->>'added')::int,0), 'n', v_n);
end $$;
revoke all on function public.sq_hold_round(text,int,text,text,int,jsonb,int) from public, anon, authenticated;
revoke all on function public.sq_release_holds(text,text,int,text) from public, anon, authenticated;
