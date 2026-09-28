"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * The first viewport.
 *
 * His own line, set as large as the screen allows, revealed line by line from
 * behind a mask — type rising out of the page rather than fading onto it. The
 * name is demoted to a corner label, because the line is the more interesting
 * thing and he wrote it himself.
 *
 * On scroll the lines leave at slightly different rates. That stagger is what
 * separates a parallax trick from something that reads as composed: the eye
 * follows the last line out while the section beneath is already arriving.
 */
export function Hero({
  counts,
}: {
  counts: {
    ventures: number;
    contributions: number | null;
    archive: number;
    offscreen: number;
  };
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Entrance and exit animate SEPARATE elements on purpose. Pointed at the
      // same node they fight over yPercent: the scrubbed tween latches the
      // entrance's start value and pins that line off-screen forever, which is
      // exactly what happened the first time this was built.
      const enter = gsap.utils.toArray<HTMLElement>("[data-enter]");
      const exit = gsap.utils.toArray<HTMLElement>("[data-exit]");

      // Starts from the masked position, so nothing is invisible if JS never
      // runs — the mask is the only thing hiding it.
      gsap.from(enter, {
        yPercent: 108,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.075,
        delay: 0.12,
      });

      gsap.from("[data-hero-meta]", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.06,
        delay: 0.7,
      });

      // Exit, scrubbed. Each line leaves a little faster than the one above it.
      gsap.to(exit, {
        yPercent: -104,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="gutter relative flex min-h-dvh flex-col justify-center"
      aria-label="introduction"
    >
      <h1 className="d-h1 max-w-[16ch]">
        {["an aspiring", "entrepreneur", "who loves to", "build products"].map((line) => (
          <span key={line} className="reveal-line">
            <span data-exit>
              <span data-enter>{line}</span>
            </span>
          </span>
        ))}
      </h1>

      {/* The index of what is below. Tiny, aligned right, mono — the reader
          knows the shape of the page before they start scrolling. */}
      <div className="mt-[clamp(40px,7vh,88px)] flex flex-wrap items-end justify-between gap-8">
        <p data-hero-meta className="max-w-[38ch] text-lead leading-relaxed text-ink-2">
          i build products, run an agency, and i&rsquo;m putting together the biggest
          social fashion commerce platform in bangladesh.
        </p>

        {/* Four across overflows a phone. Two-by-two below sm, one row above. */}
        <ul
          data-hero-meta
          className="grid w-full shrink-0 grid-cols-2 gap-x-8 gap-y-5 sm:flex sm:w-auto sm:gap-x-10"
        >
          {(
            [
              ["01", "ventures", counts.ventures],
              ["02", "contributions", counts.contributions],
              ["03", "archive", counts.archive],
              ["04", "off-screen", counts.offscreen],
            ] as const
          ).map(([n, label, count]) => (
            <li key={n} className="flex flex-col gap-1">
              <span className="meta">
                {n} {label}
              </span>
              {/* A real count or an em dash — never a decorative zero for a
                  section that exists but is empty. */}
              <span className="d-h3 tnum">
                {count != null && count > 0 ? count.toLocaleString("en-US") : "—"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
