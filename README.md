# ParkView

Website for **PARK VIEW** — a premium real-estate investment developer in
Tbilisi's Embassy Quarter (Ortachala).

Live domain: <https://parkview.ge>

## Stack

| | |
|---|---|
| Framework | Astro 7 (static output) + TypeScript |
| Styling | Tailwind CSS 4 |
| Animation | GSAP 3 (ScrollTrigger + SplitText) + Lenis |
| Deploy | Vercel (`@astrojs/vercel`) |

## Languages

Three locales, Russian is the default and is served without a prefix:

| Locale | Path |
|---|---|
| Russian | `/` |
| English | `/en` |
| Georgian | `/ka` |

All copy lives in `src/content/{ka,en,ru}.json`. `ka.json` is the shape's
source of truth — the `Dictionary` type is derived from it, so the other two
must match its keys.

## Running it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build
npm run preview    # serve the build
npm run check      # astro check — types and template diagnostics
```

## Project layout

```
src/
  components/          shared pieces (header, footer, buttons, logo …)
    sections/          one file per band of a page
    pages/             the body of each page, assembled from sections
  layouts/BaseLayout   <head>, header, closing band, schema.org
  content/             the three translation files
  config/site.ts       phone, email, address, map pin, social, render lists
  i18n/                locale config and path helpers
  styles/global.css    fonts, design tokens, component classes
  lib/animations.ts    GSAP + Lenis setup, shared by every page
```

## Images

Nothing in the markup points at a raw render. Every image the site links to is
a derivative built by `scripts/images.mjs`:

```bash
npm run images
```

The derivatives are committed. The **source renders are not** — they are the
client's untouched 3840px files (`public/images/saboloo *.webp`) and are
gitignored along with `docs/`, which holds the client's own remark sheets.
Both are kept outside the repository on purpose; neither is needed to build or
deploy. To regenerate a derivative, put the renders back in `public/images/`
and run the command above.

## Notes

- `PROGRESS.md` is the working log — decisions, what changed when, and the
  reasoning behind the parts that are not obvious from the code.
- Fonts are self-hosted from `public/fonts/`. Georgian is set in Noto Serif
  Georgian and body copy in FiraGO; both carry notes in `global.css` about
  which weights may be used and why.
