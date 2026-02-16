// src/lib/pixelArt.js
// Pure canvas drawing functions for pixel art characters and pets.
// No React dependency — used by PixelAvatar component.

function px(ctx, x, y, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, 1, 1);
}

// ═══════════════════════════════════════
// MAIN ENTRY — draws any class
// Optional accessories object: { accessory: "cape_royal", power: "aura_fire" }
// ═══════════════════════════════════════

// Registry for class draw functions — packs register here
export const classDrawFns = {};

export function registerClassDraw(classId, fn) {
  classDrawFns[classId] = fn;
}

export function drawCharacter(ctx, cls, sk, hr, ey, cl, L, f, accessories) {
  ctx.clearRect(0, 0, 80, 48);
  const by = f % 4 < 2 ? 0 : 1;
  const sp = f % 8 < 5;
  const gl = f % 6 < 3;

  // Offset everything by 16px so character is centered in 80-wide canvas
  // Wings/accessories can extend into the 16px margins on each side
  ctx.save();
  ctx.translate(16, 0);

  // Draw aura BEHIND character
  if (accessories?.power) drawPower(ctx, accessories.power, cl, by, f);

  // Draw back accessory BEHIND character (capes/wings)
  if (accessories?.accessory) drawAccessory(ctx, accessories.accessory, cl, by, f);

  const args = [ctx, sk, hr, ey, cl, L, by, f, sp, gl];

  // Check registry first (hero packs etc), then built-in classes
  if (classDrawFns[cls]) classDrawFns[cls](...args);
  else if (cls === "warrior") drawWarrior(...args);
  else if (cls === "ranger") drawRanger(...args);
  else if (cls === "healer") drawHealer(...args);
  else if (cls === "rogue") drawRogue(...args);
  else drawMage(...args);

  ctx.restore();
}

// Expose shared drawing helpers for packs
export { px, drawHead };

// ═══════════════════════════════════════
// SHARED HEAD
// ═══════════════════════════════════════
function drawHead(ctx, sk, hr, ey, L, by, f, sp) {
  const h = by;
  // Outline
  for (let x = 18; x <= 29; x++) { px(ctx, x, 6+h, sk.dk); px(ctx, x, 19+h, sk.dk); }
  for (let y = 7; y <= 18; y++) { px(ctx, 17, y+h, sk.dk); px(ctx, 30, y+h, sk.dk); }
  px(ctx, 18, 18+h, sk.dk); px(ctx, 29, 18+h, sk.dk);
  // Fill
  for (let y = 7; y <= 18; y++)
    for (let x = 18; x <= 29; x++) {
      let c = sk.base;
      if (y<=8) c=sk.hi; else if (y>=17) c=sk.sh;
      else if (x<=19||x>=28) c=sk.mid;
      else if (y<=10&&x>=22&&x<=25) c=sk.hi;
      px(ctx, x, y+h, c);
    }
  // Eyes white
  for (let x=19;x<=22;x++) for (let y=11;y<=14;y++) px(ctx,x,y+h,"#fff");
  for (let x=25;x<=28;x++) for (let y=11;y<=14;y++) px(ctx,x,y+h,"#fff");
  // Iris
  px(ctx,20,12+h,ey.iris);px(ctx,21,12+h,ey.irisLight);
  px(ctx,20,13+h,ey.iris);px(ctx,21,13+h,ey.pupil);
  px(ctx,26,12+h,ey.iris);px(ctx,27,12+h,ey.irisLight);
  px(ctx,26,13+h,ey.iris);px(ctx,27,13+h,ey.pupil);
  if (sp) { px(ctx,20,11+h,"#fff"); px(ctx,26,11+h,"#fff"); }
  // Lid line
  for (let x=19;x<=22;x++) px(ctx,x,10+h,sk.dk);
  for (let x=25;x<=28;x++) px(ctx,x,10+h,sk.dk);
  // Brows
  px(ctx,19,9+h,hr.sh);px(ctx,20,9+h,hr.base);px(ctx,21,9+h,hr.base);
  px(ctx,26,9+h,hr.base);px(ctx,27,9+h,hr.base);px(ctx,28,9+h,hr.sh);
  // Nose+mouth
  px(ctx,23,15+h,sk.sh);px(ctx,24,15+h,sk.hi);
  px(ctx,22,17+h,"#c08070");px(ctx,23,17+h,"#d09080");px(ctx,24,17+h,"#d09080");px(ctx,25,17+h,"#c08070");
  px(ctx,19,15+h,"#ff888825");px(ctx,28,15+h,"#ff888825");
  // Hair top
  for (let x=16;x<=31;x++) for (let y=2;y<=8;y++) {
    let c=hr.base; if(y<=3)c=hr.hi; else if(y===4&&x>=20&&x<=27)c=hr.br;
    else if(x<=18||x>=29)c=hr.sh; else if(y>=7)c=hr.mid;
    px(ctx,x,y+h,c);
  }
  // Hair sides
  for (let y=8;y<=22;y++) {
    const fd=Math.min(1,(y-8)/12);
    px(ctx,16,y+h,fd>.6?hr.sh:hr.mid);px(ctx,17,y+h,hr.base);
    px(ctx,30,y+h,hr.base);px(ctx,31,y+h,fd>.6?hr.sh:hr.mid);
  }
  px(ctx,17,10+h,hr.hi);px(ctx,17,14+h,hr.hi);px(ctx,30,12+h,hr.hi);px(ctx,30,16+h,hr.hi);
  for (let x=18;x<=21;x++) px(ctx,x,8+h,hr.base);
  for (let x=26;x<=29;x++) px(ctx,x,8+h,hr.base);
}

// ═══════════════════════════════════════
// MAGE
// ═══════════════════════════════════════
function drawMage(ctx, sk, hr, ey, cl, L, by, f, sp, gl) {
  const {robe:rc,robeLight:rl,robeDark:rd,robeMid:rm,accent:ac}=cl;
  // Shadow
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  for(let x=18;x<=29;x++)px(ctx,x,47,"#0003");
  // Cape L>=5
  if(L>=5){for(let y=22+by;y<=44+by;y++){const s=Math.floor((y-22)*.3);for(let x=14-s;x<=15;x++)if(x>=10)px(ctx,x,y,rd);for(let x=32;x<=33+s;x++)if(x<=37)px(ctx,x,y,rd);}for(let y=24+by;y<=42+by;y++){px(ctx,15,y,rm+"80");px(ctx,32,y,rm+"80");}}
  // Robe
  for(let y=24;y<=44;y++){const p2=(y-24)/20;const hw=Math.floor(3+p2*7);for(let x=24-hw;x<=23+hw;x++){let c=rc;if(x<24-hw+2)c=rd;else if(x>23+hw-2)c=rm;else if(x===23||x===24)c=rd+"c0";px(ctx,x,y+by,c);}}
  // Folds
  for(let y=28+by;y<=42+by;y+=3){px(ctx,20,y,rl+"40");px(ctx,27,y,rl+"40");}
  if(L>=3)for(let x=16;x<=31;x++)px(ctx,x,44+by,ac);
  if(L>=7){px(ctx,21,36+by,rl+"50");px(ctx,26,38+by,rl+"50");px(ctx,23,40+by,rl+"30");}
  // Belt
  for(let x=17;x<=30;x++)px(ctx,x,33+by,ac);px(ctx,23,33+by,"#fff");px(ctx,24,33+by,"#fff");
  if(L>=5){px(ctx,20,33+by,rl);px(ctx,27,33+by,rl);}
  // Pauldrons L>=7
  if(L>=7){for(let x=12;x<=16;x++)for(let y=21;y<=23;y++)px(ctx,x,y+by,rm);px(ctx,14,21+by,ac);px(ctx,15,22+by,rl);for(let x=31;x<=35;x++)for(let y=21;y<=23;y++)px(ctx,x,y+by,rm);px(ctx,33,21+by,ac);px(ctx,32,22+by,rl);}
  // Arms
  for(let y=24;y<=35;y++){px(ctx,14,y+by,rd);px(ctx,15,y+by,rc);px(ctx,32,y+by,rc);px(ctx,33,y+by,rm);}
  px(ctx,14,36+by,sk.base);px(ctx,15,36+by,sk.base);px(ctx,14,37+by,sk.sh);
  px(ctx,32,36+by,sk.base);px(ctx,33,36+by,sk.base);px(ctx,33,37+by,sk.sh);
  // Staff
  for(let y=4;y<=42;y++)px(ctx,35,y+by,"#7a5a18");px(ctx,35,4+by,"#a08030");
  const gf=gl?0:1;
  px(ctx,34,3+by-gf,rl);px(ctx,35,2+by-gf,"#fff");px(ctx,36,3+by-gf,rl);px(ctx,35,4+by-gf,rc);px(ctx,34,4+by-gf,rm);px(ctx,36,4+by-gf,rm);
  if(L>=3){px(ctx,33,3+by-gf,rl+"50");px(ctx,37,3+by-gf,rl+"50");}
  if(L>=7){px(ctx,35,1+by-gf,rl+"40");px(ctx,33,2+by-gf,rl+"30");px(ctx,37,2+by-gf,rl+"30");}
  if(L>=10){px(ctx,32,4+by-gf,rl+"20");px(ctx,38,4+by-gf,rl+"20");px(ctx,35,0+by-gf,"#fff4");const ax=16+Math.floor(Math.sin(f*.7)*4);const ay=10+Math.floor(Math.cos(f*.5)*3);px(ctx,ax,ay+by,rl+"60");px(ctx,31-ax+16,ay+5+by,rl+"40");}
  // Feet
  for(let x=17;x<=20;x++)px(ctx,x,44+by,rd);for(let x=27;x<=30;x++)px(ctx,x,44+by,rd);
  px(ctx,17,44+by,rm);px(ctx,27,44+by,rm);
  // Head
  drawHead(ctx,sk,hr,ey,L,by,f,sp);
  // Hat L>=3
  if(L>=3){
    for(let x=14;x<=33;x++)px(ctx,x,6+by,rc);for(let x=15;x<=32;x++)px(ctx,x,5+by,rm);
    for(let y=0;y<=4;y++){const hw=Math.max(1,Math.floor((4-y)*1.8));for(let x=24-hw;x<=23+hw;x++){let c=rc;if(x<24-hw+1)c=rd;else if(x>23+hw-1)c=rl;px(ctx,x,y+by,c);}}
    px(ctx,23,0+by,rm);for(let x=18;x<=29;x++)px(ctx,x,4+by,ac);
    if(L>=7){px(ctx,23,2+by,"#fff");px(ctx,22,3+by,rl);px(ctx,24,3+by,rl);}
    if(L>=10){px(ctx,20,0+by,ac);px(ctx,27,0+by,ac);px(ctx,23,-1+by,"#fff");}
  }
}

// ═══════════════════════════════════════
// WARRIOR
// ═══════════════════════════════════════
function drawWarrior(ctx, sk, hr, ey, cl, L, by, f, sp, gl) {
  const {robe:rc,robeLight:rl,robeDark:rd,robeMid:rm,accent:ac}=cl;
  for(let x=14;x<=33;x++)px(ctx,x,46,"#0004");
  // Cape L>=7
  if(L>=7){for(let y=20+by;y<=42+by;y++){const s=Math.floor((y-20)*.2);px(ctx,10-s,y,"#a02020");px(ctx,37+s,y,"#a02020");}}
  // Legs wide
  for(let y=38;y<=44;y++){for(let x=16;x<=20;x++)px(ctx,x,y+by,rd);for(let x=27;x<=31;x++)px(ctx,x,y+by,rd);}
  for(let x=15;x<=21;x++)px(ctx,x,44+by,L>=3?"#6a5020":"#505060");
  for(let x=26;x<=32;x++)px(ctx,x,44+by,L>=3?"#6a5020":"#505060");
  // Torso WIDE
  for(let y=22;y<=37;y++)for(let x=16;x<=31;x++){let c=rc;if(x<=17)c=rd;else if(x>=30)c=rl;else if(x>=22&&x<=25)c=rm;px(ctx,x,y+by,c);}
  for(let y=24;y<=30;y++){px(ctx,22,y+by,rl);px(ctx,23,y+by,rl+"c0");}
  for(let x=16;x<=31;x++)px(ctx,x,34+by,"#6a5020");px(ctx,23,34+by,ac);px(ctx,24,34+by,ac);
  if(L>=3)for(let x=16;x<=31;x++)px(ctx,x,23+by,ac+"80");
  if(L>=5){px(ctx,22,27+by,ac);px(ctx,23,26+by,ac);px(ctx,24,27+by,ac);px(ctx,23,28+by,ac);}
  // Broad shoulders
  for(let x=11;x<=15;x++)for(let y=20;y<=24;y++)px(ctx,x,y+by,rm);
  for(let x=32;x<=36;x++)for(let y=20;y<=24;y++)px(ctx,x,y+by,rm);
  px(ctx,13,21+by,ac);px(ctx,34,21+by,ac);
  // Arms
  for(let y=25;y<=35;y++){px(ctx,13,y+by,rd);px(ctx,14,y+by,rc);px(ctx,33,y+by,rc);px(ctx,34,y+by,rm);}
  // Gauntlets
  for(let x=12;x<=15;x++)for(let y=35;y<=37;y++)px(ctx,x,y+by,L>=5?ac:"#606068");
  for(let x=32;x<=35;x++)for(let y=35;y<=37;y++)px(ctx,x,y+by,L>=5?ac:"#606068");
  // Sword
  for(let y=2;y<=34;y++)px(ctx,36,y+by,"#c0c0d8");px(ctx,36,2+by,"#e8e8f0");px(ctx,35,2+by,"#e0e0f0");px(ctx,37,2+by,"#e0e0f0");
  for(let x=34;x<=38;x++)px(ctx,x,30+by,"#8a6a20");px(ctx,36,31+by,"#6a5020");
  if(L>=7){px(ctx,35,4+by,"#fff4");px(ctx,37,4+by,"#fff4");}
  // Shield
  for(let x=8;x<=14;x++)for(let y=26;y<=36;y++){let c="#506080";if(x===8||x===14||y===26||y===36)c="#384060";if(x===11&&y>=29&&y<=33)c=L>=5?ac:"#607090";px(ctx,x,y+by,c);}
  px(ctx,11,31+by,L>=3?ac:"#708090");
  if(L>=7){px(ctx,10,30+by,ac);px(ctx,12,30+by,ac);px(ctx,11,29+by,ac);px(ctx,11,31+by,"#fff");}
  // Head or Helmet
  if(L>=5){
    for(let x=16;x<=31;x++)for(let y=4;y<=18;y++){let c=rc;if(y<=5||y>=17)c=rd;else if(x<=17||x>=30)c=rd;else if(y<=7)c=rl;else if(x>=20&&x<=27&&y===12)continue;px(ctx,x,y+by,c);}
    for(let x=20;x<=27;x++)px(ctx,x,12+by,"#000");
    if(L>=7){for(let y=1;y<=6;y++){px(ctx,23,y+by,"#c03030");px(ctx,24,y+by,"#e04040");}}
    if(L>=10){px(ctx,21,3+by,ac);px(ctx,23,2+by,ac);px(ctx,24,2+by,"#fff");px(ctx,26,3+by,ac);}
    for(let x=17;x<=30;x++)px(ctx,x,4+by,ac+"60");
  } else {
    drawHead(ctx,sk,hr,ey,L,by,f,sp);
  }
}

