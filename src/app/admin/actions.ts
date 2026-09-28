"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, destroySession, requireSession, verifyPassword } from "@/lib/auth";
import { sql } from "@/lib/db";
import { deleteImage, ingestImageUrl, isStored, uploadImage } from "@/lib/storage";

/**
 * Every mutation calls requireSession() itself.
 *
 * The admin layout already redirects signed-out visitors, but a server action is
 * a public POST endpoint — it is reachable without ever rendering that layout.
 * Guarding only in the layout would leave every one of these open.
 */

type State = { error?: string; ok?: string };

const str = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" && v.trim() ? v.trim() : null;
};
const num = (f: FormData, k: string) => {
  const v = str(f, k);
  return v === null ? null : Number(v);
};
const bool = (f: FormData, k: string) => f.get(k) === "on" || f.get(k) === "true";

function refresh(...paths: string[]) {
  revalidatePath("/");
  for (const p of paths) revalidatePath(p);
}

/* ── auth ────────────────────────────────────────────────────────────────── */

export async function signIn(_prev: State, form: FormData): Promise<State> {
  const password = str(form, "password");
  if (!password) return { error: "enter the password" };

  // A uniform delay on failure: without it, response time distinguishes
  // "no password sent" from "wrong password" from "right password".
  const ok = await verifyPassword(password);
  if (!ok) {
    await new Promise((r) => setTimeout(r, 450));
    return { error: "that's not it" };
  }

  await createSession();
  redirect("/admin");
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}

/* ── the personal lists ──────────────────────────────────────────────────── */

export async function saveItem(_prev: State, form: FormData): Promise<State> {
  await requireSession();

  const id = num(form, "id");
  const kind = str(form, "kind");
  const title = str(form, "title");
  if (!kind || !title) return { error: "a kind and a title, at minimum" };

  /**
   * Artwork and links live in `meta` rather than as new columns: a poster, an
   * album cover and a game key art are the same field wearing different names,
   * and so are a trailer, a Spotify track and a store page.
   *
   * An uploaded file wins over a pasted URL. Either is optional, and leaving
   * both empty on an edit keeps whatever is already there — so re-saving a row
   * to fix a typo never silently drops its poster.
   */
  const existing = id
    ? ((await sql`select meta from items where id = ${id}`)[0]?.meta as Record<string, unknown>) ??
      {}
    : {};

  const pasted = str(form, "image_url");
  let image = pasted ?? (existing.image as string | undefined) ?? null;

  const file = form.get("image_file");
  if (file instanceof File && file.size > 0) {
    try {
      const up = await uploadImage(file);
      image = up.url;
    } catch (e) {
      return { error: e instanceof Error ? e.message : "that image would not upload" };
    }
  } else if (pasted && !isStored(pasted)) {
    // Copy it into our bucket so it cannot rot, hotlink, or force an
    // open-ended remotePatterns allowlist.
    image = await ingestImageUrl(pasted);
  }

  if (bool(form, "clear_image")) image = null;

  const meta = {
    ...existing,
    image,
    link: str(form, "link") ?? null,
  };

  const values = {
    kind,
    title,
    subtitle: str(form, "subtitle"),
    year: str(form, "year"),
    note: str(form, "note"),
    favourite: bool(form, "favourite"),
    is_current: bool(form, "is_current"),
    position: num(form, "position") ?? 0,
    published: form.get("published") === null ? true : bool(form, "published"),
    meta,
  };

  if (id) {
    await sql`
      update items set
        kind = ${values.kind}, title = ${values.title}, subtitle = ${values.subtitle},
        year = ${values.year}, note = ${values.note}, favourite = ${values.favourite},
        is_current = ${values.is_current}, position = ${values.position},
        published = ${values.published}, meta = ${JSON.stringify(values.meta)}::jsonb,
        updated_at = now()
      where id = ${id}
    `;
  } else {
    await sql`
      insert into items (kind, title, subtitle, year, note, favourite, is_current, position, published, meta)
      values (${values.kind}, ${values.title}, ${values.subtitle}, ${values.year}, ${values.note},
              ${values.favourite}, ${values.is_current}, ${values.position}, ${values.published},
              ${JSON.stringify(values.meta)}::jsonb)
    `;
  }

  refresh("/admin/lists");
  return { ok: id ? "saved" : `added ${title}` };
}

export async function deleteItem(id: number) {
  await requireSession();
  await sql`delete from items where id = ${id}`;
  refresh("/admin/lists");
}

/* ── art ─────────────────────────────────────────────────────────────────── */

