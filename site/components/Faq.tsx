"use client";

import { useId, useState } from "react";

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

// 36px plus/minus built from two 3px bars; the vertical bar collapses when open.
// Bars turn white on the closed row's dark hover fill.
function PlusMinus({ open }: { open: boolean }) {
  const closedBar = "bg-secondary group-hover:bg-snow group-focus-visible:bg-snow";
  return (
    <span className="relative size-7 shrink-0 lg:size-9" aria-hidden>
      <span
        className={`absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 transition-colors ${open ? "bg-grey" : closedBar}`}
      />
      <span
        className={`absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 transition-[transform,background-color] duration-300 ${
          open ? "scale-y-0 bg-secondary" : `scale-y-100 ${closedBar}`
        }`}
      />
    </span>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(1);
  const baseId = useId();

  return (
    <section data-nav-bg="page" className="flex flex-col items-center gap-16 bg-primary px-4 py-28 sm:px-6 lg:gap-32 lg:px-16 lg:py-[196px]">
      <h2 className="trim max-w-[460px] text-center text-[32px] leading-none tracking-[-0.64px] lg:text-h1">
        FAQs. <span className="text-static">Have more questions? Let’s chat.</span>
      </h2>

      <ul className="flex w-full max-w-[1003px] flex-col gap-10 lg:gap-16">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          const panelId = `${baseId}-panel-${i}`;
          return (
            <li key={i} className="flex flex-col gap-6">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                // Closed rows carry the open row's padding (so the hover fill matches its size)
                // and cancel it with negative margin, keeping the Figma spacing between questions.
                className={`group flex w-full cursor-pointer items-center justify-between gap-6 rounded-[4px] px-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-tech lg:px-6 ${
                  isOpen
                    ? "bg-secondary py-6 text-primary"
                    : "-my-4 py-4 hover:bg-zero-dark hover:text-snow focus-visible:bg-zero-dark focus-visible:text-snow lg:-my-6 lg:py-6"
                }`}
              >
                <span className="trim text-[22px] leading-[1.1] tracking-[-0.22px] lg:text-[32px] lg:tracking-[-0.32px]">
                  {f.q}
                </span>
                <PlusMinus open={isOpen} />
              </button>
              <div
                id={panelId}
                role="region"
                hidden={!isOpen}
                className="px-4 lg:px-6"
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
