export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "dijitally-theme";

// Runs in <head> before first paint so a saved (or system) dark preference never flashes light.
// Also flags that JS is running (data-js), which lets CSS hide SplitText headings until they're split.
export const themeInitScript = `(function(){var d=document.documentElement;d.dataset.js="";try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t}catch(e){}})()`;

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode etc.) — the theme still applies for this page view.
  }
}
