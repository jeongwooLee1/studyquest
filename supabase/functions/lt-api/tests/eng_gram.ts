// 중1 영어 문법 문제지 — 출판사와 상관없는 2022 개정 중1 성취기준 문법. 전부 5지선다, practice:true(제출 후 정답·풀이 공개).
//   eng-m1-past  과거시제 확인(10): 규칙 과거형 철자 · 불규칙 과거형 · was/were · did 부정·의문
//   eng-m1-modal 조동사·미래 확인(10): can·may · will·be going to · must·have to·should · 조동사 문장 형태
//   eng-m1-inf   to부정사·동명사 확인(10): want to · enjoy -ing·전치사 뒤 · 둘 다/주어 자리 · ~하기 위해·~할
//   eng-m1-comp  비교급·최상급 확인(10): 비교급 만들기 · 불규칙 · 최상급 · as ~ as·비교 문장 이해
// 다시 풀기용 변형 문항은 ENG_VARIANTS[원래 문항 id] 에 3개씩(문항 객체 밖에 두어 정답이 페이지로 나가지 않게, sci_gas.ts 와 같은 방식).
// 변형 문항 형식: { text, options, answer, traps?, explain } — 원래 문항과 같은 개념·같은 함정 문구, 보기 5개.
// 표기: 줄바꿈 \n, 강조 <b>…</b>. '$'는 쓰지 않는다. 문항 id 는 세트마다 접두어(과거 'ep-', 조동사 'em-', to부정사 'ei-', 비교 'ec-').

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

// ── 조동사 ──
const N_BASE = '조동사 뒤에 동사원형을 쓰지 않음 (can swim / will go)';
const N_CANS = '조동사에 -s를 붙임 (can·will·must·should는 주어가 바뀌어도 모양이 그대로)';
const N_DOM = '조동사가 있는데 do/does를 함께 씀';
const N_MNEG = '조동사 부정은 조동사 바로 뒤에 not (can\'t, won\'t, shouldn\'t)';
const N_CANMEAN = 'can의 능력(~할 수 있다)·허락(~해도 된다) 뜻을 문맥으로 구분하지 못함';
const N_BEGO = 'be going to의 be동사를 주어에 맞추지 않음 (I am / He is / We are)';
const N_WILLGO = 'will과 be going to를 섞어 씀 (will going to ×)';
const N_TIME = '미래를 나타내는 말(tomorrow, next ~)과 과거 시제를 함께 씀';
const N_MEAN = '조동사의 뜻(해야 한다·하면 안 된다·하는 게 좋겠다)을 문맥에 맞추지 못함';
const N_HAVE = 'have to / has to를 주어에 맞추지 않음 (He·She·단수 → has to)';
const N_BEHAVE = 'be동사와 have to를 함께 씀';
const N_MUSTNT = 'must not(~하면 안 된다)과 don\'t have to(~할 필요 없다)를 헷갈림';
const N_PERM = '허락을 구할 때는 Can / May I ~? (Must는 의무)';

const A_CAN = { id: 'm1', group: G, name: 'can·may (능력·허락)', unit: '중1 「조동사 can·may」',
  why: '대화문에서 「~해도 될까요?」(허락)와 「~할 수 있다」(능력)를 구분하는 문제가 자주 나와요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「조동사 can·may」 강의', 'Can I ~? / May I ~? = ~해도 될까요?, I can ~ = 나는 ~할 수 있다 예문 3개씩 만들기'] };
const A_FUT = { id: 'm2', group: G, name: '미래 (will·be going to)', unit: '중1 「미래 시제」',
  why: 'be going to의 be동사, 미래 표현과 시제 맞추기가 어법 문제로 나와요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「미래 시제」 강의', 'I am / He is / We are going to + 동사원형, tomorrow·next ~ 는 미래와 함께'] };
const A_MUST = { id: 'm3', group: G, name: 'must·have to·should (의무·충고)', unit: '중1 「조동사 must·have to·should」',
  why: 'must not(금지)과 don\'t have to(필요 없음)의 차이가 내신 단골이에요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「조동사 must·have to·should」 강의', 'must not = 하면 안 된다, don\'t have to = 안 해도 된다 를 우리말 예문으로 정리'] };
const A_MFORM = { id: 'm4', group: G, name: '조동사 문장 형태', unit: '중1 「조동사의 부정문·의문문」',
  why: '조동사 뒤 동사원형, 부정은 조동사 뒤 not — 서술형에서 가장 많이 틀리는 곳이에요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「조동사」 강의', 'can·will·must·should 뒤에는 항상 동사원형, do/does를 같이 쓰지 않기'] };

export const ENG_M1_MODAL = set('eng-m1-modal', '조동사·미래 확인', '중1 영어 문법 · can·will·must·should·have to', 12, true,
  [A_CAN, A_FUT, A_MUST, A_MFORM], [
  { id: 'em-1', area: 'm4', text: '빈칸에 들어갈 말로 알맞은 것은?\nMy sister can ______ the piano very well.',
    options: ['plays', 'played', 'play', 'playing', 'to play'], answer: 3,
    traps: [{ a: 1, note: N_BASE }, { a: 2, note: N_BASE }, { a: 5, note: N_BASE }],
    explain: '조동사 can 뒤에는 동사원형 → can play.' },
  { id: 'em-2', area: 'm4', text: '다음 중 어법상 바른 문장은?',
    options: ['He cans swim fast.', 'She can speaks English.', 'Do you can ride a bike?', 'They will goes to the park.', 'Can you help me?'], answer: 5,
    traps: [{ a: 1, note: N_CANS }, { a: 2, note: N_BASE }, { a: 3, note: N_DOM }, { a: 4, note: N_BASE }],
    explain: '조동사 의문문은 조동사를 주어 앞으로 → Can you help me? ① can swim ② can speak ③ Can you ride ④ will go' },
  { id: 'em-3', area: 'm4', text: '다음 문장을 부정문으로 바르게 바꾼 것은?\nI can swim.',
    options: ['I don\'t can swim.', 'I can\'t swim.', 'I can swim not.', 'I not can swim.', 'I can\'t swims.'], answer: 2,
    traps: [{ a: 1, note: N_DOM }, { a: 3, note: N_MNEG }, { a: 4, note: N_MNEG }, { a: 5, note: N_BASE }],
    explain: '조동사 부정은 조동사 뒤에 not → cannot = can\'t + 동사원형.' },
  { id: 'em-4', area: 'm1', text: '밑줄 친 can의 뜻으로 알맞은 것은?\n<b>Can</b> I use your phone?',
    options: ['~할 수 있다(능력)', '~해도 된다(허락)', '~해야 한다(의무)', '~할 것이다(미래)', '~하는 게 좋겠다(충고)'], answer: 2,
    traps: [{ a: 1, note: N_CANMEAN }],
    explain: 'Can I ~? = ~해도 될까요?(허락을 구하는 말). 전화기를 써도 되는지 묻고 있어요.' },
  { id: 'em-5', area: 'm2', text: '빈칸에 들어갈 말로 알맞은 것은?\nWe ______ going to visit Gyeongju next week.',
    options: ['is', 'am', 'will', 'are', 'do'], answer: 4,
    traps: [{ a: 1, note: N_BEGO }, { a: 2, note: N_BEGO }, { a: 3, note: N_WILLGO }],
    explain: 'We + are going to + 동사원형 → We are going to visit.' },
  { id: 'em-6', area: 'm2', text: '다음 중 어법상 <b>틀린</b> 문장은?',
    options: ['She went to Busan next month.', 'I will call you tonight.', 'He is going to play tennis tomorrow.', 'They will visit us next week.', 'We are going to have a party this Saturday.'], answer: 1,
    explain: 'next month(다음 달)는 미래 → She will go / is going to go to Busan next month.' },
  { id: 'em-7', area: 'm3', text: '빈칸에 들어갈 말로 가장 알맞은 것은?\nYou have a bad cold. You ______ see a doctor.',
    options: ['can\'t', 'won\'t', 'should', 'don\'t have to', 'may not'], answer: 3,
    traps: [{ a: 4, note: N_MEAN }],
    explain: '감기가 심하니 병원에 가 보는 게 좋겠다 → should(충고).' },
  { id: 'em-8', area: 'm3', text: '빈칸에 들어갈 말로 알맞은 것은?\nMinho ______ finish his homework today.',
    options: ['have to', 'has to', 'having to', 'have', 'is have to'], answer: 2,
    traps: [{ a: 1, note: N_HAVE }, { a: 5, note: N_BEHAVE }],
    explain: 'Minho(3인칭 단수) → has to + 동사원형.' },
  { id: 'em-9', area: 'm3', text: '우리말과 같은 뜻이 되도록 빈칸에 알맞은 것은?\n「너는 오늘 일찍 올 필요가 없다.」\nYou ______ come early today.',
    options: ['must not', 'can\'t', 'should', 'will', 'don\'t have to'], answer: 5,
    traps: [{ a: 1, note: N_MUSTNT }],
    explain: '~할 필요가 없다 = don\'t have to. must not은 「~하면 안 된다」(금지)예요.' },
  { id: 'em-10', area: 'm1', text: '대화의 빈칸에 들어갈 말로 알맞은 것은?\nA: ______ I open the window? It\'s hot.\nB: Sure, go ahead.',
    options: ['Can', 'Must', 'Am', 'Does', 'Was'], answer: 1,
    traps: [{ a: 2, note: N_PERM }],
    explain: '창문을 열어도 되는지 허락을 구함 → Can I ~? 대답 Sure, go ahead(그럼, 열어).' },
]);

