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
    // 문자 한 개, 또는 xy·ab 처럼 문자끼리 곱한 것은 기울임 (cm 같은 단위는 그대로)
    var h = esc(p).replace(/[A-Za-z]+/g, function (w) { return (w.length === 1 && /[a-z]/.test(w)) || /^[abcxyz]{2,3}$/.test(w) ? '<i>' + w + '</i>' : w; });
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
  // 입체도형 겨냥도 (type:'solid' — 직육면체·각기둥·각뿔·각뿔대). 빗각 투영: 깊이는 오른쪽 위 30°, 0.5배.
  // 면의 바깥 방향이 보는 쪽을 향하면 보이는 면, 보이는 면에 닿은 모서리는 실선, 나머지는 점선
  function solidSVG(fig) {
    var V = [], F = [], kind = fig.kind, i, n;
    if (kind === 'cuboid') {
      var a = fig.a || 1, b = fig.b || 1, c = fig.c || 1;
      V = [[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0], [0, 0, c], [a, 0, c], [a, b, c], [0, b, c]];
      F = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
    } else if (kind === 'prism' || kind === 'pyramid' || kind === 'frustum') {
      n = Math.max(3, Math.min(8, fig.n || 4)); var r = fig.r || 3, h = fig.h || 5, r2 = kind === 'frustum' ? (fig.r2 || r / 2) : r;
      var rot = n % 2 ? Math.PI / 10 : n > 4 ? Math.PI / 9 : 0; // 정면 대칭이면 앞뒤 꼭짓점이 겹쳐 보여서(홀수각형·육각 이상) 조금 돌림
      var base = [], top = [];
      for (i = 0; i < n; i++) { var t = -Math.PI / 2 - Math.PI / n + rot + 2 * Math.PI * i / n; base.push(V.length); V.push([r * Math.cos(t), r * Math.sin(t), 0]); }
      if (kind === 'pyramid') { V.push([0, 0, h]); var ap = V.length - 1; for (i = 0; i < n; i++) F.push([base[i], base[(i + 1) % n], ap]); }
      else {
        for (i = 0; i < n; i++) { var t2 = -Math.PI / 2 - Math.PI / n + rot + 2 * Math.PI * i / n; top.push(V.length); V.push([r2 * Math.cos(t2), r2 * Math.sin(t2), h]); }
        F.push(top.slice()); for (i = 0; i < n; i++) F.push([base[i], base[(i + 1) % n], top[(i + 1) % n], top[i]]);
      }
      F.push(base.slice().reverse());
    } else return '';
    var K = 0.5, ca = Math.cos(Math.PI / 6), sa = Math.sin(Math.PI / 6), view = [-K * ca, 1, -K * sa];
    var proj = function (p) { return [p[0] + K * ca * p[1], p[2] + K * sa * p[1]]; };
    var vis = F.map(function (f) { // Newell 법선 · 보는 방향 < 0 이면 보임
      var nx = 0, ny = 0, nz = 0;
      for (var j = 0; j < f.length; j++) { var p = V[f[j]], q = V[f[(j + 1) % f.length]]; nx += (p[1] - q[1]) * (p[2] + q[2]); ny += (p[2] - q[2]) * (p[0] + q[0]); nz += (p[0] - q[0]) * (p[1] + q[1]); }
      return nx * view[0] + ny * view[1] + nz * view[2] < -1e-9;
    });
    var E = {};
    F.forEach(function (f, fi) { for (var j = 0; j < f.length; j++) { var u = f[j], w = f[(j + 1) % f.length], key = Math.min(u, w) + '-' + Math.max(u, w); E[key] = E[key] || { u: u, w: w, vis: false }; if (vis[fi]) E[key].vis = true; } });
    var P2 = V.map(proj), xs = P2.map(function (p) { return p[0]; }), ys = P2.map(function (p) { return p[1]; });
    var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs), miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
    var px = 48, py = 26, k = Math.min(190 / Math.max(maxx - minx, 1e-6), 160 / Math.max(maxy - miny, 1e-6)), W = (maxx - minx) * k + 2 * px, H = (maxy - miny) * k + 2 * py;
    var X = function (p) { return px + (p[0] - minx) * k; }, Y = function (p) { return py + (maxy - p[1]) * k; }, f1 = function (v) { return Math.round(v * 10) / 10; };
    var o = ['<svg class="shape" viewBox="0 0 ' + f1(W) + ' ' + f1(H) + '" width="' + f1(W) + '" role="img" aria-label="입체도형 그림">'];
    Object.keys(E).forEach(function (key) { var e = E[key], p = P2[e.u], q = P2[e.w]; o.push('<line class="s' + (e.vis ? '' : ' d') + '" x1="' + f1(X(p)) + '" y1="' + f1(Y(p)) + '" x2="' + f1(X(q)) + '" y2="' + f1(Y(q)) + '"/>'); });
    var L = fig.labels || {}, lab = function (p, dx, dy, t, an) { return '<text x="' + f1(X(p) + dx) + '" y="' + f1(Y(p) + dy) + '" text-anchor="' + (an || 'middle') + '" dominant-baseline="central">' + esc(String(t).replace(/\$/g, '')) + '</text>'; };
    var mid = function (u, w) { return [(P2[u][0] + P2[w][0]) / 2, (P2[u][1] + P2[w][1]) / 2]; };
    if (kind === 'cuboid') {
      if (L.a) o.push(lab(mid(0, 1), 0, 13, L.a));
      if (L.b) o.push(lab(mid(1, 2), 8, 8, L.b, 'start'));
      if (L.c) o.push(lab(mid(0, 4), -6, 0, L.c, 'end')); // 높이는 앞쪽 왼쪽 모서리에(오른쪽은 옆면 모서리와 겹침)
    } else if (L.h) o.push(lab([maxx, (miny + maxy) / 2], 8, 0, L.h, 'start'));
    // 꼭짓점 이름(vlabels): 꼭짓점 순서대로 한 글자씩 — 직육면체·각기둥은 밑면(앞 왼쪽부터 반시계) 다음 윗면, 각뿔은 밑면 다음 꼭대기
    if (fig.vlabels) {
      var cxp = 0, cyp = 0; P2.forEach(function (p) { cxp += p[0]; cyp += p[1]; }); cxp /= P2.length; cyp /= P2.length;
      Array.from(String(fig.vlabels)).slice(0, P2.length).forEach(function (ch, vi) {
        if (ch === ' ' || ch === '_') return;
        var p = P2[vi], dx = X(p) - X([cxp, cyp]), dy = Y(p) - Y([cxp, cyp]), l = Math.hypot(dx, dy) || 1;
        o.push('<text class="pn" x="' + f1(X(p) + dx / l * 11) + '" y="' + f1(Y(p) + dy / l * 11) + '" text-anchor="middle" dominant-baseline="central">' + esc(ch) + '</text>');
      });
    }
    o.push('</svg>');
    return o.join('');
  }
  // 원기둥·원뿔·구·반구: 밑면은 납작한 타원(세로 0.35배), 뒤쪽 반은 점선
  function roundSVG(fig) {
    var r = fig.r || 3, h = fig.h || 5, kind = fig.kind, e = 0.35, L = fig.labels || {}, show = fig.show || [];
    // 원기둥은 윗면 타원이 높이 위로 r·e 만큼 올라감
    var top = kind === 'sphere' ? r : kind === 'hemisphere' ? r : kind === 'cylinder' ? h + r * e : h, bot = kind === 'sphere' ? -r : -r * e;
    var k = Math.min(180 / (2 * r), 160 / (top - bot)), px = 52, py = 30, W = 2 * r * k + 2 * px, H = (top - bot) * k + 2 * py;
    var X = function (x) { return px + (x + r) * k; }, Y = function (y) { return py + (top - y) * k; }, f1 = function (v) { return Math.round(v * 10) / 10; };
    var R = r * k, RY = r * e * k;
    // y=yc 높이의 타원 반쪽: front=true 이면 앞쪽(아래 반)
    var half = function (yc, front, dash) { var y = Y(yc); return '<path class="s' + (dash ? ' d' : '') + '" d="M' + f1(X(-r)) + ' ' + f1(y) + ' A' + f1(R) + ' ' + f1(RY) + ' 0 0 ' + (front ? 0 : 1) + ' ' + f1(X(r)) + ' ' + f1(y) + '"/>'; };
    var line = function (x1, y1, x2, y2, dash) { return '<line class="s' + (dash ? ' d' : '') + '" x1="' + f1(X(x1)) + '" y1="' + f1(Y(y1)) + '" x2="' + f1(X(x2)) + '" y2="' + f1(Y(y2)) + '"/>'; };
    var lab = function (x, y, t, an, dx, dy) { return '<text x="' + f1(X(x) + (dx || 0)) + '" y="' + f1(Y(y) + (dy || 0)) + '" text-anchor="' + (an || 'middle') + '" dominant-baseline="central">' + esc(String(t).replace(/\$/g, '')) + '</text>'; };
    var o = ['<svg class="shape" viewBox="0 0 ' + f1(W) + ' ' + f1(H) + '" width="' + f1(W) + '" role="img" aria-label="입체도형 그림">'];
    if (kind === 'cylinder') {
      o.push(half(0, true, false), half(0, false, true), half(h, true, false), half(h, false, false), line(-r, 0, -r, h), line(r, 0, r, h));
      if (L.h || show.indexOf('h') >= 0) { if (show.indexOf('h') >= 0) o.push(line(0, 0, 0, h, true)); if (L.h) o.push(lab(r, h / 2, L.h, 'start', 7)); }
    } else if (kind === 'cone') {
      o.push(half(0, true, false), half(0, false, true), line(-r, 0, 0, h), line(r, 0, 0, h));
      // 높이 글자는 원뿔 밖(옆 모서리 바깥)에: 오른쪽, 모선 글자가 있으면 왼쪽
      if (show.indexOf('h') >= 0 || L.h) { o.push(line(0, 0, 0, h, true)); if (L.h) o.push(L.l ? lab(-r / 2, h / 2, L.h, 'end', -8) : lab(r / 2, h / 2, L.h, 'start', 8)); }
      if (L.l) o.push(lab(r / 2, h / 2, L.l, 'start', 8));
    } else if (kind === 'sphere') {
      o.push('<circle class="s" cx="' + f1(X(0)) + '" cy="' + f1(Y(0)) + '" r="' + f1(R) + '"/>', half(0, true, false), half(0, false, true));
    } else if (kind === 'hemisphere') {
      o.push('<path class="s" d="M' + f1(X(-r)) + ' ' + f1(Y(0)) + ' A' + f1(R) + ' ' + f1(R) + ' 0 0 1 ' + f1(X(r)) + ' ' + f1(Y(0)) + '"/>', half(0, true, false), half(0, false, true));
    } else return '';
    if (L.r || show.indexOf('r') >= 0) { o.push(line(0, 0, r, 0, true), '<circle class="dot" cx="' + f1(X(0)) + '" cy="' + f1(Y(0)) + '" r="2.4"/>'); if (L.r) o.push(kind === 'sphere' ? lab(r / 2, 0, L.r, 'middle', 0, -9) : lab(r / 2, 0, L.r, 'middle', 0, RY + 11)); } // 납작한 밑면 안쪽은 점선과 겹쳐서 밑면 아래에
    if (show.indexOf('axis') >= 0) o.push('<line class="s d" x1="' + f1(X(0)) + '" y1="' + f1(Y(top) - 14) + '" x2="' + f1(X(0)) + '" y2="' + f1(Y(bot) + 14) + '"/>');
    o.push('</svg>');
    return o.join('');
  }
  function figure(fig) {
    if (!fig) return '';
    if (fig.type === 'solid' && /^(cylinder|cone|sphere|hemisphere)$/.test(fig.kind)) return '<div class="fig">' + roundSVG(fig) + '</div>';
    if (fig.type === 'solid') return '<div class="fig">' + solidSVG(fig) + '</div>';
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
  var FAST_WARN = false; // 찍기 경고 끔(아빠 결정 D11). 다시 켜려면 true — 서버 index.ts FAST_WARN도 같이
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

  // 연습장 풀이 사진 올리기 카드 (제출 뒤 결과 화면·다시 풀기 끝 화면). 서버 action 'work' → 아이용 피드백
  var WORK_MAX = 3;
  function workShrink(file, cb, fail) {
    var url = URL.createObjectURL(file), img = new Image();
    img.onload = function () {
      var k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight)), w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k));
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      cb(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = function () { URL.revokeObjectURL(url); fail(new Error('사진을 읽지 못했어요. 다른 사진으로 해 주세요')); };
    img.src = url;
  }
  function workUpload(container, attemptId, kidToken) {
    if (!container || !attemptId || !kidToken) return;
    var n = 0;
    container.innerHTML = '<div class="card center noprint" style="margin:14px 0"><h2>📸 연습장 사진 올리기</h2>' +
      '<p class="sub">푼 과정을 쓴 연습장을 찍어 올리면 확인해 줄게요</p>' +
      '<label class="btn" style="margin-top:12px;cursor:pointer"><span data-wl>📷 사진 찍기 · 고르기</span><input type="file" accept="image/*" capture="environment" style="display:none"></label>' +
      '<div data-wst class="muted" style="margin-top:10px" aria-live="polite"></div><div data-wres style="text-align:left"></div></div>';
    var lab = container.querySelector('label'), inp = container.querySelector('input'), st = container.querySelector('[data-wst]'), res = container.querySelector('[data-wres]');
    inp.onchange = function () {
      var f = inp.files && inp.files[0]; inp.value = '';
      if (!f) return;
      lab.style.opacity = '.5'; lab.style.pointerEvents = 'none'; st.textContent = '올리는 중… 확인하는 데 조금 걸려요';
      var done = function (msg) { lab.style.opacity = ''; lab.style.pointerEvents = ''; st.textContent = msg || ''; if (n >= WORK_MAX) lab.style.display = 'none'; };
      workShrink(f, function (dataUrl) {
        api('work', { attemptId: attemptId, kidToken: kidToken, image: dataUrl }).then(function (j) {
          n++;
          var fb = j.feedback, h = '<div style="margin-top:12px;padding:12px;border-radius:12px;background:var(--brand-soft)">';
          if (fb) {
            h += '<div style="line-height:1.6">' + esc(fb.kid).replace(/\n/g, '<br>') + '</div>';
            if (fb.items && fb.items.length) h += '<ul style="margin:10px 0 0;padding-left:20px;font-size:14px;color:var(--ink2)">' + fb.items.map(function (it) { return '<li><b>' + esc(it.no) + '번</b> ' + esc(it.note) + '</li>'; }).join('') + '</ul>';
          } else h += esc(j.msg || '사진은 아빠한테 보냈어요');
          res.insertAdjacentHTML('afterbegin', h + '</div>');
          done(n >= WORK_MAX ? '사진은 ' + WORK_MAX + '장까지 올릴 수 있어요' : '');
        }).catch(function (e) { done('⚠️ ' + (e.message || '올리지 못했어요')); });
      }, function (e) { done('⚠️ ' + e.message); });
    };
  }

  // ── AI 코치 (서버 lt-api chat.ts) ──
  // coachCard: 결과 화면의 「코치 한마디」 카드, coachOpen: 대화창, coachFab: 허브 아래 고정 버튼
  var coachCss = false;
  function coachStyle() {
    if (coachCss) return; coachCss = true;
    var st = document.createElement('style');
    st.textContent = '.coach-fab{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:40;box-shadow:0 4px 16px rgba(16,24,40,.25);padding:14px 20px;font-size:17px}' +
      '.cch .sheet{display:flex;flex-direction:column;height:min(640px,calc(100vh - 32px));max-height:calc(100dvh - 32px);padding:0;overflow:hidden;max-width:520px}' +
      '.cch-h{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--line);font-weight:800;font-size:17px}' +
      '.cch-l{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:10px;background:var(--bg)}' +
      '.cch-b{max-width:84%;padding:10px 13px;border-radius:16px;line-height:1.6;font-size:16px;word-break:break-word;white-space:pre-wrap}' +
      '.cch-b.a{align-self:flex-start;background:var(--card);border:1px solid var(--line);border-bottom-left-radius:4px}' +
      '.cch-b.u{align-self:flex-end;background:var(--brand);color:var(--brand-ink);border-bottom-right-radius:4px}' +
      '.cch-b.w{color:var(--muted)}' +
      '.cch-f{display:flex;gap:8px;padding:10px;border-top:1px solid var(--line);align-items:flex-end}' +
      '.cch-f textarea{flex:1;resize:none;border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:12px;padding:10px 12px;font:inherit;font-size:16px;max-height:110px}' +
      '.cch-f textarea:focus{outline:2px solid var(--brand);border-color:transparent}';
    document.head.appendChild(st);
  }
  function bubbleHtml(role, text, cls) { return '<div class="cch-b ' + (role === 'user' ? 'u' : 'a') + (cls ? ' ' + cls : '') + '">' + esc(text) + '</div>'; }

  function coachOpen(student) {
    if (!student || document.querySelector('.cch')) return;
    coachStyle();
    var root = document.createElement('div');
    root.className = 'modal cch';
    root.innerHTML = '<div class="sheet" role="dialog" aria-label="코치와 대화"><div class="cch-h"><span>🤖 코치</span><button class="btn ghost sm" data-x>닫기</button></div>' +
      '<div class="cch-l" aria-live="polite"><div class="muted" style="text-align:center;margin-top:20px">코치를 부르는 중…</div></div>' +
      '<div class="cch-f"><textarea rows="1" maxlength="500" placeholder="코치에게 물어봐" aria-label="메시지"></textarea><button class="btn" data-s>보내기</button></div></div>';
    document.body.appendChild(root);
    var list = root.querySelector('.cch-l'), ta = root.querySelector('textarea'), send = root.querySelector('[data-s]'), busy = false;
    var down = function () { list.scrollTop = list.scrollHeight; };
    var close = function () { root.remove(); document.removeEventListener('keydown', onKey); };
    var onKey = function (e) { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    root.querySelector('[data-x]').onclick = close;
    root.addEventListener('click', function (e) { if (e.target === root) close(); });
    // 열 때: 오늘 인사(하루 한 번 만들어 저장) → 최근 대화
    api('chatGreet', { student: student }).catch(function () {}).then(function () { return api('chatHistory', { student: student }); }).then(function (j) {
      var ms = j.messages || [];
      list.innerHTML = ms.length ? ms.map(function (m) { return bubbleHtml(m.role, m.content); }).join('') : bubbleHtml('assistant', '안녕! 나는 공부 코치야. 오늘 할 일, 모르는 문제, 연습문제 뭐든 물어봐 😊');
      down();
    }).catch(function () { list.innerHTML = bubbleHtml('assistant', '코치가 잠깐 쉬고 있어. 조금 뒤에 다시 열어 줘!'); });
    function doSend() {
      var msg = ta.value.trim(); if (!msg || busy) return;
      busy = true; send.disabled = true; ta.value = ''; ta.style.height = '';
      list.insertAdjacentHTML('beforeend', bubbleHtml('user', msg) + bubbleHtml('assistant', '코치가 생각하는 중… ✍️', 'w'));
      var wait = list.lastChild; down();
      api('chat', { student: student, message: msg }).then(function (j) { wait.outerHTML = bubbleHtml('assistant', j.reply); })
        .catch(function (e) { wait.outerHTML = bubbleHtml('assistant', '⚠️ ' + (e.message || '보내지 못했어. 다시 해 봐!')); if (!ta.value) ta.value = msg; })
        .then(function () { busy = false; send.disabled = false; down(); ta.focus(); });
    }
    send.onclick = doSend;
    ta.onkeydown = function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && window.matchMedia('(hover:hover)').matches) { e.preventDefault(); doSend(); } };
    ta.oninput = function () { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 110) + 'px'; };
  }

  // 허브 아래 고정 버튼 (student 가 null 이면 지움)
  function coachFab(student) {
    var b = document.getElementById('coach-fab');
    if (!student) { if (b) b.remove(); return; }
    coachStyle();
    if (!b) { b = document.createElement('button'); b.id = 'coach-fab'; b.className = 'btn coach-fab noprint'; b.textContent = '🤖 코치'; document.body.appendChild(b); }
    b.onclick = function () { coachOpen(student); };
  }

  // 결과 화면 「코치 한마디」 카드. 제출 응답을 늦추지 않으려고 따로 부른다. 실패하면 카드를 지운다
  function coachCard(container, attemptId, kidToken, student) {
    if (!container || !attemptId || !kidToken) return;
    container.innerHTML = '<div class="card noprint" style="margin:14px 0"><h2>🤖 코치 한마디</h2><div data-cc class="muted" aria-live="polite">코치가 결과를 보고 있어…</div></div>';
    var box = container.querySelector('[data-cc]');
    api('chatResult', { attemptId: attemptId, kidToken: kidToken }).then(function (j) {
      if (j.failed || !j.reply) { container.innerHTML = ''; return; }
      box.className = '';
      box.innerHTML = '<div style="line-height:1.7;white-space:pre-wrap">' + esc(j.reply) + '</div>' +
        '<a class="btn soft sm" style="margin-top:12px" href="hub.html?n=' + encodeURIComponent(student || '') + '&chat=1">코치랑 이야기하기 →</a>';
    }).catch(function () { container.innerHTML = ''; });
  }

  return { coachCard: coachCard, coachOpen: coachOpen, coachFab: coachFab, workUpload: workUpload, API: API, api: api, esc: esc, md: md, fmtNum: fmtNum, validNum: validNum, figure: figure, CIRC: CIRC, LEVEL: LEVEL, kst: kst, mmss: mmss, store: store, FAST_SEC: FAST_SEC, FAST_WARN: FAST_WARN, fastWarn: fastWarn };
})();
