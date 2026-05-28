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

interface NewsItem {
  title: string;
  country: string;
  link?: string;
}

interface AppNavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function AppNavbar({
  onMenuClick,
  showMenuButton = false,
}: AppNavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url,
          type: "google",
        });
        return;
      }
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

    fetch("/api/ticker-news")
      .then(r => r.json())
      .then(data => setNews(data.news || []))
      .catch(() => setNews([
        { title: "Canada Express Entry — CRS cutoff 485 — 2,750 invitations issued", country: "🇨🇦", link: "https://www.canada.ca/en/immigration-refugees-citizenship/news.html" },
        { title: "UK visa processing extended to 12 weeks due to surge", country: "🇬🇧", link: "https://www.gov.uk/government/news" },
        { title: "Australia increases migration places to 195,000 for 2025", country: "🇦🇺", link: "https://immi.homeaffairs.gov.au" },
        { title: "Germany Blue Card expanded to new professions worldwide", country: "🇩🇪", link: "https://www.make-it-in-germany.com" },
        { title: "UAE Golden Visa fees updated for investors", country: "🇦🇪", link: "https://u.ae/en" },
        { title: "USA H-1B lottery reforms announced for FY2026", country: "🇺🇸", link: "https://www.uscis.gov/news" },
      ]));

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAuthUser();
    setUser(null);
    window.location.href = "/";
  };

  const tickerItems = [...news, ...news, ...news];

  return (
    <header
      className="fixed top-0 right-0 left-0 z-30 flex h-14 items-center border-b border-gray-200 bg-white px-4 md:left-64"
      style={{ gap: "12px" }}
    >
      {showMenuButton && (
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-100 md:hidden flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {/* TICKER inside navbar */}
      <div style={{
        flex: 1,
        overflow: "hidden",
        minWidth: 0,
      }}>
        {tickerItems.length > 0 && (
          <>
            <div style={{
              display: "flex",
              animation: "navticker 25s linear infinite",
              whiteSpace: "nowrap",
            }}>
              {tickerItems.map((item, index) => (
                
                  key={index}
                  href={item.link || "https://visaseekai.com/news"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: "12px",
                    paddingRight: "40px",
                    color: "#6B7280",
                    textDecoration: "none",
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#2563EB")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#6B7280")}
                >
                  <span>{item.country}</span>
                  <span>{item.title}</span>
                  <span style={{ marginLeft: "20px", color: "#E5E7EB" }}>•</span>
                </a>
              ))}
            </div>
            <style>{`
              @keyframes navticker {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.333%); }
              }
            `}</style>
          </>
        )}
      </div>

      {/* Login/Signup */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
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
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
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
