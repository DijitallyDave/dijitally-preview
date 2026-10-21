import SplitHeading from "./SplitHeading";

// Two-tone section intro: lead phrase in secondary, follow-on in static grey.
export default function Lede({
  lead,
  children,
  className = "",
}: {
  lead: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SplitHeading className={`trim text-[32px] leading-none tracking-[-0.64px] lg:text-h1 ${className}`}>
      {lead} <span className="text-static">{children}</span>
    </SplitHeading>
  );
}
