"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";

const aiFeatures = [
  {
    name: "AI Habit Coach",
    description: "Chat with your AI coach for personalized advice and motivation",
    href: "/ai/coach",
    icon: "💬",
    color: "from-blue-600 to-purple-600",
  },
  {
    name: "AI Goal Planner",
    description: "Get personalized micro-habit suggestions based on missed habits",
    href: "/ai/planner",
    icon: "📋",
    color: "from-green-600 to-blue-600",
  },
  {
    name: "AI Insights",
    description: "Analyze your 30-day habit data and get personalized insights",
    href: "/ai/insights",
    icon: "📊",
    color: "from-purple-600 to-pink-600",
  },
  {
    name: "AI Task Scaler",
    description: "Weekly recalibration: Adjust category weights based on performance",
    href: "/ai/scaler",
    icon: "⚖️",
    color: "from-orange-600 to-red-600",
  },
];

export default function AIHub() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
    }
  }, [router]);

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              AI Features Hub
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Explore all AI-powered features designed to help you level up your life.
          </p>
        </div>
      </motion.div>

      {/* AI Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {aiFeatures.map((feature, index) => (
          <Link key={feature.href} href={feature.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-700/90 border border-gray-700/50 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className={`text-5xl mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                  {feature.name}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base mb-4">{feature.description}</p>
                <div className="flex items-center gap-2 text-purple-400 font-medium text-sm md:text-base group-hover:gap-3 transition-all">
                  <span>Explore</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 md:mt-8 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-6 md:p-8 shadow-lg"
      >
        <div className="flex items-start gap-4">
          <div className="text-3xl">🤖</div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">About AI Features</h3>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              All AI features use OpenAI&apos;s GPT-4o-mini model to provide personalized insights and recommendations.
              Make sure to set your <code className="px-2 py-1 rounded bg-gray-800 text-blue-400 text-xs">OPENAI_API_KEY</code> in your environment variables.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

