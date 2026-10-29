"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * On www.dijitally.com: tells Google Tag Manager about a page opened without a full load (the
 * homepage's transition into a case study, and back), as the site's own app does, with a
 * `virtual_page_view` event. The first page is the real page load, which it already counts.
 */
export default function VirtualPageView() {
  const pathname = usePathname();
  const last = useRef(pathname);

  useEffect(() => {
    if (pathname === last.current) return;
    last.current = pathname;
    const page = pathname.replace(/^\/|\/$/g, "") || "home";
    window.dataLayer?.push({ event: "virtual_page_view", page_name: page, page_path: pathname });
  }, [pathname]);

  return null;
}
