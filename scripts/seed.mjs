/**
 * Seeds the facts that already exist, so /admin opens with real rows to edit
 * rather than an empty database.
 *
 * Idempotent: every insert is `on conflict do nothing`, keyed on slug. Re-running
 * it will never duplicate or overwrite anything Mahir has since edited.
 *
 *   node scripts/seed.mjs
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const here = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  const raw = await readFile(join(here, "..", ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

const sql = neon(process.env.DATABASE_URL);

/**
 * Ventures. cubiee's description is taken from cubiee.com itself rather than
 * guessed — the site says what it does far better than a summary would.
 */
const ventures = [
  {
    slug: "cubiee",
    name: "cubiee",
    what:
      "an all-in-one job help platform. drop in a résumé and it comes back out as a live portfolio, " +
      "scored against a real job description across five fit dimensions, with interview answers built " +
      "from your own bullets and a four-week plan to close what's missing.",
    role: "built and launched it",
    status: "shipped",
    year: "2026",
    url: "https://cubiee.com",
    position: 0,
  },
  {
    slug: "entire",
    name: "entire",
    what: "an integrated growth agency.",
    role: "i run it",
    status: "running",
    url: "https://entire.agency",
    position: 1,
  },
  {
    slug: "stealth",
    name: "unnamed, for now",
    what: "the biggest social fashion ecommerce platform in bangladesh.",
    role: "building it now",
    status: "building",
    position: 2,
  },
];

const builds = [
  {
    slug: "medihelp",
    name: "medihelp",
    what: "an ecommerce platform for medical products.",
    year: "2025",
    status: "live",
    url: "https://medihelp-591.web.app/",
    shot: "/img/medihelp.png",
    stack: ["react", "node", "mongodb", "firebase"],
    broke: "handling real-time payments.",
    differently: "a tracking system, better notifications, and ratings.",
    position: 0,
  },
  {
    slug: "carhelp",
    name: "carhelp",
    what: "car rentals — you book a car and manage the booking.",
    year: "2025",
    status: "live",
    url: "https://carhelp-labib.web.app/",
    shot: "/img/carhelp.png",
    stack: ["react", "node", "mongodb", "firebase"],
    broke: "overlapping bookings, and validating dates.",
    differently: "payments, and tracking the car in real time.",
    position: 1,
  },
  {
    slug: "taskbase",
    name: "taskbase",
    what: "a freelance marketplace. people post tasks, freelancers bid on them.",
    year: "2025",
    status: "live",
    url: "https://taskbase-c16cd.web.app/",
    repo: "https://github.com/Labib591/TaskBase",
    shot: "/img/taskbase.png",
    stack: ["react", "node", "mongodb", "firebase"],
    broke: "real-time bidding.",
    differently: "escrow, better notifications, ratings.",
    position: 2,
  },
  {
    slug: "unote",
    name: "unote",
    what: "notes and drawings, in flutter. closing the app never loses anything.",
    year: "2024",
    status: "archived",
    repo: "https://github.com/Labib591/Unote",
    shot: "/img/unote.png",
    stack: ["flutter", "dart"],
    broke: "persisting state, and keeping the drawing canvas fast.",
    differently: "cloud sync, sharing, and a lot more polish.",
    position: 3,
  },
];

for (const v of [...ventures.map((x) => ({ ...x, kind: "venture" })), ...builds.map((x) => ({ ...x, kind: "build" }))]) {
  await sql`
    insert into projects (slug, kind, name, what, role, status, year, url, repo, shot, stack, broke, differently, position)
    values (
      ${v.slug}, ${v.kind}, ${v.name}, ${v.what ?? null}, ${v.role ?? null}, ${v.status ?? null},
      ${v.year ?? null}, ${v.url ?? null}, ${v.repo ?? null}, ${v.shot ?? null},
      ${v.stack ?? []}, ${v.broke ?? null}, ${v.differently ?? null}, ${v.position}
    )
    on conflict (slug) do nothing
  `;
}

/**
 * Cricket lives in settings rather than `items` — it is a set of preferences,
 * not a list. These three facts are his, given directly.
 */
const settings = [
  [
    "cricket",
    {
      format: "test",
      side: "bangladesh",
      note: "a sucker for test cricket. bangladesh, obviously — but i'll watch almost any game.",
    },
  ],
  ["art_source", { instagram: "chitrok0r", medium: "photo manipulation" }],
  [
    "hero",
    {
      line: "an aspiring entrepreneur who loves to build products",
      name: "Mahir Mohammed Labib",
    },
  ],
];

for (const [key, value] of settings) {
  await sql`
    insert into settings (key, value) values (${key}, ${JSON.stringify(value)}::jsonb)
    on conflict (key) do nothing
  `;
}

const [{ count: projectCount }] = await sql`select count(*)::int as count from projects`;
const [{ count: settingCount }] = await sql`select count(*)::int as count from settings`;
console.log(`projects: ${projectCount}   settings: ${settingCount}`);
