'use strict';
/* =========================================================
   Rolly / 또르르 / コロリン — one-line physics puzzle
   ========================================================= */

// ---------- 설정 ----------
const CFG = {
  appUrl: '',                    // App Store / Play 링크 (출시 후 입력)
  epoch: Date.UTC(2026, 10, 12), // 오늘의 문제 #1 날짜
  ads: {                         // AdMob 단위 ID (지금은 구글 공식 테스트 ID)
    ios:     { rewarded: 'ca-app-pub-3940256099942544/1712485313', interstitial: 'ca-app-pub-3940256099942544/4411468910' },
    android: { rewarded: 'ca-app-pub-3940256099942544/5224354917', interstitial: 'ca-app-pub-3940256099942544/1033173712' },
    testing: true,
    interstitialFromStage: 8,    // 이 스테이지 전까지는 전면광고 없음
    interstitialEvery: 3,        // 스테이지 클리어 n번마다 1번
    interstitialMinGapSec: 150,  // 전면광고 최소 간격
  },
};

// ---------- 다국어 ----------
const STR = {
  en: {
    name: 'Rolly', tag: 'Draw one line. Roll it in.', daily: 'Daily', stages: 'Stages', collection: 'Collection', settings: 'Settings',
    hints: n => `💡 ${n}`, hint: 'Hint', easy: 'Easy', normal: 'Normal', hard: 'Hard',
    dailySubTodo: 'Same 3 puzzles for everyone today', dailySubDone: t => `All solved! Next in ${t}`,
    stageSub: (w, s, st) => `World ${w} · Stage ${s} · ★ ${st}`,
    world: w => `World ${w}`, worldNames: ['Notebook', 'Chestnut Woods', 'Boing Boing', 'Ruler Ride', 'Warp Holes', 'Endless Notes'],
    worldDesc: ['Draw under Rolly and guide it to the cup.', 'Spiky chestnuts pop Rolly. Avoid them!', 'Green springs launch Rolly high.', 'Rulers start moving when Rolly drops.', 'Orange hole in, blue hole out.', 'Everything mixed. How far can you go?'],
    locked: (s, w) => `Clear World ${w} and collect ★ ${s} to unlock`,
    tries: n => `Try ${n}`, inkLabel: p => `Ink ${p}%`,
    tutorial: 'Trace the dotted line!', drawHint: 'Draw a line under Rolly',
    fail: ['Oops!', 'Ouch!', 'Nooo', 'So close!', 'Again!'], spike: 'Ouch!!',
    clear: 'Clear!', perfect: 'Perfect!', starClear: 'Clear', starCandy: 'Candy', starInk: 'Under par ink',
    next: 'Next stage', retry: 'Play again', toStages: 'Stage list', nextPuzzle: 'Next puzzle',
    share: 'Share result', shared: 'Copied! Paste it to your friends', nextIn: t => `Next puzzles in ${t}`,
    dailyDone: 'Daily complete!', streak: 'Streak', best: 'Best', played: 'Days', toStageMode: 'Play stages',
    noHints: 'No hints left', watchAd: 'Watch an ad for +1 hint', hintsEarn: 'Earn hints by finishing the daily puzzles.',
    sound: 'Sound', haptics: 'Vibration', privacy: 'Privacy policy', version: 'Version',
    getAd: 'Watch ad', unlocked: n => `New unlock: ${n}!`, selected: 'Equipped', how: c => c,
    skins: { basic: 'Rolly', peach: 'Peach', mint: 'Mint', cat: 'Kitty', melon: 'Melon', ninja: 'Ninja', king: 'King' },
    pens: { graphite: 'Pencil', blue: 'Blue pen', red: 'Red pen', marker: 'Highlighter', rainbow: 'Rainbow' },
    cond: { stars: n => `★ ${n}`, streak: n => `${n}-day streak`, daily: n => `${n} dailies`, world: n => `Clear World ${n}`, free: 'Default' },
    shareTitle: n => `Rolly #${n} ✏️`, shareTry: n => `(${n})`, shareStreak: n => `🔥 ${n}-day streak`, shareCta: 'Can you solve it with one line?',
    coins: 'Coins', themes: 'Themes', themeNames: { notebook: 'Notebook', space: 'Neon Space', zombie: 'Zombie Night' },
    buy: n => `Unlock for 🪙 ${n}?`, buyBtn: 'Unlock', cancel: 'Not now', notEnough: (n, h) => `Need 🪙 ${n} (you have ${h})`,
    double: n => `Watch ad: +${n} 🪙 more`, earned: n => `+${n} 🪙`, themeOn: n => `${n} theme on!`, starsInfo: 'Earn ★ in stages: clear it, grab the candy, save ink (max 3 each).', onlyNotebook: 'Skins show in the Notebook theme',
    loading: 'Drawing…',
  },
  ko: {
    name: '또르르', tag: '선 하나로 굴려 넣기', daily: '오늘의 문제', stages: '스테이지', collection: '도감', settings: '설정',
    hints: n => `💡 ${n}`, hint: '힌트', easy: '쉬움', normal: '보통', hard: '어려움',
    dailySubTodo: '오늘 모두가 같은 3문제를 풀어요', dailySubDone: t => `다 풀었어요! 다음 문제까지 ${t}`,
    stageSub: (w, s, st) => `월드 ${w} · ${s}단계 · ★ ${st}`,
    world: w => `월드 ${w}`, worldNames: ['연습장', '밤송이 숲', '통통 스프링', '움직이는 자', '순간이동', '무한 노트'],
    worldDesc: ['또르 밑에 선을 그어서 컵까지 보내요.', '밤송이에 닿으면 아야! 피해 가요.', '초록 스프링은 또르를 높이 튕겨요.', '또르가 떨어지면 자가 움직여요.', '주황 구멍으로 들어가면 파란 구멍으로 나와요.', '전부 섞였어요. 어디까지 갈 수 있을까?'],
    locked: (s, w) => `월드 ${w}를 깨고 ★ ${s}개를 모으면 열려요`,
    tries: n => `시도 ${n}`, inkLabel: p => `잉크 ${p}%`,
    tutorial: '점선을 따라 그려봐!', drawHint: '또르 밑에 선을 그어봐',
    fail: ['앗!', '아야!', '으앙', '아깝다!', '다시!'], spike: '아야!!',
    clear: '성공!', perfect: '완벽해!', starClear: '성공', starCandy: '별사탕', starInk: '잉크 절약',
    next: '다음 단계', retry: '다시 하기', toStages: '단계 목록', nextPuzzle: '다음 문제',
    share: '결과 공유하기', shared: '복사됐어요! 친구한테 붙여넣기', nextIn: t => `다음 문제까지 ${t}`,
    dailyDone: '오늘의 문제 완료!', streak: '연속', best: '최고', played: '참여', toStageMode: '스테이지 하러 가기',
    noHints: '힌트가 없어요', watchAd: '광고 보고 힌트 +1', hintsEarn: '오늘의 문제를 다 풀면 힌트를 받아요.',
    sound: '소리', haptics: '진동', privacy: '개인정보 처리방침', version: '버전',
    getAd: '광고 보기', unlocked: n => `새로 열림: ${n}!`, selected: '장착 중', how: c => c,
    skins: { basic: '또르', peach: '복숭아', mint: '민트', cat: '냥또르', melon: '수박', ninja: '닌자', king: '왕또르' },
    pens: { graphite: '연필', blue: '파란 볼펜', red: '빨간 펜', marker: '형광펜', rainbow: '무지개' },
    cond: { stars: n => `★ ${n}개`, streak: n => `${n}일 연속`, daily: n => `오늘의 문제 ${n}회`, world: n => `월드 ${n} 클리어`, free: '기본' },
    shareTitle: n => `또르르 #${n} ✏️`, shareTry: n => `(${n}번)`, shareStreak: n => `🔥 ${n}일 연속`, shareCta: '너도 선 하나로 풀 수 있어?',
    coins: '코인', themes: '테마', themeNames: { notebook: '공책', space: '네온 우주', zombie: '좀비의 밤' },
    buy: n => `🪙 ${n}으로 열까요?`, buyBtn: '열기', cancel: '나중에', notEnough: (n, h) => `🪙 ${n}개가 필요해요 (보유 ${h})`,
    double: n => `광고 보고 🪙 ${n} 더 받기`, earned: n => `+${n} 🪙`, themeOn: n => `${n} 테마 적용!`, starsInfo: '★ 별은 스테이지에서 모아요: 클리어, 별사탕, 잉크 절약 (스테이지마다 최대 3개)', onlyNotebook: '스킨은 공책 테마에서 보여요',
    loading: '그리는 중…',
  },
  ja: {
    name: 'コロリン', tag: '一本線でころころ', daily: '今日の問題', stages: 'ステージ', collection: '図鑑', settings: '設定',
    hints: n => `💡 ${n}`, hint: 'ヒント', easy: 'かんたん', normal: 'ふつう', hard: 'むずかしい',
    dailySubTodo: '今日はみんな同じ3問', dailySubDone: t => `全部クリア！次まで ${t}`,
    stageSub: (w, s, st) => `ワールド ${w} · ${s} · ★ ${st}`,
    world: w => `ワールド ${w}`, worldNames: ['れんしゅう帳', 'いがぐりの森', 'ぴょんぴょんバネ', 'うごく定規', 'ワープ穴', 'むげんノート'],
    worldDesc: ['コロリンの下に線を引いてカップへ。', 'いがぐりに当たるとイタッ！よけよう。', '緑のバネで高くジャンプ。', '落ちると定規が動き出す。', 'オレンジに入って青から出る。', 'ぜんぶまぜこぜ。どこまで行ける？'],
    locked: (s, w) => `ワールド ${w} クリア＋★ ${s} で解放`,
    tries: n => `${n}回目`, inkLabel: p => `インク ${p}%`,
    tutorial: '点線をなぞってみて！', drawHint: 'コロリンの下に線を引こう',
    fail: ['あっ！', 'イタッ！', 'うわーん', 'おしい！', 'もう一回！'], spike: 'イタッ！！',
    clear: 'クリア！', perfect: 'パーフェクト！', starClear: 'クリア', starCandy: 'こんぺいとう', starInk: 'インク節約',
    next: '次のステージ', retry: 'もう一回', toStages: 'ステージ一覧', nextPuzzle: '次の問題',
    share: '結果をシェア', shared: 'コピーしました！友だちに貼ってね', nextIn: t => `次の問題まで ${t}`,
    dailyDone: '今日の問題クリア！', streak: '連続', best: '最高', played: '参加', toStageMode: 'ステージで遊ぶ',
    noHints: 'ヒントがありません', watchAd: '広告を見てヒント+1', hintsEarn: '今日の問題を全部解くとヒントがもらえます。',
    sound: 'サウンド', haptics: '振動', privacy: 'プライバシーポリシー', version: 'バージョン',
    getAd: '広告を見る', unlocked: n => `新しく解放：${n}！`, selected: '装備中', how: c => c,
    skins: { basic: 'コロリン', peach: 'もも', mint: 'ミント', cat: 'ねこ', melon: 'スイカ', ninja: 'ニンジャ', king: 'キング' },
    pens: { graphite: 'えんぴつ', blue: '青ペン', red: '赤ペン', marker: '蛍光ペン', rainbow: 'にじいろ' },
    cond: { stars: n => `★ ${n}`, streak: n => `${n}日連続`, daily: n => `今日の問題 ${n}回`, world: n => `ワールド ${n} クリア`, free: 'デフォルト' },
    shareTitle: n => `コロリン #${n} ✏️`, shareTry: n => `(${n}回)`, shareStreak: n => `🔥 ${n}日連続`, shareCta: '一本線で解けるかな？',
    coins: 'コイン', themes: 'テーマ', themeNames: { notebook: 'ノート', space: 'ネオン宇宙', zombie: 'ゾンビの夜' },
    buy: n => `🪙 ${n} で解放する？`, buyBtn: '解放', cancel: 'あとで', notEnough: (n, h) => `🪙 ${n} 必要です（所持 ${h}）`,
    double: n => `広告を見て 🪙 ${n} 追加`, earned: n => `+${n} 🪙`, themeOn: n => `${n} テーマ適用！`, starsInfo: '★ はステージで集めよう：クリア・こんぺいとう・インク節約（各最大3個）', onlyNotebook: 'スキンはノートテーマで表示されます',
    loading: 'えがいてる…',
  },
};
const LANG = (() => { const l = (navigator.language || 'en').slice(0, 2); return STR[l] ? l : 'en'; })();
const S = STR[LANG];
document.documentElement.lang = LANG;
document.title = S.name;

// ---------- 물리 상수 ----------
const W = 360, H = 640, R = 13, G = 1100, DT = 1 / 240, E = 0.18, FR = 0.0025, MAXT = 10, VMAX = 1250;
const INK = '#2b2b33';

