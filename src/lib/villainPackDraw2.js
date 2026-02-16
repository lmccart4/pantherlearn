// src/lib/villainPackDraw2.js
// Remaining villain pack draw functions — auto-registers on import

import { registerClassDraw, px, drawHead } from "./pixelArt";

function heroBody(ctx, cl, by, hw, yS, yE) {
  for(let y=yS;y<=yE;y++)for(let x=24-hw;x<=23+hw;x++){
    let c=cl.robe;if(x<24-hw+2)c=cl.robeDark;else if(x>23+hw-2)c=cl.robeLight;
    px(ctx,x,y+by,c);
  }
}

// ─── STEELTYRANT (Dr. Doom) ───
function drawSteeltyrant(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=14;x<=33;x++)px(ctx,x,46,"#0004");
  // Green cloak/hood
  for(let y=8+by;y<=44+by;y++){const s=Math.floor((y-8)*.25);for(let x=12-s;x<=14;x++)if(x>=4)px(ctx,x,y,cl.robe);for(let x=33;x<=35+s;x++)if(x<=43)px(ctx,x,y,cl.robe);}
  // Hood
  for(let x=15;x<=32;x++)for(let y=2;y<=10;y++){let c=cl.robe;if(y<=3)c=cl.robeLight;else if(x<=16||x>=31)c=cl.robeDark;px(ctx,x,y+by,c);}
  // Metal armor body
  for(let y=22;y<=40;y++)for(let x=17;x<=30;x++){let c="#808898";if(x<=18)c="#606878";else if(x>=29)c="#a0a8b8";px(ctx,x,y+by,c);}
  // Belt + tunic
  for(let x=17;x<=30;x++)px(ctx,x,33+by,cl.accent);
  for(let y=34;y<=40;y++)for(let x=19;x<=28;x++)px(ctx,x,y+by,cl.robe);
  // Legs
  for(let y=40;y<=44;y++){for(let x=17;x<=22;x++)px(ctx,x,y+by,"#606878");for(let x=25;x<=30;x++)px(ctx,x,y+by,"#606878");}
  // Arms
  for(let y=23;y<=36;y++){px(ctx,14,y+by,"#606878");px(ctx,15,y+by,"#808898");px(ctx,32,y+by,"#808898");px(ctx,33,y+by,"#a0a8b8");}
  // Gauntlets
  for(let x=13;x<=16;x++)for(let y=34;y<=38;y++)px(ctx,x,y+by,"#a0a8b8");
  for(let x=31;x<=34;x++)for(let y=34;y<=38;y++)px(ctx,x,y+by,"#a0a8b8");
  // Metal mask face
  for(let x=18;x<=29;x++)for(let y=10;y<=19;y++){let c="#909aa8";if(y<=11)c="#a0a8b8";else if(y>=18)c="#808898";px(ctx,x,y+by,c);}
  // Eye slits
  for(let x=19;x<=22;x++)px(ctx,x,13+by,"#202838");for(let x=25;x<=28;x++)px(ctx,x,13+by,"#202838");
  // Mouth grill
  for(let x=21;x<=26;x+=2)for(let y=16;y<=18;y++)px(ctx,x,y+by,"#606878");
  // Rivets
  px(ctx,18,12+by,"#c0c8d0");px(ctx,29,12+by,"#c0c8d0");px(ctx,18,17+by,"#c0c8d0");px(ctx,29,17+by,"#c0c8d0");
  // Energy glow from hand
  if(f%6<3){px(ctx,12,36+by,"#40c060");px(ctx,11,35+by,"#40c06080");}
}

