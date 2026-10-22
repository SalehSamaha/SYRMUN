import { useEffect, useRef } from 'react';

/**
 * The fixed backdrop of the whole site:
 *  - a golden wireframe globe, always centred in the window, that turns as you scroll
 *    (and keeps drifting slowly when you stop),
 *  - gold dust that floats up and moves at different speeds as you scroll (parallax),
 *  - a thin gold progress line at the top showing how far down the page you are.
 * It is drawn on one <canvas> so it costs almost nothing, and it stands still for
 * visitors who asked their device for reduced motion.
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
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let scrollY = window.scrollY;
    let smooth = scrollY; // eased scroll position
    let vel = 0; // eased scroll speed, drives the glow
    let spin = 0;
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
        rise: 6 + Math.random() * 16, // px per second
        ph: Math.random() * 6.28,
      }));
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const prev = smooth;
      smooth += (scrollY - smooth) * Math.min(1, dt * 7);
      const speed = Math.abs(smooth - prev) / Math.max(dt, 0.001); // px/s
      vel += (Math.min(1, speed / 1800) - vel) * Math.min(1, dt * 4);
      if (!still) spin += dt * 0.09;
      const rot = spin + smooth * 0.0019;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // --- page progress line
      const max = Math.max(1, document.documentElement.scrollHeight - h);
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, scrollY / max)})`;

      // --- globe
      const cx = w / 2;
      const cy = h / 2;
      const R = w < 700 ? Math.min(w * 0.44, h * 0.3) : Math.min(w * 0.3, h * 0.38);
      const fade = 1 - 0.5 * Math.min(1, scrollY / (h * 0.9)); // calmer behind body text
      const pulse = 1 + 0.015 * Math.sin(now / 1700) + vel * 0.03;
      const r = R * pulse;
      const glow = (0.16 + vel * 0.22) * fade;

      // halo
      let g = ctx.createRadialGradient(cx, cy, r * 0.35, cx, cy, r * 2.1);
      g.addColorStop(0, GOLD(glow));
      g.addColorStop(0.55, GOLD(glow * 0.25));
      g.addColorStop(1, GOLD(0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // body of the sphere
      g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
      g.addColorStop(0, `rgba(201,162,75,${0.16 * fade})`);
      g.addColorStop(0.7, `rgba(40,64,108,${0.1 * fade})`);
      g.addColorStop(1, `rgba(222,184,92,${0.14 * fade})`);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 6.2832);
      ctx.fillStyle = g;
      ctx.fill();

      // rim light
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 6.2832);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = GOLD(0.55 * fade);
      ctx.shadowColor = GOLD(0.9);
      ctx.shadowBlur = 18 + vel * 28;
      ctx.stroke();
      ctx.shadowBlur = 0;

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

      // glimmering dots on the near side
      for (const d of DOTS) {
        const [x, y, z] = project(d.lat, d.lon, rot);
        if (z <= 0.02) continue;
        const tw = 0.5 + 0.5 * Math.sin(now / 1000 * d.sp + d.tw);
        ctx.fillStyle = `rgba(246,226,160,${(0.18 + 0.7 * tw * z) * fade})`;
        ctx.beginPath();
        ctx.arc(cx + x * r, cy - y * r, 0.7 + z * 1.1 + tw * 0.5, 0, 6.2832);
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
        const t = (now / (k === 0 ? 7000 : 11000) + smooth * 0.0006) * (k === 0 ? 1 : -1);
        const sx = Math.cos(t) * rx;
        const sy = Math.sin(t) * ry;
        ctx.shadowColor = GOLD(1);
        ctx.shadowBlur = 14;
        ctx.fillStyle = 'rgba(255,240,190,0.95)';
        ctx.beginPath();
        ctx.arc(sx, sy, 2.6, 0, 6.2832);
        ctx.fill();
        ctx.restore();
      }

      // gold dust with parallax
      for (const p of particles) {
        const y = (((p.y * h - smooth * p.par * 0.35 - (still ? 0 : now / 1000 * p.rise)) % h) + h) % h;
        const x = p.x * w + Math.sin(now / 2600 + p.ph) * 12 * p.par;
        const a = (0.18 + 0.45 * (0.5 + 0.5 * Math.sin(now / 900 + p.ph))) * (0.5 + p.par * 0.5);
        ctx.fillStyle = `rgba(240,214,140,${a})`;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, 6.2832);
        ctx.fill();
      }
    };

    const loop = (now) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (still) {
      draw(performance.now());
      const redraw = () => {
        onScroll();
        smooth = scrollY;
        draw(performance.now());
      };
      window.addEventListener('scroll', redraw, { passive: true });
      window.addEventListener('resize', () => {
        resize();
        redraw();
      });
      return () => window.removeEventListener('scroll', redraw);
    }

    raf = requestAnimationFrame(loop);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
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
