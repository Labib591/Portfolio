"use client";

import { useEffect } from "react";

/**
 * The admin's error boundary.
 *
 * Reads talk to Neon over HTTP, and Neon's compute scales to zero — so a query
 * can genuinely fail while the database wakes, or if the dev server restarts
 * under an open tab. Without this the whole page falls over and the only way
 * back is a manual reload.
 *
 * `reset()` re-runs the failed render, which is exactly the right recovery for
 * a transient network fault: the retry in db.ts already covers most of them, and
 * this catches what gets past it.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("admin:", error);
  }, [error]);

  const transient = /fetch|network|ECONN|timeout/i.test(error.message);

  return (
    <div className="max-w-[60ch] py-16">
      <h1 className="d-h3">that didn&rsquo;t load</h1>

      <p className="mt-4 text-ui leading-relaxed text-ink-2">
        {transient
          ? "the database didn't answer in time. it scales to zero when idle, so the first request after a quiet spell occasionally loses the race with the wake-up."
          : "something broke rendering this page."}
      </p>

      <p className="mt-6 text-micro leading-relaxed text-meta">
        {error.message}
        {error.digest ? ` · ${error.digest}` : ""}
      </p>

      <button
        onClick={reset}
        className="mt-8 border border-ink bg-ink px-4 py-2 text-ui text-bone transition-opacity hover:opacity-85"
      >
        try again
      </button>
    </div>
  );
}
