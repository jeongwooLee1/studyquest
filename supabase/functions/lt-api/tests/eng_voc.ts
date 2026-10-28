// 초4 영어 어휘 문제지 — 출판사와 상관없는 초3·4 필수 단어(2022 개정 성취기준). 전부 5지선다, practice:true.
//   eng-e4-v1  학교·가족 단어(10): 뜻 알기 · 영어 단어 고르기 · 문장·글 속 단어(끝까지 읽기)
//   eng-e4-v2  음식·동물 단어(10): 뜻 알기 · 영어 단어 고르기·분류 · 문장·글 속 단어(좋아한다/좋아하지 않는다, 누구)
//   eng-e4-v3  시간·날씨·요일 단어(10): 요일·달·계절·날씨·숫자 · 시각 읽기 · 요일 순서 · No 뒤 끝까지 읽기
//   eng-e4-v4  동작·감정 단어(10): 동작·기분·몸 상태 · can't · because · 누가 무엇을
// 다시 풀기용 변형 문항은 ENG_VOC_VARIANTS[원래 문항 id] 에 3개씩(sci_gas.ts·eng_gram.ts 와 같은 형식).
// fastSec: 2 = 단어 하나만 알면 바로 풀리는 문항(뜻 알기·영어 단어 고르기). 찍기 경고를 2초 미만일 때만 띄운다. 문장·글을 읽는 문항은 기본 5초.
// 표기: 줄바꿈 \n, 강조 <b>…</b>. '$'는 쓰지 않는다. 문항 id 는 세트마다 접두어(학교·가족 'ev1-', 음식·동물 'ev2-', 시간·날씨 'ev3-', 동작·감정 'ev4-').

const G = '어휘';
const set = (id: string, title: string, subtitle: string, minutes: number, practice: boolean, areas: any[], questions: any[]) => ({
  id, title, subtitle, minutes, practice, pace: { [G]: 30 }, areas, questions: questions.map((q) => ({ type: 'choice', ...q })),
});

// 오답 습관(원래 문항과 변형 문항이 같은 문구를 쓴다)
const N_MF = '가족 단어의 남자·여자를 헷갈림 (uncle 삼촌 / aunt 이모·고모)';
const N_REL = '가족 관계 단어를 헷갈림 (cousin 사촌, parents 부모님)';
const N_PAIR = '짝이 되는 단어와 헷갈림 (teacher 선생님 – student 학생)';
const N_NEAR = '함께 쓰는 물건과 헷갈림 (desk 책상 – chair 의자, pencil 연필 – eraser 지우개)';
const N_HE_SHE = 'he(남자)·she(여자)에 맞는 가족 단어를 고르지 않음';
const N_WHO = '질문 속 사람을 확인하지 않고 다른 사람의 내용을 고름 (끝까지 읽기)';

const area = (id: string, name: string, why: string, study: string[]) => ({ id, group: G, name, unit: '초3·4 필수 단어', why, study });

export const ENG_E4_V1 = set('eng-e4-v1', '학교·가족 단어', '초4 영어 어휘 · 학교 물건·장소·과목, 가족', 10, true, [
  area('a1', '뜻 알기', '단어를 보고 뜻이 바로 떠올라야 문장이 읽혀요.', ['EBS 초등 「초등 영어 4학년」 단어 복습', '단어 카드 앞(영어)·뒤(우리말)로 하루 5개씩 소리 내어 읽기']),
  area('a2', '영어 단어 고르기', '우리말을 듣고 영어 단어를 떠올리는 연습이 말하기·쓰기의 시작이에요.', ['EBS 초등 「초등 영어 4학년」 단어 복습', '우리말을 보고 영어 단어 말하기, 헷갈린 단어는 짝(책상–의자)으로 같이 외우기']),
  area('a3', '문장·글 속 단어', '문장과 글 속에서 단어를 알아보고, 질문을 끝까지 읽어야 맞힐 수 있어요.', ['짧은 글을 소리 내어 읽고 질문의 「누가」에 동그라미', '답을 고른 뒤 글에서 근거 단어를 손가락으로 짚기']),
], [
  { id: 'ev1-1', fastSec: 2, area: 'a1', text: '다음 영어 단어의 뜻은?\neraser', options: ['연필', '자', '가위', '공책', '지우개'], answer: 5,
    traps: [{ a: 1, note: N_NEAR }], explain: 'eraser = 지우개. 연필 pencil, 자 ruler, 가위 scissors, 공책 notebook.' },
  { id: 'ev1-2', fastSec: 2, area: 'a1', text: '다음 영어 단어의 뜻은?\nplayground', options: ['교실', '도서관', '운동장', '체육관', '식당'], answer: 3,
    explain: 'playground = 운동장(놀이터). 교실 classroom, 도서관 library, 체육관 gym.' },
  { id: 'ev1-3', fastSec: 2, area: 'a1', text: '다음 영어 단어의 뜻은?\naunt', options: ['삼촌', '이모(고모)', '할머니', '사촌', '언니(누나)'], answer: 2,
    traps: [{ a: 1, note: N_MF }], explain: 'aunt = 이모·고모(여자). 삼촌은 uncle(남자).' },
  { id: 'ev1-4', fastSec: 2, area: 'a1', text: '다음 영어 단어의 뜻은?\ncousin', options: ['사촌', '삼촌', '손자', '이웃', '친구'], answer: 1,
    traps: [{ a: 2, note: N_REL }], explain: 'cousin = 사촌. 삼촌은 uncle.' },
  { id: 'ev1-5', fastSec: 2, area: 'a2', text: '「선생님」을 영어로 하면?', options: ['student', 'doctor', 'friend', 'teacher', 'farmer'], answer: 4,
    traps: [{ a: 1, note: N_PAIR }], explain: '선생님 = teacher. student는 학생.' },
  { id: 'ev1-6', fastSec: 2, area: 'a2', text: '「책상」을 영어로 하면?', options: ['chair', 'door', 'window', 'board', 'desk'], answer: 5,
    traps: [{ a: 1, note: N_NEAR }], explain: '책상 = desk. chair는 의자.' },
  { id: 'ev1-7', fastSec: 2, area: 'a2', text: '「음악」 과목을 영어로 하면?', options: ['art', 'math', 'music', 'science', 'English'], answer: 3,
    explain: '음악 = music. 미술 art, 수학 math, 과학 science, 영어 English.' },
  { id: 'ev1-8', area: 'a3', text: '빈칸에 알맞은 말은?\nI read books in the ______.', options: ['library', 'playground', 'kitchen', 'pool', 'gym'], answer: 1,
    explain: '책을 읽는 곳 = library(도서관).' },
  { id: 'ev1-9', area: 'a3', text: '대화의 빈칸에 알맞은 말은?\nA: Who is she?\nB: She is my ______.', options: ['brother', 'father', 'uncle', 'sister', 'grandfather'], answer: 4,
    traps: [{ a: 1, note: N_HE_SHE }, { a: 2, note: N_HE_SHE }, { a: 3, note: N_HE_SHE }, { a: 5, note: N_HE_SHE }],
    explain: 'she(그녀)는 여자 → sister(언니·누나·여동생). 나머지는 모두 남자예요.' },
  { id: 'ev1-10', area: 'a3', text: '글을 읽고 질문에 답하세요.\n\nThis is my family. My dad is a cook. My mom is a teacher. My brother is a student.\n\nQ. <b>엄마</b>의 직업은?',
    options: ['요리사', '선생님', '학생', '의사', '경찰관'], answer: 2,
    traps: [{ a: 1, note: N_WHO }, { a: 3, note: N_WHO }], explain: 'My mom is a teacher. → 선생님. 요리사(cook)는 아빠, 학생은 형(오빠)·남동생이에요.' },
]);

