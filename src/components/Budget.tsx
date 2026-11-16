import { useMemo, useState } from 'react';
import { Calculator, Info } from 'lucide-react';
import { useI18n } from '../i18n';
import Section from './Section';
import Reveal from './Reveal';
import {
  estimate,
  formatLakh,
  type ProjectKey,
  type ScopeKey,
  type TimelineKey,
} from '../lib/budget';

type GroupProps<T extends string> = {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
};

function Group<T extends string>({ label, options, value, onChange }: GroupProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 text-[9.5px] uppercase tracking-[0.26em] text-faint">{label}</legend>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={`rounded-full border px-3.5 py-1.5 text-[12px] transition ${
                active
                  ? 'border-gold/60 bg-gold/15 text-gold'
                  : 'border-cream/12 bg-white/[0.02] text-cream/70 hover:border-cream/25 hover:text-cream'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function Budget() {
  const { t } = useI18n();
  const [project, setProject] = useState<ProjectKey>('tutor');
  const [scope, setScope] = useState<ScopeKey>('prototype');
  const [timeline, setTimeline] = useState<TimelineKey>('m6');

  const est = useMemo(() => estimate(project, scope, timeline), [project, scope, timeline]);

  const stageKeys = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'] as const;

  return (
    <Section id="budget" eyebrow={t.budget.eyebrow} title={t.budget.title} lead={t.budget.lead}>
      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className="rounded-3xl border border-cream/10 bg-ink-2/60 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Calculator size={16} className="text-gold" aria-hidden />
              <h3 className="font-display text-xl text-cream">{t.budget.resultTitle}</h3>
            </div>

            <div className="mt-6 space-y-5">
              <Group
                label={t.budget.fields.project}
                value={project}
                onChange={setProject}
                options={[
                  { value: 'tutor', label: t.budget.types.tutor },
                  { value: 'companion', label: t.budget.types.companion },
                  { value: 'bridge', label: t.budget.types.bridge },
                  { value: 'research', label: t.budget.types.research },
                ]}
              />
              <Group
                label={t.budget.fields.scope}
                value={scope}
                onChange={setScope}
                options={[
                  { value: 'demo', label: t.budget.scopes.demo },
                  { value: 'prototype', label: t.budget.scopes.prototype },
                  { value: 'pilot', label: t.budget.scopes.pilot },
                ]}
              />
              <Group
                label={t.budget.fields.timeline}
                value={timeline}
                onChange={setTimeline}
                options={[
                  { value: 'm3', label: t.budget.timelines.m3 },
                  { value: 'm6', label: t.budget.timelines.m6 },
                  { value: 'm12', label: t.budget.timelines.m12 },
                ]}
              />
            </div>

            <div
              aria-live="polite"
              className="mt-7 rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/[0.1] to-transparent p-5"
            >
              <p className="text-[9px] uppercase tracking-[0.26em] text-gold">{t.budget.resultTitle}</p>
              <p className="mt-2 font-display text-[2rem] leading-none text-cream tabular-nums sm:text-[2.4rem]">
                {formatLakh(est.minLakh)}
                <span className="mx-2 text-cream/40">–</span>
                {formatLakh(est.maxLakh)}
              </p>
              <p className="mt-2 text-[11.5px] text-cream/60">
                {formatLakh(est.monthlyMinLakh)} – {formatLakh(est.monthlyMaxLakh)} {t.budget.monthly}
              </p>
            </div>

            <p className="mt-4 flex gap-2 text-[11px] leading-relaxed text-faint">
              <Info size={14} className="mt-0.5 shrink-0 text-sun-soft" aria-hidden />
              <span>{t.budget.resultNote}</span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-5">
          <div className="flex h-full flex-col rounded-3xl border border-sun/20 bg-sun/[0.05] p-6 sm:p-8">
            <span className="inline-flex w-fit rounded-full border border-sun/30 bg-sun/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-sun-soft">
              {t.ui.notQuote}
            </span>
            <p className="mt-4 text-[13px] leading-relaxed text-cream/80">{t.budget.disclaimer}</p>
            <div className="mt-6 space-y-2 border-t border-cream/10 pt-5 text-[11.5px] text-cream/55">
              <p>{t.budget.fields.project} · {t.budget.types[project]}</p>
              <p>{t.budget.fields.scope} · {t.budget.scopes[scope]}</p>
              <p>{t.budget.fields.timeline} · {t.budget.timelines[timeline]}</p>
            </div>
            <p className="mt-auto pt-6 text-[10px] uppercase tracking-[0.24em] text-faint">
              YUME AI · 夢
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-14">
        <Reveal>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <h3 className="font-display text-2xl text-cream">{t.budget.stagesTitle}</h3>
            <p className="max-w-xl text-[11.5px] text-faint">{t.budget.stagesLead}</p>
          </div>
        </Reveal>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stageKeys.map((key, i) => {
            const stage = t.budget.stages[key];
            return (
              <Reveal key={key} delay={i * 0.03} as="li">
                <div className="h-full rounded-2xl border border-cream/10 bg-white/[0.02] p-5 transition hover:border-gold/25 hover:bg-white/[0.04]">
                  <span className="font-display text-xl text-gold/60 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="mt-2 text-[13.5px] font-semibold text-cream">{stage.title}</h4>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-mist">{stage.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
