// 중1 영어 어휘 문제지 — 한 단어, 여러 뜻(다의어). 아는 단어인데 문장 속에서 다른 뜻으로 쓰여 못 읽는 걸 잡는다. 전부 5지선다, practice:true.
//   eng-m1-mw  한 단어, 여러 뜻(10): 품사가 바뀌는 단어(run·kind·mean·change) · 문맥에서 뜻 고르기(matter·leave·close) · 글 속에서 뜻 구별(last·fine·rest)
// 다시 풀기용 변형 문항은 ENG_M1_MW_VARIANTS[원래 문항 id] 에 3개씩(eng_voc.ts 와 같은 형식).
// fastSec: 2 = 단어 하나만 알면 바로 풀리는 문항. 문장·글을 읽는 문항은 기본 5초. 표기: 줄바꿈 \n, 강조 <b>…</b>. '$'는 쓰지 않는다. 문항 id 는 'mw-'.

const G = '어휘';
const set = (id: string, title: string, subtitle: string, minutes: number, practice: boolean, areas: any[], questions: any[]) => ({
  id, title, subtitle, minutes, practice, pace: { [G]: 30 }, areas, questions: questions.map((q) => ({ type: 'choice', ...q })),
});

const area = (id: string, name: string, why: string, study: string[]) => ({ id, group: G, name, unit: '중1 어휘', why, study });

// 오답 습관(원래 문항과 변형 문항이 같은 문구를 쓴다)
const N_RUN = 'run 을 「달리다」로만 알아서, 가게·학원을 「운영하다」로 쓰인 것을 놓침';
const N_KIND = 'kind 를 「친절한」으로만 알아서, What kind of ~ 의 「종류」를 놓침';
const N_MEAN = 'mean 을 「의미하다」로만 알아서, 사람을 꾸미는 「못된」 뜻을 놓침';
const N_CHANGE = 'change 를 「바꾸다」로만 알아서, the change(거스름돈·잔돈)로 쓰인 것을 놓침';
const N_MATTER = 'matter 를 「문제」로만 알아서(What\'s the matter?), 「중요하다」 뜻을 놓침';
const N_LEAVE = 'leave 를 「떠나다」로만 알아서, 물건을 「남겨 두다·두고 오다」 뜻을 놓침';
const N_CLOSE = 'close 가 「닫다」와 「가까운」 두 뜻이라는 것을 몰라서 한쪽 문장에만 맞는 보기를 고름';
const N_LAST = 'last 를 「마지막의」로만 알아서, 동사 「계속되다」 뜻을 놓침 (뒤에 기간이 오면 동사)';
const N_FINE = 'fine 을 「좋은」으로만 알아서, a fine(벌금) 뜻을 놓침';
const N_REST = '「나머지」를 이미 쓴 수나 전체 수로 착각함 (전체에서 빼서 남은 것을 구해야 함)';

