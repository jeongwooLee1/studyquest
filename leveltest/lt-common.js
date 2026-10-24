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
  // 평면도형 그림 (docs/math/figure-spec.md 의 type:'shape'). 좌표는 y 위쪽이 +, 선 굵기·글자 크기는 화면에서 일정
  function shapeSVG(fig) {
    var P = fig.pts || {}, items = fig.items || [], names = Object.keys(P);
    var xs = [], ys = [];
    names.forEach(function (n) { xs.push(P[n][0]); ys.push(P[n][1]); });
    items.forEach(function (it) {
      var c = P[it.c]; if (!c) return;
      if (it.k === 'circle') { xs.push(c[0] - it.r, c[0] + it.r); ys.push(c[1] - it.r, c[1] + it.r); }
      else if (it.k === 'arc') { // 호가 실제로 지나는 곳만
        var t0 = it.from, t1 = it.to; while (t1 <= t0) t1 += 360;
        for (var t = t0; t <= t1 + 0.01; t += Math.min(5, t1 - t0)) { xs.push(c[0] + it.r * Math.cos(t * Math.PI / 180)); ys.push(c[1] + it.r * Math.sin(t * Math.PI / 180)); }
        if (it.sector) { xs.push(c[0]); ys.push(c[1]); }
      }
    });
    if (!xs.length) return '';
    var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs), miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
    // 여백: 좌우는 옆에 붙는 길이 글자(예: '12 cm')가 들어갈 만큼 넉넉히
    var w = Math.max(maxx - minx, 1e-6), h = Math.max(maxy - miny, 1e-6), px = 48, py = 28;
    var k = Math.min(200 / w, 170 / h), W = w * k + 2 * px, H = h * k + 2 * py;
    var X = function (x) { return px + (x - minx) * k; }, Y = function (y) { return py + (maxy - y) * k; };
    var pt = function (n) { var q = P[n]; return [X(q[0]), Y(q[1])]; };
    var cx = 0, cy = 0; names.forEach(function (n) { var q = pt(n); cx += q[0]; cy += q[1]; }); cx /= names.length || 1; cy /= names.length || 1;
    var f = function (v) { return Math.round(v * 10) / 10; };
    var txt = function (t) { return esc(String(t).replace(/\[\[(\d+)\|(\d+)\]\]/g, '$1/$2').replace(/\$/g, '')); };
    var away = function (x, y, d) { var dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1; return [x + dx / l * d, y + dy / l * d]; };
    var label = function (x, y, t, anchor) { return '<text x="' + f(x) + '" y="' + f(y) + '" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="central">' + txt(t) + '</text>'; };
    var cls = function (it, base) { return base + (it.dash ? ' d' : '') + (it.fill === true ? ' fl' : it.fill === 'bg' ? ' bgf' : ''); };
    // 선분 가운데에서 도형 중심 반대쪽으로 수직으로 띄운 자리
    var sideLabel = function (a, b, t) {
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, nx = -(b[1] - a[1]), ny = b[0] - a[0], l = Math.hypot(nx, ny) || 1;
      nx /= l; ny /= l; if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
      // 세로에 가까운 선분은 글자를 선 옆으로 붙여 쓰기(가운데 맞춤이면 글자가 선에 걸침)
      var an = nx > 0.5 ? 'start' : nx < -0.5 ? 'end' : 'middle', dd = an === 'middle' ? 13 : 6;
      return label(mx + nx * dd, my + ny * dd, t, an);
    };
    var o = ['<svg class="shape" viewBox="0 0 ' + f(W) + ' ' + f(H) + '" width="' + f(W) + '" role="img" aria-label="도형 그림">'];
    items.forEach(function (it) {
      var p = Array.isArray(it.p) ? it.p.map(pt) : [], a, b, c;
      if (it.k === 'poly') o.push('<polygon class="' + cls(it, 's') + '" points="' + p.map(function (q) { return f(q[0]) + ',' + f(q[1]); }).join(' ') + '"/>');
      else if (it.k === 'seg') { o.push('<line class="' + cls(it, 's') + '" x1="' + f(p[0][0]) + '" y1="' + f(p[0][1]) + '" x2="' + f(p[1][0]) + '" y2="' + f(p[1][1]) + '"/>'); if (it.label) o.push(sideLabel(p[0], p[1], it.label)); }
      else if (it.k === 'side') { if (it.label) o.push(sideLabel(p[0], p[1], it.label)); }
      else if (it.k === 'line' || it.k === 'ray') {
        a = p[0]; b = p[1]; var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, E = (W + H) * 2;
        var s0 = it.k === 'ray' ? a : [a[0] - dx / L * E, a[1] - dy / L * E], s1 = [a[0] + dx / L * E, a[1] + dy / L * E];
        o.push('<line class="' + cls(it, 's') + '" x1="' + f(s0[0]) + '" y1="' + f(s0[1]) + '" x2="' + f(s1[0]) + '" y2="' + f(s1[1]) + '"/>');
      } else if (it.k === 'angle') {
        var O = P[it.p[1]], A = P[it.p[0]], B = P[it.p[2]], a1 = Math.atan2(A[1] - O[1], A[0] - O[0]), a2 = Math.atan2(B[1] - O[1], B[0] - O[0]);
        var sw = a2 - a1; while (sw < 0) sw += 2 * Math.PI; var po = pt(it.p[1]);
        for (var i = 0; i < (it.n || 1); i++) {
          var r = 16 + i * 4, x1 = po[0] + r * Math.cos(a1), y1 = po[1] - r * Math.sin(a1), x2 = po[0] + r * Math.cos(a2), y2 = po[1] - r * Math.sin(a2);
          o.push('<path class="s" d="M' + f(x1) + ' ' + f(y1) + ' A' + r + ' ' + r + ' 0 ' + (sw > Math.PI ? 1 : 0) + ' 0 ' + f(x2) + ' ' + f(y2) + '"/>');
        }
        if (it.label) { var am = a1 + sw / 2, rr = 16 + (it.n || 1) * 4 + 12; o.push(label(po[0] + rr * Math.cos(am), po[1] - rr * Math.sin(am), it.label)); }
      } else if (it.k === 'right') {
        var o0 = p[1], u = [p[0][0] - o0[0], p[0][1] - o0[1]], v = [p[2][0] - o0[0], p[2][1] - o0[1]], lu = Math.hypot(u[0], u[1]) || 1, lv = Math.hypot(v[0], v[1]) || 1, d = 9;
        u = [u[0] / lu * d, u[1] / lu * d]; v = [v[0] / lv * d, v[1] / lv * d];
        o.push('<polyline class="s" points="' + f(o0[0] + u[0]) + ',' + f(o0[1] + u[1]) + ' ' + f(o0[0] + u[0] + v[0]) + ',' + f(o0[1] + u[1] + v[1]) + ' ' + f(o0[0] + v[0]) + ',' + f(o0[1] + v[1]) + '"/>');
      } else if (it.k === 'tick' || it.k === 'par') {
        a = p[0]; b = p[1]; var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
        for (var j = 0; j < (it.n || 1); j++) {
          var off = (j - ((it.n || 1) - 1) / 2) * 5, qx = mx + tx * off, qy = my + ty * off;
          if (it.k === 'tick') o.push('<line class="s" x1="' + f(qx - ty * 6) + '" y1="' + f(qy + tx * 6) + '" x2="' + f(qx + ty * 6) + '" y2="' + f(qy - tx * 6) + '"/>');
          else o.push('<polyline class="s" points="' + f(qx - tx * 5 - ty * 5) + ',' + f(qy - ty * 5 + tx * 5) + ' ' + f(qx) + ',' + f(qy) + ' ' + f(qx - tx * 5 + ty * 5) + ',' + f(qy - ty * 5 - tx * 5) + '"/>');
        }
      } else if (it.k === 'circle') { c = pt(it.c); o.push('<circle class="' + cls(it, 's') + '" cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="' + f(it.r * k) + '"/>'); }
      else if (it.k === 'arc') {
        c = pt(it.c); var R = it.r * k, t1 = it.from * Math.PI / 180, t2 = it.to * Math.PI / 180, sw2 = t2 - t1; while (sw2 < 0) sw2 += 2 * Math.PI;
        var ax = c[0] + R * Math.cos(t1), ay = c[1] - R * Math.sin(t1), bx = c[0] + R * Math.cos(t2), by = c[1] - R * Math.sin(t2);
        var dd = (it.sector ? 'M' + f(c[0]) + ' ' + f(c[1]) + ' L' : 'M') + f(ax) + ' ' + f(ay) + ' A' + f(R) + ' ' + f(R) + ' 0 ' + (sw2 > Math.PI ? 1 : 0) + ' 0 ' + f(bx) + ' ' + f(by) + (it.sector ? ' Z' : '');
        o.push('<path class="' + cls(it, 's') + '" d="' + dd + '"/>');
        if (it.label) { var tm = t1 + sw2 / 2; o.push(label(c[0] + (R + 13) * Math.cos(tm), c[1] - (R + 13) * Math.sin(tm), it.label)); }
      } else if (it.k === 'dot') { c = pt(it.p); o.push('<circle class="dot" cx="' + f(c[0]) + '" cy="' + f(c[1]) + '" r="2.6"/>'); }
      else if (it.k === 'text') { c = typeof it.at === 'string' ? pt(it.at) : [X(it.at[0]), Y(it.at[1])]; o.push(label(c[0], c[1], it.s)); }
    });
    names.forEach(function (n) { if (n.charAt(0) === '_') return; var q = pt(n), l = away(q[0], q[1], 12); o.push('<text class="pn" x="' + f(l[0]) + '" y="' + f(l[1]) + '" text-anchor="middle" dominant-baseline="central">' + esc(n) + '</text>'); });
    o.push('</svg>');
    return o.join('');
  }
  function figure(fig) {
    if (!fig) return '';
    if (fig.type === 'coord') return '<div class="fig">' + coordSVG(fig) + '</div>';
    if (fig.type === 'shape') return '<div class="fig">' + shapeSVG(fig) + '</div>';
    return '';
  }

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
