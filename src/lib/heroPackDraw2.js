// src/lib/heroPackDraw2.js
// Remaining hero pack draw functions — auto-registers on import
// Must import AFTER heroPack.js

import { registerClassDraw, px, drawHead } from "./pixelArt";

function heroBody(ctx, cl, by, hw, yS, yE) {
  for (let y = yS; y <= yE; y++) for (let x = 24-hw; x <= 23+hw; x++) {
    let c=cl.robe; if(x<24-hw+2)c=cl.robeDark; else if(x>23+hw-2)c=cl.robeLight;
    px(ctx,x,y+by,c);
  }
}

function drawBlinker(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  heroBody(ctx,cl,by,5,22,40);
  for(let y=24;y<=38;y+=2){px(ctx,19,y+by,cl.accent);px(ctx,28,y+by,cl.accent);}
  for(let y=40;y<=44;y++){for(let x=19;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=28;x++)px(ctx,x,y+by,cl.robeDark);}
  for(let y=23;y<=35;y++){px(ctx,16,y+by,cl.robeDark);px(ctx,17,y+by,cl.robe);px(ctx,30,y+by,cl.robe);px(ctx,31,y+by,cl.robeLight);}
  for(let y=12;y<=36;y++){px(ctx,14,y+by,"#c0c0d8");px(ctx,33,y+by,"#c0c0d8");}
  px(ctx,14,11+by,"#e0e0f0");px(ctx,33,11+by,"#e0e0f0");
  // Tail
  px(ctx,22,42+by,cl.robe);px(ctx,20,43+by,cl.robe);px(ctx,18,44+by,cl.robe);
  px(ctx,16,44+by,cl.robeLight);px(ctx,15,43+by,cl.robeLight);
  // Blue head with elf ears + yellow eyes
  for(let x=18;x<=29;x++)for(let y=6;y<=19;y++){let c=cl.robe;if(y<=7)c=cl.robeLight;else if(y>=18)c=cl.robeDark;px(ctx,x,y+by,c);}
  px(ctx,16,10+by,cl.robe);px(ctx,15,9+by,cl.robeLight);px(ctx,31,10+by,cl.robe);px(ctx,32,9+by,cl.robeLight);
  px(ctx,20,12+by,"#f0d040");px(ctx,21,12+by,"#f0d040");px(ctx,26,12+by,"#f0d040");px(ctx,27,12+by,"#f0d040");
  px(ctx,20,13+by,"#000");px(ctx,27,13+by,"#000");
  if(f%6<3){px(ctx,12+(f%8),20+by,"#8040c060");px(ctx,30-(f%6),38+by,"#8040c060");}
}

function drawWebslinger(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  heroBody(ctx,cl,by,5,22,42);
  for(let y=34;y<=44;y++)for(let x=18;x<=29;x++){if(x<=20||x>=27)px(ctx,x,y+by,cl.accent);}
  for(let y=24;y<=32;y+=2){px(ctx,21,y+by,cl.robeDark);px(ctx,26,y+by,cl.robeDark);}
  for(let x=20;x<=27;x+=2)px(ctx,x,28+by,cl.robeDark);
  for(let y=23;y<=35;y++){px(ctx,16,y+by,cl.robeDark);px(ctx,17,y+by,cl.robe);px(ctx,30,y+by,cl.accent);px(ctx,31,y+by,cl.accent);}
  if(f%8<5){for(let y=4;y<=20;y++)px(ctx,14-Math.floor((20-y)*.3),y+by,"#c0c0c040");}
  for(let x=17;x<=30;x++)for(let y=4;y<=19;y++){let c=cl.robe;if(y<=5||x<=18||x>=29)c=cl.robeDark;px(ctx,x,y+by,c);}
  for(let x=19;x<=22;x++)for(let y=10;y<=14;y++)px(ctx,x,y+by,"#fff");
  for(let x=25;x<=28;x++)for(let y=10;y<=14;y++)px(ctx,x,y+by,"#fff");
  for(let x=19;x<=22;x++){px(ctx,x,9+by,cl.robeDark);px(ctx,x,15+by,cl.robeDark);}
  for(let x=25;x<=28;x++){px(ctx,x,9+by,cl.robeDark);px(ctx,x,15+by,cl.robeDark);}
  px(ctx,18,11+by,cl.robeDark);px(ctx,18,13+by,cl.robeDark);px(ctx,29,11+by,cl.robeDark);px(ctx,29,13+by,cl.robeDark);
}

