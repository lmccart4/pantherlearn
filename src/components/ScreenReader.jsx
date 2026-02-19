// src/components/ScreenReader.jsx
// Floating text-to-speech widget — reads lesson content aloud using the
// browser's built-in Web Speech API (SpeechSynthesis).
// Only appears on lesson pages (same route-detection as AnnotationOverlay).

import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { extractLessonText } from "../lib/ttsTextExtractor";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/**
 * Chunk long text at sentence boundaries so Chrome doesn't cut off
 * SpeechSynthesis utterances prematurely (known bug for text >~200 chars).
 */
function chunkText(text, maxLen = 180) {
  if (text.length <= maxLen) return [text];

  const chunks = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }

    // Find the last sentence boundary within maxLen
    let cutAt = -1;
    for (const sep of [". ", "! ", "? ", "; ", ", ", " "]) {
      const idx = remaining.lastIndexOf(sep, maxLen);
      if (idx > 0) { cutAt = idx + sep.length; break; }
    }

    if (cutAt <= 0) cutAt = maxLen; // hard cut if no separator found

    chunks.push(remaining.slice(0, cutAt).trim());
    remaining = remaining.slice(cutAt).trim();
  }

  return chunks.filter(Boolean);
}

export default function ScreenReader() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const match = pathname.match(/^\/course\/([^/]+)\/lesson\/([^/]+)/);
  const courseId = match?.[1];
  const lessonId = match?.[2];

  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [currentBlockIdx, setCurrentBlockIdx] = useState(0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [speed, setSpeed] = useState(1);
  const [blocks, setBlocks] = useState([]); // { blockId, text }[]

  const synthRef = useRef(window.speechSynthesis);
  const blocksRef = useRef([]);
  const currentIdxRef = useRef(0);
  const speedRef = useRef(1);
  const voiceRef = useRef("");
  const chunkIdxRef = useRef(0);
  const currentChunksRef = useRef([]);
  const playingRef = useRef(false);

  // Keep refs in sync
  useEffect(() => { blocksRef.current = blocks; }, [blocks]);
  useEffect(() => { currentIdxRef.current = currentBlockIdx; }, [currentBlockIdx]);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { voiceRef.current = selectedVoice; }, [selectedVoice]);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  // ── Load voices ──
  useEffect(() => {
    const loadVoices = () => {
      const v = synthRef.current.getVoices();
      if (v.length > 0) {
        setVoices(v);
        // Default to first English voice
        const english = v.find((voice) => voice.lang.startsWith("en"));
        if (english && !selectedVoice) {
          setSelectedVoice(english.name);
          voiceRef.current = english.name;
        }
      }
    };

    loadVoices();
    synthRef.current.addEventListener?.("voiceschanged", loadVoices);
    return () => synthRef.current.removeEventListener?.("voiceschanged", loadVoices);
  }, []);

  // ── Load lesson blocks for text extraction ──
  useEffect(() => {
    if (!courseId || !lessonId) {
      setBlocks([]);
      stopPlayback();
      return;
    }

    (async () => {
      try {
        const ref = doc(db, "courses", courseId, "lessons", lessonId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const extracted = extractLessonText(data.blocks || []);
          setBlocks(extracted);
          blocksRef.current = extracted;
        } else {
          setBlocks([]);
        }
      } catch (e) {
        console.warn("ScreenReader: Failed to load lesson blocks:", e);
      }
    })();
  }, [courseId, lessonId]);

  // ── Stop on navigation ──
  useEffect(() => {
    return () => {
      synthRef.current.cancel();
      clearHighlight();
    };
  }, [pathname]);

  // ── Block highlighting ──
  const highlightBlock = useCallback((blockId) => {
    clearHighlight();
    if (!blockId) return;
    const el = document.querySelector(`[data-block-id="${blockId}"]`);
    if (el) {
      el.classList.add("tts-active-block");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const clearHighlight = useCallback(() => {
    document.querySelectorAll(".tts-active-block").forEach((el) => {
      el.classList.remove("tts-active-block");
    });
  }, []);

  // ── Speak a single block (handles chunking) ──
  const speakBlock = useCallback((idx) => {
    const synth = synthRef.current;
    synth.cancel();

    const block = blocksRef.current[idx];
    if (!block) {
      // Done — reached end
      setPlaying(false);
      setPaused(false);
      playingRef.current = false;
      clearHighlight();
      return;
    }

    setCurrentBlockIdx(idx);
    currentIdxRef.current = idx;
    highlightBlock(block.blockId);

    // Chunk the text for Chrome compatibility
    const chunks = chunkText(block.text);
    currentChunksRef.current = chunks;
    chunkIdxRef.current = 0;

    const speakNextChunk = () => {
      if (!playingRef.current) return;
      const ci = chunkIdxRef.current;
      if (ci >= currentChunksRef.current.length) {
        // Block done — advance to next
        const nextIdx = currentIdxRef.current + 1;
        if (nextIdx < blocksRef.current.length) {
          speakBlock(nextIdx);
        } else {
          // All done
          setPlaying(false);
          setPaused(false);
          playingRef.current = false;
          clearHighlight();
        }
        return;
      }

      const utterance = new SpeechSynthesisUtterance(currentChunksRef.current[ci]);
      utterance.rate = speedRef.current;

      // Set voice
      const v = synth.getVoices().find((voice) => voice.name === voiceRef.current);
      if (v) utterance.voice = v;

      utterance.onend = () => {
        chunkIdxRef.current = ci + 1;
        speakNextChunk();
      };

      utterance.onerror = (e) => {
        if (e.error === "canceled" || e.error === "interrupted") return;
        console.warn("TTS error:", e.error);
        // Try to advance anyway
        chunkIdxRef.current = ci + 1;
        speakNextChunk();
      };

      synth.speak(utterance);
    };

    speakNextChunk();
  }, [highlightBlock, clearHighlight]);

  // ── Playback controls ──
  const handlePlay = useCallback(() => {
    if (blocks.length === 0) return;

    // Dispatch event to pause music player
    window.dispatchEvent(new CustomEvent("tts-start"));

    if (paused) {
      // Resume
      synthRef.current.resume();
      setPaused(false);
      setPlaying(true);
      playingRef.current = true;
      return;
    }

    setPlaying(true);
    setPaused(false);
    playingRef.current = true;
    speakBlock(currentIdxRef.current);
  }, [blocks, paused, speakBlock]);

  const handlePause = useCallback(() => {
    synthRef.current.pause();
    setPaused(true);
    setPlaying(false);
    playingRef.current = false;
  }, []);

  const stopPlayback = useCallback(() => {
    synthRef.current.cancel();
    setPlaying(false);
    setPaused(false);
    playingRef.current = false;
    setCurrentBlockIdx(0);
    currentIdxRef.current = 0;
    clearHighlight();
  }, [clearHighlight]);

  const handleStop = useCallback(() => {
    stopPlayback();
  }, [stopPlayback]);

  const handlePrev = useCallback(() => {
    const prevIdx = Math.max(0, currentIdxRef.current - 1);
    if (playingRef.current || paused) {
      synthRef.current.cancel();
      setPaused(false);
      setPlaying(true);
      playingRef.current = true;
      speakBlock(prevIdx);
    } else {
      setCurrentBlockIdx(prevIdx);
      currentIdxRef.current = prevIdx;
      highlightBlock(blocksRef.current[prevIdx]?.blockId);
    }
  }, [paused, speakBlock, highlightBlock]);

  const handleNext = useCallback(() => {
    const nextIdx = Math.min(blocksRef.current.length - 1, currentIdxRef.current + 1);
    if (playingRef.current || paused) {
      synthRef.current.cancel();
      setPaused(false);
      setPlaying(true);
      playingRef.current = true;
      speakBlock(nextIdx);
    } else {
      setCurrentBlockIdx(nextIdx);
      currentIdxRef.current = nextIdx;
      highlightBlock(blocksRef.current[nextIdx]?.blockId);
    }
  }, [paused, speakBlock, highlightBlock]);

  const handleSpeedChange = useCallback((newSpeed) => {
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
    // If currently speaking, restart current block with new speed
    if (playingRef.current) {
      synthRef.current.cancel();
      speakBlock(currentIdxRef.current);
    }
  }, [speakBlock]);

  const handleVoiceChange = useCallback((voiceName) => {
    setSelectedVoice(voiceName);
    voiceRef.current = voiceName;
    // If currently speaking, restart current block with new voice
    if (playingRef.current) {
      synthRef.current.cancel();
      speakBlock(currentIdxRef.current);
    }
  }, [speakBlock]);

  // ── Close panel ──
  const handleClose = useCallback(() => {
    setOpen(false);
    if (playing || paused) {
      stopPlayback();
    }
  }, [playing, paused, stopPlayback]);

  // Don't render on non-lesson pages or if not logged in
  if (!user || !courseId || !lessonId) return null;

  // Curate to ~5 best English voices — prefer high-quality / natural ones
  const curatedVoices = (() => {
    const english = voices.filter((v) => v.lang.startsWith("en"));
    if (english.length === 0) return voices.slice(0, 5);

    // Preferred voice name fragments (order = priority). These cover the
    // most common high-quality voices across Chrome, Safari, Edge, Firefox.
    const preferred = [
      "samantha", "daniel", "karen", "google us english", "google uk english",
      "microsoft zira", "microsoft david", "microsoft mark",
      "alex", "allison", "ava", "tom", "susan",
    ];

    const picked = [];
    const usedNames = new Set();

    // First pass: pick preferred voices in priority order
    for (const pref of preferred) {
      if (picked.length >= 5) break;
      const match = english.find(
        (v) => v.name.toLowerCase().includes(pref) && !usedNames.has(v.name)
      );
      if (match) {
        picked.push(match);
        usedNames.add(match.name);
      }
    }

    // Fill remaining slots with any other English voices
    for (const v of english) {
      if (picked.length >= 5) break;
      if (!usedNames.has(v.name)) {
        picked.push(v);
        usedNames.add(v.name);
      }
    }

    return picked;
  })();

  return (
    <>
      {/* FAB — bottom-left, above music player */}
      <button
        className={`screen-reader-fab ${playing ? "active" : ""} ${paused ? "paused" : ""}`}
        onClick={() => setOpen(!open)}
        title={open ? "Close screen reader" : "Read this lesson aloud"}
      >
        {open ? "✕" : "🔊"}
        {playing && !open && <span className="screen-reader-pulse" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="screen-reader-panel">
          <div className="sr-header">
            <span style={{ fontSize: 18 }}>🔊</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
              Screen Reader
            </span>
          </div>

          {blocks.length === 0 ? (
            <div className="sr-empty">
              <p>No readable text found in this lesson.</p>
            </div>
          ) : (
            <>
              {/* Progress indicator */}
              <div className="sr-progress">
                Block {currentBlockIdx + 1} of {blocks.length}
                {playing && <span className="sr-speaking-dot" />}
                {paused && <span style={{ color: "var(--amber)", fontSize: 11, marginLeft: 6 }}>Paused</span>}
              </div>

              {/* Playback controls */}
              <div className="sr-controls">
                <button
                  className="sr-ctrl-btn"
                  onClick={handlePrev}
                  disabled={currentBlockIdx === 0 && !playing}
                  title="Previous block"
                >◄</button>

                {playing ? (
                  <button className="sr-ctrl-btn sr-play-btn" onClick={handlePause} title="Pause">
                    ⏸
                  </button>
                ) : (
                  <button className="sr-ctrl-btn sr-play-btn" onClick={handlePlay} title={paused ? "Resume" : "Play"}>
                    ▶
                  </button>
                )}

                <button
                  className="sr-ctrl-btn"
                  onClick={handleStop}
                  disabled={!playing && !paused}
                  title="Stop"
                >■</button>

                <button
                  className="sr-ctrl-btn"
                  onClick={handleNext}
                  disabled={currentBlockIdx >= blocks.length - 1 && !playing}
                  title="Next block"
                >►</button>
              </div>

              {/* Speed control */}
              <div className="sr-option-row">
                <label className="sr-label">Speed</label>
                <div className="sr-speed-btns">
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      className={`sr-speed-btn ${speed === s ? "active" : ""}`}
                      onClick={() => handleSpeedChange(s)}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice selector */}
              {curatedVoices.length > 0 && (
                <div className="sr-option-row">
                  <label className="sr-label">Voice</label>
                  <select
                    className="sr-voice-select"
                    value={selectedVoice}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                  >
                    {curatedVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
