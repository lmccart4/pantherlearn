// src/lib/heroPack.js
// "Hero Pack" — superhero & creature inspired classes
// Self-registers draw functions into pixelArt registry
// Import this file once (e.g. in avatar.jsx) to activate the pack

import { registerClassDraw, px, drawHead } from "./pixelArt";

// ═══════════════════════════════════════
// HERO PACK CLASS DEFINITIONS
// ═══════════════════════════════════════
export const HERO_CLASSES = {
  techforger: {
    id: "techforger", name: "Techforger", icon: "🤖", pack: "hero",
    description: "Armored genius with repulsor technology",
    unlockLevel: 4,
    color: { robe: "#a02020", robeMid: "#c03030", robeDark: "#701010", robeLight: "#e04040", accent: "#f0c848" },
    abilities: { passive: "Arc Reactor — +15% XP from perfect lesson scores", active: "Repulsor Blast — Deal 4 damage on next correct answer (5 question cooldown)" },
  },
  stormcaller: {
    id: "stormcaller", name: "Stormcaller", icon: "⛈️", pack: "hero",
    description: "Thunder god wielding an enchanted hammer",
    unlockLevel: 11,
    color: { robe: "#3848a0", robeMid: "#4858b8", robeDark: "#202870", robeLight: "#6080d0", accent: "#f0c848" },
    abilities: { passive: "Worthy — Streak bonuses are 50% more effective", active: "Thunder Strike — All teams deal +2 damage for 1 question (6 question cooldown)" },
  },
  razorfang: {
    id: "razorfang", name: "Razorfang", icon: "🐺", pack: "hero",
    description: "Feral fighter with indestructible claws",
    unlockLevel: 13,
    color: { robe: "#c0a020", robeMid: "#d8b830", robeDark: "#806810", robeLight: "#f0d848", accent: "#303030" },
    abilities: { passive: "Regeneration — Heal 1 class HP every 5 questions", active: "Berserker Slash — Triple damage but take 1 class HP damage (3 question cooldown)" },
  },
  titan: {
    id: "titan", name: "Titan", icon: "💪", pack: "hero",
    description: "Unstoppable green powerhouse of pure rage",
    unlockLevel: 23,
    color: { robe: "#408030", robeMid: "#509840", robeDark: "#285020", robeLight: "#70c050", accent: "#806040" },
    abilities: { passive: "Rage Build — Each consecutive correct answer deals +1 more damage (resets on wrong)", active: "Smash — Deal 6 damage, ignores boss armor (8 question cooldown)" },
  },
  nightprowler: {
    id: "nightprowler", name: "Nightprowler", icon: "😈", pack: "hero",
    description: "Fearless vigilante who fights without sight",
    unlockLevel: 14,
    color: { robe: "#a02028", robeMid: "#c03038", robeDark: "#701018", robeLight: "#e04850", accent: "#a02028" },
    abilities: { passive: "Radar Sense — See hint for every other question automatically", active: "Pressure Point — Stun boss, preventing counterattack for 2 questions (5 question cooldown)" },
  },
  paragon: {
    id: "paragon", name: "Paragon", icon: "🦸", pack: "hero",
    description: "Invulnerable hero of truth and justice",
    unlockLevel: 25,
    color: { robe: "#2848a0", robeMid: "#3860c0", robeDark: "#183070", robeLight: "#5080e0", accent: "#c03030" },
    abilities: { passive: "Invulnerable — Class takes 50% less counterattack damage (rounded down)", active: "Solar Flare — Heal full class HP to max (10 question cooldown)" },
  },
  shadowknight: {
    id: "shadowknight", name: "Shadowknight", icon: "🦇", pack: "hero",
    description: "Dark armored detective who strikes from shadows",
    unlockLevel: 27,
    color: { robe: "#282838", robeMid: "#383848", robeDark: "#181820", robeLight: "#484860", accent: "#f0c848" },
    abilities: { passive: "Prepared — Start each boss battle with a free shield charge", active: "Smoke Bomb — Team is immune to counterattack for 2 questions (6 question cooldown)" },
  },
  tempest: {
    id: "tempest", name: "Tempest", icon: "🌩️", pack: "hero",
    description: "Weather controller with power over wind and lightning",
    unlockLevel: 16,
    color: { robe: "#e0e0f0", robeMid: "#f0f0ff", robeDark: "#b0b0c8", robeLight: "#ffffff", accent: "#6090e0" },
    abilities: { passive: "Wind Shield — 25% chance to deflect counterattack damage to boss", active: "Hurricane — Deal 2 damage to boss for each teammate who answered correctly this round (4 question cooldown)" },
  },
  blinker: {
    id: "blinker", name: "Blinker", icon: "💨", pack: "hero",
    description: "Teleporting acrobat with a devilish tail",
    unlockLevel: 17,
    color: { robe: "#2828a0", robeMid: "#3838c0", robeDark: "#181870", robeLight: "#5050e0", accent: "#c03030" },
    abilities: { passive: "Teleport — Dodge counterattack entirely on correct answers", active: "Bamf Strike — Teleport behind boss, guaranteed crit on next answer (4 question cooldown)" },
  },
  webslinger: {
    id: "webslinger", name: "Webslinger", icon: "🕷️", pack: "hero",
    description: "Wisecracking acrobat who swings between buildings",
    unlockLevel: 6,
    color: { robe: "#a02020", robeMid: "#c03030", robeDark: "#701010", robeLight: "#e04040", accent: "#2040a0" },
    abilities: { passive: "Spider Sense — Preview next question's category before answering", active: "Web Trap — Boss can't attack for 3 questions (6 question cooldown)" },
  },
  shellstrike: {
    id: "shellstrike", name: "Shellstrike", icon: "🐢", pack: "hero",
    description: "Masked mutant warrior trained in ancient combat arts",
    unlockLevel: 7,
    color: { robe: "#308030", robeMid: "#409840", robeDark: "#206020", robeLight: "#50b850", accent: "#c07020" },
    abilities: { passive: "Shell Defense — Take 1 less counterattack damage (min 0)", active: "Cowabunga — Deal double damage and heal 1 class HP on correct answer (5 question cooldown)" },
  },
  sparkpaw: {
    id: "sparkpaw", name: "Sparkpaw", icon: "⚡", pack: "hero",
    description: "Tiny electric creature with shocking power",
    unlockLevel: 9,
    color: { robe: "#d0b020", robeMid: "#e0c830", robeDark: "#a08010", robeLight: "#f0e040", accent: "#c03020" },
    abilities: { passive: "Static — Correct answers have 20% chance to deal +2 bonus damage", active: "Thunderbolt — Deal 5 damage (4 question cooldown)" },
  },
  blazewing: {
    id: "blazewing", name: "Blazewing", icon: "🔥", pack: "hero",
    description: "Fearsome winged fire beast",
    unlockLevel: 33,
    color: { robe: "#d06020", robeMid: "#e07830", robeDark: "#a04010", robeLight: "#f09040", accent: "#f0c030" },
    abilities: { passive: "Flame Body — Wrong answers against you deal 1 damage back to boss", active: "Fire Blast — Deal 4 damage and burn boss for 1 per question for 3 questions (7 question cooldown)" },
  },
  thornbeast: {
    id: "thornbeast", name: "Thornbeast", icon: "🌿", pack: "hero",
    description: "Ancient plant beast with regenerating vines",
    unlockLevel: 19,
    color: { robe: "#307848", robeMid: "#409858", robeDark: "#205030", robeLight: "#50b868", accent: "#d04060" },
    abilities: { passive: "Overgrowth — Heal 1 class HP every 4 questions", active: "Solar Beam — Charge for 1 question, then deal 8 damage (6 question cooldown)" },
  },
  tidalshell: {
    id: "tidalshell", name: "Tidalshell", icon: "🌊", pack: "hero",
    description: "Armored water fortress with twin cannons",
    unlockLevel: 21,
    color: { robe: "#3060a0", robeMid: "#4078c0", robeDark: "#204070", robeLight: "#6098e0", accent: "#e0e0f0" },
    abilities: { passive: "Torrent — Deal +2 bonus damage when class HP is below 50%", active: "Hydro Pump — Deal 5 damage and push boss back 1 phase (6 question cooldown)" },
  },
};

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════
function heroBody(ctx, cl, by, hw, yS, yE) {
  for (let y = yS; y <= yE; y++) for (let x = 24-hw; x <= 23+hw; x++) {
    let c=cl.robe; if(x<24-hw+2)c=cl.robeDark; else if(x>23+hw-2)c=cl.robeLight;
    px(ctx,x,y+by,c);
  }
}

