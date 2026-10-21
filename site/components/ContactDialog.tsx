"use client";

import { useEffect, useRef, useState } from "react";

const CLOSE_MS = 350;

/** Window event that opens the lightbox from anywhere on the page (the nav owns the dialog). */
export const OPEN_CONTACT_EVENT = "dijitally:open-contact";
export const openContactDialog = () => window.dispatchEvent(new Event(OPEN_CONTACT_EVENT));

type Status = "idle" | "sending" | "sent" | "error" | "unavailable";

const field =
  "w-full border border-grey bg-transparent px-4 text-[16px] leading-[1.2] tracking-[0.16px] text-secondary outline-none transition-colors focus:border-secondary";

/**
 * "Get in touch" lightbox, built from the Figma "08. Contact Us" overlay: a 661px panel
 * docked right, inset 64px, over a dimmed page. Native <dialog> gives focus trapping,
 * Esc to close and an inert page behind it.
 */
export default function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
      // Next frame, so the panel transitions in from its closed position.
      requestAnimationFrame(() => setVisible(true));
    } else if (!open && d.open) {
      setVisible(false);
      const t = setTimeout(() => {
        d.close();
        document.documentElement.style.overflow = "";
        setStatus((s) => (s === "sent" ? "idle" : s));
      }, CLOSE_MS);
      return () => clearTimeout(t);
    }
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // The GitHub Pages preview is static, so there's no /api/contact to send to.
    if (process.env.NEXT_PUBLIC_STATIC_PREVIEW) {
      setStatus("unavailable");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="contact-title"
      data-visible={visible ? "" : undefined}
      // Esc: run our animated close instead of the instant native one.
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      // Clicks on the dialog itself (not the panel) are clicks on the dimmed backdrop.
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="contact-dialog fixed inset-0 m-0 size-full max-h-none max-w-none justify-end bg-transparent p-4 open:flex sm:p-6 lg:p-16"
    >
      <section
        className={`relative flex h-full w-full max-w-[661px] flex-col justify-center overflow-y-auto rounded-[8px] bg-primary px-6 py-20 transition-[translate,opacity] duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none lg:px-16 lg:py-[42px] ${
          visible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
        }`}
      >
        {/* Close: two 30px bars crossed at ±30°, per the Figma menu icon */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="group absolute right-6 top-6 h-[19px] w-[28px] cursor-pointer lg:right-16 lg:top-[42px]"
        >
          <span className="absolute left-1/2 top-1/2 h-[2px] w-[30px] -translate-x-1/2 -translate-y-1/2 -rotate-30 bg-secondary transition-transform duration-300 group-hover:-rotate-[20deg]" />
          <span className="absolute left-1/2 top-1/2 h-[2px] w-[30px] -translate-x-1/2 -translate-y-1/2 rotate-30 bg-secondary transition-transform duration-300 group-hover:rotate-[20deg]" />
        </button>

        <div className="flex w-full flex-col gap-[42px]">
          <h2 id="contact-title" className="trim text-[32px] leading-none tracking-[-0.64px] text-static lg:text-h1">
            Need an ally? <span className="text-secondary">Let’s start</span>
            <br className="hidden lg:block" />{" "}
            <span className="text-secondary">a project together.</span>
          </h2>

          {status === "sent" ? (
            <p role="status" className="text-[20px] leading-[1.1] tracking-[-0.4px] text-wcag lg:text-h3">
              Thanks — your message is on its way. We’ll be in touch soon.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="flex w-full flex-col gap-2.5">
              <input
                name="name"
                required
                autoComplete="name"
                aria-label="Your name"
                placeholder="Your name"
                className={`${field} h-[43px] placeholder:text-secondary`}
              />
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                aria-label="Your email"
                placeholder="Your email"
                className={`${field} h-[43px] placeholder:text-secondary`}
              />
              <textarea
                name="notes"
                aria-label="Notes"
                placeholder="Add any notes, if desired."
                className={`${field} h-[186px] resize-none py-4 placeholder:text-static`}
              />
              {/* Honeypot: hidden from people, filled in by bots; the API drops those. */}
              <input
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute -left-[9999px] size-px opacity-0"
              />

              <div className="flex items-center justify-between gap-4">
                <p role="alert" className="text-[14px] leading-[1.2] text-static">
                  {status === "error" && "Sorry, that didn’t send. Please try again."}
                  {status === "unavailable" && "This preview can’t send messages."}
                </p>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group flex shrink-0 cursor-pointer items-center gap-1 bg-secondary p-1.5 text-[19px] font-medium leading-none tracking-[-0.38px] text-primary transition-opacity disabled:cursor-wait disabled:opacity-60"
                >
                  <span className="size-[3px] bg-grey transition-colors group-hover:bg-tech" />
                  <span className="trim">{status === "sending" ? "Sending" : "Submit"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </dialog>
  );
}