function drawShellstrike(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=14;x<=33;x++)px(ctx,x,46,"#0004");
  // Shell
  for(let x=16;x<=31;x++)for(let y=18;y<=38;y++){let c="#705830";if(x<=18||x>=29)c="#604820";if(y<=20||y>=36)c="#604820";px(ctx,x,y+by,c);}
  px(ctx,23,24+by,"#503818");px(ctx,24,24+by,"#503818");px(ctx,20,28+by,"#503818");px(ctx,27,28+by,"#503818");px(ctx,23,32+by,"#503818");px(ctx,24,32+by,"#503818");
  // Green front
  for(let y=22;y<=40;y++)for(let x=19;x<=28;x++){let c=cl.robe;if(x<=20)c=cl.robeDark;px(ctx,x,y+by,c);}
  // Plastron
  for(let y=24;y<=36;y++)for(let x=21;x<=26;x++)px(ctx,x,y+by,"#d0b060");
  for(let x=18;x<=29;x++)px(ctx,x,34+by,"#604020");px(ctx,23,34+by,cl.accent);px(ctx,24,34+by,cl.accent);
  for(let y=38;y<=44;y++){for(let x=17;x<=22;x++)px(ctx,x,y+by,cl.robe);for(let x=25;x<=30;x++)px(ctx,x,y+by,cl.robe);}
  for(let y=23;y<=35;y++){px(ctx,14,y+by,cl.robeDark);px(ctx,15,y+by,cl.robe);px(ctx,32,y+by,cl.robe);px(ctx,33,y+by,cl.robeLight);}
  for(let y=14;y<=36;y++){px(ctx,12,y+by,"#808080");px(ctx,35,y+by,"#808080");}
  // Head
  for(let x=18;x<=29;x++)for(let y=6;y<=19;y++){let c=cl.robe;if(y<=7)c=cl.robeLight;else if(y>=18)c=cl.robeDark;px(ctx,x,y+by,c);}
  for(let x=17;x<=30;x++)for(let y=10;y<=13;y++)px(ctx,x,y+by,cl.accent);
  for(let x=19;x<=22;x++)px(ctx,x,11+by,"#fff");for(let x=25;x<=28;x++)px(ctx,x,11+by,"#fff");
  px(ctx,21,12+by,"#000");px(ctx,27,12+by,"#000");
  px(ctx,22,16+by,"#205020");px(ctx,23,16+by,cl.robeDark);px(ctx,24,16+by,cl.robeDark);px(ctx,25,16+by,"#205020");
}

function drawSparkpaw(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  // Round body
  for(let y=22;y<=38;y++){const hw=Math.floor(6-Math.abs(y-30)*.3);for(let x=24-hw;x<=23+hw;x++){let c=cl.robe;if(x<=24-hw+1)c=cl.robeDark;else if(x>=23+hw-1)c=cl.robeLight;px(ctx,x,y+by,c);}}
  // Red cheeks
  px(ctx,18,16+by,cl.accent);px(ctx,19,16+by,cl.accent);px(ctx,28,16+by,cl.accent);px(ctx,29,16+by,cl.accent);
  // Feet
  px(ctx,20,39+by,cl.robeDark);px(ctx,21,39+by,cl.robeDark);px(ctx,26,39+by,cl.robeDark);px(ctx,27,39+by,cl.robeDark);
  // Arms
  for(let y=26;y<=32;y++){px(ctx,16,y+by,cl.robeDark);px(ctx,31,y+by,cl.robeLight);}
  // Lightning tail
  px(ctx,32,30+by,cl.robe);px(ctx,34,28+by,cl.robe);px(ctx,36,26+by,cl.robe);px(ctx,35,24+by,cl.robe);px(ctx,37,22+by,cl.robe);px(ctx,38,20+by,cl.robe);px(ctx,37,18+by,cl.robeDark);px(ctx,36,20+by,cl.robeDark);
  // Big round head
  for(let x=17;x<=30;x++)for(let y=8;y<=20;y++){let c=cl.robe;if(y<=9)c=cl.robeLight;else if(y>=19)c=cl.robeDark;px(ctx,x,y+by,c);}
  // Cute eyes
  for(let x=19;x<=21;x++)for(let y=12;y<=15;y++)px(ctx,x,y+by,"#000");
  for(let x=26;x<=28;x++)for(let y=12;y<=15;y++)px(ctx,x,y+by,"#000");
  px(ctx,20,12+by,"#fff");px(ctx,27,12+by,"#fff");
  px(ctx,23,15+by,"#000");px(ctx,24,15+by,"#000");
  px(ctx,22,17+by,cl.robeDark);px(ctx,25,17+by,cl.robeDark);
  // Long ears with black tips
  px(ctx,18,7+by,cl.robe);px(ctx,17,5+by,cl.robe);px(ctx,16,3+by,cl.robe);px(ctx,15,1+by,"#000");
  px(ctx,29,7+by,cl.robe);px(ctx,30,5+by,cl.robe);px(ctx,31,3+by,cl.robe);px(ctx,32,1+by,"#000");
  // Sparks
  if(f%4<2){px(ctx,14,28+by,"#60d0ff80");px(ctx,33,26+by,"#60d0ff80");}
}

