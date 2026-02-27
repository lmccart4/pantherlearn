import React, { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   MOMENTUM MYSTERY LAB — "Crime Scene Physics"
   v3: Grading system + best-attempt replay
   ═══════════════════════════════════════════════════════════════ */

// ─── KaTeX lazy-loading (shared with BarChartBlock) ──────────
let katexModule = null;
const loadKatex = () => {
  if (katexModule) return Promise.resolve(katexModule);
  return Promise.all([
    import("katex"),
    import("katex/dist/katex.min.css"),
  ]).then(([mod]) => { katexModule = mod.default; return katexModule; });
};

function Tex({ children, display = false }) {
  const [html, setHtml] = useState(null);
  useEffect(() => {
    loadKatex().then(k => {
      try { setHtml(k.renderToString(children, { throwOnError: false, displayMode: display })); }
      catch { setHtml(null); }
    });
  }, [children, display]);
  if (!html) return <span>{children}</span>;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

const FONT = {
  display: "'Special Elite', cursive",
  body: "'IBM Plex Mono', monospace",
  accent: "'Bebas Neue', sans-serif",
};

const C = {
  noir:"#0b0c10", noirDeep:"#060709", panel:"#12141c", card:"#161923",
  amber:"#e8a824", amberDim:"#c4891a", amberGlow:"#e8a82444", amberBright:"#ffd666",
  red:"#d43d3d", redGlow:"#d43d3d33", green:"#3dd47a", blue:"#4a9eff",
  chalk:"#e2ddd3", chalkDim:"#a39e94", chalkMuted:"#6b6760",
  tape:"#e8c84a", cartA:"#e8a824", cartB:"#4a9eff", barPos:"#3dd47a", barNeg:"#d43d3d",
};

const CASES = [
  { name:"The Fender Bender", icon:"🚗", desc:"Two carts collided and stuck together. Surveillance footage is damaged — reconstruct Cart B's initial velocity from the wreckage.", diff:"TUTORIAL" },
  { name:"The Hit and Run",   icon:"🏎️", desc:"A speeding cart struck a stationary target and fled the scene. Witnesses saw Cart B's final velocity — but Cart A vanished. Find it.", diff:"TUTORIAL" },
  { name:"The Head-On",       icon:"💥", desc:"Two carts collided head-on in a violent crash. One initial velocity was wiped from the black box. Recover it.", diff:"★★☆☆" },
  { name:"The Explosion",     icon:"💣", desc:"A stationary device detonated, launching two fragments in opposite directions. One velocity reading is missing from the blast report.", diff:"★★★☆" },
  { name:"The Cold Case",     icon:"🔍", desc:"This one's been unsolved for years. All velocities are known, but one mass reading was corrupted. Crack it wide open.", diff:"★★★★" },
];

// ─── GRADING ───────────────────────────────────────────────────
const GRADE_SCALE = [
  { min:600, pct:100, label:"A+", color:C.green,  msg:"Crushed it — nearly perfect across all cases" },
  { min:500, pct:90,  label:"A",  color:C.green,  msg:"Strong performance, maybe one tough case" },
  { min:400, pct:80,  label:"B",  color:C.amber,  msg:"Solid understanding, used hints or needed retries" },
  { min:300, pct:70,  label:"C",  color:C.amber,  msg:"Getting there — some gaps in application" },
  { min:200, pct:60,  label:"D",  color:C.red,    msg:"Significant struggles — review conservation of momentum" },
  { min:0,   pct:50,  label:"F",  color:C.red,    msg:"Completed but needs intervention" },
];

function getGrade(xp) {
  for (const g of GRADE_SCALE) { if (xp >= g.min) return g; }
  return GRADE_SCALE[GRADE_SCALE.length-1];
}

// ─── LEVEL GENERATORS ──────────────────────────────────────────
const rand = (min, max, step=0.5) => {
  const steps = Math.round((max-min)/step);
  return +(min + Math.round(Math.random()*steps)*step).toFixed(1);
};

function makeLevel(i) {
  if (i===0) return {massA:2,massB:3,viA:4,viB:null,vfA:1.6,vfB:1.6,unknown:"viB",answer:0,tol:0.2,hint:<>Both carts stuck together → same final velocity. Use: <Tex>{"m_1 v_{1i} + m_2 v_{2i} = (m_1+m_2) \\cdot v_f"}</Tex></>};
  if (i===1) return {massA:1.5,massB:1.5,viA:6,viB:0,vfA:null,vfB:4,unknown:"vfA",answer:2,tol:0.2,hint:<>You know 3 of 4 momentum terms. Conservation: <Tex>{"m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}"}</Tex></>};
  if (i===2) {
    const mA=rand(1,4),mB=rand(1,4),viA=rand(2,6),viB=-rand(1,5);
    const P=mA*viA+mB*viB,vfB=rand(1,5),vfA=+((P-mB*vfB)/mA).toFixed(1);
    return {massA:mA,massB:mB,viA,viB:null,vfA,vfB,unknown:"viB",answer:viB,tol:0.3,hint:<>Both moving toward each other. <Tex>{"m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}"}</Tex> — solve for <Tex>{"v_{2i}"}</Tex></>};
  }
  if (i===3) {
    const mA=rand(1,3),mB=rand(1,3),vfA=-rand(1,4),vfB=+(-mA*vfA/mB).toFixed(1);
    return {massA:mA,massB:mB,viA:0,viB:0,vfA,vfB:null,unknown:"vfB",answer:vfB,tol:0.3,hint:<>Started at rest → total initial momentum = 0. So <Tex>{"m_1 v_{1f} + m_2 v_{2f} = 0"}</Tex></>};
  }
  let mA=2,viA=5,viB=-2,vfA=-1,vfB=4;
  let mB=+(mA*(viA-vfA)/(vfB-viB)).toFixed(1);
  if(mB<=0||mB>8)mB=2;
  return {massA:mA,massB:null,viA,viB,vfA,vfB,unknown:"massB",answer:mB,tol:0.3,hint:<>All velocities known + one mass. <Tex>{"m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}"}</Tex> → factor out <Tex>{"m_2"}</Tex></>};
}

// ─── PARTICLES ─────────────────────────────────────────────────
function DustParticles() {
  const ref = useRef(null);
  useEffect(() => {
    const cv=ref.current; if(!cv) return;
    const ctx=cv.getContext("2d");
    let w=cv.width=cv.offsetWidth, h=cv.height=cv.offsetHeight;
    const ps=Array.from({length:60},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.3,vy:Math.random()*0.15+0.05,r:Math.random()*1.5+0.3,o:Math.random()*0.3+0.05}));
    let raf;
    const draw=()=>{ctx.clearRect(0,0,w,h);for(const p of ps){p.x+=p.vx;p.y+=p.vy;if(p.y>h){p.y=-2;p.x=Math.random()*w;}if(p.x<0)p.x=w;if(p.x>w)p.x=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(226,221,211,${p.o})`;ctx.fill();}raf=requestAnimationFrame(draw);};
    draw(); return ()=>cancelAnimationFrame(raf);
  },[]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} />;
}

function CrimeTape({top,rotation=-2}) {
  return (
    <div style={{position:"absolute",top,left:-20,right:-20,zIndex:1,height:22,background:`repeating-linear-gradient(90deg,${C.tape} 0px,${C.tape} 80px,#111 80px,#111 82px)`,transform:`rotate(${rotation}deg)`,opacity:0.12,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <span style={{fontFamily:FONT.accent,fontSize:11,letterSpacing:6,color:"#000",textTransform:"uppercase",whiteSpace:"nowrap"}}>
        {"  ⚠ DO NOT CROSS ⚠ CRIME SCENE ⚠ DO NOT CROSS ⚠ CRIME SCENE ⚠ DO NOT CROSS ⚠ CRIME SCENE  ".repeat(2)}
      </span>
    </div>
  );
}

function Pin({color=C.red,style:s={}}) {
  return <div style={{width:12,height:12,borderRadius:"50%",background:`radial-gradient(circle at 40% 35%,${color},${color}88)`,boxShadow:`0 2px 4px #0008,inset 0 1px 2px #fff3`,...s}} />;
}

// ─── COLLISION SCENE ───────────────────────────────────────────
function CollisionScene({level,phase}) {
  const cvRef=useRef(null), animRef=useRef(null), tRef=useRef(0);
  useEffect(()=>{
    const cv=cvRef.current; if(!cv) return;
    const ctx=cv.getContext("2d"), W=cv.width, H=cv.height, trackY=H*0.55, maxV=8;
    const L=80,R=W-80,M=(L+R)/2;
    tRef.current=0;
    const pAi=phase==="before"?L+50:M-40, pBi=phase==="before"?R-50:M+40;
    const vA=phase==="before"?(level.viA??0):(level.vfA??0), vB=phase==="before"?(level.viB??0):(level.vfB??0);
    let pA=pAi, pB=pBi;

    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      const grd=ctx.createRadialGradient(W/2,trackY-20,10,W/2,trackY-20,200);
      grd.addColorStop(0,"#e8a82408"); grd.addColorStop(1,"transparent");
      ctx.fillStyle=grd; ctx.fillRect(0,0,W,H);

      ctx.strokeStyle="#444"; ctx.lineWidth=2; ctx.setLineDash([8,4]);
      ctx.beginPath(); ctx.moveTo(L,trackY+2); ctx.lineTo(R,trackY+2); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle="#333"; ctx.fillRect(L,trackY,R-L,3);
      for(let i=0;i<=16;i++){const x=L+(i/16)*(R-L);ctx.fillStyle="#2a2520";ctx.fillRect(x-1,trackY-4,2,11);}

      const drawCart=(x,mass,color,label)=>{
        const sc=0.75+((mass??2)/5)*0.5, w=52*sc, h=28*sc;
        ctx.fillStyle="#0006"; ctx.beginPath(); ctx.roundRect(x-w/2+3,trackY-h-3,w,h,4); ctx.fill();
        const bg=ctx.createLinearGradient(x-w/2,trackY-h-6,x-w/2,trackY-6);
        bg.addColorStop(0,color); bg.addColorStop(1,color+"99");
        ctx.fillStyle=bg; ctx.beginPath(); ctx.roundRect(x-w/2,trackY-h-6,w,h,5); ctx.fill();
        ctx.strokeStyle=color+"66"; ctx.lineWidth=1; ctx.beginPath(); ctx.roundRect(x-w/2,trackY-h-6,w,h,5); ctx.stroke();
        ctx.fillStyle="#000c"; ctx.font=`bold ${Math.round(13*sc)}px 'IBM Plex Mono',monospace`; ctx.textAlign="center"; ctx.fillText(label,x,trackY-h/2-3);
        [x-w/3,x+w/3].forEach(wx=>{ctx.fillStyle="#555";ctx.beginPath();ctx.arc(wx,trackY-2,5*sc,0,Math.PI*2);ctx.fill();ctx.fillStyle="#333";ctx.beginPath();ctx.arc(wx,trackY-2,2.5*sc,0,Math.PI*2);ctx.fill();});
        ctx.fillStyle="#a39e94"; ctx.font="10px 'IBM Plex Mono',monospace"; ctx.fillText(mass!=null?`${mass} kg`:"? kg",x,trackY-h-14);
      };
      drawCart(pA,level.massA,C.cartA,"A"); drawCart(pB,level.massB,C.cartB,"B");

      const arrowY=trackY+32;
      const drawArrow=(x,vel,color,isUnk)=>{
        if(isUnk){ctx.fillStyle=C.red;ctx.font="bold 20px 'Special Elite',cursive";ctx.textAlign="center";ctx.fillText("?",x,arrowY+2);const pulse=0.5+0.5*Math.sin(Date.now()/300);ctx.strokeStyle=C.red+Math.round(pulse*80).toString(16).padStart(2,"0");ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,arrowY-4,14+pulse*4,0,Math.PI*2);ctx.stroke();return;}
        if(vel==null||Math.abs(vel)<0.01){ctx.fillStyle="#6b6760";ctx.font="9px 'IBM Plex Mono',monospace";ctx.textAlign="center";ctx.fillText("at rest",x,arrowY+4);return;}
        const len=(vel/maxV)*70, dir=vel>0?1:-1;
        ctx.shadowColor=color;ctx.shadowBlur=6;ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,arrowY);ctx.lineTo(x+len,arrowY);ctx.stroke();ctx.shadowBlur=0;
        ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x+len,arrowY);ctx.lineTo(x+len-dir*10,arrowY-6);ctx.lineTo(x+len-dir*10,arrowY+6);ctx.closePath();ctx.fill();
        ctx.fillStyle=color;ctx.font="bold 10px 'IBM Plex Mono',monospace";ctx.textAlign="center";ctx.fillText(`${vel} m/s`,x+len/2,arrowY-12);
      };
      if(phase==="before"){drawArrow(pA,level.viA,C.cartA,level.unknown==="viA");drawArrow(pB,level.viB,C.cartB,level.unknown==="viB");}
      else{drawArrow(pA,level.vfA,C.cartA,level.unknown==="vfA");drawArrow(pB,level.vfB,C.cartB,level.unknown==="vfB");}

      ctx.fillStyle=phase==="before"?C.blue:C.amber; ctx.font="14px 'Bebas Neue',sans-serif"; ctx.textAlign="left";
      ctx.fillText(phase==="before"?"◄ INITIAL STATE":"FINAL STATE ►",16,22);

      if(tRef.current<1){tRef.current+=0.007;const t=Math.min(tRef.current,1),e=t<0.5?2*t*t:-1+(4-2*t)*t;if(vA!=null)pA=pAi+e*vA*14;if(vB!=null)pB=pBi+e*vB*14;animRef.current=requestAnimationFrame(draw);}
      else{animRef.current=requestAnimationFrame(draw);}
    };
    draw(); return ()=>{if(animRef.current)cancelAnimationFrame(animRef.current);};
  },[level,phase]);
  return <canvas ref={cvRef} width={560} height={170} style={{width:"100%",maxWidth:560,height:"auto",borderRadius:6,border:"1px solid #333",background:C.noirDeep}} />;
}

