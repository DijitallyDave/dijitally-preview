/**
 * Hero slideshow — edit this file to change the images and how the "melt" transition behaves.
 *
 * The top image is cut into horizontal strips that each slide off to the left (a sideways take
 * on the DOOM screen melt), revealing the next image underneath. Each strip starts at a slightly
 * different moment, and neighbouring strips drift together, which gives the jagged melt edge.
 * Strips travel all the way to the edge of the hero, not just the edge of the photo.
 *
 * Adding an image:
 *   1. Put the file in site/public/hero/ (e.g. site/public/hero/sam.webp).
 *   2. Add a line to HERO_SLIDES below with its path *without* "public" (e.g. "/hero/sam.webp"),
 *      plus the name and role for the name card. Slides play in the order listed.
 */

export type HeroSlide = {
  /**
   * Path under site/public, e.g. "/hero/zara.webp" for site/public/hero/zara.webp.
   * Use 2720×1530 shots with the person roughly centred so every slide crops alike. The canvas
   * loads these files as-is (no Next.js resizing), so keep them small — WebP (~50–100KB) is ideal.
   */
  src: string;
  /** Shown in the name card in the hero's bottom-left corner. */
  name: string;
  role: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  // Ordered so people alternate looking right and left (→ ← → ←…), with women and men in
  // pairs: two women and two men face each way, so genders can't strictly alternate as well.
  // Zara stays first: the preloader lands on her and expands into the hero.
  { src: "/hero/zara.webp", name: "Zara", role: "Strategic ally" }, // →
  { src: "/hero/dave.webp", name: "Dave", role: "Creative ally" }, // ←
  // Lou faces the camera, so she sits where a left-looker meets a right-looker.
  { src: "/hero/lou.webp", name: "Lou", role: "CRM ally" }, // ↑
  { src: "/hero/craig.webp", name: "Craig", role: "Talent ally" }, // →
  { src: "/hero/caroline.webp", name: "Caroline", role: "CRM ally" }, // ←
  { src: "/hero/dess.webp", name: "Dess", role: "Production ally" }, // →
  { src: "/hero/declan.webp", name: "Declan", role: "Founding ally" }, // ←
  { src: "/hero/matty.webp", name: "Matty", role: "Engineering ally" }, // →
  { src: "/hero/carrie.webp", name: "Carrie", role: "Project ally" }, // ←
  { src: "/hero/dante.webp", name: "Dante", role: "Design ally" }, // →
  // Jon faces the camera, so he sits at the turn of the loop, between two who look right.
  { src: "/hero/jon.webp", name: "Jon", role: "Creative ally" }, // ↑
];

export const HERO_MELT = {
  /** How long each image is fully shown before it melts away (ms). */
  hold: 3000,
  /** How long one strip takes to slide all the way out once it starts moving (ms). */
  duration: 900,
  /** Spread of the strips' start times (ms). 0 = every strip moves together, like a wipe. */
  stagger: 650,
  /**
   * How jagged the melt edge is: how far the start time can drift per 6px of height, as a
   * fraction of `stagger`. It's measured per 6px (not per strip) so the edge keeps the same
   * character whatever `stripHeight` is. Low (0.05) gives long smooth runs; high (0.6) is ragged.
   */
  roughness: 0.3,
  /** Height of each strip in CSS pixels — the "pixel" size of the effect. */
  stripHeight: 1,
  /**
   * Horizontal movement snaps to multiples of this many CSS pixels, for a chunky, low-frame-rate
   * look. 0 = perfectly smooth.
   */
  step: 6,
  /** 1 = constant speed; 2+ = strips start slowly and accelerate away (DOOM-like). */
  acceleration: 2.2,
  /** Which way the strips leave the frame. */
  direction: "left" as "left" | "right",
  /** Go back to the first image after the last, forever. */
  loop: true,
};
