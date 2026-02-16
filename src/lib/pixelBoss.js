// src/lib/pixelBoss.js
// Pixel art boss sprites for Boss Battle screen
// Canvas: 128x128 - ALL bosses drawn natively at full resolution.

const SZ = 128;

function px(ctx, x, y, c) {
  if (x < 0 || x >= SZ || y < 0 || y >= SZ) return;
  ctx.fillStyle = c;
  ctx.fillRect(x, y, 1, 1);
}

function rect(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

function disc(ctx, cx, cy, r, c) {
  const r2 = r * r;
  for (let dy = -r; dy <= r; dy++)
    for (let dx = -r; dx <= r; dx++)
      if (dx * dx + dy * dy <= r2) px(ctx, Math.round(cx + dx), Math.round(cy + dy), c);
}

function ellipse(ctx, cx, cy, rx, ry, c) {
  for (let dy = -ry; dy <= ry; dy++)
    for (let dx = -rx; dx <= rx; dx++)
      if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1)
        px(ctx, Math.round(cx + dx), Math.round(cy + dy), c);
}


// ═══════════════════════════════════════════════════════
// DRAGON — The Review Dragon  (128x128 native)
// Imposing green dragon with wings, horns, and fire breath
// ═══════════════════════════════════════════════════════
function drawDragon(ctx, f) {
  const by = f % 4 < 2 ? 0 : 1;
  const breathe = Math.sin(f * 0.06);

  // Ground shadow
  ellipse(ctx, 64, 120 + by, 44, 7, "rgba(0,0,0,0.3)");

  // ── Wings (behind body) ──
  const wingUp = f % 10 < 5;
  const wingExt = wingUp ? 10 : 3;
  for (let side = -1; side <= 1; side += 2) {
    for (let y = 18; y <= 72; y++) {
      const wy = (y - 18) / 54;
      const w = Math.floor(Math.sin(wy * Math.PI) * (20 + wingExt));
      for (let dx = 0; dx <= w; dx++) {
        const x = 64 + side * (22 + dx);
        if (x < 0 || x >= 128) continue;
        const nd = dx / (w || 1);
        // Membrane with vein pattern
        const vein = Math.sin(dx * 0.5 + y * 0.2) > 0.5;
        let c;
        if (nd > 0.9) c = "#0e3818";
        else if (vein) c = "#1a5828";
        else if (nd > 0.6) c = "#28703880";
        else c = "#30884890";
      px(ctx, x, y + by, c);
      }
    }
    // Wing bone
    for (let y = 22; y <= 65; y++) {
      px(ctx, 64 + side * 22, y + by, "#1a4828");
      px(ctx, 64 + side * 23, y + by, "#0e3018");
    }
    // Wing claw at top
    px(ctx, 64 + side * 22, 20 + by, "#c8b870");
    px(ctx, 64 + side * 23, 19 + by, "#d8c880");
    px(ctx, 64 + side * 22, 19 + by, "#b8a860");
  }

  // ── Tail ── curves off to the right
  for (let i = 0; i < 24; i++) {
    const t = i / 23;
    const tx = 64 + 18 + i * 2.5 + Math.round(Math.sin(f * 0.08 + i * 0.3) * 3);
    const ty = 90 + Math.round(Math.sin(t * Math.PI * 0.7) * -10) + by;
    if (tx >= 0 && tx < 128 && ty >= 0 && ty < 128) {
      const thick = Math.max(1, 5 - Math.floor(t * 4));
      for (let dx = -thick; dx <= thick; dx++) {
        const nd = Math.abs(dx) / (thick || 1);
        let c;
        if (nd > 0.7) c = "#0e3818";
        else if (dx > 0 && nd > 0.3) c = "#70c870"; // belly side
        else c = "#28944a";
        if (tx + dx >= 0 && tx + dx < 128) px(ctx, tx + dx, ty, c);
      }
      // Spine ridge
      if (i % 3 === 0 && thick > 2) {
        px(ctx, Math.round(tx), ty - thick - 1, "#c8a020");
        px(ctx, Math.round(tx), ty - thick, "#e8d040");
      }
    }
  }
  // Tail spade
  const spX = Math.min(126, 64 + 18 + 60 + Math.round(Math.sin(f * 0.08 + 7.2) * 3));
  const spY = 80 + by;
  if (spX < 126) {
    for (let i = 0; i < 5; i++) { px(ctx, spX + i, spY - i, "#28944a"); px(ctx, spX + i, spY + i, "#28944a"); px(ctx, spX + i + 1, spY - i, "#1a5828"); px(ctx, spX + i + 1, spY + i, "#1a5828"); }
  }

  // ── Body ── massive barrel chest
  for (let y = 34; y <= 100; y++) {
    const t = (y - 34) / 66;
    const w = Math.floor(20 + Math.sin(t * Math.PI * 0.7) * 14);
    for (let dx = -w; dx <= w; dx++) {
      const nd = Math.abs(dx) / w;
      const scaleNoise = ((64 + dx) * 5 + y * 7) % 6;
      let c;
      if (nd > 0.9) c = "#0e3818";
      else if (nd > 0.75) c = "#165c28";
      else if (nd > 0.5) c = "#28944a";
      else if (nd > 0.25) c = "#3cba60";
      else c = "#48c868";
      // Scale shimmer
      if (scaleNoise === 0 && nd < 0.85) c = "#60e078";
      // Belly lighter
      if (dx > 0 && nd > 0.2 && nd < 0.65 && t > 0.2 && t < 0.8) c = "#b8d868";
      px(ctx, 64 + dx, y + by, c);
    }
  }

  // Belly plates detail
  for (let y = 48; y <= 92; y += 4) {
    for (let dx = 3; dx <= 14; dx++) {
      px(ctx, 64 + dx, y + by, "#d8f098");
      px(ctx, 64 + dx, y + 1 + by, "#c8e088");
    }
  }

  // ── Legs — thick powerful forelimbs ──
  for (let leg = 0; leg < 2; leg++) {
    const lx = leg === 0 ? 44 : 78;
    for (let y = 86; y <= 112; y++) {
      const t = (y - 86) / 26;
      const w = 5 + Math.floor((1 - t * 0.4) * 4);
      for (let dx = -w; dx <= w; dx++) {
        const nd = Math.abs(dx) / w;
        let c;
        if (nd > 0.8) c = "#0e3818";
        else if (nd > 0.5) c = "#1a5828";
        else c = "#28944a";
        px(ctx, lx + dx, y + by, c);
      }
    }
    // Claws
    for (let c = 0; c < 3; c++) {
      const cx = lx - 4 + c * 4;
      px(ctx, cx, 113 + by, "#d8c880"); px(ctx, cx, 114 + by, "#c8b870"); px(ctx, cx, 115 + by, "#b8a860");
      px(ctx, cx + 1, 113 + by, "#c8b870");
    }
  }

  // ── Neck ── thick and powerful rising up
  for (let y = 14; y <= 44; y++) {
    const t = (y - 14) / 30;
    const nx = 64 - 6 + Math.round(Math.sin(t * 0.8) * 3); // slight S-curve
    const nw = 10 + Math.floor(t * 6);
    for (let dx = -nw; dx <= nw; dx++) {
      const nd = Math.abs(dx) / nw;
      let c;
      if (nd > 0.88) c = "#0e3818";
      else if (nd > 0.7) c = "#165c28";
      else if (nd > 0.4) c = "#28944a";
      else c = "#3cba60";
      // Neck belly (right side)
      if (dx > 0 && nd > 0.2 && nd < 0.65) c = "#a0c868";
      px(ctx, nx + dx, y + by, c);
    }
    // Spine ridges along neck
    if (y % 3 === 0) {
      px(ctx, nx - nw + 1, y + by, "#c8a020");
      px(ctx, nx - nw, y + by, "#e8d040");
    }
  }

  // ── Head ── big angular dragon head
  const headX = 58 + Math.round(Math.sin(f * 0.05) * 2);
  for (let y = 4; y <= 24; y++) {
    const t = (y - 4) / 20;
    // Wedge shape: wider at back, narrower at snout
    const w = Math.floor(14 + Math.sin(t * Math.PI * 0.6) * 4 - t * 4);
    for (let dx = -w; dx <= w; dx++) {
      const nd = Math.abs(dx) / (w || 1);
      let c;
      if (nd > 0.9) c = "#0e3818";
      else if (nd > 0.7) c = "#165c28";
      else if (t > 0.7) c = "#1a5828"; // darker snout
      else if (nd > 0.4) c = "#28944a";
      else c = "#38b058";
      px(ctx, headX + dx, y + by, c);
    }
  }

  // ── Horns ── sweeping back
  for (let h = 0; h < 2; h++) {
    const side = h === 0 ? -1 : 1;
    for (let i = 0; i < 12; i++) {
      const t = i / 11;
      const hx = headX + side * (10 + t * 8);
      const hy = 6 - t * 6 + by;
      const thick = Math.max(1, 3 - Math.floor(t * 2.5));
      const c = t < 0.3 ? "#8a7830" : t < 0.6 ? "#c8b040" : "#e8d860";
      for (let dx = -thick; dx <= thick; dx++) {
        if (Math.abs(dx) <= thick) px(ctx, Math.round(hx) + dx, Math.round(hy), c);
      }
    }
  }

  // ── Brow ridge ──
  for (let dx = -14; dx <= 14; dx++) {
    const depth = Math.abs(dx) < 8 ? 3 : 2;
    for (let dy = 0; dy < depth; dy++) px(ctx, headX + dx, 9 + dy + by, "#0e3818");
  }

  // ── Eyes ── fierce orange/gold, glowing
  const eyeFlash = f % 8 < 4;
  for (let e = 0; e < 2; e++) {
    const ex = headX + (e === 0 ? -7 : 7);
    const ey = 12 + by;
    // Socket
    for (let dy = -3; dy <= 3; dy++) for (let dx = -4; dx <= 4; dx++) {
      const d = Math.sqrt((dx * 0.8) ** 2 + dy ** 2);
      if (d <= 3.5) px(ctx, ex + dx, ey + dy, "#0a1808");
    }
    // Iris
    disc(ctx, ex, ey, 3, eyeFlash ? "#ff9030" : "#e87020");
    disc(ctx, ex, ey, 2, eyeFlash ? "#ffe060" : "#ffb040");
    px(ctx, ex, ey, "#1a0808"); // pupil slit center
    px(ctx, ex, ey - 1, "#1a0808");
    px(ctx, ex, ey + 1, "#1a0808");
    // Specular
    px(ctx, ex - 1, ey - 1, "#fff8");
    // Eye glow
    for (let dy = -5; dy <= 5; dy++) for (let dx = -6; dx <= 6; dx++) {
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 4 && d <= 6) {
        const a = 0.12 - (d - 4) * 0.06;
        if (a > 0) px(ctx, ex + dx, ey + dy, `rgba(255,144,48,${a})`);
      }
    }
  }

  // ── Nostrils ──
  px(ctx, headX - 4, 19 + by, "#0a1808"); px(ctx, headX - 3, 19 + by, "#0a1808");
  px(ctx, headX + 3, 19 + by, "#0a1808"); px(ctx, headX + 4, 19 + by, "#0a1808");
  // Smoke wisps from nostrils
  if (f % 6 < 3) {
    px(ctx, headX - 5, 18 + by, "rgba(180,180,180,0.3)");
    px(ctx, headX + 5, 17 + by, "rgba(180,180,180,0.25)");
  }

  // ── Maw / jaw ──
  for (let dx = -10; dx <= 10; dx++) {
    px(ctx, headX + dx, 22 + by, "#0e3818");
    if (Math.abs(dx) < 8) px(ctx, headX + dx, 23 + by, "#0a1808");
  }
  // Fangs
  px(ctx, headX - 7, 23 + by, "#f0ece0"); px(ctx, headX - 7, 24 + by, "#e0dcd0");
  px(ctx, headX + 7, 23 + by, "#f0ece0"); px(ctx, headX + 7, 24 + by, "#e0dcd0");
  px(ctx, headX - 4, 24 + by, "#f0ece0"); px(ctx, headX + 4, 24 + by, "#f0ece0");

  // ── Fire breath ── periodic burst from mouth
  const firePhase = f % 20;
  if (firePhase < 10) {
    const intensity = Math.sin((firePhase / 10) * Math.PI);
    const fireLen = Math.floor(intensity * 18);
    for (let i = 0; i < fireLen; i++) {
      const t = i / (fireLen || 1);
      const fw = Math.floor((1 - t * 0.6) * 5 * intensity);
      const fx = headX + Math.round(Math.sin(f * 0.4 + i * 0.3) * t * 3);
      const fy = 25 + i + by;
      for (let dx = -fw; dx <= fw; dx++) {
        const nd = Math.abs(dx) / (fw || 1);
        let c;
        if (nd < 0.3) c = t < 0.3 ? "#fff8e0" : "#ffed4a";
        else if (nd < 0.6) c = t < 0.4 ? "#ffb830" : "#f39c12";
        else c = t < 0.5 ? "#e67e22" : "#c0501880";
        if (fx + dx >= 0 && fx + dx < 128 && fy >= 0 && fy < 128) px(ctx, fx + dx, fy, c);
      }
    }
    // Embers
    for (let i = 0; i < 4; i++) {
      const ex = headX + Math.round(Math.sin(f * 0.3 + i * 2) * 6);
      const ey = 26 + fireLen + i * 2 + by;
      if (ey < 128) px(ctx, ex, ey, i % 2 === 0 ? "#ffed4a60" : "#f39c1240");
    }
  }

  // ── Spine ridges along back ──
  for (let i = 0; i < 8; i++) {
    const sx = 52 - i * 1;
    const sy = 36 + i * 5 + by;
    px(ctx, sx, sy - 2, "#e8d040");
    px(ctx, sx, sy - 1, "#c8a020");
    px(ctx, sx + 1, sy - 2, "#f8e870");
  }

  // ── Ambient fire particles ──
  for (let i = 0; i < 3; i++) {
    if ((f + i * 7) % 14 < 5) {
      const px2 = 40 + ((f * 3 + i * 23) % 48);
      const py = 20 + ((f * 2 + i * 17) % 30);
      px(ctx, px2, py + by, "#f39c1230");
    }
  }
}