// ─── BAR CHART ─────────────────────────────────────────────────
function BarChart({level,showAnswer}) {
  const v=k=>{if(k===level.unknown&&showAnswer)return level.answer;return level[k];};
  const m=k=>k==="massA"?(level.massA??(showAnswer&&level.unknown==="massA"?level.answer:0)):(level.massB??(showAnswer&&level.unknown==="massB"?level.answer:0));
  const piA=m("massA")*(v("viA")??0),piB=m("massB")*(v("viB")??0),pfA=m("massA")*(v("vfA")??0),pfB=m("massB")*(v("vfB")??0);
  const piT=piA+piB,pfT=pfA+pfB;
  const mx=Math.max(...[piA,piB,piT,pfA,pfB,pfT].map(Math.abs),1);

  const Bar=({val,color,label})=>{
    const pct=Math.abs(val)/mx*48,neg=val<0;
    return(
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:36}}>
        <span style={{fontSize:9,color:C.chalkDim,fontFamily:FONT.body}}>{val.toFixed(1)}</span>
        <div style={{height:90,position:"relative",width:24,display:"flex",alignItems:"center"}}>
          <div style={{position:"absolute",left:0,right:0,top:"50%",height:1,background:C.chalkMuted+"55"}} />
          <div style={{position:"absolute",left:0,right:0,height:Math.max(pct,2),borderRadius:3,background:`linear-gradient(${neg?"180deg":"0deg"},${neg?C.barNeg:C.barPos},${neg?C.barNeg:C.barPos}88)`,boxShadow:`0 0 8px ${neg?C.barNeg:C.barPos}44`,...(neg?{top:"50%",marginTop:1}:{bottom:"50%",marginBottom:1}),transition:"height 0.5s cubic-bezier(.34,1.56,.64,1)"}} />
        </div>
        <span style={{fontSize:8,color,fontFamily:FONT.body,textAlign:"center",lineHeight:1.1}}>{label}</span>
      </div>
    );
  };

  return(
    <div style={{background:C.panel,borderRadius:8,padding:"14px 10px",border:"1px solid #2a2a2a",position:"relative"}}>
      <Pin style={{position:"absolute",top:-5,left:"50%",transform:"translateX(-50%)"}} color={C.red} />
      <div style={{fontFamily:FONT.accent,fontSize:12,color:C.chalkMuted,textAlign:"center",letterSpacing:4,marginBottom:10}}>MOMENTUM BAR CHART</div>
      <div style={{display:"flex",gap:3,justifyContent:"center",flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:3}}><Bar val={piA} color={C.cartA} label={<Tex>{"p_i(A)"}</Tex>} /><Bar val={piB} color={C.cartB} label={<Tex>{"p_i(B)"}</Tex>} /><Bar val={piT} color={C.chalk} label={<Tex>{"\\Sigma p_i"}</Tex>} /></div>
        <div style={{width:1,background:C.chalkMuted+"33",margin:"8px 4px",alignSelf:"stretch"}} />
        <div style={{display:"flex",gap:3}}><Bar val={pfA} color={C.cartA} label={<Tex>{"p_f(A)"}</Tex>} /><Bar val={pfB} color={C.cartB} label={<Tex>{"p_f(B)"}</Tex>} /><Bar val={pfT} color={C.chalk} label={<Tex>{"\\Sigma p_f"}</Tex>} /></div>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:40,marginTop:6}}>
        <span style={{fontSize:9,color:C.chalkMuted,fontFamily:FONT.body,letterSpacing:2}}>BEFORE</span>
        <span style={{fontSize:9,color:C.chalkMuted,fontFamily:FONT.body,letterSpacing:2}}>AFTER</span>
      </div>
      {showAnswer&&Math.abs(piT-pfT)<0.5&&(
        <div style={{textAlign:"center",marginTop:8,padding:"4px 8px",background:C.green+"15",borderRadius:4,border:`1px solid ${C.green}33`}}>
          <span style={{fontFamily:FONT.body,fontSize:10,color:C.green}}>✓ Momentum Conserved: <Tex>{"\\Sigma p_i \\approx \\Sigma p_f"}</Tex></span>
        </div>
      )}
    </div>
  );
}

