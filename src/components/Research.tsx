import { ArrowRight, Compass } from 'lucide-react';
import { useI18n } from '../i18n';
import Section from './Section';
import Reveal from './Reveal';

export default function Research() {
  const { t, isRTL } = useI18n();

  const interests = ['ai', 'ml', 'nlp', 'robotics', 'mechatronics', 'hri'] as const;
  const timeline = ['t1', 't2', 't3', 't4'] as const;
  const statusStyles: Record<string, string> = {
    t1: 'border-jade/30 bg-jade/10 text-jade',
    t2: 'border-gold/30 bg-gold/10 text-gold',
    t3: 'border-saffron/30 bg-saffron/10 text-saffron',
    t4: 'border-blue/30 bg-blue/10 text-blue',
  };
  const statusLabels: Record<string, string> = {
    t1: t.ui.inProgress,
    t2: t.ui.planned,
    t3: t.ui.planned,
    t4: t.ui.vision,
  };

  return (
    <Section
      id="research"
      eyebrow={t.research.eyebrow}
      title={t.research.title}
      lead={t.research.lead}
      className="bg-gradient-to-b from-transparent via-ink-2/40 to-transparent"
    >
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((key, i) => {
          const item = t.research.interests[key];
          return (
            <Reveal key={key} delay={i * 0.04} as="li">
              <div className="flex h-full gap-4 rounded-2xl border border-cream/10 bg-white/[0.02] p-5 transition hover:border-gold/25 hover:bg-white/[0.04]">
                <span className="mt-0.5 font-display text-lg text-gold/60 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[14px] font-semibold text-cream">{item.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-mist">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>

      <div className="mt-14">
        <Reveal>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <h3 className="font-display text-2xl text-cream">{t.research.timelineTitle}</h3>
            <p className="max-w-xl text-[11.5px] leading-relaxed text-faint">{t.research.timelineNote}</p>
          </div>
        </Reveal>

        <ol className="grid gap-3 lg:grid-cols-4">
          {timeline.map((key, i) => {
            const item = t.research.timeline[key];
            return (
              <Reveal key={key} delay={i * 0.06} as="li">
                <div className="relative flex h-full flex-col rounded-2xl border border-cream/10 bg-ink-2/70 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-2xl text-cream/90">{item.when}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.16em] ${statusStyles[key]}`}
                    >
                      {statusLabels[key]}
                    </span>
                  </div>
                  <p className="mt-3 text-[9.5px] uppercase tracking-[0.24em] text-faint">{item.stage}</p>
                  <h4 className="mt-1 text-[15px] font-semibold text-cream">{item.title}</h4>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-mist">{item.desc}</p>
                  {i < timeline.length - 1 && (
                    <ArrowRight
                      size={14}
                      className={`absolute -end-[13px] top-1/2 hidden text-cream/20 lg:block ${isRTL ? 'scale-x-[-1]' : ''}`}
                      aria-hidden
                    />
                  )}
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>

      <Reveal delay={0.06}>
        <div className="mt-4 grid gap-6 rounded-3xl border border-sun/20 bg-gradient-to-br from-sun/[0.07] via-ink-2/60 to-blue/[0.05] p-6 sm:p-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-sun-soft" aria-hidden />
              <h3 className="font-display text-2xl text-cream">{t.research.japanTitle}</h3>
            </div>
            <p className="lead mt-3 text-[14px]">{t.research.japanLead}</p>
            <p className="mt-4 rounded-xl border border-cream/10 bg-ink/40 px-4 py-3 text-[11.5px] leading-relaxed text-cream/60">
              {t.research.japanNote}
            </p>
          </div>
          <div className="lg:col-span-5 lg:border-s lg:border-cream/10 lg:ps-6">
            <ol className="space-y-3">
              {[
                { flag: '🇮🇳', label: 'India' },
                { flag: '🇯🇵', label: 'Japanese language' },
                { flag: '🎓', label: 'KOSEN / MEXT' },
                { flag: '🔬', label: 'Undergraduate research' },
                { flag: '🤖', label: 'AI & robotics engineer' },
              ].map((step, i) => (
                <li key={step.label} className="flex items-center gap-3">
                  <span className="grid size-7 place-items-center rounded-full border border-cream/10 bg-ink/50 text-[12px]">
                    {step.flag}
                  </span>
                  <span className="text-[12.5px] text-cream/80">{step.label}</span>
                  {i < 4 && <span className="ms-auto h-px flex-1 bg-cream/10" aria-hidden />}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
