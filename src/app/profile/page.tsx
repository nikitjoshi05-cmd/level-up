"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import type { User } from "@/lib/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-900 dark:from-gray-800 dark:via-gray-800/95 dark:to-gray-900 light:from-gray-100 light:via-gray-50 light:to-white p-1 shadow-2xl">
          <div className="relative rounded-3xl bg-gray-900/80 dark:bg-gray-900/80 light:bg-white/80 backdrop-blur-sm p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white dark:text-white light:text-gray-900 mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-lg">
                  @{user.username}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 dark:from-gray-800/90 dark:to-gray-700/90 light:from-white light:to-gray-50 border border-gray-700/50 dark:border-gray-700/50 light:border-gray-200/50 p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Full Name</label>
                <p className="text-white dark:text-white light:text-gray-900 font-medium">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Username</label>
                <p className="text-white dark:text-white light:text-gray-900 font-medium">@{user.username}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Email Address</label>
                <p className="text-white dark:text-white light:text-gray-900 font-medium">{user.emailId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">Phone Number</label>
                <p className="text-white dark:text-white light:text-gray-900 font-medium">{user.phoneNumber}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 dark:from-gray-800/90 dark:to-gray-700/90 light:from-white light:to-gray-50 border border-gray-700/50 dark:border-gray-700/50 light:border-gray-200/50 p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Account Settings
            </h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all">
                Edit Profile
              </button>
              <button className="w-full px-4 py-3 bg-gray-700/50 dark:bg-gray-700/50 light:bg-gray-200/50 text-white dark:text-white light:text-gray-900 font-medium rounded-lg hover:bg-gray-600/50 dark:hover:bg-gray-600/50 light:hover:bg-gray-300/50 transition-all">
                Change Password
              </button>
              <button
                onClick={() => {
                  logoutUser();
                  router.push("/login");
                }}
                className="w-full px-4 py-3 bg-red-600/20 border border-red-500/50 text-red-400 font-medium rounded-lg hover:bg-red-600/30 transition-all"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

