// 영어 진단 테스트 (중1 · 초4) — 전부 5지선다 객관식, practice:false(제출 후 정답·풀이 비공개)
// 듣기는 1차에서 제외. 지문은 교과서 본문을 쓰지 않고 중1·초4 필수어로 새로 썼다.
// 표기: 줄바꿈 \n, 강조 <b>…</b> (lt-common.js md). '$'는 수식 구간이 되므로 쓰지 않는다.
// 문항 id는 'en-'(중1)·'ee-'(초4)로 시작한다(수학 문항 id·twins.ts 유사 문제와 겹치지 않게).
// 정답 형식·traps는 math_m1.ts 머리말과 같다.

export const ENG_M1_DIAG = {
  id: 'eng-m1-diag',
  title: '중1 영어 진단',
  subtitle: '어휘 · 문법 · 독해 20문항 · 아직 안 배운 문법은 「잘 모르겠어요」',
  minutes: 25,
  passMsg: '지금 교과서 진도를 그대로 따라가면서 과별 어휘·본문 문제지로 기말을 준비하면 돼요.',
  // 영역 한 문항 평균 풀이 시간이 이보다 길면 '속도 느림'(초)
  pace: { '어휘': 30, '문법': 45, '독해': 90 },
  areas: [
    { id: 'v1', group: '어휘', name: '단어 뜻', unit: '중1 교과서 필수 어휘',
      why: '단어를 모르면 문법·독해 문제를 읽는 것부터 막혀요.',
      study: ['EBS 중학 프리미엄 「교과서 영어」 해당 과 어휘 강의', '하루 10분, 교과서 과별 단어 20개를 영→한·한→영 양쪽으로 확인'] },
    { id: 'v2', group: '어휘', name: '문장 속 단어 쓰임', unit: '중1 교과서 필수 어휘·숙어',
      why: '시험은 단어 뜻보다 「문장에 맞는 단어 고르기」로 많이 나와요.',
      study: ['교과서 본문에서 단어가 들어간 문장째로 외우기', 'turn off, put on 같은 동사+단어 묶음은 예문과 함께 정리'] },
    { id: 'g1', group: '문법', name: 'be동사·일반동사 현재', unit: '중1 1학기 「be동사·일반동사」',
      why: '모든 문장의 뼈대예요. 3인칭 단수 -s, do/does 실수가 서술형 감점 1순위예요.',
      study: ['EBS 중학 프리미엄 중1 영어 문법 「be동사와 일반동사」 강의', '주어가 He/She/It·한 사람이면 동사에 -s, 부정·의문은 does + 동사원형'] },
    { id: 'g2', group: '문법', name: '시제 (현재진행·과거)', unit: '중1 「현재진행형·과거시제」',
      why: '독해 지문의 대부분이 과거 이야기예요. 불규칙 과거형을 모르면 지문이 안 읽혀요.',
      study: ['EBS 중학 프리미엄 중1 영어 문법 「진행형·과거시제」 강의', '불규칙 동사표(go-went, buy-bought, meet-met…) 하루 10개씩'] },
    { id: 'g3', group: '문법', name: '조동사·There is/are', unit: '중1 「조동사·There is/are」',
      why: '조동사 뒤 동사원형은 내신 어법 문제 단골이에요.',
      study: ['EBS 중학 프리미엄 중1 영어 문법 「조동사」 강의', 'can/will/must/should 뒤에는 항상 동사원형, There 뒤 be동사는 뒤 명사 수에 맞추기'] },
    { id: 'g4', group: '문법', name: 'to부정사·비교급', unit: '중1 2학기 「to부정사·비교」',
      why: '2학기 기말 범위에 자주 들어가는 문법이에요. 아직 안 배웠다면 「잘 모르겠어요」로 두면 돼요.',
      study: ['EBS 중학 프리미엄 중1 영어 문법 「to부정사」·「비교급」 강의', 'want/hope/plan + to + 동사원형, 비교급 -er / more, y로 끝나면 i로 바꾸고 -er'] },
    { id: 'r1', group: '독해', name: '세부 내용 찾기', unit: '독해 「내용 일치·대화 이해」',
      why: '내신 독해 문제의 절반이 내용 일치예요. 보기와 지문을 하나씩 대조하는 습관이 필요해요.',
      study: ['EBS 중학 프리미엄 「교과서 영어」 본문 강의 후 본문 내용 일치 문제 풀기', '보기마다 지문에서 근거 문장에 밑줄 긋고 고르기'] },
    { id: 'r2', group: '독해', name: '주제·흐름 파악', unit: '독해 「주제·빈칸·무관한 문장」',
      why: '글 전체를 읽고 핵심을 잡는 힘이에요. 중2부터 지문이 길어져요.',
      study: ['EBS 중학 프리미엄 중1 독해 강좌', '글을 읽고 첫 문장·마지막 문장을 우리말로 한 줄 요약해 보기'] },
  ],
  questions: [
    // ── 어휘: 단어 뜻 ──
    { id: 'en-v1-1', area: 'v1', type: 'choice', text: '다음 영어 단어의 뜻으로 알맞은 것은?\nborrow',
      options: ['빌려주다', '빌리다', '돌려주다', '사다', '잃어버리다'], answer: 2,
      traps: [{ a: 1, note: 'borrow(빌리다)와 lend(빌려주다)를 헷갈림' }, { a: 3, note: 'borrow와 return(돌려주다)을 헷갈림' }],
      explain: 'borrow는 「빌리다」, lend는 「빌려주다」예요. Can I borrow your pen? = 펜 좀 빌려도 될까?' },
    { id: 'en-v1-2', area: 'v1', type: 'choice', text: '다음 우리말 뜻에 알맞은 영어 단어는?\n「연습하다」',
      options: ['practice', 'prepare', 'present', 'protect', 'promise'], answer: 1,
      traps: [{ a: 2, note: '철자가 비슷한 prepare(준비하다)와 헷갈림' }],
      explain: 'practice = 연습하다. prepare 준비하다, present 발표하다·선물, protect 보호하다, promise 약속하다.' },
    { id: 'en-v1-3', area: 'v1', type: 'choice', text: '다음 중 서로 반대되는 뜻끼리 짝지어지지 <b>않은</b> 것은?',
      options: ['cheap – expensive', 'arrive – leave', 'same – different', 'quiet – noisy', 'famous – popular'], answer: 5,
      explain: 'famous(유명한)와 popular(인기 있는)는 비슷한 뜻이에요. 나머지는 싼–비싼, 도착하다–떠나다, 같은–다른, 조용한–시끄러운.' },

    // ── 어휘: 문장 속 단어 ──
    { id: 'en-v2-1', area: 'v2', type: 'choice', text: '빈칸에 들어갈 말로 알맞은 것은?\nI was very ______, so I drank a lot of water.',
      options: ['hungry', 'sleepy', 'angry', 'thirsty', 'bored'], answer: 4,
      traps: [{ a: 1, note: 'hungry(배고픈)와 thirsty(목마른)를 헷갈림' }],
      explain: '물을 많이 마셨으니 「목마른」 thirsty. hungry는 배고픈이에요.' },
    { id: 'en-v2-2', area: 'v2', type: 'choice', text: '빈칸에 들어갈 말로 알맞은 것은?\nPlease ______ off your phone in the theater.',
      options: ['turn', 'take', 'get', 'put', 'look'], answer: 1,
      traps: [{ a: 2, note: 'take off(벗다·이륙하다)와 turn off(끄다)를 헷갈림' }],
      explain: '전원을 「끄다」는 turn off, 켜다는 turn on. take off는 옷을 벗다·비행기가 이륙하다예요.' },
    { id: 'en-v2-3', area: 'v2', type: 'choice', text: '다음 영어 설명이 뜻하는 단어는?\na person who works in a hospital and takes care of sick people',
      options: ['farmer', 'pilot', 'chef', 'nurse', 'firefighter'], answer: 4,
      explain: 'hospital(병원)에서 sick people(아픈 사람들)을 돌보는 사람 = nurse(간호사).' },

    // ── 문법: be동사·일반동사 ──
    { id: 'en-g1-1', area: 'g1', type: 'choice', text: '빈칸에 들어갈 말로 알맞은 것은?\nMy brother ______ soccer every Saturday.',
      options: ['play', 'plays', 'playing', 'is play', 'are playing'], answer: 2,
      traps: [{ a: 1, note: '주어가 3인칭 단수인데 동사에 -s를 붙이지 않음' }, { a: 4, note: 'be동사와 일반동사를 함께 씀' }],
      explain: 'My brother는 3인칭 단수, every Saturday는 반복되는 습관 → 현재형 plays.' },
    { id: 'en-g1-2', area: 'g1', type: 'choice', text: '다음 중 어법상 바른 문장은?',
      options: ['She don\'t like carrots.', 'Do your sister have a bike?', 'He doesn\'t watches TV.', 'They doesn\'t live here.', 'Does Mina go to school by bus?'], answer: 5,
      traps: [{ a: 1, note: '3인칭 단수 주어의 부정문에 don\'t를 씀 (doesn\'t)' }, { a: 3, note: 'doesn\'t 뒤에 동사원형을 쓰지 않음' }, { a: 2, note: '3인칭 단수 주어의 의문문에 Do를 씀 (Does)' }, { a: 4, note: '복수 주어(They)에 doesn\'t를 씀' }],
      explain: 'Does + 주어 + 동사원형 → Does Mina go …? ① doesn\'t ② Does ③ doesn\'t watch ④ don\'t 로 고쳐야 해요.' },

    // ── 문법: 시제 ──
    { id: 'en-g2-1', area: 'g2', type: 'choice', text: '빈칸에 들어갈 말로 알맞은 것은?\nLook! The children ______ in the pool now.',
      options: ['are swimming', 'swims', 'swim', 'is swimming', 'swam'], answer: 1,
      traps: [{ a: 4, note: 'children(복수)인데 is를 씀' }, { a: 3, note: 'Look!·now(지금 하고 있는 일)를 보고 현재진행형을 떠올리지 못함' }, { a: 5, note: 'now가 있는데 과거형을 씀' }],
      explain: 'Look!, now → 지금 하고 있는 일 = 현재진행형(be동사 + -ing). children은 복수라서 are swimming.' },
    { id: 'en-g2-2', area: 'g2', type: 'choice', text: '다음 중 어법상 바른 문장은?',
      options: ['I goed to the park yesterday.', 'She buyed a new bag last week.', 'We meet him two days ago.', 'He wrote a letter last night.', 'They was at home yesterday.'], answer: 4,
      traps: [{ a: 1, note: '불규칙 동사(go-went)에 -ed를 붙임' }, { a: 2, note: '불규칙 동사(buy-bought)에 -ed를 붙임' }, { a: 3, note: 'ago(과거)가 있는데 현재형을 씀' }, { a: 5, note: '복수 주어(They)에 was를 씀 (were)' }],
      explain: 'write의 과거형은 wrote. ① went ② bought ③ met ④ (바름) ⑤ were 로 고쳐야 해요.' },

    // ── 문법: 조동사·There is/are ──
    { id: 'en-g3-1', area: 'g3', type: 'choice', text: '빈칸에 들어갈 말로 알맞은 것은?\nThere ______ three apples in the basket.',
      options: ['is', 'am', 'be', 'are', 'have'], answer: 4,
      traps: [{ a: 1, note: 'There 뒤 be동사를 뒤 명사(three apples, 복수)에 맞추지 않음' }, { a: 5, note: '우리말 「있다」를 그대로 have로 옮김' }],
      explain: 'There is + 단수, There are + 복수. three apples는 복수라서 are.' },
    { id: 'en-g3-2', area: 'g3', type: 'choice', text: '다음 중 어법상 <b>틀린</b> 문장은?',
      options: ['You must wear a helmet.', 'Can you help me?', 'She can speaks Chinese.', 'I will visit my grandma tomorrow.', 'We should not run here.'], answer: 3,
      explain: '조동사(can, will, must, should) 뒤에는 동사원형. She can speak Chinese. 가 맞아요.' },

    // ── 문법: to부정사·비교급 ──
    { id: 'en-g4-1', area: 'g4', type: 'choice', text: '빈칸에 들어갈 말로 알맞은 것은?\nI want ______ a doctor in the future.',
      options: ['be', 'to be', 'being', 'am', 'to being'], answer: 2,
      traps: [{ a: 3, note: 'want 뒤에 동명사(-ing)를 씀 (want + to부정사)' }, { a: 1, note: 'want 뒤에 to 없이 동사원형을 씀' }, { a: 5, note: 'to 뒤에 -ing를 씀 (to + 동사원형)' }],
      explain: 'want + to + 동사원형 = ~하기를 원하다. I want to be a doctor.' },
    { id: 'en-g4-2', area: 'g4', type: 'choice', text: '빈칸에 들어갈 말로 알맞은 것은?\nThis box is ______ than that one.',
      options: ['heavier', 'heavyer', 'heavy', 'more heavy', 'heaviest'], answer: 1,
      traps: [{ a: 2, note: '자음+y로 끝나는 말은 y를 i로 바꾸고 -er (heavier)' }, { a: 4, note: '짧은 형용사에 more를 붙임' }, { a: 5, note: 'than(~보다)이 있는데 최상급을 씀' }],
      explain: 'than이 있으면 비교급. heavy → heavier (y를 i로 바꾸고 -er).' },

    // ── 독해: 세부 내용 ──
    { id: 'en-r1-1', area: 'r1', type: 'choice',
      text: '다음 안내문의 내용과 일치하지 <b>않는</b> 것은?\n\n[Science Club]\nDo you like doing experiments? Join our Science Club!\n· When: Every Wednesday, 3:30 p.m.\n· Where: Science Room 2\n· What to bring: a notebook and a pen\nPlease sign up at the teachers\' office by October 31.',
      options: ['실험을 좋아하는 학생을 모집한다.', '매주 수요일에 모인다.', '과학실 2에서 모인다.', '공책과 펜을 가져와야 한다.', '10월 31일까지 교실에서 신청한다.'], answer: 5,
      explain: 'sign up at the teachers\' office = 교무실에서 신청해요. 교실(classroom)이 아니에요.' },
    { id: 'en-r1-2', area: 'r1', type: 'choice',
      text: '다음 글을 읽고 Jiho에 대해 알 수 <b>없는</b> 것은?\n\nHi, I\'m Jiho. I\'m 13 years old. I live in Busan with my parents and my little sister. I love animals, so I have two dogs. On weekends, I walk them along the beach. I want to be a vet in the future.',
      options: ['나이', '사는 곳', '기르는 동물', '좋아하는 음식', '주말에 하는 일'], answer: 4,
      explain: '13살(나이), Busan(사는 곳), two dogs(기르는 동물), 주말에 해변에서 개 산책(주말에 하는 일)은 나오지만 좋아하는 음식은 없어요.' },
    { id: 'en-r1-3', area: 'r1', type: 'choice',
      text: '다음 대화를 읽고 질문에 알맞은 답을 고르면?\n\nA: Mina, what are you going to do this Saturday?\nB: I\'m going to see a movie with Yuna. How about you?\nA: I\'m going to visit my uncle\'s farm. I\'ll pick strawberries there.\nB: Sounds fun!\n\nQ. What is Mina going to do this Saturday?',
      options: ['She is going to visit a farm.', 'She is going to pick strawberries.', 'She is going to see a movie.', 'She is going to meet her uncle.', 'She is going to study with Yuna.'], answer: 3,
      traps: [{ a: 1, note: '대화에서 누가 Mina인지 확인하지 않음 (A가 할 일을 고름)' }, { a: 2, note: '대화에서 누가 Mina인지 확인하지 않음 (A가 할 일을 고름)' }, { a: 4, note: '대화에서 누가 Mina인지 확인하지 않음 (A가 할 일을 고름)' }],
      explain: 'A가 「Mina,」 하고 부르니 B가 Mina예요. B는 Yuna와 영화를 보러 가요. 농장·딸기는 A의 계획이에요.' },

    // ── 독해: 주제·흐름 ──
    { id: 'en-r2-1', area: 'r2', type: 'choice',
      text: '다음 글의 주제로 가장 알맞은 것은?\n\nSleep is very important for teenagers. When you sleep well, your body grows and your brain remembers what you learned. If you don\'t sleep enough, you can feel tired and get angry easily. So try to go to bed early and sleep for about eight or nine hours.',
      options: ['청소년의 성장 과정', '잠을 충분히 자는 것의 중요성', '공부를 잘하는 방법', '화를 참는 방법', '아침 식사의 중요성'], answer: 2,
      traps: [{ a: 1, note: '글의 일부 내용(body grows)만 보고 주제로 고름' }, { a: 3, note: '글의 일부 내용(brain remembers)만 보고 주제로 고름' }, { a: 4, note: '글의 일부 내용(get angry)만 보고 주제로 고름' }],
      explain: '첫 문장 Sleep is very important와 마지막 문장(일찍 자고 8~9시간 자라)이 핵심 → 충분한 잠의 중요성.' },
    { id: 'en-r2-2', area: 'r2', type: 'choice',
      text: '다음 글의 빈칸에 들어갈 말로 가장 알맞은 것은?\n\nMy grandmother lives alone in the countryside. She can\'t see well, so reading is hard for her. Every Sunday, I call her and read stories from the newspaper to her. She always says, "Thank you. Your voice makes me ______."',
      options: ['tired', 'sad', 'angry', 'scared', 'happy'], answer: 5,
      traps: [{ a: 2, note: '앞부분(혼자 사심, 잘 못 보심)만 보고 고름 — Thank you 뒤 흐름을 놓침' }],
      explain: '할머니가 Thank you라고 하시니 목소리가 할머니를 「행복하게」 해요. make + 사람 + happy = ~를 행복하게 하다.' },
    { id: 'en-r2-3', area: 'r2', type: 'choice',
      text: '다음 글에서 전체 흐름과 관계<b>없는</b> 문장은?\n\nThere are many ways to save water at home. ① Turn off the water while you brush your teeth. ② Take a short shower instead of a bath. ③ Water is also important for plants and animals. ④ Fix leaky faucets quickly. ⑤ Wash vegetables in a bowl, not under running water.',
      options: ['①', '②', '③', '④', '⑤'], answer: 3,
      explain: '글은 집에서 물을 아끼는 방법이에요. ③ 「물은 동식물에게도 중요하다」는 아끼는 방법이 아니에요.' },
  ],
};

