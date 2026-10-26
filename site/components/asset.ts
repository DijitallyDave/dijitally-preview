/**
 * Path to a file in /public. Next.js only prefixes its own assets, so raw <img> tags,
 * unoptimised next/image srcs and CSS url()s need it added: under /dijitally-preview/site for
 * the GitHub Pages build, and under /home for the www.dijitally.com build (see next.config.ts).
 */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
