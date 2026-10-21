/**
 * Hero slideshow — edit this file to change the images and how the "melt" transition behaves.
 *
 * The top image is cut into horizontal strips that each slide off to the left (a sideways take
 * on the DOOM screen melt), revealing the next image underneath. Each strip starts at a slightly
 * different moment, and neighbouring strips drift together, which gives the jagged melt edge.
 * Strips travel all the way to the edge of the hero, not just the edge of the photo.
 *
 * Adding an image:
 *   1. Put the file in site/public/hero/ (e.g. site/public/hero/sam.jpg).
 *   2. Add a line to HERO_SLIDES below with its path *without* "public" (e.g. "/hero/sam.jpg"),
 *      plus the name and role for the name card. Slides play in the order listed.
 */

export type HeroSlide = {
  /**
   * Path under site/public, e.g. "/hero/zara.jpg" for site/public/hero/zara.jpg.
   * Use 2720×1530 shots with the person roughly centred so every slide crops alike. The canvas
   * loads these files as-is (no Next.js resizing), so export JPEGs at ~80% quality (~0.5MB).
   */
  src: string;
  /** Shown in the name card in the hero's bottom-left corner. */
  name: string;
  role: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  { src: "/hero/zara.jpg", name: "Zara", role: "Strategic ally" },
  { src: "/hero/dave.jpg", name: "Dave", role: "Creative ally" },
  { src: "/hero/craig.jpg", name: "Craig", role: "Talent ally" },
  { src: "/hero/declan.jpg", name: "Declan", role: "Founding ally" },
  { src: "/hero/matty.jpg", name: "Matty", role: "Engineering ally" },
];

export const HERO_MELT = {
  /** How long each image is fully shown before it melts away (ms). */
  hold: 5000,
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
