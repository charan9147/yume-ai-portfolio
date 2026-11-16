import type { ReactNode } from 'react';
import Reveal from './Reveal';

type Props = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'warm';
};

export default function Section({ id, eyebrow, title, lead, children, className = '', tone = 'default' }: Props) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-20 sm:py-24 lg:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-10 xl:ps-32">
        <Reveal>
          <div className="mb-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.34em] text-faint">
            <span className={tone === 'warm' ? 'text-sun-soft' : 'text-gold'}>✦</span>
            <span>{eyebrow}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-cream/15 to-transparent" />
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <h2 className="font-display text-[clamp(1.9rem,4.2vw,3.3rem)] leading-[1.06] text-cream">
              {title}
            </h2>
          </Reveal>
          {lead && (
            <Reveal delay={0.08} className="lg:col-span-5 lg:pt-2">
              <p className="lead lg:text-[15px]">{lead}</p>
            </Reveal>
          )}
        </div>

        <div className="mt-10 sm:mt-12">{children}</div>
      </div>
    </section>
  );
}
