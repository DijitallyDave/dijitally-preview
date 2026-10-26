/**
 * Builds for www.dijitally.com (SITE_TARGET=dijitally, see next.config.ts) sit inside the main
 * site, so links to its other pages are relative and the page carries the site's tracking and
 * posts leads to its /api/lead. Every other build (local dev, the GitHub Pages preview) links
 * out to www.dijitally.com instead.
 */
export const ON_DIJITALLY = process.env.NEXT_PUBLIC_SITE_TARGET === "dijitally";

export const SITE_URL = "https://www.dijitally.com";

export const HOME_TITLE = "Dijitally — Your ally";
export const HOME_DESCRIPTION =
  "Brands don’t need another agency. They need an ally that can flex with the ever-changing world around them.";

/** A page of this Next.js site, e.g. pageLink("/work/afterpay"), under the build's base path. */
export const pageLink = (path: string) => `${process.env.NEXT_PUBLIC_PAGE_BASE ?? ""}${path}`;

/** A page on www.dijitally.com, e.g. siteLink("/work/afterpay"). */
export const siteLink = (path: string) => (ON_DIJITALLY ? path : `${SITE_URL}${path}`);