// ═══════════════════════════════════════
// DRAW FUNCTIONS — BATCH 1
// ═══════════════════════════════════════

function drawTechforger(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=15;x<=32;x++)px(ctx,x,46,"#0004");
  heroBody(ctx,cl,by,6,22,40);
  const pulse=f%6<3?1:0;
  px(ctx,23,28+by,"#60d0ff");px(ctx,24,28+by,"#60d0ff");px(ctx,23,29+by,"#80e0ff");px(ctx,24,29+by,"#80e0ff");
  if(pulse){px(ctx,22,28+by,"#60d0ff60");px(ctx,25,29+by,"#60d0ff60");}
  for(let x=18;x<=29;x++)px(ctx,x,34+by,cl.accent);
  for(let x=18;x<=29;x++)px(ctx,x,22+by,cl.accent);
  for(let y=40;y<=44;y++){for(let x=18;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=29;x++)px(ctx,x,y+by,cl.robeDark);}
  for(let x=17;x<=23;x++)px(ctx,x,44+by,cl.accent);for(let x=24;x<=30;x++)px(ctx,x,44+by,cl.accent);
  for(let y=23;y<=36;y++){px(ctx,14,y+by,cl.robeDark);px(ctx,15,y+by,cl.robe);px(ctx,32,y+by,cl.robe);px(ctx,33,y+by,cl.robeLight);}
  px(ctx,13,36+by,"#60d0ff");px(ctx,14,37+by,"#60d0ff80");px(ctx,34,36+by,"#60d0ff");px(ctx,33,37+by,"#60d0ff80");
  for(let x=17;x<=30;x++)for(let y=4;y<=19;y++){let c=cl.robe;if(y<=6)c=cl.robeLight;else if(x<=18||x>=29)c=cl.robeDark;px(ctx,x,y+by,c);}
  for(let x=19;x<=28;x++)for(let y=9;y<=16;y++)px(ctx,x,y+by,cl.accent);
  for(let x=19;x<=22;x++)px(ctx,x,12+by,"#fff");for(let x=25;x<=28;x++)px(ctx,x,12+by,"#fff");
  for(let x=20;x<=27;x++)px(ctx,x,4+by,cl.robeLight);
  if(L>=7){px(ctx,23,3+by,"#60d0ff");px(ctx,24,3+by,"#60d0ff");}
}

