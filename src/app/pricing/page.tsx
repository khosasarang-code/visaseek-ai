"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import AppShell from "@/components/AppShell";

const PLANS = [
  {
    name: "Free",
    price: "Free",
    period: "forever",
    badge: null,
    features: [
      "5 AI messages per day",
      "Basic immigration guidance",
      "All 11 topic categories",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    badge: "Most Popular",
    features: [
      "Unlimited AI messages",
      "File & image upload",
      "Refusal letter analysis",
      "Document generation",
      "Priority support",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Expert",
    price: "$49",
    period: "/month",
    badge: null,
    features: [
      "Everything in Pro",
      "1 consultation call/month",
      "Custom document templates",
      "Dedicated support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <AppShell>
      <div className="px-6 py-12">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Simple, transparent pricing
          </h1>
          <p className="mt-2 text-gray-500">
            Choose the plan that fits your immigration journey
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-8 ${
                plan.highlighted
                  ? "border-blue-500 shadow-lg ring-1 ring-blue-500"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}
              <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-sm text-gray-500">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-8 block rounded-lg py-3 text-center text-sm font-medium transition ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
