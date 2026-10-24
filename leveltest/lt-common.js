// 레벨테스트 공용: API 호출, 수식 표기 렌더링, 좌표평면 그림
// 문제 표기법은 supabase/functions/lt-api/tests/math_m1.ts 머리말 참고
window.LT = (function () {
  var API = 'https://dpftlrsuqxqqeouwbfjd.functions.supabase.co/lt-api';

  function api(action, body, opts) {
    var payload = Object.assign({ action: action }, body || {});
    return fetch(API, Object.assign({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) }, opts || {}))
      .then(function (r) {
        return r.json().catch(function () { return { error: '서버 응답을 읽지 못했어요' }; }).then(function (j) {
          if (!r.ok || j.error) { var e = new Error(j.error || ('HTTP ' + r.status)); e.status = r.status; throw e; }
          return j;
        });
      });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 수식 구간: 영문 한 글자 → 기울임, [[a|b]] → 분수, ^2 → 위첨자
  function math(p) {
    var h = esc(p).replace(/[A-Za-z]+/g, function (w) { return w.length === 1 && /[a-z]/.test(w) ? '<i>' + w + '</i>' : w; });
    h = h.replace(/\[\[(.+?)\|(.+?)\]\]/g, '<span class="fr"><span class="nu">$1</span><span class="de">$2</span></span>');
    h = h.replace(/\^(\d+|<i>[a-z]<\/i>)/g, '<sup>$1</sup>');
    return h;
  }
  function md(s) {
    return String(s == null ? '' : s).split('$').map(function (p, i) {
      return i % 2 ? '<span class="m">' + math(p) + '</span>' : esc(p).replace(/&lt;(\/?)b&gt;/g, '<$1b>').replace(/\n/g, '<br>');
    }).join('');
  }

  // 숫자 답 → 보기 좋게 ('-9/2' → −9/2 분수 모양)
  function fmtNum(v) {
    var s = String(v == null ? '' : v).trim();
    if (!s) return '';
    var m = s.replace(/[−–—]/g, '-').match(/^(-?)\s*(?:(\d+)\s+)?(\d+)\s*\/\s*(\d+)$/);
    if (m) return '<span class="m">' + (m[1] ? '−' : '') + (m[2] || '') + '<span class="fr"><span class="nu">' + m[3] + '</span><span class="de">' + m[4] + '</span></span></span>';
    return '<span class="m">' + esc(s.replace(/-/g, '−')) + '</span>';
  }
  // 서버와 같은 규칙으로 입력 형식만 검사(정답 여부는 서버가 판단)
  function validNum(raw) {
    var s = String(raw == null ? '' : raw).replace(/[−–—]/g, '-').replace(/,/g, '').replace(/\s+/g, ' ').trim();
    return /^-?\s*\d+$/.test(s) || /^-?\s*\d*\.\d+$/.test(s) || /^-?\s*(\d+ )?\d+\s*\/\s*[1-9]\d*$/.test(s);
  }

  // 좌표평면 그림 { type:'coord', range, points:[{l,x,y}], line:[x,y] (원점을 지나는 직선) }
  function coordSVG(fig) {
    var R = fig.range || 5, S = 280, pad = 22, u = (S - 2 * pad) / (2 * R);
    var X = function (x) { return pad + (x + R) * u; }, Y = function (y) { return pad + (R - y) * u; };
    var o = ['<svg class="coord" viewBox="0 0 ' + S + ' ' + S + '" role="img" aria-label="좌표평면">'];
    for (var i = -R; i <= R; i++) {
      o.push('<line class="g" x1="' + X(i) + '" y1="' + Y(-R) + '" x2="' + X(i) + '" y2="' + Y(R) + '"/>');
      o.push('<line class="g" x1="' + X(-R) + '" y1="' + Y(i) + '" x2="' + X(R) + '" y2="' + Y(i) + '"/>');
    }
    var a = 9;
    o.push('<line class="ax" x1="' + (X(-R) - 6) + '" y1="' + Y(0) + '" x2="' + (X(R) + 12) + '" y2="' + Y(0) + '"/>');
    o.push('<line class="ax" x1="' + X(0) + '" y1="' + (Y(-R) + 6) + '" x2="' + X(0) + '" y2="' + (Y(R) - 12) + '"/>');
    o.push('<path class="arr" d="M' + (X(R) + 14) + ' ' + Y(0) + ' l-' + a + ' -4 v8 z"/>');
    o.push('<path class="arr" d="M' + X(0) + ' ' + (Y(R) - 14) + ' l-4 ' + a + ' h8 z"/>');
    o.push('<text class="axl" x="' + (X(R) + 4) + '" y="' + (Y(0) + 16) + '">x</text>');
    o.push('<text class="axl" x="' + (X(0) + 7) + '" y="' + (Y(R) - 6) + '">y</text>');
    o.push('<text class="tk" x="' + (X(0) - 10) + '" y="' + (Y(0) + 13) + '">O</text>');
    for (var k = -R; k <= R; k++) {
      if (!k) continue;
      o.push('<text class="tk" text-anchor="middle" x="' + X(k) + '" y="' + (Y(0) + 13) + '">' + (k < 0 ? '−' + (-k) : k) + '</text>');
      o.push('<text class="tk" text-anchor="end" x="' + (X(0) - 4) + '" y="' + (Y(k) + 4) + '">' + (k < 0 ? '−' + (-k) : k) + '</text>');
    }
    if (fig.line) {
      var m = fig.line[1] / fig.line[0], xm = Math.min(R, R / Math.abs(m || 1e-9));
      o.push('<line class="ln" x1="' + X(-xm) + '" y1="' + Y(-xm * m) + '" x2="' + X(xm) + '" y2="' + Y(xm * m) + '"/>');
    }
    (fig.points || []).forEach(function (p) {
      o.push('<circle class="pt" cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="4.5"/>');
      // y축 왼쪽 점은 이름을 왼쪽에 — 축 눈금 숫자와 겹치지 않게
      if (p.l) o.push('<text class="ptl"' + (p.x < 0 ? ' text-anchor="end" x="' + (X(p.x) - 7) : ' x="' + (X(p.x) + 7)) + '" y="' + (Y(p.y) - 7) + '">' + esc(p.l) + '</text>');
    });
    o.push('</svg>');
    return o.join('');
  }
  function figure(fig) { return fig && fig.type === 'coord' ? '<div class="fig">' + coordSVG(fig) + '</div>' : ''; }

  var CIRC = ['①', '②', '③', '④', '⑤', '⑥'];
  var LEVEL = { pass: { t: '통과', c: 'pass' }, weak: { t: '보완', c: 'weak' }, focus: { t: '집중', c: 'focus' } };

  function kst(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    try { return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return d.toLocaleString(); }
  }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + '분 ' + (sec % 60) + '초'; }

  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  // 너무 빨리 찍었을 때 경고 — 3초 동안 닫을 수 없음
  var FAST_SEC = 5;
  function fastWarn(sec, onClose) {
    var root = document.createElement('div');
    root.className = 'modal fastwarn';
    root.innerHTML = '<div class="sheet"><div style="font-size:44px;text-align:center">🚨</div>' +
      '<h2 style="text-align:center;margin:6px 0 10px">너무 빨리 찍었어요!</h2>' +
      '<p style="font-size:17px;line-height:1.7;margin:0">문제가 나오고 <b>' + Math.max(0, Math.round(sec)) + '초</b> 만에 답을 골랐어요. 문제를 다 읽지도 않고 <b>찍은 거죠?</b></p>' +
      '<p style="font-size:17px;line-height:1.7;margin:8px 0 0;color:var(--focus);font-weight:800">📢 이건 아빠한테 보고할게요.</p>' +
      '<p style="font-size:15px;line-height:1.7;margin:8px 0 0">문제를 끝까지 읽고, 연습장에 직접 풀어 본 다음 답을 골라요.</p>' +
      '<div class="acts"><button class="btn" disabled>읽는 중… 3</button></div></div>';
    document.body.appendChild(root);
    var b = root.querySelector('button'), left = 3;
    var iv = setInterval(function () { left--; if (left <= 0) { clearInterval(iv); b.disabled = false; b.textContent = '다시 풀어 볼게요'; } else b.textContent = '읽는 중… ' + left; }, 1000);
    b.onclick = function () { root.remove(); if (onClose) onClose(); };
  }

  return { API: API, api: api, esc: esc, md: md, fmtNum: fmtNum, validNum: validNum, figure: figure, CIRC: CIRC, LEVEL: LEVEL, kst: kst, mmss: mmss, store: store, FAST_SEC: FAST_SEC, fastWarn: fastWarn };
})();