export const ENG_E4_DIAG = {
  id: 'eng-e4-diag',
  title: '초4 영어 진단',
  subtitle: '단어 · 문장 · 끝까지 읽기 15문항',
  minutes: 15,
  passMsg: '학원 진도를 그대로 이어가면 돼요. 숙제 없는 날에 단어 문제지만 가볍게 풀어요.',
  pace: { '어휘': 25, '문장': 30, '읽기': 60 },
  areas: [
    { id: 'w1', group: '어휘', name: '필수 단어', unit: '초3·4 영어 필수 단어',
      why: '단어를 알아야 문장과 글이 읽혀요.',
      study: ['EBS 초등 「초등 영어 4학년」 단어 복습', '하루 5개, 소리 내어 읽고 뜻 말하기 (학원 단어와 겹치면 학원 것만)'] },
    { id: 's1', group: '문장', name: '기본 문장', unit: '초3·4 「be동사·일반동사·현재진행」',
      why: '중학교 문법의 첫 단계예요.',
      study: ['EBS 초등 「초등 영어 4학년」 교과서 강의', 'I am / She is / They are, She likes … 처럼 주어에 맞는 동사 말해 보기'] },
    { id: 'r1', group: '읽기', name: '끝까지 읽기', unit: '짧은 글·대화 이해',
      why: '앞부분만 읽고 고르면 틀리는 문제예요. 마지막 문장과 질문을 꼭 확인해요.',
      study: ['문제와 글을 끝까지 읽고, 답의 근거 단어에 손가락 짚기', '질문의 「누가」「언제」에 동그라미 치고 풀기'] },
  ],
  questions: [
    // ── 어휘 ──
    { id: 'ee-w1-1', area: 'w1', type: 'choice', text: '다음 영어 단어의 뜻은?\nkitchen',
      options: ['거실', '침실', '욕실', '정원', '부엌'], answer: 5,
      explain: 'kitchen = 부엌. 거실 living room, 침실 bedroom, 욕실 bathroom, 정원 garden.' },
    { id: 'ee-w1-2', area: 'w1', type: 'choice', text: '「목요일」을 영어로 하면?',
      options: ['Tuesday', 'Saturday', 'Wednesday', 'Thursday', 'Sunday'], answer: 4,
      traps: [{ a: 1, note: 'Tuesday(화요일)와 Thursday(목요일)를 헷갈림' }],
      explain: 'Thursday = 목요일. Tuesday 화요일, Wednesday 수요일, Saturday 토요일, Sunday 일요일.' },
    { id: 'ee-w1-3', area: 'w1', type: 'choice', text: '다음 중 나머지와 종류가 <b>다른</b> 하나는?',
      options: ['apple', 'banana', 'grape', 'carrot', 'orange'], answer: 4,
      explain: 'carrot(당근)은 채소, 나머지는 과일(사과·바나나·포도·오렌지)이에요.' },
    { id: 'ee-w1-4', area: 'w1', type: 'choice', text: '빈칸에 알맞은 말은?\nIt\'s cold. Put on your ______.',
      options: ['jacket', 'sunglasses', 'shorts', 'sandals', 'swimsuit'], answer: 1,
      explain: 'cold(추운) 날에는 jacket(재킷)을 입어요. 나머지는 더운 날 쓰는 것들이에요.' },
    { id: 'ee-w1-5', area: 'w1', type: 'choice', text: '다음 영어 숫자에 맞는 수는?\nfifteen',
      options: ['5', '50', '15', '14', '16'], answer: 3,
      traps: [{ a: 2, note: 'fifteen(15)과 fifty(50)를 헷갈림' }],
      explain: 'fifteen = 15, fifty = 50. -teen은 십몇, -ty는 몇십이에요.' },

    // ── 문장 ──
    { id: 'ee-s1-1', area: 's1', type: 'choice', text: '빈칸에 알맞은 말은?\nI ______ a student.',
      options: ['am', 'is', 'are', 'be', 'do'], answer: 1,
      traps: [{ a: 2, note: 'I와 함께 쓰는 be동사(am)를 모름' }],
      explain: 'I 다음에는 am. I am a student.' },
    { id: 'ee-s1-2', area: 's1', type: 'choice', text: '빈칸에 알맞은 말은?\nShe ______ milk every morning.',
      options: ['drink', 'drinks', 'drinking', 'are drink', 'to drink'], answer: 2,
      traps: [{ a: 1, note: 'She(한 사람) 뒤 동사에 -s를 붙이지 않음' }],
      explain: 'She, He, 한 사람 뒤에는 동사에 -s → drinks.' },
    { id: 'ee-s1-3', area: 's1', type: 'choice', text: '질문에 알맞은 대답은?\nDo you like pizza?',
      options: ['Yes, I am.', 'No, I\'m not.', 'Yes, you do.', 'No, I can\'t.', 'Yes, I do.'], answer: 5,
      traps: [{ a: 1, note: 'Do로 물었는데 be동사(am)로 대답함' }, { a: 2, note: 'Do로 물었는데 be동사로 대답함' }, { a: 3, note: 'you로 물으면 I로 대답해야 함' }],
      explain: 'Do you ~? 에는 Yes, I do. / No, I don\'t. 로 대답해요.' },
    { id: 'ee-s1-4', area: 's1', type: 'choice', text: '빈칸에 알맞은 말은?\nA: What are you doing?\nB: I\'m ______ a book.',
      options: ['read', 'reads', 'reading', 'to read', 'readed'], answer: 3,
      traps: [{ a: 1, note: 'I\'m 뒤에 지금 하는 일은 -ing (reading)' }],
      explain: '지금 하고 있는 일은 am/is/are + -ing. I\'m reading a book.' },
    { id: 'ee-s1-5', area: 's1', type: 'choice', text: '단어를 바르게 늘어놓은 문장은?\n( is / your / What / name )',
      options: ['What name is your?', 'What is your name?', 'Your name is what?', 'Is what your name?', 'What your is name?'], answer: 2,
      explain: '물어보는 말 What + is + your name? = 이름이 뭐니?' },

    // ── 끝까지 읽기 ──
    { id: 'ee-r1-1', area: 'r1', type: 'choice', text: '다음 글의 내용과 <b>다른</b> 것은?\n\nTom has a cat. It is black. Its name is Coco.',
      options: ['Tom은 고양이를 키운다.', '고양이는 검은색이다.', '고양이 이름은 Coco이다.', 'Tom은 개를 키운다.', 'Coco는 Tom의 고양이다.'], answer: 4,
      traps: [{ a: 1, note: '「다른 것」을 묻는데 맞는 내용을 고름 (질문을 끝까지 안 읽음)' }],
      explain: 'Tom has a cat. → 고양이를 키워요. 개(dog)는 나오지 않아요. 질문이 「다른 것」인지 꼭 확인!' },
    { id: 'ee-r1-2', area: 'r1', type: 'choice', text: '대화를 읽고 질문에 답하세요.\n\nA: How\'s the weather today?\nB: It\'s sunny now, but it will rain in the afternoon. Take your umbrella.\n\nQ. 오후 날씨는 어떨까요?',
      options: ['맑음', '눈', '비', '바람', '흐림'], answer: 3,
      traps: [{ a: 1, note: '앞부분(It\'s sunny now)만 읽고 고름 — but 뒤를 놓침' }],
      explain: 'but it will rain in the afternoon → 오후에는 비가 와요. 그래서 우산(umbrella)을 챙기라고 해요.' },
    { id: 'ee-r1-3', area: 'r1', type: 'choice', text: '글을 읽고 질문에 답하세요.\n\nI get up at seven. I eat breakfast at seven thirty. I go to school at eight.\n\nQ. 아침밥을 먹는 시각은?',
      options: ['7시', '7시 30분', '8시', '8시 30분', '6시 30분'], answer: 2,
      traps: [{ a: 1, note: '일어나는 시각과 아침 먹는 시각을 헷갈림' }, { a: 3, note: '학교 가는 시각과 아침 먹는 시각을 헷갈림' }],
      explain: 'I eat breakfast at seven thirty. → 7시 30분. 7시는 일어나는 시각, 8시는 학교 가는 시각이에요.' },
    { id: 'ee-r1-4', area: 'r1', type: 'choice', text: '글을 읽고 질문에 답하세요.\n\nMina\'s birthday is May 5th. Jisu\'s birthday is May 15th.\n\nQ. <b>지수</b>의 생일은?',
      options: ['5월 5일', '5월 15일', '5월 50일', '3월 15일', '5월 25일'], answer: 2,
      traps: [{ a: 1, note: '질문의 이름(지수)을 확인하지 않고 첫 문장(미나)으로 답함' }],
      explain: 'Jisu\'s birthday is May 15th → 5월 15일. 5월 5일은 미나의 생일이에요.' },
    { id: 'ee-r1-5', area: 'r1', type: 'choice', text: '다음 글의 내용과 <b>같은</b> 것은?\n\nI have a brother and a sister. My brother is ten. My sister is six. I am eight.',
      options: ['나는 열 살이다.', '형(오빠)은 여섯 살이다.', '나는 형제가 없다.', '나는 동생이 둘이다.', '여동생은 여섯 살이다.'], answer: 5,
      traps: [{ a: 1, note: '나이(ten, eight)를 사람과 맞춰 읽지 않음' }, { a: 2, note: '나이(ten, six)를 사람과 맞춰 읽지 않음' }],
      explain: 'brother 10살, sister 6살, 나 8살. 그래서 여동생이 6살이 맞아요. 동생은 여동생 한 명뿐이에요.' },
  ],
};

