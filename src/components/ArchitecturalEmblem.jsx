import { useEffect, useState, useRef, useCallback } from 'react';
import { BLUEPRINT_DATA } from './blueprintData.js';
import { useI18n } from '../lib/i18n.jsx';

/**
 * ArchitecturalEmblem
 * 
 * Luxury architectural illustration animation of the authentic SYRMUN emblem:
 *  - Colors extracted directly from public/logo.png (Deep Navy #021d60 + Classical Alabaster White #ffffff).
 *  - Classical Greek architecture: roof & pediment, columns, stepped stylobate, background temple, cypress grove.
 *  - Symmetrical laurel wreath blooming upwards.
 *  - Classical serif typography "SYR MUN" arched along the top.
 *  - Smoothly animated on initial page load, and interactive with scroll in both directions.
 *  - Zero CAD grids, zero coordinates, zero technical clutter.
 */

export default function ArchitecturalEmblem({ className = '', onReplay }) {
  const { lang, t } = useI18n();
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressRef = useRef(0);
  const rafRef = useRef(0);
  const userHasScrolledRef = useRef(false);

  // Update progress helper
  const updateProgress = useCallback((val) => {
    const clamped = Math.min(1, Math.max(0, val));
    progressRef.current = clamped;
    setProgress(clamped);
  }, []);

  // Smooth entrance animation from 0 to 1 on initial load or replay
  const startEntranceAnimation = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsPlaying(true);
    userHasScrolledRef.current = false;
    updateProgress(0);

    const startTime = performance.now();
    const duration = 4200; // 4.2 seconds natural luxury pace

    const step = (now) => {
      // If user starts scrolling significantly, scroll interaction takes precedence
      if (userHasScrolledRef.current) {
        setIsPlaying(false);
        return;
      }

      const elapsed = now - startTime;
      const tNorm = Math.min(1, elapsed / duration);
      // Smooth easing (ease-out cubic)
      const eased = 1 - Math.pow(1 - tNorm, 3);
      updateProgress(eased);

      if (tNorm < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [updateProgress]);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      updateProgress(1);
      return undefined;
    }

    // Start natural entrance drawing
    startEntranceAnimation();

    // Scroll-driven interaction:
    // As the user scrolls through the hero (0 to 450px), progress scrubs smoothly.
    // Scrolling backward reverses the animation smoothly!
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const scrollY = window.scrollY;
      // If user scrolls past 30px, switch from auto-play to scroll-scrubbing
      if (Math.abs(scrollY - lastScrollY) > 8 || scrollY > 30) {
        userHasScrolledRef.current = true;
        lastScrollY = scrollY;
        // Hero range: 0px to 420px
        const maxScroll = 420;
        const target = Math.min(1, Math.max(0, scrollY / maxScroll));
        updateProgress(target);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [startEntranceAnimation, updateProgress]);

  const handleManualReplay = (e) => {
    e.stopPropagation();
    userHasScrolledRef.current = false;
    startEntranceAnimation();
    if (onReplay) onReplay();
  };

  const { groups } = BLUEPRINT_DATA;

  /**
   * Helper to compute path strokeDashoffset and opacity based on progress window [start, end]
   */
  const getPathStyle = (start, end, len, fillSolid = true) => {
    const local = Math.min(1, Math.max(0, (progress - start) / (end - start)));
    const strokeDashoffset = len * (1 - local);
    // Subtle fill solidifies as drawing nears completion
    const fillOpacity = fillSolid && local >= 0.85 ? Math.min(1, (local - 0.85) / 0.15) : 0;
    return {
      strokeDasharray: len,
      strokeDashoffset,
      fill: fillOpacity > 0 ? `rgba(255, 255, 255, ${0.92 * fillOpacity})` : 'transparent',
      transition: isPlaying ? 'none' : 'stroke-dashoffset 0.1s linear, fill 0.2s ease',
    };
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer Glow / Halo Aura (Derived strictly from navy palette) */}
      <div
        className="pointer-events-none absolute h-[92%] w-[92%] rounded-full transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(20, 60, 140, 0.45) 0%, rgba(2, 29, 96, 0.15) 55%, transparent 72%)',
          filter: 'blur(32px)',
          opacity: 0.2 + progress * 0.7,
        }}
      />

      {/* Main SVG Emblem Disc */}
      <div className="relative w-full max-w-[440px] xs:max-w-[480px] sm:max-w-[500px] lg:max-w-[520px] aspect-square">
        <svg
          viewBox="0 0 512 512"
          className="h-full w-full filter drop-shadow-[0_16px_38px_rgba(1,14,48,0.7)]"
          style={{ overflow: 'visible' }}
          role="img"
          aria-label="SYRMUN Classical Architectural Emblem"
        >
          <defs>
            {/* Deep Navy Radial Background Gradient strictly extracted from logo.png */}
            <radialGradient id="syr-navy-vignette" cx="50%" cy="46%" r="54%">
              <stop offset="0%" stopColor="#082b75" />
              <stop offset="65%" stopColor="#021d60" />
              <stop offset="100%" stopColor="#011342" />
            </radialGradient>

            {/* Circular arc for SYR MUN upper typography */}
            <path id="emblem-text-arc" d="M 106,126 A 210,210 0 0,1 406,126" fill="none" />

            {/* Very subtle surface lighting sheen */}
            <radialGradient id="emblem-sheen" cx="50%" cy="40%" r="52%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.07" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.01" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Deep Navy Disc Base */}
          <circle cx="256" cy="256" r="248" fill="url(#syr-navy-vignette)" />
          <circle cx="256" cy="256" r="248" fill="url(#emblem-sheen)" />

          {/* STAGE 2: TEMPLE ARCHITECTURE (Roof, Columns, Stairs, Background Temple, Landscape) */}
          {/* 2A: Temple Roof & Triangular Pediment */}
          <g id="temple-roof" stroke="#ffffff" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
            {groups.templeRoof.map((item, idx) => {
              const start = 0.05 + (idx / groups.templeRoof.length) * 0.08;
              const end = start + 0.04;
              const style = getPathStyle(start, end, item.len, false);
              return <path key={`roof-${idx}`} d={item.d} style={style} />;
            })}
          </g>

          {/* 2B: Classical Greek Columns (sequential reveal from left to right) */}
          <g id="temple-columns" stroke="#ffffff" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
            {groups.templeColumns.map((item, idx) => {
              const start = 0.12 + (idx / groups.templeColumns.length) * 0.12;
              const end = start + 0.05;
              const style = getPathStyle(start, end, item.len, false);
              return <path key={`col-${idx}`} d={item.d} style={style} />;
            })}
          </g>

          {/* 2C: Stepped Stylobate Stairs & Foundation Terraces */}
          <g id="temple-stairs" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
            {groups.templeStairs.map((item, idx) => {
              const start = 0.22 + (idx / groups.templeStairs.length) * 0.09;
              const end = start + 0.04;
              const style = getPathStyle(start, end, item.len, false);
              return <path key={`stairs-${idx}`} d={item.d} style={style} />;
            })}
          </g>

          {/* 2D: Background Temple (smaller classical temple on elevated right terrace) */}
          <g id="temple-bg" stroke="#ffffff" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round">
            {groups.templeBg.map((item, idx) => {
              const start = 0.28 + (idx / groups.templeBg.length) * 0.06;
              const end = start + 0.03;
              const style = getPathStyle(start, end, item.len, false);
              return <path key={`bg-${idx}`} d={item.d} style={style} />;
            })}
          </g>

          {/* 2E: Cypress Groves & Hillside Contours */}
          <g id="landscape" stroke="#ffffff" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round">
            {groups.landscape.map((item, idx) => {
              const start = 0.32 + (idx / groups.landscape.length) * 0.06;
              const end = start + 0.03;
              const style = getPathStyle(start, end, item.len, false);
              return <path key={`land-${idx}`} d={item.d} style={style} />;
            })}
          </g>

          {/* STAGE 3: LAUREL WREATH (Ribbon bow + symmetrical leaves blooming upward) */}
          {/* 3A: Bottom Ribbon Knot and Loops */}
          <g id="laurel-ribbon" stroke="#ffffff" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
            {groups.laurelRibbon.map((item, idx) => {
              const start = 0.38 + (idx / groups.laurelRibbon.length) * 0.05;
              const end = start + 0.04;
              const style = getPathStyle(start, end, item.len, false);
              return <path key={`ribbon-${idx}`} d={item.d} style={style} />;
            })}
          </g>

          {/* 3B: Left Laurel Branch (ascending bottom to top) */}
          <g id="laurel-left" stroke="#ffffff" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
            {groups.laurelLeft.map((item, idx) => {
              const start = 0.42 + (idx / groups.laurelLeft.length) * 0.24;
              const end = start + 0.04;
              const style = getPathStyle(start, end, item.len, false);
              return <path key={`l-leaf-${idx}`} d={item.d} style={style} />;
            })}
          </g>

          {/* 3C: Right Laurel Branch (ascending bottom to top in symmetrical harmony) */}
          <g id="laurel-right" stroke="#ffffff" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
            {groups.laurelRight.map((item, idx) => {
              const start = 0.42 + (idx / groups.laurelRight.length) * 0.24;
              const end = start + 0.04;
              const style = getPathStyle(start, end, item.len, false);
              return <path key={`r-leaf-${idx}`} d={item.d} style={style} />;
            })}
          </g>

          {/* STAGE 4: TYPOGRAPHY (SYR MUN arched along upper circle) */}
          <g id="typography">
            {/* Authentic letter vector contours */}
            {groups.typography.map((item, idx) => {
              const start = 0.68 + (idx / groups.typography.length) * 0.12;
              const end = start + 0.04;
              const style = getPathStyle(start, end, item.len, true);
              return (
                <path
                  key={`typo-${idx}`}
                  d={item.d}
                  stroke="#ffffff"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={style}
                />
              );
            })}

            {/* Classical Crisp Serif Arc Text */}
            <text
              className="latin-serif"
              fill="#ffffff"
              fontSize="31"
              fontWeight="700"
              letterSpacing="0.22em"
              style={{
                opacity: Math.min(1, Math.max(0, (progress - 0.76) / 0.14)),
                transition: isPlaying ? 'none' : 'opacity 0.2s ease',
              }}
            >
              <textPath href="#emblem-text-arc" startOffset="50%" textAnchor="middle">
                SYR MUN
              </textPath>
            </text>
          </g>

          {/* STAGE 5: OUTER CONCENTRIC CIRCULAR RINGS & COMPOSITION COMPLETION */}
          <g id="outer-rings" stroke="#ffffff" strokeLinecap="round">
            {groups.outerRings.map((item, idx) => {
              const start = 0.82 + (idx / groups.outerRings.length) * 0.08;
              const end = start + 0.04;
              const style = getPathStyle(start, end, item.len, false);
              return <path key={`ring-${idx}`} d={item.d} strokeWidth="1.2" style={style} />;
            })}

            {/* Outer Circular Boundary Stroke */}
            <circle
              cx="256"
              cy="256"
              r="248"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.0"
              style={{
                strokeDasharray: 1560,
                strokeDashoffset: 1560 * (1 - Math.min(1, Math.max(0, (progress - 0.86) / 0.12))),
                transition: isPlaying ? 'none' : 'stroke-dashoffset 0.15s linear',
              }}
            />
          </g>
        </svg>
      </div>

      {/* Subtle Classical Interaction Bar below emblem */}
      <div className="mt-4 flex items-center justify-between gap-4 w-full max-w-[340px] px-2 text-xs text-navy-200/60 font-medium">
        <button
          type="button"
          onClick={handleManualReplay}
          className="group inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] text-white/80 transition-all hover:border-white/50 hover:bg-white/10 hover:text-white active:scale-95"
          title={t('intro.replay')}
          aria-label={t('intro.replay')}
        >
          <svg
            className={`h-3 w-3 text-white/70 transition-transform ${isPlaying ? 'animate-spin' : 'group-hover:rotate-45'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{t('intro.replay')}</span>
        </button>

        {/* Minimal progress / status indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wider uppercase text-navy-200/50">
            {progress >= 0.95
              ? (lang === 'ar' ? 'مكتمل' : 'Completed')
              : (lang === 'ar' ? 'جارٍ الرسم المعماري' : 'Architectural Draw')}
          </span>
          <span className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden block">
            <span
              className="h-full bg-white/80 block rounded-full transition-all duration-150"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
