import { useEffect, useRef } from 'react';

/**
 * Full-site architectural background.
 *
 * The video is scrubbed by document scroll progress:
 * 0% scroll = first frame, 100% scroll = last frame.
 * The element never plays independently, so scrolling upward reverses it.
 */
export default function ArchitecturalBackground() {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let frame = 0;
    let duration = 0;

    // Keep the media paused at all times. Its currentTime is controlled by scroll.
    video.pause();

    const getProgress = () => {
      const root = document.documentElement;
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      return maxScroll === 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const renderScrollPosition = () => {
      frame = 0;

      const progress = getProgress();

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${progress})`;
      }

      if (!duration || !Number.isFinite(duration) || video.readyState < HTMLMediaElement.HAVE_METADATA) {
        return;
      }

      // Map the whole document scroll range directly to the complete video timeline.
      const targetTime = progress * duration;
      if (Math.abs(video.currentTime - targetTime) > 0.025) {
        try {
          video.currentTime = targetTime;
        } catch {
          // Metadata/seekability may not be ready yet; loadedmetadata will retry.
        }
      }
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(renderScrollPosition);
    };

    const syncDuration = () => {
      duration = Number.isFinite(video.duration) ? video.duration : 0;
      video.pause();
      scheduleUpdate();
    };

    const preventPlayback = () => {
      // Protect against browser autoplay/resume behaviour: this video is a scrubber, not a player.
      if (!video.paused) video.pause();
    };

    video.addEventListener('loadedmetadata', syncDuration);
    video.addEventListener('durationchange', syncDuration);
    video.addEventListener('play', preventPlayback);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) syncDuration();
    else scheduleUpdate();

    // Set the correct frame on first paint and after content/layout changes.
    scheduleUpdate();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      video.removeEventListener('loadedmetadata', syncDuration);
      video.removeEventListener('durationchange', syncDuration);
      video.removeEventListener('play', preventPlayback);
      window.removeEventListener('scroll', scheduleUpdate);
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
