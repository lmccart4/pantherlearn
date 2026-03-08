import { useState, useRef, useCallback, useEffect } from "react";

/*
  ROCKET STAGING CHALLENGE
  ========================
  Physics: Conservation of momentum (NOT the rocket equation).
  Each stage: the rocket ejects a chunk of fuel mass at an exhaust velocity.
  Before ejection, total momentum = (rocket+fuel) * current_velocity
  After ejection:  (rocket_remaining * new_velocity) + (fuel_ejected * (current_velocity - exhaust_velocity)) = total_momentum_before
  Simplifying for Δv:  Δv = (fuel_mass * exhaust_velocity) / rocket_remaining_mass

  Students design stages by choosing fuel mass and exhaust velocity to reach orbital velocity.
*/

const ORBITAL_VELOCITY = 7800; // m/s target
const ROCKET_DRY_MASS = 5000; // kg (payload + structure, cannot be reduced)

const EXHAUST_OPTIONS = [
  { name: "Solid Fuel", velocity: 2500, icon: "\u{1F7E0}", color: "#e8792a", desc: "Cheap & simple, lower exhaust velocity" },
  { name: "Liquid Fuel", velocity: 3500, icon: "\u{1F535}", color: "#2a8ee8", desc: "Balanced performance" },
  { name: "Hydrogen/LOX", velocity: 4500, icon: "\u26AA", color: "#c0e0ff", desc: "High performance, expensive" },
];

const MAX_STAGES = 4;
const MAX_TOTAL_FUEL = 80000; // kg max fuel budget

const MISSIONS = [
  {
    id: 1,
    name: "Low Earth Orbit",
    targetVelocity: 5000,
    description: "Reach 5,000 m/s to achieve low Earth orbit. A good place to start learning staging.",
    maxStages: 2,
    fuelBudget: 40000,
    icon: "\u{1F30D}",
  },
  {
    id: 2,
    name: "Standard Orbit",
    targetVelocity: 7000,
    description: "Reach 7,000 m/s. You'll need to think carefully about how to distribute fuel across stages.",
    maxStages: 3,
    fuelBudget: 60000,
    icon: "\u{1F6F0}\uFE0F",
  },
  {
    id: 3,
    name: "Orbital Insertion",
    targetVelocity: 7800,
    description: "The real deal \u2014 7,800 m/s orbital velocity. Optimize your staging for maximum efficiency.",
    maxStages: 4,
    fuelBudget: 80000,
    icon: "\u{1F680}",
  },
  {
    id: 4,
    name: "Escape Velocity",
    targetVelocity: 11200,
    description: "Break free from Earth's gravity at 11,200 m/s. Only the most efficient designs will make it.",
    maxStages: 4,
    fuelBudget: 80000,
    icon: "\u{1F30C}",
  },
];

