// src/components/blocks/ConceptBuilderBlock.jsx
// The Ability Architect — inline lesson block that reports answers via onAnswer()
import { useState, useCallback, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   THE ABILITY ARCHITECT — Industrial Blueprint Edition
   Fonts: Russo One + IBM Plex Mono + Source Sans 3
   Palette: Navy blueprint, Safety Yellow, Hazard Orange, Chalk White, Steel Gray
   ═══════════════════════════════════════════════════════════════════════════ */

const FL = "https://fonts.googleapis.com/css2?family=Russo+One&family=IBM+Plex+Mono:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700;900&display=swap";

const T = {
  bg: "#0a1628", gridLine: "#1a2d4a", gridBright: "#243d5e",
  accent: "#ffc107", accentGlow: "rgba(255,193,7,0.25)", hazard: "#ff6b35",
  chalk: "#e8e4d9", steel: "#6b7b8d", steelLight: "#8a9bac",
  ok: "#4caf50", okGlow: "rgba(76,175,80,0.15)",
  no: "#ef5350", noGlow: "rgba(239,83,80,0.15)",
  panel: "rgba(14,31,56,0.85)", panelBdr: "#1a2d4a", panelHi: "rgba(255,193,7,0.06)",
};
const F = { d: "'Russo One',sans-serif", m: "'IBM Plex Mono',monospace", b: "'Source Sans 3',sans-serif" };

const ABILITIES = {
  fall:    { name: "ABILITY TO FALL",             short: "FALL",    icon: "⬇", color: "#ef5350", tag: "GRV" },
  move:    { name: "ABILITY TO MOVE",             short: "MOVE",    icon: "➤", color: "#7c4dff", tag: "KIN" },
  stretch: { name: "ABILITY TO STRETCH/COMPRESS", short: "STRETCH", icon: "⇔", color: "#29b6f6", tag: "ELS" },
  warm:    { name: "ABILITY TO WARM",             short: "WARM",    icon: "≋", color: "#ff9800", tag: "THM" },
};

const RANKS = [
  { name: "APPRENTICE", minXP: 0, badge: "I" },
  { name: "JOURNEYMAN", minXP: 150, badge: "II" },
  { name: "MASTER", minXP: 350, badge: "III" },
  { name: "GRAND ARCHITECT", minXP: 600, badge: "IV" },
];

const LEVELS = [
  { id:1, title:"THE HIGH RISE", subtitle:"ELEVATION ANALYSIS", da:"fall",
    intro:"You're on a construction site. The crane is holding a steel beam 30 meters above the ground. The foreman says don't stand under it. But why? The beam isn't moving. What ability does this system have just by being up there?",
    phases:[
      { label:"FIELD OBSERVATION", prompt:"A crane holds a 500 kg steel beam 30 meters above the ground. The beam is perfectly still — zero velocity. Consider what could happen if the cable snapped.",
        q:"What could this beam DO from up there that it couldn't do on the ground?",
        opts:[
          { t:"Crush something below it by falling", ok:true, fb:"Confirmed. The beam has the ability to fall and deliver massive impact due to its elevated position." },
          { t:"Stretch a cable attached to it", ok:false, fb:"Negative. The beam isn't elastic. Consider what gravity could make it do from that height." },
          { t:"Nothing — it has zero velocity", ok:false, fb:"Incorrect. Zero velocity now doesn't mean zero ability. What happens if the support is removed?" },
          { t:"Warm up the air around it", ok:false, fb:"Negative. Elevation doesn't generate heat. Think about the force pulling it downward." },
        ]},
      { label:"SYSTEM IDENTIFICATION", prompt:"The beam can fall. But can a beam fall without Earth pulling it down? Think about what SYSTEM stores this ability.",
        q:"What is the SYSTEM that stores the ability to fall?",
        opts:[
          { t:"The beam alone", ok:false, fb:"Insufficient. Without Earth's gravity, the beam floats. The beam alone doesn't store this ability." },
          { t:"The beam + Earth together", ok:true, fb:"Confirmed. The beam and Earth TOGETHER form the system. Earth's gravitational pull is essential." },
          { t:"The beam + the crane", ok:false, fb:"Negative. The crane prevents the fall. Focus on what CAUSES things to fall." },
          { t:"Earth alone", ok:false, fb:"Insufficient. Earth alone can't fall onto something. You need the object AND Earth together." },
        ]},
      { label:"PROCESS ANALYSIS", prompt:"The crane lifted this beam from the ground to 30 meters. Think about what the crane had to do in physics terms.",
        q:"How did the crane GIVE the beam + Earth the ability to fall?",
        opts:[
          { t:"Exerted a force AND displaced the beam upward", ok:true, fb:"Confirmed. Force + displacement. The crane pushed the beam upward through a distance, storing ability in the system." },
          { t:"Held the beam in position", ok:false, fb:"Holding doesn't give ability — LIFTING does. Two things were required: force and displacement." },
          { t:"Increased the beam's temperature", ok:false, fb:"Negative. Temperature isn't involved. What mechanical actions did the crane perform?" },
          { t:"Gave the beam high velocity", ok:false, fb:"The beam ends stationary at the top. The crane moved it against gravity through a distance." },
        ]},
    ]},
  { id:2, title:"THE WRECKING BALL", subtitle:"MOTION ANALYSIS", da:"move",
    intro:"A wrecking ball swings toward an old wall. It's massive and FAST. The demolition crew knows this ball can do serious work. What ability does something have just because it's moving?",
    phases:[
      { label:"FIELD OBSERVATION", prompt:"A 2000 kg wrecking ball swings at 15 m/s toward a concrete wall. It will slam into the wall and crumble it on impact.",
        q:"What gives the wrecking ball its ability to demolish the wall?",
        opts:[
          { t:"Its motion — it's moving fast and it's massive", ok:true, fb:"Confirmed. A moving object has the ability to do a job. More speed and more mass means greater ability." },
          { t:"Its height above the ground", ok:false, fb:"The ball is swinging sideways into the wall. What's different about this ball vs. one sitting still?" },
          { t:"Its temperature", ok:false, fb:"A hot ball sitting still doesn't demolish anything. What IS the ball doing right now?" },
          { t:"Its shape", ok:false, fb:"A stationary wrecking ball of any shape does nothing to the wall. What's the key variable?" },
        ]},
      { label:"SYSTEM IDENTIFICATION", prompt:"Unlike the ability to fall (which needed Earth), a wrecking ball in deep space could still smash into something. The ability to move doesn't need Earth.",
        q:"What SYSTEM stores the ability to move?",
        opts:[
          { t:"The wrecking ball alone", ok:true, fb:"Confirmed. The ability to move is stored in the moving object itself. No Earth required." },
          { t:"The wrecking ball + Earth", ok:false, fb:"A ball moving in space can still smash into something. Earth isn't needed for this ability." },
          { t:"The wrecking ball + the wall", ok:false, fb:"The wall receives the job. The ball has this ability even without a wall present." },
          { t:"The wrecking ball + crane", ok:false, fb:"The crane started the motion, but the ball stores the ability once moving." },
        ]},
      { label:"PROCESS ANALYSIS", prompt:"Before swinging, the wrecking ball hung still. Something had to set it in motion.",
        q:"How was the wrecking ball GIVEN its ability to move?",
        opts:[
          { t:"A force was exerted through a displacement", ok:true, fb:"Pattern confirmed. Force + displacement. The crane pulled the ball back through a distance, then released it." },
          { t:"It was heated up", ok:false, fb:"Negative. Heat doesn't make a wrecking ball swing." },
          { t:"It was placed at a higher elevation", ok:false, fb:"Height gives ability to fall, not ability to move horizontally." },
          { t:"It was compressed like a spring", ok:false, fb:"The wrecking ball isn't elastic." },
        ]},
    ]},
  { id:3, title:"THE SPRING LAUNCHER", subtitle:"ELASTIC ANALYSIS", da:"stretch",
    intro:"Workers use a pneumatic nail gun. Inside, a powerful spring gets compressed before each shot. The spring isn't moving. It isn't elevated. But it can launch a nail through solid wood. Where is this ability hiding?",
    phases:[
      { label:"FIELD OBSERVATION", prompt:"A spring in a nail gun is compressed 8 cm. It's sitting still on a workbench — not moving, not elevated. When triggered, it launches a nail at 50 m/s.",
        q:"The spring isn't moving or elevated. What gives it the ability to launch the nail?",
        opts:[
          { t:"It's been compressed — deformed from its natural shape", ok:true, fb:"Confirmed. An elastic object pushed out of its natural shape stores the ability to snap back and do a job." },
          { t:"It's moving very fast", ok:false, fb:"The spring is stationary before firing. Its ability comes from its deformed shape." },
          { t:"It's positioned at a high elevation", ok:false, fb:"It's on a workbench. Height isn't the source." },
          { t:"It's at a high temperature", ok:false, fb:"Temperature isn't involved. What's physically different about this spring vs. a relaxed one?" },
        ]},
      { label:"SYSTEM IDENTIFICATION", prompt:"This ability is exclusive. A brick can't be compressed and spring back. Only ELASTIC systems qualify.",
        q:"What kind of system can store the ability to stretch or compress?",
        opts:[
          { t:"Only elastic systems — springs, rubber bands, bows", ok:true, fb:"Confirmed. This ability requires elasticity. Non-elastic objects cannot store this." },
          { t:"Any system with mass", ok:false, fb:"A brick has mass but can't spring back. What makes springs unique?" },
          { t:"Any system near Earth", ok:false, fb:"Earth isn't involved here. This is about internal structure." },
          { t:"Any system that's in motion", ok:false, fb:"The spring is still! Its ability comes from deformation, not velocity." },
        ]},
      { label:"PROCESS ANALYSIS", prompt:"Someone had to compress that spring before it could fire. The same pattern appears every time.",
        q:"How was the spring GIVEN its ability to decompress?",
        opts:[
          { t:"A force compressed it through a displacement", ok:true, fb:"Pattern holds. Force + displacement, every time." },
          { t:"It was heated until it compressed", ok:false, fb:"Heating doesn't compress springs." },
          { t:"It was lifted to a higher position", ok:false, fb:"Height gives ability to fall, not elastic ability." },
          { t:"It was given a high velocity", ok:false, fb:"The spring ends stationary but compressed." },
        ]},
    ]},
  { id:4, title:"THE FRICTION PROBLEM", subtitle:"THERMAL ANALYSIS", da:"warm",
    intro:"A bulldozer pushes a crate across rough concrete. The crate was moving, then it stopped. The ability to move vanished. But rub your hands together fast — feel that? Something new appeared...",
    phases:[
      { label:"FIELD OBSERVATION", prompt:"A heavy crate slides to a stop on rough concrete. Its ability to move is gone — zero velocity. But the concrete where it slid is WARM. The crate bottom is warm too.",
        q:"What happened to the crate's ability to move?",
        opts:[
          { t:"It transferred into warmer surfaces", ok:true, fb:"Confirmed. The ability didn't vanish — it transformed. The contact surfaces got warmer." },
          { t:"It was completely destroyed", ok:false, fb:"These quantities are conserved — they can't be destroyed. Where did it GO?" },
          { t:"It transferred into ability to fall", ok:false, fb:"The crate didn't rise. What changed about the surfaces?" },
          { t:"It's still stored as ability to move", ok:false, fb:"The crate is stationary. The ability to move is gone. But something replaced it." },
        ]},
      { label:"SYSTEM IDENTIFICATION", prompt:"When surfaces rub together and warm up, this ability is stored at the contact interfaces. Both surfaces get warmer.",
        q:"Where is the ability to warm surfaces stored?",
        opts:[
          { t:"In the contact surfaces that interacted", ok:true, fb:"Confirmed. Both the crate bottom and concrete registered temperature increase." },
          { t:"Only in the crate", ok:false, fb:"The concrete is also warm. Both surfaces store this ability." },
          { t:"In the Earth below", ok:false, fb:"Earth isn't directly involved. The surfaces that made contact are what changed." },
          { t:"In the air above", ok:false, fb:"The contact surfaces warmed, not the surrounding air initially." },
        ]},
      { label:"PROCESS ANALYSIS", prompt:"This ability is often the end of a transfer chain. Motion → friction → warm surfaces. Extremely difficult to reverse.",
        q:"What process gave the surfaces the ability to warm things?",
        opts:[
          { t:"Friction — a force acting over the sliding distance", ok:true, fb:"Pattern confirmed. Friction is a force, the crate slid a distance. Force + displacement." },
          { t:"The surfaces were elevated higher", ok:false, fb:"Height wasn't involved." },
          { t:"The surfaces were stretched", ok:false, fb:"Concrete isn't elastic." },
          { t:"Someone applied direct heat", ok:false, fb:"No external heat was added. The warmth came from the sliding process." },
        ]},
    ]},
];

const BOSS = [
  { title:"DEMOLITION SEQUENCE ALPHA",
    desc:"A crane lifts a wrecking ball to the top of its arc (State A). The ball swings down and reaches maximum speed at the bottom (State B). It slams into a wall, crumbling it and coming to a stop — surfaces are warm to the touch (State C).",
    states:[
      { label:"STATE A — Ball at top of arc, motionless", ca:["fall"], id:"a" },
      { label:"STATE B — Ball at bottom, maximum speed", ca:["move"], id:"b" },
      { label:"STATE C — Ball stopped, surfaces warm", ca:["warm"], id:"c" },
    ],
    cq:"Identify the correct transfer chain:",
    co:[
      { t:"Fall → Move → Warm Surfaces", ok:true },
      { t:"Move → Fall → Warm Surfaces", ok:false },
      { t:"Warm → Move → Fall", ok:false },
      { t:"Fall → Stretch → Move", ok:false },
    ]},
  { title:"PILE DRIVER SEQUENCE BETA",
    desc:"Workers compress a massive spring underground (State A). The spring launches a steel post upward at high speed (State B). The post reaches max height and stops (State C). The post falls and drives into soil — surfaces warm (State D).",
    states:[
      { label:"STATE A — Spring compressed, post stationary", ca:["stretch"], id:"a" },
      { label:"STATE B — Post moving upward at high speed", ca:["move","fall"], id:"b" },
      { label:"STATE C — Post at max height, motionless", ca:["fall"], id:"c" },
      { label:"STATE D — Post in soil, surfaces warm", ca:["warm"], id:"d" },
    ],
    cq:"Identify the primary transfer chain:",
    co:[
      { t:"Stretch/Compress → Move → Fall → Warm Surfaces", ok:true },
      { t:"Fall → Move → Stretch → Warm Surfaces", ok:false },
      { t:"Move → Fall → Stretch → Warm Surfaces", ok:false },
      { t:"Warm → Stretch → Fall → Move", ok:false },
    ]},
];

const DISC_TEXT = {
  fall: "Systems that include Earth can store the ability to fall. Lifting an object higher gives the system more of this ability. The higher it goes, the more potential it has to do a job when released.",
  move: "Any moving object stores the ability to move. The faster it goes and the more massive it is, the greater this ability. Unlike the ability to fall, this belongs to the object itself — no Earth required.",
  stretch: "Elastic systems — springs, rubber bands, bows — store ability when deformed from their natural shape. Only elastic systems qualify. When released, they snap back and deliver.",
  warm: "When surfaces rub together, the ability to move transforms into warmer surfaces. This is often the final stop in a transfer chain — extremely difficult to reverse.",
};

// ─── UI PRIMITIVES ───────────────────────────────────────────────────────────

const BG = ({ children }) => (
  <div style={{ background:T.bg,
    backgroundImage:`linear-gradient(${T.gridLine}44 1px,transparent 1px),linear-gradient(90deg,${T.gridLine}44 1px,transparent 1px),linear-gradient(${T.gridLine}22 .5px,transparent .5px),linear-gradient(90deg,${T.gridLine}22 .5px,transparent .5px)`,
    backgroundSize:"80px 80px,80px 80px,16px 16px,16px 16px", position:"relative", overflow:"hidden",
    borderRadius: 12,
  }}>
    <div style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:0,opacity:0.035,
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    }} />
    <div style={{ position:"relative",zIndex:1 }}>{children}</div>
  </div>
);

