"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "@/components/AppNavbar";
import AppSidebar from "@/components/AppSidebar";
import ChatInput, { type PendingFile } from "@/components/ChatInput";
import ChatMarkdown from "@/components/ChatMarkdown";
import MessageUsageCounter from "@/components/MessageUsageCounter";
import TypingIndicator from "@/components/TypingIndicator";
import UpgradeModal from "@/components/UpgradeModal";
import { hasPaidAccess } from "@/lib/auth-storage";
import {
  getDailyLimit,
  getDailyUsage,
  incrementDailyUsage,
  isDailyLimitReached,
  shouldShowUsageCounter,
} from "@/lib/usage-limits";
import { CATEGORIES, SUGGESTIONS } from "@/lib/categories";
import { buildApiMessages } from "@/lib/api-messages";
import {
  fileToBase64,
  getFileKind,
  getMediaType,
  getUploadAckMessage,
  isAcceptedFile,
} from "@/lib/file-upload";
import {
  ACTIVE_CHAT_KEY,
  CHATS_STORAGE_KEY,
  createChatId,
  generateChatTitle,
  type ChatSession,
  type Message,
  type MessageAttachment,
  type UploadedFilePayload,
} from "@/lib/chat-types";

function loadChats(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHATS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatSession[]) : [];
  } catch {
    return [];
  }
}

function loadActiveChatId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_CHAT_KEY);
}