// ─── PSYBORN (Mewtwo) ───
function drawPsyborn(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  // Psychic aura glow behind
  const aF=f*.1;
  for(let i=0;i<6;i++){const a=aF+(i/6)*Math.PI*2;const ax=24+Math.floor(Math.cos(a)*12);const ay=24+Math.floor(Math.sin(a)*10)+by;if(ax>=0&&ax<48&&ay>=0&&ay<48)px(ctx,ax,ay,"#c080f030");}
  // Slim body — white/light purple
  for(let y=22;y<=40;y++){const hw=4+Math.floor(Math.sin((y-22)*.15)*1);for(let x=24-hw;x<=23+hw;x++){let c=cl.accent;if(x<=24-hw+1)c="#b8b8d0";px(ctx,x,y+by,c);}}
  // Chest purple
  for(let y=24;y<=30;y++)for(let x=21;x<=26;x++)px(ctx,x,y+by,cl.robe);
  // Tail — long, curves down and right
  px(ctx,26,40+by,cl.robe);px(ctx,28,41+by,cl.robe);px(ctx,30,42+by,cl.robe);
  px(ctx,32,42+by,cl.robeLight);px(ctx,34,41+by,cl.robeLight);px(ctx,36,40+by,cl.robeLight);
  px(ctx,37,39+by,cl.robe);px(ctx,38,38+by,cl.robe);
  // Tail tip bulb
  px(ctx,39,37+by,cl.robeLight);px(ctx,39,38+by,cl.robe);
  // Legs
  for(let y=38;y<=44;y++){for(let x=19;x<=22;x++)px(ctx,x,y+by,cl.accent);for(let x=25;x<=28;x++)px(ctx,x,y+by,cl.accent);}
  px(ctx,18,44+by,cl.robe);px(ctx,19,44+by,cl.robe);px(ctx,28,44+by,cl.robe);px(ctx,29,44+by,cl.robe);
  // Arms
  for(let y=24;y<=34;y++){px(ctx,16,y+by,cl.accent);px(ctx,31,y+by,cl.accent);}
  // Fingers/orbs
  px(ctx,15,34+by,cl.robe);px(ctx,32,34+by,cl.robe);
  // Psychic energy in hands
  if(f%4<2){px(ctx,14,33+by,"#c080f060");px(ctx,33,33+by,"#c080f060");}
  // Head — large, feline
  for(let x=17;x<=30;x++)for(let y=4;y<=20;y++){let c=cl.accent;if(y<=5)c="#e0e0f0";else if(y>=19)c="#c0c0d0";if(x<=18||x>=29)c=cl.robe;px(ctx,x,y+by,c);}
  // Eyes — large purple
  for(let x=19;x<=22;x++)for(let y=10;y<=13;y++)px(ctx,x,y+by,cl.robe);
  for(let x=25;x<=28;x++)for(let y=10;y<=13;y++)px(ctx,x,y+by,cl.robe);
  px(ctx,20,11+by,"#fff");px(ctx,27,11+by,"#fff");
  // Tube on back of head
  px(ctx,23,3+by,cl.robe);px(ctx,24,3+by,cl.robe);px(ctx,23,2+by,cl.robeLight);px(ctx,24,2+by,cl.robeLight);
  // Ear ridges
  px(ctx,16,8+by,cl.robe);px(ctx,15,7+by,cl.robe);px(ctx,31,8+by,cl.robe);px(ctx,32,7+by,cl.robe);
  // Floating stance — feet off ground
  if(f%8<4)for(let x=19;x<=28;x++)px(ctx,x,46,"#c080f010");
}