function drawBlazewing(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=12;x<=35;x++)px(ctx,x,46,"#0004");
  const wUp=f%6<3;
  // Wings
  for(let y=12;y<=28;y++){px(ctx,10-(wUp?1:0),y+by,cl.robeDark);px(ctx,9-(wUp?2:0),y+by,cl.robe);px(ctx,37+(wUp?1:0),y+by,cl.robeDark);px(ctx,38+(wUp?2:0),y+by,cl.robe);}
  if(wUp){px(ctx,7,14+by,cl.robeLight);px(ctx,40,14+by,cl.robeLight);}
  // Body
  for(let y=18;y<=40;y++)for(let x=17;x<=30;x++){let c=cl.robe;if(x<=18)c=cl.robeDark;else if(x>=29)c=cl.robeLight;px(ctx,x,y+by,c);}
  // Belly
  for(let y=24;y<=36;y++)for(let x=20;x<=27;x++)px(ctx,x,y+by,"#f0d070");
  // Legs
  for(let y=38;y<=44;y++){for(let x=17;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=30;x++)px(ctx,x,y+by,cl.robeDark);}
  // Arms/claws
  for(let y=24;y<=34;y++){px(ctx,13,y+by,cl.robe);px(ctx,14,y+by,cl.robe);px(ctx,33,y+by,cl.robe);px(ctx,34,y+by,cl.robe);}
  px(ctx,12,34+by,"#fff");px(ctx,35,34+by,"#fff");
  // Dragon head
  for(let x=18;x<=29;x++)for(let y=6;y<=17;y++){let c=cl.robe;if(y<=7)c=cl.robeLight;px(ctx,x,y+by,c);}
  for(let x=28;x<=32;x++)for(let y=12;y<=15;y++)px(ctx,x,y+by,cl.robe);
  px(ctx,21,10+by,"#fff");px(ctx,22,10+by,"#2050a0");px(ctx,22,11+by,"#000");
  px(ctx,26,10+by,"#fff");px(ctx,27,10+by,"#2050a0");px(ctx,27,11+by,"#000");
  px(ctx,19,5+by,cl.robeDark);px(ctx,19,4+by,cl.robe);px(ctx,28,5+by,cl.robeDark);px(ctx,28,4+by,cl.robe);
  // Fire tail
  const fl=f%3;
  px(ctx,16,38+by,cl.robe);px(ctx,14,36+by,cl.robe);px(ctx,12,34+by,"#e67e22");
  if(fl===0){px(ctx,11,33+by,"#f39c12");px(ctx,10,32+by,"#ffed4a");}
  else if(fl===1){px(ctx,11,32+by,"#f39c12");px(ctx,12,33+by,"#ffed4a");}
  else{px(ctx,10,33+by,"#ffed4a");px(ctx,11,34+by,"#f39c12");}
  if(f%12<3){px(ctx,33,13+by,"#e67e22");px(ctx,34,13+by,"#f39c12");px(ctx,35,12+by,"#ffed4a");}
}

