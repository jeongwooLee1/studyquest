// 중1 영어 문법 문제지 — 출판사와 상관없는 2022 개정 중1 성취기준 문법. 전부 5지선다, practice:true(제출 후 정답·풀이 공개).
//   eng-m1-past  과거시제 확인(10): 규칙 과거형 철자 · 불규칙 과거형 · was/were · did 부정·의문
// 다시 풀기용 변형 문항은 ENG_VARIANTS[원래 문항 id] 에 3개씩(문항 객체 밖에 두어 정답이 페이지로 나가지 않게, sci_gas.ts 와 같은 방식).
// 변형 문항 형식: { text, options, answer, traps?, explain } — 원래 문항과 같은 개념·같은 함정 문구, 보기 5개.
// 표기: 줄바꿈 \n, 강조 <b>…</b>. '$'는 쓰지 않는다. 문항 id 는 'ep-' 로 시작.

const G = '문법';
const set = (id: string, title: string, subtitle: string, minutes: number, practice: boolean, areas: any[], questions: any[]) => ({
  id, title, subtitle, minutes, practice, pace: { [G]: 45 }, areas, questions: questions.map((q) => ({ type: 'choice', ...q })),
});

// 오답 습관(원래 문항과 변형 문항이 같은 문구를 쓴다)
const N_Y = '자음+y로 끝나면 y를 i로 고치고 -ed (study → studied)';
const N_DBL = '「짧은 모음+자음 하나」로 끝나면 자음을 한 번 더 쓰고 -ed (stop → stopped)';
const N_VY = '모음+y로 끝나면 그대로 -ed (play → played)';
const N_PRES = '지난 일(yesterday, last ~, ago)인데 현재형을 씀';
const N_IRR = '불규칙 동사에 -ed를 붙임';
const N_PP = '과거분사(written, eaten, gone)를 과거형 자리에 씀';
const N_WAS = 'was/were를 주어에 맞추지 않음 (I·단수 → was, you·복수 → were)';
const N_BEDID = 'be동사 자리에 did를 씀';
const N_NOTPOS = 'be동사 부정문은 be동사 뒤에 not (was not / wasn\'t)';
const N_DIDBE = 'be동사 문장인데 did를 씀 (be동사는 혼자 부정·의문을 만듦)';
const N_DIDV = 'didn\'t / Did 뒤에 과거형을 씀 (didn\'t + 동사원형)';
const N_BEV = 'be동사(wasn\'t)와 일반동사를 함께 씀';
const N_BEQ = '일반동사 문장의 의문문에 be동사를 씀 (Did + 주어 + 동사원형)';
const N_ANS = 'Did로 물었는데 be동사로 대답함 (Yes, ~ did. / No, ~ didn\'t.)';
const N_ANSP = 'Did(과거)로 물었는데 현재형(do/does)으로 대답함';

const A_REG = { id: 'p1', group: G, name: '규칙 과거형 (-ed 철자)', unit: '중1 「과거시제」 규칙 동사',
  why: '서술형에서 철자 하나로 감점되는 곳이에요. -ied, 자음 두 번 쓰기 규칙만 알면 돼요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「과거시제」 강의', 'study-studied, stop-stopped, play-played 세 가지 규칙을 예시 동사 5개씩 써 보기'] };
const A_IRR = { id: 'p2', group: G, name: '불규칙 과거형', unit: '중1 「과거시제」 불규칙 동사',
  why: '교과서 본문·독해 지문이 대부분 과거 이야기라서, 불규칙 과거형을 모르면 지문이 안 읽혀요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「과거시제」 강의', '불규칙 동사표(go-went, buy-bought, write-wrote…) 하루 10개씩 소리 내어 3번'] };
const A_BE = { id: 'p3', group: G, name: 'be동사 과거 (was / were)', unit: '중1 「be동사의 과거」',
  why: 'was/were는 주어에 맞춰야 하고, 부정·의문을 did 없이 만들어요. 일반동사와 섞이면 틀려요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「be동사의 과거」 강의', 'I·He·She·It·단수 → was, You·We·They·복수 → were 표 만들기'] };
