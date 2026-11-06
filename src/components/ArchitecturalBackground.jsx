import { useEffect, useRef } from 'react';

/**
 * ArchitecturalBackground
 *
 * Full-viewport background featuring the authentic SYRMUN architectural blueprint video animation:
 * - https://res.cloudinary.com/edtur3gp/video/upload/v1793987293/Architectural_blueprint_animatio__9f920ea2.mp4
 * - position: fixed, inset: 0, w-full, h-full, object-cover, pointer-events-none, z-0
 * - Behind all website content across all routes
 * - Seamlessly loops, autoplay, muted, playsInline
 * - Subtle navy overlay ensures 100% WCAG AA text readability throughout all pages
 * - Includes smooth top scroll progress indicator in architectural ice-blue/white
 */
export default function ArchitecturalBackground() {
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    // Ensure video plays smoothly even on power saver or initial load
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented; video will start on first user interaction if blocked
          const onUserGesture = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
            window.removeEventListener('click', onUserGesture);
            window.removeEventListener('touchstart', onUserGesture);
            window.removeEventListener('scroll', onUserGesture);
          };
          window.addEventListener('click', onUserGesture, { once: true });
          window.addEventListener('touchstart', onUserGesture, { once: true });
          window.addEventListener('scroll', onUserGesture, { once: true });
        });
      }
    }

    // Scroll progress bar indicator
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, scrollY / maxScroll));
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${ratio})`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      {/* Full-viewport fixed background container */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#02143b]"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/edtur3gp/video/upload/v1793987293/Architectural_blueprint_animatio__9f920ea2.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Very subtle transparent navy wash to harmonize contrast without obscuring the animation */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#021133]/25 via-transparent to-[#021133]/35"
        />
      </div>

      {/* Top architectural scroll progress hairline */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]" aria-hidden="true">
        <div
          ref={progressBarRef}
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-sky-400 via-sky-200 to-white shadow-[0_0_8px_rgba(125,211,252,0.8)] transition-transform duration-75 ease-out"
        />
      </div>
    </>
  );
}