export default function Home() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const refreshUsage = useCallback(() => {
    setUsageCount(getDailyUsage().count);
    setDailyLimit(getDailyLimit());
  }, []);

  const openUpgradeModal = useCallback(() => {
    setShowUpgradeModal(true);
  }, []);

  const checkProFeature = useCallback((): boolean => {
    if (hasPaidAccess()) return true;
    openUpgradeModal();
    return false;
  }, [openUpgradeModal]);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;
  const messages = activeChat?.messages ?? [];
  const hasMessages = messages.length > 0;

  const goHome = useCallback(() => {
    setActiveChatId(null);
    setActiveCategoryId(undefined);
    setInput("");
    setPendingFile(null);
    setUploadProgress(null);
    localStorage.removeItem(ACTIVE_CHAT_KEY);
    router.push("/");
    router.refresh();
  }, [router]);

  useEffect(() => {
    setChats(loadChats());
    setActiveChatId(loadActiveChatId());
    refreshUsage();
    setHydrated(true);
  }, [refreshUsage]);

  useEffect(() => {
    if (!hydrated) return;
    const pending = sessionStorage.getItem("visaseek-pending-category");
    if (pending) {
      sessionStorage.removeItem("visaseek-pending-category");
      const cat = CATEGORIES.find((c) => c.id === pending);
      if (cat) {
        startNewChat({ categoryId: cat.id });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  }, [chats, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (activeChatId) {
      localStorage.setItem(ACTIVE_CHAT_KEY, activeChatId);
    } else {
      localStorage.removeItem(ACTIVE_CHAT_KEY);
    }
  }, [activeChatId, hydrated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const upsertChat = useCallback(
    (chatId: string, updater: (chat: ChatSession) => ChatSession) => {
      setChats((prev) => {
        const idx = prev.findIndex((c) => c.id === chatId);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = updater(next[idx]);
        return next.sort((a, b) => b.updatedAt - a.updatedAt);
      });
    },
    []
  );

  const startNewChat = useCallback(
    (opts?: { categoryId?: string; welcomeMessage?: string }) => {
      const id = createChatId();
      const category = opts?.categoryId
        ? CATEGORIES.find((c) => c.id === opts.categoryId)
        : undefined;
      const welcome =
        opts?.welcomeMessage ?? category?.welcome ?? undefined;

      const initialMessages: Message[] = welcome
        ? [{ role: "assistant", content: welcome }]
        : [];

      const session: ChatSession = {
        id,
        title: category ? `${category.icon} ${category.label}` : "New Chat",
        messages: initialMessages,
        categoryId: opts?.categoryId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setChats((prev) => [session, ...prev]);
      setActiveChatId(id);
      setActiveCategoryId(opts?.categoryId);
      setInput("");
      return { id, messages: initialMessages };
    },
    []
  );

  const handleNewChat = () => {
    startNewChat();
    setActiveCategoryId(undefined);
  };

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === "documents" && !hasPaidAccess()) {
      openUpgradeModal();
      return;
    }
    startNewChat({ categoryId });
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    const chat = chats.find((c) => c.id === id);
    setActiveCategoryId(chat?.categoryId);
  };

  const fileToPayload = async (
    file: File
  ): Promise<UploadedFilePayload | null> => {
    if (!isAcceptedFile(file)) {
      alert("Please upload PDF, JPG, PNG, DOC, or DOCX files only.");
      return null;
    }

    setUploadProgress(0);
    const tick = setInterval(() => {
      setUploadProgress((p) => {
        if (p === null || p >= 90) return p;
        return (p ?? 0) + 15;
      });
    }, 80);

    try {
      const base64 = await fileToBase64(file);
      const kind = getFileKind(file);
      const mediaType = getMediaType(file);
      let textContent: string | undefined;
      if (kind === "document") {
        textContent = `The user uploaded a Word/document file named "${file.name}". Provide immigration guidance. If this may be a refusal letter or application document, analyze based on any details the user provides and ask them to paste key text if needed.`;
      }
      setUploadProgress(100);
      return { name: file.name, mediaType, base64, kind, textContent };
    } finally {
      clearInterval(tick);
      setTimeout(() => setUploadProgress(null), 400);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!checkProFeature()) return;
    if (!isAcceptedFile(file)) {
      alert("Please upload PDF, JPG, PNG, DOC, or DOCX files only.");
      return;
    }
    const previewUrl = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : undefined;
    setPendingFile({ file, previewUrl, progress: 100 });
  };

  const handleRemoveFile = () => {
    if (pendingFile?.previewUrl) {
      URL.revokeObjectURL(pendingFile.previewUrl);
    }
    setPendingFile(null);
    setUploadProgress(null);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const streamAssistantReply = async (
    chatId: string,
    apiMessages: ReturnType<typeof buildApiMessages>
  ) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages }),
    });

    if (!res.ok) {
      const errText = await res.text();
      let errMsg = "Something went wrong. Please try again.";
      try {
        const parsed = JSON.parse(errText);
        if (parsed.error) errMsg = parsed.error;
      } catch {
        if (errText) errMsg = errText;
      }
      upsertChat(chatId, (chat) => ({
        ...chat,
        messages: [
          ...chat.messages,
          { role: "assistant", content: `**Error:** ${errMsg}` },
        ],
        updatedAt: Date.now(),
      }));
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let assistantText = "";

    upsertChat(chatId, (chat) => ({
      ...chat,
      messages: [...chat.messages, { role: "assistant", content: "" }],
      updatedAt: Date.now(),
    }));

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantText += decoder.decode(value, { stream: true });
      const snapshot = assistantText;
      upsertChat(chatId, (chat) => {
        const msgs = [...chat.messages];
        const lastIdx = msgs.length - 1;
        if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
          msgs[lastIdx] = { role: "assistant", content: snapshot };
        }
        return { ...chat, messages: msgs, updatedAt: Date.now() };
      });
    }
  };

  const sendMessage = async (text?: string) => {
    const trimmed = (text ?? input).trim();
    const hasFile = !!pendingFile;
    if ((!trimmed && !hasFile) || isLoading) return;

    if (!hasPaidAccess()) {
      if (hasFile) {
        openUpgradeModal();
        return;
      }
      if (isDailyLimitReached()) {
        openUpgradeModal();
        return;
      }
    }

    let chatIdForCheck = activeChatId;
    let priorForCheck: Message[] = [];
    if (chatIdForCheck) {
      priorForCheck =
        chats.find((c) => c.id === chatIdForCheck)?.messages ?? [];
    }
    const sessionUserCount = priorForCheck.filter(
      (m) => m.role === "user"
    ).length;
    if (!hasPaidAccess() && sessionUserCount >= 10) {
      openUpgradeModal();
    }

    let uploadPayload: UploadedFilePayload | null = null;
    let attachmentMeta: MessageAttachment | undefined;

    if (pendingFile) {
      uploadPayload = await fileToPayload(pendingFile.file);
      if (!uploadPayload) return;
      attachmentMeta = {
        id: `att-${Date.now()}`,
        name: pendingFile.file.name,
        size: pendingFile.file.size,
        type: pendingFile.file.type,
        previewUrl: pendingFile.previewUrl,
      };
      handleRemoveFile();
    }

    const displayContent =
      trimmed ||
      (uploadPayload
        ? `Uploaded: ${uploadPayload.name}`
        : "");

    const userMessage: Message = {
      role: "user",
      content: displayContent,
      attachments: attachmentMeta ? [attachmentMeta] : undefined,
    };

    let chatId = activeChatId;
    let priorMessages: Message[] = [];

    if (chatId) {
      priorMessages = chats.find((c) => c.id === chatId)?.messages ?? [];
    } else {
      const created = startNewChat();
      chatId = created.id;
      priorMessages = created.messages;
    }

    const allMessages = [...priorMessages, userMessage];
    const uploads = uploadPayload ? [uploadPayload] : undefined;
    const apiMessages = buildApiMessages(allMessages, uploads);

    const ackMessage = uploadPayload
      ? getUploadAckMessage(uploadPayload.kind)
      : null;

    setChats((prev) => {
      const idx = prev.findIndex((c) => c.id === chatId);
      if (idx === -1) return prev;
      const chat = prev[idx];
      const isFirstUser = !chat.messages.some((m) => m.role === "user");
      const newMessages = [...chat.messages, userMessage];
      if (ackMessage) {
        newMessages.push({ role: "assistant", content: ackMessage });
      }
      const next = [...prev];
      next[idx] = {
        ...chat,
        title: isFirstUser
          ? generateChatTitle(displayContent || uploadPayload!.name)
          : chat.title,
        messages: newMessages,
        updatedAt: Date.now(),
      };
      return next.sort((a, b) => b.updatedAt - a.updatedAt);
    });

    setInput("");
    setIsLoading(true);

    try {
      await streamAssistantReply(
        chatId,
        buildApiMessages(allMessages, uploads)
      );
      if (!hasPaidAccess()) {
        incrementDailyUsage();
        refreshUsage();
        if (isDailyLimitReached()) {
          openUpgradeModal();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => sendMessage();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const usageCounter = (
    <MessageUsageCounter
      used={usageCount}
      limit={dailyLimit}
      show={shouldShowUsageCounter()}
    />
  );

  const chatInput = (
    <div className="w-full max-w-[680px] mx-auto">
      {usageCounter}
      <div className="mt-1">
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
          pendingFile={pendingFile}
          uploadProgress={uploadProgress}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
          textareaRef={textareaRef}
        />
      </div>
    </div>
  );

  const mainClass = `flex flex-1 flex-col ${isDragging ? "ring-2 ring-inset ring-blue-400 ring-offset-2" : ""}`;

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Loading VisaSeek AI...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewChat={handleNewChat}
        activeCategoryId={activeCategoryId}
        onCategoryClick={handleCategoryClick}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onLogoClick={goHome}
      />

      <div
        className="flex min-h-screen flex-1 flex-col md:ml-64"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          freeDailyLimit={dailyLimit}
        />
        <AppNavbar
          showMenuButton
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className={mainClass + " pt-14"}>
          {isDragging && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-blue-50/80 md:left-64">
              <p className="text-sm font-medium text-blue-700">
                Drop your file here to upload
              </p>
            </div>
          )}

          {!hasMessages ? (
            <div className="flex flex-1 flex-col items-center justify-center px-4 pb-8">
              <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
                Where should we begin?
              </h1>
              <p className="mb-8 max-w-lg text-center text-gray-500">
                Ask any immigration question — visa, PR, work permit, study
                abroad
              </p>
              <div className="w-full max-w-[680px]">{chatInput}</div>
              <div className="mt-4 flex max-w-[680px] flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendMessage(s)}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-8 max-w-md text-center text-xs text-gray-400">
                VisaSeek AI can make mistakes. Always verify with official
                government sources.
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="mx-auto max-w-3xl space-y-6">
                  {messages.map((msg, i) =>
                    msg.role === "user" ? (
                      <div key={i} className="flex justify-end">
                        <div className="max-w-2xl rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-900">
                          {msg.attachments?.map((att) => (
                            <div
                              key={att.id}
                              className="mb-2 flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2"
                            >
                              {att.previewUrl ? (
                                <img
                                  src={att.previewUrl}
                                  alt={att.name}
                                  className="h-12 w-12 rounded object-cover"
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-xs text-gray-500">
                                  DOC
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="truncate font-medium">{att.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(att.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          ))}
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div key={i} className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm">
                          ✈️
                        </div>
                        <div className="max-w-2xl rounded-2xl bg-white px-1 py-1 text-sm">
                          {msg.content ? (
                            <ChatMarkdown content={msg.content} />
                          ) : (
                            <TypingIndicator />
                          )}
                        </div>
                      </div>
                    )
                  )}
                  {isLoading &&
                    messages[messages.length - 1]?.role === "user" && (
                      <div className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm">
                          ✈️
                        </div>
                        <div className="max-w-2xl rounded-2xl bg-white px-4 py-2">
                          <TypingIndicator />
                        </div>
                      </div>
                    )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="border-t border-gray-100 bg-white px-4 py-4">
                <div className="mx-auto max-w-[680px]">{chatInput}</div>
                <p className="mx-auto mt-2 max-w-[680px] text-center text-xs text-gray-400">
                  VisaSeek AI can make mistakes. Always verify with official
                  government sources.
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
