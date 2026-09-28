import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import type { Item, Kind } from "@/lib/db";

/**
 * Artwork is not one shape. A film poster is 2:3, a record sleeve is square,
 * a book jacket is taller than a poster. Forcing one ratio crops all three
 * badly, so each kind keeps its own.
 */
const ART_RATIO: Record<Kind, string> = {
  film: "2 / 3",
  book: "2 / 3",
  album: "1 / 1",
  game: "1 / 1",
  hobby: "4 / 3",
};

/**
 * 04 — away from the keyboard.
 *
 * Built with the ventures anatomy on purpose: a standing word on the left, the
 * artifact on the right, his sentence under the title. The things he watches
 * are laid out like the things he builds because on this site they rank with
 * them — that is the whole argument of the section, made structurally rather
 * than stated.
 *
 * What it replaced: a twelve-column table of 58px thumbnails and 14px notes.
 * It was the only section on the page that never used display type, it boxed
 * the one piece of colour it owns into a chip, and it was structurally
 * identical to the log directly beneath it.
 *
 * The category word sits in a sticky rail, so it holds while its items pass —
 * the pin from 01, done in CSS, which costs nothing and pays off the moment a
 * list grows past one screen.
 *
 * Empty categories are omitted rather than rendered as headings with nothing
 * under them, so this section grows as Mahir fills it instead of looking broken
 * until it is complete.
 */

const GROUPS: { kind: Kind; label: string; meta: string }[] = [
  { kind: "film", label: "watching", meta: "films" },
  { kind: "album", label: "listening", meta: "music" },
  { kind: "game", label: "playing", meta: "games" },
  { kind: "book", label: "reading", meta: "books" },
  { kind: "hobby", label: "otherwise", meta: "hobbies" },
];

/** Clears the fixed corner labels and their 88px scrim. */
const RAIL_TOP = "lg:top-[96px]";

/** The rule above a band, and the air above that rule. */
const BAND = "mt-[clamp(56px,7vh,104px)] border-t border-bone-lo pt-7 lg:grid lg:grid-cols-12 lg:gap-x-10";

export interface Cricket {
  format?: string;
  side?: string;
  note?: string;
}

