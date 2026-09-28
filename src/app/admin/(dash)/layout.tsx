import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isSignedIn } from "@/lib/auth";
import { signOut } from "../actions";

export const metadata: Metadata = { title: "admin", robots: { index: false, follow: false } };

/**
 * The gate and the shell.
 *
 * `/admin/login` renders bare; everything else requires a session. Server
 * actions re-check independently — this layout is convenience, not the
 * security boundary, because an action is a public POST that never renders it.
 */

const NAV = [
  ["/admin", "overview"],
  ["/admin/work", "ventures + work"],
  ["/admin/lists", "the lists"],
  ["/admin/art", "art"],
  ["/admin/log", "log"],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isSignedIn())) redirect("/admin/login");

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-bone-lo bg-bone/92 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="meta transition-colors hover:text-ink"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <Link href="/" className="meta transition-colors hover:text-ink">
              view site ↗
            </Link>
            <form action={signOut}>
              <button className="meta transition-colors hover:text-signal-deep">sign out</button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-6 py-12">{children}</main>
    </div>
  );
}
