"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

/**
 * Reveal on scroll.
 *
 * One implementation for every section, so the whole page shares a single
 * motion grammar instead of each block inventing its own easing and distance.
 *
 * It animates FROM a visible default: if JavaScript never runs, or the trigger
 * never fires, the content is already on screen. An entrance that starts at
 * opacity 0 in CSS is one bug away from an invisible page.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 26,
  stagger = 0.07,
  /** Selector for the children to stagger. Omit to animate the element itself. */
  items,
  start = "top 82%",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "ol";
  y?: number;
  stagger?: number;
  items?: string;
  start?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const targets = items
        ? gsap.utils.toArray<HTMLElement>(items, root.current)
        : [root.current!];
      if (!targets.length) return;

      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 0.95,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: root.current, start, once: true },
      });
    },
    { scope: root },
  );

  return (
    // @ts-expect-error -- Tag is a narrow union of intrinsic elements
    <Tag ref={root} className={cn(className)}>
      {children}
    </Tag>
  );
}