function drawStormcaller(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=14;x<=33;x++)px(ctx,x,46,"#0004");
  for(let y=20+by;y<=44+by;y++){const s=Math.floor((y-20)*.25);px(ctx,12-s,y,"#a02020");px(ctx,35+s,y,"#a02020");}
  heroBody(ctx,cl,by,7,22,40);
  px(ctx,21,26+by,"#c0c0d0");px(ctx,22,26+by,"#c0c0d0");px(ctx,25,26+by,"#c0c0d0");px(ctx,26,26+by,"#c0c0d0");
  for(let x=17;x<=30;x++)px(ctx,x,34+by,cl.accent);
  for(let y=35;y<=44;y++){for(let x=18;x<=22;x++)px(ctx,x,y+by,cl.robe);for(let x=25;x<=29;x++)px(ctx,x,y+by,cl.robe);}
  for(let x=17;x<=23;x++)px(ctx,x,44+by,cl.robeDark);for(let x=24;x<=30;x++)px(ctx,x,44+by,cl.robeDark);
  for(let y=23;y<=36;y++){px(ctx,14,y+by,cl.robeDark);px(ctx,15,y+by,cl.robe);px(ctx,32,y+by,cl.robe);px(ctx,33,y+by,cl.robeLight);}
  px(ctx,14,37+by,sk.base);px(ctx,15,37+by,sk.base);px(ctx,32,37+by,sk.base);px(ctx,33,37+by,sk.base);
  for(let y=10;y<=38;y++)px(ctx,36,y+by,"#7a5a18");
  for(let x=34;x<=39;x++)for(let y=8;y<=14;y++)px(ctx,x,y+by,"#808898");
  px(ctx,35,8+by,"#a0a8b8");px(ctx,38,8+by,"#a0a8b8");
  if(L>=7){px(ctx,36,7+by,"#60d0ff80");px(ctx,37,7+by,"#60d0ff60");}
  drawHead(ctx,sk,hr,ey,L,by,f,sp);
  for(let x=17;x<=30;x++)px(ctx,x,5+by,cl.robeDark);for(let x=18;x<=29;x++)px(ctx,x,4+by,cl.robe);
  px(ctx,15,6+by,"#fff");px(ctx,14,5+by,"#fff");px(ctx,13,4+by,"#fff");
  px(ctx,32,6+by,"#fff");px(ctx,33,5+by,"#fff");px(ctx,34,4+by,"#fff");
}

