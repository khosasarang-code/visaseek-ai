import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const revalidate = 3600;

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

    const news = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ news });
  } catch (error) {
    console.error("Ticker news error:", error);
    return NextResponse.json({
      news: [
        { title: "Canada Express Entry draw — CRS cutoff 491 — 3,800 invitations issued", country: "🇨🇦" },
        { title: "UK Skilled Worker visa salary threshold raised to £38,700", country: "🇬🇧" },
        { title: "Australia announces 195,000 permanent migration places for 2025", country: "🇦🇺" },
        { title: "Germany Opportunity Card now open to skilled workers worldwide", country: "🇩🇪" },
        { title: "UAE Golden Visa expanded to new professions and graduates", country: "🇦🇪" },
        { title: "USA H-1B lottery registration opens — 85,000 cap reached", country: "🇺🇸" },
        { title: "New Zealand Green List pathway reopened for skilled migrants", country: "🇳🇿" },
        { title: "Portugal Digital Nomad visa processing reduced to 4 weeks", country: "🇵🇹" },
      ],
    });
  }
}
