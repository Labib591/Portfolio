"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * The admin's parts.
 *
 * This surface is Operate, not Experience: Mahir is here to do a job, so it is
 * dense, scannable and boring on purpose. It borrows the palette and the mono
 * labels from the public site so it feels like the same product, and nothing
 * else — no display type, no scroll effects, no animation that delays a save.
 */

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  hint,
  required,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="meta block">
        {label}
        {required && <span className="ml-1 text-signal-deep">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="mt-2 w-full border-b border-bone-lo bg-transparent pb-2 text-ui outline-none transition-colors focus:border-ink"
      />
      {hint && <span className="mt-1.5 block text-micro text-meta">{hint}</span>}
    </label>
  );
}

export function Area({
  label,
  name,
  defaultValue,
  placeholder,
  rows = 3,
  hint,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  rows?: number;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="meta block">{label}</span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="mt-2 w-full resize-y border-b border-bone-lo bg-transparent pb-2 text-ui leading-relaxed outline-none transition-colors focus:border-ink"
      />
      {hint && <span className="mt-1.5 block text-micro text-meta">{hint}</span>}
    </label>
  );
}

/** Must stay in step with MAX_BYTES in src/lib/storage.ts and the
 *  serverActions.bodySizeLimit in next.config.ts. */
export const MAX_UPLOAD_MB = 12;

/**
 * A file input that checks size in the browser.
 *
 * Without this, an oversize file is rejected by the Server Action body limit
 * before any of our code runs, so the server's polite error message is
 * unreachable and the user gets a bare "Failed to fetch" instead. Catching it
 * here is the only place the real reason can be said out loud.
 */
export function FileField({
  label,
  name,
  hint,
  multiple,
  required,
  className,
}: {
  label: string;
  name: string;
  hint?: string;
  multiple?: boolean;
  required?: boolean;
  className?: string;
}) {
  const [tooBig, setTooBig] = useState<string | null>(null);

  return (
    <label className={cn("block", className)}>
      <span className="meta block">{label}</span>
      <input
        name={name}
        type="file"
        multiple={multiple}
        required={required}
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        onChange={(e) => {
          const over = [...(e.target.files ?? [])].filter(
            (f) => f.size > MAX_UPLOAD_MB * 1024 * 1024,
          );
          if (over.length) {
            setTooBig(
              over
                .map((f) => `${f.name} is ${(f.size / 1024 / 1024).toFixed(1)}MB`)
                .join(", ") + ` — the limit is ${MAX_UPLOAD_MB}MB`,
            );
            // Clear it: a submit with this file attached would fail at the
            // network layer with no usable message.
            e.target.value = "";
          } else {
            setTooBig(null);
          }
        }}
        className="mt-3 block w-full text-ui file:mr-4 file:border file:border-ink file:bg-ink file:px-4 file:py-2 file:text-ui file:text-bone hover:file:opacity-85"
      />
      {tooBig ? (
        <span className="mt-2 block text-micro text-signal-deep">{tooBig}</span>
      ) : (
        hint && <span className="mt-2 block text-micro text-meta">{hint}</span>
      )}
    </label>
  );
}

export function Toggle({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-[15px] accent-[var(--color-signal-deep)]"
      />
      <span className="meta">{label}</span>
    </label>
  );
}

/** Disables itself while the action is in flight — a double-submit inserts twice. */
export function Submit({ children = "save", className }: { children?: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "border border-ink bg-ink px-4 py-2 text-ui text-bone transition-opacity",
        "hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-45",
        className,
      )}
    >
      {pending ? "…" : children}
    </button>
  );
}

export function Danger({
  children = "delete",
  confirm = "delete this? it does not come back.",
}: {
  children?: React.ReactNode;
  confirm?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        // A real confirm: the only destructive control in the admin, and there
        // is no undo behind it.
        if (!window.confirm(confirm)) e.preventDefault();
      }}
      className="text-micro tracking-[0.1em] text-meta uppercase transition-colors hover:text-signal-deep disabled:opacity-40"
    >
      {pending ? "…" : children}
    </button>
  );
}

export function Notice({ state }: { state: { error?: string; ok?: string } }) {
  if (!state.error && !state.ok) return null;
  return (
    <p
      role="status"
      className={cn(
        "text-ui",
        state.error ? "text-signal-deep" : "text-ink-2",
      )}
    >
      {state.error ?? state.ok}
    </p>
  );
}
