"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type VisaSeekSettings,
} from "@/lib/settings-storage";
import { CHATS_STORAGE_KEY } from "@/lib/chat-types";

const LANGUAGES = [
  "English",
  "Hindi",
  "Urdu",
  "Arabic",
  "Spanish",
  "Punjabi",
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<VisaSeekSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const update = <K extends keyof VisaSeekSettings>(
    key: K,
    value: VisaSeekSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearChatHistory = () => {
    if (
      confirm(
        "Clear all chat history? This cannot be undone."
      )
    ) {
      localStorage.removeItem(CHATS_STORAGE_KEY);
      localStorage.removeItem("visaseek-active-chat");
      alert("Chat history cleared.");
    }
  };

  const deleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      localStorage.clear();
      alert("Account data cleared from this device.");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mb-8 text-sm text-gray-500">
          Manage your VisaSeek AI preferences
        </p>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            General Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Language preference
              </label>
              <select
                value={settings.language}
                onChange={(e) => update("language", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) =>
                  update("theme", e.target.value as VisaSeekSettings["theme"])
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => update("notifications", e.target.checked)}
                className="rounded border-gray-300"
              />
              Enable notifications
            </label>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Account Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Display name
              </label>
              <input
                type="text"
                value={settings.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Change password
            </button>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            AI Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Response language
              </label>
              <select
                value={settings.responseLanguage}
                onChange={(e) => update("responseLanguage", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Response detail level
              </label>
              <select
                value={settings.responseDetail}
                onChange={(e) =>
                  update(
                    "responseDetail",
                    e.target.value as VisaSeekSettings["responseDetail"]
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="brief">Brief</option>
                <option value="detailed">Detailed</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Country of interest
              </label>
              <input
                type="text"
                value={settings.countryOfInterest}
                onChange={(e) => update("countryOfInterest", e.target.value)}
                placeholder="e.g. Canada, USA, UK"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Privacy</h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={clearChatHistory}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Clear chat history
            </button>
            <button
              type="button"
              onClick={deleteAccount}
              className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Delete account
            </button>
          </div>
        </section>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          {saved ? "Saved!" : "Save settings"}
        </button>
      </div>
    </AppShell>
  );
}
