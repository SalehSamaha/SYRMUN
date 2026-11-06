import { useEffect, useRef } from 'react';

/**
 * Velocity-driven cinematic background, using the same playback model as
 * WEST MUN: native forward playback, frame-stepped reverse playback, and
 * a short friction tail after scrolling stops. This avoids trying to decode
 * a new arbitrary video timestamp for every scroll event.
 */
export default function ArchitecturalBackground() {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let rafId = null;
    let lastScrollY = window.scrollY || 0;
    let lastScrollTime = 0;
    let lastScrollTimestamp = 0;
    let lastFrameTime = 0;
    let smoothedVelocity = 0;
    let currentPlaybackRate = 1;
    let targetPlaybackRate = 1;
    let direction = 1;
    let lastReverseSeekTime = 0;
    let pendingSeekTime = null;
    let isSeeking = false;
    let duration = 0;

    const MIN_RATE = 0.85;
    const MAX_RATE = 1.75;
    const VELOCITY_MULTIPLIER = 0.45;
    const FRICTION = 0.92;
    const IDLE_THRESHOLD_MS = 80;
    const MIN_HALT_RATE = 0.12;

    video.pause();
    video.loop = false;

    const updateProgress = () => {
      if (!progressBarRef.current || !duration) return;
      const progress = Math.min(1, Math.max(0, video.currentTime / duration));
      progressBarRef.current.style.transform = `scaleX(${progress})`;
    };

    const dispatchReverseSeek = (time) => {
      const target = Math.max(0, Math.min(duration || 0, time));
      if (Math.abs(video.currentTime - target) < 0.02) return;

      if (video.seeking || isSeeking) {
        pendingSeekTime = target;
        return;
      }

      try {
        isSeeking = true;
        video.currentTime = target;
      } catch {
        isSeeking = false;
      }
    };

    const onSeeked = () => {
      isSeeking = false;
      if (pendingSeekTime !== null) {
        const nextTime = pendingSeekTime;
        pendingSeekTime = null;
        dispatchReverseSeek(nextTime);
      }
      updateProgress();
    };

    const stop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (!video.paused) video.pause();
      try {
        video.playbackRate = 1;
      } catch {}
      currentPlaybackRate = 1;
      smoothedVelocity = 0;
      pendingSeekTime = null;
      isSeeking = false;
      updateProgress();
    };

    const tick = (now) => {
      if (document.hidden) {
        stop();
        return;
      }

      const deltaFrame = Math.min(50, Math.max(0, now - lastFrameTime));
      lastFrameTime = now;
      const timeSinceLastScroll = now - lastScrollTimestamp;

      if (timeSinceLastScroll > IDLE_THRESHOLD_MS) {
        const frameRatio = deltaFrame / 16.67;
        const decay = Math.pow(FRICTION, frameRatio);
        currentPlaybackRate *= decay;
        smoothedVelocity *= decay;

        if (currentPlaybackRate <= MIN_HALT_RATE) {
          stop();
          return;
        }
      } else {
        const blend = Math.min(1, 0.25 * (deltaFrame / 16.67));
        currentPlaybackRate += (targetPlaybackRate - currentPlaybackRate) * blend;
      }

      const rate = Math.max(0.1, currentPlaybackRate);

      if (direction > 0) {
        if (duration && video.currentTime >= duration - 0.025) {
          video.currentTime = duration;
          stop();
          return;
        }
        if (video.paused) video.play().catch(() => {});
        try {
          video.playbackRate = rate;
        } catch {}
      } else {
        if (!video.paused) video.pause();
        const nextTime = video.currentTime - (deltaFrame / 1000) * rate;
        if (nextTime <= 0.02) {
          dispatchReverseSeek(0);
          stop();
          return;
        }

        if (now - lastReverseSeekTime >= 30) {
          lastReverseSeekTime = now;
          dispatchReverseSeek(nextTime);
        } else {
          pendingSeekTime = nextTime;
        }
      }

      updateProgress();
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const now = performance.now();
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const dt = now - lastScrollTime;
      const dy = scrollY - lastScrollY;
      const absDy = Math.abs(dy);

      if (absDy >= 1.5) direction = dy > 0 ? 1 : -1;

      lastScrollY = scrollY;
      lastScrollTime = now;
      lastScrollTimestamp = now;

      if (dt > 4 && dt < 250) {
        const instantVelocity = absDy / dt;
        smoothedVelocity = smoothedVelocity * 0.35 + instantVelocity * 0.65;
      } else {
        smoothedVelocity = Math.max(0.2, smoothedVelocity * 0.5);
      }

      targetPlaybackRate = Math.min(
        MAX_RATE,
        Math.max(MIN_RATE, MIN_RATE + smoothedVelocity * VELOCITY_MULTIPLIER)
      );

      if (direction > 0) {
        if (video.paused) video.play().catch(() => {});
      } else if (!video.paused) {
        video.pause();
      }

      if (rafId === null) {
        lastFrameTime = now;
        rafId = requestAnimationFrame(tick);
      }
    };

    const syncDuration = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      updateProgress();
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
    };

    video.addEventListener('loadedmetadata', syncDuration);
    video.addEventListener('durationchange', syncDuration);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('timeupdate', updateProgress);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    if (video.readyState >= 1) syncDuration();

    return () => {
      stop();
      video.removeEventListener('loadedmetadata', syncDuration);
      video.removeEventListener('durationchange', syncDuration);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('timeupdate', updateProgress);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#02143b]"
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

        <div className="absolute inset-0 bg-gradient-to-b from-[#021133]/25 via-transparent to-[#021133]/35" />
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]" aria-hidden="true">
        <div
          ref={progressBarRef}
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-sky-400 via-sky-200 to-white shadow-[0_0_8px_rgba(125,211,252,0.8)]"
        />
      </div>
    </>
  );
}
