// 초4 영어 어휘 문제지 — 출판사와 상관없는 초3·4 필수 단어(2022 개정 성취기준). 전부 5지선다, practice:true.
//   eng-e4-v1  학교·가족 단어(10): 뜻 알기 · 영어 단어 고르기 · 문장·글 속 단어(끝까지 읽기)
// 다시 풀기용 변형 문항은 ENG_VOC_VARIANTS[원래 문항 id] 에 3개씩(sci_gas.ts·eng_gram.ts 와 같은 형식).
// fastSec: 2 = 단어 하나만 알면 바로 풀리는 문항(뜻 알기·영어 단어 고르기). 찍기 경고를 2초 미만일 때만 띄운다. 문장·글을 읽는 문항은 기본 5초.
// 표기: 줄바꿈 \n, 강조 <b>…</b>. '$'는 쓰지 않는다. 문항 id 는 세트마다 접두어(학교·가족 'ev1-').

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

export const ENG_VOC_SETS = [ENG_E4_V1];

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
};