export const ENG_M1_MW = set('eng-m1-mw', '한 단어, 여러 뜻', '중1 영어 어휘 · 문장 속에서 뜻 가려 읽기', 15, true, [
  area('a1', '품사가 바뀌는 단어', '같은 단어도 동사·명사·형용사로 자리가 바뀌면 뜻이 달라져요. 첫 번째 뜻만 알면 문장이 엉뚱하게 읽혀요.', ['단어장에서 뜻이 둘 이상인 단어(run·kind·mean·change)를 찾아 뜻마다 예문 하나씩 적기', '단어 앞뒤(a, the, to, 사람 이름)를 보고 동사인지 명사인지 먼저 정하기']),
  area('a2', '문맥에서 뜻 고르기', '어느 뜻인지는 앞뒤 단어가 알려 줘요. 단어만 보지 말고 문장째로 읽어야 해요.', ['모르는 뜻이 나오면 그 단어 앞뒤 두 단어에 동그라미 치고 뜻 추리하기', '같은 단어로 뜻이 다른 문장 두 개를 직접 만들어 보기']),
  area('a3', '글 속에서 뜻 구별', '짧은 글에서는 앞뒤 문장이 뜻의 힌트예요. 숫자·기간·상황을 같이 읽어야 해요.', ['글을 읽고 헷갈리는 단어의 뜻을 앞뒤 문장 근거로 우리말로 바꿔 보기', '답을 고른 뒤 근거가 된 문장에 밑줄 긋기']),
], [
  { id: 'mw-1', fastSec: 2, area: 'a1', text: '다음 문장에서 run 의 뜻은?\nMy aunt <b>runs</b> a small flower shop.',
    options: ['달리다', '운영하다', '도망가다', '흐르다', '타다'], answer: 2,
    traps: [{ a: 1, note: N_RUN }],
    explain: 'runs + a small flower shop(꽃 가게) → 가게를 운영하다. 사람이 달리는 문장이면 She runs fast. 처럼 뒤에 fast 같은 말이 와요.' },
  { id: 'mw-2', fastSec: 2, area: 'a1', text: '다음 문장에서 kind 의 뜻은?\nWhat <b>kind</b> of music do you like?',
    options: ['친절한', '종류', '가족', '소리', '유행'], answer: 2,
    traps: [{ a: 1, note: N_KIND }],
    explain: 'What kind of + 명사 → 어떤 종류의 ~. kind 앞에 What 이 있고 뒤에 of 가 오면 종류. 친절한(형용사)은 She is kind. 처럼 be 동사 뒤에 와요.' },
  { id: 'mw-3', fastSec: 2, area: 'a1', text: '다음 문장에서 mean 의 뜻은?\nHe is so <b>mean</b> to his little brother. He always takes his toys.',
    options: ['의미하다', '평범한', '못된', '친절한', '재미있는'], answer: 3,
    traps: [{ a: 1, note: N_MEAN }],
    explain: 'is so mean to his little brother + 장난감을 빼앗는다 → 못된. is 뒤에서 사람의 성격을 말하면 형용사. 「의미하다」는 What does it mean? 처럼 동사로 써요.' },
  { id: 'mw-4', area: 'a1', text: '두 문장에서 <b>change</b> 의 뜻을 바르게 짝지은 것은?\n① I need to <b>change</b> my shirt.\n② Here is your <b>change</b>: 2 dollars.',
    options: ['① 잔돈 ② 잔돈', '① 바꾸다 ② 바꾸다', '① 바꾸다 ② 잔돈', '① 잔돈 ② 바꾸다', '① 변화 ② 바꾸다'], answer: 3,
    traps: [{ a: 2, note: N_CHANGE }, { a: 4, note: N_CHANGE }],
    explain: '① need to + change + my shirt → 셔츠를 갈아입다(바꾸다). ② Here is your + change + 2 dollars → 거스름돈. your 뒤에 오면 명사.' },
  { id: 'mw-5', area: 'a2', text: 'matter 가 「중요하다」로 쓰인 문장은?',
    options: ['What\'s the <b>matter</b> with you?', 'Your opinion <b>matters</b> to us.', 'Is something the <b>matter</b>?', 'Nothing is the <b>matter</b> with me.', 'Something is the <b>matter</b> with my bike.'], answer: 2,
    traps: [{ a: 1, note: N_MATTER }],
    explain: 'Your opinion(주어) + matters(동사) + to us → 너의 의견은 우리에게 중요하다. 나머지는 모두 the matter(문제, 탈) 로 쓰였어요.' },
  { id: 'mw-6', area: 'a2', text: '밑줄 친 leave 의 뜻은?\nI will <b>leave</b> a note on your desk.',
    options: ['떠나다', '남겨 두다', '휴가', '잊다', '돌아오다'], answer: 2,
    traps: [{ a: 1, note: N_LEAVE }],
    explain: 'leave + a note(쪽지) + on your desk → 쪽지를 남겨 두다. 뒤에 물건이 오면 남겨 두다, 장소가 오면 떠나다(leave home).' },
  { id: 'mw-7', area: 'a2', text: '두 문장의 빈칸에 <b>똑같이</b> 들어갈 말은?\n① Please ______ the window. It\'s cold.\n② My house is ______ to the school.',
    options: ['open', 'close', 'far', 'near', 'shut'], answer: 2,
    traps: [{ a: 4, note: N_CLOSE }, { a: 5, note: N_CLOSE }],
    explain: '① It\'s cold(춥다) → 창문을 닫다 = close. ② is close to the school → 학교와 가깝다. 닫다(클로즈)와 가까운(클로스)은 철자가 같아요. near 는 ② 에만, shut 은 ① 에만 맞아요.' },
  { id: 'mw-8', area: 'a3', text: '글을 읽고 질문에 답하세요.\n\nOur school festival will <b>last</b> for two days. It starts on Friday and ends on Saturday.\n\nQ. 밑줄 친 last 의 뜻은?',
    options: ['마지막의', '계속되다', '지난', '늦게', '마지막으로'], answer: 2,
    traps: [{ a: 1, note: N_LAST }],
    explain: 'will + last + for two days(이틀 동안) → 계속되다. 금요일에 시작해 토요일에 끝난다는 뒤 문장도 힌트예요. will 뒤에는 동사가 와요.' },
  { id: 'mw-9', area: 'a3', text: '글을 읽고 질문에 답하세요.\n\nMina left her bike in front of the shop. A man said, "You can\'t park here. You must pay a <b>fine</b> of 10 dollars."\n\nQ. 밑줄 친 fine 의 뜻은?',
    options: ['좋은', '벌금', '선물', '가격', '괜찮은'], answer: 2,
    traps: [{ a: 1, note: N_FINE }, { a: 5, note: N_FINE }],
    explain: 'You can\'t park here(여기 세우면 안 돼) + pay a fine of 10 dollars(10 dollars 를 내야 해) → 벌금. a 가 앞에 붙고 pay 의 목적어이니 명사예요.' },
  { id: 'mw-10', area: 'a3', text: '글을 읽고 질문에 답하세요.\n\nMom made twelve sandwiches. I ate four. My sister ate three. Dad will eat the <b>rest</b>.\n\nQ. 아빠가 먹을 샌드위치는 몇 개일까요?',
    options: ['3개', '4개', '5개', '7개', '12개'], answer: 3,
    traps: [{ a: 1, note: N_REST }, { a: 2, note: N_REST }, { a: 4, note: N_REST }, { a: 5, note: N_REST }],
    explain: 'the rest = 나머지. 12 - 4 - 3 = 5개. 4개는 내가, 3개는 동생이 먹은 수, 7개는 둘이 먹은 수, 12개는 전체예요. rest 를 「휴식」으로 읽으면 풀 수 없어요.' },
]);