function drawRazorfang(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  for(let y=22;y<=40;y++){for(let x=18;x<=29;x++){let c=cl.robe;if(x<=19||x>=28)c=cl.accent;px(ctx,x,y+by,c);}}
  for(let x=18;x<=29;x++)px(ctx,x,34+by,cl.accent);px(ctx,23,34+by,cl.robe);px(ctx,24,34+by,cl.robe);
  for(let y=40;y<=44;y++){for(let x=18;x<=22;x++)px(ctx,x,y+by,cl.accent);for(let x=25;x<=29;x++)px(ctx,x,y+by,cl.accent);}
  for(let y=23;y<=35;y++){px(ctx,15,y+by,cl.accent);px(ctx,16,y+by,cl.robe);px(ctx,31,y+by,cl.robe);px(ctx,32,y+by,cl.accent);}
  px(ctx,14,36+by,sk.base);px(ctx,15,36+by,sk.base);px(ctx,32,36+by,sk.base);px(ctx,33,36+by,sk.base);
  for(let i=0;i<3;i++){for(let y=30;y<=40;y++){px(ctx,11+i*2,y+by,"#c0c0d8");px(ctx,34+i*2,y+by,"#c0c0d8");}px(ctx,11+i*2,29+by,"#e0e0f0");px(ctx,34+i*2,29+by,"#e0e0f0");}
  drawHead(ctx,sk,hr,ey,L,by,f,sp);
  for(let i=0;i<5;i++){const x=17+i*3;px(ctx,x,2+by,hr.base);px(ctx,x,1+by,hr.hi);px(ctx,x+1,3+by,hr.mid);}
  px(ctx,17,4+by,cl.accent);px(ctx,16,3+by,cl.accent);px(ctx,15,2+by,cl.accent);
  px(ctx,30,4+by,cl.accent);px(ctx,31,3+by,cl.accent);px(ctx,32,2+by,cl.accent);
}

function drawTitan(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=12;x<=35;x++)px(ctx,x,46,"#0004");
  for(let y=20;y<=40;y++){for(let x=15;x<=32;x++){let c=cl.robe;if(x<=16)c=cl.robeDark;else if(x>=31)c=cl.robeLight;px(ctx,x,y+by,c);}}
  for(let y=36;y<=44;y++){for(let x=16;x<=22;x++)px(ctx,x,y+by,"#806040");for(let x=25;x<=31;x++)px(ctx,x,y+by,"#806040");if(y===36){px(ctx,16,y+by,cl.robe);px(ctx,22,y+by,cl.robe);px(ctx,25,y+by,cl.robe);px(ctx,31,y+by,cl.robe);}}
  for(let y=21;y<=38;y++){px(ctx,11,y+by,cl.robeDark);px(ctx,12,y+by,cl.robe);px(ctx,13,y+by,cl.robe);px(ctx,34,y+by,cl.robe);px(ctx,35,y+by,cl.robe);px(ctx,36,y+by,cl.robeLight);}
  for(let x=10;x<=14;x++)for(let y=38;y<=40;y++)px(ctx,x,y+by,cl.robeLight);
  for(let x=33;x<=37;x++)for(let y=38;y<=40;y++)px(ctx,x,y+by,cl.robeLight);
  for(let x=19;x<=28;x++)for(let y=8;y<=19;y++){let c=cl.robe;if(y<=9)c=cl.robeLight;else if(y>=18)c=cl.robeDark;px(ctx,x,y+by,c);}
  for(let x=20;x<=22;x++)px(ctx,x,13+by,"#fff");for(let x=25;x<=27;x++)px(ctx,x,13+by,"#fff");
  px(ctx,21,14+by,"#000");px(ctx,26,14+by,"#000");
  px(ctx,20,12+by,cl.robeDark);px(ctx,21,11+by,cl.robeDark);px(ctx,22,12+by,cl.robeDark);
  px(ctx,25,12+by,cl.robeDark);px(ctx,26,11+by,cl.robeDark);px(ctx,27,12+by,cl.robeDark);
  px(ctx,22,17+by,cl.robeDark);px(ctx,23,17+by,cl.robeDark);px(ctx,24,17+by,cl.robeDark);px(ctx,25,17+by,cl.robeDark);
  for(let x=18;x<=29;x++)for(let y=6;y<=9;y++)px(ctx,x,y+by,hr.base);
}

