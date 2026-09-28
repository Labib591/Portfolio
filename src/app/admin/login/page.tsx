"use client";

import { useActionState } from "react";
import { Notice, Submit } from "@/components/admin/ui";
import { signIn } from "../actions";

/**
 * Outside the (dash) route group, so it is not behind the gate that would
 * otherwise redirect this page to itself forever.
 */
export default function Login() {
  const [state, action] = useActionState(signIn, {});

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <form action={action} className="w-full max-w-[320px]">
        <h1 className="d-h3">admin</h1>
        <p className="mt-3 text-ui text-meta">one password. there is no reset.</p>

        <label className="mt-9 block">
          <span className="meta block">password</span>
          <input
            name="password"
            type="password"
            autoFocus
            autoComplete="current-password"
            className="mt-2 w-full border-b border-bone-lo bg-transparent pb-2 text-ui outline-none transition-colors focus:border-ink"
          />
        </label>

        <div className="mt-8 flex items-center gap-5">
          <Submit>sign in</Submit>
          <Notice state={state} />
        </div>
      </form>
    </main>
  );
}
