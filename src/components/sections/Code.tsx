import { Reveal } from "@/components/Reveal";
import { profile } from "@/content/profile";
import type { GithubStats } from "@/lib/github";

/**
 * 02 — code.
 *
 * The calendar IS the section. It spans the full gutter width and everything
 * else defers to it: one figure above, one breakdown below. A row of stat tiles
 * around it would be the hero-metric template, and it would also be competing
 * with the only picture on the page for attention.
 *
 * Rendered in five steps of ink rather than GitHub's green, so it belongs to
 * this page instead of reading as an embedded badge. The single busiest day is
 * the one square that gets the signal colour — the whole red budget for this
 * section spent on one cell.
 *
 * `repos` and `last push` were here and are gone: a repository count measures
 * filing, not work, and the most recent push is a timestamp nobody came for.
 */

const STEP = [
  "color-mix(in oklab, var(--color-ink) 7%, var(--color-bone-lo))",
  "color-mix(in oklab, var(--color-ink) 26%, var(--color-bone-lo))",
  "color-mix(in oklab, var(--color-ink) 48%, var(--color-bone-lo))",
  "color-mix(in oklab, var(--color-ink) 72%, var(--color-bone-lo))",
  "var(--color-ink)",
];

export function Code({ stats }: { stats: GithubStats }) {
  const { weeks, contributions, since, languages, at, cold } = stats;

  // The busiest single day, so exactly one square can carry the signal — and
  // so the caption under the grid can say what that square is.
  let best = 0;
  let bestDate = "";
  if (weeks) {
    for (const w of weeks) {
      for (const d of w) {
        if (d.count > best) {
          best = d.count;
          bestDate = d.date;
        }
      }
    }
  }

  const day = (iso: string) =>
    iso
      ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(iso))
      : "";

  const TRACK = 260;

  return (
    <section className="py-[clamp(90px,16vh,190px)]" aria-label="code">
      <div className="gutter">
        <Reveal className="flex items-baseline gap-4">
          <h2 className="meta">02 — code</h2>
          <a
            href={`https://github.com/${profile.handles.github}`}
            target="_blank"
            rel="noreferrer"
            className="meta transition-colors hover:text-ink"
          >
            @{profile.handles.github} ↗
          </a>
        </Reveal>

        {cold ? (
          <Reveal className="mt-10">
            <p className="text-lead text-meta italic">github didn&rsquo;t answer just now.</p>
          </Reveal>
        ) : (
          <Reveal className="mt-10 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
            <div>
              <span className="d-h1 tnum block">
                {contributions == null ? "—" : contributions.toLocaleString("en-US")}
              </span>
              <span className="meta mt-3 block">contributions, last 12 months</span>
            </div>

            {since && <span className="meta">on github since {since}</span>}
          </Reveal>
        )}
      </div>

      {/* ── the calendar, full width ─────────────────────────────────────────
          A CSS grid of 53 equal columns rather than fixed-width cells, so it
          fills whatever width it is given and the squares stay square. */}
      {weeks && (
        <Reveal className="gutter mt-12">
          <div
            className="grid w-full"
            style={{
              gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
              gap: "clamp(2px, 0.26vw, 5px)",
            }}
          >
            {weeks.map((week, wi) => (
              <div
                key={wi}
                className="grid"
                style={{ gridTemplateRows: "repeat(7, 1fr)", gap: "clamp(2px, 0.26vw, 5px)" }}
              >
                {week.map((day, di) =>
                  day.level < 0 ? (
                    <span key={di} className="aspect-square" />
                  ) : (
                    <span
                      key={di}
                      title={`${day.count} on ${day.date}`}
                      className="aspect-square"
                      style={{
                        background:
                          best > 0 && day.count === best
                            ? "var(--color-signal)"
                            : STEP[Math.min(day.level, 4)],
                      }}
                    />
                  ),
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            {/* Names the one red square, which is the only thing on this grid
                that needs explaining. */}
            <span className="meta">
              {best > 0 ? `busiest day — ${best} on ${day(bestDate)}` : "no activity yet"}
            </span>
            <div className="flex items-center gap-2">
              <span className="meta">less</span>
              {STEP.map((bg) => (
                <span key={bg} className="size-[11px]" style={{ background: bg }} />
              ))}
              <span className="meta">more</span>
            </div>
          </div>
        </Reveal>
      )}

      {languages.length > 0 && (
        <div className="gutter">
          <Reveal className="mt-16 border-t border-bone-lo pt-10">
            <h3 className="meta">what it&rsquo;s written in</h3>
            <ul className="mt-6 space-y-3">
              {languages.map((l) => (
                <li key={l.name} className="flex items-center gap-4">
                  <span className="w-[96px] shrink-0 text-ui text-ink">{l.name}</span>
                  <span
                    className="h-[7px] shrink-0 bg-ink"
                    style={{
                      // A track, not a percentage: a percentage width on a flex
                      // item resolves against the flex line, and every bar came
                      // out identical. The track itself is viewport-relative so
                      // the longest bar does not run off a phone.
                      width: `calc(min(${TRACK}px, 42vw) * ${(
                        l.count / languages[0].count
                      ).toFixed(3)} + 10px)`,
                    }}
                  />
                  <span className="meta tnum">{l.count}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-12">
            <span className="meta">measured {at}</span>
          </Reveal>
        </div>
      )}
    </section>
  );
}