export async function uploadArt(_prev: State, form: FormData): Promise<State> {
  await requireSession();

  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return { error: "pick at least one image" };

  const caption = str(form, "caption");
  const year = str(form, "year");

  const [{ next }] = await sql`select coalesce(max(position), -1) + 1 as next from art`;
  let position = Number(next);
  let done = 0;
  const failures: string[] = [];

  for (const file of files) {
    try {
      const { url, width, height } = await uploadImage(file);
      await sql`
        insert into art (title, caption, url, width, height, year, position)
        values (${file.name.replace(/\.[^.]+$/, "")}, ${caption}, ${url},
                ${width}, ${height}, ${year}, ${position++})
      `;
      done++;
    } catch (e) {
      failures.push(`${file.name}: ${e instanceof Error ? e.message : "failed"}`);
    }
  }

  refresh("/admin/art");
  if (!done) return { error: failures.join("; ") };
  return {
    ok: `uploaded ${done}`,
    error: failures.length ? `${failures.length} failed — ${failures.join("; ")}` : undefined,
  };
}

export async function saveArt(_prev: State, form: FormData): Promise<State> {
  await requireSession();
  const id = num(form, "id");
  if (!id) return { error: "missing id" };

  await sql`
    update art set
      title = ${str(form, "title")}, caption = ${str(form, "caption")},
      year = ${str(form, "year")}, position = ${num(form, "position") ?? 0},
      published = ${form.get("published") === null ? true : bool(form, "published")}
    where id = ${id}
  `;
  refresh("/admin/art");
  return { ok: "saved" };
}

export async function deleteArt(id: number) {
  await requireSession();
  const rows = await sql`select url from art where id = ${id}`;
  const url = rows[0]?.url as string | undefined;
  await sql`delete from art where id = ${id}`;
  // Remove the object too, or the bucket fills with rows nothing references.
  if (url) await deleteImage(url).catch(() => {});
  refresh("/admin/art");
}

/* ── ventures + builds ───────────────────────────────────────────────────── */

export async function saveProject(_prev: State, form: FormData): Promise<State> {
  await requireSession();

  const id = num(form, "id");
  const name = str(form, "name");
  if (!id || !name) return { error: "missing id or name" };

  const stack = (str(form, "stack") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  /**
   * The screenshot can be uploaded, pasted as a URL, or left alone. A pasted
   * URL is copied into our own bucket for the same reason item artwork is:
   * otherwise it rots, hotlinks, and forces an open remotePatterns allowlist.
   * Leaving both empty on an edit keeps whatever is already there, so fixing a
   * typo never silently drops the image.
   */
  const pastedShot = str(form, "shot");
  let shot = pastedShot;
  const shotFile = form.get("shot_file");
  if (shotFile instanceof File && shotFile.size > 0) {
    try {
      shot = (await uploadImage(shotFile)).url;
    } catch (e) {
      return { error: e instanceof Error ? e.message : "that screenshot would not upload" };
    }
  } else if (pastedShot && !isStored(pastedShot) && /^https:\/\//i.test(pastedShot)) {
    shot = await ingestImageUrl(pastedShot);
  }

  await sql`
    update projects set
      name = ${name}, what = ${str(form, "what")}, role = ${str(form, "role")},
      status = ${str(form, "status")}, year = ${str(form, "year")},
      url = ${str(form, "url")}, repo = ${str(form, "repo")}, shot = ${shot},
      stack = ${stack}, why = ${str(form, "why")}, broke = ${str(form, "broke")},
      differently = ${str(form, "differently")},
      position = ${num(form, "position") ?? 0},
      published = ${form.get("published") === null ? true : bool(form, "published")},
      updated_at = now()
    where id = ${id}
  `;

  refresh("/admin/work");
  return { ok: `saved ${name}` };
}

export async function createProject(_prev: State, form: FormData): Promise<State> {
  await requireSession();
  const name = str(form, "name");
  const kind = str(form, "kind");
  if (!name || !kind) return { error: "a name and a kind" };

  const slug =
    str(form, "slug") ??
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const [{ next }] =
    await sql`select coalesce(max(position), -1) + 1 as next from projects where kind = ${kind}`;

  try {
    await sql`
      insert into projects (slug, kind, name, position)
      values (${slug}, ${kind}, ${name}, ${Number(next)})
    `;
  } catch {
    return { error: `"${slug}" already exists — pick another name` };
  }

  refresh("/admin/work");
  return { ok: `added ${name}` };
}

export async function deleteProject(id: number) {
  await requireSession();
  await sql`delete from projects where id = ${id}`;
  refresh("/admin/work");
}

/* ── the log ─────────────────────────────────────────────────────────────── */

export async function saveLog(_prev: State, form: FormData): Promise<State> {
  await requireSession();

  const id = num(form, "id");
  const body = str(form, "body");
  if (!body) return { error: "write something" };

  const tag = str(form, "tag");
  const on = str(form, "happened_on");

  if (id) {
    await sql`
      update log set body = ${body}, tag = ${tag},
        happened_on = coalesce(${on}::date, happened_on),
        published = ${form.get("published") === null ? true : bool(form, "published")}
      where id = ${id}
    `;
  } else {
    await sql`
      insert into log (body, tag, happened_on)
      values (${body}, ${tag}, coalesce(${on}::date, current_date))
    `;
  }

  refresh("/admin/log");
  return { ok: id ? "saved" : "posted" };
}

export async function deleteLog(id: number) {
  await requireSession();
  await sql`delete from log where id = ${id}`;
  refresh("/admin/log");
}
