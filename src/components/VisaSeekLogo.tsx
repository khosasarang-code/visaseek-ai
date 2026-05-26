"use client";

import Link from "next/link";

interface VisaSeekLogoProps {
  onClick?: () => void;
  className?: string;
}

export default function VisaSeekLogo({
  onClick,
  className = "",
}: VisaSeekLogoProps) {
  const baseClass = `font-bold text-gray-900 transition hover:opacity-80 ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`text-left ${baseClass}`}>
        ✈️ VisaSeek AI
      </button>
    );
  }

  return (
    <Link href="/" className={baseClass}>
      ✈️ VisaSeek AI
    </Link>
  );
}
