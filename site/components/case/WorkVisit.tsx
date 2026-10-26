"use client";

import { useEffect } from "react";
import { SKIP_INTRO_KEY } from "../theme";

/** Notes that a case study was viewed, so going back to the homepage skips its intro. */
export default function WorkVisit() {
  useEffect(() => {
    try {
      sessionStorage.setItem(SKIP_INTRO_KEY, "1");
    } catch {
      // Storage blocked: the homepage will play its intro, which is harmless.
    }
  }, []);
  return null;
}
