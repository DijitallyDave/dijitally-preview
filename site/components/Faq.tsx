"use client";

import { useId, useState } from "react";
import SplitHeading from "./SplitHeading";

const FAQS = [
  {
    q: "How is your model different from traditional agencies?",
    a: "We ally with lorem ipsum dolor sit amet–with a penchant for financial, and professional services–navigating growth, acquisition, integration or strategic transformation. Our clients are typically operating in regulated or high-stakes environments where governance, capital and enterprise value matter.",
  },
  {
    q: "What types of organisations do you work with?",
    a: "We ally with lorem ipsum dolor sit amet–with a penchant for financial, and professional services–navigating growth, acquisition, integration or strategic transformation. Our clients are typically operating in regulated or high-stakes environments where governance, capital and enterprise value matter.",
  },
  {
    q: "Lorem ipsum dolor sit amet, consectetur adipiscing?",
    a: "We ally with lorem ipsum dolor sit amet–with a penchant for financial, and professional services–navigating growth, acquisition, integration or strategic transformation.",
  },
  {
    q: "Lorem ipsum dolor sit amet, consectetur adipiscing?",
    a: "We ally with lorem ipsum dolor sit amet–with a penchant for financial, and professional services–navigating growth, acquisition, integration or strategic transformation.",
  },
  {
    q: "Lorem ipsum dolor sit amet, consectetur adipiscing?",
    a: "We ally with lorem ipsum dolor sit amet–with a penchant for financial, and professional services–navigating growth, acquisition, integration or strategic transformation.",
  },
  {
    q: "Lorem ipsum dolor sit amet, consectetur adipiscing?",
    a: "We ally with lorem ipsum dolor sit amet–with a penchant for financial, and professional services–navigating growth, acquisition, integration or strategic transformation.",
  },
];

// Plus/minus built from two bars (36px / 3px on desktop, 24px / 2px on mobile); the vertical bar collapses when open.
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span className="relative size-6 shrink-0 lg:size-9" aria-hidden>
      <span
        className={`absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 transition-colors lg:h-[3px] ${open ? "bg-grey" : "bg-secondary"}`}
      />
      <span
        className={`absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-secondary lg:w-[3px] transition-transform duration-300 ${
          open ? "scale-y-0" : "scale-y-100"
        }`}
      />
    </span>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section data-nav-bg="page" className="flex flex-col items-center gap-16 bg-primary px-6 py-16 lg:gap-32 lg:px-16 lg:py-[196px]">
      {/* Mobile Figma shortens this to "Have more questions?" */}
      <SplitHeading className="trim w-full text-center text-h1-mobile lg:w-auto lg:max-w-[460px] lg:text-h1">
        <span className="hidden lg:inline">FAQs. </span>
        <span className="lg:text-static">Have more questions?</span>
        <span className="hidden text-static lg:inline"> Let’s chat.</span>
      </SplitHeading>

      <ul className="flex w-full max-w-[1003px] flex-col gap-[42px] lg:gap-16">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          const panelId = `${baseId}-panel-${i}`;
          return (
            // Mobile: 1px UI-colour dividers between questions; desktop has none.
            <li key={i} className={`flex flex-col gap-6 ${i > 0 ? "border-t border-ui pt-[42px] lg:border-0 lg:pt-0" : ""}`}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                // Desktop: the open row is a dark filled bar; closed rows carry its padding (so the
                // hover fill matches its size) and cancel it with negative margin, keeping the Figma
                // spacing. Mobile has no fills — plain rows, as in the mobile Figma.
                className={`group flex w-full cursor-pointer items-start justify-between gap-6 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-tech lg:items-center lg:rounded-[4px] lg:px-6 ${
                  isOpen
                    ? "lg:bg-secondary lg:py-6 lg:text-primary"
                    : "lg:-my-6 lg:py-6 lg:hover:bg-ui lg:focus-visible:bg-ui"
                }`}
              >
                <span className="trim text-[24px] leading-[1.1] tracking-[-0.24px] lg:text-[32px] lg:tracking-[-0.32px]">
                  {f.q}
                </span>
                <PlusMinus open={isOpen} />
              </button>
              <div
                id={panelId}
                role="region"
                hidden={!isOpen}
                className="lg:px-6"
              >
                <p className="trim max-w-[840px] text-[18px] leading-[1.2] tracking-[0.18px] text-static lg:text-[24px] lg:tracking-[0.24px]">
                  {f.a}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
