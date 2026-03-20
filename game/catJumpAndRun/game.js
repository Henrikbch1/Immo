/* ============================================================
   Kitty Jump & Run  –  game.js
   • 3 Biome : Nacht (Lv 1-4) | Lava (Lv 5-9) | Eis (Lv 10-14)
   • Neue Strukturen : Wolken-Plattform, Stein-Brücke, Lava-Brücke,
                       Eis-Plattform, Schnee-Plattform
   • Hindernisse Nacht  : Dorn, Gegner, Fledermaus (fliegend), Geist
   • Hindernisse Lava   : Feuerball (fliegend), Dorn, Gegner,
                          Lava-Stein (rollend), Magma-Oktopus
   • Hindernisse Eis    : Eis-Spike, Dorn, Gegner,
                          Schnee-Golem, Gefrier-Wind (fliegend)
   • 3 Katzen-Skins  : Orange (frei) · Silber (50 🐟) · Schwarz (150 🐟)
   • LocalStorage    : Highscore + Gesamt-Fische + Freischaltungen
   ============================================================ */
'use strict';

// ─── Canvas ──────────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

// ─── UI refs ─────────────────────────────────────────────────
const startScreen    = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl   = document.getElementById('final-score');
const finalFishEl    = document.getElementById('final-fish');
const goBestScoreEl  = document.getElementById('go-best-score');
const unlockMsgEl    = document.getElementById('unlock-msg');
const bestScoreEl    = document.getElementById('best-score');
const totalFishDisp  = document.getElementById('total-fish-display');
const livesEl        = document.getElementById('lives');
const scoreEl        = document.getElementById('score');
const levelEl        = document.getElementById('level');
const biomeBadge     = document.getElementById('biome-badge');

document.getElementById('btn-start').addEventListener('click', startGame);
document.getElementById('btn-restart').addEventListener('click', startGame);
document.getElementById('btn-menu').addEventListener('click', () => {
  gameRunning = false;
  refreshSaveUI();
  showScreen('start-screen');
});

// ─── LocalStorage ────────────────────────────────────────────
const LS_HS   = 'kitty_highscore';
const LS_FISH = 'kitty_total_fish';

function loadSave() {
  return {
    highscore:  parseInt(localStorage.getItem(LS_HS)   || '0', 10),
    totalFish:  parseInt(localStorage.getItem(LS_FISH) || '0', 10),
  };
}
function writeSave(hs, tf) {
  localStorage.setItem(LS_HS,   String(hs));
  localStorage.setItem(LS_FISH, String(tf));
}

let saveData = loadSave();

function refreshSaveUI() {
  saveData = loadSave();
  bestScoreEl.textContent    = saveData.highscore;
  totalFishDisp.textContent  = saveData.totalFish;
  refreshSkinLocks();
}

// ─── Skins ───────────────────────────────────────────────────
const SKINS = [
  { name:'Orange', body:'#f4a261', stripe:'#c1440e', belly:'#fde8d0', iris:'#7cffb2', nose:'#e94560', ear:'#f7b8c2', unlockFish:    0 },
  { name:'Silber', body:'#9eafc2', stripe:'#5b7080', belly:'#dce8f0', iris:'#60cfff', nose:'#e94560', ear:'#c5d8e8', unlockFish:   50 },
  { name:'Schwarz',body:'#2c2c3e', stripe:'#111118', belly:'#4a4a60', iris:'#ff6bff', nose:'#e94560', ear:'#3e3e54', unlockFish:  150 },
  { name:'Rosa',   body:'#ffb6c1', stripe:'#e0607e', belly:'#fff0f3', iris:'#ff1493', nose:'#ff69b4', ear:'#ffccd5', unlockFish:  300 },
  { name:'Ozean',  body:'#0d7377', stripe:'#14a085', belly:'#b2f0e8', iris:'#00ffe7', nose:'#e94560', ear:'#12c2b0', unlockFish:  500 },
  { name:'Lava',   body:'#c0392b', stripe:'#7b1010', belly:'#ffd3c0', iris:'#ffcc00', nose:'#ff6600', ear:'#e85d04', unlockFish:  800 },
  { name:'Geist',  body:'#dde8ff', stripe:'#8898cc', belly:'#ffffff', iris:'#a020f0', nose:'#cc88ff', ear:'#c8d8ff', unlockFish: 1200 },
];
let currentSkin = 0;

function isSkinUnlocked(idx) {
  return saveData.totalFish >= SKINS[idx].unlockFish;
}

function refreshSkinLocks() {
  document.querySelectorAll('.skin-btn').forEach(btn => {
    const idx = parseInt(btn.dataset.skin, 10);
    const lock = document.getElementById(`lock-${idx}`);
    if (isSkinUnlocked(idx)) {
      btn.classList.remove('locked');
      btn.disabled = false;
      if (lock) lock.style.display = 'none';
    } else {
      btn.classList.add('locked');
      btn.disabled = true;
      if (lock) lock.style.display = '';
      // Wenn der aktuelle Skin gesperrt wurde, auf Orange zurückfallen
      if (currentSkin === idx) {
        currentSkin = 0;
        document.querySelectorAll('.skin-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.skin-btn[data-skin="0"]').classList.add('active');
      }
    }
  });
}

document.querySelectorAll('.skin-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = parseInt(btn.dataset.skin, 10);
    if (!isSkinUnlocked(idx)) return;
    document.querySelectorAll('.skin-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSkin = idx;
    SKINS.forEach((_, i) => renderSkinPreview(i));
  });
});

// ─── Constants ───────────────────────────────────────────────
const GRAVITY     = 0.55;
const JUMP_FORCE  = -13.5;
const BASE_SPEED  = 4;
const CAT_W       = 52;
const CAT_H       = 42;
const GROUND_FRAC = 0.78;

// ─── Biome definitions ───────────────────────────────────────
const BIOMES = {
  night: {
    label:'🌙 Nacht',
    skyTop:'#1a1a2e', skyBot:'#16213e',
    gFill:'#0f3460',  gDark:'#081a33',
    gTop:'#e94560',   gLine:'rgba(233,69,96,.3)',
    mt1:'#0d2b45',    mt2:'#0f3460',
    platCol:'#e94560',platTop:'#ff8fa3',
  },
  lava: {
    label:'🌋 Lava',
    skyTop:'#1a0500', skyBot:'#3d0e00',
    gFill:'#6b1a00',  gDark:'#3d0800',
    gTop:'#ff6a00',   gLine:'rgba(255,106,0,.35)',
    mt1:'#3d0800',    mt2:'#5a1200',
    platCol:'#8b2500',platTop:'#ff6a00',
  },
  ice: {
    label:'❄️ Eis',
    skyTop:'#0a1a2e', skyBot:'#0d2840',
    gFill:'#1a4a6e',  gDark:'#0a2840',
    gTop:'#7ee8fa',   gLine:'rgba(126,232,250,.3)',
    mt1:'#0d3050',    mt2:'#1a4a6e',
    platCol:'#4dc8e8',platTop:'#b8f0ff',
  },
};

function biomeForLevel(lv) {
  const c = (lv - 1) % 15;
  if (c < 5)  return 'night';
  if (c < 10) return 'lava';
  return 'ice';
}

// ─── State ───────────────────────────────────────────────────
let gameRunning = false;
let score, lives, level, speed, scrollX, frame;
let invincible, invTimer;
let platforms, obstacles, collectibles, particles, stars, mountains;
let biomeId, lavaOff, iceShim;
let sessionFish; // Fische in dieser Runde

// ─── Biome transition ────────────────────────────────────────
// Die Grenzlinie startet rechts und scrollt nach links durch den Screen.
// biomeTransition.active   = läuft gerade ein Übergang
// biomeTransition.prevId   = altes Biom (links der Grenze)
// biomeTransition.nextId   = neues Biom  (rechts der Grenze)
// biomeTransition.lineX    = aktuelle X-Position der Grenzlinie (Canvas-Koordinaten)
// biomeTransition.offCtx   = Off-screen-Canvas für das neue Biom
const biomeTransition = {
  active: false, prevId: null, nextId: null,
  lineX: 0, speed: 0,
  offCanvas: null, offCtx: null,
};

