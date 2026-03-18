// generate-chart-crimes-svgs.cjs
// Generates SVG chart files for the Digital Literacy "Chart Crimes" lesson.
// Output: public/images/chart-crimes/{chart-a,chart-b,pie-crimes}.svg

const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../public/images/chart-crimes");

// ─── Shared helpers ──────────────────────────────────────────────────────────

function toX(i, total, x0, x1) {
  return x0 + (i / (total - 1)) * (x1 - x0);
}

function toY(v, vMin, vMax, y0, y1) {
  // y0 = top (vMax), y1 = bottom (vMin)
  return y0 + ((vMax - v) / (vMax - vMin)) * (y1 - y0);
}

// ─── Chart A: truncated y-axis ($8M–$9M) ─────────────────────────────────────

function makeChartA() {
  const W = 620, H = 400;
  const x0 = 90, x1 = 570, y0 = 65, y1 = 320;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const data   = [8.2,  8.3,  8.5,  8.6,  8.7,  8.9];  // millions
  const vMin = 8.0, vMax = 9.0;
  const yTicks = [8.0, 8.25, 8.5, 8.75, 9.0];

  const pts = data.map((v, i) => [toX(i, 6, x0, x1), toY(v, vMin, vMax, y0, y1)]);
  const polyPts = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const fillPts = [
    `${pts[0][0]},${y1}`,
    ...pts.map(([x, y]) => `${x},${y}`),
    `${pts[pts.length-1][0]},${y1}`,
  ].join(" ");

  const gridLines = yTicks.map(v => {
    const y = toY(v, vMin, vMax, y0, y1);
    return `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="#2a3044" stroke-width="1"/>`;
  }).join("\n  ");

  const yLabels = yTicks.map(v => {
    const y = toY(v, vMin, vMax, y0, y1);
    const label = v === 8.0 ? "$8.0M" : v === 8.25 ? "$8.25M" : v === 8.5 ? "$8.5M" : v === 8.75 ? "$8.75M" : "$9.0M";
    return `<text x="${x0 - 8}" y="${y + 4}" text-anchor="end" fill="#94a3b8" font-size="11">${label}</text>`;
  }).join("\n  ");

  const xLabels = months.map((m, i) => {
    const x = toX(i, 6, x0, x1);
    return `<text x="${x}" y="${y1 + 18}" text-anchor="middle" fill="#94a3b8" font-size="12">${m}</text>`;
  }).join("\n  ");

  const dots = pts.map(([x, y]) =>
    `<circle cx="${x}" cy="${y}" r="4.5" fill="#f59e0b" stroke="#1a1f2e" stroke-width="1.5"/>`
  ).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#1a1f2e; font-family: system-ui, -apple-system, sans-serif; border-radius:10px;">
  <!-- Title -->
  <text x="${W/2}" y="26" text-anchor="middle" fill="#e2e8f0" font-size="14" font-weight="600">Monthly Streaming Revenue (Jan–Jun)</text>
  <!-- Subtitle badge -->
  <rect x="${W/2 - 110}" y="34" width="220" height="20" rx="4" fill="#2a1515"/>
  <text x="${W/2}" y="48" text-anchor="middle" fill="#f87171" font-size="11" font-weight="600">Chart A — Y-axis starts at $8,000,000</text>

  <!-- Grid lines -->
  ${gridLines}

  <!-- Fill area under line -->
  <polygon points="${fillPts}" fill="rgba(245,158,11,0.12)"/>

  <!-- Line -->
  <polyline points="${polyPts}" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>

  <!-- Dots -->
  ${dots}

  <!-- Axes -->
  <line x1="${x0}" y1="${y1}" x2="${x1 + 10}" y2="${y1}" stroke="#475569" stroke-width="1.5"/>
  <line x1="${x0}" y1="${y0 - 5}" x2="${x0}" y2="${y1}" stroke="#475569" stroke-width="1.5"/>

  <!-- Y-axis labels -->
  ${yLabels}

  <!-- X-axis labels -->
  ${xLabels}

  <!-- Y-axis title -->
  <text x="18" y="${(y0+y1)/2}" text-anchor="middle" fill="#64748b" font-size="11" transform="rotate(-90 18 ${(y0+y1)/2})">Revenue</text>

  <!-- ⚠ annotation -->
  <text x="${W/2}" y="${H - 10}" text-anchor="middle" fill="#f87171" font-size="11">⚠ Truncated axis — growth appears much larger than it is</text>
</svg>`;
}

// ─── Chart B: honest y-axis ($0–$10M) ────────────────────────────────────────

function makeChartB() {
  const W = 620, H = 400;
  const x0 = 90, x1 = 570, y0 = 65, y1 = 320;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const data   = [8.2,  8.3,  8.5,  8.6,  8.7,  8.9];
  const vMin = 0, vMax = 10.0;
  const yTicks = [0, 2, 4, 6, 8, 10];

  const pts = data.map((v, i) => [toX(i, 6, x0, x1), toY(v, vMin, vMax, y0, y1)]);
  const polyPts = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const fillPts = [
    `${pts[0][0]},${y1}`,
    ...pts.map(([x, y]) => `${x},${y}`),
    `${pts[pts.length-1][0]},${y1}`,
  ].join(" ");

  const gridLines = yTicks.map(v => {
    const y = toY(v, vMin, vMax, y0, y1);
    return `<line x1="${x0}" y1="${y.toFixed(1)}" x2="${x1}" y2="${y.toFixed(1)}" stroke="#2a3044" stroke-width="1"/>`;
  }).join("\n  ");

  const yLabels = yTicks.map(v => {
    const y = toY(v, vMin, vMax, y0, y1);
    return `<text x="${x0 - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="#94a3b8" font-size="11">$${v}M</text>`;
  }).join("\n  ");

  const xLabels = months.map((m, i) => {
    const x = toX(i, 6, x0, x1);
    return `<text x="${x}" y="${y1 + 18}" text-anchor="middle" fill="#94a3b8" font-size="12">${m}</text>`;
  }).join("\n  ");

  const dots = pts.map(([x, y]) =>
    `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="#60a5fa" stroke="#1a1f2e" stroke-width="1.5"/>`
  ).join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#1a1f2e; font-family: system-ui, -apple-system, sans-serif; border-radius:10px;">
  <!-- Title -->
  <text x="${W/2}" y="26" text-anchor="middle" fill="#e2e8f0" font-size="14" font-weight="600">Monthly Streaming Revenue (Jan–Jun)</text>
  <!-- Subtitle badge -->
  <rect x="${W/2 - 110}" y="34" width="220" height="20" rx="4" fill="#0f2a1a"/>
  <text x="${W/2}" y="48" text-anchor="middle" fill="#4ade80" font-size="11" font-weight="600">Chart B — Y-axis starts at $0</text>

  <!-- Grid lines -->
  ${gridLines}

  <!-- Fill area under line -->
  <polygon points="${fillPts}" fill="rgba(96,165,250,0.10)"/>

  <!-- Line -->
  <polyline points="${polyPts}" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>

  <!-- Dots -->
  ${dots}

  <!-- Axes -->
  <line x1="${x0}" y1="${y1}" x2="${x1 + 10}" y2="${y1}" stroke="#475569" stroke-width="1.5"/>
  <line x1="${x0}" y1="${y0 - 5}" x2="${x0}" y2="${y1}" stroke="#475569" stroke-width="1.5"/>

  <!-- Y-axis labels -->
  ${yLabels}

  <!-- X-axis labels -->
  ${xLabels}

  <!-- Y-axis title -->
  <text x="18" y="${(y0+y1)/2}" text-anchor="middle" fill="#64748b" font-size="11" transform="rotate(-90 18 ${(y0+y1)/2})">Revenue</text>

  <!-- ✓ annotation -->
  <text x="${W/2}" y="${H - 10}" text-anchor="middle" fill="#4ade80" font-size="11">✓ Honest baseline — 9% growth ($700K) looks like what it actually is</text>
