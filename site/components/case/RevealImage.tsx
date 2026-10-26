"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PixelReveal, { dominantColour } from "../PixelReveal";

/**
 * A case study image that arrives the way the homepage's work thumbnails do: covered in its
 * own most-used colour, which melts away to the left once it's on screen. `order` staggers
 * images that sit side by side.
 */
export default function RevealImage({
  src,
  alt,
  width,
  height,
  sizes,
  order = 0,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  order?: number;
  priority?: boolean;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const [color, setColor] = useState<string | null>(null);
  const [startAt, setStartAt] = useState<number | null>(null);

  const sample = (el: HTMLImageElement) => setColor(dominantColour(el) ?? "transparent");

  // A cached image can finish loading before hydration, when onLoad isn't listening yet.
  useEffect(() => {
    const el = img.current;
    if (el?.complete && el.naturalWidth) sample(el);
  }, []);

  // Start the stagger clock when the image first comes into view.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setStartAt(performance.now());
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={box}
      style={{ aspectRatio: `${width} / ${height}` }}
      className={`relative w-full overflow-hidden rounded-[4px] bg-ui lg:rounded-[8px] ${className}`}
    >
      <Image
        ref={img}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={(e) => sample(e.currentTarget)}
        onError={() => setColor("transparent")}
        className="object-cover"
      />
      <PixelReveal color={color} order={order} startAt={startAt} />
    </div>
  );
}
