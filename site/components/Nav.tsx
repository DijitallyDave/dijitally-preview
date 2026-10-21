"use client";

import { useEffect, useState } from "react";
import { applyTheme, type Theme } from "./theme";

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
      className="group flex items-center gap-1 rounded-[2px] p-1.5 text-[19px] font-medium leading-none tracking-[-0.38px] text-snow outline-none transition-colors hover:text-tech focus-visible:ring-1 focus-visible:ring-tech active:opacity-70"
    >
      <span className="size-[3px] shrink-0 bg-menu-dot transition-colors group-hover:bg-tech" />
      <span className="trim whitespace-nowrap">{label}</span>
    </a>
  );
}

// Light/dark switch, built to the Figma "Toggle UI" geometry: a 29×19 outlined pill with a
// 13px knob inset 3px. The knob slides left (light) ↔ right (dark) on an ease-out curve.
function ToggleUI({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label="Dark mode"
      aria-pressed={on}
      title={on ? "Switch to light mode" : "Switch to dark mode"}
      onClick={onToggle}
      className="relative block h-[19px] w-[29px] shrink-0 cursor-pointer rounded-full border border-snow transition-opacity hover:opacity-80"
    >
      <span
        aria-hidden
        className={`absolute left-[2px] top-[2px] size-[13px] rounded-full bg-snow transition-transform duration-[280ms] ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none ${
          on ? "translate-x-[10px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  // The head script has already applied the saved/system theme; sync the switch to it.
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

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
      <nav className="hidden items-center gap-6 rounded-[4px] bg-zero-dark px-[30px] py-6 lg:flex">
        {LINKS.map((l) => (
          <MenuItem key={l.label} {...l} />
        ))}
        <ToggleUI on={theme === "dark"} onToggle={toggleTheme} />
      </nav>

      {/* Mobile menu button */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-[4px] bg-zero-dark px-4 py-3 text-[16px] font-medium leading-none text-snow lg:hidden"
      >
        <span className={`size-[3px] transition-colors ${open ? "bg-tech" : "bg-menu-dot"}`} />
        <span className="trim">{open ? "Close" : "Menu"}</span>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          className="absolute inset-x-4 top-full mt-3 flex flex-col items-start gap-4 rounded-[4px] bg-zero-dark p-6 sm:inset-x-6 lg:hidden"
        >
          {LINKS.map((l) => (
            <MenuItem key={l.label} {...l} onClick={() => setOpen(false)} />
          ))}
          <ToggleUI on={theme === "dark"} onToggle={toggleTheme} />
        </nav>
      )}
    </header>
  );
}
