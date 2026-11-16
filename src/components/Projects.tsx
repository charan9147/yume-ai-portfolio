import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, MousePointer2 } from 'lucide-react';
import { useI18n } from '../i18n';
import Section from './Section';
import Reveal from './Reveal';

const CARD_META = [
  { key: 'tutor', accent: 'from-gold/30', chip: 'text-gold border-gold/30 bg-gold/10' },
  { key: 'companion', accent: 'from-sun/30', chip: 'text-sun-soft border-sun/30 bg-sun/10' },
  { key: 'bridge', accent: 'from-blue/30', chip: 'text-blue border-blue/30 bg-blue/10' },
] as const;

const NODE_ORDER = ['perception', 'core', 'reasoning', 'action', 'hri', 'learning'] as const;

export default function Projects() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<(typeof NODE_ORDER)[number]>('core');
  const [angle, setAngle] = useState(0);
  const [radius, setRadius] = useState(150);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const drag = useRef<{ active: boolean; x: number; a: number }>({ active: false, x: 0, a: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setRadius(Math.max(96, Math.min(178, w * 0.33)));
    });
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (!drag.current.active) setAngle((a) => a + dt * 0.012);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  const nodes = useMemo(
    () =>
      NODE_ORDER.map((key, i) => {
        const rad = ((angle + i * 60) * Math.PI) / 180;
        return {
          key,
          x: Math.cos(rad) * radius,
          y: Math.sin(rad) * radius * 0.48,
          depth: Math.sin(rad),
        };
      }),
    [angle, radius]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, x: e.clientX, a: angle };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    setAngle(drag.current.a + (e.clientX - drag.current.x) * 0.5);
  };
  const onPointerUp = () => {
    drag.current.active = false;
  };

  return (
    <Section
      id="projects"
      eyebrow={t.projects.eyebrow}
      title={t.projects.title}
      lead={t.projects.lead}
      className="bg-gradient-to-b from-transparent via-ink-2/40 to-transparent"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {CARD_META.map((meta, i) => {
          const card = t.projects.cards[meta.key];
          return (
            <Reveal key={meta.key} delay={i * 0.07} as="article">
              <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-cream/10 bg-ink-3/70 p-6 transition duration-500 hover:-translate-y-1 hover:border-gold/30">
                <div
                  aria-hidden
                  className={`absolute -end-20 -top-20 size-52 rounded-full bg-gradient-to-br ${meta.accent} to-transparent opacity-0 blur-3xl transition duration-700 group-hover:opacity-100`}
                />
                <div className="flex items-center justify-between">
                  <span className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] ${meta.chip}`}>
                    {t.ui.proposed}
                  </span>
                  <span className="text-[10px] tabular-nums tracking-[0.24em] text-faint">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-[1.65rem] leading-tight text-cream">{card.title}</h3>
                <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-mist">{card.desc}</p>
                <div className="mt-6 flex items-center justify-between border-t border-cream/10 pt-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-cream/50">{card.tag}</span>
                  <ArrowUpRight
                    size={16}
                    className="text-cream/35 transition group-hover:text-gold"
                    aria-hidden
                  />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* architecture */}
      <Reveal delay={0.08}>
        <div className="mt-6 overflow-hidden rounded-3xl border border-cream/10 bg-ink-2/60">
          <div className="grid gap-0 lg:grid-cols-12">
            <div className="border-b border-cream/10 p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-e">
              <h3 className="font-display text-2xl text-cream">{t.projects.archTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{t.projects.archLead}</p>

              <div className="mt-6 rounded-2xl border border-cream/10 bg-ink/50 p-4">
                <p className="text-[9px] uppercase tracking-[0.26em] text-gold">
                  {t.ui.stage} · {NODE_ORDER.indexOf(selected) + 1}/6
                </p>
                <h4 className="mt-2 font-display text-xl text-cream">
                  {t.projects.nodes[selected].title}
                </h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist">
                  {t.projects.nodes[selected].desc}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-faint">
                <MousePointer2 size={13} aria-hidden />
                {t.projects.archNote}
              </div>
            </div>

            <div className="relative lg:col-span-7">
              <div
                ref={wrapRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                className="relative mx-auto flex h-[360px] w-full max-w-xl cursor-grab touch-none select-none items-center justify-center active:cursor-grabbing sm:h-[420px]"
              >
                <div aria-hidden className="absolute size-[74%] rounded-full border border-cream/8" />
                <div aria-hidden className="absolute size-[52%] rounded-full border border-cream/6" />

                <div className="relative z-10 grid size-24 place-items-center rounded-full border border-gold/30 bg-ink text-center shadow-[0_0_60px_-18px_rgba(230,192,123,0.55)] sm:size-28">
                  <div>
                    <span className="block font-jp text-xl text-sun-soft">夢</span>
                    <span className="mt-0.5 block text-[8px] tracking-[0.26em] text-cream/60">
                      YUME CORE
                    </span>
                  </div>
                </div>

                {nodes.map((n) => {
                  const depth = (n.depth + 1) / 2;
                  const active = n.key === selected;
                  return (
                    <button
                      key={n.key}
                      type="button"
                      onClick={() => setSelected(n.key)}
                      aria-pressed={active}
                      className={`absolute start-1/2 top-1/2 grid size-[4.6rem] place-items-center rounded-full border text-center backdrop-blur-sm transition-[border-color,background-color,color] duration-300 sm:size-20 ${
                        active
                          ? 'border-gold/70 bg-gold/15 text-gold'
                          : 'border-cream/15 bg-ink-2/85 text-cream/75 hover:border-cream/35 hover:text-cream'
                      }`}
                      style={{
                        transform: `translate(-50%, -50%) translate(${n.x}px, ${n.y}px) scale(${0.82 + depth * 0.24})`,
                        zIndex: Math.round(depth * 20),
                        opacity: 0.55 + depth * 0.45,
                      }}
                    >
                      <span className="px-1 text-[9.5px] font-medium leading-tight">
                        {t.projects.nodes[n.key].title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
