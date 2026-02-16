// src/lib/petPack.js
// Extended pet collection — 15 new pets across tech, anime, fantasy, dark themes
// Self-registers draw functions into pixelArt pet registry

import { registerPetDraw, px } from "./pixelArt";

// ═══════════════════════════════════════
// PET PACK DEFINITIONS
// Merge into PETS array in avatar.jsx
// ═══════════════════════════════════════
export const PACK_PETS = [
  { id: "byte_bot", name: "Byte Bot", icon: "🤖", unlockLevel: 1 },
  { id: "wisp", name: "Wisp", icon: "👻", unlockLevel: 1 },
  { id: "bunbun", name: "Bun-Bun", icon: "🐰", unlockLevel: 1 },
  { id: "kitsune", name: "Kitsune", icon: "🦊", unlockLevel: 7 },
  { id: "nebula_jelly", name: "Nebula Jelly", icon: "🪼", unlockLevel: 10 },
  { id: "shade_bat", name: "Shade Bat", icon: "🦇", unlockLevel: 13 },
  { id: "crystal_stag", name: "Crystal Stag", icon: "🦌", unlockLevel: 16 },
  { id: "leviathan_pup", name: "Leviathan Pup", icon: "🐍", unlockLevel: 19 },
  { id: "mini_griffin", name: "Mini Griffin", icon: "🦅", unlockLevel: 22 },
  { id: "hover_drone", name: "Hover Drone", icon: "🛸", unlockLevel: 25 },
  { id: "spirit_fox", name: "Spirit Fox", icon: "🌀", unlockLevel: 28 },
  { id: "void_skull", name: "Void Skull", icon: "💀", unlockLevel: 31 },
  { id: "cosmic_egg", name: "Cosmic Egg", icon: "🥚", unlockLevel: 33 },
  { id: "mecha_hound", name: "Mecha Hound", icon: "🐕", unlockLevel: 34 },
  { id: "celestial_serpent", name: "Celestial Serpent", icon: "✨", unlockLevel: 35 },
];

// ═══════════════════════════════════════
// DRAW FUNCTIONS — all at 36×36 canvas
// Args: (ctx, f=frame, b=bounce, fl=flicker)
// ═══════════════════════════════════════

// ─── BYTE BOT ───
function drawByteBot(ctx, f, b, fl) {
  for(let x=12;x<=24;x++)px(ctx,x,33,"#0003");
  // Boxy body
  for(let x=13;x<=23;x++)for(let y=16;y<=28;y++){
    let c="#808898";if(x<=14)c="#606878";else if(x>=22)c="#a0a8b8";
    px(ctx,x,y-b,c);
  }
  // Screen face
  for(let x=15;x<=21;x++)for(let y=17;y<=23;y++)px(ctx,x,y-b,"#1a2840");
  // LED eyes — blink
  if(f%12<10){px(ctx,16,19-b,"#60d0ff");px(ctx,17,19-b,"#60d0ff");px(ctx,20,19-b,"#60d0ff");px(ctx,19,19-b,"#60d0ff");}
  // Mouth pixels
  px(ctx,16,22-b,"#60d0ff");px(ctx,18,22-b,"#60d0ff");px(ctx,20,22-b,"#60d0ff");
  // Antenna
  px(ctx,18,15-b,"#a0a8b8");px(ctx,18,14-b,"#a0a8b8");px(ctx,18,13-b,"#a0a8b8");
  if(f%4<2)px(ctx,18,12-b,"#ff4040");else px(ctx,18,12-b,"#60d0ff");
  // Arms
  px(ctx,11,20-b,"#808898");px(ctx,12,20-b,"#808898");px(ctx,11,21-b,"#808898");
  px(ctx,24,20-b,"#808898");px(ctx,25,20-b,"#808898");px(ctx,25,21-b,"#808898");
  // Legs
  px(ctx,15,29-b,"#606878");px(ctx,16,29-b,"#606878");px(ctx,15,30-b,"#808898");px(ctx,16,30-b,"#808898");
  px(ctx,20,29-b,"#606878");px(ctx,21,29-b,"#606878");px(ctx,20,30-b,"#808898");px(ctx,21,30-b,"#808898");
  // Chest light
  px(ctx,18,26-b,fl<1?"#40c06080":"#40c060");
}

