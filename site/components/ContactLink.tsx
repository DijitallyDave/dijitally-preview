"use client";

import { openContactDialog } from "./ContactDialog";

/**
 * Link that opens the "Get in touch" lightbox. `href` is the no-JS fallback (e.g. a mailto:),
 * used only if scripts haven't run.
 */
export default function ContactLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        openContactDialog();
      }}
    >
      {children}
    </a>
  );
}
