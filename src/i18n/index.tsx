import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import en, { type Messages } from './en';
import { dictionaries } from './dictionaries';

export type LangCode =
  | 'en'
  | 'te'
  | 'ja'
  | 'pt'
  | 'hi'
  | 'sa'
  | 'ur'
  | 'zh'
  | 'es'
  | 'ar'
  | 'fr'
  | 'bn'
  | 'ru'
  | 'de'
  | 'ko';

export const LANGUAGES: { code: LangCode; label: string; english: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', english: 'English', dir: 'ltr' },
  { code: 'te', label: 'తెలుగు', english: 'Telugu', dir: 'ltr' },
  { code: 'ja', label: '日本語', english: 'Japanese', dir: 'ltr' },
  { code: 'pt', label: 'Português', english: 'Portuguese', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', english: 'Hindi', dir: 'ltr' },
  { code: 'sa', label: 'संस्कृतम्', english: 'Sanskrit', dir: 'ltr' },
  { code: 'ur', label: 'اردو', english: 'Urdu', dir: 'rtl' },
  { code: 'zh', label: '中文', english: 'Chinese', dir: 'ltr' },
  { code: 'es', label: 'Español', english: 'Spanish', dir: 'ltr' },
  { code: 'ar', label: 'العربية', english: 'Arabic', dir: 'rtl' },
  { code: 'fr', label: 'Français', english: 'French', dir: 'ltr' },
  { code: 'bn', label: 'বাংলা', english: 'Bengali', dir: 'ltr' },
  { code: 'ru', label: 'Русский', english: 'Russian', dir: 'ltr' },
  { code: 'de', label: 'Deutsch', english: 'German', dir: 'ltr' },
  { code: 'ko', label: '한국어', english: 'Korean', dir: 'ltr' },
];

const STORAGE_KEY = 'yume:lang';

const SCRIPT_FONTS: Partial<Record<LangCode, string>> = {
  te: 'Noto+Sans+Telugu:wght@400;500;600',
  hi: 'Noto+Sans+Devanagari:wght@400;500;600',
  sa: 'Noto+Sans+Devanagari:wght@400;500;600',
  ur: 'Noto+Nastaliq+Urdu:wght@400;600',
  ar: 'Noto+Naskh+Arabic:wght@400;500;600',
  bn: 'Noto+Sans+Bengali:wght@400;500;600',
  zh: 'Noto+Sans+SC:wght@300;400;500',
  ko: 'Noto+Sans+KR:wght@300;400;500',
  ja: 'Noto+Sans+JP:wght@300;400;500',
};

const loadedFonts = new Set<LangCode>();

export function ensureScriptFont(code: LangCode) {
  const family = SCRIPT_FONTS[code];
  if (!family || loadedFonts.has(code)) return;
  loadedFonts.add(code);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

function detectLanguage(): LangCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) return saved;
  } catch {
    /* storage can be blocked */
  }
  const nav = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  const prefix = nav.split('-')[0] as LangCode;
  return LANGUAGES.some((l) => l.code === prefix) ? prefix : 'en';
}

type Ctx = {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  t: Messages;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() =>
    typeof window === 'undefined' ? 'en' : detectLanguage()
  );

  const dir = LANGUAGES.find((l) => l.code === lang)?.dir ?? 'ltr';

  useEffect(() => {
    const html = document.documentElement;
    const meta = LANGUAGES.find((l) => l.code === lang);
    html.lang = lang;
    html.dir = dir;
    html.dataset.lang = lang;
    document.title = dictionaries[lang].meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', dictionaries[lang].meta.description);
    ensureScriptFont(lang);
    if (meta) {
      const canonical = document.querySelector('link[rel="canonical"]');
      canonical?.setAttribute('href', `https://yume-ai.pages.dev/`);
    }
  }, [lang, dir]);

  const setLang = useCallback((code: LangCode) => {
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: dictionaries[lang] ?? en,
      dir,
      isRTL: dir === 'rtl',
    }),
    [lang, setLang, dir]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useI18n must be used inside LanguageProvider');
  return ctx;
}

export type { Messages };