// ---------- 유틸 ----------
function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash(a, b) { let h = Math.imul(a ^ 0x9e3779b9, 2654435761) ^ Math.imul(b + 0x7f4a7c15, 40503); h ^= h >>> 15; return h >>> 0; }
function segDist(px, py, x1, y1, x2, y2) { const dx = x2 - x1, dy = y2 - y1; const l2 = dx * dx + dy * dy || 1; let t = ((px - x1) * dx + (py - y1) * dy) / l2; t = t < 0 ? 0 : t > 1 ? 1 : t; const qx = x1 + t * dx, qy = y1 + t * dy; return [Math.hypot(px - qx, py - qy), qx, qy]; }
function lineLen(p) { let l = 0; for (let i = 1; i < p.length; i++) l += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y); return l; }
function dateKey(d) { return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
function today() { const d = new Date(); return { key: dateKey(d), no: Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - CFG.epoch) / 864e5) + 1 }; }
function countdown() { const n = new Date(), m = new Date(n); m.setHours(24, 0, 0, 0); const s = Math.max(0, Math.floor((m - n) / 1000)); return [s / 3600 | 0, (s / 60 | 0) % 60, s % 60].map(v => String(v).padStart(2, '0')).join(':'); }
const store = {
  get(k, d) { try { const v = localStorage.getItem('rolly:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('rolly:' + k, JSON.stringify(v)); } catch (e) { } },
};
const $ = id => document.getElementById(id);
const Cap = () => window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() ? window.Capacitor : null;
const plugin = n => { const c = Cap(); return c && c.Plugins ? c.Plugins[n] : null; };

// ---------- 진행 데이터 ----------
const prog = Object.assign({
  stars: {}, candy: {}, hints: 3, dailyClears: 0, streak: 0, bestStreak: 0, lastDaily: 0, daysPlayed: 0,
  skin: 'basic', pen: 'graphite', coins: 0, theme: 'notebook', themes: ['notebook'], snd: true, hap: true, seen: ['basic', 'graphite'], cleared: 0, sinceAd: 0, endless: 0,
}, store.get('prog', {}));
function save() { store.set('prog', prog); }
function totalStars() { return Object.values(prog.stars).reduce((a, b) => a + b, 0); }

// ---------- 월드 / 스테이지 ----------
const PER_WORLD = 20;
const WORLDS = [
  { mech: {}, d0: .05, d1: .45 },
  { mech: { spikes: 1 }, d0: .2, d1: .6 },
  { mech: { springs: 1, spikes: 1 }, d0: .25, d1: .65 },
  { mech: { moving: 1, spikes: 1 }, d0: .3, d1: .7 },
  { mech: { portals: 1, spikes: 1 }, d0: .3, d1: .75 },
  { mech: null, endless: true },
];
const STAR_GATE = 30; // 월드 하나당 필요한 별
function worldUnlocked(w) { if (w === 0) return true; return prog.stars[`${w - 1}-${PER_WORLD - 1}`] > 0 && totalStars() >= STAR_GATE * w; }
function stageCount(w) { return WORLDS[w].endless ? Math.max(PER_WORLD, prog.endless + 4) : PER_WORLD; }
function stageUnlocked(w, i) { return worldUnlocked(w) && (i === 0 || prog.stars[`${w}-${i - 1}`] > 0); }
function stageParams(w, i) {
  const W_ = WORLDS[w];
  if (W_.endless) {
    const r = rng(hash(9000, i));
    const mech = { spikes: r() < .8, springs: r() < .4, moving: r() < .4, portals: r() < .3 };
    return { seed: hash(777, i), diff: Math.min(.95, .55 + i * .012), mech };
  }
  return { seed: hash(1000 + w, i), diff: W_.d0 + (W_.d1 - W_.d0) * (i / (PER_WORLD - 1)), mech: W_.mech };
}
function dailyParams(key, k) {
  const r = rng(hash(key, 99));
  const all = ['spikes', 'springs', 'moving', 'portals'];
  const m2 = all[Math.floor(r() * 4)];
  if (k === 0) return { seed: hash(key, 1), diff: .1, mech: {} };
  if (k === 1) return { seed: hash(key, 2), diff: .45, mech: { spikes: 1 } };
  return { seed: hash(key, 3), diff: .8, mech: { spikes: 1, [m2]: 1 } };
}

// ---------- 스킨 / 펜 ----------
const SKINS = {
  basic: { c: '#ffd23f', need: null },
  peach: { c: '#ffb0c0', blush: 1, need: ['stars', 15] },
  mint: { c: '#8fe3c6', need: ['stars', 40] },
  cat: { c: '#ffb766', ears: 1, need: ['stars', 80] },
  melon: { c: '#6fcf6b', c2: '#2f7d32', stripes: 1, need: ['stars', 130] },
  ninja: { c: '#4b4b5a', band: 1, need: ['stars', 200] },
  king: { c: '#ffd23f', crown: 1, need: ['streak', 7] },
};
const PENS = {
  graphite: { c: '#3b3b46', w: 4, need: null },
  blue: { c: '#2f5bd3', w: 4, need: ['daily', 1] },
  red: { c: '#e03c3c', w: 4, need: ['daily', 3] },
  marker: { c: 'rgba(255,214,0,.75)', w: 10, need: ['daily', 7] },
  rainbow: { c: 'rainbow', w: 5, need: ['world', 5] },
};
function meets(need) {
  if (!need) return true;
  const [k, n] = need;
  if (k === 'stars') return totalStars() >= n;
  if (k === 'streak') return prog.bestStreak >= n;
  if (k === 'daily') return prog.dailyClears >= n;
  if (k === 'world') return prog.stars[`${n - 1}-${PER_WORLD - 1}`] > 0;
  return false;
}
function checkUnlocks() {
  const news = [];
  for (const [id, s] of Object.entries(SKINS)) if (meets(s.need) && !prog.seen.includes(id)) { prog.seen.push(id); news.push(S.skins[id]); }
  for (const [id, p] of Object.entries(PENS)) if (meets(p.need) && !prog.seen.includes(id)) { prog.seen.push(id); news.push(S.pens[id]); }
  if (news.length) { save(); setTimeout(() => toast(S.unlocked(news.join(', '))), 1400); }
}

// =========================================================
//  물리 시뮬레이션 (레벨 검증과 실제 플레이가 같은 코드를 씀)
// =========================================================
function mkSeg(x1, y1, x2, y2, extra) {
  const s = { x1, y1, x2, y2, bx1: x1, by1: y1, bx2: x2, by2: y2, vx: 0, vy: 0 };
  if (extra) Object.assign(s, extra);
  bbox(s); return s;
}
function bbox(s) { s.minx = Math.min(s.x1, s.x2) - R; s.maxx = Math.max(s.x1, s.x2) + R; s.miny = Math.min(s.y1, s.y2) - R; s.maxy = Math.max(s.y1, s.y2) + R; }
function cupWalls(c) { const l = c.x - c.w / 2, r = c.x + c.w / 2, t = c.y - c.h, b = c.y; return [[l, t, l, b], [l, b, r, b], [r, b, r, t]]; }

class Sim {
  constructor(L, line, rec, live) {
    this.L = L; this.segs = []; this.movers = [];
    for (const p of L.planks) { const s = mkSeg(p.x1, p.y1, p.x2, p.y2, p.mv ? { mv: p.mv } : null); this.segs.push(s); if (p.mv) this.movers.push(s); }
    for (const p of L.springs) this.segs.push(mkSeg(p.x1, p.y1, p.x2, p.y2, { spring: 1, src: p }));
    for (const w of cupWalls(L.cup)) this.segs.push(mkSeg(...w));
    for (let i = 1; i < line.length; i++) this.segs.push(mkSeg(line[i - 1].x, line[i - 1].y, line[i].x, line[i].y));
    this.x = L.start.x; this.y = L.start.y; this.vx = 0; this.vy = 0; this.t = 0; this.still = 0; this.done = null;
    this.warpCd = 0; this.gotCandy = false; this.events = []; this.rec = rec ? [] : null; this.n = 0; this.live = !!live; this.contact = null;
    this.moveTo(0);
  }
  moveTo(t) {
    for (const s of this.movers) {
      const m = s.mv, w = 2 * Math.PI / m.per, k = Math.sin(w * t + m.ph), kv = Math.cos(w * t + m.ph) * w;
      s.x1 = s.bx1 + m.ax * k; s.x2 = s.bx2 + m.ax * k; s.y1 = s.by1 + m.ay * k; s.y2 = s.by2 + m.ay * k;
      s.vx = m.ax * kv; s.vy = m.ay * kv; bbox(s);
    }
  }
  step() {
    if (this.done) return;
    const L = this.L; this.contact = null;
    if (this.movers.length) this.moveTo(this.t);
    this.vy += G * DT;
    const sp = Math.hypot(this.vx, this.vy); if (sp > VMAX) { this.vx *= VMAX / sp; this.vy *= VMAX / sp; }
    this.x += this.vx * DT; this.y += this.vy * DT;
    for (let it = 0; it < 2; it++) for (const s of this.segs) {
      if (this.x < s.minx || this.x > s.maxx || this.y < s.miny || this.y > s.maxy) continue;
      const [d, qx, qy] = segDist(this.x, this.y, s.x1, s.y1, s.x2, s.y2);
      if (d < R && d > 1e-6) {
        const nx = (this.x - qx) / d, ny = (this.y - qy) / d;
        this.x = qx + nx * R; this.y = qy + ny * R;
        const rvx = this.vx - s.vx, rvy = this.vy - s.vy, vn = rvx * nx + rvy * ny;
        if (vn < 0) {
          if (s.spring) {
            this.vx -= 2 * vn * nx; this.vy -= 2 * vn * ny;
            const out = this.vx * nx + this.vy * ny; if (out < 620) { this.vx += (620 - out) * nx; this.vy += (620 - out) * ny; }
            this.ev({ k: 'boing', x: qx, y: qy, nx, ny, v: 600, s: s.src });
          } else {
            this.vx -= (1 + E) * vn * nx; this.vy -= (1 + E) * vn * ny;
            const tx = -ny, ty = nx, vt = (this.vx - s.vx) * tx + (this.vy - s.vy) * ty;
            this.vx -= vt * tx * FR; this.vy -= vt * ty * FR;
            if (-vn > 160) this.ev({ k: 'tap', x: qx, y: qy, nx, ny, v: -vn });
          }
          this.contact = { x: qx, y: qy, nx, ny };
        }
      }
    }
    for (const k of L.spikes) if (Math.hypot(this.x - k.x, this.y - k.y) < R + k.r - 3) { this.done = 'spike'; return; }
    if (this.warpCd > 0) this.warpCd -= DT;
    else for (const p of L.portals) if (Math.hypot(this.x - p.ax, this.y - p.ay) < 16) { this.x = p.bx; this.y = p.by; this.warpCd = .35; this.ev({ k: 'warp', x: p.ax, y: p.ay, x2: p.bx, y2: p.by }); break; }
    if (L.candy && !this.gotCandy && Math.hypot(this.x - L.candy.x, this.y - L.candy.y) < R + 11) { this.gotCandy = true; this.ev({ k: 'candy', x: L.candy.x, y: L.candy.y }); }
    const c = L.cup;
    if (this.x > c.x - c.w / 2 + R * .6 && this.x < c.x + c.w / 2 - R * .6 && this.y > c.y - c.h + R && this.y < c.y) { this.done = 'win'; return; }
    if (this.y > H + 50 || this.x < -50 || this.x > W + 50) { this.done = 'out'; return; }
    this.still = Math.hypot(this.vx, this.vy) < 10 ? this.still + DT : 0;
    if (this.still > .8) { this.done = 'stuck'; return; }
    this.t += DT; if (this.t > MAXT) this.done = 'timeout';
    if (this.rec && (this.n++ % 6 === 0)) this.rec.push({ x: this.x, y: this.y });
  }
  ev(o) { if (this.live) this.events.push(o); }
  run() { while (!this.done) this.step(); return this.done; }
}

// =========================================================
//  레벨 생성: 시드 고정 → 모두가 같은 문제. 풀리는 레벨만 출제.
// =========================================================
const levelCache = new Map();
function genLevel(seed, diff, mech) {
  const ck = seed + ':' + diff.toFixed(3) + ':' + JSON.stringify(mech);
  if (levelCache.has(ck)) return levelCache.get(ck);
  for (let k = 0; k < 400; k++) {
    const r = rng(hash(seed, k));
    const sx = 60 + r() * 240, sy = 80;
    let gx; do { gx = 55 + r() * 250; } while (Math.abs(gx - sx) < 110);
    const cup = { x: gx, y: 505 + r() * 80, w: 64, h: 44 };
    const L = { start: { x: sx, y: sy }, cup, planks: [], springs: [], spikes: [], portals: [], candy: null };
    const near = (x, y, m) => Math.hypot(x - sx, y - sy) < m + 45 || Math.hypot(x - cup.x, y - (cup.y - cup.h / 2)) < m + 45 || Math.hypot(x - cup.x, y - (cup.y - cup.h - 45)) < m + 22;
    const segBad = (x1, y1, x2, y2, pad) => {
      if (segDist(sx, sy, x1, y1, x2, y2)[0] < 60 + pad) return true;
      if (segDist(cup.x, cup.y - cup.h / 2, x1, y1, x2, y2)[0] < 55 + pad) return true;
      if (segDist(cup.x, cup.y - cup.h - 45, x1, y1, x2, y2)[0] < 40 + pad) return true;
      return false;
    };
    const np = 1 + Math.floor(r() * (1.5 + diff * 3));
    for (let g = 0; g < 120 && L.planks.length < np; g++) {
      const cx = 40 + r() * 280, cy = 170 + r() * 380, len = 60 + r() * 90, a = (r() - .5) * 1.4;
      const p = { x1: cx - Math.cos(a) * len / 2, y1: cy - Math.sin(a) * len / 2, x2: cx + Math.cos(a) * len / 2, y2: cy + Math.sin(a) * len / 2 };
      let pad = 0;
      if (mech.moving && r() < .7) { const horiz = r() < .6, amp = 35 + r() * 45; p.mv = { ax: horiz ? amp : 0, ay: horiz ? 0 : amp * .7, per: 1.6 + r() * 1.8, ph: r() * 6.283 }; pad = amp; }
      if (segBad(p.x1, p.y1, p.x2, p.y2, pad)) continue;
      L.planks.push(p);
    }
    if (mech.moving && !L.planks.some(p => p.mv)) continue;
    if (mech.springs) {
      const ns = 1 + (r() < diff ? 1 : 0);
      for (let g = 0; g < 80 && L.springs.length < ns; g++) {
        const cx = 40 + r() * 280, cy = 220 + r() * 330, len = 46 + r() * 24, a = (r() - .5) * .9;
        const p = { x1: cx - Math.cos(a) * len / 2, y1: cy - Math.sin(a) * len / 2, x2: cx + Math.cos(a) * len / 2, y2: cy + Math.sin(a) * len / 2 };
        if (segBad(p.x1, p.y1, p.x2, p.y2, 0) || L.planks.some(q => segDist(cx, cy, q.x1, q.y1, q.x2, q.y2)[0] < 50)) continue;
        L.springs.push(p);
      }
      if (!L.springs.length) continue;
    }
    if (mech.portals) {
      for (let g = 0; g < 80 && !L.portals.length; g++) {
        const ax = 40 + r() * 280, ay = 200 + r() * 260, bx = 40 + r() * 280, by = 150 + r() * 280;
        if (Math.hypot(ax - bx, ay - by) < 150 || near(ax, ay, 10) || near(bx, by, 10)) continue;
        if ([...L.planks, ...L.springs].some(q => segDist(ax, ay, q.x1, q.y1, q.x2, q.y2)[0] < 35 || segDist(bx, by, q.x1, q.y1, q.x2, q.y2)[0] < 35)) continue;
        L.portals.push({ ax, ay, bx, by });
      }
      if (!L.portals.length) continue;
    }
    if (mech.spikes) {
      const ns = Math.max(1, Math.floor(diff * 2 + r() * (1 + diff * 3)));
      for (let g = 0; g < 120 && L.spikes.length < ns; g++) {
        const x = 30 + r() * 300, y = 160 + r() * 400;
        if (near(x, y, 25)) continue;
        if ([...L.planks, ...L.springs].some(q => segDist(x, y, q.x1, q.y1, q.x2, q.y2)[0] < 26)) continue;
        if (L.portals.some(p => Math.hypot(x - p.ax, y - p.ay) < 45 || Math.hypot(x - p.bx, y - p.by) < 45)) continue;
        L.spikes.push({ x, y, r: 13 });
      }
    }
    if (new Sim(L, []).run() === 'win') continue; // 선 없이 풀리면 탈락

    let best = null; const dir = Math.sign(gx - sx);
    for (let c = 0; c < 80; c++) {
      const p0 = { x: sx - dir * (15 + r() * 35), y: sy + 45 + r() * 170 };
      let p2;
      if (L.portals.length && r() < .5) { const P = L.portals[0]; p2 = { x: P.ax + (r() - .5) * 60, y: P.ay - 20 - r() * 40 }; }
      else p2 = { x: gx - dir * (r() * 45), y: cup.y - cup.h - 25 - r() * 150 };
      if (p2.y < p0.y + 30) continue;
      const p1 = { x: (p0.x + p2.x) / 2 + (r() - .5) * 90, y: (p0.y + p2.y) / 2 + (r() - .5) * 90 };
      const line = []; for (let i = 0; i <= 24; i++) { const t = i / 24, u = 1 - t; line.push({ x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x, y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y }); }
      if (line.some(p => L.spikes.some(k => Math.hypot(p.x - k.x, p.y - k.y) < k.r + 4))) continue;
      const sim = new Sim(L, line, true);
      if (sim.run() !== 'win') continue;
      let robust = true; // 손으로 대충 그려도 풀리는지 확인
      for (const [ox, oy, j] of [[0, -4, 2], [3, 3, 2], [-3, 2, 3]]) {
        const jl = line.map((p, i) => ({ x: p.x + ox + (i ? (r() - .5) * j : 0), y: p.y + oy + (i ? (r() - .5) * j : 0) }));
        if (new Sim(L, jl).run() !== 'win') { robust = false; break; }
      }
      if (!robust) continue;
      const ink = lineLen(line);
      if (!best || ink < best.ink) best = { line, ink, path: sim.rec };
    }
    if (!best) continue;
    // 별사탕: 정답 궤적 중간에 놓기 (보너스 별)
    const path = best.path, n = path.length;
    for (let i = Math.floor(n * .3); i < n * .75; i++) {
      const p = path[i];
      if (p.y < sy + 60 || near(p.x, p.y, 0)) continue;
      if (L.spikes.some(k => Math.hypot(p.x - k.x, p.y - k.y) < 40)) continue;
      L.candy = { x: p.x, y: p.y }; break;
    }
    L.ref = best.line; L.refInk = best.ink;
    L.inkMax = Math.round(best.ink * (1.55 - diff * .3) + 30);
    L.par = Math.round(best.ink * 1.12 + 10);
    levelCache.set(ck, L);
    return L;
  }
  return null;
}

// =========================================================
//  손그림 렌더링
// =========================================================
function jit(seed) { const r = rng(seed); return () => r() - .5; }
function sketchLine(c, x1, y1, x2, y2, seed, color, w, passes = 2) {
  const j = jit(seed); c.strokeStyle = color; c.lineWidth = w; c.lineCap = 'round';
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
  for (let p = 0; p < passes; p++) {
    const b = Math.min(3, len * .02);
    c.globalAlpha = p ? .55 : 1;
    c.beginPath(); c.moveTo(x1 + j() * 2, y1 + j() * 2);
    c.quadraticCurveTo((x1 + x2) / 2 + nx * j() * b * 2, (y1 + y2) / 2 + ny * j() * b * 2, x2 + j() * 2, y2 + j() * 2);
    c.stroke();
  }
  c.globalAlpha = 1;
}
function sketchCircle(c, x, y, r, seed, color, w) {
  const j = jit(seed); c.strokeStyle = color; c.lineWidth = w;
  c.beginPath(); const a0 = j() * 6;
  for (let i = 0; i <= 26; i++) { const a = a0 + i / 24 * Math.PI * 2, rr = r + j() * 1.4; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  c.stroke();
}
function drawPaper(c) {
  c.fillStyle = '#fffdf6'; c.fillRect(-30, -30, W + 60, H + 60);
  c.strokeStyle = 'rgba(80,130,210,.2)'; c.lineWidth = 1;
  for (let y = 40; y < H; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
  c.strokeStyle = 'rgba(224,74,63,.22)'; c.beginPath(); c.moveTo(28, 0); c.lineTo(28, H); c.stroke();
}
function drawTorr(c, x, y, r, ang, mood, skinId, blink) {
  const sk = SKINS[skinId] || SKINS.basic;
  c.save(); c.translate(x, y); c.rotate(ang);
  // 액세서리(뒤)
  if (sk.ears) { c.fillStyle = sk.c; c.strokeStyle = INK; c.lineWidth = 2.2; for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * r * .25, -r * .9); c.lineTo(s * r * .75, -r * 1.35); c.lineTo(s * r * .9, -r * .45); c.closePath(); c.fill(); c.stroke(); } }
  c.fillStyle = sk.c; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill();
  if (sk.stripes) { c.save(); c.beginPath(); c.arc(0, 0, r, 0, 7); c.clip(); c.strokeStyle = sk.c2; c.lineWidth = r * .22; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(i * r * .5, -r); c.quadraticCurveTo(i * r * .5 + r * .3, 0, i * r * .5, r); c.stroke(); } c.restore(); }
  c.strokeStyle = INK; c.lineWidth = Math.max(1.6, r * .16); c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke();
  if (sk.band) { c.fillStyle = '#e03c3c'; c.fillRect(-r * .98, -r * .62, r * 1.96, r * .32); c.strokeStyle = '#e03c3c'; c.lineWidth = r * .14; c.beginPath(); c.moveTo(r * .9, -r * .45); c.lineTo(r * 1.4, -r * .75); c.moveTo(r * .9, -r * .45); c.lineTo(r * 1.45, -r * .3); c.stroke(); }
  if (sk.crown) { c.fillStyle = '#ffb000'; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.moveTo(-r * .55, -r * .8); c.lineTo(-r * .6, -r * 1.45); c.lineTo(-r * .25, -r * 1.1); c.lineTo(0, -r * 1.55); c.lineTo(r * .25, -r * 1.1); c.lineTo(r * .6, -r * 1.45); c.lineTo(r * .55, -r * .8); c.closePath(); c.fill(); c.stroke(); }
  // 얼굴
  const eyeC = sk.band || skinId === 'ninja' ? '#fff' : INK;
  c.fillStyle = eyeC; c.strokeStyle = eyeC; c.lineWidth = Math.max(1.5, r * .13); c.lineCap = 'round';
  const ex = r * .36, ey = -r * .12;
  if (mood === 'win') {
    for (const s of [-1, 1]) { c.beginPath(); c.arc(s * ex, ey + r * .06, r * .16, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
    c.beginPath(); c.arc(0, r * .2, r * .3, 0, Math.PI); c.closePath(); c.fillStyle = '#e04a3f'; c.fill(); c.strokeStyle = eyeC; c.stroke();
  } else if (mood === 'fail') {
    for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * ex - r * .13, ey - r * .13); c.lineTo(s * ex + r * .13, ey + r * .13); c.moveTo(s * ex + r * .13, ey - r * .13); c.lineTo(s * ex - r * .13, ey + r * .13); c.stroke(); }
    c.beginPath(); c.moveTo(-r * .3, r * .38); c.quadraticCurveTo(-r * .15, r * .26, 0, r * .38); c.quadraticCurveTo(r * .15, r * .5, r * .3, r * .38); c.stroke();
  } else if (mood === 'fall') {
    for (const s of [-1, 1]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(s * ex, ey, r * .22, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 1.2; c.stroke(); c.fillStyle = INK; c.beginPath(); c.arc(s * ex, ey + r * .05, r * .1, 0, 7); c.fill(); }
    c.fillStyle = INK; c.beginPath(); c.ellipse(0, r * .38, r * .13, r * .17, 0, 0, 7); c.fill();
  } else {
    if (blink) for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * ex - r * .12, ey); c.lineTo(s * ex + r * .12, ey); c.stroke(); }
    else for (const s of [-1, 1]) { c.beginPath(); c.arc(s * ex, ey, r * .11, 0, 7); c.fill(); }
    c.beginPath(); c.arc(0, r * .16, r * .26, .2, Math.PI - .2); c.stroke();
  }
  if (sk.blush || mood === 'win') { c.fillStyle = 'rgba(255,90,110,.35)'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * r * .62, r * .2, r * .17, r * .1, 0, 0, 7); c.fill(); } }
  c.restore();
}
function drawMug(c, cup, t) {
  const l = cup.x - cup.w / 2, rr = cup.x + cup.w / 2, top = cup.y - cup.h, b = cup.y;
  c.fillStyle = 'rgba(63,168,111,.12)'; c.fillRect(l, top, cup.w, cup.h);
  c.strokeStyle = '#3fa86f'; c.lineWidth = 4; c.lineJoin = 'round'; c.lineCap = 'round';
  c.beginPath(); c.moveTo(l - 2, top - 1); c.lineTo(l, b); c.quadraticCurveTo(cup.x, b + 4, rr, b); c.lineTo(rr + 2, top - 1); c.stroke();
  const side = cup.x < W / 2 ? 1 : -1, hx = side > 0 ? rr : l;
  c.beginPath(); c.arc(hx + side * 2, (top + b) / 2, 11, -Math.PI / 2, Math.PI / 2, side < 0); c.stroke();
  c.strokeStyle = 'rgba(63,168,111,.45)'; c.lineWidth = 2;
  for (let i = -1; i <= 1; i++) { const x = cup.x + i * 14, o = Math.sin(t * 2 + i) * 3; c.beginPath(); c.moveTo(x, top - 8); c.bezierCurveTo(x + 6 + o, top - 14, x - 6 + o, top - 20, x + o, top - 28); c.stroke(); }
}
function drawSpike(c, k, t, i) {
  c.save(); c.translate(k.x, k.y); c.rotate(Math.sin(t * 2 + i) * .15);
  c.fillStyle = '#8a5a2b'; c.beginPath(); c.arc(0, 0, k.r * .62, 0, 7); c.fill();
  c.strokeStyle = '#e04a3f'; c.lineWidth = 2.4; c.lineCap = 'round';
  for (let a = 0; a < 14; a++) { const ang = a / 14 * Math.PI * 2; c.beginPath(); c.moveTo(Math.cos(ang) * k.r * .5, Math.sin(ang) * k.r * .5); c.lineTo(Math.cos(ang) * (k.r + 4), Math.sin(ang) * (k.r + 4)); c.stroke(); }
  c.restore();
}
function drawSpring(c, s, i) {
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = uy, ny = -ux;
  c.strokeStyle = '#3fa86f'; c.lineWidth = 2.5; c.beginPath();
  const zz = 7;
  for (let k = 0; k <= zz; k++) { const t = k / zz, px = s.x1 + dx * t + nx * (-(k % 2 ? 9 : 2)) * -1, py = s.y1 + dy * t + ny * (-(k % 2 ? 9 : 2)) * -1; k ? c.lineTo(px, py) : c.moveTo(px, py); }
  c.stroke();
  sketchLine(c, s.x1, s.y1, s.x2, s.y2, 500 + i, '#3fa86f', 6, 1);
}
function drawPortal(c, p, t) {
  for (const [x, y, col, dir] of [[p.ax, p.ay, '#ff8a1f', 1], [p.bx, p.by, '#3a63d8', -1]]) {
    c.save(); c.translate(x, y); c.rotate(t * 2 * dir);
    c.setLineDash([6, 5]); c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 17, 0, 7); c.stroke(); c.setLineDash([]);
    c.fillStyle = col + '33'; c.beginPath(); c.arc(0, 0, 13, 0, 7); c.fill();
    c.restore();
  }
  c.save(); c.setLineDash([2, 8]); c.strokeStyle = 'rgba(43,43,51,.18)'; c.lineWidth = 2; c.beginPath(); c.moveTo(p.ax, p.ay); c.lineTo(p.bx, p.by); c.stroke(); c.restore();
}
function drawCandy(c, x, y, t, s = 1) {
  c.save(); c.translate(x, y); c.rotate(Math.sin(t * 3) * .25); c.scale(s, s);
  c.fillStyle = '#ffd23f'; c.strokeStyle = INK; c.lineWidth = 2; c.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 4.5 : 11; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  c.closePath(); c.fill(); c.stroke(); c.restore();
}
function strokePen(c, pts, penId, alpha = 1) {
  if (pts.length < 2) return;
  const pen = PENS[penId] || PENS.graphite, col = penColor(penId);
  c.save(); c.globalAlpha = alpha; c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = pen.w;
  if (pal().glow) { c.shadowColor = col === 'rainbow' ? '#fff' : col; c.shadowBlur = 12; }
  if (col === 'rainbow') {
    let acc = 0;
    for (let i = 1; i < pts.length; i++) { acc += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y); c.strokeStyle = `hsl(${acc * 1.2 % 360},85%,55%)`; c.beginPath(); c.moveTo(pts[i - 1].x, pts[i - 1].y); c.lineTo(pts[i].x, pts[i].y); c.stroke(); }
  } else {
    c.strokeStyle = col; c.beginPath(); c.moveTo(pts[0].x, pts[0].y); for (const p of pts) c.lineTo(p.x, p.y); c.stroke();
    if (penId === 'graphite' && th() === 'notebook') { c.globalAlpha = alpha * .35; c.lineWidth = 1.5; c.beginPath(); c.moveTo(pts[0].x + 1.5, pts[0].y + 1); for (const p of pts) c.lineTo(p.x + 1.5, p.y + 1); c.stroke(); }
  }
  c.restore();
}

