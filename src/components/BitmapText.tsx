"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

/**
 * Text rendered as lit pixels.
 *
 * The glyphs are not a hand-drawn bitmap font. The string is rasterised to an
 * offscreen canvas in the page's own monospace at a few pixels tall, the alpha
 * channel is thresholded, and every solid pixel becomes a cell. So it is a true
 * bitmap of the real typeface, it survives a font change, and it works for any
 * string — no glyph table to hand-author and get subtly wrong.
 *
 * It deliberately reuses the contribution calendar's vocabulary from the
 * section above: same square cells, same ink, same idea of a grid that lights
 * up. A different effect here would have been a second visual language for no
 * reason.
 *
 * Accessibility: the grid is decorative and hidden, and the real text ships
 * alongside it for screen readers and for anyone whose canvas is blocked.
 */
export function BitmapText({
  text,
  cell = 2,
  gap = 1,
  height = 16,
  className,
}: {
  text: string;
  /** Pixel size of one cell. */
  cell?: number;
  gap?: number;
  /**
   * Rows in the raster. This is a legibility setting, not a size setting.
   * Below 16, Geist Mono's `i` and `1` are the same shape — a flag, a stem and
   * a foot — because the dot has not yet separated from the stem. 16 is the
   * floor at which they diverge.
   */
  height?: number;
  className?: string;
}) {
  const [grid, setGrid] = useState<{ cols: number; lit: { x: number; y: number }[] } | null>(
    null,
  );
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;

    const raster = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      // Measure first, then size the canvas to fit exactly.
      const font = `${height}px "Mono", ui-monospace, monospace`;
      ctx.font = font;
      const width = Math.max(1, Math.ceil(ctx.measureText(text).width));

      canvas.width = width;
      canvas.height = height;

      // Re-set after resize: changing dimensions resets the context state.
      ctx.font = font;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.fillText(text, 0, height / 2);

      const { data } = ctx.getImageData(0, 0, width, height);

      // Only lit pixels become elements. At 16 rows the full field is ~1500
      // cells and roughly two thirds are empty; emitting those would triple the
      // DOM and the tween count for nothing. Column-major, so DOM order is
      // already the left-to-right sweep order.
      const lit: { x: number; y: number }[] = [];
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          if (data[(y * width + x) * 4 + 3] > 70) lit.push({ x, y });
        }
      }

      if (!cancelled) setGrid({ cols: width, lit });
    };

    // The face has to be loaded or we rasterise the fallback.
    if (document.fonts?.ready) void document.fonts.ready.then(() => !cancelled && raster());
    else raster();

    return () => {
      cancelled = true;
    };
  }, [text, height]);

  useGSAP(
    () => {
      if (!grid) return;
      gsap.registerPlugin(ScrollTrigger);

      const cells = gsap.utils.toArray<HTMLElement>("[data-px]", root.current);
      if (!cells.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(cells, { opacity: 1 });
        return;
      }

      // Lights up left to right, like a sign warming through.
      const sweep = (delay = 0) =>
        gsap.fromTo(
          cells,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.18,
            ease: "none",
            delay,
            stagger: { each: 0.0026, from: "start" },
            overwrite: true,
          },
        );

      gsap.set(cells, { opacity: 0 });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 92%",
        once: true,
        onEnter: () => sweep(),
      });

      // Bind to the enclosing control, not to the grid. The grid sits inside a
      // link that also holds an arrow; hovering that arrow is still hovering
      // the link, and mouseenter does not propagate down to children.
      const el = root.current?.closest("a,button") ?? root.current;
      const again = () => sweep();
      el?.addEventListener("mouseenter", again);
      el?.addEventListener("focus", again);
      return () => {
        el?.removeEventListener("mouseenter", again);
        el?.removeEventListener("focus", again);
      };
    },
    { scope: root, dependencies: [grid] },
  );

  return (
    <span ref={root} className={cn("inline-flex items-center align-middle", className)}>
      <span className="sr-only">{text}</span>

      {grid ? (
        <span
          aria-hidden
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, ${cell}px)`,
            gridTemplateRows: `repeat(${height}, ${cell}px)`,
            gap: `${gap}px`,
          }}
        >
          {grid.lit.map((p) => (
            <span
              key={`${p.x}-${p.y}`}
              data-px
              style={{
                gridColumn: p.x + 1,
                gridRow: p.y + 1,
                background: "currentColor",
              }}
            />
          ))}
        </span>
      ) : (
        // Until the raster exists, the real text stands in — never a blank.
        <span aria-hidden>{text}</span>
      )}
    </span>
  );
}
