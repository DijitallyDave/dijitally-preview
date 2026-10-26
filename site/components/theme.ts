export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "dijitally-theme";

/**
 * Set by a case study page (WorkVisit), so the homepage skips its intro when a visitor comes
 * back to it from one. The homepage clears it, so a reload or a fresh visit plays the intro.
 */
export const SKIP_INTRO_KEY = "dijitally-skip-intro";

// Runs in <head> before first paint so a saved (or system) dark preference never flashes light.
// Also flags that JS is running (data-js), which lets CSS hide SplitText headings until they're split,
// and whether the visitor is coming back from a case study (data-skip-intro), so CSS can keep the
// server-rendered preloader from ever showing then. "Coming back" is either the flag a case study
// in this app leaves, or a referrer on this site under /work/ (www.dijitally.com's own case
// studies are static pages that can't leave the flag). A reload always plays the intro, even
// though it keeps the original referrer.
export const themeInitScript = `(function(){var d=document.documentElement;d.dataset.js="";try{var n=performance.getEntriesByType("navigation")[0],r=document.referrer&&new URL(document.referrer);if(n&&n.type==="reload")sessionStorage.removeItem("${SKIP_INTRO_KEY}");else if(sessionStorage.getItem("${SKIP_INTRO_KEY}")||(r&&r.host===location.host&&r.pathname.indexOf("/work/")>-1))d.dataset.skipIntro=""}catch(e){}try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t}catch(e){}})()`;

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode etc.) — the theme still applies for this page view.
  }
}