const A_DID = { id: 'p4', group: G, name: '일반동사 과거 부정·의문 (did)', unit: '중1 「일반동사 과거의 부정문·의문문」',
  why: 'didn\'t 뒤에 과거형을 쓰는 실수가 내신 어법 문제 단골이에요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「과거시제의 부정문·의문문」 강의', 'didn\'t / Did 가 과거를 맡으면 뒤 동사는 원형: I didn\'t go. Did you go?'] };

export const ENG_M1_PAST = set('eng-m1-past', '과거시제 확인', '중1 영어 문법 · 일반동사·be동사의 과거', 12, true,
  [A_REG, A_IRR, A_BE, A_DID], [
  // ── 규칙 과거형 ──
  { id: 'ep-1', area: 'p1', text: '다음 중 동사의 과거형이 바르게 짝지어진 것은?',
    options: ['study – studyed', 'stop – stoped', 'play – plaied', 'cry – cried', 'plan – planed'], answer: 4,
    traps: [{ a: 1, note: N_Y }, { a: 2, note: N_DBL }, { a: 3, note: N_VY }, { a: 5, note: N_DBL }],
    explain: 'cry → cried(자음+y → ied). ① studied ② stopped ③ played ⑤ planned 가 맞아요.' },
  { id: 'ep-2', area: 'p1', text: '빈칸에 들어갈 말로 알맞은 것은?\nWe ______ soccer after school yesterday.',
    options: ['play', 'plays', 'played', 'playing', 'plaied'], answer: 3,
    traps: [{ a: 1, note: N_PRES }, { a: 2, note: N_PRES }, { a: 5, note: N_VY }],
    explain: 'yesterday(어제) → 과거형. play는 모음+y라서 그대로 -ed → played.' },

  // ── 불규칙 과거형 ──
  { id: 'ep-3', area: 'p2', text: '다음 중 동사의 과거형이 <b>잘못</b> 짝지어진 것은?',
    options: ['go – went', 'eat – ate', 'buy – bought', 'see – seed', 'make – made'], answer: 4,
    explain: 'see의 과거형은 saw예요. 나머지는 모두 맞아요.' },
  { id: 'ep-4', area: 'p2', text: '빈칸에 들어갈 말로 알맞은 것은?\nI ______ a new bike last week.',
    options: ['buy', 'buyed', 'brought', 'buys', 'bought'], answer: 5,
    traps: [{ a: 2, note: N_IRR }, { a: 3, note: 'bought(샀다)와 brought(가져왔다)를 헷갈림' }, { a: 1, note: N_PRES }, { a: 4, note: N_PRES }],
    explain: 'last week → 과거. buy의 과거형은 bought. brought는 bring(가져오다)의 과거형이에요.' },
  { id: 'ep-5', area: 'p2', text: '다음 글의 동사 중 형태가 <b>잘못된</b> 것은?\n\nLast weekend, I ①visited my uncle. We ②went fishing and ③catched three fish. Then we ④made dinner together and ⑤had a great time.',
    options: ['①', '②', '③', '④', '⑤'], answer: 3,
    explain: 'catch의 과거형은 caught예요. visited, went, made, had는 맞아요.' },

  // ── was / were ──
  { id: 'ep-6', area: 'p3', text: '빈칸에 들어갈 말로 알맞은 것은?\nMy parents ______ at home last night.',
    options: ['was', 'were', 'are', 'is', 'did'], answer: 2,
    traps: [{ a: 1, note: N_WAS }, { a: 3, note: N_PRES }, { a: 4, note: N_PRES }, { a: 5, note: N_BEDID }],
    explain: 'My parents(복수) + 과거(last night) → were.' },
  { id: 'ep-7', area: 'p3', text: '다음 문장을 부정문으로 바르게 바꾼 것은?\nShe was busy yesterday.',
    options: ['She not was busy yesterday.', 'She didn\'t was busy yesterday.', 'She didn\'t busy yesterday.', 'She wasn\'t busy yesterday.', 'She weren\'t busy yesterday.'], answer: 4,
    traps: [{ a: 1, note: N_NOTPOS }, { a: 2, note: N_DIDBE }, { a: 3, note: N_DIDBE }, { a: 5, note: N_WAS }],
    explain: 'be동사 부정문은 be동사 뒤에 not → was not = wasn\'t.' },

  // ── did 부정·의문 ──
  { id: 'ep-8', area: 'p4', text: '빈칸에 들어갈 말로 알맞은 것은?\nI ______ breakfast this morning, so I\'m hungry now.',
    options: ['didn\'t eat', 'didn\'t ate', 'don\'t eat', 'wasn\'t eat', 'not ate'], answer: 1,
    traps: [{ a: 2, note: N_DIDV }, { a: 3, note: N_PRES }, { a: 4, note: N_BEV }],
    explain: '오늘 아침(지난 일)에 안 먹었다 → didn\'t + 동사원형 → didn\'t eat.' },
  { id: 'ep-9', area: 'p4', text: '대화의 빈칸에 들어갈 말로 알맞은 것은?\nA: ______ you go to the concert last night?\nB: Yes, I did. It was great!',
    options: ['Do', 'Did', 'Were', 'Was', 'Are'], answer: 2,
    traps: [{ a: 1, note: N_PRES }, { a: 3, note: N_BEQ }, { a: 4, note: N_BEQ }, { a: 5, note: N_BEQ }],
    explain: 'go는 일반동사, last night는 과거 → Did you go …? 대답도 Yes, I did.' },
  { id: 'ep-10', area: 'p4', text: '질문에 대한 대답으로 알맞은 것은?\nDid you see Jisu at the park?',
    options: ['Yes, I was.', 'No, I wasn\'t.', 'Yes, I do.', 'No, I don\'t.', 'Yes, I did.'], answer: 5,
    traps: [{ a: 1, note: N_ANS }, { a: 2, note: N_ANS }, { a: 3, note: N_ANSP }, { a: 4, note: N_ANSP }],
    explain: 'Did로 물으면 Yes, I did. / No, I didn\'t. 로 대답해요.' },
]);

