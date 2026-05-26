"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CHATS_STORAGE_KEY, type ChatSession } from "@/lib/chat-types";

function loadChats(): ChatSession[] {
  try {
    const raw = localStorage.getItem(CHATS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatSession[]) : [];
  } catch {
    return [];
  }
}

export function useAppChats() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChats(loadChats());
    setHydrated(true);
  }, []);

  const goHome = () => {
    localStorage.removeItem("visaseek-active-chat");
    router.push("/");
    router.refresh();
  };

  const goToChat = (path = "/") => {
    router.push(path);
  };

  const handleNewChat = () => {
    localStorage.removeItem("visaseek-active-chat");
    router.push("/");
  };

  const handleCategoryClick = (categoryId: string) => {
    sessionStorage.setItem("visaseek-pending-category", categoryId);
    localStorage.removeItem("visaseek-active-chat");
    router.push("/");
  };

  return {
    chats,
    searchQuery,
    setSearchQuery,
    sidebarOpen,
    setSidebarOpen,
    hydrated,
    goHome,
    goToChat,
    handleNewChat,
    handleCategoryClick,
  };
}
