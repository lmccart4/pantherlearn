import React from "react";

// ═══════════════════════════════════════════════════════════════
// SHIP PROFILES — Top-down vessel artwork
// Uses cropped PNG sprites for each vessel class
// ═══════════════════════════════════════════════════════════════

const SHIP_PROFILES = {
  CV: {
    designation: "CV-01",
    fullName: "Strategic Carrier Group Flagship",
    image: "/ship-cv.png",
  },
  BB: {
    designation: "BB-02",
    fullName: "Primary Shore Bombardment",
    image: "/ship-bb.png",
  },
  CA: {
    designation: "DD-03",
    fullName: "Guided Missile Destroyer",
    image: "/ship-ca.png",
  },
  SS: {
    designation: "SSN-04",
    fullName: "Attack Submarine",
    image: "/ship-ss.png",
  },
  PT: {
    designation: "FF-05",
    fullName: "Coastal Patrol Cruiser",
    image: "/ship-pt.png",
  },
};

// ── Length indicator bar ─────────────────────────────────────
function LengthIndicator({ size }) {
  return (
    <div className="schematic-length">
      <span className="schematic-length-label">Length {size}</span>
      <div className="schematic-length-cells">
        {Array.from({ length: size }, (_, i) => (
          <div key={i} className="schematic-length-cell" />
        ))}
      </div>
    </div>
  );
}

// ── Single ship panel (header + image + length) ──────────────
export function ShipSchematicPanel({ ship, isActive, isPlaced, isSunk, compact, onClick }) {
  const p = SHIP_PROFILES[ship.code];
  if (!p) return null;

  let cls = "schematic-panel";
  if (isActive) cls += " active";
  if (isPlaced && !isActive) cls += " placed";
  if (isSunk) cls += " sunk";
  if (compact) cls += " compact";

  return (
    <div className={cls} onClick={onClick} role="button" tabIndex={0}>
      <div className="schematic-header">
        <span className="schematic-designation">{p.fullName} ({p.designation})</span>
      </div>
      <img
        className="schematic-ship-img"
        src={p.image}
        alt={p.fullName}
        draggable={false}
      />
      {!compact && <LengthIndicator size={ship.size} />}
    </div>
  );
}

// ── Full fleet column (placement phase) ─────────────────────
export function SchematicFleet({ ships, currentShipIdx, placements, compact, onSelect }) {
  return (
    <div className={compact ? "schematic-fleet-compact" : "schematic-column"}>
      {ships.map((ship, idx) => {
        const isPlaced = placements ? idx < placements.length : false;
        const isActive = idx === currentShipIdx;
        return (
          <ShipSchematicPanel
            key={ship.code}
            ship={ship}
            isActive={isActive}
            isPlaced={isPlaced}
            compact={compact}
            onClick={() => onSelect && onSelect(idx)}
          />
        );
      })}
    </div>
  );
}

// ── Ship image overlay for the battle grid ───────────────────
// Uses CSS Grid placement so it aligns perfectly with grid cells
// (handles the fixed 28px label column in the main grid)
export function ShipOverlay({ shipCode, row, col, size, horizontal, isHit, isSunk, mini, noLabels }) {
  const p = SHIP_PROFILES[shipCode];
  if (!p) return null;

  // Grid offset: +2 for label grids (row 1 & col 1 are labels), +1 for no-label grids
  const offset = noLabels ? 1 : 2;

  let cls = "grid-ship-overlay";
  if (isSunk) cls += " sunk";
  else if (isHit) cls += " hit";
  if (mini) cls += " mini";

  // CSS Grid placement: gridColumn and gridRow use 1-based line numbers
  const gridStyle = horizontal
    ? {
        gridColumn: `${col + offset} / span ${size}`,
        gridRow: `${row + offset} / span 1`,
      }
    : {
        gridColumn: `${col + offset} / span 1`,
        gridRow: `${row + offset} / span ${size}`,
      };

  if (horizontal) {
    return (
      <img className={cls} src={p.image} alt="" draggable={false}
        style={gridStyle}
      />
    );
  }

  // Vertical: wrapper is 1-col × N-rows grid area.
  // Since cells are square (9/9 aspect ratio), wrapper height = N × wrapper width (W).
  // Pre-rotation image: width = N×W, height = W → centered → rotated -90deg →
  // visual width = W, visual height = N×W → perfectly fills the wrapper.
  // CSS margin-% is always relative to parent WIDTH, so:
  //   marginLeft = -N*50% (of W) to center horizontally
  //   marginTop  = -50%   (of W) to center vertically
  return (
    <div className="grid-ship-overlay-wrap" style={gridStyle}>
      <img className={cls} src={p.image} alt="" draggable={false}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `${size * 100}%`,
          height: `${100 / size}%`,
          marginLeft: `${-size * 50}%`,
          marginTop: "-50%",
          objectFit: "fill",
          transform: "rotate(-90deg)",
        }}
      />
    </div>
  );
}

// ── Tiny inline ship image for sidebar ───────────────────────
export function ShipSilhouette({ shipCode, isSunk }) {
  const p = SHIP_PROFILES[shipCode];
  if (!p) return null;

  return (
    <img
      className={`ship-silhouette-img ${isSunk ? "sunk" : ""}`}
      src={p.image}
      alt=""
      draggable={false}
    />
  );
}
