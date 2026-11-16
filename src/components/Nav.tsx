import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Globe, Menu, X } from 'lucide-react';
import { LANGUAGES, useI18n, type LangCode } from '../i18n';

const SECTIONS = [
  { id: 'about', key: 'about' },
  { id: 'mission', key: 'mission' },
  { id: 'projects', key: 'projects' },
  { id: 'robotics', key: 'robotics' },
  { id: 'research', key: 'research' },
  { id: 'budget', key: 'budget' },
  { id: 'contact', key: 'contact' },
] as const;

function LanguageMenu({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (code: LangCode) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.nav.language}: ${current.label}`}
        className={`group flex items-center gap-2 rounded-full border border-cream/12 bg-white/[0.03] px-3 py-2 text-xs text-cream/85 transition hover:border-gold/40 hover:text-cream ${
          compact ? 'w-full justify-between' : ''
        }`}
      >
        <Globe size={14} className="text-gold/80" aria-hidden />
        <span className="font-medium">{current.label}</span>
        <ChevronDown
          size={13}
          className={`opacity-60 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t.nav.language}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={`glass-strong absolute z-50 mt-2 max-h-[min(70vh,26rem)] overflow-y-auto rounded-2xl p-1.5 shadow-2xl ${
              compact ? 'left-0 right-0' : 'right-0 w-60'
            }`}
          >
            {LANGUAGES.map((l) => {
              const active = l.code === lang;
              return (
                <li key={l.code} role="none">
                  <button
                    role="option"
                    aria-selected={active}
                    onClick={() => pick(l.code)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-start text-sm transition ${
                      active ? 'bg-gold/10 text-cream' : 'text-mist hover:bg-white/5 hover:text-cream'
                    }`}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{l.label}</span>
                      <span className="truncate text-[10px] uppercase tracking-[0.18em] text-faint">
                        {l.english}
                        {l.dir === 'rtl' ? ' · RTL' : ''}
                      </span>
                    </span>
                    {active && <Check size={15} className="shrink-0 text-gold" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Nav() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sheet ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheet]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-cream/8 bg-ink/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-10 xl:ps-32"
        >
          <a href="#top" className="group flex items-center gap-3" aria-label="YUME AI — home">
            <span className="relative grid size-9 place-items-center rounded-full border border-sun/40 bg-sun/10">
              <span className="font-jp text-[15px] leading-none text-sun-soft">夢</span>
              <span className="absolute inset-0 rounded-full border border-sun/25 [animation:pulse-ring_4s_ease-out_infinite]" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[13px] font-semibold tracking-[0.32em] text-cream">YUME AI</span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.3em] text-faint">
                India × Japan
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="rounded-full px-3 py-2 text-[13px] text-mist transition hover:bg-white/5 hover:text-cream"
                >
                  {t.nav[s.key]}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageMenu />
            </div>
            <a
              href="#contact"
              className="hidden rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-gold transition hover:bg-gold/15 md:block"
            >
              {t.nav.contact}
            </a>
            <button
              type="button"
              onClick={() => setSheet(true)}
              aria-label={t.nav.menu}
              className="grid size-10 place-items-center rounded-full border border-cream/12 bg-white/[0.03] text-cream lg:hidden"
            >
              <Menu size={18} aria-hidden />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {sheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col p-5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold tracking-[0.32em] text-cream">YUME AI</span>
                <button
                  type="button"
                  onClick={() => setSheet(false)}
                  aria-label={t.nav.close}
                  className="grid size-10 place-items-center rounded-full border border-cream/12 text-cream"
                >
                  <X size={18} aria-hidden />
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-8 flex-1 overflow-y-auto">
                <ul className="flex flex-col gap-1">
                  {SECTIONS.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={() => setSheet(false)}
                        className="flex items-baseline justify-between border-b border-cream/8 py-3 text-2xl text-cream/90"
                      >
                        <span>{t.nav[s.key]}</span>
                        <span className="text-[10px] tracking-[0.3em] text-faint">
                          0{i + 1}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <p className="eyebrow mb-3">{t.nav.language}</p>
                  <LanguageMenu compact />
                </div>
              </nav>

              <a
                href="#contact"
                onClick={() => setSheet(false)}
                className="mt-6 rounded-full bg-gold py-3 text-center text-sm font-semibold text-ink"
              >
                {t.nav.contact}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
