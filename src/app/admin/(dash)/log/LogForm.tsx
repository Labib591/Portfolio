"use client";

import { useActionState } from "react";
import { Area, Danger, Field, Notice, Submit, Toggle } from "@/components/admin/ui";
import type { LogEntry } from "@/lib/db";
import { deleteLog, saveLog } from "../../actions";

const day = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(iso),
  );

export function LogForm({ entry }: { entry?: LogEntry }) {
  const [state, action] = useActionState(saveLog, {});
  const editing = Boolean(entry);

  const fields = (
    <form action={action} className="grid gap-6 pt-5 pb-7 md:grid-cols-12">
      {entry && <input type="hidden" name="id" value={entry.id} />}

      <Area
        className="md:col-span-12"
        label="entry"
        name="body"
        rows={3}
        defaultValue={entry?.body}
        placeholder="shipped the interview prep flow. star mapping was the hard part."
      />

      <Field
        className="md:col-span-4"
        label="tag"
        name="tag"
        defaultValue={entry?.tag}
        placeholder="cubiee"
      />
      <Field
        className="md:col-span-4"
        label="date"
        name="happened_on"
        type="date"
        defaultValue={entry?.happened_on?.slice(0, 10)}
      />
      <div className="flex items-center md:col-span-4">
        <Toggle label="published" name="published" defaultChecked={entry ? entry.published : true} />
      </div>

      <div className="flex items-center gap-6 md:col-span-12">
        <Submit>{editing ? "save" : "post"}</Submit>
        <Notice state={state} />
      </div>
    </form>
  );

  if (!editing) return fields;

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-baseline gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <time className="meta tnum w-[92px] shrink-0" dateTime={entry!.happened_on}>
          {day(entry!.happened_on)}
        </time>
        <span className="min-w-0 flex-1 truncate text-ui">{entry!.body}</span>
        {!entry!.published && <span className="meta shrink-0">hidden</span>}
        <span className="meta shrink-0 group-open:hidden">edit</span>
        <span className="meta hidden shrink-0 group-open:inline">close</span>
      </summary>

      {fields}

      <form action={deleteLog.bind(null, entry!.id)} className="border-t border-bone-lo pt-4 pb-6">
        <Danger confirm="delete this entry?" />
      </form>
    </details>
  );
}
