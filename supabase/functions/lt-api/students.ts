// 학생 코드(k1~k3) ↔ 서버에만 있는 프로필. 실명·학교·학원·영단어 앱 계정은 코드에 두지 않고 secret STUDENT_PROFILES 에서 읽는다.
//   STUDENT_PROFILES = JSON 한 줄: {"k1":{"name":"…","school":"…","academy":"…","academyDays":["월","수","금"],"sqUser":"…"}, "k2":{…}, "k3":{…}}
//   name 필수(= lt_attempts·lt_chat 등 DB 의 student 열에 저장된 값). 나머지는 선택.
// 밖(사이트·API 응답)에는 코드만 나가고, 안(DB 조회·텔레그램·코치 프롬프트)에서는 name 을 쓴다.
export const CODES = ['k1', 'k2', 'k3'] as const;
export const GRADES: Record<string, string> = { k1: '중1', k2: '중1', k3: '초4' };
export interface Profile { name: string; school?: string; academy?: string; academyDays?: string[]; sqUser?: string }

export function parseProfiles(raw: string | undefined | null): Record<string, Profile> {
  if (!raw) { console.error('STUDENT_PROFILES 없음 — 학생 설정이 비어 있다 (action health 로 확인)'); return {}; }
  try {
    const j = JSON.parse(raw), out: Record<string, Profile> = {};
    for (const c of CODES) {
      const p = j && j[c];
      if (!p || typeof p.name !== 'string' || !p.name.trim()) { console.error(`STUDENT_PROFILES: ${c} 에 name 이 없다`); continue; }
      out[c] = { name: p.name.trim(), school: p.school ? String(p.school) : undefined, academy: p.academy ? String(p.academy) : undefined,
        academyDays: Array.isArray(p.academyDays) ? p.academyDays.map(String) : undefined, sqUser: p.sqUser ? String(p.sqUser) : undefined };
    }
    return out;
  } catch (_e) { console.error('STUDENT_PROFILES: JSON 이 아니다'); return {}; }
}

export const PROFILES: Record<string, Profile> = parseProfiles(Deno.env.get('STUDENT_PROFILES'));
const isCode = (v: string) => (CODES as readonly string[]).includes(v);

// 요청으로 온 학생 값 → DB 에 저장된 값. 코드(k1~)면 프로필 name, 설정이 없으면 null(호출한 쪽이 오류로 돌려준다).
// 코드가 아닌 값(옛 이름·'테스트…')은 그대로 — 이행 기간에 옛 사이트도 돌아가게.
export const toStored = (v: string): string | null => (isCode(v) ? PROFILES[v]?.name ?? null : v);
// DB 에 저장된 값 → 밖으로 내보낼 값(코드). 프로필에 없으면 그대로.
export const pubOf = (stored: string): string => CODES.find((c) => PROFILES[c]?.name === stored) ?? stored;
export const profileOf = (stored: string): { code: string; grade: string } & Profile | null => {
  const code = CODES.find((c) => PROFILES[c]?.name === stored); return code ? { code, grade: GRADES[code], ...PROFILES[code] } : null;
};
export const NO_PROFILE = '학생 설정이 아직 안 됐어요. 아빠에게 알려 주세요.';
// 헬스: 값은 내보내지 않고 설정 여부만
export const health = () => ({ ok: CODES.every((c) => !!PROFILES[c]), students: Object.fromEntries(CODES.map((c) => [c, { name: !!PROFILES[c], sqUser: !!PROFILES[c]?.sqUser, school: !!PROFILES[c]?.school }])) });
