import { useEffect, useRef } from 'react';

/**
 * The fixed backdrop of the whole site:
 *  - a golden wireframe globe, always centred in the window, that turns as you scroll,
 *  - gold dust that drifts at different speeds as you scroll (parallax),
 *  - a thin gold progress line at the top.
 *
 * EVERYTHING here is driven by the scroll position, so nothing moves while you are not
 * scrolling. The drawing loop starts on scroll, eases to a stop, and then switches itself
 * off completely: an idle page costs nothing. It is drawn on one <canvas>.
 */

const TILT = 0.38; // axial tilt, radians
const GOLD = (a) => `rgba(222,184,92,${a})`;

function project(lat, lon, rot) {
  const cl = Math.cos(lat);
  const x = cl * Math.sin(lon + rot);
  const y0 = Math.sin(lat);
  const z0 = cl * Math.cos(lon + rot);
  const y = y0 * Math.cos(TILT) - z0 * Math.sin(TILT);
  const z = y0 * Math.sin(TILT) + z0 * Math.cos(TILT);
  return [x, y, z];
}

// Fibonacci sphere: evenly spread glimmering dots
const DOTS = Array.from({ length: 520 }, (_, i) => {
  const k = (i + 0.5) / 520;
  return { lat: Math.asin(1 - 2 * k), lon: i * 2.399963, tw: Math.random() * 6.28, sp: 0.6 + Math.random() * 1.6 };
});

