"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

interface AppNavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function AppNavbar({
  onMenuClick,
  showMenuButton = false,
}: AppNavbarProps) {
  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:left-64">
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
        )}
        <div className="hidden flex-1 md:block" />
        <button
          type="button"
          className="flex items-center gap-1 text-sm font-medium text-gray-800 md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          VisaSeek AI <span className="text-gray-400">▾</span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
        >
          Sign up for free
        </Link>
      </div>
    </header>
  );
}
