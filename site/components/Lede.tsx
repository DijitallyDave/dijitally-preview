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
    <SplitHeading className={`trim w-full text-h1-mobile lg:w-auto lg:text-h1 ${className}`}>
      {lead} <span className="text-static">{children}</span>
    </SplitHeading>
  );
}
