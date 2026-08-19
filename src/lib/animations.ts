import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Smooth scroll ──────────────────────────────────────────────────────
   Lenis drives the scroll position; ScrollTrigger is told to read from it
   rather than from native scroll events, so the two stay in sync.        */
export function initSmoothScroll(): Lenis | null {
  if (reduceMotion) return null;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anchor links have to go through Lenis or they jump past the smoothing.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    });
  });

  return lenis;
}

/* ── Section reveals ────────────────────────────────────────────────────
   Anything marked [data-reveal] fades up once as it enters the viewport.
   `data-reveal-delay` staggers siblings without extra markup.            */
export function initReveals(): void {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');

  if (reduceMotion) {
    gsap.set(items, { opacity: 1, y: 0 });
    return;
  }

  items.forEach((el) => {
    const delay = Number(el.dataset.revealDelay ?? 0);

    gsap.fromTo(
      el,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });
}

/* ── Headline reveals ───────────────────────────────────────────────────
   Splits into lines and lifts them out of a clipped mask. Fonts must be
   ready first or the split measures the fallback face and re-wraps.      */
export function initHeadlines(): void {
  const headings = gsap.utils.toArray<HTMLElement>('[data-split]');
  if (!headings.length) return;

  if (reduceMotion) {
    gsap.set(headings, { opacity: 1 });
    return;
  }

  headings.forEach((heading) => {
    const split = new SplitText(heading, {
      type: 'lines',
      linesClass: 'split-line',
      mask: 'lines',
    });

    gsap.set(heading, { opacity: 1 });

    gsap.from(split.lines, {
      /* Past 100% because the masks are now a little deeper than the line
         box (see `.split-line-mask`) — at 115 the top of a line could have
         peeked into that extra depth before its turn. */
      yPercent: 130,
      duration: 1.15,
      ease: 'expo.out',
      stagger: 0.09,
      scrollTrigger: { trigger: heading, start: 'top 85%', once: true },
    });
  });
}

/* ── Parallax ───────────────────────────────────────────────────────────
   `data-parallax="0.2"` moves the element 20% of the scrolled distance.  */
export function initParallax(): void {
  if (reduceMotion) return;

  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const strength = Number(el.dataset.parallax || 0.15);

    gsap.to(el, {
      yPercent: strength * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement ?? el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}

/* ── Counters ───────────────────────────────────────────────────────────
   `data-count="1000"` with optional `data-count-suffix="+"`.             */
export function initCounters(): void {
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.countSuffix ?? '';

    if (reduceMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const state = { value: 0 };

    gsap.to(state, {
      value: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        el.textContent = `${Math.round(state.value)}${suffix}`;
      },
    });
  });
}

/* ── Header ─────────────────────────────────────────────────────────────
   Transparent over the hero, solid the moment the page moves.

   This used to run off a bounded ScrollTrigger (`start: 'top -80'`), which
   had two problems: onUpdate does not fire outside the trigger's active
   range, so the solid state was never cleared on the way back to the top,
   and nothing ran on load — a mid-page refresh left white type on a white
   header. A plain passive scroll listener always fires, including once at
   startup. Lenis writes real scroll positions, so scrollY is accurate.   */
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  // Low enough that the change reads as a response to the scroll itself.
  const SOLID_AT = 24;
  let solid: boolean | null = null;

  const update = () => {
    const next = window.scrollY > SOLID_AT;
    if (next === solid) return;
    solid = next;
    header.classList.toggle('is-solid', next);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

export function initAll(): void {
  document.documentElement.classList.add('js');

  initHeader();

  const start = () => {
    initSmoothScroll();
    initHeadlines();
    initReveals();
    initParallax();
    initCounters();
    ScrollTrigger.refresh();
  };

  // Splitting before the webfonts land measures the wrong metrics.
  const afterFonts = document.fonts?.ready ?? Promise.resolve();

  /* The hero headline reveal is the first thing a visitor should see, and
     it would otherwise play out behind the intro curtain and be over by the
     time it lifts. Loader.astro fires this event; on any page where the
     curtain does not run, `intro-done` is already on <html>. */
  const afterIntro = document.documentElement.classList.contains('intro-done')
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        window.addEventListener('pv:intro-done', () => resolve(), { once: true });
        // If the loader ever fails to run, the page still has to appear.
        window.setTimeout(resolve, 6000);
      });

  Promise.all([afterFonts, afterIntro]).then(start);
}
