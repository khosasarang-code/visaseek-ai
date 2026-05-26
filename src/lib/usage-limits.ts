import { getAuthUser, hasPaidAccess, isLoggedIn } from "@/lib/auth-storage";

export const USAGE_STORAGE_KEY = "visaseek-daily-usage";

export interface DailyUsage {
  date: string;
  count: number;
}

export function getTodayKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDailyLimit(): number {
  if (hasPaidAccess()) return Infinity;
  if (isLoggedIn()) return 10;
  return 5;
}

export function getDailyUsage(): DailyUsage {
  const today = getTodayKey();
  if (typeof window === "undefined") {
    return { date: today, count: 0 };
  }
  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    if (!raw) return { date: today, count: 0 };
    const data = JSON.parse(raw) as DailyUsage;
    if (data.date !== today) return { date: today, count: 0 };
    return data;
  } catch {
    return { date: today, count: 0 };
  }
}

export function saveDailyUsage(usage: DailyUsage): void {
  localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage));
}

export function incrementDailyUsage(): DailyUsage {
  const usage = getDailyUsage();
  const next = { ...usage, count: usage.count + 1 };
  saveDailyUsage(next);
  return next;
}

export function getRemainingMessages(): number {
  const limit = getDailyLimit();
  if (!isFinite(limit)) return Infinity;
  return Math.max(0, limit - getDailyUsage().count);
}

export function isDailyLimitReached(): boolean {
  const limit = getDailyLimit();
  if (!isFinite(limit)) return false;
  return getDailyUsage().count >= limit;
}

export function shouldShowUsageCounter(): boolean {
  return !hasPaidAccess();
}
