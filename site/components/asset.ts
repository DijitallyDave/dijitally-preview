/**
 * Path to a file in /public. Next.js only prefixes its own assets with basePath, so raw <img>
 * tags, unoptimised next/image srcs and CSS url()s need it added — e.g. for the GitHub Pages
 * build, which is served from /dijitally-preview/site (see next.config.ts).
 */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
