"use client";

import { useEffect, useState } from "react";

/** SSR-safe media query. Returns `false` on the server and the first paint. */
export function useMedia(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const on = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);

  return matches;
}

/**
 * Is there room to lay things out spatially?
 *
 * Below this the desk stops pretending to be a desk and becomes a stack of
 * sheets — which is the honest answer, not a degraded one. A 390px-wide
 * scrollable desktop is worse than no desktop.
 */
export const useSpatial = () => useMedia("(min-width: 1024px)");

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
