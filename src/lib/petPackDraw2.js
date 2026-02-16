// src/lib/petPackDraw2.js
// Remaining pet pack draw functions — auto-registers on import

import { registerPetDraw, px } from "./pixelArt";

// ─── MINI GRIFFIN ───
function drawMiniGriffin(ctx, f, b, fl) {
  for(let x=10;x<=26;x++)px(ctx,x,33,"#0003");
  // Tiny wings
  const wUp=f%6<3;
  for(let y=12;y<=20;y++){
    const w=Math.floor(Math.sin((y-12)/8*Math.PI)*(3+(wUp?1:0)));
    for(let x=14-w;x<=14;x++)if(x>=6)px(ctx,x,y-b,"#c09848");
    for(let x=22;x<=22+w;x++)if(x<=30)px(ctx,x,y-b,"#c09848");
  }
  // Wing feather tips
  if(wUp){px(ctx,8,15-b,"#d0a858");px(ctx,28,15-b,"#d0a858");}
  // Lion body
  for(let y=18;y<=28;y++)for(let x=12;x<=24;x++){
    const d=Math.sqrt((x-18)**2+((y-23)*1.3)**2);
    if(d<6){let c="#d0a858";if(d>4)c="#b89040";px(ctx,x,y-b,c);}
  }
  // Eagle head
  for(let y=10;y<=18;y++)for(let x=14;x<=22;x++){
    const d=Math.sqrt((x-18)**2+((y-14)*1.2)**2);
    if(d<4.5)px(ctx,x,y-b,"#e0d0a0");
  }
  // Beak
  px(ctx,22,14-b,"#d08020");px(ctx,23,14-b,"#d08020");px(ctx,24,15-b,"#c07018");
  // Fierce eye
  px(ctx,19,13-b,"#f0c040");px(ctx,20,13-b,"#000");
  // Ear tufts
  px(ctx,15,9-b,"#c09848");px(ctx,14,8-b,"#d0a858");px(ctx,21,9-b,"#c09848");px(ctx,22,8-b,"#d0a858");
  // Lion legs
  for(let y=26;y<=30;y++){px(ctx,14,y-b,"#b89040");px(ctx,15,y-b,"#b89040");px(ctx,21,y-b,"#b89040");px(ctx,22,y-b,"#b89040");}
  // Paws
  px(ctx,13,30-b,"#d0a858");px(ctx,14,30-b,"#d0a858");px(ctx,22,30-b,"#d0a858");px(ctx,23,30-b,"#d0a858");
  // Lion tail with tuft
  px(ctx,24,22-b,"#d0a858");px(ctx,26,21-b,"#d0a858");px(ctx,27,20-b,"#c09848");
  px(ctx,28,19-b,"#b89040");px(ctx,28,20-b,"#b89040");
}

// ─── HOVER DRONE ───
function drawHoverDrone(ctx, f, b, fl) {
  // Floating — pulsing hover
  const hover=f%8<4?0:1;
  // Propeller ring
  const spin=f%2;
  for(let x=12;x<=24;x++)px(ctx,x,12-hover,"#60687890");
  if(spin){px(ctx,10,12-hover,"#808898");px(ctx,26,12-hover,"#808898");}
  else{px(ctx,11,12-hover,"#808898");px(ctx,25,12-hover,"#808898");}
  // Main sphere body
  for(let y=14;y<=24;y++)for(let x=13;x<=23;x++){
    const d=Math.sqrt((x-18)**2+((y-19)*1.0)**2);
    if(d<5.5){let c="#e0e0e8";if(d>4)c="#b0b0b8";else if(d<2)c="#f0f0f8";px(ctx,x,y-hover,c);}
  }
  // Central eye/lens
  for(let x=16;x<=20;x++)for(let y=17;y<=21;y++){
    const d=Math.sqrt((x-18)**2+(y-19)**2);
    if(d<2.5)px(ctx,x,y-hover,d<1.5?"#60d0ff":"#2080c0");
  }
  // Scan beam
  if(f%10<4){
    const beamY=25+Math.floor((f%10)/4*6);
    for(let x=15;x<=21;x++)px(ctx,x,beamY-hover,"#60d0ff20");
    px(ctx,18,beamY-hover,"#60d0ff40");
  }
  // Side lights
  px(ctx,13,19-hover,f%4<2?"#40c060":"#40c06060");
  px(ctx,23,19-hover,f%4<2?"#ff404060":"#ff4040");
  // Bottom ring
  for(let x=15;x<=21;x++)px(ctx,x,25-hover,"#808898");
}