// ═══════════════════════════════════════
// RANGER
// ═══════════════════════════════════════
function drawRanger(ctx, sk, hr, ey, cl, L, by, f, sp, gl) {
  const rc="#2a6838",rl="#40a058",rd="#1a4828",rm="#308848",ac="#d4a040";
  for(let x=17;x<=30;x++)px(ctx,x,46,"#0004");
  // Cloak
  if(L>=3){for(let y=18+by;y<=44+by;y++){const s=Math.floor((y-18)*.25);for(let x=13-s;x<=14;x++)if(x>=8)px(ctx,x,y,rd);for(let x=33;x<=34+s;x++)if(x<=39)px(ctx,x,y,rd);}}
  // Quiver
  for(let y=18;y<=32;y++)px(ctx,34,y+by,"#6a5020");px(ctx,33,18+by,"#a08030");px(ctx,35,18+by,"#a08030");px(ctx,34,17+by,"#c0c0d0");px(ctx,33,17+by,"#c0c0d0");
  // Leather tunic
  for(let y=22;y<=40;y++){const hw=Math.floor(3+(y-22)*.25);for(let x=24-hw;x<=23+hw;x++){let c="#8a6a40";if(x<24-hw+1)c="#6a5030";else if(x>23+hw-1)c="#a08050";px(ctx,x,y+by,c);}}
  // Green vest
  for(let y=22;y<=32;y++)for(let x=19;x<=28;x++){let c=rc;if(x<=20)c=rd;else if(x>=27)c=rm;px(ctx,x,y+by,c);}
  // Belt
  for(let x=18;x<=29;x++)px(ctx,x,32+by,"#6a5020");px(ctx,23,32+by,ac);px(ctx,24,32+by,ac);
  if(L>=3){px(ctx,19,33+by,"#6a5020");px(ctx,20,33+by,"#7a6030");px(ctx,28,33+by,"#6a5020");px(ctx,27,33+by,"#7a6030");}
  // Legs
  for(let y=34;y<=43;y++){for(let x=19;x<=22;x++)px(ctx,x,y+by,"#6a5030");for(let x=25;x<=28;x++)px(ctx,x,y+by,"#6a5030");}
  for(let x=18;x<=23;x++)px(ctx,x,44+by,"#5a4020");for(let x=24;x<=29;x++)px(ctx,x,44+by,"#5a4020");
  // Arms
  for(let y=23;y<=34;y++){px(ctx,15,y+by,"#6a5030");px(ctx,16,y+by,"#8a6a40");px(ctx,31,y+by,"#8a6a40");px(ctx,32,y+by,"#a08050");}
  if(L>=5)for(let y=30;y<=33;y++){px(ctx,15,y+by,rc);px(ctx,32,y+by,rc);}
  px(ctx,15,35+by,sk.base);px(ctx,16,35+by,sk.base);px(ctx,31,35+by,sk.base);px(ctx,32,35+by,sk.base);
  // Bow
  for(let y=14;y<=40;y++)px(ctx,13,y+by,"#6a5020");px(ctx,13,14+by,"#8a6a30");px(ctx,13,40+by,"#8a6a30");
  for(let y=16;y<=38;y++)px(ctx,12,y+by,"#c0b8a0");
  if(L>=3){px(ctx,11,26+by,"#a08030");px(ctx,10,26+by,"#c0c0d0");}
  // Leaf emblem L>=5
  if(L>=5){px(ctx,23,26+by,rl);px(ctx,24,25+by,rl);px(ctx,24,27+by,rl);px(ctx,25,26+by,rl);}
  // Head
  drawHead(ctx,sk,hr,ey,L,by,f,sp);
  // Hood L>=3
  if(L>=3){
    for(let x=15;x<=32;x++)for(let y=3;y<=9;y++){let c=rc;if(y<=4)c=rd;else if(x<=16||x>=31)c=rd;else if(y<=6&&x>=20&&x<=27)c=rl;px(ctx,x,y+by,c);}
    for(let y=10;y<=16;y++){px(ctx,15,y+by,rd);px(ctx,16,y+by,rc);px(ctx,31,y+by,rc);px(ctx,32,y+by,rd);}
    if(L>=7){px(ctx,28,3+by,"#40a058");px(ctx,29,2+by,"#60c070");px(ctx,29,1+by,"#80e088");}
  }
}

// ═══════════════════════════════════════
// HEALER
// ═══════════════════════════════════════
function drawHealer(ctx, sk, hr, ey, cl, L, by, f, sp, gl) {
  const rc="#d0c8b0",rl="#f0ece0",rd="#a8a090",rm="#e0d8c8",ac="#40c880";
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  // Robe flowing
  for(let y=22;y<=44;y++){const p2=(y-22)/22;const hw=Math.floor(3+p2*8);for(let x=24-hw;x<=23+hw;x++){let c=rc;if(x<24-hw+2)c=rd;else if(x>23+hw-2)c=rl;else if(x===23||x===24)c=rd+"a0";else if(y>=40)c=rm;px(ctx,x,y+by,c);}}
  // Sash
  for(let x=17;x<=30;x++)px(ctx,x,30+by,(x>=22&&x<=25)?ac:ac+"80");
  px(ctx,23,30+by,"#60e8a0");px(ctx,24,30+by,"#60e8a0");
  for(let x=15;x<=32;x++)px(ctx,x,44+by,ac);
  // Cross
  px(ctx,23,26+by,ac);px(ctx,24,26+by,ac);px(ctx,22,27+by,ac);px(ctx,23,27+by,"#60e8a0");px(ctx,24,27+by,"#60e8a0");px(ctx,25,27+by,ac);px(ctx,23,28+by,ac);px(ctx,24,28+by,ac);
  if(L>=5)for(let y=32;y<=42;y+=3){px(ctx,19,y+by,ac+"50");px(ctx,28,y+by,ac+"50");}
  // Sleeves
  for(let y=23;y<=36;y++){const sw=y>30?2:1;for(let dx=0;dx<sw;dx++){px(ctx,14-dx,y+by,rc);px(ctx,33+dx,y+by,rm);}}
  px(ctx,12,36+by,sk.base);px(ctx,13,36+by,sk.base);px(ctx,14,36+by,sk.base);
  px(ctx,33,36+by,sk.base);px(ctx,34,36+by,sk.base);px(ctx,35,36+by,sk.base);
  // Book
  for(let x=9;x<=13;x++)for(let y=33;y<=39;y++){let c=L>=5?"#40a068":"#5028a8";if(x===9||x===13||y===33||y===39)c=ac;px(ctx,x,y+by,c);}
  px(ctx,10,35+by,"#f8f0e0");px(ctx,11,35+by,"#f8f0e0");px(ctx,12,35+by,"#f8f0e0");
  // Healing staff
  for(let y=8;y<=40;y++)px(ctx,36,y+by,"#a08830");
  px(ctx,35,8+by,ac);px(ctx,36,7+by,ac);px(ctx,37,8+by,ac);px(ctx,36,9+by,ac);
  if(L>=3){px(ctx,36,6+by,ac+"60");px(ctx,34,8+by,ac+"40");px(ctx,38,8+by,ac+"40");}
  if(L>=7){px(ctx,36,5+by,"#80ffc040");px(ctx,35,7+by,"#80ffc030");px(ctx,37,7+by,"#80ffc030");}
  // Halo L>=7
  if(L>=7){const ho=gl?0:1;for(let x=19;x<=28;x++)px(ctx,x,3+by-ho,ac+"90");px(ctx,18,4+by-ho,ac+"60");px(ctx,29,4+by-ho,ac+"60");px(ctx,23,2+by-ho,"#80ffc0");px(ctx,24,2+by-ho,"#80ffc0");}
  if(L>=10){const ax=17+Math.floor(Math.sin(f*.6)*3);const ay=15+Math.floor(Math.cos(f*.4)*4);px(ctx,ax,ay+by,ac+"50");px(ctx,30-ax+17,ay+8+by,ac+"30");}
  // Head
  drawHead(ctx,sk,hr,ey,L,by,f,sp);
  if(L>=3){for(let x=18;x<=29;x++)px(ctx,x,8+by,ac+"60");px(ctx,23,8+by,ac);px(ctx,24,8+by,"#80ffc0");}
}

// ═══════════════════════════════════════
// ROGUE
// ═══════════════════════════════════════
function drawRogue(ctx, sk, hr, ey, cl, L, by, f, sp, gl) {
  const rc="#303040",rl="#484858",rd="#1a1a28",rm="#404050",ac="#e04040";
  for(let x=17;x<=30;x++)px(ctx,x,46,"#0004");
  // Scarf
  if(L>=3){for(let y=18+by;y<=38+by;y++){const s=Math.floor((y-18)*.15);px(ctx,12-s,y,rd);px(ctx,35+s,y,rd);}}
  // Fitted body SLIM
  for(let y=22;y<=37;y++){const hw=Math.floor(3+(y-22)*.15);for(let x=24-hw;x<=23+hw;x++){let c=rc;if(x<24-hw+1)c=rd;else if(x>23+hw-1)c=rm;px(ctx,x,y+by,c);}}
  // Cross straps
  for(let i=0;i<6;i++){px(ctx,20+i,24+i+by,rd);px(ctx,27-i,24+i+by,rd);}
  if(L>=3)for(let x=20;x<=27;x++)px(ctx,x,23+by,ac+"80");
  // Fitted legs
  for(let y=38;y<=43;y++){for(let x=19;x<=22;x++)px(ctx,x,y+by,rd);for(let x=25;x<=28;x++)px(ctx,x,y+by,rd);}
  for(let x=18;x<=23;x++)px(ctx,x,44+by,"#181820");for(let x=24;x<=29;x++)px(ctx,x,44+by,"#181820");
  // Belt
  for(let x=18;x<=29;x++)px(ctx,x,33+by,"#4a3020");px(ctx,23,33+by,ac);px(ctx,24,33+by,ac);
  if(L>=3){px(ctx,19,34+by,"#3a2818");px(ctx,20,34+by,"#4a3020");px(ctx,27,34+by,"#3a2818");px(ctx,28,34+by,"#4a3020");}
  // Arms
  for(let y=23;y<=34;y++){px(ctx,15,y+by,rd);px(ctx,16,y+by,rc);px(ctx,31,y+by,rc);px(ctx,32,y+by,rm);}
  px(ctx,14,35+by,"#4a4050");px(ctx,15,35+by,sk.base);px(ctx,32,35+by,sk.base);px(ctx,33,35+by,"#4a4050");
  // Daggers
  for(let y=28;y<=38;y++){px(ctx,13,y+by,"#c0c0d8");px(ctx,34,y+by,"#c0c0d8");}
  px(ctx,13,27+by,"#e0e0f0");px(ctx,13,26+by,"#fff");px(ctx,34,27+by,"#e0e0f0");px(ctx,34,26+by,"#fff");
  if(L>=5){px(ctx,13,27+by,ac+"80");px(ctx,34,27+by,ac+"80");}
  if(L>=7){px(ctx,13,25+by,"#ff606040");px(ctx,34,25+by,"#ff606040");}
  if(L>=5){px(ctx,23,27+by,ac);px(ctx,24,27+by,ac);}
  if(L>=10){const sx=15+Math.floor(Math.sin(f*.9)*3);px(ctx,sx,20+by,rm+"40");px(ctx,32-sx+15,24+by,rm+"30");}
  // Head
  drawHead(ctx,sk,hr,ey,L,by,f,sp);
  // Hood
  for(let x=15;x<=32;x++)for(let y=3;y<=8;y++){let c=rc;if(y<=4)c=rd;else if(x<=16||x>=31)c=rd;else if(y<=5)c=rm;px(ctx,x,y+by,c);}
  for(let y=9;y<=14;y++){px(ctx,15,y+by,rd);px(ctx,16,y+by,rc);px(ctx,31,y+by,rc);px(ctx,32,y+by,rd);}
  if(L>=5){px(ctx,19,10+by,ac+"60");px(ctx,28,10+by,ac+"60");}
  if(L>=7){px(ctx,23,4+by,"#fff");px(ctx,24,4+by,"#fff");px(ctx,23,5+by,ac);px(ctx,24,5+by,ac);}
}

// ═══════════════════════════════════════
// PETS (36×36 canvas)
// ═══════════════════════════════════════
// Pet draw function registry — packs register here
export const petDrawFns = {};
export function registerPetDraw(petId, fn) { petDrawFns[petId] = fn; }

export function drawPet(ctx, petId, f) {
  ctx.clearRect(0, 0, 36, 36);
  const b = f % 4 < 2 ? 0 : 1;
  const fl = f % 3;
  // Check registry first (pet packs), then built-in
  if (petDrawFns[petId]) petDrawFns[petId](ctx, f, b, fl);
  else if (petId === "fire_spirit") drawFireSpirit(ctx, f, b, fl);
  else if (petId === "wolf") drawWolf(ctx, f, b);
  else if (petId === "owl") drawOwl(ctx, f, b);
  else if (petId === "drake") drawDrake(ctx, f, b, fl);
  else if (petId === "cat") drawCat(ctx, f, b);
  else if (petId === "phoenix") drawPhoenix(ctx, f, b, fl);
  else if (petId === "slime") drawSlime(ctx, f, b);
  else if (petId === "fairy") drawFairy(ctx, f, b, fl);
  else if (petId === "dragon") drawDragon(ctx, f, b, fl);
  else drawFireSpirit(ctx, f, b, fl); // fallback
}

function drawFireSpirit(ctx, f, b, fl) {
  for(let x=12;x<=24;x++)px(ctx,x,33,"#0003");
  const body=[[16,10],[17,10],[18,10],[19,10],[15,11],[16,11],[17,11],[18,11],[19,11],[20,11],[14,12],[15,12],[16,12],[17,12],[18,12],[19,12],[20,12],[21,12],[13,13],[14,13],[15,13],[16,13],[17,13],[18,13],[19,13],[20,13],[21,13],[22,13],[13,14],[14,14],[15,14],[16,14],[17,14],[18,14],[19,14],[20,14],[21,14],[22,14],[13,15],[14,15],[15,15],[16,15],[17,15],[18,15],[19,15],[20,15],[21,15],[22,15],[14,16],[15,16],[16,16],[17,16],[18,16],[19,16],[20,16],[21,16],[14,17],[15,17],[16,17],[17,17],[18,17],[19,17],[20,17],[21,17],[15,18],[16,18],[17,18],[18,18],[19,18],[20,18],[15,19],[16,19],[17,19],[18,19],[19,19],[20,19],[16,20],[17,20],[18,20],[19,20],[16,21],[17,21],[18,21],[19,21],[17,22],[18,22]];
  body.forEach(([x,y])=>px(ctx,x,y-b,"#e67e22"));
  [[16,12],[17,12],[18,12],[19,12],[15,13],[16,13],[17,13],[18,13],[19,13],[20,13],[15,14],[16,14],[17,14],[18,14],[19,14],[20,14],[16,15],[17,15],[18,15],[19,15],[16,16],[17,16],[18,16],[19,16],[17,17],[18,17]].forEach(([x,y])=>px(ctx,x,y-b,"#f39c12"));
  [[17,13],[18,13],[17,14],[18,14],[17,15],[18,15],[17,16],[18,16]].forEach(([x,y])=>px(ctx,x,y-b,"#ffed4a"));
  [[17,14],[18,14],[17,15],[18,15]].forEach(([x,y])=>px(ctx,x,y-b,"#fff8e0"));
  const tips=fl===0?[[17,8],[18,9],[16,9]]:fl===1?[[18,8],[17,9],[19,9]]:[[17,9],[18,8],[16,9],[19,9]];
  tips.forEach(([x,y])=>px(ctx,x,y-b,"#f39c12"));
  if(fl===0)px(ctx,17,7-b,"#ffed4a");if(fl===1)px(ctx,18,7-b,"#ffed4a");
  if(fl===2){px(ctx,17,8-b,"#ffed4a");px(ctx,18,7-b,"#fff8e0");}
  px(ctx,15,14-b,"#1a0505");px(ctx,16,14-b,"#1a0505");px(ctx,19,14-b,"#1a0505");px(ctx,20,14-b,"#1a0505");
  px(ctx,15,13-b,"#fff8");px(ctx,19,13-b,"#fff8");
  px(ctx,17,18-b,"#c06020");px(ctx,18,18-b,"#c06020");
  px(ctx,14,20-b,"#e67e2280");px(ctx,21,20-b,"#e67e2280");px(ctx,13,19-b,"#f39c1250");px(ctx,22,19-b,"#f39c1250");
}

