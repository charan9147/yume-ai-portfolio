import { Quote, ShieldQuestion } from 'lucide-react';
import { useI18n } from '../i18n';
import Section from './Section';
import Reveal from './Reveal';

export default function About() {
  const { t } = useI18n();

  const facts = [
    { k: t.about.facts.based, v: `${t.about.facts.basedValue} 🇮🇳` },
    { k: t.about.facts.education, v: t.about.facts.educationValue },
    { k: t.about.facts.next, v: t.about.facts.nextValue },
    { k: t.about.facts.destination, v: `${t.about.facts.destinationValue} 🇯🇵` },
  ];

  return (
    <Section id="about" eyebrow={t.about.eyebrow} title={t.about.title} lead={t.about.lead}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-7">
          <Reveal>
            <blockquote className="relative rounded-3xl border border-gold/20 bg-gold/[0.04] p-6 sm:p-8">
              <Quote size={26} className="mb-4 text-gold/70" aria-hidden />
              <p className="font-display text-xl leading-snug text-cream/95 sm:text-2xl">
                {t.about.quote}
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="lead">{t.about.p1}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">{t.about.p2}</p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex items-start gap-3 rounded-2xl border border-cream/10 bg-white/[0.02] p-4">
              <ShieldQuestion size={18} className="mt-0.5 shrink-0 text-sun-soft" aria-hidden />
              <p className="text-[13px] leading-relaxed text-mist">{t.about.founderNote}</p>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={0.1}>
            <div className="glass overflow-hidden rounded-3xl">
              <div className="relative">
                <img
                  src="/assets/sai-charan-founder.jpg"
                  alt="Sai Charan, founder of YUME AI"
                  width={632}
                  height={580}
                  loading="lazy"
                  className="h-64 w-full object-cover object-center sm:h-72"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-4">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-gold">
                    {t.about.founderLabel}
                  </p>
                  <p className="mt-1 font-display text-2xl text-cream">{t.about.founderName}</p>
                  <p className="text-[11px] text-cream/60">{t.about.founderRole}</p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-px bg-cream/8">
                {facts.map((f) => (
                  <div key={f.k} className="bg-ink-2/80 p-4">
                    <dt className="text-[9px] uppercase tracking-[0.24em] text-faint">{f.k}</dt>
                    <dd className="mt-1 text-[13px] font-medium text-cream/90">{f.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-cream/8 px-4 py-3">
                <span className="text-[9px] uppercase tracking-[0.24em] text-faint">
                  {t.about.languagesLabel}
                </span>
                <span className="font-jp text-[12px] text-cream/80">{t.about.languages}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
