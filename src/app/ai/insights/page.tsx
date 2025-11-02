"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getStreakData, getLevelData, getRewardData, DEFAULT_CATEGORIES, type DailyProgress } from "@/lib/scoring";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AIInsights() {
  const router = useRouter();
  const [insights, setInsights] = useState<{
    summary: string;
    highlight: string;
    recommendation: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Load and prepare data
    loadInsightsData();
    prepareChartData();
  }, [router]);

  const prepareChartData = () => {
    // Generate last 30 days of sample data (in real app, load from storage)
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      // Generate realistic sample data
      const basePoints = 65 + Math.random() * 30;
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        points: Math.round(basePoints),
        productivity: Math.round(15 + Math.random() * 10),
        fitness: Math.round(12 + Math.random() * 8),
        mindset: Math.round(10 + Math.random() * 10),
      });
    }
    
    setChartData(data);
  };

  const loadInsightsData = async () => {
    setLoading(true);
    
    try {
      const streakData = getStreakData();
      const levelData = getLevelData();
      const rewardData = getRewardData();

      // Calculate trends (simplified)
      const totalDays = 30;
      const averageScore = rewardData.weekAverage || 65;
      
      // Calculate category trends (simplified)
      const categoryTrends: Record<string, number> = {};
      DEFAULT_CATEGORIES.forEach((cat) => {
        categoryTrends[cat.name] = Math.round((Math.random() - 0.5) * 20); // -10 to +10%
      });

      const recentTrend = averageScore > 75 ? "improving" : averageScore > 60 ? "stable" : "declining";

      const response = await fetch("/api/insightsAI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitData: {
            totalDays,
            averageScore,
            categoryTrends,
            recentTrend,
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setInsights(data);
    } catch (error) {
      console.error("Error:", error);
      setInsights({
        summary: "Unable to generate insights. Please check your OpenAI API key.",
        highlight: "Continue tracking your habits for better insights.",
        recommendation: "Make sure to complete tasks daily to see trends.",
      });
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              AI Insights
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Get personalized insights from your 30-day habit data.
          </p>
        </div>
      </motion.div>

      {/* AI Insights Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 md:p-8 shadow-lg mb-6 md:mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">AI Analysis</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadInsightsData}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium disabled:opacity-50 transition-all text-sm md:text-base"
          >
            {loading ? "Analyzing..." : "Refresh Insights"}
          </motion.button>
        </div>
        
        {insights ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30">
              <h3 className="text-lg font-semibold text-white mb-2">Summary</h3>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">{insights.summary}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30">
              <h3 className="text-lg font-semibold text-white mb-2">🌟 Highlight</h3>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">{insights.highlight}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-600/20 to-yellow-600/20 border border-orange-500/30">
              <h3 className="text-lg font-semibold text-white mb-2">💡 Recommendation</h3>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">{insights.recommendation}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">Click "Refresh Insights" to generate AI analysis.</div>
        )}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Points Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-white mb-4">30-Day Points Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Legend wrapperStyle={{ color: "#9CA3AF" }} />
              <Line
                type="monotone"
                dataKey="points"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: "#3B82F6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-white mb-4">Category Average</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
              />
              <Legend wrapperStyle={{ color: "#9CA3AF" }} />
              <Bar dataKey="productivity" fill="#3B82F6" />
              <Bar dataKey="fitness" fill="#10B981" />
              <Bar dataKey="mindset" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