// ─── Input ───────────────────────────────────────────────────
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  if ((e.code === 'Space' || e.code === 'ArrowUp') && gameRunning) e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// ─── Cat ─────────────────────────────────────────────────────
const cat = {
  x:0, y:0, vx:0, vy:0,
  onGround:false, jumps:0,
  af:0, at:0, left:false,

  reset(W, H) {
    this.x = W * 0.18;
    this.y = H * GROUND_FRAC - CAT_H;
    this.vx = 0; this.vy = 0;
    this.onGround = true; this.jumps = 0;
    this.af = 0; this.at = 0; this.left = false;
  },

  get hitbox() {
    return { x: this.x + 4, y: this.y + 4, w: CAT_W - 8, h: CAT_H - 6 };
  },

  jump() {
    if (this.jumps >= 2) return;
    this.vy = JUMP_FORCE * (this.jumps === 1 ? 0.85 : 1);
    this.onGround = false;
    this.jumps++;
    spawnJumpDust(this.x + CAT_W / 2, this.y + CAT_H);
  },

  update(W, H) {
    const groundY = H * GROUND_FRAC;
    if      (keys['ArrowLeft']  || keys['KeyA']) { this.vx = -speed * 0.6; this.left = true;  }
    else if (keys['ArrowRight'] || keys['KeyD']) { this.vx =  speed * 0.6; this.left = false; }
    else { this.vx *= 0.8; }

    this.x = Math.max(0, Math.min(this.x + this.vx, W * 0.55 - CAT_W));
    this.vy += GRAVITY;
    this.y  += this.vy;

    if (this.y + CAT_H >= groundY) {
      this.y = groundY - CAT_H; this.vy = 0;
      this.onGround = true; this.jumps = 0;
    }
    this.onGround = (this.y + CAT_H >= groundY - 2);

    for (const p of platforms) {
      const prevBot = this.y + CAT_H - this.vy;
      const hb = this.hitbox;
      if (hb.x < p.x + p.w && hb.x + hb.w > p.x && prevBot <= p.y + 4 && this.y + CAT_H >= p.y) {
        this.y = p.y - CAT_H; this.vy = 0;
        this.onGround = true; this.jumps = 0;
      }
    }

    if (this.onGround) { this.at++; if (this.at >= 7) { this.af = (this.af + 1) % 4; this.at = 0; } }
    else { this.af = 1; }
  },
};

window.addEventListener('keydown', e => {
  if (!gameRunning) return;
  if (e.code === 'ArrowUp' || e.code === 'Space') cat.jump();
});

// ─── Touch buttons ───────────────────────────────────────────
const tDiv = document.createElement('div');
tDiv.id = 'touch-controls';
tDiv.innerHTML = `
  <button class="touch-btn" id="tc-left">&#9664;</button>
  <button class="touch-btn" id="tc-jump">&#9650;</button>
  <button class="touch-btn" id="tc-right">&#9654;</button>`;
document.body.appendChild(tDiv);

function holdKey(code, el) {
  el.addEventListener('touchstart', e => { e.preventDefault(); keys[code] = true;  }, { passive: false });
  el.addEventListener('touchend',   e => { e.preventDefault(); keys[code] = false; });
  el.addEventListener('mousedown',  () => { keys[code] = true;  });
  el.addEventListener('mouseup',    () => { keys[code] = false; });
}
holdKey('ArrowLeft',  document.getElementById('tc-left'));
holdKey('ArrowRight', document.getElementById('tc-right'));
document.getElementById('tc-jump').addEventListener('touchstart', e => { e.preventDefault(); if (gameRunning) cat.jump(); }, { passive: false });
document.getElementById('tc-jump').addEventListener('mousedown',  () => { if (gameRunning) cat.jump(); });

// ─── Helpers ─────────────────────────────────────────────────
function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function rr(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);    c.quadraticCurveTo(x + w, y,     x + w, y + r);
  c.lineTo(x + w, y + h - r);c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h);    c.quadraticCurveTo(x,     y + h, x,     y + h - r);
  c.lineTo(x, y + r);        c.quadraticCurveTo(x,     y,     x + r, y);
  c.closePath();
}

function bp(key) { return BIOMES[biomeId][key]; }

// ─── Particles ───────────────────────────────────────────────
function addPart(x, y, vx, vy, r, color, life) {
  particles.push({ x, y, vx, vy, r, color, life, maxLife: life });
}
function spawnJumpDust(x, y) {
  const col = biomeId === 'lava' ? '#ff6a00' : biomeId === 'ice' ? '#b8f0ff' : '#f5a623';
  for (let i = 0; i < 6; i++) addPart(x, y, (Math.random()-.5)*3, -Math.random()*3-1, Math.random()*4+2, col, 30);
}
function spawnCollect(x, y) {
  for (let i = 0; i < 10; i++) addPart(x, y, (Math.random()-.5)*5, (Math.random()-.5)*5-2, Math.random()*5+2, '#f5a623', 35);
}
function spawnHit(x, y) {
  for (let i = 0; i < 12; i++) addPart(x, y, (Math.random()-.5)*6, (Math.random()-.5)*6-2, Math.random()*6+2, '#ff5c5c', 40);
}
function spawnFire(x, y) {
  const cols = ['#ff6a00','#ff3300','#ffcc00'];
  for (let i = 0; i < 4; i++) addPart(x+(Math.random()-.5)*10, y, (Math.random()-.5)*2.5, -Math.random()*2.5-1, Math.random()*5+2, cols[Math.floor(Math.random()*3)], 22);
}
function spawnIceDust(x, y) {
  for (let i = 0; i < 4; i++) addPart(x+(Math.random()-.5)*8, y, (Math.random()-.5)*3, (Math.random()-.5)*2-1, Math.random()*4+1, Math.random()<.5?'#b8f0ff':'#fff', 25);
}

// ─── World generation ────────────────────────────────────────
function genStars(W, H) {
  stars = [];
  for (let i = 0; i < 130; i++)
    stars.push({ x: Math.random()*W, y: Math.random()*H*.7, r: Math.random()*1.5+.3, b: Math.random() });
}

function genMountainsFor(W) {
  const arr = [];
  for (let x = 0; x < W + 400; x += 140 + Math.random()*80) arr.push({ x, h: Math.random()*140+80, layer: 0 });
  for (let x = -80; x < W + 200; x += 100 + Math.random()*60) arr.push({ x, h: Math.random()*90+50,  layer: 1 });
  return arr;
}

function genMountains(W) {
  mountains = genMountainsFor(W);
}

function spawnPlatform(W, H) {
  const groundY = H * GROUND_FRAC;
  const w = 80 + Math.random() * 120;
  const y = H * 0.3 + Math.random() * (groundY - H * 0.3 - 80);
  let type = 'normal';
  if      (biomeId === 'night') type = Math.random() < .4 ? 'cloud'      : 'normal';
  else if (biomeId === 'lava')  type = Math.random() < .5 ? 'stone'      : 'lava-bridge';
  else if (biomeId === 'ice')   type = Math.random() < .6 ? 'ice'        : 'snow';
  platforms.push({ x: W + 40, y, w, h: 18, type });
}

function spawnObstacle(W, H) {
  const groundY = H * GROUND_FRAC;
  let type, flying;
  if (biomeId === 'lava') {
    const r = Math.random();
    if      (r < .22) { type = 'fireball';    flying = true;  }
    else if (r < .42) { type = 'lavarock';    flying = false; }
    else if (r < .62) { type = 'magmakraken'; flying = false; }
    else if (r < .78) { type = 'thorn';       flying = false; }
    else              { type = 'enemy';        flying = false; }
  } else if (biomeId === 'ice') {
    const r = Math.random();
    if      (r < .22) { type = 'icespike';    flying = false; }
    else if (r < .44) { type = 'snowgolem';   flying = false; }
    else if (r < .64) { type = 'freezewind';  flying = true;  }
    else if (r < .80) { type = 'thorn';       flying = false; }
    else              { type = 'enemy';        flying = false; }
  } else { // night
    const r = Math.random();
    if      (r < .25) { type = 'bat';   flying = true;  }
    else if (r < .50) { type = 'ghost'; flying = true;  }
    else if (r < .75) { type = 'thorn'; flying = false; }
    else              { type = 'enemy'; flying = false;  }
  }
  const yPos = flying
    ? groundY - 40 - Math.random() * (H * 0.32)
    : groundY - 36;
  obstacles.push({ x: W + 20, y: yPos, w: 32, h: 32, type,
    af: 0, at: 0, phase: Math.random() * Math.PI * 2,
    spd: (type === 'fireball' || type === 'freezewind') ? speed * 1.1 : speed,
    trackDir: 0 });
}

