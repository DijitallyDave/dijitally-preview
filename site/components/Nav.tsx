"use client";

import { useState } from "react";

const LINKS = [
  { label: "Services", href: "#ways-of-working" },
  { label: "Work", href: "#work" },
  { label: "Allies", href: "#allies" },
  { label: "Blog", href: "#" },
  { label: "Get in touch", href: "#contact" },
];

function MenuItem({ label, href, onClick }: { label: string; href: string; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group flex items-center gap-1 rounded-[2px] p-1.5 text-[19px] font-medium leading-none tracking-[-0.38px] text-primary outline-none transition-colors hover:text-tech focus-visible:ring-1 focus-visible:ring-tech active:opacity-70"
    >
      <span className="size-[3px] shrink-0 bg-menu-dot transition-colors group-hover:bg-tech" />
      <span className="trim whitespace-nowrap">{label}</span>
    </a>
  );
}

function ToggleUI({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label="Toggle UI"
      aria-pressed={on}
      onClick={onToggle}
      className="relative h-[19px] w-[29px] shrink-0 cursor-pointer transition-opacity hover:opacity-80"
    >
      <img
        src="/figma/toggle.svg"
        alt=""
        width={29}
        height={19}
        className={`block transition-transform duration-300 ${on ? "-scale-x-100" : ""}`}
      />
    </button>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [toggled, setToggled] = useState(false);

  return (
    <header className="relative z-20 flex w-full items-end justify-between px-4 pt-4 sm:px-6 sm:pt-6 lg:px-[42px] lg:pt-[42px]">
      <a href="#top" aria-label="Dijitally home" className="block shrink-0">
        <img
          src="/figma/wordmark.svg"
          alt="Dijitally"
          width={215.856}
          height={30}
          className="block h-[22px] w-auto lg:h-[30px]"
        />
      </a>

      {/* Desktop menu */}
      <nav className="hidden items-center gap-6 rounded-[4px] bg-panel px-[30px] py-6 lg:flex">
        {LINKS.map((l) => (
          <MenuItem key={l.label} {...l} />
        ))}
        <ToggleUI on={toggled} onToggle={() => setToggled((v) => !v)} />
      </nav>

      {/* Mobile menu button */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-[4px] bg-panel px-4 py-3 text-[16px] font-medium leading-none text-primary lg:hidden"
      >
        <span className={`size-[3px] transition-colors ${open ? "bg-tech" : "bg-menu-dot"}`} />
        <span className="trim">{open ? "Close" : "Menu"}</span>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          className="absolute inset-x-4 top-full mt-3 flex flex-col items-start gap-4 rounded-[4px] bg-panel p-6 sm:inset-x-6 lg:hidden"
        >
          {LINKS.map((l) => (
            <MenuItem key={l.label} {...l} onClick={() => setOpen(false)} />
          ))}
          <ToggleUI on={toggled} onToggle={() => setToggled((v) => !v)} />
        </nav>
      )}
    </header>
  );
}
