"use client";
import { useState, useEffect } from "react";

interface NewsItem {
  title: string;
  country: string;
}

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickerNews();
  }, []);

  const fetchTickerNews = async () => {
    try {
      const response = await fetch("/api/ticker-news");
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      setNews([
        { title: "Canada Express Entry draw — CRS cutoff 491", country: "🇨🇦" },
        { title: "UK Graduate Route visa extended 2 years", country: "🇬🇧" },
        { title: "Australia 195,000 migration places announced", country: "🇦🇺" },
        { title: "Germany Opportunity Card now open worldwide", country: "🇩🇪" },
        { title: "UAE Golden Visa expanded to new professions", country: "🇦🇪" },
        { title: "USA H-1B lottery results announced", country: "🇺🇸" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading || news.length === 0) return null;

  const tickerContent = [...news, ...news, ...news];

  return (
    <div style={{
      backgroundColor: "#0A0F2C",
      color: "white",
      padding: "8px 0",
      overflow: "hidden",
      position: "relative",
      borderBottom: "1px solid #1e2a4a",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          backgroundColor: "#2563EB",
          color: "white",
          padding: "4px 16px",
          fontSize: "12px",
          fontWeight: "600",
          whiteSpace: "nowrap",
          zIndex: 10,
          flexShrink: 0,
          letterSpacing: "0.05em",
        }}>
          LIVE NEWS
        </div>

        <div style={{
          overflow: "hidden",
          flex: 1,
        }}>
          <div style={{
            display: "flex",
            animation: "ticker 60s linear infinite",
            whiteSpace: "nowrap",
          }}>
            {tickerContent.map((item, index) => (
              <span
                key={index}
                style={{
                  fontSize: "13px",
                  paddingRight: "48px",
                  color: "#e2e8f0",
                  flexShrink: 0,
                }}
              >
                <span style={{ marginRight: "8px" }}>{item.country}</span>
                {item.title}
                <span style={{
                  margin: "0 24px",
                  color: "#2563EB",
                  fontWeight: "bold",
                }}>•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