// ═══════════════════════════════════════════════════════
// GOLEM — The Quiz Golem  (128x128 native)
// Massive stone construct with glowing runes and cracks
// ═══════════════════════════════════════════════════════
function drawGolem(ctx, f) {
  const by = f % 4 < 2 ? 0 : 1;
  ellipse(ctx, 64, 118 + by, 38, 6, "rgba(0,0,0,0.3)");

  // Legs
  for (let leg = 0; leg < 2; leg++) {
    const lx = leg === 0 ? 44 : 84;
    for (let y = 88; y <= 114; y++) {
      const t = (y - 88) / 26; const w = 6 + Math.floor(t * 4);
      for (let dx = -w; dx <= w; dx++) {
        const nd = Math.abs(dx) / w; const noise = ((lx + dx) * 7 + y * 11) % 7;
        const v = 65 + Math.floor((1 - nd) * 30) + noise * 2;
        px(ctx, lx + dx, y + by, `rgb(${v},${Math.floor(v * 0.95)},${Math.floor(v * 0.85)})`);
      }
    }
    for (let dx = -10; dx <= 10; dx++) for (let dy = 0; dy < 5; dy++) {
      const v = 60 + Math.abs(dx) + dy * 3;
      px(ctx, lx + dx, 114 + dy + by, `rgb(${v},${Math.floor(v * 0.95)},${Math.floor(v * 0.85)})`);
    }
  }

  // Torso — massive slab
  for (let y = 30; y <= 95; y++) {
    const t = (y - 30) / 65; const w = Math.floor(24 + Math.sin(t * Math.PI * 0.7) * 12);
    for (let dx = -w; dx <= w; dx++) {
      const nd = Math.abs(dx) / w; const noise = ((64 + dx) * 7 + y * 13) % 9;
      const base = nd > 0.85 ? 50 : nd > 0.6 ? 65 : nd > 0.3 ? 78 : 88;
      const v = base + noise * 2;
      px(ctx, 64 + dx, y + by, `rgb(${Math.floor(v * 0.6)},${Math.floor(v * 0.58)},${Math.floor(v * 0.52)})`);
    }
  }

  // Cracks
  [[50,48,6,0.4],[78,55,8,-0.3],[58,72,5,0.5],[72,80,7,-0.2]].forEach(([cx,cy,len,angle]) => {
    for (let i = 0; i < len; i++) {
      const x = Math.round(cx + Math.cos(angle) * i * 2); const y = Math.round(cy + Math.sin(angle) * i * 2) + by;
      px(ctx, x, y, "#2a2820"); px(ctx, x, y + 1, "#35332a");
    }
  });

  // Head
  for (let y = 8; y <= 36; y++) {
    const t = (y - 8) / 28; const w = Math.floor(16 + Math.sin(t * Math.PI * 0.85) * 8);
    for (let dx = -w; dx <= w; dx++) {
      const nd = Math.abs(dx) / w; const noise = ((64 + dx) * 5 + y * 9) % 7;
      const base = nd > 0.85 ? 55 : nd > 0.5 ? 70 : 85; const v = base + noise * 2;
      px(ctx, 64 + dx, y + by, `rgb(${Math.floor(v * 0.6)},${Math.floor(v * 0.58)},${Math.floor(v * 0.52)})`);
    }
  }

  // Brow ridge
  for (let dx = -18; dx <= 18; dx++) { const depth = Math.abs(dx) < 6 ? 3 : 2; for (let dy = 0; dy < depth; dy++) px(ctx, 64 + dx, 16 + dy + by, "#403a30"); }

  // Eyes — glowing green runes
  const eg = f % 8 < 4;
  const eC = eg ? ["#50ff70","#40e060","#30c050"] : ["#40e060","#30c050","#20a040"];
  for (let e = 0; e < 2; e++) {
    const ex = e === 0 ? 52 : 76;
    for (let dy = -4; dy <= 4; dy++) for (let dx = -5; dx <= 5; dx++) { if (Math.sqrt(dx * dx + dy * dy * 1.4) <= 5) px(ctx, ex + dx, 22 + dy + by, "#1a1a15"); }
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const d = Math.sqrt(dx * dx + dy * dy); if (d <= 3) px(ctx, ex + dx, 22 + dy + by, d < 1.2 ? eC[0] : d < 2.2 ? eC[1] : eC[2]); }
    for (let dy = -6; dy <= 6; dy++) for (let dx = -7; dx <= 7; dx++) { const d = Math.sqrt(dx * dx + dy * dy); if (d > 4 && d <= 7) { const a = 0.15 - (d - 4) * 0.05; if (a > 0) px(ctx, ex + dx, 22 + dy + by, `rgba(80,255,112,${a})`); } }
  }

  // Mouth
  for (let dx = -10; dx <= 10; dx++) { const jy = 30 + (dx % 3 === 0 ? 1 : 0); px(ctx, 64 + dx, jy + by, "#2a2820"); if (dx % 4 === 0) px(ctx, 64 + dx, jy + 1 + by, "#2a2820"); }

  // Arms
  for (let arm = 0; arm < 2; arm++) {
    const side = arm === 0 ? -1 : 1; const ax = 64 + side * 36;
    const swing = Math.sin(f * 0.05 + arm * Math.PI) * 2;
    for (let y = 36; y <= 90; y++) {
      const t = (y - 36) / 54; const w = 7 + Math.floor(Math.sin(t * Math.PI * 0.6) * 5);
      for (let dx = -w; dx <= w; dx++) {
        const nd = Math.abs(dx) / w; const noise = ((ax + dx) * 7 + y * 11) % 6; const v = 60 + Math.floor((1 - nd) * 30) + noise * 2;
        px(ctx, ax + dx + Math.round(swing * t), y + by, `rgb(${v},${Math.floor(v * 0.95)},${Math.floor(v * 0.85)})`);
      }
    }
    // Fists
    const fY = 88 + by + Math.round(swing); const fX = ax + Math.round(swing * 0.8);
    for (let dy = -5; dy <= 8; dy++) for (let dx = -9; dx <= 9; dx++) { const d = Math.sqrt((dx * 0.7) ** 2 + dy ** 2); if (d <= 8) { const v = 70 + Math.floor((1 - d / 8) * 25); px(ctx, fX + dx, fY + dy, `rgb(${v},${Math.floor(v * 0.95)},${Math.floor(v * 0.85)})`); } }
  }

  // Shoulders
  for (let s = 0; s < 2; s++) { const sx = s === 0 ? 34 : 94; disc(ctx, sx, 34 + by, 10, "#5a5848"); disc(ctx, sx, 34 + by, 8, "#6a6858"); disc(ctx, sx, 33 + by, 5, "#787668"); }

  // Rune markings (glowing)
  const rG = 40 + Math.sin(f * 0.15) * 25; const rC = `hsl(140, 85%, ${rG}%)`;
  const rcx = 64, rcy = 58 + by;
  for (let i = -6; i <= 6; i++) { px(ctx, rcx + i, rcy, rC); px(ctx, rcx, rcy + i, rC); }
  for (let a = 0; a < 16; a++) { const angle = (a / 16) * Math.PI * 2; px(ctx, rcx + Math.round(Math.cos(angle) * 8), rcy + Math.round(Math.sin(angle) * 8), rC); }
  for (let arm = 0; arm < 2; arm++) { const arx = arm === 0 ? 30 : 98; px(ctx, arx, 55 + by, rC); px(ctx, arx - 1, 56 + by, rC); px(ctx, arx + 1, 56 + by, rC); px(ctx, arx, 57 + by, rC); }
  px(ctx, 64, 12 + by, rC); px(ctx, 63, 13 + by, rC); px(ctx, 65, 13 + by, rC); px(ctx, 64, 14 + by, rC);
  for (let dy = -12; dy <= 12; dy++) for (let dx = -12; dx <= 12; dx++) { const d = Math.sqrt(dx * dx + dy * dy); if (d > 8 && d <= 12) { const a = 0.08 - (d - 8) * 0.02; if (a > 0) px(ctx, rcx + dx, rcy + dy, `hsla(140, 85%, ${rG}%, ${a})`); } }
}

