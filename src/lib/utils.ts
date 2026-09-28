import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Grid units → pixels. 1 unit = one major rule on the mat. */
export const MAJOR = 60;
export const units = (n: number) => n * MAJOR;

/** Snap a pixel value to the nearest minor rule. Nothing floats free. */
export const MINOR = 12;
export const snap = (px: number) => Math.round(px / MINOR) * MINOR;

export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);
