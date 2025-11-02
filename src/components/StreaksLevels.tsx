"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getStreakData,
  updateStreak,
  getStreakTitle,
  getLevelData,
  updateLevelData,
  type StreakData,
  type LevelData,
} from "@/lib/scoring";
import { TrophyIcon, SparklesIcon } from "./Icons";

export default function StreaksLevels() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    streakHistory: [],
  });
  const [levelData, setLevelData] = useState<LevelData>({
    totalXP: 0,
    currentLevel: "Novice",
    levelProgress: 0,
    nextLevelXP: 500,
  });

  useEffect(() => {
    const streak = getStreakData();
    const level = getLevelData();
    setStreakData(streak);
    setLevelData(level);
  }, []);

  const streakTitle = getStreakTitle(streakData.currentStreak);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "seedling":
        return (
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        );
      case "book":
        return (
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case "rocket":
        return (
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "crown":
        return (
          <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getLevelInfo = (level: string) => {
    const info: Record<string, { color: string; icon: string }> = {
      Novice: { color: "from-gray-500 to-gray-600", icon: "seedling" },
      Apprentice: { color: "from-green-500 to-emerald-600", icon: "book" },
      "Master in Motion": { color: "from-blue-500 to-cyan-600", icon: "rocket" },
      "Life Hacker": { color: "from-purple-500 to-indigo-600", icon: "crown" },
    };
    return info[level] || info.Novice;
  };

  const levelInfo = getLevelInfo(levelData.currentLevel);

  return (
    <div className="space-y-6">
      {/* Streaks Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
            <TrophyIcon />
          </div>
          <h2 className="text-2xl font-bold text-white">Streaks & Achievements</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-4">
            <p className="text-sm text-gray-400 mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-yellow-400">{streakData.currentStreak}</p>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 p-4">
            <p className="text-sm text-gray-400 mb-1">Longest Streak</p>
            <p className="text-3xl font-bold text-purple-400">{streakData.longestStreak}</p>
            <p className="text-xs text-gray-500 mt-1">days</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 p-4">
            <p className="text-sm text-gray-400 mb-1">Streak Title</p>
            <p className="text-lg font-bold text-blue-400">{streakTitle.title}</p>
            {streakTitle.bonus > 0 && (
              <p className="text-xs text-green-400 mt-1">+{streakTitle.bonus} bonus pts</p>
            )}
          </div>
        </div>

        {/* Streak Milestones */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Streak Milestones</h3>
          {[
            { days: 3, title: "Starter", bonus: 5 },
            { days: 7, title: "Disciplined Rookie", bonus: 0 },
            { days: 15, title: "Momentum Master", bonus: 0 },
            { days: 30, title: "Habitual Legend", bonus: 0 },
          ].map((milestone) => {
            const achieved = streakData.currentStreak >= milestone.days;
            return (
              <div
                key={milestone.days}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  achieved
                    ? "bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30"
                    : "bg-gray-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {achieved ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <div>
                    <p className="text-white font-medium">{milestone.title}</p>
                    <p className="text-xs text-gray-400">{milestone.days} days</p>
                  </div>
                </div>
                {milestone.bonus > 0 && (
                  <span className="text-green-400 text-sm font-medium">+{milestone.bonus} pts</span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Levels Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <SparklesIcon />
          </div>
          <h2 className="text-2xl font-bold text-white">Level Progress</h2>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {getIcon(levelInfo.icon)}
              <div>
                <p className="text-xl font-bold text-white dark:text-white light:text-gray-900">{levelData.currentLevel}</p>
                <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                  {levelData.totalXP.toLocaleString()} / {levelData.nextLevelXP === Infinity ? "∞" : levelData.nextLevelXP.toLocaleString()} XP
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {levelData.totalXP.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">Total XP</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelData.levelProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${levelInfo.color} rounded-full shadow-lg`}
            />
          </div>
        </div>

        {/* Level Milestones */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { xp: 0, name: "Novice", color: "from-gray-500 to-gray-600", icon: "seedling" },
            { xp: 500, name: "Apprentice", color: "from-green-500 to-emerald-600", icon: "book" },
            { xp: 1000, name: "Master in Motion", color: "from-blue-500 to-cyan-600", icon: "rocket" },
            { xp: 2000, name: "Life Hacker", color: "from-purple-500 to-indigo-600", icon: "crown" },
          ].map((level) => {
            const achieved = levelData.totalXP >= level.xp;
            return (
              <div
                key={level.xp}
                className={`p-3 rounded-lg text-center flex flex-col items-center gap-2 ${
                  achieved
                    ? `bg-gradient-to-br ${level.color} border border-transparent text-white`
                    : "bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100/50 border border-gray-700/50 dark:border-gray-700/50 light:border-gray-200/50"
                }`}
              >
                <div className={achieved ? "text-white" : "text-gray-400 dark:text-gray-400 light:text-gray-600"}>
                  {getIcon(level.icon)}
                </div>
                <p className={`text-sm font-medium ${achieved ? "text-white" : "text-gray-400 dark:text-gray-400 light:text-gray-600"}`}>
                  {level.name}
                </p>
                <p className={`text-xs ${achieved ? "text-white/80" : "text-gray-500 dark:text-gray-500 light:text-gray-500"}`}>
                  {level.xp.toLocaleString()} XP
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

