"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Project } from "@/lib/db";
import { VentureFrame } from "./VentureFrame";

/**
 * 01 — the scroll-locked section.
 *
 * The page stops and vertical scrolling drives horizontally through the
 * ventures instead. Pinning is the point: it turns "three cards in a row" into
 * three things you arrive at one at a time, each with the whole screen.
 *
 * Each panel is split down the middle — words left, a live shot of the actual
 * site filling the right half to the window edge. That replaced a
 * cursor-following thumbnail, which was wrong twice over: a 368px card is far
 * too small to show a piece of software, and it covered the name you were
 * hovering to see it.
 *
 * The horizontal distance is MEASURED from the track, never a percentage.
 * `xPercent` is relative to the element's own width, so on a 3-panel track
 * `xPercent: -200` travels 200% of three viewports — three times too far.
 */

const STATUS: Record<string, string> = {
  shipped: "shipped",
  running: "running",
  building: "in progress",
};

export function Ventures({ ventures }: { ventures: Project[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const el = track.current;
      if (!el || ventures.length < 2) return;

      const travel = () => el.scrollWidth - window.innerWidth;

      const tween = gsap.to(el, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${travel() * 1.1}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress.current) gsap.set(progress.current, { scaleX: self.progress });
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: root, dependencies: [ventures.length] },
  );

  return (
    <section ref={root} className="relative h-dvh overflow-hidden" aria-label="ventures">
      <div ref={track} className="flex h-full w-max">
        {ventures.map((v, i) => (
          <article key={v.slug} className="h-dvh w-screen shrink-0">
            <VentureFrame venture={v}>
              <div className="gutter flex h-full flex-col justify-between py-[calc(var(--gutter)*2.4)]">
                <div className="flex items-baseline gap-5">
                  <span className="meta tnum">
                    {String(i + 1).padStart(2, "0")} / {String(ventures.length).padStart(2, "0")}
                  </span>
                  {v.status && <span className="meta">{STATUS[v.status] ?? v.status}</span>}
                </div>

                <h2 className="d-h1 max-w-[11ch]">{v.name}</h2>

                <div className="max-w-[46ch]">
                  <div className="rule border-t" />
                  {v.what && (
                    <p className="mt-6 text-lead leading-relaxed text-ink-2">{v.what}</p>
                  )}

                  {/* Under the description, not beside the name — figures next
                      to a 148px word are two things fighting for one moment. */}
                  {v.proof?.length > 0 && (
                    <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-5">
                      {v.proof.map((p) => (
                        <div key={p.label}>
                          <dd className="d-h3 tnum">{p.value}</dd>
                          <dt className="meta mt-1.5 max-w-[15ch]">{p.label}</dt>
                        </div>
                      ))}
                    </dl>
                  )}

                  {/* No hover on touch, so the shot ships inline below lg. */}
                  {v.shot && (
                    <div className="relative mt-7 aspect-[16/10] w-full overflow-hidden bg-bone-lo lg:hidden">
                      <Image
                        src={v.shot}
                        alt={`${v.name} website`}
                        fill
                        sizes="92vw"
                        className="object-cover object-top"
                      />
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-3">
                    {v.role && <span className="meta">{v.role}</span>}
                    {v.url && (
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-baseline gap-2 text-ui text-signal-deep"
                      >
                        <span className="border-b border-signal-deep/40 transition-colors group-hover:border-signal-deep">
                          {v.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                        </span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </VentureFrame>
          </article>
        ))}
      </div>

      {/* Real progress through the pin. While the page refuses to move, this is
          the only thing telling you how much of the section is left. */}
      <div className="gutter pointer-events-none absolute inset-x-0 bottom-[calc(var(--gutter)+28px)]">
        <div className="rule relative border-t">
          <span
            ref={progress}
            className="absolute inset-x-0 -top-px block h-px origin-left bg-ink"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
