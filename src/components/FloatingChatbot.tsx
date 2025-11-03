"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

const navigationItems = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: "/",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    color: "from-blue-600 to-cyan-600",
  },
  {
    id: "categories",
    name: "Categories",
    href: "/categories",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    color: "from-green-600 to-emerald-600",
  },
  {
    id: "journal",
    name: "Journal",
    href: "/journal",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "from-pink-600 to-rose-600",
  },
  {
    id: "levels",
    name: "Levels",
    href: "/levels",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: "from-purple-600 to-indigo-600",
  },
  {
    id: "rewards",
    name: "Rewards",
    href: "/rewards",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2v5m0 0V9a2 2 0 112 2v3m0 0a2 2 0 11-4 0m4 0h-2m-2 0h2m-2 0V9a2 2 0 114 0v1" />
      </svg>
    ),
    color: "from-yellow-600 to-orange-600",
  },
  {
    id: "ai-features",
    name: "AI Features",
    href: "/ai",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: "from-purple-600 to-pink-600",
  },
  {
    id: "profile",
    name: "Profile",
    href: "/profile",
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: "from-gray-600 to-gray-800",
  },
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleFeatureClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const getGradientColors = (colorString: string) => {
    if (colorString.includes("blue-600") && colorString.includes("cyan")) {
      return { from: "#2563eb", to: "#06b6d4" };
    }
    if (colorString.includes("green-600") && colorString.includes("emerald")) {
      return { from: "#16a34a", to: "#10b981" };
    }
    if (colorString.includes("pink-600") && colorString.includes("rose")) {
      return { from: "#db2777", to: "#f43f5e" };
    }
    if (colorString.includes("purple-600") && colorString.includes("indigo")) {
      return { from: "#9333ea", to: "#6366f1" };
    }
    if (colorString.includes("yellow-600") && colorString.includes("orange")) {
      return { from: "#ca8a04", to: "#ea580c" };
    }
    if (colorString.includes("gray-600")) {
      return { from: "#4b5563", to: "#1f2937" };
    }
    if (colorString.includes("blue-600") && colorString.includes("purple")) {
      return { from: "#2563eb", to: "#9333ea" };
    }
    if (colorString.includes("green-600") && colorString.includes("blue")) {
      return { from: "#16a34a", to: "#2563eb" };
    }
    if (colorString.includes("purple-600") && colorString.includes("pink")) {
      return { from: "#9333ea", to: "#ec4899" };
    }
    return { from: "#2563eb", to: "#9333ea" };
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "24px",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      {/* All Menu Options - Stacked */}
      <AnimatePresence>
        {isOpen && (
          <>
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
              const colors = getGradientColors(item.color);

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  transition={{
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  onClick={() => handleFeatureClick(item.href)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "50px",
                    background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                    border: isActive ? "2px solid rgba(255, 255, 255, 0.5)" : "none",
                    cursor: "pointer",
                    boxShadow: isActive
                      ? "0 15px 30px -5px rgba(0, 0, 0, 0.4), 0 10px 15px -5px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.2)"
                      : "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05) translateX(4px)";
                    e.currentTarget.style.boxShadow = "0 15px 30px -5px rgba(0, 0, 0, 0.4), 0 10px 15px -5px rgba(0, 0, 0, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    const isActiveItem = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                    e.currentTarget.style.transform = isActiveItem ? "scale(1.05)" : "scale(1)";
                    e.currentTarget.style.boxShadow = isActiveItem
                      ? "0 15px 30px -5px rgba(0, 0, 0, 0.4), 0 10px 15px -5px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.2)"
                      : "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -5px rgba(0, 0, 0, 0.2)";
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                  {isActive && (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "white",
                        marginLeft: "4px",
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2563eb, #9333ea, #ec4899)",
          border: "none",
          cursor: "pointer",
          boxShadow: isOpen
            ? "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
            : "0 20px 25px -5px rgba(37, 99, 235, 0.4), 0 10px 10px -5px rgba(147, 51, 234, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          transition: "all 0.3s ease",
          position: "relative",
        }}
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: "absolute" }}
        >
          {isOpen ? (
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </motion.div>

        {/* Pulse animation when closed */}
        {!isOpen && (
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(59, 130, 246, 0.5)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}
      </motion.button>
    </div>
  );
}
