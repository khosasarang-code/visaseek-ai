"use client";

interface TickerItemProps {
  country: string;
  countryName: string;
  title: string;
  link: string;
}

export default function TickerItem({ country, countryName, title, link }: TickerItemProps) {
  return (
    <span
      style={{
        fontSize: "12px",
        paddingRight: "48px",
        color: "#6B7280",
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          textDecoration: "none",
          color: "inherit",
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const a = document.createElement("a");
          a.href = link;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = "#2563EB";
          e.currentTarget.style.textDecoration = "underline";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = "#6B7280";
          e.currentTarget.style.textDecoration = "none";
        }}
      >
        <span style={{ fontSize: "16px" }}>{country}</span>
        <span style={{ fontWeight: "600", color: "#111827" }}>{countryName}</span>
        <span style={{ color: "#9CA3AF" }}>—</span>
        <span>{title}</span>
      </span>
      <span style={{ marginLeft: "24px", color: "#E5E7EB" }}>●</span>
    </span>
  );
}
