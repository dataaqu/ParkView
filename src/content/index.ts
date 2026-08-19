import en from './en.json';
import ka from './ka.json';
import ru from './ru.json';
import type { Locale } from '../i18n/config';

/** ka.json is the shape's source of truth (it was written first);
    en/ru must match it. This is unrelated to which locale is default. */
export type Dictionary = typeof ka;

const dictionaries: Record<Locale, Dictionary> = {
  ka,
  en: en as Dictionary,
  ru: ru as Dictionary,
};

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}
