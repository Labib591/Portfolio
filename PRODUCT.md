# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16.3 (App Router) + React 19.2 + TypeScript + Tailwind CSS 4.3.
GSAP 3.15 with ScrollTrigger and `@gsap/react` for pinning and scrubbed motion;
Lenis for interpolated scrolling, driven from GSAP's ticker so the two share one
clock. Neon Postgres via `@neondatabase/serverless` (raw parameterised SQL, no
ORM) and Neon branchable object storage via `@aws-sdk/client-s3` for uploads.
Self-hosted variable fonts. Deploy target **Vercel**.

React is pinned to **19.2.8**: it is the last release satisfying a peer range
that was needed earlier in the build, and nothing since has required moving it.

Removed and not coming back: the Vite + Firebase Hosting original (scrapped
2026-09-19), and the Three.js / R3F, Howler foley and zustand layers that
belonged to the abandoned "analog desk" concept.

## Users

One primary user: **Mahir himself.** Stated explicitly — "This is not for
recruiters. This is for me, myself. I want to express myself through the site,
not impress a recruiter."

Secondary, unoptimised-for: friends, peers, other founders, anyone following a
shared link. No hiring-funnel goal governs the hierarchy.

## Product Purpose

A personal site that is a self-portrait rather than a résumé: the products he
builds, the agency he runs, the startup he is building, the code he writes, and
what he watches, listens to, plays, reads and follows. Success is that it feels
like *him*, and that he keeps adding to it.

## Positioning

**A scroll you are driven through, not a page you browse.** There is no
navigation; the page decides what is in front of you and holds it there. The
ventures section pins and scrubs horizontally so each company arrives on its own
full screen instead of sitting in a row of equal cards.

## Operating Context

- Mahir lives in two places at once: an undergraduate at **NJIT in New Jersey**
  while building a company **for Bangladesh**. Newark and Dhaka are both his
  working day, and both clocks run in the fixed chrome.
- Visitors arrive by shared link, mostly from social. No search or recruiter
  funnel is designed for.
- Roughly half of visits are on a phone. Pinned horizontal scroll and every
  hover-revealed element must have a non-hover equivalent there.

## Capabilities and Constraints

- **Sections, in scroll order:** hero, 01 ventures (pinned, horizontal),
  02 code, 03 off-screen, 04 log, the close. Every section renders to `null`
  when it has no content, so the page grows as it is filled rather than showing
  empty scaffolding.
- **`/admin`**, password-protected, backed by Postgres: the personal lists
  (films, music, games, books, hobbies), ventures and builds, the log, and image
  uploads. Single user, scrypt-hashed password, HMAC-signed cookie; every server
  action re-checks the session itself because an action is a public POST that
  never renders the layout gate.
- **Live GitHub data.** The contribution calendar is accurate *only* because
  Mahir enabled "Include private contributions on my profile" on
  2026-09-27 — before that, every unauthenticated source reported 31 against a
  true 889, since the gap was all private work. If that setting is ever turned
  off, the number silently drops and a `GITHUB_TOKEN` becomes necessary; the
  GraphQL path for that is already implemented and activates on the env var.
- **Images pasted as URLs are copied into our own bucket** at save time rather
  than hotlinked, so no `remotePatterns` wildcard is needed and nothing rots.
  Artwork keeps its real dimensions, captured at upload.
- Spotify (now playing, top tracks) remains in scope and needs a one-time OAuth
  from Mahir. Live cricket scores remain undecided.

### Undecided / not supplied

- Domain name.
- Whether the third venture, **horek**, may be described beyond "the biggest
  social fashion ecommerce platform in bangladesh".
- Most per-item notes in the personal lists.

## Brand Commitments

- Name: **Mahir Mohammed Labib**. Goes by Mahir.
- **Primary self-description, his words: "an aspiring entrepreneur who loves to
  build products."** This is the hero, set at 148px.
- NJIT / CS / class of 2028 is explicitly demoted — "that will not be my first
  identity, that will just be another info on the site."
- Voice: lowercase, plain, first person. Every list item carries a line only he
  could have written, and an item with no line shows nothing rather than
  generated prose.
- References he chose: **alisadik.com** (his own agency partner at Entire) and
  **huyml.co**. Both are near-monochrome, enormous display type, tiny corner
  meta labels, motion driven entirely by scroll position.
- Rejected after seeing it built: the "analog desk" concept in full — warm
  paper, rust, monospace-everything, draggable objects. Do not revive any of it.

## Evidence on Hand

- **cubiee.com** — built and launched. An all-in-one job help platform: a résumé
  becomes a live portfolio, scored against a real job description across five
  fit dimensions, with STAR interview answers built from the user's own bullets
  and a four-week skill-gap plan. Free / $14.99 / $24.99.
- **entire.agency** — "Entire", an integrated growth agency he runs. Its own
  homepage publishes **2000+ talent pool, $10M+ combined business value, 15+
  ecosystem partners**; Mahir confirmed on 2026-09-27 that these are Entire's
  and may stay on the site.
- **horek** — unlaunched. Intended to be the largest social fashion e-commerce
  platform in Bangladesh. No traction numbers exist.
- **unote** — a Flutter notes/drawing app, archived. Medihelp, Carhelp and
  TaskBase were deliberately deleted from the database on 2026-09-26, and the
  whole "shipped" section was removed on 2026-09-27.
- Accounts: GitHub **Labib591**, Codeforces **useless591**, Instagram
  **chitrok0r** (photo manipulation). Contact: mahi.labib5@gmail.com.
- Cricket: a test-cricket obsessive, Bangladesh, watches almost any game.

Absences that must not be fabricated: no user counts, revenue, funding, team
size, press or awards exist for cubiee or horek. Codeforces figures must be
fetched, never invented.

## Product Principles

1. **His words or no words.** An unwritten note renders as nothing, never as
   plausible prose.
2. **Entrepreneur first, student last.** Ventures lead; the degree is a
   footnote.
3. **The personal sections are not filler.** They rank with the work, because
   the site's purpose is the whole person.
4. **A dash, never a zero.** A number that failed to load and a number that is
   genuinely zero are different facts, and only one of them is true.
5. **Nothing is shown that cannot be filled.** No placeholder frames, no empty
   containers promising content that never arrives.

## Accessibility & Inclusion

- Every hover-revealed element also responds to keyboard focus, and has an
  inline equivalent below the `lg` breakpoint where hover does not exist.
- `prefers-reduced-motion` disables Lenis and every ScrollTrigger pin; the page
  falls back to native scrolling with content already visible.
- Entrances animate *from* a visible default, so a failed trigger can never
  leave the page blank.
- Measured against the bone ground: ink 16.48:1, ink-2 9.49:1, meta 4.50:1.
  `faint` (2.15:1) is rules and disabled fills only, never text. Signal red is
  2.95:1 on bone — fills only; `signal-deep` (4.54:1) is the only red that may
  set text there.
