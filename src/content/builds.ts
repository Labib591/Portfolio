import type { Build } from "./types";

/**
 * Shipped software. Facts here (names, stacks, live URLs, what broke, what he'd
 * change) were all carried over from the previous site, where Mahir had already
 * written them — so `broke` and `differently` are genuinely his, lightly
 * lowercased to match the desk's voice. `why` is new and therefore blank.
 */
export const builds: Build[] = [
  {
    slug: "medihelp",
    name: "medihelp",
    what: "an ecommerce platform for medical products.",
    year: "2025",
    stack: ["react", "node", "mongodb", "firebase"],
    live: "https://medihelp-591.web.app/",
    shot: "/img/medihelp.png",
    status: "live",
    why: null,
    broke: "handling real-time payments.",
    differently: "a tracking system, better notifications, and ratings.",
  },
  {
    slug: "carhelp",
    name: "carhelp",
    what: "car rentals — you book a car and manage the booking.",
    year: "2025",
    stack: ["react", "node", "mongodb", "firebase"],
    live: "https://carhelp-labib.web.app/",
    shot: "/img/carhelp.png",
    status: "live",
    why: null,
    broke: "overlapping bookings, and validating dates.",
    differently: "payments, and tracking the car in real time.",
  },
  {
    slug: "taskbase",
    name: "taskbase",
    what: "a freelance marketplace. people post tasks, freelancers bid on them.",
    year: "2025",
    stack: ["react", "node", "mongodb", "firebase"],
    live: "https://taskbase-c16cd.web.app/",
    repo: "https://github.com/Labib591/TaskBase",
    shot: "/img/taskbase.png",
    status: "live",
    why: null,
    broke: "real-time bidding.",
    differently: "escrow, better notifications, ratings.",
  },
  {
    slug: "unote",
    name: "unote",
    what: "notes and drawings, in flutter. closing the app never loses anything.",
    year: "2024",
    stack: ["flutter", "dart"],
    repo: "https://github.com/Labib591/Unote",
    shot: "/img/unote.png",
    status: "archived",
    why: null,
    broke: "persisting state, and keeping the drawing canvas fast.",
    differently: "cloud sync, sharing, and a lot more polish.",
  },
];
