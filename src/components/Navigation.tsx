"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DashboardIcon, FolderIcon, LayersIcon, GiftIcon } from "./Icons";

function JournalIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function AIIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}
import { getCurrentUser, logoutUser } from "@/lib/auth";
import { useTheme } from "./ThemeProvider";
import type { User } from "@/lib/auth";

const navItems = [
  { name: "Dashboard", href: "/", icon: DashboardIcon },
  { name: "Categories", href: "/categories", icon: FolderIcon },
  { name: "Journal", href: "/journal", icon: JournalIcon },
  { name: "Levels", href: "/levels", icon: LayersIcon },
  { name: "Rewards", href: "/rewards", icon: GiftIcon },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Redirect to login if not authenticated (except on login/register pages)
    if (!currentUser && pathname !== "/login" && pathname !== "/register") {
      router.push("/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  // Don't show nav on login/register pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <nav className="border-b border-gray-800/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800/95 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/95 light:from-gray-50 light:via-gray-50 light:to-gray-100/95 backdrop-blur-md supports-[backdrop-filter]:bg-gray-900/90 dark:supports-[backdrop-filter]:bg-gray-900/90 light:supports-[backdrop-filter]:bg-gray-50/90 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Row - User Name and Theme Toggle */}
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <Link href="/profile" className="text-lg font-semibold text-white dark:text-white light:text-gray-900 hover:text-blue-400 dark:hover:text-blue-400 light:hover:text-blue-600 transition-colors">
              {user.name}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-200/50 border border-gray-700/50 dark:border-gray-700/50 light:border-gray-300/50 hover:bg-gray-700/50 dark:hover:bg-gray-700/50 light:hover:bg-gray-300/50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-300 dark:text-gray-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-gray-900 transition-colors"
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* Center Row - App Title */}
        <div className="flex justify-center py-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Level Up: Life Edition
          </h1>
        </div>

        {/* Bottom Row - Removed navigation links (moved to floating menu) */}
        {/* Navigation items are now accessible via the floating menu button */}
      </div>
    </nav>
  );
}
