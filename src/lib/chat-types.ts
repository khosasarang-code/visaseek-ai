export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface UploadedFilePayload {
  name: string;
  mediaType: string;
  base64: string;
  kind: "image" | "pdf" | "document";
  textContent?: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  attachments?: MessageAttachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  categoryId?: string;
  createdAt: number;
  updatedAt: number;
}

export const CHATS_STORAGE_KEY = "visaseek-chats";
export const ACTIVE_CHAT_KEY = "visaseek-active-chat";

export function generateChatTitle(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "New Chat";
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}...` : trimmed;
}

export function createChatId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
