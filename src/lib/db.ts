import { neon } from "@neondatabase/serverless";
import "server-only";

/**
 * One query layer, no ORM.
 *
 * This project has five tables and one developer. An ORM would be more surface
 * to keep current than the schema it wraps, and Neon's HTTP driver already gives
 * parameterised tagged templates — which is the only safety property that
 * actually matters here.
 */

if (!process.env.DATABASE_URL) {
  // Fail loudly at import rather than returning empty arrays that look like
  // "Mahir hasn't written this yet". A missing env var and an empty list must
  // never be indistinguishable on this site.
  throw new Error("DATABASE_URL is not set — copy .env.example to .env.local");
}

export const sql = neon(process.env.DATABASE_URL);

export type Kind = "film" | "album" | "game" | "book" | "hobby";

export interface Item {
  id: number;
  kind: Kind;
  title: string;
  subtitle: string | null;
  year: string | null;
  note: string | null;
  meta: Record<string, unknown>;
  favourite: boolean;
  is_current: boolean;
  position: number;
  published: boolean;
}

export interface Project {
  id: number;
  slug: string;
  kind: "venture" | "build";
  name: string;
  what: string | null;
  role: string | null;
  status: string | null;
  year: string | null;
  url: string | null;
  repo: string | null;
  shot: string | null;
  stack: string[];
  why: string | null;
  broke: string | null;
  differently: string | null;
  proof: { label: string; value: string }[];
  position: number;
  published: boolean;
}

export interface Art {
  id: number;
  title: string | null;
  caption: string | null;
  url: string;
  width: number | null;
  height: number | null;
  placeholder: string | null;
  year: string | null;
  position: number;
  published: boolean;
}

export interface LogEntry {
  id: number;
  body: string;
  tag: string | null;
  happened_on: string;
  published: boolean;
}

/**
 * The driver returns `Record<string, any>[]`, which does not overlap the row
 * types enough for a direct cast. Rows are shaped by the schema in db/, so one
 * narrowing helper here beats a double cast at every call site.
 */
const rows = <T>(r: Record<string, unknown>[]) => r as T[];

/**
 * Retry a read once.
 *
 * Neon's driver talks over HTTP, and the compute scales to zero — so the first
 * query after an idle period can lose the race with the wake-up and surface as
 * a bare `TypeError: Failed to fetch`. One retry after a short pause turns the
 * overwhelming majority of those into a normal page load.
 *
 * Reads only. A write must never be retried blindly: the first attempt may have
 * committed before the response was lost, and a second insert would duplicate it.
 */
async function read<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch {
    await new Promise((r) => setTimeout(r, 350));
    return run();
  }
}

export async function getProjects(kind: "venture" | "build") {
  return read(async () =>
    rows<Project>(
      await sql`
        select * from projects
        where kind = ${kind} and published
        order by position, id
      `,
    ),
  );
}

export async function getProject(slug: string) {
  return read(async () => {
    const r = rows<Project>(
      await sql`select * from projects where slug = ${slug} and published limit 1`,
    );
    return r[0] ?? null;
  });
}

export async function getItems(kind: Kind) {
  return read(async () =>
    rows<Item>(
      await sql`
        select * from items
        where kind = ${kind} and published
        order by position, id
      `,
    ),
  );
}

export async function getAllItems() {
  return read(async () =>
    rows<Item>(await sql`select * from items where published order by kind, position, id`),
  );
}

export async function getArt() {
  return read(async () =>
    rows<Art>(await sql`select * from art where published order by position, id`),
  );
}

export async function getLog(limit = 20) {
  return read(async () =>
    rows<LogEntry>(
      await sql`
        select * from log where published
        order by happened_on desc, id desc
        limit ${limit}
      `,
    ),
  );
}

export async function getSetting<T>(key: string): Promise<T | null> {
  return read(async () => {
    const r = await sql`select value from settings where key = ${key} limit 1`;
    return (r[0]?.value as T) ?? null;
  });
}