// ── to부정사·동명사 ──
const N_TOV = 'want·hope·plan·decide 뒤에는 to + 동사원형';
const N_ING = 'enjoy·finish·mind·give up 뒤에는 동명사(-ing)';
const N_TOBASE = 'to 뒤에 동사원형을 쓰지 않음 (to go / to be)';
const N_BOTH = 'like·love·start·begin 뒤에는 to부정사·동명사 둘 다 쓸 수 있지만 동사원형은 안 됨';
const N_SUBJ = '주어 자리에 동사원형·과거형을 씀 (Swimming / To swim is ~)';
const N_PURP = '「~하기 위해」(목적)는 to + 동사원형';
const N_ADJ = '「~할 (명사)」는 명사 뒤에 to + 동사원형 (something to drink)';
const N_USE = 'to부정사의 쓰임(~하는 것 / ~하기 위해 / ~할)을 문장 속에서 구분하지 못함';
const N_PREP = '전치사(at, for, in, about) 뒤에는 동명사(-ing)';
const N_TENSE = '우리말의 시제(~했다)와 영어 동사의 시제를 맞추지 않음';

const A_TOV = { id: 'i1', group: G, name: 'to부정사를 쓰는 동사', unit: '중1 「to부정사의 명사적 용법」',
  why: 'want·hope·plan·decide + to부정사는 서술형 영작에 자주 나와요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「to부정사」 강의', 'want / hope / plan / decide + to + 동사원형 으로 내 이야기 문장 4개 쓰기'] };
const A_GER = { id: 'i2', group: G, name: '동명사를 쓰는 동사·전치사', unit: '중1 「동명사」',
  why: 'enjoy·finish 뒤 to부정사를 고르는 실수가 어법 문제 단골이에요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「동명사」 강의', 'enjoy / finish / mind / give up + -ing, 전치사(at, for, in) 뒤에도 -ing'] };
const A_BOTHA = { id: 'i3', group: G, name: '둘 다 되는 동사·주어 자리', unit: '중1 「to부정사·동명사의 쓰임」',
  why: 'like·start는 둘 다 되고, 문장 맨 앞 주어 자리에는 동명사를 써요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「동명사」 강의', 'Reading books is fun. 처럼 -ing로 시작하는 문장 3개 만들기'] };
const A_TOUSE = { id: 'i4', group: G, name: 'to부정사 (~하기 위해 · ~할)', unit: '중1 「to부정사의 형용사적·부사적 용법」',
  why: '독해에서 to부정사를 「~하기 위해」로 읽어야 뜻이 통하는 문장이 많아요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「to부정사의 형용사적·부사적 용법」 강의', 'something to drink(마실 것), went to buy(사기 위해 갔다) 예문 정리'] };

export const ENG_M1_INF = set('eng-m1-inf', 'to부정사·동명사 확인', '중1 영어 문법 · want to / enjoy -ing / ~하기 위해', 12, true,
  [A_TOV, A_GER, A_BOTHA, A_TOUSE], [
  { id: 'ei-1', area: 'i1', text: '빈칸에 들어갈 말로 알맞은 것은?\nI hope ______ you again soon.',
    options: ['to see', 'see', 'seeing', 'to seeing', 'saw'], answer: 1,
    traps: [{ a: 2, note: N_TOV }, { a: 3, note: N_TOV }, { a: 4, note: N_TOBASE }, { a: 5, note: N_TOV }],
    explain: 'hope + to + 동사원형 → hope to see.' },
  { id: 'ei-2', area: 'i2', text: '빈칸에 들어갈 말로 알맞은 것은?\nDid you finish ______ your report?',
    options: ['write', 'to write', 'wrote', 'to writing', 'writing'], answer: 5,
    traps: [{ a: 1, note: N_ING }, { a: 2, note: N_ING }, { a: 4, note: N_ING }],
    explain: 'finish + 동명사(-ing) → finish writing.' },
  { id: 'ei-3', area: 'i2', text: '다음 중 어법상 <b>틀린</b> 문장은?',
    options: ['I want to visit Paris.', 'She enjoys reading comics.', 'They decided to stay home.', 'He finished to clean his room.', 'We hope to win the game.'], answer: 4,
    explain: 'finish 뒤에는 동명사 → He finished cleaning his room.' },
  { id: 'ei-4', area: 'i3', text: '두 문장의 뜻이 같도록 빈칸에 알맞은 것은?\nI like to swim. = I like ______.',
    options: ['swim', 'swam', 'swims', 'swimming', 'to swimming'], answer: 4,
    traps: [{ a: 1, note: N_BOTH }, { a: 5, note: N_TOBASE }],
    explain: 'like는 to부정사·동명사 둘 다 가능 → like to swim = like swimming.' },
  { id: 'ei-5', area: 'i3', text: '빈칸에 들어갈 말로 알맞은 것은?\n______ English every day is important.',
    options: ['Study', 'Studying', 'Studies', 'Studied', 'Be study'], answer: 2,
    traps: [{ a: 1, note: N_SUBJ }, { a: 3, note: N_SUBJ }, { a: 4, note: N_SUBJ }],
    explain: '주어 자리(~하는 것은) → 동명사 Studying. 동명사 주어는 단수 취급 → is.' },
  { id: 'ei-6', area: 'i4', text: '우리말과 같은 뜻이 되도록 빈칸에 알맞은 것은?\n「나는 책을 빌리기 위해 도서관에 갔다.」\nI went to the library ______ a book.',
    options: ['borrow', 'borrowing', 'for borrow', 'borrowed', 'to borrow'], answer: 5,
    traps: [{ a: 1, note: N_PURP }, { a: 2, note: N_PURP }, { a: 3, note: N_PURP }],
    explain: '~하기 위해 = to + 동사원형 → to borrow.' },
  { id: 'ei-7', area: 'i4', text: '빈칸에 들어갈 말로 알맞은 것은?\nI\'m thirsty. I want something ______.',
    options: ['drink', 'drinking', 'to drink', 'drank', 'drinks'], answer: 3,
    traps: [{ a: 1, note: N_ADJ }, { a: 2, note: N_ADJ }],
    explain: '마실 것 = something + to drink (명사 뒤에서 「~할」).' },
  { id: 'ei-8', area: 'i4', text: '밑줄 친 부분의 뜻으로 알맞은 것은?\nHe saved money <b>to buy</b> a new bike.',
    options: ['사기 위해', '사는 것을', '살', '사서 기쁜', '사지 않고'], answer: 1,
    traps: [{ a: 2, note: N_USE }, { a: 3, note: N_USE }],
    explain: '새 자전거를 사기 위해 돈을 모았다 → 목적(~하기 위해).' },
  { id: 'ei-9', area: 'i2', text: '빈칸에 들어갈 말로 알맞은 것은?\nShe is good at ______ pictures.',
    options: ['draw', 'drawing', 'to draw', 'drew', 'draws'], answer: 2,
    traps: [{ a: 1, note: N_PREP }, { a: 3, note: N_PREP }],
    explain: '전치사 at 뒤에는 동명사 → good at drawing(그림 그리는 것을 잘한다).' },
  { id: 'ei-10', area: 'i1', text: '우리말을 영어로 바르게 옮긴 것은?\n「나는 매일 운동하기로 결심했다.」',
    options: ['I decided exercising every day.', 'I decided to exercise every day.', 'I decided exercise every day.', 'I decided to exercising every day.', 'I decide to exercise every day.'], answer: 2,
    traps: [{ a: 1, note: N_TOV }, { a: 3, note: N_TOV }, { a: 4, note: N_TOBASE }, { a: 5, note: N_TENSE }],
    explain: 'decide + to + 동사원형, 결심했다(과거) → decided to exercise.' },
]);

