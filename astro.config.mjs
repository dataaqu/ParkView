// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://parkview.ge',

  // ru is the default locale and is served without a prefix: / , /en/ , /ka/
  // The investors this site is aimed at read Russian, and the old site
  // pointed x-default at Russian too.
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en', 'ka'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ru',
        locales: { ru: 'ru-RU', en: 'en-US', ka: 'ka-GE' },
      },
    }),
  ],

  // One canonical spelling per URL: `/about`, never `/about/`. The sitemap
  // integration follows this setting, so it matches the <link rel=canonical>
  // BaseLayout emits.
  trailingSlash: 'never',

  // Static, except `src/pages/api/contact.ts` (the inquiry form, back since
  // 14 Sep), which opts out with `prerender = false` and runs as a function.
  // The Infrastructure page became part of The Project on 14 Sep; old links
  // keep working. On Vercel these are real 308s.
  redirects: {
    '/infrastructure': '/project',
    '/en/infrastructure': '/en/project',
    '/ka/infrastructure': '/ka/project',
  },

  output: 'static',
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },
});
