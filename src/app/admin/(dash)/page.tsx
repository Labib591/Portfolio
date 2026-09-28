import Link from "next/link";
import { getAllItems, getArt, getLog, getProjects } from "@/lib/db";

/**
 * What is filled in, and what is still blank.
 *
 * The blanks are the useful half. Every unwritten note is a visible gap on the
 * live site, so this page counts them rather than only counting what exists —
 * a dashboard that reports "12 films" while 12 of them have no line is hiding
 * the only number that matters.
 */
export default async function Overview() {
  const [items, art, log, ventures, builds] = await Promise.all([
    getAllItems(),
    getArt(),
    getLog(500),
    getProjects("venture"),
    getProjects("build"),
  ]);

  const missingNotes = items.filter((i) => !i.note).length;
  const projects = [...ventures, ...builds];
  const missingWhat = projects.filter((p) => !p.what).length;

  const stats = [
    { label: "ventures", value: ventures.length, href: "/admin/work" },
    { label: "shipped", value: builds.length, href: "/admin/work" },
    { label: "list items", value: items.length, href: "/admin/lists" },
    { label: "art pieces", value: art.length, href: "/admin/art" },
    { label: "log entries", value: log.length, href: "/admin/log" },
  ];

  const gaps = [
    missingNotes > 0 && {
      text: `${missingNotes} list ${missingNotes === 1 ? "item has" : "items have"} no line written`,
      href: "/admin/lists",
    },
    missingWhat > 0 && {
      text: `${missingWhat} ${missingWhat === 1 ? "project has" : "projects have"} no description`,
      href: "/admin/work",
    },
    art.length === 0 && { text: "no art uploaded — the archive section stays hidden", href: "/admin/art" },
    log.length === 0 && { text: "nothing in the log yet", href: "/admin/log" },
    items.length === 0 && { text: "the lists are empty — films, music, games, books", href: "/admin/lists" },
  ].filter(Boolean) as { text: string; href: string }[];

  return (
    <div>
      <h1 className="d-h3">overview</h1>

      <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-9 border-t border-bone-lo pt-8 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label}>
            <dd>
              <Link href={s.href} className="d-h2 tnum transition-opacity hover:opacity-60">
                {s.value}
              </Link>
            </dd>
            <dt className="meta mt-2">{s.label}</dt>
          </div>
        ))}
      </dl>

      <section className="mt-16">
        <h2 className="meta">still blank</h2>
        {gaps.length === 0 ? (
          <p className="mt-5 text-ui text-ink-2">
            nothing outstanding. every item has a line and every project has a description.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-bone-lo border-t border-bone-lo">
            {gaps.map((g) => (
              <li key={g.text}>
                <Link
                  href={g.href}
                  className="group flex items-baseline justify-between gap-6 py-4"
                >
                  <span className="text-ui text-ink-2">{g.text}</span>
                  <span className="meta shrink-0 transition-transform group-hover:translate-x-1">
                    fix →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