// ─── SPIRIT FOX ───
function drawSpiritFox(ctx, f, b, fl) {
  // Ethereal — semi-transparent with glow
  for(let x=10;x<=26;x++)px(ctx,x,33,"#0002");
  // Ghostly body
  for(let y=18;y<=26;y++)for(let x=12;x<=24;x++){
    const d=Math.sqrt((x-18)**2+((y-22)*1.3)**2);
    if(d<6)px(ctx,x,y-b,d<3?"#80c8f060":"#60a0d040");
  }
  // 9 tails fanning out — ethereal
  for(let i=-4;i<=4;i++){
    const baseX=22+i;
    for(let ty=22;ty<=32;ty++){
      const wave=Math.sin(f*.12+i*.8+(ty-22)*.2)*1.5;
      const ax=Math.floor(baseX+wave+i*(ty-22)*.15);
      const fade=1-(ty-22)/10;
      if(ax>=0&&ax<36&&fade>0){
        const a=Math.floor(fade*40).toString(16).padStart(2,'0');
        px(ctx,ax,ty-b,`#80c8f0${a}`);
      }
    }
  }
  // Head
  for(let y=10;y<=18;y++)for(let x=14;x<=22;x++){
    const d=Math.sqrt((x-18)**2+((y-14)*1.1)**2);
    if(d<5)px(ctx,x,y-b,d<2.5?"#a0e0ff60":"#80c0e040");
  }
  // Pointed ears
  px(ctx,14,9-b,"#80c8f050");px(ctx,13,8-b,"#60a0d040");
  px(ctx,22,9-b,"#80c8f050");px(ctx,23,8-b,"#60a0d040");
  // Glowing eyes
  px(ctx,16,13-b,"#fff8");px(ctx,20,13-b,"#fff8");px(ctx,16,14-b,"#60d0ff");px(ctx,20,14-b,"#60d0ff");
  // Muzzle
  px(ctx,18,16-b,"#a0e0ff30");
  // Ethereal particles
  for(let i=0;i<4;i++){
    const a=f*.1+(i/4)*Math.PI*2;
    const ox=18+Math.floor(Math.cos(a)*10);const oy=18+Math.floor(Math.sin(a)*8)-b;
    if(ox>=0&&ox<36&&oy>=0&&oy<36)px(ctx,ox,oy,"#80c8f020");
  }
  // Legs barely visible
  px(ctx,15,27-b,"#60a0d030");px(ctx,21,27-b,"#60a0d030");
}

// ─── VOID SKULL ───
function drawVoidSkull(ctx, f, b, fl) {
  // Floating — no feet
  // Purple flame crown
  for(let i=0;i<5;i++){
    const fx2=14+i*2;const fy=8-Math.floor(Math.sin(f*.2+i*1.2)*2);
    px(ctx,fx2,fy-b,"#8040c0");if(fy>6)px(ctx,fx2,fy-1-b,"#a060e080");
    if(f%4===i%4)px(ctx,fx2,fy-2-b,"#c080f060");
  }
  // Skull
  for(let y=10;y<=24;y++)for(let x=12;x<=24;x++){
    const d=Math.sqrt((x-18)**2+((y-16)*1.1)**2);
    if(d<7){
      if(y>=20&&(x<=15||x>=21))continue; // jaw gaps
      let c="#e8e0d8";if(d>5)c="#c8c0b8";else if(d<3)c="#f0ece8";
      px(ctx,x,y-b,c);
    }
  }
  // Eye sockets — glowing purple
  for(let x=14;x<=16;x++)for(let y=14;y<=17;y++)px(ctx,x,y-b,"#1a0828");
  for(let x=20;x<=22;x++)for(let y=14;y<=17;y++)px(ctx,x,y-b,"#1a0828");
  // Eye glow
  px(ctx,15,15-b,f%4<2?"#c060f0":"#a040d0");px(ctx,21,15-b,f%4<2?"#c060f0":"#a040d0");
  // Nose
  px(ctx,17,18-b,"#1a0828");px(ctx,18,18-b,"#1a0828");px(ctx,19,18-b,"#1a0828");
  // Teeth
  for(let x=15;x<=21;x+=2)px(ctx,x,22-b,"#e8e0d8");
  // Jaw line
  for(let x=16;x<=20;x++)px(ctx,x,23-b,"#c8c0b8");
  // Floating wisps below
  for(let i=0;i<3;i++){
    const wy=26+i*2;const wx=16+Math.floor(Math.sin(f*.15+i*2)*2);
    px(ctx,wx,wy-b,"#8040c030");px(ctx,wx+2,wy-b,"#8040c020");
  }
}

