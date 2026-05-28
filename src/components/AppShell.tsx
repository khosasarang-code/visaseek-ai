"use client";

import AppNavbar from "@/components/AppNavbar";
import AppSidebar from "@/components/AppSidebar";
import { useAppChats } from "@/hooks/useAppChats";

interface AppShellProps {
  children: React.ReactNode;
  onLogoClick?: () => void;
}

export default function AppShell({ children, onLogoClick }: AppShellProps) {
  const {
    chats,
    searchQuery,
    setSearchQuery,
    sidebarOpen,
    setSidebarOpen,
    hydrated,
    goHome,
    handleNewChat,
    handleCategoryClick,
  } = useAppChats();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Loading...</p>
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
        onCategoryClick={handleCategoryClick}
        chats={chats}
        activeChatId={null}
        onSelectChat={() => goHome()}
        onLogoClick={onLogoClick ?? goHome}
      />
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <AppNavbar
          showMenuButton
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 pt-24">{children}</main>
      </div>
    </div>
  );
}
