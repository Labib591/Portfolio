"use client";

import { useEffect } from "react";

/**
 * The public site's error boundary.
 *
 * Every section reads from Postgres, so one failed query would otherwise take
 * the whole page down for a visitor who did nothing wrong. This keeps the world
 * intact — bone, ink, the same type — and offers the one action that actually
 * helps.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("site:", error);
  }, [error]);

  return (
    <main className="gutter flex min-h-dvh flex-col justify-center">
      <h1 className="d-h1 max-w-[14ch]">this didn&rsquo;t load.</h1>

      <p className="mt-8 max-w-[46ch] text-lead leading-relaxed text-ink-2">
        not your fault — something on my end didn&rsquo;t answer. try it again.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
        <button
          onClick={reset}
          className="group inline-flex items-baseline gap-2 text-ui text-signal-deep"
        >
          <span className="border-b border-signal-deep/40 transition-colors group-hover:border-signal-deep">
            try again
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
        <a href="mailto:mahi.labib5@gmail.com" className="meta transition-colors hover:text-ink">
          or just email me
        </a>
      </div>
    </main>
  );
}
