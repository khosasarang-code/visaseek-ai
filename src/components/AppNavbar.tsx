"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { getAuthUser, clearAuthUser } from "@/lib/auth-storage";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AppNavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function AppNavbar({
  onMenuClick,
  showMenuButton = false,
}: AppNavbarProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check Supabase Google login
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url,
          type: "google",
        });
        return;
      }
      // Check email signup from localStorage
      const localUser = getAuthUser();
      if (localUser) {
        setUser({
          name: localUser.name || localUser.email,
          avatar: null,
          type: "email",
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            name: session.user.user_metadata?.full_name || session.user.email,
            avatar: session.user.user_metadata?.avatar_url,
            type: "google",
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAuthUser();
    setUser(null);
    window.location.href = "/";
  };

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
        {user ? (
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="h-8 w-8 rounded-full border border-gray-200"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hidden text-sm font-medium text-gray-800 md:block">
              {user.name}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </header>
  );
}
