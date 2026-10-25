// 영단어 앱(StudyQuest) 포인트·진도 동기화. 원본은 bliss 저장소의 sq-sync(v33) — studyquest HQ가 관리하며
// 2026-10-25 아빠 결정으로 「틀린 문제가 있는 판은 보류, 오답 풀이를 전부 맞히면 지급」을 넣었다(sq_point_hold).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const CORS={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, authorization, apikey','Access-Control-Allow-Methods':'POST, OPTIONS'};
const json=(b,s=200)=>new Response(JSON.stringify(b),{status:s,headers:{...CORS,'content-type':'application/json'}});
const admin=()=>createClient(Deno.env.get('SUPABASE_URL'),Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false}});
const THRESHOLD=1000;
const today=()=>new Date().toISOString().slice(0,10);
const DEF_CFG={questions:30,factor:2.85,completeBonus:10,perfectBonus:25};
const DEF_DAILY_CAP=25000; // 실사용 최대치(하루 12,745P)의 약 2배
const SOURCES=['quiz','wrongnote','withdrawtest','saja','sajawrong','cheon','cheonwrong','leveltest','admin'];
// 원래 판 → 그 판의 오답 풀이. 원래 판에 틀린 문제가 있으면 포인트를 보류하고, 오답 풀이를 전부 맞히면 보류분과 함께 지급
const REVIEW_OF={quiz:'wrongnote',saja:'sajawrong',cheon:'cheonwrong'};
const BASE_OF={wrongnote:'quiz',sajawrong:'saja',cheonwrong:'cheon'};
// 한 판에서 이론상 가능한 최대 점수(클라이언트 점수식 기준) — 포인트 위조 방지(현금 출금과 직결)
function maxRoundPoints(cfg){
  const perQ=6*2*2.8*Number(cfg.factor||DEF_CFG.factor); // 문항기본 6 × 콤보 2 × 난이도가중 2.8 × 배율
  const q=Math.max(1,Math.min(60,Math.round(Number(cfg.questions||DEF_CFG.questions))));
  const bonus=Number(cfg.completeBonus||0)+Number(cfg.perfectBonus||0);
  return Math.ceil((perQ*q+bonus)*1.5*1.2); // 오답시험 1.5배 + 여유 20%
}
Deno.serve(async (req)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:CORS});
  if(req.method!=='POST')return json({error:'POST only'},405);
  try{
    const {username,token,addPoints,combo,level,learned,wrong,stats,wordStats,placedLevel,gamesInc,playSeconds,progress,src,detail,roundId}=await req.json();
    const uname=String(username||'').toLowerCase();
    if(!uname||!token)return json({error:'인증이 필요합니다'},401);
    const sb=admin();
    const {data:acc}=await sb.from('sq_accounts').select('*').eq('username',uname).maybeSingle();
    if(!acc||acc.token!==token)return json({error:'세션이 만료되었습니다. 다시 로그인하세요.'},401);
    const td=today();
    // 서버측 상한 검증: 한 번에 넣을 수 있는 포인트 + 하루 총량(둘 다 서버가 결정)
    let cfg=DEF_CFG;
    try{ const {data:c}=await sb.from('app_secrets').select('value').eq('key','SQ_CONFIG').maybeSingle(); if(c&&c.value)cfg={...DEF_CFG,...JSON.parse(c.value)}; }catch(e){}
    let dailyCap=DEF_DAILY_CAP;
    try{ const {data:dc}=await sb.from('app_secrets').select('value').eq('key','SQ_DAILY_POINT_CAP').maybeSingle(); if(dc&&Number(dc.value)>0)dailyCap=Number(dc.value); }catch(e){}
    const perRound=maxRoundPoints(cfg);
    const asked=Math.max(0,Math.floor(Number(addPoints)||0));
    const want=Math.min(asked,perRound);
    // 포인트 적립은 DB 함수(sq_award_round)로 원자 처리 — 같은 판(roundId) 두 번째 요청부터는 적립 없이 dup 응답
    // (마지막 문제 '건너뛰기' 연타로 한 판이 수십 번 적립되던 사고 차단, 2026-10-11)
    const rid=(typeof roundId==='string'&&/^[A-Za-z0-9_-]{6,64}$/.test(roundId))?roundId:null;
    const source=SOURCES.includes(String(src))?String(src):'quiz';
    const d=(detail&&typeof detail==='object')?detail:{};
    const safeDetail={q:Number(d.q)||null,correct:Number(d.correct)||null,wrong:Number(d.wrong)||null,
      seconds:Number(d.seconds)||null,combo:Number(d.combo)||null,level:d.level?String(d.level).slice(0,20):null};
    const qn=Math.max(0,Math.floor(Number(d.q)||0)), wrongN=qn?Math.max(0,qn-Math.max(0,Math.floor(Number(d.correct)||0))):0;
    let points=acc.points, totalPoints=acc.total_points, dailyPoints=(acc.daily_date===td?(acc.daily_points||0):0), added=0, dup=false, held=0, released=0, rule='';
    if(asked>0){
      let aw=null;
      if(REVIEW_OF[source]&&wrongN>0){
        // 틀린 문제가 있는 판 → 보류(오답 풀이를 전부 맞히면 지급)
        const r=await sb.rpc('sq_hold_round',{p_user:uname,p_amount:want,p_round:rid,p_source:source,p_asked:asked,p_detail:safeDetail,p_wrong:wrongN});
        if(r.error)throw r.error; aw=r.data; held=Number(aw&&aw.held)||0; rule='held';
      }else if(BASE_OF[source]&&(wrongN>0||!qn)){
        // 오답 풀이에서 또 틀림 → 이번 판은 지급 없음(다시 풀어서 전부 맞혀야 함). 기록만 0점으로
        const r=await sb.rpc('sq_award_round',{p_user:uname,p_add:0,p_cap:dailyCap,p_round:rid,p_source:source,p_asked:asked,p_detail:safeDetail});
        if(r.error)throw r.error; aw=r.data; rule='review-not-perfect';
      }else{
        const r=await sb.rpc('sq_award_round',{p_user:uname,p_add:want,p_cap:dailyCap,p_round:rid,p_source:source,p_asked:asked,p_detail:safeDetail});
        if(r.error)throw r.error; aw=r.data;
        // 오답 풀이를 전부 맞힘 → 같은 종류의 보류 포인트 지급
        if(BASE_OF[source]&&aw&&aw.ok&&!aw.dup){
          const rr=await sb.rpc('sq_release_holds',{p_user:uname,p_source:BASE_OF[source],p_cap:dailyCap,p_round:'rel-'+(rid||Date.now().toString(36))});
          if(rr.error)throw rr.error;
          if(rr.data&&rr.data.n>0){ aw={...aw,points:rr.data.points??aw.points,totalPoints:rr.data.totalPoints??aw.totalPoints,dailyPoints:rr.data.dailyPoints??aw.dailyPoints}; released=Number(rr.data.released)||0; rule='released'; }
        }
      }
      if(aw&&aw.ok){ points=aw.points; totalPoints=aw.totalPoints; if(aw.dailyPoints!=null)dailyPoints=aw.dailyPoints; added=(Number(aw.added)||0)+released; dup=!!aw.dup; }
    }
    const clamped=!dup&&!held&&rule!=='review-not-perfect'&&asked>added-released;
    if(dup)console.error('duplicate round ignored',uname,'round',rid,'asked',asked);
    else if(clamped)console.error('point clamp',uname,'asked',asked,'->',added,'perRound',perRound,'dailyCap',dailyCap);
    const bc=Math.min(Math.max(acc.best_combo||0,Math.floor(Number(combo)||0)),Math.max(1,Math.min(60,Number(cfg.questions||30))));
    const upd={best_combo:bc,updated_at:new Date().toISOString()}; // points/daily는 RPC가 이미 처리
    if(level!=null)upd.level=String(level);
    if(learned!=null)upd.learned_count=Math.max(0,Math.floor(Number(learned)||0));
    if(wrong!=null)upd.wrong_count=Math.max(0,Math.floor(Number(wrong)||0));
    if(stats!=null)upd.stats=stats;
    if(wordStats!=null&&typeof wordStats==='object')upd.word_stats=wordStats;
    if(progress!=null&&typeof progress==='object')upd.progress_json=progress;
    if(placedLevel!=null){upd.placed_at=new Date().toISOString();upd.placed_level=String(placedLevel);}
    const gi=Math.max(0,Math.min(5,Math.floor(Number(gamesInc)||0)));
    if(gi>0)upd.games_played=(acc.games_played||0)+gi;
    const ps=Math.max(0,Math.min(3600,Math.floor(Number(playSeconds)||0)));
    if(ps>0)upd.play_seconds=(acc.play_seconds||0)+ps;
    await sb.from('sq_accounts').update(upd).eq('username',uname);
    if(learned!=null||gi>0){
      await sb.from('sq_progress_log').upsert({username:uname,date:td,
        mastered:upd.learned_count!=null?upd.learned_count:(acc.learned_count||0),
        wrong:upd.wrong_count!=null?upd.wrong_count:(acc.wrong_count||0),
        level:upd.level||acc.level,total_points:totalPoints,
        games_played:upd.games_played!=null?upd.games_played:(acc.games_played||0),
        play_seconds:upd.play_seconds!=null?upd.play_seconds:(acc.play_seconds||0),
        updated_at:new Date().toISOString()});
    }
    const {data:pend}=await sb.from('sq_withdrawals').select('id').eq('account',uname).eq('status','pending').maybeSingle();
    return json({points,totalPoints,bestCombo:bc,dailyPoints,dailyCap,dailyRemaining:Math.max(0,dailyCap-dailyPoints),pending:!!pend,threshold:THRESHOLD,withdrawable:points>=THRESHOLD&&!pend,added,clamped,dup,held,released,rule,floorGrade:acc.floor_grade||null,grade:acc.grade||null,gradeSetAt:acc.grade_set_at||null});
  }catch(e){return json({error:String(e)},500);}
});
