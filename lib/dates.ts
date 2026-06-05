/** Local calendar date as YYYY-MM-DD (avoids UTC off-by-one on mobile). */
export function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(dateStr: string, days: number): string {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return getLocalDateString(d);
}

export function isYesterday(dateStr: string | null, today: string = getLocalDateString()): boolean {
  if (!dateStr) return false;
  return dateStr === addDays(today, -1);
}

export function daysSince(dateStr: string | null, today: string = getLocalDateString()): number | null {
  if (!dateStr) return null;
  const a = parseLocalDate(dateStr).getTime();
  const b = parseLocalDate(today).getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function isToday(dateStr: string | null, today: string = getLocalDateString()): boolean {
  return dateStr === today;
}

export function missedYesterday(
  lastCheckinDate: string | null,
  today: string = getLocalDateString()
): boolean {
  if (!lastCheckinDate) return false;
  const gap = daysSince(lastCheckinDate, today);
  return gap !== null && gap > 1;
}