// ── 비교급·최상급 ──
const N_ER_Y = '자음+y로 끝나면 y를 i로 고치고 -er / -est (easy → easier)';
const N_ER_DBL = '「짧은 모음+자음 하나」로 끝나면 자음을 한 번 더 쓰고 -er / -est (big → bigger)';
const N_MORE = '긴 형용사(interesting, beautiful 등)는 more / most를 앞에 씀';
const N_MORESHORT = '짧은 형용사에 more / most를 붙임 (taller, not more tall)';
const N_DOUBLE = 'more / most와 -er / -est를 함께 씀';
const N_IRRC = '불규칙 비교급·최상급 (good-better-best, bad-worse-worst, many-more-most)';
const N_THAN = 'than(~보다)이 있으면 비교급';
const N_THE = '최상급 앞에 the를 빠뜨림 (the tallest)';
const N_SUP = '「가장 ~한」(in·of와 함께)은 최상급';
const N_ASAS = 'as ~ as 사이에는 형용사 원래 모양(원급)';
const N_READ = '비교하는 두 대상의 크고 작음을 거꾸로 읽음';

const A_CMP = { id: 'c1', group: G, name: '비교급 만들기', unit: '중1 「비교급」',
  why: '-er / more, y → i, 자음 두 번 쓰기 — 형태를 고르는 문제가 꼭 나와요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「비교급·최상급」 강의', 'tall-taller, easy-easier, big-bigger, beautiful-more beautiful 네 가지 유형으로 단어 5개씩 정리'] };
const A_IRRC = { id: 'c2', group: G, name: '불규칙 비교', unit: '중1 「불규칙 비교급·최상급」',
  why: 'good·bad·many는 모양이 완전히 바뀌어서 외워야 해요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「비교급·최상급」 강의', 'good/well-better-best, bad-worse-worst, many/much-more-most 소리 내어 5번'] };
const A_SUPR = { id: 'c3', group: G, name: '최상급', unit: '중1 「최상급」',
  why: 'the를 빠뜨리거나 비교급을 쓰는 실수가 서술형 감점 단골이에요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「비교급·최상급」 강의', 'the + -est / the most + 형용사 + in(장소·집단) / of(셋 이상) 예문 3개'] };
const A_CREAD = { id: 'c4', group: G, name: 'as ~ as · 비교 문장 이해', unit: '중1 「원급 비교·비교 표현」',
  why: '표·글을 보고 누가 더 큰지 고르는 문제는 비교급 뜻을 정확히 읽어야 풀려요.',
  study: ['EBS 중학 프리미엄 중1 영어 문법 「원급 비교」 강의', 'A is taller than B = B is shorter than A 처럼 반대로 바꿔 말해 보기'] };

export const ENG_M1_COMP = set('eng-m1-comp', '비교급·최상급 확인', '중1 영어 문법 · -er / more · the -est · as ~ as', 12, true,
  [A_CMP, A_IRRC, A_SUPR, A_CREAD], [
  { id: 'ec-1', area: 'c1', text: '빈칸에 들어갈 말로 알맞은 것은?\nThis question is ______ than that one.',
    options: ['easy', 'easyer', 'more easy', 'easiest', 'easier'], answer: 5,
    traps: [{ a: 1, note: N_THAN }, { a: 2, note: N_ER_Y }, { a: 3, note: N_MORESHORT }, { a: 4, note: N_THAN }],
    explain: 'than → 비교급. easy는 자음+y → easier.' },
  { id: 'ec-2', area: 'c1', text: '빈칸에 들어갈 말로 알맞은 것은?\nThis movie is ______ than the book.',
    options: ['interestinger', 'more interesting', 'interesting', 'most interesting', 'more interestinger'], answer: 2,
    traps: [{ a: 1, note: N_MORE }, { a: 3, note: N_THAN }, { a: 4, note: N_THAN }, { a: 5, note: N_DOUBLE }],
    explain: 'interesting은 긴 형용사 → more interesting.' },
  { id: 'ec-3', area: 'c1', text: '다음 중 비교급이 바르게 짝지어진 것은?',
    options: ['tall – more tall', 'pretty – prettier', 'fat – fater', 'famous – famouser', 'heavy – heavyer'], answer: 2,
    traps: [{ a: 1, note: N_MORESHORT }, { a: 3, note: N_ER_DBL }, { a: 4, note: N_MORE }, { a: 5, note: N_ER_Y }],
    explain: 'pretty → prettier. ① taller ③ fatter ④ more famous ⑤ heavier 가 맞아요.' },
  { id: 'ec-4', area: 'c2', text: '빈칸에 들어갈 말로 알맞은 것은?\nYour idea is ______ than mine.',
    options: ['good', 'gooder', 'better', 'more good', 'best'], answer: 3,
    traps: [{ a: 1, note: N_THAN }, { a: 2, note: N_IRRC }, { a: 4, note: N_IRRC }, { a: 5, note: N_THAN }],
    explain: 'good의 비교급은 better(불규칙).' },
  { id: 'ec-5', area: 'c3', text: '빈칸에 들어갈 말로 알맞은 것은?\nMount Everest is the ______ mountain in the world.',
    options: ['high', 'higher', 'most high', 'highest', 'more higher'], answer: 4,
    traps: [{ a: 1, note: N_SUP }, { a: 2, note: N_SUP }, { a: 3, note: N_MORESHORT }, { a: 5, note: N_DOUBLE }],
    explain: 'the ~ in the world(세계에서 가장) → 최상급 highest.' },
  { id: 'ec-6', area: 'c3', text: '다음 중 어법상 바른 문장은?',
    options: ['She is the most smart girl in her class.', 'He is tallest boy in his school.', 'It is the bigest city in Korea.', 'Math is the difficultest subject for me.', 'This is the most expensive bag in the store.'], answer: 5,
    traps: [{ a: 1, note: N_MORESHORT }, { a: 2, note: N_THE }, { a: 3, note: N_ER_DBL }, { a: 4, note: N_MORE }],
    explain: 'expensive는 긴 형용사 → the most expensive. ① the smartest ② the tallest ③ the biggest ④ the most difficult' },
  { id: 'ec-7', area: 'c4', text: '빈칸에 들어갈 말로 알맞은 것은?\nMy brother is as ______ as my father.',
    options: ['tall', 'taller', 'tallest', 'more tall', 'the tallest'], answer: 1,
    traps: [{ a: 2, note: N_ASAS }, { a: 3, note: N_ASAS }, { a: 4, note: N_ASAS }, { a: 5, note: N_ASAS }],
    explain: 'as + 원급 + as = ~만큼 …한 → as tall as(아빠만큼 키가 크다).' },
  { id: 'ec-8', area: 'c4', text: '다음 글의 내용과 일치하는 것은?\n\nMina is 150 cm tall. Jisu is 155 cm tall. Yuna is 160 cm tall.',
    options: ['Mina is taller than Jisu.', 'Jisu is the tallest of the three.', 'Yuna is shorter than Mina.', 'Jisu is taller than Mina.', 'Mina is as tall as Yuna.'], answer: 4,
    traps: [{ a: 1, note: N_READ }, { a: 2, note: N_READ }, { a: 3, note: N_READ }],
    explain: 'Mina 150 < Jisu 155 < Yuna 160. 지수가 미나보다 커요. 가장 큰 사람은 Yuna.' },
  { id: 'ec-9', area: 'c3', text: '우리말을 영어로 바르게 옮긴 것은?\n「그는 우리 반에서 가장 빠른 학생이다.」',
    options: ['He is the fastest student in our class.', 'He is faster student in our class.', 'He is the most fast student in our class.', 'He is fastest student in our class.', 'He is the faster student in our class.'], answer: 1,
    traps: [{ a: 2, note: N_SUP }, { a: 3, note: N_MORESHORT }, { a: 4, note: N_THE }, { a: 5, note: N_SUP }],
    explain: '가장 빠른 → the fastest.' },
  { id: 'ec-10', area: 'c4', text: '두 문장의 뜻이 같도록 빈칸에 알맞은 것은?\nJiho is taller than Minsu. = Minsu is ______ than Jiho.',
    options: ['taller', 'shorter', 'tallest', 'shortest', 'more short'], answer: 2,
    traps: [{ a: 1, note: N_READ }, { a: 3, note: N_THAN }, { a: 4, note: N_THAN }, { a: 5, note: N_MORESHORT }],
    explain: '지호가 민수보다 크다 = 민수가 지호보다 작다 → shorter.' },
]);

