// 중1 2학기 단원 문제지 — 작년 도농중 1학년 2학기 기말 유형에 맞춤. 문항은 twins.ts 생성기를 정해진 seed 로 돌려 만든다.
// m2-basic: 「기본 도형」 점·선·면·각, 위치 관계, 평행선의 성질 (기출 7~9·12번: 평행선 동위각·엇각, 점 사이 거리, 꼬인 위치)
import { makeFixed } from '../twins.ts';

const M1 = '중1';
const set = (id: string, title: string, subtitle: string, areas: any[], items: [string, string, number][]) => ({
  id, title, subtitle, minutes: 30, practice: true, pace: { [M1]: 150 }, areas,
  questions: items.map(([qid, area, seed]) => makeFixed(qid, area, seed)),
});

export const M2_BASIC = set('m2-basic', '기본 도형', '중1 2학기 「기본 도형」 — 점·선·면·각, 위치 관계, 평행선', [
  { id: 'mba', group: M1, name: '점·선·면·각', unit: '중1 「기본 도형」 — 점·선·면, 각, 맞꼭지각',
    why: '교점·교선, 중점으로 길이 구하기, 맞꼭지각·평각은 2학기 첫 단원의 기본이에요(작년 기말 7번 점 사이 거리).',
    study: ['EBS 중학 「뉴런 수학1(하)」 기본 도형 — 점·선·면, 각 강의', '교점 = 꼭짓점, 교선 = 모서리', '맞꼭지각은 크기가 같고, 평각(일직선)은 180°'] },
  { id: 'mbb', group: M1, name: '위치 관계', unit: '중1 「기본 도형」 — 점·직선·평면의 위치 관계',
    why: '꼬인 위치 찾기는 작년 기말 12번에 나왔어요. 직육면체 그림으로 하나씩 세는 연습이 필요해요.',
    study: ['EBS 중학 「뉴런 수학1(하)」 기본 도형 — 위치 관계 강의', '꼬인 위치 = 만나지도 않고 평행하지도 않은 두 직선 (한 평면 위에 없음)', '모서리를 셀 때는 만나는 것 → 평행한 것 → 나머지(꼬인 위치) 순서로 지우며 세기'] },
  { id: 'mbc', group: M1, name: '평행선의 성질', unit: '중1 「기본 도형」 — 동위각과 엇각',
    why: '평행선의 동위각·엇각은 작년 기말 8~9번에 나왔고, 다각형·작도 단원에서도 계속 써요.',
    study: ['EBS 중학 「뉴런 수학1(하)」 기본 도형 — 평행선의 성질 강의', '평행선에서 동위각·엇각은 크기가 같고, 같은 쪽 안쪽 각은 합이 180°', '꺾인 선은 꺾인 점을 지나는 평행선을 하나 더 그어서 엇각으로'] },
], [
  ['mb-1', 'mba', 1], ['mb-2', 'mba', 14], ['mb-3', 'mba', 66], ['mb-4', 'mba', 4],
  ['mb-5', 'mbb', 4], ['mb-6', 'mbb', 3], ['mb-10', 'mbb', 8],
  ['mb-7', 'mbc', 8], ['mb-8', 'mbc', 25], ['mb-9', 'mbc', 14],
]);

export const MATH_M2_SETS = [M2_BASIC];
