// 초4 영어 어휘 문제지 — 출판사와 상관없는 초3·4 필수 단어(2022 개정 성취기준). 전부 5지선다, practice:true.
//   eng-e4-v1  학교·가족 단어(10): 뜻 알기 · 영어 단어 고르기 · 문장·글 속 단어(끝까지 읽기)
//   eng-e4-v2  음식·동물 단어(10): 뜻 알기 · 영어 단어 고르기·분류 · 문장·글 속 단어(좋아한다/좋아하지 않는다, 누구)
// 다시 풀기용 변형 문항은 ENG_VOC_VARIANTS[원래 문항 id] 에 3개씩(sci_gas.ts·eng_gram.ts 와 같은 형식).
// fastSec: 2 = 단어 하나만 알면 바로 풀리는 문항(뜻 알기·영어 단어 고르기). 찍기 경고를 2초 미만일 때만 띄운다. 문장·글을 읽는 문항은 기본 5초.
// 표기: 줄바꿈 \n, 강조 <b>…</b>. '$'는 쓰지 않는다. 문항 id 는 세트마다 접두어(학교·가족 'ev1-', 음식·동물 'ev2-').

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

export const ENG_VOC_SETS = [ENG_E4_V1, ENG_E4_V2];

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
};
