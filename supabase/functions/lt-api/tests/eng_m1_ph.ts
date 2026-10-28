// 중1 영어 어휘 문제지 — 구동사·숙어(단어는 다 아는데 붙여 놓으면 뜻이 달라지는 말). 전부 5지선다, practice:true.
//   eng-m1-ph  구동사·숙어(10): 숙어 뜻 알기 · 문맥에서 뜻 고르기(make up·bring up·turn down) · 글 속에서 쓰기(take off, look forward to -ing, 짧은 글)
// 다시 풀기용 변형 문항은 ENG_M1_PH_VARIANTS[원래 문항 id] 에 3개씩(eng_voc.ts 와 같은 형식). 문항 id 는 'ph-1' ~ 'ph-10'.
// fastSec: 2 = 숙어 뜻만 알면 바로 풀리는 문항. 문장·글을 읽는 문항은 기본 5초. 표기: 줄바꿈 \n, 강조 <b>…</b>. '$'는 쓰지 않는다.

const G = '어휘';
const set = (id: string, title: string, subtitle: string, minutes: number, practice: boolean, areas: any[], questions: any[]) => ({
  id, title, subtitle, minutes, practice, pace: { [G]: 30 }, areas, questions: questions.map((q) => ({ type: 'choice', ...q })),
});

type V = { text: string; options: string[]; answer: number; traps?: { a: number; note: string }[]; explain: string };

// 오답 습관(원래 문항과 변형 문항이 같은 문구를 쓴다)
const N_SIM = '비슷한 숙어와 헷갈림 (put off 연기하다 / call off 취소하다 / give up 포기하다)';
const N_LIT = '낱말 뜻을 그대로 붙여 읽음 (run + into → 뛰어 들어가다)';
const N_MULTI = '숙어의 첫 번째 뜻만 외워서, 문장 속에서 쓰인 다른 뜻을 고르지 못함';
const N_UPDOWN = 'up(올리다·키우다)과 down(내리다·줄이다)을 거꾸로 읽음';
const N_ONOFF = 'on(입다·켜다)과 off(벗다·끄다)를 거꾸로 읽음';
const N_LOOK = '비슷하게 생긴 숙어와 헷갈림 (look for 찾다 / look after 돌보다 / look up 찾아보다)';
const N_ING = 'look forward to 의 to 를 「to 부정사」로 착각해 동사원형을 씀 (to 뒤에는 -ing)';

const area = (id: string, name: string, why: string, study: string[]) => ({ id, group: G, name, unit: '중1 숙어', why, study });