export default function GlobeStage() {
  const canvasRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let sweepEls = [];
    let scrollY = window.scrollY;
    let smooth = scrollY; // eased scroll position
    let vel = 0; // eased scroll speed, drives the glow
    let last = performance.now();
    let particles = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, w < 700 ? 1.5 : 2);
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, w < 700 ? 1.5 : 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const n = w < 700 ? 38 : 80;
      particles = Array.from({ length: n }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.5 + Math.random() * 1.7,
        par: 0.15 + Math.random() * 0.85, // parallax depth
        ph: Math.random() * 6.28,
      }));
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    // Soft glows are painted ONCE into small offscreen canvases and then stamped each frame.
    // Re-computing big radial gradients and canvas shadow-blur 60 times a second was the most
    // expensive part of this canvas; stamping a ready-made image is almost free.
    const makeSprite = (size, paint) => {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      paint(c.getContext('2d'), size);
      return c;
    };
    const haloSprite = makeSprite(512, (g, S) => {
      const c = S / 2;
      const gr = g.createRadialGradient(c, c, c * (0.35 / 2.1), c, c, c);
      gr.addColorStop(0, 'rgba(222,184,92,1)');
      gr.addColorStop(0.55, 'rgba(222,184,92,0.25)');
      gr.addColorStop(1, 'rgba(222,184,92,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, S, S);
    });
    const bodySprite = makeSprite(512, (g, S) => {
      const c = S / 2;
      const gr = g.createRadialGradient(c - c * 0.35, c - c * 0.4, c * 0.1, c, c, c);
      gr.addColorStop(0, 'rgba(201,162,75,0.16)');
      gr.addColorStop(0.7, 'rgba(40,64,108,0.1)');
      gr.addColorStop(1, 'rgba(222,184,92,0.14)');
      g.beginPath();
      g.arc(c, c, c, 0, 6.2832);
      g.fillStyle = gr;
      g.fill();
    });
    const RIM = 0.72; // ring radius as a share of the rim sprite's half-size
    const rimSprite = makeSprite(768, (g, S) => {
      const c = S / 2;
      g.beginPath();
      g.arc(c, c, c * RIM, 0, 6.2832);
      g.lineWidth = 2.2;
      g.strokeStyle = 'rgba(222,184,92,0.55)';
      g.shadowColor = 'rgba(222,184,92,0.9)';
      g.shadowBlur = 34;
      g.stroke();
    });
    const starSprite = makeSprite(64, (g, S) => {
      const c = S / 2;
      const gr = g.createRadialGradient(c, c, 0, c, c, c);
      gr.addColorStop(0, 'rgba(255,244,205,1)');
      gr.addColorStop(0.18, 'rgba(255,240,190,0.95)');
      gr.addColorStop(0.4, 'rgba(222,184,92,0.35)');
      gr.addColorStop(1, 'rgba(222,184,92,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, S, S);
    });

    const draw = (now) => {
      // rAF timestamps can be slightly older than performance.now(): never let dt go negative
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      // Lenis (desktop) and the phone itself already ease the scroll, so no second ease here.
      const prev = smooth;
      smooth = scrollY;
      const speed = Math.abs(smooth - prev) / Math.max(dt, 0.001); // px/s
      vel += (Math.min(1, speed / 1800) - vel) * (1 - Math.pow(0.02, dt)); // glow fades out in ~1s
      const rot = 0.5 + smooth * 0.0019;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // --- page progress line
      const max = Math.max(1, document.documentElement.scrollHeight - h);
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;

      if (!sweepEls.length || !sweepEls[0].isConnected) {
        sweepEls = [...document.querySelectorAll('.text-gold-gradient')];
      }
      // --- the gold sweep on "2027" travels with the scroll, too (no idle animation)
      const sweep = 170 - ((smooth * 0.09) % 240);
      for (const el of sweepEls) el.style.backgroundPosition = `${sweep}% 0`;

      // --- globe
      const cx = w / 2;
      const cy = h / 2;
      const R = w < 700 ? Math.min(w * 0.44, h * 0.3) : Math.min(w * 0.3, h * 0.38);
      const fade = 1 - 0.5 * Math.min(1, scrollY / (h * 0.9)); // calmer behind body text
      const pulse = 1 + 0.015 * Math.sin(smooth / 260) + vel * 0.03;
      const r = R * pulse;
      const glow = (0.16 + vel * 0.22) * fade;

      // halo, body and rim light: stamped from the sprites above
      ctx.globalAlpha = Math.min(1, glow);
      ctx.drawImage(haloSprite, cx - r * 2.1, cy - r * 2.1, r * 4.2, r * 4.2);
      ctx.globalAlpha = fade;
      ctx.drawImage(bodySprite, cx - r, cy - r, r * 2, r * 2);
      ctx.globalAlpha = Math.min(1, fade * (1 + vel * 0.7));
      const rs = r / RIM;
      ctx.drawImage(rimSprite, cx - rs, cy - rs, rs * 2, rs * 2);
      ctx.globalAlpha = 1;

      // latitude + longitude lines, split into the near side (bright) and far side (faint)
      const near = [];
      const far = [];
      const seg = (a, b) => {
        const z = (a[2] + b[2]) / 2;
        (z > 0 ? near : far).push([cx + a[0] * r, cy - a[1] * r, cx + b[0] * r, cy - b[1] * r]);
      };
      const STEP = Math.PI / 45;
      for (let la = -75; la <= 75; la += 15) {
        const lat = (la * Math.PI) / 180;
        let p = project(lat, 0, rot);
        for (let lo = STEP; lo <= 6.2832 + 0.001; lo += STEP) {
          const q = project(lat, lo, rot);
          seg(p, q);
          p = q;
        }
      }
      for (let lo = 0; lo < 360; lo += 15) {
        const lon = (lo * Math.PI) / 180;
        let p = project(-1.5708, lon, rot);
        for (let la = -90 + 4; la <= 90; la += 4) {
          const q = project((la * Math.PI) / 180, lon, rot);
          seg(p, q);
          p = q;
        }
      }
      const strokeSet = (set, alpha, width) => {
        ctx.beginPath();
        for (const s of set) {
          ctx.moveTo(s[0], s[1]);
          ctx.lineTo(s[2], s[3]);
        }
        ctx.lineWidth = width;
        ctx.strokeStyle = GOLD(alpha * fade);
        ctx.stroke();
      };
      strokeSet(far, 0.1, 0.8);
      strokeSet(near, 0.5, 1.05);

      // glimmering dots on the near side, grouped into 6 brightness levels (6 fills, not 500)
      const BUCKETS = 6;
      const paths = Array.from({ length: BUCKETS }, () => []);
      for (const d of DOTS) {
        const [x, y, z] = project(d.lat, d.lon, rot);
        if (z <= 0.02) continue;
        const tw = 0.5 + 0.5 * Math.sin(smooth * 0.0045 * d.sp + d.tw);
        const lvl = Math.min(BUCKETS - 1, Math.floor(tw * z * BUCKETS));
        paths[lvl].push(cx + x * r, cy - y * r, 0.7 + z * 1.1 + tw * 0.5);
      }
      for (let i = 0; i < BUCKETS; i++) {
        const pts = paths[i];
        if (!pts.length) continue;
        ctx.fillStyle = `rgba(246,226,160,${(0.18 + 0.7 * ((i + 0.5) / BUCKETS)) * fade})`;
        ctx.beginPath();
        for (let j = 0; j < pts.length; j += 3) {
          ctx.moveTo(pts[j] + pts[j + 2], pts[j + 1]);
          ctx.arc(pts[j], pts[j + 1], pts[j + 2], 0, 6.2832);
        }
        ctx.fill();
      }

      // two orbit rings with a satellite each
      for (let k = 0; k < 2; k++) {
        const a = k === 0 ? -0.5 : 0.62;
        const rx = r * (k === 0 ? 1.32 : 1.55);
        const ry = rx * 0.2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, 6.2832);
        ctx.lineWidth = 0.9;
        ctx.strokeStyle = GOLD((k === 0 ? 0.28 : 0.16) * fade);
        ctx.stroke();
        const t = (1.2 + smooth * (k === 0 ? 0.0021 : 0.0013)) * (k === 0 ? 1 : -1);
        const sx = Math.cos(t) * rx;
        const sy = Math.sin(t) * ry;
        ctx.drawImage(starSprite, sx - 14, sy - 14, 28, 28);
        ctx.restore();
      }

      // gold dust with parallax
      for (const p of particles) {
        const y = (((p.y * h - smooth * p.par * 0.35) % h) + h) % h;
        const x = p.x * w + Math.sin(smooth / 420 + p.ph) * 12 * p.par;
        const a = (0.18 + 0.45 * (0.5 + 0.5 * Math.sin(smooth / 150 + p.ph))) * (0.5 + p.par * 0.5);
        ctx.fillStyle = `rgba(240,214,140,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, 6.2832);
        ctx.fill();
      }
    };

    // The loop runs only while something is changing: scrolling, or the glow fading out.
    const loop = (now) => {
      raf = 0;
      draw(now);
      if (Math.abs(scrollY - smooth) > 0.01 || vel > 0.003) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      onScroll();
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const onResize = () => {
      resize();
      kick();
    };

    resize();
    kick();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', kick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden="true">
        <div ref={barRef} className="progress-line h-full origin-left scale-x-0" />
      </div>
    </>
  );
}
