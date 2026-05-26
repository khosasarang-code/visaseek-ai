export const AUTH_STORAGE_KEY = "visaseek-auth";

export type UserPlan = "free" | "pro" | "expert";

export interface AuthUser {
  email: string;
  name?: string;
  plan: UserPlan;
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isLoggedIn(): boolean {
  return getAuthUser() !== null;
}

export function isPaidUser(plan?: UserPlan | null): boolean {
  return plan === "pro" || plan === "expert";
}

export function hasPaidAccess(): boolean {
  const user = getAuthUser();
  return isPaidUser(user?.plan);
}
