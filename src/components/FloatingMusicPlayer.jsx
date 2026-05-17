// src/components/FloatingMusicPlayer.jsx
// Floating background music player — persists across all pages.
// Tracks live in top-level `playlists` collection, scoped to N courses via courseIds[].
// Supports both YouTube URLs (iframe embed) and direct audio file URLs (HTML5 audio).
// Teachers manage playlists via the gear icon.

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

const VOLUME_KEY = "pantherlearn:music:volume";
const LAST_PLAYLIST_KEY = (cid) => `pantherlearn:music:lastPlaylist:${cid}`;

// ─── YouTube IFrame API loader (idempotent) ───
let ytApiPromise = null;
function loadYouTubeAPI() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === "function") { try { prev(); } catch (e) { /* ignore */ } }
      resolve(window.YT);
    };
    if (!document.querySelector('script[data-yt-iframe-api]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      tag.setAttribute("data-yt-iframe-api", "1");
      document.head.appendChild(tag);
    }
    // Safety: in case the script already loaded but callback was missed
    const poll = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(poll);
        resolve(window.YT);
      }
    }, 100);
    setTimeout(() => clearInterval(poll), 10000);
  });
  return ytApiPromise;
}

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

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

function detectType(url) {
  if (!url) return "audio";
  return /youtube\.com|youtu\.be|music\.youtube\.com/i.test(url) ? "youtube" : "audio";
}

function isValidTrack(t) {
  if (!t || !t.url) return false;
  const type = t.type || detectType(t.url);
  if (type === "youtube") return !!extractVideoId(t.url);
  return /^https?:\/\//.test(t.url);
}

// ─── Lyrics Modal ───
function LyricsModal({ track, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!track) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 10000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
          maxWidth: 540, width: "100%", maxHeight: "85vh", overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}
      >
        <div style={{
          padding: "14px 18px", borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
              {track.label}
            </div>
            {track.artist && (
              <div style={{ fontSize: 12, color: "var(--text3)" }}>{track.artist}</div>
            )}
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border)",
            background: "var(--bg)", color: "var(--text3)", cursor: "pointer", fontSize: 14,
          }}>✕</button>
        </div>
        <div style={{
          padding: "18px 20px", overflowY: "auto", whiteSpace: "pre-wrap",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 13, lineHeight: 1.55, color: "var(--text)",
        }}>
          {track.lyrics || "No lyrics available for this track."}
        </div>
      </div>
    </div>
  );
}

// ─── Track editor row (admin) ───
function TrackEditor({ track, index, onChange, onRemove }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 6,
      padding: 8, border: "1px solid var(--border)", borderRadius: 8, marginBottom: 8,
    }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ color: "var(--text3)", fontSize: 12, minWidth: 18 }}>{index + 1}.</span>
        <input className="music-config-input" placeholder="Song name"
          value={track.label || ""} style={{ flex: "0 0 38%" }}
          onChange={(e) => onChange({ ...track, label: e.target.value })} />
        <input className="music-config-input" placeholder="YouTube URL or audio file URL..."
          value={track.url || ""} style={{ flex: 1 }}
          onChange={(e) => onChange({ ...track, url: e.target.value, type: detectType(e.target.value) })} />
        <button onClick={onRemove} style={{
          width: 26, height: 26, borderRadius: 6, border: "1px solid var(--border)",
          background: "var(--bg)", color: "var(--text3)", cursor: "pointer", fontSize: 12,
        }}>✕</button>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input className="music-config-input" placeholder="Cover URL (optional)"
          value={track.coverUrl || ""} style={{ flex: 1, fontSize: 12 }}
          onChange={(e) => onChange({ ...track, coverUrl: e.target.value })} />
        <input className="music-config-input" placeholder="Artist (optional)"
          value={track.artist || ""} style={{ flex: "0 0 30%", fontSize: 12 }}
          onChange={(e) => onChange({ ...track, artist: e.target.value })} />
      </div>
      <details>
        <summary style={{ fontSize: 11, color: "var(--text3)", cursor: "pointer", userSelect: "none" }}>
          Lyrics (optional)
        </summary>
        <textarea className="music-config-input" value={track.lyrics || ""}
          placeholder="[Verse 1]&#10;..."
          style={{ width: "100%", minHeight: 80, fontSize: 12, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", marginTop: 4 }}
          onChange={(e) => onChange({ ...track, lyrics: e.target.value })} />
      </details>
    </div>
  );
}