// ── 음식·동물 ──
const N_NOT = '「아닌 것」을 묻는데 맞는 것을 고름 (질문을 끝까지 읽지 않음)';
const N_LIKE = 'like(좋아한다)와 don\'t / doesn\'t like(좋아하지 않는다)를 거꾸로 읽음';

export const ENG_E4_V2 = set('eng-e4-v2', '음식·동물 단어', '초4 영어 어휘 · 과일·채소·음식, 동물', 10, true, [
  area('a1', '뜻 알기', '단어를 보고 뜻이 바로 떠올라야 문장이 읽혀요.', ['EBS 초등 「초등 영어 4학년」 단어 복습', '단어 카드 앞(영어)·뒤(우리말)로 하루 5개씩 소리 내어 읽기']),
  area('a2', '영어 단어 고르기·분류', '우리말을 보고 영어 단어를 떠올리고, 과일·채소·동물로 나눌 수 있어야 해요.', ['EBS 초등 「초등 영어 4학년」 단어 복습', '과일·채소·동물·마실 것 네 칸 표에 아는 단어 써 넣기']),
  area('a3', '문장·글 속 단어', '좋아한다/좋아하지 않는다, 누구의 이야기인지를 끝까지 읽고 골라야 해요.', ['짧은 글에서 don\'t like 에 밑줄, 질문의 사람 이름에 동그라미', '답을 고른 뒤 글에서 근거 단어를 손가락으로 짚기']),
], [
  { id: 'ev2-1', area: 'a1', text: '다음 영어 단어의 뜻은?\nrabbit', options: ['거북', '토끼', '다람쥐', '쥐', '오리'], answer: 2, explain: 'rabbit = 토끼. 거북 turtle, 오리 duck.' },
  { id: 'ev2-2', area: 'a1', text: '다음 영어 단어의 뜻은?\ncarrot', options: ['감자', '양파', '당근', '오이', '옥수수'], answer: 3, explain: 'carrot = 당근. 감자 potato, 양파 onion, 옥수수 corn.' },
  { id: 'ev2-3', area: 'a1', text: '다음 영어 단어의 뜻은?\nbread', options: ['빵', '밥', '국수', '과자', '우유'], answer: 1, explain: 'bread = 빵. 밥 rice, 국수 noodles, 우유 milk.' },
  { id: 'ev2-4', area: 'a1', text: '다음 영어 단어의 뜻은?\ngiraffe', options: ['코끼리', '얼룩말', '하마', '캥거루', '기린'], answer: 5, explain: 'giraffe = 기린. 코끼리 elephant, 얼룩말 zebra.' },
  { id: 'ev2-5', area: 'a2', text: '「사과」를 영어로 하면?', options: ['banana', 'grape', 'peach', 'apple', 'orange'], answer: 4, explain: '사과 = apple. 포도 grape, 복숭아 peach.' },
  { id: 'ev2-6', area: 'a2', text: '「물고기」를 영어로 하면?', options: ['bird', 'frog', 'snake', 'horse', 'fish'], answer: 5, explain: '물고기 = fish. 새 bird, 개구리 frog, 뱀 snake, 말 horse.' },
  { id: 'ev2-7', area: 'a2', text: '다음 중 <b>동물</b>이 <b>아닌</b> 것은?', options: ['lion', 'horse', 'banana', 'sheep', 'cow'], answer: 3,
    traps: [{ a: 1, note: N_NOT }], explain: 'banana(바나나)는 과일. 사자·말·양·소는 동물이에요.' },
  { id: 'ev2-8', area: 'a3', text: '빈칸에 알맞은 말은?\nA monkey likes ______.', options: ['bananas', 'pencils', 'shoes', 'books', 'chairs'], answer: 1, explain: '원숭이(monkey)는 바나나(bananas)를 좋아해요.' },
  { id: 'ev2-9', area: 'a3', text: '글을 읽고 질문에 답하세요.\n\nI like apples. I don\'t like carrots. I like milk.\n\nQ. 내가 <b>좋아하지 않는</b> 것은?', options: ['사과', '당근', '우유', '바나나', '빵'], answer: 2,
    traps: [{ a: 1, note: N_LIKE }, { a: 3, note: N_LIKE }], explain: 'I don\'t like carrots. → 당근. 사과·우유는 좋아해요.' },
  { id: 'ev2-10', area: 'a3', text: '글을 읽고 질문에 답하세요.\n\nI have a dog. My sister has a cat. My friend Jisu has a turtle.\n\nQ. <b>지수</b>가 기르는 동물은?', options: ['개', '고양이', '거북', '토끼', '햄스터'], answer: 3,
    traps: [{ a: 1, note: N_WHO }, { a: 2, note: N_WHO }], explain: 'Jisu has a turtle. → 거북. 개는 나, 고양이는 언니(누나)·여동생이에요.' },
]);

// ── 시간·날씨·요일 ──
const N_DAY = '요일 이름을 헷갈림 (Tuesday 화 / Thursday 목, Saturday 토 / Sunday 일)';
const N_TEEN = '-teen(십몇)과 -ty(몇십)를 헷갈림 (fifteen 15 / fifty 50)';
const N_TIME = '시각 읽기를 헷갈림 (seven thirty = 7시 30분, o\'clock = 정각)';
const N_WEATHER = '날씨 단어를 헷갈림 (rainy 비 / snowy 눈 / cloudy 흐림)';
const N_ORDER = '요일 순서(어제·내일)를 거꾸로 셈';
const N_NO = '「No, it isn\'t.」(아니)를 놓치고 질문에 나온 날씨를 답으로 고름';
const N_WHAT = '질문이 묻는 일·사람을 확인하지 않고 다른 내용을 고름 (끝까지 읽기)';

