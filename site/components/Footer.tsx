import Marquee from "./Marquee";

const COUNTRIES = ["Australia", "New Zealand", "United Kingdom"];

function DotLink({ href, label, dot, text }: { href: string; label: string; dot: string; text: string }) {
  return (
    <a
      href={href}
      className={`group flex h-6 items-center gap-1.5 font-mono text-[12px] leading-none tracking-[-0.24px] ${text} transition-opacity hover:opacity-70`}
    >
      <span className={`size-[3px] ${dot} transition-transform group-hover:scale-150`} />
      <span className="trim whitespace-nowrap">{label}</span>
    </a>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-tech text-coal">
      <div className="flex flex-col lg:h-[422px] lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-[42px] px-4 py-20 lg:p-0">
          <h2 className="trim text-center text-[32px] leading-none tracking-[-0.64px] lg:text-h1">
            Need an ally for
            <br />
            your next project?
          </h2>
          <a
            href="mailto:hello@dijitally.com"
            className="group flex items-center gap-1 rounded-full border border-coal bg-coal px-6 py-[18px] text-[16px] font-medium leading-none text-tech transition-colors hover:bg-transparent hover:text-coal active:scale-[0.98]"
          >
            <span className="size-[3px] bg-tech transition-colors group-hover:bg-coal" />
            <span className="trim">Contact us</span>
          </a>
        </div>

        <div className="h-px w-full bg-coal lg:h-full lg:w-px" />

        <div className="flex min-w-0 flex-1 flex-col items-center gap-[42px] overflow-clip py-20 lg:py-0">
          <p className="trim font-mono text-[10px] font-medium leading-[1.2]">GLOB(ALLY)</p>
          <Marquee duration={32} repeat={2} label="Where we work" className="w-full">
            {COUNTRIES.map((c) => (
              <span key={c} className="flex shrink-0 items-center gap-6 pr-6">
                <span className="trim whitespace-nowrap text-[32px] leading-none tracking-[-0.64px] lg:text-h1">{c}</span>
                <span className="mt-1.5 size-2 shrink-0 bg-coal" aria-hidden />
              </span>
            ))}
          </Marquee>
          <a
            href="https://www.linkedin.com/company/dijitally"
            target="_blank"
            rel="noreferrer"
            aria-label="Dijitally on LinkedIn"
            className="block transition-transform hover:-translate-y-0.5"
          >
            <img src="/figma/linkedin.svg" alt="" width={47} height={47} className="block" />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-[42px] border-t border-coal p-4 sm:p-6 lg:p-16">
        <img
          src="/figma/footer-wordmark.svg"
          alt="Dijitally"
          width={1562}
          height={217.089}
          className="block h-auto w-full"
        />
        <div className="flex items-center justify-between gap-4">
          <DotLink href="#" label="PRIVACY POLICY" dot="bg-static" text="text-coal" />
          <DotLink href="#" label="TERMS + CONDITIONS" dot="bg-static" text="text-coal" />
        </div>
      </div>

      <div className="flex h-[42px] items-center justify-center bg-coal">
        <DotLink href="#top" label="BACK TO TOP" dot="bg-tech" text="text-tech" />
      </div>
    </footer>
  );
}