// ─── WISP ───
function drawWisp(ctx, f, b, fl) {
  for(let x=14;x<=22;x++)px(ctx,x,33,"#0002");
  // Core glow — pulsing
  const pulse=f%6<3;
  const r=pulse?6:5;
  for(let y=12;y<=24;y++)for(let x=12;x<=24;x++){
    const d=Math.sqrt((x-18)**2+(y-18)**2);
    if(d<r){
      if(d<2)px(ctx,x,y-b,"#fff8e0");
      else if(d<3.5)px(ctx,x,y-b,"#a0e0ff80");
      else px(ctx,x,y-b,"#60c0ff40");
    }
  }
  // Ghostly trail below
  for(let i=0;i<4;i++){
    const ty=25+i*2;const tx=18+Math.floor(Math.sin(f*.2+i)*2);
    px(ctx,tx,ty-b,"#60c0ff20");px(ctx,tx-1,ty-b,"#60c0ff10");px(ctx,tx+1,ty-b,"#60c0ff10");
  }
  // Orbiting sparkles
  for(let i=0;i<3;i++){
    const a=f*.12+(i/3)*Math.PI*2;
    const ox=18+Math.floor(Math.cos(a)*8);const oy=18+Math.floor(Math.sin(a)*6)-b;
    if(ox>=0&&ox<36&&oy>=0&&oy<36)px(ctx,ox,oy,"#fff6");
  }
  // Eyes — two dots
  px(ctx,16,17-b,"#102840");px(ctx,20,17-b,"#102840");
}

// ─── BUN-BUN ───
function drawBunbun(ctx, f, b, fl) {
  for(let x=12;x<=24;x++)px(ctx,x,33,"#0003");
  // Round body
  for(let y=18;y<=28;y++)for(let x=13;x<=23;x++){
    const d=Math.sqrt((x-18)**2+((y-23)*1.3)**2);
    if(d<6){let c="#e8e0d8";if(d>4)c="#d0c8c0";px(ctx,x,y-b,c);}
  }
  // Belly
  for(let y=22;y<=27;y++)for(let x=16;x<=20;x++){
    const d=Math.sqrt((x-18)**2+((y-25)*1.5)**2);
    if(d<3)px(ctx,x,y-b,"#f8f0e8");
  }
  // Head
  for(let y=12;y<=20;y++)for(let x=14;x<=22;x++){
    const d=Math.sqrt((x-18)**2+((y-16)*1.2)**2);
    if(d<5){let c="#e8e0d8";if(d>3.5)c="#d0c8c0";px(ctx,x,y-b,c);}
  }
  // Floppy ears
  px(ctx,15,11-b,"#e8e0d8");px(ctx,14,10-b,"#e8e0d8");px(ctx,14,9-b,"#e8e0d8");px(ctx,13,8-b,"#d0c8c0");px(ctx,13,7-b,"#d0c8c0");
  px(ctx,14,9-b,"#f0b0b0");// inner ear pink
  px(ctx,21,11-b,"#e8e0d8");px(ctx,22,10-b,"#e8e0d8");px(ctx,22,9-b,"#e8e0d8");px(ctx,23,8-b,"#d0c8c0");px(ctx,23,7-b,"#d0c8c0");
  px(ctx,22,9-b,"#f0b0b0");
  // Eyes
  px(ctx,16,15-b,"#000");px(ctx,20,15-b,"#000");px(ctx,16,14-b,"#fff8");px(ctx,20,14-b,"#fff8");
  // Pink nose
  px(ctx,18,17-b,"#f0a0a0");
  // Whiskers
  px(ctx,14,17-b,"#c0b8b0");px(ctx,13,16-b,"#c0b8b0");px(ctx,22,17-b,"#c0b8b0");px(ctx,23,16-b,"#c0b8b0");
  // Little feet
  px(ctx,15,29-b,"#d0c8c0");px(ctx,16,29-b,"#d0c8c0");px(ctx,20,29-b,"#d0c8c0");px(ctx,21,29-b,"#d0c8c0");
  // Tail puff
  px(ctx,22,24-b,"#f8f0e8");px(ctx,23,24-b,"#e8e0d8");
}

