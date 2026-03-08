import { useEffect, useState } from 'react';

export default function FeedbackToast({ message, type, visible }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) setShow(true);
    else {
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!show && !visible) return null;

  const bg = type === 'correct'
    ? 'linear-gradient(135deg, #0a2e0a, #143d14)'
    : type === 'wrong'
    ? 'linear-gradient(135deg, #2e0a0a, #3d1414)'
    : 'linear-gradient(135deg, #0a1a2e, #142a3d)';

  const borderColor = type === 'correct' ? 'var(--accent)' : type === 'wrong' ? '#ff3333' : '#2288ff';
  const icon = type === 'correct' ? '✅' : type === 'wrong' ? '❌' : '⚗️';

  return (
    <div style={{
      position: 'fixed', top: 24, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '-20px'})`,
      padding: '12px 24px', borderRadius: 4,
      background: bg, border: `1px solid ${borderColor}`,
      color: 'var(--text-1)', fontSize: 14, fontWeight: 600,
      fontFamily: 'var(--font-body)',
      display: 'flex', alignItems: 'center', gap: 8,
      zIndex: 1000, boxShadow: `0 0 20px ${borderColor}33`,
      opacity: visible ? 1 : 0, transition: 'opacity 0.3s, transform 0.3s',
      maxWidth: '90vw', pointerEvents: 'none',
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      {message}
    </div>
  );
}