export const ENG_M1_PH = set('eng-m1-ph', '구동사·숙어', '중1 영어 어휘 · 붙이면 뜻이 달라지는 말', 15, true, [
  area('a1', '숙어 뜻 알기', '낱말 뜻을 더해서는 안 풀려요. 숙어는 한 덩어리 뜻으로 통째로 외워야 해요.', ['단어장 숙어 부분을 「영어 – 뜻 – 예문 한 줄」로 하루 5개씩 소리 내어 읽기', '비슷한 숙어(put off – call off – give up)는 표로 묶어 뜻 차이 적기']),
  area('a2', '문맥에서 뜻 고르기', '뜻이 둘 이상인 숙어는 앞뒤 단어가 어느 뜻인지 알려 줘요.', ['숙어 앞뒤 두 단어에 동그라미 치고 뜻 고르기', 'make up·turn down·take off·bring up 은 뜻마다 예문 하나씩 직접 만들어 보기']),
  area('a3', '글 속에서 쓰기', '빈칸 채우기와 글 읽기에서는 뜻뿐 아니라 뒤에 오는 말의 형태도 맞아야 해요.', ['look forward to + -ing 처럼 뒤에 오는 형태가 정해진 숙어는 문장째로 외우기', '짧은 영어 글을 읽고 숙어에 밑줄 친 뒤 우리말로 한 문장 요약하기']),
], [
  { id: 'ph-1', fastSec: 2, area: 'a1', text: '밑줄 친 말의 뜻은?\nLet\'s <b>put off</b> the meeting until Friday.',
    options: ['연기하다', '취소하다', '시작하다', '끝내다', '참석하다'], answer: 1,
    traps: [{ a: 2, note: N_SIM }],
    explain: 'put off = 연기하다, 미루다. until Friday(금요일까지)가 뒤에 있으니 「금요일로 미루자」예요. 취소는 call off.' },
  { id: 'ph-2', fastSec: 2, area: 'a1', text: '밑줄 친 말의 뜻은?\nI <b>ran into</b> my old teacher at the mall.',
    options: ['찾아갔다', '쫓아갔다', '우연히 만났다', '가르쳤다', '초대했다'], answer: 3,
    traps: [{ a: 2, note: N_LIT }],
    explain: 'run into = 우연히 만나다. 쇼핑몰에서 옛 선생님을 마주친 상황이에요. run(달리다) + into(안으로)로 읽으면 안 돼요.' },
  { id: 'ph-3', fastSec: 2, area: 'a1', text: '숙어와 뜻이 <b>바르게</b> 짝지어진 것은?',
    options: ['call off — 전화하다', 'bring up — 가져오다', 'put up with — 참다', 'carry out — 취소하다', 'come up with — 따라잡다'], answer: 3,
    traps: [{ a: 1, note: N_LIT }, { a: 4, note: N_SIM }],
    explain: 'put up with = 참다, 견디다. call off 취소하다, bring up 기르다·꺼내다, carry out 수행하다, come up with 생각해 내다.' },
  { id: 'ph-4', fastSec: 2, area: 'a1', text: '<b>take care of</b> 와 뜻이 같은 것은?',
    options: ['look for', 'look up', 'look after', 'look like', 'look out'], answer: 3,
    traps: [{ a: 1, note: N_LOOK }, { a: 2, note: N_LOOK }],
    explain: 'take care of = look after = 돌보다. look for 찾다, look up 찾아보다, look like ~처럼 보이다, look out 조심하다.' },
  { id: 'ph-5', area: 'a2', text: '두 문장에서 <b>made up</b> 의 뜻을 바르게 짝지은 것은?\n① They had a fight, but they <b>made up</b> soon.\n② He <b>made up</b> a story about a dragon.',
    options: ['① 화해했다 ② 화해했다', '① 지어냈다 ② 지어냈다', '① 지어냈다 ② 화해했다', '① 화해했다 ② 지어냈다', '① 포기했다 ② 지어냈다'], answer: 4,
    traps: [{ a: 3, note: N_MULTI }, { a: 1, note: N_MULTI }],
    explain: 'make up = ① 화해하다 ② (이야기를) 지어내다. ①은 had a fight(싸웠다)가 앞에 있으니 → 화해했다. ②는 a story(이야기)가 뒤에 있으니 → 지어냈다.' },
  { id: 'ph-6', area: 'a2', text: '<b>bring up</b> 이 「(화제를) 꺼내다」의 뜻으로 쓰인 문장은?',
    options: ['My aunt <b>brought up</b> three children alone.', 'Don\'t <b>bring up</b> the test now.', 'I <b>brought</b> my lunch to school.', 'He is <b>growing up</b> fast.', 'She <b>picked up</b> the phone.'], answer: 2,
    traps: [{ a: 1, note: N_MULTI }],
    explain: 'bring up = ① 기르다 ② (이야기를) 꺼내다. 1번은 three children → 기르다. 2번은 the test(시험 이야기)를 지금 하지 말라는 뜻 → 꺼내다.' },
  { id: 'ph-7', area: 'a2', text: '밑줄 친 말의 뜻은?\nJane asked Mike to dance, but he <b>turned</b> her <b>down</b>.',
    options: ['거절했다', '소리를 줄였다', '불을 껐다', '따라갔다', '초대했다'], answer: 1,
    traps: [{ a: 2, note: N_MULTI }, { a: 3, note: N_SIM }],
    explain: 'turn down = ① 소리를 줄이다 ② 거절하다. 춤을 추자고 부탁했는데 turn her down 이니 → 거절했다. 소리(음악)가 나오지 않아요.' },
  { id: 'ph-8', area: 'a3', text: '빈칸에 알맞은 말은?\nLook! The plane on the runway is going to ______ soon.',
    options: ['put on', 'take off', 'turn down', 'give up', 'call off'], answer: 2,
    traps: [{ a: 1, note: N_ONOFF }],
    explain: '주어가 the plane(비행기)이니 → take off(이륙하다). 신발·옷이 목적어면 「벗다」, put on 은 「입다」라서 반대예요.' },
  { id: 'ph-9', area: 'a3', text: '빈칸에 알맞은 말은?\nI\'m looking forward to ______ you at the party.',
    options: ['see', 'seeing', 'saw', 'to see', 'have seen'], answer: 2,
    traps: [{ a: 1, note: N_ING }, { a: 4, note: N_ING }],
    explain: 'look forward to 에서 to 는 전치사라서 뒤에 -ing 가 와요 → seeing. 「to + 동사원형」이 아니에요.' },
  { id: 'ph-10', area: 'a3', text: '글을 읽고 질문에 답하세요.\n\nSam\'s class planned a picnic for Saturday. It rained, so the teacher <b>called off</b> the picnic. Sam was sad, but he didn\'t <b>give up</b>. He <b>came up with</b> a new idea: a movie day in class on Monday.\n\nQ. 선생님이 한 일과 샘이 한 일은?',
    options: ['피크닉을 연기했고, 새 생각을 포기했다', '피크닉을 취소했고, 새 생각을 해 냈다', '피크닉을 취소했고, 영화를 포기했다', '피크닉을 준비했고, 새 생각을 해 냈다', '피크닉을 연기했고, 새 생각을 해 냈다'], answer: 2,
    traps: [{ a: 1, note: N_SIM }, { a: 3, note: N_SIM }, { a: 5, note: N_SIM }],
    explain: 'call off = 취소하다(비가 와서 피크닉을 없앰). didn\'t give up = 포기하지 않았다. came up with a new idea = 새 생각을 해 냈다. 월요일 영화는 피크닉을 미룬 것이 아니라 새로 낸 생각이에요.' },
]);

