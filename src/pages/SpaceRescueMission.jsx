// src/pages/SpaceRescueMission.jsx
// Conservation of Momentum space rescue game — integrated as a PantherLearn activity.
// Students throw objects in space to propel themselves back to their ship before oxygen runs out.

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, setDoc } from "firebase/firestore";

const ASTRONAUT_MASS = 80;
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

const THROWABLE_OBJECTS = [
  { name: "Wrench", mass: 2, icon: "🔧", maxThrowSpeed: 15 },
  { name: "Toolkit", mass: 8, icon: "🧰", maxThrowSpeed: 10 },
  { name: "O₂ Tank", mass: 15, icon: "🪫", maxThrowSpeed: 7 },
  { name: "Helmet", mass: 3, icon: "⛑️", maxThrowSpeed: 12 },
  { name: "Camera", mass: 1.5, icon: "📷", maxThrowSpeed: 18 },
  { name: "Fire Extinguisher", mass: 5, icon: "🧯", maxThrowSpeed: 9 },
];

const LEVELS = [
  {
    id: 1, title: "First Steps",
    description: "You're 100m from your ship. Pick one object and throw it to reach the ship. You have 120 seconds of oxygen.",
    shipDistance: 100, oxygenTime: 120, maxThrows: 1,
    availableObjects: [0, 1, 2],
    hint: "Remember: m₁v₁ = m₂v₂. A lighter astronaut with a heavier throw means more speed!",
  },
  {
    id: 2, title: "Farther Out",
    description: "You're 180m from the ship now. You can throw up to 2 objects. Plan your throws carefully!",
    shipDistance: 180, oxygenTime: 120, maxThrows: 2,
    availableObjects: [0, 1, 3, 4],
    hint: "Each throw changes your mass AND your velocity. The equation applies to your CURRENT state each time.",
  },
  {
    id: 3, title: "Critical Rescue",
    description: "300m out with only 90 seconds of oxygen. Use up to 3 throws. Every decision counts!",
    shipDistance: 300, oxygenTime: 90, maxThrows: 3,
    availableObjects: [0, 1, 2, 3, 4, 5],
    hint: "Throwing heavier objects gives you more momentum per throw, but you have fewer options left.",
  },
  {
    id: 4, title: "Deep Space Emergency",
    description: "270m from the ship, 60 seconds of O₂. You need a perfect strategy with up to 4 throws.",
    shipDistance: 270, oxygenTime: 60, maxThrows: 4,
    availableObjects: [0, 1, 2, 3, 4, 5],
    hint: "Think about this: is it better to throw many light objects or fewer heavy ones? Do the math!",
  },
];

const SCALE = CANVAS_WIDTH / 600;

function StarField({ width, height }) {
  const stars = useRef(
    Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 2 + 1,
    }))
  );
  return (
    <>
      {stars.current.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.opacity}
          style={{ animation: `twinkle ${s.twinkleSpeed}s ease-in-out infinite alternate` }}
        />
      ))}
    </>
  );
}

function MomentumCalculator({ astronautMass, objectMass, throwSpeed }) {
  const astronautVelocity = (objectMass * throwSpeed) / astronautMass;
  return (
    <div style={{
      background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.25)",
      borderRadius: 10, padding: "12px 16px",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13, color: "#a0e8ff", marginTop: 8,
    }}>
      <div style={{ color: "#67d4f0", fontWeight: 700, marginBottom: 6, fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
        ⚡ Live Momentum Preview
      </div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ color: "#888" }}>Before:</span> p = ({astronautMass} + {objectMass}) × 0 = <strong>0 kg·m/s</strong>
      </div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ color: "#888" }}>After: </span> 0 = ({astronautMass} × v) + ({objectMass} × -{throwSpeed.toFixed(1)})
      </div>
      <div>
        <span style={{ color: "#888" }}>Solve: </span> v = <strong style={{ color: "#00ffa3" }}>{astronautVelocity.toFixed(3)} m/s</strong> toward ship
      </div>
    </div>
  );
}