function drawNightprowler(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  heroBody(ctx,cl,by,5,22,42);
  for(let y=38;y<=44;y++){for(let x=19;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=28;x++)px(ctx,x,y+by,cl.robeDark);}
  for(let y=23;y<=35;y++){px(ctx,16,y+by,cl.robeDark);px(ctx,17,y+by,cl.robe);px(ctx,30,y+by,cl.robe);px(ctx,31,y+by,cl.robeLight);}
  px(ctx,15,36+by,sk.base);px(ctx,16,36+by,sk.base);px(ctx,31,36+by,sk.base);px(ctx,32,36+by,sk.base);
  for(let y=16;y<=38;y++)px(ctx,34,y+by,"#808080");px(ctx,34,15+by,"#a0a0a0");
  drawHead(ctx,sk,hr,ey,L,by,f,sp);
  for(let x=18;x<=29;x++)for(let y=10;y<=14;y++)px(ctx,x,y+by,cl.robe);
  px(ctx,19,7+by,cl.robe);px(ctx,28,7+by,cl.robe);px(ctx,19,6+by,cl.robeLight);px(ctx,28,6+by,cl.robeLight);
}

function drawParagon(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=14;x<=33;x++)px(ctx,x,46,"#0004");
  for(let y=20+by;y<=44+by;y++){const s=Math.floor((y-20)*.3);px(ctx,12-s,y,cl.accent);px(ctx,35+s,y,cl.accent);}
  heroBody(ctx,cl,by,7,22,40);
  px(ctx,23,26+by,cl.accent);px(ctx,24,26+by,cl.accent);
  px(ctx,22,27+by,cl.accent);px(ctx,23,27+by,"#f0c848");px(ctx,24,27+by,"#f0c848");px(ctx,25,27+by,cl.accent);
  px(ctx,23,28+by,cl.accent);px(ctx,24,28+by,cl.accent);
  for(let x=17;x<=30;x++)px(ctx,x,34+by,cl.accent);
  for(let y=35;y<=44;y++){for(let x=18;x<=22;x++)px(ctx,x,y+by,cl.robe);for(let x=25;x<=29;x++)px(ctx,x,y+by,cl.robe);}
  for(let x=17;x<=23;x++)px(ctx,x,44+by,cl.accent);for(let x=24;x<=30;x++)px(ctx,x,44+by,cl.accent);
  for(let y=23;y<=36;y++){px(ctx,14,y+by,cl.robeDark);px(ctx,15,y+by,cl.robe);px(ctx,32,y+by,cl.robe);px(ctx,33,y+by,cl.robeLight);}
  px(ctx,14,37+by,sk.base);px(ctx,15,37+by,sk.base);px(ctx,32,37+by,sk.base);px(ctx,33,37+by,sk.base);
  drawHead(ctx,sk,hr,ey,L,by,f,sp);
  px(ctx,22,4+by,hr.base);px(ctx,23,3+by,hr.hi);px(ctx,24,4+by,hr.base);
}

