"use client";

import Image from "next/image";
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
import type { Art } from "@/lib/db";
import { deleteArt, saveArt, uploadArt } from "../../actions";

/**
 * Multi-file upload.
 *
 * Every file is attempted independently and failures are reported by name, so a
 * single 14MB file in a batch of thirty does not discard the other twenty-nine —
 * which is exactly what an all-or-nothing upload would do to a big archive.
 */
export function ArtUploader() {
  const [state, action] = useActionState(uploadArt, {});

  return (
    <form action={action} className="grid gap-6 pt-5 md:grid-cols-12">
      <FileField
        className="md:col-span-12"
        label="images"
        name="files"
        multiple
        required
        hint={`jpg, png, webp, avif or gif. up to ${MAX_UPLOAD_MB}MB each. select as many as you like.`}
      />

      <Field
        className="md:col-span-8"
        label="caption for this batch"
        name="caption"
        placeholder="optional — applies to everything in this upload"
      />
      <Field className="md:col-span-4" label="year" name="year" placeholder="2019" />

      <div className="flex flex-wrap items-center gap-6 md:col-span-12">
        <Submit>upload</Submit>
        <Notice state={state} />
      </div>
    </form>
  );
}

export function ArtRow({ piece }: { piece: Art }) {
  const [state, action] = useActionState(saveArt, {});

  return (
    <div>
      {/* next/image rather than a raw tag: this grid can hold hundreds of
          full-resolution photo-manipulation pieces, and unoptimised originals
          would make the admin the heaviest page on the site. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bone-lo">
        <Image
          src={piece.url}
          alt={piece.title ?? ""}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          className="object-cover"
        />
      </div>

      <details className="group mt-3">
        <summary className="flex cursor-pointer list-none items-baseline gap-3 [&::-webkit-details-marker]:hidden">
          <span className="meta tnum w-6 shrink-0">{String(piece.position).padStart(2, "0")}</span>
          <span className="min-w-0 flex-1 truncate text-ui">{piece.title ?? "untitled"}</span>
          {!piece.published && <span className="meta shrink-0">hidden</span>}
          <span className="meta shrink-0 group-open:hidden">edit</span>
          <span className="meta hidden shrink-0 group-open:inline">close</span>
        </summary>

        <form action={action} className="grid gap-5 pt-5">
          <input type="hidden" name="id" value={piece.id} />
          <Field label="title" name="title" defaultValue={piece.title} />
          <Area label="caption" name="caption" rows={2} defaultValue={piece.caption} />
          <div className="grid grid-cols-2 gap-5">
            <Field label="year" name="year" defaultValue={piece.year} />
            <Field label="order" name="position" type="number" defaultValue={piece.position} />
          </div>
          <Toggle label="published" name="published" defaultChecked={piece.published} />
          <div className="flex items-center gap-5">
            <Submit />
            <Notice state={state} />
          </div>
        </form>

        <form action={deleteArt.bind(null, piece.id)} className="mt-5">
          <Danger confirm="delete this piece and its file? it does not come back." />
        </form>
      </details>
    </div>
  );
}
