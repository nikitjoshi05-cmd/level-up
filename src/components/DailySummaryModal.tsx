"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPoints: number;
  categoryScores: Record<string, number>;
}

export default function DailySummaryModal({
  isOpen,
  onClose,
  totalPoints,
  categoryScores,
}: DailySummaryModalProps) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/dailySummary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalPoints,
          categoryScores,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSummary(data.summary || "Great effort today! Keep going!");
    } catch (error) {
      console.error("Error:", error);
      setSummary("Great effort today! Keep going!");
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate summary when modal opens
  if (isOpen && !summary && !loading) {
    handleGenerate();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Daily Summary</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Points Display */}
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30">
              <div className="text-center">
                <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {totalPoints}/100
                </p>
                <p className="text-gray-300 text-lg">Points Today</p>
              </div>
            </div>

            {/* AI Summary */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">🤖 AI Analysis</h3>
              {loading ? (
                <div className="p-6 rounded-xl bg-gray-700/50 border border-gray-600/50">
                  <div className="flex gap-2 justify-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              ) : summary ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30"
                >
                  <p className="text-gray-200 leading-relaxed">{summary}</p>
                </motion.div>
              ) : (
                <div className="p-6 rounded-xl bg-gray-700/50 border border-gray-600/50 text-gray-400 text-center">
                  Generating summary...
                </div>
              )}
            </div>

            {/* Category Breakdown */}
            {Object.keys(categoryScores).length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Category Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(categoryScores).map(([name, points]) => (
                    <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                      <span className="text-gray-300 text-sm md:text-base">{name}</span>
                      <span className="text-white font-semibold text-sm md:text-base">{points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium disabled:opacity-50 transition-all"
              >
                {loading ? "Generating..." : "Regenerate Summary"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-all"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

