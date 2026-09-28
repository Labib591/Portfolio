"use client";

import Image from "next/image";
import type { Project } from "@/lib/db";

/**
 * A venture panel's right half.
 *
 * All three panels show the same thing — the product — and differ only in how
 * much of it you are allowed to see.
 *
 *   shipped / running   the site, plainly. No hover gate: hiding a real
 *                       screenshot behind a gesture meant most visitors never
 *                       saw the work at all.
 *   building            the same screenshot, pixelated past legibility. Real
 *                       work, deliberately unreadable, which is what "stealth"
 *                       actually looks like.
 *   no screenshot       nothing at all. An empty ruled box promising something
 *                       that never arrives is worse than an empty half.
 *
 * The obscuring is done by asking Next for a 32px-wide image and letting CSS
 * scale it up with `image-rendering: pixelated` — no canvas, no filter, and the
 * browser never receives a readable version of the picture. A CSS blur would
 * ship the full-resolution file to anyone who opens devtools.
 */
export function VentureFrame({
  venture,
  children,
}: {
  venture: Project;
  children: React.ReactNode;
}) {
  const domain = venture.url
    ? venture.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
    : null;

  const obscured = venture.status === "building";

  return (
    <div className="grid h-full lg:grid-cols-2">
      {children}

      {venture.shot && (
        <div className="hidden h-full items-center justify-center lg:flex">
          <figure className="w-full max-w-[560px]">
            <figcaption
              className="flex items-baseline justify-between gap-4 px-3 pb-2"
              style={{ borderBottom: "1px solid var(--color-ink)" }}
            >
              <span className="meta">{domain ?? venture.name}</span>
              <span className="meta">{obscured ? "not yet" : "live"}</span>
            </figcaption>

            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "4 / 3",
                borderInline: "1px solid var(--color-ink)",
                borderBottom: "1px solid var(--color-ink)",
              }}
            >
              {obscured ? (
                <Image
                  src={venture.shot}
                  alt={`${venture.name}, not public yet`}
                  // Deliberately tiny. Next serves a 32px-wide file and CSS
                  // blows it up; there is no full-size version to recover.
                  width={32}
                  height={24}
                  quality={35}
                  className="h-full w-full object-cover object-top"
                  style={{ imageRendering: "pixelated" }}
                />
              ) : (
                <Image
                  src={venture.shot}
                  alt={`${venture.name} website`}
                  fill
                  sizes="(max-width: 1024px) 0px, 42vw"
                  className="object-cover object-top"
                />
              )}
            </div>
          </figure>
        </div>
      )}
    </div>
  );
}
