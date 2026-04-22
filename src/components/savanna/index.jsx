// src/components/savanna/index.jsx — Savanna Signal primitives
import { forwardRef, useEffect, useState } from 'react';
import './savanna.css';

const cx = (...parts) => parts.filter(Boolean).join(' ');

/* ── Kicker ── */
export function Kicker({ children, className, ...rest }) {
  return (
    <span className={cx('sv-kicker', className)} {...rest}>{children}</span>
  );
}

/* ── SectionHead ── */
export function SectionHead({ num, title, meta, className }) {
  return (
    <header className={cx('sv-sec-head', className)}>
      {num != null && <span className="sv-sec-num">{num}</span>}
      <h2 className="sv-sec-title">{title}</h2>
      {meta && <span className="sv-sec-meta">{meta}</span>}
    </header>
  );
}

/* ── Button ── */
export const Button = forwardRef(function Button(
  { as: As = 'button', variant = 'default', size = 'md', icon, iconRight, loading, disabled, className, children, ...rest },
  ref
) {
  const variantClass = {
    default: '',
    hero: 'sv-btn--hero',
    coral: 'sv-btn--coral',
    cobalt: 'sv-btn--cobalt',
    ghost: 'sv-btn--ghost',
    outline: 'sv-btn--outline',
    pixel: 'sv-btn--pixel',
  }[variant] || '';
  const sizeClass = { sm: 'sv-btn--sm', md: '', lg: 'sv-btn--lg', icon: 'sv-btn--icon' }[size] || '';
  const cls = cx('sv-btn', variantClass, sizeClass, loading && 'sv-btn--loading', className);
  return (
    <As ref={ref} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <span className="sv-btn-spinner" aria-hidden /> : icon}
      {children}
      {iconRight}
    </As>
  );
});

export function ButtonRow({ children, className }) {
  return <div className={cx('sv-btn-row', className)}>{children}</div>;
}

/* ── Chip ── */
export function Chip({ tone, dot, children, className, as: As = 'span', ...rest }) {
  const toneClass = tone ? `sv-chip--${tone}` : '';
  return (
    <As className={cx('sv-chip', toneClass, className)} {...rest}>
      {dot && <span className="sv-chip-dot" />}
      {children}
    </As>
  );
}

/* ── Card ── */
export function Card({ variant = 'standard', title, subtitle, children, className, ...rest }) {
  const variantClass = {
    standard: '',
    raised: 'sv-card--raised',
    dark: 'sv-card--dark',
    'signal-lime': 'sv-card--signal-lime',
    'signal-coral': 'sv-card--signal-coral',
    'signal-cobalt': 'sv-card--signal-cobalt',
  }[variant] || '';
  return (
    <div className={cx('sv-card', variantClass, className)} {...rest}>
      {title && <h3 className="sv-card-title">{title}</h3>}
      {subtitle && <p className="sv-card-sub">{subtitle}</p>}
      {children}
    </div>
  );
}

/* ── Ticket ── */
export function Ticket({
  stubNum,
  stubLabel,
  stubFoot,
  eyebrow,
  title,
  desc,
  foot,
  variant = 'standard',
  as: As = 'div',
  className,
  children,
  ...rest
}) {
  const variantClass = {
    standard: '',
    coral: 'sv-ticket--coral',
    dark: 'sv-ticket--dark',
  }[variant] || '';
  return (
    <As className={cx('sv-ticket', variantClass, className)} {...rest}>
      <div className="sv-ticket-stub">
        <div>
          {stubLabel && <div className="sv-ticket-stub-label">{stubLabel}</div>}
          {stubNum != null && <div className="sv-ticket-stub-num">{stubNum}</div>}
        </div>
        {stubFoot && <div className="sv-ticket-stub-foot">{stubFoot}</div>}
      </div>
      <div className="sv-ticket-body">
        {eyebrow && <div className="sv-ticket-eyebrow">{eyebrow}</div>}
        {title && <h3 className="sv-ticket-title">{title}</h3>}
        {desc && <p className="sv-ticket-desc">{desc}</p>}
        {children}
        {foot && <div className="sv-ticket-foot">{foot}</div>}
      </div>
    </As>
  );
}

