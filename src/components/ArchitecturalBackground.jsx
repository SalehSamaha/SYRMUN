import { useEffect, useRef } from 'react';

/**
 * ArchitecturalBackground
 *
 * Synchronizes video playback currentTime directly with page scroll progress:
 * - 0% scroll = 0% video (first frame)
 * - 100% scroll = 100% video (last frame)
 * - Scroll down: advances forward smoothly
 * - Scroll up: reverses backward smoothly
 * - Fast scroll: progresses fast
 * - Slow scroll: progresses slowly
 * - Scrolling stops: freezes immediately at current frame
 * - Fully responsive to touchscreen gestures on mobile (touchmove, scroll, fling)
 * - Desktop: fixed full-screen cinematic backdrop
 * - Mobile: proportionally sized (45vh, max 420px) centered crop with soft bottom fade
 */
export default function ArchitecturalBackground() {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let rafId = null;
    let duration = 0;
    let targetTime = 0;
    let lastSeekTime = 0;
    let unlocked = false;

    // Configure video attributes
    video.pause();
    video.loop = false;
    video.muted = true;
    video.playsInline = true;

    // Helper: calculate total scroll progress across any device/browser
    const getScrollProgress = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
      const scrollHeight = Math.max(
        doc.scrollHeight,
        body.scrollHeight,
        doc.offsetHeight,
        body.offsetHeight,
        doc.clientHeight
      );
      const clientHeight = window.innerHeight || doc.clientHeight || 1;
      const maxScroll = Math.max(1, scrollHeight - clientHeight);
      return Math.min(1, Math.max(0, scrollTop / maxScroll));
    };

    // Update duration & initial target time
    const syncDuration = () => {
      if (video.duration && Number.isFinite(video.duration) && video.duration > 0) {
        duration = video.duration;
        const p = getScrollProgress();
        targetTime = p * duration;
      }
    };

    // Mobile media unlock: briefly prime the decoder on first user gesture
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      try {
        const p = video.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            video.pause();
          }).catch(() => {});
        }
      } catch {}
    };

    // Immediate seek / smooth step logic
    const updateVideoFrame = () => {
      if (!duration) {
        syncDuration();
        if (!duration) return;
      }

      const progress = getScrollProgress();
      targetTime = progress * duration;

      const now = performance.now();
      const current = video.currentTime;
      const diff = targetTime - current;
      const absDiff = Math.abs(diff);

      // Only seek if difference exceeds threshold and video is ready for next seek
      if (absDiff > 0.02) {
        const canSeek = !video.seeking || now - lastSeekTime > 55;
        if (canSeek) {
          lastSeekTime = now;
          // For small adjustments, step smoothly; for larger jumps (fast scroll), move aggressively
          const step = absDiff < 0.2 ? diff : diff * 0.5;
          const nextTime = Math.max(0, Math.min(duration, current + step));
          try {
            video.currentTime = nextTime;
          } catch {}
        }
      }

      // Update the top progress bar
      if (progressBarRef.current && duration > 0) {
        const p = Math.min(1, Math.max(0, video.currentTime / duration));
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }
    };

    // Animation frame loop
    const tick = () => {
      if (!document.hidden) {
        updateVideoFrame();
      }
      rafId = requestAnimationFrame(tick);
    };

    // Listen to video metadata events
    video.addEventListener('loadedmetadata', syncDuration);
    video.addEventListener('durationchange', syncDuration);
    video.addEventListener('canplay', syncDuration);

    // Initial check
    if (video.readyState >= 1) syncDuration();

    // Listen to touch and user gestures to prime playback on mobile
    window.addEventListener('touchstart', unlock, { passive: true, once: true });
    window.addEventListener('touchmove', unlock, { passive: true, once: true });
    window.addEventListener('scroll', unlock, { passive: true, once: true });
    window.addEventListener('pointerdown', unlock, { passive: true, once: true });

    // Start RAF loop
    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      video.removeEventListener('loadedmetadata', syncDuration);
      video.removeEventListener('durationchange', syncDuration);
      video.removeEventListener('canplay', syncDuration);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('touchmove', unlock);
      window.removeEventListener('scroll', unlock);
      window.removeEventListener('pointerdown', unlock);
    };
  }, []);

  return (
    <>
      {/* Background Video Layer — 45vh max 420px on mobile with soft fade, full-bleed fixed on desktop */}
      <div
        className="pointer-events-none fixed top-0 inset-x-0 z-0 h-[45vh] max-h-[420px] min-h-[280px] md:inset-0 md:h-full md:max-h-none overflow-hidden bg-[#02143b]"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/edtur3gp/video/upload/v1793987293/Architectural_blueprint_animatio__9f920ea2.mp4"
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Mobile bottom-fade scrim to smoothly dissolve video into deep navy background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#02143b]/20 via-transparent to-[#02143b] md:hidden" />

        {/* Desktop subtle ambient scrim */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-[#021133]/25 via-transparent to-[#021133]/35" />
      </div>

      {/* Top Architectural Blueprint Progress Line */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]" aria-hidden="true">
        <div
          ref={progressBarRef}
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-sky-400 via-sky-200 to-white shadow-[0_0_8px_rgba(125,211,252,0.8)]"
        />
      </div>
    </>
  );
}
