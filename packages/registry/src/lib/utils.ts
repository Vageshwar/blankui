// BlankUI: managed file. See https://blank.vageshwar.dev/docs/utils
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/** Merge class names and resolve Tailwind conflicts (the last class wins). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
