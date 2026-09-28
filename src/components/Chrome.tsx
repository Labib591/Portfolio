"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

/**
 * The fixed frame.
 *
 * Four mono labels pinned to the corners of the viewport, aligned to the same
 * page gutter as everything else. They never move, so the content scrolling
 * between them does all the work — which is the whole grammar of this layout.
 *
 * The two clocks are the one piece of the frame that is also a fact: he studies
 * in New Jersey and builds for Bangladesh, so his working day has two halves.
 */

function Clock({ city, tz }: { city: string; tz: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    // Never rendered on the server: the two runtimes disagree about "now" and
    // the mismatch hydrates as a flash of the wrong time.
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: tz,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [tz]);

  return (
    <span className="meta" data-readout>
      {city} {time ?? "--:--"}
    </span>
  );
}

export function Chrome({ section }: { section?: string }) {
  // The name is context for the first screen only. Past the hero each section
  // announces itself, and leaving the name up means it collides with every
  // section label that scrolls through the top-left corner.
  const [past, setPast] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setPast(window.scrollY > window.innerHeight * 0.6);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Content scrolls underneath these labels, so both edges get a scrim that
          fades into the ground. Without it a section heading passing through the
          top corner collides with the clocks and neither is readable. It is
          invisible over flat bone and only does work where something is behind
          it — which is exactly when it is needed. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[88px]"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-bone) 0%, color-mix(in oklab, var(--color-bone) 80%, transparent) 55%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[88px]"
        style={{
          background:
            "linear-gradient(to top, var(--color-bone) 0%, color-mix(in oklab, var(--color-bone) 80%, transparent) 55%, transparent 100%)",
        }}
      />

      <div className="relative flex items-start justify-between gap-4 gutter pt-[var(--gutter)]">
        {/* Both clocks are the point — two places, one working day — so the name
            shortens rather than the clocks dropping. At 390px the full name and
            two clocks collide. */}
        <span
          className="meta transition-opacity duration-500"
          style={{ opacity: past ? 0 : 1 }}
          aria-hidden={past}
        >
          <span className="sm:hidden">Mahir Labib</span>
          <span className="hidden sm:inline">{profile.name}</span>
        </span>
        <div className="flex shrink-0 gap-3 sm:gap-5">
          {profile.clocks.map((c) => (
            <Clock key={c.city} city={c.city} tz={c.tz} />
          ))}
        </div>
      </div>

      <div className="gutter absolute inset-x-0 bottom-0 flex items-end justify-between pb-[var(--gutter)]">
        <span className="meta">{section ?? "scroll"}</span>
        <a
          href={`mailto:${profile.contact.email}`}
          className="meta pointer-events-auto inline-flex items-center gap-2 transition-colors hover:text-ink"
        >
          {/* The one live dot on the page. Signal as a fill, never as text. */}
          <span className="size-[6px] rounded-full bg-signal" />
          open to build
        </a>
      </div>
    </div>
  );
}