export function OffScreen({ items, cricket }: { items: Item[]; cricket?: Cricket | null }) {
  const groups = GROUPS.map((g) => ({ ...g, rows: items.filter((i) => i.kind === g.kind) })).filter(
    (g) => g.rows.length > 0,
  );

  if (!groups.length && !cricket?.note) return null;

  const current = items.filter((i) => i.is_current);

  return (
    <section className="gutter py-[clamp(90px,16vh,190px)]" aria-label="off screen">
      {/* The "right now" line sits BELOW the section label, not opposite it.
          Opposite, it lands in the top-right corner where the fixed clocks
          live and the two overlap as the section scrolls past.

          It is set at display scale because it is the one fact here that is
          true only today — the section's headline writes itself from whatever
          he is in the middle of. */}
      <Reveal>
        <h2 className="meta">04 — off-screen</h2>
        {current.length > 0 && (
          <p className="d-h2 mt-7 max-w-[19ch] text-meta">
            right now:{" "}
            {current.map((c, i) => (
              <span key={c.id}>
                {i > 0 && ", "}
                <span className="text-ink">{c.title}</span>
              </span>
            ))}
          </p>
        )}
      </Reveal>

      {groups.map((g) => {
        // A band where nothing has a cover reserves no column for one. Inside a
        // band that does, every row keeps the column so the titles hold a line —
        // alignment where it buys something, no reserved emptiness where it
        // would only be a frame around nothing.
        const shelved = g.rows.some((r) => Boolean((r.meta as { image?: string } | null)?.image));

        return (
          <div key={g.kind} className={BAND}>
            <Reveal className="lg:col-span-4">
              <div className={cn("lg:sticky", RAIL_TOP)}>
                <h3 className="d-h2">{g.label}</h3>
                <span className="meta tnum mt-4 block">
                  {g.meta} {String(g.rows.length).padStart(2, "0")}
                </span>
              </div>
            </Reveal>

            <Reveal
              as="ul"
              items="[data-row]"
              stagger={0.06}
              className="mt-10 lg:col-span-8 lg:mt-0"
            >
              {g.rows.map((row) => {
                const meta = (row.meta ?? {}) as { image?: string; link?: string };

                const mark = row.favourite && (
                  // Signal as a fill, never as text on this ground.
                  <span
                    role="img"
                    aria-label="would defend this one"
                    title="would defend this one"
                    className="size-[7px] shrink-0 self-center rounded-full bg-signal"
                  />
                );

                return (
                  <li
                    key={row.id}
                    data-row
                    className={cn(
                      "border-b border-bone-lo py-9 first:pt-0 last:border-b-0 last:pb-0",
                      // auto/1fr rows, or a cover taller than the text it sits
                      // beside shares its slack between both rows and pushes the
                      // line halfway down the page, away from the title it is
                      // about. Row two absorbs the difference instead.
                      shelved &&
                        "grid grid-cols-[clamp(108px,28vw,136px)_1fr] gap-x-6 gap-y-6 md:grid-cols-[clamp(140px,13vw,208px)_1fr] md:grid-rows-[auto_1fr] md:gap-x-10",
                    )}
                  >
                    {meta.image && (
                      <div
                        // self-start, or the stretched grid row overrides the
                        // ratio and every cover comes out the height of its
                        // neighbour's paragraph.
                        className="relative w-full self-start overflow-hidden bg-bone-lo md:row-span-2"
                        style={{ aspectRatio: ART_RATIO[g.kind] }}
                      >
                        <Image
                          src={meta.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 136px, 208px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className={cn("min-w-0", shelved && "col-start-2")}>
                      <h4 className="d-h3">
                        {meta.link ? (
                          <a
                            href={meta.link}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-baseline gap-3"
                          >
                            <span className="border-b border-ink/15 transition-colors group-hover:border-ink">
                              {row.title}
                            </span>
                            {mark}
                            <span
                              aria-hidden
                              className="text-ui text-meta transition-transform duration-300 group-hover:translate-x-0.5"
                            >
                              ↗
                            </span>
                          </a>
                        ) : (
                          <span className="inline-flex items-baseline gap-3">
                            {row.title}
                            {mark}
                          </span>
                        )}
                      </h4>

                      <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
                        {row.subtitle && <span className="text-ui text-meta">{row.subtitle}</span>}
                        {row.year && <span className="meta tnum">{row.year}</span>}
                        {/* The headline names what is current; this locates it.
                            Once the list is longer than a screen the two are
                            nowhere near each other. */}
                        {row.is_current && <span className="meta text-ink">now</span>}
                      </div>
                    </div>

                    {/* No blank filler. An item with no line simply shows none —
                        so the ones he had something to say about are the ones
                        that carry weight, and the hierarchy writes itself. */}
                    {row.note && (
                      <p
                        className={cn(
                          "max-w-[46ch] text-lead leading-relaxed text-ink-2",
                          shelved
                            ? "col-span-2 md:col-span-1 md:col-start-2 md:self-start"
                            : "mt-6",
                        )}
                      >
                        {row.note}
                      </p>
                    )}
                  </li>
                );
              })}
            </Reveal>
          </div>
        );
      })}

      {/* Cricket has no list and no cover — its line is its content, so the line
          takes the title's scale and closes the section on his voice. */}
      {cricket?.note && (
        <div className={BAND}>
          <Reveal className="lg:col-span-4">
            <div className={cn("lg:sticky", RAIL_TOP)}>
              <h3 className="d-h2">cricket</h3>
              <span className="meta mt-4 block">
                {[cricket.format, cricket.side].filter(Boolean).join(" · ")}
              </span>
            </div>
          </Reveal>

          <Reveal className="mt-10 lg:col-span-8 lg:mt-0">
            <p className="d-h3 max-w-[26ch]" style={{ lineHeight: 1.22 }}>
              {cricket.note}
            </p>
          </Reveal>
        </div>
      )}
    </section>
  );
}