// ─── SMALL COMPONENTS ──────────────────────────────────────────
function EvidenceCard({label,value,unit,color,unknown}) {
  return(
    <div style={{background:unknown?C.redGlow:C.noirDeep,border:`1px solid ${unknown?C.red+"66":"#2a2a2a"}`,borderRadius:4,padding:"7px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",overflow:"hidden",animation:unknown?"pulse-border 2s ease-in-out infinite":"none"}}>
      {unknown&&<div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${C.red}08,${C.red}15)`,pointerEvents:"none"}} />}
      <span style={{fontFamily:FONT.body,fontSize:11,color,fontWeight:700,position:"relative"}}>{label}</span>
      <span style={{fontFamily:unknown?FONT.display:FONT.body,fontSize:unknown?16:12,color:unknown?C.red:C.chalk,fontWeight:unknown?800:400,position:"relative"}}>{unknown?"???":`${value} ${unit}`}</span>
    </div>
  );
}

function Stat({label,value,accent}) {
  return(
    <div style={{background:C.panel,borderRadius:6,padding:"10px 18px",minWidth:80,textAlign:"center",border:`1px solid ${accent?C.amber+"44":"#2a2a2a"}`,boxShadow:accent?`0 0 15px ${C.amberGlow}`:"none"}}>
      <div style={{fontFamily:FONT.accent,fontSize:10,color:C.chalkMuted,letterSpacing:3}}>{label}</div>
      <div style={{fontFamily:FONT.accent,fontSize:22,color:accent?C.amber:C.chalk,marginTop:2}}>{value}</div>
    </div>
  );
}

// ─── GRADE DISPLAY COMPONENT ───────────────────────────────────
function GradeReport({ currentXP, bestXP }) {
  const displayXP = Math.max(currentXP, bestXP);
  const grade = getGrade(displayXP);
  const isNewBest = currentXP > bestXP && bestXP > 0;
  const isBest = currentXP >= bestXP;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${grade.color}12, ${grade.color}06)`,
      border: `2px solid ${grade.color}55`,
      borderRadius: 10, padding: 20, marginBottom: 20, position: "relative",
      boxShadow: `0 0 25px ${grade.color}22`,
    }}>
      {isNewBest && (
        <div style={{
          position:"absolute", top:-10, right:16,
          background:C.amber, color:"#000", fontFamily:FONT.accent,
          fontSize:11, letterSpacing:2, padding:"3px 10px", borderRadius:4,
          animation:"bounceIn 0.5s ease-out",
        }}>
          ★ NEW BEST ★
        </div>
      )}
      <div style={{fontFamily:FONT.accent, fontSize:12, color:C.chalkMuted, letterSpacing:4, marginBottom:8}}>
        GRADE REPORT
      </div>
      <div style={{display:"flex", alignItems:"center", gap:20, justifyContent:"center"}}>
        <div style={{
          width:64, height:64, borderRadius:"50%",
          background:`radial-gradient(circle, ${grade.color}33, ${grade.color}11)`,
          border:`3px solid ${grade.color}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 0 20px ${grade.color}33`,
        }}>
          <span style={{fontFamily:FONT.accent, fontSize:28, color:grade.color}}>{grade.label}</span>
        </div>
        <div style={{textAlign:"left"}}>
          <div style={{fontFamily:FONT.accent, fontSize:32, color:grade.color, letterSpacing:2}}>
            {grade.pct}%
          </div>
          <div style={{fontFamily:FONT.display, fontSize:12, color:C.chalk, lineHeight:1.4, maxWidth:250}}>
            {grade.msg}
          </div>
        </div>
      </div>
      {bestXP > 0 && !isBest && (
        <div style={{marginTop:12, textAlign:"center", fontFamily:FONT.body, fontSize:11, color:C.chalkDim}}>
          Your best score is {bestXP} XP ({getGrade(bestXP).pct}%) — that grade stands.
        </div>
      )}
      {bestXP > 0 && isBest && bestXP !== currentXP && (
        <div style={{marginTop:12, textAlign:"center", fontFamily:FONT.body, fontSize:11, color:C.amber}}>
          Previous best: {bestXP} XP — upgraded!
        </div>
      )}

      {/* XP threshold bar */}
      <div style={{marginTop:16}}>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom:4}}>
          {GRADE_SCALE.slice().reverse().map((g,i)=>(
            <div key={i} style={{textAlign:"center",flex:1}}>
              <div style={{fontFamily:FONT.accent,fontSize:9,color:displayXP>=g.min?g.color:C.chalkMuted,letterSpacing:1}}>{g.label}</div>
            </div>
          ))}
        </div>
        <div style={{height:6,background:"#1a1a1a",borderRadius:3,overflow:"hidden",position:"relative"}}>
          {/* Threshold markers */}
          {GRADE_SCALE.slice().reverse().map((g,i)=>(
            <div key={i} style={{position:"absolute",left:`${(g.min/750)*100}%`,top:0,bottom:0,width:1,background:C.chalkMuted+"44"}} />
          ))}
          {/* Fill bar */}
          <div style={{
            height:"100%", borderRadius:3,
            width:`${Math.min((displayXP/750)*100,100)}%`,
            background:`linear-gradient(90deg, ${grade.color}88, ${grade.color})`,
            boxShadow:`0 0 8px ${grade.color}44`,
            transition:"width 1s cubic-bezier(.34,1.56,.64,1)",
          }} />
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:2}}>
          <span style={{fontFamily:FONT.body,fontSize:8,color:C.chalkMuted}}>0</span>
          <span style={{fontFamily:FONT.body,fontSize:8,color:C.chalkMuted}}>750 XP</span>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN GAME ─────────────────────────────────────────────────
