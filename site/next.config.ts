import type { NextConfig } from "next";

// Static exports for the two places this homepage is published:
//
// GITHUB_PAGES=true: the preview at https://dijitallydave.github.io/dijitally-preview/site/
//   (see .github/workflows/pages.yml).
// SITE_TARGET=dijitally: the homepage of www.dijitally.com, in the Dijitally/dijitally-website
//   repo (see scripts/export-dijitally.sh). The page is that site's index.html, and everything
//   it loads lives under /home/ so nothing collides with the site's own folders.
//
// Neither host runs Next.js, so images aren't optimised and the /api/contact route is left out.
const githubPages = process.env.GITHUB_PAGES === "true";
const dijitally = process.env.SITE_TARGET === "dijitally";
const basePath = githubPages ? "/dijitally-preview/site" : "";
const assetBase = githubPages ? basePath : dijitally ? "/home" : "";

const nextConfig: NextConfig = {
  ...((githubPages || dijitally) && {
    output: "export",
    basePath,
    trailingSlash: githubPages,
    images: { unoptimized: true },
  }),
  ...(dijitally && { assetPrefix: assetBase }),
  env: {
    NEXT_PUBLIC_BASE_PATH: assetBase,
    NEXT_PUBLIC_PAGE_BASE: basePath,
    NEXT_PUBLIC_STATIC_PREVIEW: githubPages ? "true" : "",
    NEXT_PUBLIC_SITE_TARGET: dijitally ? "dijitally" : "",
  },
};

export default nextConfig;
