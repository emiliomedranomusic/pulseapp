import { addDays, getLocalDateString } from "./dates";

export const DEMO_KEY = "pulse_demo_offset_days";

/** Real local calendar date (no demo offset). */
export function realToday(): string {
  return getLocalDateString();
}

export function getOffset(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(DEMO_KEY);
  const n = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function setOffset(days: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_KEY, String(days));
}

/** Simulated "today" for hackathon demo (real date + offset from localStorage). */
export function today(offset?: number): string {
  const o = offset ?? getOffset();
  return addDays(realToday(), o);
}
