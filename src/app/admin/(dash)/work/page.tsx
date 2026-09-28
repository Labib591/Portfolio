import { getProjects } from "@/lib/db";
import { NewProject, ProjectRow } from "./ProjectForms";

/** Ventures and shipped builds. Same shape, separated by `kind`. */
export default async function WorkAdmin() {
  const [ventures, builds] = await Promise.all([getProjects("venture"), getProjects("build")]);

  return (
    <div>
      <h1 className="d-h3">ventures + work</h1>
      <p className="mt-3 max-w-[64ch] text-ui text-meta">
        ventures lead the site. the order field is what decides the sequence you scroll
        through.
      </p>

      {(
        [
          ["venture", "ventures", ventures],
          ["build", "shipped", builds],
        ] as const
      ).map(([kind, label, rows]) => (
        <section key={kind} className="mt-14">
          <h2 className="meta">
            {label} <span className="tnum">{rows.length}</span>
          </h2>

          <ul className="mt-5 divide-y divide-bone-lo border-t border-bone-lo">
            {rows.map((p) => (
              <li key={p.id}>
                <ProjectRow project={p} />
              </li>
            ))}
          </ul>

          <div className="mt-7">
            <NewProject kind={kind} />
          </div>
        </section>
      ))}
    </div>
  );
}
