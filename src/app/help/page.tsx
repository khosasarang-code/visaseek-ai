"use client";

import { useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { ChevronDown } from "lucide-react";

const FAQ = [
  {
    q: "How accurate is VisaSeek AI?",
    a: "VisaSeek AI provides guidance based on general immigration knowledge and patterns. Accuracy varies by country and case. Always verify critical information with official government sources or a licensed consultant.",
  },
  {
    q: "What countries does VisaSeek AI cover?",
    a: "VisaSeek AI supports immigration guidance for countries worldwide, including Canada, USA, UK, Australia, Germany, UAE, and many more.",
  },
  {
    q: "Can I upload my refusal letter?",
    a: "Yes. Use the paperclip icon or drag and drop your refusal letter (PDF, image, or document) into the chat. VisaSeek AI will analyze it and suggest next steps.",
  },
  {
    q: "Is my data private?",
    a: "Chats are stored locally in your browser by default. We do not sell your data. For production accounts, review our Privacy Policy for full details.",
  },
  {
    q: "How do I upgrade to Pro?",
    a: "Visit the Pricing page to compare Free, Pro, and Expert plans. Pro unlocks unlimited messages, file uploads, and refusal letter analysis.",
  },
  {
    q: "Can VisaSeek AI replace a lawyer?",
    a: "No. VisaSeek AI provides educational guidance only, not legal advice. For complex cases, refusals, or appeals, consult a licensed immigration lawyer or consultant.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900"
      >
        {q}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-gray-600">{a}</p>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Help Center</h1>
        <p className="mb-8 text-sm text-gray-500">
          Frequently asked questions and support
        </p>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">FAQ</h2>
          <div>
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Contact</h2>
          <p className="text-sm text-gray-600">
            Email:{" "}
            <a
              href="mailto:support@visaseekai.com"
              className="font-medium text-blue-600 hover:underline"
            >
              support@visaseekai.com
            </a>
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Response time: within 24 hours
          </p>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Disclaimer</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            VisaSeek AI provides immigration guidance only, not legal advice.
            Immigration laws change frequently. Always verify information with
            official government sources or a licensed immigration consultant
            before making decisions.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
          >
            View pricing plans →
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
