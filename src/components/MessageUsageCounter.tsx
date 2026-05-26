"use client";

interface MessageUsageCounterProps {
  used: number;
  limit: number;
  show: boolean;
}

export default function MessageUsageCounter({
  used,
  limit,
  show,
}: MessageUsageCounterProps) {
  if (!show) return null;

  const remaining = Math.max(0, limit - used);

  let colorClass = "text-gray-500";
  if (remaining <= 0) {
    colorClass = "text-red-600 font-medium";
  } else if (remaining === 1) {
    colorClass = "text-orange-600 font-medium";
  }

  return (
    <p className={`mx-auto max-w-[680px] text-center text-xs ${colorClass}`}>
      {used} of {limit} free messages used today
    </p>
  );
}
