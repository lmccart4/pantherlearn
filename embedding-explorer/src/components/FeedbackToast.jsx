import { useEffect, useState } from 'react';

export default function FeedbackToast({ message, type, visible }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      const t = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!show && !visible) return null;

  const bg =
    type === 'correct'
      ? 'linear-gradient(135deg, #059669, #10b981)'
      : type === 'wrong'
      ? 'linear-gradient(135deg, #dc2626, #ef4444)'
      : 'linear-gradient(135deg, #6366f1, #818cf8)';

  const icon = type === 'correct' ? '✅' : type === 'wrong' ? '❌' : '💡';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '20px'})`,
        padding: '12px 24px',
        borderRadius: 12,
        background: bg,
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        zIndex: 1000,
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s, transform 0.3s',
        maxWidth: '90vw',
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      {message}
    </div>
  );
}
