"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { CHATS_STORAGE_KEY, type ChatSession } from "@/lib/chat-types";

export default function DashboardPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHATS_STORAGE_KEY);
      setChats(raw ? (JSON.parse(raw) as ChatSession[]) : []);
    } catch {
      setChats([]);
    }
  }, []);

  return (
    <AppShell>
      <div className="px-6 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Welcome back! 👋
        </h1>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-sm text-gray-500">Saved Chats</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {chats.length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-sm text-gray-500">Plan</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              Free (5 chats/day)
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <p className="mb-3 text-sm text-gray-600">
              Unlock unlimited chats and priority support
            </p>
            <Link
              href="/pricing"
              className="inline-block rounded-lg bg-black px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Recent chats
          </h2>
          {chats.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-gray-500">No chats yet.</p>
              <Link
                href="/"
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Start your first conversation →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 rounded-2xl border border-gray-200">
              {chats.slice(0, 10).map((chat) => (
                <li key={chat.id}>
                  <Link
                    href="/"
                    className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-800">
                      {chat.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