function drawWolf(ctx, f, b) {
  for(let x=10;x<=26;x++)px(ctx,x,33,"#0003");
  for(let y=16;y<=24;y++)for(let x=10;x<=24;x++){let c="#808898";if(y<=17)c="#9098a8";else if(y>=23)c="#707888";if(x<=11)c="#606878";else if(x>=23)c="#9098a8";px(ctx,x,y-b,c);}
  for(let y=20;y<=23;y++)for(let x=14;x<=20;x++)px(ctx,x,y-b,"#a8b0c0");
  for(let y=12;y<=18;y++)for(let x=20;x<=28;x++){let c="#9098a8";if(y<=13)c="#a0a8b8";if(x>=27)c="#808898";px(ctx,x,y-b,c);}
  for(let x=27;x<=30;x++)for(let y=15;y<=17;y++)px(ctx,x,y-b,"#a0a8b8");
  px(ctx,30,16-b,"#303040");
  px(ctx,24,14-b,"#f0c040");px(ctx,25,14-b,"#f0c040");px(ctx,24,15-b,"#000");px(ctx,25,15-b,"#806020");px(ctx,24,13-b,"#fff8");
  px(ctx,22,11-b,"#a0a8b8");px(ctx,23,10-b,"#b0b8c8");px(ctx,23,11-b,"#d8a0a0");px(ctx,26,11-b,"#a0a8b8");px(ctx,26,10-b,"#b0b8c8");px(ctx,26,11-b,"#d8a0a0");
  for(let y=24;y<=29;y++){px(ctx,12,y-b,"#707888");px(ctx,13,y-b,"#808898");px(ctx,17,y-b,"#707888");px(ctx,18,y-b,"#808898");px(ctx,21,y-b,"#808898");px(ctx,22,y-b,"#707888");}
  for(let x=11;x<=14;x++)px(ctx,x,30-b,"#606878");for(let x=16;x<=19;x++)px(ctx,x,30-b,"#606878");for(let x=20;x<=23;x++)px(ctx,x,30-b,"#606878");
  px(ctx,8,16-b,"#9098a8");px(ctx,9,15-b,"#a0a8b8");px(ctx,9,16-b,"#9098a8");px(ctx,7,15-b,"#a0a8b8");px(ctx,7,14-b+(f%4<2?0:1),"#b0b8c8");
}

function drawOwl(ctx, f, b) {
  for(let x=12;x<=24;x++)px(ctx,x,33,"#0003");
  for(let y=14;y<=28;y++){const hw=Math.floor(3+((y-14)/14)*4);for(let x=18-hw;x<=18+hw;x++){let c="#a08050";if(y<=16)c="#b89060";else if(y>=26)c="#907040";if(x<=18-hw+1)c="#806030";px(ctx,x,y-b,c);}}
  for(let y=18;y<=26;y+=2)for(let x=15;x<=21;x+=2)px(ctx,x,y-b,"#c0a870");
  for(let y=8;y<=15;y++)for(let x=13;x<=23;x++){let c="#b89060";if(y<=9)c="#c0a870";if(x<=14||x>=22)c="#a08050";px(ctx,x,y-b,c);}
  for(let y=10;y<=14;y++)for(let x=14;x<=22;x++)px(ctx,x,y-b,"#d0b880");
  px(ctx,15,11-b,"#fff");px(ctx,16,11-b,"#f0d040");px(ctx,17,11-b,"#f0d040");px(ctx,19,11-b,"#fff");px(ctx,20,11-b,"#f0d040");px(ctx,21,11-b,"#f0d040");
  px(ctx,16,12-b,"#000");px(ctx,20,12-b,"#000");px(ctx,15,12-b,"#d0a020");px(ctx,17,12-b,"#d0a020");px(ctx,19,12-b,"#d0a020");px(ctx,21,12-b,"#d0a020");
  if(f%20===0){for(let x=15;x<=17;x++)px(ctx,x,11-b,"#a08050");for(let x=19;x<=21;x++)px(ctx,x,11-b,"#a08050");}
  px(ctx,17,13-b,"#d4a040");px(ctx,18,13-b,"#e8b850");px(ctx,19,13-b,"#d4a040");px(ctx,18,14-b,"#c09030");
  px(ctx,13,8-b,"#c0a870");px(ctx,12,7-b,"#b89060");px(ctx,12,6-b,"#a08050");
  px(ctx,23,8-b,"#c0a870");px(ctx,24,7-b,"#b89060");px(ctx,24,6-b,"#a08050");
  const wO=f%8<4;
  for(let y=16;y<=24;y++){px(ctx,12-(wO?1:0),y-b,"#907040");px(ctx,11-(wO?1:0),y-b,"#806030");px(ctx,24+(wO?1:0),y-b,"#907040");px(ctx,25+(wO?1:0),y-b,"#806030");}
  if(wO){px(ctx,10,18-b,"#a08050");px(ctx,26,18-b,"#a08050");}
  px(ctx,16,29-b,"#d4a040");px(ctx,17,29-b,"#d4a040");px(ctx,19,29-b,"#d4a040");px(ctx,20,29-b,"#d4a040");
}

function drawDrake(ctx, f, b, fl) {
  for(let x=10;x<=26;x++)px(ctx,x,33,"#0003");
  for(let y=16;y<=24;y++)for(let x=12;x<=24;x++){let c="#308848";if(y<=17)c="#409058";else if(y>=23)c="#287038";if(x<=13)c="#207030";px(ctx,x,y-b,c);}
  for(let y=19;y<=23;y++)for(let x=15;x<=21;x++)px(ctx,x,y-b,"#60c078");
  for(let y=17;y<=22;y+=2)for(let x=13;x<=23;x+=2)px(ctx,x,y-b,"#287038");
  for(let y=10;y<=17;y++)for(let x=20;x<=28;x++){let c="#409058";if(y<=11)c="#50a868";if(x>=27)c="#308040";px(ctx,x,y-b,c);}
  for(let x=27;x<=31;x++)for(let y=13;y<=15;y++)px(ctx,x,y-b,"#50a868");
  px(ctx,31,13-b,"#308040");px(ctx,31,15-b,"#308040");
  if(fl===0){px(ctx,32,14-b,"#f39c12");px(ctx,33,14-b,"#ffed4a");}
  px(ctx,23,12-b,"#ff4040");px(ctx,24,12-b,"#ff4040");px(ctx,23,13-b,"#a02020");px(ctx,24,13-b,"#cc3030");px(ctx,23,11-b,"#fff8");
  px(ctx,22,9-b,"#d4a040");px(ctx,22,8-b,"#e8b850");px(ctx,25,9-b,"#d4a040");px(ctx,25,8-b,"#e8b850");
  for(let x=14;x<=22;x+=2)px(ctx,x,15-b,"#287038");
  const wU=f%6<3;
  for(let y=12;y<=18;y++){px(ctx,10,y-b-(wU?1:0),"#40a060");px(ctx,11,y-b-(wU?1:0),"#308848");}
  px(ctx,9,12-b-(wU?2:0),"#50b870");px(ctx,9,13-b-(wU?2:0),"#40a060");
  if(wU)for(let y=13;y<=16;y++)px(ctx,8,y-b-2,"#40a06080");
  for(let y=24;y<=28;y++){px(ctx,14,y-b,"#287038");px(ctx,15,y-b,"#308848");px(ctx,20,y-b,"#308848");px(ctx,21,y-b,"#287038");}
  px(ctx,13,29-b,"#d4a040");px(ctx,14,29-b,"#d4a040");px(ctx,15,29-b,"#d4a040");px(ctx,19,29-b,"#d4a040");px(ctx,20,29-b,"#d4a040");px(ctx,21,29-b,"#d4a040");
  for(let i=0;i<6;i++){px(ctx,11-i,22+Math.floor(i*.5)-b,"#308848");px(ctx,11-i,23+Math.floor(i*.5)-b,"#287038");}
  px(ctx,5,24-b,"#d4a040");px(ctx,5,25-b,"#d4a040");
}

// ─── SHADOW CAT ───
function drawCat(ctx, f, b) {
  for(let x=12;x<=24;x++)px(ctx,x,33,"#0003");
  // Body — sleek
  for(let y=18;y<=26;y++)for(let x=13;x<=23;x++){
    const d=Math.sqrt((x-18)**2+((y-22)*1.4)**2);
    if(d<5.5){let c="#1a1828";if(d>4)c="#100e18";px(ctx,x,y-b,c);}
  }
  // Belly
  for(let y=22;y<=25;y++)for(let x=16;x<=20;x++)px(ctx,x,y-b,"#282838");
  // Head
  for(let y=10;y<=18;y++)for(let x=14;x<=22;x++){
    const d=Math.sqrt((x-18)**2+((y-14)*1.1)**2);
    if(d<4.5)px(ctx,x,y-b,"#1a1828");
  }
  // Ears — pointed
  px(ctx,14,9-b,"#1a1828");px(ctx,13,8-b,"#1a1828");px(ctx,13,7-b,"#100e18");
  px(ctx,22,9-b,"#1a1828");px(ctx,23,8-b,"#1a1828");px(ctx,23,7-b,"#100e18");
  // Inner ears
  px(ctx,14,8-b,"#403050");px(ctx,22,8-b,"#403050");
  // Glowing green eyes
  px(ctx,16,13-b,"#40c060");px(ctx,20,13-b,"#40c060");
  px(ctx,16,14-b,"#000");px(ctx,20,14-b,"#000");
  if(f%8<2){px(ctx,16,13-b,"#60e080");px(ctx,20,13-b,"#60e080");}
  // Nose
  px(ctx,18,15-b,"#403050");
  // Whiskers
  px(ctx,14,15-b,"#30283840");px(ctx,13,14-b,"#30283840");px(ctx,22,15-b,"#30283840");px(ctx,23,14-b,"#30283840");
  // Legs
  for(let y=26;y<=29;y++){px(ctx,14,y-b,"#100e18");px(ctx,15,y-b,"#100e18");px(ctx,21,y-b,"#100e18");px(ctx,22,y-b,"#100e18");}
  // Paws
  px(ctx,14,30-b,"#282838");px(ctx,15,30-b,"#282838");px(ctx,21,30-b,"#282838");px(ctx,22,30-b,"#282838");
  // Tail — curving up
  px(ctx,23,22-b,"#1a1828");px(ctx,24,21-b,"#1a1828");px(ctx,25,20-b,"#1a1828");
  px(ctx,26,19-b,"#100e18");px(ctx,26,18-b,"#1a1828");px(ctx,25,17-b,"#100e18");
}

// ─── PHOENIX ───
function drawPhoenix(ctx, f, b, fl) {
  // Fiery bird — no shadow, hovers
  // Body
  for(let y=14;y<=24;y++)for(let x=13;x<=23;x++){
    const d=Math.sqrt((x-18)**2+((y-19)*1.3)**2);
    if(d<5.5){let c="#e67e22";if(d>4)c="#c06018";else if(d<2.5)c="#f39c12";px(ctx,x,y-b,c);}
  }
  // Breast
  for(let y=18;y<=22;y++)for(let x=16;x<=20;x++)px(ctx,x,y-b,"#ffed4a");
  // Head
  for(let y=8;y<=14;y++)for(let x=15;x<=21;x++){
    const d=Math.sqrt((x-18)**2+((y-11)*1.2)**2);
    if(d<4){let c="#e67e22";if(d<2)c="#f39c12";px(ctx,x,y-b,c);}
  }
  // Crown feathers
  px(ctx,17,6-b,"#f39c12");px(ctx,18,5-b,"#ffed4a");px(ctx,19,6-b,"#f39c12");
  px(ctx,16,7-b,"#e67e22");px(ctx,20,7-b,"#e67e22");
  // Eyes
  px(ctx,16,10-b,"#fff");px(ctx,20,10-b,"#fff");px(ctx,16,11-b,"#c03030");px(ctx,20,11-b,"#c03030");
  // Beak
  px(ctx,22,11-b,"#d4a040");px(ctx,23,12-b,"#c09030");
  // Wings — flapping
  const wUp=f%6<3;
  for(let y=12;y<=22;y++){
    const w=Math.floor(Math.sin((y-12)/10*Math.PI)*(4+(wUp?2:0)));
    for(let x=13-w;x<=13;x++)if(x>=4){px(ctx,x,y-b,y%2===0?"#e67e22":"#c06018");}
    for(let x=23;x<=23+w;x++)if(x<=32){px(ctx,x,y-b,y%2===0?"#e67e22":"#c06018");}
  }
  // Wing tips glow
  if(wUp){px(ctx,6,16-b,"#ffed4a80");px(ctx,30,16-b,"#ffed4a80");}
  // Tail feathers
  for(let i=0;i<3;i++){
    const tx=16+i*2;
    for(let ty=24;ty<=30;ty++){
      const c=fl===i?"#ffed4a":"#e67e22";
      px(ctx,tx,ty-b,c);
    }
    px(ctx,tx,31-b,"#f39c1280");
  }
  // Fire particle trail
  if(f%4<2){px(ctx,14,26-b,"#ffed4a40");px(ctx,22,28-b,"#f39c1240");}
}

// ─── SLIME ───
function drawSlime(ctx, f, b) {
  for(let x=12;x<=24;x++)px(ctx,x,33,"#0003");
  // Wobble effect
  const wobble=Math.sin(f*.2)*1;
  // Body — jiggly blob
  for(let y=14;y<=28;y++)for(let x=12;x<=24;x++){
    const cy=21+wobble;
    const d=Math.sqrt(((x-18)*0.9)**2+((y-cy)*1.2)**2);
    if(d<7){
      if(d<2)px(ctx,x,y-b,"#80f0a0");
      else if(d<4)px(ctx,x,y-b,"#50c870");
      else if(d<6)px(ctx,x,y-b,"#30a050");
      else px(ctx,x,y-b,"#208838");
    }
  }
  // Shine highlight
  px(ctx,15,16-b,"#c0ffd880");px(ctx,16,15-b,"#c0ffd860");px(ctx,16,16-b,"#a0f0c040");
  // Eyes — cute round
  for(let x=15;x<=16;x++)for(let y=19;y<=21;y++)px(ctx,x,y-b,"#000");
  for(let x=20;x<=21;x++)for(let y=19;y<=21;y++)px(ctx,x,y-b,"#000");
  px(ctx,15,19-b,"#fff8");px(ctx,20,19-b,"#fff8");
  // Mouth
  px(ctx,17,23-b,"#208838");px(ctx,18,24-b,"#208838");px(ctx,19,23-b,"#208838");
  // Drip at base
  const drip=f%12;
  if(drip<6){px(ctx,14,28+Math.floor(drip/3)-b,"#30a05060");px(ctx,22,28+Math.floor(drip/2)-b,"#30a05040");}
}

// ─── FAIRY ───
function drawFairy(ctx, f, b, fl) {
  // Tiny floating creature
  const hover=Math.sin(f*.15)*1.5;
  const hy=Math.floor(hover);
  // Wings — translucent, fluttering
  const flutter=f%4<2;
  for(let y=10;y<=20;y++){
    const w=Math.floor(Math.sin((y-10)/10*Math.PI)*(3+(flutter?2:0)));
    for(let x=14-w;x<=14;x++)if(x>=6)px(ctx,x,y-b+hy,"#c0a0f040");
    for(let x=22;x<=22+w;x++)if(x<=30)px(ctx,x,y-b+hy,"#c0a0f040");
  }
  // Wing sparkle
  if(f%6<2){px(ctx,10,14-b+hy,"#fff6");px(ctx,26,14-b+hy,"#fff6");}
  // Body — tiny
  for(let y=12;y<=20;y++)for(let x=15;x<=21;x++){
    const d=Math.sqrt((x-18)**2+((y-16)*1.3)**2);
    if(d<4){
      if(d<1.5)px(ctx,x,y-b+hy,"#f0d0ff");
      else if(d<3)px(ctx,x,y-b+hy,"#d0a0e0");
      else px(ctx,x,y-b+hy,"#b080c0");
    }
  }
  // Face
  px(ctx,16,15-b+hy,"#2020a0");px(ctx,20,15-b+hy,"#2020a0");
  // Sparkle aura
  for(let i=0;i<4;i++){
    const a=f*.1+(i/4)*Math.PI*2;
    const r=6+Math.sin(f*.06+i)*2;
    const ox=18+Math.floor(Math.cos(a)*r);const oy=16+Math.floor(Math.sin(a)*r*0.8)-b+hy;
    if(ox>=0&&ox<36&&oy>=0&&oy<36)px(ctx,ox,oy,"#f0c0ff30");
  }
  // Pixie dust trail below
  for(let i=0;i<3;i++){
    const dy=22+i*3;const dx=16+Math.floor(Math.sin(f*.12+i*2)*2);
    px(ctx,dx,dy-b+hy,"#f0d06020");
  }
}

