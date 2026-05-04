// src/components/blocks/ImageGenBlock.jsx
// Student-facing AI image generation block.
// Calls the generateImage Cloud Function (dual API keys, rate limited).
// Students write prompts, iterate, and build a gallery.

import { useState, useRef, useCallback, useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import "./ImageGenBlock.css";

const functions = getFunctions();
const generateImageFn = httpsCallable(functions, "generateImage");
const getImageGenUsageFn = httpsCallable(functions, "getImageGenUsage");
const getSavedImageGenerationsFn = httpsCallable(functions, "getSavedImageGenerations");

const DEFAULT_CAP = 10;

function imgSrc(img) {
  return img.imageUrl || `data:${img.mimeType};base64,${img.data}`;
}

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
  const [serverUsed, setServerUsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);
  const promptRef = useRef(null);

  useEffect(() => {
    if (!block?.id) return;
    let cancelled = false;
    getImageGenUsageFn({ blockId: block.id, cap })
      .then((res) => {
        if (cancelled) return;
        const used = Math.max(0, Number(res?.data?.used) || 0);
        setServerUsed(used);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [block?.id, cap]);

  useEffect(() => {
    if (!block?.id || !block.persist) return;
    let cancelled = false;
    getSavedImageGenerationsFn({ blockId: block.id })
      .then((res) => {
        if (cancelled) return;
        const saved = Array.isArray(res?.data?.images) ? res.data.images : [];
        if (!saved.length) return;
        const hydrated = saved.map((s) => ({
          id: s.id,
          prompt: s.prompt,
          imageUrl: s.imageUrl,
          mimeType: s.mimeType,
          text: "",
        }));
        setImages(hydrated);
        setServerUsed((u) => Math.max(0, u - hydrated.length));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [block?.id, block?.persist]);

  const totalUsed = serverUsed + images.length;
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
      const result = await generateImageFn({
        prompt: prompt.trim(),
        blockId: block?.id,
        cap,
        persist: block?.persist === true,
      });
      const newImage = {
        id: result.data.savedId || Date.now(),
        prompt: prompt.trim(),
        data: result.data.image,
        mimeType: result.data.mimeType,
        text: result.data.text,
        imageUrl: result.data.savedUrl || null,
      };
      const updated = [...images, newImage];
      setImages(updated);
      setTipIndex((tipIndex + 1) % TIPS.length);

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
    <div className="ig-block">
      <div className="ig-tip">
        <strong>Prompt tip:</strong> {TIPS[tipIndex]}
      </div>

      <div className="ig-prompt-row">
        <textarea
          ref={promptRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you want to create..."
          maxLength={500}
          rows={2}
          disabled={loading}
          className="ig-prompt"
        />
        <button
          onClick={generate}
          disabled={loading || !prompt.trim() || remaining <= 0}
          className="ig-go"
        >
          {loading ? "Generating..." : (remaining <= 0 ? "Cap reached" : "Generate")}
        </button>
      </div>

      <div className="ig-counts">
        {prompt.length}/500 · {totalUsed}/{cap} images · {remaining} left
      </div>

      {error && <div className="ig-error">{error}</div>}

      {images.length > 0 && (
        <div>
          <div className="ig-gallery-label">Your Gallery ({images.length})</div>
          <div className="ig-gallery">
            {images.map((img) => (
              <div key={img.id} onClick={() => setSelectedImage(img)} className="ig-thumb">
                <img src={imgSrc(img)} alt={img.prompt} />
                <div className="ig-thumb-caption">{img.prompt}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} className="ig-lightbox">
          <img
            src={imgSrc(selectedImage)}
            alt={selectedImage.prompt}
            className="ig-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="ig-lightbox-caption">
            <strong>Prompt:</strong> {selectedImage.prompt}
          </div>
          <div className="ig-lightbox-actions">
            <button
              onClick={(e) => { e.stopPropagation(); refineFrom(selectedImage); }}
              className="ig-lightbox-primary"
            >
              Refine This Prompt
            </button>
            <button onClick={() => setSelectedImage(null)} className="ig-lightbox-secondary">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
