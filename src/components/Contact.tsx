import { ArrowUpRight, Mail, MessageCircle, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n';
import Section from './Section';
import Reveal from './Reveal';

const EMAIL = 'ksaicharan961@gmail.com';
const WHATSAPP = '8977330221';

export default function Contact() {
  const { t } = useI18n();

  return (
    <Section id="contact" eyebrow={t.contact.eyebrow} title={t.contact.title} lead={t.contact.lead}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Reveal>
          <a
            href={`mailto:${EMAIL}?subject=YUME%20AI%20—%20hello`}
            className="group flex h-full min-w-0 items-center justify-between gap-4 rounded-3xl border border-cream/12 bg-white/[0.03] p-6 transition hover:border-gold/40 hover:bg-gold/[0.06]"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid size-12 place-items-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
                <Mail size={20} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.26em] text-faint">{t.contact.emailLabel}</p>
                <p className="mt-1 truncate text-[15px] font-medium text-cream">{EMAIL}</p>
              </div>
            </div>
            <ArrowUpRight size={18} className="shrink-0 text-cream/40 transition group-hover:text-gold" aria-hidden />
          </a>
        </Reveal>

        <Reveal delay={0.06}>
          <a
            href={`https://wa.me/91${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full min-w-0 items-center justify-between gap-4 rounded-3xl border border-cream/12 bg-white/[0.03] p-6 transition hover:border-jade/40 hover:bg-jade/[0.06]"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid size-12 place-items-center rounded-2xl border border-jade/25 bg-jade/10 text-jade">
                <MessageCircle size={20} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.26em] text-faint">{t.contact.waLabel}</p>
                <p className="mt-1 text-[15px] font-medium text-cream" dir="ltr">
                  +91 89773 30221
                </p>
              </div>
            </div>
            <ArrowUpRight size={18} className="shrink-0 text-cream/40 transition group-hover:text-jade" aria-hidden />
          </a>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cream/10 bg-ink-2/50 px-5 py-3.5 text-[11.5px]">
          <span className="flex items-center gap-2 text-cream/75">
            <Sparkles size={13} className="text-saffron" aria-hidden />
            {t.contact.availability}
          </span>
          <span className="text-faint">{t.contact.note}</span>
        </div>
      </Reveal>
    </Section>
  );
}