// ─── Score calculator (exported for use in activityRegistry) ───
export function calculateSpaceRescueScore(submission) {
  if (!submission) return 0;
  const levelsCompleted = submission.levelsCompleted || 0;
  const bestLevel = submission.bestLevel || 0;
  const bestOxygenRemaining = submission.bestOxygenRemaining || 0;

  // Base: 25 points per level completed (max 100)
  let score = Math.min(levelsCompleted * 25, 100);
  // Bonus: up to 10 points for oxygen efficiency on hardest level
  if (bestLevel >= 3) score = Math.min(score + Math.round(bestOxygenRemaining / 6), 100);
  return score;
}

export default function SpaceRescueMission() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [screen, setScreen] = useState("title");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameState, setGameState] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [throwSpeed, setThrowSpeed] = useState(5);
  const [throwLog, setThrowLog] = useState([]);
  const [result, setResult] = useState(null);
  const animRef = useRef(null);
  const [animState, setAnimState] = useState(null);
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const [saving, setSaving] = useState(false);

  const level = LEVELS[currentLevel];

  // Load previous progress
  useEffect(() => {
    if (!user || !courseId) return;
    const loadProgress = async () => {
      try {
        const q = query(
          collection(db, "courses", courseId, "spaceRescue"),
          where("uid", "==", user.uid),
          orderBy("completedAt", "desc"),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          if (data.completedLevelIds) {
            setCompletedLevels(new Set(data.completedLevelIds));
          }
        }
      } catch { /* first time */ }
    };
    loadProgress();
  }, [user, courseId]);

  const saveResult = useCallback(async (levelId, success, throwLogData, resultData) => {
    if (!user || !courseId) return;
    setSaving(true);
    try {
      const newCompleted = new Set(completedLevels);
      if (success) newCompleted.add(levelId);

      await addDoc(collection(db, "courses", courseId, "spaceRescue"), {
        uid: user.uid,
        studentName: user.displayName || "Unknown",
        levelId,
        levelTitle: LEVELS[levelId - 1]?.title || "",
        success,
        finalVelocity: parseFloat(resultData.finalVelocity),
        timeToReach: parseFloat(resultData.timeToReach),
        oxygenTime: resultData.oxygenTime,
        oxygenRemaining: success ? resultData.oxygenTime - parseFloat(resultData.timeToReach) : 0,
        throwLog: throwLogData.map((t) => ({
          object: t.object.name,
          mass: t.object.mass,
          throwSpeed: t.throwSpeed,
          deltaV: t.deltaV,
          newVelocity: t.newVelocity,
        })),
        levelsCompleted: newCompleted.size,
        completedLevelIds: Array.from(newCompleted),
        bestLevel: Math.max(...Array.from(newCompleted), 0),
        bestOxygenRemaining: success ? Math.max(resultData.oxygenTime - parseFloat(resultData.timeToReach), 0) : 0,
        completedAt: new Date(),
      });

      setCompletedLevels(newCompleted);

      // Write progress doc so MyGrades can display the score
      const levelsCompleted = newCompleted.size;
      const bestLevel = Math.max(...Array.from(newCompleted), 0);
      const bestOxy = success ? Math.max(resultData.oxygenTime - parseFloat(resultData.timeToReach), 0) : 0;
      let score = Math.min(levelsCompleted * 25, 100);
      if (bestLevel >= 3) score = Math.min(score + Math.round(bestOxy / 6), 100);
      const label = score >= 90 ? "Expert" : score >= 80 ? "Advanced" : score >= 70 ? "Proficient" : score >= 60 ? "Developing" : score >= 50 ? "Emerging" : "Beginning";

      await setDoc(
        doc(db, "progress", user.uid, "courses", courseId, "activities", "space-rescue"),
        {
          activityScore: score / 100,
          activityLabel: `${label} (${score}%)`,
          activityType: "space-rescue",
          activityTitle: "Space Rescue Mission",
          levelsCompleted,
          bestLevel,
          gradedAt: new Date(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to save space rescue result:", err);
    }
    setSaving(false);
  }, [user, courseId, completedLevels]);

  const initLevel = useCallback((lvlIndex) => {
    const lvl = LEVELS[lvlIndex];
    const scale = CANVAS_WIDTH / (lvl.shipDistance + 100);
    setGameState({
      astronautPos: 50,
      astronautVelocity: 0,
      astronautMass: ASTRONAUT_MASS,
      shipPos: 50 + lvl.shipDistance * scale,
      oxygenRemaining: lvl.oxygenTime,
      throwsRemaining: lvl.maxThrows,
      inventory: lvl.availableObjects.map((i) => ({ ...THROWABLE_OBJECTS[i] })),
      scale,
    });
    setThrowLog([]);
    setSelectedObject(null);
    setThrowSpeed(5);
    setResult(null);
    setSimulating(false);
    setAnimState(null);
  }, []);

  const startLevel = (lvlIndex) => {
    setCurrentLevel(lvlIndex);
    initLevel(lvlIndex);
    setScreen("game");
  };

  const executeThrow = () => {
    if (!selectedObject || simulating) return;
    const obj = selectedObject;
    const currentMass = gameState.astronautMass;
    const deltaV = (obj.mass * throwSpeed) / (currentMass - obj.mass);
    const newVelocity = gameState.astronautVelocity + deltaV;
    const newMass = currentMass - obj.mass;

    const logEntry = {
      object: obj, throwSpeed, deltaV, newVelocity, massAfter: newMass,
      equation: `${obj.mass} × ${throwSpeed.toFixed(1)} = ${(currentMass - obj.mass).toFixed(1)} × Δv → Δv = ${deltaV.toFixed(4)} m/s`,
    };

    setThrowLog((prev) => [...prev, logEntry]);
    setGameState((prev) => ({
      ...prev,
      astronautVelocity: newVelocity,
      astronautMass: newMass,
      throwsRemaining: prev.throwsRemaining - 1,
      inventory: prev.inventory.filter((item) => item.name !== obj.name),
    }));
    setSelectedObject(null);
    setThrowSpeed(5);
  };

  const simulateJourney = () => {
    if (gameState.astronautVelocity <= 0) return;
    setSimulating(true);

    const lvl = LEVELS[currentLevel];
    const distanceToShip = lvl.shipDistance;
    const velocity = gameState.astronautVelocity;
    const timeToReach = distanceToShip / velocity;
    const reachesInTime = timeToReach <= lvl.oxygenTime;
    const scale = gameState.scale;

    const startTime = Date.now();
    const animDuration = Math.min(timeToReach, lvl.oxygenTime) * 15;
    const maxAnimTime = Math.min(animDuration, 5000);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / maxAnimTime, 1);
      const currentDistance = progress * Math.min(distanceToShip, velocity * lvl.oxygenTime);
      const currentOxygen = lvl.oxygenTime - progress * Math.min(timeToReach, lvl.oxygenTime);

      setAnimState({
        astronautPos: 50 + currentDistance * scale,
        oxygenRemaining: Math.max(0, currentOxygen),
        distanceTraveled: currentDistance,
      });

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        const resultData = {
          success: reachesInTime,
          timeToReach: timeToReach.toFixed(1),
          oxygenTime: lvl.oxygenTime,
          finalVelocity: velocity.toFixed(4),
          distanceTraveled: reachesInTime ? distanceToShip : velocity * lvl.oxygenTime,
        };
        setResult(resultData);
        setSimulating(false);
        if (reachesInTime) saveResult(lvl.id, true, throwLog, resultData);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const displayPos = animState ? animState.astronautPos : gameState?.astronautPos;
  const displayOxygen = animState ? animState.oxygenRemaining : gameState?.oxygenRemaining;

  // ═══════════ TITLE SCREEN ═══════════
  if (screen === "title") {
    return (
      <main id="main-content" style={{ display: "contents" }}>
      <div style={{
        minHeight: "100vh", background: "radial-gradient(ellipse at 30% 20%, #0a1628 0%, #050a14 50%, #000 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif", color: "white", padding: 20, overflow: "hidden", position: "relative",
      }}>
        <style>{`
          @keyframes twinkle { 0% { opacity: 0.3; } 100% { opacity: 1; } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
          @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(0,200,255,0.3); } 50% { box-shadow: 0 0 40px rgba(0,200,255,0.6); } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes nebula { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.25; transform: scale(1.1); } }
        `}</style>

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
          <svg width="100%" height="100%" style={{ position: "absolute" }}>
            <StarField width={1200} height={800} />
          </svg>
          <div style={{
            position: "absolute", width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(50,100,200,0.15) 0%, transparent 70%)",
            top: "10%", left: "60%", animation: "nebula 8s ease-in-out infinite",
          }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 650 }}>
          {/* Back to course */}
          {courseId && (
            <button onClick={() => navigate(`/course/${courseId}`)}
              style={{ background: "none", border: "none", color: "#5a8fa8", cursor: "pointer", fontSize: 13, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}
            >
              ← Back to Course
            </button>
          )}

          <div style={{ fontSize: 72, marginBottom: 8, animation: "float 4s ease-in-out infinite" }}>🧑‍🚀</div>
          <h1 style={{
            fontSize: 42, fontWeight: 800, letterSpacing: -1,
            background: "linear-gradient(135deg, #00d4ff 0%, #00ffa3 50%, #00d4ff 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: 8, animation: "slideUp 0.8s ease-out",
          }}>
            Space Rescue Mission
          </h1>
          <p style={{ fontSize: 16, color: "#7ab8d4", maxWidth: 480, margin: "0 auto 12px", lineHeight: 1.6, animation: "slideUp 0.8s ease-out 0.2s both" }}>
            Your tether snapped. You're drifting in the void. The only way back to your ship is to throw objects in the opposite direction.
          </p>
          <p style={{ fontSize: 14, color: "#5a8fa8", marginBottom: 32, animation: "slideUp 0.8s ease-out 0.3s both" }}>
            Use the <strong style={{ color: "#00ffa3" }}>Law of Conservation of Momentum</strong> to survive.
          </p>

          <div style={{
            background: "rgba(0,200,255,0.06)", border: "1px solid rgba(0,200,255,0.15)",
            borderRadius: 14, padding: "20px 24px", marginBottom: 32, textAlign: "left",
            animation: "slideUp 0.8s ease-out 0.4s both",
          }}>
            <div style={{ fontSize: 13, color: "#67d4f0", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
              🔬 The Physics
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 18, color: "#00ffa3", marginBottom: 10, textAlign: "center" }}>
              p = mv → m₁v₁ + m₂v₂ = 0
            </div>
            <p style={{ fontSize: 13, color: "#8ab8cc", lineHeight: 1.6, margin: 0 }}>
              In space, there's no friction. When you throw an object one way, you move the other way. The total momentum of the system stays at zero. Your job: pick the right objects and throw speeds to reach the ship before your oxygen runs out.
            </p>
          </div>

          {completedLevels.size > 0 && (
            <div style={{
              background: "rgba(0,255,163,0.06)", border: "1px solid rgba(0,255,163,0.2)",
              borderRadius: 10, padding: "10px 16px", marginBottom: 20, fontSize: 13, color: "#00ffa3",
              animation: "slideUp 0.8s ease-out 0.45s both",
            }}>
              ✅ {completedLevels.size} of 4 missions completed
            </div>
          )}

          <button
            onClick={() => setScreen("levels")}
            style={{
              background: "linear-gradient(135deg, #00a8e0, #00d4aa)", color: "#000",
              border: "none", borderRadius: 12, padding: "14px 48px", fontSize: 17, fontWeight: 700,
              cursor: "pointer", animation: "slideUp 0.8s ease-out 0.5s both, pulseGlow 3s ease-in-out infinite",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Begin Mission →
          </button>
        </div>
      </div>
      </main>
    );
  }

  // ═══════════ LEVEL SELECT ═══════════
  if (screen === "levels") {
    return (
      <main id="main-content" style={{ display: "contents" }}>
      <div style={{
        minHeight: "100vh", background: "radial-gradient(ellipse at 50% 0%, #0a1628 0%, #050a14 60%, #000 100%)",
        fontFamily: "'Segoe UI', system-ui, sans-serif", color: "white", padding: "40px 20px",
      }}>
        <style>{`@keyframes twinkle { 0% { opacity: 0.3; } 100% { opacity: 1; } }`}</style>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <button onClick={() => setScreen("title")} style={{ background: "none", border: "none", color: "#5a8fa8", cursor: "pointer", fontSize: 14, marginBottom: 20 }}>
            ← Back
          </button>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#00d4ff", marginBottom: 8 }}>Select Mission</h2>
          <p style={{ color: "#6a9ab4", marginBottom: 28, fontSize: 14 }}>Each mission increases the distance and decreases your oxygen supply.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {LEVELS.map((lvl, i) => (
              <button key={lvl.id} onClick={() => startLevel(i)}
                style={{
                  background: completedLevels.has(lvl.id) ? "rgba(0,255,163,0.06)" : "rgba(0,200,255,0.05)",
                  border: `1px solid ${completedLevels.has(lvl.id) ? "rgba(0,255,163,0.2)" : "rgba(0,200,255,0.15)"}`,
                  borderRadius: 14, padding: "18px 22px", textAlign: "left", cursor: "pointer",
                  transition: "all 0.2s", color: "white",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,200,255,0.12)"; e.currentTarget.style.borderColor = "rgba(0,200,255,0.35)"; }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = completedLevels.has(lvl.id) ? "rgba(0,255,163,0.06)" : "rgba(0,200,255,0.05)";
                  e.currentTarget.style.borderColor = completedLevels.has(lvl.id) ? "rgba(0,255,163,0.2)" : "rgba(0,200,255,0.15)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#5a8fa8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                      Mission {lvl.id} {completedLevels.has(lvl.id) && <span style={{ color: "#00ffa3" }}>✓ Completed</span>}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#00d4ff" }}>{lvl.title}</div>
                    <div style={{ fontSize: 13, color: "#7ab8d4", marginTop: 4 }}>{lvl.description}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ fontSize: 13, color: "#5a8fa8" }}>{lvl.shipDistance}m</div>
                    <div style={{ fontSize: 13, color: lvl.oxygenTime <= 60 ? "#ff6b6b" : "#5a8fa8" }}>{lvl.oxygenTime}s O₂</div>
                    <div style={{ fontSize: 13, color: "#5a8fa8" }}>{lvl.maxThrows} throws</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      </main>
    );
  }

  // ═══════════ GAME SCREEN ═══════════
  if (screen === "game" && gameState) {
    const currentMass = gameState.astronautMass;
    const currentObj = selectedObject;
    const scale = gameState.scale;

    return (
      <main id="main-content" style={{ display: "contents" }}>
      <div style={{
        minHeight: "100vh", background: "radial-gradient(ellipse at 50% 30%, #0a1628 0%, #050a14 60%, #000 100%)",
        fontFamily: "'Segoe UI', system-ui, sans-serif", color: "white", padding: "16px 20px",
      }}>
        <style>{`
          @keyframes twinkle { 0% { opacity: 0.3; } 100% { opacity: 1; } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
          @keyframes pulseRed { 0%, 100% { color: #ff6b6b; } 50% { color: #ff0000; } }
          @keyframes successPulse { 0%, 100% { box-shadow: 0 0 20px rgba(0,255,163,0.3); } 50% { box-shadow: 0 0 50px rgba(0,255,163,0.6); } }
          @keyframes failPulse { 0%, 100% { box-shadow: 0 0 20px rgba(255,80,80,0.3); } 50% { box-shadow: 0 0 50px rgba(255,80,80,0.6); } }
          input[type="range"] { -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; background: rgba(0,200,255,0.15); outline: none; }
          input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #00d4ff; cursor: pointer; }
        `}</style>

        <div style={{ maxWidth: 950, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <button onClick={() => setScreen("levels")} style={{ background: "none", border: "none", color: "#5a8fa8", cursor: "pointer", fontSize: 13 }}>
              ← Missions
            </button>
            <div style={{ fontSize: 14, color: "#67d4f0", fontWeight: 700 }}>
              Mission {level.id}: {level.title}
            </div>
            <div style={{ fontSize: 13, color: "#5a8fa8" }}>
              Throws: {gameState.throwsRemaining}/{level.maxThrows}
            </div>
          </div>

          {/* Status Bar */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[
              { label: "O₂ Remaining", value: `${(displayOxygen ?? gameState.oxygenRemaining).toFixed(0)}s`, danger: displayOxygen < 30 },
              { label: "Your Mass", value: `${currentMass.toFixed(1)} kg` },
              { label: "Velocity", value: `${gameState.astronautVelocity.toFixed(4)} m/s` },
              { label: "Distance", value: `${level.shipDistance}m` },
            ].map((stat, i) => (
              <div key={i} style={{
                background: "rgba(0,200,255,0.05)", border: `1px solid ${stat.danger ? "rgba(255,80,80,0.4)" : "rgba(0,200,255,0.12)"}`,
                borderRadius: 10, padding: "8px 12px", textAlign: "center",
              }}>
                <div style={{ fontSize: 10, color: "#5a8fa8", textTransform: "uppercase", letterSpacing: 0.8 }}>{stat.label}</div>
                <div style={{
                  fontSize: 18, fontWeight: 700, color: stat.danger ? "#ff6b6b" : "#00d4ff",
                  fontFamily: "'JetBrains Mono', monospace", animation: stat.danger ? "pulseRed 1s infinite" : "none",
                }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Space View */}
          <div style={{
            background: "#020810", borderRadius: 14, border: "1px solid rgba(0,200,255,0.1)",
            overflow: "hidden", marginBottom: 12, position: "relative",
          }}>
            <svg width="100%" viewBox={`0 0 ${CANVAS_WIDTH} 200`} style={{ display: "block" }}>
              <StarField width={CANVAS_WIDTH} height={200} />
              {Array.from({ length: Math.floor(level.shipDistance / 50) + 1 }, (_, i) => {
                const x = 50 + i * 50 * scale;
                return (
                  <g key={i}>
                    <line x1={x} y1={170} x2={x} y2={180} stroke="rgba(0,200,255,0.2)" strokeWidth={1} />
                    <text x={x} y={195} fill="rgba(0,200,255,0.3)" fontSize={9} textAnchor="middle" fontFamily="monospace">{i * 50}m</text>
                  </g>
                );
              })}
              <text x={gameState.shipPos} y={105} fontSize={36} textAnchor="middle" style={{ animation: "float 5s ease-in-out infinite" }}>🚀</text>
              <text x={gameState.shipPos} y={140} fill="#00ffa3" fontSize={10} textAnchor="middle" fontFamily="monospace">SHIP</text>
              <text x={displayPos ?? 50} y={105} fontSize={32} textAnchor="middle" style={{ animation: "float 3s ease-in-out infinite" }}>🧑‍🚀</text>
              <text x={displayPos ?? 50} y={140} fill="#00d4ff" fontSize={10} textAnchor="middle" fontFamily="monospace">YOU</text>
              {gameState.astronautVelocity > 0 && !simulating && (
                <g>
                  <line x1={(displayPos ?? 50) + 20} y1={100} x2={(displayPos ?? 50) + 20 + Math.min(gameState.astronautVelocity * 500, 80)} y2={100}
                    stroke="#00ffa3" strokeWidth={2} markerEnd="url(#arrowhead)" />
                  <defs>
                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#00ffa3" />
                    </marker>
                  </defs>
                </g>
              )}
            </svg>
          </div>

          {/* Result Overlay */}
          {result && (
            <div style={{
              background: result.success ? "rgba(0,80,50,0.9)" : "rgba(80,0,0,0.9)",
              border: `2px solid ${result.success ? "#00ffa3" : "#ff5050"}`,
              borderRadius: 14, padding: "20px 24px", marginBottom: 12, textAlign: "center",
              animation: result.success ? "successPulse 2s infinite" : "failPulse 2s infinite",
            }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{result.success ? "🎉" : "💀"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: result.success ? "#00ffa3" : "#ff5050", marginBottom: 6 }}>
                {result.success ? "MISSION SUCCESS!" : "OXYGEN DEPLETED"}
              </div>
              <div style={{ fontSize: 14, color: "#b0d0e0", marginBottom: 12 }}>
                {result.success
                  ? `You reached the ship in ${result.timeToReach}s with ${(result.oxygenTime - parseFloat(result.timeToReach)).toFixed(1)}s of oxygen to spare!`
                  : `You needed ${result.timeToReach}s but only had ${result.oxygenTime}s of oxygen. You traveled ${result.distanceTraveled.toFixed(1)}m of ${level.shipDistance}m.`}
              </div>
              <div style={{ fontSize: 13, fontFamily: "monospace", color: "#88bbd4", marginBottom: 16 }}>
                Final velocity: {result.finalVelocity} m/s
                {saving && <span style={{ marginLeft: 12, color: "#5a8fa8" }}>Saving...</span>}
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => initLevel(currentLevel)}
                  style={{
                    background: "rgba(0,200,255,0.15)", border: "1px solid rgba(0,200,255,0.3)",
                    borderRadius: 8, padding: "10px 20px", color: "#00d4ff", cursor: "pointer", fontSize: 14, fontWeight: 600,
                  }}>
                  Retry Mission
                </button>
                {result.success && currentLevel < LEVELS.length - 1 && (
                  <button onClick={() => startLevel(currentLevel + 1)}
                    style={{
                      background: "linear-gradient(135deg, #00a8e0, #00d4aa)", border: "none",
                      borderRadius: 8, padding: "10px 20px", color: "#000", cursor: "pointer", fontSize: 14, fontWeight: 700,
                    }}>
                    Next Mission →
                  </button>
                )}
                {courseId && (
                  <button onClick={() => navigate(`/course/${courseId}`)}
                    style={{
                      background: "none", border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8, padding: "10px 20px", color: "#5a8fa8", cursor: "pointer", fontSize: 14, fontWeight: 600,
                    }}>
                    Back to Course
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Controls */}
          {!result && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Left: Object Selection */}
              <div style={{ background: "rgba(0,200,255,0.04)", border: "1px solid rgba(0,200,255,0.1)", borderRadius: 14, padding: 16 }}>
                <div style={{ fontSize: 12, color: "#67d4f0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                  🎒 Inventory — Select an object to throw
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {gameState.inventory.map((obj) => (
                    <button key={obj.name}
                      onClick={() => { setSelectedObject(obj); setThrowSpeed(Math.round(obj.maxThrowSpeed / 2)); }}
                      disabled={simulating || gameState.throwsRemaining === 0}
                      style={{
                        background: selectedObject?.name === obj.name ? "rgba(0,255,163,0.15)" : "rgba(0,200,255,0.06)",
                        border: `1px solid ${selectedObject?.name === obj.name ? "rgba(0,255,163,0.4)" : "rgba(0,200,255,0.12)"}`,
                        borderRadius: 10, padding: "10px 8px", cursor: simulating ? "not-allowed" : "pointer",
                        color: "white", transition: "all 0.15s", textAlign: "center",
                      }}>
                      <div style={{ fontSize: 24 }}>{obj.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{obj.name}</div>
                      <div style={{ fontSize: 10, color: "#5a8fa8" }}>{obj.mass} kg</div>
                      <div style={{ fontSize: 10, color: "#5a8fa8" }}>max {obj.maxThrowSpeed} m/s</div>
                    </button>
                  ))}
                </div>
                <div style={{
                  marginTop: 10, padding: "8px 12px", background: "rgba(255,200,0,0.06)",
                  border: "1px solid rgba(255,200,0,0.15)", borderRadius: 8, fontSize: 12, color: "#c8a84e",
                }}>
                  💡 {level.hint}
                </div>
              </div>

              {/* Right: Throw Controls */}
              <div style={{
                background: "rgba(0,200,255,0.04)", border: "1px solid rgba(0,200,255,0.1)",
                borderRadius: 14, padding: 16, display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontSize: 12, color: "#67d4f0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                  🎯 Throw Controls
                </div>

                {currentObj ? (
                  <>
                    <div style={{ fontSize: 14, color: "#a0d4e8", marginBottom: 6 }}>
                      Throwing: <strong style={{ color: "#00ffa3" }}>{currentObj.icon} {currentObj.name}</strong> ({currentObj.mass} kg)
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <label style={{ fontSize: 12, color: "#5a8fa8" }}>
                        Throw Speed: <strong style={{ color: "#00d4ff" }}>{throwSpeed.toFixed(1)} m/s</strong>
                      </label>
                      <input type="range" min={1} max={currentObj.maxThrowSpeed} step={0.5}
                        value={throwSpeed} onChange={(e) => setThrowSpeed(parseFloat(e.target.value))}
                        style={{ marginTop: 6 }} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#5a8fa8" }}>
                        <span>1 m/s</span><span>{currentObj.maxThrowSpeed} m/s</span>
                      </div>
                    </div>
                    <MomentumCalculator astronautMass={currentMass - currentObj.mass} objectMass={currentObj.mass} throwSpeed={throwSpeed} />
                    <button onClick={executeThrow} disabled={simulating}
                      style={{
                        background: "linear-gradient(135deg, #00a8e0, #00d4aa)", border: "none",
                        borderRadius: 10, padding: "12px", color: "#000", fontSize: 15, fontWeight: 700,
                        cursor: "pointer", marginTop: 12,
                      }}>
                      🚀 Throw {currentObj.name}!
                    </button>
                  </>
                ) : (
                  <div style={{ color: "#5a8fa8", fontSize: 13, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    ← Select an object from your inventory
                  </div>
                )}

                {gameState.astronautVelocity > 0 && !simulating && (
                  <button onClick={simulateJourney}
                    style={{
                      background: gameState.throwsRemaining === 0 ? "linear-gradient(135deg, #e06000, #d4aa00)" : "rgba(255,165,0,0.15)",
                      border: gameState.throwsRemaining === 0 ? "none" : "1px solid rgba(255,165,0,0.3)",
                      borderRadius: 10, padding: "10px", color: gameState.throwsRemaining === 0 ? "#000" : "#ffa500",
                      fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 10,
                    }}>
                    ▶ Simulate Journey ({gameState.throwsRemaining} throws remaining)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Throw Log */}
          {throwLog.length > 0 && (
            <div style={{
              marginTop: 12, background: "rgba(0,200,255,0.04)",
              border: "1px solid rgba(0,200,255,0.1)", borderRadius: 14, padding: 16,
            }}>
              <div style={{ fontSize: 12, color: "#67d4f0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                📋 Throw Log
              </div>
              {throwLog.map((log, i) => (
                <div key={i} style={{
                  background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "8px 12px",
                  marginBottom: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                }}>
                  <span style={{ color: "#ffa500" }}>Throw {i + 1}:</span>{" "}
                  <span>{log.object.icon} {log.object.name}</span>{" "}
                  <span style={{ color: "#5a8fa8" }}>at {log.throwSpeed.toFixed(1)} m/s</span>{" "}
                  <span style={{ color: "#888" }}>→</span>{" "}
                  <span style={{ color: "#00ffa3" }}>Δv = +{log.deltaV.toFixed(4)} m/s</span>{" "}
                  <span style={{ color: "#888" }}>|</span>{" "}
                  <span style={{ color: "#00d4ff" }}>total v = {log.newVelocity.toFixed(4)} m/s</span>{" "}
                  <span style={{ color: "#888" }}>|</span>{" "}
                  <span style={{ color: "#8888aa" }}>mass now: {log.massAfter.toFixed(1)} kg</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </main>
    );
  }

  return null;
}