// ─── KITSUNE ───
function drawKitsune(ctx, f, b, fl) {
  for(let x=10;x<=26;x++)px(ctx,x,33,"#0003");
  // Body
  for(let y=18;y<=28;y++)for(let x=12;x<=24;x++){
    const d=Math.sqrt((x-18)**2+((y-23)*1.2)**2);
    if(d<6){let c="#d06020";if(d>4)c="#b04818";px(ctx,x,y-b,c);}
  }
  // White chest
  for(let y=22;y<=27;y++)for(let x=16;x<=20;x++){
    const d=Math.sqrt((x-18)**2+((y-25)*1.4)**2);
    if(d<3)px(ctx,x,y-b,"#f0e8d8");
  }
  // Multiple tails (3, fanning out)
  const tw=Math.sin(f*.2);
  for(let i=-1;i<=1;i++){
    const tx=22+i*2;
    for(let ty=24;ty<=30;ty++){
      const ax=tx+Math.floor(tw*(ty-24)*.3*i);
      if(ax>=0&&ax<36)px(ctx,ax,ty-b,"#d06020");
    }
    // White tip
    px(ctx,tx+Math.floor(tw*6*.3*i),30-b,"#f0e8d8");
    // Fire tip
    if(fl===i+1)px(ctx,tx+Math.floor(tw*6*.3*i),29-b,"#f0a030");
  }
  // Head
  for(let y=10;y<=18;y++)for(let x=14;x<=22;x++){
    const d=Math.sqrt((x-18)**2+((y-14)*1.1)**2);
    if(d<5){let c="#d06020";if(d>3)c="#b04818";px(ctx,x,y-b,c);}
  }
  // Ears (pointed)
  px(ctx,14,9-b,"#d06020");px(ctx,13,8-b,"#d06020");px(ctx,13,7-b,"#b04818");
  px(ctx,22,9-b,"#d06020");px(ctx,23,8-b,"#d06020");px(ctx,23,7-b,"#b04818");
  // Inner ears
  px(ctx,14,8-b,"#f0b070");px(ctx,22,8-b,"#f0b070");
  // Eyes
  px(ctx,16,13-b,"#f0d040");px(ctx,20,13-b,"#f0d040");px(ctx,16,14-b,"#000");px(ctx,20,14-b,"#000");
  // Snout
  px(ctx,18,16-b,"#000");
  // Legs
  px(ctx,14,29-b,"#b04818");px(ctx,15,29-b,"#b04818");px(ctx,21,29-b,"#b04818");px(ctx,22,29-b,"#b04818");
}

// ─── NEBULA JELLY ───
function drawNebulaJelly(ctx, f, b, fl) {
  // Floating — no shadow
  // Bell/dome
  for(let y=8;y<=18;y++)for(let x=12;x<=24;x++){
    const d=Math.sqrt((x-18)**2+((y-13)*1.4)**2);
    if(d<6){
      const grad=(y-8)/10;
      if(grad<.3)px(ctx,x,y-b,"#c080f080");
      else if(grad<.6)px(ctx,x,y-b,"#8050c080");
      else px(ctx,x,y-b,"#5030a080");
    }
  }
  // Internal glow
  px(ctx,17,12-b,"#f0c0ff40");px(ctx,18,12-b,"#f0c0ff40");px(ctx,19,12-b,"#f0c0ff40");
  // Tendrils — wavy, glowing
  for(let i=0;i<5;i++){
    const tx=13+i*2.5;
    for(let ty=19;ty<=30;ty++){
      const wave=Math.sin(f*.15+i*1.5+(ty-19)*.3)*1.5;
      const ax=Math.floor(tx+wave);
      const fade=1-(ty-19)/12;
      if(ax>=0&&ax<36&&fade>0){
        const a=Math.floor(fade*80).toString(16).padStart(2,'0');
        px(ctx,ax,ty-b,`#c080f0${a}`);
      }
    }
  }
  // Sparkle motes around
  for(let i=0;i<3;i++){
    if((f+i*5)%8<3){
      const sx=10+((f*3+i*11)%16);const sy=8+((f*5+i*7)%18);
      px(ctx,sx,sy-b,"#fff4");
    }
  }
  // Eyes — two gentle dots
  px(ctx,16,14-b,"#fff8");px(ctx,20,14-b,"#fff8");
}

