import { getAuthUser, hasPaidAccess, isLoggedIn } from "@/lib/auth-storage";

export const USAGE_STORAGE_KEY = "visaseek-daily-usage";

export interface DailyUsage {
  date: string;
  count: number;
  resetTime: number;
}

export function getResetTime(): number {
  // Reset after 7 hours from first message
  return Date.now() + 7 * 60 * 60 * 1000;
}

export function getDailyLimit(): number {
  if (hasPaidAccess()) return Infinity;
  if (isLoggedIn()) return 10;
  return 10;
}

export function getDailyUsage(): DailyUsage {
  const now = Date.now();
  if (typeof window === "undefined") {
    return { date: "", count: 0, resetTime: getResetTime() };
  }
  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    if (!raw) return { date: "", count: 0, resetTime: getResetTime() };
    const data = JSON.parse(raw) as DailyUsage;
    // Reset if 7 hours have passed
    if (now > data.resetTime) {
      return { date: "", count: 0, resetTime: getResetTime() };
    }
    return data;
  } catch {
    return { date: "", count: 0, resetTime: getResetTime() };
  }
}

export function saveDailyUsage(usage: DailyUsage): void {
  localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(usage));
}

export function incrementDailyUsage(): DailyUsage {
  const usage = getDailyUsage();
  const next = {
    ...usage,
    count: usage.count + 1,
    resetTime: usage.resetTime || getResetTime(),
  };
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

export function getTimeUntilReset(): string {
  const usage = getDailyUsage();
  if (!usage.resetTime) return "7 hours";
  const now = Date.now();
  const diff = usage.resetTime - now;
  if (diff <= 0) return "now";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes} minutes`;
}
