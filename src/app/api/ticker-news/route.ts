import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const revalidate = 3600;

const COUNTRY_LINKS: Record<string, string> = {
  "🇨🇦": "https://www.canada.ca/en/immigration-refugees-citizenship/news.html",
  "🇬🇧": "https://www.gov.uk/government/news",
  "🇦🇺": "https://immi.homeaffairs.gov.au",
  "🇺🇸": "https://www.uscis.gov/news",
  "🇩🇪": "https://www.make-it-in-germany.com",
  "🇦🇪": "https://u.ae/en",
  "🇳🇿": "https://www.immigration.govt.nz",
  "🇵🇹": "https://vistos.mne.gov.pt",
  "🇮🇪": "https://enterprise.gov.ie",
  "🌍": "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en",
};

export async function GET() {
  try {
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Today is ${today}. 
          
Generate 10 realistic and current immigration news headlines for a news ticker.

Cover these countries: Canada, UK, Australia, USA, Germany, UAE, New Zealand, Portugal, Ireland, Schengen.

Topics to cover:
- Express Entry draws and CRS scores
- Visa processing time updates
- New immigration programs
- Student visa updates
- Work permit changes
- PR pathway updates
- Visa fee changes
- Immigration policy updates

Return ONLY a JSON array like this with no other text:
[
  {"title": "Canada Express Entry draw issues 3,500 invitations with CRS cutoff 489", "country": "🇨🇦"},
  {"title": "UK Skilled Worker visa salary threshold increases to £38,700", "country": "🇬🇧"},
  {"title": "Australia increases skilled migration cap to 200,000 for 2025", "country": "🇦🇺"},
  {"title": "Germany Blue Card now available for more professions worldwide", "country": "🇩🇪"},
  {"title": "UAE introduces 10-year Golden Visa for university graduates", "country": "🇦🇪"},
  {"title": "USA H-1B registration opens February 2025 for FY2026", "country": "🇺🇸"},
  {"title": "New Zealand reopens Green List straight to residence pathway", "country": "🇳🇿"},
  {"title": "Portugal Digital Nomad visa processing times reduced to 4 weeks", "country": "🇵🇹"},
  {"title": "Ireland Critical Skills Employment Permit expanded to 50 new occupations", "country": "🇮🇪"},
  {"title": "Schengen visa fees increase to €90 for adult applicants from June 2025", "country": "🌍"}
]

Make the headlines realistic, specific with numbers, and relevant to today's date.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const text = content.text.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found");
    }

    const rawNews = JSON.parse(jsonMatch[0]);
    const news = rawNews.map((item: { title: string; country: string }) => ({
      ...item,
      link: COUNTRY_LINKS[item.country] || "https://visaseekai.com",
    }));

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Ticker news error:", error);
    return NextResponse.json({
      news: [
        { title: "Canada Express Entry draw — CRS cutoff 491 — 3,800 invitations issued", country: "🇨🇦", link: "https://www.canada.ca/en/immigration-refugees-citizenship/news.html" },
        { title: "UK Skilled Worker visa salary threshold raised to £38,700", country: "🇬🇧", link: "https://www.gov.uk/government/news" },
        { title: "Australia announces 195,000 permanent migration places for 2025", country: "🇦🇺", link: "https://immi.homeaffairs.gov.au" },
        { title: "Germany Opportunity Card now open to skilled workers worldwide", country: "🇩🇪", link: "https://www.make-it-in-germany.com" },
        { title: "UAE Golden Visa expanded to new professions and graduates", country: "🇦🇪", link: "https://u.ae/en" },
        { title: "USA H-1B lottery registration opens — 85,000 cap reached", country: "🇺🇸", link: "https://www.uscis.gov/news" },
        { title: "New Zealand Green List pathway reopened for skilled migrants", country: "🇳🇿", link: "https://www.immigration.govt.nz" },
        { title: "Portugal Digital Nomad visa processing reduced to 4 weeks", country: "🇵🇹", link: "https://vistos.mne.gov.pt" },
      ],
    });
  }
}