export const ENG_GRAM_SETS = [ENG_M1_PAST];

type V = { text: string; options: string[]; answer: number; traps?: { a: number; note: string }[]; explain: string };
export const ENG_VARIANTS: Record<string, V[]> = {
  'ep-1': [
    { text: '다음 중 동사의 과거형이 바르게 짝지어진 것은?', options: ['try – tryed', 'drop – droped', 'enjoy – enjoied', 'carry – carried', 'shop – shoped'], answer: 4,
      traps: [{ a: 1, note: N_Y }, { a: 2, note: N_DBL }, { a: 3, note: N_VY }, { a: 5, note: N_DBL }],
      explain: 'carry → carried. ① tried ② dropped ③ enjoyed ⑤ shopped 가 맞아요.' },
    { text: '다음 중 동사의 과거형이 바르게 짝지어진 것은?', options: ['hurry – hurryed', 'plan – planned', 'stay – staied', 'hop – hoped', 'worry – worryed'], answer: 2,
      traps: [{ a: 1, note: N_Y }, { a: 3, note: N_VY }, { a: 4, note: N_DBL }, { a: 5, note: N_Y }],
      explain: 'plan → planned(자음 n을 한 번 더). ① hurried ③ stayed ④ hopped ⑤ worried 가 맞아요. (hoped는 hope의 과거형)' },
    { text: '다음 중 동사의 과거형이 바르게 짝지어진 것은?', options: ['clap – claped', 'study – studied', 'obey – obeied', 'fry – fryed', 'stop – stoped'], answer: 2,
      traps: [{ a: 1, note: N_DBL }, { a: 3, note: N_VY }, { a: 4, note: N_Y }, { a: 5, note: N_DBL }],
      explain: 'study → studied. ① clapped ③ obeyed ④ fried ⑤ stopped 가 맞아요.' },
  ],
  'ep-2': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nI ______ my room last Sunday.', options: ['clean', 'cleans', 'cleaned', 'cleaning', 'cleanned'], answer: 3,
      traps: [{ a: 1, note: N_PRES }, { a: 2, note: N_PRES }],
      explain: 'last Sunday → 과거. clean → cleaned (n 앞이 모음 두 개라서 자음을 두 번 쓰지 않아요).' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nShe ______ to music two hours ago.', options: ['listen', 'listens', 'listening', 'listened', 'listenned'], answer: 4,
      traps: [{ a: 1, note: N_PRES }, { a: 2, note: N_PRES }],
      explain: 'two hours ago → 과거. listen → listened.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nThey ______ in Jeju for a week last summer.', options: ['stay', 'stays', 'staied', 'stayed', 'staying'], answer: 4,
      traps: [{ a: 1, note: N_PRES }, { a: 2, note: N_PRES }, { a: 3, note: N_VY }],
      explain: 'last summer → 과거. stay는 모음+y라서 그대로 -ed → stayed.' },
  ],
  'ep-3': [
    { text: '다음 중 동사의 과거형이 <b>잘못</b> 짝지어진 것은?', options: ['come – came', 'take – took', 'meet – met', 'write – writed', 'give – gave'], answer: 4,
      explain: 'write의 과거형은 wrote예요.' },
    { text: '다음 중 동사의 과거형이 <b>잘못</b> 짝지어진 것은?', options: ['run – ran', 'think – thinked', 'have – had', 'get – got', 'sit – sat'], answer: 2,
      explain: 'think의 과거형은 thought예요.' },
    { text: '다음 중 동사의 과거형이 <b>잘못</b> 짝지어진 것은?', options: ['know – knew', 'swim – swam', 'teach – teached', 'read – read', 'leave – left'], answer: 3,
      explain: 'teach의 과거형은 taught예요. read의 과거형은 철자가 같은 read(발음은 [레드]).' },
  ],
  'ep-4': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nHe ______ a letter to his grandma yesterday.', options: ['write', 'writed', 'wrote', 'written', 'writes'], answer: 3,
      traps: [{ a: 2, note: N_IRR }, { a: 4, note: N_PP }, { a: 1, note: N_PRES }, { a: 5, note: N_PRES }],
      explain: 'yesterday → 과거. write의 과거형은 wrote (written은 과거분사).' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nWe ______ pizza for lunch yesterday.', options: ['ate', 'eat', 'eated', 'eaten', 'eats'], answer: 1,
      traps: [{ a: 3, note: N_IRR }, { a: 4, note: N_PP }, { a: 2, note: N_PRES }, { a: 5, note: N_PRES }],
      explain: 'yesterday → 과거. eat의 과거형은 ate (eaten은 과거분사).' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nMina ______ to the library last Saturday.', options: ['go', 'goed', 'gone', 'goes', 'went'], answer: 5,
      traps: [{ a: 2, note: N_IRR }, { a: 3, note: N_PP }, { a: 1, note: N_PRES }, { a: 4, note: N_PRES }],
      explain: 'last Saturday → 과거. go의 과거형은 went (gone은 과거분사).' },
  ],
  'ep-5': [
    { text: '다음 글의 동사 중 형태가 <b>잘못된</b> 것은?\n\nYesterday, I ①got up late. I ②runned to school. I ③said sorry to my teacher. After school, I ④did my homework and ⑤slept early.',
      options: ['①', '②', '③', '④', '⑤'], answer: 2, explain: 'run의 과거형은 ran이에요. got, said, did, slept는 맞아요.' },
    { text: '다음 글의 동사 중 형태가 <b>잘못된</b> 것은?\n\nLast Sunday, my family ①went to the zoo. We ②saw many animals. My sister ③taked pictures of the monkeys. We ④ate ice cream and ⑤came home at six.',
      options: ['①', '②', '③', '④', '⑤'], answer: 3, explain: 'take의 과거형은 took이에요. went, saw, ate, came은 맞아요.' },
    { text: '다음 글의 동사 중 형태가 <b>잘못된</b> 것은?\n\nLast night, I ①read a book. My brother ②watched TV. Mom ③made cookies for us. Dad ④comed home late and ⑤gave us a hug.',
      options: ['①', '②', '③', '④', '⑤'], answer: 4, explain: 'come의 과거형은 came이에요. read, watched, made, gave는 맞아요.' },
  ],
  'ep-6': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nTom and I ______ very tired yesterday.', options: ['was', 'is', 'were', 'are', 'did'], answer: 3,
      traps: [{ a: 1, note: N_WAS }, { a: 2, note: N_PRES }, { a: 4, note: N_PRES }, { a: 5, note: N_BEDID }],
      explain: 'Tom and I(두 사람 = 복수) + 과거(yesterday) → were.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nThe movie ______ really fun last night.', options: ['were', 'was', 'is', 'are', 'did'], answer: 2,
      traps: [{ a: 1, note: N_WAS }, { a: 3, note: N_PRES }, { a: 4, note: N_PRES }, { a: 5, note: N_BEDID }],
      explain: 'The movie(단수) + 과거(last night) → was.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nYou ______ late for school yesterday morning.', options: ['was', 'are', 'did', 'were', 'is'], answer: 4,
      traps: [{ a: 1, note: N_WAS }, { a: 2, note: N_PRES }, { a: 3, note: N_BEDID }, { a: 5, note: N_PRES }],
      explain: 'You는 한 명이어도 were. 과거(yesterday morning) → You were late.' },
  ],
  'ep-7': [
    { text: '다음 문장을 부정문으로 바르게 바꾼 것은?\nThey were in the classroom.', options: ['They not were in the classroom.', 'They didn\'t were in the classroom.', 'They weren\'t in the classroom.', 'They wasn\'t in the classroom.', 'They didn\'t in the classroom.'], answer: 3,
      traps: [{ a: 1, note: N_NOTPOS }, { a: 2, note: N_DIDBE }, { a: 4, note: N_WAS }, { a: 5, note: N_DIDBE }],
      explain: 'be동사 부정문은 be동사 뒤에 not → were not = weren\'t.' },
    { text: '다음 문장을 의문문으로 바르게 바꾼 것은?\nHe was angry.', options: ['Did he was angry?', 'Was he angry?', 'Did he angry?', 'Were he angry?', 'He did was angry?'], answer: 2,
      traps: [{ a: 1, note: N_DIDBE }, { a: 3, note: N_DIDBE }, { a: 4, note: N_WAS }, { a: 5, note: N_DIDBE }],
      explain: 'be동사 의문문은 be동사를 주어 앞으로 → Was he angry?' },
    { text: '다음 문장을 부정문으로 바르게 바꾼 것은?\nI was hungry.', options: ['I wasn\'t hungry.', 'I weren\'t hungry.', 'I didn\'t was hungry.', 'I not was hungry.', 'I didn\'t hungry.'], answer: 1,
      traps: [{ a: 2, note: N_WAS }, { a: 3, note: N_DIDBE }, { a: 4, note: N_NOTPOS }, { a: 5, note: N_DIDBE }],
      explain: 'I was → I was not = I wasn\'t.' },
  ],
  'ep-8': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nHe ______ his homework yesterday.', options: ['doesn\'t do', 'didn\'t did', 'didn\'t do', 'wasn\'t do', 'not did'], answer: 3,
      traps: [{ a: 2, note: N_DIDV }, { a: 1, note: N_PRES }, { a: 4, note: N_BEV }],
      explain: 'yesterday → 과거 부정 didn\'t + 동사원형 → didn\'t do.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nWe ______ TV last night.', options: ['didn\'t watched', 'wasn\'t watch', 'don\'t watch', 'not watched', 'didn\'t watch'], answer: 5,
      traps: [{ a: 1, note: N_DIDV }, { a: 2, note: N_BEV }, { a: 3, note: N_PRES }],
      explain: 'last night → 과거 부정 didn\'t + 동사원형 → didn\'t watch.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nShe ______ to the party last Friday.', options: ['didn\'t came', 'didn\'t come', 'doesn\'t come', 'wasn\'t come', 'not came'], answer: 2,
      traps: [{ a: 1, note: N_DIDV }, { a: 3, note: N_PRES }, { a: 4, note: N_BEV }],
      explain: 'last Friday → 과거 부정 didn\'t + 동사원형 → didn\'t come.' },
  ],
  'ep-9': [
    { text: '대화의 빈칸에 들어갈 말로 알맞은 것은?\nA: ______ Minho finish his project yesterday?\nB: No, he didn\'t.', options: ['Was', 'Does', 'Did', 'Is', 'Were'], answer: 3,
      traps: [{ a: 1, note: N_BEQ }, { a: 2, note: N_PRES }, { a: 4, note: N_BEQ }, { a: 5, note: N_BEQ }],
      explain: 'finish는 일반동사, yesterday는 과거 → Did Minho finish …?' },
    { text: '대화의 빈칸에 들어갈 말로 알맞은 것은?\nA: ______ they visit the museum last week?\nB: Yes, they did.', options: ['Were', 'Do', 'Are', 'Was', 'Did'], answer: 5,
      traps: [{ a: 1, note: N_BEQ }, { a: 2, note: N_PRES }, { a: 3, note: N_BEQ }, { a: 4, note: N_BEQ }],
      explain: 'visit는 일반동사, last week는 과거 → Did they visit …?' },
    { text: '대화의 빈칸에 들어갈 말로 알맞은 것은?\nA: ______ your sister call you this morning?\nB: Yes, she did.', options: ['Did', 'Was', 'Does', 'Is', 'Were'], answer: 1,
      traps: [{ a: 2, note: N_BEQ }, { a: 3, note: N_PRES }, { a: 4, note: N_BEQ }, { a: 5, note: N_BEQ }],
      explain: 'call은 일반동사, 대답이 she did(과거) → Did your sister call …?' },
  ],
  'ep-10': [
    { text: '질문에 대한 대답으로 알맞은 것은?\nDid your brother clean his room?', options: ['Yes, he was.', 'No, he doesn\'t.', 'No, he didn\'t.', 'Yes, he does.', 'No, he wasn\'t.'], answer: 3,
      traps: [{ a: 1, note: N_ANS }, { a: 2, note: N_ANSP }, { a: 4, note: N_ANSP }, { a: 5, note: N_ANS }],
      explain: 'Did로 물으면 did / didn\'t 로 대답 → No, he didn\'t.' },
    { text: '질문에 대한 대답으로 알맞은 것은?\nDid they win the game?', options: ['Yes, they were.', 'Yes, they do.', 'No, they weren\'t.', 'No, they don\'t.', 'Yes, they did.'], answer: 5,
      traps: [{ a: 1, note: N_ANS }, { a: 2, note: N_ANSP }, { a: 3, note: N_ANS }, { a: 4, note: N_ANSP }],
      explain: 'Did로 물으면 did / didn\'t 로 대답 → Yes, they did.' },
    { text: '질문에 대한 대답으로 알맞은 것은?\nDid Mina like the movie?', options: ['No, she didn\'t.', 'No, she wasn\'t.', 'Yes, she does.', 'Yes, she was.', 'No, she doesn\'t.'], answer: 1,
      traps: [{ a: 2, note: N_ANS }, { a: 3, note: N_ANSP }, { a: 4, note: N_ANS }, { a: 5, note: N_ANSP }],
      explain: 'Did로 물으면 did / didn\'t 로 대답 → No, she didn\'t.' },
  ],
};
