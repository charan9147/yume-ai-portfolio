import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

type Mode = 'idle' | 'point' | 'wave';

export default function Robot({ chatOpen }: { chatOpen: boolean }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });
  const top = useTransform(smooth, [0, 1], ['16vh', '64vh']);
  const [mode, setMode] = useState<Mode>('idle');
  const [ready, setReady] = useState(false);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  // On narrow screens there is no left rail to walk in, so the mascot docks
  // above the footer and bobs instead of crossing the text column.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const targets: { el: Element | null; mode: Mode }[] = [
      { el: document.querySelector('#projects'), mode: 'point' },
      { el: document.querySelector('#footer'), mode: 'wave' },
    ];
    const observed = targets.filter((x): x is { el: Element; mode: Mode } => Boolean(x.el));
    if (!observed.length) return;

    const visible = new Map<Element, Mode>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const found = observed.find((o) => o.el === e.target);
          if (!found) continue;
          if (e.isIntersecting) visible.set(e.target, found.mode);
          else visible.delete(e.target);
        }
        const modes = [...visible.values()];
        setMode(modes.includes('wave') ? 'wave' : modes.includes('point') ? 'point' : 'idle');
      },
      { rootMargin: '-30% 0px -25% 0px' }
    );
    observed.forEach((o) => io.observe(o.el));
    return () => io.disconnect();
  }, []);

  const waving = mode === 'wave';
  const pointing = mode === 'point';
  const arm = waving ? [-8, -62, -8] : pointing ? -58 : -6;

  return (
    <motion.div
      aria-hidden="true"
      style={reduce || !wide ? undefined : { top }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : -30 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-none fixed z-40 select-none ${
        wide ? 'start-4' : 'bottom-24 start-3 sm:bottom-28 sm:start-4'
      }`}
    >
      <div className="relative">
        {waving && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass absolute bottom-[calc(100%+6px)] start-1 w-max rounded-2xl rounded-bs-sm px-3 py-2 text-[10px] leading-tight text-cream/90"
          >
            <span className="block font-jp text-[11px] text-gold">ありがとう！</span>
            <span className="block text-[9px] uppercase tracking-[0.18em] text-faint">YUME AI</span>
          </motion.div>
        )}

        <motion.div
          animate={
            reduce
              ? undefined
              : waving
                ? { y: [0, -6, 0], rotate: [-2, 2, -2] }
                : { y: [0, -5, 0] }
          }
          transition={{ duration: waving ? 1.1 : 3.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[64px] sm:w-[74px] xl:w-24"
        >
          <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
            <defs>
              <linearGradient id="robotBody" x1="24" y1="52" x2="96" y2="122" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FBF6EC" />
                <stop offset="0.55" stopColor="#DFD4C0" />
                <stop offset="1" stopColor="#A99B84" />
              </linearGradient>
              <linearGradient id="robotVisor" x1="34" y1="28" x2="86" y2="66" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1B1A24" />
                <stop offset="1" stopColor="#08080D" />
              </linearGradient>
              <radialGradient id="eyeGlow" cx="0.5" cy="0.5" r="0.5">
                <stop stopColor="#FFE7B8" />
                <stop offset="1" stopColor="#E6C07B" />
              </radialGradient>
              <radialGradient id="thruster" cx="0.5" cy="0.5" r="0.5">
                <stop stopColor="#FF9B7A" stopOpacity="0.9" />
                <stop offset="1" stopColor="#E23B34" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* thruster glow */}
            <ellipse cx="60" cy="130" rx="30" ry="9" fill="url(#thruster)" opacity={waving ? 0.95 : 0.6} />

            {/* antenna */}
            <motion.g
              animate={reduce ? undefined : { rotate: chattingRotate(chatOpen) }}
              transition={{ duration: 0.5 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }}
            >
              <path d="M60 26V12" stroke="#8C8677" strokeWidth="2" strokeLinecap="round" />
              <circle cx="60" cy="9" r="4.5" fill={chatOpen ? '#FFD79A' : '#E23B34'} />
              <circle cx="60" cy="9" r="8" fill={chatOpen ? '#FFD79A' : '#E23B34'} opacity="0.18" />
            </motion.g>

            {/* head */}
            <rect x="22" y="26" width="76" height="50" rx="20" fill="url(#robotBody)" />
            <rect x="30" y="33" width="60" height="33" rx="14" fill="url(#robotVisor)" />
            <g className="[animation:blink_6s_infinite]" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx="47" cy="49" r="4.6" fill="url(#eyeGlow)" />
              <circle cx="73" cy="49" r="4.6" fill="url(#eyeGlow)" />
            </g>
            <path d="M52 59c2.6 2 6.4 2 9 0" stroke="#E6C07B" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />

            {/* ears */}
            <rect x="14" y="41" width="8" height="18" rx="4" fill="#B9AE99" />
            <rect x="98" y="41" width="8" height="18" rx="4" fill="#B9AE99" />

            {/* neck */}
            <rect x="53" y="74" width="14" height="7" rx="3" fill="#9A9080" />

            {/* left arm */}
            <g>
              <rect x="14" y="86" width="11" height="26" rx="5.5" fill="url(#robotBody)" />
              <circle cx="19.5" cy="114" r="5.5" fill="#CFC4AF" />
            </g>

            {/* right arm (points / waves) */}
            <motion.g
              animate={reduce ? undefined : { rotate: arm }}
              transition={
                waving
                  ? { duration: 0.95, repeat: Infinity, ease: 'easeInOut' }
                  : { type: 'spring', stiffness: 90, damping: 12 }
              }
              style={{ transformBox: 'fill-box', transformOrigin: 'top left' }}
            >
              <rect x="95" y="84" width="11" height="28" rx="5.5" fill="url(#robotBody)" />
              <circle cx="100.5" cy="114" r="6" fill="#CFC4AF" />
              <circle cx="100.5" cy="114" r="2.4" fill="#E6C07B" opacity="0.85" />
            </motion.g>

            {/* body */}
            <rect x="27" y="80" width="66" height="44" rx="16" fill="url(#robotBody)" />
            <rect x="39" y="90" width="42" height="24" rx="9" fill="#14131B" />
            <text
              x="60"
              y="107.5"
              textAnchor="middle"
              fill="#E6C07B"
              fontSize="13"
              fontFamily="'Noto Serif JP', serif"
            >
              夢
            </text>
            <circle cx="60" cy="80" r="2" fill="#1F9D55" />
            <circle cx="86" cy="72" r="2.6" fill="#FF9933" opacity="0.9" />
            <circle cx="34" cy="72" r="2.6" fill="#5AA9FF" opacity="0.9" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

function chattingRotate(chatOpen: boolean) {
  return chatOpen ? [0, -12, 0] : 0;
}