</svg>`;
}

// ─── Pie Chart: the terrible one ─────────────────────────────────────────────

function makePieChart() {
  const W = 620, H = 420;
  const cx = 310, cy = 215, rx = 175, ry = 130; // ellipse (simulates 3D tilt)

  // 10 slices (percentages, sum to 100)
  const slices = [
    { pct: 19, color: "#ff2ddb" },  // hot pink
    { pct: 16, color: "#39ff14" },  // neon green
    { pct: 13, color: "#00c8ff" },  // electric blue
    { pct: 11, color: "#ff6a00" },  // orange
    { pct: 10, color: "#a855f7" },  // purple
    { pct: 9,  color: "#ffe600" },  // yellow
    { pct: 8,  color: "#00e5cc" },  // teal
    { pct: 7,  color: "#ff2222" },  // red
    { pct: 4,  color: "#8b4513" },  // brown
    { pct: 3,  color: "#ffffff" },  // white
  ];

  // Convert to angles (start at top = -90°)
  let cumAngle = -90;
  const paths = slices.map((s, i) => {
    const startDeg = cumAngle;
    cumAngle += (s.pct / 100) * 360;
    const endDeg = cumAngle;

    const startRad = (startDeg * Math.PI) / 180;
    const endRad   = (endDeg   * Math.PI) / 180;

    const x1 = cx + rx * Math.cos(startRad);
    const y1 = cy + ry * Math.sin(startRad);
    const x2 = cx + rx * Math.cos(endRad);
    const y2 = cy + ry * Math.sin(endRad);

    const largeArc = (s.pct > 50) ? 1 : 0;

    // "Exploded" — each slice is slightly offset from center along its midpoint angle
    const midRad = ((startDeg + endDeg) / 2) * Math.PI / 180;
    const offset = 10;
    const ox = cx + offset * Math.cos(midRad);
    const oy = cy + offset * Math.sin(midRad);

    return `<path d="M ${ox},${oy} L ${(ox + rx * Math.cos(startRad) - cx).toFixed(1) * 1 + ox - offset * Math.cos(midRad) + cx - ox + ox},${(oy + ry * Math.sin(startRad) - cy).toFixed(1) * 1 + oy - offset * Math.sin(midRad) + cy - oy + oy} A ${rx},${ry} 0 ${largeArc},1 ${(ox + rx * Math.cos(endRad) - cx + cx).toFixed(1)},${(oy + ry * Math.sin(endRad) - cy + cy).toFixed(1)} Z" fill="${s.color}" stroke="#111" stroke-width="1.5" opacity="0.92"/>`;
  });

  // Recalculate properly: offset each slice centroid
  const pathsClean = (() => {
    let ca = -90;
    return slices.map((s) => {
      const sa = ca;
      ca += (s.pct / 100) * 360;
      const ea = ca;
      const midDeg = (sa + ea) / 2;
      const midRad = (midDeg * Math.PI) / 180;
      const offset = 12;
      const ocx = cx + offset * Math.cos(midRad);
      const ocy = cy + offset * Math.sin(midRad);

      const sr = (sa * Math.PI) / 180;
      const er = (ea * Math.PI) / 180;
      const x1 = ocx + rx * Math.cos(sr);
      const y1 = ocy + ry * Math.sin(sr);
      const x2 = ocx + rx * Math.cos(er);
      const y2 = ocy + ry * Math.sin(er);
      const lg = (s.pct > 50) ? 1 : 0;

      return `<path d="M ${ocx.toFixed(1)},${ocy.toFixed(1)} L ${x1.toFixed(1)},${y1.toFixed(1)} A ${rx},${ry} 0 ${lg},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${s.color}" stroke="#0a0a0a" stroke-width="2" opacity="0.9"/>`;
    });
  })();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#f5f0e8; font-family: 'Comic Sans MS', cursive, sans-serif; border-radius:10px;">
  <!-- Busy background pattern -->
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0d8c8" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  <!-- Title (vague, in Comic Sans territory) -->
  <text x="${W/2}" y="36" text-anchor="middle" fill="#1a1a1a" font-size="20" font-weight="bold">Q3 Survey Results</text>

  <!-- 3D shadow layer -->
  <ellipse cx="${cx + 8}" cy="${cy + 18}" rx="${rx}" ry="${ry}" fill="rgba(0,0,0,0.25)"/>

  <!-- Pie slices (exploded, elliptical for fake 3D) -->
  ${pathsClean.join("\n  ")}

  <!-- No legend. No labels. No percentages. No context. -->
  <!-- Decorative flourishes that add noise -->
  <text x="30" y="${H - 20}" fill="#999" font-size="9" font-style="italic">Source: Internal</text>
  <text x="${W - 30}" y="${H - 20}" text-anchor="end" fill="#999" font-size="9">© Q3 2024</text>

  <!-- WordArt-style 3D label (terrible) -->
  <text x="${W/2 + 2}" y="${H - 50 + 2}" text-anchor="middle" fill="rgba(0,0,0,0.3)" font-size="12" font-weight="bold">Created with ChartMaster Pro 2003</text>
  <text x="${W/2}" y="${H - 50}" text-anchor="middle" fill="#666" font-size="12" font-weight="bold">Created with ChartMaster Pro 2003</text>
</svg>`;
}

// ─── Write files ─────────────────────────────────────────────────────────────

fs.writeFileSync(path.join(OUT, "chart-a.svg"), makeChartA(), "utf8");
console.log("✓ chart-a.svg");

fs.writeFileSync(path.join(OUT, "chart-b.svg"), makeChartB(), "utf8");
console.log("✓ chart-b.svg");

fs.writeFileSync(path.join(OUT, "pie-crimes.svg"), makePieChart(), "utf8");
console.log("✓ pie-crimes.svg");

console.log("\nAll charts written to public/images/chart-crimes/");
