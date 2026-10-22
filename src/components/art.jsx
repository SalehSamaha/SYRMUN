import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../lib/i18n.jsx';

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
const GOLD = '#c9a24b';

function SceneStar() {
  // A huge eight-point-star lattice that slowly rotates.
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <pattern id="sy-star" width="120" height="120" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={GOLD} strokeOpacity="0.32" strokeWidth="1.2">
            <path d="M30 30h60v60H30z" />
            <path d="M60 17.6 102.4 60 60 102.4 17.6 60z" />
            <path d="M60 36l24 24-24 24-24-24z" strokeOpacity="0.18" />
          </g>
          <g fill={GOLD} fillOpacity="0.35">
            <circle cx="0" cy="0" r="2.2" />
            <circle cx="120" cy="0" r="2.2" />
            <circle cx="0" cy="120" r="2.2" />
            <circle cx="120" cy="120" r="2.2" />
          </g>
        </pattern>
        <radialGradient id="sy-star-fade" cx="62%" cy="42%" r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="sy-star-mask">
          <rect width="1600" height="900" fill="url(#sy-star-fade)" />
        </mask>
        <radialGradient id="sy-star-glow" cx="65%" cy="40%" r="45%">
          <stop offset="0" stopColor={GOLD} stopOpacity="0.28" />
          <stop offset="1" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sy-star-glow)" />
      <g mask="url(#sy-star-mask)">
        <g className="sy-spin-slow" style={{ transformOrigin: '1000px 380px' }}>
          <rect x="-1400" y="-1500" width="4800" height="4800" fill="url(#sy-star)" />
        </g>
      </g>
    </svg>
  );
}

function SceneGlobe() {
  const lat = [-60, -30, 0, 30, 60];
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <radialGradient id="sy-globe-glow" cx="68%" cy="48%" r="42%">
          <stop offset="0" stopColor="#3b61a0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#3b61a0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sy-globe-body" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#2c4c82" stopOpacity="0.55" />
          <stop offset="1" stopColor="#0a1426" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sy-globe-glow)" />
      <g transform="translate(1090 420)">
        <circle r="300" fill="url(#sy-globe-body)" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1.5" />
        {lat.map((d) => {
          const y = Math.sin((d * Math.PI) / 180) * 300;
          const rx = Math.cos((d * Math.PI) / 180) * 300;
          return <ellipse key={d} cx="0" cy={y} rx={rx} ry={rx * 0.12} fill="none" stroke={GOLD} strokeOpacity="0.28" />;
        })}
        {/* meridians "turn" by animating their width */}
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx="0" cy="0" rx="300" ry="300" fill="none" stroke={GOLD} strokeOpacity="0.3" className="sy-meridian" style={{ animationDelay: `${-i * 3}s` }} />
        ))}
        <g className="sy-spin-med">
          <ellipse rx="420" ry="120" fill="none" stroke="#fff" strokeOpacity="0.18" strokeDasharray="2 10" transform="rotate(-18)" />
          <circle cx="420" cy="0" r="6" fill={GOLD} transform="rotate(-18)" />
        </g>
        <g className="sy-spin-med" style={{ animationDirection: 'reverse', animationDuration: '90s' }}>
          <ellipse rx="480" ry="170" fill="none" stroke="#fff" strokeOpacity="0.12" strokeDasharray="2 12" transform="rotate(24)" />
          <circle cx="-480" cy="0" r="4" fill="#fff" fillOpacity="0.8" transform="rotate(24)" />
        </g>
      </g>
    </svg>
  );
}

function SceneSkyline() {
  const stars = Array.from({ length: 46 }, (_, i) => ({ x: (i * 197) % 1600, y: (i * 89) % 430 + 20, r: i % 5 === 0 ? 2 : 1.2, d: (i % 7) * 0.7 }));
  const minaret = (x, h) => (
    <g key={x} fill="#070e1c">
      <rect x={x - 9} y={640 - h} width="18" height={h} />
      <rect x={x - 14} y={640 - h + 40} width="28" height="8" />
      <path d={`M${x - 11} ${640 - h} L${x} ${640 - h - 70} L${x + 11} ${640 - h} Z`} />
    </g>
  );
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
      <defs>
        <linearGradient id="sy-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1426" stopOpacity="0" />
          <stop offset="0.5" stopColor="#2c4c82" stopOpacity="0.55" />
          <stop offset="0.85" stopColor="#d9b866" stopOpacity="0.75" />
          <stop offset="1" stopColor="#e6cf94" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="sy-horizon" cx="50%" cy="76%" r="40%">
          <stop offset="0" stopColor="#f6ecd0" stopOpacity="0.75" />
          <stop offset="1" stopColor="#f6ecd0" stopOpacity="0" />
        </radialGradient>
        <mask id="sy-moon">
          <rect width="1600" height="900" fill="#fff" />
          <circle cx="1304" cy="156" r="42" fill="#000" />
        </mask>
      </defs>
      <rect width="1600" height="900" fill="url(#sy-sky)" />
      <rect width="1600" height="900" fill="url(#sy-horizon)" className="sy-breathe" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" className="sy-twinkle" style={{ animationDelay: `${s.d}s` }} />
      ))}
      <circle cx="1280" cy="170" r="46" fill="#f6ecd0" fillOpacity="0.95" mask="url(#sy-moon)" />
      {/* skyline */}
      <g fill="#070e1c">
        <rect x="0" y="700" width="1600" height="200" />
        {/* far houses */}
        <path d="M0 700v-60h70v-25h50v25h60v-40h40v40h80v-30h60v30h90v60z" />
        <path d="M1130 700v-40h60v-30h40v30h70v-50h50v50h80v-26h90v26h80v40z" />
        {/* main mosque */}
        <rect x="560" y="560" width="480" height="140" />
        <path d="M640 560a160 160 0 0 1 320 0z" />
        <rect x="796" y="372" width="8" height="40" />
        <path d="M800 345a14 14 0 1 1-10 24 11 11 0 1 0 10-24z" fill={GOLD} />
        <path d="M580 560a52 52 0 0 1 104 0zM916 560a52 52 0 0 1 104 0z" />
        <path d="M520 700v-90a30 30 0 0 1 60 0v90zM1020 700v-90a30 30 0 0 1 60 0v90z" />
      </g>
      {minaret(520, 230)}
      {minaret(1080, 230)}
      <g fill={GOLD} fillOpacity="0.9">
        {[610, 660, 710, 760, 840, 890, 940, 990].map((x) => (
          <rect key={x} x={x} y="620" width="9" height="22" rx="4.5" className="sy-twinkle" style={{ animationDelay: `${(x % 5) * 0.6}s` }} />
        ))}
      </g>
    </svg>
  );
}

