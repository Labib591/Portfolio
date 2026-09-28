import { getLog } from "@/lib/db";
import { LogForm } from "./LogForm";

/**
 * Build-in-public entries. Short, dated, and the only part of the site that
 * changes without a redesign — which is what gives anyone a reason to return.
 */
export default async function LogAdmin() {
  const entries = await getLog(100);

  return (
    <div>
      <h1 className="d-h3">log</h1>
      <p className="mt-3 max-w-[64ch] text-ui text-meta">
        what you&rsquo;re building this week, what broke, what shipped. two sentences is a
        good entry. the site shows the most recent first.
      </p>

      <section className="mt-10">
        <h2 className="meta">new entry</h2>
        <LogForm />
      </section>

      <section className="mt-16">
        <h2 className="meta">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </h2>

        {entries.length === 0 ? (
          <p className="mt-5 text-ui text-meta italic">nothing logged yet.</p>
        ) : (
          <ul className="mt-5 divide-y divide-bone-lo border-t border-bone-lo">
            {entries.map((e) => (
              <li key={e.id}>
                <LogForm entry={e} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