// =========================================================
//  테마: 공책 / 네온 우주 / 좀비의 밤
// =========================================================
const THEMES = { notebook: { cost: 0 }, space: { cost: 300 }, zombie: { cost: 300 } };
const PAL = {
  notebook: { plank: INK, mover: '#3a63d8', spring: '#3fa86f', dust: '#b9b2a0', guide: 'rgba(43,43,51,.22)', hint: 'rgba(224,74,63,.55)', portal: ['#ff8a1f', '#3a63d8'], conf: ['#ffd23f', '#e04a3f', '#3a63d8', '#3fa86f', '#ff8a1f'], spark: '#f2b705', glow: 0 },
  space: { plank: '#7ef9ff', mover: '#ff4fd8', spring: '#7dff6a', dust: '#7ef9ff', guide: 'rgba(126,249,255,.28)', hint: 'rgba(255,210,63,.75)', portal: ['#ff4fd8', '#7ef9ff'], conf: ['#7ef9ff', '#ff4fd8', '#ffd23f', '#7dff6a', '#ffffff'], spark: '#7ef9ff', glow: 1 },
  zombie: { plank: '#a07a52', mover: '#e8e2cf', spring: '#9be15d', dust: '#7d8c69', guide: 'rgba(230,240,216,.2)', hint: 'rgba(255,140,60,.8)', portal: ['#9be15d', '#b46be0'], conf: ['#9be15d', '#b46be0', '#ff8c3c', '#e8e2cf', '#ffd23f'], spark: '#9be15d', glow: 0 },
};
function th() { return THEMES[prog.theme] && prog.themes.includes(prog.theme) ? prog.theme : 'notebook'; }
function pal() { return PAL[th()]; }
function applyTheme() {
  const t = th(); document.documentElement.dataset.gtheme = t;
  const cs = document.querySelector('meta[name=color-scheme]'); if (cs) cs.content = t === 'notebook' ? 'only light' : 'only dark';
  const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = { notebook: '#fbf7ec', space: '#0b1028', zombie: '#141a15' }[t];
  const SB = plugin('StatusBar'); try { if (SB) SB.setStyle({ style: t === 'notebook' ? 'LIGHT' : 'DARK' }); } catch (e) { }
}
const STARS = (() => { const r = rng(42), a = []; for (let i = 0; i < 90; i++) a.push({ x: r() * W, y: r() * H, s: .6 + r() * 1.6, sp: .5 + r() * 2.5, ph: r() * 6 }); return a; })();
function drawBg(c, t) {
  const k = th();
  if (k === 'notebook') return drawPaper(c);
  if (k === 'space') {
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060922'); g.addColorStop(1, '#1d0b3d'); c.fillStyle = g; c.fillRect(-30, -30, W + 60, H + 60);
    for (const [x, y, r, col] of [[70, 170, 170, 'rgba(255,79,216,.14)'], [300, 430, 200, 'rgba(126,249,255,.10)']]) { const rg = c.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = rg; c.fillRect(x - r, y - r, r * 2, r * 2); }
    c.fillStyle = '#fff'; for (const s of STARS) { c.globalAlpha = .3 + .7 * Math.abs(Math.sin(t * s.sp + s.ph)); c.fillRect(s.x, s.y, s.s, s.s); } c.globalAlpha = 1;
    c.strokeStyle = 'rgba(255,79,216,.16)'; c.lineWidth = 1; const hy = H - 130;
    for (let i = 0; i < 8; i++) { const f = ((i + (t * .6) % 1) / 8), y = hy + f * f * 130; c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    for (let x = -300; x <= W + 300; x += 45) { c.beginPath(); c.moveTo(W / 2 + (x - W / 2) * .12, hy); c.lineTo(x, H); c.stroke(); }
    return;
  }
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0b130f'); g.addColorStop(1, '#25331f'); c.fillStyle = g; c.fillRect(-30, -30, W + 60, H + 60);
  c.save(); c.shadowColor = '#f4f1c9'; c.shadowBlur = 40; c.fillStyle = '#f1edc4'; c.beginPath(); c.arc(292, 86, 30, 0, 7); c.fill(); c.restore();
  c.fillStyle = 'rgba(170,165,120,.45)'; for (const [x, y, r] of [[283, 78, 6], [301, 95, 4], [296, 72, 3]]) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  c.strokeStyle = '#05080a'; c.lineWidth = 2.5; c.lineCap = 'round';
  for (let i = 0; i < 3; i++) { const x = ((t * 22 + i * 150) % (W + 80)) - 40, y = 50 + i * 30 + Math.sin(t * 2 + i) * 6, w = Math.sin(t * 12 + i * 2) * 5; c.beginPath(); c.moveTo(x - 10, y - w); c.quadraticCurveTo(x - 4, y - 2, x, y); c.quadraticCurveTo(x + 4, y - 2, x + 10, y - w); c.stroke(); }
  c.fillStyle = '#081009';
  for (const [x, w, h, cross] of [[34, 34, 46, 0], [118, 26, 34, 1], [236, 30, 40, 0], [322, 36, 52, 1]]) {
    const top = H - h; c.beginPath(); c.moveTo(x - w / 2, H); c.lineTo(x - w / 2, top + w / 2); c.arc(x, top + w / 2, w / 2, Math.PI, 0); c.lineTo(x + w / 2, H); c.fill();
    if (cross) { c.fillRect(x - 2, top - 16, 4, 18); c.fillRect(x - 8, top - 10, 16, 4); }
  }
  for (let i = 0; i < 4; i++) { const x = (((t * (i % 2 ? 9 : -7) + i * 130) % (W + 240)) + W + 240) % (W + 240) - 120; c.fillStyle = 'rgba(200,225,190,.05)'; c.beginPath(); c.ellipse(x, 540 + i * 26, 150, 24, 0, 0, 7); c.fill(); }
}
function line2(c, x1, y1, x2, y2) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }
function drawPlank(c, x1, y1, x2, y2, i, mover) {
  const k = th(), col = mover ? pal().mover : pal().plank;
  if (k === 'notebook') {
    sketchLine(c, x1, y1, x2, y2, 100 + i, col, 6, 2);
    if (mover) { c.fillStyle = col; const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy); for (let j = 1; j < len / 12; j++) { const f = j * 12 / len; c.fillRect(x1 + dx * f - 1, y1 + dy * f - 1, 2, 2); } }
    return;
  }
  c.save(); c.lineCap = 'round';
  if (k === 'space') { c.shadowColor = col; c.shadowBlur = 14; c.strokeStyle = col; c.lineWidth = 5; line2(c, x1, y1, x2, y2); c.shadowBlur = 0; c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 1.6; line2(c, x1, y1, x2, y2); }
  else {
    c.strokeStyle = '#1e140b'; c.lineWidth = 10; line2(c, x1, y1, x2, y2); c.strokeStyle = col; c.lineWidth = 7; line2(c, x1, y1, x2, y2);
    if (mover) { c.fillStyle = col; for (const [x, y] of [[x1, y1], [x2, y2]]) { c.beginPath(); c.arc(x, y - 3, 4.5, 0, 7); c.arc(x, y + 3, 4.5, 0, 7); c.fill(); } }
    else { c.fillStyle = '#d9d4c4'; for (const f of [.12, .88]) { c.beginPath(); c.arc(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 1.6, 0, 7); c.fill(); } }
  }
  c.restore();
}
function drawSpikeT(c, k, t, i) {
  const T = th(); if (T === 'notebook') return drawSpike(c, k, t, i);
  c.save(); c.translate(k.x, k.y);
  if (T === 'space') {
    const p = 1 + Math.sin(t * 5 + i) * .08; c.scale(p, p); c.rotate(t * .8 + i);
    c.shadowColor = '#ff3b5c'; c.shadowBlur = 14; c.strokeStyle = '#ff3b5c'; c.lineWidth = 2.6; c.lineCap = 'round';
    for (let a = 0; a < 8; a++) { const ang = a / 8 * Math.PI * 2; line2(c, Math.cos(ang) * k.r * .5, Math.sin(ang) * k.r * .5, Math.cos(ang) * (k.r + 4), Math.sin(ang) * (k.r + 4)); }
    c.fillStyle = '#ff3b5c'; c.beginPath(); c.arc(0, 0, k.r * .6, 0, 7); c.fill();
    c.shadowBlur = 0; c.fillStyle = `rgba(255,255,255,${.5 + .5 * Math.sin(t * 8 + i)})`; c.beginPath(); c.arc(0, 0, k.r * .2, 0, 7); c.fill();
  } else {
    c.rotate(Math.sin(t * 2 + i) * .2); c.fillStyle = '#4a2266'; c.strokeStyle = '#c27ae6'; c.lineWidth = 1.5;
    c.beginPath(); for (let a = 0; a < 20; a++) { const ang = a / 20 * Math.PI * 2, rr = a % 2 ? k.r * .6 : k.r + 4; c.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr); } c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#ff4a4a'; for (const sx of [-1, 1]) { c.beginPath(); c.arc(sx * 3.5, -1, 1.8, 0, 7); c.fill(); }
  }
  c.restore();
}
function drawSpringT(c, s, i) {
  const P = pal(), now = performance.now() / 1000, sq = s.anim ? Math.max(0, 1 - (now - s.anim) / .35) : 0;
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = uy, ny = -ux;
  const bounce = Math.sin(sq * Math.PI * 3) * sq * 6;
  c.save(); if (P.glow) { c.shadowColor = P.spring; c.shadowBlur = 12; }
  if (th() === 'zombie') {
    c.fillStyle = 'rgba(155,225,93,.85)'; c.beginPath();
    c.ellipse((s.x1 + s.x2) / 2 - nx * (3 - bounce * .3), (s.y1 + s.y2) / 2 - ny * (3 - bounce * .3), len / 2 + 4, 7 + bounce * .4, Math.atan2(dy, dx), 0, 7); c.fill();
    c.fillStyle = '#d7ffb0'; for (let k = 0; k < 3; k++) { const f = .25 + k * .25; c.beginPath(); c.arc(s.x1 + dx * f - nx * 5, s.y1 + dy * f - ny * 5 + Math.sin(now * 4 + k) * 1.5, 1.8, 0, 7); c.fill(); }
  } else {
    c.strokeStyle = P.spring; c.lineWidth = 2.5; c.beginPath();
    for (let k = 0; k <= 7; k++) { const t = k / 7, h = (k % 2 ? 9 : 2) + bounce; const px = s.x1 + dx * t + nx * h, py = s.y1 + dy * t + ny * h; k ? c.lineTo(px, py) : c.moveTo(px, py); }
    c.stroke();
    if (th() === 'notebook') sketchLine(c, s.x1, s.y1, s.x2, s.y2, 500 + i, P.spring, 6, 1);
    else { c.lineWidth = 5; c.lineCap = 'round'; line2(c, s.x1, s.y1, s.x2, s.y2); }
  }
  c.restore();
}
function drawPortalT(c, p, t) {
  const P = pal();
  for (const [x, y, col, dir] of [[p.ax, p.ay, P.portal[0], 1], [p.bx, p.by, P.portal[1], -1]]) {
    c.save(); c.translate(x, y); c.rotate(t * 2 * dir); if (P.glow) { c.shadowColor = col; c.shadowBlur = 16; }
    c.setLineDash([6, 5]); c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 17, 0, 7); c.stroke(); c.setLineDash([]);
    c.fillStyle = col + '40'; c.beginPath(); c.arc(0, 0, 13, 0, 7); c.fill();
    c.strokeStyle = col; c.lineWidth = 1.5; c.beginPath(); for (let a = 0; a < 30; a++) { const ang = a * .45, rr = a * .4; c.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr); } c.stroke();
    c.restore();
  }
  c.save(); c.setLineDash([2, 8]); c.strokeStyle = P.guide; c.lineWidth = 2; line2(c, p.ax, p.ay, p.bx, p.by); c.restore();
}
function drawCup(c, cup, t, bounce) {
  const T = th(), l = cup.x - cup.w / 2, r = cup.x + cup.w / 2, top = cup.y - cup.h, b = cup.y;
  c.save();
  if (bounce > 0) { const s = 1 + Math.sin(bounce * Math.PI * 4) * bounce * .12; c.translate(cup.x, b); c.scale(1 / s, s); c.translate(-cup.x, -b); }
  if (T === 'notebook') { drawMug(c, cup, t); c.restore(); return; }
  if (T === 'space') {
    c.fillStyle = `rgba(255,210,63,${.07 + .04 * Math.sin(t * 6)})`; c.beginPath(); c.moveTo(l + 4, top); c.lineTo(l - 26, top - 130); c.lineTo(r + 26, top - 130); c.lineTo(r - 4, top); c.fill();
    c.shadowColor = '#ffd23f'; c.shadowBlur = 18; c.strokeStyle = '#ffd23f'; c.lineWidth = 4; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(l, top); c.lineTo(l, b); c.lineTo(r, b); c.lineTo(r, top); c.stroke();
    c.shadowBlur = 8; for (let k = 0; k < 4; k++) { c.fillStyle = (Math.floor(t * 4) + k) % 4 === 0 ? '#ffffff' : '#ff4fd8'; c.beginPath(); c.arc(l + 10 + k * (cup.w - 20) / 3, b - 6, 2.4, 0, 7); c.fill(); }
  } else {
    c.fillStyle = '#7be04a'; c.beginPath(); c.ellipse(cup.x, b - 10, cup.w / 2 - 4, 7, 0, 0, 7); c.fill();
    for (let k = 0; k < 4; k++) { const ph = (t * .8 + k * .27) % 1, x = l + 12 + k * 13 + Math.sin(t * 3 + k) * 2; c.fillStyle = `rgba(190,255,140,${1 - ph})`; c.beginPath(); c.arc(x, b - 12 - ph * 50, 2.2 + ph * 2, 0, 7); c.fill(); }
    c.strokeStyle = '#3c433d'; c.lineWidth = 6; c.lineJoin = 'round'; c.lineCap = 'round';
    c.beginPath(); c.moveTo(l, top); c.lineTo(l, b - 10); c.quadraticCurveTo(l, b + 4, cup.x, b + 4); c.quadraticCurveTo(r, b + 4, r, b - 10); c.lineTo(r, top); c.stroke();
    c.strokeStyle = '#59615a'; c.lineWidth = 7; line2(c, l - 6, top, l + 6, top); line2(c, r - 6, top, r + 6, top);
    c.strokeStyle = '#3c433d'; c.lineWidth = 4; line2(c, l + 8, b + 2, l + 2, b + 10); line2(c, r - 8, b + 2, r - 2, b + 10);
  }
  c.restore();
}
function drawCandyT(c, x, y, t) {
  const T = th(); if (T === 'notebook') return drawCandy(c, x, y, t);
  c.save(); c.translate(x, y); c.rotate(Math.sin(t * 3) * .25);
  if (T === 'space') {
    c.shadowColor = '#fff36b'; c.shadowBlur = 14; c.fillStyle = '#fff36b'; c.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 4.5 : 11; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill();
  } else {
    const band = (y0, y1, w0, w1, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(-w0, y0); c.lineTo(w0, y0); c.lineTo(w1, y1); c.lineTo(-w1, y1); c.fill(); };
    band(-11, -4, 0, 4, '#fff6e0'); band(-4, 3, 4, 7.5, '#ff8c3c'); band(3, 9, 7.5, 10, '#ffd23f');
  }
  c.restore();
}
function drawAlien(c, x, y, r, ang, mood, blink) {
  c.save(); c.translate(x, y); c.rotate(ang);
  c.strokeStyle = '#b6ffb0'; c.lineWidth = Math.max(1.5, r * .12); c.lineCap = 'round';
  c.beginPath(); c.moveTo(0, -r * .9); c.quadraticCurveTo(r * .35, -r * 1.3, r * .15, -r * 1.55); c.stroke();
  c.save(); c.shadowColor = '#ff4fd8'; c.shadowBlur = r; c.fillStyle = '#ff4fd8'; c.beginPath(); c.arc(r * .15, -r * 1.6, r * .2, 0, 7); c.fill(); c.restore();
  c.save(); c.shadowColor = '#7dff6a'; c.shadowBlur = r * 1.2; c.fillStyle = '#8dff7a'; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); c.restore();
  c.strokeStyle = '#1d5c2a'; c.lineWidth = Math.max(1.4, r * .12); c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke();
  const dark = '#0d2a14', ey = -r * .12; c.strokeStyle = dark; c.fillStyle = dark; c.lineWidth = Math.max(1.4, r * .12);
  if (mood === 'win') { c.beginPath(); c.arc(0, ey + r * .1, r * .3, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); c.beginPath(); c.arc(0, r * .35, r * .25, 0, Math.PI); c.fill(); }
  else if (mood === 'fail') { const e = r * .22; line2(c, -e, ey - e, e, ey + e); line2(c, e, ey - e, -e, ey + e); c.beginPath(); c.moveTo(-r * .25, r * .5); c.quadraticCurveTo(0, r * .35, r * .25, r * .5); c.stroke(); }
  else if (blink && mood === 'idle') { line2(c, -r * .3, ey, r * .3, ey); c.beginPath(); c.arc(0, r * .38, r * .18, .3, Math.PI - .3); c.stroke(); }
  else {
    const er = mood === 'fall' ? r * .5 : r * .42; c.fillStyle = '#fff'; c.beginPath(); c.arc(0, ey, er, 0, 7); c.fill(); c.stroke();
    c.fillStyle = dark; c.beginPath(); c.arc(0, ey + (mood === 'fall' ? -r * .08 : r * .04), er * .45, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(-er * .2, ey - er * .25, er * .15, 0, 7); c.fill();
    if (mood === 'fall') { c.fillStyle = dark; c.beginPath(); c.ellipse(0, r * .55, r * .12, r * .14, 0, 0, 7); c.fill(); }
    else { c.beginPath(); c.arc(0, r * .42, r * .18, .3, Math.PI - .3); c.stroke(); }
  }
  c.restore();
}
function drawZombie(c, x, y, r, ang, mood, blink) {
  c.save(); c.translate(x, y); c.rotate(ang);
  const s = r * .86, rr = r * .28, dark = '#1f2a18';
  c.fillStyle = '#8fbf5a'; c.beginPath(); c.roundRect(-s, -s, s * 2, s * 2, rr); c.fill();
  c.fillStyle = '#3b4a2c'; c.beginPath(); c.moveTo(-s, -s + rr); c.quadraticCurveTo(-s, -s, -s + rr, -s); c.lineTo(s - rr, -s); c.quadraticCurveTo(s, -s, s, -s + rr);
  c.lineTo(s, -s * .5); for (let k = 0; k <= 5; k++) c.lineTo(s - k * s * .4, -s * (k % 2 ? .62 : .42)); c.closePath(); c.fill();
  c.strokeStyle = dark; c.lineWidth = Math.max(1.4, r * .12); c.beginPath(); c.roundRect(-s, -s, s * 2, s * 2, rr); c.stroke();
  c.lineWidth = Math.max(1, r * .07); line2(c, s * .25, s * .1, s * .8, s * .45); for (let k = 0; k < 3; k++) { const f = .2 + k * .3, px = s * .25 + s * .55 * f, py = s * .1 + s * .35 * f; line2(c, px - s * .08, py + s * .1, px + s * .08, py - s * .1); }
  const ey = -s * .1; c.lineWidth = Math.max(1.4, r * .11);
  if (mood === 'win') { for (const sx of [-1, 1]) { c.beginPath(); c.arc(sx * s * .42, ey + r * .08, r * .15, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); } }
  else if (mood === 'fail') { for (const sx of [-1, 1]) { const e = r * .13, cx = sx * s * .42; line2(c, cx - e, ey - e, cx + e, ey + e); line2(c, cx + e, ey - e, cx - e, ey + e); } }
  else if (blink && mood === 'idle') { line2(c, -s * .6, ey, -s * .2, ey); line2(c, s * .3, ey + 2, s * .55, ey + 2); }
  else {
    const big = mood === 'fall' ? r * .32 : r * .27; c.fillStyle = '#f4f4e6'; c.beginPath(); c.arc(-s * .42, ey, big, 0, 7); c.fill(); c.stroke();
    c.fillStyle = dark; c.beginPath(); c.arc(-s * .42 + big * .25, ey + big * .2, big * .3, 0, 7); c.fill();
    c.beginPath(); c.arc(s * .42, ey + r * .05, mood === 'fall' ? r * .14 : r * .09, 0, 7); c.fill();
  }
  const my = s * .5; c.fillStyle = dark;
  if (mood === 'win' || mood === 'fall') { c.beginPath(); c.roundRect(-s * .5, my - r * .12, s, r * .3, 3); c.fill(); c.fillStyle = '#f4f4e6'; c.fillRect(-s * .35, my - r * .12, r * .14, r * .12); c.fillRect(s * .1, my - r * .12, r * .14, r * .12); }
  else { c.beginPath(); c.moveTo(-s * .5, my); c.lineTo(s * .45, my - r * .05); c.stroke(); c.fillStyle = '#f4f4e6'; c.fillRect(-s * .3, my - 1, r * .12, r * .12); c.fillRect(s * .05, my - 1.5, r * .12, r * .12); }
  c.restore();
}
function drawChar(c, x, y, r, ang, mood, blink) {
  const T = th();
  if (T === 'space') return drawAlien(c, x, y, r, ang, mood, blink);
  if (T === 'zombie') return drawZombie(c, x, y, r, ang, mood, blink);
  return drawTorr(c, x, y, r, ang, mood, prog.skin, blink);
}
function penColor(penId) {
  const pen = PENS[penId] || PENS.graphite, T = th();
  if (pen.c === 'rainbow') return 'rainbow';
  if (penId === 'graphite' && T === 'space') return '#e9f6ff';
  if (penId === 'graphite' && T === 'zombie') return '#dfe8cf';
  return pen.c;
}