// ─── ELDER DRAGON ───
function drawDragon(ctx, f, b, fl) {
  for(let x=6;x<=30;x++)px(ctx,x,33,"#0003");
  // Wings — large
  const wUp=f%8<4;
  for(let y=6;y<=20;y++){
    const w=Math.floor(Math.sin((y-6)/14*Math.PI)*(5+(wUp?3:0)));
    for(let x=10-w;x<=10;x++)if(x>=0)px(ctx,x,y-b,"#702838");
    for(let x=26;x<=26+w;x++)if(x<=35)px(ctx,x,y-b,"#702838");
  }
  // Wing membrane
  if(wUp){for(let y=8;y<=16;y++){px(ctx,6,y-b,"#903848");px(ctx,30,y-b,"#903848");}}
  // Body — large
  for(let y=12;y<=26;y++)for(let x=10;x<=26;x++){
    const d=Math.sqrt(((x-18)*.85)**2+((y-19)*1.2)**2);
    if(d<7){let c="#802838";if(d>5)c="#601828";else if(d<3)c="#a03848";px(ctx,x,y-b,c);}
  }
  // Belly scales
  for(let y=16;y<=24;y++)for(let x=14;x<=22;x++){
    const d=Math.sqrt((x-18)**2+((y-20)*1.4)**2);
    if(d<4)px(ctx,x,y-b,"#d0a060");
  }
  // Head
  for(let x=16;x<=26;x++)for(let y=6;y<=14;y++){
    const d=Math.sqrt(((x-21)*.9)**2+((y-10)*1.1)**2);
    if(d<5){let c="#802838";if(d<2)c="#a03848";px(ctx,x,y-b,c);}
  }
  // Horns
  px(ctx,17,5-b,"#d4a040");px(ctx,16,4-b,"#e8b850");px(ctx,15,3-b,"#d4a040");
  px(ctx,24,5-b,"#d4a040");px(ctx,25,4-b,"#e8b850");px(ctx,26,3-b,"#d4a040");
  // Eyes
  px(ctx,19,9-b,"#ff4040");px(ctx,20,9-b,"#ff4040");px(ctx,23,9-b,"#ff4040");px(ctx,24,9-b,"#ff4040");
  px(ctx,19,10-b,"#a02020");px(ctx,24,10-b,"#a02020");
  // Snout
  for(let x=24;x<=28;x++)for(let y=10;y<=12;y++)px(ctx,x,y-b,"#903040");
  // Fire breath
  if(fl<1){px(ctx,29,11-b,"#e67e22");px(ctx,30,11-b,"#f39c12");px(ctx,31,10-b,"#ffed4a");}
  // Legs
  for(let y=24;y<=30;y++){px(ctx,12,y-b,"#601828");px(ctx,13,y-b,"#802838");px(ctx,22,y-b,"#802838");px(ctx,23,y-b,"#601828");}
  px(ctx,11,30-b,"#d4a040");px(ctx,12,30-b,"#d4a040");px(ctx,13,30-b,"#d4a040");
  px(ctx,22,30-b,"#d4a040");px(ctx,23,30-b,"#d4a040");px(ctx,24,30-b,"#d4a040");
  // Tail
  for(let i=0;i<6;i++){px(ctx,10-i,22+Math.floor(i*.6)-b,"#802838");px(ctx,10-i,23+Math.floor(i*.6)-b,"#601828");}
  px(ctx,4,25-b,"#d4a040");px(ctx,3,25-b,"#e8b850");
  // Spikes along back
  for(let i=0;i<4;i++){px(ctx,14+i*3,12-b,"#d4a040");px(ctx,14+i*3,11-b,"#e8b850");}
}

