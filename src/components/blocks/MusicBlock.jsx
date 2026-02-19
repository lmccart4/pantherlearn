// src/components/blocks/MusicBlock.jsx
// Background music player that embeds YouTube audio for students to listen while working.
// Renders as a compact, stylish mini-player (not a full video embed).

import { useState, useRef, useEffect } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";

/**
 * Extracts YouTube video ID from any YouTube URL format.
 */
function extractVideoId(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // music.youtube.com/watch?v=VIDEO_ID
  const musicMatch = trimmed.match(/music\.youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/);
  if (musicMatch) return musicMatch[1];

  // Bare video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  return null;
}

export default function MusicBlock({ block }) {
  const translatedTitle = useTranslatedText(block.title);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const iframeRef = useRef(null);

  // Build the list of tracks from block data
  const tracks = (block.tracks || []).filter((t) => extractVideoId(t.url));

  const [currentTrack, setCurrentTrack] = useState(0);

  // If no tracks configured, show placeholder
  if (tracks.length === 0) {
    return (
      <div className="music-block">
        <div className="music-header">
          <span className="music-icon">{block.icon || "🎵"}</span>
          <span className="music-title">{translatedTitle || "Background Music"}</span>
        </div>
        <div style={{ padding: 20, textAlign: "center", color: "var(--text3)", fontSize: 14 }}>
          No tracks configured yet.
        </div>
      </div>
    );
  }

  const track = tracks[currentTrack] || tracks[0];
  const videoId = extractVideoId(track.url);
  // Embed as small iframe — YouTube will handle playback
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${videoId}`;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  return (
    <div className={`music-block ${isMinimized ? "music-minimized" : ""}`}>
      {/* Header */}
      <div className="music-header" onClick={() => setIsMinimized(!isMinimized)}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <span className="music-icon">{block.icon || "🎵"}</span>
          <div>
            <span className="music-title">{translatedTitle || "Background Music"}</span>
            {track.label && (
              <div className="music-now-playing">
                {isPlaying && <span className="music-pulse">♪</span>}
                {track.label}
              </div>
            )}
          </div>
        </div>
        <button
          className="music-minimize-btn"
          onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
          title={isMinimized ? "Expand" : "Minimize"}
        >
          {isMinimized ? "▼" : "▲"}
        </button>
      </div>

      {/* Player body */}
      {!isMinimized && (
        <div className="music-body">
          {/* Hidden iframe for YouTube playback */}
          <div className="music-iframe-wrap">
            {isPlaying && (
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title={track.label || "Background Music"}
                width="100%"
                height="80"
                style={{ border: "none", borderRadius: 8 }}
                allow="autoplay; encrypted-media"
                allowFullScreen={false}
              />
            )}
            {!isPlaying && (
              <div className="music-placeholder">
                <span style={{ fontSize: 36 }}>🎧</span>
                <span style={{ fontSize: 14, color: "var(--text3)" }}>Press play to start</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="music-controls">
            {tracks.length > 1 && (
              <button className="music-ctrl-btn" onClick={handlePrev} title="Previous track">
                ⏮
              </button>
            )}
            <button className="music-ctrl-btn music-play-btn" onClick={handlePlayPause} title={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? "⏸" : "▶️"}
            </button>
            {tracks.length > 1 && (
              <button className="music-ctrl-btn" onClick={handleNext} title="Next track">
                ⏭
              </button>
            )}
          </div>

          {/* Track list */}
          {tracks.length > 1 && (
            <div className="music-tracklist">
              {tracks.map((t, i) => (
                <button
                  key={i}
                  className={`music-track-item ${i === currentTrack ? "active" : ""}`}
                  onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
                >
                  <span className="music-track-num">{i + 1}</span>
                  <span className="music-track-label">{t.label || `Track ${i + 1}`}</span>
                  {i === currentTrack && isPlaying && <span className="music-track-playing">♪</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
