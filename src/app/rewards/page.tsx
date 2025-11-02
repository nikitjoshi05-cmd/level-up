"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RewardClipArt, GiftIcon, TrophyIcon, SparklesIcon } from "@/components/Icons";
import {
  getRewardData,
  updateRewardData,
  claimReward,
  type RewardData,
  getWeekStart,
} from "@/lib/scoring";

const AVAILABLE_REWARDS = [
  { id: "cheat-meal", name: "Cheat Meal", icon: "meal", description: "Enjoy your favorite meal guilt-free!" },
  { id: "solo-movie", name: "Solo Movie", icon: "movie", description: "Watch a movie by yourself" },
  { id: "small-purchase", name: "Small Purchase", icon: "purchase", description: "Treat yourself to something nice" },
];

function RewardIcon({ type }: { type: string }) {
  switch (type) {
    case "meal":
      return (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      );
    case "movie":
      return (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case "purchase":
      return (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    default:
      return (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2v5m0 0V9a2 2 0 112 2v3m0 0a2 2 0 11-4 0m4 0h-2m-2 0h2m-2 0V9a2 2 0 114 0v1" />
        </svg>
      );
  }
}

export default function Rewards() {
  const [rewardData, setRewardData] = useState<RewardData>({
    weekAverage: 0,
    rewardsUnlocked: [],
    rewardHistory: [],
    weeklyData: [],
  });
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [showRewardSelector, setShowRewardSelector] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string>("");
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  useEffect(() => {
    const data = getRewardData();
    setRewardData(data);
    
    // Check if rewards should be unlocked
    if (data.weekAverage >= 85 && data.rewardsUnlocked.includes("available")) {
      setShowRewardSelector(true);
    }
  }, []);

  useEffect(() => {
    // Refresh reward data periodically
    const interval = setInterval(() => {
      const data = getRewardData();
      setRewardData(data);
      
      if (data.weekAverage >= 85 && data.rewardsUnlocked.includes("available") && !showRewardSelector) {
        setShowUnlockAnimation(true);
        setShowRewardSelector(true);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [showRewardSelector]);

  useEffect(() => {
    // Generate AI recommendation when average >= 85
    if (rewardData.weekAverage >= 85 && !aiRecommendation && !loadingRecommendation) {
      handleGenerateRecommendation();
    }
  }, [rewardData.weekAverage]);

  const handleGenerateRecommendation = async () => {
    if (loadingRecommendation) return;

    setLoadingRecommendation(true);
    try {
      // Get completed habits (simplified)
      const completedHabits = ["Consistent workout routine", "Daily meditation", "Early sleep schedule"];
      
      const response = await fetch("/api/rewardAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekAverage: rewardData.weekAverage,
          completedHabits,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAiRecommendation(data.recommendation || "You've earned a relaxing evening — maybe watch that movie you've been saving!");
    } catch (error) {
      console.error("Error:", error);
      setAiRecommendation("You've earned a relaxing evening — maybe watch that movie you've been saving!");
    } finally {
      setLoadingRecommendation(false);
    }
  };

  const handleClaimReward = (rewardId: string) => {
    claimReward(rewardId);
    setShowRewardSelector(false);
    setShowUnlockAnimation(false);
    const data = getRewardData();
    setRewardData(data);
  };

  const weeklyData = rewardData.weeklyData || [];
  const maxPoints = Math.max(100, ...weeklyData.map((d) => d.points), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Unlock Animation */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowUnlockAnimation(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gradient-to-br from-yellow-600 via-orange-600 to-pink-600 p-12 rounded-3xl shadow-2xl text-center max-w-md mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="mb-4"
              >
                <svg className="w-20 h-20 mx-auto text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2v5m0 0V9a2 2 0 112 2v3m0 0a2 2 0 11-4 0m4 0h-2m-2 0h2m-2 0V9a2 2 0 114 0v1" />
                </svg>
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-2">Reward Unlocked!</h2>
              <p className="text-xl text-white/90 mb-4">
                Your 7-day average is {rewardData.weekAverage.toFixed(1)} points!
              </p>
              <p className="text-lg text-white/80">Choose your reward below!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Selector Modal */}
      <AnimatePresence>
        {showRewardSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRewardSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-white mb-6 text-center">Choose Your Reward</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {AVAILABLE_REWARDS.map((reward) => (
                  <motion.button
                    key={reward.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleClaimReward(reward.id)}
                    className="p-6 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600 hover:border-yellow-500 transition-all"
                  >
                    <div className="mb-3 text-blue-400"><RewardIcon type={reward.icon} /></div>
                    <h3 className="text-xl font-bold text-white mb-2">{reward.name}</h3>
                    <p className="text-sm text-gray-400">{reward.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-yellow-500/20 border border-pink-500/30">
                  <GiftIcon />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Rewards
                </h1>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                Unlock amazing rewards by maintaining a 7-day average of 85+ points!
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <TrophyIcon />
                    <span className="text-yellow-400 font-semibold text-2xl">
                      {rewardData.weekAverage.toFixed(1)}
                    </span>
                    <span className="text-gray-400">7-day avg</span>
                  </div>
                  {rewardData.weekAverage >= 85 && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                      <span className="text-green-400 font-medium">✓ Unlocked</span>
                    </div>
                  )}
                </div>
                
                {/* AI Recommendation */}
                {rewardData.weekAverage >= 85 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🤖</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">AI Reward Recommendation</h3>
                        {loadingRecommendation ? (
                          <div className="flex gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        ) : aiRecommendation ? (
                          <p className="text-gray-200 leading-relaxed text-sm md:text-base">{aiRecommendation}</p>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGenerateRecommendation}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium transition-all text-sm md:text-base"
                          >
                            Get AI Recommendation
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="w-full max-w-md h-64 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-yellow-500/10 rounded-2xl blur-3xl" />
                <RewardClipArt />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <SparklesIcon />
          Weekly Progress
        </h2>
        
        {weeklyData.length > 0 ? (
          <div className="space-y-4">
            {/* Chart Bars */}
            <div className="flex items-end justify-between gap-2 h-64">
              {weeklyData.map((entry, index) => {
                const percentage = (entry.points / maxPoints) * 100;
                const date = new Date(entry.date);
                const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                const isToday = entry.date === new Date().toISOString().split("T")[0];
                
                return (
                  <motion.div
                    key={entry.date}
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`flex-1 rounded-t-lg ${
                      isToday
                        ? "bg-gradient-to-t from-yellow-500 to-orange-500"
                        : "bg-gradient-to-t from-blue-500 to-purple-500"
                    } shadow-lg relative group`}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                      {dayName}
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white">
                      {entry.points}
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {entry.points} pts
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No data yet. Complete tasks to see your weekly progress!</p>
          </div>
        )}

        {/* Progress to Unlock */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress to Unlock (85 avg required)</span>
            <span className="text-sm font-bold text-white">
              {Math.min(100, Math.round((rewardData.weekAverage / 85) * 100))}%
            </span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (rewardData.weekAverage / 85) * 100)}%` }}
              transition={{ duration: 1 }}
              className={`h-full rounded-full ${
                rewardData.weekAverage >= 85
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-blue-500 to-purple-600"
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* Available Rewards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 shadow-lg mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Available Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AVAILABLE_REWARDS.map((reward) => {
            const claimed = rewardData.rewardHistory.some(
              (h) => h.reward === reward.id && h.date === new Date().toISOString().split("T")[0]
            );
            return (
              <div
                key={reward.id}
                className={`p-6 rounded-2xl ${
                  claimed
                    ? "bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-2 border-green-500/30"
                    : rewardData.weekAverage >= 85
                    ? "bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-yellow-500/30"
                    : "bg-gray-800/50 border-2 border-gray-700/50 opacity-60"
                }`}
              >
                <div className="text-4xl mb-3">{reward.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{reward.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{reward.description}</p>
                {claimed && (
                  <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                    ✓ Claimed Today
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Reward History */}
      {rewardData.rewardHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Reward History</h2>
          <div className="space-y-3">
            {rewardData.rewardHistory.slice(-10).reverse().map((entry, index) => {
              const reward = AVAILABLE_REWARDS.find((r) => r.id === entry.reward);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-blue-400"><RewardIcon type={reward?.icon || "default"} /></div>
                    <div>
                      <p className="text-white font-medium">{reward?.name || entry.reward}</p>
                      <p className="text-sm text-gray-400">{entry.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
