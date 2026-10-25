import Lenis from 'lenis';

/**
 * Smooth (eased) mouse-wheel scrolling for the public site, same as the other sites.
 * Off for visitors who asked their device for reduced motion. Touch screens keep their
 * own native momentum scrolling.
 */
let lenis = null;

export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return () => {};
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    anchors: true,
    autoRaf: true,
  });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
