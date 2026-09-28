import type { Venture } from "./types";

/**
 * The headline drawer. Ventures lead on this desk because "an aspiring
 * entrepreneur who loves to build products" is the first line of the site.
 *
 * `proof` is empty on every entry on purpose. No user count, revenue figure,
 * funding round, team size or press mention has been supplied for any of
 * these, and inventing one would be the single worst thing this file could do.
 * When Mahir gives a real number it goes in, and not before.
 */
export const ventures: Venture[] = [
  {
    slug: "stealth",
    name: "unnamed, for now",
    what: "the biggest social fashion ecommerce platform in bangladesh.",
    status: "building",
    role: "building it now",
    /** TODO(mahir): what it actually is, and whether it can be named yet. */
    his: null,
  },
  {
    slug: "entire",
    name: "entire",
    what: "an integrated growth agency.",
    status: "running",
    url: "https://entire.agency",
    role: "i run it",
    /** TODO(mahir): what Entire actually does for people, in your words. */
    his: null,
  },
  {
    slug: "cubiee",
    name: "cubiee",
    /** TODO(mahir): what cubiee is. Deliberately blank — I will not guess. */
    what: null,
    status: "shipped",
    url: "https://cubiee.com",
    role: "i built and launched it",
    his: null,
  },
];
