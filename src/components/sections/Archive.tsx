import Image from "next/image";
import { BitmapText } from "@/components/BitmapText";
import { Reveal } from "@/components/Reveal";
import type { Art } from "@/lib/db";

/**
 * 03 — the archive.
 *
 * Photo manipulation, made before the code. These are the only colour on an
 * otherwise monochrome page, so the section gets out of their way entirely: no
 * frames, no cards, no uniform crop, no hover chrome.
 *
 * Every piece renders at its OWN aspect ratio from the dimensions captured at
 * upload. A masonry column layout is what makes that possible — a grid would
 * impose one ratio and crop the compositions, which on artwork is vandalism.
 * Reserving the true height also means the page never shifts as images load.
 *
 * The column count follows the piece count. This section was cut once for
 * looking thin at a single image, so one piece has to read as deliberate rather
 * than as two empty columns waiting to be filled.
 */
export function Archive({ art, handle }: { art: Art[]; handle?: string | null }) {
  if (!art.length) return null;

  const n = art.length;
  const columns =
    n === 1
      ? "columns-1"
      : n === 2
        ? "columns-1 sm:columns-2"
        : n < 8
          ? "columns-1 sm:columns-2 lg:columns-3"
          : "columns-1 sm:columns-2 lg:columns-3 xl:columns-4";

  // A lone piece at full page width reads as a banner, not as work.
  const width = n === 1 ? "max-w-[520px]" : "max-w-none";

  return (
    <section className="gutter py-[clamp(90px,16vh,190px)]" aria-label="archive">
      {/* Nothing in the top-right: that corner belongs to the fixed clocks. */}
      <Reveal>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h2 className="meta">03 — archive</h2>
          <span className="meta tnum">{String(n).padStart(2, "0")}</span>
        </div>

        <p className="mt-5 max-w-[44ch] text-lead leading-relaxed text-ink-2">
          photo manipulation. this came before the code, and most of it only ever
          lived on instagram.
        </p>

        {/* The handle renders as lit pixels — the same grid language as the
            contribution calendar one section up. It sweeps on first sight and
            re-sweeps on hover, and it needs its own line to be legible at all. */}
        {handle && (
          <a
            href={`https://instagram.com/${handle}`}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3 text-ink transition-opacity hover:opacity-70"
          >
            <BitmapText text={`@${handle}`} />
            <span aria-hidden className="text-ui">
              ↗
            </span>
          </a>
        )}
      </Reveal>

      <Reveal
        items="[data-piece]"
        stagger={0.08}
        className={`mt-12 gap-6 ${columns} ${width}`}
      >
        {art.map((piece, i) => (
          <figure key={piece.id} data-piece className="mb-6 break-inside-avoid">
            <div className="relative overflow-hidden bg-bone-lo">
              <Image
                src={piece.url}
                alt={piece.caption ?? piece.title ?? "artwork"}
                // Real dimensions, so the aspect ratio is the artwork's own and
                // the space is reserved before the bytes arrive.
                width={piece.width ?? 1200}
                height={piece.height ?? 1500}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                className="h-auto w-full"
                priority={i === 0}
              />
            </div>

            {(piece.caption || piece.year) && (
              <figcaption className="mt-3 flex items-baseline justify-between gap-4">
                <span className="text-ui text-ink-2">{piece.caption}</span>
                {piece.year && <span className="meta shrink-0">{piece.year}</span>}
              </figcaption>
            )}
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