export const ENG_E4_V3 = set('eng-e4-v3', '시간·날씨·요일 단어', '초4 영어 어휘 · 요일·달·계절, 날씨, 숫자·시각', 10, true, [
  area('a1', '뜻 알기', '요일·날씨·숫자는 매일 쓰는 말이라 바로 떠올라야 해요.', ['EBS 초등 「초등 영어 4학년」 단어 복습', '달력을 보며 요일·달을 영어로 소리 내어 읽기']),
  area('a2', '영어 단어 고르기', '비슷하게 생긴 요일 이름(Tuesday/Thursday)을 구분해야 해요.', ['EBS 초등 「초등 영어 4학년」 단어 복습', '월~일 요일을 순서대로 영어로 써 보기, -teen / -ty 숫자 짝 맞추기']),
  area('a3', '문장·대화 속 단어', '시각·요일 순서를 계산하고, 대화의 No 뒤 내용을 끝까지 읽어야 해요.', ['대화에서 No, Yes 뒤 문장에 밑줄', '질문이 묻는 일(수영? 미술?)에 동그라미 치고 글에서 찾기']),
], [
  { id: 'ev3-1', area: 'a1', text: '다음 영어 단어의 뜻은?\nWednesday', options: ['수요일', '화요일', '월요일', '목요일', '금요일'], answer: 1,
    traps: [{ a: 2, note: N_DAY }, { a: 4, note: N_DAY }], explain: 'Wednesday = 수요일. 화요일 Tuesday, 목요일 Thursday.' },
  { id: 'ev3-2', area: 'a1', text: '다음 영어 단어의 뜻은?\nrainy', options: ['맑은', '눈 오는', '바람 부는', '흐린', '비 오는'], answer: 5,
    traps: [{ a: 2, note: N_WEATHER }], explain: 'rainy = 비 오는(rain 비). 눈 오는 snowy, 흐린 cloudy, 맑은 sunny.' },
  { id: 'ev3-3', area: 'a1', text: '다음 영어 숫자에 맞는 수는?\nforty', options: ['4', '40', '14', '44', '400'], answer: 2,
    traps: [{ a: 3, note: N_TEEN }], explain: 'forty = 40. fourteen = 14.' },
  { id: 'ev3-4', area: 'a1', text: '다음 영어 단어의 뜻은?\nDecember', options: ['10월', '11월', '1월', '12월', '2월'], answer: 4, explain: 'December = 12월. 10월 October, 11월 November.' },
  { id: 'ev3-5', area: 'a2', text: '「일요일」을 영어로 하면?', options: ['Monday', 'Saturday', 'Friday', 'Sunday', 'Tuesday'], answer: 4,
    traps: [{ a: 2, note: N_DAY }], explain: '일요일 = Sunday(sun 해). Saturday는 토요일.' },
  { id: 'ev3-6', area: 'a2', text: '「여름」을 영어로 하면?', options: ['spring', 'winter', 'summer', 'fall', 'sunny'], answer: 3, explain: '여름 = summer. 봄 spring, 가을 fall, 겨울 winter.' },
  { id: 'ev3-7', area: 'a3', text: '다음 시각을 영어로 바르게 나타낸 것은?\n「7시 30분」', options: ['It\'s seven thirteen.', 'It\'s seven thirty.', 'It\'s thirty seven.', 'It\'s seven o\'clock.', 'It\'s three seventy.'], answer: 2,
    traps: [{ a: 1, note: N_TEEN }, { a: 3, note: N_TIME }, { a: 4, note: N_TIME }], explain: '시 → 분 순서로 읽어요. 7시 30분 = seven thirty.' },
  { id: 'ev3-8', area: 'a3', text: '빈칸에 알맞은 요일은?\nToday is Monday. Tomorrow is ______.', options: ['Tuesday', 'Sunday', 'Wednesday', 'Thursday', 'Friday'], answer: 1,
    traps: [{ a: 2, note: N_ORDER }, { a: 4, note: N_DAY }], explain: '오늘 월요일 → 내일(tomorrow)은 화요일 Tuesday.' },
  { id: 'ev3-9', area: 'a3', text: '대화를 읽고 질문에 답하세요.\n\nA: Is it hot in Busan?\nB: No, it isn\'t. It\'s cool and windy.\n\nQ. 부산의 날씨는?', options: ['덥고 맑음', '춥고 눈 옴', '덥고 비 옴', '따뜻하고 흐림', '시원하고 바람 붊'], answer: 5,
    traps: [{ a: 1, note: N_NO }], explain: 'No, it isn\'t.(덥지 않아) It\'s cool and windy. → 시원하고 바람이 불어요.' },
  { id: 'ev3-10', area: 'a3', text: '글을 읽고 질문에 답하세요.\n\nI have piano lessons on Monday. I play soccer on Wednesday. I go swimming on Friday.\n\nQ. <b>수영</b>하러 가는 요일은?', options: ['월요일', '수요일', '금요일', '토요일', '일요일'], answer: 3,
    traps: [{ a: 1, note: N_WHAT }, { a: 2, note: N_WHAT }], explain: 'I go swimming on Friday. → 금요일. 월요일은 피아노, 수요일은 축구예요.' },
]);

// ── 동작·감정 ──
const N_FEEL = '감정 단어를 헷갈림 (happy 기쁜 / sad 슬픈 / angry 화난 / surprised 놀란)';
const N_ACT = '동작 단어를 헷갈림 (run 달리다 / walk 걷다, draw 그리다 / write 쓰다)';
const N_OPP = '반대 뜻의 단어와 헷갈림 (open 열다 / close 닫다, bored 지루한 / excited 신난)';
const N_BODY = '몸 상태 단어를 헷갈림 (hungry 배고픈 / thirsty 목마른 / sleepy 졸린)';
const N_CAN = 'can(할 수 있다)과 can\'t(할 수 없다)를 거꾸로 읽음';

export const ENG_E4_V4 = set('eng-e4-v4', '동작·감정 단어', '초4 영어 어휘 · 움직임, 기분·몸 상태', 10, true, [
  area('a1', '뜻 알기', '동작·기분 단어는 대화와 글에서 가장 자주 나와요.', ['EBS 초등 「초등 영어 4학년」 단어 복습', '단어를 읽으며 몸짓·표정으로 흉내 내기(run, jump, happy, sad)']),
  area('a2', '영어 단어 고르기', '비슷한 동작·기분을 구분해서 골라야 해요.', ['EBS 초등 「초등 영어 4학년」 단어 복습', '반대말 짝(open–close, happy–sad, bored–excited) 카드 만들기']),
  area('a3', '문장·글 속 단어', 'can\'t, because, 누가 무엇을 하는지 끝까지 읽어야 맞힐 수 있어요.', ['글에서 can\'t 와 because 에 밑줄', '질문의 사람 이름에 동그라미 치고 그 사람 문장만 다시 읽기']),
], [
  { id: 'ev4-1', area: 'a1', text: '다음 영어 단어의 뜻은?\nhappy', options: ['슬픈', '기쁜', '화난', '피곤한', '배고픈'], answer: 2,
    traps: [{ a: 1, note: N_FEEL }], explain: 'happy = 기쁜, 행복한. 슬픈 sad, 화난 angry.' },
  { id: 'ev4-2', area: 'a1', text: '다음 영어 단어의 뜻은?\nswim', options: ['달리다', '날다', '헤엄치다', '걷다', '춤추다'], answer: 3, explain: 'swim = 헤엄치다(수영하다). 달리다 run, 날다 fly, 걷다 walk.' },
  { id: 'ev4-3', area: 'a1', text: '다음 영어 단어의 뜻은?\nopen', options: ['닫다', '앉다', '일어서다', '열다', '가다'], answer: 4,
    traps: [{ a: 1, note: N_OPP }], explain: 'open = 열다. 닫다는 close.' },
  { id: 'ev4-4', area: 'a1', text: '다음 영어 단어의 뜻은?\nhungry', options: ['목마른', '배부른', '졸린', '아픈', '배고픈'], answer: 5,
    traps: [{ a: 1, note: N_BODY }], explain: 'hungry = 배고픈. 목마른 thirsty, 배부른 full, 졸린 sleepy.' },
  { id: 'ev4-5', area: 'a2', text: '「노래하다」를 영어로 하면?', options: ['sing', 'dance', 'draw', 'read', 'cook'], answer: 1,
    traps: [{ a: 2, note: N_ACT }], explain: '노래하다 = sing. 춤추다 dance, 그리다 draw.' },
  { id: 'ev4-6', area: 'a2', text: '「무서운(겁먹은)」을 영어로 하면?', options: ['scared', 'sleepy', 'sorry', 'surprised', 'sad'], answer: 1,
    traps: [{ a: 4, note: N_FEEL }, { a: 5, note: N_FEEL }], explain: '무서운·겁먹은 = scared. 놀란 surprised, 슬픈 sad.' },
  { id: 'ev4-7', area: 'a3', text: '빈칸에 알맞은 말은?\nI\'m ______. I want some water.', options: ['hungry', 'thirsty', 'sleepy', 'happy', 'full'], answer: 2,
    traps: [{ a: 1, note: N_BODY }], explain: '물을 마시고 싶다 → thirsty(목마른).' },
  { id: 'ev4-8', area: 'a3', text: '글을 읽고 질문에 답하세요.\n\nI can swim. I can ride a bike. But I can\'t skate.\n\nQ. 내가 <b>할 수 없는</b> 것은?', options: ['수영', '자전거 타기', '스케이트', '달리기', '줄넘기'], answer: 3,
    traps: [{ a: 1, note: N_CAN }, { a: 2, note: N_CAN }], explain: 'But I can\'t skate. → 스케이트. 수영·자전거는 할 수 있어요.' },
  { id: 'ev4-9', area: 'a3', text: '글을 읽고 질문에 답하세요.\n\nMina is sad today because she lost her cat.\n\nQ. 미나가 슬픈 이유는?', options: ['시험을 못 봐서', '감기에 걸려서', '친구와 싸워서', '비가 와서', '고양이를 잃어버려서'], answer: 5,
    explain: 'because(왜냐하면) 뒤가 이유: she lost her cat → 고양이를 잃어버려서.' },
  { id: 'ev4-10', area: 'a3', text: '글을 읽고 질문에 답하세요.\n\nIt\'s Sunday. Dad is cooking. Mom is reading a book. My brother is sleeping.\n\nQ. <b>엄마</b>는 무엇을 하고 있나요?', options: ['요리하기', '책 읽기', '잠자기', '청소하기', '노래하기'], answer: 2,
    traps: [{ a: 1, note: N_WHAT }, { a: 3, note: N_WHAT }], explain: 'Mom is reading a book. → 책 읽기. 요리는 아빠, 잠은 형(오빠·남동생)이에요.' },
]);