const N = 5;

function MomentumMysteryLab({ onSync, syncState } = {}) {
  const [screen, setScreen] = useState("title");
  const [ci, setCi] = useState(0);
  const [lvl, setLvl] = useState(null);
  const [input, setInput] = useState("");
  const [hint, setHint] = useState(false);
  const [att, setAtt] = useState(0);
  const [fb, setFb] = useState(null);
  const [scores, setScores] = useState([]);
  const [xp, setXp] = useState(0);
  const [t0, setT0] = useState(null);
  const [phase, setPhase] = useState("after");
  const [shake, setShake] = useState(false);
  const [bestXP, setBestXP] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const iRef = useRef(null);

  const load = i => {
    setLvl(makeLevel(i));
    setInput(""); setHint(false); setAtt(0); setFb(null);
    setPhase("after"); setT0(Date.now());
  };

  const start = () => {
    setCi(0); setScores([]); setXp(0); load(0);
    setAttemptCount(c => c + 1);
    setScreen("brief");
  };

  const unknownLabel = lvl ? ({
    viA:"initial velocity of Cart A (m/s)", viB:"initial velocity of Cart B (m/s)",
    vfA:"final velocity of Cart A (m/s)", vfB:"final velocity of Cart B (m/s)",
    massB:"mass of Cart B (kg)",
  }[lvl.unknown]) : "";

  const submit = () => {
    if (!input.trim()) return;
    const v = parseFloat(input);
    if (isNaN(v)) return;
    const ok = Math.abs(v - lvl.answer) <= lvl.tol;
    const a = att + 1;
    setAtt(a);
    if (ok) {
      const elapsed = (Date.now()-t0)/1000;
      let pts = a===1?150:a===2?100:60;
      if (hint) pts = Math.round(pts*0.7);
      if (elapsed<30) pts+=30; else if(elapsed<60) pts+=15;
      setScores(s=>[...s,{i:ci,ok:true,att:a,xp:pts,t:Math.round(elapsed)}]);
      setXp(x=>x+pts);
      setFb({ok:true,msg:`Case closed! The answer was ${lvl.answer}${lvl.unknown==="massB"?" kg":" m/s"}.`,pts});
      setScreen("result");
    } else {
      setShake(true); setTimeout(()=>setShake(false),500);
      if(a>=3){
        setScores(s=>[...s,{i:ci,ok:false,att:a,xp:20,t:Math.round((Date.now()-t0)/1000)}]);
        setXp(x=>x+20);
        setFb({ok:false,msg:`The answer was ${lvl.answer}${lvl.unknown==="massB"?" kg":" m/s"}. Review the conservation equation.`,pts:20});
        setScreen("result");
      } else {
        const dir=v>lvl.answer?"too high":"too low";
        setFb({ok:false,msg:`Not quite — ${dir}. ${3-a} attempt${3-a!==1?"s":""} left.`});
      }
    }
  };

  const next = () => {
    if(ci>=N-1){
      // Update best score
      setBestXP(prev => Math.max(prev, xp));
      setScreen("final");
      return;
    }
    const n=ci+1; setCi(n); load(n); setScreen("brief");
  };

  // ─── TITLE ───
  if (screen==="title") return(
    <div style={{...full,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <DustParticles />
      <CrimeTape top="12%" rotation={-1.5} />
      <CrimeTape top="85%" rotation={1} />
      <div style={{position:"absolute",top:"-30%",left:"50%",transform:"translateX(-50%)",width:600,height:600,background:`radial-gradient(ellipse at center,${C.amber}08 0%,transparent 70%)`,pointerEvents:"none",zIndex:0}} />
      <div style={{textAlign:"center",maxWidth:500,zIndex:2,position:"relative"}}>
        <div style={{fontSize:64,marginBottom:12,filter:"drop-shadow(0 0 20px #e8a82444)",animation:"float 3s ease-in-out infinite"}}>🔍</div>
        <h1 style={{fontFamily:FONT.accent,fontSize:42,color:C.amber,letterSpacing:8,textShadow:`0 0 40px ${C.amberGlow}, 0 2px 4px #000`,margin:"0 0 4px"}}>MOMENTUM</h1>
        <h2 style={{fontFamily:FONT.display,fontSize:28,color:C.chalk,letterSpacing:3,margin:"0 0 8px",fontWeight:400}}>Mystery Lab</h2>
        <div style={{fontFamily:FONT.accent,fontSize:13,color:C.chalkMuted,letterSpacing:6,borderTop:`1px solid ${C.chalkMuted}33`,borderBottom:`1px solid ${C.chalkMuted}33`,padding:"6px 0",margin:"0 auto 28px",maxWidth:300}}>FORENSIC PHYSICS DIVISION</div>

        <div style={{background:C.panel,border:"1px solid #2a2a2a",borderRadius:8,padding:24,marginBottom:20,textAlign:"left",position:"relative",boxShadow:"0 8px 32px #0006"}}>
          <Pin style={{position:"absolute",top:-6,right:24}} />
          <div style={{fontFamily:FONT.accent,fontSize:12,color:C.amber,letterSpacing:4,marginBottom:8}}>▸ CLASSIFIED BRIEFING</div>
          <p style={{fontFamily:FONT.display,fontSize:15,color:C.chalk,lineHeight:1.7,margin:0}}>
            Detective, five collision scenes have been reported with incomplete evidence.
            Use the <span style={{color:C.amber,fontWeight:700}}>Law of Conservation of Momentum</span> to
            reconstruct what happened at each crime scene.
          </p>
          <div style={{display:"flex",gap:20,marginTop:16,flexWrap:"wrap"}}>
            {[["📋","5 Cases"],["⭐","750 Max XP"],["🏅","Badge: Momentum Detective"]].map(([ic,tx],i)=>(
              <div key={i} style={{fontFamily:FONT.body,fontSize:11,color:C.chalkDim,display:"flex",alignItems:"center",gap:6}}><span>{ic}</span>{tx}</div>
            ))}
          </div>
        </div>

        {/* Grading info panel */}
        <div style={{background:C.card,border:"1px solid #2a2a2a",borderRadius:8,padding:16,marginBottom:20,textAlign:"left"}}>
          <div style={{fontFamily:FONT.accent,fontSize:11,color:C.blue,letterSpacing:3,marginBottom:8}}>▸ GRADING</div>
          <div style={{display:"grid",gridTemplateColumns:"auto auto 1fr",gap:"4px 12px",fontFamily:FONT.body,fontSize:11}}>
            {GRADE_SCALE.map((g,i)=>(
              <React.Fragment key={i}>
                <span style={{color:g.color,fontWeight:700}}>{g.label}</span>
                <span style={{color:C.chalk}}>{g.pct}%</span>
                <span style={{color:C.chalkDim}}>{g.min}+ XP</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{marginTop:8,fontFamily:FONT.body,fontSize:10,color:C.chalkDim,borderTop:"1px solid #2a2a2a",paddingTop:8}}>
            🔄 You can replay for a better score — best attempt counts.
          </div>
        </div>

        {/* Best score display if returning */}
        {bestXP > 0 && (
          <div style={{background:C.amber+"11",border:`1px solid ${C.amber}44`,borderRadius:8,padding:12,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",gap:12}}>
            <span style={{fontFamily:FONT.accent,fontSize:14,color:C.amber}}>CURRENT BEST: {bestXP} XP ({getGrade(bestXP).pct}%)</span>
            <span style={{fontFamily:FONT.body,fontSize:10,color:C.chalkDim}}>Attempt #{attemptCount}</span>
          </div>
        )}

        <button onClick={start} style={{...btn,padding:"16px 48px",fontSize:16,letterSpacing:4}}>
          {bestXP > 0 ? "RETRY INVESTIGATION" : "ACCEPT ASSIGNMENT"}
        </button>
      </div>
    </div>
  );

  // ─── BRIEFING ───
  if (screen==="brief") return(
    <div style={{...full,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <DustParticles />
      <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:400,height:400,background:`radial-gradient(ellipse,${C.amber}06 0%,transparent 70%)`,pointerEvents:"none"}} />
      <div style={{maxWidth:500,width:"100%",zIndex:2,animation:"fadeSlideUp 0.5s ease-out"}}>
        <div style={{fontFamily:FONT.accent,fontSize:11,color:C.chalkMuted,letterSpacing:4,marginBottom:8}}>CASE {ci+1} OF {N}</div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
          <span style={{fontSize:42,filter:"drop-shadow(0 0 12px #0008)"}}>{CASES[ci].icon}</span>
          <div>
            <h2 style={{fontFamily:FONT.accent,fontSize:28,color:C.amber,margin:0,letterSpacing:3,textShadow:`0 0 20px ${C.amberGlow}`}}>{CASES[ci].name}</h2>
            <div style={{fontFamily:FONT.body,fontSize:11,color:ci<2?C.blue:C.chalkMuted,marginTop:2,letterSpacing:1}}>{CASES[ci].diff}</div>
          </div>
        </div>
        <div style={{background:C.panel,border:"1px solid #2a2a2a",borderRadius:8,padding:20,marginBottom:16,position:"relative",boxShadow:"0 4px 20px #0005"}}>
          <Pin style={{position:"absolute",top:-5,left:20}} color={C.amber} />
          <div style={{fontFamily:FONT.accent,fontSize:11,color:C.blue,letterSpacing:3,marginBottom:8}}>▸ CASE FILE</div>
          <p style={{fontFamily:FONT.display,fontSize:14,color:C.chalk,lineHeight:1.7,margin:0}}>{CASES[ci].desc}</p>
        </div>
        {lvl&&(
          <div style={{background:C.card,border:"1px solid #2a2a2a",borderRadius:8,padding:16,marginBottom:16,position:"relative"}}>
            <div style={{fontFamily:FONT.accent,fontSize:11,color:C.chalkMuted,letterSpacing:3,marginBottom:10}}>▸ EVIDENCE</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              <EvidenceCard label="Mass A" value={lvl.massA} unit="kg" color={C.cartA} unknown={lvl.unknown==="massA"} />
              <EvidenceCard label="Mass B" value={lvl.massB} unit="kg" color={C.cartB} unknown={lvl.unknown==="massB"} />
              <EvidenceCard label={<><Tex>{"v_{i}"}</Tex> (A)</>} value={lvl.viA} unit="m/s" color={C.cartA} unknown={lvl.unknown==="viA"} />
              <EvidenceCard label={<><Tex>{"v_{i}"}</Tex> (B)</>} value={lvl.viB} unit="m/s" color={C.cartB} unknown={lvl.unknown==="viB"} />
              <EvidenceCard label={<><Tex>{"v_{f}"}</Tex> (A)</>} value={lvl.vfA} unit="m/s" color={C.cartA} unknown={lvl.unknown==="vfA"} />
              <EvidenceCard label={<><Tex>{"v_{f}"}</Tex> (B)</>} value={lvl.vfB} unit="m/s" color={C.cartB} unknown={lvl.unknown==="vfB"} />
            </div>
            <div style={{marginTop:10,padding:"8px 12px",background:C.noirDeep,borderRadius:4,border:`1px dashed ${C.red}44`,display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>🔎</span>
              <span style={{fontFamily:FONT.display,fontSize:13,color:C.red}}>FIND: {unknownLabel}</span>
            </div>
          </div>
        )}
        <button onClick={()=>{setScreen("game");setTimeout(()=>iRef.current?.focus(),200);}} style={{...btn,width:"100%",padding:"14px 0",fontSize:14,letterSpacing:3}}>
          INVESTIGATE →
        </button>
      </div>
    </div>
  );

  // ─── GAME ───
  if (screen==="game"&&lvl) return(
    <div style={{...full,padding:"16px 16px 32px",position:"relative",overflow:"hidden"}}>
      <DustParticles />
      <div style={{maxWidth:560,margin:"0 auto",zIndex:2,position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <span style={{fontFamily:FONT.accent,fontSize:11,color:C.chalkMuted,letterSpacing:2}}>CASE {ci+1}: </span>
            <span style={{fontFamily:FONT.accent,fontSize:15,color:C.amber,letterSpacing:2}}>{CASES[ci].name}</span>
          </div>
          <div style={{fontFamily:FONT.accent,fontSize:15,color:C.amber,letterSpacing:1,textShadow:`0 0 10px ${C.amberGlow}`}}>⭐ {xp} XP</div>
        </div>

        <div style={{display:"flex",gap:4,marginBottom:8}}>
          {["before","after"].map(p=>(
            <button key={p} onClick={()=>setPhase(p)} style={{flex:1,padding:"7px 0",borderRadius:4,border:`1px solid ${phase===p?(p==="before"?C.blue:C.amber)+"88":"#2a2a2a"}`,background:phase===p?(p==="before"?C.blue:C.amber)+"15":C.panel,color:phase===p?(p==="before"?C.blue:C.amber):C.chalkMuted,fontFamily:FONT.accent,fontSize:12,letterSpacing:3,cursor:"pointer",transition:"all 0.2s ease"}}>
              {p==="before"?"◄ BEFORE":"AFTER ►"}
            </button>
          ))}
        </div>

        <CollisionScene level={lvl} phase={phase} />

        <div style={{background:C.panel,borderRadius:6,padding:10,margin:"10px 0",border:"1px solid #2a2a2a"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,fontSize:10}}>
            {[[<Tex>{"m_A"}</Tex>,lvl.massA,"kg",C.cartA,"massA"],[<Tex>{"m_B"}</Tex>,lvl.massB,"kg",C.cartB,"massB"],[null],
              [<Tex>{"v_{iA}"}</Tex>,lvl.viA,"m/s",C.cartA,"viA"],[<Tex>{"v_{iB}"}</Tex>,lvl.viB,"m/s",C.cartB,"viB"],[null],
              [<Tex>{"v_{fA}"}</Tex>,lvl.vfA,"m/s",C.cartA,"vfA"],[<Tex>{"v_{fB}"}</Tex>,lvl.vfB,"m/s",C.cartB,"vfB"],[null],
            ].map(([lbl,val,unit,col,key],i)=>{
              if(!lbl) return <div key={i}/>;
              const unk=key===lvl.unknown;
              return(<div key={i} style={{textAlign:"center",padding:"3px 0"}}><div style={{fontFamily:FONT.body,fontSize:9,color:col,opacity:0.7}}>{lbl}</div><div style={{fontFamily:FONT.body,fontSize:12,color:unk?C.red:val!=null?C.chalk:C.chalkMuted,fontWeight:700}}>{unk?"?":val!=null?`${Number(val).toFixed(1)} ${unit}`:"—"}</div></div>);
            })}
          </div>
        </div>

        <div style={{background:C.card,border:`1px solid ${fb&&!fb.ok?C.red+"66":C.amber+"33"}`,borderRadius:8,padding:16,marginBottom:10,position:"relative",boxShadow:`0 0 20px ${C.amberGlow}`}}>
          <div style={{fontFamily:FONT.display,fontSize:13,color:C.red,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>🔎</span> FIND: {unknownLabel}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input ref={iRef} type="number" step="0.1" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Enter value..."
              style={{flex:1,background:C.noirDeep,border:"1px solid #333",color:C.chalk,padding:"12px 14px",borderRadius:4,fontSize:16,fontFamily:FONT.body,outline:"none",animation:shake?"shake 0.4s ease":"none",transition:"border-color 0.2s"}}
              onFocus={e=>e.target.style.borderColor=C.amber+"88"} onBlur={e=>e.target.style.borderColor="#333"}
            />
            <button onClick={submit} style={{...btn,padding:"12px 24px",fontSize:13,letterSpacing:2}}>SUBMIT</button>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
            <div style={{fontFamily:FONT.body,fontSize:11,color:C.chalkMuted}}>{"●".repeat(att)}{"○".repeat(3-att)} Attempts</div>
            <button onClick={()=>setHint(true)} style={{background:"none",border:"none",fontFamily:FONT.body,fontSize:11,color:hint?C.chalkMuted:C.blue,cursor:"pointer",textDecoration:hint?"none":"underline"}}>
              {hint?"Hint active (−30% XP)":"💡 Request hint"}
            </button>
          </div>
        </div>

        {hint&&(<div style={{background:C.blue+"11",border:`1px solid ${C.blue}33`,borderRadius:6,padding:14,marginBottom:10,position:"relative"}}>
          <Pin style={{position:"absolute",top:-5,right:16}} color={C.blue} />
          <div style={{fontFamily:FONT.accent,fontSize:11,color:C.blue,letterSpacing:3,marginBottom:4}}>INTEL</div>
          <div style={{fontFamily:FONT.display,fontSize:13,color:C.chalk,lineHeight:1.6}}>{lvl.hint}</div>
        </div>)}

        {fb&&!fb.ok&&screen==="game"&&(<div style={{background:C.red+"12",border:`1px solid ${C.red}33`,borderRadius:6,padding:10,marginBottom:10,animation:"fadeSlideUp 0.3s ease-out"}}>
          <span style={{fontFamily:FONT.display,fontSize:12,color:C.red}}>{fb.msg}</span>
        </div>)}

        <div style={{background:C.panel,borderRadius:6,padding:"10px 14px",border:"1px solid #2a2a2a",textAlign:"center"}}>
          <span style={{fontFamily:FONT.body,fontSize:10,color:C.chalkMuted}}>Conservation: </span>
          <span style={{color:C.amber,fontWeight:700}}><Tex>{"m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}"}</Tex></span>
        </div>
      </div>
    </div>
  );

  // ─── PER-CASE RESULT ───
  if (screen==="result"&&lvl) {
    const last=scores[scores.length-1];
    return(
      <div style={{...full,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
        <DustParticles />
        <div style={{maxWidth:500,width:"100%",zIndex:2,textAlign:"center",animation:"fadeSlideUp 0.5s ease-out"}}>
          <div style={{fontSize:56,marginBottom:8,filter:"drop-shadow(0 0 15px #0008)",animation:last?.ok?"bounceIn 0.6s ease-out":"none"}}>{last?.ok?"✅":"📝"}</div>
          <h2 style={{fontFamily:FONT.accent,fontSize:28,letterSpacing:4,color:last?.ok?C.green:C.red,margin:"0 0 8px",textShadow:`0 0 20px ${last?.ok?C.green:C.red}33`}}>{last?.ok?"CASE CLOSED":"CASE REVIEW"}</h2>
          <p style={{fontFamily:FONT.display,fontSize:14,color:C.chalk,lineHeight:1.6,marginBottom:20}}>{fb?.msg}</p>
          <BarChart level={lvl} showAnswer={true} />
          <div style={{display:"flex",justifyContent:"center",gap:16,margin:"20px 0",flexWrap:"wrap"}}>
            <Stat label="ATTEMPTS" value={last?.att} />
            <Stat label="TIME" value={`${last?.t}s`} />
            <Stat label="XP EARNED" value={`+${last?.xp}`} accent />
          </div>
          <button onClick={next} style={{...btn,padding:"14px 40px",fontSize:14,letterSpacing:3}}>
            {ci>=N-1?"VIEW FINAL REPORT":"NEXT CASE →"}
          </button>
        </div>
      </div>
    );
  }

  // ─── FINAL RESULTS ───
  if (screen==="final") {
    const cleared=scores.filter(s=>s.ok).length;
    const badge=cleared>=4;
    const effectiveBest = Math.max(xp, bestXP);
    return(
      <div style={{...full,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
        <DustParticles />
        <CrimeTape top="4%" rotation={-1} />
        <div style={{maxWidth:520,width:"100%",zIndex:2,textAlign:"center",animation:"fadeSlideUp 0.6s ease-out"}}>
          <div style={{fontSize:56,marginBottom:8}}>{badge?"🏅":"📋"}</div>
          <h2 style={{fontFamily:FONT.accent,fontSize:32,color:C.amber,letterSpacing:6,margin:"0 0 4px",textShadow:`0 0 30px ${C.amberGlow}`}}>INVESTIGATION COMPLETE</h2>
          <div style={{fontFamily:FONT.accent,fontSize:12,color:C.chalkMuted,letterSpacing:5,marginBottom:20,borderBottom:`1px solid ${C.chalkMuted}22`,paddingBottom:8}}>
            FINAL REPORT — ATTEMPT #{attemptCount}
          </div>

          {/* GRADE REPORT */}
          <GradeReport currentXP={xp} bestXP={bestXP} />

          <div style={{display:"flex",justifyContent:"center",gap:16,marginBottom:20,flexWrap:"wrap"}}>
            <Stat label="CASES CLEARED" value={`${cleared}/${N}`} />
            <Stat label="THIS RUN" value={`${xp} XP`} accent />
            <Stat label="AVG TIME" value={`${Math.round(scores.reduce((a,s)=>a+s.t,0)/scores.length)}s`} />
          </div>

          <div style={{background:C.panel,borderRadius:8,padding:16,marginBottom:20,border:"1px solid #2a2a2a",textAlign:"left",position:"relative",boxShadow:"0 4px 20px #0004"}}>
            <Pin style={{position:"absolute",top:-5,left:20}} />
            {scores.map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<scores.length-1?"1px solid #2a2a2a":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>{CASES[i].icon}</span>
                  <span style={{fontFamily:FONT.display,fontSize:13,color:C.chalk}}>{CASES[i].name}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:14}}>
                  <span style={{fontFamily:FONT.body,fontSize:10,color:C.chalkMuted}}>{s.t}s</span>
                  <span style={{fontFamily:FONT.body,fontSize:10,color:C.chalkMuted}}>{s.att} try</span>
                  <span style={{fontFamily:FONT.accent,fontSize:14,letterSpacing:1,color:s.ok?C.green:C.red}}>{s.ok?"✓":"✗"} +{s.xp}</span>
                </div>
              </div>
            ))}
          </div>

          {badge&&(
            <div style={{background:`linear-gradient(135deg,${C.amber}15,${C.amber}08)`,border:`2px solid ${C.amber}`,borderRadius:12,padding:20,marginBottom:20,boxShadow:`0 0 40px ${C.amberGlow}`,animation:"glow 2s ease-in-out infinite alternate"}}>
              <div style={{fontSize:40,marginBottom:4}}>🔍</div>
              <div style={{fontFamily:FONT.accent,fontSize:20,color:C.amber,letterSpacing:4}}>BADGE EARNED</div>
              <div style={{fontFamily:FONT.display,fontSize:15,color:C.chalk,marginTop:4}}>Momentum Detective</div>
            </div>
          )}

          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>setScreen("title")} style={{...btn,background:C.panel,color:C.chalk,border:`1px solid ${C.amber}44`,padding:"12px 28px"}}>
              🔄 RETRY FOR BETTER GRADE
            </button>
            <button onClick={()=>{
              if (onSync) {
                onSync({ xp: effectiveBest, cleared, attemptNumber: attemptCount });
              } else {
                const g = getGrade(effectiveBest);
                alert(`Ready to sync to PantherLearn:\n\nBest XP: ${effectiveBest}\nGrade: ${g.label} (${g.pct}%)\nAttempts Used: ${attemptCount}\nCases Cleared: ${cleared}/${N}\nBadge: ${badge?"Momentum Detective 🔍":"—"}`);
              }
            }} disabled={syncState==="syncing"||syncState==="synced"} style={{...btn,padding:"12px 28px",opacity:syncState==="synced"?0.6:1}}>
              {syncState==="syncing"?"Syncing...":syncState==="synced"?"✓ Synced to PantherLearn!":"SYNC TO PANTHERLEARN"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ─── SHARED STYLES ─────────────────────────────────────────────
const full = {
  minHeight:"100vh",
  background:`linear-gradient(180deg,${C.noir} 0%,${C.noirDeep} 50%,#080a12 100%)`,
  fontFamily:FONT.body, position:"relative",
};
const btn = {
  background:`linear-gradient(135deg,${C.amber},${C.amberDim})`,
  color:"#000",border:"none",borderRadius:6,fontFamily:FONT.accent,
  fontWeight:800,cursor:"pointer",letterSpacing:2,fontSize:13,
  boxShadow:`0 4px 15px ${C.amberGlow},0 1px 3px #0004`,
  transition:"all 0.15s ease",padding:"12px 32px",
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=IBM+Plex+Mono:wght@400;600;700&family=Bebas+Neue&display=swap');
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes fadeSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes bounceIn{0%{transform:scale(0.3);opacity:0}50%{transform:scale(1.1)}70%{transform:scale(0.95)}100%{transform:scale(1);opacity:1}}
    @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
    @keyframes glow{from{box-shadow:0 0 15px ${C.amberGlow}}to{box-shadow:0 0 40px ${C.amber}55,0 0 80px ${C.amberGlow}}}
    @keyframes pulse-border{0%,100%{border-color:${C.red}66}50%{border-color:${C.red}cc}}
    input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
    input[type=number]{-moz-appearance:textfield}
    button:hover{filter:brightness(1.1);transform:translateY(-1px)}
    button:active{transform:translateY(0);filter:brightness(0.95)}
    ::selection{background:${C.amber}44;color:${C.chalk}}
  `}</style>
);

const WrappedApp = (props) => (<><GlobalStyles /><MomentumMysteryLab {...props} /></>);
export { WrappedApp as default };