type V = { text: string; options: string[]; answer: number; traps?: { a: number; note: string }[]; explain: string };
export const ENG_M1_MW_VARIANTS: Record<string, V[]> = {
  'mw-1': [
    { text: '다음 문장에서 run 의 뜻은?\nMr. Park <b>runs</b> a bakery near my school.', options: ['달리다', '도망가다', '운영하다', '흐르다', '타다'], answer: 3,
      traps: [{ a: 1, note: N_RUN }], explain: 'runs + a bakery(빵집) → 빵집을 운영하다.' },
    { text: '다음 문장에서 run 의 뜻은?\nMy parents <b>run</b> a small restaurant.', options: ['운영하다', '달리다', '도망가다', '흐르다', '타다'], answer: 1,
      traps: [{ a: 2, note: N_RUN }], explain: 'run + a small restaurant(작은 식당) → 식당을 운영하다.' },
    { text: '다음 문장에서 run 의 뜻은?\nMs. Lee <b>runs</b> an English class for kids.', options: ['달리다', '흐르다', '도망가다', '운영하다', '타다'], answer: 4,
      traps: [{ a: 1, note: N_RUN }], explain: 'runs + an English class(영어 수업) → 수업·학원을 운영하다.' },
  ],
  'mw-2': [
    { text: '다음 문장에서 kind 의 뜻은?\nWhat <b>kind</b> of food do you want?', options: ['종류', '친절한', '맛있는', '가족', '냄새'], answer: 1,
      traps: [{ a: 2, note: N_KIND }], explain: 'What kind of + food → 어떤 종류의 음식.' },
    { text: '다음 문장에서 kind 의 뜻은?\nWhich <b>kind</b> of pet is good for children?', options: ['친절한', '귀여운', '종류', '크기', '이름'], answer: 3,
      traps: [{ a: 1, note: N_KIND }], explain: 'Which kind of + pet → 어떤 종류의 애완동물. kind 뒤에 of 가 와요.' },
    { text: '다음 문장에서 kind 의 뜻은?\nWhat <b>kind</b> of movie is it?', options: ['친절한', '길이', '시간', '종류', '배우'], answer: 4,
      traps: [{ a: 1, note: N_KIND }], explain: 'What kind of + movie → 어떤 종류의 영화(코미디인지 공포인지).' },
  ],
  'mw-3': [
    { text: '다음 문장에서 mean 의 뜻은?\nDon\'t be <b>mean</b> to the new student.', options: ['의미하다', '친절한', '평범한', '못된', '재미있는'], answer: 4,
      traps: [{ a: 1, note: N_MEAN }], explain: 'Don\'t be + mean + to the new student → 못되게 굴지 마. be 동사 뒤라 형용사.' },
    { text: '다음 문장에서 mean 의 뜻은?\nThe <b>mean</b> boy laughed at my shoes.', options: ['못된', '의미하다', '평범한', '키 큰', '친절한'], answer: 1,
      traps: [{ a: 2, note: N_MEAN }], explain: 'The + mean + boy → 못된 소년(명사 앞에서 꾸미는 말). 신발을 비웃었다는 것도 힌트.' },
    { text: '다음 문장에서 mean 의 뜻은?\nWhy are you so <b>mean</b> to me? You said bad things about me.', options: ['의미하다', '친절한', '못된', '재미있는', '평범한'], answer: 3,
      traps: [{ a: 1, note: N_MEAN }], explain: 'are you so mean to me + 내 험담을 했다 → 못된. 친절한은 반대 뜻이에요.' },
  ],
  'mw-4': [
    { text: '두 문장에서 <b>change</b> 의 뜻을 바르게 짝지은 것은?\n① You can <b>change</b> your seat.\n② Keep the <b>change</b>.',
      options: ['① 잔돈 ② 바꾸다', '① 바꾸다 ② 바꾸다', '① 잔돈 ② 잔돈', '① 바꾸다 ② 잔돈', '① 변화 ② 바꾸다'], answer: 4,
      traps: [{ a: 2, note: N_CHANGE }, { a: 1, note: N_CHANGE }], explain: '① can + change + your seat → 자리를 바꾸다. ② Keep the change → 거스름돈은 가지세요(the 뒤라 명사).' },
    { text: '두 문장에서 <b>change</b> 의 뜻을 바르게 짝지은 것은?\n① The machine has no <b>change</b>.\n② I will <b>change</b> my clothes.',
      options: ['① 바꾸다 ② 잔돈', '① 잔돈 ② 바꾸다', '① 잔돈 ② 잔돈', '① 바꾸다 ② 바꾸다', '① 변화 ② 잔돈'], answer: 2,
      traps: [{ a: 4, note: N_CHANGE }, { a: 1, note: N_CHANGE }], explain: '① has no + change → 잔돈이 없다(명사). ② will + change + my clothes → 옷을 갈아입다(동사).' },
    { text: '두 문장에서 <b>change</b> 의 뜻을 바르게 짝지은 것은?\n① Your <b>change</b> is 5 dollars.\n② Let\'s <b>change</b> buses at the next stop.',
      options: ['① 바꾸다 ② 바꾸다', '① 잔돈 ② 잔돈', '① 바꾸다 ② 잔돈', '① 잔돈 ② 바꾸다', '① 변화 ② 잔돈'], answer: 4,
      traps: [{ a: 1, note: N_CHANGE }, { a: 3, note: N_CHANGE }], explain: '① Your + change + is 5 dollars → 거스름돈(명사). ② change buses → 버스를 바꿔 타다 = 갈아타다(동사). 「갈아타다」도 결국 바꾸다의 뜻이에요.' },
  ],
  'mw-5': [
    { text: 'matter 가 「중요하다」로 쓰인 문장은?',
      options: ['What is the <b>matter</b>, Tom?', 'Something is the <b>matter</b> with my watch.', 'Friends <b>matter</b> more than money.', 'Nothing is the <b>matter</b>. I am fine.', 'Is anything the <b>matter</b> with your bike?'], answer: 3,
      traps: [{ a: 1, note: N_MATTER }], explain: 'Friends(주어) + matter(동사) + more than money → 친구가 돈보다 중요하다. 나머지는 the matter(문제, 탈).' },
    { text: 'matter 가 「중요하다」로 쓰인 문장은?',
      options: ['What\'s the <b>matter</b> with the TV?', 'Every vote <b>matters</b>.', 'Is something the <b>matter</b>?', 'Nothing is the <b>matter</b> with me.', 'Something is the <b>matter</b> with my phone.'], answer: 2,
      traps: [{ a: 1, note: N_MATTER }], explain: 'Every vote(주어) + matters(동사) → 모든 표가 중요하다. 나머지는 모두 the matter(문제).' },
    { text: 'matter 가 「중요하다」로 쓰인 문장은?',
      options: ['Something is the <b>matter</b> with my leg.', 'What is the <b>matter</b> with the door?', 'Your health <b>matters</b> to your family.', 'Is anything the <b>matter</b>?', 'Nothing is the <b>matter</b> with the car.'], answer: 3,
      traps: [{ a: 4, note: N_MATTER }], explain: 'Your health(주어) + matters(동사) + to your family → 건강은 가족에게 중요하다. the matter 가 보이면 「문제」예요.' },
  ],
  'mw-6': [
    { text: '밑줄 친 leave 의 뜻은?\nPlease <b>leave</b> some cake for your sister.', options: ['남겨 두다', '떠나다', '휴가', '잊다', '돌아오다'], answer: 1,
      traps: [{ a: 2, note: N_LEAVE }], explain: 'leave + some cake + for your sister → 케이크를 남겨 두다.' },
    { text: '밑줄 친 leave 의 뜻은?\nDon\'t <b>leave</b> your umbrella on the bus.', options: ['떠나다', '휴가', '잊다', '남겨 두다', '돌아오다'], answer: 4,
      traps: [{ a: 1, note: N_LEAVE }], explain: 'leave + your umbrella(물건) + on the bus → 우산을 두고 내리다(남겨 두다).' },
    { text: '밑줄 친 leave 의 뜻은?\nLet\'s <b>leave</b> a message for Dad.', options: ['떠나다', '돌아오다', '남겨 두다', '휴가', '잊다'], answer: 3,
      traps: [{ a: 1, note: N_LEAVE }], explain: 'leave + a message(메시지) + for Dad → 메시지를 남겨 두다.' },
  ],
  'mw-7': [
    { text: '두 문장의 빈칸에 <b>똑같이</b> 들어갈 말은?\n① Can you ______ the door? It\'s windy.\n② The bank is ______ to my house.',
      options: ['open', 'far', 'close', 'shut', 'near'], answer: 3,
      traps: [{ a: 5, note: N_CLOSE }, { a: 4, note: N_CLOSE }], explain: '① It\'s windy(바람 분다) → 문을 닫다 = close. ② is close to my house → 집에서 가깝다. near 는 ② 에만, shut 은 ① 에만 맞아요.' },
    { text: '두 문장의 빈칸에 <b>똑같이</b> 들어갈 말은?\n① ______ your eyes and count to ten.\n② We are ______ friends.',
      options: ['open', 'near', 'far', 'close', 'long'], answer: 4,
      traps: [{ a: 2, note: N_CLOSE }], explain: '① 은 open(눈을 떠)도 되지만, ② We are ______ friends 에 들어갈 수 있는 건 close 뿐이에요(close friends = 친한 친구). close = 닫다 · 가까운(친한).' },
    { text: '두 문장의 빈칸에 <b>똑같이</b> 들어갈 말은?\n① Don\'t forget to ______ the box.\n② The park is very ______ to my school.',
      options: ['close', 'open', 'far', 'wide', 'tall'], answer: 1,
      traps: [{ a: 2, note: N_CLOSE }], explain: '① 은 open(상자를 열어)도 되지만, ② is very ______ to my school 에 맞는 건 close 뿐이에요(학교와 아주 가깝다). 두 문장에 다 들어가는 말을 찾아야 해요.' },
  ],
  'mw-8': [
    { text: '글을 읽고 질문에 답하세요.\n\nThe rain <b>lasted</b> all day. We could not go out.\n\nQ. 밑줄 친 lasted(last 의 과거형)의 뜻은?', options: ['마지막의', '계속되었다', '지난', '늦게', '마지막으로'], answer: 2,
      traps: [{ a: 1, note: N_LAST }], explain: 'The rain + lasted + all day(하루 종일) → 계속되었다. 비가 하루 종일 와서 못 나갔다는 뒤 문장도 힌트.' },
    { text: '글을 읽고 질문에 답하세요.\n\nThe summer vacation <b>lasts</b> about a month. It starts in July and ends in August.\n\nQ. 밑줄 친 lasts(last 의 -s 형)의 뜻은?', options: ['마지막의', '지난', '늦게', '계속되다', '마지막으로'], answer: 4,
      traps: [{ a: 1, note: N_LAST }], explain: 'lasts + about a month(약 한 달) → 계속되다. 7월에 시작해 8월에 끝난다는 문장이 근거.' },
    { text: '글을 읽고 질문에 답하세요.\n\nThe concert will <b>last</b> two hours. It begins at 3 and ends at 5.\n\nQ. 밑줄 친 last 의 뜻은?', options: ['지난', '마지막의', '계속되다', '늦게', '마지막으로'], answer: 3,
      traps: [{ a: 2, note: N_LAST }], explain: 'will + last + two hours(두 시간) → 계속되다. 3시에 시작해 5시에 끝난다는 뜻과 맞아요.' },
  ],
  'mw-9': [
    { text: '글을 읽고 질문에 답하세요.\n\nTom kept a library book for two months. He had to pay a <b>fine</b> of 2 dollars.\n\nQ. 밑줄 친 fine 의 뜻은?', options: ['좋은', '선물', '가격', '벌금', '괜찮은'], answer: 4,
      traps: [{ a: 1, note: N_FINE }], explain: '도서관 책을 두 달이나 가지고 있었고 + pay a fine of 2 dollars → 벌금. a 가 앞에 붙은 명사예요.' },
    { text: '글을 읽고 질문에 답하세요.\n\nDad drove too fast. The police gave him a <b>fine</b>.\n\nQ. 밑줄 친 fine 의 뜻은?', options: ['벌금', '좋은', '선물', '가격', '괜찮은'], answer: 1,
      traps: [{ a: 2, note: N_FINE }, { a: 5, note: N_FINE }], explain: 'drove too fast(너무 빨리 운전) + the police gave him a fine → 벌금. 경찰이 「좋은」을 줄 리 없어요.' },
    { text: '글을 읽고 질문에 답하세요.\n\nA sign says, "Do not throw trash here. You will pay a <b>fine</b> of 20 dollars."\n\nQ. 밑줄 친 fine 의 뜻은?', options: ['좋은', '괜찮은', '벌금', '선물', '가격'], answer: 3,
      traps: [{ a: 1, note: N_FINE }, { a: 2, note: N_FINE }], explain: 'Do not throw trash(쓰레기 버리지 마) + pay a fine → 벌금.' },
  ],
  'mw-10': [
    { text: '글을 읽고 질문에 답하세요.\n\nMom bought twelve apples. Jisu ate five. Minho ate four. Dad will eat the <b>rest</b>.\n\nQ. 아빠가 먹을 사과는 몇 개일까요?', options: ['1개', '3개', '7개', '9개', '12개'], answer: 2,
      traps: [{ a: 4, note: N_REST }, { a: 5, note: N_REST }], explain: 'the rest = 나머지. 12 - 5 - 4 = 3개. 9개는 둘이 먹은 수, 12개는 전체.' },
    { text: '글을 읽고 질문에 답하세요.\n\nThe book has 30 pages. I read 10 pages today. I will read the <b>rest</b> tomorrow.\n\nQ. 내일 읽을 쪽수는?', options: ['5쪽', '10쪽', '20쪽', '30쪽', '40쪽'], answer: 3,
      traps: [{ a: 2, note: N_REST }, { a: 4, note: N_REST }], explain: 'the rest = 나머지. 30 - 10 = 20쪽. 10쪽은 오늘 읽은 쪽수, 30쪽은 전체.' },
    { text: '글을 읽고 질문에 답하세요.\n\nThere were 20 students in my class. Eight went to the library and five went to the gym. The <b>rest</b> stayed in the classroom.\n\nQ. 교실에 남은 학생은 몇 명일까요?', options: ['5명', '7명', '8명', '13명', '20명'], answer: 2,
      traps: [{ a: 1, note: N_REST }, { a: 3, note: N_REST }, { a: 4, note: N_REST }, { a: 5, note: N_REST }], explain: 'the rest = 나머지. 20 - 8 - 5 = 7명. 13명은 나간 학생 수, 20명은 전체.' },
  ],
};