// ═══════════════════════════════════════════════════════
// HYDRA — The Concept Hydra  (128x128 native)
// Three-headed serpent rising from murky water
// ═══════════════════════════════════════════════════════
function drawHydra(ctx, f) {
  const by = f % 4 < 2 ? 0 : 1;

  // Murky water
  for (let y = 102; y < 128; y++) { const wo = Math.sin(f * 0.04 + y * 0.15) * 3; for (let x = 0; x < 128; x++) { const wave = Math.sin(x * 0.1 + f * 0.06 + y * 0.05) * 0.15; const a = 0.2 + wave - (y - 102) * 0.005; if (a > 0.02) px(ctx, x + Math.round(wo), y, `rgba(20,80,50,${a})`); } }

  // Body mass
  for (let y = 68; y <= 108; y++) {
    const t = (y - 68) / 40; const w = Math.floor(22 + Math.sin(t * Math.PI) * 12);
    for (let dx = -w; dx <= w; dx++) {
      const nd = Math.abs(dx) / w; const sn = ((64 + dx) * 5 + y * 7) % 5;
      let c; if (nd > 0.88) c = "#0e3018"; else if (nd > 0.7) c = "#1a4a2a"; else if (nd > 0.4) c = "#247838"; else c = "#2c9848";
      if (sn === 0 && nd < 0.85) c = "#38b458";
      px(ctx, 64 + dx, y + by, c);
    }
  }
  // Belly plates
  for (let y = 75; y <= 100; y += 4) for (let dx = -8; dx <= 8; dx++) { px(ctx, 64 + dx, y + by, "#70c870"); px(ctx, 64 + dx, y + 1 + by, "#60b060"); }

  // Three necks + heads
  const heads = [{ cx: 30, ty: 12, sw: Math.sin(f * 0.09) * 5 }, { cx: 64, ty: 6, sw: Math.sin(f * 0.08 + 1.2) * 3 }, { cx: 98, ty: 12, sw: Math.sin(f * 0.09 + 2.4) * 5 }];
  heads.forEach((h, hi) => {
    const hx = h.cx + Math.round(h.sw);
    // Neck
    for (let y = h.ty + 18; y <= 76; y++) {
      const nt = (y - (h.ty + 18)) / (76 - h.ty - 18); const nx = Math.round(hx + (64 - hx) * nt * nt); const nw = 4 + Math.floor(nt * 5);
      for (let dx = -nw; dx <= nw; dx++) { const nd = Math.abs(dx) / nw; let c; if (nd > 0.85) c = "#0e3018"; else if (nd > 0.6) c = "#1a5a2a"; else c = "#28a048"; if (dx > 0 && nd > 0.3 && nd < 0.7) c = "#60b868"; px(ctx, nx + dx, y + by, c); }
    }
    // Head
    for (let dy = -8; dy <= 8; dy++) {
      const tw = 12 - (dy + 8) * 0.25;
      for (let dx = -Math.floor(tw); dx <= Math.floor(tw); dx++) {
        const nd = Math.abs(dx) / tw; let c;
        if (nd > 0.9) c = "#0e3018"; else if (nd > 0.6) c = "#1a5a2a"; else if (dy > 2) c = "#60b868"; else c = "#30b050";
        px(ctx, hx + dx, h.ty + dy + by, c);
      }
    }
    // Eyes
    const ef = (f + hi * 5) % 10 < 5;
    for (let e = 0; e < 2; e++) { const ex = hx + (e === 0 ? -5 : 5); const ey = h.ty - 2 + by; disc(ctx, ex, ey, 3, "#1a0505"); disc(ctx, ex, ey, 2, ef ? "#ff5050" : "#cc2828"); px(ctx, ex, ey, ef ? "#ff8888" : "#ff4444"); if (ef) for (let a = 0; a < 8; a++) { const ga = (a / 8) * Math.PI * 2; px(ctx, ex + Math.round(Math.cos(ga) * 4), ey + Math.round(Math.sin(ga) * 4), "rgba(255,50,50,0.15)"); } }
    // Fangs
    px(ctx, hx - 4, h.ty + 7 + by, "#e8e0d0"); px(ctx, hx - 3, h.ty + 9 + by, "#e8e0d0"); px(ctx, hx + 4, h.ty + 7 + by, "#e8e0d0"); px(ctx, hx + 3, h.ty + 9 + by, "#e8e0d0");
    // Tongue
    if ((f + hi * 4) % 12 < 6) { const ty = h.ty + 10 + by; px(ctx, hx, ty, "#d04050"); px(ctx, hx, ty + 1, "#d04050"); px(ctx, hx - 1, ty + 2, "#d04050"); px(ctx, hx + 1, ty + 2, "#d04050"); px(ctx, hx - 2, ty + 3, "#c03040"); px(ctx, hx + 2, ty + 3, "#c03040"); }
    // Crest
    for (let i = 0; i < 3; i++) { const cx = hx - 3 + i * 3; px(ctx, cx, h.ty - 8 + by, "#50c060"); px(ctx, cx, h.ty - 9 + by, "#40a050"); px(ctx, cx, h.ty - 10 + by, "#308040"); }
  });
  for (let i = 0; i < 4; i++) { const dx = 30 + ((f * 3 + i * 31) % 68); const dy = 100 + ((f * 2 + i * 17) % 20); if ((f + i * 7) % 8 < 4) px(ctx, dx, dy + by, "#50ff7060"); }
}