// ─── COSMIC EGG ───
function drawCosmicEgg(ctx, f, b, fl) {
  // Floating
  // Egg shape
  for(let y=10;y<=28;y++)for(let x=12;x<=24;x++){
    const ry=(y<18)?(y-10)/8:(y-18)/10+1;
    const hw=Math.floor(Math.sin(Math.min(ry,1)*Math.PI)*6);
    const d=Math.abs(x-18);
    if(d<=hw){
      const shell=(d>=hw-1);
      if(shell)px(ctx,x,y-b,"#d0c8e0");
      else px(ctx,x,y-b,"#e8e0f0");
    }
  }
  // Cracks leaking starlight
  px(ctx,16,14-b,"#1a0828");px(ctx,17,15-b,"#1a0828");px(ctx,16,16-b,"#1a0828");
  px(ctx,20,18-b,"#1a0828");px(ctx,21,19-b,"#1a0828");px(ctx,20,20-b,"#1a0828");
  // Starlight from cracks
  const glow=f%4<2;
  px(ctx,16,14-b,glow?"#f0d060":"#c0a040");px(ctx,17,15-b,glow?"#fff8e0":"#f0d060");
  px(ctx,20,18-b,glow?"#80d0ff":"#60a0d0");px(ctx,21,19-b,glow?"#a0e0ff":"#80c0e0");
  // Orbiting motes
  for(let i=0;i<4;i++){
    const a=f*.08+(i/4)*Math.PI*2;
    const r=8+Math.sin(f*.05+i)*2;
    const ox=18+Math.floor(Math.cos(a)*r);const oy=19+Math.floor(Math.sin(a)*r*0.7)-b;
    if(ox>=0&&ox<36&&oy>=0&&oy<36){
      const colors=["#f0d060","#80d0ff","#f080a0","#80f0a0"];
      px(ctx,ox,oy,colors[i]+"60");
    }
  }
  // Subtle base glow
  for(let x=14;x<=22;x++)px(ctx,x,29-b,"#c080f010");
}

// ─── MECHA HOUND ───
function drawMechaHound(ctx, f, b, fl) {
  for(let x=8;x<=28;x++)px(ctx,x,33,"#0003");
  // Metal body
  for(let y=16;y<=24;y++)for(let x=10;x<=26;x++){
    const d=Math.sqrt(((x-18)*.8)**2+((y-20)*1.5)**2);
    if(d<6){let c="#808898";if(d>4)c="#606878";else if(d<2)c="#a0a8b8";px(ctx,x,y-b,c);}
  }
  // Armor plates
  for(let x=12;x<=24;x++)px(ctx,x,16-b,"#a0a8b8");
  for(let x=14;x<=22;x++)px(ctx,x,24-b,"#606878");
  // Panel lines
  px(ctx,18,18-b,"#50586860");px(ctx,18,20-b,"#50586860");px(ctx,18,22-b,"#50586860");
  // Legs (mechanical)
  for(let y=24;y<=30;y++){
    px(ctx,12,y-b,"#606878");px(ctx,13,y-b,"#808898");
    px(ctx,16,y-b,"#606878");px(ctx,17,y-b,"#808898");
    px(ctx,19,y-b,"#808898");px(ctx,20,y-b,"#606878");
    px(ctx,23,y-b,"#808898");px(ctx,24,y-b,"#606878");
  }
  // Joint circles
  px(ctx,12,27-b,"#a0a8b8");px(ctx,17,27-b,"#a0a8b8");px(ctx,19,27-b,"#a0a8b8");px(ctx,24,27-b,"#a0a8b8");
  // Paw pads
  for(let dx=0;dx<3;dx++){px(ctx,11+dx,31-b,"#505868");px(ctx,16+dx,31-b,"#505868");px(ctx,19+dx,31-b,"#505868");px(ctx,23+dx,31-b,"#505868");}
  // Head
  for(let x=12;x<=24;x++)for(let y=10;y<=16;y++){
    let c="#808898";if(x<=13)c="#606878";else if(x>=23)c="#a0a8b8";if(y<=11)c="#a0a8b8";
    px(ctx,x,y-b,c);
  }
  // Snout
  for(let x=22;x<=27;x++)for(let y=12;y<=15;y++){let c="#707888";if(y===12)c="#909aa8";px(ctx,x,y-b,c);}
  // Laser eye
  px(ctx,14,12-b,"#ff3040");px(ctx,15,12-b,"#ff3040");
  if(f%6<2){px(ctx,14,12-b,"#ff6070");px(ctx,13,11-b,"#ff304040");}
  // Normal eye
  px(ctx,19,12-b,"#60d0ff");px(ctx,20,12-b,"#60d0ff");
  // Ears (metal fins)
  px(ctx,13,9-b,"#a0a8b8");px(ctx,12,8-b,"#808898");px(ctx,22,9-b,"#a0a8b8");px(ctx,23,8-b,"#808898");
  // Tail (antenna)
  px(ctx,10,18-b,"#808898");px(ctx,8,16-b,"#808898");px(ctx,7,15-b,"#a0a8b8");
  if(f%4<2)px(ctx,7,14-b,"#60d0ff80");
}

