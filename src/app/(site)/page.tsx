import { Archive } from "@/components/sections/Archive";
import { Close } from "@/components/sections/Close";
import { Code } from "@/components/sections/Code";
import { Hero } from "@/components/sections/Hero";
import { Log } from "@/components/sections/Log";
import { OffScreen, type Cricket } from "@/components/sections/OffScreen";
import { Ventures } from "@/components/sections/Ventures";
import { getAllItems, getArt, getLog, getProjects, getSetting } from "@/lib/db";
import { getGithub } from "@/lib/github";

/**
 * The scroll.
 *
 * A server component: everything comes from the database or a live API, so
 * anything saved in /admin appears here without a deploy. Sections render
 * themselves to null when they have nothing, so the page grows as Mahir fills
 * it rather than showing empty scaffolding.
 */
export const revalidate = 60;

export default async function Home() {
  const [ventures, items, art, log, cricket, artSource, github] = await Promise.all([
    getProjects("venture"),
    getAllItems(),
    getArt(),
    getLog(30),
    getSetting<Cricket>("cricket"),
    getSetting<{ instagram?: string }>("art_source"),
    getGithub(),
  ]);

  return (
    <main>
      <Hero
        counts={{
          ventures: ventures.length,
          contributions: github.contributions,
          archive: art.length,
          offscreen: items.length,
        }}
      />
      <Ventures ventures={ventures} />
      <Code stats={github} />
      <Archive art={art} handle={artSource?.instagram} />
      <OffScreen items={items} cricket={cricket} />
      <Log entries={log} />
      <Close />
    </main>
  );
}