/* ── Scoreboard ── */
export function Scoreboard({ big, label, delta, ticks, rightSlot, className }) {
  return (
    <div className={cx('sv-score', className)}>
      <div className="sv-score-col">
        {label && <span className="sv-score-label">{label}</span>}
        {big != null && <span className="sv-score-big">{big}</span>}
        {delta && <span className="sv-score-delta">{delta}</span>}
      </div>
      {ticks && (
        <div className="sv-score-ticks" role="img" aria-label={`${ticks.filter(t => t === 'on').length} of ${ticks.length}`}>
          {ticks.map((t, i) => (
            <span key={i} className={cx('sv-score-tick', t === 'on' && 'sv-score-tick--on', t === 'warm' && 'sv-score-tick--warm')} />
          ))}
        </div>
      )}
      {rightSlot}
    </div>
  );
}

/* ── Mana ── */
export function Mana({ count, tone = 'cobalt', className }) {
  const toneClass = { cobalt: '', hazard: 'sv-mana--hazard', coral: 'sv-mana--coral' }[tone] || '';
  return (
    <span className={cx('sv-mana', toneClass, className)}>
      <span className="sv-mana-gem" aria-hidden>◆</span>
      <span>{count} Mana</span>
    </span>
  );
}

/* ── ProgressBar ── */
export function ProgressBar({ value = 0, max = 1, variant = 'lime', size, label, className }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fillClass = {
    lime: '',
    coral: 'sv-progress-fill--coral',
    cobalt: 'sv-progress-fill--cobalt',
    striped: 'sv-progress-fill--striped',
  }[variant] || '';
  const sizeClass = size === 'sm' ? 'sv-progress--sm' : size === 'lg' ? 'sv-progress--lg' : '';
  return (
    <div
      className={cx('sv-progress', sizeClass, className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cx('sv-progress-fill', fillClass)} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ── ProgressDots ── */
export function ProgressDots({ total = 7, done = 0, activeIndex = -1, skips = [], className }) {
  return (
    <div className={cx('sv-dots', className)}>
      {Array.from({ length: total }).map((_, i) => {
        let cls = '';
        if (skips.includes(i)) cls = 'skip';
        else if (i === activeIndex) cls = 'active';
        else if (i < done) cls = 'done';
        return <span key={i} className={cls} />;
      })}
    </div>
  );
}

/* ── Trail ── */
export function Trail({ nodes = [], className }) {
  return (
    <div className={cx('sv-trail', className)}>
      {nodes.map((n, i) => (
        <span key={i} style={{ display: 'contents' }}>
          <a
            href={n.href || undefined}
            className={cx(
              'sv-trail-node',
              n.state === 'done' && 'sv-trail-node--done',
              n.state === 'now' && 'sv-trail-node--now',
              n.state === 'boss' && 'sv-trail-node--boss'
            )}
            aria-label={n.label || `Step ${i + 1}`}
            aria-current={n.state === 'now' ? 'step' : undefined}
          >
            {n.label}
          </a>
          {i < nodes.length - 1 && (
            <span className={cx('sv-trail-edge', n.edge === 'dashed' && 'sv-trail-edge--dashed')} />
          )}
        </span>
      ))}
    </div>
  );
}

/* ── Medal ── */
export function Medal({ value, color = 'hazard', size = 'md', label, className }) {
  const colorClass = color === 'lime' ? 'sv-medal--lime' : color === 'coral' ? 'sv-medal--coral' : '';
  const sizeClass = size === 'sm' ? 'sv-medal--sm' : '';
  return (
    <div className={cx('sv-medal', colorClass, sizeClass, className)} role="img" aria-label={label || String(value)}>
      {value}
    </div>
  );
}

/* ── Stamp ── */
export function Stamp({ text, tone, className }) {
  const toneClass = tone ? `sv-stamp--${tone}` : '';
  return (
    <span className={cx('sv-stamp', toneClass, className)} role="img" aria-label={text}>
      {text}
    </span>
  );
}

/* ── AvatarFrame — wraps pixel art ── */
export function AvatarFrame({ children, tone = 'lime', shape = 'sq', size, showPattern = true, className, ...rest }) {
  const toneClass = {
    lime: '',
    coral: 'sv-avatar-frame--coral',
    cobalt: 'sv-avatar-frame--cobalt',
    hazard: 'sv-avatar-frame--hazard',
    ink: 'sv-avatar-frame--ink',
    paper: 'sv-avatar-frame--paper',
  }[tone] || '';
  const shapeClass = shape === 'rnd' ? 'sv-avatar-frame--rnd' : '';
  const sizeClass = size === 'sm' ? 'sv-avatar-frame--sm' : size === 'lg' ? 'sv-avatar-frame--lg' : '';
  return (
    <span
      className={cx('sv-avatar-frame', toneClass, shapeClass, sizeClass, !showPattern && 'sv-avatar-frame--nopattern', className)}
      {...rest}
    >
      {children}
    </span>
  );
}

/* ── Callout ── */
export function Callout({ tone = 'info', title, icon, children, className }) {
  const toneClass = {
    info: 'sv-callout--info',
    warn: 'sv-callout--warn',
    danger: 'sv-callout--danger',
    success: 'sv-callout--success',
  }[tone] || '';
  const defaultIcon = { info: 'i', warn: '!', danger: '⚠', success: '◆' }[tone];
  return (
    <aside className={cx('sv-callout', toneClass, className)} role={tone === 'danger' ? 'alert' : 'note'}>
      <span className="sv-callout-tag" aria-hidden>{icon || defaultIcon}</span>
      <div>
        {title && <h4 className="sv-callout-title">{title}</h4>}
        <div className="sv-callout-body">{children}</div>
      </div>
    </aside>
  );
}

/* ── HazardBand ── */
export function HazardBand({ children, inner, variant = 'hazard', className, ...rest }) {
  const variantClass = variant === 'coral' ? 'sv-hazard-band--coral' : '';
  return (
    <div className={cx('sv-hazard-band', variantClass, className)} {...rest}>
      {inner && <span className="sv-hazard-band-inner">{inner}</span>}
      <span>{children}</span>
    </div>
  );
}

/* ── Toast (wraps HazardBand) ── */
export function Toast({ children, duration = 5000, onDismiss, variant = 'hazard' }) {
  useEffect(() => {
    if (!duration || !onDismiss) return;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [duration, onDismiss]);
  return <HazardBand variant={variant}>{children}</HazardBand>;
}

/* ── QuizCard ── */
export function QuizCard({ qNo, total, prompt, children, className }) {
  return (
    <div className={cx('sv-quiz', className)}>
      {qNo != null && (
        <div className="sv-quiz-qno">
          Question {qNo}{total ? ` of ${total}` : ''}
        </div>
      )}
      {prompt && <h3 className="sv-quiz-prompt">{prompt}</h3>}
      <div className="sv-choices">{children}</div>
    </div>
  );
}

/* ── Choice ── */
export function Choice({ letter, state, reveal, children, className, ...rest }) {
  const stateClass = {
    selected: 'sv-choice--selected',
    correct: 'sv-choice--correct',
    wrong: 'sv-choice--wrong',
  }[state] || '';
  return (
    <button type="button" className={cx('sv-choice', stateClass, className)} {...rest}>
      <span className="sv-choice-letter" aria-hidden>{letter}</span>
      <span>{children}</span>
      {reveal && <span className="sv-choice-reveal">{reveal}</span>}
    </button>
  );
}

/* ── Topnav ── */
export function Topnav({ brand, links, rightSlot, dark, className }) {
  return (
    <nav className={cx('sv-topnav', dark && 'sv-topnav--dark', className)}>
      {brand}
      {links && <div className="sv-topnav-links">{links}</div>}
      {rightSlot && <div className="sv-topnav-right">{rightSlot}</div>}
    </nav>
  );
}

export function TopnavBrand({ children, glyph, onClick, as: As = 'button' }) {
  return (
    <As className="sv-topnav-brand" onClick={onClick} type={As === 'button' ? 'button' : undefined}>
      {glyph && <span className="sv-topnav-glyph">{glyph}</span>}
      {children}
    </As>
  );
}

/* ── Field components ── */
export function Field({ label, error, children, className, htmlFor }) {
  return (
    <div className={cx('sv-field', className)}>
      {label && <label className="sv-field-label" htmlFor={htmlFor}>{label}</label>}
      {children}
      {error && <span className="sv-field-error">{error}</span>}
    </div>
  );
}
export const Input = forwardRef(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cx('sv-input', className)} {...rest} />;
});
export const Select = forwardRef(function Select({ className, children, ...rest }, ref) {
  return <select ref={ref} className={cx('sv-select', className)} {...rest}>{children}</select>;
});
export const Textarea = forwardRef(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cx('sv-textarea', className)} {...rest} />;
});

