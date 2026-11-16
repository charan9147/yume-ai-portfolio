import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import type { PointerEvent } from 'react';
import { ArrowDownRight, ArrowUpRight, MapPin } from 'lucide-react';
import { useI18n } from '../i18n';

export default function Hero() {
  const { t, isRTL } = useI18n();
  const reduce = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 18 });
  const sy = useSpring(py, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [8, -8]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-6, 6]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-20">
      {/* backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-veil absolute inset-0 opacity-60" />
        <div
          className="sun-disc animate-floaty absolute -top-[18%] end-[-14%] size-[46vw] min-w-[280px] max-w-[640px] opacity-70 blur-[2px] sm:opacity-80"
          style={{ aspectRatio: '1 / 1' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-ink" />
        <div className="absolute start-1/2 top-1/2 size-[52vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun/5 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-10 xl:ps-32">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.34em] text-faint"
            >
              <span className="font-jp text-base tracking-normal text-sun-soft">夢</span>
              <span className="h-px w-8 bg-cream/25" />
              <span>{t.hero.eyebrow}</span>
            </motion.div>

            <h1 className="font-display text-[clamp(2.7rem,7.4vw,5.6rem)] leading-[0.98] text-cream">
              {[t.hero.title1, t.hero.title2, t.hero.title3].map((line, i) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={reduce ? false : { opacity: 0, y: 26, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1, delay: 0.12 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                >
                  {i === 1 ? (
                    <span className="text-gradient-warm">{line}</span>
                  ) : i === 2 ? (
                    <span className="relative inline-block">
                      {line}
                      <span
                        aria-hidden
                        className="absolute -bottom-2 start-0 h-[3px] w-24 rounded-full bg-gradient-to-r from-sun via-saffron to-transparent"
                      />
                    </span>
                  ) : (
                    line
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="lead mt-7 max-w-xl"
            >
              {t.hero.lead}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.62 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a
                href="#mission"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition hover:bg-[#f0cf9d]"
              >
                {t.hero.cta1}
                <ArrowDownRight
                  size={16}
                  className={`transition-transform group-hover:translate-y-0.5 group-hover:-translate-x-0.5 ${
                    isRTL ? 'rotate-90' : ''
                  }`}
                  aria-hidden
                />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-6 py-3 text-sm text-cream/90 transition hover:border-cream/40 hover:bg-white/5"
              >
                {t.hero.cta2}
                <ArrowUpRight size={15} className="opacity-70" aria-hidden />
              </a>
            </motion.div>

            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-cream/10 pt-6 text-sm">
              {[
                { k: t.hero.origin, v: 'India 🇮🇳' },
                { k: t.hero.destination, v: 'Japan 🇯🇵' },
                { k: t.hero.focus, v: t.hero.focusValue },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="text-[10px] uppercase tracking-[0.26em] text-faint">{item.k}</dt>
                  <dd className="mt-1.5 text-[13px] font-medium text-cream/90">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* portrait */}
          <div className="lg:col-span-5">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onPointerMove={onMove}
              onPointerLeave={() => {
                px.set(0);
                py.set(0);
              }}
              style={{ rotateX, rotateY, transformPerspective: 1000 }}
              className="relative mx-auto w-full max-w-[26rem] [transform-style:preserve-3d]"
            >
              <div className="absolute -inset-5 -z-10 rounded-[2.4rem] bg-gradient-to-br from-sun/25 via-transparent to-blue/20 blur-2xl" />

              <div className="glass relative overflow-hidden rounded-[2rem] p-2 shadow-[0_40px_120px_-60px_rgba(226,59,52,0.7)]">
                <div className="relative overflow-hidden rounded-[1.6rem]">
                  <img
                    src="/assets/sai-charan-portrait.jpg"
                    alt="Sai Charan"
                    width={1600}
                    height={1017}
                    loading="eager"
                    fetchPriority="high"
                    className="aspect-[4/5] w-full object-cover object-[52%_28%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

                  <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
                    <span className="rounded-full border border-cream/15 bg-ink/55 px-3 py-1 text-[9px] uppercase tracking-[0.24em] text-cream/85 backdrop-blur">
                      {t.hero.online}
                    </span>
                    <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[9px] uppercase tracking-[0.24em] text-gold backdrop-blur">
                      夢 / YUME AI
                    </span>
                  </div>

                  <div className="absolute inset-x-4 bottom-4">
                    <p className="font-display text-2xl leading-none text-cream">{t.about.founderName}</p>
                    <p className="mt-1.5 text-[10px] uppercase tracking-[0.26em] text-cream/60">
                      AI · ML · NLP · Robotics
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                className="glass absolute -start-4 top-1/3 hidden rounded-2xl px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-cream/80 sm:block"
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MapPin size={12} className="mb-1 text-saffron" aria-hidden />
                {t.hero.destination} · 35.68° N
              </motion.div>

              <motion.div
                className="glass absolute -end-3 bottom-16 hidden rounded-2xl px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-cream/80 sm:block"
                animate={reduce ? undefined : { y: [0, 7, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              >
                <span className="block font-jp text-sm text-sun-soft">夢</span>
                {t.hero.tagline.split('·')[0].trim()}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-5 text-[10px] uppercase tracking-[0.26em] text-faint sm:flex-row sm:items-center">
          <span className="tabular-nums">{t.hero.coords}</span>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">{t.hero.tagline}</span>
            <a href="#about" className="flex items-center gap-2 text-cream/70 hover:text-cream">
              {t.hero.scroll}
              <span className="relative block h-8 w-px overflow-hidden bg-cream/20">
                <motion.span
                  className="absolute inset-x-0 top-0 h-3 bg-gold"
                  animate={reduce ? undefined : { y: [-12, 32] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
