import { ArrowUp, Github, Mail, MessageCircle } from 'lucide-react';
import { LANGUAGES, useI18n } from '../i18n';

const EMAIL = 'ksaicharan961@gmail.com';
const WHATSAPP = '+91 89773 30221';

export default function Footer() {
  const { t, lang } = useI18n();
  const year = new Date().getFullYear();
  const language = LANGUAGES.find((l) => l.code === lang);

  return (
    <footer
      id="footer"
      className="relative isolate overflow-hidden scroll-mt-24 border-t border-cream/10 pt-20 pb-10 sm:pt-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-sun/[0.09] via-transparent to-transparent" />
        <div className="sun-disc start-1/2 size-[34rem] max-w-[90vw] -translate-x-1/2 translate-y-[62%] opacity-30 blur-sm" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-[88rem] px-4 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-jp text-[13px] tracking-[0.18em] text-gold/85">{t.footer.thanksJa}</p>

          <h2 className="mt-5 font-display text-[clamp(2rem,5.4vw,3.9rem)] leading-[1.05] text-cream">
            {t.footer.thanks}
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-[12.5px] leading-relaxed text-mist">{t.footer.note}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-white/[0.03] px-4 py-2 text-[12px] text-cream/85 transition hover:border-gold/40 hover:text-cream"
            >
              <Mail size={14} className="text-gold" aria-hidden />
              {EMAIL}
            </a>
            <a
              href="https://wa.me/918977330221"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-white/[0.03] px-4 py-2 text-[12px] text-cream/85 transition hover:border-jade/40 hover:text-cream"
            >
              <MessageCircle size={14} className="text-jade" aria-hidden />
              <span dir="ltr">{WHATSAPP}</span>
            </a>
            <a
              href="https://github.com/charan9147"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-white/[0.03] px-4 py-2 text-[12px] text-cream/85 transition hover:border-cream/35 hover:text-cream"
            >
              <Github size={14} aria-hidden />
              GitHub
            </a>
          </div>

          <div className="hairline mx-auto mt-10 max-w-md" />

          <div className="mt-6 flex flex-col items-center gap-4 text-[10.5px] text-faint sm:flex-row sm:justify-between">
            <p className="text-center sm:text-start">
              © {year} {t.footer.rights} · {t.ui.allRights}
            </p>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline">{language?.label ?? 'English'}</span>
              <span aria-hidden className="hidden text-cream/20 sm:inline">
                ·
              </span>
              <span>夢 · ありがとう</span>
              <a
                href="#top"
                className="group inline-flex items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1.5 text-cream/75 transition hover:border-gold/40 hover:text-gold"
              >
                {t.footer.top}
                <ArrowUp size={12} className="transition group-hover:-translate-y-0.5" aria-hidden />
              </a>
            </div>
          </div>

          <p className="mt-5 text-[9.5px] uppercase tracking-[0.24em] text-cream/30">{t.footer.built}</p>
        </div>
      </div>
    </footer>
  );
}
