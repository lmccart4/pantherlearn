const admin = require("firebase-admin");
const https = require("https");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const slugs = [
  "entrepreneurship-creator-economy",
  "entrepreneurship-niche",
  "entrepreneurship-value-prop",
  "entrepreneurship-branding",
  "entrepreneurship-revenue",
];

function head(url) {
  return new Promise(res => {
    try {
      const u = new URL(url);
      const req = https.request({ method: "HEAD", hostname: u.hostname, path: u.pathname+u.search, timeout: 8000 }, r => {
        res({ status: r.statusCode, location: r.headers.location });
      });
      req.on("error", e => res({ status: 0, err: e.message }));
      req.on("timeout", () => { req.destroy(); res({ status: 0, err: "timeout" }); });
      req.end();
    } catch (e) { res({ status: 0, err: e.message }); }
  });
}

(async () => {
  let problems = 0;
  const mcDist = [0,0,0,0]; // correctIndex counts across all MCs
  for (const s of slugs) {
    const d = (await db.doc(`courses/digital-literacy/lessons/${s}`).get()).data();
    console.log(`\n━━━ ${s} ━━━`);
    console.log(`  order=${d.order}  visible=${d.visible}  gradesReleased=${d.gradesReleased}`);
    if (d.visible !== false) { console.log("  ❌ visible should be false"); problems++; }
    if (d.gradesReleased !== true) { console.log("  ❌ gradesReleased should be true"); problems++; }

    const blocks = d.blocks || [];
    const types = {};
    blocks.forEach(b => types[b.type] = (types[b.type]||0)+1);
    console.log(`  blocks=${blocks.length}  types:`, types);

    // MC check
    const mcs = blocks.filter(b => b.type==="question" && b.questionType==="multiple_choice");
    for (const mc of mcs) {
      const idx = mc.correctIndex;
      if (typeof idx !== "number") { console.log(`  ❌ MC missing correctIndex: ${(mc.prompt||"").slice(0,50)}`); problems++; }
      else mcDist[idx]++;
    }
    console.log(`  MCs=${mcs.length}  all have correctIndex ✓`);

    // Activity block
    const acts = blocks.filter(b => b.type==="activity");
    console.log(`  activity blocks=${acts.length}:`, acts.map(a=>a.title));
    if (acts.length < 1) { console.log(`  ❌ no activity block`); problems++; }

    // External links
    const links = blocks.filter(b => b.type==="external_link");
    console.log(`  external_link blocks=${links.length}`);
    for (const l of links) {
      const r = await head(l.url);
      const ok = r.status >= 200 && r.status < 400;
      console.log(`    ${ok?"✓":"❌"} [${r.status}] ${l.title} → ${l.url}`);
      if (!ok) problems++;
    }

    // Activity image
    const actImgs = blocks.filter(b => b.type==="image" && b.url && b.url.includes("dl-u6-"));
    console.log(`  activity images=${actImgs.length}`);
    for (const img of actImgs) {
      const r = await head(img.url);
      const ok = r.status >= 200 && r.status < 400;
      console.log(`    ${ok?"✓":"❌"} [${r.status}] ${img.url.split("/").pop()}`);
      if (!ok) problems++;
    }
    if (actImgs.length < 1) { console.log(`  ❌ no activity image`); problems++; }
  }

  console.log(`\n━━━ MC distribution across all 5 lessons ━━━`);
  console.log(`  A=${mcDist[0]}  B=${mcDist[1]}  C=${mcDist[2]}  D=${mcDist[3]}`);
  const total = mcDist.reduce((a,b)=>a+b,0);
  mcDist.forEach((c,i) => console.log(`    ${"ABCD"[i]}: ${c}/${total} (${total?Math.round(c/total*100):0}%)`));

  console.log(`\n${problems===0 ? "✅ ALL CHECKS PASSED" : `❌ ${problems} problems`}`);
  process.exit(problems===0?0:1);
})();