export function RadioRow({ options = [], value, onChange, name, className }) {
  return (
    <div className={cx('sv-radio-row', className)} role="radiogroup">
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const label = typeof opt === 'string' ? opt : opt.label;
        const on = value === val;
        return (
          <label key={val} className={cx('sv-radio', on && 'sv-radio--on')}>
            <input
              type="radio"
              name={name}
              value={val}
              checked={on}
              onChange={() => onChange?.(val)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            />
            <span className="sv-radio-bullet" />
            {label}
          </label>
        );
      })}
    </div>
  );
}

/* ── ImagePlaceholder ── */
export function ImagePlaceholder({ label = 'Image', ratio = '4/3', className, style }) {
  return (
    <div className={cx('sv-img-ph', className)} style={{ aspectRatio: ratio, ...style }}>
      <span className="sv-img-ph-tag">{label}</span>
    </div>
  );
}

/* ── Leaderboard ── */
export function Leaderboard({ rows = [], meIndex = -1, className }) {
  return (
    <div className={cx('sv-leader', className)}>
      {rows.map((row, i) => (
        <div key={i} className={cx('sv-leader-row', i === meIndex && 'sv-leader-row--me')}>
          <span className={cx('sv-leader-rank', i === 0 && 'sv-leader-rank--one')}>{row.rank ?? i + 1}</span>
          <div className="sv-leader-name">
            {row.avatar}
            <span>{row.name}</span>
            {row.meta && <small>{row.meta}</small>}
          </div>
          <span className="sv-leader-xp">{row.xp}</span>
          {row.dots && (
            <span className="sv-leader-dots" aria-hidden>
              {row.dots.map((on, j) => <span key={j} className={on ? 'on' : undefined} />)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Viz: BarSeries ── */
export function BarSeries({ data = [], max, ariaLabel, className }) {
  const m = max ?? Math.max(1, ...data.map(d => typeof d === 'number' ? d : d.value));
  return (
    <div className={cx('sv-bars', className)} role="img" aria-label={ariaLabel}>
      {data.map((d, i) => {
        const v = typeof d === 'number' ? d : d.value;
        const isLatest = i === data.length - 1;
        return <div key={i} style={{ height: `${(v / m) * 100}%` }} className={isLatest ? 'latest' : ''} />;
      })}
    </div>
  );
}

/* ── Viz: Sparkline ── */
export function Sparkline({ data = [], color = 'var(--status-danger)', className }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / Math.max(1, data.length - 1)) * 120;
    const y = 36 - ((v - min) / range) * 32;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const [lastX, lastY] = points.split(' ').pop().split(',');
  return (
    <svg viewBox="0 0 120 40" className={cx('sv-spark', className)} role="img" aria-label="trend">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" points={points} />
      <circle cx={lastX} cy={lastY} r="3" fill={color} stroke="var(--fg-default)" strokeWidth="1.5" />
    </svg>
  );
}

/* ── Viz: DotMatrix ── */
export function DotMatrix({ data = [], columns = 7, className }) {
  return (
    <div className={cx('sv-dotmatrix', className)} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {data.map((on, i) => <div key={i} className={on ? 'on' : undefined} />)}
    </div>
  );
}

/* ── Viz: StackedBar ── */
export function StackedBar({ segments = [], className }) {
  const total = segments.reduce((s, seg) => s + (seg.value || 0), 0) || 1;
  return (
    <div className={cx('sv-stackedbar', className)} role="img">
      {segments.map((seg, i) => (
        <div
          key={i}
          className={seg.tone}
          style={{ flex: `0 1 ${(seg.value / total) * 100}%` }}
          aria-label={seg.label}
        />
      ))}
    </div>
  );
}

/* ── Utility wrappers ── */
export function Shell({ children, className }) {
  return <main className={cx('shell', className)} id="main-content">{children}</main>;
}
export function Stack({ children, gap, className }) {
  const cls = gap === 'sm' ? 'sv-stack--sm' : gap === 'lg' ? 'sv-stack--lg' : '';
  return <div className={cx('sv-stack', cls, className)}>{children}</div>;
}
export function Row({ children, className }) {
  return <div className={cx('sv-row', className)}>{children}</div>;
}
export function Tape({ items = [], className }) {
  return (
    <div className={cx('sv-tape', className)}>
      {items.map((s, i) => <span key={i}>{s}</span>)}
    </div>
  );
}