function drawThornbeast(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=10;x<=37;x++)px(ctx,x,46,"#0004");
  // Flower/plant on back
  for(let x=16;x<=31;x++)for(let y=8;y<=20;y++){const d=Math.sqrt((x-23.5)**2+(y-14)**2);if(d<8){let c=cl.accent;if(d<4)c="#e05070";if(d<2)c="#f0c040";px(ctx,x,y+by,c);}}
  px(ctx,14,14+by,cl.robeLight);px(ctx,13,12+by,cl.robeLight);px(ctx,12,10+by,cl.robe);
  px(ctx,33,14+by,cl.robeLight);px(ctx,34,12+by,cl.robeLight);px(ctx,35,10+by,cl.robe);
  // Wide body
  for(let y=22;y<=40;y++)for(let x=15;x<=32;x++){let c=cl.robe;if(x<=16)c=cl.robeDark;else if(x>=31)c=cl.robeLight;px(ctx,x,y+by,c);}
  // Spots
  px(ctx,18,28+by,cl.robeDark);px(ctx,22,32+by,cl.robeDark);px(ctx,28,26+by,cl.robeDark);px(ctx,26,34+by,cl.robeDark);
  // 4 stubby legs
  for(let y=40;y<=44;y++){
    px(ctx,16,y+by,cl.robeDark);px(ctx,17,y+by,cl.robe);px(ctx,18,y+by,cl.robe);
    px(ctx,22,y+by,cl.robe);px(ctx,23,y+by,cl.robe);px(ctx,24,y+by,cl.robe);
    px(ctx,28,y+by,cl.robe);px(ctx,29,y+by,cl.robe);px(ctx,30,y+by,cl.robe);
  }
  // Head
  for(let x=19;x<=28;x++)for(let y=14;y<=22;y++){let c=cl.robe;if(y<=15)c=cl.robeLight;px(ctx,x,y+by,c);}
  px(ctx,21,17+by,"#c03030");px(ctx,22,17+by,"#000");px(ctx,26,17+by,"#c03030");px(ctx,27,17+by,"#000");
  px(ctx,23,19+by,cl.robeDark);px(ctx,24,19+by,cl.robeDark);
  // Vine whips
  const vw=f%4<2;
  px(ctx,12,30+by,cl.robe);px(ctx,10,28+by,cl.robeLight);px(ctx,8-(vw?1:0),26+by,cl.robe);
  px(ctx,35,30+by,cl.robe);px(ctx,37,28+by,cl.robeLight);px(ctx,39+(vw?1:0),26+by,cl.robe);
}

function drawTidalshell(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=10;x<=37;x++)px(ctx,x,46,"#0004");
  // Shell with cannons
  for(let x=14;x<=33;x++)for(let y=14;y<=34;y++){let c="#705830";if(x<=16||x>=31)c="#604820";if(y<=16||y>=32)c="#604820";px(ctx,x,y+by,c);}
  // Cannon barrels
  for(let y=10;y<=18;y++){px(ctx,17,y+by,"#808898");px(ctx,18,y+by,"#909aa8");px(ctx,29,y+by,"#808898");px(ctx,30,y+by,"#909aa8");}
  px(ctx,17,9+by,"#606878");px(ctx,18,9+by,"#606878");px(ctx,29,9+by,"#606878");px(ctx,30,9+by,"#606878");
  // Water blast
  if(f%8<3){px(ctx,17,8+by,"#60a0e0");px(ctx,18,7+by,"#80c0f0");px(ctx,30,8+by,"#60a0e0");px(ctx,29,7+by,"#80c0f0");}
  // Body
  for(let y=22;y<=40;y++)for(let x=16;x<=31;x++){let c=cl.robe;if(x<=17)c=cl.robeDark;else if(x>=30)c=cl.robeLight;px(ctx,x,y+by,c);}
  // Belly
  for(let y=26;y<=36;y++)for(let x=20;x<=27;x++)px(ctx,x,y+by,"#d0c890");
  // Legs (heavy)
  for(let y=38;y<=44;y++){for(let x=15;x<=21;x++)px(ctx,x,y+by,cl.robeDark);for(let x=26;x<=32;x++)px(ctx,x,y+by,cl.robeDark);}
  // Arms
  for(let y=24;y<=36;y++){px(ctx,12,y+by,cl.robeDark);px(ctx,13,y+by,cl.robe);px(ctx,34,y+by,cl.robe);px(ctx,35,y+by,cl.robeLight);}
  px(ctx,11,36+by,"#fff");px(ctx,12,37+by,"#fff");px(ctx,36,36+by,"#fff");px(ctx,35,37+by,"#fff");
  // Head
  for(let x=19;x<=28;x++)for(let y=14;y<=22;y++){let c=cl.robe;if(y<=15)c=cl.robeLight;else if(y>=21)c=cl.robeDark;px(ctx,x,y+by,c);}
  px(ctx,21,17+by,"#c03030");px(ctx,22,17+by,"#000");px(ctx,26,17+by,"#c03030");px(ctx,27,17+by,"#000");
  px(ctx,23,20+by,cl.robeDark);px(ctx,24,20+by,cl.robeDark);
  // Ears
  px(ctx,18,15+by,cl.robe);px(ctx,29,15+by,cl.robe);
}

// ═══════════════════════════════════════
// REGISTER BATCH 2
// ═══════════════════════════════════════
registerClassDraw("blinker", drawBlinker);
registerClassDraw("webslinger", drawWebslinger);
registerClassDraw("shellstrike", drawShellstrike);
registerClassDraw("sparkpaw", drawSparkpaw);
registerClassDraw("blazewing", drawBlazewing);
registerClassDraw("thornbeast", drawThornbeast);
registerClassDraw("tidalshell", drawTidalshell);
