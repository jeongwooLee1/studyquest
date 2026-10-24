-- 너무 빨리 찍어서 경고한 횟수 (문제가 나오고 5초 안에 답을 고름)
alter table public.lt_attempts add column if not exists fast_guesses int not null default 0;