export const ENG_DIAG = [ENG_M1_DIAG, ENG_E4_DIAG];

// 진단 신뢰도 — 빨리 찍은 답·「모르겠어요」가 많으면 점수가 실력을 덜 보여 준다.
// grade() 결과(res)와 lt_attempts.fast_guesses 를 받아 리포트·코치 문구에 쓸 값을 돌려준다.
// fastSec 은 index.ts FAST_SEC(5초)과 같게 둔다.
export function engReliability(res: any, fastGuesses = 0, fastSec = 5) {
  const qs = res.perQ || [], n = qs.length || 1;
  const fast = qs.filter((p: any) => !p.dk && !p.blank && p.sec > 0 && p.sec < fastSec);
  const fastWrong = fast.filter((p: any) => !p.correct).length;
  const dk = qs.filter((p: any) => p.dk).length;
  const fastN = Math.max(fast.length, fastGuesses);
  const level = fastN >= n * 0.25 || fastWrong >= 3 ? 'low' : fastN >= 2 || dk >= n * 0.4 ? 'mid' : 'high';
  const label = { high: '믿을 만함', mid: '참고용', low: '다시 보기 권장' }[level];
  const notes: string[] = [];
  if (fastN) notes.push(`${fastSec}초 안에 고른 답 ${fastN}문항(그중 오답 ${fastWrong})`);
  if (dk) notes.push(`모르겠어요 ${dk}문항`);
  return { level, label, fast: fastN, fastWrong, dk, note: notes.join(' · ') };
}
