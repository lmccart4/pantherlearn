import React, { useState } from "react";
import { queryRecipeBot } from "../firebase";
import { TEST_PROMPTS } from "../data/sources";

export default function StageFour({ selectedSources, cleaningDecisions, testResults, onUpdateResults, reflections, onUpdateReflections, onComplete }) {
  const [activePrompt, setActivePrompt] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);

  const sendPrompt = async (promptText, promptId, category, testsFor) => {
    setLoading(true);
    setError(null);
    setCurrentResponse(null);

    try {
      const result = await queryRecipeBot({
        prompt: promptText,
        selectedSources: selectedSources.map(s => ({
          id: s.id,
          name: s.name,
          category: s.category,
          cuisineBreakdown: s.cuisineBreakdown,
          dietaryTags: s.dietaryTags,
          biasNotes: s.biasNotes,
          risks: s.risks
        })),
        cleaningDecisions
      });

      const responseData = {
        promptId: promptId || `custom_${Date.now()}`,
        prompt: promptText,
        response: result.data.response,
        category: category || "Custom",
        testsFor: testsFor || "Custom test",
        timestamp: new Date().toISOString()
      };

      setCurrentResponse(responseData);

      // Save to results
      const newResults = [...testResults.filter(r => r.promptId !== responseData.promptId), responseData];
      onUpdateResults(newResults);
    } catch (err) {
      console.error("Error querying RecipeBot:", err);
      setError(err.message || "Failed to get response. Make sure the Cloud Function is deployed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReflection = (promptId, text) => {
    onUpdateReflections({ ...reflections, [promptId]: text });
  };

  const testedCount = testResults.length;
  const reflectionCount = Object.values(reflections).filter(r => r && r.trim().length > 20).length;
  const canComplete = testedCount >= 4 && reflectionCount >= 3;

  return (
    <div className="stage stage-four">
      <div className="stage-header">
        <h2>Stage 4: Model Testing</h2>
        <p>
          Your dataset has been "trained" into RecipeBot. Now test it! Send prompts and observe 
          how your data curation choices affect the model's responses. Look for biases, gaps, 
          and problems that trace back to your Stage 1-3 decisions.
        </p>
      </div>

      {/* Progress */}
      <div className="testing-progress">
        <span>Prompts tested: <strong>{testedCount}</strong> / {TEST_PROMPTS.length}+</span>
        <span>Reflections written: <strong>{reflectionCount}</strong> / 3 minimum</span>
      </div>

      {/* Preset Prompts */}
      <section className="prompt-section">
        <h3>📋 Test Prompts</h3>
        <p>Each prompt tests a different aspect of your model. Try at least 4.</p>
        <div className="prompt-grid">
          {TEST_PROMPTS.map(p => {
            const tested = testResults.find(r => r.promptId === p.id);
            return (
              <button
                key={p.id}
                className={`prompt-card ${tested ? "tested" : ""} ${activePrompt === p.id ? "active" : ""}`}
                onClick={() => {
                  setActivePrompt(p.id);
                  if (!tested) {
                    sendPrompt(p.text, p.id, p.category, p.testsFor);
                  } else {
                    setCurrentResponse(tested);
                  }
                }}
              >
                <span className="prompt-category">{p.category}</span>
                <span className="prompt-text">"{p.text}"</span>
                <span className="prompt-tests">Tests: {p.testsFor}</span>
                {tested && <span className="tested-badge">✅ Tested</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Custom Prompt */}
      <section className="prompt-section">
        <h3>✏️ Custom Prompt</h3>
        <div className="custom-prompt-area">
          <input
            type="text"
            placeholder="Type your own question for RecipeBot..."
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && customPrompt.trim()) {
                sendPrompt(customPrompt.trim());
                setActivePrompt("custom");
              }
            }}
          />
          <button
            className="send-btn"
            disabled={!customPrompt.trim() || loading}
            onClick={() => {
              sendPrompt(customPrompt.trim());
              setActivePrompt("custom");
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </section>

      {/* Response Display */}
      {(loading || currentResponse || error) && (
        <section className="response-section">
          <h3>🤖 RecipeBot Response</h3>
          
          {loading && (
            <div className="response-loading">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
              <p>RecipeBot is thinking...</p>
            </div>
          )}

          {error && (
            <div className="response-error">
              <p>❌ Error: {error}</p>
              <p className="error-hint">Make sure your Cloud Function is deployed and the Gemini API key is configured.</p>
            </div>
          )}

          {currentResponse && !loading && (
            <div className="response-card">
              <div className="response-prompt">
                <strong>You asked:</strong> "{currentResponse.prompt}"
              </div>
              <div className="response-body">
                {currentResponse.response}
              </div>
              <div className="response-meta">
                <span className="meta-category">{currentResponse.category}</span>
                <span className="meta-tests">Testing: {currentResponse.testsFor}</span>
              </div>

              {/* Reflection for this prompt */}
              <div className="reflection-area">
                <h4>🔍 Your Analysis</h4>
                <p>How does this response reflect your data curation choices? What biases or gaps do you see?</p>
                <textarea
                  placeholder="Analyze this response... How does it connect to your data choices in Stage 1?"
                  value={reflections[currentResponse.promptId] || ""}
                  onChange={e => handleReflection(currentResponse.promptId, e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
        </section>
      )}

      {/* Previous Results */}
      {testResults.length > 1 && (
        <section className="results-history">
          <h3>📜 All Test Results</h3>
          <div className="results-list">
            {testResults.map((result, i) => (
              <div 
                key={i} 
                className={`result-item ${activePrompt === result.promptId ? "active" : ""}`}
                onClick={() => {
                  setActivePrompt(result.promptId);
                  setCurrentResponse(result);
                }}
              >
                <span className="result-category">{result.category}</span>
                <span className="result-prompt">"{result.prompt.slice(0, 60)}..."</span>
                {reflections[result.promptId] && <span className="has-reflection">📝</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Complete */}
      <div className="stage-footer">
        {!canComplete && (
          <p className="requirement-warning">
            ⚠️ Test at least 4 prompts and write at least 3 reflections to continue
          </p>
        )}
        <button className="complete-btn" onClick={onComplete} disabled={!canComplete}>
          Continue to Summary →
        </button>
      </div>
    </div>
  );
}