// ═══════════════════════════════════════
// ACCESSORIES — BACK SLOT (capes, wings)
// Drawn BEFORE character so they appear behind
// ═══════════════════════════════════════
function drawAccessory(ctx, id, cl, by, f) {
  // ─── SCARVES ───
  if (id === "scarf_red") {
    // Flowing red scarf from neck
    for(let y=20;y<=32;y++){const wave=Math.sin(f*.15+(y-20)*.3)*2;px(ctx,33+Math.floor(wave),y+by,"#c03030");px(ctx,34+Math.floor(wave),y+by,"#a02020");}
    px(ctx,22,20+by,"#c03030");px(ctx,23,20+by,"#c03030");px(ctx,24,20+by,"#c03030");px(ctx,25,20+by,"#c03030");
  }
  // ─── SHIELDS ───
  else if (id === "shield_wood") {
    for(let y=24;y<=36;y++)for(let x=8;x<=14;x++){const d=Math.sqrt((x-11)**2+((y-30)*0.8)**2);if(d<4.5){let c="#8a6830";if(d>3.5)c="#705020";else if(d<2)c="#a08040";px(ctx,x,y+by,c);}}
    px(ctx,11,28+by,"#604018");px(ctx,11,32+by,"#604018");px(ctx,9,30+by,"#604018");px(ctx,13,30+by,"#604018");
  }
  else if (id === "shield_iron") {
    for(let y=24;y<=36;y++)for(let x=7;x<=14;x++){const d=Math.sqrt((x-10.5)**2+((y-30)*0.75)**2);if(d<5){let c="#808898";if(d>4)c="#606878";else if(d<2)c="#a0a8b8";px(ctx,x,y+by,c);}}
    px(ctx,10,28+by,"#a0a8b8");px(ctx,11,28+by,"#a0a8b8");px(ctx,10,30+by,"#c0c8d0");px(ctx,11,30+by,"#c0c8d0");
    for(let y=26;y<=34;y++)px(ctx,10,y+by,"#606878");
  }
  else if (id === "shield_energy") {
    // ★★★ QUANTUM BARRIER — L32 capstone, full-body force field
    const pulse = 0.7 + Math.sin(f * 0.15) * 0.3;
    const cx = 24, cy = 26; // Character center
    const rx = 16, ry = 22; // Dome radii — wide enough to wrap whole body

    // Full dome outline — bright elliptical arc
    for (let angle = 0; angle < Math.PI * 2; angle += 0.06) {
      const sx = cx + Math.cos(angle) * rx;
      const sy = cy - Math.sin(angle) * ry;
      const ix = Math.floor(sx);
      const iy = Math.floor(sy) + by;
      if (ix >= 0 && ix < 48 && iy >= 0 && iy < 48) {
        // Brighter at top, slightly dimmer at sides
        const bright = Math.sin(angle) > 0 ? 0.9 : 0.6;
        const a = Math.floor(pulse * bright * 120);
        px(ctx, ix, iy, `#60d0ff${Math.min(a, 255).toString(16).padStart(2, '0')}`);
        // Double-thick outline
        const ix2 = Math.floor(cx + Math.cos(angle) * (rx - 1));
        const iy2 = Math.floor(cy - Math.sin(angle) * (ry - 1)) + by;
        if (ix2 >= 0 && ix2 < 48 && iy2 >= 0 && iy2 < 48) {
          px(ctx, ix2, iy2, `#80e0ff${Math.floor(a * 0.5).toString(16).padStart(2, '0')}`);
        }
      }
    }

    // Hex grid filling the entire dome
    for (let gy = 4; gy <= 46; gy += 3) {
      const row = Math.floor((gy - 4) / 3);
      const offset = row % 2 === 0 ? 0 : 2;
      for (let gx = cx - rx + 2 + offset; gx <= cx + rx - 2; gx += 4) {
        const dx = (gx - cx) / rx;
        const dy = (gy - cy) / ry;
        if (dx * dx + dy * dy < 0.82) {
          const shimmer = Math.sin(f * 0.14 + gx * 0.4 + gy * 0.3) * 0.5 + 0.5;
          const a = Math.floor(shimmer * pulse * 60);
          if (a > 3) {
            const hex = a.toString(16).padStart(2, '0');
            // Hex vertices
            px(ctx, gx, gy - 1 + by, `#60d0ff${hex}`);
            px(ctx, gx - 1, gy + by, `#60d0ff${hex}`);
            px(ctx, gx + 1, gy + by, `#60d0ff${hex}`);
            px(ctx, gx, gy + 1 + by, `#60d0ff${hex}`);
            // Hex edges (connecting lines)
            px(ctx, gx - 1, gy - 1 + by, `#40b0e0${Math.floor(a * 0.4).toString(16).padStart(2, '0')}`);
            px(ctx, gx + 1, gy - 1 + by, `#40b0e0${Math.floor(a * 0.4).toString(16).padStart(2, '0')}`);
          }
        }
      }
    }

    // Scanning sweep beam — rotates around the full dome
    const sweepAngle = f * 0.08;
    for (let d = 3; d < rx + 2; d++) {
      const sx = cx + Math.cos(sweepAngle) * d;
      const sy = cy - Math.sin(sweepAngle) * d * (ry / rx);
      const ix = Math.floor(sx);
      const iy = Math.floor(sy) + by;
      if (ix >= 0 && ix < 48 && iy >= 0 && iy < 48) {
        px(ctx, ix, iy, "#a0f0ffe0");
      }
      // Sweep trail
      for (let trail = 1; trail <= 3; trail++) {
        const ta = sweepAngle - trail * 0.06;
        const tsx = Math.floor(cx + Math.cos(ta) * d);
        const tsy = Math.floor(cy - Math.sin(ta) * d * (ry / rx)) + by;
        const fade = 1 - trail / 4;
        const a = Math.floor(fade * 100);
        if (tsx >= 0 && tsx < 48 && tsy >= 0 && tsy < 48) {
          px(ctx, tsx, tsy, `#80e0ff${a.toString(16).padStart(2, '0')}`);
        }
      }
    }

    // Impact sparks — bright flashes on the dome surface
    for (let i = 0; i < 4; i++) {
      if ((f + i * 7) % 14 < 3) {
        const impactAngle = ((f + i * 7) % 14) * 0.4 + i * 1.8;
        const ix = Math.floor(cx + Math.cos(impactAngle) * (rx - 1));
        const iy = Math.floor(cy - Math.sin(impactAngle) * (ry - 1)) + by;
        if (ix >= 0 && ix < 48 && iy >= 0 && iy < 48) {
          // Bright white core
          px(ctx, ix, iy, "#ffffffe0");
          // Cross flare
          for (let d = 1; d <= 2; d++) {
            const fa = d === 1 ? "b0" : "50";
            if (ix - d >= 0) px(ctx, ix - d, iy, `#80e0ff${fa}`);
            if (ix + d < 48) px(ctx, ix + d, iy, `#80e0ff${fa}`);
            if (iy - d >= 0) px(ctx, ix, iy - d, `#80e0ff${fa}`);
            if (iy + d < 48) px(ctx, ix, iy + d, `#80e0ff${fa}`);
          }
        }
      }
    }

    // Inner energy fill — subtle glow inside the dome
    for (let y = cy - ry + 4; y <= cy + ry - 4; y++) {
      for (let x = cx - rx + 4; x <= cx + rx - 4; x++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        const d = dx * dx + dy * dy;
        if (d < 0.6) {
          const a = Math.floor((1 - d / 0.6) * pulse * 12);
          if (a > 1) px(ctx, x, y + by, `#60d0ff${a.toString(16).padStart(2, '0')}`);
        }
      }
    }

    // Ground energy ring — bright base
    for (let x = cx - rx; x <= cx + rx; x++) {
      const dist = Math.abs(x - cx);
      if (dist <= rx) {
        const edgeFade = 1 - dist / rx;
        const a = Math.floor(edgeFade * pulse * 80);
        if (a > 2) {
          px(ctx, x, 46 + by, `#60d0ff${Math.min(a, 255).toString(16).padStart(2, '0')}`);
          if (edgeFade > 0.5) px(ctx, x, 45 + by, `#40b0e0${Math.floor(a * 0.4).toString(16).padStart(2, '0')}`);
        }
      }
    }

    // Top energy crown — bright arc at dome peak
    for (let x = cx - 8; x <= cx + 8; x++) {
      const dist = Math.abs(x - cx);
      const a = Math.floor((1 - dist / 9) * pulse * 70);
      if (a > 2) {
        const topY = cy - ry + 1;
        if (topY + by >= 0) px(ctx, x, topY + by, `#a0f0ff${a.toString(16).padStart(2, '0')}`);
      }
    }
  }
  // ─── HALOS ───
  else if (id === "halo_basic") {
    // Golden halo ring floating above head — wide and glowing
    const h=1+by; // original height
    // Outer ring (wide ellipse)
    for(let x=15;x<=32;x++){
      const dx=x-23.5;const t=dx/8.5;
      const curve=Math.floor(Math.sqrt(1-t*t)*2);
      px(ctx,x,h-curve,"#f0d060");px(ctx,x,h-curve+1,"#f0d060");
    }
    // Inner glow
    for(let x=17;x<=30;x++){
      px(ctx,x,h,"#ffe88090");
    }
    // Bright highlights
    px(ctx,19,h-1+by,"#fff8");px(ctx,28,h-1+by,"#fff8");
    // Shimmer
    if(f%6<3){px(ctx,16,h,"#fff6");px(ctx,31,h,"#fff6");}
    if(f%4<2){px(ctx,23,h-2,"#ffe88050");px(ctx,24,h-2,"#ffe88050");}
  }
  else if (id === "halo_fire") {
    // Blazing fire ring above head — wide with tall flickering flames
    const h=1+by; // original height
    // Base ring (wide)
    for(let x=14;x<=33;x++){
      px(ctx,x,h+2,"#c0501880");
      px(ctx,x,h+1,"#e67e22");
      const flick=Math.sin(f*.3+x*.6);
      px(ctx,x,h,"#f39c12");
      // Tall flame tongues
      if(flick>0)px(ctx,x,h-1,"#f5b041");
      if(flick>0.3)px(ctx,x,h-2,"#ffed4a90");
      if(flick>0.7)px(ctx,x,h-3,"#ffed4a50");
    }
    // Extra tall flame peaks
    const peaks=[15,19,23,27,31];
    peaks.forEach(px2=>{
      const flick2=Math.sin(f*.25+px2*.8);
      if(flick2>0.2)px(ctx,px2,h-3,"#ffed4a70");
      if(flick2>0.5)px(ctx,px2,h-4,"#fff4");
    });
    // Embers floating up
    if(f%3<2){px(ctx,16+(f%8),h-4,"#ffed4a50");px(ctx,30-(f%6),h-5,"#f39c1240");}
    if(f%5<2){px(ctx,20+(f%4),h-5,"#fff3");}
  }
  // ─── SHOULDER PADS ───
  else if (id === "shoulder_pads") {
    for(let y=18;y<=22;y++){
      for(let x=12;x<=16;x++){let c="#808898";if(y===18)c="#a0a8b8";px(ctx,x,y+by,c);}
      for(let x=31;x<=35;x++){let c="#808898";if(y===18)c="#a0a8b8";px(ctx,x,y+by,c);}
    }
    // Spikes
    px(ctx,12,17+by,"#a0a8b8");px(ctx,11,16+by,"#c0c8d0");
    px(ctx,35,17+by,"#a0a8b8");px(ctx,36,16+by,"#c0c8d0");
  }
  // ─── FLOATING ITEMS ───
  else if (id === "floating_book") {
    const bob=f%8<4?0:1;
    // Book body
    for(let x=5;x<=12;x++)for(let y=24;y<=30;y++){let c="#6030a0";if(y===24||y===30)c="#482080";if(x===5||x===12)c="#482080";px(ctx,x,y-bob+by,c);}
    // Pages
    for(let x=6;x<=11;x++)px(ctx,x,27-bob+by,"#e8e0d8");
    // Spine
    px(ctx,5,25-bob+by,"#402070");px(ctx,5,26-bob+by,"#402070");px(ctx,5,28-bob+by,"#402070");px(ctx,5,29-bob+by,"#402070");
    // Glow
    if(f%6<3)px(ctx,8,26-bob+by,"#c080f040");
    // Sparkle
    if(f%8<2){px(ctx,4,23-bob+by,"#fff4");px(ctx,13,28-bob+by,"#fff4");}
  }
  else if (id === "floating_orbs") {
    const count=3;
    for(let i=0;i<count;i++){
      const a=f*.1+(i/count)*Math.PI*2;
      const r=18+Math.sin(f*.05+i)*3;
      const ox=24+Math.floor(Math.cos(a)*r);
      const oy=24+Math.floor(Math.sin(a)*r*0.55)+by;
      if(ox>=-15&&ox<63&&oy>=1&&oy<47){
        const colors=["#60d0ff","#f060a0","#60f0a0"];
        const c=colors[i];
        // Outer glow
        px(ctx,ox-1,oy,c+"30");px(ctx,ox+1,oy,c+"30");
        px(ctx,ox,oy-1,c+"30");px(ctx,ox,oy+1,c+"30");
        // Core (2x2)
        px(ctx,ox,oy,c+"c0");px(ctx,ox+1,oy,c+"a0");
        px(ctx,ox,oy+1,c+"80");px(ctx,ox+1,oy+1,c+"60");
        // Highlight
        px(ctx,ox,oy-1,c+"50");
        // Trail
        const ta=a-0.3;
        const tx=24+Math.floor(Math.cos(ta)*r);const ty=24+Math.floor(Math.sin(ta)*r*0.55)+by;
        if(tx>=0&&tx<48&&ty>=0&&ty<48)px(ctx,tx,ty,c+"25");
      }
    }
  }
  else if (id === "floating_swords") {
    // Two phantom blades hovering behind
    const bob=Math.sin(f*.12)*1.5;
    // Left blade
    for(let y=8;y<=24;y++){px(ctx,8,Math.floor(y+bob)+by,"#a0a8b860");if(y>=8&&y<=12)px(ctx,9,Math.floor(y+bob)+by,"#c0c8d040");}
    px(ctx,8,Math.floor(7+bob)+by,"#e0e0f080"); // tip
    // Right blade
    for(let y=10;y<=26;y++){px(ctx,38,Math.floor(y-bob)+by,"#a0a8b860");if(y>=10&&y<=14)px(ctx,37,Math.floor(y-bob)+by,"#c0c8d040");}
    px(ctx,38,Math.floor(9-bob)+by,"#e0e0f080");
    // Hilts
    px(ctx,7,Math.floor(24+bob)+by,"#d4a040");px(ctx,9,Math.floor(24+bob)+by,"#d4a040");
    px(ctx,37,Math.floor(26-bob)+by,"#d4a040");px(ctx,39,Math.floor(26-bob)+by,"#d4a040");
  }
  else if (id === "tech_drones") {
    // 3 drones orbiting wide
    for(let i=0;i<3;i++){
      const a=f*.12+(i/3)*Math.PI*2;
      const ox=24+Math.floor(Math.cos(a)*20);
      const oy=22+Math.floor(Math.sin(a)*14)+by;
      if(ox>=-14&&ox<62&&oy>=2&&oy<46){
        // Body (3x2)
        px(ctx,ox-1,oy,"#606878");px(ctx,ox,oy,"#808898");px(ctx,ox+1,oy,"#606878");
        px(ctx,ox-1,oy+1,"#505868");px(ctx,ox,oy+1,"#707888");px(ctx,ox+1,oy+1,"#505868");
        // Propeller arms
        if(f%2===0){
          px(ctx,ox-2,oy-1,"#a0a8b880");px(ctx,ox+2,oy-1,"#a0a8b880");
          px(ctx,ox-3,oy-1,"#a0a8b840");px(ctx,ox+3,oy-1,"#a0a8b840");
        } else {
          px(ctx,ox-1,oy-1,"#a0a8b880");px(ctx,ox+1,oy-1,"#a0a8b880");
          px(ctx,ox-2,oy-2,"#a0a8b840");px(ctx,ox+2,oy-2,"#a0a8b840");
        }
        // Eye light
        const lc=i===0?"#60d0ff":"#ff4040";
        px(ctx,ox,oy,lc+"a0");
        // Scan beam below
        if((f+i*4)%8<3){px(ctx,ox,oy+2,lc+"30");px(ctx,ox,oy+3,lc+"15");}
      }
    }
  }
  // ─── CHAINS ───
  else if (id === "chain_wrap") {
    // Ghost chains draped wide on left and right sides
    // Left chain
    for(let y=14;y<=42;y++){
      const wave=Math.sin(f*.1+(y-14)*.25)*2.5;
      const cx=Math.floor(8+wave);
      if(cx>=1&&cx<47){
        px(ctx,cx,y+by,"#b0b8c860");px(ctx,cx+1,y+by,"#a0a8b840");
        if(y%3===0){px(ctx,cx,y+by,"#c8d0d880");px(ctx,cx-1,y+by,"#b0b8c830");} // link highlight
      }
    }
    // Right chain
    for(let y=16;y<=44;y++){
      const wave=Math.sin(f*.1+2.5+(y-16)*.25)*2.5;
      const cx=Math.floor(38+wave);
      if(cx>=1&&cx<47){
        px(ctx,cx,y+by,"#b0b8c860");px(ctx,cx-1,y+by,"#a0a8b840");
        if(y%3===0){px(ctx,cx,y+by,"#c8d0d880");px(ctx,cx+1,y+by,"#b0b8c830");}
      }
    }
    // Center drape (looser, more transparent)
    for(let y=22;y<=38;y++){
      const wave=Math.sin(f*.08+4.5+(y-22)*.2)*3;
      const cx=Math.floor(24+wave);
      if(y%4<2)px(ctx,cx,y+by,"#a0a8b825");
    }
    // Dangling chain ends
    px(ctx,8,43+by,"#b0b8c850");px(ctx,8,44+by,"#a0a8b830");
    px(ctx,38,45+by,"#b0b8c850");px(ctx,38,46,"#a0a8b830");
  }
  // ─── CAPES (existing, compacted) ───
  else if (id === "cape_basic") {
    for(let y=20+by;y<=44+by;y++){const s=Math.floor((y-20)*.3);for(let x=13-s;x<=14;x++)if(x>=8)px(ctx,x,y,"#802020");for(let x=33;x<=34+s;x++)if(x<=39)px(ctx,x,y,"#802020");}
    for(let y=22+by;y<=42+by;y++){px(ctx,14,y,"#a03030");px(ctx,33,y,"#a03030");}
    for(let y=22+by;y<=44+by;y++){px(ctx,22,y,"#70181880");px(ctx,25,y,"#70181880");}
  }
  else if (id === "cape_royal") {
    for(let y=18+by;y<=44+by;y++){const s=Math.floor((y-18)*.35);const p=(y-18)/26;const r2=Math.floor(80+p*60),g=Math.floor(10+p*5),b2=Math.floor(80-p*50);const c=`rgb(${r2},${g},${b2})`;for(let x=12-s;x<=14;x++)if(x>=6)px(ctx,x,y,c);for(let x=33;x<=35+s;x++)if(x<=41)px(ctx,x,y,c);}
    for(let y=20+by;y<=44+by;y++){const s=Math.floor((y-18)*.35);px(ctx,Math.max(6,12-s),y,"#d4a040");px(ctx,Math.min(41,35+s),y,"#d4a040");}
    px(ctx,22,20+by,"#f0c848");px(ctx,25,20+by,"#f0c848");px(ctx,23,20+by,"#d4a040");px(ctx,24,20+by,"#d4a040");
  }
  // ─── WINGS (existing + new) ───
  else if (id === "wings_small") {
    // Dragonfly-style double wings — translucent, veined, iridescent
    const fl2=f%6<3;const lift=fl2?2:0;
    // Upper wing pair (longer, narrower)
    for(let side=-1;side<=1;side+=2){
      const anchor=side<0?14:33;const dir=side;
      // Upper wing
      for(let i=0;i<14;i++){
        const t=i/13;
        const wx=anchor+dir*Math.floor(t*16+lift*t*2);
        const wy=Math.floor(16-Math.sin(t*Math.PI)*6)+by;
        if(wx>=-16&&wx<64&&wy>=0&&wy<48){
          px(ctx,wx,wy,"#88ccff35");px(ctx,wx,wy+1,"#88ccff25");
          if(i%3===0)px(ctx,wx,wy,"#aaddff50"); // vein node
        }
      }
      // Upper wing fill
      for(let y=12-lift;y<=20;y++){
        const wy=y-(12-lift);const span=Math.floor(Math.sin(wy/8*Math.PI)*12*(1+lift*.1));
        for(let x=0;x<span;x++){
          const wx=anchor+dir*x;
          if(wx>=-16&&wx<64)px(ctx,wx,y+by,"#88ccff18");
        }
      }
      // Vein lines radiating
      for(let v=0;v<3;v++){
        for(let i=0;i<10;i++){
          const t=i/9;const angle=(v-1)*0.3;
          const vx=anchor+dir*Math.floor(t*14);
          const vy=Math.floor(16+angle*i*1.5-lift*t)+by;
          if(vx>=-16&&vx<64&&vy>=0&&vy<48)px(ctx,vx,vy,"#aaddff30");
        }
      }
      // Lower wing (shorter, rounder)
      for(let y=20;y<=30;y++){
        const wy=y-20;const span=Math.floor(Math.sin(wy/10*Math.PI)*10*(1+lift*.08));
        for(let x=0;x<span;x++){
          const wx=anchor+dir*x;
          if(wx>=-16&&wx<64)px(ctx,wx,y+by,"#88ccff14");
        }
      }
      for(let i=0;i<8;i++){
        const t=i/7;
        const wx=anchor+dir*Math.floor(t*10);
        const wy=Math.floor(25-Math.sin(t*Math.PI)*4)+by;
        if(wx>=-16&&wx<64&&wy>=0&&wy<48)px(ctx,wx,wy,"#aaddff28");
      }
    }
    // Iridescent sparkles
    if(f%4<2){px(ctx,6,14+by,"#d0f0ff50");px(ctx,41,16+by,"#ffd0f050");}
    if(f%6<2){px(ctx,4,18+by,"#fff4");px(ctx,43,18+by,"#fff4");}
  }
  else if (id === "wings_bat") {
    // Bat wings — bones sweep UP, membrane sags DOWN between tips
    const fl2=f%6<3;const lift=fl2?2:0;
    for(let side=-1;side<=1;side+=2){
      const sx=side<0?14:33;
      const sy=22+by;
      const d=side;
      const boneDefs=[
        [d*20, -18-lift],
        [d*22, -10-lift],
        [d*19, -3-lift],
        [d*13,  4],
      ];
      const tips=boneDefs.map(([bx,by2])=>[sx+bx,sy+by2]);

      // Fill membrane panels FIRST (behind bones)
      for(let bi=0;bi<tips.length-1;bi++){
        const[tx1,ty1]=tips[bi];const[tx2,ty2]=tips[bi+1];
        // For each panel: fill the triangle from shoulder to tip1 to tip2
        // with scalloped bottom edge between the two tips
        const minX=Math.min(sx,tx1,tx2);const maxX=Math.max(sx,tx1,tx2);
        const minY=Math.min(sy,ty1,ty2)-1;const maxY=Math.max(sy,ty1,ty2)+8;
        for(let x=minX;x<=maxX;x++){
          if(x<-16||x>=64)continue;
          // How far along the panel is this x? (0=bone1 side, 1=bone2 side)
          const xRange=tx2-tx1||1;
          const t=Math.max(0,Math.min(1,(x-tx1)/xRange));
          // Top edge: line from shoulder to the bone at this x
          // Blend between bone1 line and bone2 line
          const topFromBone1=ty1+(sy-ty1)*((x-tx1)/(sx-tx1||1));
          const topFromBone2=ty2+(sy-ty2)*((x-tx2)/(sx-tx2||1));
          // Use whichever bone line is above at this x
          const topY1=side<0?
            (x<=sx?Math.floor(sy+(ty1-sy)*((sx-x)/(sx-tx1||1))):sy):
            (x>=sx?Math.floor(sy+(ty1-sy)*((x-sx)/(tx1-sx||1))):sy);
          const topY2=side<0?
            (x<=sx?Math.floor(sy+(ty2-sy)*((sx-x)/(sx-tx2||1))):sy):
            (x>=sx?Math.floor(sy+(ty2-sy)*((x-sx)/(tx2-sx||1))):sy);
          const topY=Math.min(topY1,topY2);
          // Bottom edge: scalloped curve between the two tips
          const botBase=Math.floor(ty1+(ty2-ty1)*t);
          const sag=Math.floor(Math.sin(t*Math.PI)*6);
          const botY=botBase+sag;
          // Fill column
          for(let y=topY;y<=botY;y++){
            if(y>=0&&y<48){
              const depth=(y-topY)/(botY-topY+1);
              if(depth<.3)px(ctx,x,y,"#D4B896");
              else if(depth<.6)px(ctx,x,y,"#C8A882");
              else if(depth<.85)px(ctx,x,y,"#B89870");
              else px(ctx,x,y,"#8B7355");
            }
          }
        }
      }
      // Trailing membrane from last tip back to shoulder
      const[lastX,lastY]=tips[tips.length-1];
      const steps2=Math.max(Math.abs(lastX-sx),Math.abs(lastY-sy),1);
      for(let s=0;s<=steps2;s++){
        const t=s/steps2;
        const mx=Math.floor(lastX+(sx-lastX)*t);
        const my=Math.floor(lastY+(sy-lastY)*t);
        if(mx>=-16&&mx<64&&my>=0&&my<48)px(ctx,mx,my,"#C8A882");
      }
      // Draw bones ON TOP of membrane
      boneDefs.forEach(([bx,by2],bi)=>{
        const steps=Math.max(Math.abs(bx),Math.abs(by2));
        for(let i=0;i<=steps;i++){
          const t=i/steps;
          const curve=Math.sin(t*Math.PI)*2*d;
          const px2=Math.floor(sx+bx*t+curve);
          const py=Math.floor(sy+by2*t);
          if(px2>=-16&&px2<64&&py>=0&&py<48){
            px(ctx,px2,py,"#604838");
            if(i<3)px(ctx,px2,py,"#785848");
          }
        }
        const tipX=sx+bx;const tipY=sy+by2;
        if(bi===0&&tipX>=-16&&tipX<64&&tipY>=0&&tipY<48){
          px(ctx,tipX+d,tipY,"#785848");px(ctx,tipX+d,tipY-1,"#685040");
        }
      });
    }
  }
  else if (id === "wings_angel") {
    const fl2=f%8<4;const ws=fl2?3:0;
    for(let y=14;y<=34;y++){const wy=y-14;const w=Math.floor(Math.sin(wy/20*Math.PI)*(7+ws));
      for(let x=14-w;x<=14;x++)if(x>=2)px(ctx,x,y+by,x%2===0?"#e8e8f0":"#d0d0e0");
      for(let x=33;x<=33+w;x++)if(x<=45)px(ctx,x,y+by,x%2===0?"#e8e8f0":"#d0d0e0");}
    if(fl2){for(let y=18;y<=30;y+=3){px(ctx,6,y+by,"#f0f0f8");px(ctx,41,y+by,"#f0f0f8");}}
    if(f%6<2){px(ctx,8,20+by,"#fff4");px(ctx,39,22+by,"#fff4");}
  }
  else if (id === "wings_dragon") {
    // Dragon wings — bright orange-red membrane, deep scallops
    const fl2=f%8<4;const lift=fl2?3:0;
    for(let side=-1;side<=1;side+=2){
      const sx=side<0?14:33;
      const sy=20+by;
      const d=side;
      const boneDefs=[
        [d*22, -20-lift],
        [d*24, -12-lift],
        [d*21, -4-lift],
        [d*15,  4],
        [d*8,   10],
      ];
      const tips=boneDefs.map(([bx,by2])=>[sx+bx,sy+by2]);

      // Fill membrane panels FIRST
      for(let bi=0;bi<tips.length-1;bi++){
        const[tx1,ty1]=tips[bi];const[tx2,ty2]=tips[bi+1];
        const minX=Math.min(sx,tx1,tx2);const maxX=Math.max(sx,tx1,tx2);
        for(let x=minX;x<=maxX;x++){
          if(x<-16||x>=64)continue;
          const xRange=tx2-tx1||1;
          const t=Math.max(0,Math.min(1,(x-tx1)/xRange));
          const topY1=side<0?
            (x<=sx?Math.floor(sy+(ty1-sy)*((sx-x)/(sx-tx1||1))):sy):
            (x>=sx?Math.floor(sy+(ty1-sy)*((x-sx)/(tx1-sx||1))):sy);
          const topY2=side<0?
            (x<=sx?Math.floor(sy+(ty2-sy)*((sx-x)/(sx-tx2||1))):sy):
            (x>=sx?Math.floor(sy+(ty2-sy)*((x-sx)/(tx2-sx||1))):sy);
          const topY=Math.min(topY1,topY2);
          const botBase=Math.floor(ty1+(ty2-ty1)*t);
          const sag=Math.floor(Math.sin(t*Math.PI)*8);
          const botY=botBase+sag;
          for(let y=topY;y<=botY;y++){
            if(y>=0&&y<48){
              const depth=(y-topY)/(botY-topY+1);
              if(depth<.2)px(ctx,x,y,"#E8944C");
              else if(depth<.45)px(ctx,x,y,"#E07840");
              else if(depth<.7)px(ctx,x,y,"#D06838");
              else if(depth<.9)px(ctx,x,y,"#C05830");
              else px(ctx,x,y,"#8B3020");
            }
          }
        }
      }
      // Trailing membrane from last tip to shoulder
      const[lastX,lastY]=tips[tips.length-1];
      const steps2=Math.max(Math.abs(lastX-sx),Math.abs(lastY-sy),1);
      for(let s=0;s<=steps2;s++){
        const t=s/steps2;
        const mx=Math.floor(lastX+(sx-lastX)*t);
        const my=Math.floor(lastY+(sy-lastY)*t);
        if(mx>=-16&&mx<64&&my>=0&&my<48)px(ctx,mx,my,"#D06838");
      }
      // Draw bones ON TOP
      boneDefs.forEach(([bx,by2],bi)=>{
        const steps=Math.max(Math.abs(bx),Math.abs(by2));
        for(let i=0;i<=steps;i++){
          const t=i/steps;
          const curve=Math.sin(t*Math.PI)*2.5*d;
          const px2=Math.floor(sx+bx*t+curve);
          const py=Math.floor(sy+by2*t);
          if(px2>=-16&&px2<64&&py>=0&&py<48){
            px(ctx,px2,py,"#483020");
            if(i<4){px(ctx,px2,py,"#604030");px(ctx,px2,py+1,"#503828");}
          }
        }
        const tipX=sx+bx;const tipY=sy+by2;
        if(bi===0&&tipX>=-16&&tipX<64&&tipY>=0&&tipY<48){
          px(ctx,tipX+d,tipY,"#604030");px(ctx,tipX+d,tipY-1,"#705040");
          px(ctx,tipX+d*2,tipY-1,"#d4a040");
        }
        if(bi>0&&bi<3&&tipX>=-16&&tipX<64&&tipY>=0&&tipY<48){
          px(ctx,tipX,tipY+1,"#503828");
        }
      });
    }
  }
  // ─── CROWN ───
  else if (id === "crown_divine") {
    // ★★★ CROWN OF THE PANTHEON — L35 ultimate capstone accessory
    const h = 1 + by;
    const pulse = 0.7 + Math.sin(f * 0.1) * 0.3;
    // Holy nimbus glow behind crown — wide soft light
    for (let y = h - 6; y <= h + 4; y++) {
      for (let x = 10; x <= 37; x++) {
        const dx = (x - 23.5) / 14;
        const dy = (y - (h - 1)) / 5;
        const d = dx * dx + dy * dy;
        if (d < 1) {
          const a = Math.floor((1 - d) * pulse * 30);
          if (a > 1) px(ctx, x, y, `#ffe880${a.toString(16).padStart(2, '0')}`);
        }
      }
    }
    // Crown band — ornate with filigree pattern
    for (let x = 13; x <= 34; x++) {
      px(ctx, x, h + 2, "#b88818");
      px(ctx, x, h + 1, "#d4a020");
      px(ctx, x, h, "#f0c030");
      // Filigree detail
      if ((x - 13) % 3 === 1) px(ctx, x, h + 1, "#f0d860");
    }
    // 5 crown points with ascending light pillars
    const points = [14, 19, 23, 27, 32];
    const pointHeights = [4, 5, 7, 5, 4];
    points.forEach((px2, i) => {
      const ph = pointHeights[i];
      // Solid crown point
      for (let dy = 1; dy <= ph; dy++) {
        const taper = dy > ph - 2 ? 0 : 1;
        px(ctx, px2, h - dy, "#f0c030");
        if (taper) { px(ctx, px2 - 1, h - dy, "#d4a020"); px(ctx, px2 + 1, h - dy, "#d4a020"); }
      }
      // Light pillar shooting up from each point
      const pillarAlpha = Math.sin(f * 0.15 + i * 1.2) * 0.5 + 0.5;
      for (let dy = ph + 1; dy <= ph + 6; dy++) {
        const fade = 1 - (dy - ph - 1) / 6;
        const a = Math.floor(fade * pillarAlpha * 50);
        if (a > 1 && h - dy >= 0) px(ctx, px2, h - dy, `#ffe880${a.toString(16).padStart(2, '0')}`);
      }
    });
    // Arch decorations between points
    for (let i = 0; i < points.length - 1; i++) {
      const midX = Math.floor((points[i] + points[i + 1]) / 2);
      px(ctx, midX, h - 1, "#d4a020");
      px(ctx, midX - 1, h - 1, "#d4a02080");
      px(ctx, midX + 1, h - 1, "#d4a02080");
      px(ctx, midX, h - 2, "#f0c03060");
    }
    // Large orbiting gems — 4 colored jewels circling the crown
    const gems = [
      { color: "#e03050", glow: "#ff506080" },  // ruby
      { color: "#2868e0", glow: "#4888ff80" },   // sapphire
      { color: "#20c050", glow: "#40e07080" },    // emerald
      { color: "#c040d0", glow: "#e060f080" },    // amethyst
    ];
    gems.forEach((gem, i) => {
      const angle = f * 0.06 + (i / 4) * Math.PI * 2;
      const orbitR = 16 + Math.sin(f * 0.04 + i) * 2;
      const gx = Math.floor(23.5 + Math.cos(angle) * orbitR);
      const gy = Math.floor((h - 1) + Math.sin(angle) * 3);
      if (gx >= 0 && gx < 48 && gy >= 0 && gy < 48) {
        // Gem glow
        px(ctx, gx - 1, gy, gem.glow);
        px(ctx, gx + 1, gy, gem.glow);
        px(ctx, gx, gy - 1, gem.glow);
        px(ctx, gx, gy + 1, gem.glow);
        // Gem core
        px(ctx, gx, gy, gem.color);
        // Trailing sparkle
        const trailAngle = angle - 0.15;
        const tx = Math.floor(23.5 + Math.cos(trailAngle) * orbitR);
        const ty = Math.floor((h - 1) + Math.sin(trailAngle) * 3);
        if (tx >= 0 && tx < 48 && ty >= 0 && ty < 48) px(ctx, tx, ty, "#fff4");
      }
    });
    // Inlaid band gems (static, on the crown itself)
    px(ctx, 16, h, "#e03040"); px(ctx, 20, h, "#2868d0"); px(ctx, 24, h, "#60d0f0"); px(ctx, 28, h, "#30b050"); px(ctx, 31, h, "#e03040");
    // Center diamond — large, pulsing
    const diamondBright = f % 6 < 3;
    px(ctx, 23, h - 6, diamondBright ? "#a0e0ff" : "#60d0f0");
    px(ctx, 22, h - 5, "#80d0ff80"); px(ctx, 24, h - 5, "#80d0ff80");
    px(ctx, 23, h - 5, diamondBright ? "#ffffff" : "#a0e0ff");
    // Prismatic refraction beams from center diamond
    if (diamondBright) {
      const beamColors = ["#ff404040", "#f0c03040", "#40e06040", "#4080ff40", "#c040d040"];
      beamColors.forEach((bc, i) => {
        const bAngle = (i / 5) * Math.PI - Math.PI / 2 + Math.sin(f * 0.05) * 0.3;
        for (let d = 2; d < 7; d++) {
          const bx = Math.floor(23 + Math.cos(bAngle) * d);
          const bby = Math.floor((h - 6) + Math.sin(bAngle) * d);
          if (bx >= 0 && bx < 48 && bby >= 0 && bby < 48) px(ctx, bx, bby, bc);
        }
      });
    }
    // Cascading sparkle shower
    for (let i = 0; i < 8; i++) {
      const sx = 12 + ((i * 4 + f) % 24);
      const sy = ((f * 0.08 + i * 1.5) % 10);
      const ay = Math.floor(h - 8 + sy);
      if (ay >= 0 && ay < 48 && sx < 48) {
        const fade = sy / 10;
        px(ctx, sx, ay, fade > 0.5 ? "#ffe88030" : "#fff6");
      }
    }
  }
}

