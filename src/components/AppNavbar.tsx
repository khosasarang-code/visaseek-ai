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

const getCountryName = (flag: string) => {
  const names: Record<string, string> = {
    "🇨🇦": "Canada", "🇬🇧": "UK", "🇦🇺": "Australia",
    "🇩🇪": "Germany", "🇦🇪": "UAE", "🇺🇸": "USA",
    "🇳🇿": "NZ", "🇵🇹": "Portugal", "🇮🇪": "Ireland", "🌍": "Global",
  };
  return names[flag] || "News";
};

const DEFAULT_NEWS: NewsItem[] = [
  { title: "Express Entry draw CRS cutoff 485 — 2,750 invitations issued", country: "🇨🇦", link: "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds.html" },
  { title: "Visa processing extended to 12 weeks due to application surge", country: "🇬🇧", link: "https://www.gov.uk/check-uk-visa" },
  { title: "Migration places increased to 195,000 for skilled workers 2025", country: "🇦🇺", link: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing" },
  { title: "Blue Card expanded to new professions worldwide", country: "🇩🇪", link: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card" },
  { title: "Golden Visa fees updated for investors and graduates", country: "🇦🇪", link: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa" },
  { title: "H-1B lottery reforms announced for FY2026 registration", country: "🇺🇸", link: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations" },
  { title: "Skilled migrant residence pathway reopened for applicants", country: "🇳🇿", link: "https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa/about-visa/skilled-migrant-category-resident-visa" },
  { title: "Digital Nomad visa income requirement raised to 2700 euros", country: "🇵🇹", link: "https://vistos.mne.gov.pt/en/national-visas/required-documentation/work" },
  { title: "Critical Skills work permit expanded to healthcare workers", country: "🇮🇪", link: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/" },
  { title: "Schengen visa fees increase to 90 euros from June 2025", country: "🌍", link: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en" },
];

export default function AppNavbar({ onMenuClick, showMenuButton = false }: AppNavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [news, setNews] = useState<NewsItem[]>(DEFAULT_NEWS);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearAuthUser();
    setUser(null);
    window.location.href = "/";
  };

  const tickerItems = [...news, ...news, ...news];
  const tickerWidth = tickerItems.length * 400;

  return (
    <header className="fixed top-0 right-0 left-0 z-30 border-b border-gray-200 bg-white md:left-64" style={{ height: "56px", display: "flex", alignItems: "center", padding: "0 16px", gap: "12px" }}>
      {showMenuButton && (
        <button type="button" onClick={onMenuClick} className="rounded-lg p-2 hover:bg-gray-100 md:hidden" style={{ flexShrink: 0 }} aria-label="Open menu">
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
      )}

      <div style={{ flex: 1, overflow: "hidden", minWidth: 0, height: "100%", display: "flex", alignItems: "center" }}>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
          .ticker-track {
            animation: scroll 80s linear infinite;
            display: flex;
            align-items: center;
            white-space: nowrap;
          }
          .ticker-track:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="ticker-track" style={{ width: `${tickerWidth}px` }}>
          {tickerItems.map((item, index) => (
            
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "12px", paddingRight: "48px", flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#6B7280", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#2563EB"; e.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#6B7280"; e.currentTarget.style.textDecoration = "none"; }}
            >
              <span style={{ fontSize: "16px" }}>{item.country}</span>
              <span style={{ fontWeight: "600", color: "#111827" }}>{getCountryName(item.country)}</span>
              <span style={{ color: "#9CA3AF" }}>—</span>
              <span>{item.title}</span>
              <span style={{ marginLeft: "24px", color: "#E5E7EB" }}>●</span>
            </a>
          ))}
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
