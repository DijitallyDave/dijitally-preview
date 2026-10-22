/**
 * Per-strip start delays as a random walk, so neighbouring strips move together and the melt
 * edge is jagged rather than noisy (the same idea as DOOM's column offsets). `roughness` is
 * defined per 6px of height; a random walk's spread grows with the square root of the number
 * of steps, so the per-strip step is scaled by √(stripHeight / 6) to keep the same edge
 * character at any strip height. Shared by the hero slideshow and the work thumbnail reveal.
 */
export function meltDelays(
  count: number,
  { stagger, roughness, stripHeight }: { stagger: number; roughness: number; stripHeight: number },
) {
  const walk = roughness * stagger * Math.sqrt(Math.max(stripHeight, 0.1) / 6);
  const delays = new Array<number>(count);
  let d = Math.random() * stagger;
  for (let i = 0; i < count; i++) {
    d = Math.min(stagger, Math.max(0, d + (Math.random() * 2 - 1) * walk));
    delays[i] = d;
  }
  return delays;
}