// ═══════════════════════════════════════
// SPECIAL POWERS
// Drawn BEFORE character so effects appear behind
// These are meant to be DRAMATIC — the visual payoff for grinding XP
// ═══════════════════════════════════════
function drawPower(ctx, id, cl, by, f) {
  if (id === "aura_basic") {
    // ★ STARFIELD AURA — dense orbiting sparkles with trails
    // Outer ring of orbiting stars
    const starCount = 14;
    for (let i = 0; i < starCount; i++) {
      const speed = 0.09 + (i % 3) * 0.02;
      const angle = f * speed + (i / starCount) * Math.PI * 2;
      const rx = 12 + (i % 4) * 2;
      const ry = 10 + (i % 3) * 3;
      const ax = 24 + Math.floor(Math.cos(angle) * rx);
      const ay = 24 + Math.floor(Math.sin(angle) * ry) + by;
      if (ax >= 0 && ax < 48 && ay >= 0 && ay < 48) {
        // Bright core
        px(ctx, ax, ay, cl.robeLight + "80");
        // Trail (previous position)
        const trailAngle = angle - speed * 2;
        const tx = 24 + Math.floor(Math.cos(trailAngle) * rx);
        const ty = 24 + Math.floor(Math.sin(trailAngle) * ry) + by;
        if (tx >= 0 && tx < 48 && ty >= 0 && ty < 48) {
          px(ctx, tx, ty, cl.robeLight + "30");
        }
      }
    }
    // Inner shimmer ring
    for (let i = 0; i < 8; i++) {
      const angle = -f * 0.12 + (i / 8) * Math.PI * 2;
      const ax = 24 + Math.floor(Math.cos(angle) * 6);
      const ay = 24 + Math.floor(Math.sin(angle) * 5) + by;
      if (ax >= 0 && ax < 48 && ay >= 0 && ay < 48) {
        px(ctx, ax, ay, "#fff3");
      }
    }
    // Twinkling random sparkles
    for (let i = 0; i < 5; i++) {
      if ((f + i * 7) % 5 < 2) {
        const sx = 8 + ((f * 3 + i * 13) % 32);
        const sy = 4 + ((f * 5 + i * 17) % 38);
        px(ctx, sx, sy + by, "#fff6");
      }
    }
    // Ground glow pool
    for (let x = 14; x <= 33; x++) {
      const dist = Math.abs(x - 23.5);
      if (dist < 8) px(ctx, x, 45 + by, cl.robeLight + "20");
      if (dist < 5) px(ctx, x, 46 + by, cl.robeLight + "15");
    }
  }

  else if (id === "aura_fire") {
    // ★ INFERNO AURA — roaring flame columns, dense embers, heat distortion
    // Main flame columns on each side
    for (let side = 0; side < 2; side++) {
      const baseX = side === 0 ? 10 : 35;
      const dir = side === 0 ? -1 : 1;
      for (let y = 44; y >= 8; y--) {
        const rise = (44 - y) / 36;
        const flicker = Math.sin(f * 0.3 + y * 0.4 + side * 3) * 2;
        const x = baseX + Math.floor(flicker);
        if (x >= 0 && x < 48) {
          if (rise < 0.3) px(ctx, x, y + by, "#e67e22a0");
          else if (rise < 0.5) px(ctx, x, y + by, "#f39c1280");
          else if (rise < 0.7) px(ctx, x, y + by, "#ffed4a60");
          else px(ctx, x, y + by, "#fff8e040");
          // Width — flames spread at base
          if (rise < 0.5) {
            px(ctx, x + dir, y + by, "#e67e2250");
            if (rise < 0.2) px(ctx, x + dir * 2, y + by, "#e67e2225");
          }
        }
      }
    }
    // Dense rising embers — lots of them
    for (let i = 0; i < 18; i++) {
      const speed = 0.1 + (i % 5) * 0.04;
      const xBase = 8 + ((i * 7) % 32);
      const yOffset = ((f * speed + i * 5.7) % 28);
      const ay = Math.floor(46 - yOffset) + by;
      const wobble = Math.sin(f * 0.15 + i * 2.3) * 3;
      const ax = Math.floor(xBase + wobble);
      if (ay >= 0 && ay < 48 && ax >= 0 && ax < 48) {
        const fade = yOffset / 28;
        if (fade < 0.2) px(ctx, ax, ay, "#ff4500b0");
        else if (fade < 0.4) px(ctx, ax, ay, "#e67e2290");
        else if (fade < 0.6) px(ctx, ax, ay, "#f39c1260");
        else if (fade < 0.8) px(ctx, ax, ay, "#ffed4a40");
        else px(ctx, ax, ay, "#fff8e020");
      }
    }
    // Ground fire pool
    for (let x = 10; x <= 37; x++) {
      const flicker = (f + x * 3) % 4;
      if (flicker < 2) px(ctx, x, 45 + by, "#e67e2260");
      else px(ctx, x, 45 + by, "#f39c1240");
      if (x >= 14 && x <= 33) {
        px(ctx, x, 46 + by, "#e67e2230");
      }
    }
    // Heat shimmer — subtle horizontal lines that wave
    for (let y = 38; y >= 10; y -= 4) {
      const shimX = Math.floor(Math.sin(f * 0.2 + y * 0.3) * 1.5);
      px(ctx, 23 + shimX, y + by, "#ff450010");
      px(ctx, 24 + shimX, y + by, "#ff450010");
    }
  }

  else if (id === "aura_holy") {
    // ★★★ DIVINE RADIANCE — L33 capstone aura
    // Pulsing golden light pillar that breathes
    const pulse = 0.7 + Math.sin(f * 0.12) * 0.3;
    for (let y = 0; y <= 47; y++) {
      const intensity = (1 - Math.abs(y - 22) / 26) * pulse;
      const alpha = Math.floor(Math.max(0, intensity) * 55);
      if (alpha > 2) {
        const hw = Math.floor(5 + Math.sin(y * 0.15 + f * 0.08) * 2);
        for (let x = 24 - hw; x <= 23 + hw; x++) {
          const xFade = 1 - Math.abs(x - 23.5) / (hw + 1);
          const a2 = Math.floor(alpha * Math.max(0, xFade));
          if (a2 > 1) px(ctx, x, y + by, `#f0d060${a2.toString(16).padStart(2, '0')}`);
        }
      }
    }
    // Radiant wing beams — 8 rays fanning out from center
    for (let ray = 0; ray < 8; ray++) {
      const baseAngle = (ray / 8) * Math.PI * 2 + f * 0.03;
      for (let dist = 6; dist < 20; dist++) {
        const wobble = Math.sin(f * 0.1 + dist * 0.3 + ray) * 0.15;
        const rx = 24 + Math.floor(Math.cos(baseAngle + wobble) * dist);
        const ry = 22 + Math.floor(Math.sin(baseAngle + wobble) * dist * 0.85) + by;
        const fade = 1 - (dist - 6) / 14;
        const a = Math.floor(fade * 35 * pulse);
        if (rx >= 0 && rx < 48 && ry >= 0 && ry < 48 && a > 1) {
          px(ctx, rx, ry, `#ffe880${a.toString(16).padStart(2, '0')}`);
        }
      }
    }
    // Triple rotating halo rings at different heights/speeds
    const rings = [
      { y: 4, r: 14, rY: 3, count: 20, speed: 0.06, color: "#f0d060" },
      { y: 22, r: 18, rY: 16, count: 28, speed: -0.04, color: "#ffe880" },
      { y: 40, r: 12, rY: 3, count: 16, speed: 0.08, color: "#f0c030" },
    ];
    for (const ring of rings) {
      for (let i = 0; i < ring.count; i++) {
        const angle = f * ring.speed + (i / ring.count) * Math.PI * 2;
        const ax = 24 + Math.floor(Math.cos(angle) * ring.r);
        const ay = ring.y + Math.floor(Math.sin(angle) * ring.rY) + by;
        if (ax >= 0 && ax < 48 && ay >= 0 && ay < 48) {
          const bright = (i % 4 === 0) ? "90" : "40";
          px(ctx, ax, ay, ring.color + bright);
        }
      }
    }
    // Ascending soul sparks — rising golden particles
    for (let i = 0; i < 14; i++) {
      const speed = 0.08 + (i % 5) * 0.025;
      const xBase = 8 + ((i * 4) % 32);
      const yOffset = ((-f * speed + i * 3.7) % 48 + 48) % 48;
      const ay = Math.floor(47 - yOffset) + by;
      const wobble = Math.sin(f * 0.1 + i * 2.1) * 3;
      const ax = Math.floor(xBase + wobble);
      if (ay >= 0 && ay < 48 && ax >= 0 && ax < 48) {
        const fade = yOffset / 48;
        const a = Math.floor(fade * 70);
        if (a > 2) px(ctx, ax, ay, `#ffe880${a.toString(16).padStart(2, '0')}`);
        // Occasional white flash as they ascend
        if ((f + i * 3) % 8 < 2 && fade > 0.5) px(ctx, ax, ay, "#ffffffa0");
      }
    }
    // Blazing crown halo — multi-layer with shimmer
    const crownPulse = f % 6 < 3;
    for (let x = 14; x <= 33; x++) {
      const dist = Math.abs(x - 23.5);
      const a = Math.floor((1 - dist / 10) * (crownPulse ? 80 : 50));
      if (a > 2) {
        px(ctx, x, 0 + by, `#f0d060${a.toString(16).padStart(2, '0')}`);
        px(ctx, x, 1 + by, `#ffe880${Math.floor(a * 0.7).toString(16).padStart(2, '0')}`);
      }
    }
    // Central crown jewel
    px(ctx, 23, 0 + by, crownPulse ? "#ffffffc0" : "#ffe880a0");
    px(ctx, 24, 0 + by, crownPulse ? "#ffffffc0" : "#ffe880a0");
    // Holy ground fire — flickering golden flames at feet
    for (let x = 10; x <= 37; x++) {
      const dist = Math.abs(x - 23.5);
      if (dist < 14) {
        const height = Math.floor((1 - dist / 14) * 4 + Math.sin(f * 0.2 + x * 0.7) * 2);
        for (let h = 0; h < height; h++) {
          const fy = 46 - h + by;
          if (fy >= 0 && fy < 48) {
            const colors = ["#f0d06060", "#ffe88050", "#fff8e040", "#ffffff30"];
            px(ctx, x, fy, colors[Math.min(h, 3)]);
          }
        }
      }
    }
    // Starburst flash — periodic nova pulse
    if (f % 20 < 3) {
      const burstFrame = f % 20;
      const burstR = 8 + burstFrame * 5;
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        for (let d = burstR - 3; d <= burstR; d++) {
          const bx = 24 + Math.floor(Math.cos(angle) * d);
          const bby2 = 22 + Math.floor(Math.sin(angle) * d * 0.8) + by;
          const fade = 1 - (burstFrame / 3);
          const a = Math.floor(fade * 40);
          if (bx >= 0 && bx < 48 && bby2 >= 0 && bby2 < 48 && a > 1) {
            px(ctx, bx, bby2, `#ffffff${a.toString(16).padStart(2, '0')}`);
          }
        }
      }
    }
  }

  else if (id === "aura_lightning") {
    // ★ LIGHTNING AURA — electric bolts crackling, bright cyan on dark, static sparks
    // Random lightning bolts — 2-3 visible at once, flickering
    const boltSeeds = [f % 12, (f + 4) % 12, (f + 8) % 12];
    for (const seed of boltSeeds) {
      if (seed < 4) { // Only show bolt during part of cycle
        const side = seed % 2 === 0 ? -1 : 1;
        const startX = 24 + side * (6 + (seed % 3) * 3);
        let bx = startX;
        let bby = 6;
        // Draw jagged bolt downward
        for (let seg = 0; seg < 8; seg++) {
          const nextX = bx + Math.floor((((seed * 7 + seg * 13) % 5) - 2) * 1.5);
          const nextY = bby + 4 + (seg % 2);
          // Draw segment
          const dx = nextX - bx;
          const steps = Math.max(Math.abs(dx), nextY - bby);
          for (let s = 0; s <= steps; s++) {
            const px2 = Math.floor(bx + (dx * s) / steps);
            const py = Math.floor(bby + ((nextY - bby) * s) / steps) + by;
            if (px2 >= 0 && px2 < 48 && py >= 0 && py < 48) {
              px(ctx, px2, py, seed < 2 ? "#60e0ffb0" : "#60e0ff60");
              // Glow around bolt
              if (px2 > 0) px(ctx, px2 - 1, py, "#60e0ff20");
              if (px2 < 47) px(ctx, px2 + 1, py, "#60e0ff20");
            }
          }
          bx = nextX;
          bby = nextY;
          if (bby >= 44) break;
        }
      }
    }
    // Static sparks — bright white/cyan dots that flash
    for (let i = 0; i < 12; i++) {
      if ((f * 3 + i * 11) % 7 < 3) {
        const sx = 6 + ((f * 5 + i * 19) % 36);
        const sy = 4 + ((f * 3 + i * 23) % 38);
        if (sx < 48 && sy < 48) {
          px(ctx, sx, sy + by, i % 3 === 0 ? "#ffffff90" : "#60e0ff70");
        }
      }
    }
    // Electric ground crackle
    for (let x = 14; x <= 33; x++) {
      if ((f + x * 5) % 8 < 2) {
        px(ctx, x, 45 + by, "#60e0ff50");
        if ((f + x) % 6 < 1) px(ctx, x, 44 + by, "#ffffff40");
      }
    }
    // Subtle charge glow around character
    for (let i = 0; i < 6; i++) {
      const angle = f * 0.15 + (i / 6) * Math.PI * 2;
      const ax = 24 + Math.floor(Math.cos(angle) * 11);
      const ay = 24 + Math.floor(Math.sin(angle) * 10) + by;
      if (ax >= 0 && ax < 48 && ay >= 0 && ay < 48) {
        px(ctx, ax, ay, "#60e0ff25");
      }
    }
  }
  // ─── SPARKLE TRAIL ───
  else if (id === "power_sparkle") {
    // Dense orbiting sparkles at wide radius with bright trails
    for(let i=0;i<20;i++){
      const speed=0.08+(i%4)*0.02;
      const a=f*speed+(i/20)*Math.PI*2;
      const r=16+(i%3)*4;
      const ox=24+Math.floor(Math.cos(a)*r);const oy=24+Math.floor(Math.sin(a)*r*0.65)+by;
      if(ox>=-16&&ox<64&&oy>=0&&oy<48){
        const colors=["#fff","#ffe080","#80d0ff","#f0a0f0"];
        const c=colors[i%4];
        px(ctx,ox,oy,c);px(ctx,ox,oy-1,c+"80");
        // Trail
        const ta=a-speed*3;const tx=24+Math.floor(Math.cos(ta)*r);const ty=24+Math.floor(Math.sin(ta)*r*0.65)+by;
        if(tx>=-16&&tx<64&&ty>=0&&ty<48)px(ctx,tx,ty,c+"40");
        const ta2=a-speed*5;const tx2=24+Math.floor(Math.cos(ta2)*r);const ty2=24+Math.floor(Math.sin(ta2)*r*0.65)+by;
        if(tx2>=-16&&tx2<64&&ty2>=0&&ty2<48)px(ctx,tx2,ty2,c+"20");
      }
    }
    // Twinkling flashes
    for(let i=0;i<8;i++){if((f+i*5)%7<2){const sx=-8+((f*3+i*11)%56);const sy=2+((f*5+i*17)%42);px(ctx,sx,sy+by,"#fff");}}
    // Ground sparkle pool
    for(let x=10;x<=37;x++){if((x+f)%3===0)px(ctx,x,45+by,"#ffe08040");}
  }
  // ─── LEAF STORM ───
  else if (id === "power_leaves") {
    // Dense swirling leaves at wide radius
    for(let i=0;i<16;i++){
      const speed=0.06+(i%3)*0.03;
      const a=f*speed+(i/16)*Math.PI*2;
      const r=14+(i%4)*3+Math.sin(f*.04+i)*2;
      const ox=24+Math.floor(Math.cos(a)*r);const oy=22+Math.floor(Math.sin(a)*r*0.6)+by;
      if(ox>=-16&&ox<64&&oy>=0&&oy<48){
        const greens=["#40a040","#60c060","#80d060","#308830"];
        const c=greens[i%4];
        px(ctx,ox,oy,c);px(ctx,ox+1,oy,c+"80");
        if(i%3===0){px(ctx,ox,oy+1,c+"60");px(ctx,ox-1,oy,c+"40");}
      }
    }
    // Wind trail lines
    for(let i=0;i<4;i++){
      const wy=10+i*9+Math.floor(Math.sin(f*.1+i)*2);
      for(let x=-10;x<50;x+=3){const wx=x+((f*2+i*5)%6);if(wx>=-16&&wx<64)px(ctx,wx,wy+by,"#60c06015");}
    }
    // Ground foliage
    for(let x=12;x<=35;x+=2)px(ctx,x,45+by,"#40a04030");
  }
  // ─── BUBBLE SHIELD ───
  else if (id === "power_bubbles") {
    // Large visible bubbles floating up at wide spread
    for(let i=0;i<12;i++){
      const seed=i*13+7;
      const bx=4+((seed*7+Math.floor(f*1.5))%40)-4;
      const by2=(seed*5+f*2)%50;const buby=Math.floor(46-by2)+by;
      if(bx>=-16&&bx<64&&buby>=0&&buby<48){
        const size=i%3;
        px(ctx,bx,buby,"#60c0f0");px(ctx,bx+1,buby,"#60c0f0");
        px(ctx,bx,buby-1,"#80d8ff80");px(ctx,bx+1,buby-1,"#80d8ff80");
        if(size>0){px(ctx,bx-1,buby,"#60c0f060");px(ctx,bx+2,buby,"#60c0f060");px(ctx,bx,buby+1,"#60c0f040");}
        if(size>1){px(ctx,bx,buby-2,"#80d8ff40");px(ctx,bx+1,buby-2,"#80d8ff40");}
        px(ctx,bx,buby-1,"#fff8");
      }
    }
    // Shield ring
    for(let i=0;i<24;i++){
      const a=(i/24)*Math.PI*2+f*.04;
      const ox=24+Math.floor(Math.cos(a)*18);const oy=24+Math.floor(Math.sin(a)*15)+by;
      if(ox>=-16&&ox<64&&oy>=0&&oy<48)px(ctx,ox,oy,"#60c0f030");
    }
  }
  // ─── BATTLE ANTHEM ───
  else if (id === "power_music") {
    // Musical notes orbiting widely with pulse waves
    const notes=8;
    for(let i=0;i<notes;i++){
      const a=f*.09+(i/notes)*Math.PI*2;
      const r=16+Math.sin(f*.05+i*2)*3;
      const ox=24+Math.floor(Math.cos(a)*r);const oy=22+Math.floor(Math.sin(a)*r*0.6)+by;
      if(ox>=-16&&ox<64&&oy>=0&&oy<48){
        const colors=["#f060a0","#60a0f0","#f0c040","#60f0a0","#c060f0","#f08060","#80f0f0","#f0f060"];
        const c=colors[i%8];
        px(ctx,ox,oy,c);px(ctx,ox,oy-1,c+"80");px(ctx,ox-1,oy,c+"40");
        if(i%2===0){px(ctx,ox+1,oy,c+"60");}
      }
    }
    // Sound wave arcs expanding outward
    for(let w=0;w<3;w++){
      const wr=8+(f*2+w*12)%24;
      if(wr<24){
        const alpha=Math.floor((1-wr/24)*60).toString(16).padStart(2,'0');
        for(let i=0;i<16;i++){
          const a=(i/16)*Math.PI*2;
          const ox=24+Math.floor(Math.cos(a)*wr);const oy=24+Math.floor(Math.sin(a)*wr*0.6)+by;
          if(ox>=-16&&ox<64&&oy>=0&&oy<48)px(ctx,ox,oy,`#f060a0${alpha}`);
        }
      }
    }
  }
  // ─── FROST AURA ───
  else if (id === "power_snowflake") {
    // Dense snowfall with ice crystals
    for(let i=0;i<18;i++){
      const seed=i*13+7;
      const sx=((seed*3+f*1.5)%52)-4;const sy=((seed*5+f*2.5)%48);
      const drift=Math.sin(f*.06+i)*3;
      if(sx>=-16&&sx<64){
        px(ctx,Math.floor(sx+drift),Math.floor(sy)+by,"#d0e8ff");
        if(i%3===0){px(ctx,Math.floor(sx+drift)+1,Math.floor(sy)+by,"#d0e8ff80");px(ctx,Math.floor(sx+drift),Math.floor(sy)+1+by,"#d0e8ff60");}
        if(i%6===0)px(ctx,Math.floor(sx+drift),Math.floor(sy)+by,"#fff");
      }
    }
    // Frost ring
    for(let i=0;i<20;i++){
      const a=(i/20)*Math.PI*2+f*.03;
      const r=16+Math.sin(a*3)*2;
      const ox=24+Math.floor(Math.cos(a)*r);const oy=24+Math.floor(Math.sin(a)*r*0.65)+by;
      if(ox>=-16&&ox<64&&oy>=0&&oy<48)px(ctx,ox,oy,"#a0d0ff40");
    }
    // Ice ground
    for(let x=8;x<=39;x++){if((x+f)%4<2)px(ctx,x,45+by,"#d0e8ff30");if((x+f)%6===0)px(ctx,x,44+by,"#a0d0ff20");}
    // Crystal spikes at sides
    for(let y=28;y<=44;y+=3){px(ctx,-2+Math.floor(Math.sin(y*.5)*2),y+by,"#d0e8ff30");px(ctx,49+Math.floor(Math.sin(y*.5)*2),y+by,"#d0e8ff30");}
  }
  // ─── HEART PULSE ───
  else if (id === "power_hearts") {
    // Large orbiting hearts with expanding pulse rings
    for(let i=0;i<8;i++){
      const a=f*.06+(i/8)*Math.PI*2;
      const r=16+Math.sin(f*.04+i*2)*3;
      const ox=24+Math.floor(Math.cos(a)*r);const oy=22+Math.floor(Math.sin(a)*r*0.6)+by;
      if(ox>=-16&&ox<64&&oy>=0&&oy<48){
        const c=i%2===0?"#f06080":"#f0a0b0";
        px(ctx,ox-1,oy-1,c);px(ctx,ox+1,oy-1,c);px(ctx,ox-2,oy,c+"80");px(ctx,ox,oy,c);px(ctx,ox+2,oy,c+"80");
        px(ctx,ox-1,oy,c);px(ctx,ox+1,oy,c);px(ctx,ox,oy+1,c+"a0");
      }
    }
    // Expanding pulse rings
    for(let p=0;p<2;p++){
      const pr=6+((f*2+p*10)%24);
      if(pr<24){
        const alpha=Math.floor((1-pr/24)*80).toString(16).padStart(2,'0');
        for(let i=0;i<20;i++){
          const a=(i/20)*Math.PI*2;
          const ox=24+Math.floor(Math.cos(a)*pr);const oy=24+Math.floor(Math.sin(a)*pr*0.6)+by;
          if(ox>=-16&&ox<64&&oy>=0&&oy<48)px(ctx,ox,oy,`#f06080${alpha}`);
        }
      }
    }
  }
  // ─── DATA STREAM ───
  else if (id === "power_matrix") {
    // Dense matrix rain columns extending to margins
    for(let col=0;col<10;col++){
      const cx=-6+col*6;
      const speed=2+(col%3);
      for(let row=0;row<10;row++){
        const cy=(f*speed+col*11+row*5)%52-4;
        const fade=1-row/10;
        const bright=row===0;
        if(cy>=-4&&cy<48){
          if(bright)px(ctx,cx,cy+by,"#80ff80");
          else{const a=Math.floor(fade*80).toString(16).padStart(2,'0');px(ctx,cx,cy+by,`#40c060${a}`);}
        }
      }
    }
    // Horizontal scan line
    const scanY=(f*3)%48;
    for(let x=-10;x<=57;x+=2)px(ctx,x,scanY+by,"#40c06025");
    for(let x=-10;x<=57;x+=2)if(x!==24)px(ctx,x,(scanY+1)%48+by,"#40c06010");
    // Side data streams
    for(let y=0;y<48;y+=4){if((y+f)%8<4){px(ctx,-8,y+by,"#40c06040");px(ctx,55,y+by,"#40c06040");}}
  }
  // ─── SHADOW CLOAK ───
  else if (id === "power_shadow") {
    // Spectral shadow cloak — glowing purple tendrils, teal wisps, ghostly mist
    // Rising spectral tendrils (bright purple/teal)
    for(let i=0;i<8;i++){
      const baseX=-4+i*7;
      const sway=Math.sin(f*.08+i*1.7)*4;
      for(let y=46;y>=10;y--){
        const rise=(46-y)/36;const spread=sway*rise;
        const ax=Math.floor(baseX+spread);
        if(ax>=-16&&ax<64&&rise>0){
          const c=i%2===0?"#b060e0":"#60c0d0";
          if(rise<.3)px(ctx,ax,y+by,c);
          else if(rise<.6){px(ctx,ax,y+by,c+"a0");}
          else px(ctx,ax,y+by,c+"50");
          // Glow beside tendril
          if(rise<.4){px(ctx,ax+1,y+by,c+"40");px(ctx,ax-1,y+by,c+"30");}
        }
      }
    }
    // Ghostly mist pool at ground (bright teal/purple)
    for(let x=-8;x<=55;x++){
      if(x>=-16&&x<64){
        const d=Math.abs(x-24);
        if(d<22){
          const flicker=(x+f)%4<2;
          px(ctx,x,45+by,flicker?"#b060e0":"#60c0d0");
          px(ctx,x,46+by,flicker?"#60c0d080":"#b060e080");
          if(d<14)px(ctx,x,44+by,flicker?"#b060e040":"#60c0d040");
        }
      }
    }
    // Orbiting ghost wisps (bright, multi-pixel)
    for(let i=0;i<6;i++){
      const a=f*.08+i*1.05;const r=14+i*2;
      const ox=24+Math.floor(Math.cos(a)*r);const oy=26+Math.floor(Math.sin(a)*r*0.5)+by;
      if(ox>=-16&&ox<64&&oy>=0&&oy<48){
        const c=i%3===0?"#e0a0ff":i%3===1?"#80e0e0":"#c080f0";
        px(ctx,ox,oy,c);px(ctx,ox+1,oy,c+"80");px(ctx,ox,oy-1,c+"60");
        // Trail
        const ta=a-0.3;const tx=24+Math.floor(Math.cos(ta)*r);const ty=26+Math.floor(Math.sin(ta)*r*0.5)+by;
        if(tx>=-16&&tx<64&&ty>=0&&ty<48)px(ctx,tx,ty,c+"40");
      }
    }
    // Floating spectral particles
    for(let i=0;i<10;i++){
      if((f+i*3)%6<3){
        const sx=-6+((f*2+i*11)%56);const sy=6+((f*3+i*17)%36);
        if(sx>=-16&&sx<64)px(ctx,sx,sy+by,i%2===0?"#e0a0ff":"#80e0e0");
      }
    }
    // Central spectral glow
    if(f%4<2){for(let dx=-2;dx<=2;dx++)for(let dy=-1;dy<=1;dy++)px(ctx,24+dx,36+dy+by,"#b060e018");}
  }
  // ─── ARCANE VORTEX ───
  else if (id === "power_vortex") {
    // Large double magic circles with rune dots
    for(let ring=0;ring<3;ring++){
      const r2=10+ring*6;const speed=(ring===1?-1:1)*(0.08+ring*0.02);
      const count=14+ring*4;
      for(let i=0;i<count;i++){
        const a=f*speed+(i/count)*Math.PI*2;
        const ox=24+Math.floor(Math.cos(a)*r2);const oy=24+Math.floor(Math.sin(a)*r2*0.6)+by;
        if(ox>=-16&&ox<64&&oy>=0&&oy<48){
          const c=ring===0?"#c080f0":ring===1?"#80c0f0":"#d0a0ff";
          px(ctx,ox,oy,c);
          if(i%4===0){px(ctx,ox,oy-1,c+"80");px(ctx,ox+1,oy,c+"60");}
        }
      }
    }
    // Arcane sigil lines connecting rings
    for(let i=0;i<6;i++){
      const a=f*.06+(i/6)*Math.PI*2;
      for(let r=10;r<=22;r+=2){
        const ox=24+Math.floor(Math.cos(a)*r);const oy=24+Math.floor(Math.sin(a)*r*0.6)+by;
        if(ox>=-16&&ox<64&&oy>=0&&oy<48)px(ctx,ox,oy,"#c080f018");
      }
    }
    // Central glow pulse
    const pulse=(Math.sin(f*.15)+1)*2;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)px(ctx,24+dx,24+dy+by,"#c080f0"+Math.floor(20+pulse*10).toString(16).padStart(2,'0'));
  }
  // ─── CHERRY BLOSSOM ───
  else if (id === "power_sakura") {
    // Dense petals drifting across wide area
    for(let i=0;i<20;i++){
      const seed=i*11+5;
      const px2=((seed*7+f*1.2)%60)-8;
      const py=((seed*5+f*1.8)%48);
      const drift=Math.sin(f*.06+i)*4;
      const colors=["#f8b0c0","#f0a0b8","#f8c0d0","#e890a8"];
      const c=colors[i%4];
      const fx=Math.floor(px2+drift);const fy=Math.floor(py)+by;
      if(fx>=-16&&fx<64&&fy>=0&&fy<48){
        px(ctx,fx,fy,c);
        if(i%3===0){px(ctx,fx+1,fy,c+"80");px(ctx,fx,fy+1,c+"60");}
        if(i%5===0){px(ctx,fx-1,fy,c+"40");px(ctx,fx+1,fy+1,c+"30");}
      }
    }
    // Wind streaks
    for(let i=0;i<3;i++){const wy=12+i*10;for(let x=-10;x<55;x+=4){const wx=x+((f*3+i*7)%8);if(wx>=-16&&wx<64)px(ctx,wx,wy+by,"#f8b0c010");}}
    // Ground petal carpet
    for(let x=6;x<=41;x+=2){px(ctx,x,45+by,"#f8b0c030");if(x%4===0)px(ctx,x,44+by,"#f0a0b818");}
  }
  // ─── GALAXY SWIRL ───
  else if (id === "power_galaxy") {
    // Large spiral galaxy with dense star arms
    for(let arm=0;arm<3;arm++){
      for(let i=0;i<30;i++){
        const t=i/30;const a=t*Math.PI*3.5+arm*(Math.PI*2/3)+f*.05;
        const r2=2+t*20;
        const ox=24+Math.floor(Math.cos(a)*r2);const oy=24+Math.floor(Math.sin(a)*r2*0.55)+by;
        if(ox>=-16&&ox<64&&oy>=0&&oy<48){
          const colors=["#4060c0","#6060d0","#8060c0","#c06080","#e08060","#f0a060"];
          const ci=Math.min(5,Math.floor(t*6));
          px(ctx,ox,oy,colors[ci]);
          if(i%3===0)px(ctx,ox+1,oy,colors[ci]+"60");
        }
      }
    }
    // Bright star core
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const d=Math.abs(dx)+Math.abs(dy);px(ctx,24+dx,24+dy+by,d===0?"#fff":"#ffe080a0");}
    // Background stars twinkling
    for(let i=0;i<10;i++){if((f+i*5)%8<3){const sx=-8+((f*3+i*13)%56);const sy=2+((f*5+i*17)%42);if(sx>=-16&&sx<64)px(ctx,sx,sy+by,"#fff");}}
    // Nebula glow
    for(let i=0;i<6;i++){const a=f*.03+i;const ox=24+Math.floor(Math.cos(a)*12);const oy=24+Math.floor(Math.sin(a)*8)+by;if(ox>=-16&&ox<64&&oy>=0&&oy<48)px(ctx,ox,oy,"#8060c020");}
  }
  // ─── PHOENIX FLAME ───
  else if (id === "power_phoenix") {
    // Dramatic fire bird with wide wings of flame
    const wingUp=f%8<4;const ext=wingUp?4:0;
    // Flame wings spreading wide
    for(let y=6;y<=32;y++){
      const wy=(y-6)/26;const w=Math.floor(Math.sin(wy*Math.PI)*(14+ext));
      for(let x=14-w;x<=14;x++){
        if(x>=-16){const fade=(14-x)/(w||1);const c=fade>.7?"#ffed4a":"#f39c12";px(ctx,x,y+by,c+(fade>.5?"50":"30"));}
      }
      for(let x=33;x<=33+w;x++){
        if(x<64){const fade=(x-33)/(w||1);const c=fade>.7?"#ffed4a":"#f39c12";px(ctx,x,y+by,c+(fade>.5?"50":"30"));}
      }
    }
    // Central flame pillar (bright)
    for(let y=0;y<=24;y++){
      const rise=(24-y)/24;const w=Math.floor(2+rise*3+Math.sin(y*.4+f*.2)*1.5);
      for(let dx=-w;dx<=w;dx++){
        const ax=24+dx;if(ax>=-16&&ax<64){
          const d=Math.abs(dx)/(w||1);
          px(ctx,ax,y+by,d<.3?"#fff8e060":d<.6?"#ffed4a40":"#f39c1225");
        }
      }
    }
    // Rising embers
    for(let i=0;i<10;i++){
      const ex=-4+((f*3+i*11)%56);const ey=((f*2+i*7)%24);
      if(ex>=-16&&ex<64)px(ctx,ex,ey+by,i%2===0?"#f39c12":"#ffed4a");
    }
    // Ground fire
    for(let x=6;x<=41;x++){if((x+f)%3<2)px(ctx,x,45+by,"#e67e22");if((x+f)%5===0)px(ctx,x,44+by,"#f39c1280");}
  }
  // ─── GLITCH FIELD ───
  else if (id === "power_glitch") {
    // Large glitch rectangles with color splits
    for(let i=0;i<8;i++){
      const seed=(f*7+i*31)%150;
      const gx=-8+(seed%56);const gy=2+((seed*3)%42);
      const gw=3+seed%5;const gh=1+seed%2;
      for(let dy=0;dy<gh;dy++)for(let dx=0;dx<gw;dx++){
        const cx=gx+dx;if(cx>=-16&&cx<64&&gy+dy>=0&&gy+dy<48){
          const c=i%3===0?"#60d0ff":i%3===1?"#f04040":"#40ff40";
          px(ctx,cx,gy+dy+by,c);
        }
      }
    }
    // RGB split offset lines
    const splitY=(f*4)%48;
    for(let x=-14;x<=61;x++){
      if(x>=-16&&x<64){px(ctx,x,splitY+by,"#60d0ff40");px(ctx,x+1,(splitY+1)%48+by,"#f0404030");px(ctx,x-1,(splitY+2)%48+by,"#40ff4030");}
    }
    // Static noise particles
    for(let i=0;i<15;i++){const nx=(f*13+i*29)%60-6;const ny=(f*17+i*23)%44+2;if(nx>=-16&&nx<64)px(ctx,nx,ny+by,i%2===0?"#fff":"#60d0ff");}
    // Corruption zones at edges
    for(let i=0;i<4;i++){const gy=8+i*10;if((f+i)%3===0){px(ctx,-10,gy+by,"#f04040");px(ctx,57,gy+by,"#40ff40");}}
  }
  // ─── VOID RIFT ───
  else if (id === "power_void") {
    // Large dark vortex with pulling particles
    for(let ring=0;ring<4;ring++){
      const r2=6+ring*5;const speed=.08+ring*.02;const dir=ring%2===0?1:-1;
      const count=16+ring*4;
      for(let i=0;i<count;i++){
        const a=f*speed*dir+(i/count)*Math.PI*2;
        const ox=24+Math.floor(Math.cos(a)*r2);const oy=24+Math.floor(Math.sin(a)*r2*0.65)+by;
        if(ox>=-16&&ox<64&&oy>=0&&oy<48){
          const c=ring<3?["#201038","#401860","#6030a0"][ring]:"#8040c0";
          px(ctx,ox,oy,c);
          if(i%4===0)px(ctx,ox+1,oy,c+"80");
        }
      }
    }
    // Central void eye (dark core)
    for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<=3){px(ctx,24+dx,24+dy+by,d<1.5?"#080418":"#100828");}
    }
    // Sucked-in particles spiraling inward
    for(let i=0;i<8;i++){
      const a=f*.12+i*0.78;
      const lifeT=((f+i*8)%20)/20;
      const r=20*(1-lifeT);
      const ox=24+Math.floor(Math.cos(a)*r);const oy=24+Math.floor(Math.sin(a)*r*0.6)+by;
      if(ox>=-16&&ox<64&&oy>=0&&oy<48){
        const c=lifeT<.5?"#c080f0":"#8040c0";
        px(ctx,ox,oy,c);if(lifeT<.3)px(ctx,ox+1,oy,c+"60");
      }
    }
    // Edge distortion
    for(let i=0;i<6;i++){const ey=6+i*7;px(ctx,-6+(f%4),ey+by,"#401860");px(ctx,53-(f%4),ey+by,"#401860");}
  }
  // ─── PRISMATIC / RAINBOW ───
  else if (id === "power_rainbow") {
    // Large rainbow concentric rings with bright colors
    const colors=["#ff4040","#ff8020","#f0d040","#40c060","#4080f0","#8040c0"];
    for(let ci=0;ci<6;ci++){
      const r2=14+ci*1.5;const count=24;
      for(let i=0;i<count;i++){
        const a=f*.04+ci*.2+(i/count)*Math.PI*2;
        const ox=24+Math.floor(Math.cos(a)*r2);const oy=24+Math.floor(Math.sin(a)*r2*0.6)+by;
        if(ox>=-16&&ox<64&&oy>=0&&oy<48){
          px(ctx,ox,oy,colors[ci]);
          if(i%3===0)px(ctx,ox,oy-1,colors[ci]+"60");
        }
      }
    }
    // Prismatic rays shooting outward
    for(let i=0;i<6;i++){
      const a=f*.06+(i/6)*Math.PI*2;
      for(let r=10;r<=22;r++){
        const ox=24+Math.floor(Math.cos(a)*r);const oy=24+Math.floor(Math.sin(a)*r*0.6)+by;
        if(ox>=-16&&ox<64&&oy>=0&&oy<48)px(ctx,ox,oy,colors[i]+"40");
      }
    }
    // Sparkles
    for(let i=0;i<8;i++){if((f+i*4)%6<2){const sx=-6+((f*3+i*13)%56);const sy=4+((f*5+i*17)%38);if(sx>=-16&&sx<64)px(ctx,sx,sy+by,colors[i%6]);}}
    // Ground rainbow shimmer
    for(let x=6;x<=41;x++)px(ctx,x,45+by,colors[(x+f)%6]+"40");
  }
}

