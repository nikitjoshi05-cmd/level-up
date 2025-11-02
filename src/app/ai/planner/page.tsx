"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDailyProgress, DEFAULT_CATEGORIES, type Category, type DailyProgress } from "@/lib/scoring";

interface MissedHabit {
  name: string;
  days: number;
}

export default function AIPlanner() {
  const router = useRouter();
  const [missedHabits, setMissedHabits] = useState<MissedHabit[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSuggestions, setSavedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Load saved suggestions
    const saved = localStorage.getItem("ai-planner-suggestions");
    if (saved) {
      try {
        setSavedSuggestions(JSON.parse(saved));
      } catch {
        // Ignore
      }
    }

    // Analyze missed habits from last 7 days
    analyzeMissedHabits();
  }, [router]);

  const analyzeMissedHabits = () => {
    // Get progress from last 7 days (simplified - using today's data)
    const today = new Date();
    const progress: DailyProgress = getDailyProgress();
    
    // Find tasks that are marked as "missed"
    const missed: MissedHabit[] = [];
    
    DEFAULT_CATEGORIES.forEach((category) => {
      const categoryTasks = progress.categories[category.id] || {};
      
      category.tasks.forEach((task) => {
        const status = categoryTasks[task.id];
        if (status === "missed") {
          // Count consecutive missed days (simplified)
          const existing = missed.find((h) => h.name === task.name);
          if (existing) {
            existing.days += 1;
          } else {
            missed.push({ name: task.name, days: 1 });
          }
        }
      });
    });

    // If no missed habits, create sample data
    if (missed.length === 0) {
      missed.push(
        { name: "Sleep early (before 11 PM)", days: 4 },
        { name: "Meditation (10 min)", days: 2 }
      );
    }

    setMissedHabits(missed);
  };

  const handleGenerate = async () => {
    if (missedHabits.length === 0 || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/taskPlanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missedHabits }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSuggestions(data.suggestions || []);
      // Save suggestions
      localStorage.setItem("ai-planner-suggestions", JSON.stringify(data.suggestions || []));
      setSavedSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate suggestions. Please check your OpenAI API key.");
    } finally {
      setLoading(false);
    }
  };

  const displaySuggestions = suggestions.length > 0 ? suggestions : savedSuggestions;

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
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Goal Planner
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Get personalized micro-habit suggestions based on your missed habits.
          </p>
        </div>
      </motion.div>

      {/* Missed Habits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-red-900/30 to-orange-900/30 border-2 border-red-500/30 p-6 md:p-8 mb-6 md:mb-8"
      >
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>⚠️</span> Missed Habits
        </h2>
        {missedHabits.length > 0 ? (
          <div className="space-y-3">
            {missedHabits.map((habit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium text-sm md:text-base">{habit.name}</span>
                  <span className="text-red-400 font-bold text-sm md:text-base">Missed {habit.days} days</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm md:text-base">No missed habits detected. Great job!</p>
        )}
      </motion.div>

      {/* Generate Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-6 md:mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGenerate}
          disabled={loading || missedHabits.length === 0}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {loading ? "Generating..." : "Generate AI Suggestions"}
        </motion.button>
      </motion.div>

      {/* Suggestions */}
      <AnimatePresence>
        {displaySuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 md:p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>💡</span> AI Suggestions
            </h2>
            <div className="space-y-4">
              {displaySuggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 md:p-6 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30"
                >
                  <p className="text-gray-100 text-sm md:text-base leading-relaxed">{suggestion}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

