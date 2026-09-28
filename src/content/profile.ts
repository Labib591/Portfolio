import type { Link } from "./types";

/**
 * Identity. Order matters here: the entrepreneur line is the headline and the
 * degree is a footnote, because that is what he asked for in his own words —
 * "that will not be my first identity, that will just be another info on the site."
 */
export const profile = {
  name: "Mahir Mohammed Labib",
  goesBy: "Mahir",

  /** His go-to line, verbatim. Do not rewrite this. */
  line: "an aspiring entrepreneur who loves to build products",

  /** The footnote. Deliberately small, deliberately late. */
  footnote: {
    school: "njit",
    study: "cs",
    grad: "2028",
  },

  /**
   * He is in two places at once: studying in New Jersey, building for Bangladesh.
   * Both clocks run on the desk. This is the one piece of decoration on the
   * whole site that is also a fact.
   */
  clocks: [
    { city: "newark", tz: "America/New_York", label: "where i am" },
    { city: "dhaka", tz: "Asia/Dhaka", label: "who i build for" },
  ],

  began: {
    when: "2020",
    what: "lockdown. c++ first, then flutter, then the web.",
  },

  links: [
    { label: "github", href: "https://github.com/Labib591" },
    { label: "linkedin", href: "https://www.linkedin.com/in/mahir-mohammed-labib-bb3085209/" },
    { label: "codeforces", href: "https://codeforces.com/profile/useless591" },
  ] satisfies Link[],

  handles: {
    github: "Labib591",
    codeforces: "useless591",
    /** TODO(mahir): the account where the digital art actually lives. */
    art: null as string | null,
  },

  contact: {
    email: "mahi.labib5@gmail.com",
    phone: "+8801675381031",
    whatsapp: "https://wa.me/8801675381031",
  },

  resume: "/Resume.pdf",
} as const;
