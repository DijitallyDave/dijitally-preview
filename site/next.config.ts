import type { NextConfig } from "next";

// GITHUB_PAGES=true builds a static export for GitHub Pages, served from
// https://dijitallydave.github.io/dijitally-preview/site/ (see .github/workflows/pages.yml).
// Pages has no server, so images aren't optimised and the /api/contact route is left out.
const githubPages = process.env.GITHUB_PAGES === "true";
const basePath = githubPages ? "/dijitally-preview/site" : "";

const nextConfig: NextConfig = {
  ...(githubPages && {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_PREVIEW: githubPages ? "true" : "",
  },
};

export default nextConfig;
