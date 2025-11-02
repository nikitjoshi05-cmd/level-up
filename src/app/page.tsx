"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CircularProgress from "@/components/CircularProgress";
import StreaksLevels from "@/components/StreaksLevels";
import { getDailyProgress } from "@/lib/scoring";
import { ProgressClipArt, TrendingUpIcon, TargetIcon, SparklesIcon } from "@/components/Icons";
import { getCurrentUser } from "@/lib/auth";

export default function Dashboard() {
  const router = useRouter();
  const [progress, setProgress] = useState({ points: 0, date: "" });

  useEffect(() => {
    // Check authentication
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const loadProgress = () => {
      const daily = getDailyProgress();
      setProgress({ points: daily.points, date: daily.date });
    };
    
    loadProgress();
    
    // Refresh progress periodically
    const interval = setInterval(loadProgress, 2000);
    return () => clearInterval(interval);
  }, [router]);

  // Navigation handled by Link component

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-900 p-1 shadow-2xl mb-8">
        <div className="relative rounded-3xl bg-gray-900/80 backdrop-blur-sm p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Progress */}
            <div className="flex flex-col items-center md:items-start gap-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                  <TargetIcon />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Daily Progress
                </h1>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-300 mb-6">
                  {progress.points}/100 Points
                </h2>
                <CircularProgress progress={progress.points} max={100} />
              </div>
              <Link
                href="/categories"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 inline-block"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <SparklesIcon />
                  Start Today&apos;s Routine
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>
            
            {/* Right side - Clipart */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-full max-w-md h-80 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-3xl" />
                <ProgressClipArt />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Streaks & Levels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <StreaksLevels />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <TrendingUpIcon />
              </div>
              <h3 className="text-lg font-semibold text-white">Current Streak</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400 mb-1">0</p>
            <p className="text-sm text-gray-400">Days in a row</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <TargetIcon />
              </div>
              <h3 className="text-lg font-semibold text-white">Today&apos;s Goal</h3>
            </div>
            <p className="text-3xl font-bold text-purple-400 mb-1">100</p>
            <p className="text-sm text-gray-400">Points target</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600/20 to-pink-800/20 border border-pink-500/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-pink-500/20">
                <SparklesIcon />
              </div>
              <h3 className="text-lg font-semibold text-white">Total Points</h3>
            </div>
            <p className="text-3xl font-bold text-pink-400 mb-1">0</p>
            <p className="text-sm text-gray-400">All time</p>
          </div>
        </div>
      </div>

      {/* Motivational Quote Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800/80 to-gray-700/80 border border-gray-700/50 p-8 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Ready to Level Up?</h3>
              <p className="text-gray-300 leading-relaxed">
                Every journey begins with a single step. Start your routine today and watch your progress grow!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