function spawnCollectible(W, H) {
  const groundY = H * GROUND_FRAC;
  collectibles.push({ x: W + 20, y: groundY - 60 - Math.random() * (H * .35),
    w: 28, h: 28, bob: Math.random() * Math.PI * 2, done: false });
}

// ─── Biome switch ────────────────────────────────────────────
function setBiome(id) {
  biomeId = id;
  biomeBadge.textContent = BIOMES[id].label;
  genMountains(canvas.width);
}

function startBiomeTransition(nextId) {
  const W = canvas.width, H = canvas.height;

  // Off-screen-Canvas für das neue Biom vorbereiten
  if (!biomeTransition.offCanvas) {
    biomeTransition.offCanvas = document.createElement('canvas');
    biomeTransition.offCtx    = biomeTransition.offCanvas.getContext('2d');
  }
  biomeTransition.offCanvas.width  = W;
  biomeTransition.offCanvas.height = H;

  biomeTransition.active  = true;
  biomeTransition.prevId  = biomeId;
  biomeTransition.nextId  = nextId;
  biomeTransition.lineX   = W;           // startet rechts außerhalb
  biomeTransition.speed   = speed * 1.8; // etwas schneller als die Spielgeschwindigkeit

  // Berge für das neue Biom schon mal generieren (im Hintergrund)
  biomeTransition.nextMountains = genMountainsFor(W);

  // Neues Biom sofort setzen damit Objekte korrekt gespawnt werden
  setBiome(nextId);

  // Badge-Ankündigung mit kleinem Aufblinken
  biomeBadge.style.transition = 'background .3s';
  biomeBadge.style.background = BIOMES[nextId].gTop ?? 'rgba(255,255,255,.2)';
  setTimeout(() => { biomeBadge.style.background = ''; }, 600);
}

// ─── Init ────────────────────────────────────────────────────
function startGame() {
  score = 0; lives = 3; level = 1; sessionFish = 0;
  speed = BASE_SPEED; scrollX = 0; frame = 0;
  invincible = false; invTimer = 0;
  lavaOff = 0; iceShim = 0;
  platforms = []; obstacles = []; collectibles = []; particles = [];

  genStars(canvas.width, canvas.height);
  setBiome('night');
  cat.reset(canvas.width, canvas.height);
  for (let i = 0; i < 4; i++) spawnPlatform(canvas.width * (.6 + i * .25), canvas.height);

  unlockMsgEl.textContent = '';
  updateHUD();
  showScreen(null);
  gameRunning = true;
  requestAnimationFrame(loop);
}

function updateHUD() {
  livesEl.textContent = lives;
  scoreEl.textContent = score;
  levelEl.textContent = level;
}

function showScreen(id) {
  startScreen.classList.remove('active');
  gameOverScreen.classList.remove('active');
  if (id) document.getElementById(id).classList.add('active');
}

