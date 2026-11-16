import { BrainCircuit, Check, Ear, HeartHandshake, Sparkles, X } from 'lucide-react';
import { useI18n } from '../i18n';
import Section from './Section';
import Reveal from './Reveal';

export default function Mission() {
  const { t } = useI18n();

  const pillars = [
    { key: 'listen', icon: Ear, css: 'text-blue', ring: 'group-hover:border-blue/40', glow: 'from-blue/25' },
    { key: 'understand', icon: BrainCircuit, css: 'text-gold', ring: 'group-hover:border-gold/40', glow: 'from-gold/25' },
    { key: 'act', icon: Sparkles, css: 'text-saffron', ring: 'group-hover:border-saffron/40', glow: 'from-saffron/25' },
    { key: 'care', icon: HeartHandshake, css: 'text-sun-soft', ring: 'group-hover:border-sun/40', glow: 'from-sun/25' },
  ] as const;

  return (
    <Section id="mission" eyebrow={t.mission.eyebrow} title={t.mission.title} lead={t.mission.lead}>
      <div className="grid gap-4 sm:grid-cols-2">
        {pillars.map(({ key, icon: Icon, css, ring, glow }, i) => {
          const p = t.mission.pillars[key];
          return (
            <Reveal key={key} delay={i * 0.06} as="article">
              <div
                className={`group relative h-full overflow-hidden rounded-3xl border border-cream/10 bg-white/[0.025] p-6 transition duration-500 hover:bg-white/[0.045] sm:p-7 ${ring}`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -end-16 -top-16 size-48 rounded-full bg-gradient-to-br ${glow} to-transparent opacity-0 blur-2xl transition duration-700 group-hover:opacity-100`}
                />
                <div className="flex items-start justify-between gap-4">
                  <span className={`grid size-11 place-items-center rounded-2xl border border-current/20 bg-current/5 ${css}`}>
                    <Icon size={20} aria-hidden />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.28em] text-faint">{p.n}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl text-cream">{p.name}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-mist">{p.desc}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {p.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-cream/10 bg-ink/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-cream/60"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-6 grid gap-4 rounded-3xl border border-cream/10 bg-ink-2/60 p-6 sm:grid-cols-2 sm:p-8">
          <div className="flex gap-3">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-jade/30 bg-jade/10 text-jade">
              <Check size={15} aria-hidden />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-jade">{t.mission.whatIsTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-cream/85">{t.mission.whatIs}</p>
            </div>
          </div>
          <div className="flex gap-3 sm:border-s sm:border-cream/10 sm:ps-6">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-sun/30 bg-sun/10 text-sun-soft">
              <X size={15} aria-hidden />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-sun-soft">{t.mission.whatNotTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-cream/85">{t.mission.whatNot}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
