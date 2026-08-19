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

  // Fully static. The one route that used to opt out was the contact form's
  // endpoint; the form came out on 19 Aug and the endpoint went with it.
  output: 'static',
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },
});
