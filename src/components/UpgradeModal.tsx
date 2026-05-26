"use client";

import Link from "next/link";
import { X, Check } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  freeDailyLimit?: number;
}

const PLANS_BASE = [
  {
    id: "free",
    name: "FREE",
    price: "5 messages/day",
    description: "Current plan",
    current: true,
  },
  {
    id: "pro",
    name: "PRO",
    price: "Unlimited",
    sub: "$19/month",
    description: "Unlimited immigration guidance",
    highlight: true,
  },
  {
    id: "expert",
    name: "EXPERT",
    price: "Unlimited + calls",
    sub: "$49/month",
    description: "Everything in Pro plus consultation calls",
  },
];

export default function UpgradeModal({
  isOpen,
  onClose,
  freeDailyLimit = 5,
}: UpgradeModalProps) {
  if (!isOpen) return null;

  const PLANS = PLANS_BASE.map((p) =>
    p.id === "free"
      ? { ...p, price: `${freeDailyLimit} messages/day` }
      : p
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            You&apos;ve reached your daily limit 🚀
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Upgrade to VisaSeek AI Pro for unlimited immigration guidance
          </p>
        </div>

        <div className="mb-6 space-y-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border p-4 ${
                plan.highlight
                  ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                  : plan.current
                    ? "border-gray-200 bg-gray-50"
                    : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-gray-500">
                    {plan.name}
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">{plan.price}</p>
                  {plan.sub && (
                    <p className="text-sm text-gray-500">{plan.sub}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-600">{plan.description}</p>
                </div>
                {plan.highlight && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                    Popular
                  </span>
                )}
                {plan.current && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Check className="h-3.5 w-3.5" />
                    Current
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/pricing"
          onClick={onClose}
          className="block w-full rounded-xl bg-black py-3.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Upgrade to Pro
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
