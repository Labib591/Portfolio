/**
 * The desk's content contract.
 *
 * One rule governs this whole directory: `Note` is Mahir's own writing.
 * When it is `null` the interface renders a visible ruled blank — an empty
 * line on the card — and never fills it with plausible prose. A blank is
 * information: it says "he has not written this yet".
 *
 * Anything a machine measured is typed as `Measured` and set in Matrix
 * (the dot-matrix face). Anything Mahir typed is set in Typewriter.
 * The reader can tell them apart without being told.
 */

/** Mahir's own words. `null` means unwritten — render the blank. */
export type Note = string | null;

/** A value fetched from an API at runtime. Never hardcode one of these. */
export type Measured<T> =
  | { state: "loading" }
  | { state: "ok"; value: T; at: string }
  | { state: "cold"; reason: string };

export type ObjectKind =
  | "folder"
  | "card-stack"
  | "polaroid"
  | "film-strip"
  | "record"
  | "scorecard"
  | "notebook"
  | "printout"
  | "cartridge"
  | "contact-sheet";

/** A thing lying on the desk. Position is in grid units, never pixels. */
export interface DeskObject {
  /** URL segment. `/work`, `/ventures`. Also the ⌘K id. */
  slug: string;
  /** Lowercase, the way he'd actually say it. No title case, no eyebrows. */
  label: string;
  /** One line on the object itself — what it is, not a tagline. */
  caption: string;
  kind: ObjectKind;
  /** Grid units from the mat's top-left. 1 unit = --rule-major (60px). */
  home: { x: number; y: number; rotate: number };
  /**
   * Reading order — keyboard tab sequence, the ⌘K list, and the mobile column.
   * Deliberately NOT the paint order: what matters most is read first, but what
   * got buried is painted underneath.
   */
  order: number;
  /**
   * Paint order. Low numbers lie beneath. This is how the art contact sheet ends
   * up half-covered by the ventures folder, which is the layout making an
   * argument that no caption has to make.
   */
  z: number;
  /** Renders the object visibly empty until content arrives. */
  awaitingContent?: boolean;
}

export interface Link {
  label: string;
  href: string;
}

export interface Build {
  slug: string;
  name: string;
  /** What it is, in one plain line. */
  what: string;
  year: string;
  stack: string[];
  live?: string;
  repo?: string;
  shot?: string;
  /** His words: why he built it. */
  why: Note;
  /** His words: the part that actually broke. */
  broke: Note;
  /** His words: what he'd do differently now. */
  differently: Note;
  status: "live" | "archived" | "building";
}

export interface Venture {
  slug: string;
  name: string;
  /**
   * What the company does, factually. `null` where Mahir has not said yet —
   * a company's purpose is exactly the kind of thing that must not be guessed.
   */
  what: Note;
  /** running | shipped | building | stealth */
  status: "running" | "shipped" | "building" | "stealth";
  since?: string;
  url?: string;
  role: string;
  his: Note;
  /**
   * Real numbers only. No users, revenue, funding or team size has been
   * supplied for any of these, so this stays empty until it is true.
   */
  proof?: { label: string; value: string }[];
}

export interface Film {
  title: string;
  year?: string;
  director?: string;
  note: Note;
  /** He would defend this one in an argument. */
  defends?: boolean;
}

export interface Album {
  title: string;
  artist: string;
  note: Note;
}

export interface Game {
  title: string;
  platform?: string;
  note: Note;
  /** Only if it is a real, checkable number. */
  hours?: number;
}

export interface Book {
  title: string;
  author: string;
  note: Note;
  reading?: boolean;
}