// ─── HEXGLIDER (Green Goblin) ───
function drawHexglider(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=12;x<=35;x++)px(ctx,x,46,"#0004");
  // Glider platform under feet
  for(let x=12;x<=35;x++)for(let y=42;y<=44;y++){let c="#808898";if(y===42)c="#a0a8b8";px(ctx,x,y+by,c);}
  // Glider wings
  for(let x=8;x<=14;x++)px(ctx,x,43+by,"#606878");for(let x=33;x<=39;x++)px(ctx,x,43+by,"#606878");
  px(ctx,7,42+by,"#808898");px(ctx,40,42+by,"#808898");
  // Thruster glow
  if(f%4<2){px(ctx,20,45+by,"#f09020");px(ctx,27,45+by,"#f09020");px(ctx,20,46,"#f0902040");px(ctx,27,46,"#f0902040");}
  // Green armored body
  heroBody(ctx,cl,by,6,22,40);
  // Purple accents
  for(let x=18;x<=29;x++)px(ctx,x,22+by,cl.accent);for(let x=18;x<=29;x++)px(ctx,x,34+by,cl.accent);
  // Belt bag (satchel)
  px(ctx,28,35+by,"#806020");px(ctx,29,35+by,"#806020");px(ctx,28,36+by,"#906830");px(ctx,29,36+by,"#906830");
  // Legs on glider
  for(let y=36;y<=41;y++){for(let x=19;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=28;x++)px(ctx,x,y+by,cl.robeDark);}
  // Arms
  for(let y=23;y<=35;y++){px(ctx,15,y+by,cl.robeDark);px(ctx,16,y+by,cl.robe);px(ctx,31,y+by,cl.robe);px(ctx,32,y+by,cl.robeLight);}
  // Pumpkin bomb in hand
  px(ctx,13,34+by,"#d08020");px(ctx,14,34+by,"#e09030");px(ctx,13,35+by,"#e09030");px(ctx,14,35+by,"#d08020");
  if(f%8<3)px(ctx,13,33+by,"#40c04060"); // fuse glow
  // Goblin mask/helmet
  for(let x=17;x<=30;x++)for(let y=4;y<=19;y++){let c=cl.robe;if(y<=6)c=cl.robeLight;else if(y>=17)c=cl.robeDark;px(ctx,x,y+by,c);}
  // Pointed ears
  px(ctx,15,8+by,cl.robe);px(ctx,14,7+by,cl.robeLight);px(ctx,32,8+by,cl.robe);px(ctx,33,7+by,cl.robeLight);
  // Yellow eyes (menacing)
  for(let x=19;x<=22;x++)px(ctx,x,11+by,"#f0d040");for(let x=25;x<=28;x++)px(ctx,x,11+by,"#f0d040");
  px(ctx,21,12+by,"#c03030");px(ctx,27,12+by,"#c03030");
  // Grin
  for(let x=20;x<=27;x++)px(ctx,x,16+by,cl.robeDark);px(ctx,21,16+by,"#fff");px(ctx,24,16+by,"#fff");px(ctx,26,16+by,"#fff");
  // Helmet crest
  for(let x=20;x<=27;x++)px(ctx,x,3+by,cl.accent);px(ctx,23,2+by,cl.accent);px(ctx,24,2+by,cl.accent);
}

// ─── FROSTLORD (Frieza) ───
function drawFrostlord(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  // Sleek alien body — white/purple
  for(let y=22;y<=40;y++){const hw=4;for(let x=24-hw;x<=23+hw;x++){let c=cl.robe;if(x<=24-hw+1)c=cl.robeDark;else if(x>=23+hw-1)c=cl.robeLight;px(ctx,x,y+by,c);}}
  // Chest armor plate
  for(let y=24;y<=32;y++)for(let x=20;x<=27;x++){let c=cl.accent;if(y<=25)c=cl.robeLight;px(ctx,x,y+by,c);}
  // Gem on chest
  px(ctx,23,27+by,"#f040a0");px(ctx,24,27+by,"#f040a0");
  // Legs
  for(let y=38;y<=44;y++){for(let x=19;x<=22;x++)px(ctx,x,y+by,cl.robe);for(let x=25;x<=28;x++)px(ctx,x,y+by,cl.robe);}
  // Arms slim
  for(let y=24;y<=34;y++){px(ctx,16,y+by,cl.robeDark);px(ctx,17,y+by,cl.robe);px(ctx,30,y+by,cl.robe);px(ctx,31,y+by,cl.robeLight);}
  // Tail curling behind
  px(ctx,22,42+by,cl.robe);px(ctx,20,43+by,cl.robe);px(ctx,18,44+by,cl.robe);
  px(ctx,16,44+by,cl.accent);px(ctx,15,43+by,cl.accent);
  // Head — dome shape, no hair
  for(let x=17;x<=30;x++)for(let y=6;y<=19;y++){let c=cl.robe;if(y<=7)c=cl.robeLight;else if(y>=18)c=cl.robeDark;px(ctx,x,y+by,c);}
  // Purple patches on head
  for(let x=18;x<=21;x++)for(let y=6;y<=9;y++)px(ctx,x,y+by,cl.accent);
  for(let x=26;x<=29;x++)for(let y=6;y<=9;y++)px(ctx,x,y+by,cl.accent);
  // Red eyes
  px(ctx,20,12+by,"#c03030");px(ctx,21,12+by,"#c03030");px(ctx,26,12+by,"#c03030");px(ctx,27,12+by,"#c03030");
  px(ctx,21,13+by,"#000");px(ctx,27,13+by,"#000");
  // Black lips
  px(ctx,22,16+by,cl.robeDark);px(ctx,23,16+by,cl.robeDark);px(ctx,24,16+by,cl.robeDark);px(ctx,25,16+by,cl.robeDark);
  // Horns
  px(ctx,16,7+by,cl.accent);px(ctx,15,6+by,cl.accent);px(ctx,14,5+by,cl.accent);
  px(ctx,31,7+by,cl.accent);px(ctx,32,6+by,cl.accent);px(ctx,33,5+by,cl.accent);
  // Energy charge
  if(f%8<3){px(ctx,15,34+by,"#f040a060");px(ctx,32,34+by,"#f040a060");}
}

