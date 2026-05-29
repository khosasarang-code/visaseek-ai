"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState, useRef } from "react";
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

const DEFAULT_NEWS: NewsItem[] = [
  { title: "Canada Express Entry draw CRS cutoff 485 2750 invitations", country: "🇨🇦", link: "https://www.canada.ca/en/immigration-refugees-citizenship/news.html" },
  { title: "UK visa processing extended to 12 weeks due to surge", country: "🇬🇧", link: "https://www.gov.uk/government/news" },
  { title: "Australia increases migration places to 195000 for 2025", country: "🇦🇺", link: "https://immi.homeaffairs.gov.au" },
  { title: "Germany Blue Card expanded to new professions worldwide", country: "🇩🇪", link: "https://www.make-it-in-germany.com" },
  { title: "UAE Golden Visa fees updated for investors in 2025", country: "🇦🇪", link: "https://u.ae/en" },
  { title: "USA H1B lottery reforms announced for FY2026", country: "🇺🇸", link: "https://www.uscis.gov/news" },
  { title: "New Zealand reopens skilled migrant residence pathway", country: "🇳🇿", link: "https://www.immigration.govt.nz" },
  { title: "Portugal Digital Nomad visa income requirement raised", country: "🇵🇹", link: "https://vistos.mne.gov.pt" },
];

export default function AppNavbar({ onMenuClick, showMenuButton = false }: AppNavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [news, setNews] = useState<NewsItem[]>(DEFAULT_NEWS);
  const tickerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ name: session.user.user_metadata?.full_name || session.user.email, avatar: session.user.user_metadata?.avatar_url, type: "google" });
        return;
      }
      const localUser = getAuthUser();
      if (localUser) {
        setUser({ name: localUser.name || localUser.email, avatar: null, type: "email" });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ name: session.user.user_metadata?.full_name || session.user.email, avatar: session.user.user_metadata?.avatar_url, type: "google" });
      }
    });

    fetch("/api/ticker-news")
      .then(r => r.json())
      .then(data => { if (data.news?.length > 0) setNews(data.news); })
      .catch(() => {});

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;
    const speed = 0.8;
    const animate = () => {
      posRef.current -= speed;
      const totalWidth = ticker.scrollWidth / 3;
      if (Math.abs(posRef.current) >= totalWidth) { posRef.current = 0; }
      ticker.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [news]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAuthUser();
    setUser(null);
    window.location.href = "/";
  };

  const tickerItems = [...news, ...news, ...news];

  return (
    <header className="fixed top-0 right-0 left-0 z-30 border-b border-gray-200 bg-white md:left-64" style={{ height: "56px", display: "flex", alignItems: "center", padding: "0 16px", gap: "12px" }}>
      {showMenuButton && (
        <button type="button" onClick={onMenuClick} className="rounded-lg p-2 hover:bg-gray-100 md:hidden" style={{ flexShrink: 0 }} aria-label="Open menu">
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
      )}

      <div style={{ flex: 1, overflow: "hidden", minWidth: 0, height: "100%", display: "flex", alignItems: "center" }}>
        <div ref={tickerRef} style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", willChange: "transform" }}>
          {tickerItems.map((item, index) => {
            return (
              <span
                key={index}
                onClick={() => window.open(item.link || "https://visaseekai.com/news", "_blank")}
                style={{ fontSize: "12px", paddingRight: "48px", color: "#6B7280", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#2563EB"; e.currentTarget.style.textDecoration = "underline"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#6B7280"; e.currentTarget.style.textDecoration = "none"; }}
              >
                <span>{item.country}</span>
                <span>{item.title}</span>
                <span style={{ marginLeft: "24px", color: "#E5E7EB" }}>●</span>
              </span>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #E5E7EB" }} />
            ) : (
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#111", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "500" }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#111" }} className="hidden md:block">{user.name}</span>
            <button onClick={handleSignOut} style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #E5E7EB", background: "white", fontSize: "14px", cursor: "pointer", fontWeight: "500" }}>
              Sign out
            </button>
          </div>
        ) : (
          <>
            <Link href="/login" style={{ padding: "8px 16px", borderRadius: "8px", background: "#111", color: "white", fontSize: "14px", fontWeight: "500", textDecoration: "none" }}>
              Log in
            </Link>
            <Link href="/signup" style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #E5E7EB", background: "white", color: "#111", fontSize: "14px", fontWeight: "500", textDecoration: "none" }}>
              Sign up for free
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