export const ENG_GRAM_SETS = [ENG_M1_PAST, ENG_M1_MODAL, ENG_M1_INF, ENG_M1_COMP];

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
  'em-1': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nJiho will ______ his grandparents tomorrow.', options: ['visits', 'visit', 'visited', 'visiting', 'to visit'], answer: 2,
      traps: [{ a: 1, note: N_BASE }, { a: 3, note: N_BASE }, { a: 5, note: N_BASE }], explain: '조동사 will 뒤에는 동사원형 → will visit.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nYou should ______ more water every day.', options: ['drinks', 'drank', 'drinking', 'to drink', 'drink'], answer: 5,
      traps: [{ a: 1, note: N_BASE }, { a: 2, note: N_BASE }, { a: 4, note: N_BASE }], explain: '조동사 should 뒤에는 동사원형 → should drink.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nWe must ______ quiet in the library.', options: ['be', 'are', 'is', 'being', 'to be'], answer: 1,
      traps: [{ a: 2, note: N_BASE }, { a: 3, note: N_BASE }, { a: 5, note: N_BASE }], explain: '조동사 must 뒤에는 동사원형 → be동사의 원형 be → must be quiet.' },
  ],
  'em-2': [
    { text: '다음 중 어법상 바른 문장은?', options: ['She wills come soon.', 'Will you open the window?', 'He will plays soccer.', 'Does she will come?', 'I will to call you.'], answer: 2,
      traps: [{ a: 1, note: N_CANS }, { a: 3, note: N_BASE }, { a: 4, note: N_DOM }, { a: 5, note: N_BASE }],
      explain: 'Will you ~? 가 맞아요. ① will come ③ will play ④ Will she come? ⑤ will call' },
    { text: '다음 중 어법상 바른 문장은?', options: ['You musts wear a seat belt.', 'Do I must go now?', 'He must studies hard.', 'We must leave now.', 'She must to finish it.'], answer: 4,
      traps: [{ a: 1, note: N_CANS }, { a: 2, note: N_DOM }, { a: 3, note: N_BASE }, { a: 5, note: N_BASE }],
      explain: 'must + 동사원형 → We must leave now. ① must wear ② Must I go ③ must study ⑤ must finish' },
    { text: '다음 중 어법상 바른 문장은?', options: ['He shoulds see a doctor.', 'You should goes to bed early.', 'Does he should rest?', 'She should to eat breakfast.', 'You should wear a coat.'], answer: 5,
      traps: [{ a: 1, note: N_CANS }, { a: 2, note: N_BASE }, { a: 3, note: N_DOM }, { a: 4, note: N_BASE }],
      explain: 'should + 동사원형 → You should wear a coat. ① should see ② should go ③ Should he rest? ④ should eat' },
  ],
  'em-3': [
    { text: '다음 문장을 부정문으로 바르게 바꾼 것은?\nHe will come to the party.', options: ['He won\'t come to the party.', 'He doesn\'t will come to the party.', 'He will come not to the party.', 'He not will come to the party.', 'He won\'t comes to the party.'], answer: 1,
      traps: [{ a: 2, note: N_DOM }, { a: 3, note: N_MNEG }, { a: 4, note: N_MNEG }, { a: 5, note: N_BASE }], explain: 'will not = won\'t + 동사원형 → He won\'t come.' },
    { text: '다음 문장을 부정문으로 바르게 바꾼 것은?\nYou should eat fast food.', options: ['You don\'t should eat fast food.', 'You should eat not fast food.', 'You not should eat fast food.', 'You shouldn\'t eat fast food.', 'You shouldn\'t eats fast food.'], answer: 4,
      traps: [{ a: 1, note: N_DOM }, { a: 2, note: N_MNEG }, { a: 3, note: N_MNEG }, { a: 5, note: N_BASE }], explain: 'should not = shouldn\'t + 동사원형 → You shouldn\'t eat.' },
    { text: '다음 문장을 부정문으로 바르게 바꾼 것은?\nShe can ride a bike.', options: ['She doesn\'t can ride a bike.', 'She can ride not a bike.', 'She can\'t ride a bike.', 'She not can ride a bike.', 'She can\'t rides a bike.'], answer: 3,
      traps: [{ a: 1, note: N_DOM }, { a: 2, note: N_MNEG }, { a: 4, note: N_MNEG }, { a: 5, note: N_BASE }], explain: 'cannot = can\'t + 동사원형 → She can\'t ride.' },
  ],
  'em-4': [
    { text: '밑줄 친 can의 뜻으로 알맞은 것은?\nMy brother <b>can</b> run 100 meters in 13 seconds.', options: ['~할 수 있다(능력)', '~해도 된다(허락)', '~해야 한다(의무)', '~할 것이다(미래)', '~하는 게 좋겠다(충고)'], answer: 1,
      traps: [{ a: 2, note: N_CANMEAN }], explain: '100 m를 13초에 달릴 수 있다 → 할 줄 아는 일 = 능력.' },
    { text: '밑줄 친 can의 뜻으로 알맞은 것은?\nYou finished your work. You <b>can</b> go home now.', options: ['~할 수 있다(능력)', '~해도 된다(허락)', '~해야 한다(의무)', '~할 것이다(미래)', '~하는 게 좋겠다(충고)'], answer: 2,
      traps: [{ a: 1, note: N_CANMEAN }], explain: '일을 끝냈으니 이제 집에 가도 된다 → 허락.' },
    { text: '밑줄 친 can\'t의 뜻으로 알맞은 것은?\nPenguins are birds, but they <b>can\'t</b> fly.', options: ['~할 수 없다(능력)', '~하면 안 된다(금지)', '~할 필요 없다', '~하지 않을 것이다(미래)', '~하지 않는 게 좋겠다(충고)'], answer: 1,
      traps: [{ a: 2, note: N_CANMEAN }], explain: '펭귄은 날 수 없다 → 능력이 없음. 「날면 안 된다」가 아니에요.' },
  ],
  'em-5': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nShe ______ going to buy a new phone tomorrow.', options: ['are', 'is', 'am', 'will', 'does'], answer: 2,
      traps: [{ a: 1, note: N_BEGO }, { a: 3, note: N_BEGO }, { a: 4, note: N_WILLGO }], explain: 'She + is going to + 동사원형.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nI ______ going to watch a movie tonight.', options: ['is', 'are', 'will', 'am', 'do'], answer: 4,
      traps: [{ a: 1, note: N_BEGO }, { a: 2, note: N_BEGO }, { a: 3, note: N_WILLGO }], explain: 'I + am going to + 동사원형.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nMy parents ______ going to clean the house this weekend.', options: ['is', 'am', 'will', 'do', 'are'], answer: 5,
      traps: [{ a: 1, note: N_BEGO }, { a: 2, note: N_BEGO }, { a: 3, note: N_WILLGO }], explain: 'My parents(복수) + are going to + 동사원형.' },
  ],
  'em-6': [
    { text: '다음 중 어법상 <b>틀린</b> 문장은?', options: ['It will snow tomorrow.', 'I am going to study tonight.', 'He will meet his friend tomorrow.', 'We visited the museum next Sunday.', 'She is going to bake a cake.'], answer: 4,
      traps: [], explain: 'next Sunday(다음 일요일)는 미래 → We will visit / are going to visit the museum next Sunday.' },
    { text: '다음 중 어법상 <b>틀린</b> 문장은?', options: ['Mina met her friend yesterday.', 'He played soccer tomorrow.', 'They are going to travel next summer.', 'I will finish it soon.', 'We will be late.'], answer: 2,
      traps: [], explain: 'tomorrow(내일)는 미래 → He will play soccer tomorrow. ①은 yesterday라서 과거형 met이 맞아요.' },
    { text: '다음 중 어법상 <b>틀린</b> 문장은?', options: ['My dad will cook dinner tonight.', 'I am going to read this book tomorrow.', 'She will join the club next year.', 'It is going to rain soon.', 'We watched the game next Friday.'], answer: 5,
      traps: [], explain: 'next Friday(다음 금요일)는 미래 → We will watch the game next Friday.' },
  ],
  'em-7': [
    { text: '빈칸에 들어갈 말로 가장 알맞은 것은?\nIt\'s very cold outside. You ______ wear a warm coat.', options: ['won\'t', 'should', 'don\'t have to', 'can\'t', 'may not'], answer: 2,
      traps: [{ a: 3, note: N_MEAN }], explain: '밖이 추우니 따뜻한 코트를 입는 게 좋겠다 → should.' },
    { text: '빈칸에 들어갈 말로 가장 알맞은 것은?\nYou ______ run in the hallway. It\'s dangerous.', options: ['should', 'will', 'must not', 'have to', 'can'], answer: 3,
      traps: [{ a: 1, note: N_MEAN }, { a: 4, note: N_MEAN }], explain: '위험하니 복도에서 뛰면 안 된다 → must not(금지).' },
    { text: '빈칸에 들어갈 말로 가장 알맞은 것은?\nYou look tired. You ______ go to bed early.', options: ['shouldn\'t', 'won\'t', 'can\'t', 'must not', 'should'], answer: 5,
      traps: [{ a: 1, note: N_MEAN }, { a: 4, note: N_MEAN }], explain: '피곤해 보이니 일찍 자는 게 좋겠다 → should.' },
  ],
  'em-8': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nMy mom ______ go to work early tomorrow.', options: ['have to', 'is have to', 'has to', 'haves to', 'having to'], answer: 3,
      traps: [{ a: 1, note: N_HAVE }, { a: 2, note: N_BEHAVE }, { a: 4, note: N_HAVE }], explain: 'My mom(3인칭 단수) → has to + 동사원형.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nWe ______ wear school uniforms.', options: ['has to', 'have to', 'are have to', 'has', 'having to'], answer: 2,
      traps: [{ a: 1, note: N_HAVE }, { a: 3, note: N_BEHAVE }], explain: 'We(복수) → have to + 동사원형.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nTom ______ take care of his little sister.', options: ['have to', 'is have to', 'haves to', 'having to', 'has to'], answer: 5,
      traps: [{ a: 1, note: N_HAVE }, { a: 2, note: N_BEHAVE }, { a: 3, note: N_HAVE }], explain: 'Tom(3인칭 단수) → has to + 동사원형.' },
  ],
  'em-9': [
    { text: '우리말과 같은 뜻이 되도록 빈칸에 알맞은 것은?\n「여기에서 사진을 찍으면 안 된다.」\nYou ______ take pictures here.', options: ['must not', 'don\'t have to', 'have to', 'will', 'should'], answer: 1,
      traps: [{ a: 2, note: N_MUSTNT }], explain: '~하면 안 된다 = must not. don\'t have to는 「~할 필요 없다」예요.' },
    { text: '우리말과 같은 뜻이 되도록 빈칸에 알맞은 것은?\n「우리는 내일 학교에 갈 필요가 없다.」\nWe ______ go to school tomorrow.', options: ['must not', 'have to', 'should', 'can', 'don\'t have to'], answer: 5,
      traps: [{ a: 1, note: N_MUSTNT }], explain: '~할 필요가 없다 = don\'t have to.' },
    { text: '우리말과 같은 뜻이 되도록 빈칸에 알맞은 것은?\n「수업 중에 휴대폰을 사용하면 안 된다.」\nYou ______ use your phone in class.', options: ['have to', 'don\'t have to', 'must not', 'should', 'will'], answer: 3,
      traps: [{ a: 2, note: N_MUSTNT }], explain: '~하면 안 된다 = must not.' },
  ],
  'em-10': [
    { text: '대화의 빈칸에 들어갈 말로 알맞은 것은?\nA: ______ I borrow your eraser?\nB: Of course.', options: ['Must', 'May', 'Am', 'Do', 'Have'], answer: 2,
      traps: [{ a: 1, note: N_PERM }], explain: '지우개를 빌려도 되는지 허락을 구함 → May I ~?' },
    { text: '대화의 빈칸에 들어갈 말로 알맞은 것은?\nA: ______ I use your computer?\nB: Sorry, you can\'t. I\'m using it now.', options: ['Am', 'Must', 'Does', 'Can', 'Was'], answer: 4,
      traps: [{ a: 2, note: N_PERM }], explain: '컴퓨터를 써도 되는지 허락을 구함 → Can I ~? 대답도 you can\'t.' },
    { text: '대화의 빈칸에 들어갈 말로 알맞은 것은?\nA: Mom, ______ I go out and play?\nB: Yes, you may. But come back by six.', options: ['Must', 'Am', 'Did', 'Have', 'May'], answer: 5,
      traps: [{ a: 1, note: N_PERM }], explain: '나가 놀아도 되는지 허락을 구함 → May I ~? 대답 Yes, you may.' },
  ],
  'ei-1': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nShe decided ______ a cooking class.', options: ['take', 'taking', 'to taking', 'to take', 'took'], answer: 4,
      traps: [{ a: 1, note: N_TOV }, { a: 2, note: N_TOV }, { a: 3, note: N_TOBASE }, { a: 5, note: N_TOV }], explain: 'decide + to + 동사원형 → decided to take.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nWe plan ______ to Jeju this winter.', options: ['travel', 'traveling', 'to travel', 'to traveling', 'traveled'], answer: 3,
      traps: [{ a: 1, note: N_TOV }, { a: 2, note: N_TOV }, { a: 4, note: N_TOBASE }, { a: 5, note: N_TOV }], explain: 'plan + to + 동사원형 → plan to travel.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nMy brother wants ______ a famous singer.', options: ['be', 'being', 'is', 'to being', 'to be'], answer: 5,
      traps: [{ a: 1, note: N_TOV }, { a: 2, note: N_TOV }, { a: 3, note: N_TOV }, { a: 4, note: N_TOBASE }], explain: 'want + to + 동사원형 → wants to be.' },
  ],
  'ei-2': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nMy dad enjoys ______ in the mountains.', options: ['hike', 'hiking', 'to hike', 'hiked', 'to hiking'], answer: 2,
      traps: [{ a: 1, note: N_ING }, { a: 3, note: N_ING }, { a: 5, note: N_ING }], explain: 'enjoy + 동명사 → enjoys hiking.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nWould you mind ______ the door?', options: ['open', 'to open', 'opening', 'to opening', 'opened'], answer: 3,
      traps: [{ a: 1, note: N_ING }, { a: 2, note: N_ING }, { a: 4, note: N_ING }], explain: 'mind + 동명사 → Would you mind opening the door?(문 좀 열어 줄래?)' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nHe gave up ______ fast food.', options: ['eating', 'eat', 'to eat', 'ate', 'to eating'], answer: 1,
      traps: [{ a: 2, note: N_ING }, { a: 3, note: N_ING }, { a: 5, note: N_ING }], explain: 'give up + 동명사 → gave up eating(먹는 것을 그만두었다).' },
  ],
  'ei-3': [
    { text: '다음 중 어법상 <b>틀린</b> 문장은?', options: ['I enjoy to play badminton.', 'She wants to learn Chinese.', 'He finished doing his homework.', 'We plan to have a party.', 'They gave up waiting for the bus.'], answer: 1,
      explain: 'enjoy 뒤에는 동명사 → I enjoy playing badminton.' },
    { text: '다음 중 어법상 <b>틀린</b> 문장은?', options: ['Mina hopes to be a doctor.', 'I decided learning the guitar.', 'He enjoys watching movies.', 'Did you finish eating?', 'We want to go home.'], answer: 2,
      explain: 'decide 뒤에는 to부정사 → I decided to learn the guitar.' },
    { text: '다음 중 어법상 <b>틀린</b> 문장은?', options: ['They plan to visit their aunt.', 'I enjoy cooking with my mom.', 'She wants buying a new bag.', 'He finished reading the book.', 'We hope to see you again.'], answer: 3,
      explain: 'want 뒤에는 to부정사 → She wants to buy a new bag.' },
  ],
  'ei-4': [
    { text: '두 문장의 뜻이 같도록 빈칸에 알맞은 것은?\nIt began to snow. = It began ______.', options: ['snow', 'snowing', 'snowed', 'to snowing', 'snows'], answer: 2,
      traps: [{ a: 1, note: N_BOTH }, { a: 4, note: N_TOBASE }], explain: 'begin은 둘 다 가능 → began to snow = began snowing.' },
    { text: '두 문장의 뜻이 같도록 빈칸에 알맞은 것은?\nShe loves cooking. = She loves ______.', options: ['to cook', 'cook', 'cooked', 'to cooking', 'cooks'], answer: 1,
      traps: [{ a: 2, note: N_BOTH }, { a: 4, note: N_TOBASE }], explain: 'love는 둘 다 가능 → loves cooking = loves to cook.' },
    { text: '두 문장의 뜻이 같도록 빈칸에 알맞은 것은?\nThey started to dance. = They started ______.', options: ['dance', 'danced', 'to dancing', 'dances', 'dancing'], answer: 5,
      traps: [{ a: 1, note: N_BOTH }, { a: 3, note: N_TOBASE }], explain: 'start는 둘 다 가능 → started to dance = started dancing.' },
  ],
  'ei-5': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\n______ books is my hobby.', options: ['Read', 'Reads', 'Reading', 'Readed', 'Be read'], answer: 3,
      traps: [{ a: 1, note: N_SUBJ }, { a: 2, note: N_SUBJ }, { a: 4, note: N_SUBJ }], explain: '주어 자리 → 동명사 Reading books(책 읽는 것은).' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\n______ breakfast is good for your health.', options: ['Eat', 'Eats', 'Ate', 'Eating', 'Be eat'], answer: 4,
      traps: [{ a: 1, note: N_SUBJ }, { a: 2, note: N_SUBJ }, { a: 3, note: N_SUBJ }], explain: '주어 자리 → 동명사 Eating breakfast(아침 먹는 것은).' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\n______ in the river can be dangerous.', options: ['Swimming', 'Swim', 'Swims', 'Swam', 'Be swim'], answer: 1,
      traps: [{ a: 2, note: N_SUBJ }, { a: 3, note: N_SUBJ }, { a: 4, note: N_SUBJ }], explain: '주어 자리 → 동명사 Swimming in the river(강에서 수영하는 것은).' },
  ],
  'ei-6': [
    { text: '우리말과 같은 뜻이 되도록 빈칸에 알맞은 것은?\n「그녀는 버스를 타기 위해 일찍 일어났다.」\nShe got up early ______ the bus.', options: ['catch', 'to catch', 'catching', 'caught', 'for catch'], answer: 2,
      traps: [{ a: 1, note: N_PURP }, { a: 3, note: N_PURP }, { a: 5, note: N_PURP }], explain: '~하기 위해 = to + 동사원형 → to catch.' },
    { text: '우리말과 같은 뜻이 되도록 빈칸에 알맞은 것은?\n「우리는 그를 돕기 위해 거기에 갔다.」\nWe went there ______ him.', options: ['help', 'helping', 'to help', 'for help', 'helped'], answer: 3,
      traps: [{ a: 1, note: N_PURP }, { a: 2, note: N_PURP }, { a: 4, note: N_PURP }], explain: '~하기 위해 = to + 동사원형 → to help.' },
    { text: '우리말과 같은 뜻이 되도록 빈칸에 알맞은 것은?\n「민수는 축구를 하려고 공원에 갔다.」\nMinsu went to the park ______ soccer.', options: ['to play', 'play', 'playing', 'played', 'for play'], answer: 1,
      traps: [{ a: 2, note: N_PURP }, { a: 3, note: N_PURP }, { a: 5, note: N_PURP }], explain: '~하려고(목적) = to + 동사원형 → to play.' },
  ],
  'ei-7': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nI have a lot of homework ______ today.', options: ['do', 'to do', 'doing', 'did', 'does'], answer: 2,
      traps: [{ a: 1, note: N_ADJ }, { a: 3, note: N_ADJ }], explain: '오늘 할 숙제 = homework + to do.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nThere are many places ______ in Seoul.', options: ['visit', 'visiting', 'visited', 'visits', 'to visit'], answer: 5,
      traps: [{ a: 1, note: N_ADJ }, { a: 2, note: N_ADJ }], explain: '서울에는 방문할 곳이 많다 = places + to visit.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nDo you have time ______ with me?', options: ['talk', 'talking', 'talked', 'to talk', 'talks'], answer: 4,
      traps: [{ a: 1, note: N_ADJ }, { a: 2, note: N_ADJ }], explain: '나랑 이야기할 시간 = time + to talk.' },
  ],
  'ei-8': [
    { text: '밑줄 친 부분의 뜻으로 알맞은 것은?\nI want <b>to buy</b> a new bike.', options: ['사기 위해', '사는 것을', '살', '사서 기쁜', '사지 않고'], answer: 2,
      traps: [{ a: 1, note: N_USE }, { a: 3, note: N_USE }], explain: 'want의 목적어 → 새 자전거 사는 것을 원한다(~하는 것).' },
    { text: '밑줄 친 부분의 뜻으로 알맞은 것은?\nI need a pen <b>to write</b> with.', options: ['쓰기 위해서는', '쓰는 것을', '(가지고) 쓸', '써서 기쁜', '쓰지 않고'], answer: 3,
      traps: [{ a: 1, note: N_USE }, { a: 2, note: N_USE }], explain: 'a pen을 꾸밈 → (가지고) 쓸 펜이 필요하다(~할).' },
    { text: '밑줄 친 부분의 뜻으로 알맞은 것은?\nShe went to the store <b>to get</b> some milk.', options: ['사 오기 위해', '사 오는 것을', '사 올', '사 와서 기쁜', '사 오지 않고'], answer: 1,
      traps: [{ a: 2, note: N_USE }, { a: 3, note: N_USE }], explain: '우유를 사 오기 위해 가게에 갔다 → 목적(~하기 위해).' },
  ],
  'ei-9': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nThank you for ______ me.', options: ['help', 'to help', 'helping', 'helped', 'helps'], answer: 3,
      traps: [{ a: 1, note: N_PREP }, { a: 2, note: N_PREP }], explain: '전치사 for 뒤에는 동명사 → Thank you for helping me.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nI\'m interested in ______ robots.', options: ['make', 'to make', 'made', 'makes', 'making'], answer: 5,
      traps: [{ a: 1, note: N_PREP }, { a: 2, note: N_PREP }], explain: '전치사 in 뒤에는 동명사 → interested in making robots.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nHow about ______ a walk after dinner?', options: ['taking', 'take', 'to take', 'took', 'takes'], answer: 1,
      traps: [{ a: 2, note: N_PREP }, { a: 3, note: N_PREP }], explain: 'How about 뒤에는 동명사 → How about taking a walk?(산책하는 게 어때?)' },
  ],
  'ei-10': [
    { text: '우리말을 영어로 바르게 옮긴 것은?\n「그는 피아노 치는 것을 즐긴다.」', options: ['He enjoys to play the piano.', 'He enjoy playing the piano.', 'He enjoys playing the piano.', 'He enjoys play the piano.', 'He enjoys to playing the piano.'], answer: 3,
      traps: [{ a: 1, note: N_ING }, { a: 4, note: N_ING }, { a: 5, note: N_ING }], explain: 'enjoy + 동명사, 주어 He → enjoys playing.' },
    { text: '우리말을 영어로 바르게 옮긴 것은?\n「우리는 내년에 캐나다를 방문할 계획이다.」', options: ['We plan visiting Canada next year.', 'We plan visit Canada next year.', 'We plan to visiting Canada next year.', 'We plan to visit Canada next year.', 'We plans to visit Canada next year.'], answer: 4,
      traps: [{ a: 1, note: N_TOV }, { a: 2, note: N_TOV }, { a: 3, note: N_TOBASE }], explain: 'plan + to + 동사원형 → plan to visit.' },
    { text: '우리말을 영어로 바르게 옮긴 것은?\n「나는 숙제하는 것을 끝냈다.」', options: ['I finished doing my homework.', 'I finished to do my homework.', 'I finished do my homework.', 'I finish doing my homework.', 'I finished to doing my homework.'], answer: 1,
      traps: [{ a: 2, note: N_ING }, { a: 3, note: N_ING }, { a: 4, note: N_TENSE }, { a: 5, note: N_ING }], explain: 'finish + 동명사, 끝냈다(과거) → finished doing.' },
  ],
  'ec-1': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nMy bag is ______ than yours.', options: ['bigger', 'big', 'biger', 'more big', 'biggest'], answer: 1,
      traps: [{ a: 2, note: N_THAN }, { a: 3, note: N_ER_DBL }, { a: 4, note: N_MORESHORT }, { a: 5, note: N_THAN }], explain: 'than → 비교급. big은 짧은 모음+자음 → bigger.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nToday is ______ than yesterday.', options: ['hot', 'hoter', 'hottest', 'more hot', 'hotter'], answer: 5,
      traps: [{ a: 1, note: N_THAN }, { a: 2, note: N_ER_DBL }, { a: 3, note: N_THAN }, { a: 4, note: N_MORESHORT }], explain: 'than → 비교급. hot → hotter.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nMinsu is ______ than his brother.', options: ['happy', 'happier', 'happyer', 'more happy', 'happiest'], answer: 2,
      traps: [{ a: 1, note: N_THAN }, { a: 3, note: N_ER_Y }, { a: 4, note: N_MORESHORT }, { a: 5, note: N_THAN }], explain: 'than → 비교급. happy는 자음+y → happier.' },
  ],
  'ec-2': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nHealth is ______ than money.', options: ['importanter', 'important', 'more important', 'most important', 'more importanter'], answer: 3,
      traps: [{ a: 1, note: N_MORE }, { a: 2, note: N_THAN }, { a: 4, note: N_THAN }, { a: 5, note: N_DOUBLE }], explain: 'important는 긴 형용사 → more important.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nThis dress is ______ than that one.', options: ['beautifuler', 'most beautiful', 'beautiful', 'more beautifuler', 'more beautiful'], answer: 5,
      traps: [{ a: 1, note: N_MORE }, { a: 2, note: N_THAN }, { a: 3, note: N_THAN }, { a: 4, note: N_DOUBLE }], explain: 'beautiful은 긴 형용사 → more beautiful.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nSoccer is ______ than baseball in my class.', options: ['more popular', 'popularer', 'popular', 'most popular', 'more popularer'], answer: 1,
      traps: [{ a: 2, note: N_MORE }, { a: 3, note: N_THAN }, { a: 4, note: N_THAN }, { a: 5, note: N_DOUBLE }], explain: 'popular는 긴 형용사 → more popular.' },
  ],
  'ec-3': [
    { text: '다음 중 비교급이 바르게 짝지어진 것은?', options: ['busy – busyer', 'thin – thiner', 'difficult – difficulter', 'large – larger', 'fast – more fast'], answer: 4,
      traps: [{ a: 1, note: N_ER_Y }, { a: 2, note: N_ER_DBL }, { a: 3, note: N_MORE }, { a: 5, note: N_MORESHORT }],
      explain: 'large는 e로 끝나서 -r만 → larger. ① busier ② thinner ③ more difficult ⑤ faster' },
    { text: '다음 중 비교급이 바르게 짝지어진 것은?', options: ['wet – weter', 'early – earlyer', 'cheap – cheaper', 'careful – carefuler', 'old – more old'], answer: 3,
      traps: [{ a: 1, note: N_ER_DBL }, { a: 2, note: N_ER_Y }, { a: 4, note: N_MORE }, { a: 5, note: N_MORESHORT }],
      explain: 'cheap → cheaper. ① wetter ② earlier ④ more careful ⑤ older' },
    { text: '다음 중 비교급이 바르게 짝지어진 것은?', options: ['strong – more strong', 'useful – usefuler', 'sad – sader', 'funny – funnier', 'dirty – dirtyer'], answer: 4,
      traps: [{ a: 1, note: N_MORESHORT }, { a: 2, note: N_MORE }, { a: 3, note: N_ER_DBL }, { a: 5, note: N_ER_Y }],
      explain: 'funny → funnier. ① stronger ② more useful ③ sadder ⑤ dirtier' },
  ],
  'ec-4': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nThe weather today is ______ than yesterday. It\'s raining hard.', options: ['bad', 'badder', 'more bad', 'worse', 'worst'], answer: 4,
      traps: [{ a: 1, note: N_THAN }, { a: 2, note: N_IRRC }, { a: 3, note: N_IRRC }, { a: 5, note: N_THAN }], explain: 'bad의 비교급은 worse(불규칙).' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nShe has ______ books than I do.', options: ['more', 'many', 'manier', 'most', 'much'], answer: 1,
      traps: [{ a: 2, note: N_THAN }, { a: 3, note: N_IRRC }, { a: 4, note: N_THAN }], explain: 'many의 비교급은 more(불규칙). much는 셀 수 없는 것에 써요.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nThis is the ______ day of my life! I\'m so happy.', options: ['good', 'better', 'gooder', 'best', 'goodest'], answer: 4,
      traps: [{ a: 1, note: N_SUP }, { a: 2, note: N_SUP }, { a: 3, note: N_IRRC }, { a: 5, note: N_IRRC }], explain: 'the ~ of my life(내 인생에서 가장) → good의 최상급 best(불규칙).' },
  ],
  'ec-5': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nJiho is the ______ student in our class.', options: ['tall', 'taller', 'most tall', 'tallest', 'more tall'], answer: 4,
      traps: [{ a: 1, note: N_SUP }, { a: 2, note: N_SUP }, { a: 3, note: N_MORESHORT }, { a: 5, note: N_MORESHORT }], explain: 'the ~ in our class → 최상급 tallest.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nThis is the ______ book in this library.', options: ['old', 'oldest', 'older', 'most old', 'more older'], answer: 2,
      traps: [{ a: 1, note: N_SUP }, { a: 3, note: N_SUP }, { a: 4, note: N_MORESHORT }, { a: 5, note: N_DOUBLE }], explain: 'the ~ in this library → 최상급 oldest.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nAugust is the ______ month of the year in Korea.', options: ['hot', 'hotter', 'hotest', 'most hot', 'hottest'], answer: 5,
      traps: [{ a: 1, note: N_SUP }, { a: 2, note: N_SUP }, { a: 3, note: N_ER_DBL }, { a: 4, note: N_MORESHORT }], explain: 'the ~ of the year → 최상급. hot → hottest(t를 한 번 더).' },
  ],
  'ec-6': [
    { text: '다음 중 어법상 바른 문장은?', options: ['Tom is the faster runner of the three.', 'This is the most beautiful place in Seoul.', 'He is the most strong person I know.', 'Today is happiest day of my life.', 'That is the heavyest box here.'], answer: 2,
      traps: [{ a: 1, note: N_SUP }, { a: 3, note: N_MORESHORT }, { a: 4, note: N_THE }, { a: 5, note: N_ER_Y }],
      explain: 'beautiful → the most beautiful. ① the fastest ③ the strongest ④ the happiest ⑤ the heaviest' },
    { text: '다음 중 어법상 바른 문장은?', options: ['She is the busyest person in my family.', 'Winter is the colder season of the year.', 'This is the most cheap pen.', 'Jupiter is biggest planet.', 'He is the most famous singer in Korea.'], answer: 5,
      traps: [{ a: 1, note: N_ER_Y }, { a: 2, note: N_SUP }, { a: 3, note: N_MORESHORT }, { a: 4, note: N_THE }],
      explain: 'famous → the most famous. ① the busiest ② the coldest ③ the cheapest ④ the biggest' },
    { text: '다음 중 어법상 바른 문장은?', options: ['This is the importantest rule.', 'Seoul is the largest city in Korea.', 'He is the most fast swimmer.', 'It was the worse day of my life.', 'Mina is youngest in her family.'], answer: 2,
      traps: [{ a: 1, note: N_MORE }, { a: 3, note: N_MORESHORT }, { a: 4, note: N_IRRC }, { a: 5, note: N_THE }],
      explain: 'large → the largest. ① the most important ③ the fastest ④ the worst ⑤ the youngest' },
  ],
  'ec-7': [
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nThis box is as ______ as that one.', options: ['heavier', 'heavy', 'heaviest', 'more heavy', 'the heaviest'], answer: 2,
      traps: [{ a: 1, note: N_ASAS }, { a: 3, note: N_ASAS }, { a: 4, note: N_ASAS }, { a: 5, note: N_ASAS }], explain: 'as + 원급 + as → as heavy as.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nYour bike is not as ______ as mine.', options: ['newer', 'newest', 'new', 'more new', 'the newest'], answer: 3,
      traps: [{ a: 1, note: N_ASAS }, { a: 2, note: N_ASAS }, { a: 4, note: N_ASAS }, { a: 5, note: N_ASAS }], explain: 'not as + 원급 + as = ~만큼 …하지 않다 → not as new as.' },
    { text: '빈칸에 들어갈 말로 알맞은 것은?\nScience is as ______ as math to me.', options: ['more interesting', 'most interesting', 'interestinger', 'interesting', 'the most interesting'], answer: 4,
      traps: [{ a: 1, note: N_ASAS }, { a: 2, note: N_ASAS }, { a: 3, note: N_ASAS }, { a: 5, note: N_ASAS }], explain: 'as + 원급 + as → as interesting as.' },
  ],
  'ec-8': [
    { text: '다음 글의 내용과 일치하는 것은?\n\nThis bag is 30,000 won. That bag is 20,000 won. The red bag is 50,000 won.', options: ['This bag is cheaper than that bag.', 'The red bag is the cheapest.', 'That bag is the cheapest of the three.', 'That bag is more expensive than this bag.', 'This bag is as expensive as the red bag.'], answer: 3,
      traps: [{ a: 1, note: N_READ }, { a: 2, note: N_READ }, { a: 4, note: N_READ }], explain: 'that bag 2만 원 < this bag 3만 원 < red bag 5만 원 → 가장 싼 것은 that bag.' },
    { text: '다음 글의 내용과 일치하는 것은?\n\nTom got 80 points. Ben got 95 points. Sam got 80 points.', options: ['Tom got a higher score than Ben.', 'Sam got the highest score.', 'Ben got a lower score than Sam.', 'Tom\'s score was as high as Sam\'s.', 'Ben got the lowest score.'], answer: 4,
      traps: [{ a: 1, note: N_READ }, { a: 2, note: N_READ }, { a: 3, note: N_READ }, { a: 5, note: N_READ }], explain: 'Tom 80 = Sam 80 → as high as(~만큼 높은). 가장 높은 사람은 Ben.' },
    { text: '다음 글의 내용과 일치하는 것은?\n\nBusan is 400 km from Seoul. Daejeon is 160 km from Seoul. Gwangju is 300 km from Seoul.', options: ['Daejeon is farther from Seoul than Gwangju.', 'Busan is the farthest from Seoul.', 'Gwangju is closer to Seoul than Daejeon.', 'Busan is closer to Seoul than Gwangju.', 'Daejeon is as far from Seoul as Busan.'], answer: 2,
      traps: [{ a: 1, note: N_READ }, { a: 3, note: N_READ }, { a: 4, note: N_READ }], explain: '대전 160 < 광주 300 < 부산 400 km → 서울에서 가장 먼 곳은 부산(the farthest).' },
  ],
  'ec-9': [
    { text: '우리말을 영어로 바르게 옮긴 것은?\n「이것은 이 가게에서 가장 비싼 컴퓨터이다.」', options: ['This is the expensivest computer in this store.', 'This is most expensive computer in this store.', 'This is the more expensive computer in this store.', 'This is the most expensive computer in this store.', 'This is the most expensivest computer in this store.'], answer: 4,
      traps: [{ a: 1, note: N_MORE }, { a: 2, note: N_THE }, { a: 3, note: N_SUP }, { a: 5, note: N_DOUBLE }], explain: '가장 비싼 → the most expensive.' },
    { text: '우리말을 영어로 바르게 옮긴 것은?\n「겨울은 일 년 중 가장 추운 계절이다.」', options: ['Winter is the coldest season of the year.', 'Winter is colder season of the year.', 'Winter is the most cold season of the year.', 'Winter is coldest season of the year.', 'Winter is the colder season of the year.'], answer: 1,
      traps: [{ a: 2, note: N_SUP }, { a: 3, note: N_MORESHORT }, { a: 4, note: N_THE }, { a: 5, note: N_SUP }], explain: '가장 추운 → the coldest.' },
    { text: '우리말을 영어로 바르게 옮긴 것은?\n「그녀는 세 명 중에서 가장 어리다.」', options: ['She is younger of the three.', 'She is the most young of the three.', 'She is youngest of the three.', 'She is the younger of the three.', 'She is the youngest of the three.'], answer: 5,
      traps: [{ a: 1, note: N_SUP }, { a: 2, note: N_MORESHORT }, { a: 3, note: N_THE }, { a: 4, note: N_SUP }], explain: '셋 중 가장 어린 → the youngest of the three.' },
  ],
  'ec-10': [
    { text: '두 문장의 뜻이 같도록 빈칸에 알맞은 것은?\nThis book is thicker than that book. = That book is ______ than this book.', options: ['thicker', 'thiner', 'more thin', 'thinner', 'thinnest'], answer: 4,
      traps: [{ a: 1, note: N_READ }, { a: 2, note: N_ER_DBL }, { a: 3, note: N_MORESHORT }, { a: 5, note: N_THAN }], explain: '이 책이 더 두껍다 = 저 책이 더 얇다 → thinner(n을 한 번 더).' },
    { text: '두 문장의 뜻이 같도록 빈칸에 알맞은 것은?\nMy dog is older than my cat. = My cat is ______ than my dog.', options: ['younger', 'older', 'youngest', 'more young', 'oldest'], answer: 1,
      traps: [{ a: 2, note: N_READ }, { a: 3, note: N_THAN }, { a: 4, note: N_MORESHORT }, { a: 5, note: N_THAN }], explain: '개가 고양이보다 나이가 많다 = 고양이가 더 어리다 → younger.' },
    { text: '두 문장의 뜻이 같도록 빈칸에 알맞은 것은?\nThe bus is slower than the subway. = The subway is ______ than the bus.', options: ['slower', 'fastest', 'more fast', 'fastter', 'faster'], answer: 5,
      traps: [{ a: 1, note: N_READ }, { a: 2, note: N_THAN }, { a: 3, note: N_MORESHORT }], explain: '버스가 지하철보다 느리다 = 지하철이 더 빠르다 → faster.' },
  ],
};
