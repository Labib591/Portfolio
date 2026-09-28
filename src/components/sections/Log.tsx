import { Reveal } from "@/components/Reveal";
import type { LogEntry } from "@/lib/db";

/**
 * 05 — the log.
 *
 * Dated entries, newest first. The only part of the site that changes without a
 * redesign, which is the only real reason anyone comes back to a personal site.
 * Hidden entirely until there is something in it.
 */
export function Log({ entries }: { entries: LogEntry[] }) {
  if (!entries.length) return null;

  const when = (iso: string) =>
    new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
      new Date(iso),
    );

  return (
    <section className="gutter py-[clamp(90px,16vh,190px)]" aria-label="log">
      <Reveal className="flex items-baseline gap-4">
        <h2 className="meta">05 — log</h2>
        <span className="meta tnum">{String(entries.length).padStart(2, "0")}</span>
      </Reveal>

      <Reveal as="ol" items="[data-entry]" stagger={0.05} className="mt-10 border-t border-bone-lo">
        {entries.map((e) => (
          <li
            key={e.id}
            data-entry
            className="grid items-baseline gap-x-10 gap-y-2 border-b border-bone-lo py-7 md:grid-cols-12"
          >
            <time dateTime={e.happened_on} className="meta tnum md:col-span-2">
              {when(e.happened_on)}
            </time>
            <p className="text-lead leading-relaxed text-ink-2 md:col-span-8">{e.body}</p>
            {e.tag && <span className="meta md:col-span-2 md:text-right">{e.tag}</span>}
          </li>
        ))}
      </Reveal>
    </section>
  );
}
