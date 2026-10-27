import RevealImage from "./RevealImage";
import VimeoClip from "./VimeoClip";
import type { CaseImage, CaseVideo } from "./CaseHero";

/**
 * A row of case study images at the page's margins: one full width, or several side by side
 * on desktop (stacked on mobile), each sized by its own shape. Side-by-side images reveal in
 * turn, like the work carousel. A video item plays from Vimeo instead (see VimeoClip).
 */
export default function CaseGallery({ images }: { images: (CaseImage | CaseVideo)[] }) {
  const cols = images.length;
  return (
    <section data-nav-bg="page" className="bg-primary px-6 py-6 lg:px-[42px] lg:py-[21px]">
      <div
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[var(--cols,1fr)] lg:gap-[42px]"
        // Columns share the width in proportion to each image's aspect, so a row lines up in height.
        style={cols > 1 ? ({ "--cols": images.map((i) => `${i.width / i.height}fr`).join(" ") } as React.CSSProperties) : undefined}
      >
        {images.map((img, i) => {
          const sizes = cols > 1 ? `(min-width: 1024px) ${Math.round(100 / cols)}vw, 100vw` : "100vw";
          return "vimeo" in img ? (
            <VimeoClip key={`${img.vimeo}-${i}`} {...img} />
          ) : (
            <RevealImage key={`${img.src}-${i}`} {...img} order={i} sizes={sizes} />
          );
        })}
      </div>
    </section>
  );
}
