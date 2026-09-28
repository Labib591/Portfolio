import Link from "next/link";
import { getAllItems, type Item, type Kind } from "@/lib/db";
import { ItemForm } from "./ItemForm";

/**
 * Films, music, games, books, hobbies.
 *
 * The active list is a URL parameter rather than client state, so every list is
 * a link you can bookmark, the back button works, and the page stays a server
 * component that reads straight from Postgres.
 */

const KINDS: {
  kind: Kind;
  label: string;
  subtitle: string;
  blank: string;
  /** What the artwork is called for this kind, and where the link points. */
  image: string;
  link: string;
}[] = [
  {
    kind: "film",
    label: "films",
    subtitle: "director",
    blank: "the one you'd defend",
    image: "poster",
    link: "trailer or letterboxd",
  },
  {
    kind: "album",
    label: "music",
    subtitle: "artist",
    blank: "album or artist",
    image: "cover",
    link: "spotify or youtube",
  },
  {
    kind: "game",
    label: "games",
    subtitle: "platform",
    blank: "what you play",
    image: "key art",
    link: "store page",
  },
  {
    kind: "book",
    label: "books",
    subtitle: "author",
    blank: "what you're reading",
    image: "cover",
    link: "goodreads",
  },
  {
    kind: "hobby",
    label: "hobbies",
    subtitle: "how often",
    blank: "everything else",
    image: "photo",
    link: "link",
  },
];

export default async function Lists({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind: raw } = await searchParams;
  const active = (KINDS.find((k) => k.kind === raw)?.kind ?? "film") as Kind;
  const meta = KINDS.find((k) => k.kind === active)!;

  const all = await getAllItems();
  const items = all.filter((i) => i.kind === active);
  const counts = Object.fromEntries(
    KINDS.map((k) => [k.kind, all.filter((i) => i.kind === k.kind).length]),
  );

  return (
    <div>
      <h1 className="d-h3">the lists</h1>
      <p className="mt-3 max-w-[64ch] text-ui text-meta">
        the note is the part that matters. an item with no note shows as a blank on the
        site rather than getting filled in for you — that was the whole point.
      </p>

      <nav className="mt-9 flex flex-wrap gap-x-7 gap-y-3 border-b border-bone-lo pb-4">
        {KINDS.map((k) => (
          <Link
            key={k.kind}
            href={`/admin/lists?kind=${k.kind}`}
            className={
              k.kind === active
                ? "meta !text-ink underline decoration-signal-deep decoration-2 underline-offset-[6px]"
                : "meta transition-colors hover:text-ink"
            }
          >
            {k.label} <span className="tnum">{counts[k.kind] ?? 0}</span>
          </Link>
        ))}
      </nav>

      <section className="mt-10">
        <h2 className="meta">add to {meta.label}</h2>
        <ItemForm
          kind={active}
          subtitleLabel={meta.subtitle}
          placeholder={meta.blank}
          imageLabel={meta.image}
          linkLabel={meta.link}
        />
      </section>

      <section className="mt-16">
        <h2 className="meta">
          {items.length} in {meta.label}
        </h2>

        {items.length === 0 ? (
          <p className="mt-5 text-ui text-meta italic">nothing here yet.</p>
        ) : (
          <ul className="mt-5 divide-y divide-bone-lo border-t border-bone-lo">
            {items.map((item: Item) => (
              <li key={item.id}>
                <ItemForm
                  kind={active}
                  subtitleLabel={meta.subtitle}
                  placeholder={meta.blank}
                  imageLabel={meta.image}
                  linkLabel={meta.link}
                  item={item}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
