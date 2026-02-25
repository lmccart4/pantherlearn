import React, { useState, useMemo } from "react";
import { ISSUE_TYPES, SCORING_RUBRIC } from "../data/sources";

export default function Summary({ selectedSources, budgetUsed, biasNotes, cleaningDecisions, testResults, reflections, onComplete }) {
  const [finalReflection, setFinalReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Calculate scores
  const scores = useMemo(() => {
    // Source Selection scoring
    let sourceScore = 0;
    const hasDiverse = selectedSources.some(s => s.category === "specialized");
    const hasProblematic = selectedSources.some(s => s.category === "problematic");
    const cuisines = {};
    selectedSources.forEach(s => {
      Object.entries(s.cuisineBreakdown).forEach(([k, v]) => {
        cuisines[k] = (cuisines[k] || 0) + v;
      });
    });
    const total = Object.values(cuisines).reduce((a, b) => a + b, 1);
    const diverseEnough = Object.values(cuisines).filter(v => (v / total) > 0.05).length >= 4;

    if (diverseEnough) sourceScore += 10;
    if (!hasProblematic) sourceScore += 10;
    else sourceScore += 3; // Partial credit
    if (hasDiverse) sourceScore += 5;
    sourceScore += 5; // Budget stayed within bounds

    // Bias Detection scoring
    let biasScore = 0;
    if (biasNotes.length >= 100) biasScore += 10;
    else if (biasNotes.length >= 50) biasScore += 5;
    // Check if they mention specific gaps
    const mentionsGap = /african|halal|kosher|western|bias|gap|underrepresent|diverse/i.test(biasNotes);
    if (mentionsGap) biasScore += 10;
    else biasScore += 3;

    // Cleaning scoring
    let cleanScore = 0;
    const decisions = Object.values(cleaningDecisions);
    const correctFlags = decisions.filter(d => d.isCorrect && d.correctAnswer !== "none").length;
    const correctKeeps = decisions.filter(d => d.isCorrect && d.correctAnswer === "none").length;
    const totalDecisions = decisions.length;
    const accuracy = totalDecisions > 0 ? (decisions.filter(d => d.isCorrect).length / totalDecisions) : 0;

    cleanScore += Math.round(correctFlags / Math.max(decisions.filter(d => d.correctAnswer !== "none").length, 1) * 10);
    cleanScore += Math.round(correctKeeps / Math.max(decisions.filter(d => d.correctAnswer === "none").length, 1) * 5);
    cleanScore += Math.round(accuracy * 10);

    // Testing scoring
    let testScore = 0;
    const reflectionValues = Object.values(reflections).filter(r => r && r.trim().length > 20);
    testScore += Math.min(10, testResults.length * 2.5);
    testScore += Math.min(10, reflectionValues.length * 3.3);
    const mentionsConnection = reflectionValues.some(r => /data|source|curat|bias|train|gap/i.test(r));
    if (mentionsConnection) testScore += 5;

    return {
      source: Math.min(sourceScore, 30),
      bias: Math.min(biasScore, 20),
      cleaning: Math.min(cleanScore, 25),
      testing: Math.min(testScore, 25),
      total: Math.min(sourceScore + biasScore + cleanScore + testScore, 100),
      accuracy: Math.round(accuracy * 100),
      details: { hasDiverse, hasProblematic, diverseEnough, mentionsGap, correctFlags, correctKeeps, mentionsConnection }
    };
  }, [selectedSources, biasNotes, cleaningDecisions, testResults, reflections]);

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete();
  };

  return (
    <div className="stage stage-summary">
      <div className="stage-header">
        <h2>📊 Curation Summary</h2>
        <p>Review your data curation journey and see how your decisions shaped RecipeBot.</p>
      </div>

      {/* Score Overview */}
      <div className="score-overview">
        <div className="total-score">
          <div className="score-circle">
            <span className="score-number">{scores.total}</span>
            <span className="score-label">/ 100</span>
          </div>
          <p>Overall Curation Score</p>
        </div>

        <div className="score-breakdown">
          {[
            { label: "Source Selection", score: scores.source, max: 30, icon: "📂" },
            { label: "Bias Detection", score: scores.bias, max: 20, icon: "🔍" },
            { label: "Data Cleaning", score: scores.cleaning, max: 25, icon: "🧹" },
            { label: "Model Testing", score: scores.testing, max: 25, icon: "🤖" }
          ].map(item => (
            <div key={item.label} className="score-row">
              <span className="score-row-icon">{item.icon}</span>
              <span className="score-row-label">{item.label}</span>
              <div className="score-row-bar">
                <div 
                  className="score-row-fill" 
                  style={{ width: `${(item.score / item.max) * 100}%` }} 
                />
              </div>
              <span className="score-row-value">{item.score}/{item.max}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Summary */}
      <section className="summary-section">
        <h3>📂 Sources Selected ({selectedSources.length})</h3>
        <div className="selected-sources-list">
          {selectedSources.map(s => (
            <div key={s.id} className={`source-chip ${s.category}`}>
              <span>{s.icon}</span>
              <span>{s.name}</span>
              <span className="chip-cost">{s.cost} credits</span>
            </div>
          ))}
        </div>
        <p className="budget-summary">Budget: {budgetUsed}/100 credits used</p>

        {scores.details.hasProblematic && (
          <div className="summary-callout warning">
            ⚠️ You included problematic sources. In a real scenario, this could expose users to 
            misinformation, advertisements, or harmful content.
          </div>
        )}
        {scores.details.hasDiverse && (
          <div className="summary-callout success">
            ✅ You included specialized/diverse sources, helping RecipeBot serve a wider range of users.
          </div>
        )}
      </section>

      <section className="summary-section">
        <h3>🧹 Cleaning Results</h3>
        <p>You correctly identified <strong>{scores.details.correctFlags}</strong> problematic entries 
        and correctly kept <strong>{scores.details.correctKeeps}</strong> clean entries 
        with an overall accuracy of <strong>{scores.accuracy}%</strong>.</p>
      </section>

      <section className="summary-section">
        <h3>🤖 Model Testing</h3>
        <p>You tested RecipeBot with <strong>{testResults.length}</strong> prompts and wrote 
        <strong> {Object.values(reflections).filter(r => r && r.trim().length > 20).length}</strong> reflections.</p>
      </section>

      {/* Key Takeaways */}
      <section className="summary-section takeaways">
        <h3>💡 Key Takeaways</h3>
        <div className="takeaway-cards">
          <div className="takeaway">
            <h4>Data shapes behavior</h4>
            <p>Every source you included (or excluded) directly affected how RecipeBot responds. 
            AI models can only know what they've been trained on.</p>
          </div>
          <div className="takeaway">
            <h4>Bias is inevitable — but manageable</h4>
            <p>No dataset is perfectly balanced. The key is being aware of biases and making 
            deliberate choices to mitigate them.</p>
          </div>
          <div className="takeaway">
            <h4>Quality control is critical</h4>
            <p>Toxic content, misinformation, and privacy violations can all end up in AI training 
            data if not carefully filtered.</p>
          </div>
          <div className="takeaway">
            <h4>Representation matters</h4>
            <p>If certain cuisines, dietary needs, or cultures are underrepresented in training data, 
            the AI will underserve those communities.</p>
          </div>
        </div>
      </section>

      {/* Final Reflection */}
      <section className="summary-section">
        <h3>✍️ Final Reflection</h3>
        <p>What was the most important thing you learned about data curation? 
        How might these lessons apply to other AI systems beyond RecipeBot?</p>
        <textarea
          className="reflection-textarea"
          placeholder="Write your final reflection..."
          value={finalReflection}
          onChange={e => setFinalReflection(e.target.value)}
          rows={6}
        />
      </section>

      {/* Submit */}
      <div className="stage-footer">
        {!submitted ? (
          <button className="complete-btn submit-btn" onClick={handleSubmit}>
            ✅ Submit Curation Report
          </button>
        ) : (
          <div className="submitted-confirmation">
            <span className="submitted-icon">🎉</span>
            <h3>Report Submitted!</h3>
            <p>Your teacher can now review your curation decisions and analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
