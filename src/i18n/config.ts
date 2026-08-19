/* Order here is the order the language switcher renders in. `ru` leads:
   it is both the default locale and the one the target investors read. */
export const LOCALES = ['ru', 'en', 'ka'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ru';

/** Shown in the language switcher; `hreflang` goes into <link rel="alternate">. */
export const LOCALE_META: Record<Locale, { label: string; short: string; hreflang: string; htmlLang: string }> = {
  ru: { label: 'Русский', short: 'RUS', hreflang: 'ru', htmlLang: 'ru' },
  en: { label: 'English', short: 'ENG', hreflang: 'en', htmlLang: 'en' },
  ka: { label: 'ქართული', short: 'GEO', hreflang: 'ka-GE', htmlLang: 'ka' },
};

/**
 * Route keys shared by every locale. Slugs stay identical across languages —
 * only the path prefix changes — so a language switch never loses the page.
 */
export const ROUTES = {
  home: '',
  about: 'about',
  infrastructure: 'infrastructure',
  contact: 'contact',
} as const;

export type RouteKey = keyof typeof ROUTES;