function SceneColonnade() {
  const cols = Array.from({ length: 12 }, (_, i) => 60 + i * 135);
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
      <defs>
        <linearGradient id="sy-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1426" stopOpacity="0" />
          <stop offset="0.45" stopColor="#223b66" stopOpacity="0.5" />
          <stop offset="0.8" stopColor="#d9b866" stopOpacity="0.8" />
          <stop offset="1" stopColor="#f6ecd0" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="sy-sun" cx="50%" cy="68%" r="38%">
          <stop offset="0" stopColor="#fff7df" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#e6cf94" stopOpacity="0.5" />
          <stop offset="1" stopColor="#e6cf94" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sy-dusk)" />
      <rect width="1600" height="900" fill="url(#sy-sun)" className="sy-breathe" />
      <g fill="#070e1c">
        {/* roof line + broken pediment */}
        <rect x="0" y="262" width="1600" height="22" />
        <rect x="0" y="284" width="1600" height="34" />
        <path d="M520 262 L800 168 L1080 262z" />
        {/* columns: tapered shafts, capitals and bases */}
        {cols.map((x) => (
          <g key={x}>
            <rect x={x - 30} y="318" width="60" height="16" />
            <path d={`M${x - 20} 334 H${x + 20} L${x + 15} 740 H${x - 15} Z`} />
            <rect x={x - 28} y="740" width="56" height="20" />
          </g>
        ))}
        {/* two columns have fallen: the gaps let the light through */}
        <rect x="0" y="760" width="1600" height="140" />
      </g>
      <g stroke="#f6ecd0" strokeOpacity="0.14" strokeWidth="1.5">
        {cols.flatMap((x) => [-7, 7].map((o) => <line key={`${x}${o}`} x1={x + o} y1="340" x2={x + o * 0.7} y2="736" />))}
      </g>
    </svg>
  );
}

const SCENES = [SceneStar, SceneGlobe, SceneSkyline, SceneColonnade];
const INTERVAL = 9000;

let startIndex = 0; // so the next page continues with the next scene

export function HeroBackground({ dots = false }) {
  const { t } = useI18n();
  const [i, setI] = useState(startIndex % SCENES.length);
  const [still, setStill] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const apply = () => setStill(Boolean(mq?.matches));
    apply();
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, []);

  useEffect(() => {
    if (still) return undefined;
    timer.current = window.setInterval(() => {
      setI((n) => {
        const next = (n + 1) % SCENES.length;
        startIndex = next;
        return next;
      });
    }, INTERVAL);
    return () => window.clearInterval(timer.current);
  }, [still]);

  const go = (n) => {
    startIndex = n;
    setI(n);
    window.clearInterval(timer.current);
    if (!still) {
      timer.current = window.setInterval(() => setI((c) => (startIndex = (c + 1) % SCENES.length)), INTERVAL);
    }
  };

  return (
    <>
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {SCENES.map((Scene, n) => (
          <div key={n} className={`sy-scene absolute inset-0 ${n === i ? 'is-active' : ''}`}>
            <div className="sy-kenburns h-full w-full">
              <Scene />
            </div>
          </div>
        ))}
        <div className="hero-scrim absolute inset-0" />
      </div>
      {dots && (
        <div className="absolute inset-x-0 bottom-4 z-20">
          <div className="container-x flex gap-2">
            {SCENES.map((_, n) => (
              <button
                key={n}
                type="button"
                onClick={() => go(n)}
                aria-label={t('hero.bgDot', { n: n + 1 })}
                aria-current={n === i}
                className={`h-1.5 rounded-full transition-all ${n === i ? 'w-8 bg-gold-400' : 'w-3 bg-white/35 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