// ─── NIGHTCLAW (Catwoman) ───
function drawNightclaw(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=16;x<=31;x++)px(ctx,x,46,"#0004");
  // Sleek black bodysuit
  for(let y=22;y<=44;y++){const hw=4;for(let x=24-hw;x<=23+hw;x++){let c=cl.robe;if(x<=24-hw+1)c=cl.robeDark;else if(x>=23+hw-1)c=cl.robeLight;px(ctx,x,y+by,c);}}
  // Belt
  for(let x=20;x<=27;x++)px(ctx,x,33+by,cl.accent);px(ctx,23,34+by,cl.accent);px(ctx,24,34+by,cl.accent);
  // Fitted legs
  for(let y=38;y<=44;y++){for(let x=19;x<=22;x++)px(ctx,x,y+by,cl.robeDark);for(let x=25;x<=28;x++)px(ctx,x,y+by,cl.robeDark);}
  // High boots
  for(let x=18;x<=22;x++)px(ctx,x,44+by,cl.robe);for(let x=25;x<=29;x++)px(ctx,x,44+by,cl.robe);
  // Arms
  for(let y=23;y<=34;y++){px(ctx,16,y+by,cl.robeDark);px(ctx,17,y+by,cl.robe);px(ctx,30,y+by,cl.robe);px(ctx,31,y+by,cl.robeLight);}
  // Claws
  px(ctx,15,35+by,"#c0c0d0");px(ctx,14,36+by,"#c0c0d0");px(ctx,32,35+by,"#c0c0d0");px(ctx,33,36+by,"#c0c0d0");
  // Whip trailing from hand
  const wh=f%6;
  for(let i=0;i<8;i++){const wx=13-i;const wy=36+Math.floor(Math.sin(i*.5+wh*.5)*2);if(wx>=2)px(ctx,wx,wy+by,"#504030");}
  // Head
  drawHead(ctx,sk,{base:"#181828",hi:"#282838",mid:"#101018",sh:"#080810",br:"#181828"},ey,L,by,f,sp);
  // Cat ear cowl
  for(let x=18;x<=29;x++)for(let y=5;y<=8;y++)px(ctx,x,y+by,cl.robe);
  px(ctx,18,4+by,cl.robe);px(ctx,17,3+by,cl.robe);px(ctx,17,2+by,cl.robeLight);
  px(ctx,29,4+by,cl.robe);px(ctx,30,3+by,cl.robe);px(ctx,30,2+by,cl.robeLight);
  // Goggles pushed up
  for(let x=19;x<=28;x++)px(ctx,x,8+by,cl.accent);px(ctx,19,7+by,"#80d0f0");px(ctx,20,7+by,"#80d0f0");px(ctx,27,7+by,"#80d0f0");px(ctx,28,7+by,"#80d0f0");
  // Eyes visible
  px(ctx,20,12+by,"#40c060");px(ctx,21,12+by,"#40c060");px(ctx,26,12+by,"#40c060");px(ctx,27,12+by,"#40c060");
  px(ctx,21,13+by,"#000");px(ctx,27,13+by,"#000");
}

