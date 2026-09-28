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
import type { Item, Kind } from "@/lib/db";
import { deleteItem, saveItem } from "../../actions";

/**
 * One row, one form.
 *
 * Existing items render collapsed inside a <details> so a list of forty books
 * stays scannable; the add form renders open. Both post to the same action —
 * the presence of a hidden `id` is what makes it an update rather than an
 * insert, so there is one code path to keep correct instead of two.
 */
export function ItemForm({
  kind,
  subtitleLabel,
  placeholder,
  imageLabel,
  linkLabel,
  item,
}: {
  kind: Kind;
  subtitleLabel: string;
  placeholder: string;
  imageLabel: string;
  linkLabel: string;
  item?: Item;
}) {
  const [state, action] = useActionState(saveItem, {});
  const editing = Boolean(item);

  const meta = (item?.meta ?? {}) as { image?: string; link?: string };

  const fields = (
    <form action={action} className="grid gap-6 pt-5 pb-7 md:grid-cols-12">
      <input type="hidden" name="kind" value={kind} />
      {item && <input type="hidden" name="id" value={item.id} />}

      <Field
        className="md:col-span-5"
        label="title"
        name="title"
        required
        defaultValue={item?.title}
        placeholder={placeholder}
      />
      <Field
        className="md:col-span-4"
        label={subtitleLabel}
        name="subtitle"
        defaultValue={item?.subtitle}
      />
      <Field
        className="md:col-span-3"
        label="year"
        name="year"
        defaultValue={item?.year}
        placeholder="2019"
      />

      <Area
        className="md:col-span-12"
        label="your line"
        name="note"
        rows={2}
        defaultValue={item?.note}
        placeholder="why it's here — not what it's about"
        hint="leave it empty and the site shows a blank rather than inventing one."
      />

      {/* Artwork: upload a file, or paste a URL if it is already hosted. */}
      <div className="md:col-span-7">
        <span className="meta block">{imageLabel}</span>
        <div className="mt-3 flex items-start gap-5">
          {meta.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={meta.image}
              alt=""
              className="h-[84px] w-[58px] shrink-0 bg-bone-lo object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <FileField label="" name="image_file" hint={`up to ${MAX_UPLOAD_MB}MB`} />
            <input
              name="image_url"
              defaultValue={meta.image ?? ""}
              placeholder="…or paste an image url"
              className="mt-3 w-full border-b border-bone-lo bg-transparent pb-2 text-ui outline-none transition-colors focus:border-ink"
            />
            {meta.image && (
              <span className="mt-3 block">
                <Toggle label="remove artwork" name="clear_image" />
              </span>
            )}
          </div>
        </div>
      </div>

      <Field
        className="md:col-span-5"
        label={linkLabel}
        name="link"
        type="url"
        defaultValue={meta.link}
        placeholder="https://"
        hint="makes the title clickable on the site."
      />

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-8">
        <Toggle label="would defend it" name="favourite" defaultChecked={item?.favourite} />
        <Toggle label="on it right now" name="is_current" defaultChecked={item?.is_current} />
        <Toggle
          label="published"
          name="published"
          defaultChecked={item ? item.published : true}
        />
      </div>

      <Field
        className="md:col-span-4"
        label="order"
        name="position"
        type="number"
        defaultValue={item?.position ?? 0}
      />

      <div className="flex items-center gap-6 md:col-span-12">
        <Submit>{editing ? "save" : "add"}</Submit>
        <Notice state={state} />
      </div>
    </form>
  );

  if (!editing) return fields;

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-baseline gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <span className="meta tnum w-8 shrink-0">{String(item!.position).padStart(2, "0")}</span>
        <span className="min-w-0 flex-1">
          <span className="text-ui text-ink">{item!.title}</span>
          {item!.subtitle && <span className="ml-2 text-ui text-meta">{item!.subtitle}</span>}
          {!item!.note && (
            <span className="ml-3 text-micro text-signal-deep italic">no line yet</span>
          )}
          {!item!.published && <span className="ml-3 meta">hidden</span>}
        </span>
        <span className="meta shrink-0 group-open:hidden">edit</span>
        <span className="meta hidden shrink-0 group-open:inline">close</span>
      </summary>

      {fields}

      <form
        action={deleteItem.bind(null, item!.id)}
        className="border-t border-bone-lo pt-4 pb-6"
      >
        <Danger confirm={`delete "${item!.title}"? it does not come back.`} />
      </form>
    </details>
  );
}
