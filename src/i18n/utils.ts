import { DEFAULT_LOCALE, LOCALES, ROUTES, type Locale, type RouteKey } from './config';

/** Reads the locale out of a pathname. `/en/about` → 'en', `/about` → 'ru'. */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return LOCALES.includes(first as Locale) ? (first as Locale) : DEFAULT_LOCALE;
}

/** Builds an absolute site path for a route in a given locale. */
export function localizedPath(locale: Locale, route: RouteKey): string {
  const slug = ROUTES[route];
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  const path = `${prefix}/${slug}`.replace(/\/+$/, '');
  return path === '' ? '/' : path;
}

/** Strips the locale prefix so a path can be re-prefixed for another language. */
export function routeFromPath(pathname: string): RouteKey {
  const parts = pathname.split('/').filter(Boolean);
  if (LOCALES.includes(parts[0] as Locale)) parts.shift();
  const slug = parts.join('/');
  const match = (Object.keys(ROUTES) as RouteKey[]).find((key) => ROUTES[key] === slug);
  return match ?? 'home';
}

/** Every locale's URL for the current page — used for the switcher and hreflang. */
export function alternates(pathname: string): { locale: Locale; path: string }[] {
  const route = routeFromPath(pathname);
  return LOCALES.map((locale) => ({ locale, path: localizedPath(locale, route) }));
}