// ═══════════════════════════════════════════════════════
// PHANTOM — The Exam Phantom  (128x128 native)
// Ghostly hooded specter with flowing robes and spectral hands
// ═══════════════════════════════════════════════════════
function drawPhantom(ctx, f) {
  const float = Math.sin(f * 0.07) * 4;
  const fy = Math.round(float);

  // Wispy trail
  for (let y = 95; y <= 122; y++) { const fade = (y - 95) / 27; for (let x = 30; x <= 98; x++) { const wave = Math.sin(f * 0.06 + x * 0.12 + y * 0.08) * 6; const ax = x + Math.round(wave); if (ax >= 0 && ax < 128) { const a = (0.4 - fade * 0.4) * (1 - Math.abs(x - 64) / 40); if (a > 0.02) px(ctx, ax, y + fy, `rgba(140,100,220,${a})`); } } }

  // Body / robes
  for (let y = 28; y <= 100; y++) {
    const t = (y - 28) / 72; const baseW = 14 + Math.sin(t * Math.PI * 0.7) * 14;
    const wave = t > 0.6 ? Math.sin(y * 0.15 + f * 0.08) * (t - 0.6) * 20 : 0; const w = Math.floor(baseW + wave);
    for (let dx = -w; dx <= w + Math.floor(wave * 0.3); dx++) {
      const ax = 64 + dx; if (ax < 0 || ax >= 128) continue;
      const nd = Math.abs(dx) / (w || 1); const a = t > 0.85 ? 1 - (t - 0.85) / 0.15 : 1;
      let v, alpha; if (nd > 0.85) { v = 60; alpha = a * 0.7; } else if (nd > 0.6) { v = 80; alpha = a * 0.85; } else if (nd > 0.3) { v = 100; alpha = a * 0.95; } else { v = 115; alpha = a; }
      px(ctx, ax, y + fy, `rgba(${v},${Math.floor(v * 0.65)},${Math.floor(v * 1.6)},${alpha})`);
    }
  }

  // Hood
  for (let y = 8; y <= 38; y++) {
    const t = (y - 8) / 30; const w = Math.floor(14 + Math.sin(t * Math.PI * 0.85) * 12);
    for (let dx = -w; dx <= w; dx++) { const nd = Math.abs(dx) / w; let v; if (nd > 0.9) v = 40; else if (nd > 0.7) v = 50; else if (t < 0.3) v = 65; else v = 55; px(ctx, 64 + dx, y + fy, `rgb(${Math.floor(v * 0.65)},${Math.floor(v * 0.45)},${Math.floor(v * 1.1)})`); }
  }

  // Face void
  for (let y = 16; y <= 34; y++) { const w = Math.floor(8 + Math.sin((y - 16) / 18 * Math.PI) * 6); for (let dx = -w; dx <= w; dx++) px(ctx, 64 + dx, y + fy, "#08030f"); }

  // Eyes
  const ep = f % 8 < 4;
  for (let e = 0; e < 2; e++) {
    const ex = e === 0 ? 54 : 74; const ey = 24 + fy;
    for (let dy = -5; dy <= 5; dy++) for (let dx = -5; dx <= 5; dx++) { const d = Math.sqrt(dx * dx + dy * dy); if (d > 3 && d <= 5) { const a = 0.2 - (d - 3) * 0.1; px(ctx, ex + dx, ey + dy, `rgba(255,60,60,${a})`); } }
    disc(ctx, ex, ey, 3, ep ? "#ff5050" : "#cc2828"); disc(ctx, ex, ey, 2, ep ? "#ff8888" : "#ff4444"); px(ctx, ex, ey, "#ffcccc");
  }

  // Ghostly hands
  for (let hand = 0; hand < 2; hand++) {
    const side = hand === 0 ? -1 : 1; const hx = 64 + side * 32; const reach = Math.sin(f * 0.06 + hand * Math.PI) * 4;
    for (let i = 0; i < 10; i++) { const t = i / 9; const fx = Math.round(hx + side * (i * 2 + reach * t)); const fy2 = Math.round(56 + Math.sin(t * Math.PI) * -8) + fy; const a = 0.6 - t * 0.4; disc(ctx, fx, fy2, Math.max(1, 3 - Math.floor(t * 2)), `rgba(140,100,200,${a})`); }
    for (let finger = 0; finger < 3; finger++) { const fx = hx + side * (18 + Math.round(reach)); const ffy = 50 + finger * 3 + fy; for (let i = 0; i < 4; i++) px(ctx, fx + side * i, ffy + (finger - 1) * i, `rgba(200,180,240,${0.5 - i * 0.1})`); }
  }

  // Soul particles
  for (let i = 0; i < 6; i++) { const pa = f * 0.04 + i * Math.PI * 2 / 6; const pr = 30 + Math.sin(f * 0.03 + i) * 10; const ppx = Math.round(64 + Math.cos(pa) * pr); const ppy = Math.round(50 + Math.sin(pa) * pr * 0.6) + fy; if ((f + i * 5) % 10 < 6 && ppx >= 0 && ppx < 128 && ppy >= 0 && ppy < 128) { px(ctx, ppx, ppy, "#c0a0f060"); px(ctx, ppx + 1, ppy, "#c0a0f030"); } }
}

