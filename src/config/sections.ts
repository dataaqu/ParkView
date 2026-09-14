/**
 * Which bands each page shows. Nothing is deleted to follow the client's site
 * map (14 Sep) — bands it leaves out are switched off here, and setting a flag
 * back to `true` restores that band exactly as it was.
 */
export const SHOW = {
  home: {
    /** "Developer | Galaxy logo" strip under the hero. */
    developerStrip: false,
    about: false,
    why: false,
    infrastructure: false,
    privileges: false,
  },
  about: {
    /** Quality · privacy · architecture — on the site map. */
    approach: true,
    /** The three property feature cards inside "Why PARK VIEW". */
    whyFeatures: false,
    /** Moved to The Project page. */
    district: false,
    plan: false,
  },
} as const;