// ─── SHADE BAT ───
function drawShadeBat(ctx, f, b, fl) {
  for(let x=10;x<=26;x++)px(ctx,x,33,"#0003");
  const wUp=f%6<3;
  // Wings
  for(let y=12;y<=22;y++){
    const wy=y-12;
    const w=Math.floor(Math.sin(wy/10*Math.PI)*(5+(wUp?2:0)));
    for(let x=14-w;x<=14;x++)if(x>=2)px(ctx,x,y-b,"#382848");
    for(let x=22;x<=22+w;x++)if(x<=33)px(ctx,x,y-b,"#382848");
  }
  // Wing membrane highlight
  if(wUp){px(ctx,8,16-b,"#483860");px(ctx,28,16-b,"#483860");}
  // Body
  for(let y=14;y<=24;y++)for(let x=14;x<=22;x++){
    const d=Math.sqrt((x-18)**2+((y-19)*1.3)**2);
    if(d<5){let c="#2a1838";if(d>3)c="#1a0e28";px(ctx,x,y-b,c);}
  }
  // Head
  for(let y=10;y<=16;y++)for(let x=15;x<=21;x++){
    const d=Math.sqrt((x-18)**2+((y-13)*1.2)**2);
    if(d<4)px(ctx,x,y-b,"#2a1838");
  }
  // Ears
  px(ctx,15,9-b,"#2a1838");px(ctx,14,8-b,"#382848");px(ctx,21,9-b,"#2a1838");px(ctx,22,8-b,"#382848");
  // Glowing red eyes
  px(ctx,16,12-b,"#ff3040");px(ctx,20,12-b,"#ff3040");
  if(f%8<4){px(ctx,16,12-b,"#ff5060");px(ctx,20,12-b,"#ff5060");}
  // Tiny fangs
  px(ctx,17,15-b,"#e0e0f0");px(ctx,19,15-b,"#e0e0f0");
  // Feet
  px(ctx,16,25-b,"#1a0e28");px(ctx,20,25-b,"#1a0e28");
}

// ─── CRYSTAL STAG ───
function drawCrystalStag(ctx, f, b, fl) {
  for(let x=10;x<=26;x++)px(ctx,x,33,"#0003");
  // Elegant body
  for(let y=18;y<=26;y++)for(let x=12;x<=24;x++){
    const d=Math.sqrt(((x-18)*.9)**2+((y-22)*1.6)**2);
    if(d<5){let c="#a0b8d0";if(d>3.5)c="#8098b0";px(ctx,x,y-b,c);}
  }
  // Legs (thin, elegant)
  for(let y=26;y<=31;y++){px(ctx,14,y-b,"#8098b0");px(ctx,16,y-b,"#8098b0");px(ctx,20,y-b,"#8098b0");px(ctx,22,y-b,"#8098b0");}
  // Hooves
  px(ctx,14,31-b,"#607890");px(ctx,16,31-b,"#607890");px(ctx,20,31-b,"#607890");px(ctx,22,31-b,"#607890");
  // Head
  for(let y=12;y<=18;y++)for(let x=14;x<=22;x++){
    const d=Math.sqrt((x-18)**2+((y-15)*1.3)**2);
    if(d<4)px(ctx,x,y-b,"#a0b8d0");
  }
  // Crystal antlers!
  const shimmer=f%4<2;
  // Left antler
  px(ctx,14,11-b,"#80d0f0");px(ctx,13,10-b,"#60c0e0");px(ctx,12,9-b,"#80d0f0");px(ctx,11,8-b,shimmer?"#a0e0ff":"#60c0e0");
  px(ctx,14,10-b,"#60c0e0");px(ctx,13,9-b,"#80d0f0");
  // Right antler
  px(ctx,22,11-b,"#80d0f0");px(ctx,23,10-b,"#60c0e0");px(ctx,24,9-b,"#80d0f0");px(ctx,25,8-b,shimmer?"#a0e0ff":"#60c0e0");
  px(ctx,22,10-b,"#60c0e0");px(ctx,23,9-b,"#80d0f0");
  // Antler sparkle
  if(f%6<2){px(ctx,11,7-b,"#fff6");px(ctx,25,7-b,"#fff6");}
  // Eyes
  px(ctx,16,14-b,"#2040a0");px(ctx,20,14-b,"#2040a0");
  // Nose
  px(ctx,18,16-b,"#607890");
  // Tail
  px(ctx,24,20-b,"#a0b8d0");px(ctx,25,19-b,"#a0b8d0");
}