export const ENG_VOC_SETS = [ENG_E4_V1, ENG_E4_V2, ENG_E4_V3, ENG_E4_V4];

type V = { fastSec?: number; text: string; options: string[]; answer: number; traps?: { a: number; note: string }[]; explain: string };
export const ENG_VOC_VARIANTS: Record<string, V[]> = {
  'ev1-1': [
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\nruler', options: ['연필', '지우개', '가위', '자', '풀'], answer: 4, explain: 'ruler = 자.' },
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\nscissors', options: ['가위', '풀', '자', '공책', '가방'], answer: 1, explain: 'scissors = 가위. 풀은 glue.' },
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\nnotebook', options: ['교과서', '가방', '필통', '연필', '공책'], answer: 5, explain: 'notebook = 공책. 필통 pencil case, 가방 bag.' },
  ],
  'ev1-2': [
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\nlibrary', options: ['도서관', '교실', '운동장', '강당', '병원'], answer: 1, explain: 'library = 도서관.' },
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\nclassroom', options: ['운동장', '교실', '도서관', '화장실', '강당'], answer: 2, explain: 'classroom = 교실(class 수업 + room 방).' },
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\ngym', options: ['식당', '교실', '도서관', '체육관', '운동장'], answer: 4, explain: 'gym = 체육관.' },
  ],
  'ev1-3': [
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\nuncle', options: ['이모(고모)', '할아버지', '삼촌', '사촌', '형(오빠)'], answer: 3,
      traps: [{ a: 1, note: N_MF }], explain: 'uncle = 삼촌(남자). 이모·고모는 aunt.' },
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\ngrandfather', options: ['할머니', '아빠', '삼촌', '아기', '할아버지'], answer: 5,
      traps: [{ a: 1, note: N_MF }], explain: 'grandfather = 할아버지. 할머니는 grandmother.' },
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\ngrandmother', options: ['할아버지', '엄마', '할머니', '이모(고모)', '아기'], answer: 3,
      traps: [{ a: 1, note: N_MF }], explain: 'grandmother = 할머니. 할아버지는 grandfather.' },
  ],
  'ev1-4': [
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\nparents', options: ['형제', '부모님', '조부모님', '친척', '아이들'], answer: 2,
      traps: [{ a: 3, note: N_REL }], explain: 'parents = 부모님(엄마와 아빠). 조부모님은 grandparents.' },
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\nbaby', options: ['어린이', '소년', '아기', '소녀', '학생'], answer: 3, explain: 'baby = 아기. 소년 boy, 소녀 girl.' },
    { fastSec: 2, text: '다음 영어 단어의 뜻은?\ngrandparents', options: ['부모님', '형제자매', '사촌', '조부모님', '삼촌'], answer: 4,
      traps: [{ a: 1, note: N_REL }], explain: 'grandparents = 조부모님(할머니·할아버지). 부모님은 parents.' },
  ],
  'ev1-5': [
    { fastSec: 2, text: '「학생」을 영어로 하면?', options: ['student', 'teacher', 'nurse', 'pilot', 'singer'], answer: 1,
      traps: [{ a: 2, note: N_PAIR }], explain: '학생 = student. teacher는 선생님.' },
    { fastSec: 2, text: '「친구」를 영어로 하면?', options: ['family', 'teacher', 'friend', 'student', 'baby'], answer: 3, explain: '친구 = friend. family는 가족.' },
    { fastSec: 2, text: '「남동생(형·오빠)」을 영어로 하면?', options: ['sister', 'mother', 'father', 'brother', 'uncle'], answer: 4,
      traps: [{ a: 1, note: N_PAIR }], explain: '남자 형제 = brother. 여자 형제는 sister.' },
  ],
  'ev1-6': [
    { fastSec: 2, text: '「의자」를 영어로 하면?', options: ['chair', 'desk', 'bed', 'table', 'door'], answer: 1,
      traps: [{ a: 2, note: N_NEAR }], explain: '의자 = chair. desk는 책상.' },
    { fastSec: 2, text: '「창문」을 영어로 하면?', options: ['door', 'wall', 'board', 'window', 'desk'], answer: 4,
      traps: [{ a: 1, note: N_NEAR }], explain: '창문 = window. door는 문.' },
    { fastSec: 2, text: '「가방」을 영어로 하면?', options: ['box', 'book', 'pencil case', 'cap', 'bag'], answer: 5, explain: '가방 = bag. pencil case는 필통.' },
  ],
  'ev1-7': [
    { fastSec: 2, text: '「미술」 과목을 영어로 하면?', options: ['art', 'music', 'P.E.', 'math', 'science'], answer: 1, explain: '미술 = art. 체육은 P.E.' },
    { fastSec: 2, text: '「수학」 과목을 영어로 하면?', options: ['music', 'art', 'science', 'math', 'Korean'], answer: 4, explain: '수학 = math. 국어는 Korean.' },
    { fastSec: 2, text: '「과학」 과목을 영어로 하면?', options: ['math', 'science', 'art', 'music', 'English'], answer: 2, explain: '과학 = science.' },
  ],
  'ev1-8': [
    { text: '빈칸에 알맞은 말은?\nWe play soccer on the ______.', options: ['library', 'classroom', 'bathroom', 'playground', 'kitchen'], answer: 4,
      explain: '축구를 하는 곳 = playground(운동장).' },
    { text: '빈칸에 알맞은 말은?\nI write with a ______.', options: ['eraser', 'pencil', 'ruler', 'desk', 'bag'], answer: 2,
      traps: [{ a: 1, note: N_NEAR }], explain: '글씨를 쓰는 것 = pencil(연필). eraser는 지울 때 써요.' },
    { text: '빈칸에 알맞은 말은?\nMy mother\'s brother is my ______.', options: ['aunt', 'cousin', 'uncle', 'grandfather', 'sister'], answer: 3,
      traps: [{ a: 1, note: N_MF }, { a: 2, note: N_REL }], explain: '엄마의 남자 형제 = 외삼촌 → uncle.' },
  ],
  'ev1-9': [
    { text: '대화의 빈칸에 알맞은 말은?\nA: Who is he?\nB: He is my ______.', options: ['mother', 'aunt', 'sister', 'grandmother', 'father'], answer: 5,
      traps: [{ a: 1, note: N_HE_SHE }, { a: 2, note: N_HE_SHE }, { a: 3, note: N_HE_SHE }, { a: 4, note: N_HE_SHE }], explain: 'he(그)는 남자 → father(아빠).' },
    { text: '대화의 빈칸에 알맞은 말은?\nA: Who is this woman?\nB: She is my ______.', options: ['grandmother', 'uncle', 'father', 'brother', 'grandfather'], answer: 1,
      traps: [{ a: 2, note: N_HE_SHE }, { a: 3, note: N_HE_SHE }, { a: 4, note: N_HE_SHE }, { a: 5, note: N_HE_SHE }], explain: 'woman(여자)·she → grandmother(할머니).' },
    { text: '대화의 빈칸에 알맞은 말은?\nA: Who is that man?\nB: He is my ______.', options: ['aunt', 'uncle', 'mother', 'sister', 'grandmother'], answer: 2,
      traps: [{ a: 1, note: N_HE_SHE }, { a: 3, note: N_HE_SHE }, { a: 4, note: N_HE_SHE }, { a: 5, note: N_HE_SHE }], explain: 'man(남자)·he → uncle(삼촌).' },
  ],
  'ev1-10': [
    { text: '글을 읽고 질문에 답하세요.\n\nMy grandpa is a farmer. My aunt is a nurse. My cousin is a singer.\n\nQ. <b>이모(고모)</b>의 직업은?', options: ['농부', '가수', '의사', '간호사', '선생님'], answer: 4,
      traps: [{ a: 1, note: N_WHO }, { a: 2, note: N_WHO }], explain: 'My aunt is a nurse. → 간호사. 농부는 할아버지, 가수는 사촌이에요.' },
    { text: '글을 읽고 질문에 답하세요.\n\nI have a big family. My grandma is 70. My dad is 45. My sister is 15.\n\nQ. <b>아빠</b>의 나이는?', options: ['70살', '15살', '45살', '40살', '50살'], answer: 3,
      traps: [{ a: 1, note: N_WHO }, { a: 2, note: N_WHO }], explain: 'My dad is 45. → 45살. 70살은 할머니, 15살은 언니(누나)예요.' },
    { text: '글을 읽고 질문에 답하세요.\n\nMy uncle lives in Busan. My aunt lives in Seoul. My grandparents live in Jeju.\n\nQ. <b>삼촌</b>이 사는 곳은?', options: ['부산', '서울', '제주', '대구', '인천'], answer: 1,
      traps: [{ a: 2, note: N_WHO }, { a: 3, note: N_WHO }], explain: 'My uncle lives in Busan. → 부산. 서울은 이모(고모), 제주는 조부모님이에요.' },
  ],
  'ev2-1': [
    { text: '다음 영어 단어의 뜻은?\nturtle', options: ['토끼', '오리', '거북', '개구리', '뱀'], answer: 3, explain: 'turtle = 거북.' },
    { text: '다음 영어 단어의 뜻은?\nduck', options: ['닭', '고양이', '거위', '펭귄', '오리'], answer: 5, explain: 'duck = 오리. 닭 chicken, 거위 goose.' },
    { text: '다음 영어 단어의 뜻은?\nmonkey', options: ['원숭이', '곰', '사자', '호랑이', '기린'], answer: 1, explain: 'monkey = 원숭이.' },
  ],
  'ev2-2': [
    { text: '다음 영어 단어의 뜻은?\npotato', options: ['감자', '고구마', '당근', '양파', '토마토'], answer: 1, explain: 'potato = 감자.' },
    { text: '다음 영어 단어의 뜻은?\nonion', options: ['오이', '양파', '마늘', '당근', '감자'], answer: 2, explain: 'onion = 양파.' },
    { text: '다음 영어 단어의 뜻은?\ncorn', options: ['쌀', '콩', '밀', '옥수수', '감자'], answer: 4, explain: 'corn = 옥수수.' },
  ],
  'ev2-3': [
    { text: '다음 영어 단어의 뜻은?\nmilk', options: ['물', '주스', '우유', '차', '콜라'], answer: 3, explain: 'milk = 우유. 물 water, 차 tea.' },
    { text: '다음 영어 단어의 뜻은?\nrice', options: ['빵', '국수', '떡', '밥(쌀)', '죽'], answer: 4, explain: 'rice = 밥, 쌀.' },
    { text: '다음 영어 단어의 뜻은?\nnoodles', options: ['밥', '빵', '수프', '피자', '국수'], answer: 5, explain: 'noodles = 국수. 수프 soup.' },
  ],
  'ev2-4': [
    { text: '다음 영어 단어의 뜻은?\nelephant', options: ['코끼리', '기린', '하마', '코뿔소', '곰'], answer: 1, explain: 'elephant = 코끼리.' },
    { text: '다음 영어 단어의 뜻은?\nzebra', options: ['말', '당나귀', '얼룩말', '기린', '소'], answer: 3, explain: 'zebra = 얼룩말. 말은 horse.' },
    { text: '다음 영어 단어의 뜻은?\ntiger', options: ['사자', '표범', '곰', '호랑이', '늑대'], answer: 4, explain: 'tiger = 호랑이. 사자는 lion.' },
  ],
  'ev2-5': [
    { text: '「포도」를 영어로 하면?', options: ['grape', 'strawberry', 'pear', 'melon', 'lemon'], answer: 1, explain: '포도 = grape. 배 pear.' },
    { text: '「딸기」를 영어로 하면?', options: ['cherry', 'watermelon', 'strawberry', 'tomato', 'kiwi'], answer: 3, explain: '딸기 = strawberry. 체리 cherry.' },
    { text: '「수박」을 영어로 하면?', options: ['melon', 'lemon', 'mango', 'peach', 'watermelon'], answer: 5, explain: '수박 = watermelon(water 물 + melon).' },
  ],
  'ev2-6': [
    { text: '「새」를 영어로 하면?', options: ['bird', 'bear', 'bee', 'bat', 'bug'], answer: 1, explain: '새 = bird. 곰 bear, 벌 bee, 박쥐 bat, 벌레 bug.' },
    { text: '「돼지」를 영어로 하면?', options: ['cow', 'sheep', 'pig', 'dog', 'hen'], answer: 3, explain: '돼지 = pig. 소 cow, 양 sheep, 암탉 hen.' },
    { text: '「곰」을 영어로 하면?', options: ['bee', 'bird', 'pig', 'bear', 'bat'], answer: 4, explain: '곰 = bear.' },
  ],
  'ev2-7': [
    { text: '다음 중 <b>과일</b>이 <b>아닌</b> 것은?', options: ['apple', 'pear', 'cherry', 'lemon', 'potato'], answer: 5,
      traps: [{ a: 1, note: N_NOT }], explain: 'potato(감자)는 채소. 사과·배·체리·레몬은 과일이에요.' },
    { text: '다음 중 <b>채소</b>가 <b>아닌</b> 것은?', options: ['carrot', 'onion', 'grape', 'potato', 'corn'], answer: 3,
      traps: [{ a: 1, note: N_NOT }], explain: 'grape(포도)는 과일. 당근·양파·감자·옥수수는 채소예요.' },
    { text: '다음 중 <b>마실 것</b>이 <b>아닌</b> 것은?', options: ['milk', 'water', 'juice', 'bread', 'tea'], answer: 4,
      traps: [{ a: 1, note: N_NOT }], explain: 'bread(빵)는 먹는 것. 우유·물·주스·차는 마시는 것이에요.' },
  ],
  'ev2-8': [
    { text: '빈칸에 알맞은 말은?\nCows give us ______.', options: ['juice', 'milk', 'bread', 'eggs', 'rice'], answer: 2, explain: '소(cows)는 우유(milk)를 줘요.' },
    { text: '빈칸에 알맞은 말은?\nHens give us ______.', options: ['milk', 'juice', 'apples', 'eggs', 'shoes'], answer: 4, explain: '암탉(hens)은 달걀(eggs)을 낳아요.' },
    { text: '빈칸에 알맞은 말은?\nI\'m hungry. I want some ______.', options: ['water', 'sleep', 'pizza', 'shoes', 'music'], answer: 3, explain: 'hungry(배고픈) → 먹을 것 pizza.' },
  ],
  'ev2-9': [
    { text: '글을 읽고 질문에 답하세요.\n\nMina likes dogs. She doesn\'t like cats. She likes rabbits.\n\nQ. 미나가 <b>좋아하지 않는</b> 동물은?', options: ['개', '토끼', '고양이', '새', '물고기'], answer: 3,
      traps: [{ a: 1, note: N_LIKE }, { a: 2, note: N_LIKE }], explain: 'She doesn\'t like cats. → 고양이.' },
    { text: '글을 읽고 질문에 답하세요.\n\nMy brother doesn\'t like fish. He likes chicken and pizza.\n\nQ. 형(오빠·남동생)이 <b>좋아하지 않는</b> 음식은?', options: ['생선', '치킨', '피자', '빵', '밥'], answer: 1,
      traps: [{ a: 2, note: N_LIKE }, { a: 3, note: N_LIKE }], explain: 'He doesn\'t like fish. → 생선. 치킨·피자는 좋아해요.' },
    { text: '글을 읽고 질문에 답하세요.\n\nI like summer. I like watermelons. But I don\'t like bugs.\n\nQ. 내가 <b>좋아하지 않는</b> 것은?', options: ['여름', '수박', '바다', '아이스크림', '벌레'], answer: 5,
      traps: [{ a: 1, note: N_LIKE }, { a: 2, note: N_LIKE }], explain: 'But I don\'t like bugs. → 벌레. 여름·수박은 좋아해요.' },
  ],
  'ev2-10': [
    { text: '글을 읽고 질문에 답하세요.\n\nDad likes coffee. Mom likes tea. I like hot chocolate.\n\nQ. <b>엄마</b>가 좋아하는 것은?', options: ['커피', '차', '핫초코', '우유', '주스'], answer: 2,
      traps: [{ a: 1, note: N_WHO }, { a: 3, note: N_WHO }], explain: 'Mom likes tea. → 차. 커피는 아빠, 핫초코는 나예요.' },
    { text: '글을 읽고 질문에 답하세요.\n\nTom eats bread for breakfast. Ben eats rice. Sam eats cereal.\n\nQ. <b>벤(Ben)</b>이 아침에 먹는 것은?', options: ['밥', '빵', '시리얼', '국수', '과일'], answer: 1,
      traps: [{ a: 2, note: N_WHO }, { a: 3, note: N_WHO }], explain: 'Ben eats rice. → 밥. 빵은 Tom, 시리얼은 Sam이에요.' },
    { text: '글을 읽고 질문에 답하세요.\n\nMy grandma has three hens. My grandpa has two cows. My uncle has a horse.\n\nQ. <b>할아버지</b>가 기르는 동물은?', options: ['암탉', '말', '개', '소', '돼지'], answer: 4,
      traps: [{ a: 1, note: N_WHO }, { a: 2, note: N_WHO }], explain: 'My grandpa has two cows. → 소. 암탉은 할머니, 말은 삼촌이에요.' },
  ],
  'ev3-1': [
    { text: '다음 영어 단어의 뜻은?\nThursday', options: ['월요일', '화요일', '수요일', '목요일', '토요일'], answer: 4,
      traps: [{ a: 2, note: N_DAY }], explain: 'Thursday = 목요일. Tuesday는 화요일.' },
    { text: '다음 영어 단어의 뜻은?\nTuesday', options: ['화요일', '목요일', '수요일', '일요일', '금요일'], answer: 1,
      traps: [{ a: 2, note: N_DAY }], explain: 'Tuesday = 화요일. Thursday는 목요일.' },
    { text: '다음 영어 단어의 뜻은?\nSaturday', options: ['일요일', '금요일', '월요일', '목요일', '토요일'], answer: 5,
      traps: [{ a: 1, note: N_DAY }], explain: 'Saturday = 토요일. Sunday는 일요일.' },
  ],
  'ev3-2': [
    { text: '다음 영어 단어의 뜻은?\ncloudy', options: ['맑은', '비 오는', '흐린', '바람 부는', '더운'], answer: 3,
      traps: [{ a: 2, note: N_WEATHER }], explain: 'cloudy = 흐린(cloud 구름).' },
    { text: '다음 영어 단어의 뜻은?\nwindy', options: ['바람 부는', '눈 오는', '흐린', '추운', '비 오는'], answer: 1, explain: 'windy = 바람 부는(wind 바람).' },
    { text: '다음 영어 단어의 뜻은?\nsnowy', options: ['비 오는', '맑은', '바람 부는', '눈 오는', '따뜻한'], answer: 4,
      traps: [{ a: 1, note: N_WEATHER }], explain: 'snowy = 눈 오는(snow 눈).' },
  ],
  'ev3-3': [
    { text: '다음 영어 숫자에 맞는 수는?\nthirteen', options: ['3', '13', '30', '33', '31'], answer: 2,
      traps: [{ a: 3, note: N_TEEN }], explain: 'thirteen = 13. thirty = 30.' },
    { text: '다음 영어 숫자에 맞는 수는?\nsixty', options: ['6', '16', '66', '600', '60'], answer: 5,
      traps: [{ a: 2, note: N_TEEN }], explain: 'sixty = 60. sixteen = 16.' },
    { text: '다음 영어 숫자에 맞는 수는?\neighteen', options: ['18', '80', '8', '88', '81'], answer: 1,
      traps: [{ a: 2, note: N_TEEN }], explain: 'eighteen = 18. eighty = 80.' },
  ],
  'ev3-4': [
    { text: '다음 영어 단어의 뜻은?\nMarch', options: ['3월', '5월', '4월', '1월', '6월'], answer: 1, explain: 'March = 3월. 4월 April, 5월 May.' },
    { text: '다음 영어 단어의 뜻은?\nAugust', options: ['4월', '8월', '6월', '7월', '10월'], answer: 2, explain: 'August = 8월. 7월 July, 6월 June.' },
    { text: '다음 영어 단어의 뜻은?\nMay', options: ['3월', '4월', '6월', '7월', '5월'], answer: 5, explain: 'May = 5월.' },
  ],
  'ev3-5': [
    { text: '「금요일」을 영어로 하면?', options: ['Friday', 'Monday', 'Sunday', 'Thursday', 'Tuesday'], answer: 1,
      traps: [{ a: 4, note: N_DAY }], explain: '금요일 = Friday.' },
    { text: '「월요일」을 영어로 하면?', options: ['Sunday', 'Tuesday', 'Monday', 'Wednesday', 'Friday'], answer: 3,
      traps: [{ a: 1, note: N_DAY }], explain: '월요일 = Monday(moon 달).' },
    { text: '「토요일」을 영어로 하면?', options: ['Sunday', 'Thursday', 'Tuesday', 'Saturday', 'Friday'], answer: 4,
      traps: [{ a: 1, note: N_DAY }], explain: '토요일 = Saturday. Sunday는 일요일.' },
  ],
  'ev3-6': [
    { text: '「겨울」을 영어로 하면?', options: ['winter', 'summer', 'spring', 'snowy', 'fall'], answer: 1, explain: '겨울 = winter. snowy는 「눈 오는」.' },
    { text: '「봄」을 영어로 하면?', options: ['summer', 'fall', 'winter', 'spring', 'sunny'], answer: 4, explain: '봄 = spring.' },
    { text: '「가을」을 영어로 하면?', options: ['spring', 'summer', 'winter', 'windy', 'fall'], answer: 5, explain: '가을 = fall(autumn 이라고도 해요).' },
  ],
  'ev3-7': [
    { text: '다음 시각을 영어로 바르게 나타낸 것은?\n「9시」', options: ['It\'s nine thirty.', 'It\'s ninety.', 'It\'s nine o\'clock.', 'It\'s nineteen.', 'It\'s o\'clock nine.'], answer: 3,
      traps: [{ a: 1, note: N_TIME }, { a: 2, note: N_TEEN }, { a: 4, note: N_TEEN }, { a: 5, note: N_TIME }], explain: '정각은 o\'clock → nine o\'clock.' },
    { text: '다음 시각을 영어로 바르게 나타낸 것은?\n「4시 15분」', options: ['It\'s four fifty.', 'It\'s fifteen four.', 'It\'s four o\'clock.', 'It\'s four fifteen.', 'It\'s forty-five.'], answer: 4,
      traps: [{ a: 1, note: N_TEEN }, { a: 2, note: N_TIME }, { a: 3, note: N_TIME }], explain: '시 → 분: four fifteen. fifty는 50이에요.' },
    { text: '다음 시각을 영어로 바르게 나타낸 것은?\n「11시 40분」', options: ['It\'s eleven forty.', 'It\'s eleven fourteen.', 'It\'s forty eleven.', 'It\'s eleven o\'clock.', 'It\'s seven forty.'], answer: 1,
      traps: [{ a: 2, note: N_TEEN }, { a: 3, note: N_TIME }, { a: 4, note: N_TIME }], explain: '시 → 분: eleven forty. fourteen은 14예요.' },
  ],
  'ev3-8': [
    { text: '빈칸에 알맞은 요일은?\nToday is Friday. Tomorrow is ______.', options: ['Thursday', 'Sunday', 'Saturday', 'Monday', 'Friday'], answer: 3,
      traps: [{ a: 1, note: N_ORDER }], explain: '오늘 금요일 → 내일은 토요일 Saturday.' },
    { text: '빈칸에 알맞은 요일은?\nToday is Wednesday. Yesterday was ______.', options: ['Tuesday', 'Thursday', 'Monday', 'Friday', 'Sunday'], answer: 1,
      traps: [{ a: 2, note: N_ORDER }], explain: '오늘 수요일 → 어제(yesterday)는 화요일 Tuesday.' },
    { text: '빈칸에 알맞은 요일은?\nToday is Saturday. Tomorrow is ______.', options: ['Friday', 'Monday', 'Saturday', 'Sunday', 'Tuesday'], answer: 4,
      traps: [{ a: 1, note: N_ORDER }], explain: '오늘 토요일 → 내일은 일요일 Sunday.' },
  ],
  'ev3-9': [
    { text: '대화를 읽고 질문에 답하세요.\n\nA: Is it rainy today?\nB: No, it isn\'t. It\'s sunny.\n\nQ. 오늘 날씨는?', options: ['비 옴', '눈 옴', '맑음', '흐림', '바람 붊'], answer: 3,
      traps: [{ a: 1, note: N_NO }], explain: 'No, it isn\'t.(비 안 와) It\'s sunny. → 맑아요.' },
    { text: '대화를 읽고 질문에 답하세요.\n\nA: Is it cold outside?\nB: No. It\'s warm and sunny.\n\nQ. 밖의 날씨는?', options: ['춥고 눈 옴', '춥고 맑음', '덥고 비 옴', '따뜻하고 맑음', '시원하고 흐림'], answer: 4,
      traps: [{ a: 1, note: N_NO }, { a: 2, note: N_NO }], explain: 'No.(춥지 않아) It\'s warm and sunny. → 따뜻하고 맑아요.' },
    { text: '대화를 읽고 질문에 답하세요.\n\nA: Is it snowing in Jeju?\nB: No, it isn\'t. It\'s raining.\n\nQ. 제주의 날씨는?', options: ['비가 옴', '눈이 옴', '맑음', '바람만 붊', '흐리기만 함'], answer: 1,
      traps: [{ a: 2, note: N_NO }], explain: 'No, it isn\'t.(눈 안 와) It\'s raining. → 비가 와요.' },
  ],
  'ev3-10': [
    { text: '글을 읽고 질문에 답하세요.\n\nMy birthday is in May. My mom\'s birthday is in July. My dad\'s birthday is in October.\n\nQ. <b>아빠</b> 생일은 몇 월?', options: ['5월', '7월', '8월', '10월', '12월'], answer: 4,
      traps: [{ a: 1, note: N_WHAT }, { a: 2, note: N_WHAT }], explain: 'My dad\'s birthday is in October. → 10월. 5월은 나, 7월은 엄마예요.' },
    { text: '글을 읽고 질문에 답하세요.\n\nWe have English on Tuesday and Thursday. We have music on Monday. We have art on Friday.\n\nQ. <b>미술</b> 수업이 있는 요일은?', options: ['월요일', '화요일', '목요일', '수요일', '금요일'], answer: 5,
      traps: [{ a: 1, note: N_WHAT }, { a: 2, note: N_WHAT }, { a: 3, note: N_WHAT }], explain: 'We have art on Friday. → 금요일. 월요일은 음악, 화·목은 영어예요.' },
    { text: '글을 읽고 질문에 답하세요.\n\nI get up at seven. I have lunch at twelve. I go to bed at ten.\n\nQ. <b>잠자리에 드는</b> 시각은?', options: ['10시', '7시', '12시', '9시', '11시'], answer: 1,
      traps: [{ a: 2, note: N_WHAT }, { a: 3, note: N_WHAT }], explain: 'I go to bed at ten. → 10시. 7시는 일어나는 시각, 12시는 점심이에요.' },
  ],
  'ev4-1': [
    { text: '다음 영어 단어의 뜻은?\nsad', options: ['기쁜', '화난', '슬픈', '졸린', '무서운'], answer: 3,
      traps: [{ a: 1, note: N_FEEL }], explain: 'sad = 슬픈. 기쁜은 happy.' },
    { text: '다음 영어 단어의 뜻은?\nangry', options: ['화난', '기쁜', '슬픈', '지루한', '놀란'], answer: 1,
      traps: [{ a: 3, note: N_FEEL }], explain: 'angry = 화난.' },
    { text: '다음 영어 단어의 뜻은?\ntired', options: ['배고픈', '목마른', '아픈', '피곤한', '신난'], answer: 4, explain: 'tired = 피곤한.' },
  ],
  'ev4-2': [
    { text: '다음 영어 단어의 뜻은?\nrun', options: ['걷다', '달리다', '뛰어오르다', '앉다', '서다'], answer: 2,
      traps: [{ a: 1, note: N_ACT }], explain: 'run = 달리다. 걷다는 walk.' },
    { text: '다음 영어 단어의 뜻은?\njump', options: ['뛰어오르다', '걷다', '날다', '수영하다', '앉다'], answer: 1, explain: 'jump = 뛰어오르다(점프하다).' },
    { text: '다음 영어 단어의 뜻은?\nwalk', options: ['달리다', '앉다', '춤추다', '걷다', '자다'], answer: 4,
      traps: [{ a: 1, note: N_ACT }], explain: 'walk = 걷다. 달리다는 run.' },
  ],
  'ev4-3': [
    { text: '다음 영어 단어의 뜻은?\nclose', options: ['열다', '닫다', '들어오다', '나가다', '쓰다'], answer: 2,
      traps: [{ a: 1, note: N_OPP }], explain: 'close = 닫다. 열다는 open.' },
    { text: '다음 영어 표현의 뜻은?\nsit down', options: ['일어서다', '눕다', '앉다', '들어오다', '나가다'], answer: 3,
      traps: [{ a: 1, note: N_OPP }], explain: 'sit down = 앉다. 일어서다는 stand up.' },
    { text: '다음 영어 표현의 뜻은?\nstand up', options: ['앉다', '눕다', '걷다', '멈추다', '일어서다'], answer: 5,
      traps: [{ a: 1, note: N_OPP }], explain: 'stand up = 일어서다. 앉다는 sit down.' },
  ],
  'ev4-4': [
    { text: '다음 영어 단어의 뜻은?\nthirsty', options: ['배고픈', '목마른', '졸린', '추운', '아픈'], answer: 2,
      traps: [{ a: 1, note: N_BODY }], explain: 'thirsty = 목마른. 배고픈은 hungry.' },
    { text: '다음 영어 단어의 뜻은?\nsleepy', options: ['배고픈', '목마른', '졸린', '추운', '심심한'], answer: 3,
      traps: [{ a: 1, note: N_BODY }], explain: 'sleepy = 졸린(sleep 자다).' },
    { text: '다음 영어 단어의 뜻은?\nsick', options: ['건강한', '배고픈', '행복한', '아픈', '추운'], answer: 4, explain: 'sick = 아픈.' },
  ],
  'ev4-5': [
    { text: '「그림을 그리다」를 영어로 하면?', options: ['write', 'read', 'draw', 'sing', 'play'], answer: 3,
      traps: [{ a: 1, note: N_ACT }], explain: '그리다 = draw. write는 (글씨를) 쓰다.' },
    { text: '「요리하다」를 영어로 하면?', options: ['eat', 'clean', 'wash', 'cook', 'make'], answer: 4,
      traps: [{ a: 1, note: N_ACT }], explain: '요리하다 = cook. eat은 먹다.' },
    { text: '「읽다」를 영어로 하면?', options: ['write', 'listen', 'speak', 'sing', 'read'], answer: 5,
      traps: [{ a: 1, note: N_ACT }], explain: '읽다 = read. write는 쓰다.' },
  ],
  'ev4-6': [
    { text: '「놀란」을 영어로 하면?', options: ['scared', 'surprised', 'sorry', 'bored', 'happy'], answer: 2,
      traps: [{ a: 1, note: N_FEEL }], explain: '놀란 = surprised. scared는 무서운.' },
    { text: '「지루한」을 영어로 하면?', options: ['busy', 'excited', 'bored', 'tired', 'angry'], answer: 3,
      traps: [{ a: 2, note: N_OPP }], explain: '지루한 = bored. excited는 신난(반대).' },
    { text: '「신난」을 영어로 하면?', options: ['bored', 'sad', 'tired', 'excited', 'sorry'], answer: 4,
      traps: [{ a: 1, note: N_OPP }], explain: '신난 = excited. bored는 지루한(반대).' },
  ],
  'ev4-7': [
    { text: '빈칸에 알맞은 말은?\nI\'m ______. I want to go to bed.', options: ['hungry', 'thirsty', 'happy', 'sleepy', 'angry'], answer: 4,
      traps: [{ a: 1, note: N_BODY }, { a: 2, note: N_BODY }], explain: '자러 가고 싶다 → sleepy(졸린).' },
    { text: '빈칸에 알맞은 말은?\nI\'m ______. Let\'s eat lunch.', options: ['full', 'sleepy', 'thirsty', 'sad', 'hungry'], answer: 5,
      traps: [{ a: 1, note: N_OPP }, { a: 3, note: N_BODY }], explain: '점심을 먹자 → hungry(배고픈). full은 배부른.' },
    { text: '빈칸에 알맞은 말은?\nIt\'s my birthday! I\'m so ______.', options: ['sad', 'angry', 'happy', 'sick', 'bored'], answer: 3,
      traps: [{ a: 1, note: N_FEEL }], explain: '생일이라서 → happy(기쁜).' },
  ],
  'ev4-8': [
    { text: '글을 읽고 질문에 답하세요.\n\nMy brother can play the piano. He can\'t play the guitar.\n\nQ. 형(오빠·남동생)이 <b>할 수 없는</b> 것은?', options: ['피아노', '기타', '바이올린', '노래', '춤'], answer: 2,
      traps: [{ a: 1, note: N_CAN }], explain: 'He can\'t play the guitar. → 기타. 피아노는 칠 수 있어요.' },
    { text: '글을 읽고 질문에 답하세요.\n\nBirds can fly. Fish can swim. Penguins can swim, but they can\'t fly.\n\nQ. 펭귄이 <b>할 수 없는</b> 것은?', options: ['날기', '수영', '걷기', '먹기', '잠자기'], answer: 1,
      traps: [{ a: 2, note: N_CAN }], explain: 'they can\'t fly → 날기. 펭귄은 수영은 할 수 있어요.' },
    { text: '글을 읽고 질문에 답하세요.\n\nJisu can dance well. She can sing, too. But she can\'t draw well.\n\nQ. 지수가 <b>잘하지 못하는</b> 것은?', options: ['춤', '노래', '요리', '그림', '수영'], answer: 4,
      traps: [{ a: 1, note: N_CAN }, { a: 2, note: N_CAN }], explain: 'But she can\'t draw well. → 그림. 춤·노래는 잘해요.' },
  ],
  'ev4-9': [
    { text: '글을 읽고 질문에 답하세요.\n\nJiho is tired because he played soccer all day.\n\nQ. 지호가 피곤한 이유는?', options: ['잠을 못 자서', '숙제가 많아서', '하루 종일 축구를 해서', '아파서', '늦게 일어나서'], answer: 3,
      explain: 'because 뒤: he played soccer all day → 하루 종일 축구를 해서.' },
    { text: '글을 읽고 질문에 답하세요.\n\nI\'m happy because my grandma is visiting today.\n\nQ. 내가 기쁜 이유는?', options: ['선물을 받아서', '시험을 잘 봐서', '생일이라서', '할머니가 오셔서', '방학이라서'], answer: 4,
      explain: 'because 뒤: my grandma is visiting today → 오늘 할머니가 오셔서.' },
    { text: '글을 읽고 질문에 답하세요.\n\nMy sister is angry because I broke her pencil.\n\nQ. 언니(누나·여동생)가 화난 이유는?', options: ['내가 연필을 부러뜨려서', '내가 늦게 와서', '숙제를 안 해서', '비가 와서', '아파서'], answer: 1,
      explain: 'because 뒤: I broke her pencil → 내가 연필을 부러뜨려서.' },
  ],
  'ev4-10': [
    { text: '글을 읽고 질문에 답하세요.\n\nAt the park, Jisu is running. Minho is riding a bike. Yuna is drawing a picture.\n\nQ. <b>민호</b>는 무엇을 하고 있나요?', options: ['달리기', '그림 그리기', '자전거 타기', '수영하기', '책 읽기'], answer: 3,
      traps: [{ a: 1, note: N_WHAT }, { a: 2, note: N_WHAT }], explain: 'Minho is riding a bike. → 자전거 타기.' },
    { text: '글을 읽고 질문에 답하세요.\n\nIn the classroom, Tom is singing. Ben is dancing. Sam is writing a letter.\n\nQ. <b>샘(Sam)</b>은 무엇을 하고 있나요?', options: ['노래하기', '춤추기', '책 읽기', '편지 쓰기', '그림 그리기'], answer: 4,
      traps: [{ a: 1, note: N_WHAT }, { a: 2, note: N_WHAT }], explain: 'Sam is writing a letter. → 편지 쓰기.' },
    { text: '글을 읽고 질문에 답하세요.\n\nGrandpa is happy. Grandma is tired. My cousin is angry.\n\nQ. <b>할머니</b>는 어떤 기분인가요?', options: ['피곤함', '기쁨', '화남', '슬픔', '배고픔'], answer: 1,
      traps: [{ a: 2, note: N_WHAT }, { a: 3, note: N_WHAT }], explain: 'Grandma is tired. → 피곤함. 기쁨은 할아버지, 화남은 사촌이에요.' },
  ],
};
