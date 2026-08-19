/**
 * Turns the client's raw renders into the files the site actually links to.
 *
 * The renders land in `public/images/` straight out of the archive — 3840×2160,
 * half a megabyte each, and named "saboloo 5.webp" with a space in it. Nothing
 * in the markup points at those directly: every image the site uses is a
 * derivative produced here, with a stable name and a sane size. That way a new
 * drop of renders never breaks a page, and re-running this is the only step.
 *
 *   npm run images
 *
 * Derivatives whose source has not changed are left alone, so it is cheap to
 * run after every drop. The freshness check compares timestamps only, so
 * pointing a job at a *different* `from` does not invalidate anything —
 * delete the output first, or it will be reported as up to date. To swap the photography, point a job at a different
 * `from` and run it again — no component needs editing.
 */
import { existsSync, statSync } from 'node:fs';
import sharp from 'sharp';

const DIR = 'public/images';

/** width only → scale to width. width + height → crop to that box. */
const JOBS = [
  // Homepage hero, responsive set. The 3840 original stays as the top srcset step.
  { from: 'hero1.webp', to: 'hero1-1280.webp', width: 1280 },
  { from: 'hero1.webp', to: 'hero1-1920.webp', width: 1920 },
  { from: 'hero2.webp', to: 'hero2-1280.webp', width: 1280 },
  { from: 'hero2.webp', to: 'hero2-1920.webp', width: 1920 },

  /* About page statement — a single image in the left column. The renders
     are 16:9 elevations of a wide building, so a portrait crop would cut the
     building in half; 4:3 is as tall as this one goes before that starts. */
  { from: 'saboloo 2.webp', to: 'about-primary-1400.webp', width: 1400, height: 1050 },
  { from: 'saboloo 2.webp', to: 'about-primary-800.webp', width: 800, height: 600 },

  /* The homepage "about us" band: a tall render behind, a square detail
     overlapping its corner. Different angles from the ones the About page
     itself uses, so a visitor who follows the link is not shown the same two
     pictures twice. The portrait crop wants a render with strong verticals in
     it — a 4:5 window on a wide elevation is mostly sky otherwise. */
  { from: 'saboloo 11.webp', to: 'about-home-1000.webp', width: 1000, height: 1250 },
  { from: 'saboloo 11.webp', to: 'about-home-640.webp', width: 640, height: 800 },
  { from: 'saboloo 10.webp', to: 'about-detail-900.webp', width: 900, height: 900 },
  { from: 'saboloo 10.webp', to: 'about-detail-500.webp', width: 500, height: 500 },

  /* Infrastructure page banner. A daylight render rather than one of the
     night ones: the banner is the first thing that page shows, and the brief
     asks the site to invite rather than to loom. */
  { from: 'saboloo 8.webp', to: 'facade-1920.webp', width: 1920, height: 1080 },

  /* Infrastructure pillars — one render per pillar, shown at roughly 700 CSS
     px, so 1400 covers a 2x screen and 800 covers phones. The client sent
     facade renders only, so each pillar carries the elevation the feature
     lives behind: the vertical shaft, the street entry, the gated frontage. */
  { from: 'saboloo 9.webp', to: 'infra-elevator-1400.webp', width: 1400, height: 1050 },
  { from: 'saboloo 9.webp', to: 'infra-elevator-800.webp', width: 800, height: 600 },
  { from: 'saboloo 5.webp', to: 'infra-garage-1400.webp', width: 1400, height: 1050 },
  { from: 'saboloo 5.webp', to: 'infra-garage-800.webp', width: 800, height: 600 },
  { from: 'saboloo 7.webp', to: 'infra-gate-1400.webp', width: 1400, height: 1050 },
  { from: 'saboloo 7.webp', to: 'infra-gate-800.webp', width: 800, height: 600 },

  /* The closing band behind the call to action and the footer. A night render:
     it is the one place the page is meant to go dark, and the lit windows are
     what the scrim above them is lifted off. */
  { from: 'saboloo 3.webp', to: 'closing-1920.webp', width: 1920, height: 1080 },
  { from: 'saboloo 3.webp', to: 'closing-1280.webp', width: 1280, height: 720 },
];

let written = 0;
let missing = 0;

for (const job of JOBS) {
  const src = `${DIR}/${job.from}`;
  const out = `${DIR}/${job.to}`;

  if (!existsSync(src)) {
    console.error(`MISSING  ${src} — ${job.to} not generated`);
    missing += 1;
    continue;
  }

  if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) {
    console.log(`ok       ${job.to} (up to date)`);
    continue;
  }

  const resize = job.height
    ? { width: job.width, height: job.height, fit: 'cover', position: 'attention' }
    : { width: job.width };

  const info = await sharp(src).resize(resize).webp({ quality: 78 }).toFile(out);
  console.log(`wrote    ${job.to} — ${info.width}×${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
  written += 1;
}

console.log(
  `\n${written} written, ${missing} missing source${missing === 1 ? '' : 's'}.` +
    (missing ? '\nCheck the filenames in public/images against the JOBS table above.' : ''),
);

if (missing) process.exitCode = 1;
