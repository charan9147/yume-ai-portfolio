import { HeartPulse, MoveRight, Sprout, Waves } from 'lucide-react';
import { useI18n } from '../i18n';
import Section from './Section';
import Reveal from './Reveal';

export default function Robotics() {
  const { t, isRTL } = useI18n();

  const cases = [
    { key: 'care', icon: HeartPulse, color: 'text-sun-soft', ring: 'border-sun/25 bg-sun/10' },
    { key: 'disaster', icon: Waves, color: 'text-blue', ring: 'border-blue/25 bg-blue/10' },
    { key: 'field', icon: Sprout, color: 'text-jade', ring: 'border-jade/25 bg-jade/10' },
  ] as const;

  return (
    <Section id="robotics" eyebrow={t.robotics.eyebrow} title={t.robotics.title} lead={t.robotics.lead}>
      <Reveal>
        <div className="rounded-3xl border border-cream/10 bg-ink-2/60 p-5 sm:p-6">
          <p className="eyebrow mb-5">{t.robotics.pipelineTitle}</p>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 sm:flex-nowrap">
            {t.robotics.pipeline.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="flex items-center gap-2.5 rounded-full border border-cream/10 bg-white/[0.03] px-3.5 py-2">
                  <span className="grid size-5 place-items-center rounded-full bg-gold/15 text-[9px] font-bold text-gold">
                    {i + 1}
                  </span>
                  <span className="text-[12px] font-medium text-cream/85">{step}</span>
                </span>
                {i < t.robotics.pipeline.length - 1 && (
                  <MoveRight
                    size={15}
                    className={`text-cream/25 ${isRTL ? 'scale-x-[-1]' : ''} ${i === 2 ? 'hidden sm:block' : ''}`}
                    aria-hidden
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {cases.map(({ key, icon: Icon, color, ring }, i) => {
          const item = t.robotics.useCases[key];
          return (
            <Reveal key={key} delay={0.06 * i} as="article">
              <div className="group h-full rounded-3xl border border-cream/10 bg-white/[0.025] p-6 transition duration-500 hover:border-cream/20 hover:bg-white/[0.045]">
                <div className="flex items-start justify-between">
                  <span className={`grid size-11 place-items-center rounded-2xl border ${ring} ${color}`}>
                    <Icon size={20} aria-hidden />
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-faint">{item.tag}</span>
                </div>
                <h3 className="mt-5 font-display text-xl text-cream">{item.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-mist">{item.desc}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
