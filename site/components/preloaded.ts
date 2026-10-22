/** Fired once the preloader has started handing over to the page. */
const PRELOADED_EVENT = "dijitally:preloaded";
// If the preloader never reports in (a script error, say), start the page anyway.
const FAILSAFE_MS = 10000;

export function markPreloaded() {
  if (document.documentElement.dataset.preloaded !== undefined) return;
  document.documentElement.dataset.preloaded = "";
  window.dispatchEvent(new Event(PRELOADED_EVENT));
}

/** Run `cb` once the preloader is out of the way (straight away if it already is). */
export function onPreloaded(cb: () => void) {
  if (document.documentElement.dataset.preloaded !== undefined) {
    cb();
    return () => {};
  }
  const run = () => {
    clearTimeout(timer);
    window.removeEventListener(PRELOADED_EVENT, run);
    cb();
  };
  const timer = setTimeout(run, FAILSAFE_MS);
  window.addEventListener(PRELOADED_EVENT, run);
  return () => {
    clearTimeout(timer);
    window.removeEventListener(PRELOADED_EVENT, run);
  };
}