const HZ = ({ h=4 }) => <div style={{ height:h, background:`repeating-linear-gradient(45deg,${T.accent},${T.accent} 8px,${T.bg} 8px,${T.bg} 16px)`, opacity:0.7, width:"100%" }} />;

const P = ({ children, style={}, glow, hi }) => (
  <div style={{ background:T.panel, border:`1px solid ${glow?T.accent+"55":T.panelBdr}`, borderRadius:2, boxShadow:glow?`0 0 20px ${T.accentGlow},inset 0 1px 0 ${T.accent}22`:`0 2px 12px rgba(0,0,0,0.3)`, position:"relative", overflow:"hidden", ...style }}>
    {hi && <HZ />}{children}
  </div>
);

const Tg = ({ children, color=T.steel, filled }) => (
  <span style={{ display:"inline-block", padding:"2px 8px", fontSize:10, fontFamily:F.m, fontWeight:700, letterSpacing:1.5, color:filled?T.bg:color, background:filled?color:"transparent", border:filled?"none":`1px solid ${color}`, lineHeight:"18px" }}>{children}</span>
);

const Mt = ({ value, max, label }) => (
  <div style={{ width:"100%" }}>
    {label && <div style={{ fontSize:9, fontFamily:F.m, color:T.steel, letterSpacing:2, marginBottom:4 }}>{label}</div>}
    <div style={{ height:6, background:T.gridLine }}>
      <div style={{ height:"100%", width:`${Math.min((value/max)*100,100)}%`, background:T.accent, boxShadow:`0 0 8px ${T.accent}44`, transition:"width 0.8s cubic-bezier(0.16,1,0.3,1)" }} />
    </div>
  </div>
);

