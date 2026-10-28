// Claude 응답에 text 블록이 없을 때 로그에 남길 원인 문구.
// claude-sonnet-5-5 는 생각(adaptive thinking)이 항상 켜져 있고 생각 토큰도 max_tokens 에 들어간다 — 생각이 한도를 다 쓰면 thinking 블록만 남고 text 가 없다.
export function emptyReason(j: any): string {
  const blocks = (j && j.content) || [], types = blocks.map((c: any) => c.type);
  const head = `stop_reason=${j?.stop_reason} blocks=[${types.join(',')}] out=${j?.usage?.output_tokens}`;
  if (types.length && !types.includes('text') && types.every((t: string) => t === 'thinking' || t === 'redacted_thinking'))
    return `생각만 하고 끝남(text 블록 없음${j?.stop_reason === 'max_tokens' ? ' — max_tokens 를 생각이 다 씀' : ''}) ${head}`;
  return `빈 답 ${head}`;
}
