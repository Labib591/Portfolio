"use client";

import { useActionState } from "react";
import {
  Area,
  Danger,
  Field,
  FileField,
  MAX_UPLOAD_MB,
  Notice,
  Submit,
  Toggle,
} from "@/components/admin/ui";
import type { Project } from "@/lib/db";
import { createProject, deleteProject, saveProject } from "../../actions";

export function ProjectRow({ project: p }: { project: Project }) {
  const [state, action] = useActionState(saveProject, {});

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-baseline gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <span className="meta tnum w-8 shrink-0">{String(p.position).padStart(2, "0")}</span>
        <span className="min-w-0 flex-1">
          <span className="text-ui text-ink">{p.name}</span>
          {p.status && <span className="ml-3 meta">{p.status}</span>}
          {!p.what && <span className="ml-3 text-micro text-signal-deep italic">no description</span>}
          {!p.published && <span className="ml-3 meta">hidden</span>}
        </span>
        <span className="meta shrink-0 group-open:hidden">edit</span>
        <span className="meta hidden shrink-0 group-open:inline">close</span>
      </summary>

      <form action={action} className="grid gap-6 pt-5 pb-7 md:grid-cols-12">
        <input type="hidden" name="id" value={p.id} />

        <Field className="md:col-span-5" label="name" name="name" required defaultValue={p.name} />
        <Field
          className="md:col-span-4"
          label="status"
          name="status"
          defaultValue={p.status}
          hint="shipped · running · building · live · archived"
        />
        <Field className="md:col-span-3" label="year" name="year" defaultValue={p.year} />

        <Area
          className="md:col-span-12"
          label="what it is"
          name="what"
          rows={3}
          defaultValue={p.what}
          hint="plain, factual, one or two sentences."
        />

        <Field
          className="md:col-span-6"
          label="your role"
          name="role"
          defaultValue={p.role}
          placeholder="i run it"
        />
        <Field className="md:col-span-6" label="link" name="url" defaultValue={p.url} />

        <Field className="md:col-span-6" label="repo" name="repo" defaultValue={p.repo} />
        <Field
          className="md:col-span-6"
          label="screenshot url"
          name="shot"
          defaultValue={p.shot}
          hint={
            p.status === "building"
              ? "shown pixelated past legibility while status is 'building'."
              : "shown in the panel beside the name."
          }
        />
        <FileField
          className="md:col-span-6"
          label="or upload a screenshot"
          name="shot_file"
          hint={`up to ${MAX_UPLOAD_MB}MB. replaces the url above.`}
        />

        <Field
          className="md:col-span-12"
          label="stack"
          name="stack"
          defaultValue={p.stack?.join(", ")}
          hint="comma separated."
        />

        {p.kind === "build" && (
          <>
            <Area className="md:col-span-12" label="why you built it" name="why" rows={2} defaultValue={p.why} />
            <Area className="md:col-span-6" label="what broke" name="broke" rows={2} defaultValue={p.broke} />
            <Area
              className="md:col-span-6"
              label="what you'd do differently"
              name="differently"
              rows={2}
              defaultValue={p.differently}
            />
          </>
        )}

        <Field
          className="md:col-span-4"
          label="order"
          name="position"
          type="number"
          defaultValue={p.position}
        />
        <div className="flex items-center md:col-span-8">
          <Toggle label="published" name="published" defaultChecked={p.published} />
        </div>

        <div className="flex items-center gap-6 md:col-span-12">
          <Submit />
          <Notice state={state} />
        </div>
      </form>

      <form action={deleteProject.bind(null, p.id)} className="border-t border-bone-lo pt-4 pb-6">
        <Danger confirm={`delete "${p.name}"? it does not come back.`} />
      </form>
    </details>
  );
}

export function NewProject({ kind }: { kind: "venture" | "build" }) {
  const [state, action] = useActionState(createProject, {});

  return (
    <form action={action} className="flex flex-wrap items-end gap-5">
      <input type="hidden" name="kind" value={kind} />
      <Field className="w-[260px]" label={`add a ${kind}`} name="name" required placeholder="name" />
      <Submit>add</Submit>
      <Notice state={state} />
    </form>
  );
}
