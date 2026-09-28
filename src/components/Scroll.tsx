"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The scroll engine.
 *
 * Lenis replaces the browser's scroll with an interpolated one, and GSAP's
 * ScrollTrigger drives every pinned section and scrubbed animation off it. The
 * two have to share a clock or they drift a frame apart and pinned sections
 * visibly judder — so Lenis is driven from GSAP's ticker rather than its own
 * requestAnimationFrame loop, and lag smoothing is off.
 *
 * Under prefers-reduced-motion none of this initialises: the page falls back to
 * native scrolling and ScrollTrigger's pins are never created, which is the
 * honest fallback rather than a slower version of the same motion.
 */
export function Scroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      // Slightly longer than default: this site is read by scrolling, and a
      // short duration makes pinned sections feel snatched rather than scrubbed.
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      // Touch devices already interpolate; doubling it feels like lag.
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts change metrics, which changes every pinned section's measurements.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
