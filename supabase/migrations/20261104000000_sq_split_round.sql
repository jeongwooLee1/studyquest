-- 영단어 앱(StudyQuest): 틀린 문제가 있는 판 = 맞힌 비율만큼 바로 지급 + 나머지만 보류 (정우 결정 2026-11-04)
--   지급 = floor(판 포인트 × 맞힌 수 / 전체 수), 보류 = 판 포인트 − 지급. 전부 틀리면 지급 0.
--   보류분은 이전과 같이 오답 풀이를 전부 맞히면 sq_release_holds 가 지급한다.
-- 지급은 sq_award_round 로 처리해 roundId 중복 차단·하루 상한을 그대로 쓴다(판당 상한은 sq-sync 가 p_pay+p_hold 이전에 적용).
-- 이미 쌓인 보류(sq_point_hold.released_at is null)는 건드리지 않는다. sq_hold_round 는 남겨 두되 sq-sync 는 더 부르지 않는다.
create or replace function public.sq_split_round(p_user text, p_pay int, p_hold int, p_cap int, p_round text, p_source text, p_asked int, p_detail jsonb, p_wrong int)
returns jsonb language plpgsql security definer as $$
declare v_res jsonb; v_hold int := greatest(coalesce(p_hold,0),0);
begin
  v_res := sq_award_round(p_user, greatest(coalesce(p_pay,0),0), p_cap, p_round, p_source, p_asked, p_detail);
  if not coalesce((v_res->>'ok')::boolean,false) or coalesce((v_res->>'dup')::boolean,false) then
    return v_res || jsonb_build_object('held', 0);
  end if;
  if v_hold > 0 then
    insert into sq_point_hold(username, source, amount, wrong, round_id, detail) values (p_user, p_source, v_hold, p_wrong, p_round, p_detail);
    if p_round is not null then
      update sq_point_log set detail = coalesce(detail,'{}'::jsonb) || jsonb_build_object('held', v_hold) where username = p_user and round_id = p_round;
    end if;
  end if;
  return v_res || jsonb_build_object('held', v_hold);
end $$;
revoke all on function public.sq_split_round(text,int,int,int,text,text,int,jsonb,int) from public, anon, authenticated;