// ═══════════════════════════════════════════════════════
// KRAKEN — The Knowledge Kraken  (128x128 native)
// Giant squid with bioluminescent spots and huge eyes
// ═══════════════════════════════════════════════════════
function drawKraken(ctx, f) {
  const by = f % 4 < 2 ? 0 : 1;

  // Tentacles (behind body)
  for (let t = 0; t < 8; t++) {
    const bx = 30 + t * 10; const ba = (t - 3.5) * 0.15;
    for (let seg = 0; seg < 28; seg++) {
      const st = seg / 28; const wave = Math.sin(f * 0.07 + t * 1.0 + seg * 0.25) * (6 + st * 10);
      const tx = Math.floor(bx + wave + ba * seg * 3); const ty = 72 + seg * 2 + by;
      if (tx < 0 || tx >= 128 || ty >= 128) continue;
      const thick = Math.max(1, Math.floor(4 - st * 3));
      for (let dx = -thick; dx <= thick; dx++) { const nd = Math.abs(dx) / (thick || 1); const c = nd > 0.6 ? "#6a1818" : st > 0.7 ? "#982828" : "#b83030"; if (tx + dx >= 0 && tx + dx < 128) px(ctx, tx + dx, ty, c); }
      if (seg % 4 === 0 && thick > 1) px(ctx, tx, ty, "#d06060");
    }
    const tipX = Math.floor(bx + Math.sin(f * 0.07 + t * 1.0 + 7) * 16 + ba * 84); if (tipX >= 0 && tipX < 128) px(ctx, tipX, Math.min(127, 126 + by), "#d06060");
  }

  // Body / mantle
  for (let y = 10; y <= 78; y++) {
    const t = (y - 10) / 68; const w = Math.floor(20 + Math.sin(t * Math.PI * 0.75) * 18);
    for (let dx = -w; dx <= w; dx++) {
      const nd = Math.abs(dx) / w; let c;
      if (nd > 0.9) c = "#4a0e0e"; else if (nd > 0.75) c = "#6a1818"; else if (nd > 0.5) c = "#8a2424"; else if (nd > 0.25) c = "#b03030"; else c = "#c83838";
      if (((64 + dx) * 7 + y * 11) % 11 < 1 && nd < 0.8) c = "#d84848";
      px(ctx, 64 + dx, y + by, c);
    }
  }

  // Bioluminescent spots
  [[50,35],[78,35],[45,50],[83,50],[55,62],[73,62],[64,44]].forEach(([sx,sy]) => {
    const glow = Math.sin(f * 0.1 + sx * 0.1 + sy * 0.1) * 0.5 + 0.5;
    disc(ctx, sx, sy + by, 2, `rgba(255,200,100,${0.2 + glow * 0.4})`);
    px(ctx, sx, sy + by, `rgba(255,240,180,${0.3 + glow * 0.5})`);
  });

  // Eyes — huge menacing
  for (let e = 0; e < 2; e++) {
    const ex = e === 0 ? 48 : 80; const ey = 38 + by;
    for (let dy = -7; dy <= 7; dy++) for (let dx = -8; dx <= 8; dx++) { const d = Math.sqrt((dx * 0.85) ** 2 + dy ** 2); if (d <= 7) px(ctx, ex + dx, ey + dy, d > 5.5 ? "#1a0808" : "#ffed4a"); }
    for (let dy = -5; dy <= 5; dy++) { const pw = Math.max(1, 2 - Math.abs(dy)); for (let dx = -pw; dx <= pw; dx++) px(ctx, ex + dx, ey + dy, "#1a0505"); }
    for (let a = 0; a < 20; a++) { const angle = (a / 20) * Math.PI * 2; px(ctx, ex + Math.round(Math.cos(angle) * 5), ey + Math.round(Math.sin(angle) * 5), "#d4a020"); }
    for (let dy = -10; dy <= 10; dy++) for (let dx = -11; dx <= 11; dx++) { const d = Math.sqrt(dx ** 2 + dy ** 2); if (d > 8 && d <= 11) { const a = 0.1 - (d - 8) * 0.03; if (a > 0) px(ctx, ex + dx, ey + dy, `rgba(255,237,74,${a})`); } }
  }

  // Beak
  for (let y = 50; y <= 62; y++) { const bw = Math.max(0, 6 - Math.floor((y - 50) * 0.4)); for (let dx = -bw; dx <= bw; dx++) px(ctx, 64 + dx, y + by, Math.abs(dx) / (bw || 1) > 0.5 ? "#1a0808" : "#2a1010"); }
  px(ctx, 64, 63 + by, "#e8e0d0"); px(ctx, 63, 62 + by, "#e8e0d0"); px(ctx, 65, 62 + by, "#e8e0d0");

  for (let i = 0; i < 5; i++) { if ((f + i * 6) % 12 < 5) { const sx = 20 + ((f * 5 + i * 23) % 88); const sy = 90 + ((f * 3 + i * 11) % 30); px(ctx, sx, sy + by, "#4090c050"); } }
}

