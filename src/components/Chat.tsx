import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useI18n } from '../i18n';
import { matchIntent, scriptedAnswer } from '../lib/brain';

type Msg = { id: number; role: 'bot' | 'user'; text: string; note?: string };

let seq = 0;

export default function Chat({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // Greeting follows the active language until the visitor has written something.
  useEffect(() => {
    setMessages((prev) => {
      if (prev.some((m) => m.role === 'user')) return prev;
      const greeting: Msg = { id: ++seq, role: 'bot', text: t.chat.greeting };
      return prev.length ? [greeting, ...prev.slice(1)] : [greeting];
    });
  }, [t.chat.greeting]);

  useEffect(() => {
    onOpenChange?.(open);
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 260);
      return () => window.clearTimeout(id);
    }
  }, [open, onOpenChange]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, pending]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        fabRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const push = (msg: Omit<Msg, 'id'>) => setMessages((prev) => [...prev, { ...msg, id: ++seq }]);

  const askAi = async (question: string) => {
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: question.slice(0, 400), lang }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { answer?: string };
      if (!data.answer) throw new Error('empty');
      push({ role: 'bot', text: data.answer, note: t.chat.aiNote });
    } catch {
      push({ role: 'bot', text: t.chat.fallback });
    } finally {
      window.clearTimeout(timer);
      setPending(false);
    }
  };

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || pending) return;
    push({ role: 'user', text });
    setInput('');
    setShowSuggestions(false);
    setPending(true);

    const intent = matchIntent(text);
    if (intent) {
      window.setTimeout(() => {
        push({ role: 'bot', text: scriptedAnswer(intent, t) });
        setPending(false);
      }, 520);
      return;
    }
    void askAi(text);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label={`${t.chat.title} — ${t.chat.subtitle}`}
            className="glass-strong fixed bottom-[5.5rem] end-4 z-[70] flex h-[min(72vh,34rem)] w-[min(92vw,23rem)] flex-col overflow-hidden rounded-3xl shadow-2xl sm:end-6"
          >
            <header className="flex items-center gap-3 border-b border-cream/10 bg-white/[0.03] px-4 py-3">
              <span className="relative grid size-9 place-items-center rounded-full border border-gold/30 bg-gold/10">
                <span className="font-jp text-[13px] text-gold">夢</span>
                <span className="absolute -end-0.5 -top-0.5 size-2 rounded-full bg-jade ring-2 ring-ink" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-cream">{t.chat.title}</p>
                <p className="truncate text-[10px] text-faint">{t.chat.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  fabRef.current?.focus();
                }}
                aria-label={t.chat.close}
                className="grid size-8 place-items-center rounded-full text-cream/70 transition hover:bg-white/5 hover:text-cream"
              >
                <X size={16} aria-hidden />
              </button>
            </header>

            <div
              ref={listRef}
              role="log"
              aria-live="polite"
              aria-label={t.chat.title}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed ${
                      m.role === 'user'
                        ? 'rounded-ee-md bg-gold text-ink'
                        : 'rounded-es-md border border-cream/10 bg-white/[0.04] text-cream/90'
                    }`}
                  >
                    {m.text}
                    {m.note && (
                      <span className="mt-1.5 flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] opacity-55">
                        <Sparkles size={9} aria-hidden />
                        {m.note}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {pending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-es-md border border-cream/10 bg-white/[0.04] px-3.5 py-3">
                    <span className="sr-only">{t.chat.typing}</span>
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="size-1.5 rounded-full bg-cream/70 [animation:dot-bounce_1.2s_infinite]"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {showSuggestions && (
                <div className="space-y-1.5 pt-1">
                  {t.chat.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="block w-full rounded-xl border border-cream/10 bg-ink/40 px-3 py-2 text-start text-[11.5px] text-cream/70 transition hover:border-gold/40 hover:text-cream"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="border-t border-cream/10 bg-ink/60 p-3"
            >
              <div className="flex items-center gap-2 rounded-full border border-cream/12 bg-white/[0.03] py-1.5 pe-1.5 ps-3.5">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.chat.placeholder}
                  aria-label={t.chat.placeholder}
                  maxLength={400}
                  className="min-w-0 flex-1 bg-transparent text-[12.5px] text-cream placeholder:text-faint focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || pending}
                  aria-label={t.chat.send}
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-gold text-ink transition disabled:opacity-35"
                >
                  <Send size={14} className="rtl:scale-x-[-1]" aria-hidden />
                </button>
              </div>
              <p className="mt-2 px-1 text-[9px] leading-relaxed text-faint">{t.chat.disclaimer}</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={fabRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t.chat.close : t.chat.open}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
        className="fixed bottom-4 end-4 z-[70] grid size-14 place-items-center rounded-full border border-gold/40 bg-ink text-gold shadow-[0_18px_50px_-18px_rgba(230,192,123,0.65)] transition hover:bg-gold hover:text-ink sm:bottom-6 sm:end-6"
      >
        {open ? <X size={20} aria-hidden /> : <MessageCircle size={21} aria-hidden />}
        {!open && (
          <span className="absolute -end-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-sun text-[8px] font-bold text-white">
            1
          </span>
        )}
      </motion.button>
    </>
  );
}
