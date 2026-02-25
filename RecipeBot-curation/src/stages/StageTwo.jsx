import React, { useMemo, useState } from "react";

const CUISINE_LABELS = {
  western: "🍔 Western",
  asian: "🍜 Asian",
  latin: "🌮 Latin American",
  african: "🍲 African",
  middleEastern: "🧆 Middle Eastern",
  indian: "🍛 Indian",
  other: "🍽️ Other"
};

const DIETARY_LABELS = {
  vegetarian: "🥬 Vegetarian",
  vegan: "🌱 Vegan",
  glutenFree: "🌾 Gluten-Free",
  dairyFree: "🥛 Dairy-Free",
  keto: "🥩 Keto",
  halal: "☪️ Halal",
  kosher: "✡️ Kosher"
};

const WORLD_POPULATION_BENCHMARK = {
  western: 17,
  asian: 45,
  latin: 8,
  african: 18,
  middleEastern: 6,
  indian: 18,
  other: 5
};

export default function StageTwo({ selectedSources, biasNotes, onBiasNotesChange, onComplete }) {
  const [showBenchmark, setShowBenchmark] = useState(false);

  // Calculate aggregate stats from selected sources
  const stats = useMemo(() => {
    const cuisine = { western: 0, asian: 0, latin: 0, african: 0, middleEastern: 0, indian: 0, other: 0 };
    const dietary = { vegetarian: 0, vegan: 0, glutenFree: 0, dairyFree: 0, keto: 0, halal: 0, kosher: 0 };
    let totalWeight = 0;

    selectedSources.forEach(source => {
      const weight = source.cost; // Use cost as weight (proxy for data volume)
      totalWeight += weight;
      Object.keys(cuisine).forEach(k => {
        cuisine[k] += (source.cuisineBreakdown?.[k] || 0) * weight;
      });
      Object.keys(dietary).forEach(k => {
        dietary[k] += (source.dietaryTags?.[k] || 0) * weight;
      });
    });

    // Normalize
    if (totalWeight > 0) {
      Object.keys(cuisine).forEach(k => cuisine[k] = Math.round(cuisine[k] / totalWeight));
      Object.keys(dietary).forEach(k => dietary[k] = Math.round(dietary[k] / totalWeight));
    }

    // Identify gaps
    const gaps = [];
    if (cuisine.african < 10) gaps.push({ area: "African cuisines", severity: "high", detail: `Only ${cuisine.african}% of your data covers African food, despite Africa having 18% of the world's population.` });
    if (cuisine.indian < 10) gaps.push({ area: "Indian cuisine", severity: "high", detail: `Only ${cuisine.indian}% coverage for a cuisine that serves 1.4 billion people.` });
    if (cuisine.middleEastern < 8) gaps.push({ area: "Middle Eastern cuisine", severity: "medium", detail: `${cuisine.middleEastern}% is low representation for a rich culinary tradition.` });
    if (cuisine.latin < 8) gaps.push({ area: "Latin American cuisine", severity: "medium", detail: `${cuisine.latin}% coverage misses huge variety across 20+ countries.` });
    if (cuisine.western > 50) gaps.push({ area: "Western over-representation", severity: "high", detail: `${cuisine.western}% Western food means RecipeBot will default to Western dishes.` });
    if (dietary.halal < 5) gaps.push({ area: "Halal options", severity: "high", detail: `Only ${dietary.halal}% halal coverage. 1.8 billion Muslims may be poorly served.` });
    if (dietary.kosher < 5) gaps.push({ area: "Kosher options", severity: "medium", detail: `${dietary.kosher}% kosher coverage is very limited.` });
    if (dietary.vegan < 10) gaps.push({ area: "Vegan options", severity: "medium", detail: `${dietary.vegan}% vegan coverage. Growing dietary preference underserved.` });

    // Count languages
    const langSet = new Set();
    selectedSources.forEach(s => s.languages.forEach(l => langSet.add(l)));

    // Check for problematic sources
    const problematics = selectedSources.filter(s => s.category === "problematic");

    return { cuisine, dietary, gaps, languages: [...langSet], problematics, sourceCount: selectedSources.length };
  }, [selectedSources]);

  const maxCuisine = Math.max(...Object.values(stats.cuisine), 1);
  const canComplete = biasNotes.trim().length >= 50;

  return (
    <div className="stage stage-two">
      <div className="stage-header">
        <h2>Stage 2: Bias Detection</h2>
        <p>
          Analyze the dataset you've assembled. Every data choice creates bias — 
          your job is to identify the gaps and understand how they'll affect RecipeBot's behavior.
        </p>
      </div>

      {/* Dataset Overview */}
      <div className="bias-overview-grid">
        <div className="overview-stat">
          <span className="stat-number">{stats.sourceCount}</span>
          <span className="stat-label">Sources Selected</span>
        </div>
        <div className="overview-stat">
          <span className="stat-number">{stats.languages.length}</span>
          <span className="stat-label">Languages Covered</span>
        </div>
        <div className="overview-stat warning">
          <span className="stat-number">{stats.gaps.length}</span>
          <span className="stat-label">Bias Gaps Found</span>
        </div>
        <div className="overview-stat" style={stats.problematics.length > 0 ? { borderColor: "#ef4444" } : {}}>
          <span className="stat-number">{stats.problematics.length}</span>
          <span className="stat-label">Problematic Sources</span>
        </div>
      </div>

      {/* Cuisine Distribution */}
      <section className="bias-section">
        <div className="section-header">
          <h3>🌍 Cuisine Representation</h3>
          <label className="benchmark-toggle">
            <input type="checkbox" checked={showBenchmark} onChange={(e) => setShowBenchmark(e.target.checked)} />
            Show world population benchmark
          </label>
        </div>
        <div className="cuisine-chart">
          {Object.entries(stats.cuisine).map(([key, value]) => (
            <div key={key} className="chart-row">
              <span className="chart-label">{CUISINE_LABELS[key]}</span>
              <div className="chart-bar-area">
                <div className="chart-bar" style={{ width: `${(value / Math.max(maxCuisine, 1)) * 100}%` }}>
                  <span className="chart-value">{value}%</span>
                </div>
                {showBenchmark && (
                  <div 
                    className="benchmark-line" 
                    style={{ left: `${(WORLD_POPULATION_BENCHMARK[key] / Math.max(maxCuisine, 1)) * 100}%` }}
                    title={`World population: ${WORLD_POPULATION_BENCHMARK[key]}%`}
                  >
                    <span className="benchmark-label">{WORLD_POPULATION_BENCHMARK[key]}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {showBenchmark && (
          <p className="benchmark-note">
            <span className="benchmark-marker">|</span> = approximate world population proportion. 
            Large gaps between your data and the benchmark mean RecipeBot may underserve large populations.
          </p>
        )}
      </section>

      {/* Dietary Coverage */}
      <section className="bias-section">
        <h3>🥗 Dietary Restriction Coverage</h3>
        <div className="dietary-chart">
          {Object.entries(stats.dietary).map(([key, value]) => (
            <div key={key} className="dietary-chip" style={{ opacity: Math.max(0.3, value / 50) }}>
              <span className="chip-label">{DIETARY_LABELS[key]}</span>
              <span className="chip-value">{value}%</span>
              <div className="chip-bar">
                <div className="chip-fill" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Language Coverage */}
      <section className="bias-section">
        <h3>🗣️ Language Coverage</h3>
        <div className="language-pills">
          {stats.languages.map(lang => (
            <span key={lang} className="lang-pill">{lang}</span>
          ))}
        </div>
        {stats.languages.length === 1 && (
          <p className="warning-note">
            ⚠️ Only English! RecipeBot won't understand recipes in other languages or properly handle 
            non-English ingredient names and cooking terms.
          </p>
        )}
      </section>

      {/* Identified Gaps */}
      <section className="bias-section">
        <h3>🚨 Identified Gaps & Biases</h3>
        {stats.gaps.length === 0 ? (
          <p className="success-note">✅ No major gaps detected. Nice work on a balanced dataset!</p>
        ) : (
          <div className="gaps-list">
            {stats.gaps.map((gap, i) => (
              <div key={i} className={`gap-card severity-${gap.severity}`}>
                <div className="gap-header">
                  <span className={`severity-badge ${gap.severity}`}>
                    {gap.severity === "high" ? "🔴 High" : "🟡 Medium"}
                  </span>
                  <span className="gap-area">{gap.area}</span>
                </div>
                <p>{gap.detail}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Problematic Source Warnings */}
      {stats.problematics.length > 0 && (
        <section className="bias-section warning-section">
          <h3>⚠️ Problematic Sources in Your Dataset</h3>
          {stats.problematics.map(source => (
            <div key={source.id} className="problematic-warning">
              <span className="prob-icon">{source.icon}</span>
              <div>
                <strong>{source.name}</strong>
                <p>{source.biasNotes}</p>
                <div className="risk-tags">
                  {source.risks.map((r, i) => <span key={i} className="risk-tag danger">{r}</span>)}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Student Reflection */}
      <section className="bias-section reflection-section">
        <h3>✍️ Your Analysis</h3>
        <p>
          Based on the data above, write a brief analysis of your dataset's strengths and weaknesses. 
          What populations might be underserved? What problems might arise from your data choices?
        </p>
        <textarea
          className="reflection-textarea"
          placeholder="Write your bias analysis here (minimum 50 characters)..."
          value={biasNotes}
          onChange={e => onBiasNotesChange(e.target.value)}
          rows={6}
        />
        <div className="char-count">{biasNotes.length} characters {biasNotes.length < 50 && `(need ${50 - biasNotes.length} more)`}</div>
      </section>

      {/* Complete */}
      <div className="stage-footer">
        {!canComplete && (
          <p className="requirement-warning">⚠️ Write at least 50 characters of analysis to continue</p>
        )}
        <button className="complete-btn" onClick={onComplete} disabled={!canComplete}>
          Continue to Data Cleaning →
        </button>
      </div>
    </div>
  );
}
