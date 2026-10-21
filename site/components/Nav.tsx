"use client";

import { useEffect, useRef, useState } from "react";
import ContactDialog, { OPEN_CONTACT_EVENT } from "./ContactDialog";
import { applyTheme, type Theme } from "./theme";
import { asset } from "./asset";

// "Get in touch" opens the contact lightbox; its href is the no-JS fallback (the footer).
const LINKS = [
  { label: "Services", href: "#ways-of-working" },
  { label: "Work", href: "#work" },
  { label: "Allies", href: "#allies" },
  { label: "Get in touch", href: "#contact", contact: true },
];

function MenuItem({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
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

// Pixels of travel in one direction before the nav hides or reveals, so small jitters are ignored.
const SCROLL_THRESHOLD = 8;
// Near the top of the page the nav always shows.
const TOP_ZONE = 120;

/**
 * Which background is behind the wordmark: sections mark themselves with data-nav-bg =
 * "dark" | "light" | "page" (page follows the light/dark theme). The white wordmark is
 * inverted over light backgrounds so it stays legible once the nav floats over the page.
 */
function backgroundUnder(y: number): "dark" | "light" {
  const sections = document.querySelectorAll<HTMLElement>("[data-nav-bg]");
  for (const s of sections) {
    const r = s.getBoundingClientRect();
    if (r.top <= y && r.bottom > y) {
      const bg = s.dataset.navBg;
      if (bg === "page") return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      return bg === "light" ? "light" : "dark";
    }
  }
  return "dark";
}

export default function Nav() {
  const header = useRef<HTMLElement>(null);
  const logo = useRef<HTMLAnchorElement>(null);
  const mobileControls = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [hidden, setHidden] = useState(false);
  const [onLight, setOnLight] = useState(false);

  // Check the background behind whichever controls are showing: the wordmark on desktop,
  // the toggle + menu icon on mobile (a display:none element has no offsetParent).
  const updateTone = () => {
    const el = logo.current?.offsetParent ? logo.current : mobileControls.current;
    const r = el?.getBoundingClientRect();
    if (r) setOnLight(backgroundUnder(r.top + r.height / 2) === "light");
  };

  // The head script has already applied the saved/system theme; sync the switch to it.
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  // The header is fixed, so publish its height for the hero to reserve the same space.
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty("--nav-h", `${el.offsetHeight}px`);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Shy behaviour: hide on scroll down, reveal on scroll up.
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    let anchor = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (y < TOP_ZONE || openRef.current) {
        setHidden(false);
        anchor = y;
      } else if (y - anchor > SCROLL_THRESHOLD) {
        setHidden(true);
        anchor = y;
      } else if (anchor - y > SCROLL_THRESHOLD) {
        setHidden(false);
        anchor = y;
      }
      updateTone();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Esc closes the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Other buttons on the page (e.g. the footer's "Contact us") open the same lightbox.
  useEffect(() => {
    const open = () => {
      setOpen(false);
      setContactOpen(true);
    };
    window.addEventListener(OPEN_CONTACT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONTACT_EVENT, open);
  }, []);

  const openContact = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setContactOpen(true);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
    updateTone();
  };

  return (
    <>
      <header
        ref={header}
        // Keyboard users tabbing into a hidden nav bring it back.
        onFocusCapture={() => setHidden(false)}
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-end p-6 transition-transform duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none lg:items-end lg:justify-between lg:px-[42px] lg:pb-0 lg:pt-[42px] ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Desktop only: on mobile the wordmark sits large in the hero instead */}
        <a ref={logo} href="#top" aria-label="Dijitally home" className="pointer-events-auto hidden shrink-0 lg:block">
          <img
            src={asset("/figma/wordmark.svg")}
            alt="Dijitally"
            width={215.856}
            height={30}
            className={`block h-[30px] w-auto transition-[filter] duration-200 ${onLight ? "invert" : ""}`}
          />
        </a>

        {/* Desktop menu */}
        <nav className="pointer-events-auto hidden items-center gap-6 rounded-[4px] bg-zero-dark px-[30px] py-6 lg:flex">
          {LINKS.map((l) => (
            <MenuItem
              key={l.label}
              label={l.label}
              href={l.href}
              onClick={l.contact ? (e) => openContact(e) : undefined}
            />
          ))}
          <ToggleUI on={theme === "dark"} onToggle={toggleTheme} />
        </nav>

        {/* Mobile: theme toggle + two-bar menu icon (Figma "Header Container"); inverted over light sections */}
        <div
          ref={mobileControls}
          className={`pointer-events-auto flex items-center gap-6 transition-[filter] duration-200 lg:hidden ${
            onLight && !open ? "invert" : ""
          }`}
        >
          <ToggleUI on={theme === "dark"} onToggle={toggleTheme} />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative h-[19px] w-[30px] cursor-pointer"
          >
            <span
              className={`absolute left-0 h-[2px] w-[30px] bg-snow transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                open ? "top-1/2 -translate-y-1/2 rotate-30" : "top-[4.5px]"
              }`}
            />
            <span
              className={`absolute left-0 h-[2px] w-[30px] bg-snow transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                open ? "top-1/2 -translate-y-1/2 -rotate-30" : "top-[12.5px]"
              }`}
            />
          </button>
        </div>

        {open && (
          <nav
            id="mobile-menu"
            className="pointer-events-auto absolute inset-x-6 top-full flex flex-col items-start gap-4 rounded-[4px] bg-zero-dark p-6 lg:hidden"
          >
            {LINKS.map((l) => (
              <MenuItem
                key={l.label}
                label={l.label}
                href={l.href}
                onClick={(e) => (l.contact ? openContact(e) : setOpen(false))}
              />
            ))}
          </nav>
        )}
      </header>

      {/* Mobile menu backdrop: dims and blurs the page (matching the contact lightbox); a tap
          outside the menu closes it. Outside the header so it isn't moved by the shy transform. */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-coal/60 backdrop-blur-[12px] transition-opacity duration-300 starting:opacity-0 lg:hidden"
        />
      )}

      {/* Outside the header: it's pointer-events-none and transformed for the shy behaviour */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
