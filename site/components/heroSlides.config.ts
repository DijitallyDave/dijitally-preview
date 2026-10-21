/**
 * Hero slideshow — edit this file to change the images and how the "melt" transition behaves.
 *
 * The top image is cut into horizontal strips that each slide off to the left (a sideways take
 * on the DOOM screen melt), revealing the next image underneath. Each strip starts at a slightly
 * different moment, and neighbouring strips drift together, which gives the jagged melt edge.
 */

export type HeroSlide = {
  /** Image in /public. Use 2720×1530 shots (person roughly centred) so every slide crops alike.
   *  The canvas loads these files as-is (no Next.js resizing), so export JPEGs (~80% quality). */
  src: string;
  /** Shown in the name card in the hero's bottom-left corner. */
  name: string;
  role: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  { src: "/figma/hero.jpg", name: "Zara", role: "Strategic ally" },
  { src: "/figma/hero-craig.jpg", name: "Craig", role: "Talent ally" },
];

export const HERO_MELT = {
  /** How long each image is fully shown before it melts away (ms). */
  hold: 5000,
  /** How long one strip takes to slide all the way out once it starts moving (ms). */
  duration: 900,
  /** Spread of the strips' start times (ms). 0 = every strip moves together, like a wipe. */
  stagger: 650,
  /**
   * How much each strip's start differs from the one above it, as a fraction of `stagger`.
   * Low (0.05) gives long smooth runs; high (0.6) gives a ragged, noisy edge.
   */
  roughness: 0.3,
  /** Height of each strip in CSS pixels — the "pixel" size of the effect. */
  stripHeight: 6,
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