function drawShadowknight(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=14;x<=33;x++)px(ctx,x,46,"#0004");
  for(let y=18+by;y<=44+by;y++){const s=Math.floor((y-18)*.35);for(let x=12-s;x<=13;x++)if(x>=4)px(ctx,x,y,cl.robeDark);for(let x=34;x<=35+s;x++)if(x<=43)px(ctx,x,y,cl.robeDark);}
  for(let i=0;i<4;i++){px(ctx,6+i*3,44+by,cl.robe);px(ctx,36+i*3,44+by,cl.robe);}
  heroBody(ctx,cl,by,6,22,40);
  px(ctx,21,27+by,cl.accent);px(ctx,22,26+by,cl.accent);px(ctx,23,27+by,cl.accent);px(ctx,24,27+by,cl.accent);px(ctx,25,26+by,cl.accent);px(ctx,26,27+by,cl.accent);
  for(let x=18;x<=29;x++)px(ctx,x,34+by,cl.accent);px(ctx,20,35+by,cl.accent);px(ctx,23,35+by,cl.accent);px(ctx,27,35+by,cl.accent);
  for(let y=36;y<=44;y++){for(let x=18;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=29;x++)px(ctx,x,y+by,cl.robeDark);}
  for(let y=23;y<=36;y++){px(ctx,15,y+by,cl.robeDark);px(ctx,16,y+by,cl.robe);px(ctx,31,y+by,cl.robe);px(ctx,32,y+by,cl.robeLight);}
  for(let x=14;x<=16;x++)for(let y=32;y<=36;y++)px(ctx,x,y+by,cl.robe);px(ctx,13,33+by,cl.robe);px(ctx,12,34+by,cl.robe);
  for(let x=17;x<=30;x++)for(let y=5;y<=19;y++){let c=cl.robeDark;if(y>=11&&y<=15&&x>=20&&x<=27)continue;px(ctx,x,y+by,c);}
  for(let x=20;x<=27;x++)for(let y=11;y<=15;y++)px(ctx,x,y+by,sk.base);
  for(let x=21;x<=23;x++)px(ctx,x,12+by,"#fff");for(let x=25;x<=27;x++)px(ctx,x,12+by,"#fff");
  px(ctx,18,4+by,cl.robeDark);px(ctx,18,3+by,cl.robeDark);px(ctx,18,2+by,cl.robe);
  px(ctx,29,4+by,cl.robeDark);px(ctx,29,3+by,cl.robeDark);px(ctx,29,2+by,cl.robe);
}

function drawTempest(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=14;x<=33;x++)px(ctx,x,46,"#0004");
  for(let y=20+by;y<=44+by;y++){const s=Math.floor((y-20)*.25);px(ctx,13-s,y,cl.robeDark);px(ctx,34+s,y,cl.robeDark);}
  heroBody(ctx,cl,by,5,22,42);
  px(ctx,23,27+by,cl.accent);px(ctx,22,28+by,cl.accent);px(ctx,23,29+by,cl.accent);px(ctx,24,28+by,cl.accent);
  for(let x=19;x<=28;x++)px(ctx,x,34+by,cl.accent);
  for(let y=36;y<=44;y++){for(let x=19;x<=22;x++)px(ctx,x,y+by,cl.robe);for(let x=25;x<=28;x++)px(ctx,x,y+by,cl.robe);}
  for(let y=23;y<=35;y++){px(ctx,16,y+by,cl.robeDark);px(ctx,17,y+by,cl.robe);px(ctx,30,y+by,cl.robe);px(ctx,31,y+by,cl.robeLight);}
  const lf=f%4;px(ctx,14,36+by,"#60d0ff");px(ctx,15,35+by,"#80e0ff");px(ctx,33,36+by,"#60d0ff");px(ctx,32,35+by,"#80e0ff");
  if(lf<2){px(ctx,13,37+by,"#60d0ff80");px(ctx,34,37+by,"#60d0ff80");}
  drawHead(ctx,sk,{base:"#d0d0e0",hi:"#e8e8f0",mid:"#b8b8c8",sh:"#9898a8",br:"#ffffff"},ey,L,by,f,sp);
  for(let x=18;x<=29;x++)px(ctx,x,7+by,cl.accent);px(ctx,23,6+by,cl.accent);px(ctx,24,6+by,"#fff");
}

// ═══════════════════════════════════════
// REGISTER BATCH 1
// ═══════════════════════════════════════
registerClassDraw("techforger", drawTechforger);
registerClassDraw("stormcaller", drawStormcaller);
registerClassDraw("razorfang", drawRazorfang);
registerClassDraw("titan", drawTitan);
registerClassDraw("nightprowler", drawNightprowler);
registerClassDraw("paragon", drawParagon);
registerClassDraw("shadowknight", drawShadowknight);
registerClassDraw("tempest", drawTempest);