// ─── Playlist Editor (teacher) ───
function PlaylistEditor({ playlist, allCourses, onSave, onDelete, onClose }) {
  const [name, setName] = useState(playlist?.name || "");
  const [coverUrl, setCoverUrl] = useState(playlist?.coverUrl || "");
  const [courseIds, setCourseIds] = useState(playlist?.courseIds || []);
  const [tracks, setTracks] = useState(playlist?.tracks || []);
  const [saving, setSaving] = useState(false);

  const toggleCourse = (cid) => {
    setCourseIds((prev) => prev.includes(cid) ? prev.filter((x) => x !== cid) : [...prev, cid]);
  };

  const save = async () => {
    if (!name.trim() || courseIds.length === 0) {
      alert("Name and at least one course required.");
      return;
    }
    setSaving(true);
    const validTracks = tracks.filter((t) => t.url && t.url.trim()).map((t, i) => ({
      id: t.id || `track-${Date.now()}-${i}`,
      label: t.label || `Track ${i + 1}`,
      url: t.url.trim(),
      type: t.type || detectType(t.url),
      coverUrl: t.coverUrl || null,
      artist: t.artist || null,
      lyrics: t.lyrics || null,
    }));
    await onSave({
      name: name.trim(),
      coverUrl: coverUrl.trim() || null,
      courseIds,
      tracks: validTracks,
    });
    setSaving(false);
  };

  return (
    <div className="music-config-panel">
      <div className="music-config-header">
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
          🎵 {playlist?.id ? "Edit" : "New"} Playlist
        </span>
        <button onClick={onClose} className="music-config-close">✕</button>
      </div>
      <div className="music-config-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
        <label style={{ display: "block", fontSize: 11, color: "var(--text3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>Name</label>
        <input className="music-config-input" placeholder="Playlist name" value={name}
          style={{ width: "100%", marginBottom: 12 }}
          onChange={(e) => setName(e.target.value)} />

        <label style={{ display: "block", fontSize: 11, color: "var(--text3)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.3 }}>Cover URL (optional)</label>
        <input className="music-config-input" placeholder="https://..." value={coverUrl}
          style={{ width: "100%", marginBottom: 12 }}
          onChange={(e) => setCoverUrl(e.target.value)} />

        <label style={{ display: "block", fontSize: 11, color: "var(--text3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 }}>
          Visible in courses
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {allCourses.map((c) => (
            <button key={c.id} onClick={() => toggleCourse(c.id)} style={{
              padding: "5px 10px", fontSize: 12, borderRadius: 6,
              border: "1px solid var(--border)",
              background: courseIds.includes(c.id) ? "var(--purple)" : "var(--bg)",
              color: courseIds.includes(c.id) ? "var(--bg)" : "var(--text3)",
              cursor: "pointer", fontWeight: courseIds.includes(c.id) ? 600 : 400,
            }}>
              {c.icon || "📚"} {c.title}
            </button>
          ))}
        </div>

        <label style={{ display: "block", fontSize: 11, color: "var(--text3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 }}>
          Tracks ({tracks.length})
        </label>
        {tracks.map((t, i) => (
          <TrackEditor key={t.id || i} track={t} index={i}
            onChange={(nt) => { const c = [...tracks]; c[i] = nt; setTracks(c); }}
            onRemove={() => setTracks(tracks.filter((_, j) => j !== i))} />
        ))}
        <button onClick={() => setTracks([...tracks, { id: `track-${Date.now()}`, url: "", label: "" }])}
          style={{
            padding: "6px 14px", borderRadius: 7, border: "1.5px dashed var(--border)",
            background: "transparent", color: "var(--text3)", fontSize: 12, cursor: "pointer", marginBottom: 14,
          }}>+ Add track</button>

        <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center" }}>
          {playlist?.id ? (
            <button onClick={() => { if (confirm(`Delete playlist "${playlist.name}"?`)) onDelete(); }}
              style={{
                fontSize: 12, padding: "6px 12px", background: "transparent",
                border: "1px solid var(--border)", color: "var(--text3)",
                borderRadius: 6, cursor: "pointer",
              }}>Delete</button>
          ) : <span />}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: 13, padding: "8px 16px" }}>Cancel</button>
            <button onClick={save} disabled={saving} className="btn btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
              {saving ? "Saving..." : (playlist?.id ? "Save" : "Create")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Playlist Manager (teacher) ───
function PlaylistManager({ courseId, playlists, allCourses, onSaved, onClose }) {
  const [editing, setEditing] = useState(null);

  const handleSave = async (data) => {
    try {
      if (editing.id) {
        await setDoc(doc(db, "playlists", editing.id),
          { ...data, updatedAt: serverTimestamp() },
          { merge: true });
      } else {
        await addDoc(collection(db, "playlists"), {
          ...data, ownerUid: "teacher", order: 999,
          createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        });
      }
      setEditing(null);
      onSaved();
    } catch (e) {
      console.error("Save failed:", e);
      alert("Save failed. Check console.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "playlists", editing.id));
      setEditing(null);
      onSaved();
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Delete failed.");
    }
  };

  if (editing !== null) {
    return <PlaylistEditor playlist={editing} allCourses={allCourses}
      onSave={handleSave} onDelete={handleDelete}
      onClose={() => setEditing(null)} />;
  }

  return (
    <div className="music-config-panel">
      <div className="music-config-header">
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
          🎵 Manage Playlists
        </span>
        <button onClick={onClose} className="music-config-close">✕</button>
      </div>
      <div className="music-config-body">
        {playlists.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text3)", textAlign: "center", margin: "20px 0" }}>
            No playlists yet for this course.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
            {playlists.map((p) => (
              <button key={p.id} onClick={() => setEditing(p)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", border: "1px solid var(--border)",
                borderRadius: 8, background: "var(--bg)", color: "var(--text)",
                cursor: "pointer", textAlign: "left",
              }}>
                {p.coverUrl ? (
                  <img src={p.coverUrl} alt=""
                    style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: 36, height: 36, borderRadius: 6, background: "var(--surface2)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>🎵</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    {(p.tracks || []).length} tracks · {(p.courseIds || []).length} {(p.courseIds || []).length === 1 ? "course" : "courses"}
                  </div>
                </div>
                <span style={{ color: "var(--text3)", fontSize: 14 }}>›</span>
              </button>
            ))}
          </div>
        )}
        <button onClick={() => setEditing({ courseIds: courseId ? [courseId] : [], tracks: [] })}
          className="btn btn-primary" style={{ width: "100%", fontSize: 13, padding: "10px" }}>
          + New Playlist
        </button>
      </div>
    </div>
  );
}

// ─── Main Floating Player ───
export default function FloatingMusicPlayer() {
  const { user, userRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [showLyrics, setShowLyrics] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("off");
  const [courseId, setCourseId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [allCoursesForTeacher, setAllCoursesForTeacher] = useState([]);
  const [volume, setVolume] = useState(() => {
    if (typeof window === "undefined") return 0.7;
    const stored = parseFloat(localStorage.getItem(VOLUME_KEY));
    return Number.isFinite(stored) ? stored : 0.7;
  });
  const audioRef = useRef(null);
  const iframeRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const ytPollRef = useRef(null);
  const seekRafRef = useRef(0);
  const isSeekingRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch user's courses
  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      if (userRole === "teacher") {
        const snap = await getDocs(collection(db, "courses"));
        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => !c.hidden);
        setCourses(all);
        setAllCoursesForTeacher(all);
        if (all.length > 0 && !courseId) setCourseId(all[0].id);
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
        if (visible.length > 0 && !courseId) setCourseId(visible[0].id);
      }
    };
    fetchCourses();
  }, [user, userRole]);

  // Load playlists for current course
  const loadPlaylists = useCallback(async () => {
    if (!courseId) return;
    try {
      const q = query(collection(db, "playlists"), where("courseIds", "array-contains", courseId));
      const snap = await getDocs(q);
      let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) =>
        (a.order ?? 999) - (b.order ?? 999) ||
        (a.name || "").localeCompare(b.name || "")
      );
      setPlaylists(docs);
      const lastUsed = typeof window !== "undefined"
        ? localStorage.getItem(LAST_PLAYLIST_KEY(courseId))
        : null;
      const valid = docs.find((p) => p.id === lastUsed) || docs[0];
      setCurrentPlaylistId(valid?.id || null);
    } catch (err) {
      console.warn("Failed to load playlists:", err);
      setPlaylists([]);
      setCurrentPlaylistId(null);
    }
  }, [courseId]);

  useEffect(() => { loadPlaylists(); }, [loadPlaylists]);

  // Persist last-used playlist per course
  useEffect(() => {
    if (currentPlaylistId && courseId && typeof window !== "undefined") {
      localStorage.setItem(LAST_PLAYLIST_KEY(courseId), currentPlaylistId);
    }
  }, [currentPlaylistId, courseId]);

  // Reset track index when playlist changes
  useEffect(() => {
    setCurrentTrack(0);
    setIsPlaying(false);
  }, [currentPlaylistId]);

  // Volume persistence & apply to audio + YT
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(VOLUME_KEY, String(volume));
    if (audioRef.current) audioRef.current.volume = volume;
    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === "function") {
      try { ytPlayerRef.current.setVolume(Math.round(volume * 100)); } catch (e) { /* ignore */ }
    }
  }, [volume]);

  // Derived state
  const currentPlaylist = playlists.find((p) => p.id === currentPlaylistId);
  const allTracks = currentPlaylist?.tracks || [];
  const validTracks = allTracks.filter(isValidTrack);
  const track = validTracks[currentTrack] || validTracks[0];
  const trackType = track ? (track.type || detectType(track.url)) : null;
  const videoId = track && trackType === "youtube" ? extractVideoId(track.url) : null;
  const coverArt = track?.coverUrl || currentPlaylist?.coverUrl || null;

  // Reset scrub state when track changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [track?.url, trackType]);

  // Audio play/pause + src sync
  useEffect(() => {
    if (!audioRef.current || trackType !== "audio") return;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch((e) => console.warn("Audio play failed:", e));
    }
  }, [track?.url, trackType]);

  useEffect(() => {
    if (!audioRef.current || trackType !== "audio") return;
    if (isPlaying) {
      audioRef.current.play().catch((e) => console.warn("Audio play failed:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, trackType]);

  // ── YouTube IFrame API: init player on iframe mount; tear down on unmount/track switch
  useEffect(() => {
    if (trackType !== "youtube" || !videoId) return;
    let cancelled = false;
    let player = null;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !YT || !iframeRef.current) return;
      try {
        player = new YT.Player(iframeRef.current, {
          events: {
            onReady: (e) => {
              ytPlayerRef.current = e.target;
              try {
                e.target.setVolume(Math.round(volume * 100));
                const dur = e.target.getDuration();
                if (Number.isFinite(dur) && dur > 0) setDuration(dur);
              } catch (err) { /* ignore */ }
            },
            onStateChange: (e) => {
              // YT.PlayerState: ENDED=0, PLAYING=1, PAUSED=2, BUFFERING=3, CUED=5
              if (e.data === 0) handleAudioEnded(); // reuse end-of-track logic
              if (e.data === 1) {
                try {
                  const dur = e.target.getDuration();
                  if (Number.isFinite(dur) && dur > 0) setDuration(dur);
                } catch (err) { /* ignore */ }
              }
            },
          },
        });
      } catch (err) {
        console.warn("YT player init failed:", err);
      }
    });

    // Poll currentTime ~4 Hz while YT track is active
    ytPollRef.current = setInterval(() => {
      const p = ytPlayerRef.current;
      if (!p || isSeekingRef.current) return;
      try {
        if (typeof p.getCurrentTime === "function") {
          const t = p.getCurrentTime();
          if (Number.isFinite(t)) setCurrentTime(t);
        }
        if (!duration && typeof p.getDuration === "function") {
          const d = p.getDuration();
          if (Number.isFinite(d) && d > 0) setDuration(d);
        }
      } catch (err) { /* ignore */ }
    }, 250);

    return () => {
      cancelled = true;
      if (ytPollRef.current) { clearInterval(ytPollRef.current); ytPollRef.current = null; }
      const p = ytPlayerRef.current;
      ytPlayerRef.current = null;
      if (p && typeof p.destroy === "function") {
        try { p.destroy(); } catch (err) { /* ignore */ }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackType, videoId]);

  // Drive YT play/pause when isPlaying flips
  useEffect(() => {
    const p = ytPlayerRef.current;
    if (!p || trackType !== "youtube") return;
    try {
      if (isPlaying && typeof p.playVideo === "function") p.playVideo();
      else if (!isPlaying && typeof p.pauseVideo === "function") p.pauseVideo();
    } catch (err) { /* ignore */ }
  }, [isPlaying, trackType, videoId]);

  // ── Audio: timeupdate via rAF throttle + loadedmetadata
  useEffect(() => {
    if (trackType !== "audio") return;
    const el = audioRef.current;
    if (!el) return;
    const onLoaded = () => {
      if (Number.isFinite(el.duration)) setDuration(el.duration);
    };
    const onTime = () => {
      if (isSeekingRef.current) return;
      if (seekRafRef.current) return;
      seekRafRef.current = requestAnimationFrame(() => {
        seekRafRef.current = 0;
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime || 0);
      });
    };
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("durationchange", onLoaded);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("durationchange", onLoaded);
      if (seekRafRef.current) { cancelAnimationFrame(seekRafRef.current); seekRafRef.current = 0; }
    };
  }, [trackType, track?.url]);

  const handleSeek = (seconds) => {
    const target = Math.max(0, Math.min(seconds, duration || 0));
    setCurrentTime(target);
    if (trackType === "audio" && audioRef.current) {
      try { audioRef.current.currentTime = target; } catch (e) { /* ignore */ }
    } else if (trackType === "youtube" && ytPlayerRef.current) {
      try { ytPlayerRef.current.seekTo(target, true); } catch (e) { /* ignore */ }
    }
  };

  if (!user || !courseId) return null;
  if (playlists.length === 0 && userRole !== "teacher") return null;

  const pickNextIndex = (current, direction) => {
    if (validTracks.length <= 1) return current;
    if (shuffle) {
      let next;
      do { next = Math.floor(Math.random() * validTracks.length); }
      while (next === current && validTracks.length > 1);
      return next;
    }
    if (direction === 1) return (current + 1) % validTracks.length;
    return (current - 1 + validTracks.length) % validTracks.length;
  };

  const handlePlayPause = () => {
    if (!track) return;
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (validTracks.length <= 1 && repeatMode !== "one") return;
    if (repeatMode === "one") {
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

  const handleAudioEnded = () => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else if (validTracks.length > 1) {
      handleNext();
    } else if (repeatMode === "all") {
      setCurrentTrack(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const isTeacher = userRole === "teacher";

  return (
    <>
      {/* Audio element (kept mounted for HTML5 audio tracks, plays even when panel is closed) */}
      {trackType === "audio" && track && (
        <audio
          ref={audioRef}
          src={track.url}
          onEnded={handleAudioEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => { /* ignore — controlled */ }}
          preload="metadata"
        />
      )}

      {/* YouTube iframe (always mounted for current YT track so we can control + seek via IFrame API) */}
      {trackType === "youtube" && videoId && (
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&playsinline=1${repeatMode === "one" ? "&loop=1&playlist=" + videoId : ""}`}
          title={track?.label || "Music"}
          width="0" height="0"
          style={{ position: "absolute", top: -9999, left: -9999, border: "none", pointerEvents: "none" }}
          allow="autoplay; encrypted-media"
        />
      )}

      {/* Lyrics modal */}
      {showLyrics && <LyricsModal track={showLyrics} onClose={() => setShowLyrics(null)} />}

      {/* Minimized bar */}
      {minimized && isPlaying && !open && (
        <div className="floating-music-minibar">
          <span className="floating-music-note-pulse" style={{ fontSize: 14 }}>♪</span>
          <span className="fmm-track-name">{track?.label || "Now Playing"}</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {validTracks.length > 1 && (
              <button className="fmm-btn" onClick={handlePrev} title="Previous">⏮</button>
            )}
            <button className="fmm-btn" onClick={handlePlayPause} title="Pause">⏸</button>
            {validTracks.length > 1 && (
              <button className="fmm-btn" onClick={handleNext} title="Next">⏭</button>
            )}
          </div>
          <button className="fmm-btn"
            onClick={() => { setMinimized(false); setOpen(true); }}
            title="Expand" style={{ marginLeft: 2 }}>↗</button>
        </div>
      )}

      {/* Floating music button */}
      {!(minimized && isPlaying) && (
        <button
          onClick={() => {
            if (playlists.length === 0 && isTeacher) {
              setOpen(true);
              setShowManager(true);
            } else {
              setOpen(!open);
              setMinimized(false);
            }
          }}
          className="floating-music-btn"
          style={{ transform: open ? "scale(0.9)" : "scale(1)" }}
        >
          {open ? "✕" : (isPlaying ? "🎵" : "🎶")}
          {isPlaying && !open && <span className="floating-music-pulse" />}
        </button>
      )}

      {/* Music panel */}
      {open && (
        <div className="floating-music-panel">
          {/* Course selector — dropdown when many courses (teacher), pills when few (student) */}
          {courses.length > 1 && (
            courses.length > 4 ? (
              <div style={{
                padding: "8px 12px", borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.3 }}>Course</span>
                <select
                  value={courseId || ""}
                  onChange={(e) => { setCourseId(e.target.value); setShowManager(false); }}
                  style={{
                    flex: 1, padding: "5px 8px", borderRadius: 6,
                    border: "1px solid var(--border)", background: "var(--surface)",
                    color: "var(--text)", fontSize: 12, fontFamily: "inherit", cursor: "pointer",
                  }}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon || "📚"} {c.title}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="floating-music-courses">
                {courses.map((c) => (
                  <button key={c.id}
                    onClick={() => { setCourseId(c.id); setShowManager(false); }}
                    className={`floating-music-course-btn ${courseId === c.id ? "active" : ""}`}>
                    {c.icon || "📚"} {c.title}
                  </button>
                ))}
              </div>
            )
          )}

          {showManager && isTeacher ? (
            <PlaylistManager courseId={courseId} playlists={playlists}
              allCourses={allCoursesForTeacher}
              onSaved={loadPlaylists}
              onClose={() => setShowManager(false)} />
          ) : (
            <>
              {/* Playlist selector — dropdown when many, pills when few */}
              {playlists.length > 1 && (
                playlists.length > 4 ? (
                  <div style={{
                    padding: "8px 12px", borderBottom: "1px solid var(--border)",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.3 }}>Playlist</span>
                    <select
                      value={currentPlaylistId || ""}
                      onChange={(e) => setCurrentPlaylistId(e.target.value)}
                      style={{
                        flex: 1, padding: "5px 8px", borderRadius: 6,
                        border: "1px solid var(--border)", background: "var(--surface)",
                        color: "var(--text)", fontSize: 12, fontFamily: "inherit", cursor: "pointer",
                      }}
                    >
                      {playlists.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div style={{
                    display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 12px",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    {playlists.map((p) => (
                      <button key={p.id}
                        onClick={() => setCurrentPlaylistId(p.id)}
                        className={`floating-music-course-btn ${currentPlaylistId === p.id ? "active" : ""}`}
                        style={{ fontSize: 11 }}>
                        {p.name}
                      </button>
                    ))}
                  </div>
                )
              )}

              {/* Header */}
              <div className="floating-music-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                  <span style={{ fontSize: 22 }}>🎧</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>
                      {currentPlaylist?.name || "Background Music"}
                    </div>
                    {track && isPlaying && (
                      <div className="floating-music-now-playing">
                        <span className="floating-music-note-pulse">♪</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {track.label || "Now Playing"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {isPlaying && (
                    <button onClick={() => { setMinimized(true); setOpen(false); }}
                      title="Minimize — music keeps playing"
                      style={{
                        width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border)",
                        background: "var(--bg)", color: "var(--text3)", cursor: "pointer", fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>▾</button>
                  )}
                  {isTeacher && (
                    <button onClick={() => setShowManager(true)} title="Manage playlists"
                      style={{
                        width: 30, height: 30, borderRadius: 7, border: "1px solid var(--border)",
                        background: "var(--bg)", color: "var(--text3)", cursor: "pointer", fontSize: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>⚙️</button>
                  )}
                </div>
              </div>

              {playlists.length === 0 || validTracks.length === 0 ? (
                <div style={{ padding: "30px 20px", textAlign: "center", color: "var(--text3)", fontSize: 13 }}>
                  {isTeacher ? (
                    <>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🎵</div>
                      <p>{playlists.length === 0 ? "No playlists yet for this course." : "Selected playlist has no tracks."}</p>
                      <button onClick={() => setShowManager(true)} className="btn btn-primary"
                        style={{ marginTop: 12, fontSize: 13, padding: "8px 18px" }}>
                        {playlists.length === 0 ? "+ Create Playlist" : "+ Manage"}
                      </button>
                    </>
                  ) : (
                    <p>No music available for this course.</p>
                  )}
                </div>
              ) : (
                <>
                  {/* Cover art + now-playing */}
                  <div style={{ padding: "12px 16px 0", display: "flex", gap: 12, alignItems: "center" }}>
                    {coverArt ? (
                      <img src={coverArt} alt=""
                        style={{
                          width: 80, height: 80, borderRadius: 8, objectFit: "cover",
                          flexShrink: 0, border: "1px solid var(--border)",
                        }} />
                    ) : (
                      <div style={{
                        width: 80, height: 80, borderRadius: 8, background: "var(--surface2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontSize: 28,
                      }}>🎵</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 14, fontWeight: 600, color: "var(--text)",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {track?.label || "—"}
                      </div>
                      {track?.artist && (
                        <div style={{ fontSize: 12, color: "var(--text3)" }}>{track.artist}</div>
                      )}
                      {track?.lyrics && (
                        <button onClick={() => setShowLyrics(track)}
                          style={{
                            marginTop: 6, fontSize: 11, padding: "3px 8px",
                            border: "1px solid var(--border)", borderRadius: 6,
                            background: "var(--bg)", color: "var(--text3)", cursor: "pointer",
                          }}>
                          📝 Lyrics
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="floating-music-controls">
                    <button className={`fmc-btn fmc-mode${shuffle ? " fmc-active" : ""}`}
                      onClick={() => setShuffle(!shuffle)}
                      title={shuffle ? "Shuffle: On" : "Shuffle: Off"}>🔀</button>
                    {validTracks.length > 1 && (
                      <button className="fmc-btn" onClick={handlePrev} title="Previous">⏮</button>
                    )}
                    <button className="fmc-btn fmc-play"
                      onClick={handlePlayPause}
                      title={isPlaying ? "Pause" : "Play"}>
                      {isPlaying ? "⏸" : "▶️"}
                    </button>
                    {validTracks.length > 1 && (
                      <button className="fmc-btn" onClick={handleNext} title="Next">⏭</button>
                    )}
                    <button className={`fmc-btn fmc-mode${repeatMode !== "off" ? " fmc-active" : ""}`}
                      onClick={cycleRepeat}
                      title={repeatMode === "off" ? "Repeat: Off" : repeatMode === "one" ? "Repeat: One" : "Repeat: All"}>
                      {repeatMode === "one" ? "🔂" : "🔁"}
                    </button>
                  </div>

                  {/* Scrub / seek bar (audio + YouTube) */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "0 16px 8px", color: "var(--text3)", fontSize: 11,
                  }}>
                    <span style={{ minWidth: 32, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {formatTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={Math.min(currentTime, duration || 0)}
                      disabled={!duration}
                      onPointerDown={() => { isSeekingRef.current = true; }}
                      onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                      onPointerUp={(e) => {
                        isSeekingRef.current = false;
                        handleSeek(parseFloat(e.currentTarget.value));
                      }}
                      onKeyUp={(e) => {
                        handleSeek(parseFloat(e.currentTarget.value));
                      }}
                      style={{ flex: 1, accentColor: "var(--purple)", cursor: duration ? "pointer" : "not-allowed" }}
                      aria-label="Seek"
                    />
                    <span style={{ minWidth: 32, fontVariantNumeric: "tabular-nums" }}>
                      {formatTime(duration)}
                    </span>
                  </div>

                  {/* Volume slider */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "0 16px 10px", color: "var(--text3)", fontSize: 11,
                  }}>
                    <span>🔊</span>
                    <input type="range" min={0} max={1} step={0.01} value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      style={{ flex: 1, accentColor: "var(--purple)" }} />
                    <span style={{ minWidth: 26, textAlign: "right" }}>{Math.round(volume * 100)}</span>
                  </div>

                  {/* Track list */}
                  {validTracks.length > 1 && (
                    <div className="floating-music-tracklist">
                      {validTracks.map((t, i) => (
                        <div key={t.id || i}
                          className={`fmt-item ${i === currentTrack ? "active" : ""}`}
                          style={{ alignItems: "center" }}>
                          <button onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
                            style={{
                              display: "flex", alignItems: "center", gap: 8,
                              flex: 1, minWidth: 0,
                              background: "transparent", border: "none", color: "inherit",
                              cursor: "pointer", padding: 0, textAlign: "left",
                            }}>
                            <span className="fmt-num">{i + 1}</span>
                            <span className="fmt-label">{t.label || `Track ${i + 1}`}</span>
                            {i === currentTrack && isPlaying && (
                              <span className="floating-music-note-pulse" style={{ fontSize: 14 }}>♪</span>
                            )}
                          </button>
                          {t.lyrics && (
                            <button onClick={(e) => { e.stopPropagation(); setShowLyrics(t); }}
                              title="Show lyrics"
                              style={{
                                width: 24, height: 24, borderRadius: 5,
                                border: "1px solid transparent", background: "transparent",
                                color: "var(--text3)", cursor: "pointer", fontSize: 12,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginLeft: 4,
                              }}>📝</button>
                          )}
                        </div>
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
