export const SETTINGS_STORAGE_KEY = "visaseek-settings";

export interface VisaSeekSettings {
  language: string;
  theme: "light" | "dark" | "system";
  notifications: boolean;
  displayName: string;
  email: string;
  responseLanguage: string;
  responseDetail: "brief" | "detailed" | "expert";
  countryOfInterest: string;
}

export const DEFAULT_SETTINGS: VisaSeekSettings = {
  language: "English",
  theme: "light",
  notifications: true,
  displayName: "",
  email: "",
  responseLanguage: "English",
  responseDetail: "detailed",
  countryOfInterest: "",
};

export function loadSettings(): VisaSeekSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw
      ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<VisaSeekSettings>) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: VisaSeekSettings): void {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
