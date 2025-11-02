"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LevelClipArt, LayersIcon, TrophyIcon } from "@/components/Icons";
import { getLevelData, type LevelData } from "@/lib/scoring";
import StreaksLevels from "@/components/StreaksLevels";

export default function Levels() {
  const [levelData, setLevelData] = useState<LevelData>({
    totalXP: 0,
    currentLevel: "Novice",
    levelProgress: 0,
    nextLevelXP: 500,
  });

  useEffect(() => {
    const data = getLevelData();
    setLevelData(data);
    
    // Refresh periodically
    const interval = setInterval(() => {
      const newData = getLevelData();
      setLevelData(newData);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const levelMilestones = [
    { xp: 0, name: "Novice", color: "from-gray-500 to-gray-600", icon: "🌱" },
    { xp: 500, name: "Apprentice", color: "from-green-500 to-emerald-600", icon: "📚" },
    { xp: 1000, name: "Master in Motion", color: "from-blue-500 to-cyan-600", icon: "🚀" },
    { xp: 2000, name: "Life Hacker", color: "from-purple-500 to-indigo-600", icon: "👑" },
  ];

  const currentLevelInfo = levelMilestones.find(
    (level) => levelData.totalXP >= level.xp && (level.xp === 2000 || levelData.totalXP < levelMilestones[levelMilestones.indexOf(level) + 1]?.xp)
  ) || levelMilestones[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-900 p-1 shadow-2xl mb-8"
      >
        <div className="relative rounded-3xl bg-gray-900/80 backdrop-blur-sm p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                  <LayersIcon />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  Levels
                </h1>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Level up by earning points and unlock new achievements on your journey!
              </p>
              <div className="flex items-center gap-2 text-yellow-400">
                <TrophyIcon />
                <span className="font-semibold">Current Level: {levelData.currentLevel}</span>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="w-full max-w-md h-64 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl blur-3xl" />
                <LevelClipArt />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Streaks & Levels Component */}
      <StreaksLevels />
    </div>
  );
}

