"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CategoryClipArt, FolderIcon } from "@/components/Icons";
import { MindsetIcon, FitnessIcon, ProductivityIcon, CommunicationIcon, DisciplineIcon, CheckIcon, HalfIcon, XIcon, CircleIcon } from "@/components/CategoryIcons";
import CelebrationModal from "@/components/CelebrationModal";
import DailySummaryModal from "@/components/DailySummaryModal";
import {
  DEFAULT_CATEGORIES,
  type Category,
  type TaskStatus,
  getDailyProgress,
  saveDailyProgress,
  calculateDailyTotal,
  calculateCategoryPoints,
  updateStreak,
  updateLevelData,
  updateRewardData,
  getHardcoreMode,
  setHardcoreMode,
  HARDCORE_NEGATIVE_HABITS,
  type DailyProgress,
} from "@/lib/scoring";
import CircularProgress from "@/components/CircularProgress";

const STATUS_ICONS: Record<Exclude<TaskStatus, null> | "null", React.ReactNode> = {
  full: <CheckIcon />,
  half: <HalfIcon />,
  missed: <XIcon />,
  null: <CircleIcon />,
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  mindset: <MindsetIcon />,
  fitness: <FitnessIcon />,
  productivity: <ProductivityIcon />,
  communication: <CommunicationIcon />,
  discipline: <DisciplineIcon />,
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, Record<string, TaskStatus>>>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showDailySummary, setShowDailySummary] = useState(false);
  const [hardcoreMode, setHardcoreModeState] = useState(false);
  const [negativeHabits, setNegativeHabits] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load saved progress
    const saved = getDailyProgress();
    setTaskStatuses(saved.categories || {});
    setHardcoreModeState(saved.hardcoreMode || getHardcoreMode());
    
    // Calculate initial points
    const points = calculateDailyTotal(DEFAULT_CATEGORIES, saved.categories || {}, saved.hardcoreMode || false, {});
    setTotalPoints(points);
  }, []);

  const updateTaskStatus = (categoryId: string, taskId: string, status: TaskStatus) => {
    const newStatuses = {
      ...taskStatuses,
      [categoryId]: {
        ...(taskStatuses[categoryId] || {}),
        [taskId]: status,
      },
    };
    setTaskStatuses(newStatuses);

    // Calculate new total
    const points = calculateDailyTotal(
      categories,
      newStatuses,
      hardcoreMode,
      negativeHabits
    );
    setTotalPoints(points);

    // Save to localStorage
    const progress: DailyProgress = {
      date: new Date().toISOString().split("T")[0],
      points,
      categories: newStatuses,
      hardcoreMode,
      negativePoints: 0,
      completed: points >= 100,
    };
    saveDailyProgress(progress);

    // Update streaks and levels
    if (points > 0) {
      updateStreak(points);
      updateLevelData(points);
      updateRewardData(points);
    }

    // Show celebration if 100 points
    if (points >= 100 && !progress.completed) {
      setShowCelebration(true);
      progress.completed = true;
      saveDailyProgress(progress);
    }
  };

  const toggleHardcoreMode = () => {
    const newMode = !hardcoreMode;
    setHardcoreModeState(newMode);
    setHardcoreMode(newMode);
    
    const points = calculateDailyTotal(categories, taskStatuses, newMode, negativeHabits);
    setTotalPoints(points);
    
    const progress: DailyProgress = {
      date: new Date().toISOString().split("T")[0],
      points,
      categories: taskStatuses,
      hardcoreMode: newMode,
      negativePoints: 0,
      completed: points >= 100,
    };
    saveDailyProgress(progress);
  };

  const toggleNegativeHabit = (habitId: string) => {
    const newHabits = {
      ...negativeHabits,
      [habitId]: !negativeHabits[habitId],
    };
    setNegativeHabits(newHabits);
    
    const points = calculateDailyTotal(categories, taskStatuses, hardcoreMode, newHabits);
    setTotalPoints(points);
    
    const progress: DailyProgress = {
      date: new Date().toISOString().split("T")[0],
      points,
      categories: taskStatuses,
      hardcoreMode,
      negativePoints: 0,
      completed: points >= 100,
    };
    saveDailyProgress(progress);
  };

  const getCategoryPoints = (category: Category): number => {
    const categoryTasks = taskStatuses[category.id] || {};
    return category.tasks.reduce((total, task) => {
      const status = categoryTasks[task.id] || task.status;
      if (status === "full") return total + task.points;
      if (status === "half") return total + task.points * 0.5;
      return total;
    }, 0);
  };

  const getCategoryColor = (category: Category): string => {
    const colors: Record<string, string> = {
      mindset: "from-purple-500 to-indigo-600",
      fitness: "from-green-500 to-emerald-600",
      productivity: "from-blue-500 to-cyan-600",
      communication: "from-pink-500 to-rose-600",
      discipline: "from-orange-500 to-yellow-600",
    };
    return colors[category.id] || "from-gray-500 to-gray-600";
  };

  const getCategoryScores = (): Record<string, number> => {
    const scores: Record<string, number> = {};
    categories.forEach((category) => {
      scores[category.name] = getCategoryPoints(category);
    });
    return scores;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      <CelebrationModal isOpen={showCelebration} onClose={() => setShowCelebration(false)} />
      <DailySummaryModal
        isOpen={showDailySummary}
        onClose={() => setShowDailySummary(false)}
        totalPoints={totalPoints}
        categoryScores={getCategoryScores()}
      />

      {/* Header with Progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-900 p-1 shadow-2xl mb-8"
      >
        <div className="relative rounded-3xl bg-gray-900/80 backdrop-blur-sm p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30">
                  <FolderIcon />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Categories
                </h1>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Mark tasks as complete to earn points. Each category contributes to your daily total.
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-3 mb-4 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDailySummary(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium transition-all flex items-center gap-2 text-sm md:text-base"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  AI Daily Summary
                </motion.button>
              </div>
              
              {/* Hardcore Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleHardcoreMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  hardcoreMode
                    ? "bg-gradient-to-r from-red-600 to-orange-600 text-white"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {hardcoreMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
                <span>Hardcore Mode {hardcoreMode ? "ON" : "OFF"}</span>
              </motion.button>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-semibold text-gray-300 mb-2">
                  Daily Progress
                </h2>
                <motion.p
                  key={totalPoints}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  {totalPoints.toFixed(1)}/100
                </motion.p>
              </div>
              <CircularProgress progress={Math.round(totalPoints)} max={100} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hardcore Mode Negative Habits */}
      {hardcoreMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 rounded-2xl bg-gradient-to-r from-red-900/30 to-orange-900/30 border-2 border-red-500/30 p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span>⚠️</span> Negative Habits (Reduce Points)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HARDCORE_NEGATIVE_HABITS.map((habit) => (
              <motion.button
                key={habit.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleNegativeHabit(habit.id)}
                className={`p-3 rounded-lg text-left transition-all ${
                  negativeHabits[habit.id]
                    ? "bg-red-600/30 border-2 border-red-500/50"
                    : "bg-gray-800/50 border-2 border-gray-700/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{habit.name}</span>
                  <span className="text-red-400 font-bold">{habit.points} pts</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const categoryPoints = getCategoryPoints(category);
          const colorClass = getCategoryColor(category);
          const isExpanded = expandedCategory === category.id;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 shadow-lg"
            >
              <div
                className="cursor-pointer p-6"
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
              >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClass} shadow-lg text-white`}>
                  {CATEGORY_ICONS[category.icon] || <CircleIcon />}
                </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Points</p>
                    <p className="text-lg font-bold text-white">{categoryPoints.toFixed(1)}/{category.points}</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{category.tasks.length} tasks</span>
                  <span>•</span>
                  <span>{category.points} pts max</span>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-700/50"
                  >
                    <div className="p-6 space-y-3">
                      {category.tasks.map((task) => {
                        const status = (taskStatuses[category.id] || {})[task.id] || null;
                        return (
                          <motion.div
                            key={task.id}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50"
                          >
                            <div className="flex-1">
                              <p className="text-white font-medium">{task.name}</p>
                              <p className="text-xs text-gray-400">{task.points} pts</p>
                            </div>
                            <div className="flex gap-2">
                              {(["full", "half", "missed"] as const).map((taskStatus) => (
                                <motion.button
                                  key={taskStatus}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateTaskStatus(
                                      category.id,
                                      task.id,
                                      status === taskStatus ? null : taskStatus
                                    );
                                  }}
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                                    status === taskStatus
                                      ? "bg-gradient-to-br " + colorClass + " scale-110"
                                      : "bg-gray-700/50 hover:bg-gray-700"
                                  }`}
                                >
                                  {STATUS_ICONS[taskStatus]}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