function StageDesigner({ stage, index, onChange, onRemove, disabled }) {
  return (
    <div
      style={{
        background: "rgba(232,121,42,0.04)",
        border: "1px solid rgba(232,121,42,0.18)",
        borderRadius: 12,
        padding: "14px 16px",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(232,121,42,0.2)",
              border: "1px solid rgba(232,121,42,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 800,
              color: "#e8a04a",
              fontFamily: "'Courier Prime', 'Courier New', monospace",
            }}
          >
            {index + 1}
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e8a04a", fontFamily: "'Courier Prime', 'Courier New', monospace", textTransform: "uppercase", letterSpacing: 1 }}>
            Stage {index + 1}
          </span>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            disabled={disabled}
            style={{
              background: "none",
              border: "1px solid rgba(255,80,80,0.25)",
              borderRadius: 6,
              color: "#aa5555",
              cursor: disabled ? "not-allowed" : "pointer",
              fontSize: 11,
              padding: "3px 10px",
            }}
          >
            Remove
          </button>
        )}
      </div>

      {/* Fuel Type */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, color: "#8a7560", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>Fuel Type</label>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          {EXHAUST_OPTIONS.map((opt, i) => (
            <button
              key={opt.name}
              onClick={() => !disabled && onChange({ ...stage, fuelType: i, exhaustVelocity: opt.velocity })}
              disabled={disabled}
              style={{
                flex: 1,
                background: stage.fuelType === i ? `${opt.color}18` : "rgba(0,0,0,0.2)",
                border: `1px solid ${stage.fuelType === i ? `${opt.color}60` : "rgba(232,121,42,0.1)"}`,
                borderRadius: 8,
                padding: "8px 4px",
                cursor: disabled ? "not-allowed" : "pointer",
                color: stage.fuelType === i ? opt.color : "#666",
                textAlign: "center",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 18 }}>{opt.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 600, marginTop: 2 }}>{opt.name}</div>
              <div style={{ fontSize: 9, color: "#777", marginTop: 1 }}>{opt.velocity} m/s</div>
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Mass */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ fontSize: 11, color: "#8a7560", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>
            Fuel Mass
          </label>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e8a04a", fontFamily: "'Courier Prime', monospace" }}>
            {stage.fuelMass.toLocaleString()} kg
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={40000}
          step={500}
          value={stage.fuelMass}
          onChange={(e) => !disabled && onChange({ ...stage, fuelMass: parseInt(e.target.value) })}
          disabled={disabled}
          style={{ width: "100%", marginTop: 4 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#665540" }}>
          <span>500 kg</span>
          <span>40,000 kg</span>
        </div>
      </div>
    </div>
  );
}

function RocketVisualization({ stages, dryMass, animStage, launching }) {
  const totalHeight = 220;
  const rocketWidth = 50;
  const cx = 100;

  const totalFuel = stages.reduce((s, st) => s + st.fuelMass, 0);

  // Proportional stage heights
  const payloadHeight = 40;
  const noseHeight = 25;
  const fuelAreaHeight = totalHeight - payloadHeight - noseHeight;

  let currentY = noseHeight + payloadHeight;
  const stageRects = stages.map((st, i) => {
    const h = Math.max(20, (st.fuelMass / Math.max(totalFuel, 1)) * fuelAreaHeight);
    const y = currentY;
    currentY += h;
    const isJettisoned = animStage !== null && i < animStage;
    return { ...st, y, h, index: i, isJettisoned };
  });

  return (
    <svg width={200} height={totalHeight + 40} viewBox={`0 0 200 ${totalHeight + 40}`}>
      {/* Exhaust flames when launching */}
      {launching && (
        <g>
          <ellipse cx={cx} cy={currentY + 12} rx={18} ry={25} fill="rgba(232,121,42,0.5)">
            <animate attributeName="ry" values="20;30;20" dur="0.3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx={cx} cy={currentY + 8} rx={10} ry={18} fill="rgba(255,200,80,0.7)">
            <animate attributeName="ry" values="15;22;15" dur="0.2s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx={cx} cy={currentY + 5} rx={5} ry={10} fill="rgba(255,255,200,0.9)">
            <animate attributeName="ry" values="8;14;8" dur="0.15s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      {/* Nose cone */}
      <polygon
        points={`${cx},5 ${cx - rocketWidth / 2},${noseHeight + 5} ${cx + rocketWidth / 2},${noseHeight + 5}`}
        fill="#c89050"
        stroke="#a07040"
        strokeWidth={1.5}
      />

      {/* Payload section */}
      <rect
        x={cx - rocketWidth / 2}
        y={noseHeight + 5}
        width={rocketWidth}
        height={payloadHeight}
        fill="#2a2218"
        stroke="#a07040"
        strokeWidth={1.5}
        rx={2}
      />
      <text x={cx} y={noseHeight + 28} textAnchor="middle" fill="#c89050" fontSize={9} fontFamily="monospace" fontWeight="bold">
        {(dryMass / 1000).toFixed(0)}t
      </text>
      <text x={cx} y={noseHeight + 40} textAnchor="middle" fill="#886644" fontSize={7} fontFamily="monospace">
        PAYLOAD
      </text>

      {/* Fuel stages */}
      {stageRects.map((sr) => {
        const fuelColor = EXHAUST_OPTIONS[sr.fuelType]?.color || "#e8792a";
        return (
          <g key={sr.index} style={{ opacity: sr.isJettisoned ? 0.2 : 1, transition: "opacity 0.5s" }}>
            <rect
              x={cx - rocketWidth / 2 - (sr.index * 4)}
              y={sr.y}
              width={rocketWidth + (sr.index * 8)}
              height={sr.h}
              fill="#1a1510"
              stroke={fuelColor}
              strokeWidth={1.5}
              rx={3}
              strokeDasharray={sr.isJettisoned ? "4,3" : "none"}
            />
            {/* Fuel fill */}
            <rect
              x={cx - rocketWidth / 2 - (sr.index * 4) + 3}
              y={sr.y + 3}
              width={rocketWidth + (sr.index * 8) - 6}
              height={sr.h - 6}
              fill={`${fuelColor}20`}
              rx={2}
            />
            <text x={cx} y={sr.y + sr.h / 2 + 3} textAnchor="middle" fill={fuelColor} fontSize={8} fontFamily="monospace" fontWeight="bold">
              S{sr.index + 1}: {(sr.fuelMass / 1000).toFixed(1)}t
            </text>
          </g>
        );
      })}

      {/* Fins on bottom stage */}
      {stageRects.length > 0 && !stageRects[stageRects.length - 1].isJettisoned && (
        <g>
          {[-1, 1].map((dir) => {
            const lastStage = stageRects[stageRects.length - 1];
            const finX = cx + dir * (rocketWidth / 2 + (lastStage.index * 4));
            return (
              <polygon
                key={dir}
                points={`${finX},${lastStage.y + lastStage.h - 10} ${finX + dir * 15},${lastStage.y + lastStage.h + 5} ${finX},${lastStage.y + lastStage.h}`}
                fill="#c89050"
                stroke="#a07040"
                strokeWidth={1}
              />
            );
          })}
        </g>
      )}
    </svg>
  );
}

function MomentumBreakdown({ stages, dryMass, targetVelocity }) {
  let currentMass = dryMass + stages.reduce((s, st) => s + st.fuelMass, 0);
  let currentVelocity = 0;
  const steps = [];

  for (let i = 0; i < stages.length; i++) {
    const st = stages[i];
    const massAfterEjection = currentMass - st.fuelMass;
    const deltaV = (st.fuelMass * st.exhaustVelocity) / massAfterEjection;

    steps.push({
      stage: i + 1,
      fuelType: EXHAUST_OPTIONS[st.fuelType],
      fuelMass: st.fuelMass,
      exhaustV: st.exhaustVelocity,
      massBefore: currentMass,
      massAfter: massAfterEjection,
      deltaV,
      velocityAfter: currentVelocity + deltaV,
    });

    currentVelocity += deltaV;
    currentMass = massAfterEjection;
  }

  const totalDeltaV = currentVelocity;
  const reachesTarget = totalDeltaV >= targetVelocity;

  return (
    <div style={{ fontFamily: "'Courier Prime', 'Courier New', monospace" }}>
      <div style={{ fontSize: 11, color: "#c89050", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: reachesTarget ? "#4ade80" : "#ef4444" }} />
        Momentum Analysis
      </div>

      {steps.map((step) => (
        <div
          key={step.stage}
          style={{
            background: "rgba(0,0,0,0.25)",
            borderRadius: 8,
            padding: "8px 10px",
            marginBottom: 6,
            borderLeft: `3px solid ${step.fuelType.color}`,
            fontSize: 11,
            lineHeight: 1.7,
          }}
        >
          <div style={{ color: step.fuelType.color, fontWeight: 700, marginBottom: 2 }}>
            Stage {step.stage} — {step.fuelType.icon} {step.fuelType.name}
          </div>
          <div style={{ color: "#8a7560" }}>
            Δv = ({step.fuelMass.toLocaleString()} × {step.exhaustV.toLocaleString()}) / {step.massAfter.toLocaleString()}
          </div>
          <div style={{ color: "#c89050" }}>
            Δv = <strong style={{ color: "#e8a04a" }}>{step.deltaV.toFixed(1)} m/s</strong>
            <span style={{ color: "#665540", marginLeft: 8 }}>│</span>
            <span style={{ color: "#888", marginLeft: 8 }}>total: </span>
            <strong style={{ color: step.velocityAfter >= targetVelocity ? "#4ade80" : "#e8a04a" }}>
              {step.velocityAfter.toFixed(1)} m/s
            </strong>
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: 8,
          padding: "10px 12px",
          borderRadius: 8,
          background: reachesTarget ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)",
          border: `1px solid ${reachesTarget ? "rgba(74,222,128,0.25)" : "rgba(239,68,68,0.25)"}`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, color: reachesTarget ? "#4ade80" : "#ef4444" }}>
          {totalDeltaV.toFixed(0)} / {targetVelocity.toLocaleString()} m/s
        </div>
        <div style={{ fontSize: 11, color: reachesTarget ? "#6ee7a0" : "#f87171", marginTop: 2 }}>
          {reachesTarget
            ? `\u2713 Target exceeded by ${(totalDeltaV - targetVelocity).toFixed(0)} m/s!`
            : `\u2717 Need ${(targetVelocity - totalDeltaV).toFixed(0)} more m/s`}
        </div>
      </div>
    </div>
  );
}

export default function RocketStagingChallenge({ onComplete, initialState }) {
  const [screen, setScreen] = useState("title");
  const [missionIndex, setMissionIndex] = useState(0);
  const [stages, setStages] = useState([]);
  const [launching, setLaunching] = useState(false);
  const [launchResult, setLaunchResult] = useState(null);
  const [animStage, setAnimStage] = useState(null);
  const [altitude, setAltitude] = useState(0);
  const [completedMissions, setCompletedMissions] = useState(() => {
    return initialState?.completedMissions || [];
  });

  // Sync completedMissions when initialState changes (async data arrival or teacher reset)
  useEffect(() => {
    const missions = initialState?.completedMissions || [];
    setCompletedMissions(missions);
  }, [initialState?.completedMissions]);

  const mission = MISSIONS[missionIndex];

  const initMission = useCallback((idx) => {
    setMissionIndex(idx);
    setStages([{ fuelType: 0, fuelMass: 5000, exhaustVelocity: EXHAUST_OPTIONS[0].velocity }]);
    setLaunching(false);
    setLaunchResult(null);
    setAnimStage(null);
    setAltitude(0);
  }, []);

  const totalFuel = stages.reduce((s, st) => s + st.fuelMass, 0);
  const totalMass = ROCKET_DRY_MASS + totalFuel;
  const fuelRemaining = (MISSIONS[missionIndex]?.fuelBudget || MAX_TOTAL_FUEL) - totalFuel;

  const addStage = () => {
    if (stages.length < (mission?.maxStages || MAX_STAGES)) {
      setStages([...stages, { fuelType: 1, fuelMass: 5000, exhaustVelocity: EXHAUST_OPTIONS[1].velocity }]);
    }
  };

  const updateStage = (index, newStage) => {
    const updated = [...stages];
    updated[index] = newStage;
    setStages(updated);
  };

  const removeStage = (index) => {
    if (stages.length > 1) {
      setStages(stages.filter((_, i) => i !== index));
    }
  };

  // Compute final velocity
  const computeFinalVelocity = () => {
    let currentMass = ROCKET_DRY_MASS + stages.reduce((s, st) => s + st.fuelMass, 0);
    let velocity = 0;
    for (const st of stages) {
      const massAfter = currentMass - st.fuelMass;
      const deltaV = (st.fuelMass * st.exhaustVelocity) / massAfter;
      velocity += deltaV;
      currentMass = massAfter;
    }
    return velocity;
  };

  const launchRocket = () => {
    if (totalFuel > mission.fuelBudget) return;
    setLaunching(true);
    setAnimStage(0);

    let stageIdx = 0;
    const stageInterval = setInterval(() => {
      stageIdx++;
      if (stageIdx >= stages.length) {
        clearInterval(stageInterval);
        const finalV = computeFinalVelocity();
        setTimeout(() => {
          const success = finalV >= mission.targetVelocity;
          const result = {
            success,
            finalVelocity: finalV,
            targetVelocity: mission.targetVelocity,
            surplus: finalV - mission.targetVelocity,
          };
          setLaunchResult(result);
          setLaunching(false);

          // Track completed missions
          if (success && !completedMissions.includes(mission.id)) {
            setCompletedMissions((prev) => [...prev, mission.id]);
          }

          // Notify parent
          if (onComplete) {
            onComplete({
              missionId: mission.id,
              success,
              finalVelocity: finalV,
              surplus: finalV - mission.targetVelocity,
              stages: stages.map((st) => ({
                fuelType: st.fuelType,
                fuelMass: st.fuelMass,
                exhaustVelocity: st.exhaustVelocity,
              })),
            });
          }
        }, 800);
      } else {
        setAnimStage(stageIdx);
      }
    }, 1200);

    // Altitude animation
    let altVal = 0;
    const altInterval = setInterval(() => {
      altVal += Math.random() * 3 + 1;
      setAltitude(altVal);
      if (altVal > 100) clearInterval(altInterval);
    }, 100);
  };

  // TITLE SCREEN
  if (screen === "title") {
    return (
      <div
        style={{
          minHeight: 600,
          background: "radial-gradient(ellipse at 40% 80%, #1a0e05 0%, #0d0805 40%, #050302 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Courier Prime', 'Courier New', monospace",
          color: "#e8c89a",
          padding: 20,
          position: "relative",
          overflow: "hidden",
          borderRadius: 14,
        }}
      >
        <style>{`
          @keyframes flicker { 0%, 100% { opacity: 0.85; } 50% { opacity: 1; } }
          @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
          @keyframes riseUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes throb { 0%, 100% { box-shadow: 0 0 15px rgba(232,121,42,0.3); } 50% { box-shadow: 0 0 35px rgba(232,121,42,0.6); } }
          @keyframes gentlePulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
          .rocket-staging input[type="range"] { -webkit-appearance: none; width: 100%; height: 5px; border-radius: 2px; background: rgba(232,121,42,0.15); outline: none; }
          .rocket-staging input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #e8792a; cursor: pointer; border: 2px solid #1a0e05; }
        `}</style>

        {/* Scanline overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Warm glow */}
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,121,42,0.08) 0%, transparent 70%)",
            bottom: "-20%",
            left: "30%",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 620 }}>
          <div style={{ fontSize: 64, marginBottom: 12, animation: "riseUp 0.8s ease-out" }}>{"\u{1F680}"}</div>

          <div
            style={{
              fontSize: 11,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#8a6540",
              marginBottom: 8,
              animation: "riseUp 0.8s ease-out 0.1s both",
            }}
          >
            Panther Aerospace Division
          </div>

          <h1
            style={{
              fontSize: 38,
              fontWeight: 700,
              color: "#e8a04a",
              marginBottom: 6,
              letterSpacing: 2,
              textShadow: "0 0 30px rgba(232,160,74,0.3)",
              animation: "riseUp 0.8s ease-out 0.2s both, flicker 4s ease-in-out infinite",
            }}
          >
            ROCKET STAGING
            <br />
            CHALLENGE
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "#a0845e",
              maxWidth: 460,
              margin: "0 auto 10px",
              lineHeight: 1.7,
              animation: "riseUp 0.8s ease-out 0.3s both",
            }}
          >
            Design a multi-stage rocket that reaches orbital velocity.
            Choose your fuel types, allocate mass across stages, and
            use conservation of momentum to escape Earth's gravity.
          </p>

          <div
            style={{
              background: "rgba(232,121,42,0.06)",
              border: "1px solid rgba(232,121,42,0.15)",
              borderRadius: 10,
              padding: "16px 20px",
              marginBottom: 28,
              textAlign: "left",
              animation: "riseUp 0.8s ease-out 0.4s both",
            }}
          >
            <div style={{ fontSize: 11, color: "#c89050", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: 2 }}>
              {"\u2699"} The Physics
            </div>
            <div style={{ fontSize: 18, color: "#e8a04a", textAlign: "center", marginBottom: 8 }}>
              Δv = (m<sub>fuel</sub> × v<sub>exhaust</sub>) / m<sub>remaining</sub>
            </div>
            <p style={{ fontSize: 12, color: "#8a7560", lineHeight: 1.6, margin: 0 }}>
              Each stage ejects fuel mass at high speed. By conservation of momentum, the rocket gains velocity in the opposite direction. <strong style={{ color: "#c89050" }}>Staging works because you drop the empty fuel tanks</strong> — so later stages push a lighter rocket, gaining more Δv per kilogram of fuel.
            </p>
          </div>

          <button
            onClick={() => setScreen("missions")}
            style={{
              background: "linear-gradient(135deg, #e8792a, #c89050)",
              color: "#1a0e05",
              border: "none",
              borderRadius: 8,
              padding: "13px 44px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Courier Prime', monospace",
              letterSpacing: 2,
              textTransform: "uppercase",
              animation: "riseUp 0.8s ease-out 0.5s both, throb 3s ease-in-out infinite",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Begin Design {"\u2192"}
          </button>
        </div>
      </div>
    );
  }

  // MISSION SELECT
  if (screen === "missions") {
    return (
      <div
        className="rocket-staging"
        style={{
          minHeight: 600,
          background: "radial-gradient(ellipse at 50% 0%, #1a0e05 0%, #0d0805 60%, #050302 100%)",
          fontFamily: "'Courier Prime', 'Courier New', monospace",
          color: "#e8c89a",
          padding: "36px 20px",
          borderRadius: 14,
        }}
      >
        <style>{`
          .rocket-staging input[type="range"] { -webkit-appearance: none; width: 100%; height: 5px; border-radius: 2px; background: rgba(232,121,42,0.15); outline: none; }
          .rocket-staging input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #e8792a; cursor: pointer; border: 2px solid #1a0e05; }
        `}</style>
        <div style={{ maxWidth: 650, margin: "0 auto" }}>
          <button onClick={() => setScreen("title")} style={{ background: "none", border: "none", color: "#8a6540", cursor: "pointer", fontSize: 13, marginBottom: 20, fontFamily: "inherit" }}>
            {"\u2190"} Back
          </button>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#e8a04a", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
            Select Mission
          </h2>
          <p style={{ color: "#8a7560", marginBottom: 24, fontSize: 13 }}>Each mission requires higher velocity. Design your rocket to match.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {MISSIONS.map((m, i) => {
              const isCompleted = completedMissions.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    initMission(i);
                    setScreen("design");
                  }}
                  style={{
                    background: isCompleted ? "rgba(74,222,128,0.06)" : "rgba(232,121,42,0.04)",
                    border: `1px solid ${isCompleted ? "rgba(74,222,128,0.2)" : "rgba(232,121,42,0.12)"}`,
                    borderRadius: 12,
                    padding: "16px 20px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    color: "#e8c89a",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isCompleted ? "rgba(74,222,128,0.1)" : "rgba(232,121,42,0.1)";
                    e.currentTarget.style.borderColor = isCompleted ? "rgba(74,222,128,0.35)" : "rgba(232,121,42,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isCompleted ? "rgba(74,222,128,0.06)" : "rgba(232,121,42,0.04)";
                    e.currentTarget.style.borderColor = isCompleted ? "rgba(74,222,128,0.2)" : "rgba(232,121,42,0.12)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#8a6540", textTransform: "uppercase", letterSpacing: 2, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
                        Mission {m.id}
                        {isCompleted && <span style={{ color: "#4ade80", fontSize: 11 }}>{"\u2713"} Completed</span>}
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: "#e8a04a", display: "flex", alignItems: "center", gap: 8 }}>
                        <span>{m.icon}</span> {m.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#8a7560", marginTop: 4 }}>{m.description}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16, fontSize: 12 }}>
                      <div style={{ color: "#e8a04a", fontWeight: 700 }}>{m.targetVelocity.toLocaleString()} m/s</div>
                      <div style={{ color: "#8a6540" }}>{m.maxStages} stages max</div>
                      <div style={{ color: "#8a6540" }}>{(m.fuelBudget / 1000).toFixed(0)}t fuel</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // DESIGN SCREEN
  if (screen === "design" && mission) {
    const overBudget = totalFuel > mission.fuelBudget;

    return (
      <div
        className="rocket-staging"
        style={{
          minHeight: 600,
          background: "radial-gradient(ellipse at 50% 30%, #1a0e05 0%, #0d0805 60%, #050302 100%)",
          fontFamily: "'Courier Prime', 'Courier New', monospace",
          color: "#e8c89a",
          padding: "14px 20px",
          borderRadius: 14,
        }}
      >
        <style>{`
          @keyframes flicker { 0%, 100% { opacity: 0.85; } 50% { opacity: 1; } }
          @keyframes throb { 0%, 100% { box-shadow: 0 0 15px rgba(232,121,42,0.3); } 50% { box-shadow: 0 0 35px rgba(232,121,42,0.6); } }
          @keyframes successGlow { 0%, 100% { box-shadow: 0 0 20px rgba(74,222,128,0.3); } 50% { box-shadow: 0 0 50px rgba(74,222,128,0.6); } }
          @keyframes failGlow { 0%, 100% { box-shadow: 0 0 20px rgba(239,68,68,0.3); } 50% { box-shadow: 0 0 50px rgba(239,68,68,0.6); } }
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-3px) translateY(-1px); } 75% { transform: translateX(3px) translateY(-1px); } }
          .rocket-staging input[type="range"] { -webkit-appearance: none; width: 100%; height: 5px; border-radius: 2px; background: rgba(232,121,42,0.15); outline: none; }
          .rocket-staging input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #e8792a; cursor: pointer; border: 2px solid #1a0e05; }
        `}</style>

        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <button onClick={() => setScreen("missions")} style={{ background: "none", border: "none", color: "#8a6540", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
              {"\u2190"} Missions
            </button>
            <div style={{ fontSize: 13, color: "#e8a04a", fontWeight: 700, letterSpacing: 1 }}>
              {mission.icon} {mission.name}
            </div>
            <div style={{ fontSize: 12, color: "#8a6540" }}>
              Target: <strong style={{ color: "#e8a04a" }}>{mission.targetVelocity.toLocaleString()} m/s</strong>
            </div>
          </div>

          {/* Mass Budget Bar */}
          <div
            style={{
              background: "rgba(232,121,42,0.04)",
              border: `1px solid ${overBudget ? "rgba(239,68,68,0.4)" : "rgba(232,121,42,0.12)"}`,
              borderRadius: 10,
              padding: "10px 16px",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
              <span style={{ color: "#8a6540" }}>FUEL BUDGET</span>
              <span style={{ color: overBudget ? "#ef4444" : "#c89050", fontWeight: 700 }}>
                {totalFuel.toLocaleString()} / {mission.fuelBudget.toLocaleString()} kg
                {overBudget && " \u26A0 OVER BUDGET"}
              </span>
            </div>
            <div style={{ height: 6, background: "rgba(0,0,0,0.3)", borderRadius: 3, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, (totalFuel / mission.fuelBudget) * 100)}%`,
                  background: overBudget
                    ? "linear-gradient(90deg, #ef4444, #dc2626)"
                    : totalFuel / mission.fuelBudget > 0.8
                    ? "linear-gradient(90deg, #e8792a, #eab308)"
                    : "linear-gradient(90deg, #e8792a, #c89050)",
                  borderRadius: 3,
                  transition: "width 0.3s",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#665540", marginTop: 4 }}>
              <span>Total Mass: {totalMass.toLocaleString()} kg</span>
              <span>Dry Mass: {ROCKET_DRY_MASS.toLocaleString()} kg</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 1fr", gap: 12 }}>
            {/* Rocket Visualization */}
            <div
              style={{
                background: "rgba(232,121,42,0.03)",
                border: "1px solid rgba(232,121,42,0.1)",
                borderRadius: 14,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                animation: launching ? "shake 0.1s infinite" : "none",
              }}
            >
              <div style={{ fontSize: 10, color: "#8a6540", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                Rocket Design
              </div>
              <RocketVisualization stages={stages} dryMass={ROCKET_DRY_MASS} animStage={animStage} launching={launching} />
            </div>

            {/* Stage Designers */}
            <div>
              <div style={{ fontSize: 11, color: "#c89050", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                {"\u2699"} Configure Stages (bottom {"\u2192"} top)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stages.map((st, i) => (
                  <StageDesigner
                    key={i}
                    stage={st}
                    index={i}
                    onChange={(newSt) => updateStage(i, newSt)}
                    onRemove={stages.length > 1 ? () => removeStage(i) : null}
                    disabled={launching || launchResult !== null}
                  />
                ))}
                {stages.length < mission.maxStages && !launching && !launchResult && (
                  <button
                    onClick={addStage}
                    style={{
                      background: "rgba(232,121,42,0.06)",
                      border: "1px dashed rgba(232,121,42,0.25)",
                      borderRadius: 10,
                      padding: "12px",
                      color: "#c89050",
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: "inherit",
                      fontWeight: 600,
                    }}
                  >
                    + Add Stage ({stages.length}/{mission.maxStages})
                  </button>
                )}
              </div>
            </div>

            {/* Momentum Analysis */}
            <div
              style={{
                background: "rgba(232,121,42,0.03)",
                border: "1px solid rgba(232,121,42,0.1)",
                borderRadius: 14,
                padding: 14,
              }}
            >
              <MomentumBreakdown stages={stages} dryMass={ROCKET_DRY_MASS} targetVelocity={mission.targetVelocity} />

              {/* Launch / Result */}
              {launchResult ? (
                <div
                  style={{
                    marginTop: 12,
                    padding: "16px",
                    borderRadius: 10,
                    background: launchResult.success ? "rgba(74,222,128,0.06)" : "rgba(239,68,68,0.06)",
                    border: `1px solid ${launchResult.success ? "rgba(74,222,128,0.25)" : "rgba(239,68,68,0.25)"}`,
                    textAlign: "center",
                    animation: launchResult.success ? "successGlow 2s infinite" : "failGlow 2s infinite",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 6 }}>{launchResult.success ? "\u{1F389}" : "\u{1F4A5}"}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: launchResult.success ? "#4ade80" : "#ef4444" }}>
                    {launchResult.success ? "ORBIT ACHIEVED!" : "INSUFFICIENT VELOCITY"}
                  </div>
                  <div style={{ fontSize: 12, color: "#8a7560", marginTop: 4 }}>
                    {launchResult.success
                      ? `Reached ${launchResult.finalVelocity.toFixed(0)} m/s \u2014 ${launchResult.surplus.toFixed(0)} m/s surplus!`
                      : `Only reached ${launchResult.finalVelocity.toFixed(0)} m/s. Needed ${(-launchResult.surplus).toFixed(0)} more m/s.`}
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
                    <button
                      onClick={() => initMission(missionIndex)}
                      style={{
                        background: "rgba(232,121,42,0.12)",
                        border: "1px solid rgba(232,121,42,0.3)",
                        borderRadius: 6,
                        padding: "8px 16px",
                        color: "#e8a04a",
                        cursor: "pointer",
                        fontSize: 12,
                        fontFamily: "inherit",
                        fontWeight: 600,
                      }}
                    >
                      Redesign
                    </button>
                    {launchResult.success && missionIndex < MISSIONS.length - 1 && (
                      <button
                        onClick={() => {
                          initMission(missionIndex + 1);
                          setScreen("design");
                        }}
                        style={{
                          background: "linear-gradient(135deg, #e8792a, #c89050)",
                          border: "none",
                          borderRadius: 6,
                          padding: "8px 16px",
                          color: "#1a0e05",
                          cursor: "pointer",
                          fontSize: 12,
                          fontFamily: "inherit",
                          fontWeight: 700,
                        }}
                      >
                        Next Mission {"\u2192"}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={launchRocket}
                  disabled={launching || overBudget || stages.length === 0}
                  style={{
                    width: "100%",
                    marginTop: 12,
                    background: overBudget
                      ? "rgba(100,50,50,0.3)"
                      : "linear-gradient(135deg, #e8792a, #c89050)",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px",
                    color: overBudget ? "#aa5555" : "#1a0e05",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: overBudget || launching ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    animation: !overBudget && !launching ? "throb 3s ease-in-out infinite" : "none",
                  }}
                >
                  {launching ? "\u{1F525} LAUNCHING..." : overBudget ? "\u26A0 OVER FUEL BUDGET" : "\u{1F680} LAUNCH"}
                </button>
              )}

              {/* Educational hint */}
              {!launchResult && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "8px 10px",
                    background: "rgba(200,144,80,0.06)",
                    border: "1px solid rgba(200,144,80,0.12)",
                    borderRadius: 6,
                    fontSize: 11,
                    color: "#a08060",
                    lineHeight: 1.5,
                  }}
                >
                  {"\u{1F4A1}"} <strong>Why staging?</strong> After burning a stage's fuel, you drop the empty tank. Less mass means the next stage's fuel gives you a bigger Δv. Try comparing 1 big stage vs. multiple smaller stages!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
