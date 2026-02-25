import React, { useState } from "react";

const CATEGORY_LABELS = {
  structured: { label: "Structured Databases", color: "#3b82f6" },
  social: { label: "Social Media / UGC", color: "#f59e0b" },
  specialized: { label: "Diverse / Specialized", color: "#8b5cf6" },
  problematic: { label: "⚠️ Potentially Problematic", color: "#ef4444" }
};

export default function StageOne({ sources, selectedSources, budgetUsed, totalBudget, onToggleSource, onComplete }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");

  const isSelected = (id) => selectedSources.some(s => s.id === id);
  const budgetRemaining = totalBudget - budgetUsed;
  const budgetPercent = (budgetUsed / totalBudget) * 100;

  const grouped = {};
  sources.forEach(s => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  const canComplete = selectedSources.length >= 3;

  return (
    <div className="stage stage-one">
      <div className="stage-header">
        <div>
          <h2>Stage 1: Source Selection</h2>
          <p>
            Choose which data sources to include in RecipeBot's training dataset. 
            You have a <strong>budget of {totalBudget} credits</strong> — you can't include everything, 
            so you'll need to make strategic choices about what data your model learns from.
          </p>
        </div>
      </div>

      {/* Budget Bar */}
      <div className="budget-bar">
        <div className="budget-info">
          <span>Budget Used: <strong>{budgetUsed}</strong> / {totalBudget} credits</span>
          <span className={`budget-remaining ${budgetRemaining < 15 ? "low" : ""}`}>
            {budgetRemaining} remaining
          </span>
        </div>
        <div className="budget-track">
          <div 
            className={`budget-fill ${budgetPercent > 85 ? "warning" : ""}`} 
            style={{ width: `${Math.min(budgetPercent, 100)}%` }} 
          />
        </div>
        <div className="budget-selected">
          {selectedSources.length} source{selectedSources.length !== 1 ? "s" : ""} selected
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <button 
          className={`filter-btn ${filterCategory === "all" ? "active" : ""}`}
          onClick={() => setFilterCategory("all")}
        >
          All Sources
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
          <button
            key={key}
            className={`filter-btn ${filterCategory === key ? "active" : ""}`}
            onClick={() => setFilterCategory(key)}
            style={{ "--cat-color": val.color }}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Source Cards */}
      {Object.entries(grouped)
        .filter(([cat]) => filterCategory === "all" || cat === filterCategory)
        .map(([category, items]) => (
          <div key={category} className="source-category">
            <h3 style={{ color: CATEGORY_LABELS[category]?.color }}>
              {CATEGORY_LABELS[category]?.label}
            </h3>
            <div className="source-grid">
              {items.map(source => {
                const selected = isSelected(source.id);
                const tooExpensive = !selected && source.cost > budgetRemaining;
                
                return (
                  <div 
                    key={source.id} 
                    className={`source-card ${selected ? "selected" : ""} ${tooExpensive ? "disabled" : ""} ${source.category === "problematic" ? "problematic" : ""}`}
                  >
                    <div className="source-card-header" onClick={() => setExpandedCard(expandedCard === source.id ? null : source.id)}>
                      <span className="source-icon">{source.icon}</span>
                      <div className="source-title-area">
                        <h4>{source.name}</h4>
                        <span className="source-type">{source.type}</span>
                      </div>
                      <div className="source-cost">
                        <span className="cost-badge">{source.cost} credits</span>
                      </div>
                    </div>

                    <p className="source-desc">{source.description}</p>

                    <div className="source-quick-stats">
                      <span>📊 {source.volume}</span>
                      <span>🌐 {source.languages.join(", ")}</span>
                      <span>⭐ Quality: {source.qualityScore}/10</span>
                      <span>🌍 Diversity: {source.diversityScore}/10</span>
                    </div>

                    {expandedCard === source.id && (
                      <div className="source-details">
                        <div className="detail-section">
                          <h5>Cuisine Breakdown</h5>
                          <div className="cuisine-bars">
                            {Object.entries(source.cuisineBreakdown).map(([cuisine, pct]) => (
                              <div key={cuisine} className="cuisine-bar-row">
                                <span className="cuisine-label">{cuisine}</span>
                                <div className="cuisine-bar-track">
                                  <div className="cuisine-bar-fill" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="cuisine-pct">{pct}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="detail-section">
                          <h5>⚠️ Known Biases & Risks</h5>
                          <p className="bias-note">{source.biasNotes}</p>
                          <div className="risk-tags">
                            {source.risks.map((risk, i) => (
                              <span key={i} className="risk-tag">{risk}</span>
                            ))}
                          </div>
                        </div>

                        <div className="detail-section">
                          <h5>Dietary Tag Coverage</h5>
                          <div className="dietary-tags">
                            {Object.entries(source.dietaryTags).map(([tag, pct]) => (
                              <span key={tag} className="dietary-tag">
                                {tag}: {pct}%
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <button 
                      className={`select-btn ${selected ? "deselect" : ""}`}
                      onClick={() => onToggleSource(source)}
                      disabled={tooExpensive}
                    >
                      {selected ? "✕ Remove" : tooExpensive ? "Over Budget" : "+ Add to Dataset"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {/* Complete Button */}
      <div className="stage-footer">
        <div className="completion-requirements">
          {!canComplete && (
            <p className="requirement-warning">⚠️ Select at least 3 sources to continue</p>
          )}
        </div>
        <button 
          className="complete-btn" 
          onClick={onComplete}
          disabled={!canComplete}
        >
          Continue to Bias Detection →
        </button>
      </div>
    </div>
  );
}
