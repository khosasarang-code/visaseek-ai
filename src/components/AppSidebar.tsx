"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Pencil,
  Search,
  Settings,
  HelpCircle,
  CreditCard,
  X,
  Calculator,
  FileText,
  Globe,
  Trash2,
} from "lucide-react";
import VisaSeekLogo from "@/components/VisaSeekLogo";
import { CATEGORIES } from "@/lib/categories";
import type { ChatSession } from "@/lib/chat-types";

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNewChat: () => void;
  activeCategoryId?: string;
  onCategoryClick: (categoryId: string) => void;
  chats: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onLogoClick?: () => void;
  onDeleteChat?: (id: string) => void;
  onClearAllChats?: () => void;
}

const TOOLS = [
  {
    href: "/tools/pr-calculator",
    icon: <Calculator className="h-4 w-4" />,
    label: "🇨🇦 PR Score Calculator",
  },
  {
    href: "/tools/sop-generator",
    icon: <FileText className="h-4 w-4" />,
    label: "📄 SOP Generator",
  },
  {
    href: "/tools/best-country",
    icon: <Globe className="h-4 w-4" />,
    label: "🌍 Best Country Finder",
  },
];

export default function AppSidebar({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  onNewChat,
  activeCategoryId,
  onCategoryClick,
  chats,
  activeChatId,
  onSelectChat,
  onLogoClick,
  onDeleteChat,
  onClearAllChats,
}: AppSidebarProps) {
  const pathname = usePathname();
  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navLinkClass = (href: string) =>
    `flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-gray-200 ${
      pathname === href
        ? "bg-gray-200 font-medium text-gray-900"
        : "text-gray-600"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50 transition-transform duration-200 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4 md:hidden">
          <VisaSeekLogo onClick={onLogoClick} />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-200"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-gray-200 p-4">
          <div className="hidden md:block">
            <VisaSeekLogo onClick={onLogoClick} />
          </div>
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-100"
          >
            <Pencil className="h-4 w-4" />
            New Chat
          </button>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">

          <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-gray-500">
            AI TOOLS
          </p>
          <nav className="space-y-0.5 mb-4">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={onClose}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-gray-200 ${
                  pathname === tool.href
                    ? "bg-blue-50 font-medium text-blue-900 border-l-4 border-blue-500 pl-2"
                    : "text-gray-700 border-l-4 border-transparent"
                }`}
              >
                {tool.label}
              </Link>
            ))}
          </nav>

          <p className="mb-2 px-2 text-xs font-semibold tracking-wider text-gray-500">
            IMMIGRATION TOPICS
          </p>
          <nav className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onCategoryClick(cat.id);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-200 ${
                    isActive
                      ? "border-l-4 border-blue-500 bg-blue-50 pl-2 font-medium text-blue-900"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </nav>

          {filteredChats.length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between mb-2 px-2">
                <p className="text-xs font-semibold tracking-wider text-gray-500">
                  RECENT CHATS
                </p>
                {onClearAllChats && (
                  <button
                    type="button"
                    onClick={onClearAllChats}
                    className="text-xs text-red-400 hover:text-red-600 transition"
                    title="Clear all chats"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group mb-0.5 flex items-center rounded-lg transition hover:bg-gray-200 ${
                    activeChatId === chat.id ? "bg-gray-200" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectChat(chat.id);
                      onClose();
                    }}
                    className="flex-1 truncate px-3 py-2 text-left text-sm text-gray-600"
                  >
                    {chat.title}
                  </button>
                  {onDeleteChat && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="mr-2 hidden rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-500 group-hover:block"
                      title="Delete chat"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1 border-t border-gray-200 p-3">
          <Link href="/settings" onClick={onClose} className={navLinkClass("/settings")}>
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link href="/help" onClick={onClose} className={navLinkClass("/help")}>
            <HelpCircle className="h-4 w-4" />
            Help
          </Link>
          <Link href="/pricing" onClick={onClose} className={navLinkClass("/pricing")}>
            <CreditCard className="h-4 w-4" />
            See plans &amp; pricing
          </Link>
        </div>
      </aside>
    </>
  );
}
