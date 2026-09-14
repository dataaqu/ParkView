// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://parkview.ge',

  // ka is the default locale and is served without a prefix: / , /en , /ru
  // (client, 14 Sep: the site must open in Georgian).
  i18n: {
    defaultLocale: 'ka',
    locales: ['ka', 'en', 'ru'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ka',
        locales: { ka: 'ka-GE', en: 'en-US', ru: 'ru-RU' },
      },
    }),
  ],

  // One canonical spelling per URL: `/about`, never `/about/`. The sitemap
  // integration follows this setting, so it matches the <link rel=canonical>
  // BaseLayout emits.
  trailingSlash: 'never',

  // The Infrastructure page became part of The Project on 14 Sep; old links
  // keep working. On Vercel these are real 308s.
  redirects: {
    '/infrastructure': '/project',
    '/en/infrastructure': '/en/project',
    '/ru/infrastructure': '/ru/project',
    // Until 14 Sep Georgian lived under /ka and Russian at the root.
    '/ka': '/',
    '/ka/about': '/about',
    '/ka/project': '/project',
    '/ka/contact': '/contact',
    '/ka/infrastructure': '/project',
  },

  // Static, except `src/pages/api/contact.ts` (the inquiry form, back since
  // 14 Sep), which opts out with `prerender = false` and runs as a function.
  output: 'static',
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },
});
