import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import "server-only";

/**
 * One user, one password, one cookie.
 *
 * Deliberately not an auth library. There is exactly one account and no
 * sign-up, recovery, or OAuth, so a provider would add a dependency to keep
 * current, a second place for the session to live, and a vendor outage that
 * could lock Mahir out of his own site. What it does need to be is correct:
 *
 *   · the password is scrypt-hashed with a per-install salt, never stored plain
 *   · both the password and the cookie compare in constant time
 *   · the cookie is HMAC-signed and carries its own expiry, so it cannot be
 *     edited or replayed past its lifetime
 *   · httpOnly + sameSite=lax + secure in production
 */

const scryptAsync = promisify(scrypt);

const COOKIE = "mml_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return s;
}

/** Constant-time compare that does not leak length via an early return. */
function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    // Still burn a comparison so the timing does not reveal a length mismatch.
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

export async function verifyPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) throw new Error("ADMIN_PASSWORD_HASH is not set");

  const [salt, hash] = stored.split(":");
  if (!salt || !hash) throw new Error("ADMIN_PASSWORD_HASH must be 'salt:hash'");

  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return safeEqual(derived.toString("hex"), hash);
}

/** Regenerates the stored hash for a new password. Used by set-password.mjs. */
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export async function createSession() {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = String(expires);
  const token = `${payload}.${sign(payload)}`;

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isSignedIn() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;

  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  if (!safeEqual(mac, sign(payload))) return false;

  const expires = Number(payload);
  return Number.isFinite(expires) && expires > Date.now();
}

/** Throws in any server action that runs without a valid session. */
export async function requireSession() {
  if (!(await isSignedIn())) throw new Error("not signed in");
}
