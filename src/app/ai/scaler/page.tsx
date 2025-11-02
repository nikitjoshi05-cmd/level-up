"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRewardData, DEFAULT_CATEGORIES, type Category } from "@/lib/scoring";

export default function AIScaler() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    adjustments: Record<string, number>;
    message: string;
  } | null>(null);
  const [currentWeights, setCurrentWeights] = useState<Record<string, number>>({});

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Load current weights
    const weights: Record<string, number> = {};
    DEFAULT_CATEGORIES.forEach((category) => {
      weights[category.name] = category.points;
    });
    setCurrentWeights(weights);
  }, [router]);

  const handleAnalyze = async () => {
    if (loading) return;

    setLoading(true);
    try {
      // Get weekly data from rewards
      const rewardData = getRewardData();
      const weeklyData = rewardData.weeklyData || [];

      // Prepare weekly data with category scores (simplified)
      const formattedData = weeklyData.slice(-7).map((entry) => ({
        date: entry.date,
        categories: {
          "Mindset & Focus": Math.random() * 20,
          "Fitness & Health": Math.random() * 20,
          "Productivity & Learning": Math.random() * 25,
          "Communication & Social": Math.random() * 15,
          "Discipline & Habits": Math.random() * 20,
        },
      }));

      const response = await fetch("/api/taskScaler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weeklyData: formattedData,
          currentWeights,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze. Please check your OpenAI API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-900 p-1 shadow-2xl mb-6 md:mb-8"
      >
        <div className="relative rounded-3xl bg-gray-900/80 backdrop-blur-sm p-6 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              AI Task Scaler
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Weekly recalibration: AI adjusts category weights based on your performance.
          </p>
        </div>
      </motion.div>

      {/* Current Weights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 md:p-8 shadow-lg mb-6 md:mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Current Category Weights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(currentWeights).map(([name, weight]) => (
            <div key={name} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
              <p className="text-gray-300 text-sm md:text-base mb-1">{name}</p>
              <p className="text-2xl font-bold text-white">{weight} pts</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Analyze Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-6 md:mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAnalyze}
          disabled={loading}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {loading ? "Analyzing..." : "🤖 Analyze & Recalibrate"}
        </motion.button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 md:p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-white mb-4">AI Recommendations</h2>
            
            {/* Message */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30">
              <p className="text-gray-200 leading-relaxed text-sm md:text-base">{result.message}</p>
            </div>

            {/* Adjustments */}
            {Object.keys(result.adjustments).length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Suggested Adjustments</h3>
                <div className="space-y-3">
                  {Object.entries(result.adjustments).map(([name, newWeight]) => {
                    const oldWeight = currentWeights[name] || 0;
                    const change = newWeight - oldWeight;
                    return (
                      <motion.div
                        key={name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium text-sm md:text-base">{name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${change > 0 ? "text-green-400" : change < 0 ? "text-red-400" : "text-gray-400"}`}>
                              {oldWeight} → {newWeight}
                            </span>
                            {change !== 0 && (
                              <span className={`text-sm font-semibold ${change > 0 ? "text-green-400" : "text-red-400"}`}>
                                {change > 0 ? "+" : ""}{change}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm md:text-base">No adjustments needed. Keep up the great work!</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

