/**
 * Sets the /admin password.
 *
 *   node scripts/set-password.mjs "your new password"
 *
 * Prints the ADMIN_PASSWORD_HASH line to put in .env.local (and in Vercel's
 * environment variables). The plaintext is never stored anywhere.
 */
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('usage: node scripts/set-password.mjs "your new password"');
  process.exit(1);
}
if (password.length < 10) {
  console.error("use at least 10 characters — this is the only lock on the admin.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log(`\nADMIN_PASSWORD_HASH="${salt}:${hash}"\n`);
console.log("Replace the line in .env.local, and update it in Vercel before deploying.");