// ---------- 효과 ----------
function fx(g, o) { g.parts.push(Object.assign({ l: 1, vx: 0, vy: 0, grav: 900, decay: .8, t: 'conf', r: 0 }, o)); }
function dust(g, x, y, nx, ny, n, power) {
  const base = Math.atan2(ny, nx), P = pal();
  for (let i = 0; i < n; i++) {
    const a = base + (Math.random() - .5) * 2.6, sp = 30 + Math.random() * power;
    if (P.glow) fx(g, { t: 'spark', x, y, vx: Math.cos(a) * sp * 2, vy: Math.sin(a) * sp * 2, grav: 300, decay: 2.4, c: P.dust });
    else fx(g, { t: 'dust', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, grav: -30, decay: 1.8, c: P.dust, r: 2 + Math.random() * 3 });
  }
}
function sparks(g, x, y, n, col, sp = 260) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = sp * (.4 + Math.random() * .8); fx(g, { t: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, grav: 400, decay: 1.8, c: col }); } }
function ring(g, x, y, col, max) { fx(g, { t: 'ring', x, y, grav: 0, decay: 2.2, c: col, max }); }
function floatText(g, x, y, text, col) { fx(g, { t: 'text', x, y, vy: -50, grav: 0, decay: .9, c: col, text }); }
function drawParts(c, g, t) {
  const glow = pal().glow;
  for (const p of g.parts) {
    const a = Math.max(0, Math.min(1, p.l)); c.globalAlpha = a;
    if (p.t === 'conf') { c.fillStyle = p.c; c.save(); c.translate(p.x, p.y); c.rotate(p.r + t * 4); c.fillRect(-3, -1.5, 6, 3); c.restore(); }
    else if (p.t === 'dust') { c.fillStyle = p.c; c.globalAlpha = a * .6; c.beginPath(); c.arc(p.x, p.y, p.r * (1.8 - a * .8), 0, 7); c.fill(); }
    else if (p.t === 'spark') { c.save(); if (glow) { c.shadowColor = p.c; c.shadowBlur = 8; } c.strokeStyle = p.c; c.lineWidth = 2; c.lineCap = 'round'; line2(c, p.x, p.y, p.x - p.vx * .025, p.y - p.vy * .025); c.restore(); }
    else if (p.t === 'ring') { c.save(); if (glow) { c.shadowColor = p.c; c.shadowBlur = 10; } c.strokeStyle = p.c; c.lineWidth = 3 * a + .5; c.beginPath(); c.arc(p.x, p.y, p.max * (1 - a), 0, 7); c.stroke(); c.restore(); }
    else if (p.t === 'text') { c.fillStyle = p.c; c.font = "700 20px Fredoka, Jua, 'M PLUS Rounded 1c', sans-serif"; c.textAlign = 'center'; c.fillText(p.text, p.x, p.y); }
    else if (p.t === 'drop') { c.fillStyle = p.c; c.beginPath(); c.arc(p.x, p.y, 2.2, 0, 7); c.fill(); }
  }
  c.globalAlpha = 1;
}

