import type { Album, Book, Film, Game, Note } from "./types";

/**
 * Everything away from the keyboard.
 *
 * These lists are EMPTY, and that is not an oversight. Mahir has not supplied
 * them yet, and the whole point of this site is that the words are his. Each
 * drawer renders a designed empty state — a blank ruled card that says what it
 * is waiting for — instead of a generated list of films an 18-year-old
 * Bangladeshi CS student plausibly likes. That list would be the exact thing he
 * asked this site not to be.
 *
 * To fill any of these: add entries and delete nothing else. The components
 * already handle both states.
 */

/** TODO(mahir): 5–10 films, plus the one director you'd defend in an argument. */
export const films: Film[] = [];

/** TODO(mahir): albums/artists that actually matter. Spotify supplies the live layer. */
export const albums: Album[] = [];

/** TODO(mahir): what you play, on what, and any rank worth flexing. */
export const games: Game[] = [];

/** TODO(mahir): books, and which one you're on right now (`reading: true`). */
export const books: Book[] = [];

/**
 * Cricket. The live scores come from an API, but these parts are his:
 * who he follows, whether he plays, and what he is.
 */
export const cricket = {
  /** TODO(mahir): international side, and a franchise if you follow one. */
  teams: [] as string[],
  /** TODO(mahir): players. */
  players: [] as string[],
  /** TODO(mahir): do you play? batter, bowler, keeper, or "only on rooftops"? */
  plays: null as Note,
  /** TODO(mahir): the match you'd rewatch. */
  match: null as Note,
};

/** TODO(mahir): hobbies beyond these — gym, cooking, travel, photography, anything. */
export const hobbies: { label: string; note: Note }[] = [];

/**
 * The strip along the top of the desk: reading / playing / listening / building.
 * `listening` is live from Spotify. The rest he sets by hand, and each one is
 * null until he does.
 */
export const currently = {
  reading: null as Note,
  playing: null as Note,
  building: "the unnamed one." as Note,
};
