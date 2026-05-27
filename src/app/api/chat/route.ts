import Anthropic from "@anthropic-ai/sdk";
import type { ApiMessage } from "@/lib/api-messages";

const SYSTEM_PROMPT = `You are VisaSeek AI, the world's smartest immigration assistant.
Help users with visas, PR, work permits, study permits, citizenship,
asylum, document preparation, interview preparation, translation guidance,
timelines, eligibility checks, and visa refusal analysis for all countries worldwide.

IMPORTANT LANGUAGE RULE:
- Detect the language the user is writing in
- Always respond in the SAME language the user used
- If user writes in Hindi, respond in Hindi
- If user writes in Urdu, respond in Urdu
- If user writes in Arabic, respond in Arabic
- If user writes in Spanish, respond in Spanish
- If user writes in Punjabi, respond in Punjabi
- If user writes in French, respond in French
- If user writes in English, respond in English
- Match the user's language automatically every time

When analyzing visa refusals or uploaded documents/images:
- Carefully read all provided content
- Explain in simple friendly language
- Give a clear step-by-step action plan to reapply successfully
- Be encouraging and supportive

Format ALL responses with:
- Clear headings using ##
- Bullet points for lists
- Tables where helpful
- Bold for important information
- Numbered steps for processes

Always end responses with:
'⚠️ Always verify this information with official government sources or a licensed immigration consultant.'

Be friendly, clear, professional and supportive.`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your_key_here") {
      return new Response(
        JSON.stringify({
          error:
            "ANTHROPIC_API_KEY is not configured. Add your key to .env.local",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const body = await req.json();
    const messages = body.messages as ApiMessage[];
    if (!messages?.length) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const client = new Anthropic({ apiKey });
    const stream = client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: messages as Anthropic.MessageParam[],
    });
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Stream error occurred";
          controller.enqueue(encoder.encode(`\n\n**Error:** ${message}`));
          controller.close();
        }
      },
    });
    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