const Bt = ({ children, onClick, disabled }) => (
  <button onClick={disabled?undefined:onClick} style={{ padding:"14px 36px", fontFamily:F.d, fontSize:15, letterSpacing:3, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.3:1, background:T.accent, color:T.bg, border:"none", boxShadow:`0 0 20px ${T.accentGlow}`, transition:"all 0.2s" }}
    onMouseEnter={e=>{if(!disabled)e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.transform="none"}}>{children}</button>
);

const XF = ({ a, v }) => <div style={{ position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)",fontFamily:F.d,fontSize:56,color:T.accent,letterSpacing:4,textShadow:`0 0 40px ${T.accentGlow},0 0 80px ${T.accentGlow}`,opacity:v?1:0,transition:"opacity 0.3s",pointerEvents:"none",zIndex:200 }}>+{a} XP</div>;

const AB = ({ ability, discovered, compact }) => {
  const a = ABILITIES[ability];
  return <div style={{ display:"inline-flex",alignItems:"center",gap:compact?4:8,padding:compact?"3px 8px":"6px 12px",border:`1px solid ${discovered?a.color:T.panelBdr}`,background:discovered?a.color+"11":"transparent",opacity:discovered?1:0.3,fontFamily:F.m,fontSize:compact?10:11,fontWeight:700,letterSpacing:1,color:discovered?a.color:T.steel,transition:"all 0.4s" }}>
    <span style={{ fontSize:compact?10:13 }}>{a.icon}</span><span>{compact?a.short:a.name}</span>{discovered && <Tg color={a.color} filled>{a.tag}</Tg>}
  </div>;
};

const Corners = () => <>{[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h])=>(
  <div key={v+h} style={{ position:"absolute",[v]:-1,[h]:-1,width:20,height:20,
    borderTop:v==="top"?`2px solid ${T.accent}`:"none",borderBottom:v==="bottom"?`2px solid ${T.accent}`:"none",
    borderLeft:h==="left"?`2px solid ${T.accent}`:"none",borderRight:h==="right"?`2px solid ${T.accent}`:"none" }} />
))}</>;

