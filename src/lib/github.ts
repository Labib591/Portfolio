import { profile } from "@/content/profile";

/**
 * GitHub contributions.
 *
 * There are two sources and they do not agree, for a reason worth writing down:
 *
 *   · WITH a token (`GITHUB_TOKEN`), the GraphQL `contributionsCollection`
 *     returns the same number GitHub shows Mahir on his own profile — private
 *     contributions included. This is the accurate one.
 *   · WITHOUT a token, only public activity is visible. Both the REST API and
 *     the public mirror agreed on 31 for the last year while his profile said
 *     819, because the difference is all private work. There is no
 *     unauthenticated way to see it; that is the point of "private".
 *
 * So the section reports which it got. Labelling 31 as "contributions" when the
 * true figure is 819 would be a lie by omission, and labelling 819 as public
 * would be the opposite one.
 *
 * Cached for an hour and called straight from the server component, so the
 * section renders with its numbers already in place.
 */
const revalidate = 3600;

export interface Day {
  date: string;
  count: number;
  level: number;
}

export interface GithubStats {
  since: number | null;
  languages: { name: string; count: number }[];
  contributions: number | null;
  weeks: Day[][] | null;
  /** True when a token was used, so private contributions are included. */
  complete: boolean;
  at: string;
  cold?: string;
}

/** Both sources return this shape, so the caller never branches on which ran. */
interface Calendar {
  source: "graphql" | "mirror";
  total: number | null;
  weeks: Day[][];
  createdAt: string | null;
}

const REST = { "User-Agent": "mahir-portfolio", accept: "application/vnd.github+json" };

async function rest<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, {
      headers: {
        ...REST,
        ...(process.env.GITHUB_TOKEN
          ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate },
      signal: AbortSignal.timeout(9000),
    });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

/** The authenticated path. Includes private contributions. */
async function viaGraphql(user: string): Promise<Calendar | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        createdAt
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays { date contributionCount contributionLevel }
            }
          }
        }
      }
    }`;

  try {
    const r = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "User-Agent": "mahir-portfolio",
      },
      body: JSON.stringify({ query, variables: { login: user } }),
      next: { revalidate },
      signal: AbortSignal.timeout(9000),
    });
    if (!r.ok) return null;

    const body = (await r.json()) as {
      data?: {
        user?: {
          createdAt?: string;
          contributionsCollection?: {
            contributionCalendar?: {
              totalContributions?: number;
              weeks?: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
            };
          };
        };
      };
    };

    const cal = body.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal?.weeks) return null;

    const LEVEL: Record<string, number> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };

    return {
      source: "graphql",
      total: cal.totalContributions ?? null,
      weeks: cal.weeks.map((w) =>
        w.contributionDays.map((d) => ({
          date: d.date,
          count: d.contributionCount,
          level: LEVEL[d.contributionLevel] ?? 0,
        })),
      ),
      createdAt: body.data?.user?.createdAt ?? null,
    };
  } catch {
    return null;
  }
}

/** The unauthenticated fallback. Public activity only. */
async function viaMirror(user: string): Promise<Calendar | null> {
  const grid = await (async () => {
    try {
      const r = await fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`, {
        next: { revalidate },
        signal: AbortSignal.timeout(9000),
      });
      if (!r.ok) return null;
      return (await r.json()) as {
        total?: Record<string, number>;
        contributions?: Day[];
      };
    } catch {
      return null;
    }
  })();

  const days = grid?.contributions;
  if (!days?.length) return null;

  // Flat day list → columns of 7, padded so each column is a calendar week.
  const weeks: Day[][] = [];
  let week: Day[] = [];
  const offset = new Date(days[0].date).getUTCDay();
  for (let i = 0; i < offset; i++) week.push({ date: "", count: -1, level: -1 });
  for (const d of days) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);

  return {
    source: "mirror",
    total: grid?.total?.lastYear ?? days.reduce((n, d) => n + d.count, 0),
    weeks,
    createdAt: null as string | null,
  };
}

interface GhRepo {
  language?: string | null;
  fork?: boolean;
}

export async function getGithub(): Promise<GithubStats> {
  const user = profile.handles.github;

  const [calendar, repos, me] = await Promise.all([
    viaGraphql(user).then((r) => r ?? viaMirror(user)),
    rest<GhRepo[]>(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`),
    rest<{ created_at?: string }>(`https://api.github.com/users/${user}`),
  ]);

  // Languages, counting only what he actually wrote.
  let languages: { name: string; count: number }[] = [];
  if (repos) {
    const tally = new Map<string, number>();
    for (const r of repos.filter((x) => !x.fork)) {
      if (r.language) tally.set(r.language, (tally.get(r.language) ?? 0) + 1);
    }
    languages = [...tally.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  const created = calendar?.createdAt ?? me?.created_at ?? null;

  return {
    since: created ? new Date(created).getUTCFullYear() : null,
    languages,
    contributions: calendar?.total ?? null,
    weeks: calendar?.weeks ?? null,
    // Only the authenticated calendar sees private work. The mirror always
    // returns a createdAt, so the source has to say so itself.
    complete: calendar?.source === "graphql",
    at: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    }).format(new Date()),
    ...(!calendar && !repos ? { cold: "github did not answer" } : {}),
  };
}
