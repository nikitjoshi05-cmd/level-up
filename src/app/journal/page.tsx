"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood?: {
    mood: "positive" | "neutral" | "negative";
    emoji: string;
    response: string;
    suggestion: string;
  };
}

export default function Journal() {
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentMood, setCurrentMood] = useState<JournalEntry["mood"] | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Load journal entries from localStorage
    const saved = localStorage.getItem("journal-entries");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEntries(parsed);
      } catch {
        // Ignore parse errors
      }
    }
  }, [router]);

  useEffect(() => {
    // Save entries to localStorage
    if (entries.length > 0) {
      localStorage.setItem("journal-entries", JSON.stringify(entries));
    }
  }, [entries]);

  const handleAnalyze = async () => {
    if (!currentEntry.trim() || analyzing) return;

    setAnalyzing(true);
    try {
      const response = await fetch("/api/moodAnalyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journalEntry: currentEntry.trim() }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setCurrentMood(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze mood. Please check your OpenAI API key.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!currentEntry.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: currentEntry.trim(),
      mood: currentMood || undefined,
    };

    setEntries([newEntry, ...entries]);
    setCurrentEntry("");
    setCurrentMood(null);
  };

  const getMoodColor = (mood?: string) => {
    switch (mood) {
      case "positive":
        return "from-green-500 to-emerald-600";
      case "negative":
        return "from-red-500 to-orange-600";
      default:
        return "from-gray-500 to-gray-600";
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
              Journal
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Write your thoughts and get AI-powered mood analysis and support.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Write Entry */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 md:p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Write Entry</h2>
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="What's on your mind today? Share your thoughts..."
            className="w-full h-64 md:h-80 px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm md:text-base mb-4"
          />
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalyze}
              disabled={analyzing || !currentEntry.trim()}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm md:text-base"
            >
              {analyzing ? "Analyzing..." : "🤖 Analyze Mood"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={!currentEntry.trim()}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm md:text-base"
            >
              Save Entry
            </motion.button>
          </div>
        </motion.div>

        {/* Mood Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 md:p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-4">AI Mood Analysis</h2>
          <AnimatePresence>
            {currentMood ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                {/* Mood Indicator */}
                <div className={`rounded-xl bg-gradient-to-br ${getMoodColor(currentMood.mood)} p-6 text-center`}>
                  <div className="text-6xl mb-2">{currentMood.emoji}</div>
                  <p className="text-xl font-bold text-white capitalize">{currentMood.mood} Mood</p>
                </div>

                {/* Response */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                  <h3 className="text-lg font-semibold text-white mb-2">AI Response</h3>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed">{currentMood.response}</p>
                </div>

                {/* Suggestion */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30">
                  <h3 className="text-lg font-semibold text-white mb-2">💡 Suggestion</h3>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed">{currentMood.suggestion}</p>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-64 md:h-80 text-gray-400 text-center">
                <div>
                  <p className="text-lg mb-2">Write an entry and click</p>
                  <p className="text-2xl mb-4">"🤖 Analyze Mood"</p>
                  <p className="text-sm">to get AI-powered insights</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Journal Entries History */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 md:mt-8 rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 md:p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Journal History</h2>
          <div className="space-y-4">
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 md:p-6 rounded-xl bg-gray-800/50 border border-gray-700/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm text-gray-400">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {entry.mood && (
                    <span className="text-2xl">{entry.mood.emoji}</span>
                  )}
                </div>
                <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-3 whitespace-pre-wrap">{entry.content}</p>
                {entry.mood && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50">
                    <p className="text-sm text-gray-400 italic">{entry.mood.response}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