// ─── LEVIATHAN PUP ───
function drawLeviathanPup(ctx, f, b, fl) {
  for(let x=10;x<=26;x++)px(ctx,x,33,"#0003");
  // Serpentine body — S curve
  const pts=[];
  for(let i=0;i<12;i++){
    const t=i/11;
    const sx=12+Math.floor(Math.sin(t*Math.PI*2+f*.15)*3+t*10);
    const sy=14+Math.floor(t*16);
    pts.push([sx,sy]);
  }
  pts.forEach(([x,y],i)=>{
    const w=i<3?3:i<8?2:1;
    for(let dx=-w;dx<=w;dx++){
      let c="#3080c0";if(Math.abs(dx)>=w)c="#2060a0";
      if(x+dx>=0&&x+dx<36)px(ctx,x+dx,y-b,c);
    }
  });
  // Belly stripe
  pts.slice(0,8).forEach(([x,y])=>{px(ctx,x,y-b,"#80c8e0");});
  // Head (first point, bigger)
  const[hx,hy]=pts[0];
  for(let dy=-2;dy<=2;dy++)for(let dx=-3;dx<=3;dx++){
    const d=Math.sqrt(dx*dx+dy*dy);
    if(d<3.5){let c="#3080c0";if(d>2)c="#2060a0";if(hx+dx>=0&&hx+dx<36)px(ctx,hx+dx,hy+dy-b,c);}
  }
  // Eyes
  px(ctx,hx-1,hy-1-b,"#fff");px(ctx,hx+1,hy-1-b,"#fff");px(ctx,hx-1,hy-b,"#000");px(ctx,hx+1,hy-b,"#000");
  // Fins
  px(ctx,hx-3,hy-2-b,"#80c8e0");px(ctx,hx-4,hy-3-b,"#60a8d0");
  px(ctx,hx+3,hy-2-b,"#80c8e0");px(ctx,hx+4,hy-3-b,"#60a8d0");
  // Water drops
  if(f%6<2){px(ctx,hx+2,hy-3-b,"#80d0f040");px(ctx,hx-3,hy+1-b,"#80d0f040");}
  // Tail fin
  const[tx,ty]=pts[pts.length-1];
  px(ctx,tx-1,ty+1-b,"#2060a0");px(ctx,tx+1,ty+1-b,"#2060a0");px(ctx,tx,ty+2-b,"#3080c0");
}

// ═══════════════════════════════════════
// REGISTER BATCH 1
// ═══════════════════════════════════════
registerPetDraw("byte_bot", drawByteBot);
registerPetDraw("wisp", drawWisp);
registerPetDraw("bunbun", drawBunbun);
registerPetDraw("kitsune", drawKitsune);
registerPetDraw("nebula_jelly", drawNebulaJelly);
registerPetDraw("shade_bat", drawShadeBat);
registerPetDraw("crystal_stag", drawCrystalStag);
registerPetDraw("leviathan_pup", drawLeviathanPup);
