# What the desk is waiting on

Everything here is something only you can answer. The site is built so that
none of it blocks anything — every gap renders as a **visible ruled blank**
that says what it's waiting for, rather than getting filled with invented
prose. That was the one rule: your words or no words.

Fill any of these in and it appears. Nothing else needs touching.

---

## 1. The three ventures — `src/content/ventures.ts`

The biggest gap on the site, and it's the headline drawer.

| field | what it needs |
|---|---|
| `cubiee.what` | **What cubiee actually is.** I refused to guess. Right now it renders as a blank. |
| `stealth.his` | The unnamed one, in your words. Also: can it be named publicly yet? |
| `entire.his` | What Entire actually does for people. |
| `cubiee.his` | Why you built it, and what happened to it. |

**No numbers anywhere on this page.** Not one user count, revenue figure,
funding round or team size was supplied, so there is no `proof` block on any
venture. If any of those are real and shareable, tell me and they go in — a
company with real traction and no numbers shown is the site underselling you.

## 2. The art — `src/content/desk-layout.ts` + a new gallery

You said the work only lives on socials. I need:

- **which account** (instagram / behance / deviantart / dribbble — handle or URL)
- roughly **how many pieces**, and what medium (painting, posters, logos, pixel, 3D)
- whether it's a **closed chapter** or something you'd pick back up

Right now the desk shows an *empty contact sheet*, deliberately, sitting
half-buried under the ventures folder. That reads as "the art got covered by the
work", which is true — but it should be the framing, not the whole drawer.

## 3. The personal drawers — `src/content/off-screen.ts`

All five are empty arrays. Each needs the items **plus one line each in your
voice** — the line is the part that makes it not generic.

- **films** — 5–10, plus the one director you'd defend in an argument
- **music** — the albums that actually matter (Spotify handles "now playing")
- **games** — what, on what, and any rank/hours worth showing
- **cricket** — side, franchise, players, whether you actually play and what you are
- **books** — what you're on now, and the ones that changed something
- **hobbies** — anything beyond these
- **`currently`** — reading / playing / building, for the live strip

## 4. Spotify — about five minutes of your time

For live now-playing and top tracks:

1. Create an app at <https://developer.spotify.com/dashboard>
2. Add `http://127.0.0.1:3000/api/spotify/callback` as a redirect URI
3. Send me the **Client ID** and **Client Secret**
4. I'll walk you through a one-time authorise to get a refresh token

Without this the music drawer stays hand-written, which is a fine fallback.

## 5. Cricket scores

Free tiers are rate-limited and most need a key. Tell me if you want me to wire
one up (CricAPI / Cricket Data) and I'll cache it hard, or we drop live scores
and the scorecard becomes a hand-written thing about the matches you care about.

## 6. Small things

- **Domain.** Do you own one? Otherwise the site is Vercel-only.
- **Résumé.** `public/Resume.pdf` is dated June 2025 and predates Entire, cubiee
  and the stealth startup. Almost certainly stale.
- **Photos.** Only one portrait exists (`public/img/mahir.png`). More would let
  the desk carry a couple of real polaroids instead of one.
- **Three portfolios you love, one you can't stand.** Still the single most
  useful thing you could send me.

---

## Not missing — already real and on the desk

- your line: *an aspiring entrepreneur who loves to build products*
- NJIT / CS / 2028, deliberately demoted to a footnote
- entire.agency, cubiee.com, the unnamed one
- Medihelp, Carhelp, TaskBase, UNote — with what broke and what you'd change
- live GitHub + Codeforces numbers (40 repos, CF 847, 35 solved — fetched, not typed)
- two running clocks, Newark and Dhaka
