
/* ------------------------------------------------------------------ *
 *  Line icons (24x24, stroke = currentColor)
 * ------------------------------------------------------------------ */
const ICONS = {
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM6 11v1a6 6 0 0 0 12 0v-1M12 18v3M9 21h6',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  tag: 'M3 12V4h8l9 9-8 8-9-9zM8 8h.01',
  scale: 'M12 3v18M5 21h14M5 7h14M5 7l-3 7a3 3 0 0 0 6 0L5 7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM4 19a2 2 0 0 1 2-2h13',
  users: 'M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1a4 4 0 0 0-3-3.9M15.5 4.2a3.5 3.5 0 0 1 0 6.6',
  pin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  dollar: 'M12 3v18M16 7.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.8 2.7 4 3 4 1.3 4 3-1.8 3-4 3-4-1.3-4-3',
};

export function Icon({ name, className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={ICONS[name] || ICONS.globe} />
    </svg>
  );
}

/** Eight-pointed star divider used under headings. */
export function Ornament({ center = false, className = '' }) {
  return (
    <div className={`mt-4 flex items-center gap-3 text-gold-500 ${center ? 'justify-center' : ''} ${className}`} aria-hidden="true">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500" />
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 6h12v12H6z" />
        <path d="M12 1.5 22.5 12 12 22.5 1.5 12z" />
      </svg>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 *  Rotating hero background: four scenes cross-fade every few seconds.
 *  Pure SVG + CSS (no photos to download). Reduced-motion = first scene, still.
 * ------------------------------------------------------------------ */