// ─── Cat drawing ─────────────────────────────────────────────
function drawCatCtx(c, x, y, af, left, inv, skinIdx) {
  const sk = SKINS[skinIdx !== undefined ? skinIdx : currentSkin];
  c.save();
  if (left) { c.translate(x + CAT_W, y); c.scale(-1, 1); x = 0; y = 0; }
  else      { c.translate(x, y); x = 0; y = 0; }
  if (inv && Math.floor(Date.now() / 80) % 2 === 0) { c.restore(); return; }

  const lo = [0, 3, 0, -3][af % 4];

  // Tail
  c.strokeStyle = sk.stripe; c.lineWidth = 5; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x+4,y+28); c.quadraticCurveTo(x-14,y+18,x-8,y+8); c.stroke();

  // Body
  c.fillStyle = sk.body; rr(c,x+8,y+12,34,24,10); c.fill();

  // Belly
  c.fillStyle = sk.belly; c.beginPath(); c.ellipse(x+28,y+28,10,8,0,0,Math.PI*2); c.fill();

  // Stripes
  c.strokeStyle = sk.stripe; c.lineWidth = 2;
  [18,24,30].forEach(sx => { c.beginPath(); c.moveTo(x+sx,y+13); c.lineTo(x+sx-2,y+20); c.stroke(); });

  // Head
  c.fillStyle = sk.body; c.beginPath(); c.ellipse(x+35,y+14,15,13,.1,0,Math.PI*2); c.fill();

  // Ears (outer)
  c.fillStyle = sk.body;
  c.beginPath(); c.moveTo(x+22,y+5);  c.lineTo(x+26,y+13); c.lineTo(x+30,y+6);  c.closePath(); c.fill();
  c.beginPath(); c.moveTo(x+35,y+2);  c.lineTo(x+39,y+11); c.lineTo(x+44,y+3);  c.closePath(); c.fill();
  // Ears (inner)
  c.fillStyle = sk.ear;
  c.beginPath(); c.moveTo(x+25,y+7);  c.lineTo(x+27,y+12); c.lineTo(x+30,y+8);  c.closePath(); c.fill();
  c.beginPath(); c.moveTo(x+37,y+4);  c.lineTo(x+39,y+10); c.lineTo(x+42,y+5);  c.closePath(); c.fill();

  // Eyes
  c.fillStyle = '#1a1a2e';
  c.beginPath(); c.ellipse(x+30,y+13,3,3.5,0,0,Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(x+40,y+13,3,3.5,0,0,Math.PI*2); c.fill();
  c.fillStyle = sk.iris;
  c.beginPath(); c.ellipse(x+30,y+13,2,2.5,0,0,Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(x+40,y+13,2,2.5,0,0,Math.PI*2); c.fill();
  c.fillStyle = '#000';
  c.beginPath(); c.ellipse(x+30,y+13,1,2.5,0,0,Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(x+40,y+13,1,2.5,0,0,Math.PI*2); c.fill();

  // Nose & mouth
  c.fillStyle = sk.nose; c.beginPath(); c.ellipse(x+35,y+18,2.5,1.8,0,0,Math.PI*2); c.fill();
  c.strokeStyle = sk.stripe; c.lineWidth = 1.5;
  c.beginPath(); c.moveTo(x+35,y+19.5); c.quadraticCurveTo(x+31,y+22,x+29,y+21); c.stroke();
  c.beginPath(); c.moveTo(x+35,y+19.5); c.quadraticCurveTo(x+39,y+22,x+41,y+21); c.stroke();

  // Whiskers
  c.strokeStyle = '#fff'; c.lineWidth = 1;
  [[x+28,y+18,x+18,y+16],[x+28,y+19,x+18,y+20],[x+42,y+18,x+52,y+16],[x+42,y+19,x+52,y+20]]
    .forEach(([x1,y1,x2,y2]) => { c.beginPath(); c.moveTo(x1,y1); c.lineTo(x2,y2); c.stroke(); });

  // Legs
  c.fillStyle = sk.body;
  c.fillRect(x+10, y+33+lo,     10, 10);
  c.fillRect(x+22, y+33-lo,     10, 10);
  c.fillRect(x+34, y+33+lo*.5,  10, 10);

  // Paws
  c.fillStyle = sk.belly;
  c.beginPath(); c.ellipse(x+15, y+43+lo,    5,3,0,0,Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(x+27, y+43-lo,    5,3,0,0,Math.PI*2); c.fill();
  c.beginPath(); c.ellipse(x+39, y+43+lo*.5, 5,3,0,0,Math.PI*2); c.fill();

  c.restore();
}

// ─── Skin preview ────────────────────────────────────────────
function renderSkinPreview(skinIdx) {
  const cv = document.querySelector(`.skin-preview[data-skin="${skinIdx}"]`);
  if (!cv) return;
  const pc = cv.getContext('2d');
  pc.clearRect(0, 0, 52, 52);
  drawCatCtx(pc, 0, 4, 0, false, false, skinIdx);
}
setTimeout(() => SKINS.forEach((_, i) => renderSkinPreview(i)), 60);

// ─── Fish ────────────────────────────────────────────────────
function drawFish(x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#f5a623';
  ctx.beginPath(); ctx.ellipse(x+w*.4,y+h*.5,w*.38,h*.28,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x+w*.75,y+h*.5); ctx.lineTo(x+w,y+h*.15); ctx.lineTo(x+w,y+h*.85); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#1a1a2e'; ctx.beginPath(); ctx.arc(x+w*.22,y+h*.42,h*.1,0,Math.PI*2); ctx.fill();
  ctx.shadowColor = '#f5a623'; ctx.shadowBlur = 10;
  ctx.fillStyle = 'rgba(245,166,35,.4)'; ctx.beginPath(); ctx.ellipse(x+w*.4,y+h*.5,w*.45,h*.38,0,0,Math.PI*2); ctx.fill();
  ctx.restore();
}

// ─── Platforms ───────────────────────────────────────────────
function drawPlatform(p) {
  ctx.save();
  switch (p.type) {

    case 'cloud': {
      ctx.fillStyle = 'rgba(220,235,255,.92)';
      ctx.shadowColor = '#a0c8ff'; ctx.shadowBlur = 12;
      const cx = p.x + p.w / 2, cy = p.y + 6;
      ctx.beginPath(); ctx.ellipse(cx,          cy,   p.w*.38,14,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx-p.w*.22,  cy+4, p.w*.25,11,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx+p.w*.22,  cy+4, p.w*.25,11,0,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(200,220,255,.7)';
      rr(ctx, p.x+4, p.y+6, p.w-8, 10, 5); ctx.fill();
      break;
    }

    case 'stone':
    case 'lava-bridge': {
      ctx.fillStyle = p.type === 'lava-bridge' ? '#4a1800' : '#3a3a4a';
      rr(ctx, p.x, p.y+4, p.w, p.h-4, 4); ctx.fill();
      ctx.fillStyle = p.type === 'lava-bridge' ? '#8b2500' : '#6a6a7a';
      const seg = Math.ceil(p.w / 20);
      for (let i = 0; i < seg; i++) {
        const sx = p.x + i * (p.w / seg);
        ctx.fillRect(sx, p.y, p.w / seg - 2, 6 + Math.sin(i * 1.7) * 3 + 4);
      }
      if (p.type === 'lava-bridge') {
        ctx.shadowColor = '#ff6a00'; ctx.shadowBlur = 12;
        ctx.fillStyle = '#ff6a00'; ctx.fillRect(p.x+2, p.y, p.w-4, 3);
      }
      break;
    }

    case 'ice':
    case 'snow': {
      ctx.fillStyle = p.type === 'ice' ? '#4dc8e8' : '#d0eeff';
      rr(ctx, p.x, p.y, p.w, p.h, 5); ctx.fill();
      ctx.fillStyle = p.type === 'ice' ? '#b8f0ff' : '#ffffff';
      rr(ctx, p.x+2, p.y, p.w-4, 5, 3); ctx.fill();
      if (p.type === 'ice') {
        ctx.fillStyle = 'rgba(126,232,250,.7)';
        ctx.shadowColor = '#7ee8fa'; ctx.shadowBlur = 6;
        const cnt = Math.floor(p.w / 18);
        for (let i = 0; i < cnt; i++) {
          const ix = p.x + i * (p.w / cnt) + 6;
          const ih = 8 + Math.sin(i * 2.1) * 4;
          ctx.beginPath(); ctx.moveTo(ix, p.y+p.h); ctx.lineTo(ix+5, p.y+p.h); ctx.lineTo(ix+2.5, p.y+p.h+ih); ctx.closePath(); ctx.fill();
        }
      }
      break;
    }

    default: {
      ctx.fillStyle = bp('platCol'); rr(ctx, p.x, p.y, p.w, p.h, 6); ctx.fill();
      ctx.fillStyle = bp('platTop'); rr(ctx, p.x+2, p.y, p.w-4, 6, 3); ctx.fill();
      break;
    }
  }
  ctx.restore();
}

// ─── Obstacles ───────────────────────────────────────────────
function drawObstacle(ob) {
  ctx.save();

  if (ob.type === 'thorn') {
    ctx.fillStyle = '#ff5722';
    ctx.fillRect(ob.x, ob.y+ob.h*.6, ob.w, ob.h*.4);
    for (let i = 0; i < 3; i++) {
      const sx = ob.x + i * (ob.w / 3);
      ctx.beginPath(); ctx.moveTo(sx,ob.y+ob.h); ctx.lineTo(sx+ob.w/6,ob.y); ctx.lineTo(sx+ob.w/3,ob.y+ob.h); ctx.closePath(); ctx.fill();
    }

  } else if (ob.type === 'fireball') {
    const pulse = 1 + Math.sin(frame * .18 + ob.phase) * .18;
    const rad   = ob.w * .5 * pulse;
    const cx    = ob.x + ob.w / 2, cy = ob.y + ob.h / 2;
    const fg    = ctx.createRadialGradient(cx, cy, rad*.1, cx, cy, rad);
    fg.addColorStop(0, '#ffff80'); fg.addColorStop(.4,'#ff8000'); fg.addColorStop(1,'rgba(255,30,0,0)');
    ctx.fillStyle = fg; ctx.shadowColor = '#ff6a00'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = '#ff4400';
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + frame * .08;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a)*rad, cy + Math.sin(a)*rad, 4, 0, Math.PI*2); ctx.fill();
    }

  } else if (ob.type === 'icespike') {
    ctx.fillStyle = '#7ee8fa'; ctx.shadowColor = '#b8f0ff'; ctx.shadowBlur = 10;
    ctx.fillRect(ob.x, ob.y+ob.h*.5, ob.w, ob.h*.5);
    for (let i = 0; i < 3; i++) {
      const sx = ob.x + i * (ob.w / 3);
      ctx.fillStyle = i === 1 ? '#b8f0ff' : '#7ee8fa';
      ctx.beginPath(); ctx.moveTo(sx,ob.y+ob.h); ctx.lineTo(sx+ob.w/6,ob.y); ctx.lineTo(sx+ob.w/3,ob.y+ob.h); ctx.closePath(); ctx.fill();
    }

  } else if (ob.type === 'bat') {
    // Fledermaus – fliegend, Nacht-Biom
    const bx = ob.x + ob.w/2, by = ob.y + ob.h/2;
    const wing = Math.sin(frame * .22 + ob.phase) * 7;
    ctx.fillStyle = '#3b0a6e';
    // linker Flügel
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx-18, by-8+wing, bx-ob.w*.55, by+2+wing); ctx.quadraticCurveTo(bx-10, by+6, bx, by+4); ctx.closePath(); ctx.fill();
    // rechter Flügel
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx+18, by-8+wing, bx+ob.w*.55, by+2+wing); ctx.quadraticCurveTo(bx+10, by+6, bx, by+4); ctx.closePath(); ctx.fill();
    // Körper
    ctx.fillStyle = '#5b1a9e';
    ctx.beginPath(); ctx.ellipse(bx, by+2, 7, 9, 0, 0, Math.PI*2); ctx.fill();
    // Augen
    ctx.fillStyle = '#ff3366';
    ctx.beginPath(); ctx.arc(bx-3, by-1, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(bx+3, by-1, 2, 0, Math.PI*2); ctx.fill();
    // Ohren
    ctx.fillStyle = '#3b0a6e';
    ctx.beginPath(); ctx.moveTo(bx-5, by-7); ctx.lineTo(bx-8, by-14); ctx.lineTo(bx-2, by-7); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx+5, by-7); ctx.lineTo(bx+8, by-14); ctx.lineTo(bx+2, by-7); ctx.closePath(); ctx.fill();

  } else if (ob.type === 'ghost') {
    // Geist – fliegend, Nacht-Biom
    const gx = ob.x, gy = ob.y;
    const bob = Math.sin(frame * .08 + ob.phase) * 4;
    ctx.save();
    ctx.globalAlpha = 0.82;
    // Körper
    const gg = ctx.createRadialGradient(gx+ob.w/2, gy+ob.h/2+bob, 2, gx+ob.w/2, gy+ob.h/2+bob, ob.w*.55);
    gg.addColorStop(0, '#dde8ff');
    gg.addColorStop(0.5, '#aab8e8');
    gg.addColorStop(1, 'rgba(100,120,220,0)');
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(gx+ob.w/2, gy+ob.h*.38+bob, ob.w*.42, Math.PI, 0);
    ctx.lineTo(gx+ob.w, gy+ob.h*.85+bob);
    for (let i = 3; i >= 0; i--) {
      const wx = gx + ob.w*(i/3);
      ctx.quadraticCurveTo(wx + ob.w/6, gy+ob.h+bob + (i%2===0 ? 8 : -4), wx, gy+ob.h*.75+bob);
    }
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    // Augen
    ctx.fillStyle = '#1a1a3e';
    ctx.beginPath(); ctx.ellipse(gx+ob.w*.36, gy+ob.h*.36+bob, 4, 5, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(gx+ob.w*.64, gy+ob.h*.36+bob, 4, 5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#7b9fff';
    ctx.beginPath(); ctx.ellipse(gx+ob.w*.36, gy+ob.h*.36+bob, 2, 3, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(gx+ob.w*.64, gy+ob.h*.36+bob, 2, 3, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();

  } else if (ob.type === 'lavarock') {
    // Rollender Lava-Stein
    const rx = ob.x + ob.w/2, ry = ob.y + ob.h/2;
    const rot = frame * .1 + ob.phase;
    ctx.save();
    ctx.translate(rx, ry); ctx.rotate(rot);
    // Steinkörper
    ctx.fillStyle = '#3a1200';
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const a = (i/7)*Math.PI*2;
      const rd = ob.w*.42 + Math.sin(a*3+ob.phase)*4;
      if (i===0) ctx.moveTo(Math.cos(a)*rd, Math.sin(a)*rd);
      else ctx.lineTo(Math.cos(a)*rd, Math.sin(a)*rd);
    }
    ctx.closePath(); ctx.fill();
    // Lava-Risse
    ctx.strokeStyle = '#ff5500'; ctx.lineWidth = 2;
    ctx.shadowColor = '#ff6a00'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(-6,-4); ctx.lineTo(0,2); ctx.lineTo(5,-6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-3,5); ctx.lineTo(4,8); ctx.stroke();
    ctx.fillStyle = 'rgba(255,100,0,.55)';
    ctx.beginPath(); ctx.arc(-2, 3, 4, 0, Math.PI*2); ctx.fill();
    ctx.restore();

  } else if (ob.type === 'magmakraken') {
    // Magma-Oktopus – Lava-Biom
    const mx = ob.x + ob.w/2, my = ob.y + ob.h*.4;
    const bob = Math.sin(frame * .1 + ob.phase) * 3;
    ctx.fillStyle = '#8b1a00';
    ctx.shadowColor = '#ff4400'; ctx.shadowBlur = 14;
    // Kopf
    ctx.beginPath(); ctx.ellipse(mx, my+bob, ob.w*.38, ob.h*.32, 0, 0, Math.PI*2); ctx.fill();
    // Tentakel
    ctx.strokeStyle = '#6b1000'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const tx = ob.x + ob.w*(0.15 + i*0.24);
      const amp = Math.sin(frame*.14 + ob.phase + i*1.2) * 6;
      ctx.beginPath();
      ctx.moveTo(tx, my+bob+ob.h*.28);
      ctx.quadraticCurveTo(tx+amp, my+bob+ob.h*.55, tx-amp*.5, my+bob+ob.h*.85);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    // Augen
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath(); ctx.arc(mx-7, my+bob-2, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx+7, my+bob-2, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a0500';
    ctx.beginPath(); ctx.arc(mx-7, my+bob-2, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx+7, my+bob-2, 2.5, 0, Math.PI*2); ctx.fill();

  } else if (ob.type === 'snowgolem') {
    // Schnee-Golem – Eis-Biom
    const sx = ob.x + ob.w/2;
    const wobble = Math.sin(frame * .07 + ob.phase) * 2;
    // Unterkörper
    ctx.fillStyle = '#d8f0ff';
    ctx.shadowColor = '#7ee8fa'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.ellipse(sx, ob.y+ob.h*.78, ob.w*.42, ob.h*.26, 0, 0, Math.PI*2); ctx.fill();
    // Oberkörper
    ctx.beginPath(); ctx.ellipse(sx, ob.y+ob.h*.48+wobble, ob.w*.32, ob.h*.22, 0, 0, Math.PI*2); ctx.fill();
    // Kopf
    ctx.beginPath(); ctx.ellipse(sx, ob.y+ob.h*.2+wobble, ob.w*.25, ob.h*.2, 0, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // Knöpfe
    ctx.fillStyle = '#0a2840';
    ctx.beginPath(); ctx.arc(sx, ob.y+ob.h*.44+wobble, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx, ob.y+ob.h*.54+wobble, 2.5, 0, Math.PI*2); ctx.fill();
    // Augen
    ctx.fillStyle = '#0a2840';
    ctx.beginPath(); ctx.arc(sx-5, ob.y+ob.h*.18+wobble, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx+5, ob.y+ob.h*.18+wobble, 2.5, 0, Math.PI*2); ctx.fill();
    // Karotten-Nase
    ctx.fillStyle = '#ff8c00';
    ctx.beginPath(); ctx.moveTo(sx, ob.y+ob.h*.22+wobble); ctx.lineTo(sx+9, ob.y+ob.h*.23+wobble); ctx.lineTo(sx, ob.y+ob.h*.25+wobble); ctx.closePath(); ctx.fill();
    // Arme (Äste)
    ctx.strokeStyle = '#5a3010'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(sx-ob.w*.3, ob.y+ob.h*.44+wobble); ctx.lineTo(sx-ob.w*.55, ob.y+ob.h*.36+wobble); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sx+ob.w*.3, ob.y+ob.h*.44+wobble); ctx.lineTo(sx+ob.w*.55, ob.y+ob.h*.36+wobble); ctx.stroke();

  } else if (ob.type === 'freezewind') {
    // Gefrier-Wind – fliegendes Eis-Projektil
    const fx = ob.x + ob.w/2, fy = ob.y + ob.h/2;
    const spin = frame * .18 + ob.phase;
    ctx.save();
    ctx.shadowColor = '#b8f0ff'; ctx.shadowBlur = 18;
    // Schneeflocken-Arme
    for (let arm = 0; arm < 6; arm++) {
      const a = spin + (arm/6)*Math.PI*2;
      const len = ob.w*.46;
      ctx.strokeStyle = arm % 2 === 0 ? '#ffffff' : '#7ee8fa';
      ctx.lineWidth = arm % 2 === 0 ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + Math.cos(a)*len, fy + Math.sin(a)*len);
      ctx.stroke();
      // Seitenäste
      const mx2 = fx + Math.cos(a)*len*.55, my2 = fy + Math.sin(a)*len*.55;
      const ba = a + Math.PI/3;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(mx2, my2); ctx.lineTo(mx2+Math.cos(ba)*7, my2+Math.sin(ba)*7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mx2, my2); ctx.lineTo(mx2+Math.cos(a+Math.PI/3*2)*7, my2+Math.sin(a+Math.PI/3*2)*7); ctx.stroke();
    }
    // Kern
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(fx, fy, 5, 0, Math.PI*2); ctx.fill();
    ctx.restore();

  } else {
    const bobY = Math.sin(ob.af * .3) * 4;
    const ex = ob.x, ey = ob.y + bobY;
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath(); ctx.ellipse(ex+ob.w/2, ey+ob.h*.55, ob.w*.42, ob.h*.38, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ex+ob.w/2, ey+ob.h*.2,  ob.w*.35, ob.h*.28, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ex+ob.w*.35,ey+ob.h*.05); ctx.lineTo(ex+ob.w*.25,ey-ob.h*.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex+ob.w*.65,ey+ob.h*.05); ctx.lineTo(ex+ob.w*.75,ey-ob.h*.1); ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(ex+ob.w*.38,ey+ob.h*.18,3,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ex+ob.w*.62,ey+ob.h*.18,3,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#7c3aed'; ctx.lineWidth = 3;
    const ls = Math.sin(ob.af * .4) * 6;
    ctx.beginPath(); ctx.moveTo(ex+ob.w*.35,ey+ob.h*.85); ctx.lineTo(ex+ob.w*.2, ey+ob.h+ls);  ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex+ob.w*.65,ey+ob.h*.85); ctx.lineTo(ex+ob.w*.8, ey+ob.h-ls);  ctx.stroke();
  }
  ctx.restore();
}

// ─── Background ──────────────────────────────────────────────
// targetCtx / overrideBiome / overrideMts werden beim Übergang für den
// Offscreen-Render des neuen Bioms genutzt.
function drawBg(W, H, targetCtx, overrideBiome, overrideMts) {
  const c       = targetCtx  || ctx;
  const bid     = overrideBiome || biomeId;
  const mts     = overrideMts   || mountains;
  const bpFor   = key => BIOMES[bid][key];

  const groundY = H * GROUND_FRAC;

  const grad = c.createLinearGradient(0, 0, 0, groundY);
  grad.addColorStop(0, bpFor('skyTop')); grad.addColorStop(1, bpFor('skyBot'));
  c.fillStyle = grad; c.fillRect(0, 0, W, H);

  // Sky-Elemente – nutzen intern ctx, daher nur wenn Haupt-Canvas
  if (!targetCtx) {
    if      (bid === 'lava') drawLavaSky(W, H);
    else if (bid === 'ice')  drawIceSky(W, H);
    else                     drawNightSky(W, H);
  } else {
    drawSkySwitchable(c, W, H, bid);
  }

  // Back mountains
  const ms1 = (scrollX * .2) % (W + 400);
  mts.filter(m => m.layer === 0).forEach(m => {
    const mx = ((m.x - ms1) + W + 400) % (W + 400) - 200;
    c.fillStyle = bpFor('mt1');
    if      (bid === 'lava') drawVolcanoOn(c, mx, groundY, m.h);
    else if (bid === 'ice')  drawIcebergOn(c, mx, groundY, m.h);
    else {
      c.beginPath(); c.moveTo(mx,groundY); c.lineTo(mx+100,groundY-m.h); c.lineTo(mx+200,groundY); c.closePath(); c.fill();
    }
  });

  // Front mountains
  const ms2 = (scrollX * .4) % (W + 200);
  mts.filter(m => m.layer === 1).forEach(m => {
    const mx = ((m.x - ms2) + W + 200) % (W + 200) - 100;
    c.fillStyle = bpFor('mt2');
    c.beginPath(); c.moveTo(mx,groundY); c.lineTo(mx+70,groundY-m.h); c.lineTo(mx+140,groundY); c.closePath(); c.fill();
  });

  // Ground
  const gg = c.createLinearGradient(0, groundY, 0, H);
  gg.addColorStop(0, bpFor('gFill')); gg.addColorStop(1, bpFor('gDark'));
  c.fillStyle = gg; c.fillRect(0, groundY, W, H - groundY);
  c.fillStyle = bpFor('gTop'); c.fillRect(0, groundY, W, 5);

  if (bid === 'lava') drawLavaFlowOn(c, W, groundY);
  if (bid === 'ice')  drawIceCrystalsOn(c, W, groundY);

  const tw = 48, to = scrollX % tw;
  c.strokeStyle = bpFor('gLine'); c.lineWidth = 1;
  for (let tx = -to; tx < W; tx += tw) {
    c.beginPath(); c.moveTo(tx, groundY+5); c.lineTo(tx, H); c.stroke();
  }
}

// Sky-Hilfsfunktion für Offscreen-Canvas (vereinfacht, ohne globale ctx-Abhängigkeit)
function drawSkySwitchable(c, W, H, bid) {
  if (bid === 'lava') {
    stars.forEach(s => {
      const f = .3 + .7 * Math.abs(Math.sin(frame * .07 + s.b * 8));
      c.fillStyle = `rgba(255,${100 + Math.floor(s.b*100)},0,${f*.8})`;
      c.beginPath(); c.arc(s.x, s.y, s.r*1.3, 0, Math.PI*2); c.fill();
    });
    const pulse = 1 + Math.sin(frame * .03) * .06;
    const sg = c.createRadialGradient(W*.82,H*.12,2, W*.82,H*.12,36*pulse);
    sg.addColorStop(0,'#ffff80'); sg.addColorStop(.5,'#ff6600'); sg.addColorStop(1,'rgba(255,0,0,0)');
    c.fillStyle = sg; c.beginPath(); c.arc(W*.82, H*.12, 36*pulse, 0, Math.PI*2); c.fill();
    for (let i = 0; i < 4; i++) {
      const sx = ((scrollX * .15 + i * W * .28) % (W+100) + W+100) % (W+100) - 50;
      c.fillStyle = `rgba(40,20,10,${.15+i*.04})`;
      c.beginPath(); c.ellipse(sx, H*(.12+i*.06), 60+i*15, 18+i*5, 0, 0, Math.PI*2); c.fill();
    }
  } else if (bid === 'ice') {
    stars.forEach((s, i) => {
      const dx = ((s.x + scrollX * .03 + i * .7) % W + W) % W;
      const tw = .4 + .6 * Math.abs(Math.sin(frame * .04 + s.b * 7));
      c.fillStyle = `rgba(200,240,255,${tw*.8})`;
      c.beginPath(); c.arc(dx, s.y, s.r*1.1, 0, Math.PI*2); c.fill();
    });
    for (let i = 0; i < 3; i++) {
      const ay = H * (.08 + i * .07);
      const ag = c.createLinearGradient(0, ay, 0, ay+30);
      const hue = 160 + i * 30;
      ag.addColorStop(0,  `hsla(${hue},100%,70%,0)`);
      ag.addColorStop(.5, `hsla(${hue},100%,70%,${.08+i*.02})`);
      ag.addColorStop(1,  `hsla(${hue},100%,70%,0)`);
      c.fillStyle = ag;
      c.fillRect(Math.sin(frame * .02 + i * 1.5) * 20, ay, W, 30);
    }
  } else {
    stars.forEach(s => {
      const tw = .5 + .5 * Math.sin(frame * .05 + s.b * 10);
      c.fillStyle = `rgba(255,255,255,${tw*.9})`;
      c.beginPath(); c.arc(s.x, s.y, s.r, 0, Math.PI*2); c.fill();
    });
    c.fillStyle = '#fffde7'; c.beginPath(); c.arc(W*.85, H*.1, 28, 0, Math.PI*2); c.fill();
    c.fillStyle = '#ede8c8';
    c.beginPath(); c.arc(W*.85+8, H*.1-8, 6, 0, Math.PI*2); c.fill();
    c.beginPath(); c.arc(W*.85-10, H*.1+6, 4, 0, Math.PI*2); c.fill();
  }
}

function drawNightSky(W, H) {
  stars.forEach(s => {
    const tw = .5 + .5 * Math.sin(frame * .05 + s.b * 10);
    ctx.fillStyle = `rgba(255,255,255,${tw*.9})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
  });
  ctx.save();
  ctx.shadowColor = '#fffde7'; ctx.shadowBlur = 20;
  ctx.fillStyle = '#fffde7'; ctx.beginPath(); ctx.arc(W*.85, H*.1, 28, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ede8c8';
  ctx.beginPath(); ctx.arc(W*.85+8, H*.1-8, 6, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(W*.85-10, H*.1+6, 4, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawLavaSky(W, H) {
  stars.forEach(s => {
    const f = .3 + .7 * Math.abs(Math.sin(frame * .07 + s.b * 8));
    ctx.fillStyle = `rgba(255,${100 + Math.floor(s.b*100)},0,${f*.8})`;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r*1.3, 0, Math.PI*2); ctx.fill();
  });
  ctx.save();
  const pulse = 1 + Math.sin(frame * .03) * .06;
  ctx.shadowColor = '#ff3300'; ctx.shadowBlur = 40;
  const sg = ctx.createRadialGradient(W*.82,H*.12,2, W*.82,H*.12,36*pulse);
  sg.addColorStop(0,'#ffff80'); sg.addColorStop(.5,'#ff6600'); sg.addColorStop(1,'rgba(255,0,0,0)');
  ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(W*.82, H*.12, 36*pulse, 0, Math.PI*2); ctx.fill();
  ctx.restore();
  for (let i = 0; i < 4; i++) {
    const sx = ((scrollX * .15 + i * W * .28) % (W+100) + W+100) % (W+100) - 50;
    ctx.fillStyle = `rgba(40,20,10,${.15+i*.04})`;
    ctx.beginPath(); ctx.ellipse(sx, H*(.12+i*.06), 60+i*15, 18+i*5, 0, 0, Math.PI*2); ctx.fill();
  }
}

function drawIceSky(W, H) {
  stars.forEach((s, i) => {
    const dx = ((s.x + scrollX * .03 + i * .7) % W + W) % W;
    const tw = .4 + .6 * Math.abs(Math.sin(frame * .04 + s.b * 7));
    ctx.fillStyle = `rgba(200,240,255,${tw*.8})`;
    ctx.beginPath(); ctx.arc(dx, s.y, s.r*1.1, 0, Math.PI*2); ctx.fill();
  });
  for (let i = 0; i < 3; i++) {
    const ay = H * (.08 + i * .07);
    const ag = ctx.createLinearGradient(0, ay, 0, ay+30);
    const hue = 160 + i * 30;
    ag.addColorStop(0,  `hsla(${hue},100%,70%,0)`);
    ag.addColorStop(.5, `hsla(${hue},100%,70%,${.08+i*.02})`);
    ag.addColorStop(1,  `hsla(${hue},100%,70%,0)`);
    ctx.fillStyle = ag;
    ctx.fillRect(Math.sin(frame * .02 + i * 1.5) * 20, ay, W, 30);
  }
}

function drawVolcanoOn(c, x, groundY, h) {
  c.save();
  c.beginPath(); c.moveTo(x,groundY); c.lineTo(x+60,groundY-h); c.lineTo(x+80,groundY-h); c.lineTo(x+140,groundY); c.closePath(); c.fill();
  c.fillStyle = '#2a0500'; c.beginPath(); c.ellipse(x+70,groundY-h,20,8,0,0,Math.PI*2); c.fill();
  const kg = c.createRadialGradient(x+70,groundY-h,2, x+70,groundY-h,22);
  kg.addColorStop(0,'rgba(255,120,0,.8)'); kg.addColorStop(1,'rgba(255,0,0,0)');
  c.fillStyle = kg; c.beginPath(); c.ellipse(x+70,groundY-h,22,9,0,0,Math.PI*2); c.fill();
  c.restore();
}
function drawVolcano(x, groundY, h) {
  ctx.save(); ctx.fillStyle = bp('mt1'); drawVolcanoOn(ctx, x, groundY, h); ctx.restore();
}

function drawIcebergOn(c, x, groundY, h) {
  c.save();
  c.beginPath();
  c.moveTo(x,groundY); c.lineTo(x+30,groundY-h*.5); c.lineTo(x+55,groundY-h);
  c.lineTo(x+70,groundY-h*.85); c.lineTo(x+90,groundY-h*.6);
  c.lineTo(x+110,groundY-h*.4); c.lineTo(x+140,groundY);
  c.closePath(); c.fill();
  c.fillStyle = 'rgba(180,240,255,.2)';
  c.beginPath(); c.moveTo(x+50,groundY-h); c.lineTo(x+60,groundY-h*.7); c.lineTo(x+40,groundY-h*.6); c.closePath(); c.fill();
  c.restore();
}
function drawIceberg(x, groundY, h) {
  ctx.save(); ctx.fillStyle = bp('mt1'); drawIcebergOn(ctx, x, groundY, h); ctx.restore();
}

function drawLavaFlowOn(c, W, groundY) {
  lavaOff = (lavaOff + 1.5) % 80;
  c.save();
  const lg = c.createLinearGradient(0, groundY-8, 0, groundY+8);
  lg.addColorStop(0,  'rgba(255,100,0,0)');
  lg.addColorStop(.4, 'rgba(255,80,0,.75)');
  lg.addColorStop(.6, 'rgba(255,120,0,.75)');
  lg.addColorStop(1,  'rgba(255,50,0,0)');
  c.fillStyle = lg;
  c.beginPath(); c.moveTo(0, groundY-2);
  for (let tx = 0; tx <= W; tx += 20) c.lineTo(tx, groundY-4 + Math.sin((tx + lavaOff) * .08) * 4);
  c.lineTo(W, groundY+6); c.lineTo(0, groundY+6); c.closePath(); c.fill();
  c.restore();
}
function drawLavaFlow(W, groundY) { drawLavaFlowOn(ctx, W, groundY); }

function drawIceCrystalsOn(c, W, groundY) {
  c.save();
  c.fillStyle = 'rgba(126,232,250,.55)';
  const sp = 38, off = scrollX % sp;
  for (let tx = -off; tx < W; tx += sp) {
    const h = 6 + Math.sin(tx * .13) * 3;
    c.beginPath(); c.moveTo(tx,groundY); c.lineTo(tx+4,groundY-h); c.lineTo(tx+8,groundY); c.closePath(); c.fill();
  }
  c.restore();
}
function drawIceCrystals(W, groundY) { drawIceCrystalsOn(ctx, W, groundY); }

// ─── Biome border (Übergangsanimation) ───────────────────────
function drawBiomeBorder(lx, H) {
  const prevB = BIOMES[biomeTransition.prevId];
  const nextB = BIOMES[biomeTransition.nextId];

  // Breiter Leucht-Streifen links des alten Bioms
  const glowLeft = ctx.createLinearGradient(lx - 60, 0, lx, 0);
  glowLeft.addColorStop(0,   'rgba(255,255,255,0)');
  glowLeft.addColorStop(1,   `${prevB.gTop}88`);
  ctx.fillStyle = glowLeft;
  ctx.fillRect(lx - 60, 0, 60, H);

  // Breiter Leucht-Streifen rechts des neuen Bioms
  const glowRight = ctx.createLinearGradient(lx, 0, lx + 60, 0);
  glowRight.addColorStop(0,   `${nextB.gTop}88`);
  glowRight.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = glowRight;
  ctx.fillRect(lx, 0, 60, H);

  // Hauptlinie – zackig animiert
  ctx.save();
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur  = 18;
  ctx.lineWidth   = 3;
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0,   prevB.gTop);
  grad.addColorStop(0.5, '#ffffff');
  grad.addColorStop(1,   nextB.gTop);
  ctx.strokeStyle = grad;
  ctx.beginPath();
  const segments = 20;
  for (let i = 0; i <= segments; i++) {
    const y    = (i / segments) * H;
    const wobble = Math.sin(frame * .12 + i * 0.9) * 6;
    if (i === 0) ctx.moveTo(lx + wobble, y);
    else         ctx.lineTo(lx + wobble, y);
  }
  ctx.stroke();
  ctx.restore();

  // Energie-Funken entlang der Linie
  if (frame % 2 === 0) {
    const fy = Math.random() * H;
    addPart(lx + (Math.random() - .5) * 8, fy,
      (Math.random() - .5) * 4, (Math.random() - .5) * 3 - 1,
      Math.random() * 4 + 2, Math.random() < .5 ? prevB.gTop : nextB.gTop, 28);
  }

  // Label-Banner an der Linie
  const labelY = H * 0.15;
  ctx.save();
  ctx.font = 'bold 16px system-ui';
  const text = `${prevB.label}  ➜  ${nextB.label}`;
  const tw   = ctx.measureText(text).width;
  const bx   = lx - tw / 2 - 12;
  const by   = labelY - 20;
  ctx.fillStyle = 'rgba(0,0,0,.6)';
  rr(ctx, bx, by, tw + 24, 34, 8); ctx.fill();
  ctx.strokeStyle = '#ffffff44'; ctx.lineWidth = 1;
  rr(ctx, bx, by, tw + 24, 34, 8); ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, bx + 12, labelY + 4);
  ctx.restore();
}

// ─── Main loop ───────────────────────────────────────────────
function loop() {
  if (!gameRunning) return;
  const W = canvas.width, H = canvas.height;
  frame++;
  scrollX += speed;

  if (frame % 600 === 0) {
    level++;
    speed = BASE_SPEED + (level - 1) * 0.6;
    levelEl.textContent = level;
    const nb = biomeForLevel(level);
    if (nb !== biomeId) startBiomeTransition(nb);
  }

  // Biom-Übergang: Grenzlinie nach links bewegen
  if (biomeTransition.active) {
    biomeTransition.lineX -= biomeTransition.speed;
    if (biomeTransition.lineX < -40) {
      biomeTransition.active = false;
    }
  }

  const si = Math.max(55, 120 - level * 5);
  if (frame % si       === 0) spawnObstacle(W, H);
  if (frame % (si+20)  === 0) spawnPlatform(W, H);
  if (frame % 90       === 0) spawnCollectible(W, H);

  if (biomeId === 'lava' && frame % 3 === 0)
    obstacles.filter(o => o.type === 'fireball').forEach(o => spawnFire(o.x+o.w/2, o.y+o.h/2));
  if (biomeId === 'lava' && frame % 5 === 0)
    obstacles.filter(o => o.type === 'lavarock').forEach(o => spawnFire(o.x+o.w/2, o.y+o.h));
  if (biomeId === 'ice'  && frame % 6 === 0)
    obstacles.filter(o => o.type === 'icespike').forEach(o => spawnIceDust(o.x+o.w/2, o.y));
  if (biomeId === 'ice'  && frame % 4 === 0)
    obstacles.filter(o => o.type === 'freezewind').forEach(o => spawnIceDust(o.x+o.w/2, o.y+o.h/2));
  if (biomeId === 'night' && frame % 8 === 0)
    obstacles.filter(o => o.type === 'ghost').forEach(o =>
      addPart(o.x+o.w/2, o.y+o.h/2, (Math.random()-.5)*2, -Math.random()*1.5, Math.random()*4+2, 'rgba(160,180,255,.6)', 30));

  platforms.forEach(p => { p.x -= speed; });
  platforms = platforms.filter(p => p.x + p.w > -10);

  obstacles.forEach(ob => {
    ob.x -= ob.spd;
    if (ob.type === 'fireball' || ob.type === 'freezewind') {
      ob.y += Math.sin(frame * .06 + ob.phase) * 1.5;
    }
    if (ob.type === 'bat') {
      // Leichtes Tracking in Y-Richtung auf die Katze
      const dy = (cat.y + CAT_H / 2) - (ob.y + ob.h / 2);
      ob.y += Math.sign(dy) * Math.min(Math.abs(dy) * 0.04, 1.2);
    }
    if (ob.type === 'ghost') {
      // Sinusförmig auf die Katze zuschnappen
      ob.y += Math.sin(frame * .09 + ob.phase) * 1.8;
      const dy = (cat.y + CAT_H / 2) - (ob.y + ob.h / 2);
      ob.y += Math.sign(dy) * 0.5;
    }
    if (ob.type === 'lavarock') {
      // Rollt am Boden, leichte Hüpfer
      ob.y += Math.abs(Math.sin(frame * .12 + ob.phase)) * 2.5 - 1.2;
    }
    ob.at++;
    if (ob.at > 4) { ob.af++; ob.at = 0; }
  });
  obstacles = obstacles.filter(ob => ob.x + ob.w > -10);

  collectibles.forEach(c => { c.x -= speed; c.bob += .06; c.y += Math.sin(c.bob) * .5; });
  collectibles = collectibles.filter(c => !c.done && c.x + c.w > -10);

  if (invincible) { invTimer--; if (invTimer <= 0) invincible = false; }

  cat.update(W, H);

  if (!invincible) {
    for (const ob of obstacles) {
      if (overlap(cat.hitbox, { x: ob.x+4, y: ob.y+2, w: ob.w-8, h: ob.h-4 })) {
        lives--;
        spawnHit(cat.x + CAT_W/2, cat.y + CAT_H/2);
        invincible = true; invTimer = 120;
        cat.vy = JUMP_FORCE * 0.6;
        updateHUD();
        if (lives <= 0) { endGame(); return; }
        break;
      }
    }
  }

  collectibles.forEach(c => {
    if (!c.done && overlap(cat.hitbox, { x: c.x, y: c.y, w: c.w, h: c.h })) {
      c.done = true; score += 1; sessionFish++;
      spawnCollect(c.x + c.w/2, c.y + c.h/2);
      scoreEl.textContent = score;
    }
  });

  particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .15; p.life--; });
  particles = particles.filter(p => p.life > 0);

  // ── Render ─────────────────────────────────────────────────
  if (biomeTransition.active) {
    const lx = biomeTransition.lineX;

    // 1) Altes Biom (links der Grenzlinie) auf Haupt-Canvas zeichnen
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, lx, H); ctx.clip();
    // Hintergrund des alten Bioms mit gespeicherter biomeId rendern
    // biomeId ist bereits auf nextId gesetzt – prevId temporär verwenden
    const savedId = biomeId;
    biomeId = biomeTransition.prevId;
    drawBg(W, H);
    platforms.forEach(p  => drawPlatform(p));
    obstacles.forEach(ob => drawObstacle(ob));
    collectibles.forEach(c => { if (!c.done) drawFish(c.x, c.y, c.w, c.h); });
    biomeId = savedId;
    ctx.restore();

    // 2) Neues Biom (rechts der Grenzlinie) auf Offscreen-Canvas rendern
    const oc  = biomeTransition.offCtx;
    const oCV = biomeTransition.offCanvas;
    oc.clearRect(0, 0, W, H);
    drawBg(W, H, oc, biomeTransition.nextId, biomeTransition.nextMountains);

    // 2b) Objekte auf Offscreen zeichnen (nur rechts sichtbar, Clipping über main ctx)
    ctx.save();
    ctx.beginPath(); ctx.rect(lx, 0, W - lx, H); ctx.clip();
    ctx.drawImage(oCV, 0, 0);
    platforms.forEach(p  => drawPlatform(p));
    obstacles.forEach(ob => drawObstacle(ob));
    collectibles.forEach(c => { if (!c.done) drawFish(c.x, c.y, c.w, c.h); });
    ctx.restore();

    // 3) Partikel + Katze ohne Clipping (immer sichtbar)
    particles.forEach(p => {
      const a = p.life / p.maxLife;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * a, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    });
    drawCatCtx(ctx, cat.x, cat.y, cat.af, cat.left, invincible, currentSkin);

    // 4) Animierte Grenzlinie zeichnen
    drawBiomeBorder(lx, H);

  } else {
    // Normaler Render ohne Übergang
    drawBg(W, H);
    platforms.forEach(p  => drawPlatform(p));
    obstacles.forEach(ob => drawObstacle(ob));
    collectibles.forEach(c => { if (!c.done) drawFish(c.x, c.y, c.w, c.h); });

    particles.forEach(p => {
      const a = p.life / p.maxLife;
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * a, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    });

    drawCatCtx(ctx, cat.x, cat.y, cat.af, cat.left, invincible, currentSkin);
  }

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.35)';
  ctx.font = 'bold 13px system-ui';
  ctx.fillText(`Lv.${level}  ${BIOMES[biomeId].label}`, 12, H - 12);
  ctx.restore();

  requestAnimationFrame(loop);
}

function endGame() {
  gameRunning = false;

  // Fische + Score ins localStorage schreiben
  const prev = loadSave();
  const newTotalFish = prev.totalFish + sessionFish;
  const newHighscore = Math.max(prev.highscore, score);
  writeSave(newHighscore, newTotalFish);
  saveData = { highscore: newHighscore, totalFish: newTotalFish };

  // Freischalt-Nachrichten prüfen
  let msg = '';
  SKINS.forEach((sk, i) => {
    if (i === 0) return;
    const wasLocked = prev.totalFish < sk.unlockFish;
    const nowUnlocked = newTotalFish >= sk.unlockFish;
    if (wasLocked && nowUnlocked) msg += `🎉 ${sk.name}-Skin freigeschaltet! `;
  });
  unlockMsgEl.textContent = msg;

  finalScoreEl.textContent = score;
  finalFishEl.textContent  = sessionFish;
  goBestScoreEl.textContent = newHighscore;

  refreshSaveUI();
  showScreen('game-over-screen');
}

// ─── Boot ─────────────────────────────────────────────────────
refreshSaveUI();
showScreen('start-screen');













