import en, { type Messages } from './en';
import { merge } from './merge';
import te from './locales/te';
import ja from './locales/ja';
import pt from './locales/pt';
import hi from './locales/hi';
import sa from './locales/sa';
import ur from './locales/ur';
import zh from './locales/zh';
import es from './locales/es';
import ar from './locales/ar';
import fr from './locales/fr';
import bn from './locales/bn';
import ru from './locales/ru';
import de from './locales/de';
import ko from './locales/ko';

/**
 * Order matters for the language menu: it follows the brief's list.
 * `en` is the canonical schema; every other entry is a deep merge over it.
 */
export const dictionaries: Record<string, Messages> = {
  en,
  te: merge<Messages>(en, te),
  ja: merge<Messages>(en, ja),
  pt: merge<Messages>(en, pt),
  hi: merge<Messages>(en, hi),
  sa: merge<Messages>(en, sa),
  ur: merge<Messages>(en, ur),
  zh: merge<Messages>(en, zh),
  es: merge<Messages>(en, es),
  ar: merge<Messages>(en, ar),
  fr: merge<Messages>(en, fr),
  bn: merge<Messages>(en, bn),
  ru: merge<Messages>(en, ru),
  de: merge<Messages>(en, de),
  ko: merge<Messages>(en, ko),
};
