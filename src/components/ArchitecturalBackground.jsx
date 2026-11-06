import { useEffect, useRef } from 'react';

/**
 * Scroll-scrubbed architectural background.
 *
 * During active scrolling, use fastSeek when available so the browser can jump
 * to nearby keyframes quickly. Once scrolling stops, perform one precise seek
 * to the exact scroll position. Never build a queue of seeks.
 */
export default function ArchitecturalBackground() {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let frame = 0;
    let duration = 0;
    let seekInFlight = false;
    let isScrolling = false;
    let idleTimer = null;
    let latestTargetTime = 0;

    video.pause();

    const getProgress = () => {
      const root = document.documentElement;
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      return maxScroll === 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const requestLatestPosition = () => {
      if (!duration || !Number.isFinite(duration) || video.readyState < HTMLMediaElement.HAVE_METADATA) return;
      if (seekInFlight || video.seeking) return;

      const difference = Math.abs(video.currentTime - latestTargetTime);
      if (difference < (isScrolling ? 0.12 : 0.015)) return;

      seekInFlight = true;
      try {
        if (isScrolling && typeof video.fastSeek === 'function') {
          video.fastSeek(latestTargetTime);
        } else {
          video.currentTime = latestTargetTime;
        }
      } catch {
        seekInFlight = false;
      }
    };

    const renderScrollPosition = () => {
      frame = 0;
      const progress = getProgress();

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      latestTargetTime = progress * duration;
      requestLatestPosition();
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(renderScrollPosition);
    };

    const onScroll = () => {
      isScrolling = true;
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        isScrolling = false;
        scheduleUpdate();
      }, 120);
      scheduleUpdate();
    };

    const syncDuration = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      video.pause();
      scheduleUpdate();
    };

    const onSeeked = () => {
      seekInFlight = false;
      // If the user kept scrolling during decode, jump toward the newest
      // position. If they stopped, this becomes the final precise seek.
      scheduleUpdate();
    };

    const preventPlayback = () => {
      if (!video.paused) video.pause();
    };

    video.addEventListener('loadedmetadata', syncDuration);
    video.addEventListener('durationchange', syncDuration);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('play', preventPlayback);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) syncDuration();
    else scheduleUpdate();
    scheduleUpdate();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      video.removeEventListener('loadedmetadata', syncDuration);
      video.removeEventListener('durationchange', syncDuration);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('play', preventPlayback);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleUpdate);
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
