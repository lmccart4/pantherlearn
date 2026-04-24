// src/components/blocks/ImageGenBlock.jsx
// Student-facing AI image generation block.
// Calls the generateImage Cloud Function (dual API keys, rate limited).
// Students write prompts, iterate, and build a gallery.

import { useState, useRef, useCallback, useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const generateImageFn = httpsCallable(functions, "generateImage");
const getImageGenUsageFn = httpsCallable(functions, "getImageGenUsage");

const DEFAULT_CAP = 10;

const TIPS = [
  "Be specific about what you want — \"a golden retriever wearing a space helmet on Mars\" beats \"a dog in space\"",
  "Describe the style: photo, illustration, watercolor, pixel art, 3D render, oil painting",
  "Include lighting and mood: \"warm sunset lighting\", \"dramatic shadows\", \"soft foggy morning\"",
  "Mention the camera angle: \"bird's eye view\", \"close-up portrait\", \"wide landscape shot\"",
  "Add \"no text, no words, no letters\" if you don't want the AI to add garbled text",
  "Iterate! Your first prompt is a starting point — refine based on what comes back",
];

export default function ImageGenBlock({ block, studentData = {}, onAnswer }) {
  const cap = typeof block?.cap === "number" && block.cap > 0 ? Math.floor(block.cap) : DEFAULT_CAP;
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [serverUsed, setServerUsed] = useState(0); // lifetime count from server
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);
  const promptRef = useRef(null);

  // Hydrate lifetime usage from server on mount
  useEffect(() => {
    if (!block?.id) return;
    let cancelled = false;
    getImageGenUsageFn({ blockId: block.id, cap })
      .then((res) => {
        if (cancelled) return;
        const used = Math.max(0, Number(res?.data?.used) || 0);
        setServerUsed(used);
      })
      .catch(() => { /* fail open — server will still enforce on generate */ });
    return () => { cancelled = true; };
  }, [block?.id, cap]);

  const totalUsed = serverUsed + images.length; // server count + newly generated this session
  const remaining = Math.max(0, cap - totalUsed);

  const generate = useCallback(async () => {
    if (!prompt.trim() || prompt.trim().length < 3) {
      setError("Write a more detailed prompt (at least 3 characters).");
      return;
    }
    if (remaining <= 0) {
      setError(`You've used all ${cap} image generations for this activity.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await generateImageFn({ prompt: prompt.trim(), blockId: block?.id, cap });
      const newImage = {
        id: Date.now(),
        prompt: prompt.trim(),
        data: result.data.image,
        mimeType: result.data.mimeType,
        text: result.data.text,
      };
      const updated = [...images, newImage];
      setImages(updated);
      setTipIndex((tipIndex + 1) % TIPS.length);

      // Participation grading: any generation = full credit (1/1), doesn't matter how many.
      if (onAnswer) {
        const totalDone = serverUsed + updated.length;
        onAnswer(block.id, {
          submitted: true,
          response: `${totalDone} image(s) generated`,
          writtenScore: 1,
          score: 1,
          maxScore: 1,
          completedAt: new Date().toISOString(),
          gradedBy: "auto",
          writtenLabel: "Completed",
        });
      }
    } catch (err) {
      const msg = err.message || "Generation failed";
      if (msg.includes("all ") && msg.includes("image generations")) {
        setError(msg.replace("Firebase: ", ""));
      } else if (msg.includes("Rate limit")) {
        setError("Slow down! Max 10 images per minute. Wait a moment and try again.");
      } else if (msg.includes("Session limit")) {
        setError("You've hit the hourly limit (30 images). Take a break and try again later.");
      } else if (msg.includes("No image generated")) {
        setError("The AI couldn't generate an image for that prompt. Try being more descriptive or changing the subject.");
      } else {
        setError(msg.replace("Firebase: ", ""));
      }
    } finally {
      setLoading(false);
    }
  }, [prompt, images, block.id, onAnswer, tipIndex, remaining, cap, serverUsed]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      generate();
    }
  };

  const refineFrom = (img) => {
    setPrompt(img.prompt);
    setSelectedImage(null);
    promptRef.current?.focus();
  };

  return (
    <div style={{
      background: "var(--surface, #1B2838)",
      borderRadius: 12,
      padding: 24,
      margin: "16px 0",
    }}>
      {/* Prompt Tip */}
      <div style={{
        background: "rgba(2, 195, 154, 0.08)",
        border: "1px solid rgba(2, 195, 154, 0.2)",
        borderRadius: 8,
        padding: "12px 16px",
        marginBottom: 16,
        fontSize: 13,
        color: "var(--text-muted, #94a3b8)",
        lineHeight: 1.5,
      }}>
        <strong style={{ color: "var(--accent, #02C39A)" }}>Prompt tip:</strong>{" "}
        {TIPS[tipIndex]}
      </div>

      {/* Prompt Input */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <textarea
          ref={promptRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you want to create..."
          maxLength={500}
          rows={2}
          disabled={loading}
          style={{
            flex: 1,
            background: "var(--bg, #0D1B2A)",
            color: "var(--text, #E8F4F0)",
            border: "1px solid var(--border, #2a3a4a)",
            borderRadius: 8,
            padding: "12px 14px",
            fontSize: 14,
            fontFamily: "inherit",
            resize: "vertical",
            minHeight: 48,
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => e.target.style.borderColor = "var(--accent, #02C39A)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border, #2a3a4a)"}
        />
        <button
          onClick={generate}
          disabled={loading || !prompt.trim() || remaining <= 0}
          style={{
            background: loading ? "var(--border, #2a3a4a)" : "var(--accent, #02C39A)",
            color: loading ? "var(--text-muted, #94a3b8)" : "#0D1B2A",
            border: "none",
            borderRadius: 8,
            padding: "12px 20px",
            fontWeight: 700,
            fontSize: 14,
            cursor: loading ? "wait" : (remaining <= 0 ? "not-allowed" : "pointer"),
            whiteSpace: "nowrap",
            alignSelf: "flex-end",
            minHeight: 48,
            transition: "all 0.15s",
            opacity: (!prompt.trim() || remaining <= 0) ? 0.5 : 1,
          }}
        >
          {loading ? "Generating..." : (remaining <= 0 ? "Cap reached" : "Generate")}
        </button>
      </div>

      {/* Character count */}
      <div style={{
        fontSize: 11,
        color: "var(--text-muted, #94a3b8)",
        textAlign: "right",
        marginTop: -12,
        marginBottom: 12,
      }}>
        {prompt.length}/500 · {totalUsed}/{cap} images · {remaining} left
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 16,
          fontSize: 13,
          color: "#f87171",
        }}>
          {error}
        </div>
      )}

      {/* Gallery */}
      {images.length > 0 && (
        <div>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-muted, #94a3b8)",
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            Your Gallery ({images.length})
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12,
          }}>
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "2px solid transparent",
                  transition: "border-color 0.15s, transform 0.15s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent, #02C39A)";
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <img
                  src={`data:${img.mimeType};base64,${img.data}`}
                  alt={img.prompt}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  padding: "20px 8px 6px",
                  fontSize: 11,
                  color: "#ccc",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {img.prompt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            cursor: "pointer",
          }}
        >
          <img
            src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`}
            alt={selectedImage.prompt}
            style={{
              maxWidth: "90%",
              maxHeight: "70vh",
              borderRadius: 12,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <div style={{
            color: "#ccc",
            fontSize: 14,
            marginTop: 16,
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.5,
          }}>
            <strong style={{ color: "var(--accent, #02C39A)" }}>Prompt:</strong> {selectedImage.prompt}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              onClick={(e) => { e.stopPropagation(); refineFrom(selectedImage); }}
              style={{
                background: "var(--accent, #02C39A)",
                color: "#0D1B2A",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Refine This Prompt
            </button>
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#ccc",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
