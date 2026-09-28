/**
 * Runs every .sql file in db/ in filename order, once each.
 *
 * Deliberately not an ORM migration framework: this project has one developer
 * and a handful of tables, and a framework would be more moving parts to keep
 * current than the thing it manages. A tiny ledger table is enough to make it
 * idempotent, which is the only property that actually matters.
 *
 *   node scripts/migrate.mjs
 */
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const here = dirname(fileURLToPath(import.meta.url));
const dbDir = join(here, "..", "db");

// Load .env.local without a dependency — Node's --env-file is not available in
// every runner, and dotenv is one more package to keep current.
async function loadEnv() {
  if (process.env.DATABASE_URL) return;
  try {
    const raw = await readFile(join(here, "..", ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local; rely on the ambient environment */
  }
}

await loadEnv();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Put it in .env.local.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

await sql`
  create table if not exists _migrations (
    name     text primary key,
    ran_at   timestamptz not null default now()
  )
`;

const done = new Set((await sql`select name from _migrations`).map((r) => r.name));
const files = (await readdir(dbDir)).filter((f) => f.endsWith(".sql")).sort();

let ran = 0;
for (const file of files) {
  if (done.has(file)) {
    console.log(`  skip  ${file}`);
    continue;
  }
  const body = await readFile(join(dbDir, file), "utf8");
  // The HTTP driver sends one statement per request, so split on semicolons
  // that end a line. Every statement in db/ is written to suit that.
  const statements = body
    .split(/;\s*$/m)
    .map((s) => s.trim())
    // Drop chunks that are only comments or whitespace — the file opens with a
    // long comment block, and sending it alone would be a syntax error.
    .filter((s) => s.replace(/--[^\n]*/g, "").trim().length > 0);

  for (const statement of statements) {
    await sql.query(statement);
  }
  await sql`insert into _migrations (name) values (${file})`;
  console.log(`  ran   ${file}  (${statements.length} statements)`);
  ran++;
}

console.log(ran ? `\n${ran} migration(s) applied.` : "\nAlready up to date.");
