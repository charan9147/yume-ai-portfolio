import { useEffect, useRef } from 'react';

type Petal = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  spin: number;
  hue: number;
};

/**
 * Sakura drift. Canvas-based, ~24 petals, pauses when the tab is hidden and
 * renders nothing when the visitor prefers reduced motion.
 */
export default function Sakura({ density = 24 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    const count = window.innerWidth < 640 ? Math.round(density * 0.55) : density;

    const make = (): Petal => ({
      x: Math.random(),
      y: Math.random(),
      size: 2.5 + Math.random() * 4.5,
      speed: 0.00012 + Math.random() * 0.00022,
      drift: 0.00006 + Math.random() * 0.00012,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      hue: 340 + Math.random() * 22,
    });

    let petals: Petal[] = [];

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = window.innerWidth < 640 ? Math.round(density * 0.55) : count;
      while (petals.length < target) petals.push(make());
      petals = petals.slice(0, target);
    };

    const draw = (t: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of petals) {
        p.y += p.speed;
        p.x += Math.sin(t * 0.0004 + p.phase) * p.drift;
        if (p.y > 1.08) {
          p.y = -0.08;
          p.x = Math.random();
        }
        if (p.x > 1.08) p.x = -0.08;
        if (p.x < -0.08) p.x = 1.08;

        const px = p.x * width;
        const py = p.y * height;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(Math.sin(t * 0.001 + p.phase) * 0.7 + p.spin);
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = `hsl(${p.hue} 75% 82%)`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(draw);
      else cancelAnimationFrame(raf);
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70"
    />
  );
}