// ═══════════════════════════════════════════════════════
// CHIMERA — The Final Chimera  (128x128 native)
// Lion/eagle/serpent hybrid with mane and wings
// ═══════════════════════════════════════════════════════
function drawChimera(ctx, f) {
  const by = f % 4 < 2 ? 0 : 1;
  ellipse(ctx, 64, 120 + by, 42, 7, "rgba(0,0,0,0.25)");

  // Wings (behind)
  const wu = f % 10 < 5; const we = wu ? 8 : 2;
  for (let side = -1; side <= 1; side += 2) {
    for (let y = 28; y <= 62; y++) {
      const wy = (y - 28) / 34; const w = Math.floor(Math.sin(wy * Math.PI) * (16 + we));
      for (let dx = 0; dx <= w; dx++) { const x = 64 + side * (24 + dx); if (x < 0 || x >= 128) continue; const nd = dx / (w || 1); const feather = Math.sin(dx * 0.4 + y * 0.3) > 0; let c; if (nd > 0.85) c = "#6a4010"; else if (feather) c = "#a87830"; else c = "#c09040"; px(ctx, x, y + by, c); }
    }
    for (let y = 30; y <= 56; y++) px(ctx, 64 + side * 24, y + by, "#5a3810");
  }

  // Serpent tail
  for (let i = 0; i < 22; i++) {
    const t = i / 21; const tx = 64 + 28 + i * 3 + Math.round(Math.sin(f * 0.1 + i * 0.35) * 4);
    const ty = 72 - i + Math.round(Math.cos(f * 0.08 + i * 0.3) * 3) + by;
    if (tx >= 0 && tx < 128 && ty >= 0 && ty < 128) { const thick = Math.max(1, 4 - Math.floor(t * 3)); for (let dx = -thick; dx <= thick; dx++) { const c = t > 0.7 ? "#1a6a2a" : "#28943a"; if (tx + dx >= 0 && tx + dx < 128) px(ctx, tx + dx, ty, c); } }
  }
  // Snake head at tip
  const snkX = Math.min(126, 64 + 28 + 66 + Math.round(Math.sin(f * 0.1 + 7.7) * 4));
  const snkY = 50 + Math.round(Math.cos(f * 0.08 + 6.6) * 3) + by;
  if (snkX < 126 && snkY > 0 && snkY < 126) {
    disc(ctx, snkX, snkY, 3, "#30a848");
    px(ctx, snkX - 1, snkY - 1, "#ff4040"); px(ctx, snkX + 1, snkY - 1, "#ff4040");
    if (f % 8 < 4) { px(ctx, snkX + 3, snkY, "#d04050"); px(ctx, snkX + 4, snkY - 1, "#c03040"); px(ctx, snkX + 4, snkY + 1, "#c03040"); }
  }

  // Body — lion torso
  for (let y = 44; y <= 96; y++) {
    const t = (y - 44) / 52; const w = Math.floor(20 + Math.sin(t * Math.PI * 0.7) * 12);
    for (let dx = -w; dx <= w; dx++) { const nd = Math.abs(dx) / w; let c; if (nd > 0.88) c = "#7a4a1a"; else if (nd > 0.65) c = "#a06820"; else if (nd > 0.35) c = "#c48838"; else c = "#d8a050"; if (((64 + dx) * 3 + y * 7) % 6 < 1 && nd < 0.8) c = "#e0b060"; px(ctx, 64 + dx, y + by, c); }
  }

  // Mane — big and wild
  for (let y = 12; y <= 50; y++) {
    const t = (y - 12) / 38; const w = Math.floor(20 + Math.sin(t * Math.PI) * 14);
    for (let dx = -w; dx <= w; dx++) { const nd = Math.abs(dx) / w; const spiky = Math.sin(dx * 0.7 + f * 0.15 + y * 0.2) > 0.2; if (!spiky && nd > 0.6) continue; let c; if (nd > 0.8) c = "#8a5010"; else if (nd > 0.5) c = "#c07820"; else c = "#d89030"; px(ctx, 64 + dx, y + by, c); }
  }

  // Head (lion face)
  for (let y = 18; y <= 44; y++) {
    const t = (y - 18) / 26; const w = Math.floor(12 + Math.sin(t * Math.PI) * 6);
    for (let dx = -w; dx <= w; dx++) { const nd = Math.abs(dx) / w; let c; if (nd > 0.85) c = "#a06820"; else if (nd > 0.5) c = "#d0a048"; else c = "#e0b860"; px(ctx, 64 + dx, y + by, c); }
  }

  // Eyes — fierce amber
  const eg = f % 6 < 3;
  for (let e = 0; e < 2; e++) {
    const ex = e === 0 ? 54 : 74; const ey = 28 + by;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -4; dx <= 4; dx++) { const d = Math.sqrt((dx * 0.8) ** 2 + dy ** 2); if (d <= 3.5) px(ctx, ex + dx, ey + dy, "#1a0808"); }
    disc(ctx, ex, ey, 3, eg ? "#ff9920" : "#e08010"); px(ctx, ex, ey, "#1a0808"); px(ctx, ex - 1, ey - 1, "#fff8");
  }

  // Nose + mouth
  px(ctx, 63, 36 + by, "#4a2810"); px(ctx, 64, 36 + by, "#4a2810"); px(ctx, 65, 36 + by, "#4a2810");
  for (let dx = -6; dx <= 6; dx++) px(ctx, 64 + dx, 39 + by, "#3a1808");
  // Fangs
  px(ctx, 58, 40 + by, "#f0e8d0"); px(ctx, 59, 41 + by, "#f0e8d0"); px(ctx, 70, 40 + by, "#f0e8d0"); px(ctx, 69, 41 + by, "#f0e8d0");

  // Eagle beak crest
  for (let i = 0; i < 6; i++) { px(ctx, 63 + (i < 3 ? -1 : 1), 19 - i + by, i < 2 ? "#f0d860" : "#d4a040"); px(ctx, 64, 19 - i + by, "#e8c848"); px(ctx, 65 + (i < 3 ? 1 : -1), 19 - i + by, i < 2 ? "#f0d860" : "#d4a040"); }

  // Legs
  for (let leg = 0; leg < 2; leg++) {
    const lx = leg === 0 ? 46 : 82;
    for (let y = 88; y <= 114; y++) { const t = (y - 88) / 26; const w = 4 + Math.floor((1 - t) * 3); for (let dx = -w; dx <= w; dx++) { const nd = Math.abs(dx) / w; px(ctx, lx + dx, y + by, nd > 0.6 ? "#7a4a1a" : "#a06820"); } }
    // Claws
    for (let c = 0; c < 3; c++) { const cx = lx - 3 + c * 3; px(ctx, cx, 115 + by, "#e0d0b0"); px(ctx, cx, 116 + by, "#d0c0a0"); px(ctx, cx, 117 + by, "#c0b090"); }
  }

  // Fire breath
  if (f % 6 < 3) { for (let i = 0; i < 3; i++) { const fx = 64 + 14 + i * 4 + Math.round(Math.sin(f * 0.3 + i) * 2); const ffy = 36 + i * 2 + by; px(ctx, fx, ffy, "#f39c12"); px(ctx, fx + 1, ffy, "#ffed4a60"); } }
}

// ═══════════════════════════════════════════════════════
// MAIN DRAW FUNCTION
// ═══════════════════════════════════════════════════════
export function drawBoss(ctx, bossId, f) {
  ctx.clearRect(0, 0, SZ, SZ);
  if (bossId === "dragon") drawDragon(ctx, f);
  else if (bossId === "golem") drawGolem(ctx, f);
  else if (bossId === "hydra") drawHydra(ctx, f);
  else if (bossId === "phantom") drawPhantom(ctx, f);
  else if (bossId === "kraken") drawKraken(ctx, f);
  else if (bossId === "chimera") drawChimera(ctx, f);
  else drawDragon(ctx, f);
}