export const ENG_M1_PH_VARIANTS: Record<string, V[]> = {
  'ph-1': [
    { text: '밑줄 친 말의 뜻은?\nWe must <b>put off</b> the trip until next week.', options: ['연기하다', '취소하다', '출발하다', '예약하다', '포기하다'], answer: 1,
      traps: [{ a: 2, note: N_SIM }, { a: 5, note: N_SIM }], explain: 'until next week(다음 주까지)가 있으니 → 연기하다. 취소는 call off, 포기는 give up.' },
    { text: '빈칸에 알맞은 말은?\nI\'m tired. Can we ______ the test until tomorrow?', options: ['call off', 'hand in', 'put off', 'take off', 'give up'], answer: 3,
      traps: [{ a: 1, note: N_SIM }], explain: 'until tomorrow(내일까지)가 있으니 → put off(미루다). call off 는 아예 취소해서 「내일까지」와 안 어울려요.' },
    { text: '밑줄 친 말의 뜻은?\nDon\'t <b>put off</b> your homework. Do it now!', options: ['끝내다', '제출하다', '미루다', '베끼다', '잊다'], answer: 3,
      explain: '지금 하라고(Do it now!) 했으니 하지 말아야 할 일은 → 미루기(put off). 제출은 hand in.' },
  ],
  'ph-2': [
    { text: '밑줄 친 말의 뜻은?\nI <b>ran into</b> my cousin at the bookstore yesterday.', options: ['약속해서 만났다', '찾아갔다', '우연히 만났다', '달려 들어갔다', '싸웠다'], answer: 3,
      traps: [{ a: 4, note: N_LIT }], explain: 'run into = 우연히 만나다. 서점에서 사촌을 마주친 상황이에요.' },
    { text: '밑줄 친 말의 뜻은?\nGuess who I <b>ran into</b> on the bus today!', options: ['우연히 만났다', '달려갔다', '기다렸다', '배웅했다', '도망쳤다'], answer: 1,
      traps: [{ a: 2, note: N_LIT }], explain: '「누구를 ~했는지 맞혀 봐」 → 버스에서 마주친 사람이니 우연히 만났다.' },
    { text: '빈칸에 알맞은 말은?\nI didn\'t plan it. I just ______ Mina at the mall.', options: ['ran into', 'ran away', 'got over', 'put off', 'handed in'], answer: 1,
      traps: [{ a: 2, note: N_LIT }], explain: '계획하지 않았다(didn\'t plan it)고 했으니 → 우연히 만났다(ran into).' },
  ],
  'ph-3': [
    { text: '숙어와 뜻이 <b>바르게</b> 짝지어진 것은?', options: ['give up — 제출하다', 'get over — 극복하다', 'hand in — 참다', 'find out — 취소하다', 'break down — 연기하다'], answer: 2,
      traps: [{ a: 1, note: N_SIM }, { a: 3, note: N_SIM }], explain: 'get over = 극복하다. give up 포기하다, hand in 제출하다, find out 알아내다, break down 고장 나다. 제출하다는 hand in, 참다는 put up with, 취소하다는 call off, 연기하다는 put off 예요.' },
    { text: '숙어와 뜻이 <b>바르게</b> 짝지어진 것은?', options: ['put off — 입다', 'take off — 연기하다', 'hand in — 제출하다', 'look after — 찾다', 'turn down — 일어나다'], answer: 3,
      traps: [{ a: 2, note: N_SIM }, { a: 4, note: N_LOOK }], explain: 'hand in = 제출하다. put off 연기하다, take off 벗다·이륙하다, look after 돌보다, turn down 줄이다·거절하다.' },
    { text: '숙어와 뜻이 <b>바르게</b> 짝지어진 것은?', options: ['figure out — 그림을 그리다', 'carry out — 취소하다', 'get along with — 따라가다', 'come up with — 생각해 내다', 'give up — 주다'], answer: 4,
      traps: [{ a: 2, note: N_SIM }], explain: 'come up with = 생각해 내다. figure out 알아내다, carry out 수행하다, get along with 잘 지내다, give up 포기하다.' },
  ],
  'ph-4': [
    { text: '밑줄 친 말과 뜻이 같은 것은?\nShe <b>looks after</b> her little brother.', options: ['looks for', 'takes care of', 'looks like', 'looks up', 'gets along with'], answer: 2,
      traps: [{ a: 1, note: N_LOOK }], explain: 'look after = take care of = 돌보다. looks for 찾다, looks like 닮다, looks up 찾아보다.' },
    { text: '밑줄 친 말의 뜻은?\nI <b>take care of</b> my dog every morning.', options: ['찾는다', '돌본다', '닮았다', '찾아본다', '데리고 나간다'], answer: 2,
      traps: [{ a: 1, note: N_LOOK }], explain: 'take care of = look after = 돌보다. 매일 아침 개를 돌본다는 뜻이에요.' },
    { text: '빈칸에 알맞은 말은?\nPlease ______ my cat while I\'m away. Give her food and water.', options: ['look for', 'look like', 'look up', 'look after', 'run into'], answer: 4,
      traps: [{ a: 1, note: N_LOOK }], explain: '내가 없는 동안(while I\'m away) 고양이를 → look after(돌보다). look for 는 찾다.' },
  ],
  'ph-5': [
    { text: '두 문장에서 <b>made up</b> 의 뜻을 바르게 짝지은 것은?\n① The twins had a fight, but they <b>made up</b> before dinner.\n② She <b>made up</b> an excuse.', options: ['① 화해했다 ② 화해했다', '① 지어냈다 ② 지어냈다', '① 지어냈다 ② 화해했다', '① 화해했다 ② 지어냈다', '① 포기했다 ② 지어냈다'], answer: 4,
      traps: [{ a: 3, note: N_MULTI }], explain: '①은 had a fight → 화해했다. ②는 an excuse(변명)를 → 지어냈다.' },
    { text: '두 문장에서 <b>made up</b> 의 뜻을 바르게 짝지은 것은?\n① Tom <b>made up</b> a funny song.\n② After the quarrel, I <b>made up</b> with my friend.', options: ['① 화해했다 ② 지어냈다', '① 지어냈다 ② 지어냈다', '① 화해했다 ② 화해했다', '① 지어냈다 ② 화해했다', '① 지어냈다 ② 포기했다'], answer: 4,
      traps: [{ a: 1, note: N_MULTI }], explain: '①은 a funny song을 → 지어냈다(만들어 냈다). ②는 quarrel(말다툼) 뒤 with my friend → 화해했다.' },
    { text: '두 문장에서 <b>makes up</b> / <b>made up</b> 의 뜻을 바르게 짝지은 것은?\n① He always <b>makes up</b> stories at bedtime.\n② Jen and Amy had a big fight, but they <b>made up</b> yesterday.', options: ['① 지어낸다 ② 화해했다', '① 화해한다 ② 지어냈다', '① 지어낸다 ② 지어냈다', '① 화해한다 ② 화해했다', '① 화해한다 ② 포기했다'], answer: 1,
      traps: [{ a: 2, note: N_MULTI }], explain: '①은 stories를 → 지어낸다. ②는 big fight 뒤 → 화해했다.' },
  ],
  'ph-6': [
    { text: '<b>bring up</b> 이 「기르다」의 뜻으로 쓰인 문장은?', options: ['I <b>brought</b> my lunch to school.', 'He <b>brought up</b> the problem at the meeting.', 'Grandma <b>brought</b> me <b>up</b> in a small town.', 'They went <b>up</b> the hill.', 'She <b>picked up</b> the phone.'], answer: 3,
      traps: [{ a: 2, note: N_MULTI }], explain: '할머니가 나를 작은 마을에서 → 키웠다(기르다). 2번은 the problem(문제)을 회의에서 꺼냈다는 뜻이에요.' },
    { text: '밑줄 친 말의 뜻은?\nMy teacher <b>brought up</b> the school trip in class.', options: ['키웠다', '가져왔다', '올렸다', '(이야기를) 꺼냈다', '없앴다'], answer: 4,
      traps: [{ a: 1, note: N_MULTI }], explain: 'the school trip(소풍)을 수업 시간에 → 이야기를 꺼냈다. 사람을 키운 것이 아니에요.' },
    { text: '밑줄 친 말의 뜻은?\nMy aunt <b>brought</b> me <b>up</b>, so I call her "Mom."', options: ['(이야기를) 꺼냈다', '키웠다', '데려갔다', '쫓아냈다', '가르쳤다'], answer: 2,
      traps: [{ a: 1, note: N_MULTI }], explain: '이모(고모)가 나를 brought up 했고 내가 엄마라고 부른다 → 키웠다. 이야기를 꺼내는 상황이 아니에요.' },
  ],
  'ph-7': [
    { text: '밑줄 친 말의 뜻은?\nThe company <b>turned down</b> her job application.', options: ['소리를 줄였다', '거절했다', '받아들였다', '보냈다', '찾았다'], answer: 2,
      traps: [{ a: 1, note: N_MULTI }, { a: 3, note: N_UPDOWN }], explain: '회사가 입사 지원서(job application)를 turn down → 거절했다. 소리와 관계없어요.' },
    { text: '밑줄 친 말의 뜻은?\nHe asked for my help, but I <b>turned</b> him <b>down</b>.', options: ['소리를 키웠다', '초대했다', '거절했다', '도와주었다', '소리를 줄였다'], answer: 3,
      traps: [{ a: 1, note: N_UPDOWN }, { a: 5, note: N_MULTI }], explain: 'but(그러나) 뒤에 turn him down → 도움 요청을 거절했다.' },
    { text: '밑줄 친 말의 뜻은?\nThe baby is sleeping. Please <b>turn down</b> the radio.', options: ['거절하다', '소리를 줄이다', '소리를 키우다', '라디오를 사다', '라디오를 고치다'], answer: 2,
      traps: [{ a: 1, note: N_MULTI }, { a: 3, note: N_UPDOWN }], explain: '아기가 자고 있으니(sleeping) → 라디오 소리를 줄이다. 키우는 건 turn up.' },
  ],
  'ph-8': [
    { text: '빈칸에 알맞은 말은?\nThe plane will ______ soon. Please sit down.', options: ['call off', 'put on', 'take off', 'give up', 'turn down'], answer: 3,
      traps: [{ a: 2, note: N_ONOFF }], explain: '비행기(the plane)가 주어 → take off(이륙하다).' },
    { text: '빈칸에 알맞은 말은?\nIt is warm inside. You can ______ your coat.', options: ['take off', 'put on', 'call off', 'give up', 'bring up'], answer: 1,
      traps: [{ a: 2, note: N_ONOFF }], explain: '안이 따뜻하니(warm) 코트를 → take off(벗다). put on 은 입다.' },
    { text: '빈칸에 알맞은 말은?\nThe rocket will ______ at ten o\'clock.', options: ['put on', 'give up', 'hand in', 'take off', 'turn down'], answer: 4,
      traps: [{ a: 1, note: N_ONOFF }], explain: '로켓(the rocket)이 주어 → take off(이륙하다, 발사되다).' },
  ],
  'ph-9': [
    { text: '빈칸에 알맞은 말은?\nWe are looking forward to ______ the zoo this weekend.', options: ['visit', 'visiting', 'visited', 'to visit', 'visits'], answer: 2,
      traps: [{ a: 1, note: N_ING }, { a: 4, note: N_ING }], explain: 'look forward to 의 to 는 전치사 → 뒤에 -ing: visiting.' },
    { text: '빈칸에 알맞은 말은?\nJisu is looking forward to ______ her grandparents.', options: ['meet', 'to meet', 'meeting', 'met', 'meets'], answer: 3,
      traps: [{ a: 1, note: N_ING }, { a: 2, note: N_ING }], explain: 'look forward to + -ing → meeting.' },
    { text: '빈칸에 알맞은 말은?\nI\'m looking forward to ______ from you soon.', options: ['hear', 'hearing', 'heard', 'hears', 'to hear'], answer: 2,
      traps: [{ a: 1, note: N_ING }, { a: 5, note: N_ING }], explain: 'look forward to + -ing → hearing (hear from 소식을 듣다).' },
  ],
  'ph-10': [
    { text: '글을 읽고 질문에 답하세요.\n\nOn the way to school, Ben\'s bike <b>broke down</b>. He tried to fix it, but he <b>gave up</b> and walked to school.\n\nQ. 벤에게 일어난 일 두 가지는?',
      options: ['자전거를 잃어버렸고, 고치기를 포기했다', '자전거가 고장 났고, 고치기를 포기했다', '자전거가 고장 났고, 끝까지 고쳤다', '자전거를 고쳤고, 학교까지 걸어갔다', '자전거를 팔았고, 고치기를 포기했다'], answer: 2,
      traps: [{ a: 3, note: N_SIM }], explain: 'broke down = 고장 났다. gave up = 포기했다(고치다가 걸어갔으니).' },
    { text: '글을 읽고 질문에 답하세요.\n\nOur school will <b>carry out</b> a big clean-up on Friday. Mina <b>handed in</b> the sign-up sheet to her teacher yesterday.\n\nQ. 학교가 할 일과 미나가 한 일은?',
      options: ['대청소를 취소한다, 신청서를 냈다', '대청소를 연기한다, 신청서를 받았다', '대청소를 실시한다, 신청서를 받았다', '대청소를 실시한다, 신청서를 버렸다', '대청소를 실시한다, 신청서를 냈다'], answer: 5,
      traps: [{ a: 1, note: N_SIM }, { a: 2, note: N_SIM }], explain: 'carry out = 수행하다, 실시하다. handed in = 제출했다(낸 사람은 미나).' },
    { text: '글을 읽고 질문에 답하세요.\n\nDad asked Jun to <b>look after</b> his little sister. Jun <b>found out</b> that she was hungry, so he made her a sandwich.\n\nQ. 준이 한 일은?',
      options: ['여동생을 찾다가 배고픈 것을 알게 되었다', '여동생을 돌보다가 배고픈 것을 알게 되었다', '여동생을 돌보다가 샌드위치를 먹었다', '여동생과 싸우다가 배고픈 것을 알게 되었다', '여동생을 찾다가 샌드위치를 만들었다'], answer: 2,
      traps: [{ a: 1, note: N_LOOK }, { a: 5, note: N_LOOK }], explain: 'look after = 돌보다(찾다는 look for). found out = 알게 되었다. 그래서 여동생에게 샌드위치를 만들어 주었어요.' },
  ],
};
