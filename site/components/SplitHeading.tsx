"use client";

import { useRef } from "react";
import { useSplitReveal } from "./useSplitReveal";

// Heading set in the Figma H1 style, revealed word by word with GSAP SplitText on scroll.
export default function SplitHeading({
  as: Tag = "h2",
  className = "",
  children,
}: {
  as?: "h1" | "h2";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useSplitReveal(ref);

  return (
    <Tag ref={ref} data-split className={className}>
      {children}
    </Tag>
  );
}
