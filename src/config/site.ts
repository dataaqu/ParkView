import type { Locale } from '../i18n/config';

export const SITE = {
  /** The project — what the site is about, and what every page is titled. */
  name: 'PARK VIEW',
  /** The developer behind it. Opens the About statement; per the client's
      own copy, later mentions in that text stay with the project name. */
  company: 'Galaxy Enterprises',
  url: 'https://parkview.ge',
  phone: '+995 555 05 04 54',
  phoneHref: '+995555050454',
  email: 'invest@parkview.ge',
  /** The studio credited in the footer. Split out so the footer can set the
      name apart, and link it, without putting markup into the three content
      files. */
  credit: 'INFINITY',
  creditHref: 'https://infinity.ge',
} as const;

/** Street address per locale — the only contact detail that is translated. */
export const ADDRESS: Record<Locale, string> = {
  ka: 'თბილისი, გულია დიმიტრის ქუჩა 8',
  en: '8 Gulia Dimitri Street, Tbilisi',
  ru: 'Улица Гулиа Димитрий 8, Тбилиси',
};

/**
 * One render per infrastructure pillar, in content order. Kept here rather
 * than in the translations: the picture is the same on every locale, and a
 * path in a JSON file is a path nobody remembers to update. Read by both the
 * infrastructure page and the homepage band that links to it.
 */
export const INFRA_IMAGES = ['/images/infra-elevator', '/images/infra-garage', '/images/infra-gate'] as const;

/**
 * Map pin. The old site pointed at the wrong spot — the client flagged it in
 * `Remarks for web site 16-8-2026.docx`, and the first two replacements were
 * still off. These are the coordinates behind the short link the client sent
 * on 20 Aug (`maps.app.goo.gl/oYxkYmtQK2bFeU9P8`), which resolves to a
 * `/maps/search/41.677945,+44.832838` address.
 *
 * The short link is not used directly: it carries session parameters that go
 * stale, so `href` below is rebuilt from the coordinates instead.
 */
export const MAP = {
  lat: 41.677945,
  lng: 44.832838,
  zoom: 17,
} as const;

/** Where every "open in Google Maps" on the site goes. */
export const MAP_HREF = `https://www.google.com/maps/search/?api=1&query=${MAP.lat},${MAP.lng}`;

/**
 * Social profiles. Networks only — the map used to sit at the end of this row
 * and was taken out on 19 Aug: the contact page already carries the map itself
 * with its own "open in Google Maps" button, so the tile pointed at something
 * a few centimetres above it.
 *
 * Two of the addresses the client sent carried share-tracking parameters —
 * Instagram's `igsi=` and TikTok's `_r=1`. Both identify the share rather than
 * the profile, so both are stripped.
 */
export const SOCIAL = [
  { name: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/profile.php?id=61591449086184' },
  { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/parkview_construction' },
  { name: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@park.view.tbilisi' },
] as const;