// ─── FLAMESHELL (Bowser) ───
function drawFlameshell(ctx,sk,hr,ey,cl,L,by,f,sp,gl){
  for(let x=10;x<=37;x++)px(ctx,x,46,"#0004");
  // Spiked shell on back
  for(let x=14;x<=33;x++)for(let y=14;y<=36;y++){let c="#508030";if(x<=16||x>=31)c="#306818";if(y<=16||y>=34)c="#306818";px(ctx,x,y+by,c);}
  // Shell spikes
  px(ctx,18,12+by,"#f0f0d0");px(ctx,18,11+by,"#e0e0c0");px(ctx,23,10+by,"#f0f0d0");px(ctx,23,9+by,"#e0e0c0");
  px(ctx,29,12+by,"#f0f0d0");px(ctx,29,11+by,"#e0e0c0");px(ctx,15,16+by,"#f0f0d0");px(ctx,32,16+by,"#f0f0d0");
  // Rim
  for(let x=14;x<=33;x++){px(ctx,x,14+by,"#e0e0c0");px(ctx,x,36+by,"#e0e0c0");}
  // Body (front)
  for(let y=20;y<=40;y++)for(let x=17;x<=30;x++){let c="#e0c040";if(x<=18)c="#c0a030";else if(x>=29)c="#f0d060";px(ctx,x,y+by,c);}
  // Belly scales
  for(let y=24;y<=36;y+=4)for(let x=19;x<=28;x+=3)px(ctx,x,y+by,"#c8a830");
  // Legs massive
  for(let y=38;y<=44;y++){for(let x=14;x<=22;x++)px(ctx,x,y+by,"#e0c040");for(let x=25;x<=33;x++)px(ctx,x,y+by,"#e0c040");}
  // Clawed feet
  px(ctx,13,44+by,"#fff");px(ctx,14,44+by,"#fff");px(ctx,34,44+by,"#fff");px(ctx,33,44+by,"#fff");
  // Arms
  for(let y=22;y<=36;y++){px(ctx,12,y+by,"#e0c040");px(ctx,13,y+by,"#e0c040");px(ctx,34,y+by,"#e0c040");px(ctx,35,y+by,"#e0c040");}
  px(ctx,11,36+by,"#fff");px(ctx,36,36+by,"#fff");
  // Spiked wristbands
  for(let x=11;x<=14;x++)px(ctx,x,28+by,"#383848");px(ctx,12,27+by,"#f0f0d0");
  for(let x=33;x<=36;x++)px(ctx,x,28+by,"#383848");px(ctx,35,27+by,"#f0f0d0");
  // Head
  for(let x=17;x<=30;x++)for(let y=6;y<=19;y++){let c="#e0c040";if(y<=7)c="#f0d060";else if(y>=18)c="#c0a030";px(ctx,x,y+by,c);}
  // Horns
  px(ctx,17,5+by,"#f0f0d0");px(ctx,16,4+by,"#e0e0c0");px(ctx,15,3+by,"#f0f0d0");
  px(ctx,30,5+by,"#f0f0d0");px(ctx,31,4+by,"#e0e0c0");px(ctx,32,3+by,"#f0f0d0");
  // Bushy red eyebrows
  for(let x=18;x<=22;x++)px(ctx,x,10+by,"#c83030");for(let x=25;x<=29;x++)px(ctx,x,10+by,"#c83030");
  // Eyes
  for(let x=19;x<=22;x++)px(ctx,x,12+by,"#fff");for(let x=25;x<=28;x++)px(ctx,x,12+by,"#fff");
  px(ctx,21,13+by,"#000");px(ctx,27,13+by,"#000");
  // Angry brow
  px(ctx,19,11+by,"#c83030");px(ctx,28,11+by,"#c83030");
  // Snout/mouth
  for(let x=20;x<=27;x++)px(ctx,x,16+by,"#c0a030");
  for(let x=20;x<=27;x++)px(ctx,x,17+by,"#a08020");
  px(ctx,21,17+by,"#fff");px(ctx,24,17+by,"#fff");px(ctx,26,17+by,"#fff");
  // Red hair/mane
  for(let x=18;x<=29;x++)for(let y=4;y<=7;y++)px(ctx,x,y+by,"#c83030");
  px(ctx,17,6+by,"#a02020");px(ctx,30,6+by,"#a02020");
  // Fire breath
  const fl=f%4;
  if(fl<2){px(ctx,31,14+by,"#e67e22");px(ctx,32,13+by,"#f39c12");px(ctx,33,12+by,"#ffed4a");px(ctx,34,13+by,"#f39c1280");}
}

// ═══════════════════════════════════════
// REGISTER BATCH 2
// ═══════════════════════════════════════
registerClassDraw("steeltyrant", drawSteeltyrant);
registerClassDraw("psyborn", drawPsyborn);
registerClassDraw("hexglider", drawHexglider);
registerClassDraw("frostlord", drawFrostlord);
registerClassDraw("nightclaw", drawNightclaw);
registerClassDraw("flameshell", drawFlameshell);
