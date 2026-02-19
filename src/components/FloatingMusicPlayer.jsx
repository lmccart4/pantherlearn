// src/components/FloatingMusicPlayer.jsx
// Floating background music player — persists across all pages.
// Teachers configure playlists per-course in Firestore (courses/{id}/settings/music).
// Students see a floating mini-player in the bottom-left corner.

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Extracts YouTube video ID from any YouTube URL format.
 */
function extractVideoId(url) {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /music\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return m[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

// ─── Teacher Config Panel ───
function MusicConfig({ courseId, tracks, onSave, onClose }) {
  const [editTracks, setEditTracks] = useState(tracks.length > 0 ? tracks : [{ url: "", label: "" }]);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const validTracks = editTracks.filter((t) => t.url.trim());
    await onSave(validTracks);
    setSaving(false);
  };

  return (
    <div className="music-config-panel">
      <div className="music-config-header">
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
          🎵 Configure Music
        </span>
        <button onClick={onClose} className="music-config-close">✕</button>
      </div>

      <div className="music-config-body">
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>
          Add YouTube or YouTube Music URLs. Students will see a floating music player on all pages.
        </p>

        {editTracks.map((track, i) => (
          <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
            <span style={{ color: "var(--text3)", fontSize: 12, minWidth: 18 }}>{i + 1}.</span>
            <input
              className="music-config-input"
              placeholder="Song name"
              value={track.label}
              style={{ flex: "0 0 35%" }}
              onChange={(e) => {
                const t = [...editTracks];
                t[i] = { ...t[i], label: e.target.value };
                setEditTracks(t);
              }}
            />
            <input
              className="music-config-input"
              placeholder="YouTube URL..."
              value={track.url}
              style={{ flex: 1 }}
              onChange={(e) => {
                const t = [...editTracks];
                t[i] = { ...t[i], url: e.target.value };
                setEditTracks(t);
              }}
            />
            <button
              onClick={() => setEditTracks(editTracks.filter((_, j) => j !== i))}
              style={{
                width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border)",
                background: "var(--bg)", color: "var(--text3)", cursor: "pointer", fontSize: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
          </div>
        ))}

        <button
          onClick={() => setEditTracks([...editTracks, { url: "", label: "" }])}
          style={{
            padding: "6px 14px", borderRadius: 7, border: "1.5px dashed var(--border)",
            background: "transparent", color: "var(--text3)", fontSize: 12, cursor: "pointer",
            marginBottom: 14, transition: "all 0.2s",
          }}
        >
          + Add track
        </button>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: 13, padding: "8px 16px" }}>
            Cancel
          </button>
          <button onClick={save} disabled={saving} className="btn btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
            {saving ? "Saving..." : "Save Playlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Floating Player ───
export default function FloatingMusicPlayer() {
  const { user, userRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false); // minimized = slim bar, music keeps playing
  const [showConfig, setShowConfig] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off"); // "off" → "one" → "all"
  const [courseId, setCourseId] = useState(null);
  const [courses, setCourses] = useState([]);
  const iframeRef = useRef(null);

  // Fetch user's courses (same pattern as ClassChat)
  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      if (userRole === "teacher") {
        const snap = await getDocs(collection(db, "courses"));
        const allCourses = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => !c.hidden);
        setCourses(allCourses);
        if (allCourses.length > 0) setCourseId(allCourses[0].id);
      } else {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const ec = userDoc.exists() ? userDoc.data().enrolledCourses : null;
        let enrolledIds = new Set();

        if (ec && typeof ec === "object" && !Array.isArray(ec)) {
          Object.entries(ec).forEach(([key, value]) => {
            if (value === true && isNaN(key)) enrolledIds.add(key);
            else if (typeof value === "string" && value) enrolledIds.add(value);
          });
        } else if (Array.isArray(ec)) {
          enrolledIds = new Set(ec);
        }

        if (enrolledIds.size === 0) {
          const enrollSnap = await getDocs(
            query(collection(db, "enrollments"), where("email", "==", user.email?.toLowerCase()))
          );
          enrollSnap.forEach((d) => enrolledIds.add(d.data().courseId));
        }

        const enrolled = [];
        for (const cid of enrolledIds) {
          try {
            const courseDoc = await getDoc(doc(db, "courses", cid));
            if (courseDoc.exists()) enrolled.push({ id: courseDoc.id, ...courseDoc.data() });
          } catch (e) { /* ignore */ }
        }
        const visible = enrolled.filter((c) => !c.hidden);
        setCourses(visible);
        if (visible.length > 0) setCourseId(visible[0].id);
      }
    };
    fetchCourses();
  }, [user, userRole]);

  // Load playlist when course changes
  useEffect(() => {
    if (!courseId) return;
    const loadTracks = async () => {
      try {
        const musicDoc = await getDoc(doc(db, "courses", courseId, "settings", "music"));
        if (musicDoc.exists()) {
          const data = musicDoc.data();
          setTracks(data.tracks || []);
          setCurrentTrack(0);
          setIsPlaying(false);
        } else {
          setTracks([]);
        }
      } catch (err) {
        console.warn("Failed to load music settings:", err);
        setTracks([]);
      }
    };
    loadTracks();
  }, [courseId]);

  // Save playlist (teacher only)
  const saveTracks = useCallback(async (newTracks) => {
    if (!courseId) return;
    try {
      await setDoc(doc(db, "courses", courseId, "settings", "music"), {
        tracks: newTracks,
        updatedAt: new Date(),
      }, { merge: true });
      setTracks(newTracks);
      setCurrentTrack(0);
      setShowConfig(false);
    } catch (err) {
      console.error("Failed to save music:", err);
      alert("Failed to save. Check the console for details.");
    }
  }, [courseId]);

  if (!user || !courseId) return null;

  // Filter valid tracks
  const validTracks = tracks.filter((t) => extractVideoId(t.url));

  // Don't show the FAB if no tracks configured and user is a student
  if (validTracks.length === 0 && userRole !== "teacher") return null;

  const track = validTracks[currentTrack] || validTracks[0];
  const videoId = track ? extractVideoId(track.url) : null;

  const handlePlayPause = () => {
    if (!videoId) return;
    setIsPlaying(!isPlaying);
  };

  const pickNextIndex = (current, direction) => {
    if (validTracks.length <= 1) return current;
    if (shuffle) {
      let next;
      do { next = Math.floor(Math.random() * validTracks.length); } while (next === current && validTracks.length > 1);
      return next;
    }
    if (direction === 1) return (current + 1) % validTracks.length;
    return (current - 1 + validTracks.length) % validTracks.length;
  };

  const handleNext = () => {
    if (validTracks.length <= 1 && repeatMode !== "one") return;
    if (repeatMode === "one") {
      // Re-trigger same track by toggling play
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 50);
      return;
    }
    setCurrentTrack((prev) => pickNextIndex(prev, 1));
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (validTracks.length <= 1 && repeatMode !== "one") return;
    if (repeatMode === "one") {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 50);
      return;
    }
    setCurrentTrack((prev) => pickNextIndex(prev, -1));
    setIsPlaying(true);
  };

  const cycleRepeat = () => {
    setRepeatMode((prev) => prev === "off" ? "one" : prev === "one" ? "all" : "off");
  };

  return (
    <>
      {/* Hidden iframe — keeps music playing even when panel is closed/minimized */}
      {isPlaying && videoId && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1${repeatMode === "one" ? "&loop=1&playlist=" + videoId : ""}`}
          title={track?.label || "Music"}
          width="0"
          height="0"
          style={{ position: "absolute", top: -9999, left: -9999, border: "none", pointerEvents: "none" }}
          allow="autoplay; encrypted-media"
        />
      )}

      {/* Minimized bar — slim controls while music plays */}
      {minimized && isPlaying && !open && (
        <div className="floating-music-minibar">
          <span className="floating-music-note-pulse" style={{ fontSize: 14 }}>♪</span>
          <span className="fmm-track-name">
            {track?.label || "Now Playing"}
          </span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {validTracks.length > 1 && (
              <button className="fmm-btn" onClick={handlePrev} title="Previous">⏮</button>
            )}
            <button className="fmm-btn" onClick={handlePlayPause} title="Pause">⏸</button>
            {validTracks.length > 1 && (
              <button className="fmm-btn" onClick={handleNext} title="Next">⏭</button>
            )}
          </div>
          <button
            className="fmm-btn"
            onClick={() => { setMinimized(false); setOpen(true); }}
            title="Expand"
            style={{ marginLeft: 2 }}
          >↗</button>
        </div>
      )}

      {/* Floating music button — bottom left (hidden when minimized bar is showing) */}
      {!(minimized && isPlaying) && (
        <button
          onClick={() => {
            if (validTracks.length === 0 && userRole === "teacher") {
              setOpen(true);
              setShowConfig(true);
            } else {
              setOpen(!open);
              setMinimized(false);
            }
          }}
          className="floating-music-btn"
          style={{ transform: open ? "scale(0.9)" : "scale(1)" }}
        >
          {open ? "✕" : (isPlaying ? "🎵" : "🎶")}
          {isPlaying && !open && (
            <span className="floating-music-pulse" />
          )}
        </button>
      )}

      {/* Music panel */}
      {open && (
        <div className="floating-music-panel">
          {/* Course selector (if multiple courses) */}
          {courses.length > 1 && (
            <div className="floating-music-courses">
              {courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setCourseId(c.id); setShowConfig(false); }}
                  className={`floating-music-course-btn ${courseId === c.id ? "active" : ""}`}
                >
                  {c.icon || "📚"} {c.title}
                </button>
              ))}
            </div>
          )}

          {/* Config mode (teacher) */}
          {showConfig && userRole === "teacher" ? (
            <MusicConfig
              courseId={courseId}
              tracks={tracks}
              onSave={saveTracks}
              onClose={() => setShowConfig(false)}
            />
          ) : (
            <>
              {/* Header */}
              <div className="floating-music-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                  <span style={{ fontSize: 22 }}>🎧</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
                      Background Music
                    </div>
                    {track && isPlaying && (
                      <div className="floating-music-now-playing">
                        <span className="floating-music-note-pulse">♪</span>
                        <span style={{
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {track.label || "Now Playing"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {/* Minimize button — only visible when music is playing */}
                  {isPlaying && (
                    <button
                      onClick={() => { setMinimized(true); setOpen(false); }}
                      title="Minimize — music keeps playing"
                      style={{
                        width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border)",
                        background: "var(--bg)", color: "var(--text3)", cursor: "pointer", fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >▾</button>
                  )}
                  {userRole === "teacher" && (
                    <button
                      onClick={() => setShowConfig(true)}
                      title="Configure playlist"
                      style={{
                        width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border)",
                        background: "var(--bg)", color: "var(--text3)", cursor: "pointer", fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >⚙️</button>
                  )}
                </div>
              </div>

              {validTracks.length === 0 ? (
                <div style={{
                  padding: "30px 20px", textAlign: "center", color: "var(--text3)", fontSize: 13,
                }}>
                  {userRole === "teacher" ? (
                    <>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🎵</div>
                      <p>No tracks yet.</p>
                      <button
                        onClick={() => setShowConfig(true)}
                        className="btn btn-primary"
                        style={{ marginTop: 12, fontSize: 13, padding: "8px 18px" }}
                      >
                        + Add Music
                      </button>
                    </>
                  ) : (
                    <p>No music available for this course.</p>
                  )}
                </div>
              ) : (
                <>
                  {/* YouTube embed preview (visible in panel) */}
                  <div className="floating-music-embed">
                    {isPlaying && videoId ? (
                      <div style={{
                        height: 60, display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 8, color: "var(--purple)", fontSize: 13, fontWeight: 600,
                      }}>
                        <span className="floating-music-note-pulse" style={{ fontSize: 18 }}>♪</span>
                        Playing: {track?.label || "Track " + (currentTrack + 1)}
                      </div>
                    ) : (
                      <div style={{
                        height: 60, display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 6, color: "var(--text3)", fontSize: 13,
                      }}>
                        <span style={{ fontSize: 22 }}>🎧</span>
                        Press play to start
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="floating-music-controls">
                    <button
                      className={`fmc-btn fmc-mode${shuffle ? " fmc-active" : ""}`}
                      onClick={() => setShuffle(!shuffle)}
                      title={shuffle ? "Shuffle: On" : "Shuffle: Off"}
                    >🔀</button>
                    {validTracks.length > 1 && (
                      <button className="fmc-btn" onClick={handlePrev} title="Previous">⏮</button>
                    )}
                    <button
                      className="fmc-btn fmc-play"
                      onClick={handlePlayPause}
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? "⏸" : "▶️"}
                    </button>
                    {validTracks.length > 1 && (
                      <button className="fmc-btn" onClick={handleNext} title="Next">⏭</button>
                    )}
                    <button
                      className={`fmc-btn fmc-mode${repeatMode !== "off" ? " fmc-active" : ""}`}
                      onClick={cycleRepeat}
                      title={repeatMode === "off" ? "Repeat: Off" : repeatMode === "one" ? "Repeat: One" : "Repeat: All"}
                    >
                      {repeatMode === "one" ? "🔂" : "🔁"}
                    </button>
                  </div>

                  {/* Track list */}
                  {validTracks.length > 1 && (
                    <div className="floating-music-tracklist">
                      {validTracks.map((t, i) => (
                        <button
                          key={i}
                          className={`fmt-item ${i === currentTrack ? "active" : ""}`}
                          onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
                        >
                          <span className="fmt-num">{i + 1}</span>
                          <span className="fmt-label">{t.label || `Track ${i + 1}`}</span>
                          {i === currentTrack && isPlaying && (
                            <span className="floating-music-note-pulse" style={{ fontSize: 14 }}>♪</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