// ─── CELESTIAL SERPENT ───
function drawCelestialSerpent(ctx, f, b, fl) {
  // ★★★ CELESTIAL SERPENT — L35 ultimate pet
  // A cosmic dragon-serpent that warps space around it

  // Background nebula glow — the serpent distorts reality
  for (let i = 0; i < 8; i++) {
    const nx = 8 + ((f * 2 + i * 17) % 22);
    const ny = 4 + ((f + i * 11) % 26);
    const colors = ["#8040c018", "#4060d018", "#d040a018", "#40a0d018"];
    if (nx < 36 && ny < 36) px(ctx, nx, ny - b, colors[i % 4]);
  }

  // Serpent body — thick, flowing cosmic S-curve with wider segments
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const t = i / 15;
    // More dramatic S-curve than leviathan
    const wave = Math.sin(t * Math.PI * 3 + f * 0.08) * 5;
    const sx = 6 + Math.floor(wave + t * 22);
    const sy = 6 + Math.floor(t * 24);
    pts.push([sx, sy]);
  }

  // Draw body segments — wider than leviathan, with cosmic coloring
  pts.forEach(([x, y], i) => {
    const t = i / 15;
    // Body width tapers: thick at head, medium at middle, thin at tail
    const w = i < 4 ? 4 : i < 8 ? 3 : i < 12 ? 2 : 1;
    for (let dx = -w; dx <= w; dx++) {
      for (let dy = -1; dy <= 0; dy++) {
        const d = Math.abs(dx);
        // Cosmic gradient: deep purple core → blue edges → gold highlights
        let c;
        if (d === 0) c = "#c0a0ff"; // bright core
        else if (d === 1) c = "#8060d0"; // inner
        else if (d < w) c = "#4040a0"; // mid
        else c = "#28287080"; // edge with transparency
        const px2 = x + dx;
        const py = y + dy;
        if (px2 >= 0 && px2 < 36 && py >= 0 && py < 36) px(ctx, px2, py - b, c);
      }
    }
    // Gold accent stripe along spine
    if (i < 12 && x >= 0 && x < 36) px(ctx, x, y - 1 - b, "#f0d06080");
  });

  // Constellation pattern on body — twinkling star dots connected by faint lines
  const stars = [];
  for (let i = 1; i < pts.length - 2; i += 2) {
    const [sx, sy] = pts[i];
    const twinkle = (f + i * 5) % 8 < 4;
    if (sx >= 0 && sx < 36 && sy >= 0 && sy < 36) {
      px(ctx, sx, sy - b, twinkle ? "#ffffffc0" : "#ffe88080");
      stars.push([sx, sy]);
    }
  }
  // Faint lines between constellation stars
  for (let i = 0; i < stars.length - 1; i++) {
    const [x1, y1] = stars[i];
    const [x2, y2] = stars[i + 1];
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    if (steps > 0 && steps < 12) {
      for (let s = 1; s < steps; s += 2) {
        const lx = Math.floor(x1 + (x2 - x1) * s / steps);
        const ly = Math.floor(y1 + (y2 - y1) * s / steps);
        if (lx >= 0 && lx < 36 && ly >= 0 && ly < 36) px(ctx, lx, ly - b, "#8080ff20");
      }
    }
  }

  // Nebula wings — ethereal, translucent, flapping gently
  const wingPhase = Math.sin(f * 0.1);
  const wingPts = pts.slice(2, 7); // Attach wings to upper body
  wingPts.forEach(([wx, wy], i) => {
    const spread = Math.floor((3 - Math.abs(i - 2)) * (2.5 + wingPhase));
    // Left wing
    for (let d = 1; d <= spread; d++) {
      const lx = wx - d - Math.floor(i * 0.5);
      const ly = wy - Math.floor(d * 0.3) - 1;
      const fade = 1 - d / (spread + 1);
      const a = Math.floor(fade * 35);
      if (lx >= 0 && ly >= 0 && lx < 36 && ly < 36 && a > 1) {
        px(ctx, lx, ly - b, `#8060d0${a.toString(16).padStart(2, '0')}`);
        // Wing shimmer
        if (d === spread && (f + i) % 6 < 2) px(ctx, lx, ly - b, "#c0a0ff40");
      }
    }
    // Right wing
    for (let d = 1; d <= spread; d++) {
      const rx = wx + d + Math.floor(i * 0.5);
      const ry = wy - Math.floor(d * 0.3) - 1;
      const fade = 1 - d / (spread + 1);
      const a = Math.floor(fade * 35);
      if (rx >= 0 && ry >= 0 && rx < 36 && ry < 36 && a > 1) {
        px(ctx, rx, ry - b, `#6040b0${a.toString(16).padStart(2, '0')}`);
        if (d === spread && (f + i + 3) % 6 < 2) px(ctx, rx, ry - b, "#c0a0ff40");
      }
    }
  });

  // Head — larger and more ornate than leviathan
  const [hx, hy] = pts[0];
  // Head glow nimbus
  for (let dy = -4; dy <= 3; dy++) for (let dx = -5; dx <= 5; dx++) {
    const d = Math.sqrt(dx * dx + (dy * 1.1) ** 2);
    if (d < 5.5 && d > 4) {
      const px2 = hx + dx; const py = hy + dy;
      if (px2 >= 0 && px2 < 36 && py >= 0 && py < 36) px(ctx, px2, py - b, "#c0a0ff20");
    }
  }
  // Head shape — wider, more regal
  for (let dy = -3; dy <= 3; dy++) for (let dx = -4; dx <= 4; dx++) {
    const d = Math.sqrt((dx * 0.9) ** 2 + (dy * 1.1) ** 2);
    if (d < 4) {
      let c;
      if (d < 1.5) c = "#d0c0ff"; // bright center
      else if (d < 2.5) c = "#a080e0"; // mid
      else c = "#6050b0"; // edge
      const px2 = hx + dx; const py = hy + dy;
      if (px2 >= 0 && px2 < 36 && py >= 0 && py < 36) px(ctx, px2, py - b, c);
    }
  }

  // Multi-horned crown — 3 pairs of horns, golden
  const hornPairs = [
    { dx: -3, dy: -3, len: 3, c1: "#f0d060", c2: "#ffe880" },
    { dx: -2, dy: -4, len: 4, c1: "#f0c030", c2: "#f0d060" },
    { dx: -1, dy: -5, len: 3, c1: "#ffe880", c2: "#ffffff90" },
  ];
  hornPairs.forEach(h => {
    // Left horn
    for (let l = 0; l < h.len; l++) {
      const lx = hx + h.dx - l; const ly = hy + h.dy - l;
      if (lx >= 0 && ly >= 0 && lx < 36 && ly < 36) px(ctx, lx, ly - b, l < h.len - 1 ? h.c1 : h.c2);
    }
    // Right horn (mirrored)
    for (let l = 0; l < h.len; l++) {
      const rx = hx - h.dx + l; const ry = hy + h.dy - l;
      if (rx >= 0 && ry >= 0 && rx < 36 && ry < 36) px(ctx, rx, ry - b, l < h.len - 1 ? h.c1 : h.c2);
    }
  });

  // Eyes — large, white-hot with prismatic glow
  const eyeBright = f % 6 < 3;
  px(ctx, hx - 2, hy - 1 - b, eyeBright ? "#ffffff" : "#e0e0ff");
  px(ctx, hx - 1, hy - 1 - b, "#000");
  px(ctx, hx + 2, hy - 1 - b, eyeBright ? "#ffffff" : "#e0e0ff");
  px(ctx, hx + 3, hy - 1 - b, "#000");
  // Eye glow
  if (eyeBright) {
    px(ctx, hx - 3, hy - 1 - b, "#80d0ff40");
    px(ctx, hx + 4, hy - 1 - b, "#80d0ff40");
  }

  // Mouth with cosmic breath particles
  if (f % 10 < 4) {
    const breathDist = (f % 10);
    for (let i = 0; i < 3; i++) {
      const bx = hx + 4 + breathDist + i;
      const bby = hy + Math.floor(Math.sin(f * 0.3 + i) * 1.5) - b;
      const colors = ["#c0a0ff60", "#80d0ff40", "#f0d06040"];
      if (bx >= 0 && bx < 36 && bby >= 0 && bby < 36) px(ctx, bx, bby, colors[i]);
    }
  }

  // Tail — splits into 3 ethereal wisps with star tips
  const [tx, ty] = pts[pts.length - 1];
  for (let tail = -1; tail <= 1; tail++) {
    for (let d = 1; d <= 4; d++) {
      const ttx = tx + d + Math.floor(Math.sin(f * 0.12 + tail * 2) * 1.5);
      const tty = ty + tail * d * 0.8;
      const fade = 1 - d / 5;
      const a = Math.floor(fade * 50);
      if (ttx >= 0 && ttx < 36 && tty >= 0 && tty < 36 && a > 1) {
        px(ctx, Math.floor(ttx), Math.floor(tty) - b, `#c0a0ff${a.toString(16).padStart(2, '0')}`);
      }
    }
    // Star tip
    const starX = Math.floor(tx + 4 + Math.sin(f * 0.12 + tail * 2) * 1.5);
    const starY = Math.floor(ty + tail * 3.2);
    if (starX >= 0 && starX < 36 && starY >= 0 && starY < 36 && (f + tail * 3) % 6 < 4) {
      px(ctx, starX, starY - b, "#ffffffa0");
    }
  }

  // Star trail particles — orbiting cosmic dust
  for (let i = 0; i < 10; i++) {
    const angle = f * 0.06 + (i / 10) * Math.PI * 2;
    const orbitR = 14 + Math.sin(f * 0.03 + i * 1.5) * 3;
    const ox = 18 + Math.floor(Math.cos(angle) * orbitR);
    const oy = 16 + Math.floor(Math.sin(angle) * orbitR * 0.6) - b;
    if (ox >= 0 && ox < 36 && oy >= 0 && oy < 36) {
      const starColors = ["#f0d06050", "#80d0ff40", "#ff80a040", "#80ff8040", "#c0a0ff50"];
      px(ctx, ox, oy, starColors[i % 5]);
      // Trail
      const trailAngle = angle - 0.12;
      const trx = 18 + Math.floor(Math.cos(trailAngle) * orbitR);
      const ttry = 16 + Math.floor(Math.sin(trailAngle) * orbitR * 0.6) - b;
      if (trx >= 0 && trx < 36 && ttry >= 0 && ttry < 36) px(ctx, trx, ttry, "#ffffff18");
    }
  }

  // Periodic cosmic pulse — nova ring expanding outward
  if (f % 24 < 4) {
    const pulseR = 4 + (f % 24) * 3;
    for (let a = 0; a < 12; a++) {
      const angle = (a / 12) * Math.PI * 2;
      const px3 = Math.floor(18 + Math.cos(angle) * pulseR);
      const py = Math.floor(16 + Math.sin(angle) * pulseR * 0.6) - b;
      const fade = 1 - (f % 24) / 4;
      const alpha = Math.floor(fade * 40);
      if (px3 >= 0 && px3 < 36 && py >= 0 && py < 36 && alpha > 1) {
        px(ctx, px3, py, `#c0a0ff${alpha.toString(16).padStart(2, '0')}`);
      }
    }
  }
}

// ═══════════════════════════════════════
// REGISTER BATCH 2
// ═══════════════════════════════════════
registerPetDraw("mini_griffin", drawMiniGriffin);
registerPetDraw("hover_drone", drawHoverDrone);
registerPetDraw("spirit_fox", drawSpiritFox);
registerPetDraw("void_skull", drawVoidSkull);
registerPetDraw("cosmic_egg", drawCosmicEgg);
registerPetDraw("mecha_hound", drawMechaHound);
registerPetDraw("celestial_serpent", drawCelestialSerpent);
