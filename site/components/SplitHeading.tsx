"use client";

import { useRef } from "react";
import { useSplitReveal } from "./useSplitReveal";

// Heading set in the Figma H1 style, revealed word by word with GSAP SplitText on scroll, or
// straight away with `onLoad` (a page's opening heading).
export default function SplitHeading({
  as: Tag = "h2",
  className = "",
  onLoad = false,
  children,
}: {
  as?: "h1" | "h2";
  onLoad?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useSplitReveal(ref, { onLoad });

  return (
    <Tag ref={ref} data-split className={className}>
      {children}
    </Tag>
  );
}