const Opt = ({ text, isSel, isOk, showFB, feedback, onClick }) => {
  let bdr=T.panelBdr, bg=T.panel;
  if(showFB&&isSel){bdr=isOk?T.ok:T.no;bg=isOk?T.okGlow:T.noGlow;}
  else if(showFB&&isOk)bdr=T.ok+"66";
  return <div onClick={onClick} style={{ padding:"14px 16px",border:`1px solid ${bdr}`,background:bg,cursor:showFB?"default":"pointer",display:"flex",gap:12,alignItems:"flex-start",transition:"all 0.25s" }}
    onMouseEnter={e=>{if(!showFB)e.currentTarget.style.borderColor=T.steel}}
    onMouseLeave={e=>{if(!showFB)e.currentTarget.style.borderColor=T.panelBdr}}>
    <div style={{ width:22,height:22,border:`2px solid ${showFB&&(isSel||isOk)?(isOk?T.ok:T.no):T.steel}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:showFB&&isSel?(isOk?T.ok:T.no):"transparent",fontFamily:F.m,fontSize:11,fontWeight:900,color:T.chalk,transition:"all 0.3s" }}>
      {showFB&&isSel&&(isOk?"✓":"✗")}{showFB&&!isSel&&isOk&&"✓"}
    </div>
    <div>
      <div style={{ fontFamily:F.b,fontSize:14,fontWeight:600,color:T.chalk,lineHeight:1.5 }}>{text}</div>
      {showFB&&(isSel||isOk)&&<div style={{ fontFamily:F.m,fontSize:11,color:isOk?T.ok:T.no,marginTop:8,lineHeight:1.6,letterSpacing:0.3 }}>{feedback}</div>}
    </div>
  </div>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN BLOCK COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ConceptBuilderBlock({ block, studentData = {}, onAnswer }) {
  const blockId = block.id;

  // Restore saved state from studentData
  const saved = studentData[blockId]?.gameState;

  const [scr, setScr] = useState(() => saved?.scr || (saved?.completed ? "victory" : saved?.done?.length > 0 ? "hub" : "title"));
  const [xp, setXP] = useState(() => saved?.xp || 0);
  const [streak, setStreak] = useState(() => saved?.streak || 0);
  const [disc, setDisc] = useState(() => saved?.disc || []);
  const [done, setDone] = useState(() => saved?.done || []);
  const [cL, setCL] = useState(() => saved?.cL ?? null);
  const [cP, setCP] = useState(() => saved?.cP || 0);
  const [sel, setSel] = useState(() => saved?.sel ?? null);
  const [showFB, setShowFB] = useState(() => saved?.showFB || false);
  const [flash, setFlash] = useState({ v:false, a:0 });
  const [intro, setIntro] = useState(() => saved?.intro || false);
  const [rev, setRev] = useState(() => saved?.rev || false);
  const [anim, setAnim] = useState(false);
  const [bP, setBP] = useState(() => saved?.bP || 0);
  const [bI, setBI] = useState(() => saved?.bI || 0);
  const [bS, setBS] = useState(() => saved?.bS || {});
  const [bC, setBC] = useState(() => saved?.bC ?? null);
  const [bF, setBF] = useState(() => saved?.bF || false);

  // Re-hydrate local state when studentData arrives after initial mount
  // (e.g. returning from GuessWho — LessonViewer fetches progress async,
  // so studentData is {} on first render and fills in later)
  const hydrated = useRef(!!saved);
  useEffect(() => {
    const s = studentData[blockId]?.gameState;
    if (!s || hydrated.current) return;
    hydrated.current = true;
    setScr(s.scr || (s.completed ? "victory" : s.done?.length > 0 ? "hub" : "title"));
    setXP(s.xp || 0);
    setStreak(s.streak || 0);
    setDisc(s.disc || []);
    setDone(s.done || []);
    setCL(s.cL ?? null);
    setCP(s.cP || 0);
    setSel(s.sel ?? null);
    setShowFB(s.showFB || false);
    setIntro(s.intro || false);
    setRev(s.rev || false);
    setBP(s.bP || 0);
    setBI(s.bI || 0);
    setBS(s.bS || {});
    setBC(s.bC ?? null);
    setBF(s.bF || false);
  }, [studentData, blockId]);

  // Refs to get latest values synchronously for save callbacks
  const stateRef = useRef({});
  useEffect(() => {
    stateRef.current = { xp, done, disc, streak, scr, cL, cP, sel, showFB, intro, rev, bP, bI, bS, bC, bF };
  }, [xp, done, disc, streak, scr, cL, cP, sel, showFB, intro, rev, bP, bI, bS, bC, bF]);

  useEffect(()=>{setAnim(false);requestAnimationFrame(()=>requestAnimationFrame(()=>setAnim(true)));},[scr,cP,bP,bI,rev,intro]);

  const rank = [...RANKS].reverse().find(r=>xp>=r.minXP)||RANKS[0];
  const nxt = RANKS[RANKS.indexOf(rank)+1];

  // ─── Save helpers ──────────────────────────────────────────────────────────

  // Save full game state for progress restoration (not graded)
  const saveState = useCallback((overrides = {}) => {
    if (!onAnswer) return;
    const s = stateRef.current;
    const state = { ...s, ...overrides };
    onAnswer(blockId, {
      submitted: state.completed ? true : false,
      writtenScore: state.completed ? 1 : 0,
      gameState: state,
    });
  }, [onAnswer, blockId]);

  // Save an individual quiz answer
  const saveQuizAnswer = useCallback((key, answerText, correct, level, phase) => {
    if (!onAnswer) return;
    onAnswer(`${blockId}_${key}`, {
      answer: answerText,
      correct,
      submitted: true,
      needsGrading: false,
      level,
      phase,
      submittedAt: new Date().toISOString(),
    });
  }, [onAnswer, blockId]);

  // Save final summary
  const saveSummary = useCallback((finalXP, finalDisc, finalDone) => {
    if (!onAnswer) return;
    const totalQuestions = LEVELS.reduce((sum, l) => sum + l.phases.length, 0) + BOSS.length * 2;
    let correctCount = 0;
    // Count correct answers from studentData
    LEVELS.forEach(l => {
      l.phases.forEach((_, pi) => {
        const key = `${blockId}_L${l.id}_P${pi}`;
        if (studentData[key]?.correct) correctCount++;
      });
    });
    BOSS.forEach((_, bi) => {
      const tagKey = `${blockId}_B${bi}_tags`;
      const chainKey = `${blockId}_B${bi}_chain`;
      if (studentData[tagKey]?.correct) correctCount++;
      if (studentData[chainKey]?.correct) correctCount++;
    });

    onAnswer(`${blockId}_summary`, {
      answer: `Completed The Ability Architect — ${finalXP} XP, ${finalDone.length}/4 levels, ${finalDisc.length}/4 abilities discovered, ${correctCount}/${totalQuestions} correct`,
      correct: finalDone.length === 4,
      submitted: true,
      needsGrading: false,
      xp: finalXP,
      abilitiesDiscovered: finalDisc,
      levelsCompleted: finalDone,
      totalCorrect: correctCount,
      totalQuestions,
      submittedAt: new Date().toISOString(),
    });

    // Also update the state save with completed flag
    saveState({ scr: "victory", completed: true, xp: finalXP, done: finalDone, disc: finalDisc });
  }, [onAnswer, blockId, studentData, saveState]);

  // ─── Game logic ────────────────────────────────────────────────────────────

  const award = useCallback((amt)=>{
    const bonus = streak>=3?Math.floor(amt*0.5):0;
    const total = amt+bonus;
    setXP(p=>p+total);
    setFlash({v:true,a:total});
    setTimeout(()=>setFlash({v:false,a:0}),1200);
  },[streak]);

  const pick = i => {
    if(showFB)return; setSel(i); setShowFB(true);
    const level = LEVELS[cL];
    const phase = level.phases[cP];
    const correct = phase.opts[i].ok;
    const newStreak = correct ? streak + 1 : 0;
    if(correct){setStreak(s=>s+1);award(25);}else setStreak(0);

    // Save this quiz answer + state
    saveQuizAnswer(`L${level.id}_P${cP}`, phase.opts[i].t, correct, level.title, phase.label);
    setTimeout(() => saveState({ sel: i, showFB: true, streak: newStreak }), 50);
  };

  const advance = () => {
    if(cP<LEVELS[cL].phases.length-1){
      const nextP = cP + 1;
      setCP(nextP);setSel(null);setShowFB(false);
      setTimeout(() => saveState({ cP: nextP, sel: null, showFB: false }), 50);
    }
    else {
      setRev(true);
      setTimeout(() => saveState({ rev: true }), 50);
    }
  };

  const finish = () => {
    const l=LEVELS[cL];
    const newDisc = disc.includes(l.da) ? disc : [...disc, l.da];
    const newDone = done.includes(l.id) ? done : [...done, l.id];
    if(!disc.includes(l.da))setDisc(newDisc);
    if(!done.includes(l.id)){setDone(newDone);award(50);}
    setRev(false);setCL(null);setCP(0);setSel(null);setShowFB(false);setIntro(false);setScr("hub");

    setTimeout(() => saveState({ done: newDone, disc: newDisc, scr: "hub", cL: null, cP: 0, sel: null, showFB: false, intro: false, rev: false }), 50);
  };

  const go = i => {
    setCL(i);setCP(0);setSel(null);setShowFB(false);setIntro(false);setRev(false);setScr("level");
    setTimeout(() => saveState({ scr: "level", cL: i, cP: 0, sel: null, showFB: false, intro: false, rev: false }), 50);
  };

  const goBoss = ()=>{
    setBP(0);setBI(0);setBS({});setBC(null);setBF(false);setScr("boss");
    setTimeout(() => saveState({ scr: "boss", bP: 0, bI: 0, bS: {}, bC: null, bF: false }), 50);
  };

  const togBA = (sid,ab)=>{if(bF)return;setBS(p=>{const c=p[sid]||[];return{...p,[sid]:c.includes(ab)?c.filter(a=>a!==ab):[...c,ab]};});};

  const checkBA = ()=>{
    setBF(true);const sc=BOSS[bI];let ok=true;
    sc.states.forEach(s=>{const sl=bS[s.id]||[];if(sl.length!==s.ca.length||!s.ca.every(c=>sl.includes(c)))ok=false;});
    const newStreak = ok ? streak + 1 : 0;
    if(ok){award(40);setStreak(s=>s+1);}else setStreak(0);

    // Save boss tag answer + state
    const tagSummary = sc.states.map(s => `${s.label}: [${(bS[s.id]||[]).join(", ")}]`).join("; ");
    saveQuizAnswer(`B${bI}_tags`, tagSummary, ok, `BOSS: ${sc.title}`, "TAG ABILITIES");
    setTimeout(() => saveState({ bF: true, streak: newStreak }), 50);
  };

  const advB = ()=>{
    if(bP===0){
      setBP(1);setBF(false);setBC(null);
      setTimeout(() => saveState({ bP: 1, bF: false, bC: null }), 50);
    }
    else{
      if(bI<BOSS.length-1){
        const nextBI = bI + 1;
        setBI(nextBI);setBP(0);setBS({});setBC(null);setBF(false);
        setTimeout(() => saveState({ bI: nextBI, bP: 0, bS: {}, bC: null, bF: false }), 50);
      }
      else{
        award(100);setScr("victory");
        setTimeout(() => {
          saveSummary(stateRef.current.xp, stateRef.current.disc, stateRef.current.done);
        }, 100);
      }
    }
  };

  const pickBC = i=>{
    if(bF)return;setBC(i);setBF(true);
    const sc = BOSS[bI];
    const correct = sc.co[i].ok;
    const newStreak = correct ? streak + 1 : 0;
    if(correct){award(40);setStreak(s=>s+1);}else setStreak(0);

    // Save boss chain answer + state
    saveQuizAnswer(`B${bI}_chain`, sc.co[i].t, correct, `BOSS: ${sc.title}`, "TRANSFER CHAIN");
    setTimeout(() => saveState({ bC: i, bF: true, streak: newStreak }), 50);
  };

  const w = {opacity:anim?1:0,transition:"opacity 0.5s 0.1s"};

  // ═══ TITLE ═══
  if(scr==="title") return (
    <BG><link href={FL} rel="stylesheet"/>
      <div style={{minHeight:480,display:"flex",alignItems:"center",justifyContent:"center",padding:24,...w}}>
        <div style={{textAlign:"center",maxWidth:560}}>
          <div style={{position:"relative",padding:"48px 32px",border:`1px solid ${T.gridBright}`}}>
            <Corners/>
            <Tg color={T.accent}>PANTHER PHYSICS — FIELD OPERATIONS</Tg>
            <h1 style={{fontFamily:F.d,fontSize:"clamp(36px,8vw,56px)",color:T.chalk,margin:"20px 0 4px",letterSpacing:6,lineHeight:1.1}}>
              THE ABILITY<br/><span style={{color:T.accent,textShadow:`0 0 30px ${T.accentGlow}`}}>ARCHITECT</span>
            </h1>
            <div style={{fontFamily:F.m,fontSize:11,color:T.steel,letterSpacing:3,marginTop:12,lineHeight:1.8}}>
              DISCOVERY-BASED SYSTEMS ANALYSIS<br/>CLASSIFICATION: CONSERVED QUANTITIES
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",margin:"28px 0"}}>
              {Object.keys(ABILITIES).map(k=><div key={k} style={{padding:"4px 10px",border:`1px dashed ${T.panelBdr}`,fontFamily:F.m,fontSize:10,color:T.steel,letterSpacing:1}}>{ABILITIES[k].icon} — — —</div>)}
            </div>
            <Bt onClick={()=>{setScr("hub");setTimeout(()=>saveState({scr:"hub"}),50);}}>BEGIN FIELD WORK</Bt>
          </div>
        </div>
      </div>
    </BG>
  );

  // ═══ HUB ═══
  if(scr==="hub"){
    const canB=done.length===4;
    return(
      <BG><link href={FL} rel="stylesheet"/><XF a={flash.a} v={flash.v}/>
        <div style={{maxWidth:680,margin:"0 auto",padding:"24px 20px",...w}}>
          <P hi style={{marginBottom:24}}>
            <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div><div style={{fontFamily:F.d,fontSize:18,color:T.chalk,letterSpacing:3}}>THE ABILITY ARCHITECT</div>
                <div style={{fontFamily:F.m,fontSize:11,color:T.steel,letterSpacing:2,marginTop:4}}>RANK {rank.badge} — {rank.name}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontFamily:F.d,fontSize:32,color:T.accent,letterSpacing:3,textShadow:`0 0 20px ${T.accentGlow}`}}>{xp}</div>
                <div style={{fontFamily:F.m,fontSize:9,color:T.steel,letterSpacing:2}}>EXPERIENCE POINTS</div></div>
            </div>
            {nxt&&<div style={{padding:"0 20px 12px"}}><Mt value={xp-rank.minXP} max={nxt.minXP-rank.minXP} label={`NEXT: ${nxt.name} (${nxt.minXP} XP)`}/></div>}
          </P>
          <P style={{marginBottom:20,padding:"16px 20px"}}>
            <div style={{fontFamily:F.m,fontSize:9,color:T.steel,letterSpacing:2,marginBottom:10}}>DISCOVERED ABILITIES [{disc.length}/4]</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{Object.keys(ABILITIES).map(k=><AB key={k} ability={k} discovered={disc.includes(k)}/>)}</div>
          </P>
          {streak>=3&&<P glow style={{padding:"10px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontFamily:F.d,fontSize:18,color:T.accent}}>{streak}×</span>
            <span style={{fontFamily:F.m,fontSize:11,color:T.accent,letterSpacing:1}}>STREAK ACTIVE — +50% XP BONUS</span>
          </P>}
          <div style={{fontFamily:F.m,fontSize:9,color:T.steel,letterSpacing:2,marginBottom:10}}>CONSTRUCTION SITES</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {LEVELS.map((l,i)=>{
              const d=done.includes(l.id),lk=i>0&&!done.includes(LEVELS[i-1].id),a=ABILITIES[l.da];
              return<div key={l.id} onClick={()=>!lk&&go(i)} style={{background:T.panel,border:`1px solid ${d?a.color+"44":T.panelBdr}`,borderLeft:`3px solid ${d?a.color:lk?T.panelBdr:T.steel}`,padding:"16px 20px",cursor:lk?"not-allowed":"pointer",opacity:lk?0.3:1,display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.25s"}}
                onMouseEnter={e=>{if(!lk){e.currentTarget.style.borderLeftColor=T.accent;e.currentTarget.style.background=T.panelHi}}}
                onMouseLeave={e=>{e.currentTarget.style.borderLeftColor=d?a.color:lk?T.panelBdr:T.steel;e.currentTarget.style.background=T.panel}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><Tg color={d?a.color:T.steel} filled={d}>SITE {l.id}</Tg>{d&&<Tg color={T.ok} filled>COMPLETE</Tg>}</div>
                  <div style={{fontFamily:F.d,fontSize:17,color:T.chalk,letterSpacing:2}}>{l.title}</div>
                  <div style={{fontFamily:F.m,fontSize:10,color:T.steel,letterSpacing:1.5,marginTop:2}}>{l.subtitle}</div>
                </div>
                <div style={{fontFamily:F.d,fontSize:24,color:d?a.color:T.steel,opacity:lk?0.3:1}}>{lk?"▣":d?a.icon:"▸"}</div>
              </div>;
            })}
            <div onClick={()=>canB&&goBoss()} style={{background:canB?`linear-gradient(135deg,${T.accent}08,${T.hazard}05)`:T.panel,border:`1px solid ${canB?T.accent+"44":T.panelBdr}`,borderLeft:`3px solid ${canB?T.accent:T.panelBdr}`,padding:20,cursor:canB?"pointer":"not-allowed",opacity:canB?1:0.25,transition:"all 0.25s"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><Tg color={T.accent} filled>FINAL AUDIT</Tg>{!canB&&<span style={{fontFamily:F.m,fontSize:9,color:T.steel,letterSpacing:1}}>COMPLETE ALL SITES TO UNLOCK</span>}</div>
              <div style={{fontFamily:F.d,fontSize:17,color:T.chalk,letterSpacing:2}}>THE ABILITY AUDIT</div>
              <div style={{fontFamily:F.m,fontSize:10,color:T.steel,letterSpacing:1.5,marginTop:2}}>MULTI-SYSTEM TRANSFER CHAIN ANALYSIS</div>
            </div>
          </div>
        </div>
      </BG>
    );
  }

  // ═══ LEVEL ═══
  if(scr==="level"&&cL!==null){
    const l=LEVELS[cL],a=ABILITIES[l.da];
    if(rev) return(
      <BG><link href={FL} rel="stylesheet"/><XF a={flash.a} v={flash.v}/>
        <div style={{minHeight:480,display:"flex",alignItems:"center",justifyContent:"center",padding:24,...w}}>
          <div style={{textAlign:"center",maxWidth:500}}>
            <div style={{width:100,height:100,margin:"0 auto 20px",display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${a.color}`,boxShadow:`0 0 40px ${a.color}33`,fontFamily:F.d,fontSize:48,color:a.color}}>{a.icon}</div>
            <Tg color={T.accent} filled>NEW ABILITY DISCOVERED</Tg>
            <h2 style={{fontFamily:F.d,fontSize:28,color:T.chalk,letterSpacing:4,margin:"16px 0 20px"}}>{a.name}</h2>
            <P style={{padding:24,marginBottom:20,textAlign:"left"}}><div style={{fontFamily:F.b,fontSize:15,color:T.steelLight,lineHeight:1.75}}>{DISC_TEXT[l.da]}</div></P>
            <P glow style={{padding:16,marginBottom:24}}>
              <div style={{fontFamily:F.m,fontSize:10,color:T.accent,letterSpacing:2,marginBottom:6}}>RECURRING PATTERN</div>
              <div style={{fontFamily:F.b,fontSize:14,color:T.chalk,lineHeight:1.6}}>Every ability is given to a system the same way: <strong>FORCE</strong> exerted through a <strong>DISPLACEMENT</strong>.</div>
            </P>
            <Bt onClick={finish}>RETURN TO HUB</Bt>
          </div>
        </div>
      </BG>
    );
    if(!intro) return(
      <BG><link href={FL} rel="stylesheet"/>
        <div style={{minHeight:480,display:"flex",alignItems:"center",justifyContent:"center",padding:24,...w}}>
          <div style={{maxWidth:520,textAlign:"center"}}>
            <Tg color={a.color}>SITE {l.id}</Tg>
            <h2 style={{fontFamily:F.d,fontSize:36,color:T.chalk,letterSpacing:4,margin:"16px 0 4px"}}>{l.title}</h2>
            <div style={{fontFamily:F.m,fontSize:10,color:T.steel,letterSpacing:2,marginBottom:24}}>{l.subtitle}</div>
            <P style={{padding:24,marginBottom:28,textAlign:"left"}}><div style={{fontFamily:F.b,fontSize:15,color:T.steelLight,lineHeight:1.75}}>{l.intro}</div></P>
            <Bt onClick={()=>{setIntro(true);setTimeout(()=>saveState({intro:true}),50);}}>BEGIN INVESTIGATION</Bt>
          </div>
        </div>
      </BG>
    );
    const ph=l.phases[cP];
    return(
      <BG><link href={FL} rel="stylesheet"/><XF a={flash.a} v={flash.v}/>
        <div style={{maxWidth:640,margin:"0 auto",padding:"24px 20px",...w}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <button onClick={()=>{setScr("hub");setCL(null);setIntro(false);setTimeout(()=>saveState({scr:"hub",cL:null,intro:false}),50);}} style={{background:"none",border:"none",fontFamily:F.m,fontSize:11,color:T.steel,cursor:"pointer",letterSpacing:1}}>← EXIT SITE</button>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              {streak>=3&&<span style={{fontFamily:F.m,fontSize:11,color:T.accent,letterSpacing:1}}>{streak}× STREAK</span>}
              <span style={{fontFamily:F.d,fontSize:20,color:T.accent,letterSpacing:3}}>{xp} XP</span>
            </div>
          </div>
          <div style={{display:"flex",gap:4,marginBottom:6}}>{l.phases.map((_,i)=><div key={i} style={{flex:1,height:3,background:i<=cP?a.color:T.gridLine,transition:"background 0.4s"}}/>)}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
            <Tg color={a.color} filled>{ph.label}</Tg>
            <span style={{fontFamily:F.m,fontSize:9,color:T.steel,letterSpacing:2}}>SITE {l.id} — PHASE {cP+1}/{l.phases.length}</span>
          </div>
          <P style={{padding:20,marginBottom:20}}><div style={{fontFamily:F.b,fontSize:15,color:T.steelLight,lineHeight:1.75}}>{ph.prompt}</div></P>
          <div style={{fontFamily:F.d,fontSize:15,color:T.chalk,letterSpacing:1.5,lineHeight:1.5,marginBottom:16}}>{ph.q}</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {ph.opts.map((o,i)=><Opt key={i} text={o.t} isSel={sel===i} isOk={o.ok} showFB={showFB} feedback={o.fb} onClick={()=>pick(i)}/>)}
          </div>
          {showFB&&<div style={{textAlign:"center",marginTop:24}}><Bt onClick={advance}>{cP<l.phases.length-1?"NEXT PHASE ▸":"COMPLETE SITE ▸"}</Bt></div>}
        </div>
      </BG>
    );
  }

  // ═══ BOSS ═══
  if(scr==="boss"){
    const sc=BOSS[bI];
    return(
      <BG><link href={FL} rel="stylesheet"/><XF a={flash.a} v={flash.v}/>
        <div style={{maxWidth:680,margin:"0 auto",padding:"24px 20px",...w}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <button onClick={()=>{setScr("hub");setTimeout(()=>saveState({scr:"hub"}),50);}} style={{background:"none",border:"none",fontFamily:F.m,fontSize:11,color:T.steel,cursor:"pointer",letterSpacing:1}}>← EXIT AUDIT</button>
            <span style={{fontFamily:F.d,fontSize:20,color:T.accent,letterSpacing:3}}>{xp} XP</span>
          </div>
          <HZ h={3}/>
          <div style={{padding:"12px 0"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><Tg color={T.hazard} filled>BOSS AUDIT</Tg><span style={{fontFamily:F.m,fontSize:9,color:T.steel,letterSpacing:2}}>SCENARIO {bI+1}/{BOSS.length}</span></div>
            <div style={{fontFamily:F.d,fontSize:22,color:T.chalk,letterSpacing:3}}>{sc.title}</div>
          </div>
          <HZ h={3}/>
          <P style={{padding:20,margin:"16px 0"}}><div style={{fontFamily:F.b,fontSize:14,color:T.steelLight,lineHeight:1.75}}>{sc.desc}</div></P>

          {bP===0&&<>
            <div style={{fontFamily:F.d,fontSize:14,color:T.chalk,letterSpacing:2,marginBottom:12}}>TAG ABILITIES FOR EACH STATE:</div>
            {sc.states.map(st=>{
              const s=bS[st.id]||[],c=st.ca,ok2=bF&&s.length===c.length&&c.every(x=>s.includes(x));
              return<P key={st.id} style={{padding:14,marginBottom:8,borderLeft:`3px solid ${bF?(ok2?T.ok:T.no):T.panelBdr}`}}>
                <div style={{fontFamily:F.m,fontSize:11,color:T.chalk,fontWeight:700,letterSpacing:1,marginBottom:10}}>{st.label}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {Object.keys(ABILITIES).map(k=>{
                    const ab=ABILITIES[k],on=s.includes(k),sb=c.includes(k);
                    let bd=on?ab.color:T.panelBdr,bg2=on?ab.color+"18":"transparent";
                    if(bF){if(on&&sb){bd=T.ok;bg2=T.okGlow;}else if(on&&!sb){bd=T.no;bg2=T.noGlow;}else if(!on&&sb)bd=T.ok+"66";}
                    return<button key={k} onClick={()=>togBA(st.id,k)} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",border:`1px solid ${bd}`,background:bg2,fontFamily:F.m,fontSize:10,fontWeight:700,letterSpacing:1,color:on?ab.color:T.steel,cursor:bF?"default":"pointer",transition:"all 0.2s"}}>{ab.icon} {ab.short}</button>;
                  })}
                </div>
              </P>;
            })}
            <div style={{textAlign:"center",marginTop:16}}>{!bF?<Bt onClick={checkBA}>VERIFY TAGS</Bt>:<Bt onClick={advB}>TRANSFER CHAIN ▸</Bt>}</div>
          </>}

          {bP===1&&<>
            <div style={{fontFamily:F.d,fontSize:14,color:T.chalk,letterSpacing:2,marginBottom:12}}>{sc.cq}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {sc.co.map((o,i)=><Opt key={i} text={o.t} isSel={bC===i} isOk={o.ok} showFB={bF} feedback="" onClick={()=>pickBC(i)}/>)}
            </div>
            {bF&&<div style={{textAlign:"center",marginTop:20}}><Bt onClick={advB}>{bI<BOSS.length-1?"NEXT SCENARIO ▸":"COMPLETE AUDIT"}</Bt></div>}
          </>}
        </div>
      </BG>
    );
  }

  // ═══ VICTORY ═══
  if(scr==="victory") return(
    <BG><link href={FL} rel="stylesheet"/>
      <div style={{minHeight:480,display:"flex",alignItems:"center",justifyContent:"center",padding:24,...w}}>
        <div style={{textAlign:"center",maxWidth:540}}>
          <div style={{width:100,height:100,margin:"0 auto 20px",border:`2px solid ${T.accent}`,boxShadow:`0 0 60px ${T.accentGlow}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.d,fontSize:44,color:T.accent}}>★</div>
          <Tg color={T.accent} filled>AUDIT COMPLETE</Tg>
          <h1 style={{fontFamily:F.d,fontSize:36,color:T.chalk,letterSpacing:4,margin:"16px 0"}}>MISSION<br/>ACCOMPLISHED</h1>
          <P style={{padding:24,marginBottom:20}}>
            <div style={{fontFamily:F.d,fontSize:40,color:T.accent,letterSpacing:4,textShadow:`0 0 20px ${T.accentGlow}`}}>{xp} XP</div>
            <div style={{fontFamily:F.m,fontSize:10,color:T.steel,letterSpacing:2,marginTop:4}}>RANK {rank.badge} — {rank.name}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",marginTop:16}}>{Object.keys(ABILITIES).map(k=><AB key={k} ability={k} discovered compact/>)}</div>
          </P>
          <P glow style={{padding:20,marginBottom:24,textAlign:"left"}}>
            <div style={{fontFamily:F.m,fontSize:10,color:T.accent,letterSpacing:2,marginBottom:8}}>CLASSIFIED FINDING</div>
            <div style={{fontFamily:F.b,fontSize:15,color:T.chalk,lineHeight:1.75}}>Every ability is given to a system the same way: <strong style={{color:T.accent}}>a force exerted through a displacement</strong>. Scientists have a name for this conserved quantity — <em style={{color:T.steelLight}}>but that's classified until next class</em>.</div>
          </P>
          <Bt onClick={()=>setScr("hub")}>RETURN TO HUB</Bt>
        </div>
      </div>
    </BG>
  );

  return null;
}