// =========================================================
//  소리 · 진동 · 공유 · 광고
// =========================================================
const SFX = {
  ac: null, noise: null, lastScratch: 0,
  init() {
    if (!this.ac) { try { this.ac = new (window.AudioContext || window.webkitAudioContext)(); const b = this.ac.createBuffer(1, 4410, 44100), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.noise = b; } catch (e) { } }
    if (this.ac && this.ac.state === 'suspended') this.ac.resume();
  },
  tone(f, d, type = 'sine', v = .15, f2 = 0, delay = 0) {
    if (!prog.snd || !this.ac) return; const c = this.ac, t0 = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + d);
    g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + d); o.connect(g).connect(c.destination); o.start(t0); o.stop(t0 + d + .02);
  },
  scratch() {
    if (!prog.snd || !this.ac || !this.noise) return; const now = performance.now(); if (now - this.lastScratch < 45) return; this.lastScratch = now;
    const c = this.ac, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = this.noise; f.type = 'bandpass'; f.frequency.value = 2500 + Math.random() * 1500; f.Q.value = 1.2; g.gain.value = .07;
    s.connect(f).connect(g).connect(c.destination); s.start(0, Math.random() * .05, .04);
  },
  tap() { this.tone(420, .06, 'triangle', .12, 260); },
  boing() { this.tone(180, .35, 'sine', .25, 640); },
  warp() { this.tone(260, .3, 'sawtooth', .05, 1400); },
  candy() { this.tone(988, .1, 'triangle', .14); this.tone(1480, .16, 'triangle', .12, 0, .07); },
  win() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, .22, 'triangle', .14, 0, i * .09)); },
  fail() { this.tone(330, .28, 'square', .045, 140); },
  click() { this.tone(700, .04, 'triangle', .08); },
};
function haptic(kind) {
  if (!prog.hap) return;
  const H_ = plugin('Haptics');
  try {
    if (H_) { if (kind === 'win') H_.notification({ type: 'SUCCESS' }); else if (kind === 'fail') H_.notification({ type: 'ERROR' }); else H_.impact({ style: kind === 'heavy' ? 'HEAVY' : 'LIGHT' }); return; }
    if (navigator.vibrate) navigator.vibrate(kind === 'win' ? [20, 40, 20] : kind === 'fail' ? 50 : 8);
  } catch (e) { }
}
async function shareText(text) {
  const Sh = plugin('Share');
  try { if (Sh) { await Sh.share({ text }); return; } } catch (e) { return; }
  try { if (navigator.share) { await navigator.share({ text }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(text); toast(S.shared); } catch (e) { toast(text.split('\n')[0]); }
}

// AdMob (@capacitor-community/admob). 웹/미리보기에서는 자동으로 꺼짐.
const Ads = {
  ready: false, lastInter: 0,
  async init() {
    const A = plugin('AdMob'); if (!A) return;
    try {
      await A.initialize({ initializeForTesting: CFG.ads.testing });
      try { const ci = await A.requestConsentInfo(); if (ci.isConsentFormAvailable && ci.status === 'REQUIRED') await A.showConsentForm(); } catch (e) { }
      try { const st = await A.trackingAuthorizationStatus(); if (st.status === 'notDetermined') await A.requestTrackingAuthorization(); } catch (e) { }
      this.ready = true; this.preload();
    } catch (e) { }
  },
  ids() { const p = Cap() && Cap().getPlatform ? Cap().getPlatform() : 'ios'; return CFG.ads[p] || CFG.ads.ios; },
  async preload() {
    const A = plugin('AdMob'); if (!A || !this.ready) return;
    try { await A.prepareRewardVideoAd({ adId: this.ids().rewarded, isTesting: CFG.ads.testing }); } catch (e) { }
    try { await A.prepareInterstitial({ adId: this.ids().interstitial, isTesting: CFG.ads.testing }); } catch (e) { }
  },
  available() { return this.ready; },
  async rewarded() {
    const A = plugin('AdMob'); if (!A || !this.ready) return false;
    try { const r = await A.showRewardVideoAd(); this.preload(); return !!r; } catch (e) { this.preload(); return false; }
  },
  async maybeInterstitial(stageIndexGlobal) {
    const A = plugin('AdMob'); if (!A || !this.ready) return;
    if (stageIndexGlobal < CFG.ads.interstitialFromStage) return;
    prog.sinceAd = (prog.sinceAd || 0) + 1; save();
    if (prog.sinceAd < CFG.ads.interstitialEvery) return;
    if (Date.now() - this.lastInter < CFG.ads.interstitialMinGapSec * 1000) return;
    try { await A.showInterstitial(); prog.sinceAd = 0; save(); this.lastInter = Date.now(); } catch (e) { }
    this.preload();
  },
};

// =========================================================
//  화면 전환 / UI
// =========================================================
function show(id) {
  for (const s of document.querySelectorAll('.screen')) s.hidden = s.id !== id;
  if (id === 'home') renderHome();
  if (id === 'worlds') renderWorlds();
  if (id === 'collection') renderCollection();
  if (id === 'game') requestAnimationFrame(resize);
}
document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { SFX.click(); show(b.dataset.go); });
function toast(t) { const el = $('toast'); el.textContent = t; el.style.opacity = 1; clearTimeout(toast.h); toast.h = setTimeout(() => el.style.opacity = 0, 2200); }
function openSheet(html) { $('sheet').innerHTML = html; $('modal').hidden = false; }
function closeSheet() { $('modal').hidden = true; clearInterval(closeSheet.cd); }
$('modal').addEventListener('click', e => { if (e.target.id === 'modal' && $('modal').dataset.dismiss === '1') closeSheet(); });

// ---- 오늘의 문제 상태 ----
let T = today();
function dailyState() { return store.get('d' + T.key, { p: [{ t: 0, s: 0 }, { t: 0, s: 0 }, { t: 0, s: 0 }] }); }
function dailyDoneCount(ds) { return ds.p.filter(x => x.s > 0).length; }

// ---- 홈 ----
let mascotT = 0;
function renderHome() {
  T = today();
  $('colBtn').textContent = S.collection; $('setBtn').textContent = S.settings;
  $('homeHints').textContent = `${S.hints(prog.hints)}   🪙 ${prog.coins || 0}`;
  document.querySelector('.logo').textContent = S.name; document.querySelector('.tag').textContent = S.tag;
  document.querySelector('#dailyCard .card-title').firstChild.nodeValue = S.daily + ' ';
  $('dailyNo').textContent = '#' + T.no;
  const ds = dailyState(), labels = [S.easy, S.normal, S.hard];
  $('dailyDots').innerHTML = ds.p.map((x, i) => `<span class="dot ${x.s ? 'done' : ''}">${x.s ? '★'.repeat(x.s) : labels[i]}</span>`).join('');
  $('dailySub').textContent = dailyDoneCount(ds) === 3 ? S.dailySubDone(countdown()) : S.dailySubTodo;
  document.querySelector('#stageCard .card-title').textContent = S.stages;
  const [w, i] = furthestStage();
  $('stageSub').textContent = S.stageSub(w + 1, i + 1, totalStars());
}
function furthestStage() {
  for (let w = WORLDS.length - 1; w >= 0; w--) if (worldUnlocked(w)) { const n = stageCount(w); for (let i = n - 1; i >= 0; i--) if (stageUnlocked(w, i)) return [w, i]; }
  return [0, 0];
}
$('dailyCard').onclick = () => { SFX.init(); SFX.click(); const ds = dailyState(); const k = ds.p.findIndex(x => !x.s); if (k < 0) showDailySummary(); else startLevel({ kind: 'daily', k }); };
$('stageCard').onclick = () => { SFX.init(); SFX.click(); curWorld = furthestStage()[0]; show('worlds'); };
$('colBtn').onclick = () => { SFX.init(); SFX.click(); show('collection'); };
$('setBtn').onclick = () => { SFX.init(); SFX.click(); openSettings(); };
setInterval(() => { if (!$('home').hidden) { if (today().key !== T.key) renderHome(); else { const ds = dailyState(); if (dailyDoneCount(ds) === 3) $('dailySub').textContent = S.dailySubDone(countdown()); } } }, 1000);

function drawMascotHome(ts) {
  const cv = $('mascot'); if (!cv || $('home').hidden) return;
  const dpr = window.devicePixelRatio || 1, w = 220, h = 150;
  if (cv.width !== w * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
  const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
  const t = ts / 1000, b = Math.abs(Math.sin(t * 2.6)), y = 104 - b * 52, sq = b < .12 ? 1 - (.12 - b) * 1.6 : 1;
  sketchLine(c, 30, 130, 190, 128, 7, th() === 'notebook' ? INK : pal().plank, 3, 2);
  c.fillStyle = th() === 'notebook' ? 'rgba(43,43,51,.12)' : 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(110, 128, 26 - b * 10, 4, 0, 0, 7); c.fill();
  c.save(); c.translate(110, y + 26 * (1 - sq)); c.scale(1 / sq, sq); drawChar(c, 0, 0, 26, Math.sin(t * 1.3) * .15, b > .7 ? 'win' : 'idle', (t % 3.4) < .13); c.restore();
}

// ---- 스테이지 선택 ----
let curWorld = 0;
function renderWorlds() {
  $('starTotal').textContent = '★ ' + totalStars();
  document.querySelector('#worlds .tb-title').textContent = S.stages;
  $('worldTabs').innerHTML = WORLDS.map((_, w) => `<button class="tab ${w === curWorld ? 'on' : ''} ${worldUnlocked(w) ? '' : 'lock'}" data-w="${w}">${worldUnlocked(w) ? '' : '🔒 '}${w + 1}</button>`).join('');
  $('worldTabs').querySelectorAll('.tab').forEach(b => b.onclick = () => { SFX.click(); curWorld = +b.dataset.w; renderWorlds(); });
  const w = curWorld;
  $('worldHead').innerHTML = `<b>${S.world(w + 1)} · ${S.worldNames[w]}</b>${worldUnlocked(w) ? S.worldDesc[w] : S.locked(STAR_GATE * w, w)}`;
  const n = stageCount(w); let html = '';
  for (let i = 0; i < n; i++) {
    const st = prog.stars[`${w}-${i}`] || 0, un = stageUnlocked(w, i), isNext = un && !st;
    html += `<button class="sbtn ${isNext ? 'next' : ''}" data-i="${i}" ${un ? '' : 'disabled'}>${i + 1}<small>${st ? '★'.repeat(st) + '☆'.repeat(3 - st) : un ? '' : '🔒'}</small></button>`;
  }
  $('stageGrid').innerHTML = html;
  $('stageGrid').querySelectorAll('.sbtn').forEach(b => b.onclick = () => { SFX.click(); startLevel({ kind: 'stage', w, i: +b.dataset.i }); });
  const nx = $('stageGrid').querySelector('.next'); if (nx) nx.scrollIntoView({ block: 'center' });
}

// ---- 도감 ----
function condText(need) { if (!need) return S.cond.free; const [k, n] = need; if (k === 'stars') return `★ ${Math.min(totalStars(), n)} / ${n}`; if (k === 'streak') return `🔥 ${Math.min(prog.bestStreak, n)} / ${n}`; if (k === 'daily') return `📅 ${Math.min(prog.dailyClears, n)} / ${n}`; return S.cond[k](n); }
function renderCollection() {
  document.querySelector('#collection .tb-title').textContent = S.collection;
  $('colCoins').textContent = '🪙 ' + (prog.coins || 0);
  $('themeSec').textContent = S.themes; $('skinSec').textContent = S.skins.basic; $('penSec').textContent = LANG === 'ko' ? '펜' : LANG === 'ja' ? 'ペン' : 'Pens';
  $('skinNote').textContent = th() === 'notebook' ? S.starsInfo : S.onlyNotebook;
  $('themeGrid').innerHTML = Object.entries(THEMES).map(([id, tm]) => { const own = prog.themes.includes(id), on = th() === id; return `<button class="item ${on ? 'on' : ''} ${own ? '' : 'lock'}" data-theme="${id}"><canvas width="128" height="128"></canvas>${S.themeNames[id]}<small>${on ? S.selected : own ? '' : '🪙 ' + tm.cost}</small></button>`; }).join('');
  $('themeGrid').querySelectorAll('.item').forEach(b => {
    const id = b.dataset.theme, c = b.querySelector('canvas').getContext('2d'), keep = prog.theme, keepOwn = prog.themes;
    prog.theme = id; prog.themes = [...keepOwn, id];
    c.save(); c.scale(128 / 200, 128 / 200); c.translate(-80, id === 'zombie' ? -440 : -380); drawBg(c, 1.3); c.restore();
    drawChar(c, 64, 70, 30, 0, 'idle', false);
    prog.theme = keep; prog.themes = keepOwn;
    b.onclick = () => {
      SFX.click();
      if (prog.themes.includes(id)) { prog.theme = id; save(); applyTheme(); renderCollection(); toast(S.themeOn(S.themeNames[id])); return; }
      const cost = THEMES[id].cost;
      if ((prog.coins || 0) < cost) { toast(S.notEnough(cost, prog.coins || 0)); return; }
      $('modal').dataset.dismiss = '1';
      openSheet(`<div class="big">${S.themeNames[id]}</div><div class="sub">${S.buy(cost)}</div><button class="btn primary" id="buyOk">${S.buyBtn}</button><button class="btn" id="buyNo">${S.cancel}</button>`);
      $('buyNo').onclick = closeSheet;
      $('buyOk').onclick = () => { prog.coins -= cost; prog.themes.push(id); prog.theme = id; save(); closeSheet(); SFX.win(); haptic('win'); applyTheme(); renderCollection(); toast(S.themeOn(S.themeNames[id])); };
    };
  });
  $('skinGrid').innerHTML = Object.entries(SKINS).map(([id, s]) => { const ok = meets(s.need); return `<button class="item ${prog.skin === id ? 'on' : ''} ${ok ? '' : 'lock'}" data-skin="${id}" ${ok ? '' : 'disabled'}><canvas width="128" height="128"></canvas>${S.skins[id]}<small>${prog.skin === id ? S.selected : ok ? '' : condText(s.need)}</small></button>`; }).join('');
  $('penGrid').innerHTML = Object.entries(PENS).map(([id, p]) => { const ok = meets(p.need); return `<button class="item ${prog.pen === id ? 'on' : ''} ${ok ? '' : 'lock'}" data-pen="${id}" ${ok ? '' : 'disabled'}><canvas width="128" height="128"></canvas>${S.pens[id]}<small>${prog.pen === id ? S.selected : ok ? '' : condText(p.need)}</small></button>`; }).join('');
  $('skinGrid').querySelectorAll('.item').forEach(b => { const c = b.querySelector('canvas').getContext('2d'); c.scale(2, 2); drawTorr(c, 32, 36, 20, 0, 'idle', b.dataset.skin); b.onclick = () => { SFX.click(); prog.skin = b.dataset.skin; save(); renderCollection(); }; });
  $('penGrid').querySelectorAll('.item').forEach(b => { const c = b.querySelector('canvas').getContext('2d'); c.scale(2, 2); const pts = []; for (let i = 0; i <= 20; i++) pts.push({ x: 8 + i * 2.4, y: 40 - Math.sin(i / 20 * Math.PI) * 18 }); strokePen(c, pts, b.dataset.pen); b.onclick = () => { SFX.click(); prog.pen = b.dataset.pen; save(); renderCollection(); }; });
}

// ---- 설정 ----
function openSettings() {
  $('modal').dataset.dismiss = '1';
  openSheet(`<div class="big">${S.settings}</div>
    <div class="row">${S.sound}<button class="tog ${prog.snd ? 'on' : ''}" id="tSnd" aria-label="${S.sound}"></button></div>
    <div class="row">${S.haptics}<button class="tog ${prog.hap ? 'on' : ''}" id="tHap" aria-label="${S.haptics}"></button></div>
    <div class="fine">${S.version} 1.0.0 · ${S.privacy}: wesleyoh.github.io/rolly/privacy.html</div>
    <button class="btn" id="sClose">OK</button>`);
  $('tSnd').onclick = e => { prog.snd = !prog.snd; save(); e.target.classList.toggle('on', prog.snd); SFX.click(); };
  $('tHap').onclick = e => { prog.hap = !prog.hap; save(); e.target.classList.toggle('on', prog.hap); haptic('light'); };
  $('sClose').onclick = closeSheet;
}

// =========================================================
//  게임 화면
// =========================================================
const cv = $('c'), ctx = cv.getContext('2d');
let scale = 1;
function resize() {
  const st = $('stage'); const aw = st.clientWidth, ah = st.clientHeight; if (!aw || !ah) return;
  scale = Math.min(aw / W, ah / H); const dpr = window.devicePixelRatio || 1;
  cv.style.width = W * scale + 'px'; cv.style.height = H * scale + 'px';
  cv.width = Math.round(W * scale * dpr); cv.height = Math.round(H * scale * dpr);
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
}
window.addEventListener('resize', resize);

let G_ = null; // 현재 판 상태
function startLevel(spec) {
  closeSheet();
  let p;
  if (spec.kind === 'daily') { T = today(); p = dailyParams(T.key, spec.k); }
  else p = stageParams(spec.w, spec.i);
  const L = genLevel(p.seed, p.diff, p.mech);
  const ds = spec.kind === 'daily' ? dailyState() : null;
  G_ = {
    spec, L, line: [], ghost: [], state: 'idle', sim: null, trail: [], ang: 0, mood: 'idle', parts: [], flash: 0, shake: 0, sq: { a: 0, ang: 0 }, cupBounce: 0, winT: 0,
    tries: spec.kind === 'daily' ? ds.p[spec.k].t + 1 : 1, hint: false, tut: spec.kind === 'stage' && spec.w === 0 && spec.i < 2,
  };
  $('gameTitle').textContent = spec.kind === 'daily' ? `${S.daily} · ${[S.easy, S.normal, S.hard][spec.k]}` : `${spec.w + 1}-${spec.i + 1}`;
  $('hintN').textContent = prog.hints; $('hintBtn').firstChild.nodeValue = S.hint + ' ';
  $('par').style.left = (L.par / L.inkMax * 100) + '%';
  show('game'); updateBar();
  if (G_.tut) bubble(S.tutorial, L.start.x, L.start.y - 30, 99999);
  else if (spec.kind === 'stage' && spec.w === 0 && spec.i === 2) bubble(S.drawHint, L.start.x, L.start.y - 30, 2500);
}
function inkUsed() { return lineLen(G_.line); }
function updateBar() {
  const p = Math.min(1, inkUsed() / G_.L.inkMax);
  $('inkfill').style.width = (p * 100) + '%'; $('inktxt').textContent = S.inkLabel(Math.round(p * 100)); $('tries').textContent = S.tries(G_.tries);
}
function bubble(text, x, y, ms = 900) {
  const b = $('bubble'), r = cv.getBoundingClientRect(), sr = $('stage').getBoundingClientRect();
  b.textContent = text; b.style.left = (r.left - sr.left + Math.max(50, Math.min(W - 50, x)) * scale) + 'px'; b.style.top = (r.top - sr.top + Math.max(40, y) * scale) + 'px'; b.style.opacity = 1;
  clearTimeout(bubble.h); bubble.h = setTimeout(() => b.style.opacity = 0, ms);
}
function resetAttempt() { if (!G_) return; G_.ghost = G_.line; G_.line = []; G_.state = 'idle'; G_.sim = null; G_.trail = []; G_.mood = 'idle'; G_.ang = 0; updateBar(); }
$('retryBtn').onclick = () => { SFX.click(); if (G_ && (G_.state === 'idle' || G_.state === 'running')) { if (G_.state === 'running') { G_.tries++; persistTry(); } resetAttempt(); } };
$('gameBack').onclick = () => { SFX.click(); const k = G_ && G_.spec.kind; G_ = null; show(k === 'stage' ? 'worlds' : 'home'); };
$('hintBtn').onclick = async () => {
  SFX.init(); SFX.click(); if (!G_ || G_.hint) return;
  if (prog.hints > 0) { prog.hints--; save(); G_.hint = true; $('hintN').textContent = prog.hints; return; }
  $('modal').dataset.dismiss = '1';
  openSheet(`<div class="big">${S.noHints}</div><div class="sub">${S.hintsEarn}</div>${Ads.available() ? `<button class="btn primary" id="adHint">${S.watchAd}</button>` : ''}<button class="btn" id="noHint">OK</button>`);
  $('noHint').onclick = closeSheet;
  if ($('adHint')) $('adHint').onclick = async () => { closeSheet(); if (await Ads.rewarded()) { prog.hints++; save(); $('hintN').textContent = prog.hints; toast('💡 +1'); } };
};

function toLocal(e) { const b = cv.getBoundingClientRect(); return { x: (e.clientX - b.left) / b.width * W, y: (e.clientY - b.top) / b.height * H }; }
cv.addEventListener('pointerdown', e => {
  SFX.init();
  if (!G_ || G_.state !== 'idle' || !$('modal').hidden) return;
  cv.setPointerCapture(e.pointerId); G_.state = 'drawing'; G_.line = [toLocal(e)]; G_.ghost = [];
  if (!G_.tut) $('bubble').style.opacity = 0;
});
cv.addEventListener('pointermove', e => {
  if (!G_ || G_.state !== 'drawing') return;
  const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  for (const ev of evs) {
    const p = toLocal(ev), q = G_.line[G_.line.length - 1], d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d < 5) continue;
    const left = G_.L.inkMax - inkUsed(); if (left <= 0) break;
    if (d > left) { p.x = q.x + (p.x - q.x) * left / d; p.y = q.y + (p.y - q.y) * left / d; }
    G_.line.push(p); SFX.scratch();
    if (G_.line.length % 3 === 0) { const P = pal(); if (P.glow) fx(G_, { t: 'spark', x: p.x, y: p.y, vx: (Math.random() - .5) * 120, vy: (Math.random() - .5) * 120, grav: 0, decay: 3, c: penColor(prog.pen) === 'rainbow' ? '#fff' : penColor(prog.pen) }); else fx(G_, { t: 'dust', x: p.x, y: p.y, vx: (Math.random() - .5) * 30, vy: 10 + Math.random() * 20, grav: 60, decay: 2.5, c: th() === 'zombie' ? '#9be15d' : '#8a8a96', r: 1 + Math.random() }); }
  }
  updateBar();
});
function endDraw() {
  if (!G_ || G_.state !== 'drawing') return;
  if (G_.line.length < 2 || inkUsed() < 15) { G_.line = []; G_.state = 'idle'; updateBar(); return; }
  G_.state = 'running'; G_.sim = new Sim(G_.L, G_.line, false, true); G_.trail = []; G_.mood = 'fall'; G_.tut = false; $('bubble').style.opacity = 0;
}
cv.addEventListener('pointerup', endDraw); cv.addEventListener('pointercancel', endDraw);

function persistTry() {
  if (G_.spec.kind !== 'daily') return;
  const ds = dailyState(); const d = ds.p[G_.spec.k]; if (!d.s) { d.t = G_.tries - 1; store.set('d' + T.key, ds); }
}
function onDone(res) {
  const g = G_;
  if (res === 'win') {
    g.state = 'won'; g.mood = 'win'; SFX.win(); haptic('win'); g.winT = performance.now() / 1000; g.cupBounce = 1;
    const cx = g.L.cup.x, cy = g.L.cup.y - g.L.cup.h, P = pal();
    for (let i = 0; i < 70; i++) fx(g, { x: cx, y: cy, vx: (Math.random() - .5) * 460, vy: -180 - Math.random() * 480, c: P.conf[i % 5], r: Math.random() * 6 });
    ring(g, cx, cy + 10, P.conf[0], 70); setTimeout(() => ring(g, cx, cy + 10, P.conf[1], 110), 120); sparks(g, cx, cy, 16, P.spark, 320);
    const ink = inkUsed(), stars = 1 + (g.sim.gotCandy ? 1 : 0) + (ink <= g.L.par ? 1 : 0);
    const res = { stars, candy: g.sim.gotCandy, par: ink <= g.L.par, ink: Math.round(ink / g.L.inkMax * 100), coins: 0 };
    if (g.spec.kind === 'stage') {
      const key = `${g.spec.w}-${g.spec.i}`, first = !prog.stars[key];
      res.coins = (first ? 10 : 0) + 5 * Math.max(0, stars - (prog.stars[key] || 0));
      prog.stars[key] = Math.max(prog.stars[key] || 0, stars);
      if (WORLDS[g.spec.w].endless && g.spec.i >= prog.endless) prog.endless = g.spec.i + 1;
      if (first) { prog.cleared++; if (g.spec.i === PER_WORLD - 1 && !WORLDS[g.spec.w].endless) prog.hints += 2; }
      prog.coins = (prog.coins || 0) + res.coins; save(); checkUnlocks();
      if (res.coins) floatText(g, cx, cy - 30, S.earned(res.coins), '#f2b705');
      setTimeout(() => { if (G_ === g) showStageResult(res); }, 1100);
    } else {
      const ds = dailyState(), d = ds.p[g.spec.k];
      if (!d.s) { d.s = stars; d.t = g.tries; store.set('d' + T.key, ds); res.coins = 10 + 5 * stars; }
      if (dailyDoneCount(ds) === 3 && prog.lastDaily !== T.key) {
        res.coins += 20;
        const y = new Date(); y.setDate(y.getDate() - 1);
        prog.streak = prog.lastDaily === dateKey(y) ? prog.streak + 1 : 1; prog.bestStreak = Math.max(prog.bestStreak, prog.streak);
        prog.lastDaily = T.key; prog.dailyClears++; prog.daysPlayed++; prog.hints += 1; save(); checkUnlocks();
      }
      prog.coins = (prog.coins || 0) + res.coins; save();
      if (res.coins) floatText(g, cx, cy - 30, S.earned(res.coins), '#f2b705');
      setTimeout(() => { if (G_ === g) showDailyResult(res); }, 1100);
    }
  } else {
    g.state = 'failed'; g.mood = 'fail'; g.flash = 1; g.shake = res === 'spike' ? 9 : 4; SFX.fail(); haptic('fail');
    if (res === 'spike') { sparks(g, g.sim.x, g.sim.y, 18, '#e04a3f', 300); ring(g, g.sim.x, g.sim.y, '#e04a3f', 40); }
    else if (g.sim.y < H) dust(g, g.sim.x, g.sim.y, 0, -1, 10, 90);
    const msgs = S.fail; bubble(res === 'spike' ? S.spike : msgs[Math.floor(Math.random() * msgs.length)], g.sim.x, g.sim.y - 34);
    g.tries++; persistTry();
    setTimeout(() => { if (G_ === g) resetAttempt(); }, 750);
  }
}
function starsHtml(n) { return `<div class="stars">${[0, 1, 2].map(i => `<span class="${i < n ? 'on' : ''}" style="animation-delay:${i * .18}s">★</span>`).join('')}</div>`; }
function coinsHtml(r) { return r.coins ? `<div class="coin-earn">${S.earned(r.coins)}</div>${Ads.available() ? `<button class="btn" id="dblCoins">📺 ${S.double(r.coins)}</button>` : ''}` : ''; }
function bindDouble(r) { const b = $('dblCoins'); if (b) b.onclick = async () => { b.disabled = true; if (await Ads.rewarded()) { prog.coins += r.coins; save(); toast(S.earned(r.coins)); b.remove(); } else b.disabled = false; }; }
function checksHtml(r) { return `<div class="checks"><span class="ok">✓ ${S.starClear}</span><span class="${r.candy ? 'ok' : ''}">${r.candy ? '✓' : '·'} ${S.starCandy}</span><span class="${r.par ? 'ok' : ''}">${r.par ? '✓' : '·'} ${S.starInk}</span></div>`; }
function showStageResult(r) {
  const g = G_, { w, i } = g.spec, hasNext = i + 1 < stageCount(w) || WORLDS[w].endless, nextOpen = hasNext && stageUnlocked(w, i + 1);
  const worldDone = !WORLDS[w].endless && i === PER_WORLD - 1;
  $('modal').dataset.dismiss = '0';
  openSheet(`<canvas id="resM" width="240" height="180"></canvas>${starsHtml(r.stars)}<div class="big">${r.stars === 3 ? S.perfect : S.clear}</div>${checksHtml(r)}${coinsHtml(r)}
    ${nextOpen ? `<button class="btn primary" id="rNext">${S.next}</button>` : worldDone && worldUnlocked(w + 1) ? `<button class="btn primary" id="rWorld">${S.world(w + 2)} →</button>` : ''}
    <button class="btn" id="rRetry">${S.retry}</button><button class="btn" id="rList">${S.toStages}</button>`);
  drawSheetMascot(); bindDouble(r);
  if ($('rNext')) $('rNext').onclick = async () => { SFX.click(); closeSheet(); await Ads.maybeInterstitial(w * PER_WORLD + i); startLevel({ kind: 'stage', w, i: i + 1 }); };
  if ($('rWorld')) $('rWorld').onclick = () => { SFX.click(); closeSheet(); startLevel({ kind: 'stage', w: w + 1, i: 0 }); };
  $('rRetry').onclick = () => { SFX.click(); startLevel({ kind: 'stage', w, i }); };
  $('rList').onclick = () => { SFX.click(); closeSheet(); curWorld = w; G_ = null; show('worlds'); };
}
function showDailyResult(r) {
  const g = G_, k = g.spec.k;
  if (k < 2) {
    $('modal').dataset.dismiss = '0';
    openSheet(`<canvas id="resM" width="240" height="180"></canvas>${starsHtml(r.stars)}<div class="big">${S.clear}</div>${checksHtml(r)}${coinsHtml(r)}<button class="btn primary" id="dNext">${S.nextPuzzle} (${[S.normal, S.hard][k]})</button><button class="btn" id="dHome">←</button>`);
    drawSheetMascot(); bindDouble(r);
    $('dNext').onclick = () => { SFX.click(); startLevel({ kind: 'daily', k: k + 1 }); };
    $('dHome').onclick = () => { SFX.click(); closeSheet(); G_ = null; show('home'); };
  } else showDailySummary(r);
}
function dailyShareText() {
  const ds = dailyState(), cols = ['🟢', '🟡', '🔴'];
  const lines = ds.p.map((x, i) => `${cols[i]} ${'⭐'.repeat(x.s)}${'▫️'.repeat(3 - x.s)} ${S.shareTry(x.t)}`);
  return [S.shareTitle(T.no), ...lines, prog.streak > 1 ? S.shareStreak(prog.streak) : '', '', S.shareCta, CFG.appUrl].filter((l, i, a) => l !== '' || (i > 0 && a[i - 1] !== '')).join('\n').trim();
}
function showDailySummary(r) {
  const ds = dailyState(), total = ds.p.reduce((a, x) => a + x.s, 0);
  $('modal').dataset.dismiss = '0';
  openSheet(`<canvas id="resM" width="240" height="180"></canvas><div class="big">${S.dailyDone}</div>
    <div class="sub">#${T.no} · ★ ${total}/9</div>
    <div class="checks" style="font-size:20px">${ds.p.map((x, i) => `<span class="ok">${['🟢', '🟡', '🔴'][i]} ${'★'.repeat(x.s)}</span>`).join('')}</div>
    <div class="checks"><span class="ok">🔥 ${S.streak} ${prog.streak}</span><span class="ok">${S.best} ${prog.bestStreak}</span><span class="ok">${S.played} ${prog.daysPlayed}</span></div>
    ${r ? coinsHtml(r) : ''}
    <button class="btn primary" id="dShare">${S.share}</button>
    <button class="btn" id="dStages">${S.toStageMode}</button>
    <button class="btn" id="dHome">←</button>
    <div class="next" id="dCd">${S.nextIn(countdown())}</div>`);
  drawSheetMascot(); if (r) bindDouble(r);
  $('dShare').onclick = () => { SFX.click(); shareText(dailyShareText()); };
  $('dStages').onclick = () => { SFX.click(); closeSheet(); G_ = null; curWorld = furthestStage()[0]; show('worlds'); };
  $('dHome').onclick = () => { SFX.click(); closeSheet(); G_ = null; show('home'); };
  clearInterval(closeSheet.cd); closeSheet.cd = setInterval(() => { const e = $('dCd'); if (e) e.textContent = S.nextIn(countdown()); }, 1000);
}
function drawSheetMascot() {
  const c = $('resM').getContext('2d'); c.scale(2, 2);
  sketchLine(c, 25, 80, 95, 80, 3, th() === 'notebook' ? INK : pal().plank, 2.5, 2); drawChar(c, 60, 50, 26, 0, 'win');
}

// ---- 게임 렌더 루프 ----
function render(t) {
  const g = G_, c = ctx; if (!g) return;
  const P = pal();
  c.save();
  if (g.shake > 0) { c.translate((Math.random() - .5) * g.shake, (Math.random() - .5) * g.shake); g.shake *= .85; if (g.shake < .3) g.shake = 0; }
  drawBg(c, t);
  const L = g.L, sim = g.sim;
  if (g.state === 'idle' || g.state === 'drawing') { c.save(); c.setLineDash([3, 9]); c.strokeStyle = P.guide; c.lineWidth = 2; line2(c, L.start.x, L.start.y + R + 6, L.start.x, H); c.restore(); }
  if (g.hint || g.tut) { c.save(); c.setLineDash([8, 8]); c.lineDashOffset = -t * 30; c.strokeStyle = P.hint; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); L.ref.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)); c.stroke(); c.restore(); }
  for (const p of L.portals) drawPortalT(c, p, t);
  L.planks.forEach((p, i) => {
    let o = { x: 0, y: 0 };
    if (p.mv) {
      const tt = sim ? sim.t : 0, k = Math.sin(2 * Math.PI / p.mv.per * tt + p.mv.ph); o = { x: p.mv.ax * k, y: p.mv.ay * k };
      if (!sim || g.state !== 'running') { c.save(); c.setLineDash([2, 6]); c.strokeStyle = P.guide; c.lineWidth = 2; const mx = (p.x1 + p.x2) / 2, my = (p.y1 + p.y2) / 2; line2(c, mx - p.mv.ax, my - p.mv.ay, mx + p.mv.ax, my + p.mv.ay); c.restore(); }
    }
    drawPlank(c, p.x1 + o.x, p.y1 + o.y, p.x2 + o.x, p.y2 + o.y, i, !!p.mv);
  });
  L.springs.forEach((s, i) => drawSpringT(c, s, i));
  L.spikes.forEach((k, i) => drawSpikeT(c, k, t, i));
  if (L.candy && !(sim && sim.gotCandy)) drawCandyT(c, L.candy.x, L.candy.y, t);
  drawCup(c, L.cup, t, g.cupBounce);
  if (g.ghost.length > 1) strokePen(c, g.ghost, prog.pen, .18);
  strokePen(c, g.line, prog.pen);
  // 꼬리
  const T = th(), n = g.trail.length;
  if (T === 'space' && n > 2) { c.save(); c.shadowColor = '#7ef9ff'; c.shadowBlur = 14; c.lineCap = 'round'; for (let i = 1; i < n; i++) { c.strokeStyle = `rgba(126,249,255,${i / n * .7})`; c.lineWidth = R * 1.4 * (i / n); line2(c, g.trail[i - 1].x, g.trail[i - 1].y, g.trail[i].x, g.trail[i].y); } c.restore(); }
  else if (T === 'zombie') { for (let i = 0; i < n; i++) { const p = g.trail[i]; c.fillStyle = `rgba(155,225,93,${i / n * .25})`; c.beginPath(); c.arc(p.x, p.y, R * (i / n) * .7, 0, 7); c.fill(); } }
  else { for (let i = 0; i < n; i++) { const p = g.trail[i]; c.fillStyle = `rgba(43,43,51,${i / n * .12})`; c.beginPath(); c.arc(p.x, p.y, R * (i / n) * .8, 0, 7); c.fill(); } }
  // 캐릭터 (찌그러짐 + 승리 점프)
  let bx = sim ? sim.x : L.start.x, by = sim ? sim.y : L.start.y + Math.sin(t * 3) * 2;
  if (g.state === 'won' && g.winT) { const k = t - g.winT; by -= Math.abs(Math.sin(k * 9)) * 10 * Math.exp(-k * 1.6); }
  const sq = g.sq;
  c.save(); c.translate(bx, by);
  if (sq.a > .01) { c.rotate(sq.ang); c.scale(1 - sq.a, 1 + sq.a * .6); c.rotate(-sq.ang); }
  if (g.state === 'idle' && !sim) { const s2 = 1 + Math.sin(t * 3) * .03; c.scale(1 / s2, s2); }
  drawChar(c, 0, 0, R, g.ang, g.mood, (t % 3.4) < .13);
  c.restore();
  drawParts(c, g, t);
  if (g.flash > 0) { c.fillStyle = `rgba(224,74,63,${g.flash * .12})`; c.fillRect(-30, -30, W + 60, H + 60); g.flash *= .9; if (g.flash < .02) g.flash = 0; }
  c.restore();
}
let last = 0, acc = 0;
function handleEvent(g, e) {
  const P = pal();
  if (e.k === 'tap') {
    const now = performance.now(); if (now - (g.lastTap || 0) < 70) return; g.lastTap = now;
    g.sq = { a: Math.min(.3, e.v / 1300), ang: Math.atan2(e.ny, e.nx) };
    dust(g, e.x, e.y, e.nx, e.ny, Math.min(10, 2 + e.v / 70), 40 + e.v * .12);
    if (e.v > 280) { SFX.tap(); haptic('light'); }
    if (e.v > 520) g.shake = Math.min(5, e.v / 220);
  } else if (e.k === 'boing') {
    SFX.boing(); haptic('heavy'); if (e.s) e.s.anim = performance.now() / 1000;
    g.sq = { a: .32, ang: Math.atan2(e.ny, e.nx) }; ring(g, e.x, e.y, P.spring, 34); sparks(g, e.x, e.y, 8, P.spring, 200);
  } else if (e.k === 'warp') {
    SFX.warp(); haptic('light'); ring(g, e.x, e.y, P.portal[0], 40); ring(g, e.x2, e.y2, P.portal[1], 40); sparks(g, e.x2, e.y2, 12, P.portal[1], 220);
  } else if (e.k === 'candy') {
    SFX.candy(); haptic('light'); ring(g, e.x, e.y, '#ffd23f', 30); sparks(g, e.x, e.y, 14, '#ffd23f', 240); floatText(g, e.x, e.y - 18, '★', '#f2b705');
  }
}
function frame(ts) {
  const t = ts / 1000, dt = Math.min(.05, t - (last || t)); last = t;
  const g = G_;
  if (g && g.state === 'running' && g.sim) {
    const s = g.sim; acc += dt;
    while (acc >= DT && !s.done) { const px = s.x; s.step(); g.ang += (s.x - px) / R; acc -= DT; }
    for (const e of s.events) handleEvent(g, e);
    s.events.length = 0;
    const sp = Math.hypot(s.vx, s.vy);
    if (s.contact && sp > 180 && Math.random() < .35) dust(g, s.contact.x, s.contact.y, s.contact.nx, s.contact.ny, 1, 30);
    if (th() === 'zombie' && Math.random() < .08) fx(g, { t: 'drop', x: s.x, y: s.y + R * .6, vy: 40, grav: 500, decay: 1.5, c: '#9be15d' });
    g.trail.push({ x: s.x, y: s.y }); if (g.trail.length > (th() === 'space' ? 22 : 14)) g.trail.shift();
    if (s.done) onDone(s.done);
  } else { acc = 0; if (g && g.trail.length) g.trail.shift(); }
  if (g) {
    for (const p of g.parts) { p.vy += p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.l -= dt * p.decay; }
    g.parts = g.parts.filter(p => p.l > 0);
    g.sq.a *= Math.pow(.02, dt); if (g.cupBounce > 0) g.cupBounce = Math.max(0, g.cupBounce - dt * 1.4);
  }
  if (!$('game').hidden) render(t);
  drawMascotHome(ts);
  requestAnimationFrame(frame);
}

// 테스트용 훅
window.__rolly = { get G() { return G_; }, genLevel, Sim, stageParams, dailyParams, prog, startLevel, show };

// ---- 시작 ----
(async () => {
  const SP = plugin('SplashScreen'); try { if (SP) SP.hide(); } catch (e) { }
  applyTheme(); show('home'); requestAnimationFrame(frame); Ads.init();
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !$('home').hidden) renderHome(); });
})();
