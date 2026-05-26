import type { Message } from "@/lib/chat-types";
import type { UploadedFilePayload } from "@/lib/chat-types";

export type AnthropicContentBlock =
  | { type: "text"; text: string }
  | {
      type: "image";
      source: { type: "base64"; media_type: string; data: string };
    }
  | {
      type: "document";
      source: { type: "base64"; media_type: "application/pdf"; data: string };
    };

export type ApiMessage = {
  role: "user" | "assistant";
  content: string | AnthropicContentBlock[];
};

export function buildApiMessages(
  messages: Message[],
  uploads?: UploadedFilePayload[]
): ApiMessage[] {
  const result: ApiMessage[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const isLastUser =
      msg.role === "user" && i === messages.length - 1 && uploads?.length;

    if (msg.role === "assistant") {
      result.push({ role: "assistant", content: msg.content });
      continue;
    }

    if (isLastUser && uploads && uploads.length > 0) {
      const blocks: AnthropicContentBlock[] = [];

      for (const upload of uploads) {
        if (upload.kind === "image") {
          blocks.push({
            type: "image",
            source: {
              type: "base64",
              media_type: upload.mediaType,
              data: upload.base64,
            },
          });
        } else if (upload.kind === "pdf") {
          blocks.push({
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: upload.base64,
            },
          });
        } else {
          blocks.push({
            type: "text",
            text: `[Uploaded file: ${upload.name} (${upload.mediaType})]\n${upload.textContent ?? "The user uploaded a Word document. Please ask them to paste key details if the content is not fully available, and provide immigration guidance based on what they share."}`,
          });
        }
      }

      const textPart = msg.content.trim();
      if (textPart) {
        blocks.push({ type: "text", text: textPart });
      } else {
        blocks.push({
          type: "text",
          text: `Please analyze the uploaded file "${uploads[0].name}" and provide detailed immigration guidance. If this appears to be a visa refusal letter, explain why it may have been refused and give a step-by-step action plan.`,
        });
      }

      result.push({ role: "user", content: blocks });
    } else {
      const display = msg.attachments?.length
        ? `${msg.content}\n\n[Attachments: ${msg.attachments.map((a) => a.name).join(", ")}]`
        : msg.content;
      result.push({ role: "user", content: display });
    }
  }

  return result;
}
